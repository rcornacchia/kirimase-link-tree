import { getScanById, getScans } from "@/lib/api/scans/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  scanIdSchema,
  insertScanParams,
  updateScanParams,
} from "@/lib/db/schema/scans";
import { createScan, deleteScan, updateScan } from "@/lib/api/scans/mutations";

export const scansRouter = router({
  getScans: publicProcedure.query(async () => {
    return getScans();
  }),
  getScanById: publicProcedure.input(scanIdSchema).query(async ({ input }) => {
    return getScanById(input.id);
  }),
  createScan: publicProcedure
    .input(insertScanParams)
    .mutation(async ({ input }) => {
      return createScan(input);
    }),
  updateScan: publicProcedure
    .input(updateScanParams)
    .mutation(async ({ input }) => {
      return updateScan(input.id, input);
    }),
  deleteScan: publicProcedure
    .input(scanIdSchema)
    .mutation(async ({ input }) => {
      return deleteScan(input.id);
    }),
});
