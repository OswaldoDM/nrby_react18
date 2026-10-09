import { create } from 'zustand';
import type { Coordinate, DrawingMode } from '@/types';

// Coordenadas centrales por defecto para visualizar Estados Unidos en su totalidad
export const DEFAULT_MAP_CENTER: Coordinate = {
  lat: 39.8283,
  lng: -98.5795,
};

// Nivel de zoom por defecto que abarca el territorio de Estados Unidos
export const DEFAULT_MAP_ZOOM = 4;

interface MapState {
  center: Coordinate; // Centro geográfico actual del mapa
  zoom: number; // Zoom actual
  drawingMode: DrawingMode; // Modo de dibujo activo ('none', 'jurisdiction', 'smartpin')
  selectedJurisdictionId: string | null; // ID de la jurisdicción actualmente seleccionada/enfocada
  selectedSmartpinId: string | null; // ID del smartpin actualmente seleccionado
  mapTypeId: string; // Tipo de mapa seleccionado (roadmap, satellite, hybrid, terrain)
  statusMessage: string | null; // Mensaje de estado informativo para la barra inferior o banner del mapa

  // Acciones para actualizar el estado
  setCenter: (center: Coordinate) => void;
  setZoom: (zoom: number) => void;
  setDrawingMode: (mode: DrawingMode) => void;
  setSelectedJurisdictionId: (id: string | null) => void;
  setSelectedSmartpinId: (id: string | null) => void;
  setMapTypeId: (mapTypeId: string) => void;
  setStatusMessage: (message: string | null) => void;
  resetView: () => void;
}

/**
 * Store de Zustand para gestionar el estado del mapa interactivo de Google Maps.
 * Centraliza el modo de dibujo, la selección de elementos y las coordenadas de la cámara.
 */
export const useMapStore = create<MapState>((set) => ({
  center: DEFAULT_MAP_CENTER,
  zoom: DEFAULT_MAP_ZOOM,
  drawingMode: 'none',
  selectedJurisdictionId: null,
  selectedSmartpinId: null,
  mapTypeId: 'roadmap',
  statusMessage: null,

  setCenter: (center: Coordinate) => set({ center }),
  setZoom: (zoom: number) => set({ zoom }),

  setDrawingMode: (mode: DrawingMode) => {
    let message: string | null = null;
    if (mode === 'jurisdiction') {
      message = 'Click on the map to start drawing a Jurisdiction polygon. Double-click or close the polygon to finish.';
    } else if (mode === 'smartpin') {
      message = 'Click inside any existing Jurisdiction to place a Smartpin.';
    }
    set({ drawingMode: mode, statusMessage: message });
  },

  setSelectedJurisdictionId: (id: string | null) =>
    set({ selectedJurisdictionId: id, selectedSmartpinId: null }),

  setSelectedSmartpinId: (id: string | null) =>
    set({ selectedSmartpinId: id }),

  setMapTypeId: (mapTypeId: string) => set({ mapTypeId }),

  setStatusMessage: (message: string | null) => set({ statusMessage: message }),

  resetView: () =>
    set({
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
      drawingMode: 'none',
      selectedJurisdictionId: null,
      selectedSmartpinId: null,
      statusMessage: null,
    }),
}));
