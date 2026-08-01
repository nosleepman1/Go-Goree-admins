import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NavLink, useLocation } from "react-router";
import {
  LayoutDashboard, Ship, Ticket, Users, UserCheck, Anchor, Tag,
  CreditCard, Wallet, FileCheck, Bell, BarChart3, FileText, Settings,
  HelpCircle, LogOut, ChevronDown, ChevronRight, ChevronLeft,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/WhatsApp_Image_2026-07-12_at_00.36.06.jpeg";
import { NAV, NavItem } from "@/app/lib/navigation";
import { cn } from "@/app/components/layout/common";
import { useAuthStore } from "@/app/store/authStore";
import { pathForPage } from "@/app/lib/routes";

// ── Icon map ──────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  dashboard:    LayoutDashboard,
  voyages:      Ship,
  billets:      Ticket,
  passagers:    Users,
  controlleurs: UserCheck,
  chaloupes:    Anchor,
  tarifs:       Tag,
  paiements:    CreditCard,
  wallet:       Wallet,
  residents:    FileCheck,
  notifs:       Bell,
  stats:        BarChart3,
  rapports:     FileText,
  params:       Settings,
  support:      HelpCircle,
};

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  ocean:        "#0B5ED7",
  sidebarActive:"linear-gradient(135deg, #4EA8DE, #0B5ED7)",
  sidebarBorder:"#C2D3EE",
};

// ── Props ─────────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuthStore();
  const [expanded, setExpanded] = useState<string[]>(["voyages", "stats"]);
  const [collapsed, setCollapsed] = useState(false);

  const w = collapsed ? 64 : 240;

  const toggleSection = (id: string) =>
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex flex-col h-screen overflow-hidden border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0"
      style={{ width: w }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="size-9 rounded-lg overflow-hidden shrink-0 shadow-sm">
          <ImageWithFallback src={logoImg} alt="Go Gorée" className="w-full h-full object-cover" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="font-bold text-slate-800 dark:text-slate-100 text-sm whitespace-nowrap leading-tight">GO GORÉE</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">Administration</div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(c => !c)}
          className={cn(
            "ml-auto size-6 rounded-md flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0",
            collapsed && "mx-auto"
          )}
          title={collapsed ? "Développer" : "Réduire"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5" style={{ scrollbarWidth: "none" }}>
        {NAV.map((item: NavItem) => {
          const Icon = ICON_MAP[item.id] ?? LayoutDashboard;
          const childPaths = item.children?.map(c => pathForPage(c.page)) ?? [];
          const isParentActive =
            childPaths.some(p => p === pathname) || childPaths.some(p => pathname.startsWith(p + "/"));
          const isExpanded = expanded.includes(item.id);
          const open = isExpanded || isParentActive;

          if (!item.children && item.page) {
            // Leaf item (Dashboard)
            return (
              <NavLink
                key={item.id}
                to={pathForPage(item.page)}
                end
                className={({ isActive }) => cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-semibold transition-all",
                  isActive
                    ? "text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100"
                )}
                style={({ isActive }) => (isActive ? { background: C.sidebarActive } : undefined)}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={16} className="shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          }

          // Parent item with children
          const totalBadge = item.children!.reduce((s, c) => s + (c.badge ?? 0), 0);

          return (
            <div key={item.id}>
              <button
                onClick={() => !collapsed && toggleSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-semibold transition-all",
                  isParentActive && !open
                    ? "text-white shadow-sm"
                    : isParentActive
                      ? "text-slate-800 dark:text-slate-100 bg-blue-50 dark:bg-blue-900/30"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100"
                )}
                style={isParentActive && !open ? { background: C.sidebarActive } : undefined}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={16} className="shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && totalBadge > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                    style={{ background: C.sidebarActive }}>
                    {totalBadge}
                  </span>
                )}
                {!collapsed && (
                  <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}>
                    <ChevronRight size={13} className="text-slate-400" />
                  </motion.div>
                )}
              </button>

              <AnimatePresence>
                {open && !collapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden ml-5 mt-0.5 mb-1 border-l-2 pl-3"
                    style={{ borderColor: C.sidebarBorder }}
                  >
                    {item.children!.map(child => {
                      const childPath = pathForPage(child.page);
                      return (
                        <NavLink
                          key={child.page}
                          to={childPath}
                          end
                          className={({ isActive }) => cn(
                            "w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-all my-0.5",
                            isActive
                              ? "text-white shadow-sm"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                          )}
                          style={({ isActive }) => (isActive ? { background: C.sidebarActive } : undefined)}
                        >
                          <span className="text-left">{child.label}</span>
                          {child.badge && pathname !== childPath && (
                            <span className="text-[10px] font-bold px-1 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                              {child.badge}
                            </span>
                          )}
                        </NavLink>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* ── Footer / Logout ── */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-3">
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Se déconnecter" : undefined}
        >
          <LogOut size={16} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Se déconnecter
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
