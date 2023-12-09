"use client";
import { CompletePage } from "@/lib/db/schema/pages";
import { trpc } from "@/lib/trpc/client";
import PageModal from "./PageModal";


export default function PageList({ pages }: { pages: CompletePage[] }) {
  const { data: p } = trpc.pages.getPages.useQuery(undefined, {
    initialData: { pages },
    refetchOnMount: false,
  });

  if (p.pages.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {p.pages.map((page) => (
        <Page page={page} key={page.id} />
      ))}
    </ul>
  );
}

const Page = ({ page }: { page: CompletePage }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{page.title}</div>
      </div>
      <PageModal page={page} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No pages</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new page.
      </p>
      <div className="mt-6">
        <PageModal emptyState={true} />
      </div>
    </div>
  );
};

