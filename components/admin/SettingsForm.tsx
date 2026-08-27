"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/types";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [data, setData] = useState(initial);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  function patch(partial: Partial<SiteSettings>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setPending(false);
    if (!res.ok) {
      setMessage("Kayıt başarısız.");
      return;
    }
    setMessage("Ayarlar kaydedildi. Genel sitede hemen görünür.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <fieldset className="grid gap-3 rounded-md border border-line p-4 md:grid-cols-2">
        <legend className="px-1 text-sm font-semibold">Ofis kimliği</legend>
        <div>
          <label>Ajans adı</label>
          <input value={data.agencyName} onChange={(e) => patch({ agencyName: e.target.value })} />
        </div>
        <div>
          <label>Logo yazısı</label>
          <input value={data.logoText} onChange={(e) => patch({ logoText: e.target.value })} />
        </div>
        <div>
          <label>Logo damgası</label>
          <input value={data.logoMark} onChange={(e) => patch({ logoMark: e.target.value })} maxLength={3} />
        </div>
        <div className="md:col-span-2">
          <label>Slogan</label>
          <input value={data.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
        </div>
        <div>
          <label>Telefon</label>
          <input value={data.phone} onChange={(e) => patch({ phone: e.target.value })} />
        </div>
        <div>
          <label>WhatsApp (ülke kodlu)</label>
          <input value={data.whatsapp} onChange={(e) => patch({ whatsapp: e.target.value })} />
        </div>
        <div>
          <label>E-posta</label>
          <input value={data.email} onChange={(e) => patch({ email: e.target.value })} />
        </div>
        <div>
          <label>Çalışma saatleri</label>
          <input value={data.workingHours} onChange={(e) => patch({ workingHours: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label>Adres</label>
          <input value={data.address} onChange={(e) => patch({ address: e.target.value })} />
        </div>
      </fieldset>

      <fieldset className="grid gap-3 rounded-md border border-line p-4 md:grid-cols-2">
        <legend className="px-1 text-sm font-semibold">Görünüm</legend>
        <div>
          <label htmlFor="primaryColor">Ana renk</label>
          <input
            id="primaryColor"
            type="color"
            className="h-12 p-1"
            value={data.primaryColor}
            onChange={(e) => patch({ primaryColor: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="accentColor">Vurgu rengi</label>
          <input
            id="accentColor"
            type="color"
            className="h-12 p-1"
            value={data.accentColor}
            onChange={(e) => patch({ accentColor: e.target.value })}
          />
        </div>
        <div>
          <label>Başlık stili</label>
          <select
            value={data.headerStyle}
            onChange={(e) => patch({ headerStyle: e.target.value as SiteSettings["headerStyle"] })}
          >
            <option value="transparent">Hero üzerinde şeffaf</option>
            <option value="solid">Daima dolu</option>
          </select>
        </div>
        <div>
          <label>Varsayılan ilan yerleşimi</label>
          <select
            value={data.defaultListingLayout}
            onChange={(e) =>
              patch({ defaultListingLayout: e.target.value as SiteSettings["defaultListingLayout"] })
            }
          >
            <option value="grid">Izgara</option>
            <option value="list">Liste</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label>Hero başlığı</label>
          <input value={data.heroTitle} onChange={(e) => patch({ heroTitle: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label>Hero alt başlık</label>
          <textarea value={data.heroSubtitle} onChange={(e) => patch({ heroSubtitle: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label>Hero görseli (URL)</label>
          <input value={data.heroImage} onChange={(e) => patch({ heroImage: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label>Alt bilgi metni</label>
          <textarea value={data.footerText} onChange={(e) => patch({ footerText: e.target.value })} />
        </div>
      </fieldset>

      <fieldset className="grid gap-2 rounded-md border border-line p-4">
        <legend className="px-1 text-sm font-semibold">Anasayfa bölümleri</legend>
        {(
          [
            ["featured", "Öne çıkan ilanlar"],
            ["types", "Mülk tipleri"],
            ["stats", "Sayılar"],
            ["testimonials", "Yorumlar"],
            ["cta", "Çağrı bandı"],
            ["latest", "Son ilanlar"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm font-medium normal-case tracking-normal">
            <input
              type="checkbox"
              className="h-4 w-4 min-h-0"
              checked={data.sections[key]}
              onChange={(e) =>
                patch({
                  sections: { ...data.sections, [key]: e.target.checked },
                })
              }
            />
            {label}
          </label>
        ))}
      </fieldset>

      <fieldset className="grid gap-3 rounded-md border border-line p-4">
        <legend className="px-1 text-sm font-semibold">Danışman</legend>
        <div>
          <label>Ad</label>
          <input value={data.agent.name} onChange={(e) => patch({ agent: { ...data.agent, name: e.target.value } })} />
        </div>
        <div>
          <label>Unvan</label>
          <input value={data.agent.title} onChange={(e) => patch({ agent: { ...data.agent, title: e.target.value } })} />
        </div>
        <div>
          <label>Fotoğraf URL</label>
          <input value={data.agent.photo} onChange={(e) => patch({ agent: { ...data.agent, photo: e.target.value } })} />
        </div>
        <div>
          <label>Biyografi</label>
          <textarea value={data.agent.bio} onChange={(e) => patch({ agent: { ...data.agent, bio: e.target.value } })} />
        </div>
      </fieldset>

      {message ? <p className="text-sm">{message}</p> : null}
      <button type="submit" className="btn btn-navy w-fit" disabled={pending}>
        {pending ? "Kaydediliyor…" : "Ayarları kaydet"}
      </button>
    </form>
  );
}
