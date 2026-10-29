import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatSum } from "@/lib/format";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge, Card, PageHeader, PAYMENT_STATUS, Table } from "@/components/admin/ui";
import { cancelPayment, confirmPayment } from "@/app/admin/actions";

export const metadata: Metadata = { title: "To'lovlar" };

const fmt = (d: Date) => d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function PaymentsPage({ searchParams }: PageProps<"/admin/payments">) {
  const { status } = await searchParams;
  const filter = typeof status === "string" && PAYMENT_STATUS[status] ? status : "";
  const [payments, sums] = await Promise.all([
    db.payment.findMany({
      where: filter ? { status: filter } : {},
      orderBy: { createdAt: "desc" },
      take: 300,
      include: { user: true, course: true },
    }),
    db.payment.groupBy({ by: ["status"], _sum: { amount: true }, _count: true }),
  ]);
  const byStatus = Object.fromEntries(sums.map((s) => [s.status, s]));

  return (
    <>
      <PageHeader title="To'lovlar" subtitle="Click to'lovlari avtomatik tasdiqlanadi. Naqd to'lovni qo'lda tasdiqlash mumkin." />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(PAYMENT_STATUS).map(([k, v]) => (
          <Card key={k} className="!p-4">
            <p className="text-xs text-slate-500">{v.label}</p>
            <p className="mt-1 font-bold">{byStatus[k]?._count ?? 0} ta</p>
            <p className="text-xs text-slate-400">{formatSum(byStatus[k]?._sum.amount ?? 0)}</p>
          </Card>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        {[["", "Barchasi"], ...Object.entries(PAYMENT_STATUS).map(([k, v]) => [k, v.label])].map(([k, l]) => (
          <Link key={k} href={k ? `/admin/payments?status=${k}` : "/admin/payments"} className={`rounded-full px-4 py-1.5 ${filter === k ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>
            {l}
          </Link>
        ))}
      </div>
      <Table head={["Sana", "Foydalanuvchi", "Kurs", "Summa", "Click ID", "Holat", ""]} empty={payments.length === 0}>
        {payments.map((p) => (
          <tr key={p.id} className="hover:bg-slate-50">
            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{fmt(p.createdAt)}</td>
            <td className="px-4 py-3">
              <Link href={`/admin/users/${p.userId}`} className="hover:text-brand-600">{p.user.fullName || p.user.firstName}</Link>
              <p className="font-mono text-xs text-slate-400">{p.user.phone}</p>
            </td>
            <td className="px-4 py-3">{p.course.title}</td>
            <td className="whitespace-nowrap px-4 py-3 font-medium">{formatSum(p.amount)}</td>
            <td className="px-4 py-3 font-mono text-xs text-slate-400">{p.clickTransId ?? "—"}</td>
            <td className="px-4 py-3">
              <Badge tone={PAYMENT_STATUS[p.status]?.tone}>{PAYMENT_STATUS[p.status]?.label ?? p.status}</Badge>
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-right">
              {p.status !== "PAID" && p.status !== "CANCELLED" && (
                <span className="inline-flex gap-2">
                  <form action={confirmPayment}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmButton message={`${formatSum(p.amount)} to'lovni qo'lda tasdiqlaysizmi? Kurs ochiladi.`} className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700">
                      ✓ Tasdiqlash
                    </ConfirmButton>
                  </form>
                  <form action={cancelPayment}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmButton message="To'lovni bekor qilasizmi?" className="rounded-lg border border-slate-200 px-3 py-1 text-xs hover:bg-slate-100">Bekor</ConfirmButton>
                  </form>
                </span>
              )}
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
