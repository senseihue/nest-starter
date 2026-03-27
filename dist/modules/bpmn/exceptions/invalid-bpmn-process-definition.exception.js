"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidBpmnProcessDefinitionException = void 0;
const common_1 = require("@nestjs/common");
const bpmn_constants_1 = require("../bpmn.constants");
class InvalidBpmnProcessDefinitionException extends common_1.BadRequestException {
    constructor(message) {
        super({
            message,
            code: bpmn_constants_1.BPMN_ERROR_CODES.INVALID_PROCESS_DEFINITION,
        });
    }
}
exports.InvalidBpmnProcessDefinitionException = InvalidBpmnProcessDefinitionException;
//# sourceMappingURL=invalid-bpmn-process-definition.exception.js.map