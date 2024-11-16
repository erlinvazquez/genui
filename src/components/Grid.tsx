import React from 'react';

interface GridProps {
  size: number;
}

export const Grid: React.FC<GridProps> = ({ size }) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundSize: `${size}px ${size}px`,
        backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
        `,
        backgroundPosition: '0 0',
        backgroundRepeat: 'repeat',
      }}
    />
  );
};