import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Globe, Send, MessageSquare } from 'lucide-react';

const ContactPage = () => {
  const { settings, submitInquiry } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitInquiry({
      serviceType: 'General Contact',
      name: formData.name,
      email: formData.email,
      details: formData.message
    });
    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-metallic tracking-wide">
          CONTACT US
        </h1>
        <p className="text-cyan-200 text-base font-medium">
          Get in touch with us. We're here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COL: CONTACT CARDS & EMBEDDED MAP */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Phone */}
            <a
              href={`tel:${settings.phone}`}
              className="glass-panel p-5 rounded-2xl border border-cyan-500/20 hover:border-cyan-400 transition-all flex items-center gap-3 group"
            >
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] text-slate-400 block font-mono">CALL US</span>
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate block">
                  {settings.phone || '+91 96765 43210'}
                </span>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${settings.email}`}
              className="glass-panel p-5 rounded-2xl border border-cyan-500/20 hover:border-cyan-400 transition-all flex items-center gap-3 group"
            >
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] text-slate-400 block font-mono">EMAIL US</span>
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate block">
                  {settings.email || 'info@khanelectrics.in'}
                </span>
              </div>
            </a>

            {/* Location */}
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-mono">OUR LOCATION</span>
                <span className="text-xs font-bold text-white block">
                  {settings.location || 'Badnapur, Jalna, Maharashtra'}
                </span>
              </div>
            </div>

            {/* Website */}
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-400/30">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-mono">WEBSITE</span>
                <span className="text-xs font-bold text-white block">
                  {settings.website || 'www.khanelectrics.in'}
                </span>
              </div>
            </div>

          </div>

          {/* EMBEDDED MAP OF BADNAPUR, JALNA */}
          <div className="glass-panel p-4 rounded-3xl border border-cyan-500/20 shadow-lg space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-mono font-semibold text-cyan-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" /> Map View: Badnapur, Jalna, Maharashtra
              </span>
            </div>
            
            <div className="relative h-64 rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950">
              <iframe
                title="Badnapur Jalna Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3752.483984712034!2d75.9256191!3d19.8660312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdba5980e14a849%3A0xa193b2a8f89e2cf!2sBadnapur%2C%20Maharashtra%20431202!5e0!3m2!1sen!2sin!4v1712480000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COL: SEND US A MESSAGE FORM */}
        <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,210,255,0.15)] space-y-6">
          <div>
            <h3 className="font-display font-bold text-2xl text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
              Send Us a Message
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Drop us your message and we'll reply right away.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-cyan-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-cyan-300 mb-1">
                Email ID *
              </label>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-cyan-300 mb-1">
                Message *
              </label>
              <textarea
                rows="5"
                required
                placeholder="Enter your message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(0,210,255,0.7)] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default ContactPage;
