export class AuthUser {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly roles: string[],
  ) {}
}
