import React from 'react';
import { Heart, Scale, ArrowRight, Trash2, Bell, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VehicleCard } from '../components/VehicleCard';

import { Vehicle } from '../types';

export const FavoritesPage: React.FC = () => {
  const { 
    favoriteVehicles, 
    setCurrentPage, 
    toggleCompare, 
    clearFavorites, 
    addToast 
  } = useApp();

  const totalValue = favoriteVehicles.reduce((sum: number, v: Vehicle) => sum + v.price, 0);
  const formattedTotal = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(totalValue);

  const handleCompareAll = () => {
    favoriteVehicles.slice(0, 4).forEach((v: Vehicle) => {
      toggleCompare(v.id);
    });
    setCurrentPage('compare');
  };

  const handlePriceAlerts = () => {
    addToast({
      type: 'info',
      title: 'Price Drop Alerts Active',
      message: 'You will receive notifications if any of your saved vehicles receive price reductions.'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-red-600" /> Saved Garage
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            My Favorite Vehicles ({favoriteVehicles.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track vehicles you are considering, compare features, and monitor dealer price adjustments.
          </p>
        </div>

        {favoriteVehicles.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePriceAlerts}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Bell className="w-3.5 h-3.5 text-blue-600" /> Alerts Enabled
            </button>
            <button
              onClick={handleCompareAll}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Scale className="w-3.5 h-3.5" /> Compare All
            </button>
          </div>
        )}
      </div>

      {favoriteVehicles.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Your Garage is Empty</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
            Click the heart icon on any vehicle card to save cars here for easy comparison, price tracking, and test-drive scheduling.
          </p>
          <button
            onClick={() => setCurrentPage('vehicles')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
          >
            Explore Vehicles <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="space-y-6">
          {/* Summary bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-slate-400 font-medium">Saved Vehicles:</span>
                <span className="font-bold text-slate-900 ml-1.5">{favoriteVehicles.length} cars</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Combined Catalog Value:</span>
                <span className="font-bold text-slate-900 ml-1.5">{formattedTotal}</span>
              </div>
            </div>

            <button
              onClick={clearFavorites}
              className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All Favorites
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteVehicles.map((vehicle: Vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
