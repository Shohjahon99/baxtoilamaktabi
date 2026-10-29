"use client";

import { useState, useTransition } from "react";
import { saveQuestions, type QuestionInput } from "@/app/admin/actions";
import { inputCls } from "./ui";

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const blank = (): QuestionInput => ({ text: "", options: ["", "", "", ""], correct: 0, explanation: "" });

export function QuestionBuilder({ target, initial }: { target: { lessonId?: string; examCourseId?: string }; initial: QuestionInput[] }) {
  const [items, setItems] = useState<QuestionInput[]>(initial);
  const [status, setStatus] = useState<"" | "saved" | "error" | "dirty">("");
  const [pending, start] = useTransition();

  const update = (i: number, patch: Partial<QuestionInput>) => {
    setItems((xs) => xs.map((q, j) => (j === i ? { ...q, ...patch } : q)));
    setStatus("dirty");
  };

  const save = () =>
    start(async () => {
      try {
        setItems(await saveQuestions(target, items));
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    });

  // to'g'ri javob bir xil harfda to'planib qolmasligi uchun ogohlantirish
  const dist = LETTERS.slice(0, 4).map((_, k) => items.filter((q) => q.correct === k).length);
  const skewed = items.length >= 5 && Math.max(...dist) / items.length > 0.5;

  return (
    <div className="space-y-4">
      {items.map((q, i) => (
        <div key={q.id ?? `new-${i}`} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">{i + 1}</span>
            <div className="flex-1 space-y-3">
              <textarea value={q.text} onChange={(e) => update(i, { text: e.target.value })} rows={2} placeholder="Savol matni" className={inputCls} />
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((o, k) => (
                  <label key={k} className={`flex items-center gap-2 rounded-xl border px-2 py-1 ${q.correct === k ? "border-emerald-400 bg-emerald-50" : "border-slate-200"}`}>
                    <input type="radio" checked={q.correct === k} onChange={() => update(i, { correct: k })} className="accent-emerald-600" title="To'g'ri javob" />
                    <span className="text-xs font-bold text-slate-400">{LETTERS[k]}</span>
                    <input
                      value={o}
                      onChange={(e) => update(i, { options: q.options.map((x, m) => (m === k ? e.target.value : x)) })}
                      placeholder={`${LETTERS[k]} variant`}
                      className="w-full bg-transparent py-1.5 text-sm focus:outline-none"
                    />
                  </label>
                ))}
              </div>
              <input value={q.explanation ?? ""} onChange={(e) => update(i, { explanation: e.target.value })} placeholder="Izoh (ixtiyoriy) — javobdan keyin ko'rsatiladi" className={`${inputCls} text-xs`} />
            </div>
            <div className="flex flex-col gap-1">
              <button type="button" disabled={i === 0} onClick={() => { setItems((xs) => { const a = [...xs]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; return a; }); setStatus("dirty"); }} className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30" title="Yuqoriga">↑</button>
              <button type="button" disabled={i === items.length - 1} onClick={() => { setItems((xs) => { const a = [...xs]; [a[i + 1], a[i]] = [a[i], a[i + 1]]; return a; }); setStatus("dirty"); }} className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30" title="Pastga">↓</button>
              <button type="button" onClick={() => { setItems((xs) => xs.filter((_, j) => j !== i)); setStatus("dirty"); }} className="rounded-lg px-2 py-1 text-red-400 hover:bg-red-50" title="O'chirish">✕</button>
            </div>
          </div>
        </div>
      ))}

      {skewed && (
        <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
          ⚠️ To&apos;g&apos;ri javoblarning yarmidan ko&apos;pi bir xil harfda ({LETTERS[dist.indexOf(Math.max(...dist))]}). Taxmin bilan topib olmasliklari uchun aralashtiring.
        </p>
      )}

      <div className="sticky bottom-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
        <button type="button" onClick={() => { setItems((xs) => [...xs, blank()]); setStatus("dirty"); }} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
          + Savol qo&apos;shish
        </button>
        <button type="button" onClick={save} disabled={pending} className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
          {pending ? "Saqlanmoqda..." : "💾 Savollarni saqlash"}
        </button>
        <span className="text-sm text-slate-500">{items.length} ta savol</span>
        {status === "saved" && <span className="text-sm font-medium text-emerald-600">✅ Saqlandi</span>}
        {status === "dirty" && <span className="text-sm text-amber-600">Saqlanmagan o&apos;zgarishlar bor</span>}
        {status === "error" && <span className="text-sm text-red-600">Xato yuz berdi</span>}
      </div>
    </div>
  );
}
