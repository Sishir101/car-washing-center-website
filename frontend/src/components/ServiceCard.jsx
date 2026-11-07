import React from 'react';
import { Clock, Check, Sparkles, ChevronRight, Zap } from 'lucide-react';

export default function ServiceCard({ service, onBook }) {
  const isBike = service.category === 'BIKE';

  return (
    <div className="glass-card rounded-2xl flex flex-col justify-between relative group overflow-hidden border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300">
      <div>
        {/* Photo Header with Badges */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
          <img
            src={service.image || (isBike ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80')}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          {/* Subtle dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-800/60 shadow-lg">
              {service.vehicleSize}
            </span>

            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/90 text-slate-950 shadow-lg flex items-center space-x-1">
              <span>₹{service.price}</span>
            </span>
          </div>

          {/* Bottom on-image info */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
            <div className="flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] font-medium">
              <Clock className="h-3 w-3 text-cyan-400" />
              <span>{service.durationMinutes} mins wash</span>
            </div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider bg-slate-900/80 px-2 py-0.5 rounded">
              {service.category === 'CAR' ? '2 Car Bays' : '4 Bike Bays'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition line-clamp-1">
            {service.name}
          </h3>

          <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-2">
            {service.description}
          </p>

          {/* Highlights */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>Pressure rinse & snow foam shampoo</span>
            </div>
            {service.name.includes('Polish') && (
              <div className="flex items-center space-x-2 text-amber-300 font-medium">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>High-gloss machine paint polish</span>
              </div>
            )}
            {service.name.includes('Interior') && (
              <div className="flex items-center space-x-2 text-sky-300">
                <Zap className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                <span>Deep cabin vacuuming & dashboard dress</span>
              </div>
            )}
            {isBike && (
              <div className="flex items-center space-x-2">
                <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Chain & rim degreasing + air blow</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Action Button */}
      <div className="p-5 pt-0">
        <button
          onClick={() => onBook(service)}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/25 active:scale-[0.98] transition"
        >
          <span>Book Bay Slot</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
