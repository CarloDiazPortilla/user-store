import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth-service";
import { EmailService } from "../services/email-service";
import { envs } from "../../config/envs";

export class AuthRouter {
  static get routes() {
    const router = Router();
    const emailService = new EmailService({
      pass: envs.MAILER_SECRET_KEY,
      service: envs.MAILER_SERVICE,
      user: envs.MAILER_EMAIL
    });
    const authService = new AuthService(emailService);
    const controller = new AuthController(authService);

    router.post("/login", controller.login);
    router.post("/register", controller.register);
    router.get("/validate-email/:token", controller.validateEmail);

    return router;
  }
}