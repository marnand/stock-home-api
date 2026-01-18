import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { setupRoutes } from "../src/routes";

const app = new Elysia()
  .use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    })
  )
  .onError(({ error }) => {
    console.error("Erro não tratado:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro interno do servidor",
    };
  });

setupRoutes(app);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
  }

  let body: BodyInit | null = null;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = JSON.stringify(req.body);
  }

  const request = new Request(url.toString(), {
    method: req.method,
    headers,
    body,
  });

  try {
    const response = await app.handle(request);
    const responseBody = await response.text();

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.status(response.status).send(responseBody);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
}
