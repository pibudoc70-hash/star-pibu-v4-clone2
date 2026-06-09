import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { treatmentsRouter } from "./treatments-router";
import { publicProcedure, router } from "./_core/trpc";
import { reservationRouter, scheduleRouter } from "./routers/reservation";
import { eventsRouter } from "./routers/events";
import { popupRouter } from "./routers/popup";
import { adminRouter } from "./routers/admin";
import { youtubeRouter } from "./routers/youtube";
import { equipment3Router } from "./routers/equipment3";

export const appRouter = router({
  system: systemRouter,
  treatments: treatmentsRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  schedule: scheduleRouter,
  reservation: reservationRouter,
  events: eventsRouter,
  popup: popupRouter,
  admin: adminRouter,
  youtube: youtubeRouter,
  equipment3: equipment3Router,
});

export type AppRouter = typeof appRouter;
