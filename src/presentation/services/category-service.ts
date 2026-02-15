import { CategoryModel } from "../../database/mongo/models/category.model";
import type { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { CategoryEntity } from "../../domain/entities/category.entity";
import type { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";

export class CategoryService {
  constructor() { }

  public async createCategory(categoryDto: CreateCategoryDto, user: UserEntity) {

    const categoryExists = await CategoryModel.findOne({ name: categoryDto.name });

    if (categoryExists) throw CustomError.badRequest("Category already exists");

    try {
      const newCategory = await CategoryModel.create({
        name: categoryDto.name,
        available: categoryDto.available,
        user: user.id
      })

      await newCategory.save();

      return CategoryEntity.fromObject(newCategory);
    } catch (error) {
      throw CustomError.internalServer("Error creating new category");
    }
  }

  public async getCategories() {
    try {
      const categories = await CategoryModel.find();

      return categories.map(category => CategoryEntity.fromObject(category));
    } catch (error) {
      throw CustomError.internalServer("Error retrieving categories");
    }
  }
}