import { BpmnProcessDefinition } from '@/modules/bpmn/domain/bpmn-process-definition';

export interface BpmnXmlExporter {
  exportProcess(definition: BpmnProcessDefinition): Promise<string>;
  importProcess(xml: string): Promise<BpmnProcessDefinition>;
}
