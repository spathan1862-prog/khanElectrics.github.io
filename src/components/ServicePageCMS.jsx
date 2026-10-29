import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Save,
  Send,
  Eye,
  EyeOff,
  UploadCloud,
  FileCheck,
  X,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Sparkles,
  HelpCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

const ServicePageCMS = ({ pageId, pageName, accentColor = 'cyan' }) => {
  const { servicePages, updateServicePage, uploadMediaImage, showToast } = useApp();

  const currentPageData = servicePages?.[pageId] || {};

  // Form state initialized with currently saved or draft data
  const [formData, setFormData] = useState({
    pageName: pageName,
    title: '',
    badge: '',
    subtitle: '',
    heroDescription: '',
    ctaText: 'Contact Us / Request Quote',
    ctaLink: '#inquiry-form',
    heroImage: '',
    sections: [],
    faqs: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    isPublished: true
  });

  // Image Upload state
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Preview state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when pageId or servicePages data changes
  useEffect(() => {
    if (currentPageData) {
      setFormData({
        pageName: currentPageData.pageName || pageName,
        title: currentPageData.title || '',
        badge: currentPageData.badge || '',
        subtitle: currentPageData.subtitle || '',
        heroDescription: currentPageData.heroDescription || '',
        ctaText: currentPageData.ctaText || 'Contact Us / Request Quote',
        ctaLink: currentPageData.ctaLink || '#inquiry-form',
        heroImage: currentPageData.heroImage || '',
        sections: Array.isArray(currentPageData.sections) ? currentPageData.sections : [],
        faqs: Array.isArray(currentPageData.faqs) ? currentPageData.faqs : [],
        seoTitle: currentPageData.seoTitle || '',
        seoDescription: currentPageData.seoDescription || '',
        seoKeywords: currentPageData.seoKeywords || '',
        isPublished: currentPageData.isPublished !== false
      });
    }
  }, [pageId, servicePages]);

  // Handle Image File Selection and Upload
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    // Check size <= 5MB
    if (file.size > 5 * 1024 * 1024) {
      const msg = `Image size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds 5 MB limit. Please select a smaller image.`;
      setUploadError(msg);
      showToast(msg, 'error');
      return;
    }

    // Check format
    const validFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validFormats.includes(file.type)) {
      const msg = 'Unsupported format. Please select a JPG, PNG, WebP, or SVG image.';
      setUploadError(msg);
      showToast(msg, 'error');
      return;
    }

    setIsUploadingImage(true);
    setUploadProgress(15);

    const uploadRes = await uploadMediaImage(file, { folder: pageId }, (pct) => {
      setUploadProgress(pct);
    });

    setIsUploadingImage(false);

    if (uploadRes && uploadRes.success) {
      setFormData(prev => ({ ...prev, heroImage: uploadRes.url }));
      showToast('Image uploaded successfully and attached to hero section!', 'success');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      const errMsg = uploadRes?.message || 'Failed to upload image.';
      setUploadError(errMsg);
      showToast(errMsg, 'error');
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, heroImage: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Hero image removed.', 'info');
  };

  // Section Management Handlers
  const handleAddSection = () => {
    const newSec = {
      id: 'sec-' + Date.now(),
      title: 'New Content Section',
      subtitle: 'Key Highlights',
      description: 'Describe the features, benefits, or services provided.',
      tag: 'FEATURE',
      bgColor: 'default',
      isVisible: true,
      items: [
        { title: 'Feature 1', description: 'High reliability and tailored execution.' },
        { title: 'Feature 2', description: 'Fast turnaround and dedicated support.' }
      ]
    };
    setFormData(prev => ({ ...prev, sections: [...prev.sections, newSec] }));
  };

  const handleUpdateSection = (index, updatedSection) => {
    setFormData(prev => {
      const updated = [...prev.sections];
      updated[index] = updatedSection;
      return { ...prev, sections: updated };
    });
  };

  const handleDuplicateSection = (index) => {
    const sec = formData.sections[index];
    const duplicated = {
      ...sec,
      id: 'sec-' + Date.now(),
      title: sec.title + ' (Copy)'
    };
    const updated = [...formData.sections];
    updated.splice(index + 1, 0, duplicated);
    setFormData(prev => ({ ...prev, sections: updated }));
    showToast('Section duplicated.', 'info');
  };

  const handleDeleteSection = (index) => {
    if (window.confirm('Are you sure you want to delete this content section?')) {
      const updated = formData.sections.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, sections: updated }));
      showToast('Section deleted.', 'info');
    }
  };

  const handleMoveSection = (index, direction) => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= formData.sections.length) return;
    const updated = [...formData.sections];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFormData(prev => ({ ...prev, sections: updated }));
  };

  const handleToggleSectionVisibility = (index) => {
    setFormData(prev => {
      const updated = [...prev.sections];
      updated[index] = { ...updated[index], isVisible: updated[index].isVisible === false ? true : false };
      return { ...prev, sections: updated };
    });
  };

  // FAQ Management Handlers
  const handleAddFAQ = () => {
    const newFaq = {
      id: 'faq-' + Date.now(),
      question: 'Frequently Asked Question',
      answer: 'Detailed and clear response to help customer understand the process.'
    };
    setFormData(prev => ({ ...prev, faqs: [...prev.faqs, newFaq] }));
  };

  const handleUpdateFAQ = (index, updatedFaq) => {
    setFormData(prev => {
      const updated = [...prev.faqs];
      updated[index] = updatedFaq;
      return { ...prev, faqs: updated };
    });
  };

  const handleDeleteFAQ = (index) => {
    const updated = formData.faqs.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, faqs: updated }));
  };

  // Save / Publish Actions
  const handleSaveDraft = async () => {
    if (!formData.title?.trim()) {
      showToast('Page Title cannot be empty.', 'warning');
      return;
    }
    setIsSaving(true);
    await updateServicePage(pageId, formData, false);
    setIsSaving(false);
  };

  const handlePublishLive = async () => {
    if (!formData.title?.trim()) {
      showToast('Page Title is required before publishing.', 'warning');
      return;
    }
    setIsSaving(true);
    await updateServicePage(pageId, formData, true);
    setIsSaving(false);
  };

  const handleResetToSaved = () => {
    if (window.confirm('Discard all unsaved edits and restore last saved version?')) {
      if (currentPageData) {
        setFormData({
          pageName: currentPageData.pageName || pageName,
          title: currentPageData.title || '',
          badge: currentPageData.badge || '',
          subtitle: currentPageData.subtitle || '',
          heroDescription: currentPageData.heroDescription || '',
          ctaText: currentPageData.ctaText || 'Contact Us / Request Quote',
          ctaLink: currentPageData.ctaLink || '#inquiry-form',
          heroImage: currentPageData.heroImage || '',
          sections: Array.isArray(currentPageData.sections) ? currentPageData.sections : [],
          faqs: Array.isArray(currentPageData.faqs) ? currentPageData.faqs : [],
          seoTitle: currentPageData.seoTitle || '',
          seoDescription: currentPageData.seoDescription || '',
          seoKeywords: currentPageData.seoKeywords || '',
          isPublished: currentPageData.isPublished !== false
        });
      }
      showToast('Form reset to saved database record.', 'info');
    }
  };

  const accentBorder = accentColor === 'amber'
    ? 'border-amber-500/30'
    : accentColor === 'teal'
      ? 'border-teal-500/30'
      : 'border-cyan-500/30';

  const accentBadge = accentColor === 'amber'
    ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
    : accentColor === 'teal'
      ? 'bg-teal-950/80 border-teal-500/40 text-teal-300'
      : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300';

  const accentBtn = accentColor === 'amber'
    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950'
    : accentColor === 'teal'
      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950'
      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950';

  return (
    <div className="space-y-8">
      {/* CMS HEADER & ACTION BAR */}
      <div className={`glass-panel p-6 rounded-3xl ${accentBorder} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${accentBadge}`}>
              CMS Page Editor
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              formData.isPublished ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {formData.isPublished ? 'Live on Website' : 'Draft Only'}
            </span>
          </div>
          <h2 className="font-display font-bold text-2xl text-white mt-1">
            {pageName} Customization
          </h2>
          <p className="text-xs text-slate-300">
            Edit text, upload banners, customize service sections, manage FAQs, and update local SEO without touching code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPreviewModal(prev => !prev)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            {showPreviewModal ? 'Close Preview' : 'Live Preview'}
          </button>

          <button
            type="button"
            onClick={handleResetToSaved}
            className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-red-300 text-xs font-medium flex items-center gap-1 transition-all"
            title="Reset unsaved changes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveDraft}
            className="px-4 py-2 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handlePublishLive}
            className={`px-5 py-2 rounded-xl ${accentBtn} font-bold text-xs shadow-lg hover:brightness-110 flex items-center gap-1.5 transition-all disabled:opacity-50`}
          >
            <Send className="w-3.5 h-3.5" />
            {isSaving ? 'Publishing...' : 'Publish Changes Live'}
          </button>
        </div>
      </div>

      {/* SECTION 1: HERO BANNER SETTINGS */}
      <div className={`glass-panel p-6 sm:p-8 rounded-3xl ${accentBorder} space-y-6`}>
        <div className="border-b border-white/10 pb-3">
          <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            1. Hero Banner & Key Headings
          </h3>
          <p className="text-xs text-slate-400">
            Customize the prominent title, subtitle, and intro paragraph visitors see at the top of the page.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-cyan-300 mb-1">
              Top Environment Badge / Tag
            </label>
            <input
              type="text"
              value={formData.badge}
              placeholder="e.g. CYBER & TECH NEON ENVIRONMENT"
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/30 text-white text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-cyan-300 mb-1">
              Primary H1 Page Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              placeholder="e.g. WEB DEVELOPMENT"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/30 text-white text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-cyan-300 mb-1">
              Subtitle (Tagline)
            </label>
            <input
              type="text"
              value={formData.subtitle}
              placeholder="e.g. Modern websites & web applications for your business."
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/30 text-white text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-cyan-300 mb-1">
              Hero Description Paragraph
            </label>
            <textarea
              rows="3"
              value={formData.heroDescription}
              placeholder="Detailed description of what makes your service superior..."
              onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/30 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-cyan-300 mb-1">
              Call-to-Action (CTA) Button Text
            </label>
            <input
              type="text"
              value={formData.ctaText}
              placeholder="e.g. Contact Us / Request Quote"
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/30 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-cyan-300 mb-1">
              CTA Button Link / Anchor
            </label>
            <input
              type="text"
              value={formData.ctaLink}
              placeholder="e.g. #inquiry-form or tel:+917822886909"
              onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/30 text-white text-xs font-mono"
            />
          </div>

          {/* HERO IMAGE UPLOADER */}
          <div className="sm:col-span-2 space-y-3 pt-2">
            <label className="block text-xs font-medium text-cyan-300">
              Hero Banner Image / Feature Graphic
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={handleImageSelect}
              className="hidden"
            />

            {formData.heroImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950/60 p-3 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={formData.heroImage}
                  alt="Hero Preview"
                  className="w-full sm:w-48 h-32 object-cover rounded-xl border border-white/10"
                />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    Image Attached
                  </span>
                  <p className="text-xs text-white truncate max-w-sm sm:max-w-md font-mono">
                    {formData.heroImage}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Image is active in database and displays prominently in the page hero.
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-medium"
                    >
                      Replace Image
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 hover:bg-red-900/80 text-xs font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer rounded-2xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 bg-slate-950/40 hover:bg-slate-950/60 p-6 text-center transition-all flex flex-col items-center justify-center gap-2"
              >
                <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all inline-flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Choose Hero Image
                  </button>
                  <p className="text-[11px] text-slate-300">
                    Supports JPG, PNG, WebP, SVG (Max 5 MB)
                  </p>
                </div>
              </div>
            )}

            {isUploadingImage && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-cyan-300">
                  <span>Uploading image to Supabase Storage...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-cyan-500/30">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadError && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                {uploadError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: CUSTOM CONTENT SECTIONS */}
      <div className={`glass-panel p-6 sm:p-8 rounded-3xl ${accentBorder} space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              2. Customizable Content Sections ({formData.sections.length})
            </h3>
            <p className="text-xs text-slate-400">
              Add, reorder, edit, duplicate, hide, or delete dynamic sections with feature cards or pricing highlights.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddSection}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,210,255,0.3)] shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Section
          </button>
        </div>

        {formData.sections.length === 0 ? (
          <div className="text-center py-8 rounded-2xl border border-dashed border-white/10 p-6 space-y-2">
            <p className="text-xs text-slate-400">
              No custom sections added yet. Click "+ Add Section" to introduce service cards, process steps, or benefits.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.sections.map((section, idx) => (
              <div
                key={section.id || idx}
                className={`p-5 rounded-2xl bg-slate-950/60 border ${
                  section.isVisible === false ? 'border-slate-800 opacity-60' : 'border-cyan-500/20'
                } space-y-4 transition-all`}
              >
                {/* Section Header Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      Section #{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      {section.tag || 'CUSTOM'}
                    </span>
                    {section.isVisible === false && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-500/30">
                        Hidden
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, 'up')}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === formData.sections.length - 1}
                      onClick={() => handleMoveSection(idx, 'down')}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleSectionVisibility(idx)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white"
                      title={section.isVisible === false ? 'Show Section' : 'Hide Section'}
                    >
                      {section.isVisible === false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateSection(idx)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-teal-300 hover:text-white"
                      title="Duplicate Section"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(idx)}
                      className="p-1.5 rounded-lg bg-red-950 border border-red-500/30 text-red-400 hover:bg-red-900"
                      title="Delete Section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Section Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Section Title *
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleUpdateSection(idx, { ...section, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/20 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Subtitle / Tag
                    </label>
                    <input
                      type="text"
                      value={section.subtitle}
                      onChange={(e) => handleUpdateSection(idx, { ...section, subtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/20 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Background Styling
                    </label>
                    <select
                      value={section.bgColor || 'default'}
                      onChange={(e) => handleUpdateSection(idx, { ...section, bgColor: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/20 text-white text-xs"
                    >
                      <option value="default">Default Dark Slate</option>
                      <option value="cyan">Neon Cyber Glow (Cyan)</option>
                      <option value="amber">Industrial Electric (Amber)</option>
                      <option value="teal">Scenic Deep Emerald (Teal)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Section Description
                    </label>
                    <input
                      type="text"
                      value={section.description}
                      onChange={(e) => handleUpdateSection(idx, { ...section, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/20 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Section Cards / Items Manager */}
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-cyan-300">
                      Feature Cards in this Section ({section.items?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const items = Array.isArray(section.items) ? section.items : [];
                        handleUpdateSection(idx, {
                          ...section,
                          items: [...items, { title: 'New Card', description: 'Describe feature or service specification.' }]
                        });
                      }}
                      className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      + Add Card
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(section.items || []).map((card, cIdx) => (
                      <div key={cIdx} className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={card.title}
                            placeholder="Card Title"
                            onChange={(e) => {
                              const updatedItems = [...section.items];
                              updatedItems[cIdx] = { ...card, title: e.target.value };
                              handleUpdateSection(idx, { ...section, items: updatedItems });
                            }}
                            className="bg-transparent font-bold text-xs text-white border-b border-transparent focus:border-cyan-400 outline-none w-4/5"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedItems = section.items.filter((_, i) => i !== cIdx);
                              handleUpdateSection(idx, { ...section, items: updatedItems });
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Remove Card"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <textarea
                          rows="2"
                          value={card.description}
                          placeholder="Card details..."
                          onChange={(e) => {
                            const updatedItems = [...section.items];
                            updatedItems[cIdx] = { ...card, description: e.target.value };
                            handleUpdateSection(idx, { ...section, items: updatedItems });
                          }}
                          className="w-full bg-slate-950/50 p-1.5 rounded-lg text-[11px] text-slate-300 border border-white/5 outline-none focus:border-cyan-500/30"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: FAQ MANAGER */}
      <div className={`glass-panel p-6 sm:p-8 rounded-3xl ${accentBorder} space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              3. Frequently Asked Questions (FAQs) ({formData.faqs.length})
            </h3>
            <p className="text-xs text-slate-400">
              Answer common customer questions to boost conversions and SEO authority.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddFAQ}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,210,255,0.3)] shrink-0"
          >
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        </div>

        {formData.faqs.length === 0 ? (
          <div className="text-center py-6 rounded-2xl border border-dashed border-white/10 p-6 space-y-2">
            <p className="text-xs text-slate-400">
              No FAQs added yet. Click "+ Add FAQ" to provide helpful answers.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.faqs.map((faq, fIdx) => (
              <div key={faq.id || fIdx} className="p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">Q#{fIdx + 1}:</span>
                  <input
                    type="text"
                    value={faq.question}
                    placeholder="Enter question..."
                    onChange={(e) => handleUpdateFAQ(fIdx, { ...faq, question: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/20 text-white text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteFAQ(fIdx)}
                    className="p-1.5 rounded bg-red-950 text-red-400 hover:bg-red-900 shrink-0"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="pl-6">
                  <textarea
                    rows="2"
                    value={faq.answer}
                    placeholder="Enter clear answer..."
                    onChange={(e) => handleUpdateFAQ(fIdx, { ...faq, answer: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-slate-300 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 4: SEO METADATA */}
      <div className={`glass-panel p-6 sm:p-8 rounded-3xl ${accentBorder} space-y-6`}>
        <div className="border-b border-white/10 pb-3">
          <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-400" />
            4. Page-Specific Google SEO & Local Keywords
          </h3>
          <p className="text-xs text-slate-400">
            Define unique meta titles, descriptions, and target service keywords (Badnapur, Jalna, Aurangabad).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-cyan-300">
                SEO Title Tag
              </label>
              <span className={`text-[10px] font-mono ${
                formData.seoTitle?.length > 60 ? 'text-amber-400' : 'text-slate-400'
              }`}>
                {formData.seoTitle?.length || 0} / 60 chars
              </span>
            </div>
            <input
              type="text"
              value={formData.seoTitle}
              placeholder="e.g. Web Development in Badnapur & Jalna | Khan Electrics"
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/30 text-white text-xs"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-cyan-300">
                SEO Meta Description
              </label>
              <span className={`text-[10px] font-mono ${
                formData.seoDescription?.length > 160 ? 'text-amber-400' : 'text-slate-400'
              }`}>
                {formData.seoDescription?.length || 0} / 160 chars
              </span>
            </div>
            <input
              type="text"
              value={formData.seoDescription}
              placeholder="e.g. Professional website & web application development for businesses in Jalna, Badnapur and Aurangabad."
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/30 text-white text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-cyan-300 mb-1">
              Local Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={formData.seoKeywords}
              placeholder="web developer in Badnapur, website development in Jalna Maharashtra, business website design Aurangabad"
              onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/30 text-white text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* LIVE IN-CMS PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                <h3 className="font-display font-bold text-xl text-white">
                  Live Preview: {formData.pageName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Hero */}
            <div className="p-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${accentBadge}`}>
                {formData.badge || 'FEATURED SERVICE'}
              </span>
              <h1 className="font-display font-extrabold text-3xl text-white">
                {formData.title || 'Page Title'}
              </h1>
              <p className="text-cyan-200 text-sm font-semibold">
                {formData.subtitle}
              </p>
              <p className="text-slate-300 text-xs leading-relaxed max-w-2xl">
                {formData.heroDescription}
              </p>
              {formData.heroImage && (
                <img
                  src={formData.heroImage}
                  alt="Hero Preview"
                  className="w-full max-h-60 object-cover rounded-xl border border-white/10 mt-3"
                />
              )}
              <div className="pt-2">
                <span className={`inline-block px-5 py-2.5 rounded-full ${accentBtn} font-bold text-xs`}>
                  {formData.ctaText || 'Contact Us'}
                </span>
              </div>
            </div>

            {/* Simulated Sections */}
            {formData.sections.filter(s => s.isVisible !== false).map((sec, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                <span className="text-[10px] font-mono text-cyan-400 uppercase">{sec.subtitle || sec.tag}</span>
                <h3 className="font-bold text-lg text-white">{sec.title}</h3>
                <p className="text-xs text-slate-300">{sec.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {(sec.items || []).map((card, ci) => (
                    <div key={ci} className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                      <p className="text-xs font-bold text-white">{card.title}</p>
                      <p className="text-[11px] text-slate-300 mt-1">{card.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Simulated FAQs */}
            {formData.faqs.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                <h3 className="font-bold text-base text-white">Frequently Asked Questions</h3>
                <div className="space-y-2">
                  {formData.faqs.map((faq, fi) => (
                    <div key={fi} className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                      <p className="text-xs font-bold text-cyan-300">Q: {faq.question}</p>
                      <p className="text-[11px] text-slate-300 mt-1">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Done Reviewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePageCMS;
