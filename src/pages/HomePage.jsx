import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Code2, Zap, Plane, User, Mail, Phone, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const HomePage = () => {
  const { settings } = useApp();

  return (
    <div className="space-y-12 pb-16">
      
      {/* HERO SECTION: Glowing 3D Brand Emblem "KHAN" */}
      <section className="relative pt-12 pb-8 px-4 text-center overflow-hidden flex flex-col items-center justify-center">
        {/* Glowing Background Radial Halo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-gradient-to-r from-cyan-500/20 via-blue-600/30 to-cyan-400/20 blur-[90px] rounded-full pointer-events-none -z-10" />

        {/* 3D Brand Crown Emblem */}
        <div className="relative inline-block mb-4 animate-float">
          <img
            src="/logo.png"
            alt="KHAN Official Logo"
            className="w-28 h-28 sm:w-36 sm:h-36 object-contain mx-auto filter drop-shadow-[0_0_25px_rgba(0,210,255,0.9)]"
          />
          <div className="absolute inset-0 bg-cyan-400/30 blur-2xl rounded-full -z-10" />
        </div>

        {/* Main Brand Title */}
        <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-widest text-metallic drop-shadow-[0_0_35px_rgba(0,210,255,0.6)] uppercase">
          {settings.companyName || 'KHAN'}
        </h1>

        {/* Brand Domain Subtitle with Electric Lines */}
        <div className="mt-2 flex items-center justify-center gap-4">
          <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-cyan-400" />
          <span className="font-mono text-sm sm:text-lg font-semibold text-cyan-400 tracking-[0.3em] uppercase drop-shadow-[0_0_10px_rgba(0,210,255,0.8)]">
            {settings.domain || 'khanelectrics.in'}
          </span>
          <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-cyan-400" />
        </div>

        <p className="mt-4 max-w-2xl text-slate-300 text-sm sm:text-base font-medium">
          {settings.heroSubtitle || 'Modern websites, professional electrician services, and memorable travel experiences.'}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/contact"
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,210,255,0.5)] hover:shadow-[0_0_35px_rgba(0,210,255,0.8)] hover:scale-105 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            Get In Touch
          </Link>
          <Link
            to="/about"
            className="px-6 py-2.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-semibold text-sm hover:bg-cyan-900/50 hover:border-cyan-400 transition-all"
          >
            Explore Services
          </Link>
        </div>
      </section>

      {/* SERVICE CARDS GRID (Exact 3 visuals matching uploaded reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Service Card 1: Web Development (Cyan Tech Glow) */}
          <Link
            to="/services/web-development"
            className="group relative rounded-3xl p-6 glass-panel-cyan glass-card-hover overflow-hidden flex flex-col justify-between min-h-[300px] border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 shadow-[0_0_25px_rgba(0,210,255,0.15)] hover:shadow-[0_0_40px_rgba(0,210,255,0.35)]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/25 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,210,255,0.3)]">
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  DIGITAL SERVICES
                </span>
              </div>

              {/* Graphic Mock Visual */}
              <div className="my-4 relative h-28 rounded-2xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-cyan-950/60 to-slate-950 flex items-center justify-center group-hover:border-cyan-400/50 transition-all">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
                  alt="Web Development Visual"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-cyan-300 font-mono">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Full-Stack React & Node
                </div>
              </div>

              <h3 className="font-display font-bold text-2xl text-white group-hover:text-cyan-300 transition-colors">
                Web Development
              </h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                Modern websites & web apps for your business. Fast, responsive, and tailored to your needs.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-cyan-500/20 flex items-center justify-between text-xs font-semibold text-cyan-400">
              <span>View Projects & Packages</span>
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Service Card 2: Khan Electrician Service (Warm Amber Glow) */}
          <Link
            to="/services/electrician"
            className="group relative rounded-3xl p-6 glass-panel-amber glass-card-amber-hover overflow-hidden flex flex-col justify-between min-h-[300px] border border-amber-500/30 hover:border-amber-400 transition-all duration-300 shadow-[0_0_25px_rgba(255,183,3,0.15)] hover:shadow-[0_0_40px_rgba(255,183,3,0.35)]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/25 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,183,3,0.3)]">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/30">
                  ELECTRICAL EXPERTS
                </span>
              </div>

              {/* Graphic Mock Visual */}
              <div className="my-4 relative h-28 rounded-2xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-amber-950/60 to-slate-950 flex items-center justify-center group-hover:border-amber-400/50 transition-all">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
                  alt="Electrician Service Visual"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-amber-300 font-mono">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  House Wiring & Repairs
                </div>
              </div>

              <h3 className="font-display font-bold text-2xl text-white group-hover:text-amber-300 transition-colors">
                Khan Electrician Service
              </h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                Safe, reliable, professional electrical services. Complete wiring, maintenance & fittings.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-500/20 flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>Book Electrical Service</span>
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Service Card 3: Tour and Travel (Teal/Cyan Landscape Visual) */}
          <Link
            to="/services/tour-travel"
            className="group relative rounded-3xl p-6 glass-panel-cyan glass-card-hover overflow-hidden flex flex-col justify-between min-h-[300px] border border-teal-500/30 hover:border-teal-400 transition-all duration-300 shadow-[0_0_25px_rgba(0,210,255,0.15)] hover:shadow-[0_0_40px_rgba(0,210,255,0.35)]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/25 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,210,255,0.3)]">
                  <Plane className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider bg-teal-950/80 text-teal-300 border border-teal-500/30">
                  VACATIONS & TOURS
                </span>
              </div>

              {/* Graphic Mock Visual */}
              <div className="my-4 relative h-28 rounded-2xl overflow-hidden border border-teal-500/20 bg-gradient-to-br from-teal-950/60 to-slate-950 flex items-center justify-center group-hover:border-teal-400/50 transition-all">
                <img
                  src="https://images.unsplash.com/photo-1605649487210-478a983b6c20?auto=format&fit=crop&w=600&q=80"
                  alt="Tour and Travel Visual"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-teal-300 font-mono">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  Kashmir, Goa & Ladakh
                </div>
              </div>

              <h3 className="font-display font-bold text-2xl text-white group-hover:text-teal-300 transition-colors">
                Tour and Travel
              </h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                Explore new places, create better memories. Customized family tours and holiday packages.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-teal-500/20 flex items-center justify-between text-xs font-semibold text-teal-400">
              <span>Plan Your Trip</span>
              <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-slate-950 transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* BOTTOM QUICK INFO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* "About Us" Brief Summary Card */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/20 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                About Us
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Khan is a multi-service platform offering professional web development, trusted electrician services, and memorable tour & travel experiences. We focus on quality, reliability, and customer satisfaction across all our offerings.
              </p>
              <Link
                to="/about"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Learn More About Us <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* "Contact Us" Quick Card */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/20 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Contact Us
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>{settings.phone || '+91 96765 43210'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>{settings.email || 'info@khanelectrics.in'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{settings.location || 'Badnapur, Jalna, Maharashtra'}</span>
              </div>
              <Link
                to="/contact"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Send Us a Message <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default HomePage;
