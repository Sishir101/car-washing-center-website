import React from 'react';
import { Calendar, MapPin, Ticket, ShieldCheck } from 'lucide-react';

export default function EventCard({ event, onBook }) {
  const isSoldOut = event.availableSeats <= 0;
  const isLowStock = event.availableSeats > 0 && event.availableSeats <= 5;
  const percentageLeft = Math.round((event.availableSeats / event.totalSeats) * 100);

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl group-hover:bg-violet-600/20 transition-all pointer-events-none" />

      <div>
        {/* Status Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-800 text-slate-300 border border-slate-700">
            {event.price === 0 ? 'Free' : `₹${event.price}`}
          </span>

          {isSoldOut ? (
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
              Only {event.availableSeats} seats left!
            </span>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Available
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-slate-100 group-hover:text-violet-300 transition line-clamp-1">
          {event.title}
        </h3>
        <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="mt-5 space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-violet-400 shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-violet-400 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-400">Host: <span className="text-slate-200">{event.organizer?.name || 'Verified Host'}</span></span>
          </div>
        </div>

        {/* Seat Availability Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Seat Capacity</span>
            <span className="font-semibold text-slate-300">
              {event.availableSeats} / {event.totalSeats}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isSoldOut
                  ? 'bg-rose-500'
                  : isLowStock
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-violet-500 to-indigo-500'
              }`}
              style={{ width: `${percentageLeft}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button
          onClick={() => onBook(event)}
          disabled={isSoldOut}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition ${
            isSoldOut
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/25 active:scale-[0.98]'
          }`}
        >
          <Ticket className="h-4 w-4" />
          <span>{isSoldOut ? 'Sold Out' : 'Book Tickets'}</span>
        </button>
      </div>
    </div>
  );
}
