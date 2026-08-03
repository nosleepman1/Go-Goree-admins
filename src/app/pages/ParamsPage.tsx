import { useState, useEffect } from "react";
import { PageHeader, Btn, Card } from "@/app/components/ui/Shared";
import { C, cn } from "@/app/components/layout/common";
import { CheckCircle } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/app/hooks/settings/useSettings";
import { toast } from "sonner";

export default function ParamsPage() {
  const { data: settings = {} } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  // General Settings inputs
  const [serviceName, setServiceName] = useState("Go Gorée");
  const [operator, setOperator] = useState("Société de Navigation de Gorée");
  const [route, setRoute] = useState("Dakar Port ↔ Île de Gorée");
  const [duration, setDuration] = useState("20 minutes");
  const [timezone, setTimezone] = useState("Africa/Dakar (UTC+0)");
  const [currency, setCurrency] = useState("Franc CFA (FCFA / XOF)");

  // Sync general settings from loaded data
  useEffect(() => {
    if (settings.serviceName) setServiceName(settings.serviceName);
    if (settings.operator) setOperator(settings.operator);
    if (settings.route) setRoute(settings.route);
    if (settings.duration) setDuration(settings.duration);
    if (settings.timezone) setTimezone(settings.timezone);
    if (settings.currency) setCurrency(settings.currency);
  }, [settings]);

  const handleSaveSettings = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        serviceName,
        operator,
        route,
        duration,
        timezone,
        currency
      });
      toast.success("Paramètres généraux sauvegardés avec succès.");
    } catch (err) {
      toast.error("Erreur de sauvegarde des paramètres.");
    }
  };

  return (
    <div className="p-6">
      <PageHeader title="Paramètres généraux" subtitle="Configuration de base du service"
        actions={<Btn label="Sauvegarder" icon={CheckCircle} variant="primary" onClick={handleSaveSettings} loading={updateSettingsMutation.isPending} />} />

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Informations du service</h3>
          <div className="space-y-4">
            {[
              { label: "Nom du service", value: serviceName, setter: setServiceName },
              { label: "Opérateur", value: operator, setter: setOperator },
              { label: "Route principale", value: route, setter: setRoute },
              { label: "Durée de traversée", value: duration, setter: setDuration },
              { label: "Fuseau horaire", value: timezone, setter: setTimezone },
              { label: "Devise", value: currency, setter: setCurrency },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{f.label}</label>
                <input
                  value={f.value}
                  onChange={e => f.setter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Alertes système</h3>
          <div className="space-y-3">
            {[
              { label: "Alerte capacité ≥ 90%", enabled: true },
              { label: "Rapport mensuel automatique", enabled: true },
              { label: "Alerte paiement échoué", enabled: true },
              { label: "Notification demande résident", enabled: true },
              { label: "Rappel maintenance chaloupe", enabled: true },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700">
                <span className="text-sm text-slate-700 dark:text-slate-300">{s.label}</span>
                <div className={cn("w-10 h-5 rounded-full relative cursor-pointer transition-colors", s.enabled ? "" : "bg-slate-200")}
                  style={s.enabled ? { background: C.ocean } : undefined}>
                  <div className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform", s.enabled ? "translate-x-5" : "translate-x-0.5")} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
