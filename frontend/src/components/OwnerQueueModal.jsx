import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, Phone, CheckCircle, RefreshCw, Car, ChevronRight, MessageSquare, Send } from 'lucide-react';

export default function OwnerQueueModal({ onClose }) {
  const { token, API_URL } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationNotice, setNotificationNotice] = useState(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/bookings/queue?date=${date}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setQueue(data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to fetch queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [date, token]);

  const advanceStatus = async (bookingId, currentStatus, vehicleNumber) => {
    const statusMap = {
      CONFIRMED: 'IN_WASH',
      IN_WASH: 'READY_FOR_PICKUP',
      READY_FOR_PICKUP: 'COMPLETED',
    };

    const nextStatus = statusMap[currentStatus];
    if (!nextStatus) return;

    try {
      const res = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        if (nextStatus === 'READY_FOR_PICKUP') {
          setNotificationNotice(`Automated WhatsApp dispatched: Vehicle ${vehicleNumber} is READY FOR PICKUP!`);
          setTimeout(() => setNotificationNotice(null), 6000);
        }
        fetchQueue();
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pr-8">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Hari Om Center Admin • Sishir & Seshadev Console
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">Today's Washing Bay Queue & SMS Alerts</h2>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
            />
            <button
              onClick={fetchQueue}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh queue"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Automated Alert Banner */}
        {notificationNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-bounce">
            <Send className="h-4 w-4 shrink-0" />
            <span>{notificationNotice}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">Loading live schedule...</div>
          ) : queue.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Car className="h-10 w-10 mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No appointments scheduled for this date</p>
            </div>
          ) : (
            queue.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {b.vehicleNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">{b.vehicleModel}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        b.status === 'COMPLETED'
                          ? 'bg-slate-800 text-slate-400'
                          : b.status === 'READY_FOR_PICKUP'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : b.status === 'IN_WASH'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    <span className="text-slate-200 font-semibold">{b.service?.name}</span> • Slot:{' '}
                    <span className="text-cyan-400 font-medium">{b.timeSlot}</span> • Due: ₹{b.totalAmount}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>Customer: <strong className="text-slate-300">{b.user?.name}</strong></span>
                    {b.user?.phone && (
                      <div className="flex items-center space-x-2">
                        <a
                          href={`tel:${b.user.phone}`}
                          className="flex items-center space-x-1 text-cyan-400 hover:underline"
                        >
                          <Phone className="h-3 w-3" />
                          <span>{b.user.phone}</span>
                        </a>

                        {/* Direct WhatsApp Quick-Chat Button for Seshadev/Sishir */}
                        {b.whatsAppLink && (
                          <a
                            href={b.whatsAppLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900 text-[10px] font-semibold transition"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="h-3 w-3 text-emerald-400" />
                            <span>WhatsApp Customer</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Advancement Controls */}
                <div className="shrink-0 flex items-center space-x-2">
                  {b.status === 'CONFIRMED' && (
                    <button
                      onClick={() => advanceStatus(b.id, 'CONFIRMED', b.vehicleNumber)}
                      className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition shadow-sm"
                    >
                      Move to Wash Bay 🚿
                    </button>
                  )}
                  {b.status === 'IN_WASH' && (
                    <button
                      onClick={() => advanceStatus(b.id, 'IN_WASH', b.vehicleNumber)}
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm"
                    >
                      Mark Ready for Pickup 🧽
                    </button>
                  )}
                  {b.status === 'READY_FOR_PICKUP' && (
                    <button
                      onClick={() => advanceStatus(b.id, 'READY_FOR_PICKUP', b.vehicleNumber)}
                      className="px-3.5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs transition"
                    >
                      Mark Delivered ✅
                    </button>
                  )}
                  {b.status === 'COMPLETED' && (
                    <span className="text-xs text-slate-500 font-semibold px-2 py-1 bg-slate-900 rounded border border-slate-800">
                      Delivered
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
