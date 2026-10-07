import React from 'react';
import { useApp } from '../context/AppContext';
import { Crown, Code2, Zap, Plane, ShieldCheck, Headphones, Smile, Award } from 'lucide-react';

const AboutPage = () => {
  const { settings } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* HEADER HERO */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Crown className="w-4 h-4 text-cyan-400" />
          ABOUT KHAN - KHANELECTRICS.IN
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-metallic tracking-wide">
          ABOUT US
        </h1>
        <p className="text-cyan-200 text-base font-medium">
          Your Trusted Partner in Technology, Electrical Services & Travel.
        </p>
      </div>

      {/* WHO WE ARE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="glass-panel p-8 rounded-3xl border border-cyan-500/20 space-y-4">
          <h2 className="font-display font-bold text-2xl text-white">
            Who We Are
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Khan is a multi-service platform offering professional web development, trusted electrician services, and memorable tour & travel experiences. We focus on quality, reliability, and customer satisfaction across every single service we deliver.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Based in Badnapur, Jalna, Maharashtra, we bridge the gap between futuristic digital engineering and essential physical services, giving local businesses and individuals a single point of excellence.
          </p>

          <div className="pt-4 grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-center">
              <Code2 className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-slate-200">Web Dev</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/20 text-center">
              <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-slate-200">Electrician</p>
            </div>
            <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-500/20 text-center">
              <Plane className="w-5 h-5 text-teal-400 mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-slate-200">Tour & Travel</p>
            </div>
          </div>
        </div>

        {/* Media visual mockup container */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-cyan-500/30 p-2 shadow-[0_0_35px_rgba(0,210,255,0.2)]">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
            alt="Khan Team & Workspace"
            className="w-full h-80 object-cover rounded-2xl opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl backdrop-blur-md bg-slate-950/70 border border-cyan-500/30 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-cyan-300 block">Khan Multi-Service Hub</span>
              <span className="text-slate-400 text-[11px]">{settings.location || 'Badnapur, Jalna, Maharashtra'}</span>
            </div>
            <Award className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US - TRUST BADGES */}
      <div className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-white text-center">
          Why Choose Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-400 transition-all flex items-start gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Professional Service
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Experienced & expert team dedicated to delivering high quality work.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-400 transition-all flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Reliable Support
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                We are always here for you with hotline assistance and maintenance.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-400 transition-all flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 shrink-0">
              <Smile className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Customer Satisfaction
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Your happiness and safety is our top priority in every project.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;
