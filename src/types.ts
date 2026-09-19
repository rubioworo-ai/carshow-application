export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Plug-in Hybrid' | 'Electric';
export type TransmissionType = 'Automatic' | 'Manual' | 'Dual-Clutch' | 'Single-Speed';
export type BodyType = 'SUV' | 'Sedan' | 'Estate / Wagon' | 'Coupe' | 'Hatchback' | 'Cabriolet' | 'Van';
export type DriveType = 'FWD' | 'RWD' | 'AWD' | '4WD';
export type VehicleCondition = 'New' | 'Certified Pre-Owned' | 'Used';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  variant?: string;
  year: number;
  price: number;
  monthlyEstimate: number;
  mileage: number; // in km
  condition: VehicleCondition;
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType: BodyType;
  engineSize: string; // e.g. "2.0L Turbo", "Electric Dual Motor", "3.0L Inline-6"
  powerHp: number;
  powerKw: number;
  driveType: DriveType;
  fuelEconomy: string; // e.g. "5.4 L/100km", "16.8 kWh/100km"
  exteriorColor: string;
  interiorColor: string;
  vin: string;
  location: string;
  dealerId: string;
  images: string[];
  description: string;
  features: string[];
  safetyEquipment: string[];
  createdAt: string;
  isFeatured?: boolean;
  status: 'available' | 'reserved' | 'sold' | 'pending_review';
  doors: number;
  seats: number;
  co2Emissions?: string;
}

export interface Dealer {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  phone: string;
  email: string;
  website: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  verified: boolean;
  specialties: string[];
  vehicleCount: number;
  description: string;
}

export interface FilterState {
  searchQuery: string;
  make: string;
  model: string;
  minYear: number;
  maxYear: number;
  minPrice: number;
  maxPrice: number;
  minMileage: number;
  maxMileage: number;
  fuelTypes: FuelType[];
  transmissions: TransmissionType[];
  bodyTypes: BodyType[];
  driveTypes: DriveType[];
  condition: string; // "All" | "New" | "Used" | "Certified Pre-Owned"
  location: string;
  sortBy: SortOption;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'mileage-asc' | 'year-desc';

export interface TestDriveBooking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehiclePrice: number;
  vehicleImage: string;
  dealerId: string;
  dealerName: string;
  dealerCity: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  driversLicenseNumber: string;
  notes?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface SellCarSubmission {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: 'Excellent' | 'Very Good' | 'Good' | 'Fair';
  fuelType: FuelType;
  transmission: TransmissionType;
  location: string;
  askingPrice: number;
  estimatedValuation: {
    low: number;
    fair: number;
    high: number;
  };
  description: string;
  photos: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'under_review' | 'approved' | 'offer_made';
  createdAt: string;
}

export interface ValuationSubmission {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  fuelType: string;
  vinNumber?: string;
  serviceHistory?: string;
  previousOwners?: number;
  notes?: string;
  estimatedValue: number;
  tradeInBonusValue: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'reviewed' | 'completed';
  createdAt: string;
}

export interface Lead {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  date: string;
  createdAt?: string;
  status: 'new' | 'contacted' | 'closed';
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
  memberSince: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}
