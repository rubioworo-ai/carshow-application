import { Dealer } from '../types';

export const INITIAL_DEALERS: Dealer[] = [
  {
    id: 'dealer-1',
    name: 'Bavaria Motor Group',
    tagline: 'Official German Luxury & Performance Specialist',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 384,
    phone: '+49 89 4520 8900',
    email: 'contact@bavariamotorgroup.de',
    website: 'https://bavariamotorgroup.de',
    address: {
      street: 'Leopoldstraße 244',
      city: 'Munich',
      postalCode: '80807',
      country: 'Germany'
    },
    openingHours: {
      weekdays: '08:30 - 19:00',
      saturday: '09:00 - 17:00',
      sunday: 'Closed (Viewing Area Open)'
    },
    verified: true,
    specialties: ['BMW', 'Mercedes-Benz', 'Audi', 'Porsche Certified'],
    vehicleCount: 84,
    description: 'Bavaria Motor Group is Munich’s foremost certified dealer of premier German engineering. Offering full factory warranties, 150-point mechanical audits, and express international delivery across the EU.'
  },
  {
    id: 'dealer-2',
    name: 'Nordic Auto Hus',
    tagline: 'Pioneering Sustainable Electric & Hybrid Mobility',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 219,
    phone: '+46 31 789 4400',
    email: 'info@nordicautohus.se',
    website: 'https://nordicautohus.se',
    address: {
      street: 'Torslandavägen 82',
      city: 'Gothenburg',
      postalCode: '418 78',
      country: 'Sweden'
    },
    openingHours: {
      weekdays: '09:00 - 18:30',
      saturday: '10:00 - 16:00',
      sunday: 'Closed'
    },
    verified: true,
    specialties: ['Volvo', 'Polestar', 'Tesla', 'Volkswagen EV'],
    vehicleCount: 52,
    description: 'Specializing in Scandinavian safety and zero-emission vehicles. Nordic Auto Hus delivers thoroughly tested pre-owned and new electric cars with battery health certificates and home charger bundles.'
  },
  {
    id: 'dealer-3',
    name: 'Stuttgart Prestige Automobile',
    tagline: 'Excellence in Mercedes-Benz and Performance Estates',
    logo: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 412,
    phone: '+49 711 9823 110',
    email: 'sales@stuttgart-prestige.de',
    website: 'https://stuttgart-prestige.de',
    address: {
      street: 'Mercedesstraße 136',
      city: 'Stuttgart',
      postalCode: '70372',
      country: 'Germany'
    },
    openingHours: {
      weekdays: '08:00 - 19:30',
      saturday: '09:00 - 18:00',
      sunday: 'Closed'
    },
    verified: true,
    specialties: ['Mercedes-Benz', 'Mercedes-AMG', 'Smart EQ'],
    vehicleCount: 96,
    description: 'Located in the heart of automotive heritage in Stuttgart. We provide factory-certified pre-owned executive sedans, rugged AMG SUVs, and tailored bespoke financing solutions for corporate and private buyers.'
  },
  {
    id: 'dealer-4',
    name: 'Elysée Automotive Paris',
    tagline: 'Premium French & European Fleet Specialists',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 198,
    phone: '+33 1 45 88 92 10',
    email: 'contact@elysee-auto.fr',
    website: 'https://elysee-auto.fr',
    address: {
      street: 'Avenue de la Grande Armée 56',
      city: 'Paris',
      postalCode: '75017',
      country: 'France'
    },
    openingHours: {
      weekdays: '09:00 - 19:00',
      saturday: '09:30 - 18:30',
      sunday: 'Closed'
    },
    verified: true,
    specialties: ['Audi', 'Volkswagen', 'Peugeot', 'Renault E-Tech'],
    vehicleCount: 65,
    description: 'Conveniently located near the Arc de Triomphe, Elysée Automotive showcases certified city compacts, luxury touring coupes, and executive family wagons with comprehensive European warranties.'
  },
  {
    id: 'dealer-5',
    name: 'Kensington Car Gallery London',
    tagline: 'Curators of Fine European & British Automobiles',
    logo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 275,
    phone: '+44 20 7946 0880',
    email: 'inquiries@kensingtoncargallery.co.uk',
    website: 'https://kensingtoncargallery.co.uk',
    address: {
      street: 'Cromwell Road 142',
      city: 'London',
      postalCode: 'SW7 4EF',
      country: 'United Kingdom'
    },
    openingHours: {
      weekdays: '09:00 - 18:30',
      saturday: '10:00 - 17:00',
      sunday: '11:00 - 16:00 (Appointment Only)'
    },
    verified: true,
    specialties: ['BMW M Power', 'Audi Sport', 'Tesla', 'Range Rover'],
    vehicleCount: 48,
    description: 'Offering an elite selection of handpicked high-specification vehicles. Kensington Car Gallery ensures transparency with HPI clear history reports, customized private plate transfers, and white-glove home delivery.'
  },
  {
    id: 'dealer-6',
    name: 'Amstel Motor Hub',
    tagline: 'Smart Mobility & Modern Family Wagons',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 164,
    phone: '+31 20 659 2811',
    email: 'verkoop@amstelmotorhub.nl',
    website: 'https://amstelmotorhub.nl',
    address: {
      street: 'Keienbergweg 48',
      city: 'Amsterdam',
      postalCode: '1101 GB',
      country: 'Netherlands'
    },
    openingHours: {
      weekdays: '08:30 - 18:00',
      saturday: '09:30 - 17:00',
      sunday: 'Closed'
    },
    verified: true,
    specialties: ['Toyota Hybrid', 'Skoda', 'Volkswagen', 'Hyundai'],
    vehicleCount: 78,
    description: 'Your reliable partner in the Netherlands for efficient commuter vehicles, high-mileage hybrid estates, and cost-effective family cruisers with verified NAP mileage certifications.'
  },
  {
    id: 'dealer-7',
    name: 'Wien Ringstrasse Automobili',
    tagline: 'Austrian Certified All-Wheel Drive & Premium Touring',
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 142,
    phone: '+43 1 513 8920',
    email: 'office@ringstrasse-auto.at',
    website: 'https://ringstrasse-auto.at',
    address: {
      street: 'Opernring 18',
      city: 'Vienna',
      postalCode: '1010',
      country: 'Austria'
    },
    openingHours: {
      weekdays: '08:30 - 18:30',
      saturday: '09:00 - 15:00',
      sunday: 'Closed'
    },
    verified: true,
    specialties: ['Audi Quattro', 'BMW xDrive', 'Skoda 4x4', 'Volkswagen 4Motion'],
    vehicleCount: 60,
    description: 'Specialists in Alpine-ready all-wheel drive vehicles, winter touring packages, and high-efficiency plug-in hybrid SUVs backed by full TÜV Austria road safety inspections.'
  },
  {
    id: 'dealer-8',
    name: 'Iberia Motor Center',
    tagline: 'Mediterranean Value, Certified Compacts & Crossovers',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 231,
    phone: '+34 91 582 3410',
    email: 'contacto@iberiamotorcenter.es',
    website: 'https://iberiamotorcenter.es',
    address: {
      street: 'Paseo de la Castellana 210',
      city: 'Madrid',
      postalCode: '28046',
      country: 'Spain'
    },
    openingHours: {
      weekdays: '09:30 - 20:00',
      saturday: '10:00 - 18:00',
      sunday: 'Closed'
    },
    verified: true,
    specialties: ['Toyota', 'Kia', 'Hyundai', 'Ford', 'Seat'],
    vehicleCount: 92,
    description: 'Madrid’s leading vehicle supermarket delivering competitive trade-in values, instant financing approval, and a 24-month warranty on every pre-owned car in our climate-controlled showroom.'
  }
];
