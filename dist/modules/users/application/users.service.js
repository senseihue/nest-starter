"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const users_constants_1 = require("../users.constants");
const user_entity_1 = require("../domain/user.entity");
const users_tokens_1 = require("../users.tokens");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(id, name, email) {
        const user = new user_entity_1.User(id, name, email);
        await this.userRepository.save(user);
        return user;
    }
    async registerUser(id, name, email, password, roles = users_constants_1.USERS_EMPTY_ROLES) {
        const user = new user_entity_1.User(id, name, email);
        const passwordHash = await bcrypt.hash(password, users_constants_1.USERS_DEFAULTS.PASSWORD_HASH_ROUNDS);
        await this.userRepository.createWithPassword(user, passwordHash, roles);
        return user;
    }
    async getUser(id) {
        return this.userRepository.findById(id);
    }
    async listUsers() {
        return this.userRepository.findAll();
    }
    async listUsersPage(page, limit) {
        return this.userRepository.findPage(page, limit);
    }
    async updateUser(id, data) {
        return this.userRepository.update(id, data);
    }
    async updateUserRoles(id, roles) {
        return this.userRepository.update(id, { roles });
    }
    async removeUser(id) {
        return this.userRepository.remove(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(users_tokens_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], UsersService);
//# sourceMappingURL=users.service.js.map