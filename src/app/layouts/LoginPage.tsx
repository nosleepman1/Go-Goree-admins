import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/WhatsApp_Image_2026-07-12_at_00.36.06.jpeg";
import { useAuthStore } from "@/app/store/authStore";

export default function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Veuillez remplir tous les champs.");
    setLoading(true);
    try {
      await login(email, password);
      const dest = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";
      navigate(dest, { replace: true });
    } catch (err) {
      if (err instanceof Error && err.message === "ACCESS_DENIED") {
        setError("Accès réservé aux administrateurs.");
      } else {
        setError("Échec de la connexion. Vérifiez vos identifiants.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* ── Left brand panel ── */}
      <div
        className="hidden md:flex flex-col justify-between w-1/2 p-12 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1F44 0%, #0B5ED7 55%, #4EA8DE 100%)" }}
      >
        <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-8 right-28 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />

        <div className="flex items-center gap-3 relative">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-white p-1">
            <ImageWithFallback src={logoImg} alt="Go Gorée" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">GO GORÉE</div>
            <div className="text-xs text-white/70">Système d'administration</div>
          </div>
        </div>

        <div className="space-y-5 relative">
          <h1 className="text-4xl font-bold leading-tight">
            Gérez la liaison
            <br />
            <span style={{ color: "#4EA8DE" }}>Dakar ↔ Gorée</span>
            <br />
            en toute simplicité
          </h1>
          <p className="text-white/80 max-w-md">
            Plateforme d'administration complète pour la gestion des voyages, billets, passagers et opérations de la liaison maritime vers l'Île de Gorée.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 relative">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl font-bold font-mono">12 280</div>
            <div className="text-xs text-white/70 mt-1">Billets ce mois</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl font-bold font-mono">94%</div>
            <div className="text-xs text-white/70 mt-1">Taux occupation</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl font-bold font-mono">61,4M FCFA</div>
            <div className="text-xs text-white/70 mt-1">Recettes juillet</div>
          </div>
        </div>
      </div>

      {/* ── Right login form ── */}
      <div className="flex flex-1 items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Connexion</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Accédez au tableau de bord administrateur</p>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adresse email</label>
          <div className="relative mb-4">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@gogoree.sn"
              className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0B5ED7]"
            />
          </div>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mot de passe</label>
          <div className="relative mb-4">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0B5ED7]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between mb-5">
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="rounded border-slate-300 text-[#0B5ED7] focus:ring-[#0B5ED7]"
              />
              Se souvenir de moi
            </label>
            <button type="button" className="text-sm font-medium" style={{ color: "#0B5ED7" }}>
              Mot de passe oublié ?
            </button>
          </div>

          {error && <div className="text-xs text-red-600 mb-3">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #4EA8DE, #0B5ED7)" }}
          >
            <ShieldCheck size={18} />
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <p className="text-center text-xs text-slate-400 mt-6">
            Accès réservé au personnel autorisé · Go Gorée © 2026
          </p>
        </form>
      </div>
    </div>
  );
}
