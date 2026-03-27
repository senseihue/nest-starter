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
exports.BpmnController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const bpmn_constants_1 = require("../bpmn.constants");
const bpmn_service_1 = require("../application/bpmn.service");
const export_bpmn_xml_dto_1 = require("./export-bpmn-xml.dto");
const import_bpmn_xml_dto_1 = require("./import-bpmn-xml.dto");
const bpmn_preview_presenter_1 = require("./bpmn-preview.presenter");
const bpmn_presenter_1 = require("./bpmn.presenter");
let BpmnController = class BpmnController {
    constructor(bpmnService) {
        this.bpmnService = bpmnService;
    }
    preview(response) {
        response.setHeader('Content-Type', bpmn_constants_1.BPMN_RESPONSE_CONSTANTS.HTML_CONTENT_TYPE);
        response.send((0, bpmn_preview_presenter_1.toBpmnPreviewHtml)());
    }
    assetViewerJs(response) {
        response.setHeader('Content-Type', bpmn_constants_1.BPMN_RESPONSE_CONSTANTS.JAVASCRIPT_CONTENT_TYPE);
        response.sendFile(this.resolveBpmnJsAsset('bpmn-modeler.development.js'));
    }
    assetDiagramCss(response) {
        response.setHeader('Content-Type', bpmn_constants_1.BPMN_RESPONSE_CONSTANTS.CSS_CONTENT_TYPE);
        response.sendFile(this.resolveBpmnJsAsset('assets/diagram-js.css'));
    }
    assetBpmnCss(response) {
        response.setHeader('Content-Type', bpmn_constants_1.BPMN_RESPONSE_CONSTANTS.CSS_CONTENT_TYPE);
        response.sendFile(this.resolveBpmnJsAsset('assets/bpmn-js.css'));
    }
    assetBpmnFontCss(response) {
        response.setHeader('Content-Type', bpmn_constants_1.BPMN_RESPONSE_CONSTANTS.CSS_CONTENT_TYPE);
        response.sendFile(this.resolveBpmnJsAsset('assets/bpmn-font/css/bpmn-embedded.css'));
    }
    getExampleDefinition() {
        return this.bpmnService.getExampleDefinition();
    }
    async getBnplTemplate() {
        return this.bpmnService.getBnplTemplate();
    }
    async getTemplate(template) {
        return this.bpmnService.getTemplate(template);
    }
    async exportXml(dto) {
        const xml = await this.bpmnService.exportXml(dto);
        return (0, bpmn_presenter_1.toBpmnXmlResponse)(xml);
    }
    async importXml(dto) {
        return this.bpmnService.importXml(dto.xml);
    }
    async roundtripXml(dto) {
        return this.bpmnService.roundtripXml(dto.xml);
    }
    async downloadXml(dto, response) {
        const xml = await this.bpmnService.exportXml(dto);
        const fileName = (0, bpmn_presenter_1.toBpmnFileName)(dto.processId);
        response.setHeader('Content-Type', bpmn_constants_1.BPMN_RESPONSE_CONSTANTS.CONTENT_TYPE);
        response.setHeader('Content-Disposition', `${bpmn_constants_1.BPMN_RESPONSE_CONSTANTS.CONTENT_DISPOSITION_PREFIX}"${fileName}"`);
        response.send(xml);
    }
    resolveBpmnJsAsset(relativePath) {
        const packageJsonPath = require.resolve('bpmn-js/package.json');
        return (0, path_1.join)((0, path_1.dirname)(packageJsonPath), 'dist', relativePath);
    }
};
exports.BpmnController = BpmnController;
__decorate([
    (0, common_1.Get)(bpmn_constants_1.BPMN_ROUTES.PREVIEW),
    (0, swagger_1.ApiOperation)({
        summary: bpmn_constants_1.BPMN_OPERATION_SUMMARIES.PREVIEW,
        description: bpmn_constants_1.BPMN_OPERATION_DESCRIPTIONS.PREVIEW,
    }),
    (0, swagger_1.ApiOkResponse)({ description: bpmn_constants_1.BPMN_RESPONSE_DESCRIPTIONS.PREVIEW }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BpmnController.prototype, "preview", null);
__decorate([
    (0, common_1.Get)(bpmn_constants_1.BPMN_ROUTES.ASSET_VIEWER_JS),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BpmnController.prototype, "assetViewerJs", null);
__decorate([
    (0, common_1.Get)(bpmn_constants_1.BPMN_ROUTES.ASSET_DIAGRAM_CSS),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BpmnController.prototype, "assetDiagramCss", null);
__decorate([
    (0, common_1.Get)(bpmn_constants_1.BPMN_ROUTES.ASSET_BPMN_CSS),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BpmnController.prototype, "assetBpmnCss", null);
__decorate([
    (0, common_1.Get)(bpmn_constants_1.BPMN_ROUTES.ASSET_BPMN_FONT_CSS),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BpmnController.prototype, "assetBpmnFontCss", null);
__decorate([
    (0, common_1.Get)(bpmn_constants_1.BPMN_ROUTES.EXAMPLE),
    (0, swagger_1.ApiOperation)({
        summary: bpmn_constants_1.BPMN_OPERATION_SUMMARIES.EXAMPLE,
        description: bpmn_constants_1.BPMN_OPERATION_DESCRIPTIONS.EXAMPLE,
    }),
    (0, swagger_1.ApiOkResponse)({ description: bpmn_constants_1.BPMN_RESPONSE_DESCRIPTIONS.EXAMPLE }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BpmnController.prototype, "getExampleDefinition", null);
__decorate([
    (0, common_1.Get)(bpmn_constants_1.BPMN_ROUTES.BNPL_TEMPLATE),
    (0, swagger_1.ApiOperation)({
        summary: bpmn_constants_1.BPMN_OPERATION_SUMMARIES.BNPL_TEMPLATE,
        description: bpmn_constants_1.BPMN_OPERATION_DESCRIPTIONS.BNPL_TEMPLATE,
    }),
    (0, swagger_1.ApiOkResponse)({ description: bpmn_constants_1.BPMN_RESPONSE_DESCRIPTIONS.BNPL_TEMPLATE }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BpmnController.prototype, "getBnplTemplate", null);
__decorate([
    (0, common_1.Get)(bpmn_constants_1.BPMN_ROUTES.TEMPLATE),
    (0, swagger_1.ApiOperation)({
        summary: bpmn_constants_1.BPMN_OPERATION_SUMMARIES.BNPL_TEMPLATE,
        description: bpmn_constants_1.BPMN_OPERATION_DESCRIPTIONS.BNPL_TEMPLATE,
    }),
    (0, swagger_1.ApiOkResponse)({ description: bpmn_constants_1.BPMN_RESPONSE_DESCRIPTIONS.BNPL_TEMPLATE }),
    __param(0, (0, common_1.Param)('template')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BpmnController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Post)(bpmn_constants_1.BPMN_ROUTES.EXPORT_XML),
    (0, swagger_1.ApiOperation)({
        summary: bpmn_constants_1.BPMN_OPERATION_SUMMARIES.EXPORT_XML,
        description: bpmn_constants_1.BPMN_OPERATION_DESCRIPTIONS.EXPORT_XML,
    }),
    (0, swagger_1.ApiOkResponse)({ description: bpmn_constants_1.BPMN_RESPONSE_DESCRIPTIONS.EXPORT_XML }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [export_bpmn_xml_dto_1.ExportBpmnXmlDto]),
    __metadata("design:returntype", Promise)
], BpmnController.prototype, "exportXml", null);
__decorate([
    (0, common_1.Post)(bpmn_constants_1.BPMN_ROUTES.IMPORT_XML),
    (0, swagger_1.ApiOperation)({
        summary: bpmn_constants_1.BPMN_OPERATION_SUMMARIES.IMPORT_XML,
        description: bpmn_constants_1.BPMN_OPERATION_DESCRIPTIONS.IMPORT_XML,
    }),
    (0, swagger_1.ApiOkResponse)({ description: bpmn_constants_1.BPMN_RESPONSE_DESCRIPTIONS.IMPORT_XML }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_bpmn_xml_dto_1.ImportBpmnXmlDto]),
    __metadata("design:returntype", Promise)
], BpmnController.prototype, "importXml", null);
__decorate([
    (0, common_1.Post)(bpmn_constants_1.BPMN_ROUTES.ROUNDTRIP_XML),
    (0, swagger_1.ApiOperation)({
        summary: bpmn_constants_1.BPMN_OPERATION_SUMMARIES.ROUNDTRIP_XML,
        description: bpmn_constants_1.BPMN_OPERATION_DESCRIPTIONS.ROUNDTRIP_XML,
    }),
    (0, swagger_1.ApiOkResponse)({ description: bpmn_constants_1.BPMN_RESPONSE_DESCRIPTIONS.ROUNDTRIP_XML }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_bpmn_xml_dto_1.ImportBpmnXmlDto]),
    __metadata("design:returntype", Promise)
], BpmnController.prototype, "roundtripXml", null);
__decorate([
    (0, common_1.Post)(bpmn_constants_1.BPMN_ROUTES.DOWNLOAD_XML),
    (0, swagger_1.ApiOperation)({
        summary: bpmn_constants_1.BPMN_OPERATION_SUMMARIES.DOWNLOAD_XML,
        description: bpmn_constants_1.BPMN_OPERATION_DESCRIPTIONS.DOWNLOAD_XML,
    }),
    (0, swagger_1.ApiOkResponse)({ description: bpmn_constants_1.BPMN_RESPONSE_DESCRIPTIONS.DOWNLOAD_XML }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [export_bpmn_xml_dto_1.ExportBpmnXmlDto, Object]),
    __metadata("design:returntype", Promise)
], BpmnController.prototype, "downloadXml", null);
exports.BpmnController = BpmnController = __decorate([
    (0, swagger_1.ApiTags)(bpmn_constants_1.BPMN_CONTROLLER_TAG),
    (0, common_1.Controller)(bpmn_constants_1.BPMN_CONTROLLER_BASE_PATH),
    __metadata("design:paramtypes", [bpmn_service_1.BpmnService])
], BpmnController);
//# sourceMappingURL=bpmn.controller.js.map