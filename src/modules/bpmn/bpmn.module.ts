import { Module } from '@nestjs/common';
import { BpmnService } from '@/modules/bpmn/application/bpmn.service';
import { BPMN_XML_EXPORTER } from '@/modules/bpmn/bpmn.tokens';
import { BpmnController } from '@/modules/bpmn/interfaces/bpmn.controller';
import { XmlBpmnExporter } from '@/modules/bpmn/infrastructure/xml-bpmn.exporter';

@Module({
  controllers: [BpmnController],
  providers: [
    BpmnService,
    {
      provide: BPMN_XML_EXPORTER,
      useClass: XmlBpmnExporter,
    },
  ],
})
export class BpmnModule {}
