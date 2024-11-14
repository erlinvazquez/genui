import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const variants = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={cn(
          'rounded-lg px-4 py-3 text-white shadow-lg',
          variants[type]
        )}
      >
        <div className="flex items-center space-x-3">
          <span>{message}</span>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-white/10"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};