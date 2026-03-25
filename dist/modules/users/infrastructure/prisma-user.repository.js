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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../domain/user.entity");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let PrismaUserRepository = class PrismaUserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const record = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!record) {
            return null;
        }
        return new user_entity_1.User(record.id, record.name, record.email);
    }
    async save(user) {
        await this.prisma.user.upsert({
            where: { id: user.id },
            create: {
                id: user.id,
                name: user.getName(),
                email: user.getEmail(),
                passwordHash: '',
                roles: [],
            },
            update: {
                name: user.getName(),
                email: user.getEmail(),
            },
        });
    }
    async createWithPassword(user, passwordHash, roles = []) {
        await this.prisma.user.create({
            data: {
                id: user.id,
                name: user.getName(),
                email: user.getEmail(),
                passwordHash,
                roles,
            },
        });
    }
    async findAll() {
        const records = await this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return records.map((record) => new user_entity_1.User(record.id, record.name, record.email));
    }
    async findPage(page, limit) {
        const skip = (page - 1) * limit;
        const [records, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count(),
        ]);
        return {
            items: records.map((record) => new user_entity_1.User(record.id, record.name, record.email)),
            total,
        };
    }
    async update(id, data) {
        const record = await this.prisma.user.findUnique({ where: { id } });
        if (!record) {
            return null;
        }
        const updated = await this.prisma.user.update({
            where: { id },
            data: {
                name: data.name ?? record.name,
                email: data.email ?? record.email,
                roles: data.roles ?? record.roles,
            },
        });
        return new user_entity_1.User(updated.id, updated.name, updated.email);
    }
    async remove(id) {
        const existing = await this.prisma.user.findUnique({ where: { id } });
        if (!existing) {
            return false;
        }
        await this.prisma.user.delete({ where: { id } });
        return true;
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaUserRepository);
//# sourceMappingURL=prisma-user.repository.js.map