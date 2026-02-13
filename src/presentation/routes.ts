import { Router } from "express";
import { AuthRouter } from "./auth/routes";
import { CategoryRouter } from "./category/routes";

export class AppRouter {
  static get routes(): Router {
    const router = Router();

    router.use("/api/auth", AuthRouter.routes);
    router.use("/api/categories", CategoryRouter.routes);

    return router;
  }
}