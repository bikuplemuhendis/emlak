import { getInquiries, getProperties } from "@/lib/store";

export default function InquiriesPage() {
  const inquiries = getInquiries();
  const properties = getProperties();
  return (
    <div>
      <h1 className="font-serif text-3xl">Talepler</h1>
      <ul className="mt-6 space-y-3">
        {inquiries.map((item) => {
          const listing = properties.find((p) => p.id === item.propertyId);
          return (
            <li key={item.id} className="rounded-md bg-white p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-muted">{new Date(item.createdAt).toLocaleString("tr-TR")}</p>
              </div>
              <p className="text-sm text-muted">
                {item.email} · {item.phone} · {item.source}
                {listing ? ` · ${listing.title}` : ""}
              </p>
              <p className="mt-2 text-sm">{item.message}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
