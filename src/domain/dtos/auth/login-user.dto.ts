import { regularExps } from "../../../config/regular-exp";

export class LoginUserDto {
  private constructor(
    public email: string,
    public password: string
  ) { }

  static create(object: { [key: string]: any }): [string | undefined, LoginUserDto | undefined] {
    const { email, password } = object;

    if (!email) return ["Email missing", undefined];
    if (!regularExps.email.test(email)) return ["Not a valid email address", undefined];
    if (!password) return ["Password missing", undefined];
    if (password.length < 6) return ["Password is too short", undefined];

    return [undefined, new LoginUserDto(email, password)];
  }
}