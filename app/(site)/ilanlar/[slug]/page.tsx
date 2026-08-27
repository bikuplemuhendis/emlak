import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { PropertyGallery } from "@/components/public/PropertyGallery";
import { PropertyCard } from "@/components/public/PropertyCard";
import { InquiryPanel, TypeTemplate, FeaturesList } from "@/components/listings/TypeTemplates";
import { typeLabel } from "@/lib/constants";
import { locationLine } from "@/lib/format";
import { getPropertyBySlug, getPublishedProperties, getSettings } from "@/lib/store";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) notFound();
  const settings = getSettings();
  const similar = getPublishedProperties()
    .filter((item) => item.id !== property.id && (item.type === property.type || item.location.city === property.location.city))
    .slice(0, 3);

  return (
    <div className="container-wide py-10">
      <nav className="text-sm text-muted" aria-label="Sayfa yolu">
        <Link href="/">Anasayfa</Link>
        <span> / </span>
        <Link href="/ilanlar">İlanlar</Link>
        <span> / </span>
        <span className="text-navy">{property.title}</span>
      </nav>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-gold uppercase">{typeLabel(property.type)}</p>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl">{property.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-muted">
            <MapPin className="h-4 w-4" />
            {locationLine(property)} · {property.location.address}
          </p>
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <PropertyGallery images={property.images} title={property.title} />
          <TypeTemplate property={property} />
          <section className="mt-8">
            <h2 className="font-serif text-2xl">Açıklama</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-navy/85">{property.description}</p>
          </section>
          <FeaturesList property={property} />
        </div>
        <InquiryPanel property={property} settings={settings} />
      </div>
      {similar.length ? (
        <section className="mt-14">
          <h2 className="font-serif text-3xl">Benzer ilanlar</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {similar.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
