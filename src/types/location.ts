export interface Location {
  id: string;
  name: string;
  type: 'country' | 'state' | 'city' | 'street' | 'barangay';
  parentId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: string;
  children?: Location[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
  address?: {
    country?: string;
    state?: string;
    city?: string;
    road?: string;
    suburb?: string;
  };
}

export interface LocationFormData {
  name: string;
  type: Location['type'];
  parentId?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}