import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { accountRouter } from "./account";
import { pagesRouter } from "./pages";

export const appRouter = router({
  computers: computersRouter,
  account: accountRouter,
  pages: pagesRouter,
});

export type AppRouter = typeof appRouter;
