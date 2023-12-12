import PageList from "@/components/pages/PageList";
import NewPageModal from "@/components/pages/PageModal";
import { getPages } from "@/lib/api/pages/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function Pages() {
  await checkAuth();
  const { pages } = await getPages();  

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Pages</h1>
        <NewPageModal />
      </div>
      <PageList pages={pages} />
    </main>
  );
}
