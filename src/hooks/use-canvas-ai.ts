import { useCanvasStore } from '@/store/canvasStore';
import type { ToolCall } from '../../worker/types';
export function useCanvasAI() {
  const { addElement, updateElement, deleteElement, bringToFront, sendToBack, elements, selectedElementId, _commit } = useCanvasStore.getState();
  const getTargetElementId = (elementId?: string) => {
    if (elementId && elements.find(el => el.id === elementId)) {
      return elementId;
    }
    if (selectedElementId) {
      return selectedElementId;
    }
    return elements.length > 0 ? elements[elements.length - 1].id : null;
  };
  const handleToolCall = (toolCall: ToolCall) => {
    if (toolCall.name !== 'canvas_tool' || !toolCall.result) {
      return;
    }
    const args = toolCall.result as any;
    const { action, elementId, elementType, properties } = args;
    if (!action) {
      console.error("Canvas tool call missing action");
      return;
    }
    const targetId = getTargetElementId(elementId);
    switch (action) {
      case 'add':
        if (elementType && properties) {
          addElement({
            type: elementType,
            x: properties.x ?? Math.random() * 200 + 50,
            y: properties.y ?? Math.random() * 300 + 50,
            width: properties.width ?? 150,
            height: properties.height ?? 100,
            color: properties.color ?? '#333333',
            ...properties,
          });
        }
        break;
      case 'update':
        if (targetId && properties) {
          updateElement(targetId, properties);
          _commit();
        }
        break;
      case 'delete':
        if (targetId) {
          deleteElement(targetId);
        }
        break;
      case 'bringToFront':
        if (targetId) {
          bringToFront(targetId);
        }
        break;
      case 'sendToBack':
        if (targetId) {
          sendToBack(targetId);
        }
        break;
      default:
        console.warn(`Unknown canvas tool action: ${action}`);
    }
  };
  const processToolCalls = (toolCalls?: ToolCall[]) => {
    if (!toolCalls || toolCalls.length === 0) {
      return;
    }
    toolCalls.forEach(handleToolCall);
  };
  return { processToolCalls };
}