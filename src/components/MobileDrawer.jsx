import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Crown, Code2, Zap, Plane, Grid, Lock, Home, Info, Phone, ExternalLink, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MobileDrawer = () => {
  const { isDrawerOpen, setIsDrawerOpen, apps, settings } = useApp();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleLinkClick = (path) => {
    setIsDrawerOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-md bg-[#050b14]/95 border-r border-cyan-500/30 shadow-[0_0_50px_rgba(0,210,255,0.2)] text-white flex flex-col justify-between overflow-y-auto">
          
          <div>
            {/* Header */}
            <div className="p-6 border-b border-cyan-500/20 flex items-center justify-between bg-cyan-950/20">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="KHAN Logo"
                  className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(0,210,255,0.8)]"
                />
                <div>
                  <h2 className="font-display font-bold text-xl tracking-wider text-metallic">
                    {settings.companyName || 'KHAN'}
                  </h2>
                  <p className="text-xs text-cyan-400 font-mono">
                    {settings.domain || 'khanelectrics.in'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-xl bg-cyan-950/60 text-slate-400 hover:text-white hover:bg-cyan-900/80 border border-cyan-500/20 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Sections */}
            <div className="p-6 space-y-8">
              
              {/* Main Navigation */}
              <div>
                <p className="text-xs font-semibold tracking-wider text-cyan-400/70 uppercase mb-3 font-mono">
                  Main Navigation
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => handleLinkClick('/')}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-cyan-950/40 hover:text-cyan-300 text-slate-200 text-left transition-all border border-transparent hover:border-cyan-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <Home className="w-5 h-5 text-cyan-400" />
                      <span className="font-medium text-sm">Home</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>

                  <button
                    onClick={() => handleLinkClick('/about')}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-cyan-950/40 hover:text-cyan-300 text-slate-200 text-left transition-all border border-transparent hover:border-cyan-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-cyan-400" />
                      <span className="font-medium text-sm">About Us</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>

                  <button
                    onClick={() => handleLinkClick('/contact')}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-cyan-950/40 hover:text-cyan-300 text-slate-200 text-left transition-all border border-transparent hover:border-cyan-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-cyan-400" />
                      <span className="font-medium text-sm">Contact Us</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Quick Services Navigation */}
              <div>
                <p className="text-xs font-semibold tracking-wider text-cyan-400/70 uppercase mb-3 font-mono">
                  Our Services
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleLinkClick('/services/web-development')}
                    className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/50 to-blue-950/40 border border-cyan-500/30 hover:border-cyan-400 text-left group transition-all shadow-[0_0_15px_rgba(0,210,255,0.1)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-cyan-100 group-hover:text-cyan-300">
                          Web Development
                        </h4>
                        <p className="text-[11px] text-slate-400">Websites, Apps & Portals</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleLinkClick('/services/electrician')}
                    className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/50 to-orange-950/40 border border-amber-500/30 hover:border-amber-400 text-left group transition-all shadow-[0_0_15px_rgba(255,183,3,0.1)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-amber-100 group-hover:text-amber-300">
                          Khan Electrician Service
                        </h4>
                        <p className="text-[11px] text-slate-400">Wiring, Repairs & CCTV</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleLinkClick('/services/tour-travel')}
                    className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-teal-950/50 to-emerald-950/40 border border-teal-500/30 hover:border-teal-400 text-left group transition-all shadow-[0_0_15px_rgba(0,210,255,0.1)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform">
                        <Plane className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-teal-100 group-hover:text-teal-300">
                          Tour and Travel
                        </h4>
                        <p className="text-[11px] text-slate-400">Packages & Trips</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Dedicated "Our Apps" Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold tracking-wider text-cyan-400/70 uppercase font-mono">
                    Dedicated Apps
                  </p>
                  <button
                    onClick={() => handleLinkClick('/apps')}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    View All <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(apps || []).slice(0, 4).map((appItem) => (
                    <button
                      key={appItem.id}
                      onClick={() => handleLinkClick('/apps')}
                      className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 hover:border-cyan-400 text-left text-xs transition-all hover:bg-cyan-900/40 flex items-center gap-2 group"
                    >
                      <Grid className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span className="truncate font-medium text-slate-200 group-hover:text-white">
                        {appItem.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Footer of Drawer - Admin Login Link */}
          <div className="p-6 border-t border-cyan-500/20 bg-cyan-950/30">
            <button
              onClick={() => handleLinkClick('/admin')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-sm shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(0,210,255,0.6)] hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Admin Portal Access
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
