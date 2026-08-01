import React from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell, AreaChart, Area, PieChart as RPieChart, Pie, Legend } from "recharts";
import { KPICard, ChartCard, PageHeader, Btn, Table, Card, OccBar , Loader, EmptyState } from "@/app/components/ui/Shared";
import { Badge, StatusBadge, cn, C } from "@/app/components/layout/common";
import { RefreshCw, FileText, Ticket, Banknote, Ship, Users, Scan, Wallet as WalletIcon, FileCheck, BarChart3 } from "lucide-react";
import { motion } from "motion/react";
import { useDashboard } from "@/app/hooks/dashboard/useDashboard";

export default function DashboardPage() {
  const { ticketData, monthlyData, pieData, voyages, transactions, overview = {}, isLoading, isError } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      {isError && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 px-6 py-4 text-sm font-medium text-amber-700 dark:text-amber-400">
          Données indisponibles — Impossible de charger les données du tableau de bord.
        </div>
      )}
      {isLoading ? (
        <div className="space-y-6 animate-pulse mt-4">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-2">
              <div className="h-6 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              <div className="h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
            </div>
            <div className="h-10 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between">
                  <div className="space-y-3 w-full">
                    <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-700"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5">
              <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-8"></div>
              <div className="h-64 bg-slate-100 dark:bg-slate-700/50 rounded-xl"></div>
            </div>
            <div className="h-96 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5">
              <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-8"></div>
              <div className="flex justify-center items-center h-64">
                <div className="size-48 rounded-full border-[16px] border-slate-100 dark:border-slate-700"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Bonjour, Administrateur</h1>
          <p className="text-sm text-slate-500 mt-0.5">Dakar ↔ Île de Gorée</p>
        </div>
        <div className="flex gap-2">
          <Btn label="Actualiser" icon={RefreshCw} variant="secondary" onClick={() => window.location.reload()} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Billets vendus"
          value={Number(overview.billets_vendus_aujourdhui ?? 0).toLocaleString("fr-FR")}
          sub="aujourd'hui"
          icon={Ticket}
          color={C.ocean}
        />
        <KPICard
          title="Recettes du jour"
          value={`${Number(overview.recettes_aujourdhui ?? 0).toLocaleString("fr-FR")} FCFA`}
          sub="en cours"
          icon={Banknote}
          color={C.teal}
        />
        <KPICard
          title="Voyages effectués"
          value={`${Number(overview.voyages_effectues_aujourdhui ?? 0)} / ${Number(overview.voyages_total_aujourdhui ?? 0)}`}
          sub="ce jour"
          icon={Ship}
          color={C.green}
        />
        <KPICard
          title="Passagers embarqués"
          value={Number(overview.passagers_embarques_aujourdhui ?? 0).toLocaleString("fr-FR")}
          sub="aujourd'hui"
          icon={Users}
          color={C.amber}
        />
        <KPICard
          title="QR validés"
          value={Number(overview.qr_valides_aujourdhui ?? 0).toLocaleString("fr-FR")}
          sub={`sur ${Number(overview.passagers_embarques_aujourdhui ?? 0)} embarqués`}
          icon={Scan}
          trend={overview.passagers_embarques_aujourdhui ? { val: `${((Number(overview.qr_valides_aujourdhui ?? 0) / overview.passagers_embarques_aujourdhui) * 100).toFixed(1)}%`, up: true } : undefined}
          color={C.purple}
        />
        <KPICard
          title="Solde Wallet"
          value={`${Number(overview.solde_global_wallet ?? 0).toLocaleString("fr-FR")} FCFA`}
          sub="total passagers"
          icon={WalletIcon}
          color={C.ocean}
        />
        <KPICard
          title="Demandes résidents"
          value={Number(overview.demandes_en_attente ?? 0).toString()}
          sub="en attente"
          icon={FileCheck}
          color={C.amber}
        />
        <KPICard
          title="Taux d'occupation"
          value={`${Number(overview.avg_occupation_aujourdhui ?? 0)}%`}
          sub="moyenne du jour"
          icon={BarChart3}
          color={C.teal}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <ChartCard title="Billets vendus — 7 derniers jours">
            {ticketData.length === 0 ? <EmptyState className="h-[210px]" /> : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={ticketData}>
                <CartesianGrid key="cg" strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis key="x" dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis key="y" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip key="tt" contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar key="bar" dataKey="billets" name="Billets" radius={[4, 4, 0, 0]}>
                  {ticketData.map((_, i) => <Cell key={`c-${i}`} fill={i === 5 || i === 6 ? C.teal : C.ocean} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
        <ChartCard title="Passagers par catégorie" subtitle="Ce mois">
          {pieData.length === 0 ? <EmptyState className="h-[240px]" /> : (
          <ResponsiveContainer width="100%" height={240}>
            <RPieChart>
              <Pie key="pie" data={pieData} cx="50%" cy="44%" innerRadius={48} outerRadius={78} paddingAngle={3} dataKey="value">
                {pieData.map((e) => <Cell key={`cell-${e.name}`} fill={e.color} />)}
              </Pie>
              <Tooltip key="tt" formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend key="lg" verticalAlign="bottom" iconSize={10} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            </RPieChart>
          </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Voyages du jour — {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</h3>
        </div>
        <Table
          emptyMessage="Aucun voyage pour aujourd'hui"
          cols={["ID", "Départ", "Arrivée", "Chaloupe", "Places", "Vendus", "Occupation", "Statut", "Recette"]}
          rows={voyages.map(v => [
            // UUID complet illisible dans une colonne : on montre le préfixe.
            <span className="font-mono text-xs text-slate-500" title={v.id}>{String(v.id).slice(0, 8)}</span>,
            <span className="font-mono font-bold text-slate-900">{v.heure_depart || "—"}</span>,
            <span className="font-mono">{v.heure_arrivee || "—"}</span>, v.chaloupe,
            <span className="font-mono">{v.places}</span>,
            <span className="font-mono">{v.vendus}</span>,
            <OccBar val={v.vendus === 0 ? 0 : Math.round((v.vendus / v.places) * 100)} />,
            <StatusBadge statut={v.statut} />,
            <span className="font-mono text-xs">{v.recette}</span>,
          ])}
        />
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Recettes mensuelles 2026" subtitle="En millions FCFA">
          {monthlyData.length === 0 ? <EmptyState className="h-[160px]" /> : (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="gradDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.ocean} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.ocean} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="cg" strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis key="x" dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis key="y" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip key="tt" formatter={(v: number) => `${(v / 1000000).toFixed(1)}M FCFA`} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Area key="area" type="monotone" dataKey="recettes" stroke={C.ocean} fill="url(#gradDash)" strokeWidth={2.5} name="Recettes" />
            </AreaChart>
          </ResponsiveContainer>
          )}
        </ChartCard>
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Dernières transactions</h3>
          <div className="space-y-2">
            {transactions.length === 0 && <EmptyState message="Aucune transaction récente" />}
            {transactions.slice(0, 5).map((t, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: C.sidebarActive }}>
                    {t.passager[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">{t.passager}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{t.methode} · {t.date.split(", ")[1]}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-semibold text-slate-900 dark:text-slate-100">{t.montant}</div>
                  <StatusBadge statut={t.statut} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
        </>
      )}
    </div>
  );
}
