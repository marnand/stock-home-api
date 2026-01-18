// Tipos para Items (Itens do Inventário)
// Alinhado com front/src/lib/store.ts e front/src/api/repositories/ItemRepository.ts
// Convenção: snake_case para consistência com banco de dados (sem necessidade de mapping)
export interface Item {
  id: string;
  nome: string;
  marca: string;
  categoria: string;
  quantidade_atual: number;
  quantidade_minima: number;
  unidade_medida: string;
  valor_unitario: number;
  data_validade?: string;
  data_ultima_compra?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateItemDTO {
  nome: string;
  marca: string;
  categoria: string;
  quantidade_atual: number;
  quantidade_minima: number;
  unidade_medida: string;
  valor_unitario: number;
  data_validade?: string;
}

export interface UpdateItemDTO {
  nome?: string;
  marca?: string;
  categoria?: string;
  quantidade_atual?: number;
  quantidade_minima?: number;
  unidade_medida?: string;
  valor_unitario?: number;
  data_validade?: string;
}

// Tipos para Shopping List (Lista de Compras)
export interface ShoppingListItem {
  id: string;
  nome: string;
  quantidade: number;
  unidade_medida?: string;
  concluido: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateShoppingListItemDTO {
  nome: string;
  quantidade: number;
  unidade_medida?: string;
}

export interface UpdateShoppingListItemDTO {
  nome?: string;
  quantidade?: number;
  unidade_medida?: string;
  concluido?: boolean;
}

// Tipos para User
export interface User {
  id: string;
  email: string;
  nome: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Tipos para Analytics
export interface InventoryAnalytics {
  total_itens: number;
  quantidade_total: number;
  valor_total: number;
  itens_por_categoria: Record<string, number>;
  itens_abaixo_minimo: Item[];
  itens_vencendo: Item[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
