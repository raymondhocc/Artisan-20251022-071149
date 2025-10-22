import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
export type CanvasElement = {
  id: string;
  type: 'rectangle' | 'circle' | 'text' | 'image' | 'triangle' | 'star';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  textContent?: string;
  rotation?: number;
  opacity?: number;
  border?: string;
  imageSrc?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
};
type CanvasState = {
  elements: CanvasElement[];
  selectedElementId: string | null;
  history: CanvasElement[][];
  historyIndex: number;
  canvasWidth: number;
  canvasHeight: number;
};
type CanvasActions = {
  addElement: (element: Omit<CanvasElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<Omit<CanvasElement, 'id' | 'type'>>) => void;
  deleteElement: (id: string) => void;
  setSelectedElementId: (id: string | null) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  setCanvasDimensions: (width: number, height: number) => void;
  undo: () => void;
  redo: () => void;
  _commit: () => void;
};
const MAX_HISTORY = 50;
export const useCanvasStore = create<CanvasState & CanvasActions>()(
  immer((set, get) => ({
    elements: [],
    selectedElementId: null,
    history: [[]],
    historyIndex: 0,
    canvasWidth: 800,
    canvasHeight: 1200,
    _commit: () => {
      const { elements, history, historyIndex, canvasWidth, canvasHeight } = get();
      const currentState = {
        elements: JSON.parse(JSON.stringify(elements)),
        canvasWidth,
        canvasHeight,
      };
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(currentState as any);
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }
      set((state) => {
        state.history = newHistory;
        state.historyIndex = newHistory.length - 1;
      });
    },
    addElement: (element) => {
      const newElement = { ...element, id: uuidv4() };
      if (element.type === 'text') {
        newElement.fontFamily = element.fontFamily || 'Inter';
        newElement.fontSize = element.fontSize || 24;
        newElement.fontWeight = element.fontWeight || 'normal';
      }
      set((state) => {
        state.elements.push(newElement);
      });
      get()._commit();
    },
    updateElement: (id, updates) => {
      set((state) => {
        const element = state.elements.find((el) => el.id === id);
        if (element) {
          Object.assign(element, updates);
        }
      });
    },
    deleteElement: (id) => {
      set((state) => {
        state.elements = state.elements.filter((el) => el.id !== id);
        if (state.selectedElementId === id) {
          state.selectedElementId = null;
        }
      });
      get()._commit();
    },
    setSelectedElementId: (id) => {
      set({ selectedElementId: id });
    },
    bringToFront: (id) => {
      set((state) => {
        const element = state.elements.find((el) => el.id === id);
        if (element) {
          state.elements = state.elements.filter((el) => el.id !== id);
          state.elements.push(element);
        }
      });
      get()._commit();
    },
    sendToBack: (id) => {
      set((state) => {
        const element = state.elements.find((el) => el.id === id);
        if (element) {
          state.elements = state.elements.filter((el) => el.id !== id);
          state.elements.unshift(element);
        }
      });
      get()._commit();
    },
    setCanvasDimensions: (width, height) => {
      set({ canvasWidth: width, canvasHeight: height });
      get()._commit();
    },
    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        const previousState = history[newIndex] as any;
        set((state) => {
          state.historyIndex = newIndex;
          state.elements = JSON.parse(JSON.stringify(previousState.elements || []));
          state.canvasWidth = previousState.canvasWidth || 800;
          state.canvasHeight = previousState.canvasHeight || 1200;
          state.selectedElementId = null;
        });
      }
    },
    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        const nextState = history[newIndex] as any;
        set((state) => {
          state.historyIndex = newIndex;
          state.elements = JSON.parse(JSON.stringify(nextState.elements || []));
          state.canvasWidth = nextState.canvasWidth || 800;
          state.canvasHeight = nextState.canvasHeight || 1200;
          state.selectedElementId = null;
        });
      }
    },
  }))
);