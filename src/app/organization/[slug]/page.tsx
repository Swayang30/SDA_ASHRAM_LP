import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPageView from "@/components/detail/DetailPageView";
import { organization, organizationBySlug } from "@/data/site";

// Pre-render every Organization detail page at build time.
export function generateStaticParams() {
  return organization.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = organizationBySlug[slug];
  if (!item) return {};
  return { title: item.title, description: item.subtitle };
}

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = organizationBySlug[slug];
  if (!item) notFound();
  return <DetailPageView item={item} />;
}
