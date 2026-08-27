import { Suspense } from "react";
import Link from "next/link";
import { ListingFilters, ListingToolbar } from "@/components/public/ListingControls";
import { MapBoard } from "@/components/public/MapBoard";
import { PropertyCard } from "@/components/public/PropertyCard";
import { PAGE_SIZE } from "@/lib/constants";
import { filterProperties, parseFilters } from "@/lib/search";
import { getPublishedProperties, getSettings } from "@/lib/store";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const settings = getSettings();
  const filters = parseFilters(params);
  const all = getPublishedProperties();
  const filtered = filterProperties(all, filters);
  const view = filters.view || settings.defaultListingLayout;
  const page = filters.page || 1;
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice =
    view === "map" ? filtered : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const cities = Array.from(new Set(all.map((item) => item.location.city))).sort((a, b) =>
    a.localeCompare(b, "tr"),
  );

  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    const v = Array.isArray(value) ? value[0] : value;
    if (v) qs.set(key, v);
  });

  return (
    <div className="container-wide py-10">
      <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">Portföy</p>
      <h1 className="mt-2 font-serif text-4xl">İlanlar</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Durum, tip, fiyat, oda ve konum filtreleriyle arayın. Arsa kartlarında m² ve imar bilgisi; konutlarda oda ve banyo yer alır.
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-md border border-line bg-white p-4">
          <Suspense fallback={<p className="text-sm text-muted">Filtreler yükleniyor…</p>}>
            <ListingFilters cities={cities} />
          </Suspense>
        </aside>
        <div className="space-y-5">
          <Suspense fallback={<p className="text-sm text-muted">Araç çubuğu…</p>}>
            <ListingToolbar total={filtered.length} defaultView={settings.defaultListingLayout} />
          </Suspense>
          {view === "map" ? (
            <MapBoard properties={filtered} />
          ) : (
            <div className={view === "list" ? "grid gap-4" : "grid gap-5 md:grid-cols-2"}>
              {slice.map((property) => (
                <PropertyCard key={property.id} layout={view === "list" ? "list" : "grid"} property={property} />
              ))}
            </div>
          )}
          {filtered.length === 0 ? (
            <p className="rounded-md border border-dashed border-line p-8 text-center text-muted">
              Bu kriterlere uygun ilan yok. Filtreleri sadeleştirmeyi deneyin.
            </p>
          ) : null}
          {view !== "map" && pages > 1 ? (
            <nav className="flex flex-wrap gap-2" aria-label="Sayfalar">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => {
                const next = new URLSearchParams(qs);
                next.set("page", String(n));
                return (
                  <Link
                    key={n}
                    href={`/ilanlar?${next.toString()}`}
                    className={`min-h-11 min-w-11 rounded-md px-3 py-2 text-center text-sm font-semibold ${
                      n === page ? "bg-navy text-white" : "border border-line bg-white"
                    }`}
                  >
                    {n}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}
