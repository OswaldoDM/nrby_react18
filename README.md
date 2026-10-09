# 🌐 Nrby — Intelligent Geospatial Operations Dashboard

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Maps](https://img.shields.io/badge/@vis.gl/react--google--maps-1.10-4285F4?logo=google-maps&logoColor=white)](https://visgl.github.io/react-google-maps/)
[![Zustand](https://img.shields.io/badge/State-Zustand-443e38)](https://zustand-demo.pmnd.rs/)

**Nrby** is a modern geospatial web application designed for field operations, territory zoning, and asset tracking. It combines high-performance interactive mapping with intuitive management of operational **Jurisdictions** (polygonal territories) and **Smartpins** (field nodes and asset markers).

---

## ✨ Key Features

### 🗺️ Interactive Territory & Jurisdiction Drawing
- **Real-time Polygon Tracing**: Draw territorial boundaries with high-framerate rubber-band preview and vertex snapping.
- **Interactive Naming & Customization**: Immediately name, describe, and assign color palettes to newly drawn zones via the interactive creation modal.
- **Vertex Management**: Undo recent vertices, close polygons by clicking the initial point, or complete via the top floating toolbar.
- **Territory Navigation**: Focus the map camera directly on any jurisdiction's bounding box from the sidebar.

### 📍 Smartpin Field Node Management
- **Territorial Containment Validation**: Ensures Smartpins can only be placed within valid, active jurisdictions using Google Maps geometric containment algorithms (`geometry.poly.containsLocation`).
- **Creation Modal**: Customize pin name, assigned personnel, status, and operational notes immediately upon placement.
- **Direct Marker Editing**: Click the **Pin Icon Container** on any marker to open the editing modal and update properties in place.
- **Interactive Repositioning (Drag & Drop)**: Click the **small pointer at the base of any pin** to unlock free repositioning mode with real-time visual feedback (pulsing amber ring, grab cursor, and *"Drag to move"* indicator). Dropping the pin automatically reassigns it to the underlying jurisdiction.
- **Custom InfoWindows**: Rich popup cards displaying operational status, parent territory, assignee, creation timestamp, and quick-action deletion.

### 📊 Operations Sidebar & HUD
- **Real-time Metrics**: At-a-glance counters for total territories, active nodes, and status breakdown (*Active*, *In Progress*, *Completed*, *Flagged*).
- **Tabbed Management**: Dedicated views for high-level overview, jurisdiction directory, and smartpin inventories.
- **Status Toast Bar**: Real-time contextual feedback indicating current drawing state, selected assets, and modification confirmations.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern UI framework with high-performance concurrent rendering |
| **TypeScript** | Strict static typing and complete interface definitions |
| **Vite 8** | Ultra-fast development server and optimized production bundler |
| **Tailwind CSS v4** | Next-generation utility-first styling with custom dark theme design tokens |
| **@vis.gl/react-google-maps** | Official high-performance Google Maps integration with Advanced Markers |
| **Zustand** | Lightweight, reactive, decoupled global state management |
| **Lucide React** | Consistent, modern icon set |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**, **pnpm**, or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/nrby.git
   cd nrby
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Google Maps API Key**:
   The application is preconfigured with a demonstration Google Maps API key in [`src/components/map/mapConfig.ts`](file:///c:/Users/USUARIO/Desktop/Nrby/nrby/src/components/map/mapConfig.ts). For your own deployment, replace it with your Google Cloud Console API key:
   ```ts
   // src/components/map/mapConfig.ts
   export const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
   export const GOOGLE_MAP_ID = 'YOUR_VECTOR_MAP_ID';
   ```
   > **Note:** Ensure your Google Cloud project has the **Maps JavaScript API** enabled.

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📖 Usage Guide

```
┌─────────────────────────────────────────────────────────────┐
│                       USER WORKFLOW                         │
└─────────────────────────────────────────────────────────────┘

  1. Create Jurisdiction  ──► Click vertices on map ──► Name & color modal
  2. Place Smartpin       ──► Click inside zone     ──► Name & details modal
  3. Edit Smartpin        ──► Click Pin Icon        ──► Update name & status
  4. Reposition Smartpin  ──► Click Base Pointer    ──► Drag to new location
```

### 1. Drawing a Jurisdiction
1. Click **"New Jurisdiction"** in the sidebar.
2. Click anywhere on the map to place polygon vertices.
3. Finish the polygon by clicking the yellow starting vertex, double-clicking, or clicking **"Finish Polygon"** in the top bar.
4. Set the jurisdiction name, operational description, and highlight color in the modal, then click **"Save Jurisdiction"**.

### 2. Dropping a Smartpin
1. Click **"Add Smartpin"** in the sidebar.
2. Click within any existing jurisdiction polygon.
3. Enter the node name, assignee, and initial status in the **Smartpin Modal** and confirm.

### 3. Editing a Smartpin
- Click directly on the **Pin Icon Container** (the square rounded pin head) to open the edit modal and modify its name, notes, or status.

### 4. Moving / Repositioning a Smartpin
- Click the **small pointer at the base of the pin**.
- The pin will unlock and display an amber glowing indicator with a **"Drag to move"** badge.
- Drag the pin anywhere on the map and release it. The pin position and jurisdiction assignment will update automatically.

---

## 📁 Project Structure

```
nrby/
├── src/
│   ├── components/
│   │   ├── layout/            # Dashboard layout, Navbar, and Sidebar
│   │   ├── map/               # MapView, DrawingManager, Layers, and Modals
│   │   │   ├── DrawingManager.tsx       # Live polygon and smartpin placement controller
│   │   │   ├── JurisdictionLayer.tsx    # Geo-polygons rendering layer
│   │   │   ├── NewJurisdictionModal.tsx # Territory naming and color modal
│   │   │   ├── SmartpinLayer.tsx        # Smartpins rendering layer
│   │   │   ├── SmartpinMarker.tsx       # AdvancedMarker with edit & drag logic
│   │   │   ├── SmartpinModal.tsx        # Creation/Editing modal for Smartpins
│   │   │   ├── MapView.tsx              # Google Maps root container
│   │   │   └── mapConfig.ts             # API keys, default coordinates, and map IDs
│   │   └── ui/                # Reusable UI primitives (Button, IconButton, Tooltip)
│   ├── hooks/                 # Zustand state stores
│   │   ├── useJurisdictionStore.ts      # Territories CRUD and geometry
│   │   ├── useSmartpinStore.ts          # Smartpins CRUD and updates
│   │   ├── useMapStore.ts               # Selection states, drawing mode & status messages
│   │   └── useLayoutStore.ts            # Sidebar collapse and active tabs
│   ├── types/                 # Shared TypeScript interfaces & types
│   ├── App.tsx                # App entrypoint with Google Maps APIProvider
│   └── main.tsx               # DOM root mounting
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📦 Scripts

- `npm run dev`: Runs the development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles TypeScript and creates an optimized production bundle.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs ESLint over all project source files.

---


