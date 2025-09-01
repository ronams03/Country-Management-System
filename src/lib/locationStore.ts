import { Location } from '@/types/location';

const STORAGE_KEY = 'country-management-locations';

export class LocationStore {
  private static instance: LocationStore;
  private locations: Location[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): LocationStore {
    if (!LocationStore.instance) {
      LocationStore.instance = new LocationStore();
    }
    return LocationStore.instance;
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.locations = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading locations from storage:', error);
      this.locations = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.locations));
    } catch (error) {
      console.error('Error saving locations to storage:', error);
    }
  }

  getAllLocations(): Location[] {
    return [...this.locations];
  }

  getLocationById(id: string): Location | undefined {
    return this.locations.find(loc => loc.id === id);
  }

  getLocationsByParent(parentId?: string): Location[] {
    return this.locations.filter(loc => loc.parentId === parentId);
  }

  addLocation(location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Location {
    const newLocation: Location = {
      ...location,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.locations.push(newLocation);
    this.saveToStorage();
    return newLocation;
  }

  updateLocation(id: string, updates: Partial<Location>): Location | null {
    const index = this.locations.findIndex(loc => loc.id === id);
    if (index === -1) return null;

    this.locations[index] = {
      ...this.locations[index],
      ...updates,
      updatedAt: new Date()
    };

    this.saveToStorage();
    return this.locations[index];
  }

  deleteLocation(id: string): boolean {
    // Also delete all children
    const toDelete = this.getDescendants(id);
    toDelete.push(id);

    const initialLength = this.locations.length;
    this.locations = this.locations.filter(loc => !toDelete.includes(loc.id));
    
    if (this.locations.length < initialLength) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  private getDescendants(parentId: string): string[] {
    const descendants: string[] = [];
    const children = this.getLocationsByParent(parentId);
    
    for (const child of children) {
      descendants.push(child.id);
      descendants.push(...this.getDescendants(child.id));
    }
    
    return descendants;
  }

  buildHierarchy(): Location[] {
    const locationMap = new Map<string, Location>();
    const roots: Location[] = [];

    // Create a map of all locations
    this.locations.forEach(loc => {
      locationMap.set(loc.id, { ...loc, children: [] });
    });

    // Build the hierarchy
    this.locations.forEach(loc => {
      const location = locationMap.get(loc.id)!;
      
      if (loc.parentId) {
        const parent = locationMap.get(loc.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(location);
        }
      } else {
        roots.push(location);
      }
    });

    return roots;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const locationStore = LocationStore.getInstance();