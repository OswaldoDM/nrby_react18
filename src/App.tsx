import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { DashboardLayout } from '@/components/layout';
import { MapView, GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from '@/components/map';

/**
 * Componente raíz de la aplicación Nrby.
 * Envuelve el DashboardLayout con <APIProvider> para que tanto el Sidebar
 * como el MapView y todos sus componentes hijos tengan acceso a useMap().
 */
const App: React.FC = () => {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={GOOGLE_MAPS_LIBRARIES}>
      <DashboardLayout>     
        <MapView />
      </DashboardLayout>
    </APIProvider>
  );
};

export default App;
