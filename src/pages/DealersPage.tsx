import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  Star, 
  ShieldCheck, 
  Car, 
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { dealerService } from '../services/dealerService';
import { DealerCard } from '../components/DealerCard';
import { useApp } from '../context/AppContext';

export const DealersPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const allDealers = dealerService.getAll();

  const filteredDealers = useMemo(() => {
    return allDealers.filter(dealer => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = dealer.name.toLowerCase().includes(q);
        const matchesCity = dealer.address.city.toLowerCase().includes(q);
        const matchesBrand = dealer.specialties.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesCity && !matchesBrand) return false;
      }

      if (selectedCity !== 'All' && dealer.address.city !== selectedCity) {
        return false;
      }

      if (selectedSpecialty !== 'All' && !dealer.specialties.includes(selectedSpecialty)) {
        return false;
      }

      return true;
    });
  }, [allDealers, searchQuery, selectedCity, selectedSpecialty]);

  const cities = ['All', 'Munich', 'Stuttgart', 'Paris', 'London', 'Amsterdam'];
  const specialties = ['All', 'BMW', 'Mercedes-Benz', 'Audi', 'Electric Vehicles', 'Luxury', 'Performance'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" /> Official Dealership Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Certified Dealer Showrooms
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse {allDealers.length} verified automotive partners across Germany, France, the UK, and the Netherlands.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Verified Dealer Guarantees</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search dealer by name or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
            />
          </div>

          {/* City Selector */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 font-medium"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All European Cities' : `${c}`}</option>
              ))}
            </select>
          </div>

          {/* Specialty Selector */}
          <div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 font-medium"
            >
              {specialties.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Brand Specialties' : `Specialty: ${s}`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dealers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDealers.map(dealer => (
          <DealerCard key={dealer.id} dealer={dealer} />
        ))}
      </div>

      {filteredDealers.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Dealerships Match Search</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try resetting your city or brand filters to view all authorized European partners.
          </p>
        </div>
      )}
    </div>
  );
};
