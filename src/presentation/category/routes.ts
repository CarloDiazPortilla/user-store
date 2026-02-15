import { Router } from "express";
import { CategoryController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CategoryService } from "../services/category-service";

export class CategoryRouter {
  static get routes() {
    const router = Router();

    const categoryService = new CategoryService();
    const controller = new CategoryController(categoryService);

    router.get("/", controller.getCategories);
    router.post("/", [
      AuthMiddleware.validateJwt
    ], controller.createCategory);

    return router;
  }
}