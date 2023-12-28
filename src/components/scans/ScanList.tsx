"use client";
import { CompleteScan } from "@/lib/db/schema/scans";
import { trpc } from "@/lib/trpc/client";
import ScanModal from "./ScanModal";


export default function ScanList({ scans }: { scans: CompleteScan[] }) {
  const { data: s } = trpc.scans.getScans.useQuery(undefined, {
    initialData: { scans },
    refetchOnMount: false,
  });

  if (s.scans.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {s.scans.map((scan) => (
        <Scan scan={scan} key={scan.id} />
      ))}
    </ul>
  );
}

const Scan = ({ scan }: { scan: CompleteScan }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{scan.responseBody}</div>
      </div>
      <ScanModal scan={scan} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No scans</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new scan.
      </p>
      <div className="mt-6">
        <ScanModal emptyState={true} />
      </div>
    </div>
  );
};

