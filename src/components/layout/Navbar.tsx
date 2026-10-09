import React from 'react';
import { MapPin, Bell, HelpCircle, Layers, Globe, User } from 'lucide-react';
import { useJurisdictionStore } from '@/hooks/useJurisdictionStore';
import { useSmartpinStore } from '@/hooks/useSmartpinStore';
import { IconButton } from '@/components/ui';

export const Navbar: React.FC = () => {  
  const { jurisdictions } = useJurisdictionStore();
  const { smartpins } = useSmartpinStore();

  return (
    <header className="h-14 w-full bg-surface-900/90 border-b border-surface-800/80 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none shrink-0">
      {/* Sección izquierda: Marca y Logo Nrby */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <img
            src="/nrby-logo-white.png"
            alt="Nrby"
            className="h-7 w-auto object-contain brightness-110"
            onError={(e) => {
              // Fallback visual en caso de que la imagen tarde en cargar
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="w-2 h-2 rounded-full bg-nrby-500 animate-pulse shadow-sm shadow-nrby-500" />          
        </div>

        {/* Separador vertical sutil */}
        <div className="h-4 w-px bg-surface-800 hidden sm:block" />

        {/* Indicador de región actual */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-850 border border-surface-700/60 text-xs text-surface-300">
          <Globe className="w-3.5 h-3.5 text-nrby-400" />
          <span>United States Region</span>          
        </div>
      </div>

      {/* Sección central: Métricas operativas en vivo */}
      <div className="hidden md:flex items-center gap-3 text-xs font-medium text-surface-400">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-850/80 border border-surface-800">
          <Layers className="w-3.5 h-3.5 text-nrby-400" />
          <span className="text-surface-200 font-semibold">{jurisdictions.length}</span>
          <span className="text-surface-400">Jurisdictions</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-850/80 border border-surface-800">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-surface-200 font-semibold">{smartpins.length}</span>
          <span className="text-surface-400">Smartpins</span>
        </div>
      </div>

      {/* Sección derecha: Acciones rápidas y perfil */}
      <div className="flex items-center gap-2">

        {/* Acceso a ayuda / documentación */}
        <IconButton
          aria-label="Help and Documentation"
          icon={<HelpCircle className="w-4 h-4" />}
          size="sm"
          variant="ghost"
        />

        {/* Notificaciones */}
        <div className="relative">
          <IconButton
            aria-label="Notifications"
            icon={<Bell className="w-4 h-4" />}
            size="sm"
            variant="ghost"
          />
          <span className="absolute top-1 right-1 w-2 h-2 bg-nrby-500 rounded-full" />
        </div>

        {/* Avatar de usuario simulado con el color de acento de Nrby */}
        <div className="ml-1 flex items-center gap-2 pl-2 border-l border-surface-800">
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-surface-800 to-surface-700 border border-nrby-500/40 flex items-center justify-center text-xs font-semibold text-nrby-400 shadow-sm cursor-pointer hover:border-nrby-500 transition-colors">
            <User className="w-4 h-4 text-nrby-400" />
          </div>
        </div>
      </div>
    </header>
  );
};
