import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEOHead from '../components/SEOHead';
import {
  Code2,
  ExternalLink,
  Send,
  Sparkles,
  HelpCircle,
  Layers,
  CheckCircle2,
  Github,
  Video,
  Share2,
  Phone,
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';

const WebDevPage = () => {
  const { webProjects, submitInquiry, servicePages, settings } = useApp();
  const pageData = servicePages?.['web-development'] || {};

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    businessName: '',
    websiteType: 'Business Website',
    requiredFeatures: '',
    budget: '',
    deadline: '',
    referenceUrl: '',
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
      serviceType: 'Web Development',
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
        businessName: '',
        websiteType: 'Business Website',
        requiredFeatures: '',
        budget: '',
        deadline: '',
        referenceUrl: '',
        details: ''
      });
    }
  };

  const publishedProjects = (webProjects || []).filter(p => p.isPublished !== false);
  const sections = Array.isArray(pageData.sections)
    ? pageData.sections.filter(s => s.isVisible !== false)
    : [];
  const faqs = Array.isArray(pageData.faqs) ? pageData.faqs : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* TARGETED SEO */}
      <SEOHead
        title={pageData.seoTitle || "Web Development in Badnapur & Jalna | Modern Websites & Software | KHAN"}
        description={pageData.seoDescription || "Custom web development, responsive business websites, and software applications in Badnapur, Jalna, and Aurangabad Maharashtra."}
        keywords={pageData.seoKeywords || "web development in Badnapur, website development in Jalna Maharashtra, web developer in Jalna, website design and development in Aurangabad Maharashtra, business website development in Jalna"}
        canonicalUrl="https://khaneletrics.in/services/web-development"
      />

      {/* HERO SECTION */}
      <section className="relative p-8 sm:p-12 rounded-3xl glass-panel-cyan border border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(0,210,255,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
              <Code2 className="w-3.5 h-3.5" />
              {pageData.badge || 'CYBER & TECH NEON ENVIRONMENT'}
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-wide">
              {pageData.title || 'WEB DEVELOPMENT'}
            </h1>

            <p className="text-cyan-200 text-lg font-medium">
              {pageData.subtitle || 'Modern websites & web applications for your business.'}
            </p>

            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
              {pageData.heroDescription || 'We build high-performance, responsive web portals, e-commerce stores, desktop applications, and custom software tailored to elevate your business presence with stunning modern designs in Badnapur, Jalna, Aurangabad, and beyond.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#inquiry-form"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(0,210,255,0.7)] transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                {pageData.ctaText || 'Get Free Quote / Consult'}
              </a>
              <a
                href="https://wa.me/917822886909?text=Hello%20Khan%20Electrics,%20I%20would%20like%20to%20discuss%20a%20website%20project."
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
              <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_30px_rgba(0,210,255,0.25)]">
                <img
                  src={pageData.heroImage}
                  alt={pageData.title || 'Web Development'}
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
              className="p-8 sm:p-10 rounded-3xl glass-panel-cyan border border-cyan-500/20 space-y-6"
            >
              <div className="max-w-2xl">
                {sec.subtitle && (
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
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
                      className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-cyan-500/30 transition-all space-y-2 hover:shadow-[0_0_20px_rgba(0,210,255,0.15)]"
                    >
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
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

      {/* MAIN CONTENT: PORTFOLIO & INQUIRY FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 2 COLS: OUR PROJECTS GRID */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
                Our Web Development Portfolio
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real websites, portals, and software delivered by Khan Electrics.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
              {publishedProjects.length} Projects
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {publishedProjects.map((project) => (
              <div
                key={project.id}
                className="group glass-panel rounded-2xl border border-cyan-500/20 hover:border-cyan-400 transition-all flex flex-col justify-between overflow-hidden hover:shadow-[0_0_25px_rgba(0,210,255,0.25)]"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-transparent opacity-60" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                      {project.category}
                    </span>
                    {project.isFeatured && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {project.shortDescription || project.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-cyan-500/10 flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-3">
                    {project.link && project.link !== '#' && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-white transition-colors"
                      >
                        Live Site <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" /> Source
                      </a>
                    )}
                  </div>

                  {project.videoUrl && (
                    <button
                      onClick={() => setActiveVideoModal(project.videoUrl)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-white"
                    >
                      <Video className="w-3.5 h-3.5" /> Demo
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COL: CUSTOMER-FRIENDLY INQUIRY FORM */}
        <div id="inquiry-form" className="lg:col-span-1">
          <div className="sticky top-24 glass-panel p-6 sm:p-7 rounded-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,210,255,0.15)] space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                START YOUR PROJECT
              </span>
              <h3 className="font-display font-bold text-xl text-white mt-0.5">
                Web Development Inquiry
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Only your <strong className="text-cyan-300">Name</strong> and <strong className="text-cyan-300">Mobile Number</strong> are mandatory. All other questions are optional.
              </p>
            </div>

            {submittedLead ? (
              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-white">Inquiry Received!</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thank you, <strong className="text-emerald-300">{submittedLead.name}</strong>. Our team will contact you on <strong className="text-emerald-300">{submittedLead.phone}</strong> shortly.
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href="https://wa.me/917822886909?text=Hello%20Khan%20Electrics,%20I%20just%20submitted%20a%20web%20development%20inquiry%20on%20your%20website."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Share2 className="w-4 h-4" /> Chat on WhatsApp Now
                  </a>
                  <button
                    onClick={() => setSubmittedLead(null)}
                    className="text-xs text-slate-400 hover:text-white underline pt-1"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* MANDATORY FIELD 1: NAME */}
                <div>
                  <label className="block text-[11px] font-semibold text-cyan-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* MANDATORY FIELD 2: MOBILE NUMBER */}
                <div>
                  <label className="block text-[11px] font-semibold text-cyan-300 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98230 11223"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                {/* OPTIONAL: EMAIL */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="yourname@example.com (optional)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* OPTIONAL: BUSINESS NAME */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Business / Shop Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Khan Trading Co."
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* OPTIONAL: WEBSITE TYPE */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Website Type (Optional)
                  </label>
                  <select
                    value={formData.websiteType}
                    onChange={(e) => setFormData({ ...formData, websiteType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-white text-xs focus:outline-none"
                  >
                    <option value="Business Website">Business Website</option>
                    <option value="E-Commerce Online Store">E-Commerce Online Store</option>
                    <option value="Custom Web Application">Custom Web Application</option>
                    <option value="Electron Desktop App">Desktop Software (Electron)</option>
                    <option value="Landing Page / Portfolio">Landing Page / Portfolio</option>
                  </select>
                </div>

                {/* OPTIONAL: DESCRIPTION */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Project Requirement (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what you'd like your website to do..."
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(0,210,255,0.7)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Project Inquiry
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="pt-3 border-t border-cyan-500/10 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Prefer to talk directly?</span>
              <a
                href="tel:+917822886909"
                className="text-xs font-bold text-cyan-300 hover:text-white flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Call +91 7822886909
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      {faqs.length > 0 && (
        <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyan-500/30 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
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
                className="rounded-2xl bg-slate-950/60 border border-cyan-500/20 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === fIdx ? null : fIdx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    {faq.question}
                  </span>
                  <span className="text-cyan-400 font-mono text-base ml-2">
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
          <div className="glass-panel max-w-2xl w-full p-4 rounded-3xl border border-cyan-500/30 space-y-3">
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

export default WebDevPage;
