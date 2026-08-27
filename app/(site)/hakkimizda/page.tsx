import Image from "next/image";
import Link from "next/link";
import { getPublishedProperties, getSettings } from "@/lib/store";

export default function AboutPage() {
  const settings = getSettings();
  const count = getPublishedProperties().length;
  return (
    <div>
      <div className="bg-navy py-16 text-white">
        <div className="container-wide">
          <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">Ofis</p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Hakkımızda</h1>
          <p className="mt-4 max-w-2xl text-white/75">{settings.tagline}</p>
        </div>
      </div>
      <div className="container-narrow py-14">
        <h2 className="font-serif text-3xl">{settings.agencyName}</h2>
        <p className="mt-4 leading-relaxed text-navy/85">
          {settings.agencyName} çok kiracılı bir ilan pazaryeri değildir. Nişantaşı’ndaki tek ofisten, yerinde görülen
          konut, villa, arsa ve ticari portföyü yönetiriz. İlan metinleri, fotoğraflar ve imar özetleri ofis olarak
          hazırlanır; her kartta tipine göre farklı bir detay şablonu kullanılır.
        </p>
        <p className="mt-4 leading-relaxed text-navy/85">
          Bugün yayında {count} ilan vardır. Satılık konutlarda kredi uygunluğu, kiralıklarda aylık bedel ve depozito
          açıkça yazılır. Arsa ilanlarında ada/parsel ve KAKS bilgisi, dairelerde kat ve aidat bilgisi ayrı şablonlarda
          durur.
        </p>
        <blockquote className="mt-8 border-l-4 border-gold pl-4 text-lg italic text-navy/80">
          {settings.footerText}
        </blockquote>
        <div className="mt-10 overflow-hidden rounded-md">
          <div className="relative aspect-[16/8]">
            <Image src={settings.heroImage} alt="Ofis ve şehir" fill className="object-cover" sizes="800px" />
          </div>
        </div>
        <Link href="/ofis" className="btn btn-navy mt-8">
          Danışmanla tanışın
        </Link>
      </div>
    </div>
  );
}
