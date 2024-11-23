import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '../utils/cn';
import type { ComponentType } from '../types';

interface ComponentRendererProps {
  component: ComponentType;
  isSelected: boolean;
  isDragging: boolean;
  onClick: () => void;
  viewport: 'mobile' | 'tablet' | 'desktop';
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected,
  isDragging,
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

  const renderComponent = () => {
    const commonProps = {
      className: cn(
        'w-full h-full',
        isSelected && 'ring-2 ring-blue-500',
        component.props.className
      ),
      style: {
        ...component.props.style,
        margin: 0,
        position: 'static',
      },
    };

    switch (component.type) {
      case 'text':
        return (
          <p {...commonProps}>
            {component.props.children || 'Text'}
          </p>
        );
      case 'heading':
        return (
          <h2 {...commonProps}>
            {component.props.children || 'Heading'}
          </h2>
        );
      case 'button':
        return (
          <button
            {...commonProps}
            type="button"
            className={cn(
              'px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600',
              commonProps.className
            )}
          >
            {component.props.children || 'Button'}
          </button>
        );
      case 'image':
        return (
          <img
            {...commonProps}
            src={component.props.src || 'https://via.placeholder.com/150'}
            alt={component.props.alt || 'Image'}
          />
        );
      case 'container':
        return (
          <div
            {...commonProps}
            className={cn('p-4 border border-gray-200 rounded-md', commonProps.className)}
          >
            {component.props.children || 'Container'}
          </div>
        );
      default:
        return (
          <div {...commonProps}>
            {component.type} component
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="w-full h-full"
      style={{ cursor: 'move' }}
    >
      {renderComponent()}
    </div>
  );
};