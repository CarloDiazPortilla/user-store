import { Router } from "express";
import { CategoryController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class CategoryRouter {
  static get routes() {
    const router = Router();

    const controller = new CategoryController();

    router.get("/", controller.getCategories);
    router.post("/", [
      AuthMiddleware.validateJwt
    ], controller.createCategory);

    return router;
  }
}