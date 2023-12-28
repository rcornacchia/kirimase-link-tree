import ScanList from "@/components/scans/ScanList";
import NewScanModal from "@/components/scans/ScanModal";
import { getScans } from "@/lib/api/scans/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function Scans() {
  await checkAuth();
  const { scans } = await getScans();  

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Scans</h1>
        <NewScanModal />
      </div>
      <ScanList scans={scans} />
    </main>
  );
}
