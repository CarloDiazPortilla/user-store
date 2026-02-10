import { regularExps } from "../../../config/regular-exp";

export class RegisterUserDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
  ) { }
  static create(object: { [key: string]: any }): [(string | undefined), (RegisterUserDto | undefined)] {
    const { name, email, password } = object;

    if (!name) return ["Missing name", undefined];
    if (!email) return ["Missing email", undefined];
    if (!regularExps.email.test(email)) return ["Not a valid email address", undefined];
    if (!password) return ["Missing password", undefined];
    if (password.length < 6) return ["Missing password", undefined];

    return [undefined, new RegisterUserDto(name, email, password)];
  }
}