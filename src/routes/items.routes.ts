import { Elysia } from "elysia";
import { ItemsController } from "@/controllers/items.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import type { CreateItemDTO, UpdateItemDTO } from "@/types";

export const itemsRoutes = new Elysia({ prefix: "/items" })
  .use(authMiddleware)
  .get("/", async ({ query, userId }: any) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    return ItemsController.getAllItems(userId, page, limit);
  })
  .get("/low-stock", async ({ userId }: { userId: string }) => {
    return ItemsController.getLowStockItems(userId);
  })
  .get("/expiring", async ({ userId }: { userId: string }) => {
    const daysAhead = 30;
    return ItemsController.getExpiringItems(userId, daysAhead);
  })
  .get("/category/:categoria", async ({ params, userId }: any) => {
    return ItemsController.getItemsByCategory(userId, params.categoria);
  })
  .get("/:id", async ({ params, userId }: any) => {
    return ItemsController.getItemById(userId, params.id);
  })
  .post("/", async ({ body, userId }: any) => {
    const itemData = body as CreateItemDTO;
    return ItemsController.createItem(userId, itemData);
  })
  .post("/:id/purchase", async ({ params, body, userId }: any) => {
    const { quantity, price } = body as { quantity: number; price?: number };
    return ItemsController.registerPurchase(userId, params.id, quantity, price);
  })
  .put("/:id", async ({ params, body, userId }: any) => {
    const updates = body as UpdateItemDTO;
    return ItemsController.updateItem(userId, params.id, updates);
  })
  .patch("/:id", async ({ params, body, userId }: any) => {
    const updates = body as Partial<UpdateItemDTO>;
    return ItemsController.updateItem(userId, params.id, updates);
  })
  .delete("/:id", async ({ params, userId }: any) => {
    return ItemsController.deleteItem(userId, params.id);
  });
