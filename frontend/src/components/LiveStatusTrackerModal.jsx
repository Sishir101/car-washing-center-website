import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Car, Clock, CheckCircle, Droplets, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

const STATUS_STEPS = [
  { key: 'CONFIRMED', label: 'Slot Confirmed', desc: 'Appointment booked' },
  { key: 'IN_WASH', label: 'In Washing Bay', desc: 'Foam & scrubbing active' },
  { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', desc: 'Dry, polished & inspected' },
  { key: 'COMPLETED', label: 'Delivered', desc: 'Handed over to customer' },
];

export default function LiveStatusTrackerModal({ onClose }) {
  const { token, API_URL } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/bookings/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [token]);

  const getStepIndex = (status) => {
    const idx = STATUS_STEPS.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center justify-between mb-4 pr-8">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-1">
              <Droplets className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Live Wash Progress</span>
            </div>
            <h2 className="text-xl font-bold text-white">My Vehicle Queue & Tracker</h2>
          </div>
          <button
            onClick={fetchMyBookings}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Refresh status"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">Loading appointments...</div>
          ) : bookings.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Car className="h-10 w-10 mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No active wash appointments</p>
              <p className="text-xs text-slate-500">Pick a car or bike package on the homepage to book a bay slot!</p>
            </div>
          ) : (
            bookings.map((b) => {
              const currentStep = getStepIndex(b.status);
              return (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-sm text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                          {b.vehicleNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-200">{b.vehicleModel}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {b.service?.name} • <span className="text-slate-300 font-semibold">₹{b.totalAmount}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right text-xs text-slate-400">
                      <div>Date: <span className="text-slate-200 font-medium">{b.bookingDate}</span></div>
                      <div>Slot: <span className="text-cyan-400 font-medium">{b.timeSlot}</span></div>
                    </div>
                  </div>

                  {/* Visual Status Progress Stepper */}
                  <div className="pt-2">
                    <div className="grid grid-cols-4 gap-2 relative">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={step.key} className="text-center relative">
                            {/* Step bar dot */}
                            <div
                              className={`h-2 rounded-full mb-2 transition-all ${
                                isDone
                                  ? isCurrent
                                    ? 'bg-cyan-400 animate-pulse'
                                    : 'bg-emerald-500'
                                  : 'bg-slate-700'
                              }`}
                            />
                            <span
                              className={`block text-[11px] font-bold ${
                                isCurrent
                                  ? 'text-cyan-300'
                                  : isDone
                                  ? 'text-slate-200'
                                  : 'text-slate-500'
                              }`}
                            >
                              {step.label}
                            </span>
                            <span className="hidden sm:block text-[9px] text-slate-500 mt-0.5">
                              {step.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {b.notes && (
                    <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <span className="font-semibold text-slate-300">Notes: </span>
                      {b.notes}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
