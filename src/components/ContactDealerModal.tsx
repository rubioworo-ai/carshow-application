import React, { useState } from 'react';
import { X, Mail, Phone, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Vehicle, Dealer } from '../types';
import { useApp } from '../context/AppContext';
import { bookingService } from '../services/bookingService';

interface ContactDealerModalProps {
  vehicle?: Vehicle;
  dealer?: Dealer;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactDealerModal: React.FC<ContactDealerModalProps> = ({
  vehicle,
  dealer,
  isOpen,
  onClose
}) => {
  const { user, addToast } = useApp();

  const [customerName, setCustomerName] = useState(user.name);
  const [customerEmail, setCustomerEmail] = useState(user.email);
  const [customerPhone, setCustomerPhone] = useState(user.phone);
  const [preferredContact, setPreferredContact] = useState<'email' | 'phone' | 'whatsapp'>('email');
  const [message, setMessage] = useState(
    vehicle 
      ? `Hello, I am interested in the ${vehicle.make} ${vehicle.model} (${vehicle.year}). Please contact me regarding vehicle availability, trade-in options, and delivery timeline.`
      : `Hello, I would like to inquire about current certified inventory and warranty packages.`
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      addToast({
        type: 'warning',
        title: 'Incomplete Details',
        message: 'Please fill in all required contact information.'
      });
      return;
    }

    bookingService.addLead({
      vehicleId: vehicle ? vehicle.id : 'general-inquiry',
      vehicleName: vehicle ? `${vehicle.make} ${vehicle.model} ${vehicle.variant || ''}` : 'General Showroom Inquiry',
      customerName,
      customerEmail,
      customerPhone,
      message,
      preferredContact
    });

    addToast({
      type: 'success',
      title: 'Inquiry Transmitted',
      message: `The dealership sales team has received your message and will respond via ${preferredContact}.`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Contact Dealership</h3>
            <p className="text-xs text-slate-500">
              {dealer ? dealer.name : 'Authorized AutoMarket Partner'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {vehicle && (
          <div className="my-4 p-3 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-200">
            <img
              src={vehicle.images[0]}
              alt={vehicle.model}
              className="w-14 h-11 rounded-lg object-cover bg-slate-200 shrink-0"
            />
            <div>
              <p className="text-xs font-bold text-slate-900">{vehicle.make} {vehicle.model}</p>
              <p className="text-[11px] text-slate-500">
                €{vehicle.price.toLocaleString('de-DE')} • {vehicle.year} • {vehicle.mileage.toLocaleString('de-DE')} km
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full text-xs font-medium py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full text-xs font-medium py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full text-xs font-medium py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Preferred Contact Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'email', label: 'Email', icon: Mail },
                { id: 'phone', label: 'Phone', icon: Phone },
                { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
              ].map((c) => {
                const Icon = c.icon;
                const active = preferredContact === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setPreferredContact(c.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Message to Dealer
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-xs font-medium py-2 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-blue-600 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Send className="w-3.5 h-3.5" /> Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
