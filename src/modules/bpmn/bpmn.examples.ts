import { BpmnProcessDefinition } from '@/modules/bpmn/domain/bpmn-process-definition';

export const BPMN_EXAMPLE_PROCESS: BpmnProcessDefinition = {
  processId: 'bnpl_approval_flow',
  processName: 'BNPL Approval Flow',
  nodes: [
    { id: 'start_1', name: 'Application received', type: 'startEvent', position: { x: 120, y: 140 } },
    { id: 'task_1', name: 'Review application', type: 'userTask', position: { x: 220, y: 118 } },
    { id: 'gateway_1', name: 'Risk score ok?', type: 'exclusiveGateway', position: { x: 380, y: 133 } },
    { id: 'task_2', name: 'Run credit scoring', type: 'serviceTask', position: { x: 470, y: 118 } },
    { id: 'gateway_2', name: 'Extra checks', type: 'parallelGateway', position: { x: 630, y: 133 } },
    { id: 'task_3', name: 'Evaluate policy rules', type: 'businessRuleTask', position: { x: 720, y: 40 } },
    { id: 'task_4', name: 'Persist scoring script', type: 'scriptTask', position: { x: 720, y: 196 } },
    { id: 'gateway_3', name: 'Manual exception?', type: 'inclusiveGateway', position: { x: 900, y: 133 } },
    { id: 'end_1', name: 'Approved', type: 'endEvent', position: { x: 1040, y: 140 } },
  ],
  flows: [
    { id: 'flow_1', sourceRef: 'start_1', targetRef: 'task_1' },
    { id: 'flow_2', sourceRef: 'task_1', targetRef: 'gateway_1' },
    { id: 'flow_3', sourceRef: 'gateway_1', targetRef: 'task_2', name: 'yes' },
    { id: 'flow_4', sourceRef: 'task_2', targetRef: 'gateway_2' },
    { id: 'flow_5', sourceRef: 'gateway_2', targetRef: 'task_3' },
    { id: 'flow_6', sourceRef: 'gateway_2', targetRef: 'task_4' },
    { id: 'flow_7', sourceRef: 'task_3', targetRef: 'gateway_3' },
    { id: 'flow_8', sourceRef: 'task_4', targetRef: 'gateway_3' },
    { id: 'flow_9', sourceRef: 'gateway_3', targetRef: 'end_1', name: 'continue' },
  ],
};

export const BPMN_APPROVAL_TEMPLATE: BpmnProcessDefinition = {
  processId: 'generic_approval_flow',
  processName: 'Generic Approval Flow',
  nodes: [
    { id: 'start_1', name: 'Start', type: 'startEvent', position: { x: 100, y: 140 } },
    { id: 'task_1', name: 'Submit request', type: 'userTask', position: { x: 220, y: 118 } },
    { id: 'task_2', name: 'Manager review', type: 'userTask', position: { x: 380, y: 118 } },
    { id: 'gateway_1', name: 'Approved?', type: 'exclusiveGateway', position: { x: 560, y: 133 } },
    { id: 'end_1', name: 'Done', type: 'endEvent', position: { x: 720, y: 140 } },
  ],
  flows: [
    { id: 'flow_1', sourceRef: 'start_1', targetRef: 'task_1' },
    { id: 'flow_2', sourceRef: 'task_1', targetRef: 'task_2' },
    { id: 'flow_3', sourceRef: 'task_2', targetRef: 'gateway_1' },
    { id: 'flow_4', sourceRef: 'gateway_1', targetRef: 'end_1', name: 'yes' },
  ],
};

export const BPMN_LOAN_TEMPLATE: BpmnProcessDefinition = {
  processId: 'loan_origination_flow',
  processName: 'Loan Origination Flow',
  nodes: [
    { id: 'start_1', name: 'Loan created', type: 'startEvent', position: { x: 100, y: 140 } },
    { id: 'task_1', name: 'Collect documents', type: 'userTask', position: { x: 220, y: 118 } },
    { id: 'task_2', name: 'Score applicant', type: 'serviceTask', position: { x: 380, y: 118 } },
    { id: 'task_3', name: 'Evaluate policy', type: 'businessRuleTask', position: { x: 540, y: 118 } },
    { id: 'end_1', name: 'Decision ready', type: 'endEvent', position: { x: 720, y: 140 } },
  ],
  flows: [
    { id: 'flow_1', sourceRef: 'start_1', targetRef: 'task_1' },
    { id: 'flow_2', sourceRef: 'task_1', targetRef: 'task_2' },
    { id: 'flow_3', sourceRef: 'task_2', targetRef: 'task_3' },
    { id: 'flow_4', sourceRef: 'task_3', targetRef: 'end_1' },
  ],
};

export const BPMN_TEMPLATES = {
  bnpl: BPMN_EXAMPLE_PROCESS,
  approval: BPMN_APPROVAL_TEMPLATE,
  loan: BPMN_LOAN_TEMPLATE,
} as const;
