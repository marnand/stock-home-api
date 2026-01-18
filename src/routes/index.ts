import { Elysia } from "elysia";
import { authRoutes } from "./auth.routes";
import { itemsRoutes } from "./items.routes";
import { shoppingListRoutes } from "./shopping-list.routes";
import { analyticsRoutes } from "./analytics.routes";
import { healthRoutes } from "./health.routes";

export const setupRoutes = (app: Elysia<"/api">) => {
  return app
    .use(healthRoutes)
    .use(authRoutes)
    .use(itemsRoutes)
    .use(shoppingListRoutes)
    .use(analyticsRoutes)
    .get("/", () => ({
      message: "StockHome API",
      version: "1.0.0",
      endpoints: {
        health: "/health",
        auth: "/auth",
        items: "/items",
        shopping_list: "/shopping-list",
        analytics: "/analytics",
      },
    }));
};
