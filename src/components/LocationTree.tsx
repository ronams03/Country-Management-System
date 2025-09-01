import { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Location } from '@/types/location';

interface LocationTreeProps {
  locations: Location[];
  onAddLocation: (parent?: Location) => void;
  onEditLocation: (location: Location) => void;
  onDeleteLocation: (location: Location) => void;
  onSelectLocation: (location: Location) => void;
  selectedLocationId?: string;
}

interface TreeNodeProps {
  location: Location;
  level: number;
  onAddLocation: (parent?: Location) => void;
  onEditLocation: (location: Location) => void;
  onDeleteLocation: (location: Location) => void;
  onSelectLocation: (location: Location) => void;
  selectedLocationId?: string;
}

function TreeNode({
  location,
  level,
  onAddLocation,
  onEditLocation,
  onDeleteLocation,
  onSelectLocation,
  selectedLocationId
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = location.children && location.children.length > 0;
  const isSelected = selectedLocationId === location.id;

  const getTypeColor = (type: Location['type']) => {
    const colors = {
      country: 'bg-blue-100 text-blue-800',
      state: 'bg-green-100 text-green-800',
      city: 'bg-yellow-100 text-yellow-800',
      street: 'bg-purple-100 text-purple-800',
      barangay: 'bg-pink-100 text-pink-800'
    };
    return colors[type];
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer ${
          isSelected ? 'bg-blue-50 border border-blue-200' : ''
        }`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => onSelectLocation(location)}
      >
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <div className="w-4" />
          )}
          
          <span className="font-medium truncate">{location.name}</span>
          <Badge variant="secondary" className={`text-xs ${getTypeColor(location.type)}`}>
            {location.type}
          </Badge>
          
          {location.coordinates && (
            <MapPin className="h-3 w-3 text-gray-400" />
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAddLocation(location)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Child Location
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditLocation(location)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Location
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDeleteLocation(location)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Location
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {location.children!.map((child) => (
            <TreeNode
              key={child.id}
              location={child}
              level={level + 1}
              onAddLocation={onAddLocation}
              onEditLocation={onEditLocation}
              onDeleteLocation={onDeleteLocation}
              onSelectLocation={onSelectLocation}
              selectedLocationId={selectedLocationId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function LocationTree({
  locations,
  onAddLocation,
  onEditLocation,
  onDeleteLocation,
  onSelectLocation,
  selectedLocationId
}: LocationTreeProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Location Hierarchy</h2>
        <Button onClick={() => onAddLocation()} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Country
        </Button>
      </div>
      
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {locations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No locations added yet</p>
            <p className="text-sm">Click "Add Country" to get started</p>
          </div>
        ) : (
          locations.map((location) => (
            <TreeNode
              key={location.id}
              location={location}
              level={0}
              onAddLocation={onAddLocation}
              onEditLocation={onEditLocation}
              onDeleteLocation={onDeleteLocation}
              onSelectLocation={onSelectLocation}
              selectedLocationId={selectedLocationId}
            />
          ))
        )}
      </div>
    </Card>
  );
}