import { supabase } from "../db/index.js";
import { UsersRepository } from "../db/users.repository.js";
import type { ApiResponse, User } from "../types/index.js";

export interface SignUpRequest {
  email: string;
  password: string;
  nome: string;  // Alterado de 'name' para 'nome' (pt-BR)
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;  // Simplificado para alinhar com front/AuthRepository
}

export class AuthController {
  static async signUp(data: SignUpRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError || !authData.user) {
        return {
          success: false,
          error: authError?.message || "Erro ao criar usuário",
        };
      }

      // Criar registro na tabela users
      const user = await UsersRepository.createUser({
        id: authData.user.id,
        email: data.email,
        nome: data.nome || data.email.split("@")[0],
      });

      // Fazer login automático após signup
      const { data: sessionData, error: sessionError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (sessionError || !sessionData.session) {
        return {
          success: false,
          error: sessionError?.message || "Erro ao criar sessão",
        };
      }

      return {
        success: true,
        data: {
          user,
          token: sessionData.session.access_token,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      };
    }
  }

  static async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      // Fazer login
      const { data: sessionData, error: sessionError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (sessionError || !sessionData.session || !sessionData.user) {
        return {
          success: false,
          error: sessionError?.message || "Email ou senha inválidos",
        };
      }

      // Buscar dados do usuário
      const user = await UsersRepository.getUserById(sessionData.user.id);

      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      return {
        success: true,
        data: {
          user,
          token: sessionData.session.access_token,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      };
    }
  }

  static async logout(): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: null,
        message: "Logout realizado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      };
    }
  }

  static async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });

      if (sessionError || !sessionData.session || !sessionData.user) {
        return {
          success: false,
          error: sessionError?.message || "Token inválido",
        };
      }

      const user = await UsersRepository.getUserById(sessionData.user.id);

      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      return {
        success: true,
        data: {
          user,
          token: sessionData.session.access_token,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      };
    }
  }

  static async getCurrentUser(userId: string): Promise<ApiResponse<User>> {
    try {
      const user = await UsersRepository.getUserById(userId);

      if (!user) {
        return {
          success: false,
          error: "Usuário não encontrado",
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      };
    }
  }
}
