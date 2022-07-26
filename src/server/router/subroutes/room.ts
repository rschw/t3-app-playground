import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { pusherServerClient } from "../../common/pusher";
import { t } from "../trpc";

export const roomRouter = t.router({
  create: t.procedure
    .input(
      z.object({
        userId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.create({
        data: { userId: input.userId }
      });

      return room;
    }),
  getById: t.procedure
    .input(
      z.object({
        roomId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.findFirst({
        where: { id: input.roomId },
        include: { estimate: true }
      });

      return room;
    }),
  getByUser: t.procedure
    .input(
      z.object({
        userId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.findFirst({
        where: { userId: input.userId }
      });

      return room;
    }),
  toggleEstimates: t.procedure
    .input(
      z.object({
        roomId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.findFirst({
        where: { id: input.roomId }
      });

      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "ROOM NOT FOUND"
        });
      }

      await ctx.prisma.room.update({
        where: { id: room.id },
        data: { showEstimates: !room.showEstimates }
      });

      await pusherServerClient.trigger(`room-${room.id}`, "room-updated", {});
    }),
  submitEstimate: t.procedure
    .input(
      z.object({
        roomId: z.string(),
        userId: z.string(),
        userName: z.string(),
        value: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, userName, roomId, value } = input;

      const estimate = await ctx.prisma.estimate.findFirst({
        where: { userId: userId, roomId: roomId }
      });

      if (estimate) {
        await ctx.prisma.estimate.update({
          where: { id: estimate.id },
          data: {
            value: value,
            userName: userName
          }
        });
      } else {
        await ctx.prisma.estimate.create({
          data: {
            roomId: roomId,
            value: value,
            userId: userId,
            userName: userName
          }
        });
      }

      await pusherServerClient.trigger(`room-${roomId}`, "room-updated", {});
    }),
  deleteEstimates: t.procedure
    .input(
      z.object({
        roomId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { roomId } = input;

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

      await pusherServerClient.trigger(`room-${roomId}`, "room-updated", {});
    }),
  removeUsers: t.procedure
    .input(
      z.object({
        roomId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { roomId } = input;

      await ctx.prisma.estimate.deleteMany({
        where: { roomId: roomId }
      });

      await pusherServerClient.trigger(`room-${roomId}`, "room-updated", {});
    })
});
