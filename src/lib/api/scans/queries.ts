import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type ScanId, scanIdSchema, scans } from "@/lib/db/schema/scans";

export const getScans = async () => {
  const { session } = await getUserAuth();
  const s = await db.select().from(scans).where(eq(scans.userId, session?.user.id!));
  return { scans: s };
};

export const getScanById = async (id: ScanId) => {
  const { session } = await getUserAuth();
  const { id: scanId } = scanIdSchema.parse({ id });
  const [s] = await db.select().from(scans).where(and(eq(scans.id, scanId), eq(scans.userId, session?.user.id!)));
  return { scan: s };
};

