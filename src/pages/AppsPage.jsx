import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Grid, PlusSquare, Zap, Plane, Activity, Briefcase, Download, Send, CheckCircle2 } from 'lucide-react';

const AppsPage = () => {
  const { apps, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const getAppIcon = (iconName) => {
    switch (iconName) {
      case 'PlusSquare': return <PlusSquare className="w-6 h-6 text-cyan-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Plane': return <Plane className="w-6 h-6 text-teal-400" />;
      case 'Activity': return <Activity className="w-6 h-6 text-blue-400" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-indigo-400" />;
      default: return <Grid className="w-6 h-6 text-cyan-400" />;
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast('Subscribed to newsletter updates!', 'success');
    setNewsletterEmail('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Grid className="w-4 h-4" />
          DIGITAL SOFTWARE & UTILITIES
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-metallic tracking-wide">
          OUR APPS
        </h1>
        <p className="text-cyan-200 text-base font-medium">
          Useful applications & tools for your daily business and personal needs.
        </p>
      </div>

      {/* APPS CATALOG GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(apps || []).map((appItem) => (
          <div
            key={appItem.id}
            className="group glass-panel rounded-3xl p-6 border border-cyan-500/20 hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,210,255,0.2)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 group-hover:scale-110 transition-transform">
                  {getAppIcon(appItem.icon)}
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  {appItem.category}
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-white group-hover:text-cyan-300 transition-colors">
                {appItem.name}
              </h3>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {appItem.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-cyan-500/10 flex items-center justify-between">
              <a
                href={appItem.downloadUrl || '#'}
                onClick={(e) => {
                  if (appItem.downloadUrl === '#') {
                    e.preventDefault();
                    showToast(`Requesting launch info for ${appItem.name}`, 'info');
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-semibold text-xs hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400 transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(0,210,255,0.3)]"
              >
                <Download className="w-3.5 h-3.5" />
                View / Download App
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* NEWSLETTER SUBSCRIBE BOX ("Stay Connected") */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,210,255,0.15)] max-w-4xl mx-auto text-center space-y-4">
        <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
          Stay Connected
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Keep getting updates about our latest desktop apps, electrical services, and exclusive travel holiday packages.
        </p>

        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            required
            placeholder="Enter your email address..."
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,210,255,0.4)] hover:shadow-[0_0_25px_rgba(0,210,255,0.7)] transition-all flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            Subscribe Now
          </button>
        </form>
      </div>

    </div>
  );
};

export default AppsPage;
