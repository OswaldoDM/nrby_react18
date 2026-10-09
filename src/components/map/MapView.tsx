import React, { useState } from 'react';
import { Map, useMap, useApiLoadingStatus, APILoadingStatus } from '@vis.gl/react-google-maps';
import { GOOGLE_MAP_ID, US_DEFAULT_CENTER, US_DEFAULT_ZOOM } from './mapConfig';
import { useMapStore } from '@/hooks/useMapStore';
import { Button } from '@/components/ui';
import { MapPin, RotateCcw, Loader2, AlertTriangle, Compass, X, Pen,} from 'lucide-react';
import { JurisdictionLayer } from './JurisdictionLayer';
import { SmartpinLayer } from './SmartpinLayer';
import { DrawingManager } from './DrawingManager';

/**
 * Componente interno que renderiza los controles interactivos y el mapa.
 * Al estar dentro de <APIProvider>, tiene acceso directo al ciclo de vida del mapa.
 */
const MapInner: React.FC = () => {
  const map = useMap('nrby-main-map');
  const loadingStatus = useApiLoadingStatus();
  const {
    drawingMode,
    setDrawingMode,
    statusMessage,
    setStatusMessage,
    resetView,
  } = useMapStore();

  const [activeMapType, setActiveMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  // Función para re-centrar el mapa a la vista general de Estados Unidos
  const handleRecenter = () => {
    if (map) {
      map.panTo(US_DEFAULT_CENTER);
      map.setZoom(US_DEFAULT_ZOOM);
    }
    resetView();
  };

  // Cambiar el tipo de capa de mapa
  const handleMapTypeChange = (type: 'roadmap' | 'satellite' | 'hybrid') => {
    setActiveMapType(type);
    if (map) {
      map.setMapTypeId(type);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Contenedor principal de Google Maps */}
      <Map
        id="nrby-main-map"
        defaultCenter={US_DEFAULT_CENTER}
        defaultZoom={US_DEFAULT_ZOOM}
        mapId={GOOGLE_MAP_ID}
        reuseMaps={true}
        gestureHandling="greedy"
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        zoomControl={true}
        className="w-full h-full"
      >
        {/* Capa de polígonos de Jurisdicciones */}
        <JurisdictionLayer />

        {/* Capa de marcadores de Smartpins */}
        <SmartpinLayer />

        {/* Administrador de dibujo interactivo */}
        <DrawingManager />
      </Map>

      {/* 1. Botón superior izquierdo: "Create new Pin" (conforme a la imagen de referencia del usuario) */}
      <div className="absolute top-4 left-8 z-10 flex flex-col gap-2">
        <button
          onClick={() => {
            const nextMode = drawingMode === 'smartpin' ? 'none' : 'smartpin';
            setDrawingMode(nextMode);
          }}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer border select-none active:scale-95 ${
            drawingMode === 'smartpin'
              ? 'bg-emerald-400 text-surface-950 border-emerald-300 ring-4 ring-emerald-400/30'
              : 'bg-nrby-400 hover:bg-nrby-300 text-surface-950 border-nrby-300 shadow-nrby-500/20 hover:shadow-nrby-500/40'
          }`}
        >
          <MapPin className="w-4 h-4 fill-surface-950" />
          <span>{drawingMode === 'smartpin' ? 'Click map to place Pin' : 'Add Smartpin'}</span>
        </button>

        {/* Botón rápido para trazar una Jurisdiction */}
        <button
          onClick={() => {
            const nextMode = drawingMode === 'jurisdiction' ? 'none' : 'jurisdiction';
            setDrawingMode(nextMode);
          }}
          className={`px-3.5 py-2.5 rounded-xl font-medium text-sm shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer border select-none backdrop-blur-md active:scale-95 ${
            drawingMode === 'jurisdiction'
              ? 'bg-nrby-500 text-surface-950 border-nrby-400 ring-4 ring-nrby-500/30 font-semibold'
              : 'bg-surface-900/90 hover:bg-surface-850 text-surface-100 border-surface-700/80 hover:border-surface-600'
          }`}
        >
          <Pen className="w-4 h-4 text-nrby-400" />
          <span>{drawingMode === 'jurisdiction' ? 'Drawing Jurisdiction...' : 'New Jurisdiction'}</span>
        </button>

        {/* Botón de cancelar modo actual si hay alguno activo */}
        {drawingMode !== 'none' && (
          <button
            onClick={() => setDrawingMode('none')}
            title="Cancel current drawing mode"
            className="w-9 h-9 rounded-xl bg-surface-900/90 hover:bg-danger-500/20 text-surface-300 hover:text-danger-400 border border-surface-700/80 hover:border-danger-500/40 shadow-lg flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Controles superiores derechos: Tipo de Mapa y Re-centrar en USA */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        
        {/* Selector de capas del mapa */}
        <div className="p-1 rounded-xl bg-surface-900/90 border border-surface-700/80 shadow-xl backdrop-blur-md flex items-center gap-1">
          <button
            onClick={() => handleMapTypeChange('roadmap')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeMapType === 'roadmap'
                ? 'bg-nrby-500 text-surface-950 font-semibold shadow-sm'
                : 'text-surface-300 hover:text-white hover:bg-surface-800'
            }`}
          >
            Default
          </button>
          <button
            onClick={() => handleMapTypeChange('hybrid')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeMapType === 'hybrid'
                ? 'bg-nrby-500 text-surface-950 font-semibold shadow-sm'
                : 'text-surface-300 hover:text-white hover:bg-surface-800'
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Botón de recentrar en Estados Unidos */}
        <button
          onClick={handleRecenter}
          title="Reset view to United States"
          className="h-9 px-3 rounded-xl bg-surface-900/90 hover:bg-surface-850 text-surface-200 hover:text-white border border-surface-700/80 shadow-xl flex items-center gap-1.5 text-xs font-medium backdrop-blur-md transition-all cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-nrby-400" />
          <span className="hidden sm:inline">Reset View</span>
        </button>
      </div>

      {/* 3. Banner informativo flotante inferior si un modo de interacción está activo */}
      {statusMessage && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 max-w-lg w-auto px-4 py-2.5 rounded-xl bg-surface-900/95 border border-nrby-500/40 text-surface-100 text-xs shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-2 h-2 rounded-full bg-nrby-500 animate-pulse shrink-0" />
          <p className="flex-1 font-medium">{statusMessage}</p>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-surface-400 hover:text-surface-200 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4. Indicador flotante inferior izquierdo con las coordenadas por defecto */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-900/85 border border-surface-800 text-[11px] text-surface-400 font-mono backdrop-blur-sm">
        <Compass className="w-3.5 h-3.5 text-nrby-400" />
        <span>USA: 39.8283° N, 98.5795° W</span>
      </div>

      {/* Overlay de carga si la API de Google Maps aún está inicializándose */}
      {loadingStatus === APILoadingStatus.LOADING && (
        <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-nrby-500 animate-spin" />
          <p className="text-sm font-medium text-surface-200">Loading Google Maps...</p>
        </div>
      )}

      {/* Overlay de error si la API de Google Maps falla en cargar */}
      {(loadingStatus === APILoadingStatus.FAILED || loadingStatus === APILoadingStatus.AUTH_FAILURE) && (
        <div className="absolute inset-0 bg-surface-950/90 z-30 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md p-6 rounded-2xl bg-surface-900 border border-danger-500/40 shadow-2xl space-y-3">
            <AlertTriangle className="w-10 h-10 text-danger-400 mx-auto" />
            <h3 className="text-base font-semibold text-white">Google Maps Failed to Load</h3>
            <p className="text-xs text-surface-400">
              Could not authenticate or establish connection with Google Maps API. Please verify your internet connection or API Key permissions.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Componente principal MapView.
 * Configura el proveedor de la API de Google Maps con la clave provista
 * y renderiza el mapa centrado en Estados Unidos.
 */
export const MapView: React.FC = () => {
  return <MapInner />;
};
