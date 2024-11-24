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
        'w-full h-full flex items-center justify-center',
        isSelected && 'ring-2 ring-blue-500',
        component.props.className
      ),
      style: {
        ...component.props.style,
        padding: 0,
        margin: 0,
        position: 'static',
      },
    };

    const responsiveClasses = {
      mobile: 'text-sm',
      tablet: 'text-base',
      desktop: 'text-lg',
    };

    switch (component.type) {
      case 'text':
        return (
          <p {...commonProps} className={cn(commonProps.className, responsiveClasses[viewport])}>
            {component.props.children || 'Text'}
          </p>
        );
      case 'heading':
        return (
          <h2 {...commonProps} className={cn(commonProps.className, {
            'text-lg': viewport === 'mobile',
            'text-xl': viewport === 'tablet',
            'text-2xl': viewport === 'desktop',
          })}>
            {component.props.children || 'Heading'}
          </h2>
        );
      case 'button':
        return (
          <button
            {...commonProps}
            type="button"
            className={cn(
              'bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors',
              {
                'px-3 py-1.5 text-sm': viewport === 'mobile',
                'px-4 py-2 text-base': viewport === 'tablet',
                'px-6 py-2.5 text-lg': viewport === 'desktop',
              },
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
            className={cn(commonProps.className, 'object-cover')}
          />
        );
      case 'container':
        return (
          <div
            {...commonProps}
            className={cn(
              'border border-gray-200 rounded-md',
              {
                'p-2': viewport === 'mobile',
                'p-3': viewport === 'tablet',
                'p-4': viewport === 'desktop',
              },
              commonProps.className
            )}
          >
            {component.props.children || 'Container'}
          </div>
        );
      default:
        return (
          <div {...commonProps} className={cn(commonProps.className, responsiveClasses[viewport])}>
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
      className="w-full h-full flex items-center justify-center"
      style={{ cursor: 'move' }}
    >
      {renderComponent()}
    </div>
  );
};