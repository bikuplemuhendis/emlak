import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Property, SiteSettings } from "@/lib/types";
import { featureLabel, statusLabel } from "@/lib/constants";
import { formatArea, formatNumber, formatPrice, priceCaption } from "@/lib/format";
import { InquiryForm } from "@/components/public/InquiryForm";
import { telLink, whatsappLink } from "@/lib/format";

function Row({ label, value }: { label: string; value: ReactNode }) {
  if (value == null || value === "") return null;
  return (
    <div className="grid grid-cols-2 gap-2 border-b border-line py-2.5 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold text-right">{value}</dd>
    </div>
  );
}

export function PriceBlock({ property }: { property: Property }) {
  return (
    <div className="rounded-md bg-navy p-5 text-white">
      <p className="text-[11px] font-bold tracking-[0.16em] text-gold uppercase">{statusLabel(property.status)}</p>
      <p className="mt-2 font-serif text-3xl">{formatPrice(property.price)}</p>
      <p className="text-xs text-white/60 uppercase tracking-wide">{priceCaption(property)}</p>
      {property.status === "kiralik" && property.deposit != null ? (
        <p className="mt-3 text-sm text-white/80">Depozito: {formatPrice(property.deposit)}</p>
      ) : null}
      {property.status === "satilik" ? (
        <p className="mt-3 text-sm text-white/80">
          {property.loanEligible ? "Konut kredisine uygun" : "Kredi değerlendirmesi ofiste yapılır; bu ilan için uygunluk belirtilmedi."}
        </p>
      ) : null}
    </div>
  );
}

export function AgentCard({ settings }: { settings: SiteSettings }) {
  return (
    <aside className="rounded-md border border-line bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 overflow-hidden rounded-md">
          <Image src={settings.agent.photo} alt={settings.agent.name} fill className="object-cover" sizes="64px" />
        </div>
        <div>
          <p className="font-semibold">{settings.agent.name}</p>
          <p className="text-xs text-muted">{settings.agent.title}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a className="btn btn-navy" href={telLink(settings.phone)}>
          Ara
        </a>
        <a className="btn btn-gold" href={whatsappLink(settings.whatsapp)} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
      </div>
      <Link href="/ofis" className="mt-3 inline-block text-sm font-semibold underline-offset-4 hover:underline">
        Ofis sayfası
      </Link>
    </aside>
  );
}

export function FeaturesList({ property }: { property: Property }) {
  if (!property.features.length) return null;
  return (
    <section className="mt-8">
      <h2 className="font-serif text-2xl">Özellikler</h2>
      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {property.features.map((feature) => (
          <li key={feature} className="rounded-md bg-cream px-3 py-2 text-sm">
            {featureLabel(feature)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ApartmentTemplate({ property }: { property: Property }) {
  const a = property.apartment;
  if (!a) return null;
  return (
    <section className="mt-8 rounded-md border border-line bg-white p-5">
      <p className="text-xs font-bold tracking-[0.16em] text-gold uppercase">Daire şablonu</p>
      <h2 className="mt-1 font-serif text-2xl">Konut özeti</h2>
      <p className="mt-2 text-sm text-muted">
        Oda düzeni Türk usulü <strong>{a.rooms}+{a.livingRooms}</strong> olarak gösterilir. Kat, aidat ve ısınma bilgisi bu şablona özgüdür.
      </p>
      <dl className="mt-4">
        <Row label="Oda düzeni" value={`${a.rooms}+${a.livingRooms}`} />
        <Row label="Banyo" value={a.bathrooms} />
        <Row label="Bulunduğu kat" value={`${a.floor} / ${a.totalFloors}`} />
        <Row label="Bina yaşı" value={`${a.buildingAge} yıl`} />
        <Row label="Isıtma" value={a.heating} />
        <Row label="Eşya" value={a.furnished ? "Eşyalı" : "Eşyasız"} />
        <Row label="Balkon" value={a.balcony ? "Var" : "Yok"} />
        <Row label="Aidat" value={`${formatNumber(a.dues)} TL / ay`} />
        <Row label="Brüt alan" value={formatArea(property.area)} />
        {property.yearBuilt ? <Row label="Yapım yılı" value={property.yearBuilt} /> : null}
        {property.energyClass ? <Row label="Enerji sınıfı" value={property.energyClass} /> : null}
      </dl>
      {property.floorPlan ? (
        <div className="relative mt-5 aspect-[16/8] overflow-hidden rounded-md bg-cream">
          <Image src={property.floorPlan} alt="Kat planı" fill className="object-cover" sizes="800px" />
        </div>
      ) : null}
    </section>
  );
}

export function VillaTemplate({ property }: { property: Property }) {
  const v = property.villa;
  if (!v) return null;
  return (
    <section className="mt-8 overflow-hidden rounded-md bg-cream">
      <div className="grid gap-0 md:grid-cols-3">
        <div className="bg-navy p-6 text-white md:col-span-1">
          <p className="text-xs font-bold tracking-[0.16em] text-gold uppercase">Villa / müstakil şablonu</p>
          <h2 className="mt-2 font-serif text-3xl">Bahçe ve dış cephe</h2>
          <p className="mt-3 text-sm text-white/70">Bu şablon daire kartından farklıdır: bahçe m², havuz, kat adedi ve manzara öne çıkar.</p>
        </div>
        <div className="p-6 md:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: "Bahçe", value: formatArea(v.gardenM2) },
              { label: "Havuz", value: v.pool ? "Var" : "Yok" },
              { label: "Kat", value: v.floors },
              { label: "Otopark", value: `${v.parking} araç` },
              { label: "Manzara", value: v.view },
              { label: "Dış cephe", value: v.exterior },
            ].map((item) => (
              <div key={item.label} className="rounded-md bg-white p-3">
                <p className="text-[10px] font-bold tracking-widest text-muted uppercase">{item.label}</p>
                <p className="mt-1 text-sm font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
          <dl className="mt-4">
            <Row label="Kapalı alan" value={formatArea(property.area)} />
            <Row label="Yatak odası" value={property.beds} />
            <Row label="Banyo" value={property.baths} />
            {property.yearBuilt ? <Row label="Yapım yılı" value={property.yearBuilt} /> : null}
            {property.energyClass ? <Row label="Enerji sınıfı" value={property.energyClass} /> : null}
          </dl>
        </div>
      </div>
    </section>
  );
}

export function LandTemplate({ property }: { property: Property }) {
  const land = property.land;
  if (!land) return null;
  return (
    <section className="mt-8 rounded-md border-2 border-navy bg-white">
      <div className="bg-[repeating-linear-gradient(45deg,#f4f0e8,#f4f0e8_12px,#fff_12px,#fff_24px)] px-5 py-4">
        <p className="text-xs font-bold tracking-[0.16em] text-gold uppercase">Arsa şablonu</p>
        <h2 className="font-serif text-3xl">Kadastro ve imar</h2>
        <p className="mt-1 text-sm text-muted">Yatak / banyo gösterilmez. Ada, parsel, KAKS ve yol cephesi esastır.</p>
      </div>
      <div className="grid gap-px bg-line sm:grid-cols-2">
        {[
          ["İmar lejantı", land.zoning],
          ["Alan", formatArea(land.m2 || property.area)],
          ["Ada", land.ada],
          ["Parsel", land.parsel],
          ["KAKS / emsal", String(land.kaks)],
          ["Tapu", land.tapuStatus],
          ["Altyapı", land.infrastructure],
          ["Yol cephesi", `${land.roadFrontage} m`],
        ].map(([label, value]) => (
          <div key={label} className="bg-white p-4">
            <p className="text-[10px] font-bold tracking-widest text-muted uppercase">{label}</p>
            <p className="mt-1 font-serif text-xl">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CommercialTemplate({ property }: { property: Property }) {
  const c = property.commercial;
  if (!c) return null;
  return (
    <section className="mt-8 rounded-md border border-line bg-white p-5">
      <p className="text-xs font-bold tracking-[0.16em] text-gold uppercase">Ofis / ticari şablon</p>
      <h2 className="mt-1 font-serif text-2xl">İş yeri ölçüleri</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md bg-navy p-4 text-white">
          <p className="text-xs text-gold">Net alan</p>
          <p className="font-serif text-3xl">{formatArea(c.netM2)}</p>
        </div>
        <div className="rounded-md bg-cream p-4">
          <p className="text-xs text-muted">Brüt alan</p>
          <p className="font-serif text-3xl">{formatArea(c.grossM2)}</p>
        </div>
      </div>
      <dl className="mt-4">
        <Row label="Kat" value={c.floor} />
        <Row label="Bina" value={c.building} />
        <Row label="Uygun kullanım" value={c.suitableFor} />
        <Row label="Aidat" value={`${formatNumber(c.dues)} TL / ay`} />
        <Row label="Otopark tahsisi" value={`${c.parking} araç`} />
      </dl>
    </section>
  );
}

export function TypeTemplate({ property }: { property: Property }) {
  if (property.type === "daire") return <ApartmentTemplate property={property} />;
  if (property.type === "villa" || property.type === "mustakil") return <VillaTemplate property={property} />;
  if (property.type === "arsa") return <LandTemplate property={property} />;
  return <CommercialTemplate property={property} />;
}

export function InquiryPanel({
  property,
  settings,
}: {
  property: Property;
  settings: SiteSettings;
}) {
  return (
    <div className="space-y-4">
      <PriceBlock property={property} />
      <AgentCard settings={settings} />
      <div className="rounded-md border border-line bg-white p-5">
        <h2 className="font-serif text-xl">Bilgi / görüntüleme</h2>
        <InquiryForm propertyId={property.id} propertySlug={property.slug} source="property" />
      </div>
    </div>
  );
}
