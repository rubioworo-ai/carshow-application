import React from 'react';
import { 
  Building2, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Car, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { Dealer } from '../types';
import { useApp } from '../context/AppContext';

interface DealerCardProps {
  dealer: Dealer;
}

export const DealerCard: React.FC<DealerCardProps> = ({ dealer }) => {
  const { navigateToDealer } = useApp();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Cover Image Header */}
      <div className="relative h-36 bg-slate-800 overflow-hidden">
        <img
          src={dealer.coverImage}
          alt={dealer.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Dealer Logo avatar */}
        <div className="absolute -bottom-5 left-5">
          <div className="w-14 h-14 rounded-xl bg-white p-1 shadow-md border border-slate-100 overflow-hidden">
            <img
              src={dealer.logo}
              alt={dealer.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {dealer.verified && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-600/90 text-white backdrop-blur-xs flex items-center gap-1 shadow-sm">
              <ShieldCheck className="w-3 h-3 text-blue-200" /> Verified Dealership
            </span>
          )}
        </div>
      </div>

      {/* Body details */}
      <div className="pt-8 p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 
              onClick={() => navigateToDealer(dealer.id)}
              className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer"
            >
              {dealer.name}
            </h3>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold text-amber-900 border border-amber-200 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{dealer.rating.toFixed(1)}</span>
              <span className="text-[10px] text-amber-700">({dealer.reviewCount})</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium mb-3 line-clamp-1">
            {dealer.tagline}
          </p>

          {/* Location & Hours */}
          <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{dealer.address.street}, {dealer.address.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Mon-Fri: {dealer.openingHours.weekdays}</span>
            </div>
          </div>

          {/* Specialty Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {dealer.specialties.slice(0, 3).map((spec, i) => (
              <span
                key={i}
                className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
            <Car className="w-3.5 h-3.5" />
            {dealer.vehicleCount} Vehicles
          </span>

          <button
            onClick={() => navigateToDealer(dealer.id)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
          >
            Visit Showroom <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
