// src/app/mrrobotto/cursos/[slug]/page.tsx
import { notFound } from "next/navigation";
import { CURSOS_PREMIUM_MRROBOTTO } from "@/data/mrrobottoData";
import { CoursePlayerClient } from "@/components/mrrobotto/CoursePlayerClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CURSOS_PREMIUM_MRROBOTTO.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const curso = CURSOS_PREMIUM_MRROBOTTO.find((c) => c.slug === slug);
  if (!curso) return { title: "Curso no encontrado" };

  return {
    title: `${curso.titulo} — Curso con Certificación DC-3`,
    description: curso.descripcionCorta,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const curso = CURSOS_PREMIUM_MRROBOTTO.find((c) => c.slug === slug);

  if (!curso) {
    notFound();
  }

  return <CoursePlayerClient curso={curso} />;
}
