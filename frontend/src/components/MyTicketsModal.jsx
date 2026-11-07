import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Ticket, Calendar, MapPin, Loader2, Sparkles } from 'lucide-react';

export default function MyTicketsModal({ onClose }) {
  const { token, API_URL } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
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

    fetchTickets();
  }, [token]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2 text-violet-400 mb-2">
          <Ticket className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Pass Vault</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-4">My Booked Tickets</h2>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {loading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
              <span className="text-sm">Loading your tickets...</span>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="h-12 w-12 mx-auto rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
                <Ticket className="h-6 w-6" />
              </div>
              <p className="text-sm text-slate-300">You haven't booked any tickets yet.</p>
              <p className="text-xs text-slate-500">Explore events on the homepage and reserve your spot!</p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-violet-950 text-violet-300 border border-violet-800/40">
                      #BK-{b.id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {b.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-base">{b.event.title}</h4>
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5 text-violet-400" />
                      <span>{new Date(b.event.date).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-3.5 w-3.5 text-violet-400" />
                      <span className="truncate max-w-[120px]">{b.event.location}</span>
                    </span>
                  </div>
                </div>

                <div className="sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-700/60 shrink-0">
                  <div className="text-xs text-slate-400">Reserved Seats</div>
                  <div className="text-base font-bold text-white">{b.seats} Tickets</div>
                  <div className="text-xs font-semibold text-violet-400">Total: ₹{b.totalAmount}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
