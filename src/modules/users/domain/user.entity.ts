export class User {
  private name: string;
  private email: string;

  constructor(readonly id: string, name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  rename(name: string) {
    this.name = name;
  }

  changeEmail(email: string) {
    this.email = email;
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }
}
