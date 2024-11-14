import React from 'react';
import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PropertyEditor } from './components/PropertyEditor';
import { useBuilderStore } from './store/builderStore';
import { nanoid } from './utils/nanoid';

function App() {
  const { addComponent } = useBuilderStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    
    if (over && over.id === 'canvas') {
      const componentType = active.data.current?.type || active.data.current?.componentType;
      
      if (componentType) {
        const newComponent = {
          id: nanoid(),
          type: componentType,
          props: {
            style: {},
            children: componentType === 'text' ? 'New Text' : undefined,
          },
        };
        
        addComponent(newComponent);
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen overflow-hidden">
        <Toolbar />
        <Canvas />
        <PropertyEditor />
      </div>
    </DndContext>
  );
}

export default App;