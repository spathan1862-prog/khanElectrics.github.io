import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEOHead from '../components/SEOHead';
import {
  Plane,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Send,
  Compass,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Clock,
  Share2,
  Phone,
  ArrowRight,
  Car,
  X,
  Video
} from 'lucide-react';

const TourTravelPage = () => {
  const { tourDestinations, submitInquiry, servicePages, settings } = useApp();
  const pageData = servicePages?.['tour-travel'] || {};

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    fromCity: 'Jalna',
    toDestination: '',
    travelDate: '',
    returnDate: '',
    travelers: '2',
    tripType: 'Cab Rental',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await submitInquiry({
      serviceType: 'Tour & Travel',
      ...formData
    });
    setIsSubmitting(false);

    if (result && result.success) {
      setSubmittedLead({
        name: formData.name,
        phone: formData.phone,
        toDestination: formData.toDestination
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        fromCity: 'Jalna',
        toDestination: '',
        travelDate: '',
        returnDate: '',
        travelers: '2',
        tripType: 'Cab Rental',
        details: ''
      });
    }
  };

  const handleSelectDestinationForBooking = (destinationName) => {
    setFormData(prev => ({
      ...prev,
      toDestination: destinationName
    }));
    const el = document.getElementById('booking-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const publishedDestinations = (tourDestinations || []).filter(d => d.isPublished !== false);
  const sections = Array.isArray(pageData.sections)
    ? pageData.sections.filter(s => s.isVisible !== false)
    : [];
  const faqs = Array.isArray(pageData.faqs) ? pageData.faqs : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* TARGETED GOOGLE & LOCAL SEO */}
      <SEOHead
        title={pageData.seoTitle || "Tour and Travel Services in Jalna | Jalna to Mumbai, Pune, Aurangabad Travel"}
        description={pageData.seoDescription || "Custom tour packages, outstation cabs, and holiday planning in Jalna. Daily travel from Jalna to Mumbai, Pune, Aurangabad, plus Kashmir & Goa tours."}
        keywords={pageData.seoKeywords || "tour and travel services in Jalna, Jalna to Mumbai travel, Jalna to Pune travel, Jalna to Aurangabad travel, holiday tour packages Jalna Maharashtra"}
        canonicalUrl="https://khanelectrics.in/services/tour-travel"
      />

      {/* HERO SECTION - Scenic Glow Environment */}
      <section className="relative p-8 sm:p-12 rounded-3xl glass-panel-cyan border border-teal-500/30 overflow-hidden shadow-[0_0_30px_rgba(0,210,255,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs font-mono">
              <Plane className="w-3.5 h-3.5" />
              {pageData.badge || 'SCENIC / OUTDOOR EXPLORATION GLOW ENVIRONMENT'}
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-wide">
              {pageData.title || 'TOUR & TRAVEL'}
            </h1>

            <p className="text-teal-200 text-lg font-medium">
              {pageData.subtitle || 'Explore new places, create better memories.'}
            </p>

            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
              {pageData.heroDescription || 'Customized domestic travel, pilgrimage tours, airport transfers, and family vacation packages from Jalna, Aurangabad, and Maharashtra to major destinations across India.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#booking-form"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(0,210,255,0.7)] transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                {pageData.ctaText || 'Plan Your Trip / Request Quote'}
              </a>

              <a
                href="https://wa.me/917822886909?text=Hello%20Khan%20Electrics,%20I%20want%20to%20inquire%20about%20a%20tour%20package%20or%20cab%20booking."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-slate-950 font-bold text-sm transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Share2 className="w-4 h-4" />
                WhatsApp Travel Desk
              </a>
            </div>
          </div>

          {pageData.heroImage && (
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.25)]">
                <img
                  src={pageData.heroImage}
                  alt={pageData.title || 'Tour and Travel'}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* DYNAMIC CMS CONTENT SECTIONS */}
      {sections.length > 0 && (
        <div className="space-y-8">
          {sections.map((sec, idx) => (
            <section
              key={sec.id || idx}
              className="p-8 sm:p-10 rounded-3xl glass-panel border border-teal-500/20 space-y-6"
            >
              <div className="max-w-2xl">
                {sec.subtitle && (
                  <span className="text-xs font-mono text-teal-400 uppercase tracking-wider block mb-1">
                    {sec.subtitle}
                  </span>
                )}
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                  {sec.title}
                </h2>
                {sec.description && (
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {sec.description}
                  </p>
                )}
              </div>

              {Array.isArray(sec.items) && sec.items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {sec.items.map((card, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-teal-500/30 transition-all space-y-2 hover:shadow-[0_0_20px_rgba(20,184,166,0.15)]"
                    >
                      <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-white">{card.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{card.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {/* DESTINATIONS GRID & BOOKING FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 2 COLS: DESTINATIONS CATALOG */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-2xl text-white">
                Holiday Packages & Destinations
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Handcrafted holiday packages, outstation cabs, and pilgrimage yatras.
              </p>
            </div>
            <span className="text-xs font-mono text-teal-400 font-semibold px-2.5 py-1 rounded-full bg-teal-950/60 border border-teal-500/30">
              {publishedDestinations.length} Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {publishedDestinations.map((dest) => (
              <div
                key={dest.id}
                className="glass-panel rounded-2xl border border-teal-500/20 overflow-hidden hover:border-teal-400 transition-all flex flex-col justify-between group hover:shadow-[0_0_25px_rgba(20,184,166,0.25)]"
              >
                <div>
                  <div className="h-48 w-full bg-slate-900 relative overflow-hidden">
                    <img
                      src={dest.coverImage}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-transparent opacity-60" />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-950/80 text-teal-300 border border-teal-500/30">
                      {dest.startingCity} → {dest.destinationCity}
                    </span>
                    {dest.isFeatured && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                        ★ Popular
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-bold text-lg text-white group-hover:text-teal-300 transition-colors">
                        {dest.name}
                      </h3>
                      <span className="text-xs font-mono font-bold text-teal-300 shrink-0">
                        {dest.isPriceOnRequest ? 'Price on Request' : (dest.price || 'Contact')}
                      </span>
                    </div>

                    {dest.duration && (
                      <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-teal-400" /> {dest.duration}
                      </p>
                    )}

                    <p className="text-xs text-slate-300 line-clamp-2">
                      {dest.description}
                    </p>

                    {Array.isArray(dest.highlights) && dest.highlights.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1">
                        {dest.highlights.slice(0, 3).map((hl, hIdx) => (
                          <span
                            key={hIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] bg-teal-950/60 text-teal-300 border border-teal-500/20"
                          >
                            ✓ {hl}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-teal-500/10 flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={() => handleSelectDestinationForBooking(dest.name)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-white transition-colors"
                  >
                    Enquire / Book This Trip <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {dest.videoUrl && (
                    <button
                      onClick={() => setActiveVideoModal(dest.videoUrl)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-300 hover:text-white"
                    >
                      <Video className="w-3.5 h-3.5" /> Video
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COL: TRIP BOOKING FORM */}
        <div id="booking-form" className="lg:col-span-1">
          <div className="sticky top-24 glass-panel p-6 sm:p-7 rounded-3xl border border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.15)] space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">
                CUSTOM TOUR QUOTE
              </span>
              <h3 className="font-display font-bold text-xl text-white mt-0.5">
                Trip Booking & Enquiry
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Only your <strong className="text-teal-300">Name</strong> and <strong className="text-teal-300">Mobile Number</strong> are mandatory.
              </p>
            </div>

            {submittedLead ? (
              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-white">Travel Request Submitted!</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thank you, <strong className="text-emerald-300">{submittedLead.name}</strong>. Our travel advisor will contact you on <strong className="text-emerald-300">{submittedLead.phone}</strong> with customized pricing and itinerary options.
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href="https://wa.me/917822886909?text=Hello%20Khan%20Electrics,%20I%20just%20submitted%20a%20tour%20booking%20inquiry%20on%20your%20website."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Share2 className="w-4 h-4" /> Message Travel Desk on WhatsApp
                  </a>
                  <button
                    onClick={() => setSubmittedLead(null)}
                    className="text-xs text-slate-400 hover:text-white underline pt-1"
                  >
                    Plan Another Trip
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* MANDATORY 1: NAME */}
                <div>
                  <label className="block text-[11px] font-semibold text-teal-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                {/* MANDATORY 2: PHONE */}
                <div>
                  <label className="block text-[11px] font-semibold text-teal-300 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 97654 88990"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400 font-mono"
                  />
                </div>

                {/* OPTIONAL: DESTINATION */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Destination City / Package (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kashmir, Goa, Shirdi, Mumbai Cab"
                    value={formData.toDestination}
                    onChange={(e) => setFormData({ ...formData, toDestination: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-teal-500/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                {/* OPTIONAL: STARTING CITY */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Starting City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jalna"
                      value={formData.fromCity}
                      onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-teal-500/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Travelers
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="2"
                      value={formData.travelers}
                      onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-teal-500/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                {/* OPTIONAL: TRAVEL DATE */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Travel Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-teal-500/20 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Trip Type
                    </label>
                    <select
                      value={formData.tripType}
                      onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-teal-500/20 text-white text-xs focus:outline-none"
                    >
                      <option value="Cab Rental">Cab Rental / One-Way</option>
                      <option value="Complete Vacation Package">Complete Vacation Package</option>
                      <option value="Pilgrimage Yatra">Pilgrimage Yatra Tour</option>
                      <option value="Family Holiday">Family Holiday</option>
                    </select>
                  </div>
                </div>

                {/* OPTIONAL: EXTRA REQUIREMENTS */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Special Requirements (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Hotel preferences, vehicle model, return journey..."
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-teal-500/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:shadow-[0_0_30px_rgba(20,184,166,0.7)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Get Free Tour Quote
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="pt-3 border-t border-teal-500/10 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Need instant cab booking?</span>
              <a
                href="tel:+917822886909"
                className="text-xs font-bold text-teal-300 hover:text-white flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Call +91 7822886909
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      {faqs.length > 0 && (
        <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-teal-500/30 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono text-teal-400 uppercase tracking-wider">
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
                className="rounded-2xl bg-slate-950/60 border border-teal-500/20 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === fIdx ? null : fIdx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-teal-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-teal-400 shrink-0" />
                    {faq.question}
                  </span>
                  <span className="text-teal-400 font-mono text-base ml-2">
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
          <div className="glass-panel max-w-2xl w-full p-4 rounded-3xl border border-teal-500/30 space-y-3">
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

export default TourTravelPage;
