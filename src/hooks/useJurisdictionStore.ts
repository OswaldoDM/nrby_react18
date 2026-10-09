import { create } from 'zustand';
import type { Jurisdiction } from '@/types';

// Paleta de colores atractiva para distinguir diferentes jurisdicciones en el mapa
export const JURISDICTION_COLORS = [
  '#2DD4A8', // Verde teal Nrby principal
  '#38BDF8', // Azul cielo
  '#A855F7', // Púrpura eléctrico
  '#F59E0B', // Ámbar dorado
  '#EC4899', // Rosa vibrante
  '#10B981', // Esmeralda
];

// Jurisdicciones iniciales de ejemplo en Estados Unidos para visualización inmediata
const INITIAL_JURISDICTIONS: Jurisdiction[] = [
  {
    id: 'jur-texas-01',
    name: 'Texas Energy & Telecom Corridor',
    description: 'Central operations district for regional network infrastructure and fiber grids.',
    color: '#2DD4A8',
    fillOpacity: 0.25,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    paths: [
      { lat: 32.7767, lng: -96.7970 }, // Dallas
      { lat: 30.2672, lng: -97.7431 }, // Austin
      { lat: 29.7604, lng: -95.3698 }, // Houston
      { lat: 31.5493, lng: -97.1467 }, // Waco
    ],
  },
  {
    id: 'jur-colorado-02',
    name: 'Colorado Mountain Field Sector',
    description: 'Rocky Mountain high-altitude relay towers and critical monitoring territory.',
    color: '#38BDF8',
    fillOpacity: 0.25,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    paths: [
      { lat: 40.0150, lng: -105.2705 }, // Boulder
      { lat: 39.7392, lng: -104.9903 }, // Denver
      { lat: 38.8339, lng: -104.8214 }, // Colorado Springs
      { lat: 39.1911, lng: -106.8175 }, // Aspen
    ],
  },
];

interface JurisdictionState {
  // Lista de todas las jurisdicciones definidas
  jurisdictions: Jurisdiction[];

  // Acciones para crear, actualizar y remover jurisdicciones
  addJurisdiction: (jurisdiction: Jurisdiction) => void;
  removeJurisdiction: (id: string) => void;
  updateJurisdiction: (id: string, updates: Partial<Jurisdiction>) => void;
  getJurisdictionById: (id: string) => Jurisdiction | undefined;
}

/**
 * Store de Zustand para la gestión de Jurisdicciones (polígonos territoriales).
 */
export const useJurisdictionStore = create<JurisdictionState>((set, get) => ({
  jurisdictions: INITIAL_JURISDICTIONS,

  addJurisdiction: (jurisdiction: Jurisdiction) =>
    set((state) => ({
      jurisdictions: [jurisdiction, ...state.jurisdictions],
    })),

  removeJurisdiction: (id: string) =>
    set((state) => ({
      jurisdictions: state.jurisdictions.filter((j) => j.id !== id),
    })),

  updateJurisdiction: (id: string, updates: Partial<Jurisdiction>) =>
    set((state) => ({
      jurisdictions: state.jurisdictions.map((j) =>
        j.id === id ? { ...j, ...updates } : j
      ),
    })),

  getJurisdictionById: (id: string) => {
    return get().jurisdictions.find((j) => j.id === id);
  },
}));
