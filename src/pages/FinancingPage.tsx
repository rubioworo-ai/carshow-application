import React, { useState } from 'react';
import { 
  Calculator, 
  Percent, 
  ShieldCheck, 
  CheckCircle2, 
  Coins, 
  Building2, 
  HelpCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { FinanceCalculator } from '../components/FinanceCalculator';
import { useApp } from '../context/AppContext';

export const FinancingPage: React.FC = () => {
  const { addToast } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <Calculator className="w-3.5 h-3.5" /> Transparent European Lending
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
          Auto Financing & Payment Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Tailor your financing structure with competitive European partner rates starting at 4.49% APR. No hidden processing surcharges or early repayment penalties.
        </p>
      </div>

      {/* Main Calculator */}
      <FinanceCalculator initialPrice={52900} />

      {/* Financing Models Comparison */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900">Choose Your Ideal Payment Structure</h2>
          <p className="text-xs text-slate-500 mt-1">Flexible programs designed for individual drivers and corporate fleet managers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Classic Installment Loan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standard fixed equal payments over 24 to 84 months. You become the legal owner from day one, with unlimited mileage freedom.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% full ownership
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> No mileage restrictions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Custom down payments
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border-2 border-blue-600 p-6 space-y-4 shadow-md relative">
            <div className="absolute -top-3 right-5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Most Popular
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">3-Way Balloon Financing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Significantly lower monthly payments with a predetermined final installment. Decide at the end whether to keep the car, refinance, or return it.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Up to 40% lower monthly installments
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Guaranteed vehicle buyback option
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Flexible end-of-term choices
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Commercial & Fleet Lease</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ideal for business owners, freelancers, and corporations. Deduct monthly lease expenses from taxable business revenue.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> 100% tax deductible payments
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Includes scheduled maintenance
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Upgrade every 24–36 months
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
