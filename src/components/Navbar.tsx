import React, { useState } from 'react';
import { 
  Car, 
  Heart, 
  Scale, 
  Building2, 
  Tag, 
  Calculator, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  Search,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    favorites, 
    comparedVehicleIds, 
    user,
    setGlobalSearchFilter 
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      setGlobalSearchFilter({ query: quickSearch.trim() });
      setCurrentPage('vehicles');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { id: 'vehicles', label: 'Browse Cars', icon: Car },
    { id: 'compare', label: 'Compare', icon: Scale, badge: comparedVehicleIds.length },
    { id: 'dealers', label: 'Dealerships', icon: Building2 },
    { id: 'sell', label: 'Sell / Trade-In', icon: Tag, highlight: true },
    { id: 'financing', label: 'Financing', icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro-bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              European Certified Automotive Exchange
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-400">Over 3,400+ inspected vehicles available</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentPage('admin')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                currentPage === 'admin' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Dealer Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo */}
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 text-left focus:outline-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-950/20 group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-display">AutoMarket</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                  EU
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">Verified Dealer Network</p>
            </div>
          </button>

          {/* Quick search input (desktop) */}
          <form 
            onSubmit={handleQuickSearchSubmit}
            className="hidden lg:flex items-center flex-1 max-w-xs relative ml-4"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search BMW, Audi, SUV, hybrid..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 text-sm bg-slate-100 hover:bg-slate-50 focus:bg-white rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden transition-all text-slate-800 placeholder:text-slate-400"
            />
          </form>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentPage(link.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'text-blue-700 bg-blue-50/80 shadow-xs'
                      : link.highlight
                      ? 'text-amber-700 bg-amber-50 hover:bg-amber-100/70'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                  {Boolean(link.badge) && link.badge! > 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Favorites button */}
            <button
              onClick={() => setCurrentPage('favorites')}
              aria-label="View Favorites"
              className={`p-2 sm:px-3 sm:py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all border ${
                currentPage === 'favorites'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
              <span className="hidden sm:inline font-semibold">Saved</span>
              {favorites.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* User Dashboard */}
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg border transition-all ${
                currentPage === 'dashboard'
                  ? 'border-blue-300 bg-blue-50 text-blue-900 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
              }`}
            >
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200" 
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold leading-tight text-slate-900">{user.name.split(' ')[0]}</p>
                <p className="text-[10px] text-slate-500 font-medium">Dashboard</p>
              </div>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drop menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg">
          <form onSubmit={handleQuickSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search make, model, electric..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-600"
            />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentPage(link.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-left ${
                    currentPage === link.id ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{link.label}</span>
                  {Boolean(link.badge) && link.badge! > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px]">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentPage('dashboard');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-slate-700 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-slate-500" />
              Customer Dashboard
            </button>
            <button
              onClick={() => {
                setCurrentPage('admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-md"
            >
              Dealer Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
