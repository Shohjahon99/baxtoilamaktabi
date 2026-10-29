import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = { title: { default: "Admin", template: "%s — Admin" }, robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 md:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
