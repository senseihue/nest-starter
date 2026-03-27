import { BPMN_CONTROLLER_BASE_PATH, BPMN_ROUTES } from '@/modules/bpmn/bpmn.constants';

export function toBpmnPreviewHtml() {
  const basePath = `/api/${BPMN_CONTROLLER_BASE_PATH}`;
  const exportUrl = `${basePath}/${BPMN_ROUTES.EXPORT_XML}`;
  const importUrl = `${basePath}/${BPMN_ROUTES.IMPORT_XML}`;
  const roundtripUrl = `${basePath}/${BPMN_ROUTES.ROUNDTRIP_XML}`;
  const downloadUrl = `${basePath}/${BPMN_ROUTES.DOWNLOAD_XML}`;
  const previewUrl = `${basePath}/${BPMN_ROUTES.PREVIEW}`;
  const viewerJsUrl = `${basePath}/${BPMN_ROUTES.ASSET_VIEWER_JS}`;
  const diagramCssUrl = `${basePath}/${BPMN_ROUTES.ASSET_DIAGRAM_CSS}`;
  const bpmnCssUrl = `${basePath}/${BPMN_ROUTES.ASSET_BPMN_CSS}`;
  const bpmnFontCssUrl = `${basePath}/${BPMN_ROUTES.ASSET_BPMN_FONT_CSS}`;
  const localStorageDefinitionKey = 'bpmn.preview.definition';
  const localStorageXmlKey = 'bpmn.preview.xml';
  const localStorageTemplateKey = 'bpmn.preview.template';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>BPMN Designer</title>
    <link rel="stylesheet" href="${diagramCssUrl}" />
    <link rel="stylesheet" href="${bpmnCssUrl}" />
    <link rel="stylesheet" href="${bpmnFontCssUrl}" />
    <style>
      body { margin: 0; font-family: ui-sans-serif, system-ui, sans-serif; background: radial-gradient(circle at top, #f8fcfb, #e6edf2); color: #17202a; }
      .layout { min-height: 100vh; }
      .panel { position: fixed; top: 0; left: 0; bottom: 0; width: 540px; padding: 20px; border-right: 1px solid #d9e1e8; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); overflow: auto; box-sizing: border-box; z-index: 10; }
      .viewer-wrap { margin-left: 540px; padding: 20px; }
      .viewer { height: calc(100vh - 40px); border: 1px solid #d9e1e8; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08); }
      textarea, select { width: 100%; padding: 12px; border: 1px solid #c7d2da; border-radius: 10px; font: 12px/1.45 ui-monospace, monospace; background: #fff; box-sizing: border-box; }
      select { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 14px; }
      button { border: 0; background: #0f766e; color: #fff; padding: 10px 14px; border-radius: 10px; cursor: pointer; }
      button.secondary { background: #1d4ed8; }
      button.ghost { background: #475569; }
      button.outline { background: #ffffff; color: #0f172a; border: 1px solid #c7d2da; }
      .actions { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 12px 0 16px; }
      .toolbar { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 10px; }
      .muted { color: #52606d; font-size: 13px; }
      h1 { font-size: 20px; margin: 0 0 8px; }
      h2 { font-size: 14px; margin: 18px 0 8px; }
      pre { margin: 0; padding: 12px; border-radius: 10px; background: #0f172a; color: #e2e8f0; overflow: auto; font: 12px/1.45 ui-monospace, monospace; }
      .section { margin-bottom: 18px; }
      .schema { max-height: 260px; }
      .inline { display: flex; gap: 10px; align-items: center; }
      a.small-link { color: #0f766e; text-decoration: none; font-size: 13px; }
      .dropzone { border: 2px dashed #8fb6b2; background: #f8fcfb; color: #2f4f4f; border-radius: 12px; padding: 14px; text-align: center; font-size: 13px; margin-top: 10px; }
      .dropzone.dragover { background: #e7f7f4; border-color: #0f766e; }
      .status { margin-top: 10px; font-size: 12px; color: #475569; min-height: 18px; }
      .hint { font-size: 12px; color: #64748b; margin-top: 6px; }
      .inspector { border: 1px solid #d9e1e8; border-radius: 12px; padding: 12px; background: #fbfdff; }
      .inspector-grid { display: grid; grid-template-columns: 90px 1fr; gap: 8px; font-size: 12px; color: #334155; margin-bottom: 10px; }
      .inspector-label { color: #64748b; }
      .rename-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; }
      input { width: 100%; padding: 12px; border: 1px solid #c7d2da; border-radius: 10px; box-sizing: border-box; }
      .status.error { color: #b91c1c; }
      .status.success { color: #0f766e; }
      .history-list { display: flex; flex-direction: column; gap: 8px; max-height: 180px; overflow: auto; }
      .history-item { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; padding: 8px 10px; border: 1px solid #d9e1e8; border-radius: 10px; background: #fff; font-size: 12px; }
      .history-item button { padding: 6px 10px; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="layout">
      <div class="panel">
        <h1>BPMN Designer</h1>
        <div class="muted">Full BPMN.js modeler flow: draw on canvas, sync XML and JSON, import, roundtrip, download, and template switching.</div>

        <div class="section">
          <h2>Template</h2>
          <div class="inline">
            <select id="template">
              <option value="bnpl">BNPL</option>
              <option value="approval">Approval</option>
              <option value="loan">Loan</option>
            </select>
            <a class="small-link" href="${previewUrl}" target="_blank" rel="noreferrer">Reload page</a>
          </div>
        </div>

        <div class="actions">
          <button id="load-template">Load Template</button>
          <button class="secondary" id="render-json">Render JSON</button>
          <button class="secondary" id="import-xml">Import XML</button>
          <button class="ghost" id="roundtrip-xml">Roundtrip XML</button>
          <button id="download-bpmn">Download BPMN</button>
          <button class="outline" id="download-svg">Export SVG</button>
          <button class="outline" id="download-png">Export PNG</button>
          <button class="outline" id="new-diagram">New Diagram</button>
          <button class="outline" id="fit-diagram">Fit Diagram</button>
          <button class="outline" id="zoom-in">Zoom In</button>
          <button class="outline" id="zoom-out">Zoom Out</button>
          <button class="outline" id="undo-action">Undo</button>
          <button class="outline" id="redo-action">Redo</button>
        </div>

        <div class="section">
          <h2>Process Definition JSON</h2>
          <textarea id="definition" style="min-height: 240px;"></textarea>
          <div class="toolbar">
            <button class="outline" id="copy-json">Copy JSON</button>
            <button class="outline" id="sync-from-canvas">Sync From Canvas</button>
          </div>
        </div>

        <div class="section">
          <h2>XML Editor</h2>
          <textarea id="xml" style="min-height: 220px;"></textarea>
          <div class="dropzone" id="dropzone">Drop BPMN XML file here or paste into the XML editor.</div>
          <div class="hint">Canvas edits auto-sync XML and JSON after diagram changes.</div>
          <div class="toolbar">
            <button class="outline" id="copy-xml">Copy XML</button>
            <button class="outline" id="format-xml">Pretty XML</button>
            <button class="outline" id="minify-xml">Minify XML</button>
          </div>
        </div>

        <div class="section">
          <h2>Process Metadata</h2>
          <pre id="process-metadata"></pre>
        </div>

        <div class="section">
          <h2>JSON Schema Docs</h2>
          <pre class="schema" id="schema-docs"></pre>
        </div>

        <div class="section">
          <h2>Process</h2>
          <div class="inspector">
            <div class="inspector-grid">
              <div class="inspector-label">Process ID</div>
              <div id="process-id-view">-</div>
              <div class="inspector-label">Process Name</div>
              <div id="process-name-view">-</div>
            </div>
            <div class="rename-row" style="margin-bottom:10px;">
              <input id="process-id-input" type="text" placeholder="Edit process id" />
              <button class="outline" id="process-id-apply">Apply ID</button>
            </div>
            <div class="rename-row">
              <input id="process-name-input" type="text" placeholder="Edit process name" />
              <button class="outline" id="process-name-apply">Apply Name</button>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Property Inspector</h2>
          <div class="inspector">
            <div class="inspector-grid">
              <div class="inspector-label">Element ID</div>
              <div id="selected-id">Nothing selected</div>
              <div class="inspector-label">Element Type</div>
              <div id="selected-type">-</div>
              <div class="inspector-label">Current Name</div>
              <div id="selected-name">-</div>
              <div class="inspector-label">Coordinates</div>
              <div id="selected-coordinates">-</div>
              <div class="inspector-label">Flow From</div>
              <div id="selected-source">-</div>
              <div class="inspector-label">Flow To</div>
              <div id="selected-target">-</div>
            </div>
            <div class="rename-row">
              <input id="rename-input" type="text" placeholder="Rename selected element" />
              <button class="outline" id="rename-apply">Rename</button>
            </div>
            <div class="toolbar">
              <button class="outline" id="duplicate-element">Duplicate</button>
              <button class="outline" id="delete-element">Delete</button>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Validation & Autosave</h2>
          <pre id="validation-errors">No validation errors</pre>
          <div class="hint">Autosave keeps recent XML snapshots locally.</div>
          <div class="history-list" id="autosave-history"></div>
        </div>

        <div class="status" id="status"></div>
      </div>

      <div class="viewer-wrap">
        <div id="viewer" class="viewer"></div>
      </div>
    </div>

    <script src="${viewerJsUrl}"></script>
    <script>
      const modeler = new BpmnJS({
        container: '#viewer',
        keyboard: { bind: document }
      });
      const definitionInput = document.getElementById('definition');
      const xmlInput = document.getElementById('xml');
      const templateSelect = document.getElementById('template');
      const schemaDocs = document.getElementById('schema-docs');
      const processMetadata = document.getElementById('process-metadata');
      const validationErrors = document.getElementById('validation-errors');
      const autosaveHistory = document.getElementById('autosave-history');
      const dropzone = document.getElementById('dropzone');
      const status = document.getElementById('status');
      const processIdView = document.getElementById('process-id-view');
      const processNameView = document.getElementById('process-name-view');
      const processIdInput = document.getElementById('process-id-input');
      const processNameInput = document.getElementById('process-name-input');
      const selectedId = document.getElementById('selected-id');
      const selectedType = document.getElementById('selected-type');
      const selectedName = document.getElementById('selected-name');
      const selectedCoordinates = document.getElementById('selected-coordinates');
      const selectedSource = document.getElementById('selected-source');
      const selectedTarget = document.getElementById('selected-target');
      const renameInput = document.getElementById('rename-input');
      const localHistoryKey = 'bpmn.preview.history';

      let syncTimer = null;
      let selectedElement = null;

      const schema = {
        processId: 'string',
        processName: 'string',
        nodes: [
          {
            id: 'string',
            name: 'string',
            type: 'startEvent | task | userTask | serviceTask | scriptTask | businessRuleTask | exclusiveGateway | parallelGateway | inclusiveGateway | endEvent',
            position: { x: 'number?', y: 'number?' }
          }
        ],
        flows: [
          {
            id: 'string',
            sourceRef: 'string',
            targetRef: 'string',
            name: 'string?'
          }
        ]
      };

      const blankDiagram = '<?xml version="1.0" encoding="UTF-8"?>\\n' +
        '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
        'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
        'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
        'xmlns:di="http://www.omg.org/spec/DD/20100524/DI" ' +
        'id="Definitions_Blank" targetNamespace="http://nestjs-starter.local/bpmn">' +
        '<bpmn:process id="blank_process" name="Blank Process" isExecutable="false"></bpmn:process>' +
        '<bpmndi:BPMNDiagram id="Diagram_blank_process">' +
        '<bpmndi:BPMNPlane id="Plane_blank_process" bpmnElement="blank_process"></bpmndi:BPMNPlane>' +
        '</bpmndi:BPMNDiagram>' +
        '</bpmn:definitions>';

      schemaDocs.textContent = JSON.stringify(schema, null, 2);

      function setStatus(message, kind) {
        status.textContent = message;
        status.className = 'status' + (kind ? ' ' + kind : '');
      }

      function getRootProcess() {
        const elementRegistry = modeler.get('elementRegistry');
        return elementRegistry.find((element) =>
          element && element.businessObject && element.businessObject.$type === 'bpmn:Process'
        );
      }

      function updateProcessInspector() {
        const rootElement = modeler.get('canvas').getRootElement();
        const businessObject = rootElement && rootElement.businessObject ? rootElement.businessObject : {};
        processIdView.textContent = businessObject.id || '-';
        processNameView.textContent = businessObject.name || '(empty)';
        processIdInput.value = businessObject.id || '';
        processNameInput.value = businessObject.name || '';
        updateProcessMetadata();
      }

      function updateProcessMetadata() {
        try {
          const definition = JSON.parse(definitionInput.value || '{}');
          processMetadata.textContent = JSON.stringify({
            processId: definition.processId || null,
            processName: definition.processName || null,
            nodeCount: Array.isArray(definition.nodes) ? definition.nodes.length : 0,
            flowCount: Array.isArray(definition.flows) ? definition.flows.length : 0,
            template: templateSelect.value
          }, null, 2);
        } catch (error) {
          processMetadata.textContent = JSON.stringify({ error: 'Invalid JSON' }, null, 2);
        }
      }

      function updateInspector(element) {
        selectedElement = element || null;

        if (!selectedElement) {
          selectedId.textContent = 'Nothing selected';
          selectedType.textContent = '-';
          selectedName.textContent = '-';
          selectedCoordinates.textContent = '-';
          selectedSource.textContent = '-';
          selectedTarget.textContent = '-';
          renameInput.value = '';
          return;
        }

        const businessObject = selectedElement.businessObject || {};
        selectedId.textContent = businessObject.id || selectedElement.id || '-';
        selectedType.textContent = businessObject.$type || '-';
        selectedName.textContent = businessObject.name || '(empty)';
        selectedCoordinates.textContent = selectedElement.x !== undefined && selectedElement.y !== undefined
          ? selectedElement.x + ', ' + selectedElement.y
          : '-';
        selectedSource.textContent = businessObject.sourceRef && businessObject.sourceRef.id
          ? businessObject.sourceRef.id
          : '-';
        selectedTarget.textContent = businessObject.targetRef && businessObject.targetRef.id
          ? businessObject.targetRef.id
          : '-';
        renameInput.value = businessObject.name || '';
      }

      function basePath() {
        return '${basePath}';
      }

      function saveDraft() {
        localStorage.setItem('${localStorageDefinitionKey}', definitionInput.value);
        localStorage.setItem('${localStorageXmlKey}', xmlInput.value);
        localStorage.setItem('${localStorageTemplateKey}', templateSelect.value);
      }

      function pushAutosaveSnapshot() {
        const history = JSON.parse(localStorage.getItem(localHistoryKey) || '[]');
        history.unshift({
          timestamp: new Date().toISOString(),
          xml: xmlInput.value
        });
        const trimmed = history.slice(0, 8);
        localStorage.setItem(localHistoryKey, JSON.stringify(trimmed));
        renderAutosaveHistory();
      }

      function renderAutosaveHistory() {
        const history = JSON.parse(localStorage.getItem(localHistoryKey) || '[]');
        autosaveHistory.innerHTML = history.map((entry, index) => (
          '<div class="history-item">' +
            '<div>' + entry.timestamp + '</div>' +
            '<button class="outline" data-history-index="' + index + '">Restore</button>' +
          '</div>'
        )).join('');

        autosaveHistory.querySelectorAll('[data-history-index]').forEach((button) => {
          button.addEventListener('click', async () => {
            const item = history[Number(button.getAttribute('data-history-index'))];
            if (item) {
              xmlInput.value = item.xml;
              await importXml();
              setStatus('Autosave restored', 'success');
            }
          });
        });
      }

      function setValidationErrors(errors) {
        validationErrors.textContent = errors.length > 0
          ? errors.join('\\n')
          : 'No validation errors';
      }

      function scheduleAutosave() {
        if (syncTimer) {
          clearTimeout(syncTimer);
        }
        syncTimer = setTimeout(async () => {
          await syncFromCanvas();
        }, 350);
      }

      async function copyText(text, label) {
        await navigator.clipboard.writeText(text);
        setStatus(label + ' copied');
      }

      async function fetchTemplate(template) {
        const response = await fetch(basePath() + '/templates/' + template);
        return response.json();
      }

      async function importIntoCanvas(xml) {
        await modeler.importXML(xml);
        fitDiagram();
      }

      async function syncFromCanvas() {
        const xmlResult = await modeler.saveXML({ format: true });
        xmlInput.value = xmlResult.xml;

        const response = await fetch('${importUrl}', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ xml: xmlResult.xml })
        });
        const payload = await response.json();
        definitionInput.value = JSON.stringify(payload.data, null, 2);
        saveDraft();
        pushAutosaveSnapshot();
        updateProcessMetadata();
        setValidationErrors([]);
        setStatus('Canvas synchronized', 'success');
      }

      async function renderDefinition(definition) {
        try {
          const response = await fetch('${exportUrl}', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(definition)
          });
          const payload = await response.json();
          if (!response.ok) {
            throw new Error(payload.message || 'Export failed');
          }
          xmlInput.value = payload.data.xml;
          await importIntoCanvas(payload.data.xml);
          saveDraft();
          pushAutosaveSnapshot();
          updateProcessMetadata();
          setValidationErrors([]);
          setStatus('JSON rendered to BPMN', 'success');
        } catch (error) {
          setValidationErrors([String(error.message || error)]);
          setStatus('Render failed', 'error');
        }
      }

      async function importXml() {
        try {
          const response = await fetch('${importUrl}', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xml: xmlInput.value })
          });
          const payload = await response.json();
          if (!response.ok) {
            throw new Error(payload.message || 'Import failed');
          }
          definitionInput.value = JSON.stringify(payload.data, null, 2);
          await importIntoCanvas(xmlInput.value);
          saveDraft();
          pushAutosaveSnapshot();
          updateProcessMetadata();
          setValidationErrors([]);
          setStatus('XML imported into modeler', 'success');
        } catch (error) {
          setValidationErrors([String(error.message || error)]);
          setStatus('Import failed', 'error');
        }
      }

      async function roundtripXml() {
        try {
          const response = await fetch('${roundtripUrl}', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xml: xmlInput.value })
          });
          const payload = await response.json();
          if (!response.ok) {
            throw new Error(payload.message || 'Roundtrip failed');
          }
          definitionInput.value = JSON.stringify(payload.data.definition, null, 2);
          xmlInput.value = payload.data.xml;
          await importIntoCanvas(payload.data.xml);
          saveDraft();
          pushAutosaveSnapshot();
          updateProcessMetadata();
          setValidationErrors([]);
          setStatus('XML roundtrip complete', 'success');
        } catch (error) {
          setValidationErrors([String(error.message || error)]);
          setStatus('Roundtrip failed', 'error');
        }
      }

      async function downloadBpmn() {
        const definition = JSON.parse(definitionInput.value);
        const response = await fetch('${downloadUrl}', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(definition)
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = (definition.processId || 'process') + '.bpmn';
        anchor.click();
        URL.revokeObjectURL(url);
        setStatus('BPMN downloaded', 'success');
      }

      async function downloadSvg() {
        const result = await modeler.saveSVG();
        const blob = new Blob([result.svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = (templateSelect.value || 'diagram') + '.svg';
        anchor.click();
        URL.revokeObjectURL(url);
        setStatus('SVG exported', 'success');
      }

      async function downloadPng() {
        const result = await modeler.saveSVG();
        const image = new Image();
        const blob = new Blob([result.svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        await new Promise((resolve) => {
          image.onload = resolve;
          image.src = url;
        });

        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        URL.revokeObjectURL(url);

        const pngUrl = canvas.toDataURL('image/png');
        const anchor = document.createElement('a');
        anchor.href = pngUrl;
        anchor.download = (templateSelect.value || 'diagram') + '.png';
        anchor.click();
        setStatus('PNG exported', 'success');
      }

      async function loadSelectedTemplate() {
        const payload = await fetchTemplate(templateSelect.value);
        definitionInput.value = JSON.stringify(payload.data.definition, null, 2);
        xmlInput.value = payload.data.xml;
        await importIntoCanvas(payload.data.xml);
        saveDraft();
        pushAutosaveSnapshot();
        updateProcessMetadata();
        setValidationErrors([]);
        setStatus('Template loaded', 'success');
      }

      async function loadBlankDiagram() {
        xmlInput.value = blankDiagram;
        await importIntoCanvas(blankDiagram);
        await syncFromCanvas();
        setStatus('Blank diagram created', 'success');
      }

      async function handleXmlFile(file) {
        const text = await file.text();
        xmlInput.value = text;
        saveDraft();
        await importXml();
      }

      function restoreDraft() {
        const savedDefinition = localStorage.getItem('${localStorageDefinitionKey}');
        const savedXml = localStorage.getItem('${localStorageXmlKey}');
        const savedTemplate = localStorage.getItem('${localStorageTemplateKey}');

        if (savedTemplate) {
          templateSelect.value = savedTemplate;
        }

        if (savedDefinition) {
          definitionInput.value = savedDefinition;
        }

        if (savedXml) {
          xmlInput.value = savedXml;
          return true;
        }

        return false;
      }

      function fitDiagram() {
        const canvas = modeler.get('canvas');
        canvas.zoom('fit-viewport');
      }

      function zoom(step) {
        const canvas = modeler.get('canvas');
        const current = canvas.zoom();
        canvas.zoom(current + step);
      }

      function applyRename() {
        if (!selectedElement) {
          setStatus('Select an element first');
          return;
        }

        const modeling = modeler.get('modeling');
        const nextName = renameInput.value;
        modeling.updateLabel(selectedElement, nextName);
        setStatus('Element renamed', 'success');
      }

      function deleteSelectedElement() {
        if (!selectedElement) {
          setStatus('Select an element first', 'error');
          return;
        }

        modeler.get('modeling').removeElements([selectedElement]);
        updateInspector(null);
        setStatus('Element deleted', 'success');
      }

      function duplicateSelectedElement() {
        if (!selectedElement || !selectedElement.businessObject || !selectedElement.x && !selectedElement.y) {
          setStatus('Select a shape element first', 'error');
          return;
        }

        if (selectedElement.waypoints) {
          setStatus('Flow duplication is not supported', 'error');
          return;
        }

        const elementFactory = modeler.get('elementFactory');
        const modeling = modeler.get('modeling');
        const canvas = modeler.get('canvas');
        const rootElement = canvas.getRootElement();
        const businessObject = selectedElement.businessObject;
        const shape = elementFactory.createShape({
          type: businessObject.$type,
          businessObject: elementFactory._bpmnFactory.create(businessObject.$type, {
            name: (businessObject.name || 'Copy') + ' Copy'
          })
        });

        modeling.createShape(
          shape,
          {
            x: selectedElement.x + 40,
            y: selectedElement.y + 40
          },
          rootElement
        );

        setStatus('Element duplicated', 'success');
      }

      function updateProcessProperty(key, value) {
        const canvas = modeler.get('canvas');
        const modeling = modeler.get('modeling');
        const rootElement = canvas.getRootElement();

        modeling.updateProperties(rootElement, {
          [key]: value
        });

        updateProcessInspector();
        setStatus('Process updated', 'success');
      }

      function wireModelerEvents() {
        const eventBus = modeler.get('eventBus');
        eventBus.on('commandStack.changed', scheduleAutosave);
        eventBus.on('commandStack.changed', updateProcessInspector);
        eventBus.on('selection.changed', (event) => {
          updateInspector(event.newSelection && event.newSelection[0]);
        });
      }

      definitionInput.addEventListener('input', saveDraft);
      xmlInput.addEventListener('input', saveDraft);
      templateSelect.addEventListener('change', saveDraft);

      dropzone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropzone.classList.add('dragover');
      });
      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
      });
      dropzone.addEventListener('drop', async (event) => {
        event.preventDefault();
        dropzone.classList.remove('dragover');
        const file = event.dataTransfer.files[0];
        if (file) {
          await handleXmlFile(file);
        }
      });

      document.getElementById('load-template').addEventListener('click', loadSelectedTemplate);
      document.getElementById('render-json').addEventListener('click', async () => {
        const definition = JSON.parse(definitionInput.value);
        await renderDefinition(definition);
      });
      document.getElementById('import-xml').addEventListener('click', importXml);
      document.getElementById('roundtrip-xml').addEventListener('click', roundtripXml);
      document.getElementById('download-bpmn').addEventListener('click', downloadBpmn);
      document.getElementById('download-svg').addEventListener('click', downloadSvg);
      document.getElementById('download-png').addEventListener('click', downloadPng);
      document.getElementById('new-diagram').addEventListener('click', loadBlankDiagram);
      document.getElementById('fit-diagram').addEventListener('click', fitDiagram);
      document.getElementById('zoom-in').addEventListener('click', () => zoom(0.1));
      document.getElementById('zoom-out').addEventListener('click', () => zoom(-0.1));
      document.getElementById('undo-action').addEventListener('click', () => {
        modeler.get('commandStack').undo();
      });
      document.getElementById('redo-action').addEventListener('click', () => {
        modeler.get('commandStack').redo();
      });
      document.getElementById('copy-json').addEventListener('click', async () => {
        await copyText(definitionInput.value, 'JSON');
      });
      document.getElementById('copy-xml').addEventListener('click', async () => {
        await copyText(xmlInput.value, 'XML');
      });
      document.getElementById('sync-from-canvas').addEventListener('click', syncFromCanvas);
      document.getElementById('format-xml').addEventListener('click', roundtripXml);
      document.getElementById('minify-xml').addEventListener('click', async () => {
        const result = await modeler.saveXML({ format: false });
        xmlInput.value = result.xml;
        saveDraft();
        pushAutosaveSnapshot();
        setStatus('XML minified', 'success');
      });
      document.getElementById('rename-apply').addEventListener('click', applyRename);
      document.getElementById('duplicate-element').addEventListener('click', duplicateSelectedElement);
      document.getElementById('delete-element').addEventListener('click', deleteSelectedElement);
      document.getElementById('process-id-apply').addEventListener('click', () => {
        updateProcessProperty('id', processIdInput.value);
      });
      document.getElementById('process-name-apply').addEventListener('click', () => {
        updateProcessProperty('name', processNameInput.value);
      });
      renameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          applyRename();
        }
      });
      processIdInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          updateProcessProperty('id', processIdInput.value);
        }
      });
      processNameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          updateProcessProperty('name', processNameInput.value);
        }
      });

      wireModelerEvents();
      renderAutosaveHistory();
      updateProcessInspector();
      updateProcessMetadata();
      updateInspector(null);

      (async function init() {
        const hasDraft = restoreDraft();
        if (hasDraft) {
          await importIntoCanvas(xmlInput.value);
          setStatus('Draft restored from localStorage');
          return;
        }

        await loadSelectedTemplate();
      })();
    </script>
  </body>
</html>`;
}
