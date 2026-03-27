import { Injectable } from '@nestjs/common';
import { dirname, join } from 'path';
import {
  BPMN_DEFINITION_CONSTANTS,
  BPMN_DI_DEFAULTS,
  BPMN_NODE_TYPES,
} from '@/modules/bpmn/bpmn.constants';
import {
  BpmnNode,
  BpmnProcessDefinition,
  BpmnSequenceFlow,
} from '@/modules/bpmn/domain/bpmn-process-definition';
import { BpmnXmlExporter } from '@/modules/bpmn/domain/bpmn-xml-exporter';

const bpmnModdlePackageJsonPath = require.resolve('bpmn-moddle/package.json');
const BpmnModdle = require(join(dirname(bpmnModdlePackageJsonPath), 'dist', 'index.cjs'));

type BpmnModdleElement = {
  id: string;
  incoming: BpmnModdleElement[];
  outgoing: BpmnModdleElement[];
};

@Injectable()
export class XmlBpmnExporter implements BpmnXmlExporter {
  private readonly moddle = new BpmnModdle();

  async exportProcess(definition: BpmnProcessDefinition): Promise<string> {
    const definitionId = `${BPMN_DEFINITION_CONSTANTS.DEFINITIONS_ID_PREFIX}${definition.processId}`;
    const process = this.moddle.create('bpmn:Process', {
      id: definition.processId,
      name: definition.processName,
      isExecutable: false,
      flowElements: [],
    }) as { flowElements: unknown[] };

    const nodesById = new Map<string, BpmnModdleElement>();
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
      }) as BpmnModdleElement;

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
      targetNamespace: BPMN_DEFINITION_CONSTANTS.TARGET_NAMESPACE,
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

  async importProcess(xml: string): Promise<BpmnProcessDefinition> {
    const result = await this.moddle.fromXML(xml);
    const definitions = result.rootElement as {
      rootElements?: Array<{
        $type?: string;
        id?: string;
        name?: string;
        flowElements?: Array<Record<string, unknown>>;
      }>;
      diagrams?: Array<{
        plane?: {
          planeElement?: Array<Record<string, unknown>>;
        };
      }>;
    };

    const process = definitions.rootElements?.find(
      (element) => element.$type === 'bpmn:Process',
    );

    if (!process) {
      throw new Error('BPMN XML does not contain a process definition');
    }

    const shapes = new Map<string, { x: number; y: number }>();
    definitions.diagrams?.forEach((diagram) => {
      diagram.plane?.planeElement?.forEach((planeElement) => {
        const bpmnElement = planeElement.bpmnElement as { id?: string } | undefined;
        const bounds = planeElement.bounds as { x?: number; y?: number } | undefined;

        if (bpmnElement?.id && bounds?.x !== undefined && bounds?.y !== undefined) {
          shapes.set(bpmnElement.id, {
            x: bounds.x,
            y: bounds.y,
          });
        }
      });
    });

    const nodes = (process.flowElements ?? [])
      .filter((element) => this.isNodeElement(element.$type as string | undefined))
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
        sourceRef: String((element.sourceRef as { id?: string } | undefined)?.id ?? ''),
        targetRef: String((element.targetRef as { id?: string } | undefined)?.id ?? ''),
        ...(element.name ? { name: String(element.name) } : {}),
      }));

    return {
      processId: String(process.id ?? ''),
      processName: String(process.name ?? ''),
      nodes,
      flows,
    };
  }

  private createNodeElement(node: BpmnNode) {
    return this.moddle.create(this.resolveTypeName(node.type), {
      id: node.id,
      name: node.name,
      incoming: [],
      outgoing: [],
    }) as BpmnModdleElement;
  }

  private createShape(node: BpmnNode, nodesById: Map<string, BpmnModdleElement>) {
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

  private createEdge(flow: BpmnSequenceFlow, nodes: BpmnNode[]) {
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

  private resolveWidth(type: BpmnNode['type']) {
    if (type === BPMN_NODE_TYPES.START_EVENT || type === BPMN_NODE_TYPES.END_EVENT) {
      return BPMN_DI_DEFAULTS.EVENT_SIZE;
    }

    if (
      type === BPMN_NODE_TYPES.EXCLUSIVE_GATEWAY ||
      type === BPMN_NODE_TYPES.PARALLEL_GATEWAY ||
      type === BPMN_NODE_TYPES.INCLUSIVE_GATEWAY
    ) {
      return BPMN_DI_DEFAULTS.GATEWAY_SIZE;
    }

    return BPMN_DI_DEFAULTS.TASK_WIDTH;
  }

  private resolveHeight(type: BpmnNode['type']) {
    if (type === BPMN_NODE_TYPES.START_EVENT || type === BPMN_NODE_TYPES.END_EVENT) {
      return BPMN_DI_DEFAULTS.EVENT_SIZE;
    }

    if (
      type === BPMN_NODE_TYPES.EXCLUSIVE_GATEWAY ||
      type === BPMN_NODE_TYPES.PARALLEL_GATEWAY ||
      type === BPMN_NODE_TYPES.INCLUSIVE_GATEWAY
    ) {
      return BPMN_DI_DEFAULTS.GATEWAY_SIZE;
    }

    return BPMN_DI_DEFAULTS.TASK_HEIGHT;
  }

  private resolveTypeName(type: BpmnNode['type']) {
    if (type === BPMN_NODE_TYPES.START_EVENT) {
      return 'bpmn:StartEvent';
    }

    if (type === BPMN_NODE_TYPES.TASK) {
      return 'bpmn:Task';
    }

    if (type === BPMN_NODE_TYPES.USER_TASK) {
      return 'bpmn:UserTask';
    }

    if (type === BPMN_NODE_TYPES.SERVICE_TASK) {
      return 'bpmn:ServiceTask';
    }

    if (type === BPMN_NODE_TYPES.SCRIPT_TASK) {
      return 'bpmn:ScriptTask';
    }

    if (type === BPMN_NODE_TYPES.BUSINESS_RULE_TASK) {
      return 'bpmn:BusinessRuleTask';
    }

    if (type === BPMN_NODE_TYPES.EXCLUSIVE_GATEWAY) {
      return 'bpmn:ExclusiveGateway';
    }

    if (type === BPMN_NODE_TYPES.PARALLEL_GATEWAY) {
      return 'bpmn:ParallelGateway';
    }

    if (type === BPMN_NODE_TYPES.INCLUSIVE_GATEWAY) {
      return 'bpmn:InclusiveGateway';
    }

    return 'bpmn:EndEvent';
  }

  private isNodeElement(type?: string) {
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

  private resolveNodeTypeFromElementType(type: string): BpmnNode['type'] {
    if (type === 'bpmn:StartEvent') {
      return BPMN_NODE_TYPES.START_EVENT;
    }
    if (type === 'bpmn:Task') {
      return BPMN_NODE_TYPES.TASK;
    }
    if (type === 'bpmn:UserTask') {
      return BPMN_NODE_TYPES.USER_TASK;
    }
    if (type === 'bpmn:ServiceTask') {
      return BPMN_NODE_TYPES.SERVICE_TASK;
    }
    if (type === 'bpmn:ScriptTask') {
      return BPMN_NODE_TYPES.SCRIPT_TASK;
    }
    if (type === 'bpmn:BusinessRuleTask') {
      return BPMN_NODE_TYPES.BUSINESS_RULE_TASK;
    }
    if (type === 'bpmn:ExclusiveGateway') {
      return BPMN_NODE_TYPES.EXCLUSIVE_GATEWAY;
    }
    if (type === 'bpmn:ParallelGateway') {
      return BPMN_NODE_TYPES.PARALLEL_GATEWAY;
    }
    if (type === 'bpmn:InclusiveGateway') {
      return BPMN_NODE_TYPES.INCLUSIVE_GATEWAY;
    }

    return BPMN_NODE_TYPES.END_EVENT;
  }
}
