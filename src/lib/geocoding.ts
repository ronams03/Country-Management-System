import { GeocodingResult } from '@/types/location';

const API_KEY = '68a15cdddbfda055865558ktae2bde8';
const BASE_URL = 'https://geocode.maps.co';

interface GeocodingApiResponse {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    country?: string;
    state?: string;
    city?: string;
    road?: string;
    suburb?: string;
  };
}

export async function forwardGeocode(address: string): Promise<GeocodingResult[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search?q=${encodeURIComponent(address)}&api_key=${API_KEY}&format=json`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data: GeocodingApiResponse[] = await response.json();
    return data.map((item) => ({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      display_name: item.display_name,
      address: item.address
    }));
  } catch (error) {
    console.error('Forward geocoding error:', error);
    throw error;
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult> {
  try {
    const response = await fetch(
      `${BASE_URL}/reverse?lat=${lat}&lon=${lon}&api_key=${API_KEY}&format=json`
    );
    
    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }
    
    const data: GeocodingApiResponse = await response.json();
    return {
      lat: parseFloat(data.lat),
      lon: parseFloat(data.lon),
      display_name: data.display_name,
      address: data.address
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
}