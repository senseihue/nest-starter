import { BPMN_EXAMPLE_PROCESS, BPMN_TEMPLATES } from '@/modules/bpmn/bpmn.examples';
import { Inject, Injectable } from '@nestjs/common';
import { BPMN_NODE_TYPES } from '@/modules/bpmn/bpmn.constants';
import { BPMN_XML_EXPORTER } from '@/modules/bpmn/bpmn.tokens';
import {
  BpmnProcessDefinition,
  BpmnSequenceFlow,
} from '@/modules/bpmn/domain/bpmn-process-definition';
import { BpmnXmlExporter } from '@/modules/bpmn/domain/bpmn-xml-exporter';
import { InvalidBpmnProcessDefinitionException } from '@/modules/bpmn/exceptions/invalid-bpmn-process-definition.exception';

@Injectable()
export class BpmnService {
  constructor(
    @Inject(BPMN_XML_EXPORTER) private readonly bpmnXmlExporter: BpmnXmlExporter,
  ) {}

  async exportXml(definition: BpmnProcessDefinition) {
    this.validateDefinition(definition);

    return this.bpmnXmlExporter.exportProcess(definition);
  }

  async importXml(xml: string) {
    const definition = await this.bpmnXmlExporter.importProcess(xml);
    this.validateDefinition(definition);
    return definition;
  }

  async roundtripXml(xml: string) {
    const definition = await this.importXml(xml);
    const normalizedXml = await this.exportXml(definition);

    return {
      definition,
      xml: normalizedXml,
    };
  }

  getExampleDefinition() {
    return BPMN_EXAMPLE_PROCESS;
  }

  async getBnplTemplate() {
    return {
      definition: BPMN_EXAMPLE_PROCESS,
      xml: await this.exportXml(BPMN_EXAMPLE_PROCESS),
    };
  }

  async getTemplate(template: keyof typeof BPMN_TEMPLATES) {
    const definition = BPMN_TEMPLATES[template];

    return {
      definition,
      xml: await this.exportXml(definition),
    };
  }

  private validateDefinition(definition: BpmnProcessDefinition) {
    const nodeIds = new Set(definition.nodes.map((node) => node.id));
    const startEvents = definition.nodes.filter(
      (node) => node.type === BPMN_NODE_TYPES.START_EVENT,
    );
    const endEvents = definition.nodes.filter(
      (node) => node.type === BPMN_NODE_TYPES.END_EVENT,
    );

    if (startEvents.length !== 1) {
      throw new InvalidBpmnProcessDefinitionException(
        'BPMN process must contain exactly one start event',
      );
    }

    if (endEvents.length < 1) {
      throw new InvalidBpmnProcessDefinitionException(
        'BPMN process must contain at least one end event',
      );
    }

    if (nodeIds.size !== definition.nodes.length) {
      throw new InvalidBpmnProcessDefinitionException('BPMN node ids must be unique');
    }

    this.validateFlows(definition.flows, nodeIds);
  }

  private validateFlows(flows: BpmnSequenceFlow[], nodeIds: Set<string>) {
    const flowIds = new Set<string>();

    flows.forEach((flow) => {
      if (flowIds.has(flow.id)) {
        throw new InvalidBpmnProcessDefinitionException('BPMN flow ids must be unique');
      }

      flowIds.add(flow.id);

      if (!nodeIds.has(flow.sourceRef) || !nodeIds.has(flow.targetRef)) {
        throw new InvalidBpmnProcessDefinitionException(
          'BPMN flows must reference existing node ids',
        );
      }
    });
  }
}
