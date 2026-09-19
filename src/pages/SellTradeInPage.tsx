import React, { useState } from 'react';
import { 
  Coins, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Car, 
  Upload, 
  TrendingUp, 
  HelpCircle,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { valuationService } from '../services/valuationService';
import { vehicleService } from '../services/vehicleService';

export const SellTradeInPage: React.FC = () => {
  const { user, addToast, setCurrentPage } = useApp();
  const availableMakes = vehicleService.getAvailableMakes();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [make, setMake] = useState('BMW');
  const [model, setModel] = useState('3 Series');
  const [year, setYear] = useState(2021);
  const [mileage, setMileage] = useState(48000);
  const [condition, setCondition] = useState<'Excellent' | 'Good' | 'Fair' | 'Poor'>('Excellent');
  const [fuelType, setFuelType] = useState('Hybrid');
  const [serviceHistory, setServiceHistory] = useState('Full Dealership Record');
  const [previousOwners, setPreviousOwners] = useState(1);
  const [vinNumber, setVinNumber] = useState('WBA53AY05NFP98231');
  const [notes, setNotes] = useState('');

  // Contact info
  const [customerName, setCustomerName] = useState(user.name);
  const [customerEmail, setCustomerEmail] = useState(user.email);
  const [customerPhone, setCustomerPhone] = useState(user.phone);

  // Result state
  const [valuationResult, setValuationResult] = useState<{
    id: string;
    estimatedValue: number;
    tradeInBonusValue: number;
  } | null>(null);

  const calculateEstimate = () => {
    return valuationService.estimateValue({
      make,
      model,
      year,
      mileage,
      condition
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const estimates = calculateEstimate();

    const submission = valuationService.submitValuation({
      make,
      model,
      year,
      mileage,
      condition,
      fuelType,
      vinNumber,
      serviceHistory,
      previousOwners,
      notes,
      estimatedValue: estimates.estimatedValue,
      tradeInBonusValue: estimates.tradeInBonusValue,
      customerName,
      customerEmail,
      customerPhone,
      status: 'pending'
    });

    setValuationResult({
      id: submission.id,
      estimatedValue: estimates.estimatedValue,
      tradeInBonusValue: estimates.tradeInBonusValue
    });
    setStep(4);

    addToast({
      type: 'success',
      title: 'Valuation Prepared',
      message: `Your verified vehicle offer has been calculated and saved to your dashboard.`
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <Coins className="w-3.5 h-3.5" /> Instant European Market Valuation
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
          Sell or Trade-In Your Vehicle
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Get a real, data-grounded cash purchase offer in 2 minutes. Free home pickup, zero hidden transaction fees, or apply your trade-in credit for an extra 5% bonus.
        </p>
      </div>

      {/* Main Multi-Step Wizard Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Progress Bar Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xs">
              {step}
            </span>
            <div>
              <h4 className="font-bold text-sm">
                {step === 1 && 'Vehicle Model & Odometer'}
                {step === 2 && 'Condition & Service History'}
                {step === 3 && 'Contact Details & Verification'}
                {step === 4 && 'Your Guaranteed Valuation Offer'}
              </h4>
              <p className="text-[11px] text-slate-400">Step {step} of 4</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-1.5 w-10 rounded-full transition-all ${
                  s <= step ? 'bg-blue-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Step 1: Vehicle Specs */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Vehicle Make *
                  </label>
                  <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                  >
                    {availableMakes.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Model & Series *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 330e M Sport / A4 Avant"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                  >
                  </input>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Registration Year ({year})
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                  >
                    {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current Mileage (km) *
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Fuel & Powertrain
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    VIN / Chassis Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={vinNumber}
                    onChange={(e) => setVinNumber(e.target.value)}
                    className="w-full text-xs font-mono py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden uppercase"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                >
                  Continue to Condition Check <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Condition & Maintenance */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Overall Vehicle Condition
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'Excellent', title: 'Excellent', desc: 'No dents, scratches, or wear. Clean rims.' },
                    { id: 'Good', title: 'Good', desc: 'Minor cosmetic stone chips, normal wear.' },
                    { id: 'Fair', title: 'Fair', desc: 'Small bumper scuffs, requires minor detail.' },
                    { id: 'Poor', title: 'Poor', desc: 'Noticeable dents, requires paint work.' },
                  ].map(c => (
                    <div
                      key={c.id}
                      onClick={() => setCondition(c.id as any)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        condition === c.id
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="font-bold text-slate-900 text-xs block">{c.title}</span>
                      <span className="text-[11px] text-slate-500 block mt-1 leading-snug">{c.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Maintenance & Service History
                  </label>
                  <select
                    value={serviceHistory}
                    onChange={(e) => setServiceHistory(e.target.value)}
                    className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="Full Dealership Record">Full Authorized Dealer Record</option>
                    <option value="Independent Specialist">Independent Specialist Invoices</option>
                    <option value="Partial History">Partial Invoices</option>
                    <option value="None">No Records Available</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Number of Previous Registered Owners
                  </label>
                  <select
                    value={previousOwners}
                    onChange={(e) => setPreviousOwners(Number(e.target.value))}
                    className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value={1}>1 (First Owner)</option>
                    <option value={2}>2 Owners</option>
                    <option value={3}>3+ Owners</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Options or Aftermarket Upgrades
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Panoramic sunroof, winter tire set on alloys, Harman Kardon sound..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                >
                  Proceed to Final Step <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Details & Submit */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="font-bold text-slate-900 text-base">Your Contact Details</h3>
              <p className="text-xs text-slate-500">
                Where should we send your binding valuation appraisal and scheduled inspection slot?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
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
                    className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Direct Cash or Trade-In Credit</span>
                  Choose direct bank transfer on pickup, or redeem your trade-in credit toward any vehicle on AutoMarket with an additional 5% bonus credit.
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/25"
                >
                  Generate Guaranteed Valuation <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Live Instant Valuation Output */}
          {step === 4 && valuationResult && (
            <div className="space-y-8 py-4">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Your Vehicle Valuation is Ready
                </h3>
                <p className="text-xs text-slate-500">
                  Appraisal Ref: <span className="font-mono font-bold text-slate-800">#{valuationResult.id}</span>
                </p>
              </div>

              {/* Pricing Cards Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Direct Cash Purchase */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Option A: Direct Cash Sale</span>
                    <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">Wire Transfer</span>
                  </div>

                  <div>
                    <span className="text-3xl font-extrabold text-slate-950 tracking-tight">
                      €{valuationResult.estimatedValue.toLocaleString('de-DE')}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">Paid directly to your IBAN on vehicle pickup.</p>
                  </div>

                  <ul className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free doorstep vehicle collection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Official DMV de-registration handled
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Price guaranteed for 7 days
                    </li>
                  </ul>
                </div>

                {/* Trade-in with Bonus */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-950 text-white space-y-4 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Option B: Trade-In Credit (+5% Bonus)</span>
                    <span className="text-[11px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold">Best Value</span>
                  </div>

                  <div>
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      €{valuationResult.tradeInBonusValue.toLocaleString('de-DE')}
                    </span>
                    <p className="text-xs text-slate-300 mt-1">
                      Includes +€{(valuationResult.tradeInBonusValue - valuationResult.estimatedValue).toLocaleString('de-DE')} AutoMarket Trade-In Bonus.
                    </p>
                  </div>

                  <ul className="text-xs text-slate-300 space-y-2 pt-3 border-t border-slate-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Deduct instantly from your new car down payment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Lower your monthly loan installments
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Same-day key handover
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => setCurrentPage('vehicles')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
                >
                  Browse Cars with Trade-In Credit <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  View My Valuations in Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
