import React, { useState } from 'react';

export interface TooltipProps {  
  content: React.ReactNode; // Texto o nodo que se mostrará en el tooltip
  children: React.ReactNode; // Elemento que dispara la aparición del tooltip al pasar el cursor
  position?: 'top' | 'right' | 'bottom' | 'left'; // Posición del tooltip respecto al elemento trigger
  delay?: number; // Retraso opcional en milisegundos antes de mostrarse
  disabled?: boolean; // Si está deshabilitado no se muestra
}

/**
 * Componente Tooltip reutilizable con micro-animaciones suaves.
 * Muy útil para botones de acción y elementos del sidebar colapsado.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'right',
  delay = 150,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  // Manejo de la entrada del cursor con retraso controlado
  const handleMouseEnter = () => {
    if (disabled || !content) return;
    const id = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  // Manejo de la salida del cursor limpiando timers
  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  // Clases de posicionamiento según la dirección
  const positionClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2.5',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}

      {isVisible && !disabled && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none whitespace-nowrap px-2.5 py-1 text-xs font-medium text-surface-100 bg-surface-850/95 border border-surface-700/80 rounded-md shadow-xl backdrop-blur-sm transition-all duration-150 animate-in fade-in zoom-in-95 ${positionClasses[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
