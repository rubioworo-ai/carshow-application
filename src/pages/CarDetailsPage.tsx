import React, { useState } from 'react';
import { 
  Heart, 
  Scale, 
  Share2, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  Gauge, 
  Fuel, 
  Zap, 
  Building2, 
  FileText,
  Clock,
  Printer,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { vehicleService } from '../services/vehicleService';
import { dealerService } from '../services/dealerService';
import { VehicleGallery } from '../components/VehicleGallery';
import { FinanceCalculator } from '../components/FinanceCalculator';
import { ContactDealerModal } from '../components/ContactDealerModal';
import { VehicleCard } from '../components/VehicleCard';

export const CarDetailsPage: React.FC = () => {
  const { 
    selectedVehicleId, 
    setCurrentPage, 
    navigateToTestDrive, 
    navigateToDealer,
    toggleFavorite, 
    isFavorite, 
    toggleCompare, 
    isCompared,
    addToast 
  } = useApp();

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'features' | 'finance'>('overview');

  const vehicle = selectedVehicleId ? vehicleService.getById(selectedVehicleId) : null;
  const dealer = vehicle ? dealerService.getById(vehicle.dealerId) : null;
  const similarVehicles = vehicle ? vehicleService.getSimilarVehicles(vehicle.id, 4) : [];

  if (!vehicle) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Vehicle Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">
          The requested vehicle may have been sold or removed from the marketplace.
        </p>
        <button
          onClick={() => setCurrentPage('vehicles')}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Inventory
        </button>
      </div>
    );
  }

  const favorite = isFavorite(vehicle.id);
  const compared = isCompared(vehicle.id);

  const formattedPrice = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(vehicle.price);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'info',
        title: 'Link Copied',
        message: 'Vehicle listing URL copied to your clipboard.'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setCurrentPage('vehicles')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Vehicles
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(vehicle.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              favorite 
                ? 'bg-red-50 text-red-600 border-red-200 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-red-600 text-red-600' : ''}`} />
            <span>{favorite ? 'Saved in Favorites' : 'Save Car'}</span>
          </button>

          <button
            onClick={() => toggleCompare(vehicle.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              compared 
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{compared ? 'In Comparison' : 'Compare'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs"
            title="Share Vehicle"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Top Layout: Gallery & Key Buy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery & Details tabs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <VehicleGallery
            images={vehicle.images}
            vehicleTitle={`${vehicle.make} ${vehicle.model}`}
            condition={vehicle.condition}
            isFeatured={vehicle.isFeatured}
          />

          {/* Key Specs Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Mileage</span>
                <span className="text-xs font-bold text-slate-900">{vehicle.mileage.toLocaleString('de-DE')} km</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <Fuel className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Fuel Type</span>
                <span className="text-xs font-bold text-slate-900">{vehicle.fuelType}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Output</span>
                <span className="text-xs font-bold text-slate-900">{vehicle.powerHp} HP ({vehicle.powerKw} kW)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Inspection</span>
                <span className="text-xs font-bold text-slate-900">150-Pt TÜV Passed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Dealership & Actions Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                <span>{vehicle.year} • {vehicle.bodyType}</span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                  {vehicle.condition}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {vehicle.make} {vehicle.model}
              </h1>

              {vehicle.variant && (
                <p className="text-xs font-semibold text-blue-600 mt-1">
                  {vehicle.variant}
                </p>
              )}
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Total Purchase Price (incl. VAT)</span>
                <span className="text-3xl font-extrabold text-slate-950 tracking-tight">
                  {formattedPrice}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium block">Monthly Installment</span>
                <span className="text-base font-extrabold text-blue-700">
                  from €{vehicle.monthlyEstimate}<span className="text-xs font-normal text-slate-500">/mo</span>
                </span>
              </div>
            </div>

            {/* Quick Guarantees Checklist */}
            <div className="space-y-2 text-xs text-slate-600 py-1">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24-Month EU Powertrain & Battery Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>14-Day / 500 km No-Questions Money-Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Odometer & Accident-Free Service History</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigateToTestDrive(vehicle.id)}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
              >
                <Calendar className="w-4 h-4" /> Book Official Test Drive
              </button>

              <button
                onClick={() => setContactModalOpen(true)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Contact Dealership Team
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('finance-calculator-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Calculate Personalized Financing
              </button>
            </div>

            {/* Dealer Badge Widget */}
            {dealer && (
              <div className="pt-5 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Showroom Partner
                </span>
                <div 
                  onClick={() => navigateToDealer(dealer.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <img src={dealer.logo} alt={dealer.name} className="w-10 h-10 rounded-lg object-cover bg-white" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{dealer.name}</h4>
                      <p className="text-[11px] text-slate-500">{dealer.address.city}, {dealer.address.country}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs for Technical Specs, Features, Overview, and Financing */}
      <div className="space-y-6">
        <div className="flex border-b border-slate-200 text-xs font-bold gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Vehicle Overview & Story
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'specs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Full Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'features' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Equipment & Safety ({vehicle.features.length + vehicle.safetyEquipment.length})
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'finance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Financing & Amortization
          </button>
        </div>

        {/* Tab Content: Overview */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Vehicle Overview</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                {vehicle.description}
              </p>
            </div>

            {/* Key highlights checklist */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Certification & History Verification
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Verified Odometer:</span>
                    Original electronic control unit (ECU) readouts fully match physical service records.
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Accident-Free Integrity:</span>
                    Body paint thickness gauges show factory original tolerances across all structural pillars.
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">TÜV / General Inspection:</span>
                    Valid for minimum 18 months before next mandatory technical roadworthiness audit.
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">High-Voltage Battery State (if EV):</span>
                    State of Health (SoH) independently laboratory certified above 92%.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Technical Specifications Grid */}
        {activeTab === 'specs' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8">
            <h3 className="text-base font-bold text-slate-900 mb-4">Complete Technical Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">VIN Number</span>
                <span className="font-mono font-bold text-slate-900">{vehicle.vin}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Model Year</span>
                <span className="font-bold text-slate-900">{vehicle.year}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Odometer</span>
                <span className="font-bold text-slate-900">{vehicle.mileage.toLocaleString('de-DE')} km</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Engine / Battery Size</span>
                <span className="font-bold text-slate-900">{vehicle.engineSize}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Power Output</span>
                <span className="font-bold text-slate-900">{vehicle.powerHp} HP ({vehicle.powerKw} kW)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Transmission</span>
                <span className="font-bold text-slate-900">{vehicle.transmission}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Drivetrain</span>
                <span className="font-bold text-slate-900">{vehicle.driveType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Fuel Type</span>
                <span className="font-bold text-slate-900">{vehicle.fuelType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Fuel Economy (WLTP)</span>
                <span className="font-bold text-slate-900">{vehicle.fuelEconomy}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">CO2 Emissions</span>
                <span className="font-bold text-slate-900">{vehicle.co2Emissions || '0 g/km (Pure EV)'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Exterior Finish</span>
                <span className="font-bold text-slate-900">{vehicle.exteriorColor}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Interior Upholstery</span>
                <span className="font-bold text-slate-900">{vehicle.interiorColor}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Seating Capacity</span>
                <span className="font-bold text-slate-900">{vehicle.seats} Seats</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Doors</span>
                <span className="font-bold text-slate-900">{vehicle.doors} Doors</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Hub Location</span>
                <span className="font-bold text-slate-900">{vehicle.location}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Features & Equipment */}
        {activeTab === 'features' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Included Convenience & Tech Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {vehicle.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 mb-3">Safety & Driver Assistance Systems</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {vehicle.safetyEquipment.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Financing Calculator */}
        <div id="finance-calculator-section">
          {activeTab === 'finance' && (
            <FinanceCalculator
              initialPrice={vehicle.price}
              vehicleTitle={`${vehicle.make} ${vehicle.model}`}
              onApply={() => {
                addToast({
                  type: 'success',
                  title: 'Financing Pre-Approval Submitted',
                  message: `Pre-approval application for ${vehicle.make} ${vehicle.model} transmitted to our bank partner.`
                });
              }}
            />
          )}
        </div>
      </div>

      {/* Similar Vehicles Carousel / Section */}
      {similarVehicles.length > 0 && (
        <div className="pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Similar Vehicles You Might Like</h3>
              <p className="text-xs text-slate-500">Comparable models in the same segment and price range.</p>
            </div>
            <button
              onClick={() => setCurrentPage('vehicles')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Explore All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarVehicles.map((v: import('../types').Vehicle) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      )}

      {/* Contact Dealer Modal */}
      <ContactDealerModal
        vehicle={vehicle}
        dealer={dealer || undefined}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
};
