import { roomRouter } from "./subroutes/room";
import { t } from "./trpc";

export const appRouter = t.router({
  rooms: roomRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
