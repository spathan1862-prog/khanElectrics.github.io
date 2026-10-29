import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEOHead from '../components/SEOHead';
import {
  Zap,
  ShieldCheck,
  Wrench,
  Flame,
  Camera,
  BatteryCharging,
  Lightbulb,
  TrendingUp,
  PhoneCall,
  Send,
  Image as ImageIcon,
  Film,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Share2,
  Phone,
  MapPin,
  Clock,
  Calendar,
  X,
  Video
} from 'lucide-react';

const ElectricianPage = () => {
  const { electricianServices, electricianGallery, submitInquiry, settings, servicePages } = useApp();
  const pageData = servicePages?.['electrician'] || {};

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'before-after', 'completed', 'videos'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceRequired: 'House Wiring & Fitting',
    location: '',
    preferredTime: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await submitInquiry({
      serviceType: 'Electrician',
      ...formData
    });
    setIsSubmitting(false);

    if (result && result.success) {
      setSubmittedLead({
        name: formData.name,
        phone: formData.phone
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        serviceRequired: 'House Wiring & Fitting',
        location: '',
        preferredTime: '',
        details: ''
      });
    }
  };

  const publishedGallery = (electricianGallery || []).filter(item => item.isPublished !== false);

  const beforeAfterItems = publishedGallery.filter(item => Boolean(item.beforeImage && item.afterImage));
  const videoItems = publishedGallery.filter(item => Boolean(item.videoUrl || item.type === 'video'));

  const displayedGallery = activeTab === 'before-after'
    ? beforeAfterItems
    : activeTab === 'videos'
      ? videoItems
      : publishedGallery;

  const sections = Array.isArray(pageData.sections)
    ? pageData.sections.filter(s => s.isVisible !== false)
    : [];
  const faqs = Array.isArray(pageData.faqs) ? pageData.faqs : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* TARGETED LOCAL SEO */}
      <SEOHead
        title={pageData.seoTitle || "Electrician in Badnapur & Jalna Maharashtra | House Wiring Services"}
        description={pageData.seoDescription || "Certified electrician services in Badnapur, Jalna & Aurangabad. House wiring, electrical repair, CCTV, inverter installation, and safety upgrades."}
        keywords={pageData.seoKeywords || "electrician in Badnapur, electrician in Jalna Maharashtra, electrician services in Aurangabad, house wiring services in Jalna, electrical repair and installation Jalna"}
        canonicalUrl="https://khanelectrics.in/services/electrician"
      />

      {/* HERO SECTION - Warm Amber Industrial Glow */}
      <section className="relative p-8 sm:p-12 rounded-3xl glass-panel-amber border border-amber-500/30 overflow-hidden shadow-[0_0_30px_rgba(255,183,3,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 fill-current" />
              {pageData.badge || 'INDUSTRIAL AMBER / ELECTRIC GLOW ENVIRONMENT'}
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-wide">
              {pageData.title || 'KHAN ELECTRICIAN SERVICE'}
            </h1>

            <p className="text-amber-200 text-lg font-medium">
              {pageData.subtitle || 'Trusted, certified electrician & multi-service repairs.'}
            </p>

            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
              {pageData.heroDescription || 'Professional residential, commercial, and industrial electrical solutions across Badnapur, Jalna, and Aurangabad. Expert house wiring, panel installation, motor rewinding, CCTV security, and emergency repairs.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#booking-form"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(255,183,3,0.4)] hover:shadow-[0_0_30px_rgba(255,183,3,0.7)] transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                {pageData.ctaText || 'Call Electrician / Book Visit'}
              </a>

              <a
                href="tel:+917822886909"
                className="px-6 py-3 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:text-white font-bold text-sm transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                +91 7822886909
              </a>

              <a
                href="https://wa.me/917822886909?text=Hello%20Khan%20Electrics,%20I%20need%20an%20electrician%20at%20my%20location."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-slate-950 font-bold text-sm transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Share2 className="w-4 h-4" />
                WhatsApp Direct
              </a>
            </div>
          </div>

          {pageData.heroImage && (
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-[0_0_30px_rgba(255,183,3,0.25)]">
                <img
                  src={pageData.heroImage}
                  alt={pageData.title || 'Electrician Works'}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CORE ELECTRICAL SERVICES GRID */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">
            Our Electrical Specializations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Certified residential, commercial, and industrial electrical contracting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(electricianServices || []).map((serv) => (
            <div
              key={serv.id}
              className="p-5 rounded-2xl glass-panel-amber border border-amber-500/20 hover:border-amber-400 transition-all space-y-2 hover:shadow-[0_0_20px_rgba(255,183,3,0.2)]"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                {getIconComponent(serv.icon)}
              </div>
              <h3 className="font-bold text-base text-white">{serv.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{serv.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WORK GALLERY & BEFORE/AFTER SHOWCASE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-2xl text-white">
                Work Gallery & Proof of Work
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Before-and-after photos, completed wiring panels, and site demonstrations.
              </p>
            </div>

            {/* Gallery Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-amber-500/30 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                All ({publishedGallery.length})
              </button>
              {beforeAfterItems.length > 0 && (
                <button
                  onClick={() => setActiveTab('before-after')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === 'before-after' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Before & After ({beforeAfterItems.length})
                </button>
              )}
              {videoItems.length > 0 && (
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === 'videos' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Videos ({videoItems.length})
                </button>
              )}
            </div>
          </div>

          {/* GALLERY ITEMS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayedGallery.map((item) => (
              <div
                key={item.id}
                className="glass-panel rounded-2xl border border-amber-500/20 overflow-hidden hover:border-amber-400 transition-all flex flex-col justify-between group hover:shadow-[0_0_25px_rgba(255,183,3,0.2)]"
              >
                {/* Media area */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  {item.beforeImage && item.afterImage ? (
                    <div className="grid grid-cols-2 h-full w-full">
                      <div className="relative h-full border-r border-slate-800">
                        <img src={item.beforeImage} alt="Before" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-amber-300">
                          Before
                        </span>
                      </div>
                      <div className="relative h-full">
                        <img src={item.afterImage} alt="After" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-emerald-300">
                          After
                        </span>
                      </div>
                    </div>
                  ) : item.url || item.afterImage || item.beforeImage ? (
                    <img
                      src={item.url || item.afterImage || item.beforeImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-950/80 text-amber-300 border border-amber-500/30">
                    {item.category || 'General Electrical'}
                  </span>

                  {item.videoUrl && (
                    <button
                      onClick={() => setActiveVideoModal(item.videoUrl)}
                      className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-md hover:bg-amber-400"
                    >
                      <Video className="w-3 h-3" /> Watch Demo
                    </button>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 space-y-1.5">
                  <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  {item.location && (
                    <p className="text-[11px] text-amber-300/80 font-mono flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {item.location}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COL: CUSTOMER-FRIENDLY SERVICE REQUEST FORM */}
        <div id="booking-form" className="lg:col-span-1">
          <div className="sticky top-24 glass-panel p-6 sm:p-7 rounded-3xl border border-amber-500/30 shadow-[0_0_30px_rgba(255,183,3,0.15)] space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                FAST LOCAL RESPONSE
              </span>
              <h3 className="font-display font-bold text-xl text-white mt-0.5">
                Book Electrician Service
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Only your <strong className="text-amber-300">Name</strong> and <strong className="text-amber-300">Mobile Number</strong> are mandatory.
              </p>
            </div>

            {submittedLead ? (
              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-white">Service Request Logged!</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thank you, <strong className="text-emerald-300">{submittedLead.name}</strong>. Our electrician team will contact you on <strong className="text-emerald-300">{submittedLead.phone}</strong> right away.
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href="https://wa.me/917822886909?text=Hello%20Khan%20Electrics,%20I%20just%20submitted%20an%20electrician%20service%20request%20on%20your%20website."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Share2 className="w-4 h-4" /> Message Electrician on WhatsApp
                  </a>
                  <a
                    href="tel:+917822886909"
                    className="w-full py-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Directly: +91 7822886909
                  </a>
                  <button
                    onClick={() => setSubmittedLead(null)}
                    className="text-xs text-slate-400 hover:text-white underline pt-1"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* MANDATORY 1: NAME */}
                <div>
                  <label className="block text-[11px] font-semibold text-amber-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* MANDATORY 2: PHONE */}
                <div>
                  <label className="block text-[11px] font-semibold text-amber-300 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 78228 86909"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                {/* OPTIONAL: SERVICE REQUIRED */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Service Required (Optional)
                  </label>
                  <select
                    value={formData.serviceRequired}
                    onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-amber-500/20 text-white text-xs focus:outline-none"
                  >
                    <option value="House Wiring & Fitting">House Wiring & Fitting</option>
                    <option value="Industrial Panel Wiring">Industrial Panel Wiring</option>
                    <option value="CCTV Security Camera Setup">CCTV Security Camera Setup</option>
                    <option value="Inverter & Battery Wiring">Inverter & Battery Wiring</option>
                    <option value="Short Circuit / Emergency Repair">Short Circuit / Emergency Repair</option>
                    <option value="Motor Rewinding & Pump Repair">Motor Rewinding & Pump Repair</option>
                  </select>
                </div>

                {/* OPTIONAL: LOCATION */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Area / Village / City (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Badnapur, Jalna City"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-amber-500/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* OPTIONAL: DETAILS */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Problem Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the issue or electrical requirement..."
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-amber-500/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(255,183,3,0.4)] hover:shadow-[0_0_30px_rgba(255,183,3,0.7)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Submitting Request...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Request Electrician Call
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="pt-3 border-t border-amber-500/10 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Need emergency assistance?</span>
              <a
                href="tel:+917822886909"
                className="text-xs font-bold text-amber-300 hover:text-white flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Call +91 7822886909
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      {faqs.length > 0 && (
        <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-500/30 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
              Answers To Common Queries
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, fIdx) => (
              <div
                key={faq.id || fIdx}
                className="rounded-2xl bg-slate-950/60 border border-amber-500/20 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === fIdx ? null : fIdx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-amber-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    {faq.question}
                  </span>
                  <span className="text-amber-400 font-mono text-base ml-2">
                    {openFaqIndex === fIdx ? '−' : '+'}
                  </span>
                </button>
                {openFaqIndex === fIdx && (
                  <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VIDEO PREVIEW MODAL */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel max-w-2xl w-full p-4 rounded-3xl border border-amber-500/30 space-y-3">
            <div className="flex justify-end">
              <button
                onClick={() => setActiveVideoModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
              {activeVideoModal.includes('youtube.com') || activeVideoModal.includes('youtu.be') ? (
                <iframe
                  src={activeVideoModal.replace('watch?v=', 'embed/')}
                  title="Demo Video"
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <video src={activeVideoModal} controls autoPlay className="w-full h-full" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectricianPage;
