import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/store";

export default function SettingsPage() {
  const settings = getSettings();
  return (
    <div>
      <h1 className="font-serif text-3xl">Site ayarları</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Renkler, logo, hero metni ve anasayfa bölümleri genel siteye yansır. Ayarlar <code>data/settings.json</code> dosyasında saklanır.
      </p>
      <div className="mt-6 rounded-md bg-white p-5">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
