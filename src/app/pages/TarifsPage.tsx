import { useState } from "react";
import { PageHeader, Btn, Card, Table, Loader } from "@/app/components/ui/Shared";
import { C, Badge, cn } from "@/app/components/layout/common";
import { Ticket, CheckCircle, Edit, X, Plus, Clock, Trash2, Calendar } from "lucide-react";
import { 
  useTarifsCategories, 
  useUpdateGrilleTarifs,
  useCreateTarif,
  useDeleteTarif
} from "@/app/hooks/tarifs/useTarifs";
import { 
  useTrajets, 
  useCreateTrajet, 
  useUpdateTrajet, 
  useDeleteTrajet 
} from "@/app/hooks/trajets/useTrajets";

import { toast } from "sonner";

export default function TarifsPage({ sub }: { sub: string }) {
  const [editing, setEditing] = useState(false);
  const { data: cats = [], isLoading, isError } = useTarifsCategories();
  const updateGrilleMutation = useUpdateGrilleTarifs();
  const createTarifMutation = useCreateTarif();
  const deleteTarifMutation = useDeleteTarif();

  const { data: trajets = [], isLoading: loadTrajets, isError: errTrajets } = useTrajets();
  const createTrajetMutation = useCreateTrajet();
  const updateTrajetMutation = useUpdateTrajet();
  const deleteTrajetMutation = useDeleteTrajet();

  // Price inputs state
  const [prices, setPrices] = useState<Record<string, string>>({});
  // Form states for custom Tarif
  const [showAddTarif, setShowAddTarif] = useState(false);
  const [newCategorie, setNewCategorie] = useState("");
  const [newPrix, setNewPrix] = useState("");

  // Form states for Trajet
  const [showAddTrajet, setShowAddTrajet] = useState(false);
  const [trajetJour, setTrajetJour] = useState("LUNDI");
  const [trajetHeure, setTrajetHeure] = useState("07:30");
  const [trajetDuree, setTrajetDuree] = useState("20");

  const feedback = <Loader isLoading={isLoading || loadTrajets} isError={isError || errTrajets} />;

  const startEdit = () => {
    const initialPrices: Record<string, string> = {};
    cats.forEach(c => {
      initialPrices[c.id] = String(c.prix).replace(/[^0-9.-]+/g, "");
    });
    setPrices(initialPrices);
    setEditing(true);
  };

  const handlePriceChange = (id: string, val: string) => {
    setPrices(prev => ({ ...prev, [id]: val }));
  };

  const handleSaveGrille = async () => {
    try {
      const payload = cats.map(c => ({
        ...c,
        prix: prices[c.id] || String(c.prix).replace(/[^0-9.-]+/g, ""),
      }));
      await updateGrilleMutation.mutateAsync(payload);
      toast.success("Grille tarifaire mise à jour avec succès.");
      setEditing(false);
    } catch (err) {
      toast.error("Erreur lors de la mise à jour des tarifs.");
    }
  };

  const handleCreateTarif = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategorie || !newPrix) return;
    try {
      await createTarifMutation.mutateAsync({
        categorie: newCategorie.toUpperCase(),
        prix: Number(newPrix),
      });
      toast.success("Nouvelle catégorie tarifaire créée.");
      setShowAddTarif(false);
      setNewCategorie("");
      setNewPrix("");
    } catch (err) {
      toast.error("Erreur lors de la création du tarif.");
    }
  };

  const handleDeleteTarif = async (id: string) => {
    try {
      await deleteTarifMutation.mutateAsync(id);
      toast.success("Catégorie supprimée.");
    } catch (err) {
      toast.error("Impossible de supprimer cette catégorie.");
    }
  };

  const handleCreateTrajet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trajetJour || !trajetHeure || !trajetDuree) return;
    try {
      await createTrajetMutation.mutateAsync({
        jour: trajetJour,
        heure_depart: trajetHeure,
        duree: Number(trajetDuree),
      });
      toast.success("Horaire de départ enregistré avec succès.");
      setShowAddTrajet(false);
    } catch (err) {
      toast.error("Erreur de création de l'horaire. Vérifiez le format HH:MM.");
    }
  };

  const handleDeleteTrajet = async (id: string) => {
    try {
      await deleteTrajetMutation.mutateAsync(id);
      toast.success("Horaire de traversée supprimé.");
    } catch (err) {
      toast.error("Impossible de supprimer cet horaire.");
    }
  };

  if (sub === "categories") {
    return (
      <div className="p-6">
        {feedback}
        <PageHeader title="Catégories de passagers" subtitle="Types de voyageurs reconnus" 
          actions={<Btn label="Nouvelle catégorie" icon={Plus} variant="primary" onClick={() => setShowAddTarif(true)} />} />
        
        {showAddTarif && (
          <Card className="mb-6 border-2 border-blue-200 bg-blue-50/20 max-w-xl">
            <form onSubmit={handleCreateTarif}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold">Nouveau type de tarif</h3>
                <button type="button" onClick={() => setShowAddTarif(false)}><X size={16} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Nom (ex: ETRANGER, ENFANT)</label>
                  <input className="w-full px-3 py-1.5 text-sm border rounded-lg" value={newCategorie} onChange={e => setNewCategorie(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Prix (FCFA)</label>
                  <input type="number" className="w-full px-3 py-1.5 text-sm border rounded-lg font-mono" value={newPrix} onChange={e => setNewPrix(e.target.value)} required />
                </div>
              </div>
              <div className="flex gap-2">
                <Btn type="submit" label="Ajouter" variant="primary" loading={createTarifMutation.isPending} />
                <button type="button" className="px-3 py-1.5 border rounded-lg text-xs" onClick={() => setShowAddTarif(false)}>Annuler</button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-3 gap-4">
          {cats.map((c, i) => (
            <Card key={i}>
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{c.categorie}</h3>
                <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500" onClick={() => handleDeleteTarif(c.id)}><Trash2 size={13} /></button>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tarif aller-retour</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{c.prix}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (sub === "horaires") {
    // Group trajets by Day to show nice weekday summary cards
    const joursOrdre = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"];
    
    return (
      <div className="p-6">
        {feedback}
        <PageHeader title="Horaires journaliers (Trajets)" subtitle="Configuration de la grille horaire de départ Dakar ↔ Gorée"
          actions={<Btn label="Nouveau départ" icon={Plus} variant="primary" onClick={() => setShowAddTrajet(true)} />} />

        {showAddTrajet && (
          <Card className="mb-6 border-2 border-blue-200 bg-blue-50/20 max-w-xl">
            <form onSubmit={handleCreateTrajet}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold">Créer une heure de départ quotidienne</h3>
                <button type="button" onClick={() => setShowAddTrajet(false)}><X size={16} /></button>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Jour de la semaine</label>
                  <select className="w-full px-3 py-1.5 text-sm border rounded-lg bg-white" value={trajetJour} onChange={e => setTrajetJour(e.target.value)}>
                    {joursOrdre.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Heure de départ (HH:MM)</label>
                  <input type="text" className="w-full px-3 py-1.5 text-sm border rounded-lg font-mono" value={trajetHeure} onChange={e => setTrajetHeure(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Durée (minutes)</label>
                  <input type="number" className="w-full px-3 py-1.5 text-sm border rounded-lg font-mono" value={trajetDuree} onChange={e => setTrajetDuree(e.target.value)} required />
                </div>
              </div>
              <div className="flex gap-2">
                <Btn type="submit" label="Enregistrer" variant="primary" loading={createTrajetMutation.isPending} />
                <button type="button" className="px-3 py-1.5 border rounded-lg text-xs" onClick={() => setShowAddTrajet(false)}>Annuler</button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar size={16} /> Horaires configurés par jour
            </h3>
            <Table
              cols={["Jour", "Départs configurés"]}
              rows={joursOrdre.map(j => {
                const dayTrajets = trajets.filter(t => t.jour === j).sort((a, b) => a.heure_depart.localeCompare(b.heure_depart));
                return [
                  <span className="font-semibold text-slate-800" key={`j-${j}`}>{j}</span>,
                  <div className="flex flex-wrap gap-2" key={`slots-${j}`}>
                    {dayTrajets.length === 0 ? (
                      <span className="text-xs text-slate-300">Aucun départ configuré</span>
                    ) : (
                      dayTrajets.map(t => (
                        <div key={t.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-red-300 group transition-all">
                          <Clock size={11} />
                          {t.heure_depart} ({t.duree} min)
                          <button onClick={() => handleDeleteTrajet(t.id)} className="ml-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Supprimer">
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                ];
              })}
            />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {feedback}
      <PageHeader title="Grille tarifaire" subtitle="Tarifs en vigueur — tous les billets sont valables aller-retour"
        actions={<>
          <Btn label={editing ? "Annuler" : "Modifier les tarifs"} icon={editing ? X : Edit} variant="secondary" onClick={() => editing ? setEditing(false) : startEdit()} />
          {!editing && <Btn label="Nouvelle catégorie" icon={Plus} variant="primary" onClick={() => setShowAddTarif(true)} />}
        </>} />

      {showAddTarif && (
        <Card className="mb-5 border-2 border-blue-200 bg-blue-50/20 max-w-xl">
          <form onSubmit={handleCreateTarif}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold">Nouveau type de tarif</h3>
              <button type="button" onClick={() => setShowAddTarif(false)}><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Nom (ex: ADULTE, ENFANT)</label>
                <input className="w-full px-3 py-1.5 text-sm border rounded-lg bg-white" value={newCategorie} onChange={e => setNewCategorie(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Prix (FCFA)</label>
                <input type="number" className="w-full px-3 py-1.5 text-sm border rounded-lg font-mono bg-white" value={newPrix} onChange={e => setNewPrix(e.target.value)} required />
              </div>
            </div>
            <div className="flex gap-2">
              <Btn type="submit" label="Ajouter" variant="primary" loading={createTarifMutation.isPending} />
              <button type="button" className="px-3 py-1.5 border rounded-lg text-xs" onClick={() => setShowAddTarif(false)}>Annuler</button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex items-center gap-3 mb-5 px-4 py-2.5 rounded-xl border text-sm" style={{ background: C.teal + "10", borderColor: C.teal + "30", color: C.teal }}>
        <Ticket size={16} />
        <span className="font-semibold">Tous les tarifs sont pour un billet aller-retour (Dakar ↔ Gorée). L'abonnement mensuel est réservé aux résidents.</span>
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Catégorie</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Tarif aller-retour (FCFA)</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c, i) => (
              <tr key={i} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">{c.categorie}</td>
                <td className="py-3 px-4 text-center">
                  {editing ? (
                    <input value={prices[c.id] ?? ""} onChange={e => handlePriceChange(c.id, e.target.value)}
                      className="w-32 text-center px-2 py-1 text-sm border border-blue-300 rounded-lg bg-white focus:outline-none font-mono font-semibold" style={{ color: C.ocean }} />
                  ) : (
                    <span className="font-mono font-bold text-lg" style={{ color: C.ocean }}>{c.prix}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors" onClick={() => handleDeleteTarif(c.id)} title="Supprimer"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editing && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
            <Btn label="Sauvegarder les modifications" icon={CheckCircle} variant="primary" onClick={handleSaveGrille} />
            <Btn label="Annuler" variant="secondary" onClick={() => setEditing(false)} />
          </div>
        )}
      </Card>
    </div>
  );
}
