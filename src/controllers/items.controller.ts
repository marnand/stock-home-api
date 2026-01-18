import { ItemsRepository } from "@/db";
import type {
  Item,
  CreateItemDTO,
  UpdateItemDTO,
  ApiResponse,
} from "@/types";

export class ItemsController {
  static async getAllItems(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse> {
    try {
      const result = await ItemsRepository.getAllItems(userId, page, limit);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao buscar itens",
      };
    }
  }

  static async getItemById(
    userId: string,
    itemId: string
  ): Promise<ApiResponse<Item>> {
    try {
      const item = await ItemsRepository.getItemById(userId, itemId);
      return {
        success: true,
        data: item,
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao buscar item",
      };
    }
  }

  static async createItem(
    userId: string,
    itemData: CreateItemDTO
  ): Promise<ApiResponse<Item>> {
    try {
      const item = await ItemsRepository.createItem(userId, itemData);
      return {
        success: true,
        data: item,
        message: "Item criado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao criar item",
      };
    }
  }

  static async updateItem(
    userId: string,
    itemId: string,
    updates: UpdateItemDTO
  ): Promise<ApiResponse<Item>> {
    try {
      const item = await ItemsRepository.updateItem(userId, itemId, updates);
      return {
        success: true,
        data: item,
        message: "Item atualizado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao atualizar item",
      };
    }
  }

  static async deleteItem(
    userId: string,
    itemId: string
  ): Promise<ApiResponse> {
    try {
      await ItemsRepository.deleteItem(userId, itemId);
      return {
        success: true,
        message: "Item deletado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao deletar item",
      };
    }
  }

  static async getItemsByCategory(
    userId: string,
    categoria: string
  ): Promise<ApiResponse<Item[]>> {
    try {
      const items = await ItemsRepository.getItemsByCategory(userId, categoria);
      return {
        success: true,
        data: items,
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao buscar itens por categoria",
      };
    }
  }

  static async getLowStockItems(
    userId: string
  ): Promise<ApiResponse<Item[]>> {
    try {
      const items = await ItemsRepository.getLowStockItems(userId);
      return {
        success: true,
        data: items,
        message: `${items.length} itens abaixo do estoque mínimo`,
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao buscar itens com baixo estoque",
      };
    }
  }

  static async getExpiringItems(
    userId: string,
    daysAhead?: number
  ): Promise<ApiResponse<Item[]>> {
    try {
      const items = await ItemsRepository.getExpiringItems(
        userId,
        daysAhead || 30
      );
      return {
        success: true,
        data: items,
        message: `${items.length} itens vencendo em breve`,
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao buscar itens vencendo",
      };
    }
  }

  static async registerPurchase(
    userId: string,
    itemId: string,
    quantidade: number,
    valor_unitario?: number
  ): Promise<ApiResponse<Item>> {
    try {
      const item = await ItemsRepository.registerPurchase(
        userId,
        itemId,
        quantidade,
        valor_unitario
      );
      return {
        success: true,
        data: item,
        message: "Compra registrada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao registrar compra",
      };
    }
  }
}
