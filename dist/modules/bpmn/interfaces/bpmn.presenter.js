"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBpmnXmlResponse = toBpmnXmlResponse;
exports.toBpmnFileName = toBpmnFileName;
const bpmn_constants_1 = require("../bpmn.constants");
function toBpmnXmlResponse(xml) {
    return {
        format: bpmn_constants_1.BPMN_RESPONSE_CONSTANTS.FORMAT,
        xml,
    };
}
function toBpmnFileName(processId) {
    return `${processId}${bpmn_constants_1.BPMN_RESPONSE_CONSTANTS.FILE_EXTENSION}`;
}
//# sourceMappingURL=bpmn.presenter.js.map