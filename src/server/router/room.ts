import { z } from "zod";
import { pusherServerClient } from "../common/pusher";
import { createRouter } from "./context";

export const roomRouter = createRouter()
  .query("get-my-room", {
    input: z.object({
      userId: z.string()
    }),
    async resolve({ ctx, input }) {
      const { userId } = input;

      console.log("get-my-room: " + JSON.stringify(input));

      const room = await ctx.prisma.room.findFirst({
        where: { userId: userId }
      });

      return room;
    }
  })
  .mutation("create-my-room", {
    input: z.object({
      userId: z.string()
    }),
    async resolve({ ctx, input }) {
      const { userId } = input;

      console.log("create-my-room: " + JSON.stringify(input));

      const room = await ctx.prisma.room.create({
        data: { userId: userId }
      });

      return room;
    }
  })
  .mutation("submit-estimate", {
    input: z.object({
      userId: z.string(),
      roomId: z.string(),
      estimate: z.string()
    }),
    async resolve({ ctx, input }) {
      const { userId, roomId, estimate } = input;

      console.log("submit-estimate: " + JSON.stringify(input));

      await ctx.prisma.room.update({
        where: {
          id: roomId
        },
        data: {
          estimate: {
            upsert: {
              where: {
                userId: userId
              },
              create: {
                userId: userId,
                value: estimate
              },
              update: {
                value: estimate
              }
            }
          }
        },
        include: {
          estimate: true
        }
      });

      await pusherServerClient.trigger(`room-${roomId}`, "estimate-submitted", {});
    }
  })
  .query("get-room-estimates", {
    input: z.object({
      roomId: z.string()
    }),
    async resolve({ ctx, input }) {
      const { roomId } = input;

      console.log("get-room-estimates: " + JSON.stringify(input));

      const estimates = await ctx.prisma.estimate.findMany({
        where: { roomId: roomId }
      });

      return estimates;
    }
  })
  .mutation("delete-room-estimates", {
    input: z.object({
      roomId: z.string()
    }),
    async resolve({ ctx, input }) {
      const { roomId } = input;

      console.log("delete-room-estimates: " + JSON.stringify(input));

      await ctx.prisma.estimate.updateMany({
        where: { roomId: roomId },
        data: { value: "-" }
      });

      await pusherServerClient.trigger(`room-${roomId}`, "estimates-deleted", {});
    }
  });
