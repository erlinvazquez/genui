import { create } from 'zustand';
import { ComponentType } from '../types';

interface BuilderState {
  components: ComponentType[];
  selectedComponent: ComponentType | null;
  history: ComponentType[][];
  historyIndex: number;
  addComponent: (component: ComponentType) => void;
  updateComponent: (id: string, updates: Partial<ComponentType>) => void;
  selectComponent: (component: ComponentType | null) => void;
  removeComponent: (id: string) => void;
  undo: () => void;
  redo: () => void;
  saveProject: () => void;
  loadProject: (data: ComponentType[]) => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  components: [],
  selectedComponent: null,
  history: [[]],
  historyIndex: 0,

  addComponent: (component) => {
    set((state) => {
      const newComponents = [...state.components, component];
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return {
        components: newComponents,
        history: [...newHistory, newComponents],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  updateComponent: (id, updates) => {
    set((state) => {
      const newComponents = state.components.map((comp) =>
        comp.id === id ? { ...comp, ...updates } : comp
      );
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return {
        components: newComponents,
        history: [...newHistory, newComponents],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  selectComponent: (component) => {
    set({ selectedComponent: component });
  },

  removeComponent: (id) => {
    set((state) => {
      const newComponents = state.components.filter((comp) => comp.id !== id);
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return {
        components: newComponents,
        history: [...newHistory, newComponents],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        return {
          components: state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        return {
          components: state.history[state.historyIndex + 1],
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;
    });
  },

  saveProject: () => {
    const state = get();
    localStorage.setItem('builder_project', JSON.stringify(state.components));
  },

  loadProject: (data) => {
    set({
      components: data,
      history: [data],
      historyIndex: 0,
      selectedComponent: null,
    });
  },
}));