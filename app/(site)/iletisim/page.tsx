import { InquiryForm } from "@/components/public/InquiryForm";
import { getSettings } from "@/lib/store";
import { telLink, whatsappLink } from "@/lib/format";

export default function ContactPage() {
  const settings = getSettings();
  return (
    <div className="container-wide grid gap-10 py-14 lg:grid-cols-2">
      <div>
        <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">İletişim</p>
        <h1 className="mt-2 font-serif text-4xl">Ofise yazın</h1>
        <p className="mt-3 text-muted">Görüntüleme, fiyat ve tapu soruları aynı gün içinde dönüş alır.</p>
        <ul className="mt-8 space-y-3 text-sm">
          <li>
            <strong>Adres: </strong>
            {settings.address}
          </li>
          <li>
            <strong>Telefon: </strong>
            <a href={telLink(settings.phone)}>{settings.phone}</a>
          </li>
          <li>
            <strong>WhatsApp: </strong>
            <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noreferrer">
              Mesaj gönder
            </a>
          </li>
          <li>
            <strong>E-posta: </strong>
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          </li>
          <li>
            <strong>Saatler: </strong>
            {settings.workingHours}
          </li>
        </ul>
      </div>
      <div className="rounded-md border border-line bg-white p-6">
        <InquiryForm source="contact" />
      </div>
    </div>
  );
}
