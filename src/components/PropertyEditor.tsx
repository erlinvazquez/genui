import React from 'react';
import { useBuilderStore } from '../store/builderStore';
import { X, ChevronDown } from 'lucide-react';

interface PropertySection {
  title: string;
  content: React.ReactNode;
}

export const PropertyEditor: React.FC = () => {
  const { selectedComponent, updateComponent, selectComponent } = useBuilderStore();

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <p className="text-gray-500 text-center">
          Select a component to edit its properties
        </p>
      </div>
    );
  }

  const handleStyleChange = (property: string, value: string) => {
    updateComponent(selectedComponent.id, {
      props: {
        ...selectedComponent.props,
        style: {
          ...selectedComponent.props.style,
          [property]: value,
        },
      },
    });
  };

  const handleContentChange = (value: string) => {
    updateComponent(selectedComponent.id, {
      props: {
        ...selectedComponent.props,
        children: value,
      },
    });
  };

  const sections: PropertySection[] = [
    {
      title: 'Layout',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
              <input
                type="text"
                value={selectedComponent.props.style.width || ''}
                onChange={(e) => handleStyleChange('width', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="e.g., 100%, 200px"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
              <input
                type="text"
                value={selectedComponent.props.style.height || ''}
                onChange={(e) => handleStyleChange('height', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="e.g., 100px, auto"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Margin</label>
              <input
                type="text"
                value={selectedComponent.props.style.margin || ''}
                onChange={(e) => handleStyleChange('margin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="e.g., 10px"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
              <input
                type="text"
                value={selectedComponent.props.style.padding || ''}
                onChange={(e) => handleStyleChange('padding', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="e.g., 10px"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Typography',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
            <input
              type="text"
              value={selectedComponent.props.style.fontSize || ''}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="e.g., 16px, 1.5rem"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
            <select
              value={selectedComponent.props.style.fontWeight || ''}
              onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Default</option>
              <option value="300">Light</option>
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedComponent.props.style.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-8 h-8 p-0 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={selectedComponent.props.style.color || ''}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Background',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedComponent.props.style.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-8 h-8 p-0 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={selectedComponent.props.style.backgroundColor || ''}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Border',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Border Width</label>
              <input
                type="text"
                value={selectedComponent.props.style.borderWidth || ''}
                onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="e.g., 1px"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
              <input
                type="text"
                value={selectedComponent.props.style.borderRadius || ''}
                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="e.g., 4px"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedComponent.props.style.borderColor || '#000000'}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                className="w-8 h-8 p-0 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={selectedComponent.props.style.borderColor || ''}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Content',
      content: selectedComponent.type === 'text' || selectedComponent.type === 'paragraph' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
          <textarea
            value={selectedComponent.props.children || ''}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            rows={3}
          />
        </div>
      ) : null,
    },
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Properties</h2>
          <p className="text-sm text-gray-500">{selectedComponent.type}</p>
        </div>
        <button
          onClick={() => selectComponent(null)}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {sections.map((section, index) => (
            <details
              key={index}
              className="group"
              open={index === 0}
            >
              <summary className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                <span className="font-medium text-sm">{section.title}</span>
                <ChevronDown className="w-4 h-4 transform group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-2 mt-2">
                {section.content}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};