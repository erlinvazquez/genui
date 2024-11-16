import React, { useRef, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '../utils/cn';
import type { ComponentType } from '../types';

interface ComponentRendererProps {
  component: ComponentType;
  isSelected: boolean;
  isDragging: boolean;
  isOverlay?: boolean;
  onClick: () => void;
  viewport: 'mobile' | 'tablet' | 'desktop';
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected,
  isDragging,
  isOverlay = false,
  onClick,
  viewport,
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: component.id,
    data: {
      type: component.type,
      component,
    },
  });

  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    const element = e.currentTarget.parentElement;
    if (element) {
      const rect = element.getBoundingClientRect();
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: rect.width,
        startHeight: rect.height,
      };
    }
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing || !resizeRef.current) return;

    const deltaX = e.clientX - resizeRef.current.startX;
    const deltaY = e.clientY - resizeRef.current.startY;

    const newWidth = Math.max(50, resizeRef.current.startWidth + deltaX);
    const newHeight = Math.max(50, resizeRef.current.startHeight + deltaY);

    component.props.style.width = `${newWidth}px`;
    component.props.style.height = `${newHeight}px`;
    
    // Force re-render
    onClick();
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    resizeRef.current = null;
  };

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing]);

  const baseStyles = {
    position: component.props.style.position || 'relative',
    left: component.props.style.left || '0',
    top: component.props.style.top || '0',
    zIndex: component.props.style.zIndex || 'auto',
    opacity: isDragging && !isOverlay ? 0 : 1,
    cursor: 'move',
    touchAction: 'none',
    width: viewport === 'desktop' ? component.props.style.width || 'auto' : '100%',
    maxWidth: viewport === 'desktop' ? '100%' : component.props.style.maxWidth,
    height: component.props.style.height,
    ...component.props.style,
  };

  const renderComponent = () => {
    const commonProps = {
      className: cn(
        'transition-colors',
        isSelected && 'ring-2 ring-blue-500',
        component.props.className
      ),
      style: baseStyles,
    };

    // ... rest of your renderComponent logic ...
    // (Keep your existing switch statement for rendering different component types)
  };

  const element = renderComponent();

  if (!element) return null;

  return (
    <div
      ref={setNodeRef}
      {...(isOverlay ? {} : { ...attributes, ...listeners })}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        'relative',
        isSelected && 'ring-2 ring-blue-500',
        'hover:ring-2 hover:ring-blue-300'
      )}
      style={baseStyles}
    >
      {element}
      {isSelected && !isOverlay && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};