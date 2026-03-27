import { XmlBpmnExporter } from '@/modules/bpmn/infrastructure/xml-bpmn.exporter';

describe('XmlBpmnExporter', () => {
  it('renders bpm xml for a simple process', async () => {
    const exporter = new XmlBpmnExporter();

    const xml = await exporter.exportProcess({
      processId: 'process_1',
      processName: 'Approval Flow',
      nodes: [
        { id: 'start_1', name: 'Start', type: 'startEvent', position: { x: 120, y: 140 } },
        { id: 'task_1', name: 'Review', type: 'userTask', position: { x: 220, y: 118 } },
        { id: 'gateway_1', name: 'Approved?', type: 'parallelGateway', position: { x: 380, y: 133 } },
        { id: 'task_2', name: 'Notify Core', type: 'serviceTask', position: { x: 470, y: 40 } },
        { id: 'task_3', name: 'Apply script', type: 'scriptTask', position: { x: 470, y: 196 } },
        { id: 'gateway_2', name: 'Join', type: 'inclusiveGateway', position: { x: 650, y: 133 } },
        { id: 'task_4', name: 'Policy rules', type: 'businessRuleTask', position: { x: 740, y: 118 } },
        { id: 'end_1', name: 'Done', type: 'endEvent', position: { x: 900, y: 140 } },
      ],
      flows: [
        { id: 'flow_1', sourceRef: 'start_1', targetRef: 'task_1' },
        { id: 'flow_2', sourceRef: 'task_1', targetRef: 'gateway_1' },
        { id: 'flow_3', sourceRef: 'gateway_1', targetRef: 'task_2', name: 'fanout' },
        { id: 'flow_4', sourceRef: 'gateway_1', targetRef: 'task_3' },
        { id: 'flow_5', sourceRef: 'task_2', targetRef: 'gateway_2' },
        { id: 'flow_6', sourceRef: 'task_3', targetRef: 'gateway_2' },
        { id: 'flow_7', sourceRef: 'gateway_2', targetRef: 'task_4' },
        { id: 'flow_8', sourceRef: 'task_4', targetRef: 'end_1' },
      ],
    });

    expect(xml).toContain('<bpmn:process id="process_1" name="Approval Flow"');
    expect(xml).toContain('<bpmn:startEvent id="start_1" name="Start">');
    expect(xml).toContain('<bpmn:userTask id="task_1" name="Review">');
    expect(xml).toContain('<bpmn:parallelGateway id="gateway_1" name="Approved?">');
    expect(xml).toContain('<bpmn:serviceTask id="task_2" name="Notify Core">');
    expect(xml).toContain('<bpmn:scriptTask id="task_3" name="Apply script">');
    expect(xml).toContain('<bpmn:inclusiveGateway id="gateway_2" name="Join">');
    expect(xml).toContain('<bpmn:businessRuleTask id="task_4" name="Policy rules">');
    expect(xml).toContain('<bpmn:endEvent id="end_1" name="Done">');
    expect(xml).toContain('<bpmn:sequenceFlow id="flow_3"');
    expect(xml).toContain('name="fanout"');
    expect(xml).toContain('sourceRef="gateway_1"');
    expect(xml).toContain('targetRef="task_2"');
    expect(xml).toContain('<bpmndi:BPMNDiagram');
    expect(xml).toContain('<bpmndi:BPMNShape');
    expect(xml).toContain('<bpmndi:BPMNEdge');
  });

  it('imports xml back into json definition', async () => {
    const exporter = new XmlBpmnExporter();
    const xml = await exporter.exportProcess({
      processId: 'process_2',
      processName: 'Roundtrip Flow',
      nodes: [
        { id: 'start_1', name: 'Start', type: 'startEvent', position: { x: 100, y: 100 } },
        { id: 'task_1', name: 'Do work', type: 'serviceTask', position: { x: 220, y: 78 } },
        { id: 'end_1', name: 'Done', type: 'endEvent', position: { x: 400, y: 100 } },
      ],
      flows: [
        { id: 'flow_1', sourceRef: 'start_1', targetRef: 'task_1' },
        { id: 'flow_2', sourceRef: 'task_1', targetRef: 'end_1' },
      ],
    });

    const definition = await exporter.importProcess(xml);

    expect(definition.processId).toBe('process_2');
    expect(definition.processName).toBe('Roundtrip Flow');
    expect(definition.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'start_1', type: 'startEvent' }),
        expect.objectContaining({ id: 'task_1', type: 'serviceTask' }),
        expect.objectContaining({ id: 'end_1', type: 'endEvent' }),
      ]),
    );
    expect(definition.flows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'flow_1', sourceRef: 'start_1', targetRef: 'task_1' }),
        expect.objectContaining({ id: 'flow_2', sourceRef: 'task_1', targetRef: 'end_1' }),
      ]),
    );
  });
});
