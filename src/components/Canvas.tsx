import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, MouseSensor } from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { useDroppable } from '@dnd-kit/core';
import GridLayout from 'react-grid-layout';
import { useBuilderStore } from '../store/builderStore';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { CodePreview } from './CodePreview';
import { Smartphone, Tablet, Monitor, Code, Trash2 } from 'lucide-react';
import { GridItem } from './GridItem';
import { ComponentRenderer } from './ComponentRenderer';
import { nanoid } from '../utils/nanoid';
import { ContextMenu } from './ContextMenu';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

type Viewport = 'mobile' | 'tablet' | 'desktop';

const viewportSizes = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1200, height: 800 },
};

const GRID_COLS = {
  mobile: 4,
  tablet: 8,
  desktop: 12,
};

const GRID_ROW_HEIGHT = 30;
const GRID_MARGIN = 0;
const GRID_PADDING = 0;

export const Canvas: React.FC = () => {
  const { components, selectComponent, selectedComponent, updateComponent, addComponent, removeComponent } = useBuilderStore();
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [showCode, setShowCode] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; componentId: string } | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedComponent) {
        removeComponent(selectedComponent.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponent, removeComponent]);

  const generateLayout = () => {
    return components.map((component) => {
      const width = parseInt(component.props.style.width as string || '200');
      const height = parseInt(component.props.style.height as string || '100');
      const x = parseInt(component.props.style.left as string || '0');
      const y = parseInt(component.props.style.top as string || '0');

      return {
        i: component.id,
        x: Math.floor(x / GRID_ROW_HEIGHT),
        y: Math.floor(y / GRID_ROW_HEIGHT),
        w: Math.max(1, Math.ceil(width / GRID_ROW_HEIGHT)),
        h: Math.max(1, Math.ceil(height / GRID_ROW_HEIGHT)),
        minW: 1,
        minH: 1,
        maxW: GRID_COLS[viewport],
        resizeHandles: ['se', 'sw', 'ne', 'nw', 'e', 'w', 'n', 's'],
      };
    });
  };

  const handleLayoutChange = (layout: ReactGridLayout.Layout[]) => {
    layout.forEach((item) => {
      const component = components.find((c) => c.id === item.i);
      if (component) {
        updateComponent(component.id, {
          props: {
            ...component.props,
            style: {
              ...component.props.style,
              left: `${item.x * GRID_ROW_HEIGHT}px`,
              top: `${item.y * GRID_ROW_HEIGHT}px`,
              width: `${item.w * GRID_ROW_HEIGHT}px`,
              height: `${item.h * GRID_ROW_HEIGHT}px`,
            },
          },
        });
      }
    });
  };

  const calculateGridPosition = (clientX: number, clientY: number) => {
    const canvasElement = document.querySelector('.layout') as HTMLElement;
    if (!canvasElement) return { x: 0, y: 0 };

    const canvasRect = canvasElement.getBoundingClientRect();
    const relativeX = clientX - canvasRect.left;
    const relativeY = clientY - canvasRect.top;

    return {
      x: Math.floor(relativeX / GRID_ROW_HEIGHT),
      y: Math.floor(relativeY / GRID_ROW_HEIGHT),
    };
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    
    if (over && over.id === 'canvas') {
      const componentType = active.data.current?.type;
      
      if (componentType && active.id.toString().startsWith('toolbar-')) {
        const { x: gridX, y: gridY } = calculateGridPosition(event.activatorEvent.clientX, event.activatorEvent.clientY);

        const defaultSizes = {
          mobile: { w: 2, h: 2 },
          tablet: { w: 3, h: 2 },
          desktop: { w: 4, h: 2 },
        };

        const { w: defaultWidth, h: defaultHeight } = defaultSizes[viewport];
        const maxX = GRID_COLS[viewport] - defaultWidth;
        const adjustedX = Math.min(Math.max(0, gridX), maxX);

        const newComponent = {
          id: nanoid(),
          type: componentType,
          props: {
            style: {
              left: `${adjustedX * GRID_ROW_HEIGHT}px`,
              top: `${gridY * GRID_ROW_HEIGHT}px`,
              width: `${defaultWidth * GRID_ROW_HEIGHT}px`,
              height: `${defaultHeight * GRID_ROW_HEIGHT}px`,
            },
            children: componentType === 'text' ? 'New Text' : componentType === 'button' ? 'Button' : '',
          },
        };
        
        addComponent(newComponent);
      }
    }
    
    setActiveId(null);
  };

  const handleContextMenu = (e: React.MouseEvent, componentId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, componentId });
  };

  const handleDeleteComponent = (componentId: string) => {
    removeComponent(componentId);
    setContextMenu(null);
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[snapCenterToCursor]}
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
                    className={`relative bg-white min-h-[600px] ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
                    style={{
                      backgroundImage: 'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)',
                      backgroundSize: `${GRID_ROW_HEIGHT}px ${GRID_ROW_HEIGHT}px`,
                    }}
                  >
                    <GridLayout
                      className="layout"
                      layout={generateLayout()}
                      cols={GRID_COLS[viewport]}
                      rowHeight={GRID_ROW_HEIGHT}
                      width={viewportSizes[viewport].width}
                      onLayoutChange={handleLayoutChange}
                      isDraggable
                      isResizable
                      compactType={null}
                      preventCollision
                      margin={[GRID_MARGIN, GRID_MARGIN]}
                      containerPadding={[GRID_PADDING, GRID_PADDING]}
                      useCSSTransforms={false}
                    >
                      {components.map((component) => (
                        <div key={component.id} onContextMenu={(e) => handleContextMenu(e, component.id)}>
                          <GridItem
                            component={component}
                            isSelected={selectedComponent?.id === component.id}
                            onClick={() => selectComponent(component)}
                            viewport={viewport}
                          />
                        </div>
                      ))}
                    </GridLayout>
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

        <DragOverlay>
          {activeId && (
            <div className="bg-white border border-gray-200 rounded-md p-4 shadow-lg opacity-50 pointer-events-none">
              {activeId.toString().replace('toolbar-', '')}
            </div>
          )}
        </DragOverlay>

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            items={[
              {
                label: 'Delete',
                icon: <Trash2 className="w-4 h-4" />,
                onClick: () => handleDeleteComponent(contextMenu.componentId),
              },
            ]}
          />
        )}
      </div>
    </DndContext>
  );
};