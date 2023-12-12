import { api } from "@/lib/trpc/api";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
  const p = await api.pages.getPageBySlugWithLinks.query({ slug: params.slug });
  if (p.length === 0) return notFound();
  const page = p[0].pages;
  if (page.public === false) return <main>This page is not public.</main>;
  const links = p.map((pageLinks) => pageLinks.page_links);
  return (
    <main>
      <pre>{JSON.stringify(p, null, 2)}</pre>
    </main>
  );
}
