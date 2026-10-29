import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEOHead from '../components/SEOHead';
import { Grid, PlusSquare, Zap, Plane, Activity, Briefcase, Download, Send, CheckCircle2, Calendar, FileText } from 'lucide-react';

const AppsPage = () => {
  const { apps, submitInquiry, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const filteredApps = (apps || []).filter(app => {
    if (selectedPlatform === 'all') return true;
    return app.platform === selectedPlatform;
  });

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

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail?.trim()) return;
    setIsSubscribing(true);
    const result = await submitInquiry({
      serviceType: 'General Contact',
      name: 'Newsletter Subscriber',
      email: newsletterEmail.trim(),
      details: 'Subscribed to software & utilities updates from Our Apps page.'
    });
    setIsSubscribing(false);
    if (result && result.success) {
      setNewsletterEmail('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* TARGETED GOOGLE SEO */}
      <SEOHead
        title="Our Apps & Digital Utilities | Android APKs & Windows Installers | Khan Electrics"
        description="Download free and commercial desktop software, Android APKs, and Windows utility applications built by Khan Electrics. Fast direct downloads via GitHub Releases."
        keywords="Khan Electrics apps, MedicoManager download, Android APK Jalna, Windows software Badnapur, business utility software Maharashtra"
        canonicalUrl="https://khaneletrics.in/apps"
      />

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

      {/* PLATFORM FILTERS */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {['All', 'Windows', 'Android', 'Cross-Platform'].map(filter => (
          <button
            key={filter}
            onClick={() => setSelectedPlatform(filter.toLowerCase())}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedPlatform === filter.toLowerCase()
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                : 'glass-panel text-slate-300 hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* APPS CATALOG GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(filteredApps || []).map((appItem) => {
          const directDownloadUrl = appItem.githubReleaseUrl || appItem.downloadUrl;
          const isDownloadable = directDownloadUrl && directDownloadUrl !== '#';

          return (
            <div
              key={appItem.id}
              className="group glass-panel rounded-3xl p-6 border border-cyan-500/20 hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,210,255,0.2)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 group-hover:scale-110 transition-transform">
                    {getAppIcon(appItem.icon)}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                      {appItem.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                      appItem.pricingType === 'paid'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        : 'bg-teal-950 text-teal-300 border border-teal-500/30'
                    }`}>
                      {appItem.pricingType === 'paid' ? `₹${appItem.price}` : 'FREE'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-cyan-300 transition-colors">
                    {appItem.name}
                  </h3>
                  {appItem.version && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold">
                      v{appItem.version}
                    </span>
                  )}
                  {appItem.platform && (
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-cyan-500/20 text-slate-400">
                      {appItem.platform}
                    </span>
                  )}
                  {appItem.fileType && (
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                      .{appItem.fileType}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {appItem.description}
                </p>

                {appItem.releaseNotes && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold flex items-center gap-1">
                      <FileText className="w-3 h-3" /> What's New:
                    </span>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {appItem.releaseNotes}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-cyan-500/10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                  {appItem.releaseDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-400" /> {appItem.releaseDate}
                    </span>
                  )}
                  {appItem.fileSizeBytes > 0 && (
                    <span>Size: <strong className="text-cyan-300">{(appItem.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB</strong></span>
                  )}
                </div>

                <a
                  href={directDownloadUrl || '#'}
                  target={isDownloadable ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  download={appItem.storagePath ? true : undefined}
                  onClick={(e) => {
                    if (!isDownloadable) {
                      e.preventDefault();
                      showToast(`Release package for ${appItem.name} is arriving soon! Contact us for early access.`, 'info');
                    }
                  }}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(0,210,255,0.3)] ${
                    !isDownloadable
                      ? 'bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400'
                      : 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold hover:brightness-110 shadow-[0_0_15px_rgba(0,210,255,0.25)]'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  {!isDownloadable
                    ? 'Coming Soon / Inquire'
                    : appItem.platform === 'android'
                      ? `Download APK ${appItem.version ? `v${appItem.version}` : ''}`
                      : appItem.platform === 'windows'
                        ? `Download Windows App ${appItem.version ? `v${appItem.version}` : ''}`
                        : `Download ${appItem.name}`}
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* NEWSLETTER SUBSCRIBE BOX */}
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
            disabled={isSubscribing}
            className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(0,210,255,0.3)] disabled:opacity-60"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubscribing ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppsPage;
