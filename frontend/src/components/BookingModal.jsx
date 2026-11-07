import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Clock, Car, CheckCircle2, AlertCircle, Loader2, MessageSquare, Send } from 'lucide-react';

const TIME_SLOTS = [
  '07:00 AM - 08:00 AM',
  '08:00 AM - 09:00 AM',
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
  '06:00 PM - 07:00 PM',
  '07:00 PM - 08:00 PM',
];

export default function BookingModal({ service, onClose, onBookingSuccess }) {
  const { token, API_URL } = useAuth();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[2]); // Default 9 AM
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [notifications, setNotifications] = useState(null);

  if (!service) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please sign in or create an account first to book a bay slot.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: service.id,
          vehicleNumber,
          vehicleModel,
          bookingDate,
          timeSlot,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to book slot');

      setSuccess(data.booking);
      setNotifications(data.notifications);
      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="text-center py-5 space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Bay Slot Reserved!</h3>
            <p className="text-xs text-slate-300">
              Your appointment is booked at <span className="text-cyan-400 font-semibold">Hari Om Washing Centre</span> for{' '}
              <span className="text-white font-mono font-bold">{success.vehicleNumber}</span> ({success.vehicleModel}).
            </p>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-left text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span>Booking Token:</span>
                <span className="font-mono font-bold text-cyan-300">#HARIOM-{success.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Slot:</span>
                <span className="text-white font-medium">{success.bookingDate} • {success.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Package:</span>
                <span className="text-white">{service.name}</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-2 font-bold text-slate-100">
                <span>Amount Due at Centre:</span>
                <span className="text-emerald-400 text-sm">₹{service.price}</span>
              </div>
            </div>

            {/* Notification Confirmation Badges */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-left text-[11px] text-emerald-300 space-y-1">
              <div className="flex items-center space-x-2 font-bold">
                <Send className="h-3.5 w-3.5 text-emerald-400" />
                <span>Automated SMS Dispatch Status:</span>
              </div>
              <p className="text-slate-300">
                ✓ Booking details instantly dispatched to Admin: <strong>Sishir</strong> (6372662335) & <strong>Seshadev</strong> (8328964190).
              </p>
            </div>

            {/* WhatsApp Quick Actions */}
            {notifications?.customerWhatsAppLink && (
              <a
                href={notifications.customerWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs flex items-center justify-center space-x-2 transition shadow-md shadow-emerald-600/30"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Open Confirmation in WhatsApp</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-slate-200 text-xs transition border border-slate-700"
            >
              Done & View Live Wash Tracker
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-1">
              <Car className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Hari Om Centre • {service.category === 'CAR' ? 'Car Bay (2 Max)' : 'Bike Bay (4 Max)'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{service.name}</h2>
            <div className="text-xs text-slate-400 flex items-center space-x-3 mt-1">
              <span className="text-emerald-400 font-bold">₹{service.price}</span>
              <span>•</span>
              <span>{service.durationMinutes} mins wash</span>
              <span>•</span>
              <span className="text-cyan-300">{service.vehicleSize}</span>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2 text-rose-300 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Vehicle Plate Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OD 15 A 1234"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs uppercase font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Vehicle Model & Color</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swift (White) / Hunter 350"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Time Slot (7AM - 8PM)</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Special Wash Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Heavy mud on underbody, extra dashboard polish, chain lube..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-300 flex items-center justify-between">
                <span>Amount Due at Centre:</span>
                <span className="font-extrabold text-white text-base">₹{service.price}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-bold text-white text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Booking & sending alerts...</span>
                  </>
                ) : (
                  <span>Confirm Slot Reservation</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
