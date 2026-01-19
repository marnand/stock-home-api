import { authRoutes } from "./auth.routes.js";
import { itemsRoutes } from "./items.routes.js";
import { shoppingListRoutes } from "./shopping-list.routes.js";
import { analyticsRoutes } from "./analytics.routes.js";
import { healthRoutes } from "./health.routes.js";

export const setupRoutes = (app: any): void => {
  app
    .use(healthRoutes)
    .group("/api", (api: any) =>
      api
        .use(authRoutes)
        .use(itemsRoutes)
        .use(shoppingListRoutes)
        .use(analyticsRoutes)
    )
    .get("/", () => ({
      message: "StockHome API",
      version: "1.0.0",
      endpoints: {
        health: "/health",
        auth: "/api/auth",
        items: "/api/items",
        shopping_list: "/api/shopping-list",
        analytics: "/api/analytics",
      },
    }));
};
