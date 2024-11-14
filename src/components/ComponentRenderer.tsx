import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '../utils/cn';
import type { ComponentType } from '../types';

interface ComponentRendererProps {
  component: ComponentType;
  isSelected: boolean;
  isDragging: boolean;
  isOverlay?: boolean;
  onClick: () => void;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected,
  isDragging,
  isOverlay = false,
  onClick,
}) => {
  const { attributes, listeners, setNodeRef, isDragging: isDraggingNow } = useDraggable({
    id: component.id,
    data: {
      type: component.type,
      component,
    },
  });

  const baseStyles = {
    position: component.props.style.position || 'relative',
    left: component.props.style.left || '0',
    top: component.props.style.top || '0',
    zIndex: component.props.style.zIndex || 'auto',
    opacity: isDragging && !isOverlay ? 0 : 1,
    cursor: 'move',
    touchAction: 'none',
    ...component.props.style,
  };

  const renderComponent = () => {
    const commonProps = {
      className: cn(
        'transition-colors',
        component.type === 'button' && 'px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600',
        component.type === 'text' && 'text-2xl font-bold',
        component.type === 'paragraph' && 'text-gray-600',
        component.type === 'container' && 'p-4 border-2 border-dashed border-gray-300 rounded-md',
        component.props.className
      ),
      style: baseStyles,
    };

    switch (component.type) {
      case 'button':
        return (
          <button {...commonProps}>
            {component.props.children || 'Button'}
          </button>
        );
      case 'text':
        return (
          <h2 {...commonProps}>
            {component.props.children || 'Heading'}
          </h2>
        );
      case 'paragraph':
        return (
          <p {...commonProps}>
            {component.props.children || 'Paragraph text'}
          </p>
        );
      case 'image':
        return (
          <img
            src={component.props.src || 'https://via.placeholder.com/400x300'}
            alt={component.props.alt || ''}
            {...commonProps}
            className={cn('max-w-full h-auto rounded-md', component.props.className)}
          />
        );
      case 'container':
        return (
          <div {...commonProps}>
            {component.children?.map((child) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isSelected={false}
                isDragging={false}
                onClick={() => {}}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
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
      {isSelected && (
        <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          {component.type}
        </div>
      )}
    </div>
  );
};