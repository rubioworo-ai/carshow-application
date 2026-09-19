import { Vehicle, FilterState } from '../types';
import { INITIAL_VEHICLES } from '../data/vehicles';

const STORAGE_KEY = 'automarket_vehicles_v1';

export const vehicleService = {
  getAll(): Vehicle[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse vehicles from localStorage', e);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VEHICLES));
    return INITIAL_VEHICLES;
  },

  getById(id: string): Vehicle | undefined {
    const vehicles = this.getAll();
    return vehicles.find(v => v.id === id);
  },

  getFeatured(): Vehicle[] {
    const vehicles = this.getAll();
    return vehicles.filter(v => v.isFeatured && v.status === 'available');
  },

  getRecentlyAdded(limit = 6): Vehicle[] {
    const vehicles = this.getAll();
    return vehicles
      .filter(v => v.status === 'available')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  getSimilar(vehicle: Vehicle, limit = 3): Vehicle[] {
    const vehicles = this.getAll();
    return vehicles
      .filter(v => v.id !== vehicle.id && v.status === 'available')
      .filter(v => v.bodyType === vehicle.bodyType || v.make === vehicle.make || Math.abs(v.price - vehicle.price) < 15000)
      .slice(0, limit);
  },

  getSimilarVehicles(vehicleId: string, limit = 4): Vehicle[] {
    const v = this.getById(vehicleId);
    if (!v) return this.getFeatured().slice(0, limit);
    return this.getSimilar(v, limit);
  },

  getByDealer(dealerId: string): Vehicle[] {
    return this.getAll().filter(v => v.dealerId === dealerId && v.status === 'available');
  },

  filter(filters: FilterState): Vehicle[] {
    return this.filterVehicles(filters);
  },

  filterVehicles(filters: FilterState): Vehicle[] {
    let list = this.getAll().filter(v => v.status === 'available');

    // Text search (make, model, variant, engine)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(v =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        (v.variant && v.variant.toLowerCase().includes(q)) ||
        v.location.toLowerCase().includes(q)
      );
    }

    // Make
    if (filters.make && filters.make !== 'All Makes') {
      list = list.filter(v => v.make.toLowerCase() === filters.make.toLowerCase());
    }

    // Model
    if (filters.model && filters.model !== 'All Models') {
      list = list.filter(v => v.model.toLowerCase() === filters.model.toLowerCase());
    }

    // Year range
    if (filters.minYear) {
      list = list.filter(v => v.year >= filters.minYear);
    }
    if (filters.maxYear) {
      list = list.filter(v => v.year <= filters.maxYear);
    }

    // Price range
    if (filters.minPrice) {
      list = list.filter(v => v.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      list = list.filter(v => v.price <= filters.maxPrice);
    }

    // Mileage range
    if (filters.minMileage) {
      list = list.filter(v => v.mileage >= filters.minMileage);
    }
    if (filters.maxMileage) {
      list = list.filter(v => v.mileage <= filters.maxMileage);
    }

    // Fuel types
    if (filters.fuelTypes.length > 0) {
      list = list.filter(v => filters.fuelTypes.includes(v.fuelType));
    }

    // Transmission
    if (filters.transmissions.length > 0) {
      list = list.filter(v => filters.transmissions.includes(v.transmission));
    }

    // Body type
    if (filters.bodyTypes.length > 0) {
      list = list.filter(v => filters.bodyTypes.includes(v.bodyType));
    }

    // Drive type
    if (filters.driveTypes.length > 0) {
      list = list.filter(v => filters.driveTypes.includes(v.driveType));
    }

    // Condition
    if (filters.condition && filters.condition !== 'All') {
      list = list.filter(v => v.condition === filters.condition);
    }

    // Location
    if (filters.location && filters.location !== 'All Locations') {
      list = list.filter(v => v.location.toLowerCase().includes(filters.location.toLowerCase()));
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'mileage-asc':
        list.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'year-desc':
        list.sort((a, b) => b.year - a.year);
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return list;
  },

  saveVehicles(vehicles: Vehicle[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  },

  addVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt'>): Vehicle {
    const current = this.getAll();
    const newVehicle: Vehicle = {
      ...vehicle,
      id: 'veh-custom-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newVehicle, ...current];
    this.saveVehicles(updated);
    return newVehicle;
  },

  updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
    const current = this.getAll();
    const idx = current.findIndex(v => v.id === id);
    if (idx === -1) return null;
    current[idx] = { ...current[idx], ...updates };
    this.saveVehicles(current);
    return current[idx];
  },

  update(id: string, updates: Partial<Vehicle>): Vehicle | null {
    return this.updateVehicle(id, updates);
  },

  deleteVehicle(id: string): boolean {
    const current = this.getAll();
    const filtered = current.filter(v => v.id !== id);
    if (filtered.length !== current.length) {
      this.saveVehicles(filtered);
      return true;
    }
    return false;
  },

  delete(id: string): boolean {
    return this.deleteVehicle(id);
  },

  markSold(id: string): Vehicle | null {
    return this.updateVehicle(id, { status: 'sold' });
  },

  getAvailableMakes(): string[] {
    const vehicles = this.getAll();
    const makes = Array.from(new Set(vehicles.map(v => v.make)));
    return makes.sort();
  },

  getModelsForMake(make: string): string[] {
    const vehicles = this.getAll();
    const models = Array.from(
      new Set(
        vehicles
          .filter(v => !make || make === 'All Makes' || v.make.toLowerCase() === make.toLowerCase())
          .map(v => v.model)
      )
    );
    return models.sort();
  },

  resetDefaults(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VEHICLES));
  },

  resetToDefaults(): void {
    this.resetDefaults();
  }
};
