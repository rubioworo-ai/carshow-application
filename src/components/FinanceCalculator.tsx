import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Percent, 
  Coins, 
  Calendar, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FinanceCalculatorProps {
  initialPrice?: number;
  vehicleTitle?: string;
  onApply?: () => void;
}

export const FinanceCalculator: React.FC<FinanceCalculatorProps> = ({
  initialPrice = 48900,
  vehicleTitle,
  onApply
}) => {
  const { addToast } = useApp();
  const [vehiclePrice, setVehiclePrice] = useState<number>(initialPrice);
  const [downPayment, setDownPayment] = useState<number>(Math.round(initialPrice * 0.2));
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60);
  const [interestRate, setInterestRate] = useState<number>(5.9);
  const [creditTier, setCreditTier] = useState<'prime' | 'excellent' | 'standard'>('prime');
  const [tradeInCredit, setTradeInCredit] = useState<number>(0);

  // Sync if initialPrice changes externally
  useEffect(() => {
    if (initialPrice) {
      setVehiclePrice(initialPrice);
      setDownPayment(Math.round(initialPrice * 0.2));
    }
  }, [initialPrice]);

  const handleCreditTierChange = (tier: 'prime' | 'excellent' | 'standard') => {
    setCreditTier(tier);
    if (tier === 'excellent') setInterestRate(4.49);
    if (tier === 'prime') setInterestRate(5.89);
    if (tier === 'standard') setInterestRate(7.99);
  };

  // Financing calculation
  const principal = Math.max(0, vehiclePrice - downPayment - tradeInCredit);
  const monthlyRate = interestRate / 100 / 12;
  
  let monthlyPayment = 0;
  if (monthlyRate > 0 && principal > 0) {
    monthlyPayment = 
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths))) /
      (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
  } else if (principal > 0) {
    monthlyPayment = principal / loanTermMonths;
  }

  const totalCost = monthlyPayment * loanTermMonths + downPayment + tradeInCredit;
  const totalInterest = Math.max(0, totalCost - vehiclePrice);

  const downPaymentPercent = vehiclePrice > 0 ? Math.round((downPayment / vehiclePrice) * 100) : 0;

  const handlePreApproval = () => {
    if (onApply) {
      onApply();
    } else {
      addToast({
        type: 'success',
        title: 'Pre-Approval Application Sent',
        message: `Our finance partner has received your application for €${Math.round(monthlyPayment)}/mo. You will receive a response within 15 minutes.`
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" />
            <span>European Auto Finance Engine</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {vehicleTitle ? `Financing for ${vehicleTitle}` : 'Financing & Loan Calculator'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare monthly loan installments, down payment options, and term structures.
          </p>
        </div>

        {/* Credit score tier pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
          <button
            onClick={() => handleCreditTierChange('excellent')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              creditTier === 'excellent' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Excellent (4.49%)
          </button>
          <button
            onClick={() => handleCreditTierChange('prime')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              creditTier === 'prime' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Prime (5.89%)
          </button>
          <button
            onClick={() => handleCreditTierChange('standard')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              creditTier === 'standard' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Standard (7.99%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Vehicle Price */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Vehicle Purchase Price
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400">€</span>
                <input
                  type="number"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))}
                  className="w-28 text-right font-bold text-sm text-slate-900 border border-slate-200 rounded-lg px-2 py-1 focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>
            <input
              type="range"
              min="10000"
              max="150000"
              step="1000"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Down Payment ({downPaymentPercent}%)
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400">€</span>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-28 text-right font-bold text-sm text-slate-900 border border-slate-200 rounded-lg px-2 py-1 focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={Math.round(vehiclePrice * 0.7)}
              step="500"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex gap-2 mt-2">
              {[10, 20, 30].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDownPayment(Math.round(vehiclePrice * (pct / 100)))}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {pct}% (€{(vehiclePrice * (pct / 100)).toLocaleString()})
                </button>
              ))}
            </div>
          </div>

          {/* Loan Term Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Financing Duration (Months)
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[24, 36, 48, 60, 72, 84].map(months => (
                <button
                  key={months}
                  type="button"
                  onClick={() => setLoanTermMonths(months)}
                  className={`py-2 text-center rounded-xl text-xs font-bold border transition-all ${
                    loanTermMonths === months
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {months}m
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate & Trade-in */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Annual Interest Rate (APR %)
              </label>
              <div className="relative">
                <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full text-xs font-bold py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Trade-In Credit (€)
              </label>
              <div className="relative">
                <Coins className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="number"
                  step="500"
                  placeholder="0"
                  value={tradeInCredit || ''}
                  onChange={(e) => setTradeInCredit(Number(e.target.value))}
                  className="w-full text-xs font-bold py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Result Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
              <span>Estimated Installment</span>
              <span className="bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-700">
                {loanTermMonths} Months Term
              </span>
            </div>

            {/* Big Monthly Number */}
            <div className="my-6">
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                €{Math.round(monthlyPayment).toLocaleString('de-DE')}
              </span>
              <span className="text-sm text-slate-400 font-medium ml-1.5">/ month</span>
            </div>

            {/* Amortization Summary */}
            <div className="space-y-3 py-4 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Net Financed Amount:</span>
                <span className="font-semibold text-white">€{principal.toLocaleString('de-DE')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Down Payment & Trade:</span>
                <span className="font-semibold text-white">€{(downPayment + tradeInCredit).toLocaleString('de-DE')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Borrowing Cost (Interest):</span>
                <span className="font-semibold text-amber-400">€{Math.round(totalInterest).toLocaleString('de-DE')}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800/60 font-medium">
                <span>Total Repayment:</span>
                <span className="font-bold text-white">€{Math.round(totalCost).toLocaleString('de-DE')}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <button
              onClick={handlePreApproval}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
            >
              Apply for Pre-Approval <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              *Instant digital qualification without impacting your SCHUFA or credit score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
