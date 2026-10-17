// src/app/mrrobotto/tutoriales/[slug]/page.tsx
import { notFound } from "next/navigation";
import { TUTORIALES_MODULOS } from "@/data/mrrobottoData";
import { TutorialDetailClient } from "@/components/mrrobotto/TutorialDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TUTORIALES_MODULOS.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tutorial = TUTORIALES_MODULOS.find((t) => t.slug === slug);
  if (!tutorial) return { title: "Módulo no encontrado" };

  return {
    title: `${tutorial.nombre} — Tutorial y Conexión Arduino`,
    description: tutorial.subtitulo,
  };
}

export default async function TutorialDetailPage({ params }: Props) {
  const { slug } = await params;
  const tutorial = TUTORIALES_MODULOS.find((t) => t.slug === slug);

  if (!tutorial) {
    notFound();
  }

  return <TutorialDetailClient tutorial={tutorial} />;
}
