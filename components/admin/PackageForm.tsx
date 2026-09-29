"use client";
import { useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { packageSchema, type PackageInput } from "@/lib/schemas/package";
import { savePackage, deletePackage } from "@/app/admin/packages/actions";

type Props = { initial?: PackageInput & { id?: string }; onDone?: () => void };

export function PackageForm({ initial, onDone }: Props) {
  const [pending, start] = useTransition();
  const { register, control, handleSubmit, formState: { errors } } = useForm<PackageInput>({
    resolver: zodResolver(packageSchema),
    defaultValues: initial ?? { slug: "", name: "", tagline: "", price: 0, duration: "", features: [""], highlighted: false, active: true, order: 0 },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "features" as never });

  const onSubmit = (values: PackageInput) => start(async () => { await savePackage(values); onDone?.(); });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className="mb-2 block eyebrow">Name</label><input {...register("name")} className="field" /></div>
        <div>
          <label className="mb-2 block eyebrow">Slug</label>
          <input {...register("slug")} className="field" placeholder="signature" />
          {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div><label className="mb-2 block eyebrow">Price (EGP)</label><input type="number" {...register("price")} className="field" /></div>
        <div><label className="mb-2 block eyebrow">Duration</label><input {...register("duration")} className="field" placeholder="8 hours" /></div>
        <div><label className="mb-2 block eyebrow">Sort order</label><input type="number" {...register("order")} className="field" /></div>
      </div>
      <div><label className="mb-2 block eyebrow">Tagline</label><input {...register("tagline")} className="field" /></div>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="eyebrow">Features</label>
          <button type="button" onClick={() => append("" as never)} className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-ink-900 dark:hover:text-ink-50">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((f, i) => (
            <div key={f.id} className="flex items-center gap-2">
              <input {...register(`features.${i}` as const)} className="field" />
              <button type="button" onClick={() => remove(i)} className="rounded-full p-2 text-ink-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("highlighted")} /> Highlighted</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("active")} /> Active</label>
      </div>
      <div className="flex items-center justify-between pt-2">
        {initial?.id && (
          <button type="button" onClick={() => start(async () => { if (confirm("Delete this package?")) { await deletePackage(initial.id!); onDone?.(); } })} className="text-xs uppercase tracking-luxe text-red-500 hover:underline">Delete</button>
        )}
        <button type="submit" disabled={pending} className="btn-primary ml-auto">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : initial?.id ? "Save changes" : "Create package"}
        </button>
      </div>
    </form>
  );
}
