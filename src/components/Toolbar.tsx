import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  Image as ImageIcon,
  Type,
  Square,
  Layout,
  Video,
  Maximize2,
  Minus,
  GripVertical,
  Grid,
  Menu as MenuIcon,
  Code,
  Undo2,
  Redo2,
  Save
} from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';

const components = [
  { type: 'image', icon: ImageIcon, label: 'Image' },
  { type: 'text', icon: Type, label: 'Title' },
  { type: 'paragraph', icon: Type, label: 'Paragraph' },
  { type: 'button', icon: Square, label: 'Button' },
  { type: 'container', icon: Layout, label: 'Container' },
  { type: 'video', icon: Video, label: 'Video' },
  { type: 'shape', icon: Maximize2, label: 'Shape' },
  { type: 'line', icon: Minus, label: 'Line' },
  { type: 'divider', icon: GripVertical, label: 'Line' },
  { type: 'gallery', icon: Grid, label: 'Gallery' },
  { type: 'menu', icon: MenuIcon, label: 'Menu' },
  { type: 'iframe', icon: Code, label: 'IFrame' }
];

const DraggableComponent = ({ type, icon: Icon, label }: typeof components[0]) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `toolbar-${type}`,
    data: {
      type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center p-3 bg-white rounded-md border border-gray-200 cursor-move hover:border-blue-500 transition-colors"
    >
      <Icon className="w-5 h-5 mb-1 text-gray-600" />
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  );
};

export const Toolbar: React.FC = () => {
  const { undo, redo, saveProject } = useBuilderStore();

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Add Elements</h2>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="bg-blue-50 p-4 mb-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Add</h3>
            <div className="grid grid-cols-3 gap-3">
              {components.slice(0, 9).map((component) => (
                <DraggableComponent key={component.type} {...component} />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="p-2 hover:bg-gray-100 rounded-md">
              <h3 className="text-sm font-medium">Assets</h3>
            </div>
            <div className="p-2 hover:bg-gray-100 rounded-md">
              <h3 className="text-sm font-medium">Sections</h3>
            </div>
            <div className="p-2 hover:bg-gray-100 rounded-md">
              <h3 className="text-sm font-medium">Wireframes</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4 flex justify-between">
        <button
          onClick={undo}
          className="p-2 hover:bg-gray-100 rounded-md"
          title="Undo"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button
          onClick={redo}
          className="p-2 hover:bg-gray-100 rounded-md"
          title="Redo"
        >
          <Redo2 className="w-5 h-5" />
        </button>
        <button
          onClick={saveProject}
          className="p-2 hover:bg-gray-100 rounded-md"
          title="Save Project"
        >
          <Save className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};