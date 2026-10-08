import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Crown, Home, Info, Phone, Grid, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { setIsDrawerOpen, settings } = useApp();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#030712]/80 border-b border-cyan-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Hamburger Drawer Trigger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-900/60 hover:border-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,210,255,0.2)] focus:outline-none"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo & Crown Emblem Image */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center">
              <img
                src="/logo.png"
                alt="KHAN Logo"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-all duration-300 drop-shadow-[0_0_12px_rgba(0,210,255,0.8)]"
              />
              <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full -z-10"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-2xl tracking-wider text-metallic group-hover:drop-shadow-[0_0_15px_rgba(0,210,255,0.9)] transition-all">
                {settings.companyName || 'KHAN'}
              </span>
              <span className="text-[10px] tracking-widest text-cyan-400/90 font-mono -mt-1">
                {settings.domain || 'khanelectrics.in'}
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-cyan-950/30 p-1.5 rounded-full border border-cyan-500/20">
          <Link
            to="/"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              isActive('/')
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-[0_0_15px_rgba(0,210,255,0.5)]'
                : 'text-slate-300 hover:text-white hover:bg-cyan-900/40'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>

          <Link
            to="/about"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              isActive('/about')
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-[0_0_15px_rgba(0,210,255,0.5)]'
                : 'text-slate-300 hover:text-white hover:bg-cyan-900/40'
            }`}
          >
            <Info className="w-4 h-4" />
            About
          </Link>

          <Link
            to="/contact"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              isActive('/contact')
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-[0_0_15px_rgba(0,210,255,0.5)]'
                : 'text-slate-300 hover:text-white hover:bg-cyan-900/40'
            }`}
          >
            <Phone className="w-4 h-4" />
            Contact
          </Link>

          <Link
            to="/apps"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              isActive('/apps')
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-[0_0_15px_rgba(0,210,255,0.5)]'
                : 'text-slate-300 hover:text-white hover:bg-cyan-900/40'
            }`}
          >
            <Grid className="w-4 h-4" />
            Apps
          </Link>
        </nav>

        {/* Right Section / Menu indicator */}
        <div className="flex items-center gap-3 text-xs text-cyan-400 font-mono">
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20">
            {settings.companyName || 'KHAN'} Portal
          </span>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
