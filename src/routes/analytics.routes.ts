import { Elysia } from "elysia";
import { AnalyticsController } from "../controllers/analytics.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const analyticsRoutes = new Elysia({ prefix: "/analytics" })
  .use(authMiddleware)
  .get("/inventory", async ({ userId }: any) => {
    return AnalyticsController.getInventoryAnalytics(userId);
  })
  .get("/dashboard", async ({ userId }: any) => {
    return AnalyticsController.getDashboardStats(userId);
  });
