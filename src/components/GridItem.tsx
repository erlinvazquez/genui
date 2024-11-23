import React from 'react';
import { ComponentType } from '../types';
import { ComponentRenderer } from './ComponentRenderer';

interface GridItemProps {
  component: ComponentType;
  isSelected: boolean;
  onClick: () => void;
  viewport: 'mobile' | 'tablet' | 'desktop';
}

export const GridItem: React.FC<GridItemProps> = ({
  component,
  isSelected,
  onClick,
  viewport,
}) => {
  return (
    <ComponentRenderer
      component={component}
      isSelected={isSelected}
      isDragging={false}
      onClick={onClick}
      viewport={viewport}
    />
  );
};