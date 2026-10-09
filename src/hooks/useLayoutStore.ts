import { create } from 'zustand';
import type { SidebarTab } from '@/types';

interface LayoutState {  
  isSidebarOpen: boolean; // Estado de visibilidad y expansión del sidebar lateral  
  activeTab: SidebarTab; // Pestaña actualmente activa en el panel lateral
  toggleSidebar: () => void; // Alterna entre expandir y colapsar el sidebar  
  setSidebarOpen: (isOpen: boolean) => void; // Establece explícitamente el estado del sidebar  
  setActiveTab: (tab: SidebarTab) => void; // Cambia la pestaña activa del sidebar
}

export const useLayoutStore = create<LayoutState>((set) => ({
  isSidebarOpen: true,
  activeTab: 'jurisdictions',

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarOpen: (isOpen: boolean) =>
    set({ isSidebarOpen: isOpen }),

  setActiveTab: (tab: SidebarTab) =>
    set({ activeTab: tab }),
}));
