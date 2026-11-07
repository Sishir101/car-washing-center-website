import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ServiceCard from './components/ServiceCard';
import BookingModal from './components/BookingModal';
import LiveStatusTrackerModal from './components/LiveStatusTrackerModal';
import OwnerQueueModal from './components/OwnerQueueModal';
import AuthModal from './components/AuthModal';
import {
  Car,
  Bike,
  Sparkles,
  Clock,
  ShieldCheck,
  Droplets,
  Phone,
  MapPin,
  CheckCircle2,
  Star,
  Navigation,
  Check,
} from 'lucide-react';

export default function App() {
  const { user, API_URL } = useAuth();
  const [activeTab, setActiveTab] = useState('BIKE'); // 'BIKE', 'CAR_SMALL', 'CAR_SUV'
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [showOwnerQueueModal, setShowOwnerQueueModal] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/services`);
      const data = await res.json();
      if (res.ok) {
        setAllServices(data.services || []);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter based on selected vehicle type
  const filteredServices = allServices.filter((s) => {
    if (activeTab === 'BIKE') return s.category === 'BIKE';
    if (activeTab === 'CAR_SMALL') {
      return s.category === 'CAR' && !s.name.includes('SUV');
    }
    if (activeTab === 'CAR_SUV') {
      return s.category === 'CAR' && s.name.includes('SUV');
    }
    return true;
  });

  const handleBookClick = (service) => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setSelectedServiceForBooking(service);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenTracker={() => setShowTrackerModal(true)}
        onOpenOwnerQueue={() => setShowOwnerQueueModal(true)}
      />

      {/* Hero Section with Cinematic Auto-Spa Background */}
      <section className="relative overflow-hidden py-12 sm:py-20 border-b border-slate-800/80">
        {/* Dark Hero Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 filter brightness-75 scale-105 pointer-events-none"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1600&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/95 to-slate-950 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Trust badges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-5">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-800/60 text-cyan-300 text-xs font-semibold shadow-md">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Official Online Booking • Dhanupali, Sambalpur</span>
            </span>
            <span className="hidden sm:inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-300 text-xs font-semibold">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>4.9 Customer Rated</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            HARI OM CAR & BIKE{' '}
            <span className="block mt-1 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
              WASHING CENTRE
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed flex items-center justify-center">
            <MapPin className="h-4 w-4 text-cyan-400 shrink-0 mr-1.5 inline" />
            <span>Near Bhatra Petrol Pump, Cuttack Road (50m from Aditya Kalyan Mandap), Dhanupali, Sambalpur</span>
          </p>

          {/* Quick Action & Contact Row */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 text-xs">
            <a
              href="tel:6372662335"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-cyan-300 hover:border-cyan-500 hover:bg-slate-800 transition shadow-sm"
            >
              <Phone className="h-3.5 w-3.5 text-cyan-400" />
              <span>Sishir: <strong>6372662335</strong></span>
            </a>
            <a
              href="tel:8328964190"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-cyan-300 hover:border-cyan-500 hover:bg-slate-800 transition shadow-sm"
            >
              <Phone className="h-3.5 w-3.5 text-cyan-400" />
              <span>Seshadev (Manager): <strong>8328964190</strong></span>
            </a>
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-800/50 text-emerald-300 font-medium">
              <Clock className="h-3.5 w-3.5" />
              <span>Daily: 7:00 AM – 8:00 PM</span>
            </span>
          </div>

          {/* Vehicle Category Selector Tabs */}
          <div className="mt-9 inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-2xl max-w-full overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('BIKE')}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeTab === 'BIKE'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bike className="h-4 w-4" />
              <span>Bikes & 2-Wheelers (4 Bays)</span>
            </button>
            <button
              onClick={() => setActiveTab('CAR_SMALL')}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeTab === 'CAR_SMALL'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Car className="h-4 w-4" />
              <span>Small Cars & Sedans</span>
            </button>
            <button
              onClick={() => setActiveTab('CAR_SUV')}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeTab === 'CAR_SUV'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Car className="h-4 w-4 text-cyan-300" />
              <span>SUVs & 4x4 Heavy</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {activeTab === 'BIKE' && '2-Wheeler Washing Packages (From ₹60)'}
              {activeTab === 'CAR_SMALL' && 'Small Cars & Sedans Packages (From ₹180)'}
              {activeTab === 'CAR_SUV' && 'SUV & Heavy 4x4 Packages (From ₹200)'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your package to reserve an hourly bay slot and skip the waiting line
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-300 self-start sm:self-auto">
            {activeTab === 'BIKE' ? '4 Dedicated Bike Bays' : '2 Dedicated Car Bays'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={handleBookClick}
              />
            ))}
          </div>
        )}

        {/* Real-World Operational Highlights */}
        <section className="mt-14 pt-10 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center">
            <Clock className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">4 Bike & 2 Car Bays</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Database concurrency strictly limits appointments per slot to eliminate bay overcrowding.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center">
            <Droplets className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">Live Wash Status Stepper</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Drop your vehicle off and track exactly when it enters washing, drying, and pickup readiness.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center">
            <ShieldCheck className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">Owner & Manager Console</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Seshadev and Sishir can manage today's schedule, call vehicle owners, and update wash stages with 1 click.
            </p>
          </div>
        </section>

        {/* Location & Directions Card */}
        <section className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Navigation className="h-4 w-4" />
              <span>Visit Our Center</span>
            </div>
            <h3 className="text-base font-bold text-white">Hari Om Car & Bike Washing Centre</h3>
            <p className="text-xs text-slate-400">
              Near Bhatra Petrol Pump, Cuttack Road (50m from Aditya Kalyan Mandap), Dhanupali, Sambalpur, Odisha
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <a
              href="https://maps.google.com/?q=Bhatra+Petrol+Pump+Dhanupali+Sambalpur"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs text-white shadow-md shadow-cyan-600/20 transition flex items-center space-x-1.5"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Get Directions</span>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 px-4">
        <p className="font-semibold text-slate-400">
          Hari Om Car & Bike Washing Centre • Dhanupali, Sambalpur, Odisha
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Full-Stack Slot Reservation & Live Queue SaaS • Engineered by Sishir Ranjan Sanbad
        </p>
      </footer>

      {/* Modals */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {selectedServiceForBooking && (
        <BookingModal
          service={selectedServiceForBooking}
          onClose={() => setSelectedServiceForBooking(null)}
          onBookingSuccess={() => {
            setShowTrackerModal(true);
          }}
        />
      )}
      {showTrackerModal && <LiveStatusTrackerModal onClose={() => setShowTrackerModal(false)} />}
      {showOwnerQueueModal && <OwnerQueueModal onClose={() => setShowOwnerQueueModal(false)} />}
    </div>
  );
}
