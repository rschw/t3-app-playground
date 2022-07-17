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
      const room = await ctx.prisma.room.findFirst({
        where: {
          id: input.roomId
        }
      });

      if (!room) {
        throw new TRPCError({ message: "Room not found", code: "NOT_FOUND" });
      }

      // TODO add estimate for user to room
    }
  });
