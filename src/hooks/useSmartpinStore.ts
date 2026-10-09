import { create } from 'zustand';
import type { Smartpin } from '@/types';

// Pines iniciales de ejemplo ubicados dentro de las jurisdicciones iniciales
const INITIAL_SMARTPINS: Smartpin[] = [
  {
    id: 'pin-tx-01',
    name: 'Waco Primary Hub Tower',
    jurisdictionId: 'jur-texas-01',
    position: { lat: 31.5493, lng: -97.1467 },
    status: 'active',
    description: 'Main microwave transmission node with battery backup.',
    assignedTo: 'Marcus Vance',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'pin-tx-02',
    name: 'Austin Fiber Repeater 4',
    jurisdictionId: 'jur-texas-01',
    position: { lat: 30.3500, lng: -97.6800 },
    status: 'in_progress',
    description: 'Scheduled maintenance for optical amplifier upgrade.',
    assignedTo: 'Elena Rostova',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'pin-co-01',
    name: 'Denver Central Switch Facility',
    jurisdictionId: 'jur-colorado-02',
    position: { lat: 39.7392, lng: -104.9903 },
    status: 'active',
    description: 'Tier-3 data gateway connecting mountain substations.',
    assignedTo: 'Sarah Jenkins',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

interface SmartpinState {
  // Lista de todos los smartpins colocados
  smartpins: Smartpin[];

  // Acciones
  addSmartpin: (smartpin: Smartpin) => void;
  removeSmartpin: (id: string) => void;
  updateSmartpin: (id: string, updates: Partial<Smartpin>) => void;
  removeSmartpinsByJurisdiction: (jurisdictionId: string) => void;
}

/**
 * Store de Zustand para gestionar los Smartpins colocados en el mapa.
 */
export const useSmartpinStore = create<SmartpinState>((set) => ({
  smartpins: INITIAL_SMARTPINS,

  addSmartpin: (smartpin: Smartpin) =>
    set((state) => ({
      smartpins: [smartpin, ...state.smartpins],
    })),

  removeSmartpin: (id: string) =>
    set((state) => ({
      smartpins: state.smartpins.filter((p) => p.id !== id),
    })),

  updateSmartpin: (id: string, updates: Partial<Smartpin>) =>
    set((state) => ({
      smartpins: state.smartpins.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  removeSmartpinsByJurisdiction: (jurisdictionId: string) =>
    set((state) => ({
      smartpins: state.smartpins.filter((p) => p.jurisdictionId !== jurisdictionId),
    })),
}));
