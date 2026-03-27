"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpmnModule = void 0;
const common_1 = require("@nestjs/common");
const bpmn_service_1 = require("./application/bpmn.service");
const bpmn_tokens_1 = require("./bpmn.tokens");
const bpmn_controller_1 = require("./interfaces/bpmn.controller");
const xml_bpmn_exporter_1 = require("./infrastructure/xml-bpmn.exporter");
let BpmnModule = class BpmnModule {
};
exports.BpmnModule = BpmnModule;
exports.BpmnModule = BpmnModule = __decorate([
    (0, common_1.Module)({
        controllers: [bpmn_controller_1.BpmnController],
        providers: [
            bpmn_service_1.BpmnService,
            {
                provide: bpmn_tokens_1.BPMN_XML_EXPORTER,
                useClass: xml_bpmn_exporter_1.XmlBpmnExporter,
            },
        ],
    })
], BpmnModule);
//# sourceMappingURL=bpmn.module.js.map