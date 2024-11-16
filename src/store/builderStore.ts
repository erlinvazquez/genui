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
  exportCode: () => void;
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
        selectedComponent: state.selectedComponent?.id === id ? null : state.selectedComponent,
      };
    });
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        return {
          components: state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1,
          selectedComponent: null,
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
          selectedComponent: null,
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

  exportCode: () => {
    const { components } = get();
    
    const generateComponentCode = (component: ComponentType): string => {
      const styleString = Object.entries(component.props.style)
        .map(([key, value]) => `${key}: "${value}"`)
        .join(', ');

      switch (component.type) {
        case 'heading':
          return `<h1 style={{ ${styleString} }}>${component.props.children || ''}</h1>`;
        case 'text':
          return `<p style={{ ${styleString} }}>${component.props.children || ''}</p>`;
        case 'button':
          return `<button style={{ ${styleString} }}>${component.props.children || 'Button'}</button>`;
        case 'link':
          return `<a href="${component.props.href || '#'}" style={{ ${styleString} }}>${component.props.children || 'Link'}</a>`;
        case 'image':
          return `<img src="${component.props.src || ''}" alt="${component.props.alt || ''}" style={{ ${styleString} }} />`;
        case 'video':
          return `<video src="${component.props.src || ''}" controls style={{ ${styleString} }} />`;
        case 'container':
          return `<div style={{ ${styleString} }}>${
            component.children?.map(child => generateComponentCode(child)).join('\n') || ''
          }</div>`;
        case 'input':
          return `<input type="text" placeholder="${component.props.placeholder || ''}" style={{ ${styleString} }} />`;
        case 'textarea':
          return `<textarea placeholder="${component.props.placeholder || ''}" style={{ ${styleString} }} />`;
        case 'checkbox':
          return `<input type="checkbox" ${component.props.checked ? 'checked' : ''} style={{ ${styleString} }} />`;
        case 'radio':
          return `<input type="radio" ${component.props.checked ? 'checked' : ''} style={{ ${styleString} }} />`;
        case 'select':
          return `<select style={{ ${styleString} }}>
            ${component.props.options?.map(option => `<option value="${option.value}">${option.label}</option>`).join('\n')}
          </select>`;
        case 'slider':
          return `<input type="range" min="${component.props.min || 0}" max="${component.props.max || 100}" step="${component.props.step || 1}" style={{ ${styleString} }} />`;
        case 'alert':
          return `<div role="alert" style={{ ${styleString} }}>${component.props.children || ''}</div>`;
        case 'divider':
          return `<hr style={{ ${styleString} }} />`;
        default:
          return '';
      }
    };

    const componentCode = components.map(generateComponentCode).join('\n');
    
    const fullCode = `
import React from 'react';

export const ExportedComponent = () => {
  return (
    <div className="exported-component">
      ${componentCode}
    </div>
  );
};
    `.trim();

    const blob = new Blob([fullCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ExportedComponent.tsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
}));