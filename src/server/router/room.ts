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
      value: z.string()
    }),
    async resolve({ ctx, input }) {
      const { userId, roomId, value } = input;

      console.log("submit-estimate: " + JSON.stringify(input));

      const existingEstimate = await ctx.prisma.estimate.findFirst({
        where: { userId: userId, roomId: roomId }
      });

      if (existingEstimate) {
        await ctx.prisma.estimate.update({
          where: { id: existingEstimate.id },
          data: { value: value }
        });
      } else {
        await ctx.prisma.estimate.create({
          data: { userId: userId, roomId: roomId, value: value }
        });
      }

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

      const room = await ctx.prisma.room.findFirst({
        where: { id: roomId },
        include: { estimate: true }
      });

      return room;
    }
  })
  .mutation("delete-room-estimates", {
    input: z.object({
      roomId: z.string()
    }),
    async resolve({ ctx, input }) {
      const { roomId } = input;

      console.log("delete-room-estimates: " + JSON.stringify(input));

      await ctx.prisma.room.update({
        where: { id: roomId },
        data: {
          showEstimates: false,
          estimate: {
            updateMany: {
              where: { roomId: roomId },
              data: { value: "-" }
            }
          }
        }
      });

      await pusherServerClient.trigger(`room-${roomId}`, "estimates-deleted", {});
    }
  })
  .mutation("toggle-show-estimates", {
    input: z.object({
      roomId: z.string()
    }),
    async resolve({ ctx, input }) {
      const { roomId } = input;

      console.log("toggle-show-estimates: " + JSON.stringify(input));

      const room = await ctx.prisma.room.findFirst({
        where: { id: roomId }
      });

      if (room) {
        await ctx.prisma.room.update({
          where: { id: roomId },
          data: { showEstimates: !room.showEstimates }
        });

        await pusherServerClient.trigger(`room-${roomId}`, "show-estimates-toggled", {});
      }
    }
  });
