import React, { useState } from 'react';
import { 
  Search, 
  Car, 
  ShieldCheck, 
  RotateCcw, 
  Award, 
  Truck, 
  ArrowRight, 
  Sparkles, 
  SlidersHorizontal,
  Star,
  CheckCircle2,
  Building2,
  ChevronRight,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { vehicleService } from '../services/vehicleService';
import { dealerService } from '../services/dealerService';
import { VehicleCard } from '../components/VehicleCard';
import { Vehicle, BodyType } from '../types';

export const HomePage: React.FC = () => {
  const { setCurrentPage, setGlobalSearchFilter, navigateToVehicle, navigateToDealer } = useApp();

  // Quick Hero Search State
  const [heroMake, setHeroMake] = useState('All Makes');
  const [heroBodyType, setHeroBodyType] = useState('All');
  const [heroMaxPrice, setHeroMaxPrice] = useState('100000');
  const [heroCondition, setHeroCondition] = useState('All');

  // Featured Category Tab
  const [featuredTab, setFeaturedTab] = useState<'all' | 'electric' | 'suv' | 'luxury'>('all');

  const availableMakes = vehicleService.getAvailableMakes();
  const allVehicles = vehicleService.getAll();
  const dealers = dealerService.getAll().slice(0, 4);

  // Filter featured vehicles based on tab
  const getFeaturedVehicles = (): Vehicle[] => {
    if (featuredTab === 'electric') {
      return allVehicles.filter(v => v.fuelType === 'Electric' || v.fuelType === 'Plug-in Hybrid').slice(0, 4);
    }
    if (featuredTab === 'suv') {
      return allVehicles.filter(v => v.bodyType === 'SUV').slice(0, 4);
    }
    if (featuredTab === 'luxury') {
      return allVehicles.filter(v => v.price > 60000).slice(0, 4);
    }
    return allVehicles.filter(v => v.isFeatured).slice(0, 4);
  };

  const recentlyAdded = [...allVehicles].reverse().slice(0, 4);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalSearchFilter({
      make: heroMake,
      bodyType: heroBodyType !== 'All' ? heroBodyType : undefined,
      maxPrice: Number(heroMaxPrice),
      condition: heroCondition
    });
    setCurrentPage('vehicles');
  };

  const bodyCategories: { name: BodyType; count: number; image: string; tag: string }[] = [
    {
      name: 'SUV',
      count: allVehicles.filter(v => v.bodyType === 'SUV').length,
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80',
      tag: 'Spacious & All-Terrain'
    },
    {
      name: 'Sedan',
      count: allVehicles.filter(v => v.bodyType === 'Sedan').length,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
      tag: 'Refined Executive Comfort'
    },
    {
      name: 'Estate / Wagon',
      count: allVehicles.filter(v => v.bodyType === 'Estate / Wagon').length,
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
      tag: 'Long-Range Touring'
    },
    {
      name: 'Coupe',
      count: allVehicles.filter(v => v.bodyType === 'Coupe').length,
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
      tag: 'Pure Dynamic Agility'
    },
    {
      name: 'Hatchback',
      count: allVehicles.filter(v => v.bodyType === 'Hatchback').length,
      image: 'https://images.unsplash.com/photo-1541348263662-e0c866661ba5?auto=format&fit=crop&w=600&q=80',
      tag: 'Urban Efficiency'
    }
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury Performance Car"
            className="w-full h-full object-cover opacity-35 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 w-full">
          <div className="max-w-3xl space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Certified European Luxury & Electric Showroom</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-display">
              Find Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-white">
                Masterpiece on Wheels.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
              Explore curated certified pre-owned and new vehicles from premier German, British, and European authorized dealer partners. Inspected with precision, delivered to your door.
            </p>
          </div>

          {/* Search Card Overlay */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-2xl border border-white/20 max-w-5xl">
            <form onSubmit={handleHeroSearch} className="space-y-4">
              {/* Filter Tabs */}
              <div className="flex items-center gap-3 border-b border-slate-200/80 pb-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setHeroCondition('All')}
                  className={`pb-1 border-b-2 transition-all ${
                    heroCondition === 'All' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All Inventory
                </button>
                <button
                  type="button"
                  onClick={() => setHeroCondition('Certified Pre-Owned')}
                  className={`pb-1 border-b-2 transition-all ${
                    heroCondition === 'Certified Pre-Owned' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Certified Pre-Owned
                </button>
                <button
                  type="button"
                  onClick={() => setHeroCondition('New')}
                  className={`pb-1 border-b-2 transition-all ${
                    heroCondition === 'New' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Brand New
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Manufacturer / Make
                  </label>
                  <select
                    value={heroMake}
                    onChange={(e) => setHeroMake(e.target.value)}
                    className="w-full text-xs font-semibold py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="All Makes">All Manufacturers</option>
                    {availableMakes.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Body Style
                  </label>
                  <select
                    value={heroBodyType}
                    onChange={(e) => setHeroBodyType(e.target.value)}
                    className="w-full text-xs font-semibold py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="All">All Body Types</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Estate / Wagon">Estate / Wagon</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Hatchback">Hatchback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Max Price Budget
                  </label>
                  <select
                    value={heroMaxPrice}
                    onChange={(e) => setHeroMaxPrice(e.target.value)}
                    className="w-full text-xs font-semibold py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="40000">Up to €40.000</option>
                    <option value="60000">Up to €60.000</option>
                    <option value="80000">Up to €80.000</option>
                    <option value="100000">Up to €100.000</option>
                    <option value="150000">Up to €150.000+</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                  >
                    <Search className="w-4 h-4" /> Search Inventory
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900">150-Point</p>
              <p className="text-xs text-slate-500 font-medium">TÜV Inspection Standard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900">14-Day</p>
              <p className="text-xs text-slate-500 font-medium">Money-Back Return</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900">24 Months</p>
              <p className="text-xs text-slate-500 font-medium">Full European Warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900">Doorstep</p>
              <p className="text-xs text-slate-500 font-medium">Direct Home Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> Curated Showcase
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Vehicles
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Hand-picked models featuring exceptional condition, low mileage, and verified service books.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setFeaturedTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                featuredTab === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Curated
            </button>
            <button
              onClick={() => setFeaturedTab('electric')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                featuredTab === 'electric' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EV & Hybrid
            </button>
            <button
              onClick={() => setFeaturedTab('suv')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                featuredTab === 'suv' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SUVs
            </button>
            <button
              onClick={() => setFeaturedTab('luxury')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                featuredTab === 'luxury' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Performance
            </button>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {getFeaturedVehicles().map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => setCurrentPage('vehicles')}
            className="px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
          >
            Explore Complete Inventory ({allVehicles.length} Vehicles) <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Browse By Body Type Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Versatile Categories
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Browse by Body Style
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Find the ideal silhouette tailored for family long-hauls, daily city commutes, or executive travel.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('vehicles')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              All Categories <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {bodyCategories.map(cat => (
              <div
                key={cat.name}
                onClick={() => {
                  setGlobalSearchFilter({ bodyType: cat.name });
                  setCurrentPage('vehicles');
                }}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all"
              >
                <div className="aspect-16/10 overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold text-blue-600 uppercase block">{cat.tag}</span>
                  <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.count} models in stock</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added Vehicles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" /> Fresh Arrivals
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Recently Added to Inventory
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              The newest trade-ins and showroom models updated in real-time.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('vehicles')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All Fresh Inventory <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentlyAdded.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {/* Trade-in / Sell Value CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
              Instant Online Valuation
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Sell or Trade-In Your Car in 3 Easy Steps.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Get an accurate, market-grounded instant valuation based on European live auction data. Free home pickup, instant bank transfer, or apply your trade-in credit to any vehicle in our catalog.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentPage('sell')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                Calculate Car Value <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage('financing')}
                className="px-6 py-3 bg-slate-800/80 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-slate-700"
              >
                Calculate Monthly Finance
              </button>
            </div>
          </div>

          {/* Right car image accent */}
          <div className="hidden lg:block absolute -right-8 bottom-0 w-1/2 h-full">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80"
              alt="Porsche 911"
              className="w-full h-full object-contain object-bottom drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Verified Dealer Partners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Authorized Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Verified European Dealerships
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Connect with vetted partner showrooms in Munich, Stuttgart, Paris, London, and Amsterdam.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('dealers')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            All Dealerships <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealers.map(dealer => (
            <div
              key={dealer.id}
              onClick={() => navigateToDealer(dealer.id)}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img src={dealer.logo} alt={dealer.name} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{dealer.name}</h4>
                    <p className="text-[11px] text-slate-500">{dealer.address.city}, {dealer.address.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{dealer.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({dealer.reviewCount} customer reviews)</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {dealer.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-blue-600">{dealer.vehicleCount} Vehicles</span>
                <span className="text-slate-600 font-semibold flex items-center gap-1 group-hover:text-blue-600">
                  Visit Showroom <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Trust Reviews Banner */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Trusted by Discerning European Drivers
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Rated 4.9/5 based on 3,420+ verified verified TÜV-compliant deliveries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Purchased my Porsche Taycan from AutoMarket Munich. The 150-point battery health certificate was spotless, and contactless delivery to Frankfurt happened in 48 hours."
              </p>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-xs">
                <span className="font-bold text-white">Lukas Schneider</span>
                <span className="text-slate-400">Frankfurt, Germany</span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Trading in my BMW 3 Series for an Audi Q8 e-tron was remarkably seamless. Valuation was higher than local trade-in quotes, and the finance calculator matched my contract to the cent."
              </p>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-xs">
                <span className="font-bold text-white">Camille Laurent</span>
                <span className="text-slate-400">Lyon, France</span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "The test drive booking tool lets you pick the exact car and time window with no high-pressure sales reps. Absolute premier standard for modern automotive buyers."
              </p>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-xs">
                <span className="font-bold text-white">Jan van de Berg</span>
                <span className="text-slate-400">Amsterdam, Netherlands</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
