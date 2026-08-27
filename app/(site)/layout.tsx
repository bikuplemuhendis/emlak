import { MobileCtaBar } from "@/components/public/MobileCtaBar";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getSettings } from "@/lib/store";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  return (
    <>
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-white focus:px-4 focus:py-2"
      >
        İçeriğe geç
      </a>
      <SiteHeader settings={settings} />
      <main id="icerik" className="pb-20 sm:pb-0">
        {children}
      </main>
      <SiteFooter settings={settings} />
      <MobileCtaBar settings={settings} />
    </>
  );
}
