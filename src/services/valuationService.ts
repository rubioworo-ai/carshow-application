import { FuelType, TransmissionType } from '../types';

export interface ValuationParams {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: 'Excellent' | 'Very Good' | 'Good' | 'Fair';
  fuelType: FuelType;
  transmission: TransmissionType;
}

export interface ValuationResult {
  estimatedValue: number;
  rangeLow: number;
  rangeHigh: number;
  tradeInValue: number;
  privateSaleValue: number;
  dealerRetailValue: number;
  depreciationFactor: number;
  marketDemand: 'High' | 'Moderate' | 'Very High';
  confidenceScore: number;
}

export const valuationService = {
  calculateValuation(params: ValuationParams): ValuationResult {
    // Base benchmark MSRPs by brand and age
    const brandBasePrices: Record<string, number> = {
      'BMW': 54000,
      'Mercedes-Benz': 58000,
      'Audi': 52000,
      'Tesla': 48000,
      'Volvo': 50000,
      'Volkswagen': 34000,
      'Toyota': 32000,
      'Ford': 30000,
      'Skoda': 29000,
      'Hyundai': 28000,
      'Kia': 28000,
    };

    const baseMsrp = brandBasePrices[params.make] || 32000;
    const currentYear = 2025;
    const carAge = Math.max(0, currentYear - params.year);

    // Depreciation curve: ~16% 1st yr, ~10% each subsequent yr
    let residualFactor = Math.pow(0.88, carAge);
    if (carAge === 0) residualFactor = 0.95;

    // Mileage impact: average standard is 15,000 km/year
    const expectedMileage = Math.max(5000, carAge * 15000);
    const mileageDelta = params.mileage - expectedMileage;
    // Every 10,000 km excess drops value by ~2.5%
    const mileageAdjustmentFactor = Math.max(0.65, 1 - (mileageDelta / 10000) * 0.025);

    // Condition multiplier
    const conditionMultipliers: Record<string, number> = {
      'Excellent': 1.08,
      'Very Good': 1.0,
      'Good': 0.91,
      'Fair': 0.78,
    };
    const conditionFactor = conditionMultipliers[params.condition] || 1.0;

    // Fuel multiplier
    const fuelBonus: Record<FuelType, number> = {
      'Electric': 1.04,
      'Plug-in Hybrid': 1.02,
      'Hybrid': 1.05,
      'Petrol': 0.98,
      'Diesel': 0.96,
    };
    const fuelFactor = fuelBonus[params.fuelType] || 1.0;

    // Transmission bonus
    const transFactor = params.transmission === 'Manual' ? 0.96 : 1.02;

    // Estimated base fair value
    let fairValue = Math.round(baseMsrp * residualFactor * mileageAdjustmentFactor * conditionFactor * fuelFactor * transFactor / 100) * 100;
    if (fairValue < 4500) fairValue = 4500;

    const rangeLow = Math.round(fairValue * 0.92 / 100) * 100;
    const rangeHigh = Math.round(fairValue * 1.08 / 100) * 100;

    // Trade-in is usually ~88% of market, private sale ~100%, dealer retail ~112%
    const tradeInValue = Math.round(fairValue * 0.88 / 100) * 100;
    const privateSaleValue = fairValue;
    const dealerRetailValue = Math.round(fairValue * 1.12 / 100) * 100;

    let marketDemand: 'High' | 'Moderate' | 'Very High' = 'High';
    if (params.fuelType === 'Hybrid' || params.make === 'Toyota' || params.make === 'BMW') {
      marketDemand = 'Very High';
    } else if (params.condition === 'Fair' || params.mileage > 120000) {
      marketDemand = 'Moderate';
    }

    return {
      estimatedValue: fairValue,
      rangeLow,
      rangeHigh,
      tradeInValue,
      privateSaleValue,
      dealerRetailValue,
      depreciationFactor: Math.round((1 - residualFactor) * 100),
      marketDemand,
      confidenceScore: 94
    };
  },

  estimateValue(params: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  }): { estimatedValue: number; tradeInBonusValue: number } {
    const val = this.calculateValuation({
      make: params.make,
      model: params.model,
      year: params.year,
      mileage: params.mileage,
      condition: (params.condition === 'Poor' ? 'Fair' : params.condition) as any,
      fuelType: 'Hybrid',
      transmission: 'Automatic'
    });

    const estimatedValue = val.estimatedValue;
    const tradeInBonusValue = Math.round(estimatedValue * 1.05);

    return { estimatedValue, tradeInBonusValue };
  },

  getValuations(): import('../types').ValuationSubmission[] {
    const key = 'automarket_valuations_v1';
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    const initial: import('../types').ValuationSubmission[] = [
      {
        id: 'val-9821',
        make: 'BMW',
        model: '320i M Sport',
        year: 2021,
        mileage: 42000,
        condition: 'Excellent',
        fuelType: 'Petrol',
        estimatedValue: 27800,
        tradeInBonusValue: 29190,
        customerName: 'Marcus Sterling',
        customerEmail: 'm.sterling@example.com',
        customerPhone: '+49 89 2442 8890',
        status: 'pending',
        createdAt: '2025-05-18'
      },
      {
        id: 'val-9822',
        make: 'Audi',
        model: 'A4 Avant S-Line',
        year: 2022,
        mileage: 38000,
        condition: 'Good',
        fuelType: 'Diesel',
        estimatedValue: 31200,
        tradeInBonusValue: 32760,
        customerName: 'Elena Rostova',
        customerEmail: 'elena.rostova@example.com',
        customerPhone: '+49 711 5590 12',
        status: 'reviewed',
        createdAt: '2025-05-15'
      }
    ];
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  },

  submitValuation(data: Omit<import('../types').ValuationSubmission, 'id' | 'createdAt'>): import('../types').ValuationSubmission {
    const key = 'automarket_valuations_v1';
    const list = this.getValuations();
    const newSubmission: import('../types').ValuationSubmission = {
      ...data,
      id: 'val-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newSubmission, ...list];
    localStorage.setItem(key, JSON.stringify(updated));
    return newSubmission;
  },

  updateStatus(id: string, status: 'pending' | 'reviewed' | 'completed'): boolean {
    const key = 'automarket_valuations_v1';
    const list = this.getValuations();
    const idx = list.findIndex(v => v.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem(key, JSON.stringify(list));
      return true;
    }
    return false;
  },

  resetToDefaults(): void {
    localStorage.removeItem('automarket_valuations_v1');
  }
};
