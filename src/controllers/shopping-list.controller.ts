import { ShoppingListRepository } from "@/db/index.js";
import type {
  ShoppingListItem,
  CreateShoppingListItemDTO,
  UpdateShoppingListItemDTO,
  ApiResponse,
} from "@/types/index.js";

export class ShoppingListController {
  static async getAllItems(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse> {
    try {
      const result = await ShoppingListRepository.getAllItems(
        userId,
        page,
        limit
      );
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao buscar lista de compras",
      };
    }
  }

  static async getIncompleteItems(
    userId: string
  ): Promise<ApiResponse<ShoppingListItem[]>> {
    try {
      const items = await ShoppingListRepository.getIncompleteItems(userId);
      return {
        success: true,
        data: items,
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao buscar itens incompletos",
      };
    }
  }

  static async addItem(
    userId: string,
    itemData: CreateShoppingListItemDTO
  ): Promise<ApiResponse<ShoppingListItem>> {
    try {
      const item = await ShoppingListRepository.addItem(userId, itemData);
      return {
        success: true,
        data: item,
        message: "Item adicionado à lista",
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao adicionar item",
      };
    }
  }

  static async updateItem(
    userId: string,
    itemId: string,
    updates: UpdateShoppingListItemDTO
  ): Promise<ApiResponse<ShoppingListItem>> {
    try {
      const item = await ShoppingListRepository.updateItem(
        userId,
        itemId,
        updates
      );
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
      await ShoppingListRepository.deleteItem(userId, itemId);
      return {
        success: true,
        message: "Item removido da lista",
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao remover item",
      };
    }
  }

  static async toggleCompletion(
    userId: string,
    itemId: string,
    isCompleted: boolean
  ): Promise<ApiResponse<ShoppingListItem>> {
    try {
      const item = await ShoppingListRepository.toggleItemCompletion(
        userId,
        itemId,
        isCompleted
      );
      return {
        success: true,
        data: item,
        message: isCompleted
          ? "Item marcado como concluído"
          : "Item marcado como incompleto",
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao atualizar item",
      };
    }
  }

  static async clearCompleted(userId: string): Promise<ApiResponse> {
    try {
      await ShoppingListRepository.clearCompleted(userId);
      return {
        success: true,
        message: "Itens completos removidos",
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao limpar itens completos",
      };
    }
  }
}
