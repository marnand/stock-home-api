import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { setupRoutes } from "./routes";

const app = new Elysia({ prefix: "/api" })
  .use(cors({
    //origin: process.env.CORS_ORIGIN || "http://localhost:5000",
    origin: "http://localhost:5000",
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

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🚀 API StockHome rodando em http://localhost:${PORT}`);
  console.log(`📝 Documentação: http://localhost:${PORT}/`);
});

export default app;
