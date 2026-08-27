import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { defaultInquiries, defaultProperties, defaultSettings } from "@/lib/defaults";
import type { Inquiry, Property, PropertyInput, SiteSettings } from "@/lib/types";
import { slugify } from "@/lib/format";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJson<T>(file: string, fallback: T): T {
  ensureDir();
  const full = path.join(DATA_DIR, file);
  if (!fs.existsSync(full)) {
    fs.writeFileSync(full, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
  const raw = fs.readFileSync(full, "utf8");
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, value: unknown) {
  ensureDir();
  const full = path.join(DATA_DIR, file);
  fs.writeFileSync(full, JSON.stringify(value, null, 2), "utf8");
}

function touchPublic() {
  revalidatePath("/", "layout");
  revalidatePath("/ilanlar");
  revalidatePath("/admin");
}

export function getSettings(): SiteSettings {
  return readJson<SiteSettings>("settings.json", defaultSettings);
}

export function saveSettings(next: SiteSettings): SiteSettings {
  writeJson("settings.json", next);
  touchPublic();
  return next;
}

export function getProperties(): Property[] {
  return readJson<Property[]>("properties.json", defaultProperties);
}

export function getPublishedProperties(): Property[] {
  return getProperties().filter((item) => item.published);
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return getPublishedProperties().find((item) => item.slug === slug);
}

export function getPropertyById(id: string): Property | undefined {
  return getProperties().find((item) => item.id === id);
}

export function saveProperties(list: Property[]): Property[] {
  writeJson("properties.json", list);
  touchPublic();
  return list;
}

export function upsertProperty(input: PropertyInput): Property {
  const list = getProperties();
  const now = new Date().toISOString();
  const id = input.id || `p-${Date.now().toString(36)}`;
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);
  const existing = list.find((item) => item.id === id);
  const record: Property = {
    ...input,
    id,
    slug,
    currency: "TRY",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  const next = existing
    ? list.map((item) => (item.id === id ? record : item))
    : [record, ...list];
  saveProperties(next);
  return record;
}

export function deleteProperty(id: string): boolean {
  const list = getProperties();
  const next = list.filter((item) => item.id !== id);
  if (next.length === list.length) return false;
  saveProperties(next);
  return true;
}

export function getInquiries(): Inquiry[] {
  return readJson<Inquiry[]>("inquiries.json", defaultInquiries).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export function addInquiry(
  input: Omit<Inquiry, "id" | "createdAt"> & { id?: string },
): Inquiry {
  const list = getInquiries();
  const record: Inquiry = {
    ...input,
    id: input.id || `inq-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  writeJson("inquiries.json", [record, ...list]);
  revalidatePath("/admin");
  revalidatePath("/admin/talepler");
  return record;
}

export function typeCounts(list: Property[] = getPublishedProperties()) {
  return list.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] ?? 0) + 1;
    return acc;
  }, {});
}
