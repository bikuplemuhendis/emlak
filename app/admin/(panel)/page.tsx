import Link from "next/link";
import { formatNumber } from "@/lib/format";
import { getInquiries, getProperties } from "@/lib/store";

export default function AdminHomePage() {
  const properties = getProperties();
  const inquiries = getInquiries();
  const published = properties.filter((item) => item.published).length;
  const sale = properties.filter((item) => item.status === "satilik").length;
  const rent = properties.filter((item) => item.status === "kiralik").length;

  return (
    <div>
      <h1 className="font-serif text-3xl">Özet</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Toplam ilan", formatNumber(properties.length)],
          ["Yayında", formatNumber(published)],
          ["Satılık", formatNumber(sale)],
          ["Kiralık", formatNumber(rent)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md bg-white p-5 card-shadow">
            <p className="text-xs font-bold tracking-widest text-muted uppercase">{label}</p>
            <p className="mt-2 font-serif text-4xl">{value}</p>
          </div>
        ))}
      </div>
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Son talepler</h2>
          <Link href="/admin/talepler" className="text-sm font-semibold">
            Tümü
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-line rounded-md bg-white">
          {inquiries.slice(0, 5).map((item) => (
            <li key={item.id} className="p-4">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-muted">{item.message}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
