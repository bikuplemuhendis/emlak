import Image from "next/image";
import { InquiryForm } from "@/components/public/InquiryForm";
import { PropertyCard } from "@/components/public/PropertyCard";
import { getPublishedProperties, getSettings } from "@/lib/store";
import { telLink, whatsappLink } from "@/lib/format";

export default function OfficePage() {
  const settings = getSettings();
  const listings = getPublishedProperties().slice(0, 6);
  return (
    <div className="container-wide py-14">
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside>
          <div className="relative aspect-[3/4] overflow-hidden rounded-md">
            <Image src={settings.agent.photo} alt={settings.agent.name} fill className="object-cover" sizes="280px" />
          </div>
          <h1 className="mt-4 font-serif text-3xl">{settings.agent.name}</h1>
          <p className="text-sm text-muted">{settings.agent.title}</p>
          <p className="mt-2 text-sm">{settings.agencyName}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a className="btn btn-navy" href={telLink(settings.phone)}>
              Ara
            </a>
            <a className="btn btn-gold" href={whatsappLink(settings.whatsapp)} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </aside>
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">Danışman</p>
          <h2 className="mt-2 font-serif text-4xl">Ofis ve portföy</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-navy/85">{settings.agent.bio}</p>
          <p className="mt-4 text-sm text-muted">{settings.address}</p>
          <div className="mt-8 max-w-xl rounded-md border border-line bg-white p-5">
            <h3 className="font-serif text-2xl">Danışmana yazın</h3>
            <InquiryForm source="office" />
          </div>
        </div>
      </div>
      <section className="mt-14">
        <h2 className="font-serif text-3xl">Danışmanın ilanları</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((item) => (
            <PropertyCard key={item.id} property={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
