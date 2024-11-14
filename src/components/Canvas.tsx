import React, { useState } from 'react';
import { useDroppable, DndContext, DragOverlay, DragEndEvent, DragStartEvent, DragMoveEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { snapToGrid, detectCollision } from '../utils/grid';
import { useBuilderStore } from '../store/builderStore';
import { ComponentRenderer } from './ComponentRenderer';
import { Grid } from './Grid';
import type { ComponentType } from '../types';

const GRID_SIZE = 20;

export const Canvas: React.FC = () => {
  const { components, selectComponent, selectedComponent, updateComponent, addComponent } = useBuilderStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    })
  );

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active) return;

    setActiveId(active.id as string);
    
    const activeComponent = components.find(c => c.id === active.id);
    if (activeComponent && event.delta) {
      const currentLeft = parseInt(activeComponent.props.style.left as string) || 0;
      const currentTop = parseInt(activeComponent.props.style.top as string) || 0;
      
      setDragOffset({
        x: currentLeft - (event.delta.x || 0),
        y: currentTop - (event.delta.y || 0),
      });
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, delta } = event;
    if (!active || !delta) return;

    const activeComponent = components.find(c => c.id === active.id);
    if (!activeComponent) return;

    const newX = snapToGrid(dragOffset.x + delta.x, GRID_SIZE);
    const newY = snapToGrid(dragOffset.y + delta.y, GRID_SIZE);

    const componentWidth = 100;
    const componentHeight = 40;

    const otherComponents = components.filter(c => c.id !== active.id);
    const hasCollision = otherComponents.some(component => {
      const activeRect = {
        left: newX,
        right: newX + componentWidth,
        top: newY,
        bottom: newY + componentHeight,
      };
      
      const otherRect = {
        left: parseInt(component.props.style.left as string) || 0,
        right: (parseInt(component.props.style.left as string) || 0) + componentWidth,
        top: parseInt(component.props.style.top as string) || 0,
        bottom: (parseInt(component.props.style.top as string) || 0) + componentHeight,
      };

      return detectCollision(activeRect as DOMRect, otherRect as DOMRect);
    });

    if (!hasCollision) {
      updateComponent(activeComponent.id, {
        props: {
          ...activeComponent.props,
          style: {
            ...activeComponent.props.style,
            position: 'absolute',
            left: `${newX}px`,
            top: `${newY}px`,
            zIndex: 1,
          },
        },
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === 'canvas' && active?.data.current) {
      const componentType = active.data.current.type;
      const existingComponent = components.find(c => c.id === active.id);
      
      // Only create a new component if it's being dragged from the toolbar
      if (!existingComponent && componentType && !active.data.current.component) {
        const canvasRect = over.rect;
        const dropPoint = {
          x: event.delta?.x || 0,
          y: event.delta?.y || 0,
        };

        const newX = snapToGrid(dropPoint.x, GRID_SIZE);
        const newY = snapToGrid(dropPoint.y, GRID_SIZE);

        const newComponent: ComponentType = {
          id: `component-${Date.now()}`,
          type: componentType,
          props: {
            style: {
              position: 'absolute',
              left: `${newX}px`,
              top: `${newY}px`,
              zIndex: 1,
            },
            children: componentType === 'text' ? 'New Text' : undefined,
          },
        };
        
        addComponent(newComponent);
      }
    }
    
    setActiveId(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const activeComponent = components.find(c => c.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div
            ref={setNodeRef}
            className={`relative min-h-[calc(100vh-4rem)] bg-white rounded-lg shadow-sm ${
              isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
            }`}
            style={{ minWidth: '100%' }}
          >
            <Grid size={GRID_SIZE} />
            
            {components.map((component) => (
              <ComponentRenderer
                key={component.id}
                component={component}
                isSelected={selectedComponent?.id === component.id}
                isDragging={component.id === activeId}
                onClick={() => selectComponent(component)}
              />
            ))}

            <DragOverlay dropAnimation={null}>
              {activeId && activeComponent && (
                <ComponentRenderer
                  component={activeComponent}
                  isSelected={false}
                  isDragging={false}
                  isOverlay={true}
                  onClick={() => {}}
                />
              )}
            </DragOverlay>
          </div>
        </div>
      </div>
    </DndContext>
  );
};