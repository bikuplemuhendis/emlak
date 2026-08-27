import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-narrow py-24 text-center">
      <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">404</p>
      <h1 className="mt-2 font-serif text-4xl">Sayfa bulunamadı</h1>
      <p className="mt-3 text-muted">Aradığınız ilan yayından kalkmış veya adres değişmiş olabilir.</p>
      <Link href="/ilanlar" className="btn btn-navy mt-8">
        İlanlara dön
      </Link>
    </div>
  );
}
