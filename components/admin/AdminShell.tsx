import type { ReactNode } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

const links = [
  { href: "/admin", label: "Özet" },
  { href: "/admin/ilanlar", label: "İlanlar" },
  { href: "/admin/ilanlar/yeni", label: "Yeni ilan" },
  { href: "/admin/talepler", label: "Talepler" },
  { href: "/admin/ayarlar", label: "Ayarlar" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-white">
        <div className="container-wide flex h-16 items-center justify-between gap-4">
          <Link href="/admin" className="font-serif text-xl">
            Yönetim
          </Link>
          <nav className="hidden gap-4 text-sm font-semibold md:flex" aria-label="Yönetim">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-gold-dark">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-sm font-semibold">
              Site
            </Link>
            <LogoutButton />
          </div>
        </div>
        <nav className="container-wide flex gap-3 overflow-x-auto pb-3 text-sm font-semibold md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap rounded-md bg-cream px-3 py-2">
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="container-wide py-8">{children}</div>
    </div>
  );
}
