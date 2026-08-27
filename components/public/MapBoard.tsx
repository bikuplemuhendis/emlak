import Link from "next/link";
import type { Property } from "@/lib/types";
import { formatPrice, locationLine } from "@/lib/format";
import { typeLabel } from "@/lib/constants";

function pinPosition(property: Property) {
  const x = ((property.location.lng - 26) / (33 - 26)) * 100;
  const y = ((42 - property.location.lat) / (42 - 36)) * 100;
  return {
    left: `${Math.min(92, Math.max(6, x))}%`,
    top: `${Math.min(90, Math.max(8, y))}%`,
  };
}

export function MapBoard({ properties }: { properties: Property[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="relative min-h-[420px] overflow-hidden rounded-md bg-[linear-gradient(160deg,#d7e3d4_0%,#cfd9c8_40%,#e8efe4_100%)] ring-1 ring-line">
        <div className="absolute inset-6 rounded-md border border-dashed border-navy/20" />
        <p className="absolute left-4 top-4 rounded-md bg-white/90 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
          Türkiye · stilize harita
        </p>
        {properties.map((property) => (
          <Link
            key={property.id}
            href={`/ilanlar/${property.slug}`}
            style={pinPosition(property)}
            className="absolute -translate-x-1/2 -translate-y-full rounded-md bg-navy px-2 py-1 text-[10px] font-bold text-white shadow"
            title={property.title}
          >
            {formatPrice(property.price)}
          </Link>
        ))}
      </div>
      <ul className="max-h-[420px] space-y-2 overflow-auto">
        {properties.map((property) => (
          <li key={property.id}>
            <Link href={`/ilanlar/${property.slug}`} className="block rounded-md border border-line bg-white p-3 hover:border-gold">
              <p className="text-sm font-semibold">{property.title}</p>
              <p className="text-xs text-muted">
                {typeLabel(property.type)} · {locationLine(property)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
