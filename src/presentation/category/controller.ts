import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { CustomError } from "../../domain/errors/custom.error";
import type { Request, Response } from "express";

export class CategoryController {
  // DI
  constructor() { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }

  createCategory = (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);

    if (error) return res.status(400).json({ message: error });

    res.json("Create category");
  }

  getCategories = (req: Request, res: Response) => {
    res.json("Get categories");
  }


}