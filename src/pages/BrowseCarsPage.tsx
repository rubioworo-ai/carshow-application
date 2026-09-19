import React, { useState, useMemo } from 'react';
import { 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Car, 
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { vehicleService } from '../services/vehicleService';
import { VehicleCard } from '../components/VehicleCard';
import { SearchFilters } from '../components/SearchFilters';
import { FilterState, SortOption, FuelType, BodyType, TransmissionType, DriveType, Vehicle } from '../types';

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  make: 'All Makes',
  model: 'All Models',
  minYear: 2018,
  maxYear: 2025,
  minPrice: 15000,
  maxPrice: 150000,
  minMileage: 0,
  maxMileage: 100000,
  fuelTypes: [],
  transmissions: [],
  bodyTypes: [],
  driveTypes: [],
  condition: 'All',
  location: 'All Locations',
  sortBy: 'newest',
};

export const BrowseCarsPage: React.FC = () => {
  const { globalSearchFilter } = useApp();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    searchQuery: globalSearchFilter.query || '',
    make: globalSearchFilter.make || 'All Makes',
    bodyTypes: globalSearchFilter.bodyType ? [globalSearchFilter.bodyType as BodyType] : [],
    maxPrice: globalSearchFilter.maxPrice || 150000,
    fuelTypes: globalSearchFilter.fuelType ? [globalSearchFilter.fuelType as FuelType] : []
  }));

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const filteredVehicles = useMemo(() => {
    return vehicleService.filter(filters);
  }, [filters]);

  const activeFilterTags = useMemo(() => {
    const tags: { label: string; onRemove: () => void }[] = [];

    if (filters.searchQuery) {
      tags.push({
        label: `"${filters.searchQuery}"`,
        onRemove: () => setFilters({ ...filters, searchQuery: '' })
      });
    }
    if (filters.make && filters.make !== 'All Makes') {
      tags.push({
        label: `Make: ${filters.make}`,
        onRemove: () => setFilters({ ...filters, make: 'All Makes', model: 'All Models' })
      });
    }
    if (filters.model && filters.model !== 'All Models') {
      tags.push({
        label: `Model: ${filters.model}`,
        onRemove: () => setFilters({ ...filters, model: 'All Models' })
      });
    }
    if (filters.condition && filters.condition !== 'All') {
      tags.push({
        label: `Condition: ${filters.condition}`,
        onRemove: () => setFilters({ ...filters, condition: 'All' })
      });
    }
    if (filters.maxPrice < 150000) {
      tags.push({
        label: `Max €${filters.maxPrice.toLocaleString('de-DE')}`,
        onRemove: () => setFilters({ ...filters, maxPrice: 150000 })
      });
    }
    if (filters.maxMileage < 100000) {
      tags.push({
        label: `Max ${filters.maxMileage.toLocaleString('de-DE')} km`,
        onRemove: () => setFilters({ ...filters, maxMileage: 100000 })
      });
    }
    filters.fuelTypes.forEach((fuel: FuelType) => {
      tags.push({
        label: fuel,
        onRemove: () => setFilters({ ...filters, fuelTypes: filters.fuelTypes.filter((f: FuelType) => f !== fuel) })
      });
    });
    filters.bodyTypes.forEach((body: BodyType) => {
      tags.push({
        label: body,
        onRemove: () => setFilters({ ...filters, bodyTypes: filters.bodyTypes.filter((b: BodyType) => b !== body) })
      });
    });
    filters.transmissions.forEach((trans: TransmissionType) => {
      tags.push({
        label: trans,
        onRemove: () => setFilters({ ...filters, transmissions: filters.transmissions.filter((t: TransmissionType) => t !== trans) })
      });
    });
    filters.driveTypes.forEach((drive: DriveType) => {
      tags.push({
        label: drive,
        onRemove: () => setFilters({ ...filters, driveTypes: filters.driveTypes.filter((d: DriveType) => d !== drive) })
      });
    });
    if (filters.location && filters.location !== 'All Locations') {
      tags.push({
        label: `Location: ${filters.location}`,
        onRemove: () => setFilters({ ...filters, location: 'All Locations' })
      });
    }

    return tags;
  }, [filters, setFilters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Browse Vehicles
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore {filteredVehicles.length} certified vehicles matching your exact specifications.
            </p>
          </div>

          {/* Sort & View Controls */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 hidden sm:inline">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as SortOption })}
                className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="featured">Featured / Curated</option>
                <option value="newest">Recently Listed</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="mileage-asc">Mileage: Lowest First</option>
                <option value="year-desc">Year: Newest First</option>
              </select>
            </div>

            {/* Layout Toggle (Grid / List) */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setLayout('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  layout === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  layout === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFilterTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-200/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active:
            </span>
            {activeFilterTags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg"
              >
                <span>{tag.label}</span>
                <button
                  onClick={tag.onRemove}
                  className="hover:text-blue-900 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-slate-500 hover:text-blue-600 ml-2 underline underline-offset-4"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout (Sidebar + Results) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Search & Filters Sidebar */}
        <SearchFilters
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          totalResults={filteredVehicles.length}
        />

        {/* Results Container */}
        <div className="flex-1 w-full">
          {filteredVehicles.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                No Vehicles Match Your Current Filters
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                Try widening your price range, clearing specific transmission or powertrain constraints, or searching across all European dealership hubs.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-md shadow-blue-600/20"
              >
                <RotateCcw className="w-4 h-4" /> Reset All Filters
              </button>
            </div>
          ) : (
            /* Vehicle List or Grid */
            <div
              className={
                layout === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredVehicles.map((vehicle: Vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} layout={layout} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
