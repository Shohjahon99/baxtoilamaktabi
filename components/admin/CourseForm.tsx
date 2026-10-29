import type { Course } from "@prisma/client";
import { saveCourse } from "@/app/admin/actions";
import { ImageInput } from "./ImageInput";
import { Card, inputCls } from "./ui";

const COLORS = [
  ["rose", "Pushti"],
  ["gold", "Oltin"],
  ["teal", "Yashil"],
  ["sky", "Moviy"],
  ["violet", "Binafsha"],
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

export function CourseForm({ course }: { course?: Course }) {
  return (
    <form action={saveCourse} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {course && <input type="hidden" name="id" value={course.id} />}
      <Card className="space-y-4">
        <Field label="Kurs nomi *">
          <input name="title" required defaultValue={course?.title} className={inputCls} />
        </Field>
        <Field label="Manzil (slug)" hint="Saytdagi havola: /courses/<slug>. Bo'sh qoldirilsa nomdan yasaladi.">
          <input name="slug" defaultValue={course?.slug} placeholder="ideal-kuyov" className={`${inputCls} font-mono`} />
        </Field>
        <Field label="Kimlar uchun">
          <input name="audience" defaultValue={course?.audience} placeholder="Turmush qurish arafasidagi yigitlar" className={inputCls} />
        </Field>
        <Field label="Qisqa tavsif" hint="Kurs kartochkasida ko'rinadi">
          <textarea name="shortDesc" rows={2} defaultValue={course?.shortDesc} className={inputCls} />
        </Field>
        <Field label="To'liq tavsif (Markdown)" hint="**qalin**, - ro'yxat, > iqtibos, ## sarlavha">
          <textarea name="description" rows={10} defaultValue={course?.description} className={`${inputCls} font-mono text-[13px]`} />
        </Field>
        <Field label="Muqova rasmi">
          <ImageInput name="image" defaultValue={course?.image} />
        </Field>
      </Card>

      <div className="space-y-6">
        <Card className="space-y-4">
          <Field label="Narx (so'm)" hint="0 — bepul kurs">
            <input name="price" type="number" min={0} step={1000} defaultValue={course?.price ?? 0} className={inputCls} />
          </Field>
          <Field label="Holat">
            <select name="status" defaultValue={course?.status ?? "DRAFT"} className={inputCls}>
              <option value="DRAFT">Qoralama (saytda «Tez kunda»)</option>
              <option value="PUBLISHED">Nashr etilgan</option>
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="O'tish bali (0–9)">
              <input name="passingBand" type="number" min={0} max={9} step={0.5} defaultValue={course?.passingBand ?? 5} className={inputCls} />
            </Field>
            <Field label="Imtihon savollari">
              <input name="examSize" type="number" min={1} defaultValue={course?.examSize ?? 20} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Tartib">
              <input name="order" type="number" defaultValue={course?.order ?? 0} className={inputCls} />
            </Field>
            <Field label="Emoji">
              <input name="emoji" defaultValue={course?.emoji ?? "📘"} className={inputCls} />
            </Field>
            <Field label="Rang">
              <select name="color" defaultValue={course?.color ?? "rose"} className={inputCls}>
                {COLORS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </Field>
          </div>
        </Card>
        <button className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700">
          💾 {course ? "Saqlash" : "Kursni yaratish"}
        </button>
      </div>
    </form>
  );
}
