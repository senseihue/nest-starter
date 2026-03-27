import { BPMN_RESPONSE_CONSTANTS } from '@/modules/bpmn/bpmn.constants';

export function toBpmnXmlResponse(xml: string) {
  return {
    format: BPMN_RESPONSE_CONSTANTS.FORMAT,
    xml,
  };
}

export function toBpmnFileName(processId: string) {
  return `${processId}${BPMN_RESPONSE_CONSTANTS.FILE_EXTENSION}`;
}
