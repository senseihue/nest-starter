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
exports.PaginationQuery = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const messages_1 = require("./messages");
class PaginationQuery {
    constructor() {
        this.page = 1;
        this.limit = 20;
        this.sort = 'createdAt';
        this.order = 'desc';
    }
}
exports.PaginationQuery = PaginationQuery;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: messages_1.VALIDATION_MESSAGES.page.isInt }),
    (0, class_validator_1.Min)(1, { message: messages_1.VALIDATION_MESSAGES.page.min }),
    __metadata("design:type", Number)
], PaginationQuery.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: messages_1.VALIDATION_MESSAGES.limit.isInt }),
    (0, class_validator_1.Min)(1, { message: messages_1.VALIDATION_MESSAGES.limit.min }),
    (0, class_validator_1.Max)(100, { message: messages_1.VALIDATION_MESSAGES.limit.max }),
    __metadata("design:type", Number)
], PaginationQuery.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'createdAt' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: messages_1.VALIDATION_MESSAGES.sort.isString }),
    __metadata("design:type", String)
], PaginationQuery.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'desc', enum: ['asc', 'desc'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['asc', 'desc'], { message: messages_1.VALIDATION_MESSAGES.order.isIn }),
    __metadata("design:type", String)
], PaginationQuery.prototype, "order", void 0);
//# sourceMappingURL=pagination.query.js.map