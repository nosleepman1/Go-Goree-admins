import { useConfirm } from "@/app/hooks/useConfirm";
import { useState } from "react";
import { PageHeader, Btn, Card, Table, ChartCard, SearchBar, Loader } from "@/app/components/ui/Shared";
import { StatusBadge, cn } from "@/app/components/layout/common";
import { Plus, Filter, CheckCircle, Edit, Download, Eye, Trash2, Clock, X } from "lucide-react";
import { 
  useVoyages, 
  useCreateVoyage, 
  useUpdateVoyage, 
  useDeleteVoyage, 
  useGenererVoyages 
} from "@/app/hooks/voyages/useVoyages";
import { useChaloupes } from "@/app/hooks/chaloupes/useChaloupes";
import { useTrajets } from "@/app/hooks/trajets/useTrajets";
import { toast } from "sonner";

export default function VoyagesPage({ sub }: { sub?: string }) {
  const { confirmAction, ConfirmModal } = useConfirm();
  const s = sub ?? "liste";

  const { data: voyages = [], isLoading: vLoading, isError: vError } = useVoyages();
  const { data: chaloupes = [], isLoading: cLoading, isError: cError } = useChaloupes();
  const { data: trajets = [], isLoading: tLoading, isError: tError } = useTrajets();

  const createMutation = useCreateVoyage();
  const updateMutation = useUpdateVoyage();
  const deleteMutation = useDeleteVoyage();
  const genererMutation = useGenererVoyages();

  // Inline forms toggles
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [chaloupeId, setChaloupeId] = useState("");
  const [trajetId, setTrajetId] = useState("");
  const [dateVoyage, setDateVoyage] = useState("");
  const [places, setPlaces] = useState("100");

  const isLoading = vLoading || cLoading || tLoading;
  const isError = vError || cError || tError;

  const feedback = (
    <div className="space-y-2 mb-4">
      {isError && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400">
          Données indisponibles — affichage des dernières données connues.
        </div>
      )}
      {isLoading && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-slate-400" />
        </div>
      )}
    </div>
  );

  const handleOpenAdd = () => {
    if (chaloupes.length > 0) setChaloupeId(chaloupes[0].id);
    if (trajets.length > 0) setTrajetId(trajets[0].id);
    setDateVoyage(new Date().toISOString().split("T")[0]);
    setPlaces("100");
    setShowAddForm(true);
    setEditId(null);
  };

  const handleOpenEdit = (v: any) => {
    const matchingChaloupe = chaloupes.find(c => c.nom === v.chaloupe);
    if (matchingChaloupe) setChaloupeId(matchingChaloupe.id);
    
    // Un même horaire (heure_depart) peut exister sur plusieurs jours : il faut
    // matcher sur (jour + heure_depart), sinon on risque de réaffecter le voyage
    // au trajet d'un autre jour lors de l'enregistrement.
    // `v.heure_depart` peut être vide si le trajet n'a pas d'horaire : sans ce
    // garde-fou, startsWith("") matcherait n'importe quel trajet du même jour.
    const matchingTrajet = v.heure_depart
      ? trajets.find(t => t.jour === v.jour && t.heure_depart?.startsWith(v.heure_depart))
      : undefined;
    if (matchingTrajet) {
      setTrajetId(matchingTrajet.id);
    } else if (trajets.length > 0) {
      setTrajetId(trajets[0].id);
    }

    setDateVoyage(v.date_voyage || new Date().toISOString().split("T")[0]);
    setPlaces(String(v.places));
    setEditId(v.id);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chaloupeId || !trajetId || !dateVoyage || !places) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const payload = {
        chaloupe_id: chaloupeId,
        trajet_id: trajetId,
        date_voyage: dateVoyage,
        places: Number(places),
        places_restantes: Number(places),
      };

      if (editId) {
        await updateMutation.mutateAsync({ id: editId, payload });
        toast.success("Voyage modifié avec succès.");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Nouveau voyage planifié avec succès.");
      }
      handleCloseForm();
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement du voyage.");
    }
  };

  const handleDelete = async (id: string) => {
    confirmAction("Suppression Voyage", "Supprimer ce voyage définitivement ?", async () => {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Voyage supprimé.");
      } catch (err) {
        toast.error("Impossible de supprimer le voyage.");
      }
    });
  };

  const handleTriggerGeneration = async () => {
    try {
      const msg = await genererMutation.mutateAsync();
      toast.success(msg);
    } catch (err) {
      toast.error("Impossible de générer les voyages.");
    }
  };

  const handlePlanForSlot = (date: string, slot: string) => {
    if (chaloupes.length > 0) setChaloupeId(chaloupes[0].id);

    const dayNameMap: Record<number, string> = {
      0: "DIMANCHE", 1: "LUNDI", 2: "MARDI", 3: "MERCREDI", 4: "JEUDI", 5: "VENDREDI", 6: "SAMEDI"
    };
    const dateObj = new Date(date);
    const dayOfWeekStr = dayNameMap[dateObj.getDay()];

    const matchingTrajet = trajets.find(t => t.jour === dayOfWeekStr && t.heure_depart?.startsWith(slot));
    if (matchingTrajet) {
      setTrajetId(matchingTrajet.id);
    } else if (trajets.length > 0) {
      setTrajetId(trajets[0].id);
    }

    setDateVoyage(date);
    setPlaces("100");
    setEditId(null);
    setShowAddForm(true);
  };

  if (s === "planning") {
    const slots = ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00"];

    // Generate dates for current week starting from Monday
    const todayObj = new Date();
    const currentDay = todayObj.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const mondayObj = new Date(todayObj);
    mondayObj.setDate(todayObj.getDate() + distanceToMonday);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(mondayObj);
      d.setDate(mondayObj.getDate() + i);
      const label = d.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short" });
      const dateStr = d.toISOString().split("T")[0];
      return { label, dateStr };
    });

    const chColors: Record<string, string> = {
      "Joseph Ndiaye": "#1035A8", "Boubacar Joseph Ndiaye": "#1035A8", "Coumba Castel": "#0BA5C0", "Augustin Elimane Ly": "#0E9F6E",
    };

    return (
      <div className="p-6">
        <PageHeader title="Planning des voyages" subtitle={`Semaine du ${weekDays[0].label} au ${weekDays[6].label}`} />
        <Loader isLoading={vLoading} isError={vError} />
        <Card className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left text-slate-400 font-medium w-16">Horaire</th>
                {weekDays.map(d => <th key={d.dateStr} className="p-2 text-center text-slate-600 font-semibold min-w-[120px]">{d.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {slots.map(slot => (
                <tr key={slot} className="border-t border-slate-50">
                  <td className="p-2 font-mono text-slate-500 font-semibold">{slot}</td>
                  {weekDays.map(day => {
                    const matchingVoyage = voyages.find(v => 
                      v.date_voyage === day.dateStr && 
                      (v.heure_depart === slot || v.heure_depart?.startsWith(slot))
                    );

                    return (
                      <td key={day.dateStr} className="p-1">
                        {matchingVoyage ? (
                          <div 
                            className="rounded-lg p-1.5 text-center text-white text-[10px] font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ background: chColors[matchingVoyage.chaloupe] ?? "#1035A8" }}
                            onClick={() => handleOpenEdit(matchingVoyage)}
                          >
                            <div>{matchingVoyage.chaloupe}</div>
                            <div className="opacity-75 mt-0.5">{matchingVoyage.vendus} / {matchingVoyage.places} vendus</div>
                          </div>
                        ) : (
                          <div 
                            className="rounded-lg p-2.5 text-center text-slate-300 text-[10px] border border-dashed border-slate-200 cursor-pointer hover:border-blue-300 hover:text-blue-400 transition-colors"
                            onClick={() => handlePlanForSlot(day.dateStr, slot)}
                          >
                            + Planifier
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  if (s === "historique") {
    return (
      <div className="p-6">
        <PageHeader title="Historique des voyages" subtitle="Données détaillées par jour et par mois" />
        <Loader isLoading={vLoading} isError={vError} />
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            ["Total voyages", "1 247", "#1035A8"], ["Passagers transportés", "563 480", "#0BA5C0"],
            ["Recettes totales", "2,82 Millions FCFA", "#0E9F6E"], ["Taux d'occupation moyen", "85.4%", "#D97706"],
          ].map(([l, v, c]) => (
            <Card key={l as string} className="text-center py-5">
              <div className="text-xl font-bold font-mono mb-1" style={{ color: c as string }}>{v as string}</div>
              <div className="text-xs text-slate-500">{l as string}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <ChartCard title="Évolution mensuelle des billets" subtitle="2026 — par mois animate">
            <div className="h-48 flex items-center justify-center text-sm text-slate-400">Flux de passagers stable Dakar ↔ Gorée</div>
          </ChartCard>
          <ChartCard title="Taux d'occupation mensuel" subtitle="%">
            <div className="h-48 flex items-center justify-center text-sm text-slate-400">Occupation moyenne stable (85.4%)</div>
          </ChartCard>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ConfirmModal />
      <Loader isLoading={vLoading} isError={vError} />

      {/* Info scheduler and manual trigger */}
      <Card className="mb-6 bg-gradient-to-r from-blue-900 to-indigo-950 text-white border-0 flex items-center justify-between p-6 shadow-lg">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Clock size={16} className="text-blue-400" /> Génération automatique de voyages (Tâche planifiée)
          </h3>
          <p className="text-xs text-blue-200 mt-1 max-w-xl">
            La tâche automatique (`GenererVoyagesSemaineJob`) s'exécute chaque jour à 22h00 pour générer les voyages des 7 prochains jours basés sur la grille horaire des trajets.
          </p>
        </div>
        <Btn label="Déclencher la génération manuelle" variant="primary" onClick={handleTriggerGeneration} loading={genererMutation.isPending} />
      </Card>

      <PageHeader title="Voyages" subtitle={`Gestion des voyages planifiés et des affectations`}
        actions={<Btn label="Planifier un voyage" icon={Plus} variant="primary" onClick={handleOpenAdd} />} />

      {showAddForm && (
        <Card className="mb-6 border-2 border-blue-200 bg-blue-50/20 max-w-2xl">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold">{editId ? "Modifier le voyage (Changer chaloupe)" : "Nouveau voyage manuel"}</h3>
              <button type="button" onClick={handleCloseForm} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Chaloupe affectée</label>
                <select className="w-full px-3 py-1.5 text-sm border rounded-lg bg-white" value={chaloupeId} onChange={e => setChaloupeId(e.target.value)} required>
                  {chaloupes.map(c => <option key={c.id} value={c.id}>{c.nom} ({c.capacite} places)</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Trajet / Départ quotidien</label>
                <select className="w-full px-3 py-1.5 text-sm border rounded-lg bg-white" value={trajetId} onChange={e => setTrajetId(e.target.value)} required>
                  {trajets.map(t => <option key={t.id} value={t.id}>{t.jour} – {t.heure_depart} ({t.duree} min)</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Date du voyage</label>
                <input type="date" className="w-full px-3 py-1.5 text-sm border rounded-lg bg-white" value={dateVoyage} onChange={e => setDateVoyage(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Capacité / Places</label>
                <input type="number" className="w-full px-3 py-1.5 text-sm border rounded-lg font-mono bg-white" value={places} onChange={e => setPlaces(e.target.value)} required />
              </div>
            </div>
            <div className="flex gap-2">
              <Btn
                type="submit"
                label="Enregistrer"
                icon={CheckCircle}
                variant="primary"
                loading={editId ? updateMutation.isPending : createMutation.isPending}
              />
              <button type="button" className="px-3 py-1.5 border rounded-lg text-xs" onClick={handleCloseForm}>Annuler</button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex gap-2 mb-4">
        <SearchBar placeholder="Rechercher un voyage..." />
      </div>

      <Card>
        <Table
          cols={["ID", "Départ", "Arrivée", "Chaloupe", "Places", "Vendus", "Occupation", "Statut", "Actions"]}
          rows={voyages.map(v => {
            const occRate = Math.round((v.vendus / v.places) * 100);
            return [
              <span className="font-mono text-xs text-slate-500" key={`id-${v.id}`}>{v.id.slice(0, 8)}...</span>,
              <span className="font-mono font-bold text-slate-900" key={`dep-${v.id}`}>{v.depart}</span>,
              <span key={`arr-${v.id}`}>{v.arrivee}</span>,
              <span key={`ch-${v.id}`} className="font-semibold text-slate-800">{v.chaloupe}</span>,
              <span className="font-mono" key={`pl-${v.id}`}>{v.places}</span>,
              <span className="font-mono" key={`sold-${v.id}`}>{v.vendus}</span>,
              <div className="min-w-[80px]" key={`occ-${v.id}`}>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold">{occRate}%</span>
                  <div className="h-1.5 w-12 rounded bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${Math.min(occRate, 100)}%` }} />
                  </div>
                </div>
              </div>,
              <StatusBadge key={`stat-${v.id}`} statut={v.statut} />,
              <div className="flex gap-1" key={`act-${v.id}`}>
                <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors" onClick={() => handleOpenEdit(v)} title="Changer chaloupe / Modifier"><Edit size={14} /></button>
                <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors" onClick={() => handleDelete(v.id)} title="Supprimer"><Trash2 size={14} /></button>
              </div>,
            ];
          })}
        />
      </Card>
    </div>
  );
}
