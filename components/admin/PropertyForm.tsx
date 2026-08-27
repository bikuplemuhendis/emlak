"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { FeatureKey, ListingStatus, Property, PropertyType } from "@/lib/types";
import { FEATURES, PROPERTY_TYPES, STATUSES } from "@/lib/constants";
import { slugify } from "@/lib/format";

const empty: Partial<Property> = {
  title: "",
  slug: "",
  description: "",
  type: "daire",
  status: "satilik",
  price: 0,
  deposit: undefined,
  loanEligible: true,
  area: 0,
  beds: 0,
  baths: 0,
  featured: false,
  isNew: false,
  published: true,
  images: [],
  features: [],
  location: {
    city: "İstanbul",
    district: "",
    neighborhood: "",
    address: "",
    lat: 41.0082,
    lng: 28.9784,
  },
};

export function PropertyForm({ initial }: { initial?: Property }) {
  const router = useRouter();
  const [data, setData] = useState<Partial<Property>>({ ...empty, ...initial });
  const [imagesText, setImagesText] = useState((initial?.images || []).join("\n"));
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const type = (data.type || "daire") as PropertyType;
  const status = (data.status || "satilik") as ListingStatus;

  const apartment = data.apartment ?? {
    rooms: 2,
    livingRooms: 1,
    floor: 1,
    totalFloors: 5,
    buildingAge: 5,
    heating: "Kombi (doğalgaz)",
    furnished: false,
    balcony: true,
    dues: 0,
    bathrooms: 1,
  };
  const villa = data.villa ?? {
    gardenM2: 0,
    pool: false,
    floors: 2,
    parking: 1,
    view: "",
    exterior: "",
  };
  const land = data.land ?? {
    zoning: "Konut imarlı",
    m2: data.area || 0,
    ada: "",
    parsel: "",
    kaks: 1,
    tapuStatus: "Müstakil tapu",
    infrastructure: "",
    roadFrontage: 0,
  };
  const commercial = data.commercial ?? {
    netM2: 0,
    grossM2: data.area || 0,
    floor: "Zemin",
    building: "",
    suitableFor: "",
    dues: 0,
    parking: 0,
  };

  const typeHint = useMemo(() => {
    if (type === "daire") return "Daire şablonu: oda, salon, kat, aidat, ısınma.";
    if (type === "villa" || type === "mustakil") return "Villa/müstakil şablonu: bahçe, havuz, cephe, manzara.";
    if (type === "arsa") return "Arsa şablonu: imar, ada/parsel, KAKS. Oda/banyo yok.";
    return "Ofis/ticari şablonu: net-brüt m², uygun kullanım, aidat.";
  }, [type]);

  function patch(partial: Partial<Property>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const images = imagesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const payload: Partial<Property> = {
      ...data,
      slug: data.slug || slugify(data.title || "ilan"),
      images,
      price: Number(data.price) || 0,
      area: Number(data.area) || 0,
      beds: type === "arsa" || type === "ofis" || type === "ticari" ? undefined : Number(data.beds) || undefined,
      baths: type === "arsa" || type === "ofis" || type === "ticari" ? undefined : Number(data.baths) || undefined,
      apartment: type === "daire" ? apartment : undefined,
      villa: type === "villa" || type === "mustakil" ? villa : undefined,
      land: type === "arsa" ? { ...land, m2: Number(land.m2) || Number(data.area) || 0 } : undefined,
      commercial: type === "ofis" || type === "ticari" ? commercial : undefined,
      deposit: status === "kiralik" ? Number(data.deposit) || 0 : undefined,
      loanEligible: status === "satilik" ? Boolean(data.loanEligible) : undefined,
    };
    const url = initial?.id ? `/api/properties/${initial.id}` : "/api/properties";
    const res = await fetch(url, {
      method: initial?.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setPending(false);
    if (!res.ok) {
      setError("Kayıt başarısız. Zorunlu alanları kontrol edin.");
      return;
    }
    router.push("/admin/ilanlar");
    router.refresh();
  }

  async function onDelete() {
    if (!initial?.id) return;
    if (!confirm("İlan silinsin mi?")) return;
    await fetch(`/api/properties/${initial.id}`, { method: "DELETE" });
    router.push("/admin/ilanlar");
    router.refresh();
  }

  function toggleFeature(key: FeatureKey) {
    const current = data.features || [];
    patch({
      features: current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <p className="rounded-md bg-cream px-4 py-3 text-sm">{typeHint}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="title">Başlık</label>
          <input id="title" required value={data.title || ""} onChange={(e) => patch({ title: e.target.value })} />
        </div>
        <div>
          <label htmlFor="type">Tip</label>
          <select
            id="type"
            value={type}
            onChange={(e) => patch({ type: e.target.value as PropertyType })}
          >
            {PROPERTY_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status">Durum</label>
          <select
            id="status"
            value={status}
            onChange={(e) => patch({ status: e.target.value as ListingStatus })}
          >
            {STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="price">{status === "kiralik" ? "Aylık kira (TL)" : "Satış fiyatı (TL)"}</label>
          <input
            id="price"
            required
            inputMode="numeric"
            value={data.price ?? ""}
            onChange={(e) => patch({ price: Number(e.target.value) })}
          />
        </div>
        {status === "kiralik" ? (
          <div>
            <label htmlFor="deposit">Depozito (TL)</label>
            <input
              id="deposit"
              inputMode="numeric"
              value={data.deposit ?? ""}
              onChange={(e) => patch({ deposit: Number(e.target.value) })}
            />
          </div>
        ) : (
          <label className="flex items-end gap-2 pb-2 text-sm font-medium normal-case tracking-normal text-navy">
            <input
              type="checkbox"
              className="h-4 w-4 min-h-0"
              checked={Boolean(data.loanEligible)}
              onChange={(e) => patch({ loanEligible: e.target.checked })}
            />
            Konut kredisine uygun
          </label>
        )}
        <div>
          <label htmlFor="area">Alan (m²)</label>
          <input id="area" inputMode="numeric" value={data.area ?? ""} onChange={(e) => patch({ area: Number(e.target.value) })} />
        </div>
        {type !== "arsa" && type !== "ofis" && type !== "ticari" ? (
          <>
            <div>
              <label htmlFor="beds">Yatak / oda</label>
              <input id="beds" inputMode="numeric" value={data.beds ?? ""} onChange={(e) => patch({ beds: Number(e.target.value) })} />
            </div>
            <div>
              <label htmlFor="baths">Banyo</label>
              <input id="baths" inputMode="numeric" value={data.baths ?? ""} onChange={(e) => patch({ baths: Number(e.target.value) })} />
            </div>
          </>
        ) : null}
      </div>

      {type === "daire" ? (
        <fieldset className="grid gap-3 rounded-md border border-line p-4 md:grid-cols-3">
          <legend className="px-1 text-sm font-semibold">Daire alanları</legend>
          <div>
            <label>Oda</label>
            <input
              value={apartment.rooms}
              onChange={(e) => patch({ apartment: { ...apartment, rooms: Number(e.target.value) } })}
            />
          </div>
          <div>
            <label>Salon</label>
            <input
              value={apartment.livingRooms}
              onChange={(e) => patch({ apartment: { ...apartment, livingRooms: Number(e.target.value) } })}
            />
          </div>
          <div>
            <label>Kat</label>
            <input
              value={apartment.floor}
              onChange={(e) => patch({ apartment: { ...apartment, floor: Number(e.target.value) } })}
            />
          </div>
          <div>
            <label>Toplam kat</label>
            <input
              value={apartment.totalFloors}
              onChange={(e) => patch({ apartment: { ...apartment, totalFloors: Number(e.target.value) } })}
            />
          </div>
          <div>
            <label>Bina yaşı</label>
            <input
              value={apartment.buildingAge}
              onChange={(e) => patch({ apartment: { ...apartment, buildingAge: Number(e.target.value) } })}
            />
          </div>
          <div>
            <label>Isıtma</label>
            <input
              value={apartment.heating}
              onChange={(e) => patch({ apartment: { ...apartment, heating: e.target.value } })}
            />
          </div>
          <div>
            <label>Aidat</label>
            <input
              value={apartment.dues}
              onChange={(e) => patch({ apartment: { ...apartment, dues: Number(e.target.value) } })}
            />
          </div>
          <div>
            <label>Banyo sayısı</label>
            <input
              value={apartment.bathrooms}
              onChange={(e) => patch({ apartment: { ...apartment, bathrooms: Number(e.target.value) } })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium normal-case tracking-normal text-navy">
            <input
              type="checkbox"
              className="h-4 w-4 min-h-0"
              checked={apartment.furnished}
              onChange={(e) => patch({ apartment: { ...apartment, furnished: e.target.checked } })}
            />
            Eşyalı
          </label>
          <label className="flex items-center gap-2 text-sm font-medium normal-case tracking-normal text-navy">
            <input
              type="checkbox"
              className="h-4 w-4 min-h-0"
              checked={apartment.balcony}
              onChange={(e) => patch({ apartment: { ...apartment, balcony: e.target.checked } })}
            />
            Balkon
          </label>
        </fieldset>
      ) : null}

      {type === "villa" || type === "mustakil" ? (
        <fieldset className="grid gap-3 rounded-md border border-line p-4 md:grid-cols-3">
          <legend className="px-1 text-sm font-semibold">Villa / müstakil alanları</legend>
          <div>
            <label>Bahçe m²</label>
            <input value={villa.gardenM2} onChange={(e) => patch({ villa: { ...villa, gardenM2: Number(e.target.value) } })} />
          </div>
          <div>
            <label>Kat adedi</label>
            <input value={villa.floors} onChange={(e) => patch({ villa: { ...villa, floors: Number(e.target.value) } })} />
          </div>
          <div>
            <label>Otopark</label>
            <input value={villa.parking} onChange={(e) => patch({ villa: { ...villa, parking: Number(e.target.value) } })} />
          </div>
          <div className="md:col-span-2">
            <label>Manzara</label>
            <input value={villa.view} onChange={(e) => patch({ villa: { ...villa, view: e.target.value } })} />
          </div>
          <div className="md:col-span-2">
            <label>Dış cephe</label>
            <input value={villa.exterior} onChange={(e) => patch({ villa: { ...villa, exterior: e.target.value } })} />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium normal-case tracking-normal text-navy">
            <input
              type="checkbox"
              className="h-4 w-4 min-h-0"
              checked={villa.pool}
              onChange={(e) => patch({ villa: { ...villa, pool: e.target.checked } })}
            />
            Havuz
          </label>
        </fieldset>
      ) : null}

      {type === "arsa" ? (
        <fieldset className="grid gap-3 rounded-md border border-line p-4 md:grid-cols-2">
          <legend className="px-1 text-sm font-semibold">Arsa alanları</legend>
          <div>
            <label>İmar</label>
            <input value={land.zoning} onChange={(e) => patch({ land: { ...land, zoning: e.target.value } })} />
          </div>
          <div>
            <label>m²</label>
            <input value={land.m2} onChange={(e) => patch({ land: { ...land, m2: Number(e.target.value) }, area: Number(e.target.value) })} />
          </div>
          <div>
            <label>Ada</label>
            <input value={land.ada} onChange={(e) => patch({ land: { ...land, ada: e.target.value } })} />
          </div>
          <div>
            <label>Parsel</label>
            <input value={land.parsel} onChange={(e) => patch({ land: { ...land, parsel: e.target.value } })} />
          </div>
          <div>
            <label>KAKS / emsal</label>
            <input value={land.kaks} onChange={(e) => patch({ land: { ...land, kaks: Number(e.target.value) } })} />
          </div>
          <div>
            <label>Yol cephesi (m)</label>
            <input
              value={land.roadFrontage}
              onChange={(e) => patch({ land: { ...land, roadFrontage: Number(e.target.value) } })}
            />
          </div>
          <div className="md:col-span-2">
            <label>Tapu durumu</label>
            <input value={land.tapuStatus} onChange={(e) => patch({ land: { ...land, tapuStatus: e.target.value } })} />
          </div>
          <div className="md:col-span-2">
            <label>Altyapı</label>
            <input
              value={land.infrastructure}
              onChange={(e) => patch({ land: { ...land, infrastructure: e.target.value } })}
            />
          </div>
        </fieldset>
      ) : null}

      {type === "ofis" || type === "ticari" ? (
        <fieldset className="grid gap-3 rounded-md border border-line p-4 md:grid-cols-2">
          <legend className="px-1 text-sm font-semibold">Ofis / ticari alanları</legend>
          <div>
            <label>Net m²</label>
            <input
              value={commercial.netM2}
              onChange={(e) => patch({ commercial: { ...commercial, netM2: Number(e.target.value) } })}
            />
          </div>
          <div>
            <label>Brüt m²</label>
            <input
              value={commercial.grossM2}
              onChange={(e) => patch({ commercial: { ...commercial, grossM2: Number(e.target.value) }, area: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Kat</label>
            <input value={commercial.floor} onChange={(e) => patch({ commercial: { ...commercial, floor: e.target.value } })} />
          </div>
          <div>
            <label>Bina</label>
            <input
              value={commercial.building}
              onChange={(e) => patch({ commercial: { ...commercial, building: e.target.value } })}
            />
          </div>
          <div className="md:col-span-2">
            <label>Uygun kullanım</label>
            <input
              value={commercial.suitableFor}
              onChange={(e) => patch({ commercial: { ...commercial, suitableFor: e.target.value } })}
            />
          </div>
          <div>
            <label>Aidat</label>
            <input
              value={commercial.dues}
              onChange={(e) => patch({ commercial: { ...commercial, dues: Number(e.target.value) } })}
            />
          </div>
          <div>
            <label>Otopark</label>
            <input
              value={commercial.parking}
              onChange={(e) => patch({ commercial: { ...commercial, parking: Number(e.target.value) } })}
            />
          </div>
        </fieldset>
      ) : null}

      <fieldset className="grid gap-3 rounded-md border border-line p-4 md:grid-cols-2">
        <legend className="px-1 text-sm font-semibold">Konum</legend>
        <div>
          <label>Şehir</label>
          <input
            value={data.location?.city || ""}
            onChange={(e) => patch({ location: { ...data.location!, city: e.target.value } })}
          />
        </div>
        <div>
          <label>İlçe</label>
          <input
            value={data.location?.district || ""}
            onChange={(e) => patch({ location: { ...data.location!, district: e.target.value } })}
          />
        </div>
        <div>
          <label>Mahalle</label>
          <input
            value={data.location?.neighborhood || ""}
            onChange={(e) => patch({ location: { ...data.location!, neighborhood: e.target.value } })}
          />
        </div>
        <div>
          <label>Adres</label>
          <input
            value={data.location?.address || ""}
            onChange={(e) => patch({ location: { ...data.location!, address: e.target.value } })}
          />
        </div>
        <div>
          <label>Enlem</label>
          <input
            value={data.location?.lat ?? ""}
            onChange={(e) => patch({ location: { ...data.location!, lat: Number(e.target.value) } })}
          />
        </div>
        <div>
          <label>Boylam</label>
          <input
            value={data.location?.lng ?? ""}
            onChange={(e) => patch({ location: { ...data.location!, lng: Number(e.target.value) } })}
          />
        </div>
      </fieldset>

      <div>
        <label htmlFor="desc">Açıklama</label>
        <textarea id="desc" required value={data.description || ""} onChange={(e) => patch({ description: e.target.value })} />
      </div>
      <div>
        <label htmlFor="images">Görsel URL’leri (her satıra bir adres)</label>
        <textarea id="images" value={imagesText} onChange={(e) => setImagesText(e.target.value)} />
      </div>
      <div>
        <label htmlFor="floorPlan">Kat planı URL (isteğe bağlı)</label>
        <input id="floorPlan" value={data.floorPlan || ""} onChange={(e) => patch({ floorPlan: e.target.value })} />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label>Yapım yılı</label>
          <input value={data.yearBuilt ?? ""} onChange={(e) => patch({ yearBuilt: Number(e.target.value) || undefined })} />
        </div>
        <div>
          <label>Enerji sınıfı</label>
          <select
            value={data.energyClass || ""}
            onChange={(e) => patch({ energyClass: (e.target.value || undefined) as Property["energyClass"] })}
          >
            <option value="">Yok</option>
            {["A", "B", "C", "D", "E", "F", "G"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Slug</label>
          <input value={data.slug || ""} onChange={(e) => patch({ slug: e.target.value })} />
        </div>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Özellikler</legend>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {FEATURES.map((item) => (
            <label key={item.value} className="flex items-center gap-2 text-sm font-medium normal-case tracking-normal text-navy">
              <input
                type="checkbox"
                className="h-4 w-4 min-h-0"
                checked={(data.features || []).includes(item.value)}
                onChange={() => toggleFeature(item.value)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-medium normal-case tracking-normal">
          <input
            type="checkbox"
            className="h-4 w-4 min-h-0"
            checked={Boolean(data.featured)}
            onChange={(e) => patch({ featured: e.target.checked })}
          />
          Öne çıkan
        </label>
        <label className="flex items-center gap-2 text-sm font-medium normal-case tracking-normal">
          <input
            type="checkbox"
            className="h-4 w-4 min-h-0"
            checked={Boolean(data.isNew)}
            onChange={(e) => patch({ isNew: e.target.checked })}
          />
          Yeni
        </label>
        <label className="flex items-center gap-2 text-sm font-medium normal-case tracking-normal">
          <input
            type="checkbox"
            className="h-4 w-4 min-h-0"
            checked={data.published !== false}
            onChange={(e) => patch({ published: e.target.checked })}
          />
          Yayında
        </label>
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn btn-navy" disabled={pending}>
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {initial?.id ? (
          <button type="button" className="btn btn-outline text-danger" onClick={onDelete}>
            Sil
          </button>
        ) : null}
      </div>
    </form>
  );
}
