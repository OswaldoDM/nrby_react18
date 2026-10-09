import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  MapPin,
  Shield,
  Plus,
  Sparkles,
  Trash2,
  Navigation,
  Eye,
} from 'lucide-react';
import { useLayoutStore } from '@/hooks/useLayoutStore';
import { useMapStore } from '@/hooks/useMapStore';
import { useJurisdictionStore } from '@/hooks/useJurisdictionStore';
import { useSmartpinStore } from '@/hooks/useSmartpinStore';
import { useMap } from '@vis.gl/react-google-maps';
import { Button, IconButton, Tooltip } from '@/components/ui';
import type { SidebarItem, Jurisdiction, Smartpin } from '@/types';

/**
 * Componente Sidebar colapsable con animaciones fluidas y soporte completo
 * para visualización interactiva de Jurisdictions y Smartpins.
 */
export const Sidebar: React.FC = () => {
  const map = useMap('nrby-main-map');

  // Stores globales de Zustand
  const { isSidebarOpen, toggleSidebar, activeTab, setActiveTab } = useLayoutStore();
  const {
    drawingMode,
    setDrawingMode,
    selectedJurisdictionId,
    setSelectedJurisdictionId,
    selectedSmartpinId,
    setSelectedSmartpinId,
    setStatusMessage,
    resetView,
  } = useMapStore();
  const { jurisdictions, removeJurisdiction } = useJurisdictionStore();
  const { smartpins, removeSmartpin, removeSmartpinsByJurisdiction } = useSmartpinStore();

  // Lista de elementos de navegación con badges dinámicos
  const navItems: SidebarItem[] = [
    {
      id: 'jurisdictions',
      label: 'Jurisdictions',
      icon: <Layers className="w-5 h-5" />,
      badge: jurisdictions.length.toString(),
    },
    {
      id: 'smartpins',
      label: 'Smartpins',
      icon: <MapPin className="w-5 h-5" />,
      badge: smartpins.length.toString(),
    },
    {
      id: 'overview',
      label: 'Overview',
      icon: <Shield className="w-5 h-5" />,
    },
  ];

  // Función para enfocar la cámara en una jurisdicción específica
  const handleFocusJurisdiction = (j: Jurisdiction, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedJurisdictionId(j.id);
    setStatusMessage(`Focusing Jurisdiction "${j.name}"`);

    if (map && window.google?.maps) {
      const bounds = new window.google.maps.LatLngBounds();
      j.paths.forEach((coord) => {
        bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
      });
      map.fitBounds(bounds, 80);
    }
  };

  // Función para eliminar una jurisdicción y sus pines asociados
  const handleDeleteJurisdiction = (j: Jurisdiction, e: React.MouseEvent) => {
    e.stopPropagation();
    removeJurisdiction(j.id);
    removeSmartpinsByJurisdiction(j.id);
    if (selectedJurisdictionId === j.id) {
      setSelectedJurisdictionId(null);
    }
    setStatusMessage(`Deleted Jurisdiction "${j.name}" and associated pins.`);
  };

  // Función para enfocar la cámara en un Smartpin específico
  const handleFocusSmartpin = (pin: Smartpin, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedSmartpinId(pin.id);
    setSelectedJurisdictionId(pin.jurisdictionId);
    setStatusMessage(`Focusing Smartpin "${pin.name}"`);

    if (map) {
      map.panTo(pin.position);
      map.setZoom(11);
    }
  };

  // Función para eliminar un Smartpin
  const handleDeleteSmartpin = (pin: Smartpin, e: React.MouseEvent) => {
    e.stopPropagation();
    removeSmartpin(pin.id);
    if (selectedSmartpinId === pin.id) {
      setSelectedSmartpinId(null);
    }
    setStatusMessage(`Deleted Smartpin "${pin.name}".`);
  };

  return (
    <aside
      className={`relative h-full bg-surface-900 border-r border-surface-800/80 flex flex-col z-20 select-none transition-all duration-300 ease-in-out shrink-0 ${
        isSidebarOpen ? 'w-72' : 'w-16'
      }`}
    >
      {/* Botón flotante para alternar colapsado/expandido en el borde */}
      <div className="absolute -right-3.5 top-5 z-30">
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="w-7 h-7 rounded-full bg-surface-800 hover:bg-surface-700 text-surface-200 hover:text-nrby-400 border border-surface-700 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-nrby-500"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-4 h-4 transition-transform duration-200" />
          ) : (
            <ChevronRight className="w-4 h-4 transition-transform duration-200" />
          )}
        </button>
      </div>

      {/* Cabecera del Sidebar */}
      <div className="h-14 px-3 flex items-center border-b border-surface-800/80 overflow-hidden shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-nrby-500/20 to-nrby-500/5 border border-nrby-500/30 flex items-center justify-center text-nrby-400 shrink-0">
            <Sparkles className="w-4 h-4 text-nrby-400" />
          </div>

          <div
            className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${
              isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
            }`}
          >
            <h2 className="text-sm font-semibold text-surface-100 tracking-tight">Workspace</h2>
            <p className="text-[11px] text-surface-400">Map Management</p>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación */}
      <nav className="p-2 space-y-1 border-b border-surface-800/80 shrink-0">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const buttonContent = (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-nrby-500/15 text-nrby-400 border border-nrby-500/30 shadow-sm'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/60 border border-transparent'
              }`}
            >
              <span className={`shrink-0 ${isActive ? 'text-nrby-400' : 'text-surface-400'}`}>
                {item.icon}
              </span>

              <div
                className={`flex-1 flex items-center justify-between overflow-hidden whitespace-nowrap transition-all duration-200 ${
                  isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 pointer-events-none'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-nrby-500/20 text-nrby-300 font-semibold' : 'bg-surface-800 text-surface-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );

          return !isSidebarOpen ? (
            <Tooltip key={item.id} content={item.label} position="right">
              {buttonContent}
            </Tooltip>
          ) : (
            <React.Fragment key={item.id}>{buttonContent}</React.Fragment>
          );
        })}
      </nav>

      {/* Botones de acción rápida */}
      <div className="p-2 border-b border-surface-800/80 shrink-0">
        {isSidebarOpen ? (
          <div className="space-y-2">
            <Button
              variant={drawingMode === 'jurisdiction' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setDrawingMode(drawingMode === 'jurisdiction' ? 'none' : 'jurisdiction')}
              className={`w-full justify-start text-xs font-semibold ${
                drawingMode === 'jurisdiction' ? 'ring-2 ring-nrby-400/50' : ''
              }`}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              {drawingMode === 'jurisdiction' ? 'Cancel Drawing' : 'Draw Jurisdiction'}
            </Button>
            <Button
              variant={drawingMode === 'smartpin' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setDrawingMode(drawingMode === 'smartpin' ? 'none' : 'smartpin')}
              className={`w-full justify-start text-xs ${
                drawingMode === 'smartpin' ? 'ring-2 ring-emerald-400/50' : ''
              }`}
              leftIcon={<MapPin className="w-3.5 h-3.5 text-nrby-400" />}
            >
              {drawingMode === 'smartpin' ? 'Cancel Pinning' : 'Add Smartpin'}
            </Button>
          </div>
        ) : (
          <div className="space-y-1.5 flex flex-col items-center">
            <Tooltip content={drawingMode === 'jurisdiction' ? 'Cancel Drawing' : 'Draw Jurisdiction'} position="right">
              <IconButton
                aria-label="Draw Jurisdiction"
                onClick={() => setDrawingMode(drawingMode === 'jurisdiction' ? 'none' : 'jurisdiction')}
                icon={<Plus className="w-4 h-4" />}
                variant={drawingMode === 'jurisdiction' ? 'primary' : 'ghost'}
                size="sm"
              />
            </Tooltip>
            <Tooltip content={drawingMode === 'smartpin' ? 'Cancel Pinning' : 'Add Smartpin'} position="right">
              <IconButton
                aria-label="Add Smartpin"
                onClick={() => setDrawingMode(drawingMode === 'smartpin' ? 'none' : 'smartpin')}
                icon={<MapPin className="w-4 h-4" />}
                variant={drawingMode === 'smartpin' ? 'primary' : 'ghost'}
                size="sm"
              />
            </Tooltip>
          </div>
        )}
      </div>

      {/* Contenido dinámico principal de la lista según pestaña activa */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-2">
        {isSidebarOpen ? (
          <div className="h-full flex flex-col">
            {/* Pestaña: JURISDICTIONS */}
            {activeTab === 'jurisdictions' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-surface-300 font-medium text-xs px-1">
                  <span>Defined Jurisdictions</span>
                  <span className="text-[11px] text-surface-500">{jurisdictions.length} zones</span>
                </div>

                {jurisdictions.length === 0 ? (
                  <div className="p-4 rounded-xl bg-surface-850/60 border border-surface-800/80 text-center space-y-2">
                    <Layers className="w-6 h-6 text-surface-500 mx-auto opacity-60" />
                    <p className="text-[11px] text-surface-400">
                      No jurisdictions defined. Click &quot;Draw Jurisdiction&quot; to trace polygons on the map.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {jurisdictions.map((j) => {
                      const isSelected = selectedJurisdictionId === j.id;
                      const associatedPins = smartpins.filter((p) => p.jurisdictionId === j.id);

                      return (
                        <div
                          key={j.id}
                          onClick={() => handleFocusJurisdiction(j)}
                          className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer group ${
                            isSelected
                              ? 'bg-surface-850 border-nrby-500/60 shadow-lg shadow-nrby-500/10'
                              : 'bg-surface-850/60 hover:bg-surface-850 border-surface-800 hover:border-surface-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                style={{ backgroundColor: j.color }}
                                className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                              />
                              <h4 className="text-xs font-semibold text-surface-100 truncate group-hover:text-nrby-300 transition-colors">
                                {j.name}
                              </h4>
                            </div>

                            {/* Acciones para cada jurisdicción */}
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                              <button
                                onClick={(e) => handleFocusJurisdiction(j, e)}
                                title="Center on map"
                                className="p-1 rounded hover:bg-surface-700 text-surface-400 hover:text-nrby-400 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteJurisdiction(j, e)}
                                title="Delete jurisdiction"
                                className="p-1 rounded hover:bg-danger-500/20 text-surface-400 hover:text-danger-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {j.description && (
                            <p className="text-[11px] text-surface-400 line-clamp-2 mt-1 pl-5">
                              {j.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-surface-500 mt-2 pl-5 pt-1.5 border-t border-surface-800/60">
                            <span>{j.paths.length} vertices</span>
                            <span className="font-mono text-nrby-400">
                              {associatedPins.length} pins
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Pestaña: SMARTPINS */}
            {activeTab === 'smartpins' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-surface-300 font-medium text-xs px-1">
                  <span>Placed Smartpins</span>
                  <span className="text-[11px] text-surface-500">{smartpins.length} pins</span>
                </div>

                {smartpins.length === 0 ? (
                  <div className="p-4 rounded-xl bg-surface-850/60 border border-surface-800/80 text-center space-y-2">
                    <MapPin className="w-6 h-6 text-surface-500 mx-auto opacity-60" />
                    <p className="text-[11px] text-surface-400">
                      No smartpins placed yet. Click &quot;Add Smartpin&quot; and drop pins inside any jurisdiction.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {smartpins.map((pin) => {
                      const isSelected = selectedSmartpinId === pin.id;
                      const parentJur = jurisdictions.find((j) => j.id === pin.jurisdictionId);

                      return (
                        <div
                          key={pin.id}
                          onClick={() => handleFocusSmartpin(pin)}
                          className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer group ${
                            isSelected
                              ? 'bg-surface-850 border-emerald-400/60 shadow-lg shadow-emerald-400/10'
                              : 'bg-surface-850/60 hover:bg-surface-850 border-surface-800 hover:border-surface-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <MapPin className="w-3.5 h-3.5 text-nrby-400 shrink-0 fill-nrby-400/20" />
                              <h4 className="text-xs font-semibold text-surface-100 truncate group-hover:text-emerald-300 transition-colors">
                                {pin.name}
                              </h4>
                            </div>

                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                              <button
                                onClick={(e) => handleFocusSmartpin(pin, e)}
                                title="Zoom to pin"
                                className="p-1 rounded hover:bg-surface-700 text-surface-400 hover:text-emerald-400 transition-colors"
                              >
                                <Navigation className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteSmartpin(pin, e)}
                                title="Delete pin"
                                className="p-1 rounded hover:bg-danger-500/20 text-surface-400 hover:text-danger-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {parentJur && (
                            <div className="flex items-center gap-1.5 text-[10px] text-surface-400 mt-1 pl-5 truncate">
                              <span
                                style={{ backgroundColor: parentJur.color }}
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                              />
                              <span className="truncate">{parentJur.name}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-surface-500 mt-2 pl-5 pt-1.5 border-t border-surface-800/60">
                            <span className="capitalize font-medium text-emerald-400">
                              {pin.status.replace('_', ' ')}
                            </span>
                            <span className="font-mono">
                              {pin.position.lat.toFixed(2)}°, {pin.position.lng.toFixed(2)}°
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Pestaña: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-3 text-xs">
                <div className="text-surface-300 font-medium px-1">Operations Overview</div>

                {/* Métricas destacadas en tarjetas */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-surface-850/80 border border-surface-800 space-y-1">
                    <span className="text-[10px] text-surface-400 uppercase font-semibold">Jurisdictions</span>
                    <p className="text-xl font-bold text-white font-mono">{jurisdictions.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-850/80 border border-surface-800 space-y-1">
                    <span className="text-[10px] text-surface-400 uppercase font-semibold">Smartpins</span>
                    <p className="text-xl font-bold text-nrby-400 font-mono">{smartpins.length}</p>
                  </div>
                </div>

                {/* Desglose por estados */}
                <div className="p-3 rounded-xl bg-surface-850/80 border border-surface-800 space-y-2">
                  <span className="text-[11px] font-semibold text-surface-300">Status Distribution</span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-surface-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Active Pins</span>
                      </span>
                      <span className="font-mono font-medium text-surface-200">
                        {smartpins.filter((p) => p.status === 'active').length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-surface-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>In Progress</span>
                      </span>
                      <span className="font-mono font-medium text-surface-200">
                        {smartpins.filter((p) => p.status === 'in_progress').length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón rápido para restaurar vista completa de USA */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => resetView()}
                >
                  Reset Map Camera (USA)
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Mini vista cuando el sidebar está colapsado */
          <div className="flex flex-col items-center gap-3 pt-2 text-surface-600">
            <Tooltip content={`${jurisdictions.length} Jurisdictions`} position="right">
              <div className="w-8 h-8 rounded-lg bg-surface-850 border border-surface-800 flex items-center justify-center text-xs font-mono text-nrby-400 cursor-pointer">
                {jurisdictions.length}
              </div>
            </Tooltip>
            <Tooltip content={`${smartpins.length} Smartpins`} position="right">
              <div className="w-8 h-8 rounded-lg bg-surface-850 border border-surface-800 flex items-center justify-center text-xs font-mono text-emerald-400 cursor-pointer">
                {smartpins.length}
              </div>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Pie del Sidebar */}
      <div className="p-2.5 border-t border-surface-800/80 bg-surface-950/40 shrink-0">
        {isSidebarOpen ? (
          <div className="flex items-center justify-between text-[11px] text-surface-400 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-nrby-500" />
              <span>Nrby Operations</span>
            </span>
            {/* <span className="text-[10px] text-surface-500 font-mono">React 18</span> */}
          </div>
        ) : (
          <div className="flex justify-center">
            <Tooltip content="Nrby Operations Active" position="right">
              <span className="w-2 h-2 rounded-full bg-nrby-500 animate-pulse" />
            </Tooltip>
          </div>
        )}
      </div>
    </aside>
  );
};
