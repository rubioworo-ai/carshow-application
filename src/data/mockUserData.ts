import { TestDriveBooking, Lead, SellCarSubmission, CustomerUser } from '../types';

export const INITIAL_USER: CustomerUser = {
  id: 'cust-1',
  name: 'Marcus Vance',
  email: 'm.vance@automarket-buyer.eu',
  phone: '+49 176 8921 4430',
  city: 'Munich, Germany',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  memberSince: 'October 2023'
};

export const INITIAL_APPOINTMENTS: TestDriveBooking[] = [
  {
    id: 'td-101',
    vehicleId: 'veh-bmw-330e',
    vehicleName: 'BMW 3 Series 330e M Sport Touring',
    vehiclePrice: 48900,
    vehicleImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80',
    dealerId: 'dealer-1',
    dealerName: 'Bavaria Motor Group',
    dealerCity: 'Munich',
    date: '2025-03-05',
    timeSlot: '14:00 - 15:00',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@automarket-buyer.eu',
    customerPhone: '+49 176 8921 4430',
    driversLicenseNumber: 'D-B89210492',
    notes: 'Interested in the electric range performance and trunk dimensions for child pram.',
    status: 'confirmed',
    createdAt: '2025-02-20'
  },
  {
    id: 'td-102',
    vehicleId: 'veh-merc-e300d',
    vehicleName: 'Mercedes-Benz E-Class E 300 d 4MATIC',
    vehiclePrice: 64500,
    vehicleImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80',
    dealerId: 'dealer-3',
    dealerName: 'Stuttgart Prestige Automobile',
    dealerCity: 'Stuttgart',
    date: '2025-03-12',
    timeSlot: '10:30 - 11:30',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@automarket-buyer.eu',
    customerPhone: '+49 176 8921 4430',
    driversLicenseNumber: 'D-B89210492',
    notes: 'Requesting test drive with MBUX Superscreen demonstration.',
    status: 'pending',
    createdAt: '2025-02-22'
  },
  {
    id: 'td-103',
    vehicleId: 'veh-volvo-xc60',
    vehicleName: 'Volvo XC60 Recharge T8 AWD Ultimate',
    vehiclePrice: 57900,
    vehicleImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    dealerId: 'dealer-2',
    dealerName: 'Nordic Auto Hus',
    dealerCity: 'Gothenburg',
    date: '2025-02-15',
    timeSlot: '16:00 - 17:00',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@automarket-buyer.eu',
    customerPhone: '+49 176 8921 4430',
    driversLicenseNumber: 'D-B89210492',
    notes: 'Completed test run on motorway and city roads. Loved the Bowers & Wilkins audio.',
    status: 'completed',
    createdAt: '2025-02-01'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-301',
    vehicleId: 'veh-bmw-330e',
    vehicleName: 'BMW 3 Series 330e M Sport Touring',
    customerName: 'Alexander Bauer',
    customerEmail: 'a.bauer@techventures.de',
    customerPhone: '+49 89 2314 990',
    message: 'Can you provide the certified battery health report and confirm if VAT is deductible for company leasing?',
    preferredContact: 'email',
    date: '2025-02-23',
    status: 'new'
  },
  {
    id: 'lead-302',
    vehicleId: 'veh-audi-rs6',
    vehicleName: 'Audi RS6 Avant Performance',
    customerName: 'Oliver Sterling',
    customerEmail: 'oliver.sterling@mayfairpartners.co.uk',
    customerPhone: '+44 20 7946 0991',
    message: 'Interested in immediate purchase. Can you organize enclosed transporter delivery to Mayfair, London?',
    preferredContact: 'phone',
    date: '2025-02-22',
    status: 'contacted'
  },
  {
    id: 'lead-303',
    vehicleId: 'veh-tesla-model3-highland',
    vehicleName: 'Tesla Model 3 Highland Long Range',
    customerName: 'Sophie van Dijk',
    customerEmail: 'sophie.vd@amsterdam-creative.nl',
    customerPhone: '+31 6 5491 8820',
    message: 'Is the vehicle eligible for the Dutch SEPP EV subsidy? Would like to arrange trade-in of a 2019 Golf.',
    preferredContact: 'whatsapp',
    date: '2025-02-21',
    status: 'new'
  },
  {
    id: 'lead-304',
    vehicleId: 'veh-volvo-ex30',
    vehicleName: 'Volvo EX30 Twin Motor Performance',
    customerName: 'Lukas Lindgren',
    customerEmail: 'lukas.l@nordicfin.se',
    customerPhone: '+46 70 821 9904',
    message: 'What winter wheel package is available for delivery before end of the month?',
    preferredContact: 'email',
    date: '2025-02-19',
    status: 'closed'
  }
];

export const INITIAL_SUBMISSIONS: SellCarSubmission[] = [
  {
    id: 'sub-201',
    make: 'Volkswagen',
    model: 'Passat Variant',
    year: 2021,
    mileage: 62000,
    condition: 'Very Good',
    fuelType: 'Diesel',
    transmission: 'Dual-Clutch',
    location: 'Munich, Germany',
    askingPrice: 24500,
    estimatedValuation: {
      low: 22800,
      fair: 24900,
      high: 26300
    },
    description: 'First-owner company vehicle, 2.0 TDI Elegance, full digital dashboard, always serviced at official VW workshops.',
    photos: [
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?w=800&auto=format&fit=crop&q=80'
    ],
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@automarket-buyer.eu',
    customerPhone: '+49 176 8921 4430',
    status: 'offer_made',
    createdAt: '2025-02-18'
  }
];
