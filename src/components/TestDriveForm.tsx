import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Car, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  MapPin,
  FileCheck
} from 'lucide-react';
import { Vehicle } from '../types';
import { useApp } from '../context/AppContext';
import { vehicleService } from '../services/vehicleService';
import { dealerService } from '../services/dealerService';
import { bookingService } from '../services/bookingService';

interface TestDriveFormProps {
  preselectedVehicleId?: string;
  onSuccess?: () => void;
}

const TIME_SLOTS = [
  '09:30 - 10:30',
  '11:00 - 12:00',
  '13:30 - 14:30',
  '15:00 - 16:00',
  '16:30 - 17:30',
  '18:00 - 19:00'
];

export const TestDriveForm: React.FC<TestDriveFormProps> = ({
  preselectedVehicleId,
  onSuccess
}) => {
  const { user, addToast, setCurrentPage } = useApp();
  const allVehicles = vehicleService.getAll().filter(v => v.status === 'available');

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    preselectedVehicleId || allVehicles[0]?.id || ''
  );
  
  // Available upcoming dates (next 10 days excluding Sundays)
  const availableDates: { dateStr: string; label: string; dayName: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= 12; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) { // skip Sunday
      availableDates.push({
        dateStr: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        dayName: d.toLocaleDateString('en-GB', { weekday: 'short' })
      });
    }
  }

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]?.dateStr || '');
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[1]);
  
  // Customer details
  const [customerName, setCustomerName] = useState(user.name);
  const [customerEmail, setCustomerEmail] = useState(user.email);
  const [customerPhone, setCustomerPhone] = useState(user.phone);
  const [driversLicense, setDriversLicense] = useState('D-B89210492');
  const [notes, setNotes] = useState('');
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const selectedVehicle = allVehicles.find(v => v.id === selectedVehicleId) || allVehicles[0];
  const dealer = selectedVehicle ? dealerService.getById(selectedVehicle.dealerId) : undefined;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      addToast({
        type: 'warning',
        title: 'Missing Details',
        message: 'Please provide complete contact information for test-drive insurance authorization.'
      });
      return;
    }

    const booking = bookingService.addBooking({
      vehicleId: selectedVehicle.id,
      vehicleName: `${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.variant || ''}`.trim(),
      vehiclePrice: selectedVehicle.price,
      vehicleImage: selectedVehicle.images[0],
      dealerId: selectedVehicle.dealerId,
      dealerName: dealer ? dealer.name : 'Authorized AutoMarket Partner',
      dealerCity: dealer ? dealer.address.city : selectedVehicle.location,
      date: selectedDate,
      timeSlot: selectedTime,
      customerName,
      customerEmail,
      customerPhone,
      driversLicenseNumber: driversLicense,
      notes,
      status: 'confirmed'
    });

    setConfirmedBookingId(booking.id);
    setStep(5);
    addToast({
      type: 'success',
      title: 'Test Drive Confirmed',
      message: `Your booking reference is #${booking.id}. The dealer will hold the keys for you.`
    });

    if (onSuccess) onSuccess();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
      {/* Progress header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> VIP Test Drive Experience
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Book Your Official Test Drive
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Experience the performance and comfort on highway and city routes with zero purchase commitment.
            </p>
          </div>

          {step < 5 && (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl self-start">
              <span>Step {step} of 4</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(s => (
                  <span
                    key={s}
                    className={`w-2 h-2 rounded-full ${s <= step ? 'bg-blue-500' : 'bg-slate-700'}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Step 1: Select Vehicle */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Select Your Desired Vehicle</h3>
              <span className="text-xs text-slate-500">{allVehicles.length} available vehicles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[460px] overflow-y-auto pr-1">
              {allVehicles.map(v => {
                const isSelected = v.id === selectedVehicleId;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="aspect-16/10 rounded-lg overflow-hidden bg-slate-100 mb-2">
                        <img src={v.images[0]} alt={v.model} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[11px] font-bold text-blue-600">{v.make}</p>
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{v.model}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{v.variant || v.engineSize}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-xs font-bold">
                      <span>€{v.price.toLocaleString('de-DE')}</span>
                      <span className={`text-[11px] ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                        {isSelected ? '✓ Selected' : 'Choose'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedVehicleId}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                Continue to Date Selection <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Date */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Select Test Drive Date</h3>
              <span className="text-xs text-slate-500">Appointments available Monday to Saturday</span>
            </div>

            {selectedVehicle && (
              <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-4 border border-slate-200">
                <img src={selectedVehicle.images[0]} alt={selectedVehicle.model} className="w-16 h-12 rounded-lg object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedVehicle.make} {selectedVehicle.model}</h4>
                  <p className="text-xs text-slate-500">{dealer ? dealer.name : selectedVehicle.location} • {selectedVehicle.engineSize}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {availableDates.map(item => {
                const isSelected = item.dateStr === selectedDate;
                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span className="text-[11px] uppercase tracking-wider block text-slate-400">{item.dayName}</span>
                    <span className="text-base font-extrabold block my-0.5">{item.label}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">Slots Open</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedDate}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                Choose Time Slot <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select Time Slot */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Select Desired Time Window</h3>
              <span className="text-xs text-slate-500">60-minute accompanied driving session</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {TIME_SLOTS.map(slot => {
                const isSelected = slot === selectedTime;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="text-sm">{slot}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block mb-0.5">Comprehensive Insurance Included</span>
                All test vehicles are backed by full zero-deductible commercial dealer insurance for the duration of the test.
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!selectedTime}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
              >
                Driver Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Customer Details & Confirmation */}
        {step === 4 && (
          <form onSubmit={handleConfirm} className="space-y-6">
            <h3 className="font-bold text-slate-900 text-base">Driver & Contact Information</h3>

            {/* Summary Banner */}
            <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Vehicle:</span>
                <span className="font-bold text-slate-900">{selectedVehicle.make} {selectedVehicle.model}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Date & Time:</span>
                <span className="font-bold text-slate-900">{selectedDate} @ {selectedTime}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Showroom:</span>
                <span className="font-bold text-slate-900">{dealer?.name || selectedVehicle.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Driver's License ID / Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. D-B89210492"
                  value={driversLicense}
                  onChange={(e) => setDriversLicense(e.target.value)}
                  className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Special Requests or Questions
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Would like to test highway overtaking acceleration and child seat fitment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs font-medium py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="submit"
                className="px-7 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-md shadow-emerald-600/20"
              >
                Confirm Test Drive Booking <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 5: Booking Confirmation View */}
        {step === 5 && (
          <div className="py-8 text-center space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Booking Confirmed
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                You're Scheduled for the Road!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Reference ID: <span className="font-mono font-bold text-slate-800">#{confirmedBookingId}</span>
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-slate-200/80">
                <span className="text-slate-500">Vehicle:</span>
                <span className="font-bold text-slate-900">{selectedVehicle?.make} {selectedVehicle?.model}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200/80">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-bold text-slate-900">{selectedDate} ({selectedTime})</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200/80">
                <span className="text-slate-500">Dealership:</span>
                <span className="font-bold text-slate-900">{dealer?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Address:</span>
                <span className="font-bold text-slate-900">{dealer?.address.street}, {dealer?.address.city}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                View in My Appointments
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setConfirmedBookingId(null);
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Book Another Car
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
