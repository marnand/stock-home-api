import { Elysia } from "elysia";
import { AuthController } from "@/controllers/auth.controller";
import { authMiddleware } from "@/middleware/auth.middleware";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .post("/signup", async ({ body }: any) => {
    const { email, password, nome } = body;
    return AuthController.signUp({ email, password, nome });
  })
  .post("/login", async ({ body }: any) => {
    const { email, password } = body;
    return AuthController.login({ email, password });
  })
  .post("/logout", async () => {
    return AuthController.logout();
  })
  .post("/refresh", async ({ body }: any) => {
    const { refresh_token } = body;
    return AuthController.refreshToken(refresh_token);
  })
  .use(authMiddleware)
  .get("/me", async ({ userId }: any) => {
    return AuthController.getCurrentUser(userId);
  });
