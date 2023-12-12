import PageLinkList from "@/components/pageLinks/PageLinkList";
import NewPageLinkModal from "@/components/pageLinks/PageLinkModal";
import { getPageLinks } from "@/lib/api/pageLinks/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function PageLinks() {
  await checkAuth();
  const { pageLinks } = await getPageLinks();  

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Page Links</h1>
        <NewPageLinkModal />
      </div>
      <PageLinkList pageLinks={pageLinks} />
    </main>
  );
}
