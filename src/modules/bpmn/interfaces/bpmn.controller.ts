import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { dirname, join } from 'path';
import {
  BPMN_CONTROLLER_BASE_PATH,
  BPMN_CONTROLLER_TAG,
  BPMN_OPERATION_DESCRIPTIONS,
  BPMN_OPERATION_SUMMARIES,
  BPMN_RESPONSE_CONSTANTS,
  BPMN_RESPONSE_DESCRIPTIONS,
  BPMN_ROUTES,
} from '@/modules/bpmn/bpmn.constants';
import { BpmnService } from '@/modules/bpmn/application/bpmn.service';
import { ExportBpmnXmlDto } from '@/modules/bpmn/interfaces/export-bpmn-xml.dto';
import { ImportBpmnXmlDto } from '@/modules/bpmn/interfaces/import-bpmn-xml.dto';
import { toBpmnPreviewHtml } from '@/modules/bpmn/interfaces/bpmn-preview.presenter';
import { toBpmnFileName, toBpmnXmlResponse } from '@/modules/bpmn/interfaces/bpmn.presenter';

@ApiTags(BPMN_CONTROLLER_TAG)
@Controller(BPMN_CONTROLLER_BASE_PATH)
export class BpmnController {
  constructor(private readonly bpmnService: BpmnService) {}

  @Get(BPMN_ROUTES.PREVIEW)
  @ApiOperation({
    summary: BPMN_OPERATION_SUMMARIES.PREVIEW,
    description: BPMN_OPERATION_DESCRIPTIONS.PREVIEW,
  })
  @ApiOkResponse({ description: BPMN_RESPONSE_DESCRIPTIONS.PREVIEW })
  preview(@Res() response: Response) {
    response.setHeader('Content-Type', BPMN_RESPONSE_CONSTANTS.HTML_CONTENT_TYPE);
    response.send(toBpmnPreviewHtml());
  }

  @Get(BPMN_ROUTES.ASSET_VIEWER_JS)
  assetViewerJs(@Res() response: Response) {
    response.setHeader('Content-Type', BPMN_RESPONSE_CONSTANTS.JAVASCRIPT_CONTENT_TYPE);
    response.sendFile(this.resolveBpmnJsAsset('bpmn-modeler.development.js'));
  }

  @Get(BPMN_ROUTES.ASSET_DIAGRAM_CSS)
  assetDiagramCss(@Res() response: Response) {
    response.setHeader('Content-Type', BPMN_RESPONSE_CONSTANTS.CSS_CONTENT_TYPE);
    response.sendFile(this.resolveBpmnJsAsset('assets/diagram-js.css'));
  }

  @Get(BPMN_ROUTES.ASSET_BPMN_CSS)
  assetBpmnCss(@Res() response: Response) {
    response.setHeader('Content-Type', BPMN_RESPONSE_CONSTANTS.CSS_CONTENT_TYPE);
    response.sendFile(this.resolveBpmnJsAsset('assets/bpmn-js.css'));
  }

  @Get(BPMN_ROUTES.ASSET_BPMN_FONT_CSS)
  assetBpmnFontCss(@Res() response: Response) {
    response.setHeader('Content-Type', BPMN_RESPONSE_CONSTANTS.CSS_CONTENT_TYPE);
    response.sendFile(this.resolveBpmnJsAsset('assets/bpmn-font/css/bpmn-embedded.css'));
  }

  @Get(BPMN_ROUTES.EXAMPLE)
  @ApiOperation({
    summary: BPMN_OPERATION_SUMMARIES.EXAMPLE,
    description: BPMN_OPERATION_DESCRIPTIONS.EXAMPLE,
  })
  @ApiOkResponse({ description: BPMN_RESPONSE_DESCRIPTIONS.EXAMPLE })
  getExampleDefinition() {
    return this.bpmnService.getExampleDefinition();
  }

  @Get(BPMN_ROUTES.BNPL_TEMPLATE)
  @ApiOperation({
    summary: BPMN_OPERATION_SUMMARIES.BNPL_TEMPLATE,
    description: BPMN_OPERATION_DESCRIPTIONS.BNPL_TEMPLATE,
  })
  @ApiOkResponse({ description: BPMN_RESPONSE_DESCRIPTIONS.BNPL_TEMPLATE })
  async getBnplTemplate() {
    return this.bpmnService.getBnplTemplate();
  }

  @Get(BPMN_ROUTES.TEMPLATE)
  @ApiOperation({
    summary: BPMN_OPERATION_SUMMARIES.BNPL_TEMPLATE,
    description: BPMN_OPERATION_DESCRIPTIONS.BNPL_TEMPLATE,
  })
  @ApiOkResponse({ description: BPMN_RESPONSE_DESCRIPTIONS.BNPL_TEMPLATE })
  async getTemplate(@Param('template') template: 'bnpl' | 'approval' | 'loan') {
    return this.bpmnService.getTemplate(template);
  }

  @Post(BPMN_ROUTES.EXPORT_XML)
  @ApiOperation({
    summary: BPMN_OPERATION_SUMMARIES.EXPORT_XML,
    description: BPMN_OPERATION_DESCRIPTIONS.EXPORT_XML,
  })
  @ApiOkResponse({ description: BPMN_RESPONSE_DESCRIPTIONS.EXPORT_XML })
  async exportXml(@Body() dto: ExportBpmnXmlDto) {
    const xml = await this.bpmnService.exportXml(dto);
    return toBpmnXmlResponse(xml);
  }

  @Post(BPMN_ROUTES.IMPORT_XML)
  @ApiOperation({
    summary: BPMN_OPERATION_SUMMARIES.IMPORT_XML,
    description: BPMN_OPERATION_DESCRIPTIONS.IMPORT_XML,
  })
  @ApiOkResponse({ description: BPMN_RESPONSE_DESCRIPTIONS.IMPORT_XML })
  async importXml(@Body() dto: ImportBpmnXmlDto) {
    return this.bpmnService.importXml(dto.xml);
  }

  @Post(BPMN_ROUTES.ROUNDTRIP_XML)
  @ApiOperation({
    summary: BPMN_OPERATION_SUMMARIES.ROUNDTRIP_XML,
    description: BPMN_OPERATION_DESCRIPTIONS.ROUNDTRIP_XML,
  })
  @ApiOkResponse({ description: BPMN_RESPONSE_DESCRIPTIONS.ROUNDTRIP_XML })
  async roundtripXml(@Body() dto: ImportBpmnXmlDto) {
    return this.bpmnService.roundtripXml(dto.xml);
  }

  @Post(BPMN_ROUTES.DOWNLOAD_XML)
  @ApiOperation({
    summary: BPMN_OPERATION_SUMMARIES.DOWNLOAD_XML,
    description: BPMN_OPERATION_DESCRIPTIONS.DOWNLOAD_XML,
  })
  @ApiOkResponse({ description: BPMN_RESPONSE_DESCRIPTIONS.DOWNLOAD_XML })
  async downloadXml(@Body() dto: ExportBpmnXmlDto, @Res() response: Response) {
    const xml = await this.bpmnService.exportXml(dto);
    const fileName = toBpmnFileName(dto.processId);

    response.setHeader('Content-Type', BPMN_RESPONSE_CONSTANTS.CONTENT_TYPE);
    response.setHeader(
      'Content-Disposition',
      `${BPMN_RESPONSE_CONSTANTS.CONTENT_DISPOSITION_PREFIX}"${fileName}"`,
    );

    response.send(xml);
  }

  private resolveBpmnJsAsset(relativePath: string) {
    const packageJsonPath = require.resolve('bpmn-js/package.json');
    return join(dirname(packageJsonPath), 'dist', relativePath);
  }
}
