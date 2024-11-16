import React, { useState } from 'react';
import { useDroppable, DndContext, DragOverlay, DragEndEvent, DragStartEvent, DragMoveEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { snapToGrid, detectCollision } from '../utils/grid';
import { useBuilderStore } from '../store/builderStore';
import { ComponentRenderer } from './ComponentRenderer';
import { Grid } from './Grid';
import { Smartphone, Tablet, Monitor, Code } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { CodePreview } from './CodePreview';
import type { ComponentType } from '../types';

const GRID_SIZE = 20;

type Viewport = 'mobile' | 'tablet' | 'desktop';

const viewportSizes = {
  mobile: { width: '375px', height: '667px' },
  tablet: { width: '768px', height: '1024px' },
  desktop: { width: '100%', height: '100%' },
};

export const Canvas: React.FC = () => {
  const { components, selectComponent, selectedComponent, updateComponent, addComponent } = useBuilderStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [showCode, setShowCode] = useState(false);

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

    const componentWidth = parseInt(activeComponent.props.style.width as string) || 100;
    const componentHeight = parseInt(activeComponent.props.style.height as string) || 40;

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
        right: (parseInt(component.props.style.left as string) || 0) + (parseInt(component.props.style.width as string) || 100),
        top: parseInt(component.props.style.top as string) || 0,
        bottom: (parseInt(component.props.style.top as string) || 0) + (parseInt(component.props.style.height as string) || 40),
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
              width: '100%',
              maxWidth: viewport === 'desktop' ? '100%' : viewportSizes[viewport].width,
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
      <div className="flex-1 bg-gray-50 overflow-hidden">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between">
          <div className="flex space-x-4">
            <button
              onClick={() => setViewport('mobile')}
              className={`p-2 rounded-md ${viewport === 'mobile' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title="Mobile view"
            >
              <Smartphone className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-2 rounded-md ${viewport === 'tablet' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title="Tablet view"
            >
              <Tablet className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewport('desktop')}
              className={`p-2 rounded-md ${viewport === 'desktop' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title="Desktop view"
            >
              <Monitor className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setShowCode(!showCode)}
            className={`p-2 rounded-md ${showCode ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Toggle code view"
          >
            <Code className="w-5 h-5" />
          </button>
        </div>

        <PanelGroup direction="horizontal">
          <Panel defaultSize={70} minSize={30}>
            <div className="h-[calc(100vh-4rem)] overflow-auto">
              <div className="max-w-7xl mx-auto p-8">
                <div
                  className={`mx-auto transition-all duration-300 ${
                    viewport !== 'desktop' ? 'border-x border-gray-300 shadow-lg' : ''
                  }`}
                  style={{
                    width: viewportSizes[viewport].width,
                    height: viewport === 'desktop' ? 'auto' : viewportSizes[viewport].height,
                  }}
                >
                  <div
                    ref={setNodeRef}
                    className={`relative min-h-[calc(100vh-4rem)] bg-white ${
                      isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
                    }`}
                  >
                    <Grid size={GRID_SIZE} />
                    
                    {components.map((component) => (
                      <ComponentRenderer
                        key={component.id}
                        component={component}
                        isSelected={selectedComponent?.id === component.id}
                        isDragging={component.id === activeId}
                        onClick={() => selectComponent(component)}
                        viewport={viewport}
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
                          viewport={viewport}
                        />
                      )}
                    </DragOverlay>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          {showCode && (
            <>
              <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-gray-300 transition-colors" />
              <Panel defaultSize={30} minSize={20}>
                <CodePreview components={components} />
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </DndContext>
  );
};