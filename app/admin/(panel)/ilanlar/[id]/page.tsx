import { notFound } from "next/navigation";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { getPropertyById } from "@/lib/store";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) notFound();
  return (
    <div>
      <h1 className="font-serif text-3xl">İlanı düzenle</h1>
      <div className="mt-6 rounded-md bg-white p-5">
        <PropertyForm initial={property} />
      </div>
    </div>
  );
}
