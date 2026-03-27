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
exports.BpmnService = void 0;
const bpmn_examples_1 = require("../bpmn.examples");
const common_1 = require("@nestjs/common");
const bpmn_constants_1 = require("../bpmn.constants");
const bpmn_tokens_1 = require("../bpmn.tokens");
const invalid_bpmn_process_definition_exception_1 = require("../exceptions/invalid-bpmn-process-definition.exception");
let BpmnService = class BpmnService {
    constructor(bpmnXmlExporter) {
        this.bpmnXmlExporter = bpmnXmlExporter;
    }
    async exportXml(definition) {
        this.validateDefinition(definition);
        return this.bpmnXmlExporter.exportProcess(definition);
    }
    async importXml(xml) {
        const definition = await this.bpmnXmlExporter.importProcess(xml);
        this.validateDefinition(definition);
        return definition;
    }
    async roundtripXml(xml) {
        const definition = await this.importXml(xml);
        const normalizedXml = await this.exportXml(definition);
        return {
            definition,
            xml: normalizedXml,
        };
    }
    getExampleDefinition() {
        return bpmn_examples_1.BPMN_EXAMPLE_PROCESS;
    }
    async getBnplTemplate() {
        return {
            definition: bpmn_examples_1.BPMN_EXAMPLE_PROCESS,
            xml: await this.exportXml(bpmn_examples_1.BPMN_EXAMPLE_PROCESS),
        };
    }
    async getTemplate(template) {
        const definition = bpmn_examples_1.BPMN_TEMPLATES[template];
        return {
            definition,
            xml: await this.exportXml(definition),
        };
    }
    validateDefinition(definition) {
        const nodeIds = new Set(definition.nodes.map((node) => node.id));
        const startEvents = definition.nodes.filter((node) => node.type === bpmn_constants_1.BPMN_NODE_TYPES.START_EVENT);
        const endEvents = definition.nodes.filter((node) => node.type === bpmn_constants_1.BPMN_NODE_TYPES.END_EVENT);
        if (startEvents.length !== 1) {
            throw new invalid_bpmn_process_definition_exception_1.InvalidBpmnProcessDefinitionException('BPMN process must contain exactly one start event');
        }
        if (endEvents.length < 1) {
            throw new invalid_bpmn_process_definition_exception_1.InvalidBpmnProcessDefinitionException('BPMN process must contain at least one end event');
        }
        if (nodeIds.size !== definition.nodes.length) {
            throw new invalid_bpmn_process_definition_exception_1.InvalidBpmnProcessDefinitionException('BPMN node ids must be unique');
        }
        this.validateFlows(definition.flows, nodeIds);
    }
    validateFlows(flows, nodeIds) {
        const flowIds = new Set();
        flows.forEach((flow) => {
            if (flowIds.has(flow.id)) {
                throw new invalid_bpmn_process_definition_exception_1.InvalidBpmnProcessDefinitionException('BPMN flow ids must be unique');
            }
            flowIds.add(flow.id);
            if (!nodeIds.has(flow.sourceRef) || !nodeIds.has(flow.targetRef)) {
                throw new invalid_bpmn_process_definition_exception_1.InvalidBpmnProcessDefinitionException('BPMN flows must reference existing node ids');
            }
        });
    }
};
exports.BpmnService = BpmnService;
exports.BpmnService = BpmnService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(bpmn_tokens_1.BPMN_XML_EXPORTER)),
    __metadata("design:paramtypes", [Object])
], BpmnService);
//# sourceMappingURL=bpmn.service.js.map