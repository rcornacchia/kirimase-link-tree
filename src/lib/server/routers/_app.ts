import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { accountRouter } from "./account";
import { pagesRouter } from "./pages";
import { pageLinksRouter } from "./pageLinks";
import { scansRouter } from "./scans";

export const appRouter = router({
  computers: computersRouter,
  account: accountRouter,
  pages: pagesRouter,
  pageLinks: pageLinksRouter,
  scans: scansRouter,
});

export type AppRouter = typeof appRouter;
