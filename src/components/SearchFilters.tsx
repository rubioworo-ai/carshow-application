import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  X, 
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { FilterState, FuelType, TransmissionType, BodyType, DriveType } from '../types';
import { vehicleService } from '../services/vehicleService';

interface SearchFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

const ALL_FUEL_TYPES: FuelType[] = ['Petrol', 'Diesel', 'Hybrid', 'Plug-in Hybrid', 'Electric'];
const ALL_TRANSMISSIONS: TransmissionType[] = ['Automatic', 'Manual', 'Dual-Clutch', 'Single-Speed'];
const ALL_BODY_TYPES: BodyType[] = ['SUV', 'Sedan', 'Estate / Wagon', 'Coupe', 'Hatchback'];
const ALL_DRIVE_TYPES: DriveType[] = ['AWD', 'FWD', 'RWD', '4WD'];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const availableMakes = vehicleService.getAvailableMakes();
  const availableModels = vehicleService.getModelsForMake(filters.make);

  const handleMakeChange = (make: string) => {
    onChange({
      ...filters,
      make,
      model: 'All Models'
    });
  };

  const toggleFuelType = (type: FuelType) => {
    const exists = filters.fuelTypes.includes(type);
    const updated = exists 
      ? filters.fuelTypes.filter(t => t !== type) 
      : [...filters.fuelTypes, type];
    onChange({ ...filters, fuelTypes: updated });
  };

  const toggleTransmission = (trans: TransmissionType) => {
    const exists = filters.transmissions.includes(trans);
    const updated = exists 
      ? filters.transmissions.filter(t => t !== trans) 
      : [...filters.transmissions, trans];
    onChange({ ...filters, transmissions: updated });
  };

  const toggleBodyType = (body: BodyType) => {
    const exists = filters.bodyTypes.includes(body);
    const updated = exists 
      ? filters.bodyTypes.filter(b => b !== body) 
      : [...filters.bodyTypes, body];
    onChange({ ...filters, bodyTypes: updated });
  };

  const toggleDriveType = (drive: DriveType) => {
    const exists = filters.driveTypes.includes(drive);
    const updated = exists 
      ? filters.driveTypes.filter(d => d !== drive) 
      : [...filters.driveTypes, drive];
    onChange({ ...filters, driveTypes: updated });
  };

  const activeFilterCount = 
    (filters.searchQuery ? 1 : 0) +
    (filters.make && filters.make !== 'All Makes' ? 1 : 0) +
    (filters.model && filters.model !== 'All Models' ? 1 : 0) +
    (filters.condition && filters.condition !== 'All' ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 150000 ? 1 : 0) +
    (filters.minYear > 2020 || filters.maxYear < 2025 ? 1 : 0) +
    (filters.maxMileage < 100000 ? 1 : 0) +
    filters.fuelTypes.length +
    filters.transmissions.length +
    filters.bodyTypes.length +
    filters.driveTypes.length +
    (filters.location && filters.location !== 'All Locations' ? 1 : 0);

  const FilterFormContent = () => (
    <div className="space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset All
          </button>
        )}
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Keyword Search
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search make, model, trim..."
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChange({ ...filters, searchQuery: '' })}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Condition (New/Used/CPO) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Vehicle Condition
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium">
          {['All', 'New', 'Certified Pre-Owned', 'Used'].map(cond => (
            <button
              key={cond}
              onClick={() => onChange({ ...filters, condition: cond })}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                filters.condition === cond
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* Make & Model */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Make
          </label>
          <select
            value={filters.make}
            onChange={(e) => handleMakeChange(e.target.value)}
            className="w-full text-xs py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden font-medium"
          >
            <option value="All Makes">All Makes</option>
            {availableMakes.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {filters.make && filters.make !== 'All Makes' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Model
            </label>
            <select
              value={filters.model}
              onChange={(e) => onChange({ ...filters, model: e.target.value })}
              className="w-full text-xs py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden font-medium"
            >
              <option value="All Models">All Models ({filters.make})</option>
              {availableModels.map(mod => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Price Range
          </label>
          <span className="text-xs font-bold text-blue-700">
            up to €{filters.maxPrice.toLocaleString('de-DE')}
          </span>
        </div>
        <input
          type="range"
          min="15000"
          max="130000"
          step="2500"
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>€15.000</span>
          <span>€75.000</span>
          <span>€130.000+</span>
        </div>
      </div>

      {/* Maximum Mileage */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Max Mileage
          </label>
          <span className="text-xs font-bold text-slate-800">
            {filters.maxMileage >= 100000 ? 'Any Mileage' : `${filters.maxMileage.toLocaleString('de-DE')} km`}
          </span>
        </div>
        <input
          type="range"
          min="10000"
          max="100000"
          step="5000"
          value={filters.maxMileage}
          onChange={(e) => onChange({ ...filters, maxMileage: Number(e.target.value) })}
          className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>10k km</span>
          <span>50k km</span>
          <span>Any</span>
        </div>
      </div>

      {/* Fuel Type Pills */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Fuel & Powertrain
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_FUEL_TYPES.map(fuel => {
            const active = filters.fuelTypes.includes(fuel);
            return (
              <button
                key={fuel}
                onClick={() => toggleFuelType(fuel)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-all flex items-center gap-1.5 ${
                  active 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {active && <Check className="w-3 h-3" />}
                {fuel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body Types */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Body Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_BODY_TYPES.map(body => {
            const active = filters.bodyTypes.includes(body);
            return (
              <button
                key={body}
                onClick={() => toggleBodyType(body)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-all flex items-center gap-1.5 ${
                  active 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {active && <Check className="w-3 h-3" />}
                {body}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Transmission
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {ALL_TRANSMISSIONS.map(trans => {
            const active = filters.transmissions.includes(trans);
            return (
              <button
                key={trans}
                onClick={() => toggleTransmission(trans)}
                className={`text-xs p-2 rounded-lg font-medium border transition-all flex items-center justify-between ${
                  active 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{trans}</span>
                {active && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drive Type */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Drivetrain
        </label>
        <div className="grid grid-cols-4 gap-1">
          {ALL_DRIVE_TYPES.map(drive => {
            const active = filters.driveTypes.includes(drive);
            return (
              <button
                key={drive}
                onClick={() => toggleDriveType(drive)}
                className={`text-xs py-1.5 text-center rounded-md font-bold border transition-all ${
                  active 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {drive}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Dealer Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
          className="w-full text-xs py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden font-medium"
        >
          <option value="All Locations">All European Hubs</option>
          <option value="Munich">Munich, Germany</option>
          <option value="Stuttgart">Stuttgart, Germany</option>
          <option value="Paris">Paris, France</option>
          <option value="London">London, UK</option>
          <option value="Amsterdam">Amsterdam, Netherlands</option>
          <option value="Gothenburg">Gothenburg, Sweden</option>
          <option value="Vienna">Vienna, Austria</option>
          <option value="Madrid">Madrid, Spain</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
        <FilterFormContent />
      </div>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-800 flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filter Inventory</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
          <span className="text-slate-500 font-medium">({totalResults} matches)</span>
        </button>
      </div>

      {/* Mobile Modal Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="w-full max-w-sm bg-white h-full overflow-y-auto p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-base">Vehicle Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterFormContent />
            </div>

            <div className="pt-6 border-t border-slate-200 sticky bottom-0 bg-white">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md"
              >
                View {totalResults} Matching Vehicles
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
