import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { setupRoutes } from "./routes";

const app = new Elysia()
  .use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5000",
    credentials: true,
  }))
  .onError(({ error }) => {
    console.error("Erro não tratado:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro interno do servidor",
    };
  });

setupRoutes(app);

export default app;
