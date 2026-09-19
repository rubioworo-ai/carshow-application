import React from 'react';
import { 
  Heart, 
  Scale, 
  MapPin, 
  Gauge, 
  Fuel, 
  Zap, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Vehicle } from '../types';
import { useApp } from '../context/AppContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  layout?: 'grid' | 'list';
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, layout = 'grid' }) => {
  const { 
    navigateToVehicle, 
    toggleFavorite, 
    isFavorite, 
    toggleCompare, 
    isCompared 
  } = useApp();

  const favorite = isFavorite(vehicle.id);
  const compared = isCompared(vehicle.id);

  const formattedPrice = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(vehicle.price);

  const formattedMileage = new Intl.NumberFormat('de-DE').format(vehicle.mileage) + ' km';

  if (layout === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col md:flex-row group">
        {/* Image Container */}
        <div className="relative md:w-80 h-56 md:h-auto shrink-0 overflow-hidden bg-slate-100">
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide shadow-xs ${
              vehicle.condition === 'New'
                ? 'bg-emerald-600 text-white'
                : vehicle.condition === 'Certified Pre-Owned'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-100'
            }`}>
              {vehicle.condition}
            </span>
            {vehicle.isFeatured && (
              <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] px-2 py-0.5 rounded font-medium">
            {vehicle.images.length} photos
          </div>
        </div>

        {/* Content Container */}
        <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
                  {vehicle.year} • {vehicle.bodyType}
                </p>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {vehicle.make} {vehicle.model}
                </h3>
                {vehicle.variant && (
                  <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                    {vehicle.variant}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <p className="text-xl font-extrabold text-slate-950 tracking-tight">{formattedPrice}</p>
                <p className="text-xs text-slate-500 font-medium">
                  from <span className="font-bold text-slate-800">€{vehicle.monthlyEstimate}</span>/mo
                </p>
              </div>
            </div>

            {/* Spec chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium truncate">{formattedMileage}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium truncate">{vehicle.fuelType}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                <Zap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium truncate">{vehicle.powerHp} HP ({vehicle.transmission})</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium truncate">{vehicle.location.split(',')[0]}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(vehicle.id);
                }}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  favorite 
                    ? 'bg-red-50 text-red-600 border-red-200' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                title={favorite ? 'Remove from Saved' : 'Save vehicle'}
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-red-600 text-red-600' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{favorite ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompare(vehicle.id);
                }}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  compared 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                title={compared ? 'Remove from Compare' : 'Compare with other cars'}
              >
                <Scale className={`w-4 h-4 ${compared ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{compared ? 'Comparing' : 'Compare'}</span>
              </button>
            </div>

            <button
              onClick={() => navigateToVehicle(vehicle.id)}
              className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              View Details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Layout
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col group h-full">
      {/* Image Area */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => navigateToVehicle(vehicle.id)}>
        <img
          src={vehicle.images[0]}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide shadow-xs ${
            vehicle.condition === 'New'
              ? 'bg-emerald-600 text-white'
              : vehicle.condition === 'Certified Pre-Owned'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-100'
          }`}>
            {vehicle.condition}
          </span>
          {vehicle.isFeatured && (
            <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        {/* Quick action buttons on top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(vehicle.id);
            }}
            aria-label="Save vehicle"
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              favorite
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(vehicle.id);
            }}
            aria-label="Compare vehicle"
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              compared
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-blue-600'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom image overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
          <span className="bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded font-medium">
            {vehicle.images.length} photos
          </span>
          <span className="bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3 text-blue-400" />
            {vehicle.location.split(',')[0]}
          </span>
        </div>
      </div>

      {/* Content details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>{vehicle.year} • {vehicle.bodyType}</span>
            <span className="text-emerald-600 flex items-center gap-1 font-semibold text-[11px]">
              <ShieldCheck className="w-3 h-3" /> Certified
            </span>
          </div>

          <h3 
            onClick={() => navigateToVehicle(vehicle.id)}
            className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer leading-snug"
          >
            {vehicle.make} {vehicle.model}
          </h3>

          <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
            {vehicle.variant || vehicle.engineSize}
          </p>

          {/* Pricing Box */}
          <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
            <div>
              <span className="text-lg font-extrabold text-slate-950 tracking-tight">
                {formattedPrice}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block leading-tight">Est. finance</span>
              <span className="text-xs font-bold text-blue-700">
                €{vehicle.monthlyEstimate}<span className="text-[10px] font-normal text-slate-500">/mo</span>
              </span>
            </div>
          </div>

          {/* Key Specs Tags */}
          <div className="grid grid-cols-3 gap-1.5 mt-3 text-[11px] text-slate-600">
            <div className="bg-slate-100/70 p-1.5 rounded-lg text-center font-medium">
              <span className="block text-slate-400 text-[10px]">Mileage</span>
              <span className="truncate block font-semibold text-slate-800">{formattedMileage}</span>
            </div>
            <div className="bg-slate-100/70 p-1.5 rounded-lg text-center font-medium">
              <span className="block text-slate-400 text-[10px]">Fuel</span>
              <span className="truncate block font-semibold text-slate-800">{vehicle.fuelType}</span>
            </div>
            <div className="bg-slate-100/70 p-1.5 rounded-lg text-center font-medium">
              <span className="block text-slate-400 text-[10px]">Power</span>
              <span className="truncate block font-semibold text-slate-800">{vehicle.powerHp} HP</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => navigateToVehicle(vehicle.id)}
            className="flex-1 py-2 px-3 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
