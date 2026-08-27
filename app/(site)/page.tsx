import Image from "next/image";
import Link from "next/link";
import { Building2, Landmark, KeyRound, Quote } from "lucide-react";
import { HeroSearch } from "@/components/public/HeroSearch";
import { PropertyCard } from "@/components/public/PropertyCard";
import { PROPERTY_TYPES } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import { getPublishedProperties, getSettings, typeCounts } from "@/lib/store";

const testimonials = [
  {
    name: "Ayşe Karahan",
    role: "Alıcı · Beşiktaş",
    quote:
      "Nişantaşı dairesini tapu günü dahil şeffaf yönettiniz. Aidat ve iskan dosyası eksiksiz geldi.",
  },
  {
    name: "Kerem Uysal",
    role: "Yatırımcı · Silivri",
    quote: "Arsa imar lejantını ofiste satır satır açtınız. Emsal hesabı netti, sürpriz çıkmadı.",
  },
  {
    name: "Deniz Aksoy",
    role: "Kiracı · Kadıköy",
    quote: "Moda’daki kiralık daireyi aynı gün gördük, depozito ve demirbaş listesi yazılıydı.",
  },
];

export default function HomePage() {
  const settings = getSettings();
  const properties = getPublishedProperties();
  const featured = properties.filter((item) => item.featured).slice(0, 6);
  const latest = [...properties]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6);
  const counts = typeCounts(properties);
  const { sections } = settings;

  return (
    <>
      <section className="relative min-h-[92vh] overflow-hidden">
        <Image
          src={settings.heroImage}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/55 to-navy/25" />
        <div className="relative container-wide flex min-h-[92vh] flex-col justify-end gap-8 pb-16 pt-36 text-white">
          <p className="text-xs font-bold tracking-[0.22em] text-gold uppercase">{settings.tagline}</p>
          <h1 className="max-w-3xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">{settings.heroTitle}</h1>
          <p className="max-w-2xl text-base text-white/85 sm:text-lg">{settings.heroSubtitle}</p>
          <HeroSearch />
        </div>
      </section>

      {sections.types ? (
        <section className="container-wide py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">Portföy</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Mülk tipleri</h2>
            </div>
            <Link href="/ilanlar" className="hidden text-sm font-semibold underline-offset-4 hover:underline sm:inline">
              Tüm ilanlar
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {PROPERTY_TYPES.map((item) => (
              <Link
                key={item.value}
                href={`/ilanlar?type=${item.value}`}
                className="rounded-md border border-line bg-white p-4 text-center card-shadow hover:border-gold"
              >
                <p className="font-serif text-xl">{item.label}</p>
                <p className="mt-1 text-xs text-muted">{item.blurb}</p>
                <p className="mt-3 text-sm font-semibold text-gold-dark">{counts[item.value] ?? 0} ilan</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {sections.featured ? (
        <section className="bg-cream py-16">
          <div className="container-wide">
            <div className="mb-8">
              <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">Seçilmiş</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Öne çıkan ilanlar</h2>
            </div>
            <div className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-3">
              {featured.map((property) => (
                <div key={property.id} className="min-w-[280px] snap-start md:min-w-0">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {sections.stats ? (
        <section className="container-wide grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Landmark, value: "12+", label: "Yıllık ofis deneyimi" },
            { icon: KeyRound, value: formatNumber(properties.length), label: "Aktif ilan" },
            { icon: Building2, value: "6", label: "Şehirde portföy" },
            { icon: Quote, value: "%98", label: "Yerinde görülen ilan" },
          ].map((item) => (
            <div key={item.label} className="rounded-md border border-line bg-white p-6">
              <item.icon className="h-5 w-5 text-gold" />
              <p className="mt-4 font-serif text-4xl">{item.value}</p>
              <p className="mt-1 text-sm text-muted">{item.label}</p>
            </div>
          ))}
        </section>
      ) : null}

      {sections.latest ? (
        <section className="container-wide py-8 pb-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-3xl sm:text-4xl">Son eklenenler</h2>
            <Link href="/ilanlar?sort=newest" className="text-sm font-semibold underline-offset-4 hover:underline">
              Tümünü gör
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      ) : null}

      {sections.testimonials ? (
        <section className="bg-navy py-16 text-white">
          <div className="container-wide">
            <h2 className="font-serif text-3xl sm:text-4xl">Müvekkil notları</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {testimonials.map((item) => (
                <blockquote key={item.name} className="rounded-md bg-white/5 p-6 ring-1 ring-white/10">
                  <p className="text-sm leading-relaxed text-white/85">“{item.quote}”</p>
                  <footer className="mt-4 text-sm">
                    <cite className="not-italic font-semibold text-gold">{item.name}</cite>
                    <p className="text-white/50">{item.role}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {sections.cta ? (
        <section className="container-wide py-16">
          <div className="overflow-hidden rounded-md bg-cream px-6 py-12 md:flex md:items-center md:justify-between md:px-12">
            <div>
              <h2 className="font-serif text-3xl">Mülkünüzü ofis portföyüne alın</h2>
              <p className="mt-2 max-w-xl text-muted">
                Fotoğraf, tapu özeti ve fiyat etüdü ile ilanınızı hazırlarız. Çok ofisli bir pazaryeri değil; tek danışman ekibi.
              </p>
            </div>
            <Link href="/iletisim" className="btn btn-navy mt-6 md:mt-0">
              Ofisle görüşün
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
