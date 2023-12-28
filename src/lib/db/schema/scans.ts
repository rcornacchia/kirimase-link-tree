import { varchar, integer, boolean, timestamp, serial, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/lib/db/schema/auth";
import { getScans } from "@/lib/api/scans/queries";

export const scans = pgTable('scans', {
  id: serial("id").primaryKey(),
  responseBody: varchar("response_body", { length: 256 }).notNull(),
  responseStatusCode: integer("response_status_code").notNull(),
  isAvailable: boolean("is_available").notNull(),
  createdAt: timestamp("created_at").notNull(),
  userId: varchar("user_id", { length: 256 }).references(() => users.id, { onDelete: "cascade" }).notNull(),
}, (scans) => {
  return {
    createdAtIndex: uniqueIndex('created_at_idx').on(scans.createdAt),
  }
});


// Schema for scans - used to validate API requests
export const insertScanSchema = createInsertSchema(scans);

export const insertScanParams = createSelectSchema(scans, {
  responseStatusCode: z.coerce.number(),
  isAvailable: z.coerce.boolean(),
  createdAt: z.coerce.string()
}).omit({ 
  id: true,
  userId: true
});

export const updateScanSchema = createSelectSchema(scans);

export const updateScanParams = createSelectSchema(scans,{
  responseStatusCode: z.coerce.number(),
  isAvailable: z.coerce.boolean(),
  createdAt: z.coerce.string()
}).omit({ 
  userId: true
});

export const scanIdSchema = updateScanSchema.pick({ id: true });

// Types for scans - used to type API request params and within Components
export type Scan = z.infer<typeof updateScanSchema>;
export type NewScan = z.infer<typeof insertScanSchema>;
export type NewScanParams = z.infer<typeof insertScanParams>;
export type UpdateScanParams = z.infer<typeof updateScanParams>;
export type ScanId = z.infer<typeof scanIdSchema>["id"];
    
// this type infers the return from getScans() - meaning it will include any joins
export type CompleteScan = Awaited<ReturnType<typeof getScans>>["scans"][number];

