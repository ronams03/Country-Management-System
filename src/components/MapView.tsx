import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Location } from '@/types/location';
import { reverseGeocode } from '@/lib/geocoding';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapViewProps {
  locations: Location[];
  selectedLocation?: Location;
  onLocationClick?: (coordinates: { lat: number; lng: number }, address?: string) => void;
}

interface MapClickHandlerProps {
  onLocationClick?: (coordinates: { lat: number; lng: number }, address?: string) => void;
}

function MapClickHandler({ onLocationClick }: MapClickHandlerProps) {
  useMapEvents({
    click: async (e) => {
      if (onLocationClick) {
        const { lat, lng } = e.latlng;
        try {
          const result = await reverseGeocode(lat, lng);
          onLocationClick({ lat, lng }, result.display_name);
          toast.success('Location selected from map');
        } catch (error) {
          onLocationClick({ lat, lng });
          toast.info('Location selected (geocoding failed)');
        }
      }
    }
  });
  return null;
}

export function MapView({ locations, selectedLocation, onLocationClick }: MapViewProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([14.5995, 120.9842]); // Manila, Philippines
  const [mapZoom, setMapZoom] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');

  // Get all locations with coordinates
  const locationsWithCoords = locations.filter(loc => loc.coordinates);

  useEffect(() => {
    if (selectedLocation?.coordinates) {
      setMapCenter([selectedLocation.coordinates.lat, selectedLocation.coordinates.lng]);
      setMapZoom(12);
    }
  }, [selectedLocation]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    const found = locationsWithCoords.find(loc => 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (found && found.coordinates) {
      setMapCenter([found.coordinates.lat, found.coordinates.lng]);
      setMapZoom(12);
      toast.success(`Found: ${found.name}`);
    } else {
      toast.error('Location not found');
    }
  };

  const getMarkerColor = (type: Location['type']) => {
    const colors = {
      country: '#3b82f6', // blue
      state: '#10b981',   // green
      city: '#f59e0b',    // yellow
      street: '#8b5cf6',  // purple
      barangay: '#ec4899' // pink
    };
    return colors[type];
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Interactive Map</h2>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-48"
            />
            <Button onClick={handleSearch} size="sm">
              Search
            </Button>
          </div>
        </div>

        {onLocationClick && (
          <div className="text-sm text-muted-foreground bg-blue-50 p-2 rounded">
            💡 Click anywhere on the map to select coordinates for new locations
          </div>
        )}

        <div className="h-96 w-full rounded-lg overflow-hidden border">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="/images/Map.jpg"
            />
            
            <MapClickHandler onLocationClick={onLocationClick} />
            
            {locationsWithCoords.map((location) => (
              <Marker
                key={location.id}
                position={[location.coordinates!.lat, location.coordinates!.lng]}
                icon={defaultIcon}
              >
                <Popup>
                  <div className="space-y-2">
                    <div className="font-semibold">{location.name}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {location.type}
                    </div>
                    {location.address && (
                      <div className="text-xs text-gray-500">
                        {location.address}
                      </div>
                    )}
                    <div className="text-xs text-gray-400">
                      {location.coordinates!.lat.toFixed(6)}, {location.coordinates!.lng.toFixed(6)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Country</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>State</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>City</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Street</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            <span>Barangay</span>
          </div>
        </div>
      </div>
    </Card>
  );
}