import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Property } from "@/lib/types";
import { statusLabel, typeLabel } from "@/lib/constants";
import { cardMeta, cn, formatPrice, locationLine, priceCaption } from "@/lib/format";

export function PropertyCard({
  property,
  layout = "grid",
}: {
  property: Property;
  layout?: "grid" | "list";
}) {
  const meta = cardMeta(property);
  const image = property.images[0];

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-md bg-white card-shadow",
        layout === "list" ? "grid md:grid-cols-[280px_1fr]" : "flex flex-col",
      )}
    >
      <Link href={`/ilanlar/${property.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-cream">
        {image ? (
          <Image
            src={image}
            alt={property.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
        <div className="absolute inset-x-3 top-3 flex flex-wrap gap-1.5">
          <span className="badge bg-navy text-white">{statusLabel(property.status)}</span>
          <span className="badge bg-white/90 text-navy">{typeLabel(property.type)}</span>
          {property.featured ? <span className="badge bg-gold text-navy">Öne çıkan</span> : null}
          {property.isNew ? <span className="badge bg-white text-navy">Yeni</span> : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-serif text-2xl text-navy">
          {formatPrice(property.price)}
          <span className="ml-2 font-sans text-xs font-semibold tracking-wide text-muted uppercase">
            {priceCaption(property)}
          </span>
        </p>
        <h3 className="mt-2 font-serif text-xl leading-snug">
          <Link href={`/ilanlar/${property.slug}`} className="hover:text-gold-dark">
            {property.title}
          </Link>
        </h3>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-muted">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          {locationLine(property)}
        </p>
        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="text-[10px] font-bold tracking-widest text-muted uppercase">{item.label}</dt>
              <dd className="mt-1 text-sm font-semibold">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
