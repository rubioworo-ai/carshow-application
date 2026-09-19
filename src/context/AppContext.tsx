import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vehicle, CustomerUser, ToastMessage } from '../types';
import { INITIAL_USER } from '../data/mockUserData';
import { vehicleService } from '../services/vehicleService';

export type PageRoute =
  | 'home'
  | 'vehicles'
  | 'vehicle-details'
  | 'compare'
  | 'favorites'
  | 'dealers'
  | 'dealer-details'
  | 'sell'
  | 'test-drive'
  | 'financing'
  | 'dashboard'
  | 'admin';

interface AppContextType {
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
  selectedDealerId: string | null;
  setSelectedDealerId: (id: string | null) => void;
  favorites: string[];
  favoriteVehicles: Vehicle[];
  toggleFavorite: (vehicleId: string) => void;
  isFavorite: (vehicleId: string) => boolean;
  clearFavorites: () => void;
  comparedVehicleIds: string[];
  comparedVehicles: Vehicle[];
  toggleCompare: (vehicleId: string) => void;
  isCompared: (vehicleId: string) => boolean;
  removeCompared: (vehicleId: string) => void;
  clearCompared: () => void;
  recentlyViewedIds: string[];
  trackViewedVehicle: (vehicleId: string) => void;
  user: CustomerUser;
  updateUser: (updates: Partial<CustomerUser>) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  globalSearchFilter: {
    make?: string;
    bodyType?: string;
    query?: string;
    maxPrice?: number;
    fuelType?: string;
    condition?: string;
  };
  setGlobalSearchFilter: (filter: {
    make?: string;
    bodyType?: string;
    query?: string;
    maxPrice?: number;
    fuelType?: string;
    condition?: string;
  }) => void;
  navigateToVehicle: (vehicleId: string) => void;
  navigateToDealer: (dealerId: string) => void;
  navigateToTestDrive: (vehicleId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const FAVORITES_KEY = 'automarket_favorites_v1';
const COMPARE_KEY = 'automarket_compare_v1';
const RECENT_KEY = 'automarket_recent_v1';
const USER_KEY = 'automarket_user_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPageState] = useState<PageRoute>('home');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('veh-bmw-330e');
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>('dealer-1');

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : ['veh-bmw-330e', 'veh-tesla-model3-highland', 'veh-audi-rs6'];
    } catch {
      return ['veh-bmw-330e'];
    }
  });

  // Compared vehicles state (limit to max 4)
  const [comparedVehicleIds, setComparedVehicleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(COMPARE_KEY);
      return saved ? JSON.parse(saved) : ['veh-bmw-330e', 'veh-merc-e300d'];
    } catch {
      return ['veh-bmw-330e', 'veh-merc-e300d'];
    }
  });

  // Recently viewed vehicles
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      return saved ? JSON.parse(saved) : ['veh-bmw-330e', 'veh-tesla-modely', 'veh-volvo-xc60'];
    } catch {
      return ['veh-bmw-330e'];
    }
  });

  // User state
  const [user, setUser] = useState<CustomerUser>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Search filter carryover
  const [globalSearchFilter, setGlobalSearchFilter] = useState<{
    make?: string;
    bodyType?: string;
    query?: string;
    maxPrice?: number;
    fuelType?: string;
  }>({});

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(comparedVehicleIds));
  }, [comparedVehicleIds]);

  useEffect(() => {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyViewedIds));
  }, [recentlyViewedIds]);

  useEffect(() => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, [user]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleFavorite = (vehicleId: string) => {
    const isFav = favorites.includes(vehicleId);
    if (isFav) {
      setFavorites(prev => prev.filter(id => id !== vehicleId));
      addToast({
        type: 'info',
        title: 'Removed from Saved',
        message: 'Vehicle removed from your favorites list.'
      });
    } else {
      setFavorites(prev => [...prev, vehicleId]);
      addToast({
        type: 'success',
        title: 'Saved to Favorites',
        message: 'Vehicle added to your saved garage.'
      });
    }
  };

  const isFavorite = (vehicleId: string) => favorites.includes(vehicleId);

  const clearFavorites = () => {
    setFavorites([]);
    addToast({
      type: 'info',
      title: 'Garage Cleared',
      message: 'All saved vehicles removed from your favorites.'
    });
  };

  const favoriteVehicles = favorites
    .map(id => vehicleService.getById(id))
    .filter(Boolean) as Vehicle[];

  const comparedVehicles = comparedVehicleIds
    .map(id => vehicleService.getById(id))
    .filter(Boolean) as Vehicle[];

  const toggleCompare = (vehicleId: string) => {
    if (comparedVehicleIds.includes(vehicleId)) {
      setComparedVehicleIds(prev => prev.filter(id => id !== vehicleId));
      addToast({
        type: 'info',
        title: 'Removed from Comparison',
        message: 'Vehicle removed from comparison board.'
      });
    } else {
      if (comparedVehicleIds.length >= 4) {
        addToast({
          type: 'warning',
          title: 'Comparison Limit Reached',
          message: 'You can compare up to 4 vehicles simultaneously. Please remove one first.'
        });
        return;
      }
      setComparedVehicleIds(prev => [...prev, vehicleId]);
      addToast({
        type: 'success',
        title: 'Added to Comparison',
        message: `Vehicle added. You now have ${comparedVehicleIds.length + 1} vehicles selected.`
      });
    }
  };

  const isCompared = (vehicleId: string) => comparedVehicleIds.includes(vehicleId);

  const removeCompared = (vehicleId: string) => {
    setComparedVehicleIds(prev => prev.filter(id => id !== vehicleId));
  };

  const clearCompared = () => {
    setComparedVehicleIds([]);
    addToast({
      type: 'info',
      title: 'Comparison Cleared',
      message: 'All vehicles removed from comparison table.'
    });
  };

  const trackViewedVehicle = (vehicleId: string) => {
    setRecentlyViewedIds(prev => {
      const filtered = prev.filter(id => id !== vehicleId);
      return [vehicleId, ...filtered].slice(0, 10);
    });
  };

  const updateUser = (updates: Partial<CustomerUser>) => {
    setUser(prev => ({ ...prev, ...updates }));
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your customer profile changes have been saved.'
    });
  };

  const setCurrentPage = (page: PageRoute) => {
    setCurrentPageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToVehicle = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    trackViewedVehicle(vehicleId);
    setCurrentPage('vehicle-details');
  };

  const navigateToDealer = (dealerId: string) => {
    setSelectedDealerId(dealerId);
    setCurrentPage('dealer-details');
  };

  const navigateToTestDrive = (vehicleId?: string) => {
    if (vehicleId) {
      setSelectedVehicleId(vehicleId);
    }
    setCurrentPage('test-drive');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedVehicleId,
        setSelectedVehicleId,
        selectedDealerId,
        setSelectedDealerId,
        favorites,
        favoriteVehicles,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        comparedVehicleIds,
        comparedVehicles,
        toggleCompare,
        isCompared,
        removeCompared,
        clearCompared,
        recentlyViewedIds,
        trackViewedVehicle,
        user,
        updateUser,
        toasts,
        addToast,
        removeToast,
        globalSearchFilter,
        setGlobalSearchFilter,
        navigateToVehicle,
        navigateToDealer,
        navigateToTestDrive
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
