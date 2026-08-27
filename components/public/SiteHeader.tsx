"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/types";
import { NAV_LINKS } from "@/lib/constants";
import { cn, telLink, whatsappLink } from "@/lib/format";
import { HeroSearch } from "@/components/public/HeroSearch";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const transparentHome = settings.headerStyle === "transparent" && pathname === "/";
  const solid = !transparentHome || scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <div
        className={cn(
          "hidden border-b text-xs sm:block",
          solid ? "border-line bg-navy text-white/80" : "border-transparent bg-black/20 text-white/80",
        )}
      >
        <div className="container-wide flex h-9 items-center justify-between">
          <p>
            {settings.email} · {settings.workingHours}
          </p>
          <a className="hover:text-gold" href={telLink(settings.phone)}>
            {settings.phone}
          </a>
        </div>
      </div>
      <header
        className={cn(
          "sticky top-0 z-50 transition-colors duration-300",
          solid ? "border-b border-line bg-white/95 text-navy shadow-sm backdrop-blur" : "bg-transparent text-white",
        )}
      >
        <div className="container-wide flex h-[72px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold font-serif text-lg text-navy">
              {settings.logoMark}
            </span>
            <span className="leading-tight">
              <span className="block font-serif text-xl">{settings.logoText}</span>
              <span className={cn("block text-[11px] tracking-[0.14em] uppercase", solid ? "text-muted" : "text-white/70")}>
                Gayrimenkul
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Ana menü">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold tracking-wide",
                    active ? "text-gold" : solid ? "text-navy hover:text-gold" : "text-white hover:text-gold",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={cn("btn h-11 w-11 px-0", solid ? "btn-outline" : "border border-white/40 bg-white/10 text-white")}
              aria-label="Arama"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </button>
            <a
              href={whatsappLink(settings.whatsapp, "Merhaba, portföyünüz hakkında bilgi almak istiyorum.")}
              className="btn btn-gold hidden sm:inline-flex"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a href={telLink(settings.phone)} className="btn btn-navy hidden md:inline-flex" aria-label="Telefon">
              <Phone className="h-4 w-4" />
              Ara
            </a>
            <button
              type="button"
              className={cn("btn h-11 w-11 px-0 lg:hidden", solid ? "btn-outline" : "border border-white/40 text-white")}
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-line bg-white px-4 py-4 text-navy lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobil menü">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-md px-3 py-3 text-base font-semibold hover:bg-cream">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={telLink(settings.phone)} className="btn btn-navy">
                Ara
              </a>
              <a
                href={whatsappLink(settings.whatsapp)}
                className="btn btn-gold"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>
        ) : null}
      </header>
      {searchOpen ? (
        <div className="fixed inset-0 z-[60] bg-navy/70 p-4 backdrop-blur-sm" role="dialog" aria-label="İlan ara">
          <div className="container-wide mt-16 rounded-md bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl">İlan ara</h2>
              <button type="button" className="btn btn-outline h-11 w-11 px-0" aria-label="Kapat" onClick={() => setSearchOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <HeroSearch compact />
          </div>
        </div>
      ) : null}
    </>
  );
}
