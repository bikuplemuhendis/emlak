import type { FeatureKey, PropertyType, ListingStatus } from "./types";

export const PROPERTY_TYPES: { value: PropertyType; label: string; blurb: string }[] = [
  { value: "daire", label: "Daire", blurb: "Şehir içi konutlar" },
  { value: "villa", label: "Villa", blurb: "Bahçeli lüks evler" },
  { value: "mustakil", label: "Müstakil", blurb: "Bağımsız evler" },
  { value: "ofis", label: "Ofis", blurb: "Plaza ve iş yerleri" },
  { value: "arsa", label: "Arsa", blurb: "İmarlı yatırım arazileri" },
  { value: "ticari", label: "Ticari", blurb: "Dükkân ve mağazalar" },
];

export const STATUSES: { value: ListingStatus; label: string }[] = [
  { value: "satilik", label: "Satılık" },
  { value: "kiralik", label: "Kiralık" },
];

export const FEATURES: { value: FeatureKey; label: string }[] = [
  { value: "asansor", label: "Asansör" },
  { value: "otopark", label: "Otopark" },
  { value: "guvenlik", label: "Güvenlik" },
  { value: "havuz", label: "Havuz" },
  { value: "spor_salonu", label: "Spor salonu" },
  { value: "cocuk_parki", label: "Çocuk parkı" },
  { value: "jenerator", label: "Jeneratör" },
  { value: "klima", label: "Klima" },
  { value: "ankastre", label: "Ankastre mutfak" },
  { value: "esyali", label: "Eşyalı" },
  { value: "balkon", label: "Balkon" },
  { value: "teras", label: "Teras" },
  { value: "deniz_manzarasi", label: "Deniz manzarası" },
  { value: "sehir_manzarasi", label: "Şehir manzarası" },
  { value: "fiber", label: "Fiber internet" },
  { value: "akilli_ev", label: "Akıllı ev" },
  { value: "yangin_merdiveni", label: "Yangın merdiveni" },
  { value: "site_ici", label: "Site içinde" },
  { value: "jakuzi", label: "Jakuzi" },
  { value: "somine", label: "Şömine" },
  { value: "depo", label: "Depo" },
  { value: "yuk_asansoru", label: "Yük asansörü" },
];

export const CITIES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Muğla",
  "Bursa",
  "Antalya",
] as const;

export const PAGE_SIZE = 6;

export const NAV_LINKS = [
  { href: "/", label: "Anasayfa" },
  { href: "/ilanlar", label: "İlanlar" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/ofis", label: "Ofis" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export function typeLabel(type: PropertyType): string {
  return PROPERTY_TYPES.find((item) => item.value === type)?.label ?? type;
}

export function statusLabel(status: ListingStatus): string {
  return STATUSES.find((item) => item.value === status)?.label ?? status;
}

export function featureLabel(key: FeatureKey): string {
  return FEATURES.find((item) => item.value === key)?.label ?? key;
}

export function isLandType(type: PropertyType): boolean {
  return type === "arsa";
}

export function isResidential(type: PropertyType): boolean {
  return type === "daire" || type === "villa" || type === "mustakil";
}

export function isCommercialType(type: PropertyType): boolean {
  return type === "ofis" || type === "ticari";
}
