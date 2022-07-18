import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const roomRouter = createRouter()
  .query("get-my-room", {
    async resolve({ ctx }) {
      if (!ctx.session) {
        throw new TRPCError({ message: "You are not signed in", code: "UNAUTHORIZED" });
      }

      const room = await ctx.prisma.room.findFirst({
        where: {
          userId: ctx.session.user?.id
        }
      });

      return room;
    }
  })
  .mutation("create-my-room", {
    async resolve({ ctx }) {
      if (!ctx.session) {
        throw new TRPCError({ message: "You are not signed in", code: "UNAUTHORIZED" });
      }

      const room = await ctx.prisma.room.create({
        data: { userId: ctx.session.user?.id! }
      });

      return room;
    }
  })
  .mutation("submit-estimate", {
    input: z.object({
      roomId: z.string(),
      estimate: z.string()
    }),
    async resolve({ ctx, input }) {
      if (!ctx.session) {
        throw new TRPCError({ message: "You are not signed in", code: "UNAUTHORIZED" });
      }

      const updateRoom = await ctx.prisma.room.update({
        where: {
          id: input.roomId
        },
        data: {
          estimate: {
            upsert: {
              where: {
                userId: ctx.session.user?.id
              },
              create: {
                userId: ctx.session.user?.id!,
                value: input.estimate
              },
              update: {
                value: input.estimate
              }
            }
          }
        },
        include: {
          estimate: true
        }
      });

      console.log(updateRoom);
    }
  })
  .query("get-room-estimates", {
    input: z.object({
      roomId: z.string()
    }),
    async resolve({ ctx, input }) {
      const estimates = await ctx.prisma.estimate.findMany({
        where: {
          roomId: input.roomId
        },
        include: {
          user: true
        }
      });

      return estimates;
    }
  });
