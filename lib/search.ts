import type { FeatureKey, ListingFilters, Property } from "@/lib/types";

export function parseFilters(searchParams: Record<string, string | string[] | undefined>): ListingFilters {
  const first = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const num = (key: string) => {
    const raw = first(key);
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  };
  const featuresRaw = first("features");
  const features = featuresRaw
    ? (featuresRaw.split(",").filter(Boolean) as FeatureKey[])
    : undefined;

  return {
    q: first("q")?.trim() || undefined,
    status: (first("status") as ListingFilters["status"]) || "",
    type: (first("type") as ListingFilters["type"]) || "",
    city: first("city") || undefined,
    district: first("district")?.trim() || undefined,
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    beds: num("beds"),
    baths: num("baths"),
    minArea: num("minArea"),
    maxArea: num("maxArea"),
    features,
    sort: (first("sort") as ListingFilters["sort"]) || "newest",
    page: num("page") || 1,
    view: (first("view") as ListingFilters["view"]) || undefined,
  };
}

export function filterProperties(list: Property[], filters: ListingFilters): Property[] {
  let result = [...list];
  if (filters.q) {
    const q = filters.q.toLocaleLowerCase("tr-TR");
    result = result.filter((item) => {
      const hay = [
        item.title,
        item.description,
        item.location.city,
        item.location.district,
        item.location.neighborhood,
        item.location.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("tr-TR");
      return hay.includes(q);
    });
  }
  if (filters.status) {
    result = result.filter((item) => item.status === filters.status);
  }
  if (filters.type) {
    result = result.filter((item) => item.type === filters.type);
  }
  if (filters.city) {
    result = result.filter((item) => item.location.city === filters.city);
  }
  if (filters.district) {
    const d = filters.district.toLocaleLowerCase("tr-TR");
    result = result.filter((item) =>
      [item.location.district, item.location.neighborhood]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("tr-TR")
        .includes(d),
    );
  }
  if (filters.minPrice != null) {
    result = result.filter((item) => item.price >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    result = result.filter((item) => item.price <= filters.maxPrice!);
  }
  if (filters.beds) {
    result = result.filter((item) => (item.beds ?? item.apartment?.rooms ?? 0) >= filters.beds!);
  }
  if (filters.baths) {
    result = result.filter((item) => (item.baths ?? item.apartment?.bathrooms ?? 0) >= filters.baths!);
  }
  if (filters.minArea != null) {
    result = result.filter((item) => item.area >= filters.minArea!);
  }
  if (filters.maxArea != null) {
    result = result.filter((item) => item.area <= filters.maxArea!);
  }
  if (filters.features?.length) {
    result = result.filter((item) =>
      filters.features!.every((feature) => item.features.includes(feature)),
    );
  }

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "area-desc":
      result.sort((a, b) => b.area - a.area);
      break;
    default:
      result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  return result;
}

export function toSearchParams(filters: ListingFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) return;
    if (Array.isArray(value)) params.set(key, value.join(","));
    else params.set(key, String(value));
  });
  return params.toString();
}
