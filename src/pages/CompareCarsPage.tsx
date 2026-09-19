import React from 'react';
import { Scale, Plus, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CompareTable } from '../components/CompareTable';
import { vehicleService } from '../services/vehicleService';

export const CompareCarsPage: React.FC = () => {
  const { comparedVehicles, toggleCompare, setCurrentPage } = useApp();

  const handleQuickComparePreset = (ids: string[]) => {
    ids.forEach(id => {
      if (!comparedVehicles.some((v: import('../types').Vehicle) => v.id === id)) {
        toggleCompare(id);
      }
    });
  };

  const allVehicles = vehicleService.getAll();
  const bmw3 = allVehicles.find(v => v.model.includes('330e') || v.model.includes('3 Series'));
  const audiA4 = allVehicles.find(v => v.model.includes('A4') || v.model.includes('A6'));
  const tesla3 = allVehicles.find(v => v.model.includes('Model 3'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" /> Side-By-Side Technical Comparison
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Vehicle Comparison Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyze horsepower, fuel economy, equipment packages, and pricing to make an informed decision.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('vehicles')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 self-start sm:self-auto"
        >
          Add More Vehicles <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Comparison Presets if less than 2 cars */}
      {comparedVehicles.length < 2 && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Try our popular benchmark comparison</h4>
              <p className="text-slate-500">Benchmark: BMW 3 Series Hybrid vs Audi A4 Avant vs Tesla Model 3</p>
            </div>
          </div>

          <button
            onClick={() => {
              const idsToCompare = [bmw3?.id, audiA4?.id, tesla3?.id].filter(Boolean) as string[];
              handleQuickComparePreset(idsToCompare);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors shrink-0 shadow-sm"
          >
            Load Benchmark Trio
          </button>
        </div>
      )}

      {/* Comparison Table */}
      <CompareTable vehicles={comparedVehicles} />
    </div>
  );
};
