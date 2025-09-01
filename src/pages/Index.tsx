import { useState, useEffect } from 'react';
import { LocationTree } from '@/components/LocationTree';
import { LocationForm } from '@/components/LocationForm';
import { MapView } from '@/components/MapView';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Location } from '@/types/location';
import { locationStore } from '@/lib/locationStore';
import { Trash2, Download, Upload } from 'lucide-react';

export default function Index() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [hierarchicalLocations, setHierarchicalLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formParent, setFormParent] = useState<Location | undefined>();
  const [editingLocation, setEditingLocation] = useState<Location | undefined>();
  const [mapClickCoords, setMapClickCoords] = useState<{ lat: number; lng: number } | undefined>();

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = () => {
    const allLocations = locationStore.getAllLocations();
    const hierarchy = locationStore.buildHierarchy();
    setLocations(allLocations);
    setHierarchicalLocations(hierarchy);
  };

  const handleAddLocation = (parent?: Location) => {
    setFormParent(parent);
    setEditingLocation(undefined);
    setIsFormOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setFormParent(undefined);
    setIsFormOpen(true);
  };

  const handleDeleteLocation = (location: Location) => {
    if (confirm(`Are you sure you want to delete "${location.name}" and all its children?`)) {
      locationStore.deleteLocation(location.id);
      loadLocations();
      if (selectedLocation?.id === location.id) {
        setSelectedLocation(undefined);
      }
      toast.success('Location deleted successfully');
    }
  };

  const handleSaveLocation = (location: Location) => {
    loadLocations();
    setSelectedLocation(location);
  };

  const handleMapClick = (coordinates: { lat: number; lng: number }, address?: string) => {
    setMapClickCoords(coordinates);
    // You could automatically open the form here if desired
    toast.success('Coordinates selected! Use "Add Location" to create a new location here.');
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all locations? This cannot be undone.')) {
      localStorage.removeItem('country-management-locations');
      loadLocations();
      setSelectedLocation(undefined);
      toast.success('All locations cleared');
    }
  };

  const handleExportData = () => {
    const data = {
      locations: locations,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `country-management-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.locations && Array.isArray(data.locations)) {
          localStorage.setItem('country-management-locations', JSON.stringify(data.locations));
          loadLocations();
          toast.success('Data imported successfully');
        } else {
          toast.error('Invalid file format');
        }
      } catch (error) {
        toast.error('Failed to import data');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Country Management System</h1>
              <p className="text-gray-600 mt-2">
                Manage hierarchical locations with interactive mapping and geocoding
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                id="import-file"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-file')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="destructive" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {['country', 'state', 'city', 'street', 'barangay'].map((type) => {
            const count = locations.filter(loc => loc.type === type).length;
            return (
              <Card key={type} className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{type}{count !== 1 ? 's' : ''}</div>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Tree */}
          <div className="space-y-4">
            <LocationTree
              locations={hierarchicalLocations}
              onAddLocation={handleAddLocation}
              onEditLocation={handleEditLocation}
              onDeleteLocation={handleDeleteLocation}
              onSelectLocation={setSelectedLocation}
              selectedLocationId={selectedLocation?.id}
            />
            
            {selectedLocation && (
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Selected Location</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {selectedLocation.name}</div>
                  <div><strong>Type:</strong> {selectedLocation.type}</div>
                  {selectedLocation.address && (
                    <div><strong>Address:</strong> {selectedLocation.address}</div>
                  )}
                  {selectedLocation.coordinates && (
                    <div>
                      <strong>Coordinates:</strong> {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
                    </div>
                  )}
                  <div><strong>Created:</strong> {new Date(selectedLocation.createdAt).toLocaleDateString()}</div>
                </div>
              </Card>
            )}
          </div>

          {/* Map */}
          <MapView
            locations={locations}
            selectedLocation={selectedLocation}
            onLocationClick={handleMapClick}
          />
        </div>

        {/* Location Form Dialog */}
        <LocationForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setMapClickCoords(undefined);
          }}
          onSave={handleSaveLocation}
          parentLocation={formParent}
          editLocation={editingLocation}
        />
      </div>
    </div>
  );
}