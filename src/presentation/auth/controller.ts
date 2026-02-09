import type { Request, Response } from "express";

export class AuthController {
  constructor() { }

  register = async (req: Request, res: Response) => {
    res.json("register");
  }

  login = async (req: Request, res: Response) => {
    res.json("login");
  }

  validateEmail = async (req: Request, res: Response) => {
    res.json("validate email");
  }
}