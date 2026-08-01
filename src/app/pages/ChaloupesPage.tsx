import { useConfirm } from "@/app/hooks/useConfirm";
import { useState } from "react";
import { PageHeader, Btn, Card, Table, Loader } from "@/app/components/ui/Shared";
import { C, StatusBadge } from "@/app/components/layout/common";
import { Anchor, Edit, CheckCircle, Plus, X, Trash2 } from "lucide-react";
import { 
  useChaloupes,
  useCreateChaloupe,
  useUpdateChaloupe,
  useDeleteChaloupe 
} from "@/app/hooks/chaloupes/useChaloupes";
import { toast } from "sonner";

export default function ChaloupesPage() {
  const { confirmAction, ConfirmModal } = useConfirm();
  const { data: chaloupes = [], isLoading, isError } = useChaloupes();
  const createMutation = useCreateChaloupe();
  const updateMutation = useUpdateChaloupe();
  const deleteMutation = useDeleteChaloupe();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form inputs
  const [nom, setNom] = useState("");
  const [capacite, setCapacite] = useState("");
  const [imatriculation, setImmatriculation] = useState("");
  const [statut, setStatut] = useState("Actif");

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
    setNom("");
    setCapacite("");
    setImmatriculation("");
    setStatut("Actif");
    setEditId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (c: any) => {
    setNom(c.nom);
    setCapacite(String(c.capacite));
    setImmatriculation(c.imatriculation);
    setStatut(c.statut);
    setEditId(c.id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !capacite || !imatriculation) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const payload = {
        nom,
        capacite: Number(capacite),
        imatriculation,
        statut, // "Actif" | "Maintenance" | "Inactif" — converti en enum backend par le service
      };

      if (editId) {
        await updateMutation.mutateAsync({ id: editId, payload });
        toast.success("Chaloupe modifiée avec succès.");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Nouvelle chaloupe ajoutée.");
      }
      handleCloseForm();
    } catch (err: any) {
      toast.error("Erreur de sauvegarde de la chaloupe.");
    }
  };

  const handleDelete = async (id: string) => {
    confirmAction("Suppression Chaloupe", "Supprimer cette chaloupe définitivement ?", async () => {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Chaloupe supprimée.");
      } catch (err) {
        toast.error("Impossible de supprimer cette chaloupe.");
      }
    });
  };

  return (
    <div className="p-6">
      <ConfirmModal />
      <PageHeader title="Flotte de chaloupes" subtitle={`${chaloupes.length} embarcations enregistrées`}
        actions={<Btn label="Ajouter chaloupe" icon={Plus} variant="primary" onClick={handleOpenAdd} />} />
      <Loader isLoading={isLoading} isError={isError} />

      {showForm && (
        <Card className="mb-6 border-2 border-blue-200 bg-blue-50/20 max-w-2xl">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold">{editId ? "Modifier la chaloupe" : "Ajouter une chaloupe"}</h3>
              <button type="button" onClick={handleCloseForm} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Nom de la chaloupe</label>
                <input type="text" className="w-full px-3 py-1.5 text-sm border rounded-lg bg-white" value={nom} onChange={e => setNom(e.target.value)} placeholder="Ex: Boubacar Joseph Ndiaye" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Immatriculation</label>
                <input type="text" className="w-full px-3 py-1.5 text-sm border rounded-lg bg-white" value={imatriculation} onChange={e => setImmatriculation(e.target.value)} placeholder="Ex: SN-DAK-2018-001" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Capacité (passagers)</label>
                <input type="number" className="w-full px-3 py-1.5 text-sm border rounded-lg bg-white font-mono" value={capacite} onChange={e => setCapacite(e.target.value)} placeholder="450" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Statut</label>
                <select className="w-full px-3 py-1.5 text-sm border rounded-lg bg-white font-semibold text-slate-700" value={statut} onChange={e => setStatut(e.target.value)}>
                  <option value="Actif">Actif</option>
                  <option value="Maintenance">En maintenance</option>
                  <option value="Inactif">Inactif</option>
                </select>
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

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          ["Actives", chaloupes.filter(c => c.statut === "Actif").length, C.green],
          ["En maintenance", chaloupes.filter(c => c.statut === "Maintenance").length, C.amber],
          ["Capacité totale", chaloupes.filter(c => c.statut === "Actif").reduce((a, c) => a + c.capacite, 0) + " places", C.ocean],
        ].map(([l, v, c]) => (
          <Card key={l as string} className="text-center py-4">
            <div className="text-2xl font-bold font-mono mb-1" style={{ color: c as string }}>{v as string | number}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{l as string}</div>
          </Card>
        ))}
      </div>

      <Card>
        <Table
          cols={["ID", "Nom", "Immatriculation", "Capacité", "Statut", "Actions"]}
          rows={chaloupes.map(c => [
            <span className="font-mono text-xs text-slate-400" key={`id-${c.id}`}>{c.id.slice(0, 8)}...</span>,
            <div className="flex items-center gap-2" key={`nom-${c.id}`}>
              <div className="size-8 rounded-lg flex items-center justify-center bg-blue-50/50">
                <Anchor size={14} style={{ color: C.ocean }} />
              </div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{c.nom}</span>
            </div>,
            <span className="font-mono font-semibold text-slate-600" key={`imm-${c.id}`}>{c.imatriculation}</span>,
            <span className="font-mono font-semibold" key={`cap-${c.id}`}>{c.capacite}</span>,
            <StatusBadge statut={c.statut} key={`stat-${c.id}`} />,
            <div className="flex gap-1" key={`act-${c.id}`}>
              <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors" onClick={() => handleOpenEdit(c)} title="Modifier"><Edit size={14} /></button>
              <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors" onClick={() => handleDelete(c.id)} title="Supprimer"><Trash2 size={14} /></button>
            </div>,
          ])}
        />
      </Card>
    </div>
  );
}
