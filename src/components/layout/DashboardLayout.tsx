import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export interface DashboardLayoutProps {
  // Contenido principal a renderizar en el área central (por ejemplo, el mapa)
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {  
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-surface-950 select-none">      
      <Navbar />

      {/* Contenedor horizontal que alberga el Sidebar y el mapa central */}
      <div className="flex-1 flex overflow-hidden relative">
        
        <Sidebar />

        {/* Área central principal de visualización del mapa */}
        <main className="flex-1 h-full relative overflow-hidden bg-surface-950 flex flex-col">
          {children}
        </main>

      </div>
    </div>
  );
};
