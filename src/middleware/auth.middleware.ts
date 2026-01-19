import type { Context } from "elysia";
import { Elysia } from "elysia";
import { supabase } from "../db/index.js";

export interface AuthContext {
  userId: string;
  user: any;
}

export const authMiddleware = new Elysia({ name: "authMiddleware" })
  .derive({ as: "scoped" }, async ({ request, set }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      set.status = 401;
      throw new Error("Unauthorized: No token provided");
    }

    const token = authHeader.substring(7);
    const userId = await verifyTokenAndGetUserId(token);
    
    if (!userId) {
      set.status = 401;
      throw new Error("Unauthorized: Invalid token");
    }

    return { userId };
  });

async function verifyTokenAndGetUserId(token: string): Promise<string | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }
    
    return user.id;
  } catch (error) {
    return null;
  }
}

export const optionalAuthMiddleware = new Elysia()
  .derive(async (context: Context) => {
    const token = context.request.headers.get("Authorization")?.replace("Bearer ", "");
    let userId: string | null = null;
    let user: any = null;

    if (token) {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser(token);

        if (authUser) {
          userId = authUser.id;
          user = authUser;
        }
      } catch (error) {
        // Silenciosamente ignora erros de autenticação
      }
    }

    return { userId, user };
  });
