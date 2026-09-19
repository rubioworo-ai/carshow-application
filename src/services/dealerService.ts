import { Dealer, Vehicle } from '../types';
import { INITIAL_DEALERS } from '../data/dealers';
import { vehicleService } from './vehicleService';

const STORAGE_KEY = 'automarket_dealers_v1';

export const dealerService = {
  getAll(): Dealer[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse dealers from localStorage', e);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEALERS));
    return INITIAL_DEALERS;
  },

  getById(id: string): Dealer | undefined {
    const dealers = this.getAll();
    return dealers.find(d => d.id === id);
  },

  getDealerVehicles(dealerId: string): Vehicle[] {
    const vehicles = vehicleService.getAll();
    return vehicles.filter(v => v.dealerId === dealerId && v.status === 'available');
  },

  getCities(): string[] {
    const dealers = this.getAll();
    const cities = Array.from(new Set(dealers.map(d => d.address.city)));
    return cities.sort();
  }
};
