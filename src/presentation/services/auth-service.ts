import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { UserModel } from "../../database";
import type { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
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
      // encrypt password
      const hashedPassword = bcryptAdapter.hash(registerUserDto.password);
      const user = new UserModel({ ...registerUserDto, password: hashedPassword });
      await user.save();

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

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({
      email: loginUserDto.email
    })

    if (!user) throw CustomError.badRequest("User doesn't exist");

    const isMatch = bcryptAdapter.compare(loginUserDto.password, user.password);

    if (!isMatch) throw CustomError.forbidden("Incorrect password");

    const { password, ...loggedUser } = UserEntity.fromObject(user);

    // generate token

    return {
      user: loggedUser,
      token: "ABC"
    }
  }
}