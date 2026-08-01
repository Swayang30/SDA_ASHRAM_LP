import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AshramDetailView from "@/components/detail/AshramDetailView";
import { ashrams, ashramBySlug } from "@/data/site";

// Pre-render one page per ashram at build time.
export function generateStaticParams() {
  return ashrams.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = ashramBySlug[slug];
  if (!item) return {};
  return {
    title: item.name,
    description:
      item.blurb ??
      `${item.name} — ${item.location}. Established ${item.establishedYear}.`,
  };
}

export default async function AshramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = ashramBySlug[slug];
  if (!item) notFound();
  return <AshramDetailView item={item} />;
}
