import React, { useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  Award, 
  RotateCcw, 
  FileCheck, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentPage, addToast, setGlobalSearchFilter } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      addToast({
        type: 'success',
        title: 'Price Drop Alerts Active',
        message: `We'll notify ${newsletterEmail} when new luxury and EV vehicles enter inventory.`
      });
      setNewsletterEmail('');
    }
  };

  const handleBrandClick = (make: string) => {
    setGlobalSearchFilter({ make });
    setCurrentPage('vehicles');
  };

  const handleBodyTypeClick = (bodyType: string) => {
    setGlobalSearchFilter({ bodyType });
    setCurrentPage('vehicles');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">150-Point Certified Check</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Independent TÜV-compliant mechanical & battery inspections on every car.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">14-Day Money-Back Guarantee</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Love your new vehicle or return it within 14 days or 500 km for a full refund.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-600/10 border border-amber-500/20 text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">24-Month EU Warranty</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Comprehensive mechanical and electrical powertrain coverage honored across 27 EU nations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Guaranteed Clean History</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Verified odometer readings, zero stolen titles, and transparent structural accident logs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Car className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-display">AutoMarket</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-700">
                Europe
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier European digital automotive marketplace connecting discerning drivers with certified luxury, electric, and performance automobiles from verified authorized dealerships.
            </p>

            <div className="pt-2 text-xs space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Headquarters: Leopoldstraße 244, 80807 Munich, Germany</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>+49 89 4520 8900 (Mon–Fri 08:00 – 19:00 CET)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>support@automarket-platform.eu</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-3">
              <p className="text-xs font-semibold text-white mb-2">Get Deal Alerts & Market Insights</p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs px-3 py-2 rounded-lg text-white focus:outline-hidden focus:border-blue-500 flex-1 placeholder:text-slate-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Marketplace</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentPage('vehicles')} className="hover:text-white transition-colors">
                  All Vehicles
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('compare')} className="hover:text-white transition-colors">
                  Compare Specs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('dealers')} className="hover:text-white transition-colors">
                  Dealer Showrooms
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('sell')} className="hover:text-white transition-colors">
                  Instant Car Valuation
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('financing')} className="hover:text-white transition-colors">
                  Financing Calculator
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('test-drive')} className="hover:text-white transition-colors">
                  Book a Test Drive
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('admin')} className="hover:text-white text-blue-400 transition-colors">
                  Dealer Management Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Popular Makes</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              {['BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Volkswagen', 'Volvo', 'Toyota', 'Skoda'].map(brand => (
                <li key={brand}>
                  <button 
                    onClick={() => handleBrandClick(brand)} 
                    className="hover:text-white transition-colors hover:translate-x-1 duration-150 inline-block"
                  >
                    {brand} Cars
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Body Styles</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              {['SUV', 'Sedan', 'Estate / Wagon', 'Coupe', 'Hatchback'].map(body => (
                <li key={body}>
                  <button 
                    onClick={() => handleBodyTypeClick(body)} 
                    className="hover:text-white transition-colors hover:translate-x-1 duration-150 inline-block"
                  >
                    {body}s
                  </button>
                </li>
              ))}
              <li className="pt-2 text-[11px] text-slate-500">
                <span className="text-emerald-400 font-semibold block mb-1">Zero Emissions</span>
                Electric & Hybrid Fleet available with European incentives.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AutoMarket GmbH. All rights reserved. Registered under EU Commercial Registry HRB 209148.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookie Settings</span>
            <span className="hover:text-slate-400 cursor-pointer">TÜV Audits</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
