"use client";

import { useState } from "react";
import { submitFeedback } from "@/app/actions";

const LABELS = ["", "Juda yomon", "Yomon", "O'rtacha", "Yaxshi", "A'lo"];

export function FeedbackForm({ courseId, back, initial }: { courseId: string; back: string; initial?: { rating: number; comment: string | null } }) {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [hover, setHover] = useState(0);
  const shown = hover || rating;

  return (
    <form action={submitFeedback} className="mx-auto mt-6 max-w-md rounded-2xl bg-white p-5 text-left shadow-sm">
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="back" value={back} />
      <input type="hidden" name="rating" value={rating} />
      <p className="text-center font-bold">Kurs sizga yoqdimi?</p>
      <p className="text-center text-xs text-ink/60">Fikringiz kurslarni yaxshilashga yordam beradi</p>
      <div className="mt-3 flex justify-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} yulduz`}
            onMouseEnter={() => setHover(n)}
            onClick={() => setRating(n)}
            className={`text-4xl transition hover:scale-110 ${n <= shown ? "text-gold-500" : "text-ink/15"}`}
          >
            ★
          </button>
        ))}
      </div>
      <p className="h-5 text-center text-sm font-semibold text-gold-700">{LABELS[shown]}</p>
      <textarea
        name="comment"
        rows={3}
        maxLength={1000}
        defaultValue={initial?.comment ?? ""}
        placeholder="Izoh (ixtiyoriy): nima yoqdi, nimani yaxshilash kerak?"
        className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none"
      />
      <button disabled={!rating} className="mt-2 w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-40">
        {initial ? "Bahoni yangilash" : "Yuborish"}
      </button>
    </form>
  );
}
