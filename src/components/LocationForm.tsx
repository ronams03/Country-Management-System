import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Location, LocationFormData } from '@/types/location';
import { forwardGeocode } from '@/lib/geocoding';
import { locationStore } from '@/lib/locationStore';

interface LocationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: Location) => void;
  parentLocation?: Location;
  editLocation?: Location;
  initialCoordinates?: { lat: number; lng: number };
}

const LOCATION_TYPES = [
  { value: 'country', label: 'Country' },
  { value: 'state', label: 'State/Province' },
  { value: 'city', label: 'City' },
  { value: 'street', label: 'Street' },
  { value: 'barangay', label: 'Barangay/District' }
] as const;

export function LocationForm({ 
  isOpen, 
  onClose, 
  onSave, 
  parentLocation, 
  editLocation,
  initialCoordinates 
}: LocationFormProps) {
  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    type: 'country',
    parentId: parentLocation?.id,
    address: '',
    coordinates: undefined
  });
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (editLocation) {
      setFormData({
        name: editLocation.name,
        type: editLocation.type,
        parentId: editLocation.parentId,
        address: editLocation.address || '',
        coordinates: editLocation.coordinates
      });
    } else {
      setFormData({
        name: '',
        type: parentLocation ? getNextType(parentLocation.type) : 'country',
        parentId: parentLocation?.id,
        address: '',
        coordinates: initialCoordinates
      });
    }
  }, [editLocation, parentLocation, isOpen, initialCoordinates]);

  const getNextType = (currentType: Location['type']): Location['type'] => {
    const typeOrder: Location['type'][] = ['country', 'state', 'city', 'street', 'barangay'];
    const currentIndex = typeOrder.indexOf(currentType);
    return typeOrder[currentIndex + 1] || 'barangay';
  };

  const handleGeocode = async () => {
    if (!formData.address.trim()) {
      toast.error('Please enter an address to geocode');
      return;
    }

    setIsGeocoding(true);
    try {
      const results = await forwardGeocode(formData.address);
      if (results.length > 0) {
        const result = results[0];
        setFormData(prev => ({
          ...prev,
          coordinates: { lat: result.lat, lng: result.lon }
        }));
        toast.success('Address geocoded successfully');
      } else {
        toast.error('No results found for this address');
      }
    } catch (error) {
      toast.error('Failed to geocode address');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      let savedLocation: Location;
      
      if (editLocation) {
        savedLocation = locationStore.updateLocation(editLocation.id, formData)!;
      } else {
        savedLocation = locationStore.addLocation(formData);
      }
      
      onSave(savedLocation);
      onClose();
      toast.success(`Location ${editLocation ? 'updated' : 'added'} successfully`);
    } catch (error) {
      toast.error(`Failed to ${editLocation ? 'update' : 'add'} location`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editLocation ? 'Edit Location' : 'Add New Location'}
            {parentLocation && (
              <span className="text-sm font-normal text-muted-foreground">
                {' '}in {parentLocation.name}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter location name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: Location['type']) => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="flex gap-2">
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter address for geocoding"
              />
              <Button
                type="button"
                onClick={handleGeocode}
                disabled={isGeocoding}
                variant="outline"
              >
                {isGeocoding ? 'Geocoding...' : 'Geocode'}
              </Button>
            </div>
          </div>

          {formData.coordinates && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={formData.coordinates.lat}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    coordinates: prev.coordinates ? {
                      ...prev.coordinates,
                      lat: parseFloat(e.target.value) || 0
                    } : { lat: parseFloat(e.target.value) || 0, lng: 0 }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  value={formData.coordinates.lng}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    coordinates: prev.coordinates ? {
                      ...prev.coordinates,
                      lng: parseFloat(e.target.value) || 0
                    } : { lat: 0, lng: parseFloat(e.target.value) || 0 }
                  }))}
                />
              </div>
            </div>
          )}

          {initialCoordinates && !editLocation && (
            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              📍 Using coordinates from map click: {initialCoordinates.lat.toFixed(6)}, {initialCoordinates.lng.toFixed(6)}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editLocation ? 'Update' : 'Add'} Location
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}