
// Clave API pública de Google Maps provista para el proyecto
export const GOOGLE_MAPS_API_KEY = 'AIzaSyBrSqoOv4YXd3eooVTZYIlyGUIKeXqbYqc';

// Identificador de mapa para habilitar funcionalidades modernas como AdvancedMarker
export const GOOGLE_MAP_ID = 'nrby-dashboard-map';

// Coordenadas geográficas centradas en Estados Unidos continental
export const US_DEFAULT_CENTER = {
  lat: 39.8283,
  lng: -98.5795,
};

// Nivel de zoom inicial que abarca todo el país
export const US_DEFAULT_ZOOM = 4;

// Librerías de Google Maps necesarias (geometry para contención matemática, marker para smartpins)
export const GOOGLE_MAPS_LIBRARIES: Array<'geometry' | 'marker' | 'places'> = [
  'geometry',
  'marker',
];
