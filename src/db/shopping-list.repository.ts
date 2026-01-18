import { supabase } from "./client.js";
import type {
  ShoppingListItem,
  CreateShoppingListItemDTO,
  UpdateShoppingListItemDTO,
  PaginatedResponse,
} from "@/types/index.js";

// Não é mais necessário mapeamento - tipos já estão em snake_case

export class ShoppingListRepository {
  static async getAllItems(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<ShoppingListItem>> {
    const offset = (page - 1) * limit;

    const [
      { data: items, error: itemsError, count },
    ] = await Promise.all([
      supabase
        .from("shopping_list")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false }),
    ]);

    if (itemsError) throw itemsError;

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: (items || []) as ShoppingListItem[],
      total,
      page,
      limit,
      total_pages: totalPages,
    };
  }

  static async getIncompleteItems(userId: string): Promise<ShoppingListItem[]> {
    const { data, error } = await supabase
      .from("shopping_list")
      .select("*")
      .eq("user_id", userId)
      .eq("concluido", false)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as ShoppingListItem[];
  }

  static async getItemById(
    userId: string,
    itemId: string
  ): Promise<ShoppingListItem> {
    const { data, error } = await supabase
      .from("shopping_list")
      .select("*")
      .eq("id", itemId)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data as ShoppingListItem;
  }

  static async addItem(
    userId: string,
    itemData: CreateShoppingListItemDTO
  ): Promise<ShoppingListItem> {
    const dbData = {
      ...itemData,
      user_id: userId,
      concluido: false,
    };

    const { data, error } = await supabase
      .from("shopping_list")
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return data as ShoppingListItem;
  }

  static async updateItem(
    userId: string,
    itemId: string,
    updates: UpdateShoppingListItemDTO
  ): Promise<ShoppingListItem> {
    const { data, error } = await supabase
      .from("shopping_list")
      .update(updates)
      .eq("id", itemId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as ShoppingListItem;
  }

  static async deleteItem(userId: string, itemId: string): Promise<void> {
    const { error } = await supabase
      .from("shopping_list")
      .delete()
      .eq("id", itemId)
      .eq("user_id", userId);

    if (error) throw error;
  }

  static async clearCompleted(userId: string): Promise<void> {
    const { error } = await supabase
      .from("shopping_list")
      .delete()
      .eq("user_id", userId)
      .eq("concluido", true);

    if (error) throw error;
  }

  static async toggleItemCompletion(
    userId: string,
    itemId: string,
    concluido: boolean
  ): Promise<ShoppingListItem> {
    return this.updateItem(userId, itemId, { concluido });
  }
}
