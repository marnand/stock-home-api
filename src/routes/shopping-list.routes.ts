import { Elysia } from "elysia";
import { ShoppingListController } from "@/controllers/shopping-list.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import type {
  CreateShoppingListItemDTO,
  UpdateShoppingListItemDTO,
} from "@/types";

export const shoppingListRoutes = new Elysia({ prefix: "/shopping-list" })
  .use(authMiddleware)
  .get("/", async ({ query, userId }: any) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    return ShoppingListController.getAllItems(userId, page, limit);
  })
  .get("/incomplete", async ({ userId }: any) => {
    return ShoppingListController.getIncompleteItems(userId);
  })
  .post("/", async ({ body, userId }: any) => {
    const itemData = body as CreateShoppingListItemDTO;
    return ShoppingListController.addItem(userId, itemData);
  })
  .put("/:id", async ({ params, body, userId }: any) => {
    const updates = body as UpdateShoppingListItemDTO;
    return ShoppingListController.updateItem(userId, params.id, updates);
  })
  .patch("/:id/toggle", async ({ params, body, userId }: any) => {
    const { is_completed } = body as { is_completed: boolean };
    return ShoppingListController.toggleCompletion(userId, params.id, is_completed);
  })
  .delete("/:id", async ({ params, userId }: any) => {
    return ShoppingListController.deleteItem(userId, params.id);
  })
  .delete("/completed/clear", async ({ userId }: any) => {
    return ShoppingListController.clearCompleted(userId);
  });
