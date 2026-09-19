import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Heart, 
  Coins, 
  MessageSquare, 
  Settings, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Trash2,
  Car,
  X,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { bookingService } from '../services/bookingService';
import { valuationService } from '../services/valuationService';
import { vehicleService } from '../services/vehicleService';
import { VehicleCard } from '../components/VehicleCard';
import { Vehicle, ValuationSubmission } from '../types';

export const CustomerDashboardPage: React.FC = () => {
  const { 
    user, 
    updateUser, 
    favoriteVehicles, 
    setCurrentPage, 
    navigateToVehicle, 
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'appointments' | 'favorites' | 'valuations' | 'inquiries' | 'settings'>('appointments');

  // Load user data
  const [appointments, setAppointments] = useState(() => bookingService.getBookings());
  const [valuations, setValuations] = useState(() => valuationService.getValuations());
  const [inquiries, setInquiries] = useState(() => bookingService.getLeads());

  // Edit profile form
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profilePhone, setProfilePhone] = useState(user.phone);
  const [profileCity, setProfileCity] = useState(user.city);

  const handleCancelBooking = (bookingId: string) => {
    bookingService.updateBookingStatus(bookingId, 'cancelled');
    setAppointments(bookingService.getBookings());
    addToast({
      type: 'info',
      title: 'Appointment Cancelled',
      message: 'The dealership has been notified of your cancellation.'
    });
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      city: profileCity
    });
    addToast({
      type: 'success',
      title: 'Profile Saved',
      message: 'Your customer profile and contact preferences have been updated.'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* User Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                  {user.name}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  Verified Driver
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {user.city}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('settings')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" /> Edit Profile
            </button>
            <button
              onClick={() => setCurrentPage('vehicles')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Car className="w-3.5 h-3.5" /> Browse Cars
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div 
            onClick={() => setActiveTab('appointments')}
            className="p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/60 transition-colors"
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Test Drives</span>
            <span className="text-xl font-extrabold text-blue-600">{appointments.length} Scheduled</span>
          </div>

          <div 
            onClick={() => setActiveTab('favorites')}
            className="p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/60 transition-colors"
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Saved Garage</span>
            <span className="text-xl font-extrabold text-red-600">{favoriteVehicles.length} Vehicles</span>
          </div>

          <div 
            onClick={() => setActiveTab('valuations')}
            className="p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/60 transition-colors"
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Trade-In Appraisals</span>
            <span className="text-xl font-extrabold text-emerald-600">{valuations.length} Active</span>
          </div>

          <div 
            onClick={() => setActiveTab('inquiries')}
            className="p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/60 transition-colors"
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Dealer Leads</span>
            <span className="text-xl font-extrabold text-purple-600">{inquiries.length} Inquiries</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold gap-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'appointments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" /> Test Drive Bookings ({appointments.length})
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'favorites' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" /> Saved Vehicles ({favoriteVehicles.length})
        </button>

        <button
          onClick={() => setActiveTab('valuations')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'valuations' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Coins className="w-4 h-4" /> My Valuations ({valuations.length})
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'inquiries' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Messages & Inquiries ({inquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" /> Account Settings
        </button>
      </div>

      {/* Tab 1: Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 text-base">No Test Drive Appointments Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto my-2">
                Choose any car in our showroom inventory and reserve a 60-minute test drive with zero purchase commitment.
              </p>
              <button
                onClick={() => setCurrentPage('test-drive')}
                className="mt-3 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Book a Test Drive
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((app) => (
                <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={app.vehicleImage} alt={app.vehicleName} className="w-16 h-12 rounded-xl object-cover bg-slate-100" />
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          app.status === 'completed' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {app.status}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">{app.vehicleName}</h4>
                        <p className="text-xs text-slate-500">{app.dealerName} ({app.dealerCity})</p>
                      </div>
                    </div>

                    {app.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(app.id)}
                        className="text-xs text-slate-400 hover:text-red-600 transition-colors"
                        title="Cancel Appointment"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 text-slate-700 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-bold">{app.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{app.timeSlot}</span>
                    </div>
                    {app.notes && (
                      <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
                        Notes: "{app.notes}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="text-slate-400">Ref: #{app.id}</span>
                    <button
                      onClick={() => navigateToVehicle(app.vehicleId)}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      View Vehicle Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Vehicles */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favoriteVehicles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 text-base">No Saved Vehicles</h3>
              <p className="text-xs text-slate-500 mt-1">Tap the heart on any vehicle card to monitor cars here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteVehicles.map((v: Vehicle) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Valuations */}
      {activeTab === 'valuations' && (
        <div className="space-y-4">
          {valuations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Coins className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 text-base">No Vehicle Valuations</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto my-2">
                Use our instant valuation engine to get a binding cash purchase quote or trade-in credit for your current car.
              </p>
              <button
                onClick={() => setCurrentPage('sell')}
                className="mt-3 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Appraise My Car
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {valuations.map((val: ValuationSubmission) => (
                <div key={val.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                        {val.year} • {val.condition} Condition
                      </span>
                      <h4 className="font-bold text-slate-900 text-base">{val.make} {val.model}</h4>
                      <p className="text-xs text-slate-500">{val.mileage.toLocaleString('de-DE')} km • {val.fuelType}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Offer Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Direct Cash Offer</span>
                      <span className="text-base font-extrabold text-slate-900">
                        €{val.estimatedValue.toLocaleString('de-DE')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-600 block font-bold">Trade-In Credit (+5%)</span>
                      <span className="text-base font-extrabold text-blue-700">
                        €{val.tradeInBonusValue.toLocaleString('de-DE')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>Appraisal ID: #{val.id}</span>
                    <button
                      onClick={() => setCurrentPage('vehicles')}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Redeem on Inventory →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {inquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 text-base">No Inquiries Sent</h3>
              <p className="text-xs text-slate-500 mt-1">Direct inquiries sent to partner dealers will be archived here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((lead) => (
                <div key={lead.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{lead.vehicleName}</span>
                    <span className="text-[11px] text-slate-400">{lead.createdAt || lead.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{lead.message}"
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Preferred response: <strong className="capitalize text-slate-800">{lead.preferredContact}</strong></span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Transmitted to Dealer
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 mb-4">Edit Profile & Contact Preferences</h3>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Phone
                </label>
                <input
                  type="tel"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={profileCity}
                onChange={(e) => setProfileCity(e.target.value)}
                className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
