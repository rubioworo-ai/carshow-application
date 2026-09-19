import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { BrowseCarsPage } from './pages/BrowseCarsPage';
import { CarDetailsPage } from './pages/CarDetailsPage';
import { CompareCarsPage } from './pages/CompareCarsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { DealersPage } from './pages/DealersPage';
import { DealerDetailsPage } from './pages/DealerDetailsPage';
import { SellTradeInPage } from './pages/SellTradeInPage';
import { TestDrivePage } from './pages/TestDrivePage';
import { FinancingPage } from './pages/FinancingPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'vehicles':
        return <BrowseCarsPage />;
      case 'vehicle-details':
        return <CarDetailsPage />;
      case 'compare':
        return <CompareCarsPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'dealers':
        return <DealersPage />;
      case 'dealer-details':
        return <DealerDetailsPage />;
      case 'sell':
        return <SellTradeInPage />;
      case 'test-drive':
        return <TestDrivePage />;
      case 'financing':
        return <FinancingPage />;
      case 'dashboard':
        return <CustomerDashboardPage />;
      case 'admin':
        return <AdminDashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 text-slate-900 selection:bg-blue-600 selection:text-white font-sans antialiased">
      <Navbar />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
