import React, { useState } from 'react';
import { AdvancedMarker, InfoWindow, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useMapStore } from '@/hooks/useMapStore';
import { useJurisdictionStore } from '@/hooks/useJurisdictionStore';
import { useSmartpinStore } from '@/hooks/useSmartpinStore';
import { SmartpinModal, type SmartpinFormData } from './SmartpinModal';
import type { Smartpin } from '@/types';
import { MapPin, Trash2, Calendar, Shield, User, Move } from 'lucide-react';

interface SmartpinMarkerProps {
  pin: Smartpin;
}

/**
 * Marcador individual para un Smartpin.
 * Utiliza <AdvancedMarker> de @vis.gl/react-google-maps con un diseño visual custom
 * del pin de Nrby, edición de nombre al hacer clic en el contenedor del ícono,
 * y modo reposicionamiento libre al hacer clic en el puntero de la base.
 */
export const SmartpinMarker: React.FC<SmartpinMarkerProps> = ({ pin }) => {
  const map = useMap('nrby-main-map');
  const geometryLib = useMapsLibrary('geometry');

  const {
    selectedSmartpinId,
    setSelectedSmartpinId,
    setSelectedJurisdictionId,
    setStatusMessage,
  } = useMapStore();
  const { jurisdictions, getJurisdictionById } = useJurisdictionStore();
  const { removeSmartpin, updateSmartpin } = useSmartpinStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);

  const isSelected = selectedSmartpinId === pin.id;
  const jurisdiction = getJurisdictionById(pin.jurisdictionId);

  // Manejo de clic general en el marcador
  const handleMarkerClick = () => {
    // Si está en modo arrastre, no cambiamos la selección ni centramos
    if (isDraggable) return;

    setSelectedSmartpinId(pin.id);
    setSelectedJurisdictionId(pin.jurisdictionId);

    if (map) {
      map.panTo(pin.position);
    }
  };

  // Manejo de clic en el Pin Icon Container para editar nombre y propiedades
  const handleIconContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  // Manejo de clic en el pequeño puntero en la base del pin para activar el movimiento
  const handlePointerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isDraggable;
    setIsDraggable(nextState);

    if (nextState) {
      setSelectedSmartpinId(pin.id);
      setStatusMessage(`📍 Drag mode enabled for "${pin.name}". Move it anywhere on the map!`);
    } else {
      setStatusMessage(`Repositioning cancelled for "${pin.name}".`);
    }
  };

  // Guardar cambios del Smartpin desde el modal de edición
  const handleSaveEdit = (data: SmartpinFormData) => {
    updateSmartpin(pin.id, {
      name: data.name,
      description: data.description,
      status: data.status,
      assignedTo: data.assignedTo || undefined,
    });
    setIsEditModalOpen(false);
    setStatusMessage(`Smartpin updated: "${data.name}".`);
  };

  // Finalización del arrastre del marcador en el mapa
  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    // Verificar si el pin cayó dentro de una jurisdicción para actualizar la asignación
    let matchedJurisdictionId = pin.jurisdictionId;
    let matchedJurisdictionName = jurisdiction?.name;
    const polyLib = geometryLib?.poly || window.google?.maps?.geometry?.poly;

    if (polyLib && jurisdictions.length > 0) {
      for (const j of jurisdictions) {
        const tempPoly = new google.maps.Polygon({ paths: j.paths });
        if (polyLib.containsLocation(e.latLng, tempPoly)) {
          matchedJurisdictionId = j.id;
          matchedJurisdictionName = j.name;
          break;
        }
      }
    }

    updateSmartpin(pin.id, {
      position: newPos,
      jurisdictionId: matchedJurisdictionId,
    });
    setIsDraggable(false);
    setStatusMessage(
      `Smartpin "${pin.name}" relocated successfully${
        matchedJurisdictionName ? ` to "${matchedJurisdictionName}"` : ''
      }!`
    );
  };

  // Color distintivo según el estado del pin
  const statusColorMap: Record<string, { bg: string; text: string; border: string }> = {
    active: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    in_progress: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
    completed: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
    flagged: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' },
  };

  const statusStyle = statusColorMap[pin.status] || statusColorMap.active;

  return (
    <>
      <AdvancedMarker
        position={pin.position}
        onClick={handleMarkerClick}
        draggable={isDraggable}
        onDragEnd={handleDragEnd}
        title={isDraggable ? `Drag "${pin.name}" to move` : pin.name}
      >
        {/* Contenido visual personalizado del Smartpin con estética Nrby */}
        <div
          className={`relative group ${
            isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
          } -translate-x-1/2 -translate-y-full`}
        >
          {/* Anillo de pulso si el pin está seleccionado */}
          {isSelected && !isDraggable && (
            <div className="absolute -inset-1.5 rounded-full bg-nrby-500/40 animate-ping pointer-events-none" />
          )}

          {/* Insignia flotante cuando está en modo mover */}
          {isDraggable && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-400 text-surface-950 font-bold text-[10px] whitespace-nowrap shadow-lg ring-2 ring-amber-400/50 flex items-center gap-1 animate-bounce pointer-events-none z-30">
              <Move className="w-2.5 h-2.5" />
              <span>Drag to move</span>
            </div>
          )}

          {/* Pin Icon Container - Al hacer clic se abre el modal para editar el nombre */}
          <div
            onClick={handleIconContainerClick}
            title="Click icon to edit Smartpin name"
            className={`w-7 h-7 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-xl ${
              isDraggable
                ? 'bg-amber-400 text-surface-950 ring-4 ring-amber-400/50 shadow-amber-400/40 scale-110'
                : isSelected
                ? 'bg-nrby-400 text-surface-950 scale-110 ring-4 ring-nrby-500/40 shadow-nrby-500/50'
                : 'bg-surface-900 text-nrby-400 border border-nrby-500/50 hover:bg-nrby-500 hover:text-surface-950 hover:scale-105 shadow-black/40'
            }`}
          >
            <MapPin className="w-3 h-5 fill-current" />
          </div>

          {/* Pequeño puntero en la base del pin - Al hacer clic se activa la posibilidad de moverlo */}
          <div
            onClick={handlePointerClick}
            title={isDraggable ? 'Click to disable moving' : 'Click base pointer to move pin'}
            className={`w-2.5 h-2.5 mx-auto -mt-1 rotate-45 transition-all cursor-pointer ${
              isDraggable
                ? 'bg-amber-400 ring-4 ring-amber-400/60 scale-125 shadow-lg shadow-amber-400/60 animate-pulse'
                : isSelected
                ? 'bg-nrby-400 hover:scale-125'
                : 'bg-surface-900 group-hover:bg-nrby-500 hover:scale-125'
            }`}
          />
        </div>
      </AdvancedMarker>

      {/* InfoWindow emergente con detalles del Smartpin cuando está seleccionado y NO está en modo arrastre */}
      {isSelected && !isDraggable && (
        <InfoWindow
          position={pin.position}
          onCloseClick={() => setSelectedSmartpinId(null)}
          pixelOffset={[0, -38]}
        >
          <div className="p-1 max-w-65 text-surface-900 font-sans select-none">
            {/* Cabecera del InfoWindow */}
            <div className="flex items-center justify-between gap-2 border-b border-surface-200 pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-nrby-500 shrink-0" />
                <h4 className="font-semibold text-xs text-surface-900 tracking-tight truncate">
                  {pin.name}
                </h4>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
              >
                {pin.status.replace('_', ' ')}
              </span>
            </div>

            {/* Detalles de la jurisdicción padre */}
            <div className="space-y-1.5 text-[11px] text-surface-600 mb-3">
              {jurisdiction && (
                <div className="flex items-center gap-1.5 text-surface-700">
                  <Shield className="w-3.5 h-3.5 text-nrby-600 shrink-0" />
                  <span className="truncate font-medium">{jurisdiction.name}</span>
                </div>
              )}

              {pin.assignedTo && (
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                  <span>{pin.assignedTo}</span>
                </div>
              )}

              {pin.description && (
                <p className="text-[11px] text-surface-500 italic leading-snug">
                  &quot;{pin.description}&quot;
                </p>
              )}

              <div className="flex items-center gap-1.5 text-[10px] text-surface-400">
                <Calendar className="w-3 h-3" />
                <span>{new Date(pin.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Acciones: Editar y Eliminar */}
            <div className="pt-2 border-t border-surface-100 flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditModalOpen(true);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-nrby-600 hover:text-nrby-700 hover:bg-nrby-50 px-2 py-1 rounded transition-colors cursor-pointer"
              >
                <span>Edit Details</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSmartpin(pin.id);
                  setSelectedSmartpinId(null);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-danger-500 hover:text-danger-600 hover:bg-danger-500/10 px-2 py-1 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Pin</span>
              </button>
            </div>
          </div>
        </InfoWindow>
      )}

      {/* Modal para editar el nombre y propiedades del Smartpin */}
      <SmartpinModal
        isOpen={isEditModalOpen}
        isEditing={true}
        initialData={{
          name: pin.name,
          description: pin.description,
          status: pin.status,
          assignedTo: pin.assignedTo,
        }}
        onSave={handleSaveEdit}
        onCancel={() => setIsEditModalOpen(false)}
      />
    </>
  );
};
