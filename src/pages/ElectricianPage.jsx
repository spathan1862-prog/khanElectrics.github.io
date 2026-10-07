import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Zap, ShieldCheck, Wrench, Flame, Camera, BatteryCharging, Lightbulb, TrendingUp, PhoneCall, Send, Image, Film } from 'lucide-react';

const ElectricianPage = () => {
  const { electricianServices, electricianGallery, submitInquiry, settings } = useApp();
  const [activeTab, setActiveTab] = useState('photo');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    rooms: '',
    fittingsCount: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(handleSubmit);

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-amber-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Camera': return <Camera className="w-5 h-5 text-amber-400" />;
      case 'BatteryCharging': return <BatteryCharging className="w-5 h-5 text-amber-400" />;
      case 'Lightbulb': return <Lightbulb className="w-5 h-5 text-amber-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-amber-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-amber-400" />;
      default: return <Zap className="w-5 h-5 text-amber-400" />;
    }
  };

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    await submitInquiry({
      serviceType: 'Electrician',
      ...formData
    });
    setIsSubmitting(false);
    setFormData({
      name: '',
      phone: '',
      rooms: '',
      fittingsCount: '',
      details: ''
    });
  }

  const photos = electricianGallery?.filter(item => item.type === 'photo' || !item.type) || [];
  const videos = electricianGallery?.filter(item => item.type === 'video') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* HERO SECTION - Warm Amber Industrial Glow */}
      <section className="relative p-8 sm:p-12 rounded-3xl glass-panel-amber border border-amber-500/30 overflow-hidden shadow-[0_0_30px_rgba(255,183,3,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 fill-current" />
            INDUSTRIAL AMBER / ELECTRIC GLOW ENVIRONMENT
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-wide">
            KHAN ELECTRICIAN SERVICE
          </h1>

          <p className="text-amber-200 text-lg font-medium">
            Safe, Reliable, Professional electrical services.
          </p>

          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            Certified electrical installations, house rewiring, welding, CCTV camera setups, inverter installations, and emergency maintenance. Available across Badnapur, Jalna & surrounding areas.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={`tel:${settings.phone}`}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(255,183,3,0.4)] hover:shadow-[0_0_30px_rgba(255,183,3,0.7)] transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              Direct Hotline: {settings.phone || '+91 96765 43210'}
            </a>
            <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold px-4 py-2 rounded-full bg-amber-950/40 border border-amber-500/30">
              <ShieldCheck className="w-4 h-4" /> 100% Safety Guarantee
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT: SERVICES GRID & BOOKING FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT 2 COLS: OUR SERVICES GRID & MEDIA GALLERY */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* SERVICE GRID */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-white">
              Our Services
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(electricianServices || []).map((service) => (
                <div
                  key={service.id}
                  className="glass-panel p-4 rounded-2xl border border-amber-500/20 hover:border-amber-400 transition-all hover:scale-[1.02] flex flex-col items-start gap-2 hover:shadow-[0_0_20px_rgba(255,183,3,0.2)]"
                >
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    {getIconComponent(service.icon)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-white">
                      {service.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MEDIA GALLERY */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-2xl text-white">
                Work Showcase Gallery
              </h2>
              
              {/* Tabs */}
              <div className="flex items-center gap-2 bg-amber-950/40 p-1 rounded-xl border border-amber-500/20">
                <button
                  onClick={() => setActiveTab('photo')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'photo'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-amber-200 hover:bg-amber-900/40'
                  }`}
                >
                  <Image className="w-3.5 h-3.5" />
                  Photo Gallery
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'video'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-amber-200 hover:bg-amber-900/40'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  Video Gallery
                </button>
              </div>
            </div>

            {/* Gallery Content */}
            {activeTab === 'photo' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {photos.map((item) => (
                  <div
                    key={item.id}
                    className="group relative h-36 rounded-2xl overflow-hidden border border-amber-500/20 glass-panel"
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-medium text-amber-200 truncate pr-2">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl glass-panel text-center border border-amber-500/20">
                {videos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {videos.map((v) => (
                      <div key={v.id} className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/40 text-left">
                        <p className="text-xs font-bold text-amber-300">{v.title}</p>
                        <a href={v.url} target="_blank" rel="noreferrer" className="text-[11px] text-cyan-400 underline mt-1 block">
                          Watch Video Link
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Video work demonstrations coming soon! Contact hotline for live site references.
                  </p>
                )}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COL: SERVICE BOOKING FORM */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 glass-panel-amber p-6 rounded-3xl border border-amber-500/30 shadow-[0_0_30px_rgba(255,183,3,0.15)] space-y-4">
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Request Electrical Service
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Tell us about your requirement and we'll get back to you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-amber-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-amber-300 mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter your contact number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-amber-300 mb-1">
                  Number of Rooms / Site Type
                </label>
                <input
                  type="text"
                  placeholder="Enter number of rooms (e.g. 3 BHK, Shop)"
                  value={formData.rooms}
                  onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-amber-300 mb-1">
                  Light / Electrical Fittings Count
                </label>
                <input
                  type="text"
                  placeholder="e.g. 8 lights, 4 fans, 2 switches..."
                  value={formData.fittingsCount}
                  onChange={(e) => setFormData({ ...formData, fittingsCount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-amber-300 mb-1">
                  Extra Information / Note
                </label>
                <textarea
                  rows="3"
                  placeholder="Tell us more about your requirement..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(255,183,3,0.4)] hover:shadow-[0_0_30px_rgba(255,183,3,0.7)] transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Request Electrical Service
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ElectricianPage;
