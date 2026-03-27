export type BpmnNodeType =
  | 'startEvent'
  | 'task'
  | 'userTask'
  | 'serviceTask'
  | 'scriptTask'
  | 'businessRuleTask'
  | 'exclusiveGateway'
  | 'parallelGateway'
  | 'inclusiveGateway'
  | 'endEvent';

export interface BpmnNodePosition {
  x: number;
  y: number;
}

export interface BpmnNode {
  id: string;
  name: string;
  type: BpmnNodeType;
  position?: BpmnNodePosition;
}

export interface BpmnSequenceFlow {
  id: string;
  sourceRef: string;
  targetRef: string;
  name?: string;
}

export interface BpmnProcessDefinition {
  processId: string;
  processName: string;
  nodes: BpmnNode[];
  flows: BpmnSequenceFlow[];
}
