import React from 'react';
import type { ButtonVariant, ComponentSize } from '@/types';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant; // Variante visual del botón
  size?: ComponentSize; // Tamaño estandarizado del botón
  leftIcon?: React.ReactNode; // Icono opcional colocado a la izquierda
  rightIcon?: React.ReactNode; // Icono opcional colocado a la derecha  
  isLoading?: boolean; // Estado de carga que muestra un spinner animado
}

/**
 * Componente Button reutilizable con múltiples variantes de color y tamaño.
 * Diseñado con micro-animaciones, estados hover/active y compatibilidad total con React 18.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      isLoading = false,
      disabled = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    // Estilos base compartidos por todos los botones
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-nrby-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] cursor-pointer';

    // Mapeo de estilos por variante visual
    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-nrby-500 hover:bg-nrby-400 text-surface-950 font-semibold shadow-md shadow-nrby-500/20 hover:shadow-nrby-500/30',
      secondary:
        'bg-surface-800 hover:bg-surface-700 text-surface-100 border border-surface-700/80 shadow-sm',
      outline:
        'bg-transparent hover:bg-surface-800/80 text-surface-200 border border-surface-700 hover:border-nrby-500/50 hover:text-white',
      ghost:
        'bg-transparent hover:bg-surface-800/80 text-surface-300 hover:text-surface-100',
      danger:
        'bg-danger-500/15 hover:bg-danger-500/25 text-danger-400 border border-danger-500/30 shadow-sm',
    };

    // Mapeo de estilos por tamaño
    const sizeStyles: Record<ComponentSize, string> = {
      sm: 'text-xs px-2.5 py-1.5 rounded-md gap-1.5',
      md: 'text-sm px-3.5 py-2 rounded-lg gap-2',
      lg: 'text-base px-5 py-2.5 rounded-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...rest}
      >
        {/* Spinner animado cuando está en estado de carga */}
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}

        {/* Icono a la izquierda si no está cargando */}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}

        {/* Contenido principal del botón */}
        <span>{children}</span>

        {/* Icono a la derecha */}
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
