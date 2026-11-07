import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, Bike, Sparkles, LogIn, LogOut, User, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function Navbar({ onOpenAuth, onOpenTracker, onOpenOwnerQueue }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 glass border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                HARI OM
              </span>
              <span className="text-xs font-bold text-slate-200">
                WASHING CENTRE
              </span>
              <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold tracking-wider uppercase">
                Sambalpur
              </span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center space-x-1">
              <MapPin className="h-3 w-3 text-cyan-400" />
              <span>Dhanupali, Cuttack Road</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {user.role === 'OWNER' && (
                <button
                  onClick={onOpenOwnerQueue}
                  className="flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Owner Live Queue</span>
                </button>
              )}

              <button
                onClick={onOpenTracker}
                className="flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <Clock className="h-4 w-4 text-cyan-400" />
                <span>My Wash Status</span>
              </button>

              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 uppercase tracking-wider font-bold">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition"
            >
              <LogIn className="h-4 w-4" />
              <span>Customer Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
