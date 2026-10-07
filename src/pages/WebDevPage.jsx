import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Code2, ExternalLink, Send, Sparkles, CheckCircle2 } from 'lucide-react';

const WebDevPage = () => {
  const { webProjects, submitInquiry } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    location: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitInquiry({
      serviceType: 'Web Development',
      ...formData
    });
    setIsSubmitting(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
      location: '',
      details: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* HERO SECTION */}
      <section className="relative p-8 sm:p-12 rounded-3xl glass-panel-cyan border border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(0,210,255,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Code2 className="w-3.5 h-3.5" />
            CYBER & TECH NEON ENVIRONMENT
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-wide">
            WEB DEVELOPMENT
          </h1>

          <p className="text-cyan-200 text-lg font-medium">
            Modern websites & web applications for your business.
          </p>

          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            We build high-performance, responsive web portals, e-commerce stores, desktop applications, and custom software tailored to elevate your business presence with stunning modern designs.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href="#inquiry-form"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(0,210,255,0.7)] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              Contact Us / Request Quote
            </a>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT: PORTFOLIO & INQUIRY FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT 2 COLS: OUR PROJECTS GRID */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
              Our Projects
              <span className="text-xs font-mono text-cyan-400 font-normal">
                ({webProjects?.length || 0} Showcase Items)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(webProjects || []).map((project) => (
              <div
                key={project.id}
                className="group glass-panel rounded-2xl p-4 border border-cyan-500/20 hover:border-cyan-400 transition-all flex flex-col justify-between hover:shadow-[0_0_25px_rgba(0,210,255,0.25)]"
              >
                <div>
                  <div className="relative h-44 rounded-xl overflow-hidden mb-3 border border-cyan-500/20">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-transparent opacity-60" />
                    <span className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-slate-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {project.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-cyan-500/10 flex items-center justify-between">
                  <a
                    href={project.link || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    View Project <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COL: BOOKING / INQUIRY FORM */}
        <div id="inquiry-form" className="lg:col-span-1">
          <div className="sticky top-24 glass-panel p-6 rounded-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,210,255,0.15)] space-y-4">
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Contact Us
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Tell us about your requirement and we'll get back to you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-cyan-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-cyan-300 mb-1">
                  Email ID *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-cyan-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter your location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-cyan-300 mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter your contact number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-cyan-300 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your WhatsApp number"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-cyan-300 mb-1">
                  Project Requirement *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Tell us about your project..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(0,210,255,0.7)] transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Information'}
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default WebDevPage;
