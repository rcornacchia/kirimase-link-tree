import { db } from "@/lib/db/index.ts";
import { and, eq } from "drizzle-orm";
import { 
  ScanId, 
  NewScanParams,
  UpdateScanParams, 
  updateScanSchema,
  insertScanSchema, 
  scans,
  scanIdSchema 
} from "@/lib/db/schema/scans";
import { getUserAuth } from "@/lib/auth/utils";

export const createScan = async (scan: NewScanParams) => {
  const { session } = await getUserAuth();
  const newScan = insertScanSchema.parse({ ...scan, userId: session?.user.id! });
  try {
    const [s] =  await db.insert(scans).values(newScan).returning();
    return { scan: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateScan = async (id: ScanId, scan: UpdateScanParams) => {
  const { session } = await getUserAuth();
  const { id: scanId } = scanIdSchema.parse({ id });
  const newScan = updateScanSchema.parse({ ...scan, userId: session?.user.id! });
  try {
    const [s] =  await db
     .update(scans)
     .set(newScan)
     .where(and(eq(scans.id, scanId!), eq(scans.userId, session?.user.id!)))
     .returning();
    return { scan: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteScan = async (id: ScanId) => {
  const { session } = await getUserAuth();
  const { id: scanId } = scanIdSchema.parse({ id });
  try {
    const [s] =  await db.delete(scans).where(and(eq(scans.id, scanId!), eq(scans.userId, session?.user.id!)))
    .returning();
    return { scan: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

