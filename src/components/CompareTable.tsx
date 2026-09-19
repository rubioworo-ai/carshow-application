import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  Calendar,
  Sparkles,
  Zap,
  Gauge
} from 'lucide-react';
import { Vehicle } from '../types';
import { useApp } from '../context/AppContext';
import { vehicleService } from '../services/vehicleService';

interface CompareTableProps {
  vehicles: Vehicle[];
}

export const CompareTable: React.FC<CompareTableProps> = ({ vehicles }) => {
  const { 
    removeCompared, 
    clearCompared, 
    toggleCompare, 
    navigateToVehicle, 
    navigateToTestDrive, 
    setCurrentPage 
  } = useApp();

  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchCar, setSearchCar] = useState('');

  const allVehicles = vehicleService.getAll();
  const availableToAdd = allVehicles.filter(
    v => !vehicles.some(cv => cv.id === v.id) &&
    (searchCar === '' || 
      `${v.make} ${v.model} ${v.variant || ''}`.toLowerCase().includes(searchCar.toLowerCase()))
  );

  const formatEuro = (val: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  // Check if all values are identical in an array
  const areAllSame = (arr: any[]) => arr.every(val => val === arr[0]);

  if (vehicles.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Vehicles Selected for Comparison</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
          Select 2 to 4 vehicles to view side-by-side technical specifications, fuel economy ratings, powertrain outputs, and warranty features.
        </p>
        <button
          onClick={() => setCurrentPage('vehicles')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-md shadow-blue-600/20"
        >
          Browse Inventory <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const specRows = [
    {
      label: 'Price (EUR)',
      getValue: (v: Vehicle) => formatEuro(v.price),
      isDiff: !areAllSame(vehicles.map(v => v.price))
    },
    {
      label: 'Monthly Finance Est.',
      getValue: (v: Vehicle) => `€${v.monthlyEstimate}/mo`,
      isDiff: !areAllSame(vehicles.map(v => v.monthlyEstimate))
    },
    {
      label: 'Model Year',
      getValue: (v: Vehicle) => v.year.toString(),
      isDiff: !areAllSame(vehicles.map(v => v.year))
    },
    {
      label: 'Odometer Mileage',
      getValue: (v: Vehicle) => `${v.mileage.toLocaleString('de-DE')} km`,
      isDiff: !areAllSame(vehicles.map(v => v.mileage))
    },
    {
      label: 'Powertrain Output',
      getValue: (v: Vehicle) => `${v.powerHp} HP (${v.powerKw} kW)`,
      isDiff: !areAllSame(vehicles.map(v => v.powerHp))
    },
    {
      label: 'Engine / Battery',
      getValue: (v: Vehicle) => v.engineSize,
      isDiff: !areAllSame(vehicles.map(v => v.engineSize))
    },
    {
      label: 'Fuel Type',
      getValue: (v: Vehicle) => v.fuelType,
      isDiff: !areAllSame(vehicles.map(v => v.fuelType))
    },
    {
      label: 'Transmission',
      getValue: (v: Vehicle) => v.transmission,
      isDiff: !areAllSame(vehicles.map(v => v.transmission))
    },
    {
      label: 'Drivetrain',
      getValue: (v: Vehicle) => v.driveType,
      isDiff: !areAllSame(vehicles.map(v => v.driveType))
    },
    {
      label: 'Fuel Economy (WLTP)',
      getValue: (v: Vehicle) => v.fuelEconomy,
      isDiff: !areAllSame(vehicles.map(v => v.fuelEconomy))
    },
    {
      label: 'CO2 Emissions',
      getValue: (v: Vehicle) => v.co2Emissions || 'N/A',
      isDiff: !areAllSame(vehicles.map(v => v.co2Emissions))
    },
    {
      label: 'Condition',
      getValue: (v: Vehicle) => v.condition,
      isDiff: !areAllSame(vehicles.map(v => v.condition))
    },
    {
      label: 'Location Hub',
      getValue: (v: Vehicle) => v.location,
      isDiff: !areAllSame(vehicles.map(v => v.location))
    },
  ];

  return (
    <div className="space-y-6">
      {/* Table Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-700">
            Comparing <span className="text-blue-600 font-extrabold">{vehicles.length}</span> of 4 vehicles
          </span>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={highlightDiffs}
              onChange={(e) => setHighlightDiffs(e.target.checked)}
              className="accent-blue-600 rounded"
            />
            Highlight Differences
          </label>
        </div>

        <div className="flex items-center gap-2">
          {vehicles.length < 4 && (
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-blue-200"
            >
              <Plus className="w-3.5 h-3.5" /> Add Car
            </button>
          )}
          <button
            onClick={clearCompared}
            className="px-3 py-1.5 text-slate-500 hover:text-red-600 rounded-lg text-xs font-medium transition-colors"
          >
            Clear Board
          </button>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            {/* Header with car photo cards */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="p-4 w-48 text-xs font-bold text-slate-400 uppercase tracking-wider align-bottom">
                  Vehicle Specs
                </th>
                {vehicles.map((v) => (
                  <th key={v.id} className="p-4 min-w-[220px] max-w-[260px] align-top">
                    <div className="relative group">
                      <button
                        onClick={() => removeCompared(v.id)}
                        className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-full z-10 transition-colors shadow-md"
                        title="Remove vehicle"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="aspect-16/10 rounded-xl overflow-hidden bg-slate-100 mb-3 shadow-xs">
                        <img
                          src={v.images[0]}
                          alt={v.model}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <p className="text-[11px] font-bold text-blue-600 uppercase">{v.make}</p>
                      <h4 className="font-extrabold text-slate-900 text-sm line-clamp-1">{v.model}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mb-2">{v.variant || v.engineSize}</p>

                      <div className="flex gap-1.5 pt-2 border-t border-slate-200/80">
                        <button
                          onClick={() => navigateToVehicle(v.id)}
                          className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors text-center"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => navigateToTestDrive(v.id)}
                          className="py-1.5 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
                          title="Book Test Drive"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
                {vehicles.length < 4 && (
                  <th className="p-4 min-w-[180px] align-middle text-center bg-slate-50/20">
                    <button
                      onClick={() => setAddModalOpen(true)}
                      className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center w-full transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center mx-auto mb-2 transition-colors">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 block">
                        Add to Compare
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        up to {4 - vehicles.length} more
                      </span>
                    </button>
                  </th>
                )}
              </tr>
            </thead>

            {/* Spec rows */}
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {specRows.map((row, idx) => {
                const highlight = highlightDiffs && row.isDiff;
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      highlight ? 'bg-amber-50/70 font-medium text-amber-950' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/50">
                      {row.label}
                    </td>
                    {vehicles.map((v) => (
                      <td key={v.id} className="p-4 font-semibold text-slate-800">
                        {row.getValue(v)}
                      </td>
                    ))}
                    {vehicles.length < 4 && <td className="p-4 bg-slate-50/20"></td>}
                  </tr>
                );
              })}

              {/* Top features row */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50 align-top">
                  Key Included Features
                </td>
                {vehicles.map((v) => (
                  <td key={v.id} className="p-4 align-top">
                    <ul className="space-y-1">
                      {v.features.slice(0, 5).map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
                {vehicles.length < 4 && <td className="p-4 bg-slate-50/20"></td>}
              </tr>

              {/* Safety row */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50 align-top">
                  Safety Equipment
                </td>
                {vehicles.map((v) => (
                  <td key={v.id} className="p-4 align-top">
                    <ul className="space-y-1">
                      {v.safetyEquipment.slice(0, 4).map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-slate-600">
                          <Check className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
                {vehicles.length < 4 && <td className="p-4 bg-slate-50/20"></td>}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Select Vehicle to Compare</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3">
              <input
                type="text"
                placeholder="Type to filter inventory..."
                value={searchCar}
                onChange={(e) => setSearchCar(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div className="overflow-y-auto divide-y divide-slate-100 flex-1 pr-1">
              {availableToAdd.map((v) => (
                <div
                  key={v.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 rounded-lg px-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={v.images[0]}
                      alt={v.model}
                      className="w-14 h-10 rounded-lg object-cover bg-slate-100"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{v.make} {v.model}</p>
                      <p className="text-[11px] text-slate-500">{v.year} • {formatEuro(v.price)} • {v.fuelType}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      toggleCompare(v.id);
                      setAddModalOpen(false);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
