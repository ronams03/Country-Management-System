# Country Management System - MVP Implementation Plan

## Core Features to Implement:
1. Hierarchical location management (Country > State > City > Street > Barangay)
2. Interactive map integration with geocoding API
3. Add/Edit/Delete locations at each level
4. Search and geocoding functionality
5. Visual map drawing for new locations

## Files to Create/Modify:

### 1. src/pages/Index.tsx
- Main dashboard with location hierarchy tree
- Map integration with Leaflet
- Add/Edit forms for locations

### 2. src/components/LocationTree.tsx
- Hierarchical tree view of locations
- Expandable nodes for each level
- Context menu for add/edit/delete actions

### 3. src/components/MapView.tsx
- Interactive map using Leaflet
- Geocoding integration
- Drawing tools for new locations
- Marker management

### 4. src/components/LocationForm.tsx
- Form for adding/editing locations
- Address input with geocoding
- Coordinate input/display

### 5. src/lib/geocoding.ts
- API integration for forward/reverse geocoding
- Utility functions for coordinate conversion

### 6. src/lib/locationStore.ts
- Local storage management for locations
- CRUD operations for location data

### 7. src/types/location.ts
- TypeScript interfaces for location data structure

### 8. index.html
- Update title to "Country Management System"

## Implementation Strategy:
- Use React with TypeScript
- Leaflet for maps (react-leaflet)
- Local storage for data persistence
- Shadcn/ui components for UI
- Hierarchical data structure with parent-child relationships