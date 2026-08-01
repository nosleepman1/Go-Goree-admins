import { useState } from "react";
import { PageHeader, Btn, Card, Table , Loader } from "@/app/components/ui/Shared";
import { C, Badge } from "@/app/components/layout/common";
import { Smartphone, Mail, Bell, MessageSquare, Send, BellRing, Download } from "lucide-react";
import { useNotifications, useBroadcastNotification } from "@/app/hooks/notifications/useNotifications";
import { toast } from "sonner";

export default function NotifsPage({ sub }: { sub: string }) {
  const { data: notifications = [], isLoading, isError } = useNotifications();
  const broadcastMutation = useBroadcastNotification();

  const [message, setMessage] = useState("");
  const [canal, setCanal] = useState("IN_APP"); // Default to IN_APP (in app + real-time reverb)
  const [titre, setTitre] = useState("");
  const [destinataires, setDestinataires] = useState("Tous les passagers");

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

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre.trim()) {
      toast.error("Veuillez saisir un titre.");
      return;
    }
    if (!message.trim()) {
      toast.error("Veuillez saisir un message.");
      return;
    }

    try {
      const res = await broadcastMutation.mutateAsync({
        titre: titre.trim(),
        message: message.trim(),
        canal,
        destinataires,
      });
      const nb = res?.destinataires_contactes;
      toast.success(
        typeof nb === "number"
          ? `Notification diffusée à ${nb} destinataire${nb > 1 ? "s" : ""}.`
          : "Campagne de notification diffusée avec succès !"
      );
      setMessage("");
      setTitre("");
    } catch (err) {
      toast.error("Impossible de diffuser la notification.");
    }
  };

  const handleUseTemplate = (title: string, msg: string) => {
    setTitre(title);
    setMessage(msg);
    toast.success("Modèle de notification appliqué.");
  };

  if (sub === "envoyer") {
    return (
      <div className="p-6">
        <PageHeader title="Envoyer une notification" subtitle="Communiquer avec les passagers" />
      <Loader isLoading={isLoading} isError={isError} />
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <form onSubmit={handleBroadcast}>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Composer le message</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Canal de diffusion principal</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { label: "In-App / Temps réel", key: "IN_APP", icon: MessageSquare },
                      { label: "Email", key: "EMAIL", icon: Mail },
                      { label: "SMS", key: "SMS", icon: Smartphone },
                      { label: "Push", key: "PUSH", icon: Bell },
                    ].map(item => (
                      <button type="button" key={item.key} onClick={() => setCanal(item.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium transition-all ${
                          canal === item.key 
                            ? "border-blue-600 bg-blue-50 text-blue-700" 
                            : "border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800"
                        }`}>
                        <item.icon size={13} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Titre</label>
                  <input className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none bg-white dark:bg-slate-800"
                    placeholder="Ex: Alerte embarquement" value={titre} onChange={e => setTitre(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Message</label>
                  <textarea className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none resize-none bg-white dark:bg-slate-800"
                    rows={5} placeholder="Rédigez votre message ici..." value={message} onChange={e => setMessage(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Destinataires</label>
                  <select className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    value={destinataires} onChange={e => setDestinataires(e.target.value)}>
                    {["Tous les passagers", "Résidents uniquement", "Touristes uniquement", "Scolaires uniquement"].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <Btn type="submit" label="Diffuser la notification" icon={Send} variant="primary" loading={broadcastMutation.isPending} />
              </div>
            </form>
          </Card>
          
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Modèles prédéfinis</h3>
            <div className="space-y-2">
              {[
                { titre: "Voyage annulé", desc: "Notification d'annulation avec information de remboursement", msg: "Alerte : Le voyage de 17h00 est annulé en raison des conditions météorologiques. Remboursement automatique sur votre portefeuille." },
                { titre: "Retard de traversée", desc: "Information de délai pour le prochain voyage", msg: "Info : Le départ de la chaloupe Coumba Castel de 10h est retardé de 15 minutes." },
                { titre: "Promo résidents", desc: "Offre spéciale abonnement mensuel résidents", msg: "Bonne nouvelle : Pensez à renouveler votre abonnement mensuel pour continuer à voyager sans limite !" },
                { titre: "Rappel embarquement", desc: "Rappel avant le départ du voyage", msg: "Rappel : Embarquement en cours pour le départ de 16h00. Veuillez vous présenter aux portillons." },
              ].map((t, i) => (
                <button key={i} onClick={() => handleUseTemplate(t.titre, t.msg)}
                  className="w-full flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-200 hover:bg-blue-50/40 transition-all text-left">
                  <BellRing size={16} className="mt-0.5 shrink-0" style={{ color: C.ocean }} />
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.titre}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const canalColor = (c: string) => (c === "SMS" ? "blue" : c === "MAIL" ? "teal" : c === "IN_APP" ? "purple" : "gray");
  const canalLabel = (c: string) => (c === "MAIL" ? "Email" : c === "IN_APP" ? "In-App" : c);

  if (sub === "historique") {
    return (
      <div className="p-6">
        <Loader isLoading={isLoading} isError={isError} />
        <PageHeader title="Historique des notifications" subtitle="Notifications enregistrées (in-app & alertes)" />
        <Card>
          <Table
            cols={["Date", "Canal", "Type", "Statut"]}
            rows={notifications.map(n => [
              <span key={`date-${n.id}`}>{n.date}</span>,
              <Badge key={`canal-${n.id}`} label={canalLabel(n.canal)} color={canalColor(n.canal)} />,
              <Badge key={`type-${n.id}`} label={n.type} color={n.type === "ALERTE" ? "red" : "indigo"} />,
              <Badge key={`stat-${n.id}`} label={n.lu ? "Lu" : "Non lu"} color={n.lu ? "green" : "amber"} />,
            ])}
          />
        </Card>
      </div>
    );
  }

  // Filtre par canal : la clé de route (inapp/email/sms/push) → valeur backend (CanalEnum)
  const SUB_TO_CANAL: Record<string, string> = { sms: "SMS", email: "MAIL", push: "PUSH", inapp: "IN_APP" };
  const labels: Record<string, string> = { sms: "SMS", email: "Email", push: "Notifications Push", inapp: "In-App" };
  const canalFilter = SUB_TO_CANAL[sub] ?? sub.toUpperCase();
  const canalItems = notifications.filter(n => n.canal === canalFilter);

  return (
    <div className="p-6">
      <Loader isLoading={isLoading} isError={isError} />
      <PageHeader title={`Canal — ${labels[sub] ?? sub}`} subtitle="Notifications enregistrées sur ce canal" />
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          ["Enregistrées", canalItems.length, C.ocean],
          ["Lues", canalItems.filter(n => n.lu).length, C.green],
          ["Non lues", canalItems.filter(n => !n.lu).length, C.red],
        ].map(([l, v, c]) => (
          <Card key={l as string} className="text-center py-4">
            <div className="text-xl font-bold font-mono" style={{ color: c as string }}>{v as string}</div>
            <div className="text-xs text-slate-500 mt-1">{l as string}</div>
          </Card>
        ))}
      </div>
      <Card>
        <Table
          cols={["Date", "Type", "Statut"]}
          rows={canalItems.map(n => [
            <span key={`date-${n.id}`}>{n.date}</span>,
            <Badge key={`type-${n.id}`} label={n.type} color={n.type === "ALERTE" ? "red" : "indigo"} />,
            <Badge key={`stat-${n.id}`} label={n.lu ? "Lu" : "Non lu"} color={n.lu ? "green" : "amber"} />,
          ])}
        />
      </Card>
    </div>
  );
}
