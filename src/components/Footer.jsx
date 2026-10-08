import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Phone, Mail, MapPin, Globe, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Footer = () => {
  const { settings } = useApp();

  return (
    <footer className="w-full bg-[#050b14] border-t border-cyan-500/20 text-slate-400 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="KHAN Logo"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-all duration-300 drop-shadow-[0_0_10px_rgba(0,210,255,0.8)]"
              />
              <div>
                <span className="font-display font-extrabold text-2xl tracking-wider text-metallic">
                  {settings.companyName || 'KHAN'}
                </span>
                <p className="text-xs text-cyan-400 font-mono">
                  {settings.domain || 'khanelectrics.in'}
                </p>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Khan is a multi-service platform offering professional web development, trusted electrician services, and memorable tour & travel experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-cyan-300 tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/apps" className="hover:text-cyan-400 transition-colors">Our Apps</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" /> Admin CMS
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-cyan-300 tracking-wider uppercase">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services/web-development" className="hover:text-cyan-400 transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/services/electrician" className="hover:text-amber-400 transition-colors">
                  Khan Electrician Service
                </Link>
              </li>
              <li>
                <Link to="/services/tour-travel" className="hover:text-teal-400 transition-colors">
                  Tour & Travel Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-cyan-300 tracking-wider uppercase">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-cyan-300 transition-colors">
                  {settings.phone || '+91 96765 43210'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-cyan-300 transition-colors truncate">
                  {settings.email || 'info@khanelectrics.in'}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{settings.location || 'Badnapur, Jalna, Maharashtra'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{settings.website || 'www.khanelectrics.in'}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-cyan-500/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} KHAN (khanelectrics.in). All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-cyan-400/70">Dark Cyber Futuristic Glow Theme</span>
            <span>•</span>
            <span>Badnapur, Jalna</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
