"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BPMN_DI_DEFAULTS = exports.BPMN_ERROR_CODES = exports.BPMN_RESPONSE_CONSTANTS = exports.BPMN_NODE_TYPES = exports.BPMN_DEFINITION_CONSTANTS = exports.BPMN_RESPONSE_DESCRIPTIONS = exports.BPMN_OPERATION_DESCRIPTIONS = exports.BPMN_OPERATION_SUMMARIES = exports.BPMN_ROUTES = exports.BPMN_CONTROLLER_BASE_PATH = exports.BPMN_CONTROLLER_TAG = void 0;
exports.BPMN_CONTROLLER_TAG = 'bpmn';
exports.BPMN_CONTROLLER_BASE_PATH = 'bpmn';
exports.BPMN_ROUTES = {
    EXPORT_XML: 'xml/export',
    DOWNLOAD_XML: 'xml/download',
    IMPORT_XML: 'xml/import',
    ROUNDTRIP_XML: 'xml/roundtrip',
    EXAMPLE: 'example',
    BNPL_TEMPLATE: 'templates/bnpl',
    TEMPLATE: 'templates/:template',
    PREVIEW: 'preview',
    ASSET_VIEWER_JS: 'assets/bpmn-viewer.js',
    ASSET_DIAGRAM_CSS: 'assets/diagram.css',
    ASSET_BPMN_CSS: 'assets/bpmn.css',
    ASSET_BPMN_FONT_CSS: 'assets/bpmn-font.css',
};
exports.BPMN_OPERATION_SUMMARIES = {
    EXPORT_XML: 'Export BPMN XML',
    DOWNLOAD_XML: 'Download BPMN XML',
    IMPORT_XML: 'Import BPMN XML',
    ROUNDTRIP_XML: 'Roundtrip BPMN XML',
    EXAMPLE: 'Get BPMN example definition',
    BNPL_TEMPLATE: 'Get BNPL BPMN template',
    PREVIEW: 'Open BPMN preview page',
};
exports.BPMN_OPERATION_DESCRIPTIONS = {
    EXPORT_XML: 'Builds BPMN 2.0 XML from a process definition payload',
    DOWNLOAD_XML: 'Builds BPMN 2.0 XML and returns it as a downloadable BPMN file',
    IMPORT_XML: 'Parses BPMN 2.0 XML into the starter JSON definition format',
    ROUNDTRIP_XML: 'Imports BPMN XML and exports a normalized BPMN XML together with the parsed definition',
    EXAMPLE: 'Returns a ready-to-use BPMN definition payload for XML export or viewer integration',
    BNPL_TEMPLATE: 'Returns a BNPL-specific BPMN template and its generated XML',
    PREVIEW: 'Serves a local BPMN.js preview page connected to the backend endpoints',
};
exports.BPMN_RESPONSE_DESCRIPTIONS = {
    EXPORT_XML: 'Generated BPMN XML document',
    DOWNLOAD_XML: 'Generated BPMN XML file',
    IMPORT_XML: 'Parsed BPMN definition payload',
    ROUNDTRIP_XML: 'Parsed BPMN definition and regenerated XML',
    EXAMPLE: 'Sample BPMN definition payload',
    BNPL_TEMPLATE: 'BNPL BPMN template payload and generated XML',
    PREVIEW: 'HTML preview page',
};
exports.BPMN_DEFINITION_CONSTANTS = {
    DEFINITIONS_ID_PREFIX: 'Definitions_',
    BPMN_NAMESPACE: 'http://www.omg.org/spec/BPMN/20100524/MODEL',
    BPMNDI_NAMESPACE: 'http://www.omg.org/spec/BPMN/20100524/DI',
    DC_NAMESPACE: 'http://www.omg.org/spec/DD/20100524/DC',
    DI_NAMESPACE: 'http://www.omg.org/spec/DD/20100524/DI',
    TARGET_NAMESPACE: 'http://nestjs-starter.local/bpmn',
    XML_VERSION: '1.0',
    XML_ENCODING: 'UTF-8',
};
exports.BPMN_NODE_TYPES = {
    START_EVENT: 'startEvent',
    TASK: 'task',
    USER_TASK: 'userTask',
    SERVICE_TASK: 'serviceTask',
    SCRIPT_TASK: 'scriptTask',
    BUSINESS_RULE_TASK: 'businessRuleTask',
    EXCLUSIVE_GATEWAY: 'exclusiveGateway',
    PARALLEL_GATEWAY: 'parallelGateway',
    INCLUSIVE_GATEWAY: 'inclusiveGateway',
    END_EVENT: 'endEvent',
};
exports.BPMN_RESPONSE_CONSTANTS = {
    FORMAT: 'bpmn-xml',
    FILE_EXTENSION: '.bpmn',
    HTML_CONTENT_TYPE: 'text/html; charset=utf-8',
    CONTENT_TYPE: 'application/xml; charset=utf-8',
    JAVASCRIPT_CONTENT_TYPE: 'application/javascript; charset=utf-8',
    CSS_CONTENT_TYPE: 'text/css; charset=utf-8',
    CONTENT_DISPOSITION_PREFIX: 'attachment; filename=',
};
exports.BPMN_ERROR_CODES = {
    INVALID_PROCESS_DEFINITION: 'INVALID_BPMN_PROCESS_DEFINITION',
};
exports.BPMN_DI_DEFAULTS = {
    TASK_WIDTH: 100,
    TASK_HEIGHT: 80,
    EVENT_SIZE: 36,
    GATEWAY_SIZE: 50,
};
//# sourceMappingURL=bpmn.constants.js.map