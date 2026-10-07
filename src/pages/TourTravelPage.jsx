import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plane, MapPin, Calendar, Users, DollarSign, Send, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

const TourTravelPage = () => {
  const { travelDestinations, travelPackages, submitInquiry } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    secondaryPhone: '',
    fromCity: '',
    toDestination: '',
    travelDate: '',
    travelers: '',
    budget: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitInquiry({
      serviceType: 'Tour & Travel',
      ...formData
    });
    setIsSubmitting(false);
    setFormData({
      name: '',
      phone: '',
      secondaryPhone: '',
      fromCity: '',
      toDestination: '',
      travelDate: '',
      travelers: '',
      budget: '',
      details: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* HERO SECTION - Scenic Glow Environment */}
      <section className="relative p-8 sm:p-12 rounded-3xl glass-panel-cyan border border-teal-500/30 overflow-hidden shadow-[0_0_30px_rgba(0,210,255,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs font-mono">
            <Plane className="w-3.5 h-3.5" />
            SCENIC / OUTDOOR EXPLORATION GLOW ENVIRONMENT
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-wide">
            TOUR & TRAVEL
          </h1>

          <p className="text-teal-200 text-lg font-medium">
            Explore new places, create better memories.
          </p>

          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            Customized domestic and international tour packages, flight/train assistance, hotel bookings, and family holiday planning tailored for your dream vacation.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href="#destinations-grid"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(0,210,255,0.7)] transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Explore Destinations
            </a>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT: DESTINATIONS, PACKAGES & TRIP BOOKING FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT 2 COLS: POPULAR DESTINATIONS & PACKAGES */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* POPULAR DESTINATIONS GRID */}
          <div id="destinations-grid" className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-white">
              Popular Destinations
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(travelDestinations || []).map((dest) => (
                <div
                  key={dest.id}
                  className="group relative h-48 rounded-2xl overflow-hidden border border-teal-500/20 glass-panel hover:border-teal-400 transition-all hover:shadow-[0_0_25px_rgba(0,210,255,0.25)] flex flex-col justify-end p-4"
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-[#050b14]/50 to-transparent" />

                  <div className="relative z-10">
                    <span className="text-[10px] font-mono text-teal-300 tracking-wider">
                      {dest.tagline}
                    </span>
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-teal-300 transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-400 mt-0.5">
                      Starting {dest.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TRAVEL PACKAGES */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-white">
              Travel Packages
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(travelPackages || []).map((pkg) => (
                <div
                  key={pkg.id}
                  className="glass-panel p-5 rounded-2xl border border-teal-500/20 hover:border-teal-400 transition-all flex flex-col justify-between hover:shadow-[0_0_20px_rgba(0,210,255,0.2)]"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 mb-3">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-teal-300 font-mono mt-0.5">
                      {pkg.subtitle}
                    </p>
                    <p className="text-xs text-slate-300 mt-2">
                      Duration: {pkg.duration}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-teal-500/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-400">
                      {pkg.price}
                    </span>
                    <a
                      href="#plan-trip-form"
                      className="text-[11px] font-semibold text-slate-300 hover:text-white underline"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COL: TRIP BOOKING FORM */}
        <div id="plan-trip-form" className="lg:col-span-1">
          <div className="sticky top-24 glass-panel p-6 rounded-3xl border border-teal-500/30 shadow-[0_0_30px_rgba(0,210,255,0.15)] space-y-4">
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Plan Your Trip
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Fill in the details and we'll get back to you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-teal-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-teal-300 mb-1">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Primary contact"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-teal-950/40 border border-teal-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-teal-300 mb-1">
                    Secondary Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Optional"
                    value={formData.secondaryPhone}
                    onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-teal-950/40 border border-teal-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-teal-300 mb-1">
                    From City
                  </label>
                  <input
                    type="text"
                    placeholder="Where starting from?"
                    value={formData.fromCity}
                    onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-teal-950/40 border border-teal-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-teal-300 mb-1">
                    To Destination
                  </label>
                  <input
                    type="text"
                    placeholder="Where to go?"
                    value={formData.toDestination}
                    onChange={(e) => setFormData({ ...formData, toDestination: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-teal-950/40 border border-teal-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-teal-300 mb-1">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-teal-950/40 border border-teal-500/30 text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-teal-300 mb-1">
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    placeholder="Enter number"
                    value={formData.travelers}
                    onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-teal-950/40 border border-teal-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-teal-300 mb-1">
                  Budget (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter budget (e.g. ₹30,000)"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-teal-300 mb-1">
                  Extra Information / Note
                </label>
                <textarea
                  rows="3"
                  placeholder="Tell us anything else about your trip..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(0,210,255,0.7)] transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Travel Inquiry'}
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default TourTravelPage;
