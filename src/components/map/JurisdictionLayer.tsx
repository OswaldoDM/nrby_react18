import React, { useMemo, useCallback } from 'react';
import { Polygon, useMap } from '@vis.gl/react-google-maps';
import { useJurisdictionStore } from '@/hooks/useJurisdictionStore';
import { useSmartpinStore } from '@/hooks/useSmartpinStore';
import { useMapStore } from '@/hooks/useMapStore';
import type { Jurisdiction, Smartpin } from '@/types';

/**
 * Capa que renderiza todas las jurisdicciones definidas en el mapa.
 * Utiliza el componente <Polygon> de @vis.gl/react-google-maps con soporte
   para selección visual interactiva, recentrado de cámara y colocación directa de Smartpins.
 */
export const JurisdictionLayer: React.FC = () => {
  const map = useMap('nrby-main-map');
  const { jurisdictions } = useJurisdictionStore();
  const { smartpins, addSmartpin } = useSmartpinStore();
  const {
    drawingMode,
    setDrawingMode,
    selectedJurisdictionId,
    setSelectedJurisdictionId,
    setSelectedSmartpinId,
    setStatusMessage,
  } = useMapStore();

  // Función para manejar el clic en un polígono de jurisdicción
  const handlePolygonClick = useCallback(
    (jurisdiction: Jurisdiction, e: google.maps.MapMouseEvent) => {
      
      // 1. Si estamos en modo de colocar Smartpin, colocarlo directamente en este polígono
      if (drawingMode === 'smartpin') {
        if (e.stop) {
          e.stop();
        }

        const clickPoint = e.latLng;
        if (!clickPoint) return;

        const newPin: Smartpin = {
          id: `pin-${Date.now()}`,
          name: `Smartpin #${smartpins.length + 1}`,
          position: { lat: clickPoint.lat(), lng: clickPoint.lng() },
          jurisdictionId: jurisdiction.id,
          status: 'active',
          description: `Field node assigned to ${jurisdiction.name}.`,
          createdAt: new Date().toISOString(),
        };

        addSmartpin(newPin);
        setSelectedSmartpinId(newPin.id);
        setSelectedJurisdictionId(jurisdiction.id);
        setDrawingMode('none');
        setStatusMessage(`Smartpin dropped successfully inside "${jurisdiction.name}"!`);
        return;
      }

      // 2. Si estamos trazando otra jurisdicción, ignorar el clic para no interferir
      if (drawingMode === 'jurisdiction') {
        return;
      }

      // 3. Modo normal: enfocar y seleccionar la jurisdicción
      setSelectedJurisdictionId(jurisdiction.id);
      setStatusMessage(`Selected Jurisdiction: "${jurisdiction.name}"`);

      if (map && window.google?.maps) {
        const bounds = new window.google.maps.LatLngBounds();
        jurisdiction.paths.forEach((coord) => {
          bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
        });
        map.fitBounds(bounds, 80);
      }
    },
    [
      drawingMode,
      smartpins.length,
      addSmartpin,
      setSelectedSmartpinId,
      setSelectedJurisdictionId,
      setDrawingMode,
      setStatusMessage,
      map,
    ]
  );

  // Convertimos las rutas a coordenadas legibles por Google Maps
  const renderedPolygons = useMemo(() => {
    return jurisdictions.map((j) => {
      const isSelected = selectedJurisdictionId === j.id;

      return (
        <Polygon
          key={j.id}
          paths={j.paths}
          strokeColor={isSelected ? '#FFFFFF' : j.color}
          strokeOpacity={isSelected ? 1.0 : 0.85}
          strokeWeight={isSelected ? 3.5 : 2}
          fillColor={j.color}
          fillOpacity={isSelected ? 0.42 : j.fillOpacity || 0.22}
          clickable={drawingMode !== 'jurisdiction'}
          onClick={(e) => handlePolygonClick(j, e)}
        />
      );
    });
  }, [jurisdictions, selectedJurisdictionId, handlePolygonClick, drawingMode]);

  return <>{renderedPolygons}</>;
};
