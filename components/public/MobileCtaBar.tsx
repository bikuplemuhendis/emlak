"use client";

import { Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { telLink, whatsappLink } from "@/lib/format";

export function MobileCtaBar({ settings }: { settings: SiteSettings }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-white/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg sm:hidden">
      <a href={telLink(settings.phone)} className="btn btn-navy">
        <Phone className="h-4 w-4" />
        Ara
      </a>
      <a
        href={whatsappLink(settings.whatsapp, "Merhaba, ilanlarınız hakkında bilgi almak istiyorum.")}
        className="btn btn-gold"
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>
    </div>
  );
}
