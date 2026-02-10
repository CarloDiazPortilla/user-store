import { UserModel } from "../../database";
import type { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";

export class AuthService {
  constructor() { }
  public async registerUser(registerUserDto: RegisterUserDto) {
    const existsUser = await UserModel.findOne({
      email: registerUserDto.email
    })

    if (existsUser) throw CustomError.badRequest("Email already exists");

    try {
      const user = new UserModel(registerUserDto);
      await user.save();

      // encrypt password

      // generate JWT to authenticate user

      // send confirmation email

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return {
        user: userEntity,
        token: "ABC"
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
  }
}