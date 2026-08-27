import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { NAV_LINKS } from "@/lib/constants";
import { telLink } from "@/lib/format";
import { NewsletterForm } from "@/components/public/NewsletterForm";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-16 bg-navy text-white">
      <div className="container-wide grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-2xl">{settings.agencyName}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{settings.footerText}</p>
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">Ofis</p>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {settings.address}
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={telLink(settings.phone)}>{settings.phone}</a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </li>
            <li>{settings.workingHours}</li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">Bağlantılar</p>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link className="text-white/80 hover:text-gold" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="text-white/80 hover:text-gold" href="/admin">
                Yönetim
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">Bülten</p>
          <p className="mt-4 text-sm text-white/70">Yeni ilanları e-posta ile alın. Liste yalnızca ofis içinde tutulur.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {settings.agencyName}. Tek ofis, çok kiracılı platform değildir.
      </div>
    </footer>
  );
}
