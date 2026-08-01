import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProgramDetailView from "@/components/detail/ProgramDetailView";
import { programs, programBySlug } from "@/data/site";

// Pre-render one page per programme at build time.
export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = programBySlug[slug];
  if (!item) return {};
  return { title: item.title, description: item.summary };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const i = programs.findIndex((p) => p.slug === slug);
  if (i === -1) notFound();

  // Wrap around so the set is always navigable from any page.
  const prev = programs[(i - 1 + programs.length) % programs.length];
  const next = programs[(i + 1) % programs.length];

  return <ProgramDetailView item={programs[i]} prev={prev} next={next} />;
}
