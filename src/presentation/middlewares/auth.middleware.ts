import type { Request, Response, NextFunction } from "express";
import { jwtAdapter } from "../../config/jwt.adapter";
import { UserModel } from "../../database";
import { UserEntity } from "../../domain/entities/user.entity";

export class AuthMiddleware {
  static async validateJwt(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header("Authorization");
    if (!authorization) return res.status(404).json({ error: "No token provided" });
    if (!authorization.startsWith("Bearer ")) return res.status(401).json({ error: "Invalid Bearer token" });

    const token = authorization.split(" ").at(1) || "";

    try {
      const payload = await jwtAdapter.verify<{ id: string }>(token);
      if (!payload) return res.status(401).json({ error: "Invalid jwt token" });

      const user = await UserModel.findById(payload.id);
      if (!user) return res.status(401).json({ error: "Invalid user" });

      // TODO: validate if user email is validated

      req.body.user = UserEntity.fromObject(user);

      next();

    } catch (error) {
      return res.status(500).json({
        error: "Internal server error"
      })
    }

  }
}