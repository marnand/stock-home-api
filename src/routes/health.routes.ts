import { Elysia } from "elysia";
import { testConnection } from "../db/index.js";

export const healthRoutes = new Elysia({ prefix: "/health" })
  .get("/", async () => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  })
  .get("/db", async () => {
    return testConnection();
  });
