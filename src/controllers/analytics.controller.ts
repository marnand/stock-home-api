import { ItemsRepository, ShoppingListRepository } from "@/db/index.js";
import type { ApiResponse, InventoryAnalytics, Item } from "@/types/index.js";

export class AnalyticsController {
  static async getInventoryAnalytics(userId: string): Promise<ApiResponse<InventoryAnalytics>> {
    try {
      const result = await ItemsRepository.getAllItems(userId, 1, 10000);

      const allItems: Item[] = result?.data || [];

      // Calcular total de itens e quantidade
      const totalItens = allItems.length;
      const quantidadeTotal = allItems.reduce(
        (sum: number, item: Item) => sum + item.quantidade_atual,
        0
      );
      const valorTotal = allItems.reduce(
        (sum: number, item: Item) => sum + (item.valor_unitario || 0) * item.quantidade_atual,
        0
      );

      // Agrupar por categoria
      const itensPorCategoria: Record<string, number> = {};
      allItems.forEach((item: Item) => {
        const category = item.categoria || "Sem categoria";
        itensPorCategoria[category] = (itensPorCategoria[category] || 0) + 1;
      });

      // Obter itens com baixo estoque
      const itensAbaixoMinimo = await ItemsRepository.getLowStockItems(userId);

      // Obter itens vencendo
      const itensVencendo = await ItemsRepository.getExpiringItems(userId, 30);

      const analytics: InventoryAnalytics = {
        total_itens: totalItens,
        quantidade_total: quantidadeTotal,
        valor_total: valorTotal,
        itens_por_categoria: itensPorCategoria,
        itens_abaixo_minimo: itensAbaixoMinimo,
        itens_vencendo: itensVencendo,
      };

      return {
        success: true,
        data: analytics,
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao gerar análise de inventário",
      };
    }
  }

  static async getDashboardStats(userId: string): Promise<ApiResponse> {
    try {
      const [itemsResult, shoppingResult] = await Promise.all([
        ItemsRepository.getAllItems(userId, 1, 1),
        ShoppingListRepository.getAllItems(userId, 1, 1),
      ]);

      const totalItems = itemsResult.total;
      const totalShoppingItems = shoppingResult.total;

      const lowStockItems = await ItemsRepository.getLowStockItems(userId);
      const expiringItems = await ItemsRepository.getExpiringItems(userId, 30);

      return {
        success: true,
        data: {
          inventory: {
            total_items: totalItems,
            low_stock_count: lowStockItems.length,
            expiring_count: expiringItems.length,
          },
          shopping_list: {
            total_items: totalShoppingItems,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
        message: "Erro ao obter estatísticas do painel",
      };
    }
  }
}
