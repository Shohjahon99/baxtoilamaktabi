import type { Metadata } from "next";
import { CourseForm } from "@/components/admin/CourseForm";
import { Notice, PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Yangi kurs" };

export default async function NewCoursePage({ searchParams }: PageProps<"/admin/courses/new">) {
  const { error } = await searchParams;
  return (
    <>
      <PageHeader title="Yangi kurs" subtitle="Avval kurs ma'lumotlarini kiriting, keyin modul, dars va testlar qo'shasiz" back={{ href: "/admin/courses", label: "Kurslar" }} />
      {error === "slug" && <Notice tone="red">Bunday manzil (slug) bilan kurs allaqachon bor.</Notice>}
      {error === "title" && <Notice tone="red">Kurs nomini kiriting.</Notice>}
      <CourseForm />
    </>
  );
}
