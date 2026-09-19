import { TestDriveBooking, Lead, SellCarSubmission } from '../types';
import { INITIAL_APPOINTMENTS, INITIAL_LEADS, INITIAL_SUBMISSIONS } from '../data/mockUserData';

const APPOINTMENTS_KEY = 'automarket_appointments_v1';
const LEADS_KEY = 'automarket_leads_v1';
const SUBMISSIONS_KEY = 'automarket_submissions_v1';

export const bookingService = {
  // Test drive bookings
  getBookings(): TestDriveBooking[] {
    try {
      const stored = localStorage.getItem(APPOINTMENTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
    return INITIAL_APPOINTMENTS;
  },

  addBooking(booking: Omit<TestDriveBooking, 'id' | 'createdAt'>): TestDriveBooking {
    const list = this.getBookings();
    const newBooking: TestDriveBooking = {
      ...booking,
      id: 'td-' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newBooking, ...list];
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
    return newBooking;
  },

  updateBookingStatus(id: string, status: TestDriveBooking['status']): boolean {
    const list = this.getBookings();
    const index = list.findIndex(b => b.id === id);
    if (index !== -1) {
      list[index].status = status;
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(list));
      return true;
    }
    return false;
  },

  deleteBooking(id: string): boolean {
    const list = this.getBookings();
    const filtered = list.filter(b => b.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  },

  // Leads / Dealer inquiries
  getLeads(): Lead[] {
    try {
      const stored = localStorage.getItem(LEADS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(LEADS_KEY, JSON.stringify(INITIAL_LEADS));
    return INITIAL_LEADS;
  },

  addLead(lead: Omit<Lead, 'id' | 'date' | 'status'>): Lead {
    const list = this.getLeads();
    const newLead: Lead = {
      ...lead,
      id: 'lead-' + Date.now().toString().slice(-6),
      date: new Date().toISOString().split('T')[0],
      status: 'new'
    };
    const updated = [newLead, ...list];
    localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
    return newLead;
  },

  updateLeadStatus(id: string, status: Lead['status']): boolean {
    const list = this.getLeads();
    const index = list.findIndex(l => l.id === id);
    if (index !== -1) {
      list[index].status = status;
      localStorage.setItem(LEADS_KEY, JSON.stringify(list));
      return true;
    }
    return false;
  },

  // Sell car submissions
  getSubmissions(): SellCarSubmission[] {
    try {
      const stored = localStorage.getItem(SUBMISSIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
    return INITIAL_SUBMISSIONS;
  },

  addSubmission(sub: Omit<SellCarSubmission, 'id' | 'createdAt'>): SellCarSubmission {
    const list = this.getSubmissions();
    const newSub: SellCarSubmission = {
      ...sub,
      id: 'sub-' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newSub, ...list];
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
    return newSub;
  },

  updateSubmissionStatus(id: string, status: SellCarSubmission['status']): boolean {
    const list = this.getSubmissions();
    const index = list.findIndex(s => s.id === id);
    if (index !== -1) {
      list[index].status = status;
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
      return true;
    }
    return false;
  },

  resetToDefaults(): void {
    localStorage.removeItem(APPOINTMENTS_KEY);
    localStorage.removeItem(LEADS_KEY);
    localStorage.removeItem(SUBMISSIONS_KEY);
  }
};
