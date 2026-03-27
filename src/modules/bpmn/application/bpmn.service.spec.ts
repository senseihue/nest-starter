import { BpmnService } from '@/modules/bpmn/application/bpmn.service';
import { BpmnXmlExporter } from '@/modules/bpmn/domain/bpmn-xml-exporter';
import { InvalidBpmnProcessDefinitionException } from '@/modules/bpmn/exceptions/invalid-bpmn-process-definition.exception';

describe('BpmnService', () => {
  let service: BpmnService;
  let exporter: jest.Mocked<BpmnXmlExporter>;

  const validDefinition = {
    processId: 'process_1',
    processName: 'Approval Flow',
    nodes: [
      { id: 'start_1', name: 'Start', type: 'startEvent' as const },
      { id: 'task_1', name: 'Review', type: 'task' as const },
      { id: 'end_1', name: 'Done', type: 'endEvent' as const },
    ],
    flows: [
      { id: 'flow_1', sourceRef: 'start_1', targetRef: 'task_1' },
      { id: 'flow_2', sourceRef: 'task_1', targetRef: 'end_1' },
    ],
  };

  beforeEach(() => {
    exporter = {
      exportProcess: jest.fn().mockResolvedValue('<xml />'),
      importProcess: jest.fn(),
    };

    service = new BpmnService(exporter);
  });

  it('exports xml for a valid definition', async () => {
    const result = await service.exportXml(validDefinition);

    expect(exporter.exportProcess).toHaveBeenCalledWith(validDefinition);
    expect(result).toBe('<xml />');
  });

  it('rejects missing start event', async () => {
    await expect(
      service.exportXml({
        ...validDefinition,
        nodes: validDefinition.nodes.filter((node) => node.type !== 'startEvent'),
      }),
    ).rejects.toThrow(InvalidBpmnProcessDefinitionException);
  });

  it('rejects flows with unknown nodes', async () => {
    await expect(
      service.exportXml({
        ...validDefinition,
        flows: [{ id: 'flow_1', sourceRef: 'missing', targetRef: 'task_1' }],
      }),
    ).rejects.toThrow(InvalidBpmnProcessDefinitionException);
  });

  it('returns example definition', () => {
    const example = service.getExampleDefinition();

    expect(example.processId).toBe('bnpl_approval_flow');
    expect(example.nodes.length).toBeGreaterThan(0);
    expect(example.flows.length).toBeGreaterThan(0);
  });

  it('imports xml through exporter', async () => {
    exporter.importProcess = jest.fn().mockResolvedValue(validDefinition);

    const result = await service.importXml('<xml />');

    expect(exporter.importProcess).toHaveBeenCalledWith('<xml />');
    expect(result).toEqual(validDefinition);
  });

  it('roundtrips xml into definition and normalized xml', async () => {
    exporter.importProcess = jest.fn().mockResolvedValue(validDefinition);
    exporter.exportProcess.mockResolvedValue('<normalized />');

    const result = await service.roundtripXml('<xml />');

    expect(result).toEqual({
      definition: validDefinition,
      xml: '<normalized />',
    });
  });

  it('returns named template with xml', async () => {
    exporter.exportProcess.mockResolvedValue('<template />');

    const result = await service.getTemplate('loan');

    expect(result.definition.processId).toBe('loan_origination_flow');
    expect(result.xml).toBe('<template />');
  });
});
