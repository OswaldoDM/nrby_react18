
// Coordenada geográfica estándar (latitud y longitud)
export interface Coordinate {
  lat: number;
  lng: number;
}

// Representa una jurisdicción o zona poligonal dibujada en el mapa
export interface Jurisdiction {
  id: string;
  name: string;
  paths: Coordinate[];
  color: string;
  fillOpacity?: number;
  createdAt: string;
  description?: string;
}

// Estado de un smartpin dentro de una jurisdicción
export type SmartpinStatus = 'active' | 'in_progress' | 'completed' | 'flagged';

// Representa un Smartpin asociado a una jurisdicción específica
export interface Smartpin {
  id: string;
  name: string;
  position: Coordinate;
  jurisdictionId: string;
  status: SmartpinStatus;
  description?: string;
  createdAt: string;
  assignedTo?: string;
}


// Pestañas activas disponibles en el Sidebar de navegación
export type SidebarTab = 'overview' | 'jurisdictions' | 'smartpins';

export interface SidebarItem { 
  id: SidebarTab; 
  label: string; 
  icon: React.ReactNode; 
  badge?: string 
};  

// Variantes de estilo para los componentes de botones
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

// Tamaños estandarizados para componentes de interacción
export type ComponentSize = 'sm' | 'md' | 'lg';


// Modos de interacción de dibujo y colocación en el mapa
export type DrawingMode = 'none' | 'jurisdiction' | 'smartpin';
