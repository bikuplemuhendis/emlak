import { PropertyForm } from "@/components/admin/PropertyForm";

export default function NewListingPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl">Yeni ilan</h1>
      <p className="mt-2 text-sm text-muted">Tip ve durum seçince form alanları ve vitrin şablonu değişir.</p>
      <div className="mt-6 rounded-md bg-white p-5">
        <PropertyForm />
      </div>
    </div>
  );
}
