import { BadRequestException } from '@nestjs/common';
import { BPMN_ERROR_CODES } from '@/modules/bpmn/bpmn.constants';

export class InvalidBpmnProcessDefinitionException extends BadRequestException {
  constructor(message: string) {
    super({
      message,
      code: BPMN_ERROR_CODES.INVALID_PROCESS_DEFINITION,
    });
  }
}
