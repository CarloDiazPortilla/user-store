import type { Request, Response } from "express";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import type { AuthService } from "../services/auth-service";
import { CustomError } from "../../domain/errors/custom.error";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";

export class AuthController {
  constructor(
    public readonly authService: AuthService
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }

  register = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);

    if (error) return res.status(400).json({ error });

    this.authService.registerUser(registerUserDto!)
      .then(data => res.json(data))
      .catch(error => this.handleError(error, res))
  }

  login = async (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);

    if (error) return res.status(400).json({ error });

    this.authService.loginUser(loginUserDto!)
      .then(data => res.json(data))
      .catch(error => this.handleError(error, res));
  }

  validateEmail = async (req: Request, res: Response) => {
    res.json("validate email");
  }
}