import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  Image as ImageIcon,
  Type,
  Square,
  Layout,
  Video,
  Minus,
  Mail,
  Search,
  AlertCircle,
  Calendar,
  Clock,
  Map,
  FileText,
  Table as TableIcon,
  List,
  ToggleLeft,
  SlidersHorizontal,
  Radio,
  CheckSquare,
  ChevronDown,
  Link
} from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';

const components = [
  { type: 'heading', icon: Type, label: 'Heading' },
  { type: 'text', icon: FileText, label: 'Text' },
  { type: 'button', icon: Square, label: 'Button' },
  { type: 'link', icon: Link, label: 'Link' },
  { type: 'image', icon: ImageIcon, label: 'Image' },
  { type: 'video', icon: Video, label: 'Video' },
  { type: 'container', icon: Layout, label: 'Container' },
  { type: 'table', icon: TableIcon, label: 'Table' },
  { type: 'list', icon: List, label: 'List' },
  { type: 'divider', icon: Minus, label: 'Divider' },
  { type: 'input', icon: Type, label: 'Input' },
  { type: 'textarea', icon: FileText, label: 'Textarea' },
  { type: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
  { type: 'radio', icon: Radio, label: 'Radio' },
  { type: 'select', icon: ChevronDown, label: 'Select' },
  { type: 'toggle', icon: ToggleLeft, label: 'Toggle' },
  { type: 'slider', icon: SlidersHorizontal, label: 'Slider' },
  { type: 'alert', icon: AlertCircle, label: 'Alert' },
  { type: 'calendar', icon: Calendar, label: 'Calendar' },
  { type: 'timer', icon: Clock, label: 'Timer' },
  { type: 'map', icon: Map, label: 'Map' },
  { type: 'search', icon: Search, label: 'Search' },
  { type: 'contact', icon: Mail, label: 'Contact' }
];

const DraggableComponent = ({ type, icon: Icon, label }: typeof components[0]) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `toolbar-${type}`,
    data: { type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex flex-col items-center p-3 bg-white rounded-md border border-gray-200 cursor-move hover:border-blue-500 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <Icon className="w-5 h-5 mb-1 text-gray-600" />
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  );
};

export const Toolbar: React.FC = () => {
  const { undo, redo, saveProject, exportCode } = useBuilderStore();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredComponents = components.filter(component =>
    component.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Components</h2>
        <div className="mt-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search components..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {filteredComponents.map((component) => (
              <DraggableComponent key={component.type} {...component} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4 flex justify-between">
        <button
          onClick={undo}
          className="p-2 hover:bg-gray-100 rounded-md"
          title="Undo"
        >
          Undo
        </button>
        <button
          onClick={redo}
          className="p-2 hover:bg-gray-100 rounded-md"
          title="Redo"
        >
          Redo
        </button>
        <button
          onClick={saveProject}
          className="p-2 hover:bg-gray-100 rounded-md"
          title="Save Project"
        >
          Save
        </button>
        <button
          onClick={exportCode}
          className="p-2 hover:bg-gray-100 rounded-md"
          title="Export Code"
        >
          Export
        </button>
      </div>
    </div>
  );
};