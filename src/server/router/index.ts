// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { githubRouter } from "./github";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("github.", githubRouter)
  .merge("example.", exampleRouter)
  .merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
