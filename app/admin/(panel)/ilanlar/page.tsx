import Link from "next/link";
import { statusLabel, typeLabel } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { getProperties } from "@/lib/store";

export default function AdminListingsPage() {
  const properties = getProperties();
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl">İlanlar</h1>
        <Link href="/admin/ilanlar/yeni" className="btn btn-gold">
          Yeni ilan
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-md bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Başlık</th>
              <th className="px-4 py-3">Tip</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Fiyat</th>
              <th className="px-4 py-3">Yayın</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((item) => (
              <tr key={item.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/ilanlar/${item.id}`} className="font-semibold hover:text-gold-dark">
                    {item.title}
                  </Link>
                </td>
                <td className="px-4 py-3">{typeLabel(item.type)}</td>
                <td className="px-4 py-3">{statusLabel(item.status)}</td>
                <td className="px-4 py-3">{formatPrice(item.price)}</td>
                <td className="px-4 py-3">{item.published ? "Açık" : "Kapalı"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
