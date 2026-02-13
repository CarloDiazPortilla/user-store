import { Router } from "express";
import { CategoryController } from "./controller";

export class CategoryRouter {
  static get routes() {
    const router = Router();

    const controller = new CategoryController();

    router.get("/", controller.getCategories);
    router.post("/", controller.createCategory);

    return router;
  }
}