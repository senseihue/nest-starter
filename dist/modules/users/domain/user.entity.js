"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    getName() {
        return this.name;
    }
    getEmail() {
        return this.email;
    }
    rename(name) {
        this.name = name;
    }
    changeEmail(email) {
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
exports.User = User;
//# sourceMappingURL=user.entity.js.map