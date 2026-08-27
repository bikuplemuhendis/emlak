"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { CITIES, FEATURES, PROPERTY_TYPES, STATUSES } from "@/lib/constants";
import { cn } from "@/lib/format";

export function ListingFilters({
  cities = CITIES as unknown as string[],
}: {
  cities?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const selectedFeatures = useMemo(
    () => (searchParams.get("features") || "").split(",").filter(Boolean),
    [searchParams],
  );

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams(searchParams.toString());
    const keys = [
      "q",
      "status",
      "type",
      "city",
      "district",
      "minPrice",
      "maxPrice",
      "beds",
      "baths",
      "minArea",
      "maxArea",
    ];
    keys.forEach((key) => {
      const value = String(form.get(key) || "").trim();
      if (value) params.set(key, value);
      else params.delete(key);
    });
    const features = form.getAll("features").map(String);
    if (features.length) params.set("features", features.join(","));
    else params.delete("features");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  const formBody = (prefix: string) => (
    <form onSubmit={apply} className="grid gap-3">
      <div>
        <label htmlFor={`${prefix}-q`}>Anahtar kelime</label>
        <input id={`${prefix}-q`} name="q" defaultValue={searchParams.get("q") || ""} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${prefix}-status`}>Durum</label>
          <select id={`${prefix}-status`} name="status" defaultValue={searchParams.get("status") || ""}>
            <option value="">Tümü</option>
            {STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${prefix}-type`}>Tip</label>
          <select id={`${prefix}-type`} name="type" defaultValue={searchParams.get("type") || ""}>
            <option value="">Tümü</option>
            {PROPERTY_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor={`${prefix}-city`}>Şehir</label>
        <select id={`${prefix}-city`} name="city" defaultValue={searchParams.get("city") || ""}>
          <option value="">Tümü</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${prefix}-district`}>İlçe / mahalle</label>
        <input id={`${prefix}-district`} name="district" defaultValue={searchParams.get("district") || ""} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${prefix}-minp`}>Min. fiyat</label>
          <input id={`${prefix}-minp`} name="minPrice" defaultValue={searchParams.get("minPrice") || ""} inputMode="numeric" />
        </div>
        <div>
          <label htmlFor={`${prefix}-maxp`}>Maks. fiyat</label>
          <input id={`${prefix}-maxp`} name="maxPrice" defaultValue={searchParams.get("maxPrice") || ""} inputMode="numeric" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${prefix}-beds`}>Min. oda</label>
          <input id={`${prefix}-beds`} name="beds" defaultValue={searchParams.get("beds") || ""} inputMode="numeric" />
        </div>
        <div>
          <label htmlFor={`${prefix}-baths`}>Min. banyo</label>
          <input id={`${prefix}-baths`} name="baths" defaultValue={searchParams.get("baths") || ""} inputMode="numeric" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${prefix}-mina`}>Min. m²</label>
          <input id={`${prefix}-mina`} name="minArea" defaultValue={searchParams.get("minArea") || ""} inputMode="numeric" />
        </div>
        <div>
          <label htmlFor={`${prefix}-maxa`}>Maks. m²</label>
          <input id={`${prefix}-maxa`} name="maxArea" defaultValue={searchParams.get("maxArea") || ""} inputMode="numeric" />
        </div>
      </div>
      <fieldset>
        <legend className="mb-2 text-[0.78rem] font-semibold tracking-[0.04em] text-muted uppercase">Özellikler</legend>
        <div className="grid max-h-40 grid-cols-2 gap-2 overflow-auto pr-1">
          {FEATURES.map((item) => (
            <label key={item.value} className="flex items-center gap-2 text-xs font-medium normal-case tracking-normal text-navy">
              <input
                type="checkbox"
                name="features"
                value={item.value}
                defaultChecked={selectedFeatures.includes(item.value)}
                className="h-4 w-4 min-h-0"
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>
      <button type="submit" className="btn btn-navy">
        Filtrele
      </button>
    </form>
  );

  return (
    <>
      <div className="hidden lg:block">{formBody("d")}</div>
      <button type="button" className="btn btn-outline w-full lg:hidden" onClick={() => setOpen(true)}>
        <SlidersHorizontal className="h-4 w-4" />
        Filtreler
      </button>
      {open ? (
        <div className="fixed inset-0 z-[70] bg-navy/50 lg:hidden" role="dialog" aria-label="Filtreler">
          <div className="absolute inset-y-0 right-0 w-[min(100%,24rem)] overflow-y-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl">Filtreler</h2>
              <button type="button" className="btn btn-outline h-11 w-11 px-0" aria-label="Kapat" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            {formBody("m")}
          </div>
        </div>
      ) : null}
    </>
  );
}

export function ListingToolbar({
  total,
  defaultView,
}: {
  total: number;
  defaultView: "grid" | "list" | "map";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = (searchParams.get("view") as "grid" | "list" | "map") || defaultView;
  const sort = searchParams.get("sort") || "newest";

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key === "view") params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted">{total} ilan bulundu</p>
      <div className="flex flex-wrap gap-2">
        <select
          aria-label="Sırala"
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="w-auto min-w-44"
        >
          <option value="newest">En yeni</option>
          <option value="price-asc">Fiyat (artan)</option>
          <option value="price-desc">Fiyat (azalan)</option>
          <option value="area-desc">Alan (büyük)</option>
        </select>
        <div className="flex overflow-hidden rounded-md border border-line">
          {(["grid", "list", "map"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setParam("view", item)}
              className={cn(
                "px-3 py-2 text-sm font-semibold",
                view === item ? "bg-navy text-white" : "bg-white text-navy",
              )}
            >
              {item === "grid" ? "Izgara" : item === "list" ? "Liste" : "Harita"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
