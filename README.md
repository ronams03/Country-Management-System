# Country Management System

A comprehensive hierarchical location management web application with interactive mapping capabilities and geocoding integration.

## Core Features Implemented:

✅ **Hierarchical Location Management**: Add countries, states, cities, streets, and barangays in a tree structure
✅ **Interactive Map Integration**: Uses Leaflet with your provided geocoding API key
✅ **Forward & Reverse Geocoding**: Convert addresses to coordinates and vice versa
✅ **Map Click Selection**: Click anywhere on the map to select coordinates for new locations
✅ **Search Functionality**: Search and locate existing places on the map
✅ **Visual Markers**: Different colored markers for each location type
✅ **Data Persistence**: All data saved to browser's local storage
✅ **Import/Export**: Backup and restore your location data
✅ **Statistics Dashboard**: View counts of each location type

## 🗺️ Map Features:

- Interactive map with zoom and pan
- Click-to-select coordinates
- Automatic geocoding when you click on the map
- Visual markers for all locations with coordinates
- Search existing locations on the map
- Color-coded legend for different location types

## 📊 Management Features:

- Tree view of all locations with expand/collapse
- Add, edit, and delete locations at any level
- Automatic parent-child relationships
- Bulk operations (clear all, export, import)
- Real-time statistics

## 🔧 Technical Implementation:

- Built with React, TypeScript, and Tailwind CSS
- Uses your geocoding API (68a15cdddbfda055865558ktae2bde8)
- Leaflet maps for interactive mapping
- Local storage for data persistence
- Responsive design that works on all devices

## Getting Started

The system is now ready to use! You can:

1. **Preview the application** in the App Viewer to test all features
2. **Click the publish button** to deploy it online
3. **Share the link** with others

## Technology Stack

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Leaflet (for maps)
- React-Leaflet

All shadcn/ui components have been downloaded under `@/components/ui`.

## File Structure

- `index.html` - HTML entry point
- `vite.config.ts` - Vite configuration file
- `tailwind.config.js` - Tailwind CSS configuration file
- `package.json` - NPM dependencies and scripts
- `src/app.tsx` - Root component of the project
- `src/main.tsx` - Project entry point
- `src/index.css` - Existing CSS configuration
- `src/pages/Index.tsx` - Main dashboard with location management
- `src/components/LocationTree.tsx` - Hierarchical tree view component
- `src/components/LocationForm.tsx` - Add/edit location form component
- `src/components/MapView.tsx` - Interactive map component
- `src/lib/geocoding.ts` - Geocoding API integration
- `src/lib/locationStore.ts` - Local storage management
- `src/types/location.ts` - TypeScript type definitions

## Components

- All shadcn/ui components are pre-downloaded and available at `@/components/ui`
- Custom components for location management and mapping

## Styling

- Add global styles to `src/index.css` or create new CSS files as needed
- Use Tailwind classes for styling components

## Development

- Import components from `@/components/ui` in your React components
- Customize the UI by modifying the Tailwind configuration

## Note

- The `@/` path alias points to the `src/` directory
- In your typescript code, don't re-export types that you're already importing

# Commands

**Install Dependencies**

```shell
pnpm i
```

**Add Dependencies**

```shell
pnpm add some_new_dependency
```

**Start Preview**

```shell
pnpm run dev
```

**To build**

```shell
pnpm run build
```

## Usage Guide

1. **Adding Locations**: Start by adding a country, then add states, cities, streets, and barangays in hierarchical order
2. **Using the Map**: Click anywhere on the map to select coordinates for new locations
3. **Geocoding**: Enter addresses in the location form and click "Geocode" to automatically get coordinates
4. **Search**: Use the search box on the map to find existing locations
5. **Data Management**: Use the export/import buttons to backup or restore your location data