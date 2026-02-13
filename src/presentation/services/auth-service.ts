import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { envs } from "../../config/envs";
import { jwtAdapter } from "../../config/jwt.adapter";
import { UserModel } from "../../database";
import type { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import type { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";
import type { EmailService } from "./email-service";

export class AuthService {
  constructor(
    private readonly emailService: EmailService
  ) { }
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

      const token = await jwtAdapter.sign({ id: user.id }, "15m");
      if (!token) throw CustomError.internalServer("Error creating jwt");

      // send confirmation email
      const emailSent = await this.sendEmailValidationLink(user.email);

      if (!emailSent) throw CustomError.internalServer("Error sending validation email");

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return {
        user: userEntity,
        token: token
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
    const token = await jwtAdapter.sign({ user: user.id });
    if (!token) throw CustomError.internalServer("Error creating jwt");

    return {
      user: loggedUser,
      token: token
    }
  }

  public async validateEmail(token: string) {
    const payload = await jwtAdapter.verify(token);
    if (!payload) throw CustomError.unAuthorized("Invalid token");

    const { email } = payload as { email: string };

    if (!email) throw CustomError.internalServer("Email was not send in payload");

    const user = await UserModel.findOne({ email });

    if (!user) throw CustomError.internalServer("User was not found");

    if (user.isEmailValidated) throw CustomError.badRequest("User email already validated");

    user.isEmailValidated = true;

    await user.save()

    return true;

  }

  private async sendEmailValidationLink(email: string) {
    const token = await jwtAdapter.sign({ email }, "15m");
    if (!token) throw CustomError.internalServer("Error generating validation token");

    const validationLink = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
    <h1>Validate your email</h1>
    <p>Click the following link to validate your account ${email}</p>
    <a href="${validationLink}">Validate your email</a>
    `

    return await this.emailService.sendEmail({
      htmlBody: html,
      subject: "Validation email link",
      to: email
    })
  }
}