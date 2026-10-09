import React from 'react';
import type { ButtonVariant, ComponentSize } from '@/types';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode; // Icono a renderizar
  variant?: ButtonVariant; // Variante visual
  size?: ComponentSize; // Tamaño del botón de icono  
  'aria-label': string; // Etiqueta accesible para lectores de pantalla
}

/**
 * Componente IconButton reutilizable para botones de acción con sólo icono.
 * Mantiene proporción cuadrada perfecta y estados interactivos pulidos.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'ghost',
      size = 'md',
      disabled = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    // Estilos base
    const baseStyles =
      'inline-flex items-center justify-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-nrby-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-95 cursor-pointer shrink-0';

    // Variantes de color
    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-nrby-500 hover:bg-nrby-400 text-surface-950 shadow-md shadow-nrby-500/20',
      secondary:
        'bg-surface-800 hover:bg-surface-700 text-surface-200 border border-surface-700/80',
      outline:
        'bg-transparent hover:bg-surface-800 text-surface-300 border border-surface-700 hover:border-surface-600 hover:text-white',
      ghost:
        'bg-transparent hover:bg-surface-800 text-surface-400 hover:text-surface-100',
      danger:
        'bg-danger-500/10 hover:bg-danger-500/20 text-danger-400 border border-danger-500/30',
    };

    // Dimensiones cuadradas según el tamaño
    const sizeStyles: Record<ComponentSize, string> = {
      sm: 'w-7 h-7 rounded-md text-xs',
      md: 'w-9 h-9 rounded-lg text-sm',
      lg: 'w-11 h-11 rounded-lg text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...rest}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
