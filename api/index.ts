import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "../src/routes/auth.routes";
import { itemsRoutes } from "../src/routes/items.routes";
import { shoppingListRoutes } from "../src/routes/shopping-list.routes";
import { analyticsRoutes } from "../src/routes/analytics.routes";
import { healthRoutes } from "../src/routes/health.routes";

const app = new Elysia()
  .use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }))
  .onError(({ error }) => {
    console.error("Erro não tratado:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro interno do servidor",
    };
  })
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

export default app.fetch;
