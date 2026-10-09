import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useMap, useMapsLibrary, Polyline, Polygon, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useMapStore } from '@/hooks/useMapStore';
import { useJurisdictionStore } from '@/hooks/useJurisdictionStore';
import { useSmartpinStore } from '@/hooks/useSmartpinStore';
import { NewJurisdictionModal } from './NewJurisdictionModal';
import { SmartpinModal, type SmartpinFormData } from './SmartpinModal';
import { Button } from '@/components/ui';
import type { Coordinate, Jurisdiction, Smartpin } from '@/types';
import { Check, RotateCcw, X, Layers } from 'lucide-react';

/**
   Controlador de dibujo interactivo de Jurisdicciones y colocación de Smartpins.

 * No depende de la librería obsoleta 'drawing' de Google Maps, ofreciendo una
   experiencia reactiva, fluida y con vista previa en tiempo real.
 
 * Uses refs for frequently-changing values (jurisdictions, smartpins, vertices)
   so that Google Maps event listeners are NOT re-registered on every state change.

 * State updates from within map listeners are deferred with queueMicrotask to
   avoid the "setState synchronously within an effect" React warning.
*/
export const DrawingManager: React.FC = () => {
  const map = useMap('nrby-main-map');
  const geometryLib = useMapsLibrary('geometry');

  const {
    drawingMode,
    setDrawingMode,
    setSelectedJurisdictionId,
    setSelectedSmartpinId,
    setStatusMessage,
  } = useMapStore();

  const { jurisdictions, addJurisdiction } = useJurisdictionStore();
  const { smartpins, addSmartpin } = useSmartpinStore();

  // Vértices del polígono que se está trazando activamente
  const [activeVertices, setActiveVertices] = useState<Coordinate[]>([]);

  // Vértices listos para guardar en el modal
  const [pendingPolygonPaths, setPendingPolygonPaths] = useState<Coordinate[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Smartpin pendiente de nombrar y guardar en el modal
  const [pendingSmartpin, setPendingSmartpin] = useState<{
    position: Coordinate;
    jurisdiction: Jurisdiction;
  } | null>(null);
  const [isSmartpinModalOpen, setIsSmartpinModalOpen] = useState(false);

  // ─── Refs to hold mutable snapshots for stable event listeners ───
  const activeVerticesRef = useRef<Coordinate[]>(activeVertices);
  const jurisdictionsRef = useRef(jurisdictions);
  const smartpinsRef = useRef(smartpins);
  const rubberBandRef = useRef<google.maps.Polyline | null>(null);

  // Sync refs after render (refs must not be written during render in React strict mode)
  useEffect(() => { activeVerticesRef.current = activeVertices; }, [activeVertices]);
  useEffect(() => { jurisdictionsRef.current = jurisdictions; }, [jurisdictions]);
  useEffect(() => { smartpinsRef.current = smartpins; }, [smartpins]);

  // Funcion para finalizar el polígono activo y abrir el modal para guardarlo
  const finishCurrentPolygon = useCallback(() => {
    const verts = activeVerticesRef.current;
    if (verts.length < 3) {
      queueMicrotask(() =>
        setStatusMessage('⚠️ A jurisdiction requires at least 3 points. Click more locations on the map.')
      );
      return;
    }
    if (rubberBandRef.current) {
      rubberBandRef.current.setVisible(false);
      rubberBandRef.current.setPath([]);
    }
    setPendingPolygonPaths([...verts]);
    setIsModalOpen(true);
    setActiveVertices([]);
  }, [setStatusMessage]);

  // Ref estable para finishCurrentPolygon (evita re-registrar listeners)
  const finishRef = useRef(finishCurrentPolygon);
  useEffect(() => { finishRef.current = finishCurrentPolygon; }, [finishCurrentPolygon]);

  // Funcion para deshacer el último punto colocado
  const handleUndoPoint = () => {
    setActiveVertices((prev) => {
      const next = prev.slice(0, -1);
      if (next.length === 0 && rubberBandRef.current) {
        rubberBandRef.current.setVisible(false);
        rubberBandRef.current.setPath([]);
      }
      return next;
    });
  };

  // Funcion para Cancelar el trazado
  const handleCancelDrawing = () => {
    if (rubberBandRef.current) {
      rubberBandRef.current.setVisible(false);
      rubberBandRef.current.setPath([]);
    }
    setActiveVertices([]);
    setDrawingMode('none');
    setStatusMessage(null);
  }; 


  // 1. Manejo del modo de dibujo de Jurisdicciones (clics en el mapa)
  useEffect(() => {
    if (!map) return;

    if (drawingMode === 'jurisdiction') {
      map.setOptions({ draggableCursor: 'crosshair' });
      // Defer the status message so it doesn't cascade during commit phase
      queueMicrotask(() =>
        setStatusMessage('Click on the map to place polygon vertices. Click "Finish Polygon" when done.')
      );

      // Línea elástica (rubber-band) temporal nativa para máxima fluidez a 60fps
      const rubberBand = new google.maps.Polyline({
        map,
        strokeColor: '#2DD4A8',
        strokeOpacity: 0.65,
        strokeWeight: 2,
        clickable: false,
        visible: false,
        zIndex: 10,
      });
      rubberBandRef.current = rubberBand;

      const clickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const newCoord: Coordinate = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setActiveVertices((prev) => [...prev, newCoord]);
        rubberBand.setVisible(false);
      });

      const moveListener = map.addListener('mousemove', (e: google.maps.MapMouseEvent) => {
        const verts = activeVerticesRef.current;
        if (!e.latLng || verts.length === 0) {
          rubberBand.setVisible(false);
          return;
        }
        const lastVertex = verts[verts.length - 1];
        rubberBand.setPath([lastVertex, { lat: e.latLng.lat(), lng: e.latLng.lng() }]);
        rubberBand.setVisible(true);
      });

      const mouseOutListener = map.addListener('mouseout', () => {
        rubberBand.setVisible(false);
      });

      const dblClickListener = map.addListener('dblclick', (e: google.maps.MapMouseEvent) => {
        e.stop(); // Previene el zoom default de doble clic
        if (activeVerticesRef.current.length >= 2) {
          finishRef.current();
        }
      });

      return () => {
        clickListener.remove();
        moveListener.remove();
        mouseOutListener.remove();
        dblClickListener.remove();
        rubberBand.setMap(null);
        rubberBandRef.current = null;
        map.setOptions({ draggableCursor: null });
      };
    } else {
      map.setOptions({ draggableCursor: null });
      if (rubberBandRef.current) {
        rubberBandRef.current.setVisible(false);
        rubberBandRef.current.setMap(null);
        rubberBandRef.current = null;
      }
      // Defer clearing vertices to avoid cascading setState in effect body
      queueMicrotask(() => setActiveVertices([]));
    }
    // NOTE: Only re-run when map instance or drawingMode changes.
    // activeVertices are read via ref inside handlers, so NOT a dependency.
  }, [map, drawingMode, setStatusMessage]);



  // 2. Manejo de la colocación de Smartpins con validación geométrica
  useEffect(() => {
    if (!map || drawingMode !== 'smartpin' || !geometryLib) return;

    map.setOptions({ draggableCursor: 'copy' });
    // Defer status message to avoid synchronous setState in effect body
    queueMicrotask(() =>
      setStatusMessage('Click inside any existing Jurisdiction polygon to place a Smartpin.')
    );

    const clickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const clickPoint = e.latLng;
      let targetJurisdiction: Jurisdiction | null = null;

      // Read current jurisdictions from ref (stable, no re-registration needed)
      const currentJurisdictions = jurisdictionsRef.current;

      // Validación geométrica de contención territorial
      const polyLib = geometryLib?.poly || window.google?.maps?.geometry?.poly;
      for (const j of currentJurisdictions) {
        const tempPoly = new google.maps.Polygon({ paths: j.paths });
        if (polyLib && polyLib.containsLocation(clickPoint, tempPoly)) {
          targetJurisdiction = j;
          break;
        }
      }

      if (targetJurisdiction) {
        const savedJurisdiction = targetJurisdiction;
        const clickCoord: Coordinate = { lat: clickPoint.lat(), lng: clickPoint.lng() };

        // Abrir modal para configurar el nombre y detalles del Smartpin
        queueMicrotask(() => {
          setPendingSmartpin({
            position: clickCoord,
            jurisdiction: savedJurisdiction,
          });
          setIsSmartpinModalOpen(true);
          setDrawingMode('none');
          setStatusMessage(`Enter details for the new Smartpin in "${savedJurisdiction.name}".`);
        });
      } else {
        queueMicrotask(() =>
          setStatusMessage('⚠️ Smartpins can only be placed inside an existing Jurisdiction! Click within a highlighted territory.')
        );
      }
    });

    return () => {
      clickListener.remove();
      map.setOptions({ draggableCursor: null });
    };
    // NOTE: jurisdictions and smartpins are read via refs, so NOT dependencies.
    // Only re-register when the map instance, drawingMode, or geometryLib changes.
  }, [
    map,
    drawingMode,
    geometryLib,
    addSmartpin,
    setDrawingMode,
    setSelectedSmartpinId,
    setSelectedJurisdictionId,
    setStatusMessage,
  ]);

  // Funcion para guardar la jurisdicción tras completar el modal
  const handleSaveJurisdiction = (name: string, description: string, color: string) => {
    if (!pendingPolygonPaths) return;

    const newJurisdiction: Jurisdiction = {
      id: `jur-${Date.now()}`,
      name,
      description,
      color,
      fillOpacity: 0.28,
      paths: pendingPolygonPaths,
      createdAt: new Date().toISOString(),
    };

    addJurisdiction(newJurisdiction);
    setSelectedJurisdictionId(newJurisdiction.id);
    setPendingPolygonPaths(null);
    setIsModalOpen(false);
    setDrawingMode('none');
    setStatusMessage(`Jurisdiction "${newJurisdiction.name}" created successfully!`);
  };

  // Funcion para cancelar la jurisdicción y cerrar el modal
  const handleCancelModal = () => {
    setPendingPolygonPaths(null);
    setIsModalOpen(false);
    setDrawingMode('none');
    setStatusMessage(null);
  };

  // Funcion para guardar el Smartpin tras completar el modal
  const handleSaveSmartpin = (data: SmartpinFormData) => {
    if (!pendingSmartpin) return;

    const currentSmartpins = smartpinsRef.current;
    const newPin: Smartpin = {
      id: `pin-${Date.now()}`,
      name: data.name || `Smartpin #${currentSmartpins.length + 1}`,
      position: pendingSmartpin.position,
      jurisdictionId: pendingSmartpin.jurisdiction.id,
      status: data.status,
      description: data.description || `Field node assigned to ${pendingSmartpin.jurisdiction.name}.`,
      assignedTo: data.assignedTo || undefined,
      createdAt: new Date().toISOString(),
    };

    addSmartpin(newPin);
    setSelectedSmartpinId(newPin.id);
    setSelectedJurisdictionId(pendingSmartpin.jurisdiction.id);
    setIsSmartpinModalOpen(false);
    setPendingSmartpin(null);
    setStatusMessage(`Smartpin "${newPin.name}" created successfully inside "${pendingSmartpin.jurisdiction.name}"!`);
  };

  // Funcion para cancelar la colocación del Smartpin y cerrar el modal
  const handleCancelSmartpinModal = () => {
    setIsSmartpinModalOpen(false);
    setPendingSmartpin(null);
    setStatusMessage(null);
  };

  return (
    <>
      {/* Vista previa en vivo del polígono en proceso de trazado */}
      {drawingMode === 'jurisdiction' && activeVertices.length > 0 && (
        <>
          {/* Línea que conecta los puntos */}
          {activeVertices.length >= 2 && (
            <Polyline
              path={activeVertices}
              strokeColor="#2DD4A8"
              strokeOpacity={0.9}
              strokeWeight={3}
            />
          )}

          {/* Relleno semi-transparente cuando hay al menos 3 vértices */}
          {activeVertices.length >= 3 && (
            <Polygon
              paths={activeVertices}
              strokeColor="#2DD4A8"
              strokeOpacity={0.4}
              strokeWeight={1}
              fillColor="#2DD4A8"
              fillOpacity={0.2}
            />
          )}

          {/* Marcadores circulares para cada vértice dibujado */}
          {activeVertices.map((vertex, index) => (
            <AdvancedMarker
              key={`vertex-${index}`}
              position={vertex}
              onClick={() => {
                // Hacer clic en el primer punto cierra el polígono si hay >= 3 vértices
                if (index === 0 && activeVerticesRef.current.length >= 3) {
                  finishRef.current();
                }
              }}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-125 ${
                  index === 0 ? 'bg-amber-400 ring-2 ring-amber-400/50' : 'bg-nrby-500'
                }`}
                title={index === 0 && activeVertices.length >= 3 ? 'Click to close polygon' : `Vertex ${index + 1}`}
              />
            </AdvancedMarker>
          ))}
        </>
      )}

      {/* Barra de herramientas flotante superior durante el modo de dibujo */}
      {drawingMode === 'jurisdiction' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-2xl bg-surface-900/95 border border-nrby-500/50 shadow-2xl backdrop-blur-md flex items-center gap-3">
          <div className="flex items-center gap-2 pr-3 border-r border-surface-800">
            <Layers className="w-4 h-4 text-nrby-400" />
            <span className="text-xs font-semibold text-white whitespace-nowrap">
              Tracing Jurisdiction:
            </span>
            <span className="text-xs font-mono font-bold text-nrby-400 bg-surface-850 px-2 py-0.5 rounded-md border border-surface-700">
              {activeVertices.length} {activeVertices.length === 1 ? 'point' : 'points'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Deshacer punto */}
            <Button
              variant="ghost"
              size="sm"
              disabled={activeVertices.length === 0}
              onClick={handleUndoPoint}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs text-surface-300 hover:text-white"
            >
              Undo Point
            </Button>

            {/* Completar polígono */}
            <Button
              variant="primary"
              size="sm"
              disabled={activeVertices.length < 3}
              onClick={finishCurrentPolygon}
              leftIcon={<Check className="w-3.5 h-3.5" />}
              className="text-xs font-semibold"
            >
              Finish Polygon
            </Button>

            {/* Cancelar */}
            <button
              onClick={handleCancelDrawing}
              title="Cancel drawing"
              className="p-1.5 rounded-lg text-surface-400 hover:text-danger-400 hover:bg-danger-500/10 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal para ingresar nombre y color de la jurisdicción */}
      <NewJurisdictionModal
        isOpen={isModalOpen}
        onSave={handleSaveJurisdiction}
        onCancel={handleCancelModal}
      />

      {/* Modal para ingresar nombre y detalles del Smartpin recién colocado */}
      <SmartpinModal
        isOpen={isSmartpinModalOpen}
        defaultSuggestedName={
          pendingSmartpin ? `Smartpin #${smartpins.length + 1}` : ''
        }
        onSave={handleSaveSmartpin}
        onCancel={handleCancelSmartpinModal}
      />
    </>
  );
};
