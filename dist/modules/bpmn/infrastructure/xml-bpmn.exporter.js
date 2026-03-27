"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlBpmnExporter = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const bpmn_constants_1 = require("../bpmn.constants");
const bpmnModdlePackageJsonPath = require.resolve('bpmn-moddle/package.json');
const BpmnModdle = require((0, path_1.join)((0, path_1.dirname)(bpmnModdlePackageJsonPath), 'dist', 'index.cjs'));
let XmlBpmnExporter = class XmlBpmnExporter {
    constructor() {
        this.moddle = new BpmnModdle();
    }
    async exportProcess(definition) {
        const definitionId = `${bpmn_constants_1.BPMN_DEFINITION_CONSTANTS.DEFINITIONS_ID_PREFIX}${definition.processId}`;
        const process = this.moddle.create('bpmn:Process', {
            id: definition.processId,
            name: definition.processName,
            isExecutable: false,
            flowElements: [],
        });
        const nodesById = new Map();
        definition.nodes.forEach((node) => {
            const element = this.createNodeElement(node);
            nodesById.set(node.id, element);
            process.flowElements.push(element);
        });
        definition.flows.forEach((flow) => {
            const sourceRef = nodesById.get(flow.sourceRef);
            const targetRef = nodesById.get(flow.targetRef);
            if (!sourceRef || !targetRef) {
                throw new Error('BPMN exporter received flow with unknown node reference');
            }
            const sequenceFlow = this.moddle.create('bpmn:SequenceFlow', {
                id: flow.id,
                name: flow.name,
                sourceRef,
                targetRef,
            });
            sourceRef.outgoing.push(sequenceFlow);
            targetRef.incoming.push(sequenceFlow);
            process.flowElements.push(sequenceFlow);
        });
        const planeElements = [
            ...definition.nodes
                .filter((node) => node.position)
                .map((node) => this.createShape(node, nodesById)),
            ...definition.flows
                .map((flow) => this.createEdge(flow, definition.nodes))
                .filter(Boolean),
        ];
        const definitions = this.moddle.create('bpmn:Definitions', {
            id: definitionId,
            targetNamespace: bpmn_constants_1.BPMN_DEFINITION_CONSTANTS.TARGET_NAMESPACE,
            rootElements: [process],
            diagrams: planeElements.length > 0
                ? [
                    this.moddle.create('bpmndi:BPMNDiagram', {
                        id: `Diagram_${definition.processId}`,
                        plane: this.moddle.create('bpmndi:BPMNPlane', {
                            id: `Plane_${definition.processId}`,
                            bpmnElement: process,
                            planeElement: planeElements,
                        }),
                    }),
                ]
                : [],
        });
        const result = await this.moddle.toXML(definitions, { format: true });
        return result.xml;
    }
    async importProcess(xml) {
        const result = await this.moddle.fromXML(xml);
        const definitions = result.rootElement;
        const process = definitions.rootElements?.find((element) => element.$type === 'bpmn:Process');
        if (!process) {
            throw new Error('BPMN XML does not contain a process definition');
        }
        const shapes = new Map();
        definitions.diagrams?.forEach((diagram) => {
            diagram.plane?.planeElement?.forEach((planeElement) => {
                const bpmnElement = planeElement.bpmnElement;
                const bounds = planeElement.bounds;
                if (bpmnElement?.id && bounds?.x !== undefined && bounds?.y !== undefined) {
                    shapes.set(bpmnElement.id, {
                        x: bounds.x,
                        y: bounds.y,
                    });
                }
            });
        });
        const nodes = (process.flowElements ?? [])
            .filter((element) => this.isNodeElement(element.$type))
            .map((element) => {
            const id = String(element.id ?? '');
            const name = String(element.name ?? '');
            const position = shapes.get(id);
            return {
                id,
                name,
                type: this.resolveNodeTypeFromElementType(String(element.$type ?? '')),
                ...(position ? { position } : {}),
            };
        });
        const flows = (process.flowElements ?? [])
            .filter((element) => element.$type === 'bpmn:SequenceFlow')
            .map((element) => ({
            id: String(element.id ?? ''),
            sourceRef: String(element.sourceRef?.id ?? ''),
            targetRef: String(element.targetRef?.id ?? ''),
            ...(element.name ? { name: String(element.name) } : {}),
        }));
        return {
            processId: String(process.id ?? ''),
            processName: String(process.name ?? ''),
            nodes,
            flows,
        };
    }
    createNodeElement(node) {
        return this.moddle.create(this.resolveTypeName(node.type), {
            id: node.id,
            name: node.name,
            incoming: [],
            outgoing: [],
        });
    }
    createShape(node, nodesById) {
        if (!node.position) {
            return null;
        }
        const bpmnElement = nodesById.get(node.id);
        if (!bpmnElement) {
            return null;
        }
        return this.moddle.create('bpmndi:BPMNShape', {
            id: `Shape_${node.id}`,
            bpmnElement,
            bounds: this.moddle.create('dc:Bounds', {
                x: node.position.x,
                y: node.position.y,
                width: this.resolveWidth(node.type),
                height: this.resolveHeight(node.type),
            }),
        });
    }
    createEdge(flow, nodes) {
        const sourceNode = nodes.find((node) => node.id === flow.sourceRef);
        const targetNode = nodes.find((node) => node.id === flow.targetRef);
        if (!sourceNode?.position || !targetNode?.position) {
            return null;
        }
        return this.moddle.create('bpmndi:BPMNEdge', {
            id: `Edge_${flow.id}`,
            bpmnElement: this.moddle.create('bpmn:SequenceFlow', { id: flow.id }),
            waypoint: [
                this.moddle.create('dc:Point', {
                    x: sourceNode.position.x + this.resolveWidth(sourceNode.type),
                    y: sourceNode.position.y + this.resolveHeight(sourceNode.type) / 2,
                }),
                this.moddle.create('dc:Point', {
                    x: targetNode.position.x,
                    y: targetNode.position.y + this.resolveHeight(targetNode.type) / 2,
                }),
            ],
        });
    }
    resolveWidth(type) {
        if (type === bpmn_constants_1.BPMN_NODE_TYPES.START_EVENT || type === bpmn_constants_1.BPMN_NODE_TYPES.END_EVENT) {
            return bpmn_constants_1.BPMN_DI_DEFAULTS.EVENT_SIZE;
        }
        if (type === bpmn_constants_1.BPMN_NODE_TYPES.EXCLUSIVE_GATEWAY ||
            type === bpmn_constants_1.BPMN_NODE_TYPES.PARALLEL_GATEWAY ||
            type === bpmn_constants_1.BPMN_NODE_TYPES.INCLUSIVE_GATEWAY) {
            return bpmn_constants_1.BPMN_DI_DEFAULTS.GATEWAY_SIZE;
        }
        return bpmn_constants_1.BPMN_DI_DEFAULTS.TASK_WIDTH;
    }
    resolveHeight(type) {
        if (type === bpmn_constants_1.BPMN_NODE_TYPES.START_EVENT || type === bpmn_constants_1.BPMN_NODE_TYPES.END_EVENT) {
            return bpmn_constants_1.BPMN_DI_DEFAULTS.EVENT_SIZE;
        }
        if (type === bpmn_constants_1.BPMN_NODE_TYPES.EXCLUSIVE_GATEWAY ||
            type === bpmn_constants_1.BPMN_NODE_TYPES.PARALLEL_GATEWAY ||
            type === bpmn_constants_1.BPMN_NODE_TYPES.INCLUSIVE_GATEWAY) {
            return bpmn_constants_1.BPMN_DI_DEFAULTS.GATEWAY_SIZE;
        }
        return bpmn_constants_1.BPMN_DI_DEFAULTS.TASK_HEIGHT;
    }
    resolveTypeName(type) {
        if (type === bpmn_constants_1.BPMN_NODE_TYPES.START_EVENT) {
            return 'bpmn:StartEvent';
        }
        if (type === bpmn_constants_1.BPMN_NODE_TYPES.TASK) {
            return 'bpmn:Task';
        }
        if (type === bpmn_constants_1.BPMN_NODE_TYPES.USER_TASK) {
            return 'bpmn:UserTask';
        }
        if (type === bpmn_constants_1.BPMN_NODE_TYPES.SERVICE_TASK) {
            return 'bpmn:ServiceTask';
        }
        if (type === bpmn_constants_1.BPMN_NODE_TYPES.SCRIPT_TASK) {
            return 'bpmn:ScriptTask';
        }
        if (type === bpmn_constants_1.BPMN_NODE_TYPES.BUSINESS_RULE_TASK) {
            return 'bpmn:BusinessRuleTask';
        }
        if (type === bpmn_constants_1.BPMN_NODE_TYPES.EXCLUSIVE_GATEWAY) {
            return 'bpmn:ExclusiveGateway';
        }
        if (type === bpmn_constants_1.BPMN_NODE_TYPES.PARALLEL_GATEWAY) {
            return 'bpmn:ParallelGateway';
        }
        if (type === bpmn_constants_1.BPMN_NODE_TYPES.INCLUSIVE_GATEWAY) {
            return 'bpmn:InclusiveGateway';
        }
        return 'bpmn:EndEvent';
    }
    isNodeElement(type) {
        return [
            'bpmn:StartEvent',
            'bpmn:Task',
            'bpmn:UserTask',
            'bpmn:ServiceTask',
            'bpmn:ScriptTask',
            'bpmn:BusinessRuleTask',
            'bpmn:ExclusiveGateway',
            'bpmn:ParallelGateway',
            'bpmn:InclusiveGateway',
            'bpmn:EndEvent',
        ].includes(type ?? '');
    }
    resolveNodeTypeFromElementType(type) {
        if (type === 'bpmn:StartEvent') {
            return bpmn_constants_1.BPMN_NODE_TYPES.START_EVENT;
        }
        if (type === 'bpmn:Task') {
            return bpmn_constants_1.BPMN_NODE_TYPES.TASK;
        }
        if (type === 'bpmn:UserTask') {
            return bpmn_constants_1.BPMN_NODE_TYPES.USER_TASK;
        }
        if (type === 'bpmn:ServiceTask') {
            return bpmn_constants_1.BPMN_NODE_TYPES.SERVICE_TASK;
        }
        if (type === 'bpmn:ScriptTask') {
            return bpmn_constants_1.BPMN_NODE_TYPES.SCRIPT_TASK;
        }
        if (type === 'bpmn:BusinessRuleTask') {
            return bpmn_constants_1.BPMN_NODE_TYPES.BUSINESS_RULE_TASK;
        }
        if (type === 'bpmn:ExclusiveGateway') {
            return bpmn_constants_1.BPMN_NODE_TYPES.EXCLUSIVE_GATEWAY;
        }
        if (type === 'bpmn:ParallelGateway') {
            return bpmn_constants_1.BPMN_NODE_TYPES.PARALLEL_GATEWAY;
        }
        if (type === 'bpmn:InclusiveGateway') {
            return bpmn_constants_1.BPMN_NODE_TYPES.INCLUSIVE_GATEWAY;
        }
        return bpmn_constants_1.BPMN_NODE_TYPES.END_EVENT;
    }
};
exports.XmlBpmnExporter = XmlBpmnExporter;
exports.XmlBpmnExporter = XmlBpmnExporter = __decorate([
    (0, common_1.Injectable)()
], XmlBpmnExporter);
//# sourceMappingURL=xml-bpmn.exporter.js.map