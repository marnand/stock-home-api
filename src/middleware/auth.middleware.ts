import type { Context } from "elysia";
import { Elysia } from "elysia";
import { supabase } from "@/db";

export interface AuthContext {
  userId: string;
  user: any;
}

export const authMiddleware = new Elysia()
  .derive(async (context: Context) => {
    const token = context.request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Token de autenticação não fornecido");
    }

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (error || !user) {
        throw new Error("Token inválido");
      }

      return {
        userId: user.id,
        user: user,
      };
    } catch (error) {
      throw new Error("Falha na autenticação: " + String(error));
    }
  });

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
