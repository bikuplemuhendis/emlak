import type { Property } from "./types";
import { isLandType, typeLabel, statusLabel } from "./constants";

const tryFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("tr-TR");

export function formatPrice(value: number): string {
  return tryFormatter.format(value);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatArea(value: number): string {
  return `${formatNumber(value)} m²`;
}

export function priceCaption(property: Property): string {
  if (property.status === "kiralik") return "aylık";
  return "satış bedeli";
}

export function roomCode(property: Property): string | null {
  if (property.apartment) {
    return `${property.apartment.rooms}+${property.apartment.livingRooms}`;
  }
  if (property.beds && property.beds > 0) {
    return `${property.beds} oda`;
  }
  return null;
}

export function locationLine(property: Property): string {
  const { neighborhood, district, city } = property.location;
  return [neighborhood, district, city].filter(Boolean).join(", ");
}

export function cardMeta(property: Property): { label: string; value: string }[] {
  if (isLandType(property.type) && property.land) {
    return [
      { label: "Alan", value: formatArea(property.land.m2 || property.area) },
      { label: "İmar", value: property.land.zoning },
    ];
  }
  if (property.commercial) {
    return [
      { label: "Net", value: formatArea(property.commercial.netM2) },
      { label: "Brüt", value: formatArea(property.commercial.grossM2) },
    ];
  }
  const items: { label: string; value: string }[] = [];
  const rooms = roomCode(property);
  if (rooms) items.push({ label: "Oda", value: rooms });
  if (property.baths) items.push({ label: "Banyo", value: String(property.baths) });
  items.push({ label: "Alan", value: formatArea(property.area) });
  return items;
}

export function listingBadge(property: Property): string {
  return `${statusLabel(property.status)} ${typeLabel(property.type)}`;
}

export function whatsappLink(phone: string, text?: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("90") ? digits : `90${digits.replace(/^0/, "")}`;
  const url = new URL(`https://wa.me/${normalized}`);
  if (text) url.searchParams.set("text", text);
  return url.toString();
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export function slugify(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
