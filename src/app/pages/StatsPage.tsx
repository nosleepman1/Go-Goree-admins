import { PageHeader, Btn, Card, ChartCard, Table, Loader, EmptyState } from "@/app/components/ui/Shared";
import { C, StatusBadge } from "@/app/components/layout/common";
import { Ticket, Banknote, Activity, Star, Download } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line, PieChart as RPieChart, Pie, Cell, Legend, Bar } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "@/app/services/analytics/analyticsService";

/** Valeur affichée tant que l'API n'a rien fourni — jamais un chiffre inventé. */
const ND = "—";

export default function StatsPage({ sub }: { sub: string }) {
  const { data: metrics, isLoading, isError } = useQuery({
    queryKey: ["dashboard", "analytics"],
    queryFn: getDashboardMetrics,
    staleTime: 60000,
  });

  // Aucun repli sur des données de démonstration : séries vides et KPI à « — »
  // tant que l'API n'a pas répondu.
  const monthlyData = metrics?.monthly_data ?? [];
  const pieData = metrics?.visitor_categories ?? [];
  const paiementData = metrics?.payment_methods ?? [];
  const hourlyData = metrics?.hourly_boardings ?? [];
  const chaloupesData = metrics?.chaloupes_occupations ?? [];
  const validation = metrics?.validation_qr ?? null;
  const controleurs = validation?.par_controleur ?? [];

  const feedback = <Loader isLoading={isLoading} isError={isError} />;

  if (sub === "billets" || sub === "recettes") {
    return (
      <div className="p-6">
        <PageHeader title={sub === "billets" ? "Statistiques billets" : "Statistiques recettes"} subtitle="Analyse par mois — 2026"
          actions={<Btn label="Exporter" icon={Download} variant="secondary" />} />
        {feedback}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {(sub === "billets"
            ? [
                ["Total billets (ytd)", metrics?.overview?.total_tickets_ytd?.toLocaleString("fr-FR") ?? ND, C.ocean],
                ["Mois record", metrics?.overview?.record_month ? metrics.overview.record_month.split(":")[0] : ND, C.teal],
                ["Moyenne/mois", metrics?.overview?.average_tickets_per_month != null ? Math.round(metrics.overview.average_tickets_per_month).toLocaleString("fr-FR") : ND, C.green],
                ["Tendance", metrics?.overview?.tendance_percentage ?? ND, C.amber]
              ]
            : [
                ["Recettes totales (ytd)", metrics?.overview?.total_sales_ytd != null ? `${(metrics.overview.total_sales_ytd / 1000000).toFixed(1)}M FCFA` : ND, C.ocean],
                ["Mois record", metrics?.overview?.record_month ? metrics.overview.record_month.split("FCFA")[0] : ND, C.teal],
                ["Moyenne/mois", metrics?.overview?.average_sales_per_month != null ? `${(metrics.overview.average_sales_per_month / 1000000).toFixed(1)}M FCFA` : ND, C.green],
                ["Croissance", metrics?.overview?.tendance_percentage ?? ND, C.green]
              ]
          ).map(([l, v, c]) => (
            <Card key={l as string} className="text-center py-4">
              <div className="text-xl font-bold font-mono" style={{ color: c as string }}>{v as string}</div>
              <div className="text-xs text-slate-500 mt-1">{l as string}</div>
            </Card>
          ))}
        </div>
        <ChartCard title={sub === "billets" ? "Billets vendus par mois — 2026" : "Recettes mensuelles (FCFA) — 2026"}>
          {monthlyData.length === 0 ? <EmptyState className="h-[250px]" /> : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="gradStats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sub === "billets" ? C.ocean : C.teal} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={sub === "billets" ? C.ocean : C.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="cg" strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis key="x" dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis key="y" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip key="tt" contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Area key="area" type="monotone" dataKey={sub === "billets" ? "billets" : "recettes"}
                stroke={sub === "billets" ? C.ocean : C.teal} fill="url(#gradStats)" strokeWidth={2.5}
                name={sub === "billets" ? "Billets" : "Recettes (FCFA)"} />
            </AreaChart>
          </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    );
  }

  if (sub === "categories" || sub === "paiements") {
    const data = sub === "categories" ? pieData : paiementData;
    return (
      <div className="p-6">
        {feedback}
        <PageHeader title={sub === "categories" ? "Catégories de voyageurs" : "Répartition des paiements"} subtitle="Par mois — cumulé 2026" />
        <div className="grid grid-cols-2 gap-6">
          <ChartCard title={sub === "categories" ? "Répartition par type" : "Modes de paiement"} subtitle="Ce mois">
            {data.length === 0 ? <EmptyState className="h-[280px]" /> : (
            <ResponsiveContainer width="100%" height={280}>
              <RPieChart>
                <Pie key="pie" data={data} cx="50%" cy="50%" outerRadius={110} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine>
                  {data.map((e, i) => <Cell key={`cell-${e.name}-${i}`} fill={e.color} />)}
                </Pie>
                <Tooltip key="tt" formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </RPieChart>
            </ResponsiveContainer>
            )}
          </ChartCard>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Détail par catégorie</h3>
            <div className="space-y-3">
              {data.length === 0 && <EmptyState />}
              {data.map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{d.name}</span>
                    <span className="font-mono text-slate-600">{d.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (sub === "heures") {
    // KPI dérivés de la distribution horaire réelle — plus aucune valeur en dur.
    const creneaux = hourlyData as { heure: string; passagers: number }[];
    const plusCharge = creneaux.reduce<typeof creneaux[number] | null>((max, c) => (!max || c.passagers > max.passagers ? c : max), null);
    const plusCreux = creneaux.reduce<typeof creneaux[number] | null>((min, c) => (!min || c.passagers < min.passagers ? c : min), null);
    const chargeMoyenne = creneaux.length
      ? Math.round(creneaux.reduce((somme, c) => somme + c.passagers, 0) / creneaux.length)
      : null;

    return (
      <div className="p-6">
        {feedback}
        <PageHeader title="Heures de pointe" subtitle="Distribution horaire mensuelle — moyenne par créneaux" />
        <ChartCard title="Passagers par créneau horaire" subtitle="Moyenne mensuelle 2026">
          {creneaux.length === 0 ? <EmptyState className="h-[280px]" /> : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={hourlyData}>
              <CartesianGrid key="cg" strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis key="x" dataKey="heure" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis key="y" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip key="tt" contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar key="bar" dataKey="passagers" name="Passagers" radius={[4, 4, 0, 0]}>
                {hourlyData.map(entry => (
                  <Cell key={`h-${entry.heure}`} fill={entry.passagers > 140 ? C.ocean : entry.passagers > 100 ? C.teal : "#cbd5e1"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          )}
        </ChartCard>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            ["Heure la plus chargée", plusCharge ? `${plusCharge.heure} (${plusCharge.passagers} pass.)` : ND, C.ocean],
            ["Heure creuse", plusCreux ? `${plusCreux.heure} (${plusCreux.passagers} pass.)` : ND, C.green],
            ["Charge moyenne", chargeMoyenne != null ? `${chargeMoyenne} pass./créneau` : ND, C.teal],
          ].map(([l, v, c]) => (
            <Card key={l as string} className="text-center py-4">
              <div className="text-sm font-bold font-mono" style={{ color: c as string }}>{v as string}</div>
              <div className="text-xs text-slate-500 mt-1">{l as string}</div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (sub === "occupation") {
    return (
      <div className="p-6">
        {feedback}
        <PageHeader title="Taux d'occupation" subtitle="Analyse mensuelle par chaloupe" />
        <div className="grid grid-cols-2 gap-6">
          <ChartCard title="Occupation par chaloupe — Ce mois">
            <div className="space-y-4 mt-2">
              {chaloupesData.length === 0 && <EmptyState />}
              {chaloupesData.map(c => (
                <div key={c.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{c.nom}</span>
                    <span className="font-mono text-slate-600">{c.occupation}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.occupation}%`, background: `linear-gradient(90deg, ${C.ocean}, ${C.teal})` }} />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard title="Taux mensuel 2026" subtitle="%">
            {monthlyData.length === 0 ? <EmptyState className="h-[200px]" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <CartesianGrid key="cg" strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis key="x" dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis key="y" domain={[60, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip key="tt" contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line key="line" type="monotone" dataKey="occupation" stroke={C.ocean} strokeWidth={2.5} dot={{ fill: C.ocean, r: 3 }} name="Occupation %" />
              </LineChart>
            </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </div>
    );
  }

  if (sub === "validation") {
    return (
      <div className="p-6">
        {feedback}
        <PageHeader title="Taux de validation QR" subtitle="Analyse mensuelle par mois" />
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            ["QR scannés (mois)", validation ? validation.scannes_mois.toLocaleString("fr-FR") : ND, C.ocean],
            ["Valides", validation ? validation.valides.toLocaleString("fr-FR") : ND, C.green],
            ["Invalides", validation ? validation.invalides.toLocaleString("fr-FR") : ND, C.red],
            ["Taux global", validation ? `${validation.taux_global}%` : ND, C.teal],
          ].map(([l, v, c]) => (
            <Card key={l as string} className="text-center py-4">
              <div className="text-xl font-bold font-mono" style={{ color: c as string }}>{v as string}</div>
              <div className="text-xs text-slate-500 mt-1">{l as string}</div>
            </Card>
          ))}
        </div>
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Taux de validation par contrôleur</h3>
          <div className="space-y-3">
            {controleurs.length === 0 ? (
              <EmptyState message="Aucun scan enregistré ce mois-ci" />
            ) : (
              controleurs.map((agent: any) => (
                <div key={agent.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{agent.nom}</span>
                    <span className="font-mono text-slate-600">
                      {agent.taux}% · {agent.scannes} scans
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${agent.taux}%`, background: `linear-gradient(90deg, ${C.ocean}, ${C.teal})` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Dernier mois renvoyé par l'API (série chronologique) — plus de mois codé en dur.
  const currentMonthData: any = monthlyData.length ? monthlyData[monthlyData.length - 1] : null;
  const billetsCeMois = currentMonthData?.billets != null ? currentMonthData.billets.toLocaleString("fr-FR") : ND;
  const recettesCeMois = currentMonthData?.recettes == null
    ? ND
    : currentMonthData.recettes >= 1000000
      ? `${(currentMonthData.recettes / 1000000).toFixed(1)}M FCFA`
      : `${currentMonthData.recettes.toLocaleString("fr-FR")} FCFA`;
  const occupationMoyenne = currentMonthData?.occupation != null ? `${currentMonthData.occupation}%` : ND;

  return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Statistiques — Vue d'ensemble" subtitle="Tableau analytique mensuel 2026"
        actions={<Btn label="Exporter rapport" icon={Download} variant="secondary" />} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="text-center py-4">
          <div className="text-xl font-bold font-mono" style={{ color: C.ocean }}>{billetsCeMois}</div>
          <div className="text-xs text-slate-500 mt-0.5">Billets ce mois</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-xl font-bold font-mono" style={{ color: C.teal }}>{recettesCeMois}</div>
          <div className="text-xs text-slate-500 mt-0.5">Recettes (mois)</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-xl font-bold font-mono" style={{ color: C.green }}>{occupationMoyenne}</div>
          <div className="text-xs text-slate-500 mt-0.5">Taux occupation</div>
        </Card>
        {/* Aucune source de satisfaction côté API — valeur non disponible. */}
        <Card className="text-center py-4">
          <div className="text-xl font-bold font-mono" style={{ color: C.amber }}>{ND}</div>
          <div className="text-xs text-slate-500 mt-0.5">Satisfaction</div>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Billets vendus par mois — 2026">
          {monthlyData.length === 0 ? <EmptyState className="h-[200px]" /> : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid key="cg" strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis key="x" dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis key="y" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip key="tt" contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend key="lg" verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} />
              <Bar key="bar" dataKey="billets" fill={C.ocean} radius={[3, 3, 0, 0]} name="Billets" />
            </BarChart>
          </ResponsiveContainer>
          )}
        </ChartCard>
        <ChartCard title="Répartition passagers — Ce mois">
          {pieData.length === 0 ? <EmptyState className="h-[200px]" /> : (
          <ResponsiveContainer width="100%" height={200}>
            <RPieChart>
              <Pie key="pie" data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={3} dataKey="value">
                {pieData.map(e => <Cell key={`cell-${e.name}`} fill={e.color} />)}
              </Pie>
              <Tooltip key="tt" formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend key="lg" verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} />
            </RPieChart>
          </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
