import { t } from "../trpc";

export const timedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const start = Date.now();
  const result = await next({ ctx });
  console.info(`${ctx.req?.method} ${ctx.req?.url} ${Date.now() - start}ms`);
  return result;
});
