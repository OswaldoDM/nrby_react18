import React from 'react';
import { useSmartpinStore } from '@/hooks/useSmartpinStore';
import { SmartpinMarker } from './SmartpinMarker';

/**
 * Capa que renderiza todos los Smartpins sobre el mapa interactivo.
 * Se alimenta del store global useSmartpinStore y delega la representación
 * y el InfoWindow interactivo a SmartpinMarker.
 */
export const SmartpinLayer: React.FC = () => {
  const { smartpins } = useSmartpinStore();

  return (
    <>
      {smartpins.map((pin) => (
        <SmartpinMarker key={pin.id} pin={pin} />
      ))}
    </>
  );
};
