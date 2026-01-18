import { supabase } from "./client";
import type { User } from "@/types";

// Não é mais necessário mapeamento - tipos já estão em snake_case

export class UsersRepository {
  static async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data as User;
  }

  static async createUser(user: { id: string; email: string; nome: string }): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert([{
        id: user.id,
        email: user.email,
        nome: user.nome,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const dbUpdates = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("users")
      .update(dbUpdates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data as User;
  }
}
