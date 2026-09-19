import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  Clock, 
  Car, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Users, 
  Search, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { vehicleService } from '../services/vehicleService';
import { bookingService } from '../services/bookingService';
import { valuationService } from '../services/valuationService';
import { dealerService } from '../services/dealerService';
import { Vehicle, TestDriveBooking, ValuationSubmission } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { addToast, setCurrentPage } = useApp();

  const [vehicles, setVehicles] = useState(() => vehicleService.getAll());
  const [bookings, setBookings] = useState(() => bookingService.getBookings());
  const [valuations, setValuations] = useState(() => valuationService.getValuations());
  const dealers = dealerService.getAll();

  const [activeTab, setActiveTab] = useState<'inventory' | 'bookings' | 'valuations'>('inventory');
  const [searchInventory, setSearchInventory] = useState('');

  // Add Vehicle Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMake, setNewMake] = useState('Porsche');
  const [newModel, setNewModel] = useState('Taycan 4S');
  const [newYear, setNewYear] = useState(2023);
  const [newPrice, setNewPrice] = useState(89900);
  const [newMileage, setNewMileage] = useState(19500);
  const [newFuelType, setNewFuelType] = useState<'Petrol' | 'Diesel' | 'Hybrid' | 'Plug-in Hybrid' | 'Electric'>('Electric');
  const [newTransmission, setNewTransmission] = useState<'Automatic' | 'Manual' | 'Dual-Clutch' | 'Single-Speed'>('Single-Speed');
  const [newBodyType, setNewBodyType] = useState<'SUV' | 'Sedan' | 'Estate / Wagon' | 'Coupe' | 'Hatchback'>('Sedan');
  const [newPowerHp, setNewPowerHp] = useState(530);
  const [newLocation, setNewLocation] = useState('Munich, Germany');
  const [newCondition, setNewCondition] = useState<'New' | 'Certified Pre-Owned' | 'Used'>('Certified Pre-Owned');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80');

  // Edit Vehicle Price Modal
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<Vehicle['status']>('available');

  const filteredVehicles = vehicles.filter(v => 
    searchInventory === '' ||
    `${v.make} ${v.model}`.toLowerCase().includes(searchInventory.toLowerCase()) ||
    v.vin.toLowerCase().includes(searchInventory.toLowerCase())
  );

  const totalInventoryValue = vehicles.reduce((sum, v) => sum + v.price, 0);

  const handleDeleteVehicle = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from active inventory?`)) {
      vehicleService.delete(id);
      setVehicles(vehicleService.getAll());
      addToast({
        type: 'info',
        title: 'Vehicle Removed',
        message: `${name} has been removed from marketplace inventory.`
      });
    }
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const created = vehicleService.addVehicle({
      make: newMake,
      model: newModel,
      year: newYear,
      price: newPrice,
      mileage: newMileage,
      fuelType: newFuelType,
      transmission: newTransmission,
      bodyType: newBodyType,
      powerHp: newPowerHp,
      powerKw: Math.round(newPowerHp * 0.7457),
      engineSize: newFuelType === 'Electric' ? '93.4 kWh Dual Motor' : '3.0L Turbocharged',
      driveType: 'AWD',
      fuelEconomy: newFuelType === 'Electric' ? '20.4 kWh/100km' : '7.8 L/100km',
      co2Emissions: newFuelType === 'Electric' ? '0 g/km' : '178 g/km',
      exteriorColor: 'Frozen Blue Metallic',
      interiorColor: 'Black Leather',
      doors: 4,
      seats: 5,
      vin: `WPOZZZ${Math.random().toString(36).substring(2, 8).toUpperCase()}98`,
      condition: newCondition,
      location: newLocation,
      dealerId: dealers[0]?.id || 'dealer-1',
      monthlyEstimate: Math.round(newPrice / 85),
      images: [newImage],
      features: ['Porsche Active Suspension', '16.8" Curved Display', 'Panoramic Roof', 'Heat Pump'],
      safetyEquipment: ['Collision Warning', 'Lane Keep Assist', 'Surround View 360', '8 Airbags'],
      description: `Pristine ${newMake} ${newModel} with low mileage and complete service history. Inspected and approved under AutoMarket standard.`,
      status: 'available',
      isFeatured: true
    });

    setVehicles(vehicleService.getAll());
    setIsAddModalOpen(false);
    addToast({
      type: 'success',
      title: 'Vehicle Published',
      message: `${created.make} ${created.model} is now live in marketplace inventory.`
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      vehicleService.update(editingVehicle.id, {
        price: editPrice,
        status: editStatus,
        monthlyEstimate: Math.round(editPrice / 85)
      });
      setVehicles(vehicleService.getAll());
      setEditingVehicle(null);
      addToast({
        type: 'success',
        title: 'Listing Updated',
        message: 'Vehicle price and status have been updated.'
      });
    }
  };

  const handleUpdateBookingStatus = (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    bookingService.updateBookingStatus(bookingId, status);
    setBookings(bookingService.getBookings());
    addToast({
      type: 'info',
      title: 'Booking Updated',
      message: `Appointment #${bookingId} marked as ${status}.`
    });
  };

  const handleUpdateValuationStatus = (id: string, status: 'pending' | 'reviewed' | 'completed') => {
    valuationService.updateStatus(id, status);
    setValuations(valuationService.getValuations());
    addToast({
      type: 'info',
      title: 'Valuation Status Updated',
      message: `Appraisal #${id} status changed to ${status}.`
    });
  };

  const handleResetData = () => {
    if (window.confirm('Reset all vehicle inventory and test drive demo data to defaults?')) {
      vehicleService.resetToDefaults();
      bookingService.resetToDefaults();
      valuationService.resetToDefaults();
      setVehicles(vehicleService.getAll());
      setBookings(bookingService.getBookings());
      setValuations(valuationService.getValuations());
      addToast({
        type: 'success',
        title: 'Data Restored',
        message: 'Marketplace database restored to 32 verified stock vehicles.'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Dealership Management Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            AutoMarket Admin & Inventory Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage live showroom vehicle listings, customer test drive appointments, trade-in valuations, and dealer hubs.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleResetData}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Reset Mock Data"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Data
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>
      </div>

      {/* KPI Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">Total Inventory</span>
            <Car className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{vehicles.length} Vehicles</p>
          <p className="text-xs text-slate-500 mt-1">
            Market Value: <strong className="text-slate-800">€{(totalInventoryValue / 1000000).toFixed(2)}M</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">Test Drive Bookings</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{bookings.length} Bookings</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            {bookings.filter(b => b.status === 'confirmed').length} Active Appointments
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">Valuation Leads</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{valuations.length} Requests</p>
          <p className="text-xs text-slate-500 mt-1">
            {valuations.filter(v => v.status === 'pending').length} Awaiting Inspection
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">Dealership Network</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{dealers.length} Showrooms</p>
          <p className="text-xs text-purple-600 font-semibold mt-1">
            Across 5 EU Metros
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold gap-6">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'inventory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Car className="w-4 h-4" /> Vehicle Inventory Management ({vehicles.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'bookings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" /> Test Drive Pipeline ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('valuations')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'valuations' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Trade-In & Cash Valuations ({valuations.length})
        </button>
      </div>

      {/* Tab 1: Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter by make, model, or VIN..."
                value={searchInventory}
                onChange={(e) => setSearchInventory(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredVehicles.length} of {vehicles.length} listings
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="p-3.5">Vehicle</th>
                    <th className="p-3.5">Specs</th>
                    <th className="p-3.5">Price / Finance</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={v.images[0]}
                            alt={v.model}
                            className="w-12 h-9 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{v.make} {v.model}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{v.vin}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div>
                          <p className="font-semibold">{v.year} • {v.fuelType}</p>
                          <p className="text-[11px] text-slate-500">{v.mileage.toLocaleString('de-DE')} km • {v.powerHp} HP</p>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div>
                          <p className="font-extrabold text-slate-900">€{v.price.toLocaleString('de-DE')}</p>
                          <p className="text-[11px] text-blue-600 font-medium">€{v.monthlyEstimate}/mo</p>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          v.status === 'available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          v.status === 'reserved' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {v.location.split(',')[0]}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingVehicle(v);
                              setEditPrice(v.price);
                              setEditStatus(v.status);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                            title="Edit Vehicle"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(v.id, `${v.make} ${v.model}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Test Drive Pipeline */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="p-3.5">Booking Ref</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Vehicle</th>
                  <th className="p-3.5">Slot / Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60">
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      #{b.id}
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{b.customerName}</p>
                      <p className="text-[11px] text-slate-400">{b.customerEmail} • {b.customerPhone}</p>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900">
                      {b.vehicleName}
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold">{b.date}</p>
                      <p className="text-[11px] text-slate-500">{b.timeSlot}</p>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        b.status === 'completed' ? 'bg-blue-50 text-blue-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                              className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                              className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Valuations */}
      {activeTab === 'valuations' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="p-3.5">Appraisal Ref</th>
                  <th className="p-3.5">Seller</th>
                  <th className="p-3.5">Car & Mileage</th>
                  <th className="p-3.5">Valuation Offer</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {valuations.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60">
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      #{v.id}
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{v.customerName}</p>
                      <p className="text-[11px] text-slate-400">{v.customerPhone}</p>
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{v.year} {v.make} {v.model}</p>
                      <p className="text-[11px] text-slate-500">{v.mileage.toLocaleString('de-DE')} km • {v.condition}</p>
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">€{v.estimatedValue.toLocaleString('de-DE')}</p>
                      <p className="text-[11px] text-blue-600">Trade credit: €{v.tradeInBonusValue.toLocaleString('de-DE')}</p>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {v.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleUpdateValuationStatus(v.id, 'completed')}
                        className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold"
                      >
                        Mark Completed
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Add New Vehicle to Inventory</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Make</label>
                  <input
                    type="text"
                    required
                    value={newMake}
                    onChange={(e) => setNewMake(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Model & Trim</label>
                  <input
                    type="text"
                    required
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Year</label>
                  <input
                    type="number"
                    required
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full py-2 px-3 bg-slate-50 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Price (€)</label>
                  <input
                    type="number"
                    required
                    step="500"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full py-2 px-3 bg-slate-50 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Mileage (km)</label>
                  <input
                    type="number"
                    required
                    step="1000"
                    value={newMileage}
                    onChange={(e) => setNewMileage(Number(e.target.value))}
                    className="w-full py-2 px-3 bg-slate-50 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Fuel Type</label>
                  <select
                    value={newFuelType}
                    onChange={(e) => setNewFuelType(e.target.value as any)}
                    className="w-full py-2 px-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Body Style</label>
                  <select
                    value={newBodyType}
                    onChange={(e) => setNewBodyType(e.target.value as any)}
                    className="w-full py-2 px-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Estate / Wagon">Estate / Wagon</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Hatchback">Hatchback</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Condition</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as any)}
                    className="w-full py-2 px-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                    <option value="New">Brand New</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Main Image URL</label>
                <input
                  type="url"
                  required
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md"
                >
                  Add Vehicle to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                Edit {editingVehicle.make} {editingVehicle.model}
              </h3>
              <button
                onClick={() => setEditingVehicle(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Listing Price (€)
                </label>
                <input
                  type="number"
                  step="500"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Marketplace Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 font-semibold"
                >
                  <option value="available">Available (Live on Catalog)</option>
                  <option value="reserved">Reserved (Deposit Placed)</option>
                  <option value="sold">Sold (Archived)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
