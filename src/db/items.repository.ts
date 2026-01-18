import { supabase } from "./client.js";
import type {
  Item,
  CreateItemDTO,
  UpdateItemDTO,
  PaginatedResponse,
} from "../types";

export class ItemsRepository {
  static async getAllItems(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Item>> {
    const offset = (page - 1) * limit;

    const [{ data: items, error: itemsError, count }, { data: countData }] =
      await Promise.all([
        supabase
          .from("items")
          .select("*", { count: "exact" })
          .eq("user_id", userId)
          .range(offset, offset + limit - 1)
          .order("created_at", { ascending: false }),
        supabase
          .from("items")
          .select("id", { count: "exact" })
          .eq("user_id", userId),
      ]);
      
    if (itemsError) throw itemsError;

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: (items || []) as Item[],
      total,
      page,
      limit,
      total_pages: totalPages,
    };
  }

  static async getItemById(userId: string, itemId: string): Promise<Item> {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("id", itemId)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data as Item;
  }

  static async createItem(
    userId: string,
    itemData: CreateItemDTO
  ): Promise<Item> {
    const dbData = {
      ...itemData,
      user_id: userId,
      data_ultima_compra: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("items")
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return data as Item;
  }

  static async updateItem(
    userId: string,
    itemId: string,
    updates: UpdateItemDTO
  ): Promise<Item> {
    const { data, error } = await supabase
      .from("items")
      .update(updates)
      .eq("id", itemId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as Item;
  }

  static async deleteItem(userId: string, itemId: string): Promise<void> {
    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", itemId)
      .eq("user_id", userId);

    if (error) throw error;
  }

  static async getItemsByCategory(
    userId: string,
    categoria: string
  ): Promise<Item[]> {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", userId)
      .eq("categoria", categoria)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as Item[];
  }

  static async getLowStockItems(userId: string): Promise<Item[]> {
    // Itens onde quantidade_atual <= quantidade_minima
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", userId)
      .filter("quantidade_atual", "lte", supabase.rpc("quantidade_minima"))
      .order("quantidade_atual", { ascending: true });

    // Fallback: buscar todos e filtrar no código
    if (error) {
      const { data: allItems, error: allError } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", userId);
      
      if (allError) throw allError;
      
      return (allItems || [])
        .filter((item: Item) => item.quantidade_atual <= item.quantidade_minima) as Item[];
    }

    return (data || []) as Item[];
  }

  static async getExpiringItems(userId: string, daysAhead: number = 30): Promise<Item[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", userId)
      .not("data_validade", "is", null)
      .lte("data_validade", futureDate.toISOString().split("T")[0])
      .order("data_validade", { ascending: true });

    if (error) throw error;
    return (data || []) as Item[];
  }

  /**
   * Registrar compra de um item (atualiza quantidade e data)
   */
  static async registerPurchase(
    userId: string,
    itemId: string,
    quantidade: number,
    valor_unitario?: number
  ): Promise<Item> {
    // Buscar item atual
    const currentItem = await this.getItemById(userId, itemId);
    
    const updates: Partial<Item> = {
      quantidade_atual: currentItem.quantidade_atual + quantidade,
      data_ultima_compra: new Date().toISOString(),
    };

    if (valor_unitario !== undefined) {
      updates.valor_unitario = valor_unitario;
    }

    const { data, error } = await supabase
      .from("items")
      .update(updates)
      .eq("id", itemId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as Item;
  }
}
