// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { githubRouter } from "./github";
import { roomRouter } from "./room";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("github.", githubRouter)
  .merge("auth.", authRouter)
  .merge("rooms.", roomRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
