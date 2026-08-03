import { useState } from "react";
import { PageHeader, Btn, Card, Table , Loader } from "@/app/components/ui/Shared";
import { FileText, Download, Plus } from "lucide-react";
import { useRapports, useGenerateRapport } from "@/app/hooks/rapports/useRapports";
import { laravelClient } from "@/app/api/laravelClient";
import { toast } from "sonner";

export default function RapportsPage({ sub }: { sub: string }) {
  const { data: rapportsData = {}, isLoading, isError } = useRapports();
  const generateMutation = useGenerateRapport();

  const rapports = rapportsData?.data || [];

  // Form states
  const [type, setType] = useState("Synthèse mensuelle");
  const [mois, setMois] = useState("Juillet 2026");
  const [format, setFormat] = useState("PDF");

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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Pick the most adequate format: PDF for summaries/synthese, Excel/CSV for logs/financials
      const selectedFormat = type.toLowerCase().includes("financier") || type.toLowerCase().includes("passagers") ? "xlsx" : "pdf";
      
      await generateMutation.mutateAsync({
        type,
        mois,
        format: selectedFormat,
      });
      toast.success("Rapport généré avec succès.");
    } catch (err) {
      toast.error("Erreur lors de la génération du rapport.");
    }
  };

  const handleDownload = async (id: string, filename: string) => {
    try {
      const response = await laravelClient.get(`/v1/rapports/${id}/telecharger`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Téléchargement démarré.");
    } catch (err) {
      toast.error("Impossible de télécharger le fichier.");
    }
  };

  if (sub === "generer") {
    return (
      <div className="p-6">
        <PageHeader title="Générer un rapport" subtitle="Créez des rapports personnalisés" />
      <Loader isLoading={isLoading} isError={isError} />
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Configuration</h3>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Type de rapport</label>
                <select 
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Synthèse mensuelle">Synthèse mensuelle (Format : PDF)</option>
                  <option value="Rapport financier">Rapport financier (Format : Excel)</option>
                  <option value="Rapport passagers">Rapport passagers (Format : Excel)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Mois</label>
                <select 
                  value={mois}
                  onChange={e => setMois(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Juillet 2026">Juillet 2026</option>
                  <option value="Juin 2026">Juin 2026</option>
                  <option value="Mai 2026">Mai 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">Sections à inclure</label>
                {[
                  "KPIs principaux", "Détail des voyages", "Transactions financières", "Statistiques passagers", "Graphiques",
                ].map(s => (
                  <label key={s} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer mb-2">
                    <input type="checkbox" className="accent-blue-600" defaultChecked />
                    {s}
                  </label>
                ))}
              </div>
              <Btn label="Générer le rapport" icon={FileText} variant="primary" type="submit" loading={generateMutation.isPending} />
            </form>
          </Card>
          
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Format D'Exportation</h3>
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-800 space-y-2">
              <p className="font-semibold">Format optimisé automatique :</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Les rapports de synthèse contiennent des graphiques et KPI formatés en <strong>PDF</strong>.</li>
                <li>Les tableaux de flux et de passagers sont formatés en feuille de calcul <strong>Excel (.xlsx)</strong> pour analyse de données.</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Loader isLoading={isLoading} isError={isError} />
      <PageHeader title="Historique des rapports" subtitle="Tous les rapports générés par le système" />
      <Card>
        <Table
          cols={["Nom du rapport", "Format", "Date de génération", "Par", ""]}
          rows={rapports.map((r: any) => [
            <span className="font-semibold text-slate-800" key={`name-${r.id}`}>{r.nom_fichier}</span>,
            <span className="text-xs font-bold text-blue-700" key={`format-${r.id}`}>{r.format}</span>,
            <span className="text-xs text-slate-500" key={`date-${r.id}`}>{new Date(r.date_generation).toLocaleString("fr-FR")}</span>,
            <span className="text-xs text-slate-600 font-medium" key={`by-${r.id}`}>{r.genere_par}</span>,
            <Btn 
              label="Télécharger" 
              icon={Download} 
              variant="secondary" 
              key={`dl-${r.id}`}
              onClick={() => handleDownload(r.id, r.nom_fichier)}
            />,
          ])}
        />
      </Card>
    </div>
  );
}
