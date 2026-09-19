import React from 'react';
import { Calendar, ShieldCheck, Clock, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { TestDriveForm } from '../components/TestDriveForm';
import { useApp } from '../context/AppContext';

export const TestDrivePage: React.FC = () => {
  const { selectedVehicleId, setCurrentPage } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Zero Commitment Booking
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
          Schedule an Official Test Drive
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Get behind the wheel of your prospective car. Experience real-world cabin refinement, driver assistance technology, and powertrain dynamics on highway and city routes.
        </p>
      </div>

      {/* Main Form Component */}
      <TestDriveForm preselectedVehicleId={selectedVehicleId || undefined} />

      {/* Test Drive FAQ & Policies */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Important Test Drive Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Full Insurance Coverage
            </h4>
            <p className="leading-relaxed">
              Every drive includes 100% comprehensive commercial dealer insurance. There is zero personal financial liability or deductible in the event of an unforeseen incident.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" /> 60-Minute Highway Route
            </h4>
            <p className="leading-relaxed">
              Our curated driving routes let you experience both urban maneuverability and Autobahn/highway acceleration, adaptive cruise control, and cabin noise isolation.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-600" /> Required Documentation
            </h4>
            <p className="leading-relaxed">
              Please bring your valid national or EU driver's license and national identity card/passport to the showroom appointment. You may also bring a guest passenger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
