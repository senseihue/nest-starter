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
exports.ExportBpmnXmlDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const bpmn_constants_1 = require("../bpmn.constants");
class ExportBpmnNodePositionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ExportBpmnNodePositionDto.prototype, "x", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ExportBpmnNodePositionDto.prototype, "y", void 0);
class ExportBpmnNodeDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportBpmnNodeDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportBpmnNodeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Object.values(bpmn_constants_1.BPMN_NODE_TYPES) }),
    (0, class_validator_1.IsEnum)(bpmn_constants_1.BPMN_NODE_TYPES),
    __metadata("design:type", Object)
], ExportBpmnNodeDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { x: 220, y: 118 },
        description: 'Optional BPMN diagram coordinates for shape generation',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ExportBpmnNodePositionDto),
    __metadata("design:type", ExportBpmnNodePositionDto)
], ExportBpmnNodeDto.prototype, "position", void 0);
class ExportBpmnFlowDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportBpmnFlowDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportBpmnFlowDto.prototype, "sourceRef", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportBpmnFlowDto.prototype, "targetRef", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportBpmnFlowDto.prototype, "name", void 0);
class ExportBpmnXmlDto {
}
exports.ExportBpmnXmlDto = ExportBpmnXmlDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportBpmnXmlDto.prototype, "processId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportBpmnXmlDto.prototype, "processName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ExportBpmnNodeDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ExportBpmnNodeDto),
    __metadata("design:type", Array)
], ExportBpmnXmlDto.prototype, "nodes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ExportBpmnFlowDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ExportBpmnFlowDto),
    __metadata("design:type", Array)
], ExportBpmnXmlDto.prototype, "flows", void 0);
//# sourceMappingURL=export-bpmn-xml.dto.js.map