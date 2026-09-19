import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Star, 
  ShieldCheck, 
  ArrowLeft, 
  Car, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { dealerService } from '../services/dealerService';
import { vehicleService } from '../services/vehicleService';
import { VehicleCard } from '../components/VehicleCard';
import { ContactDealerModal } from '../components/ContactDealerModal';

export const DealerDetailsPage: React.FC = () => {
  const { selectedDealerId, setCurrentPage } = useApp();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [filterFuel, setFilterFuel] = useState('All');

  const dealer = selectedDealerId ? dealerService.getById(selectedDealerId) : null;
  const vehicles = selectedDealerId ? vehicleService.getByDealer(selectedDealerId) : [];

  if (!dealer) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Dealership Not Found</h2>
        <button
          onClick={() => setCurrentPage('dealers')}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          View All Dealers
        </button>
      </div>
    );
  }

  const filteredVehicles = filterFuel === 'All' 
    ? vehicles 
    : vehicles.filter((v: import('../types').Vehicle) => v.fuelType === filterFuel);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => setCurrentPage('dealers')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dealerships
      </button>

      {/* Dealer Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Cover image */}
        <div className="relative h-48 sm:h-64 bg-slate-900">
          <img
            src={dealer.coverImage}
            alt={dealer.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        </div>

        {/* Info Content */}
        <div className="px-6 sm:px-8 pb-8 pt-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 overflow-hidden shrink-0">
                <img src={dealer.logo} alt={dealer.name} className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                    {dealer.name}
                  </h1>
                  {dealer.verified && (
                    <span className="p-1 rounded-full bg-blue-600 text-white" title="Verified Partner">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">{dealer.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setContactModalOpen(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-md shadow-blue-600/20"
              >
                <MessageSquare className="w-4 h-4" /> Contact Showroom
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Showroom Address</span>
                  <span>{dealer.address.street}, {dealer.address.postalCode} {dealer.address.city}, {dealer.address.country}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Opening Hours</span>
                  <span>Mon-Fri: {dealer.openingHours.weekdays} | Sat: {dealer.openingHours.saturday}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Direct Sales Line</span>
                  <span>{dealer.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Email Inquiries</span>
                  <span>{dealer.email}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700">Verified Rating</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{dealer.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">{dealer.reviewCount} customer reviews audited by TÜV Rheinland.</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {dealer.specialties.map((s, i) => (
                  <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showroom Inventory Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Showroom Inventory ({filteredVehicles.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Certified vehicles available for immediate test-drive and delivery at this hub.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-200 p-1 rounded-xl">
            <span className="text-slate-400 px-2">Fuel:</span>
            {['All', 'Petrol', 'Diesel', 'Hybrid', 'Electric'].map(f => (
              <button
                key={f}
                onClick={() => setFilterFuel(f)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterFuel === f ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((v: import('../types').Vehicle) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </div>

      {/* Contact Modal */}
      <ContactDealerModal
        dealer={dealer}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
};
