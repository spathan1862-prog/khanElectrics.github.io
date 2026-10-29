import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import MediaUploader from '../components/MediaUploader';
import {
  Lock,
  LogOut,
  Trash2,
  Plus,
  Download,
  Filter,
  Save,
  Layers,
  Phone,
  Layout,
  Grid,
  Users,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  KeyRound,
  UserCheck,
  Eye,
  EyeOff,
  Check,
  UploadCloud,
  FileCheck,
  X,
  FileUp,
  AlertTriangle,
  Code2,
  Zap,
  Plane,
  Globe,
  Share2,
  Sparkles,
  Image as ImageIcon,
  Video,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Tag,
  RefreshCw,
  MessageSquare,
  ChevronRight,
  Edit2,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowUpRight
} from 'lucide-react';

const AdminDashboard = () => {
  const {
    currentUser,
    isAuthorizedAdmin,
    isAdminLoggedIn,
    adminLogin,
    adminSignUp,
    adminLogout,
    showToast,
    settings,
    updateSettings,
    updateAppearance,
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    webProjects,
    addWebProject,
    updateWebProject,
    deleteWebProject,
    toggleWebProjectPublish,
    electricianGallery,
    addElectricianGallery,
    updateElectricianGallery,
    deleteElectricianGallery,
    toggleElectricianGalleryPublish,
    tourDestinations,
    addTourDestination,
    updateTourDestination,
    deleteTourDestination,
    toggleTourDestinationPublish,
    apps,
    addAppItem,
    uploadAppFile,
    deleteAppItem,
    toggleAppPublish,
    updateAdminPassword,
    requestAdminEmailChange,
    sendAdminPasswordReset
  } = useApp();

  // Primary Navigation Tabs
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'web-projects', 'electrician-gallery', 'tour-destinations', 'inquiries', 'appearance', 'security', 'apps'

  // Auth form states (Manual credentials required, never prefilled)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Account & Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [securityMessage, setSecurityMessage] = useState(null);
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false);

  // -------------------------------------------------------------
  // Modals & Form States
  // -------------------------------------------------------------

  // Web Development Project Form
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Business Website',
    shortDescription: '',
    detailedDescription: '',
    image: '',
    photos: [],
    videoUrl: '',
    link: '',
    githubUrl: '',
    isFeatured: false,
    isPublished: true,
    sortOrder: 0
  });

  // Electrician Work Gallery Form
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [isSavingGallery, setIsSavingGallery] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'House Wiring',
    location: 'Badnapur / Jalna',
    description: '',
    url: '',
    beforeImage: '',
    afterImage: '',
    photos: [],
    videoUrl: '',
    type: 'photo',
    isPublished: true,
    sortOrder: 0
  });

  // Tour Destination Form
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
  const [editingDestinationId, setEditingDestinationId] = useState(null);
  const [isSavingDestination, setIsSavingDestination] = useState(false);
  const [destinationForm, setDestinationForm] = useState({
    name: '',
    startingCity: 'Jalna / Aurangabad',
    destinationCity: '',
    coverImage: '',
    photos: [],
    videoUrl: '',
    description: '',
    highlightsText: '',
    price: '',
    isPriceOnRequest: false,
    duration: '',
    availableDates: 'Every Weekend & On Demand',
    itineraryText: '',
    routeInfo: '',
    isFeatured: false,
    isPublished: true,
    sortOrder: 0
  });

  // Customer Inquiry Details Modal
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  // Inquiries Inbox Filter & Search
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryServiceFilter, setInquiryServiceFilter] = useState('All');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('All');

  // Appearance Form
  const [appearanceForm, setAppearanceForm] = useState(
    settings?.appearance || {
      hero_banner_image: '',
      featured_projects_visible: true,
      featured_destinations_visible: true,
      web_dev_card: {
        title: 'Web Development',
        short_description: 'Custom modern business websites, portals, and desktop applications.',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        icon: 'Code2',
        is_visible: true,
        sort_order: 1
      },
      electrician_card: {
        title: 'Khan Electrician Service',
        short_description: 'Residential & industrial wiring, panel boards, CCTV security, and repairs.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
        icon: 'Zap',
        is_visible: true,
        sort_order: 2
      },
      tour_travel_card: {
        title: 'Tour and Travel',
        short_description: 'Custom domestic vacation packages, pilgrimage yatras, and outstation cabs.',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
        icon: 'Plane',
        is_visible: true,
        sort_order: 3
      }
    }
  );
  const [isSavingAppearance, setIsSavingAppearance] = useState(false);

  // Apps Management Form & State
  const [newApp, setNewApp] = useState({
    name: '',
    category: '',
    icon: 'Grid',
    description: '',
    downloadUrl: '',
    githubReleaseUrl: '',
    version: '1.0.0',
    releaseDate: new Date().toISOString().split('T')[0],
    releaseNotes: '',
    platform: 'all',
    pricingType: 'free',
    price: ''
  });
  const [selectedAppFile, setSelectedAppFile] = useState(null);
  const [appFileValidation, setAppFileValidation] = useState({ isValid: true, error: '', limitExceeded: false });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingAppFile, setIsUploadingAppFile] = useState(false);
  const [isAddingApp, setIsAddingApp] = useState(false);
  const [showExternalLinkInput, setShowExternalLinkInput] = useState(false);
  const appFileInputRef = useRef(null);

  // Sync appearance whenever settings change
  useEffect(() => {
    if (settings?.appearance) {
      setAppearanceForm(settings.appearance);
    }
  }, [settings]);

  // -------------------------------------------------------------
  // Auth Handlers
  // -------------------------------------------------------------
  const handleSignIn = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    const result = await adminLogin(username, password);
    setIsAuthenticating(false);

    if (!result.success) {
      setAuthError(result.message || 'Login failed. Please check your credentials.');
    } else {
      setUsername('');
      setPassword('');
    }
  };

  const handleSignOut = async () => {
    await adminLogout();
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSecurityMessage(null);

    if (newPassword !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'New password and confirmation password do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setSecurityMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setIsUpdatingSecurity(true);
    const result = await updateAdminPassword(currentPassword, newPassword);
    setIsUpdatingSecurity(false);

    if (result.success) {
      setSecurityMessage({ type: 'success', text: 'Admin password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setSecurityMessage({ type: 'error', text: result.message || 'Failed to update password.' });
    }
  };

  const handleEmailChangeRequest = async (e) => {
    e.preventDefault();
    setSecurityMessage(null);
    if (!newEmail || !newEmail.includes('@')) {
      setSecurityMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setIsUpdatingSecurity(true);
    const result = await requestAdminEmailChange(newEmail);
    setIsUpdatingSecurity(false);

    if (result.success) {
      setSecurityMessage({
        type: 'success',
        text: result.message || 'Confirmation link sent to your new email address.'
      });
      setNewEmail('');
    } else {
      setSecurityMessage({ type: 'error', text: result.message || 'Failed to request email change.' });
    }
  };

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    setSecurityMessage(null);
    const emailToReset = resetEmail || currentUser?.email;
    if (!emailToReset) {
      setSecurityMessage({ type: 'error', text: 'Please enter your registered email address.' });
      return;
    }

    setIsUpdatingSecurity(true);
    const result = await sendAdminPasswordReset(emailToReset);
    setIsUpdatingSecurity(false);

    if (result.success) {
      setSecurityMessage({
        type: 'success',
        text: 'Password reset link sent to your email! Follow the link in your inbox.'
      });
      setResetEmail('');
    } else {
      setSecurityMessage({ type: 'error', text: result.message || 'Failed to send reset link.' });
    }
  };

  // -------------------------------------------------------------
  // Web Projects CRUD Handlers
  // -------------------------------------------------------------
  const handleOpenAddProject = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      category: 'Business Website',
      shortDescription: '',
      detailedDescription: '',
      image: '',
      photos: [],
      videoUrl: '',
      link: '',
      githubUrl: '',
      isFeatured: false,
      isPublished: true,
      sortOrder: (webProjects?.length || 0) + 1
    });
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      title: proj.title || '',
      category: proj.category || 'Business Website',
      shortDescription: proj.shortDescription || proj.description || '',
      detailedDescription: proj.detailedDescription || '',
      image: proj.image || '',
      photos: proj.photos || [],
      videoUrl: proj.videoUrl || '',
      link: proj.link || '',
      githubUrl: proj.githubUrl || '',
      isFeatured: Boolean(proj.isFeatured),
      isPublished: proj.isPublished !== false,
      sortOrder: proj.sortOrder || 0
    });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim()) {
      showToast('Project title is required.', 'warning');
      return;
    }

    setIsSavingProject(true);
    if (editingProjectId) {
      await updateWebProject(editingProjectId, projectForm);
    } else {
      await addWebProject(projectForm);
    }
    setIsSavingProject(false);
    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete project "${title}"?`)) {
      await deleteWebProject(id);
    }
  };

  // -------------------------------------------------------------
  // Electrician Gallery CRUD Handlers
  // -------------------------------------------------------------
  const handleOpenAddGallery = () => {
    setEditingGalleryId(null);
    setGalleryForm({
      title: '',
      category: 'House Wiring',
      location: 'Badnapur / Jalna',
      description: '',
      url: '',
      beforeImage: '',
      afterImage: '',
      photos: [],
      videoUrl: '',
      type: 'photo',
      isPublished: true,
      sortOrder: (electricianGallery?.length || 0) + 1
    });
    setIsGalleryModalOpen(true);
  };

  const handleOpenEditGallery = (item) => {
    setEditingGalleryId(item.id);
    setGalleryForm({
      title: item.title || '',
      category: item.category || 'House Wiring',
      location: item.location || 'Badnapur / Jalna',
      description: item.description || '',
      url: item.url || '',
      beforeImage: item.beforeImage || '',
      afterImage: item.afterImage || '',
      photos: item.photos || [],
      videoUrl: item.videoUrl || '',
      type: item.type || 'photo',
      isPublished: item.isPublished !== false,
      sortOrder: item.sortOrder || 0
    });
    setIsGalleryModalOpen(true);
  };

  const handleSaveGallery = async (e) => {
    e.preventDefault();
    if (!galleryForm.title.trim()) {
      showToast('Title is required.', 'warning');
      return;
    }

    // Default main URL to coverImage or afterImage or beforeImage
    const mainUrl = galleryForm.url || galleryForm.afterImage || galleryForm.beforeImage || '';
    const payload = { ...galleryForm, url: mainUrl };

    setIsSavingGallery(true);
    if (editingGalleryId) {
      await updateElectricianGallery(editingGalleryId, payload);
    } else {
      await addElectricianGallery(payload);
    }
    setIsSavingGallery(false);
    setIsGalleryModalOpen(false);
  };

  const handleDeleteGallery = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete electrician work "${title}"?`)) {
      await deleteElectricianGallery(id);
    }
  };

  // -------------------------------------------------------------
  // Tour Destinations CRUD Handlers
  // -------------------------------------------------------------
  const handleOpenAddDestination = () => {
    setEditingDestinationId(null);
    setDestinationForm({
      name: '',
      startingCity: 'Jalna / Aurangabad',
      destinationCity: '',
      coverImage: '',
      photos: [],
      videoUrl: '',
      description: '',
      highlightsText: '',
      price: '',
      isPriceOnRequest: false,
      duration: '',
      availableDates: 'Every Weekend & On Demand',
      itineraryText: '',
      routeInfo: '',
      isFeatured: false,
      isPublished: true,
      sortOrder: (tourDestinations?.length || 0) + 1
    });
    setIsDestinationModalOpen(true);
  };

  const handleOpenEditDestination = (dest) => {
    setEditingDestinationId(dest.id);
    setDestinationForm({
      name: dest.name || '',
      startingCity: dest.startingCity || 'Jalna / Aurangabad',
      destinationCity: dest.destinationCity || '',
      coverImage: dest.coverImage || '',
      photos: dest.photos || [],
      videoUrl: dest.videoUrl || '',
      description: dest.description || '',
      highlightsText: Array.isArray(dest.highlights) ? dest.highlights.join(', ') : '',
      price: dest.price || '',
      isPriceOnRequest: Boolean(dest.isPriceOnRequest),
      duration: dest.duration || '',
      availableDates: dest.availableDates || '',
      itineraryText: Array.isArray(dest.itinerary) ? dest.itinerary.join('\n') : '',
      routeInfo: dest.routeInfo || '',
      isFeatured: Boolean(dest.isFeatured),
      isPublished: dest.isPublished !== false,
      sortOrder: dest.sortOrder || 0
    });
    setIsDestinationModalOpen(true);
  };

  const handleSaveDestination = async (e) => {
    e.preventDefault();
    if (!destinationForm.name.trim()) {
      showToast('Destination name is required.', 'warning');
      return;
    }

    const highlights = destinationForm.highlightsText
      ? destinationForm.highlightsText.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const itinerary = destinationForm.itineraryText
      ? destinationForm.itineraryText.split('\n').map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...destinationForm,
      highlights,
      itinerary
    };

    setIsSavingDestination(true);
    if (editingDestinationId) {
      await updateTourDestination(editingDestinationId, payload);
    } else {
      await addTourDestination(payload);
    }
    setIsSavingDestination(false);
    setIsDestinationModalOpen(false);
  };

  const handleDeleteDestination = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete destination "${name}"?`)) {
      await deleteTourDestination(id);
    }
  };

  // -------------------------------------------------------------
  // Inquiries Handlers
  // -------------------------------------------------------------
  const handleDeleteInquiry = async (id, customerName) => {
    if (window.confirm(`Are you sure you want to delete inquiry from "${customerName || 'Customer'}"?`)) {
      await deleteInquiry(id);
    }
  };

  const handleViewInquiry = (inq) => {
    setSelectedInquiry(inq);
    setIsInquiryModalOpen(true);
  };

  // Helper for international/Indian WhatsApp numbers
  const formatWhatsAppUrl = (phone, customerName, serviceType) => {
    if (!phone) return '#';
    let clean = phone.replace(/[^\d+]/g, '');
    if (clean.startsWith('+')) clean = clean.substring(1);
    if (clean.length === 10) clean = '91' + clean; // Default 10 digits to India
    const text = `Hello ${customerName || 'Customer'}, thank you for contacting Khan Electrics regarding your ${serviceType || 'request'}. How can we assist you?`;
    return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
  };

  // Export Inquiries CSV
  const exportInquiriesCSV = () => {
    if (!inquiries || inquiries.length === 0) {
      showToast('No inquiries to export.', 'warning');
      return;
    }
    const headers = ['ID', 'ServiceType', 'Name', 'Phone', 'Email', 'Status', 'Date', 'Details'];
    const rows = inquiries.map(i => [
      i.id,
      `"${i.serviceType || ''}"`,
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${i.status || ''}"`,
      `"${i.createdAt || ''}"`,
      `"${(i.details || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Khan_Customer_Inquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Customer inquiries exported to CSV!', 'success');
  };

  // Filtered inquiries
  const filteredInquiries = (inquiries || []).filter(inq => {
    const matchesService = inquiryServiceFilter === 'All' || inq.serviceType === inquiryServiceFilter;
    const matchesStatus = inquiryStatusFilter === 'All' || inq.status === inquiryStatusFilter;
    const query = inquirySearch.toLowerCase().trim();
    const matchesSearch = !query ||
      (inq.name && inq.name.toLowerCase().includes(query)) ||
      (inq.phone && inq.phone.toLowerCase().includes(query)) ||
      (inq.email && inq.email.toLowerCase().includes(query)) ||
      (inq.details && inq.details.toLowerCase().includes(query));
    return matchesService && matchesStatus && matchesSearch;
  });

  // -------------------------------------------------------------
  // Website Appearance Handler
  // -------------------------------------------------------------
  const handleSaveAppearance = async (e) => {
    e.preventDefault();
    setIsSavingAppearance(true);
    await updateAppearance(appearanceForm);
    setIsSavingAppearance(false);
  };

  // -------------------------------------------------------------
  // Apps Management Handlers
  // -------------------------------------------------------------
  const validateAppFile = (file, platform) => {
    if (!file) return { isValid: true, error: '', limitExceeded: false };
    const MAX_SIZE = 52428800; // 50MB
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    if (file.size > MAX_SIZE) {
      return {
        isValid: false,
        limitExceeded: true,
        sizeMb,
        error: `File size (${sizeMb} MB) exceeds Supabase Storage free-tier limit of 50 MB (₹0 budget). Please use the External Download Link option.`
      };
    }
    const ext = file.name.split('.').pop().toLowerCase();
    if (platform === 'android' && ext !== 'apk') {
      return {
        isValid: false,
        limitExceeded: false,
        sizeMb,
        error: `Target platform requires a .apk package, but you selected .${ext}.`
      };
    }
    if (platform === 'windows' && !['exe', 'msi'].includes(ext)) {
      return {
        isValid: false,
        limitExceeded: false,
        sizeMb,
        error: `Target platform requires a .exe or .msi executable, but you selected .${ext}.`
      };
    }
    return { isValid: true, error: '', limitExceeded: false, sizeMb };
  };

  const handleAppFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateAppFile(file, newApp.platform);
    setSelectedAppFile(file);
    setAppFileValidation(validation);
    if (validation.limitExceeded) {
      setShowExternalLinkInput(true);
    }
  };

  const handleClearAppFile = () => {
    setSelectedAppFile(null);
    setAppFileValidation({ isValid: true, error: '', limitExceeded: false });
    if (appFileInputRef.current) appFileInputRef.current.value = '';
  };

  const handleCreateApp = async (e) => {
    e.preventDefault();
    if (!newApp.name || !newApp.description) {
      showToast('Please provide an app name and description.', 'warning');
      return;
    }

    let downloadUrl = newApp.downloadUrl || '#';
    let fileMeta = {};

    if (selectedAppFile) {
      setIsUploadingAppFile(true);
      const uploadRes = await uploadAppFile(
        selectedAppFile,
        { platform: newApp.platform },
        (progress) => setUploadProgress(progress)
      );
      setIsUploadingAppFile(false);

      if (!uploadRes.success) {
        showToast(uploadRes.message || 'File upload failed.', 'error');
        return;
      }
      downloadUrl = uploadRes.downloadUrl;
      fileMeta = {
        fileType: uploadRes.fileType,
        fileSizeBytes: uploadRes.fileSizeBytes,
        storagePath: uploadRes.storagePath
      };
    }

    setIsAddingApp(true);
    const result = await addAppItem({
      ...newApp,
      downloadUrl,
      ...fileMeta
    });
    setIsAddingApp(false);

    if (result.success) {
      setNewApp({
        name: '',
        category: '',
        icon: 'Grid',
        description: '',
        downloadUrl: '',
        githubReleaseUrl: '',
        version: '1.0.0',
        releaseDate: new Date().toISOString().split('T')[0],
        releaseNotes: '',
        platform: 'all',
        pricingType: 'free',
        price: ''
      });
      handleClearAppFile();
      setShowExternalLinkInput(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteApp = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove app "${name}" from the catalog?`)) {
      await deleteAppItem(id);
    }
  };

  // -------------------------------------------------------------
  // IF NOT AUTHENTICATED: Show Simple Clean Login
  // -------------------------------------------------------------
  if (!isAdminLoggedIn || !isAuthorizedAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_40px_rgba(0,210,255,0.2)] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-display font-extrabold text-2xl text-white">
              ADMIN CMS AUTHENTICATION
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Protected by Supabase Auth & PostgreSQL Row Level Security (RLS).
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4 text-left">
            <div>
              <label htmlFor="admin-username-input" className="block text-xs font-semibold text-cyan-300 mb-1">
                Username
              </label>
              <input
                id="admin-username-input"
                type="text"
                required
                autoComplete="off"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label htmlFor="admin-password-input" className="block text-xs font-semibold text-cyan-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="off"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,210,255,0.4)] disabled:opacity-50"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Access Admin Dashboard
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-slate-400 font-mono">
            Authorized Website Owner: <span className="text-cyan-300">spathan1862@gmail.com</span>
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED: REDESIGNED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER BAR */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-white font-display">
                KHAN ELECTRICS ADMIN PANEL
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                Live Cloud Sync
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Logged in as <span className="text-cyan-300 font-mono font-semibold">{currentUser?.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Globe className="w-4 h-4" /> View Public Site <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleSignOut}
            className="px-3.5 py-2 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* 7 SIMPLIFIED NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 border-b border-cyan-500/20 pb-3">
        {[
          { id: 'dashboard', label: '1. Dashboard', icon: Layout, color: 'cyan' },
          { id: 'web-projects', label: '2. Web Projects', count: webProjects?.length, icon: Code2, color: 'cyan' },
          { id: 'electrician-gallery', label: '3. Electrician Gallery', count: electricianGallery?.length, icon: Zap, color: 'amber' },
          { id: 'tour-destinations', label: '4. Tour Destinations', count: tourDestinations?.length, icon: Plane, color: 'teal' },
          { id: 'inquiries', label: '5. Customer Inquiries', count: inquiries?.length, icon: Users, color: 'emerald' },
          { id: 'appearance', label: '6. Website Appearance', icon: Sparkles, color: 'purple' },
          { id: 'security', label: '7. Account & Security', icon: ShieldCheck, color: 'rose' },
          { id: 'apps', label: 'Apps Management', count: apps?.length, icon: Grid, color: 'cyan' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={tab.id === 'security' ? 'tab-security' : `tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                  : 'glass-panel text-slate-300 hover:text-white hover:border-cyan-500/40'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  isActive ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================= */}
      {/* SECTION 1: DASHBOARD OVERVIEW */}
      {/* ============================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* KPI CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div
              onClick={() => setActiveTab('inquiries')}
              className="glass-panel p-5 rounded-2xl border border-emerald-500/30 hover:border-emerald-400 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-emerald-400">
                <Users className="w-5 h-5" />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30">
                  {inquiries?.filter(i => i.status === 'New').length || 0} New
                </span>
              </div>
              <div className="text-2xl font-extrabold text-white font-display">
                {inquiries?.length || 0}
              </div>
              <p className="text-[11px] text-slate-300 font-medium">Customer Inquiries</p>
            </div>

            <div
              onClick={() => setActiveTab('web-projects')}
              className="glass-panel p-5 rounded-2xl border border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all space-y-2 group"
            >
              <div className="text-cyan-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-white font-display">
                {webProjects?.length || 0}
              </div>
              <p className="text-[11px] text-slate-300 font-medium">Web Projects</p>
            </div>

            <div
              onClick={() => setActiveTab('electrician-gallery')}
              className="glass-panel p-5 rounded-2xl border border-amber-500/30 hover:border-amber-400 cursor-pointer transition-all space-y-2 group"
            >
              <div className="text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-white font-display">
                {electricianGallery?.length || 0}
              </div>
              <p className="text-[11px] text-slate-300 font-medium">Electrician Works</p>
            </div>

            <div
              onClick={() => setActiveTab('tour-destinations')}
              className="glass-panel p-5 rounded-2xl border border-teal-500/30 hover:border-teal-400 cursor-pointer transition-all space-y-2 group"
            >
              <div className="text-teal-400">
                <Plane className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-white font-display">
                {tourDestinations?.length || 0}
              </div>
              <p className="text-[11px] text-slate-300 font-medium">Tour Destinations</p>
            </div>

            <div
              onClick={() => setActiveTab('apps')}
              className="glass-panel p-5 rounded-2xl border border-blue-500/30 hover:border-blue-400 cursor-pointer transition-all space-y-2 group"
            >
              <div className="text-blue-400">
                <Grid className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-white font-display">
                {apps?.length || 0}
              </div>
              <p className="text-[11px] text-slate-300 font-medium">Software Catalog</p>
            </div>

            <div
              onClick={() => setActiveTab('appearance')}
              className="glass-panel p-5 rounded-2xl border border-purple-500/30 hover:border-purple-400 cursor-pointer transition-all space-y-2 group"
            >
              <div className="text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-white font-display">
                3
              </div>
              <p className="text-[11px] text-slate-300 font-medium">Homepage Services</p>
            </div>
          </div>

          {/* QUICK SHORTCUTS & ACTIONS */}
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Quick CMS Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={handleOpenAddProject}
                className="p-3.5 rounded-2xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white">Add Web Project</div>
                <div className="text-[10px] text-slate-400">Upload cover & screenshots</div>
              </button>

              <button
                onClick={handleOpenAddGallery}
                className="p-3.5 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white">Add Electrician Work</div>
                <div className="text-[10px] text-slate-400">Before & after photos / demo</div>
              </button>

              <button
                onClick={handleOpenAddDestination}
                className="p-3.5 rounded-2xl bg-teal-950/40 hover:bg-teal-900/60 border border-teal-500/30 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 mb-2 group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white">Add Destination</div>
                <div className="text-[10px] text-slate-400">Holiday tour package & cab route</div>
              </button>

              <button
                onClick={() => setActiveTab('appearance')}
                className="p-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white">Edit Appearance</div>
                <div className="text-[10px] text-slate-400">Change homepage cards & images</div>
              </button>
            </div>
          </div>

          {/* RECENT INQUIRIES PREVIEW */}
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" /> Recent Customer Inquiries
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Latest customer requests submitted from public pages.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('inquiries')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                View All Inquiries <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {(inquiries || []).slice(0, 5).map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-400 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        inq.serviceType === 'Web Development'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                          : inq.serviceType === 'Electrician'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            : inq.serviceType === 'Tour & Travel'
                              ? 'bg-teal-950 text-teal-300 border border-teal-500/30'
                              : 'bg-slate-800 text-slate-300'
                      }`}>
                        {inq.serviceType}
                      </span>
                      <span className="text-xs font-bold text-white">{inq.name}</span>
                      <span className="text-[11px] text-cyan-300 font-mono">{inq.phone}</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1">{inq.details || inq.message || 'No additional message.'}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${inq.phone}`}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-900/80"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                    <a
                      href={formatWhatsAppUrl(inq.phone, inq.name, inq.serviceType)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" /> WhatsApp
                    </a>
                    <button
                      onClick={() => handleViewInquiry(inq)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:text-white"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SECTION 2: WEB DEVELOPMENT PROJECTS MANAGER */}
      {/* ============================================================= */}
      {activeTab === 'web-projects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" /> Web Development Portfolio Manager
              </h2>
              <p className="text-xs text-slate-400">
                Manage showcase projects for the public Web Development page.
              </p>
            </div>

            <button
              onClick={handleOpenAddProject}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,210,255,0.4)]"
            >
              <Plus className="w-4 h-4" /> Add New Project
            </button>
          </div>

          {/* PROJECTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webProjects?.map((proj) => (
              <div
                key={proj.id}
                className="glass-panel rounded-2xl border border-cyan-500/20 overflow-hidden hover:border-cyan-400 transition-all flex flex-col group"
              >
                {/* Project Image */}
                <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                  {proj.image ? (
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                      {proj.category}
                    </span>
                    {proj.isFeatured && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/90 text-slate-950">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      proj.isPublished !== false
                        ? 'bg-emerald-500/90 text-slate-950'
                        : 'bg-rose-500/90 text-white'
                    }`}>
                      {proj.isPublished !== false ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                      {proj.shortDescription || proj.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-between">
                    <button
                      onClick={() => toggleWebProjectPublish(proj.id, proj.isPublished !== false)}
                      className="text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
                    >
                      {proj.isPublished !== false ? 'Unpublish' : 'Publish'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditProject(proj)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.title)}
                        className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SECTION 3: ELECTRICIAN WORK GALLERY MANAGER */}
      {/* ============================================================= */}
      {activeTab === 'electrician-gallery' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" /> Electrician Work Gallery Manager
              </h2>
              <p className="text-xs text-slate-400">
                Manage completed jobs, before-and-after photos, and demo videos for the Electrician page.
              </p>
            </div>

            <button
              onClick={handleOpenAddGallery}
              className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,183,3,0.4)]"
            >
              <Plus className="w-4 h-4" /> Add Work Entry
            </button>
          </div>

          {/* GALLERY GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {electricianGallery?.map((item) => (
              <div
                key={item.id}
                className="glass-panel rounded-2xl border border-amber-500/20 overflow-hidden hover:border-amber-400 transition-all flex flex-col group"
              >
                {/* Image / Before-After Preview */}
                <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                  {item.beforeImage && item.afterImage ? (
                    <div className="grid grid-cols-2 h-full w-full">
                      <div className="relative h-full border-r border-slate-800">
                        <img src={item.beforeImage} alt="Before" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/70 text-amber-300">
                          Before
                        </span>
                      </div>
                      <div className="relative h-full">
                        <img src={item.afterImage} alt="After" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/70 text-emerald-300">
                          After
                        </span>
                      </div>
                    </div>
                  ) : item.url || item.afterImage || item.beforeImage ? (
                    <img
                      src={item.url || item.afterImage || item.beforeImage}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                      {item.category || 'General Electrical'}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      item.isPublished !== false
                        ? 'bg-emerald-500/90 text-slate-950'
                        : 'bg-rose-500/90 text-white'
                    }`}>
                      {item.isPublished !== false ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-amber-300/80 font-mono mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {item.location || 'Badnapur / Jalna'}
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1.5">
                      {item.description || 'Professional electrical repair and installation.'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between">
                    <button
                      onClick={() => toggleElectricianGalleryPublish(item.id, item.isPublished !== false)}
                      className="text-xs font-semibold text-slate-400 hover:text-amber-300 transition-colors"
                    >
                      {item.isPublished !== false ? 'Unpublish' : 'Publish'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditGallery(item)}
                        className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGallery(item.id, item.title)}
                        className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SECTION 4: TOUR & TRAVEL DESTINATIONS MANAGER */}
      {/* ============================================================= */}
      {activeTab === 'tour-destinations' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plane className="w-5 h-5 text-teal-400" /> Tour & Travel Destinations Manager
              </h2>
              <p className="text-xs text-slate-400">
                Manage travel packages, destination routes, and tour posts for the Tour & Travels page.
              </p>
            </div>

            <button
              onClick={handleOpenAddDestination}
              className="px-4 py-2.5 rounded-xl bg-teal-500 text-slate-950 hover:bg-teal-400 text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(20,184,166,0.4)]"
            >
              <Plus className="w-4 h-4" /> Add Destination
            </button>
          </div>

          {/* DESTINATIONS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tourDestinations?.map((dest) => (
              <div
                key={dest.id}
                className="glass-panel rounded-2xl border border-teal-500/20 overflow-hidden hover:border-teal-400 transition-all flex flex-col group"
              >
                {/* Cover Image */}
                <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                  {dest.coverImage ? (
                    <img
                      src={dest.coverImage}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-teal-300 border border-teal-500/30">
                      {dest.startingCity} → {dest.destinationCity}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      dest.isPublished !== false
                        ? 'bg-emerald-500/90 text-slate-950'
                        : 'bg-rose-500/90 text-white'
                    }`}>
                      {dest.isPublished !== false ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-white group-hover:text-teal-300 transition-colors">
                        {dest.name}
                      </h3>
                      <span className="text-xs font-bold text-teal-300 font-mono">
                        {dest.isPriceOnRequest ? 'Price on Request' : (dest.price || 'Contact for Price')}
                      </span>
                    </div>

                    {dest.duration && (
                      <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-teal-400" /> {dest.duration}
                      </p>
                    )}

                    <p className="text-xs text-slate-300 line-clamp-2">
                      {dest.description || 'Exciting travel package with complete cab and hotel assistance.'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-teal-500/20 flex items-center justify-between">
                    <button
                      onClick={() => toggleTourDestinationPublish(dest.id, dest.isPublished !== false)}
                      className="text-xs font-semibold text-slate-400 hover:text-teal-300 transition-colors"
                    >
                      {dest.isPublished !== false ? 'Unpublish' : 'Publish'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditDestination(dest)}
                        className="px-3 py-1.5 rounded-lg bg-teal-950/60 border border-teal-500/40 text-teal-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDestination(dest.id, dest.name)}
                        className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SECTION 5: CUSTOMER INQUIRIES (SEPARATE INBOX) */}
      {/* ============================================================= */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" /> Customer Inquiries Inbox
              </h2>
              <p className="text-xs text-slate-400">
                Dedicated lead management inbox with direct customer contact actions.
              </p>
            </div>

            <button
              onClick={exportInquiriesCSV}
              className="px-4 py-2 rounded-xl bg-teal-950/60 border border-teal-500/40 text-teal-300 hover:bg-teal-900/80 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 flex flex-col md:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by customer name, mobile number, email, or message..."
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Service Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-400 shrink-0">Service:</span>
              <select
                value={inquiryServiceFilter}
                onChange={(e) => setInquiryServiceFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs text-white focus:outline-none"
              >
                <option value="All">All Services</option>
                <option value="Web Development">Web Development</option>
                <option value="Electrician">Electrician</option>
                <option value="Tour & Travel">Tour & Travel</option>
                <option value="General Contact">General Contact</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-400 shrink-0">Status:</span>
              <select
                value={inquiryStatusFilter}
                onChange={(e) => setInquiryStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs text-white focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* INQUIRIES LIST */}
          <div className="space-y-4">
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="glass-panel p-5 rounded-2xl border border-cyan-500/20 hover:border-cyan-400 transition-all flex flex-col lg:flex-row justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        inq.serviceType === 'Web Development'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                          : inq.serviceType === 'Electrician'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            : inq.serviceType === 'Tour & Travel'
                              ? 'bg-teal-950 text-teal-300 border border-teal-500/30'
                              : 'bg-slate-800 text-slate-300'
                      }`}>
                        {inq.serviceType}
                      </span>

                      <span className="text-[11px] text-slate-400 font-mono">
                        {inq.createdAt ? new Date(inq.createdAt).toLocaleString() : 'Recent'}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white">
                      {inq.name}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                      <div><strong className="text-cyan-400">Mobile:</strong> {inq.phone}</div>
                      <div><strong className="text-cyan-400">Email:</strong> {inq.email || '—'}</div>
                      {inq.location && <div><strong className="text-cyan-400">Location:</strong> {inq.location}</div>}
                      {inq.businessName && <div><strong className="text-cyan-400">Business:</strong> {inq.businessName}</div>}
                      {inq.websiteType && <div><strong className="text-cyan-400">Website Type:</strong> {inq.websiteType}</div>}
                      {inq.rooms && <div><strong className="text-amber-400">Rooms:</strong> {inq.rooms}</div>}
                      {inq.toDestination && <div><strong className="text-teal-400">Destination:</strong> {inq.toDestination}</div>}
                      {inq.travelDate && <div><strong className="text-teal-400">Travel Date:</strong> {inq.travelDate}</div>}
                    </div>

                    {inq.details && (
                      <p className="text-xs text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-cyan-500/10 italic">
                        "{inq.details}"
                      </p>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-between gap-3 shrink-0">
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Status:</span>
                      <select
                        value={inq.status || 'New'}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono focus:outline-none ${
                          inq.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : inq.status === 'Contacted'
                              ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                              : inq.status === 'In Progress'
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                : inq.status === 'Cancelled'
                                  ? 'bg-red-950 text-red-300 border border-red-500/40'
                                  : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`tel:${inq.phone}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-cyan-400" /> Call
                      </a>

                      <a
                        href={formatWhatsAppUrl(inq.phone, inq.name, inq.serviceType)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      >
                        <Share2 className="w-3.5 h-3.5" /> WhatsApp
                      </a>

                      {inq.email && (
                        <a
                          href={`mailto:${inq.email}?subject=Regarding your ${inq.serviceType} inquiry - Khan Electrics`}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          Email
                        </a>
                      )}

                      <button
                        onClick={() => handleViewInquiry(inq)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-semibold"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleDeleteInquiry(inq.id, inq.name)}
                        className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-panel p-12 rounded-3xl border border-cyan-500/20 text-center space-y-2">
                <Users className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-sm font-bold text-white">No inquiries found matching criteria.</p>
                <p className="text-xs text-slate-400">Incoming inquiries from customers will appear here automatically.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SECTION 6: WEBSITE APPEARANCE MANAGER */}
      {/* ============================================================= */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> Website Appearance & Service Cards
              </h2>
              <p className="text-xs text-slate-400">
                Customize homepage service card images, titles, descriptions, and section visibility without coding.
              </p>
            </div>

            <button
              onClick={handleSaveAppearance}
              disabled={isSavingAppearance}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:brightness-110 text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50"
            >
              {isSavingAppearance ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save All Changes
            </button>
          </div>

          <form onSubmit={handleSaveAppearance} className="space-y-8">
            {/* HERO SECTION SETTINGS */}
            <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layout className="w-4 h-4 text-cyan-400" /> Homepage Hero Banner
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-cyan-300 mb-1">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={3}
                    value={settings.heroSubtitle || ''}
                    onChange={(e) => updateSettings({ heroSubtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[10px] text-slate-400">Displayed prominently under the main heading on the homepage.</span>
                </div>

                <MediaUploader
                  label="Hero Banner Image (Optional)"
                  folder="appearance"
                  mediaType="image"
                  value={appearanceForm.hero_banner_image || ''}
                  onChange={(url) => setAppearanceForm(prev => ({ ...prev, hero_banner_image: url }))}
                  hint="High-resolution banner background for the top hero section."
                />
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-cyan-500/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appearanceForm.featured_projects_visible !== false}
                    onChange={(e) => setAppearanceForm(prev => ({ ...prev, featured_projects_visible: e.target.checked }))}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-cyan-500/30"
                  />
                  <span className="text-xs text-white font-medium">Show Featured Web Projects Section on Homepage</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appearanceForm.featured_destinations_visible !== false}
                    onChange={(e) => setAppearanceForm(prev => ({ ...prev, featured_destinations_visible: e.target.checked }))}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-cyan-500/30"
                  />
                  <span className="text-xs text-white font-medium">Show Featured Tour Destinations Section on Homepage</span>
                </label>
              </div>
            </div>

            {/* HOMEPAGE SERVICE CARDS CUSTOMIZER */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* CARD 1: WEB DEV */}
              <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" /> Web Dev Service Card
                  </h3>
                  <label className="flex items-center gap-1.5 text-xs text-cyan-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appearanceForm.web_dev_card?.is_visible !== false}
                      onChange={(e) => setAppearanceForm(prev => ({
                        ...prev,
                        web_dev_card: { ...prev.web_dev_card, is_visible: e.target.checked }
                      }))}
                      className="w-3.5 h-3.5 rounded text-cyan-500"
                    />
                    Visible
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Card Title</label>
                    <input
                      type="text"
                      value={appearanceForm.web_dev_card?.title || 'Web Development'}
                      onChange={(e) => setAppearanceForm(prev => ({
                        ...prev,
                        web_dev_card: { ...prev.web_dev_card, title: e.target.value }
                      }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={appearanceForm.web_dev_card?.short_description || ''}
                      onChange={(e) => setAppearanceForm(prev => ({
                        ...prev,
                        web_dev_card: { ...prev.web_dev_card, short_description: e.target.value }
                      }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white text-xs"
                    />
                  </div>

                  <MediaUploader
                    label="Service Card Cover Image"
                    folder="appearance"
                    mediaType="image"
                    value={appearanceForm.web_dev_card?.image || ''}
                    onChange={(url) => setAppearanceForm(prev => ({
                      ...prev,
                      web_dev_card: { ...prev.web_dev_card, image: url }
                    }))}
                  />
                </div>
              </div>

              {/* CARD 2: ELECTRICIAN */}
              <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" /> Electrician Service Card
                  </h3>
                  <label className="flex items-center gap-1.5 text-xs text-amber-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appearanceForm.electrician_card?.is_visible !== false}
                      onChange={(e) => setAppearanceForm(prev => ({
                        ...prev,
                        electrician_card: { ...prev.electrician_card, is_visible: e.target.checked }
                      }))}
                      className="w-3.5 h-3.5 rounded text-amber-500"
                    />
                    Visible
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Card Title</label>
                    <input
                      type="text"
                      value={appearanceForm.electrician_card?.title || 'Khan Electrician Service'}
                      onChange={(e) => setAppearanceForm(prev => ({
                        ...prev,
                        electrician_card: { ...prev.electrician_card, title: e.target.value }
                      }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-amber-500/30 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={appearanceForm.electrician_card?.short_description || ''}
                      onChange={(e) => setAppearanceForm(prev => ({
                        ...prev,
                        electrician_card: { ...prev.electrician_card, short_description: e.target.value }
                      }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-amber-500/30 text-white text-xs"
                    />
                  </div>

                  <MediaUploader
                    label="Service Card Cover Image"
                    folder="appearance"
                    mediaType="image"
                    value={appearanceForm.electrician_card?.image || ''}
                    onChange={(url) => setAppearanceForm(prev => ({
                      ...prev,
                      electrician_card: { ...prev.electrician_card, image: url }
                    }))}
                  />
                </div>
              </div>

              {/* CARD 3: TOUR & TRAVELS */}
              <div className="glass-panel p-6 rounded-3xl border border-teal-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Plane className="w-4 h-4 text-teal-400" /> Tour & Travel Card
                  </h3>
                  <label className="flex items-center gap-1.5 text-xs text-teal-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appearanceForm.tour_travel_card?.is_visible !== false}
                      onChange={(e) => setAppearanceForm(prev => ({
                        ...prev,
                        tour_travel_card: { ...prev.tour_travel_card, is_visible: e.target.checked }
                      }))}
                      className="w-3.5 h-3.5 rounded text-teal-500"
                    />
                    Visible
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Card Title</label>
                    <input
                      type="text"
                      value={appearanceForm.tour_travel_card?.title || 'Tour and Travel'}
                      onChange={(e) => setAppearanceForm(prev => ({
                        ...prev,
                        tour_travel_card: { ...prev.tour_travel_card, title: e.target.value }
                      }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-teal-500/30 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={appearanceForm.tour_travel_card?.short_description || ''}
                      onChange={(e) => setAppearanceForm(prev => ({
                        ...prev,
                        tour_travel_card: { ...prev.tour_travel_card, short_description: e.target.value }
                      }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-teal-500/30 text-white text-xs"
                    />
                  </div>

                  <MediaUploader
                    label="Service Card Cover Image"
                    folder="appearance"
                    mediaType="image"
                    value={appearanceForm.tour_travel_card?.image || ''}
                    onChange={(url) => setAppearanceForm(prev => ({
                      ...prev,
                      tour_travel_card: { ...prev.tour_travel_card, image: url }
                    }))}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================= */}
      {/* SECTION 7: ACCOUNT & SECURITY */}
      {/* ============================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-rose-400" /> ACCOUNT & SECURITY MANAGEMENT
            </h2>
            <p className="text-xs text-slate-400">
              Manage your administrator credentials, email, and session safety.
            </p>
          </div>

          {securityMessage && (
            <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
              securityMessage.type === 'success'
                ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/70 border border-red-500/40 text-red-300'
            }`}>
              {securityMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{securityMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PASSWORD UPDATE */}
            <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 space-y-4">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <KeyRound className="w-4 h-4" /> Change Admin Password
              </div>
              <p className="text-[11px] text-slate-400">
                To change your password, verify your current identity first.
              </p>

              <form onSubmit={handlePasswordUpdate} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-rose-300 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-rose-500/30 text-white text-xs font-mono pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-300 mb-1">
                    New Password (min 8 chars)
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new strong password"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-rose-500/30 text-white text-xs font-mono pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-rose-500/30 text-white text-xs font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingSecurity}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)] disabled:opacity-50"
                >
                  {isUpdatingSecurity ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* EMAIL & SESSION INFO */}
            <div className="space-y-6">
              {/* Email Change */}
              <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <UserCheck className="w-4 h-4" /> Registered Administrator
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-xs">
                  <div className="text-slate-400">Current Login Email:</div>
                  <div className="font-mono font-bold text-white mt-0.5">{currentUser?.email}</div>
                </div>

                <form onSubmit={handleEmailChangeRequest} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-cyan-300 mb-1">
                      Change Login Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter new administrator email"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white text-xs font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdatingSecurity}
                    className="w-full py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-all disabled:opacity-50"
                  >
                    Send Confirmation Link to New Email
                  </button>
                </form>
              </div>

              {/* Session policy card */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-700 space-y-2 text-xs text-slate-300">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" /> Non-Persistent Tab Session Active
                </div>
                <p className="text-[11px] text-slate-400">
                  Your administrator login is scoped to this browser session. If you close this tab or browser, credentials will be required again for security.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SECTION 8: APPS MANAGEMENT (CATALOG & BINARY UPLOAD) */}
      {/* ============================================================= */}
      {activeTab === 'apps' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Grid className="w-5 h-5 text-blue-400" /> Software & Apps Management
              </h2>
              <p className="text-xs text-slate-400">
                Manage downloadable apps, upload .apk / .exe files up to 50MB, or link direct GitHub Releases.
              </p>
            </div>
          </div>

          {/* ADD APP FORM */}
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" /> Add Software to Catalog
            </h3>

            <form onSubmit={handleCreateApp} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-cyan-300 mb-1">App Name *</label>
                  <input
                    type="text"
                    required
                    value={newApp.name}
                    onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                    placeholder="e.g. MedicoManager"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cyan-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={newApp.category}
                    onChange={(e) => setNewApp({ ...newApp, category: e.target.value })}
                    placeholder="e.g. Medical Shop Management"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cyan-300 mb-1">Target Platform</label>
                  <select
                    value={newApp.platform}
                    onChange={(e) => {
                      setNewApp({ ...newApp, platform: e.target.value });
                      if (selectedAppFile) {
                        setAppFileValidation(validateAppFile(selectedAppFile, e.target.value));
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white text-xs"
                  >
                    <option value="all">Cross-Platform / All</option>
                    <option value="android">Android (.apk)</option>
                    <option value="windows">Windows (.exe / .msi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-cyan-300 mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={newApp.description}
                  onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                  placeholder="Key features and overview of the software..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white text-xs"
                />
              </div>

              {/* FILE UPLOAD & FALLBACK LINK */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-cyan-300">
                    Upload App File (up to 50MB free-tier limit)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => appFileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-900/80 flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-4 h-4" /> Choose App File
                    </button>

                    {selectedAppFile && (
                      <button
                        type="button"
                        onClick={handleClearAppFile}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  <input
                    ref={appFileInputRef}
                    type="file"
                    accept=".apk,.exe,.msi,.zip"
                    onChange={handleAppFileSelect}
                    className="hidden"
                  />

                  {selectedAppFile && (
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs text-slate-300 space-y-1">
                      <div className="font-mono text-white truncate">{selectedAppFile.name}</div>
                      <div className="text-[10px] text-cyan-300 font-mono">
                        {(selectedAppFile.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                  )}

                  {!appFileValidation.isValid && (
                    <p className="text-[11px] text-red-400">{appFileValidation.error}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cyan-300 mb-1">
                    Or GitHub Release / External Link
                  </label>
                  <input
                    type="url"
                    value={newApp.downloadUrl}
                    onChange={(e) => setNewApp({ ...newApp, downloadUrl: e.target.value })}
                    placeholder="https://github.com/.../releases/download/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400">
                    Use this for direct GitHub release assets or files larger than 50MB.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAddingApp || isUploadingAppFile}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,210,255,0.4)] disabled:opacity-50 flex items-center gap-2"
              >
                {isAddingApp || isUploadingAppFile ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Adding App...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add App to Catalog
                  </>
                )}
              </button>
            </form>
          </div>

          {/* APPS LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps?.map((app) => (
              <div
                key={app.id}
                className="glass-panel p-5 rounded-2xl border border-cyan-500/20 hover:border-cyan-400 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {app.platform}
                    </span>
                    <button
                      onClick={() => toggleAppPublish(app.id, app.isPublished !== false)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        app.isPublished !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {app.isPublished !== false ? 'Published' : 'Draft'}
                    </button>
                  </div>

                  <h3 className="font-bold text-base text-white">{app.name}</h3>
                  <p className="text-xs text-slate-400">{app.category}</p>
                  <p className="text-xs text-slate-300 line-clamp-2">{app.description}</p>
                </div>

                <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-between">
                  <a
                    href={app.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Link
                  </a>
                  <button
                    onClick={() => handleDeleteApp(app.id, app.name)}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD / EDIT WEB PROJECT */}
      {/* ============================================================= */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-cyan-500/30 p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                {editingProjectId ? 'Edit Web Project' : 'Add New Web Project'}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-cyan-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. Khan Electrics Website"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cyan-300 mb-1">
                    Category
                  </label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white text-xs"
                  >
                    <option value="Business Website">Business Website</option>
                    <option value="Multi-Service Web Portal">Multi-Service Web Portal</option>
                    <option value="E-Commerce Store">E-Commerce Store</option>
                    <option value="Electron Desktop App">Electron Desktop App</option>
                    <option value="Booking & Tours">Booking & Tours</option>
                    <option value="Personal Brand">Personal Brand</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-cyan-300 mb-1">
                  Short Description * (appears on card)
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.shortDescription}
                  onChange={(e) => setProjectForm({ ...projectForm, shortDescription: e.target.value })}
                  placeholder="1-2 sentences summarizing the project..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-cyan-300 mb-1">
                  Detailed Description (optional)
                </label>
                <textarea
                  rows={3}
                  value={projectForm.detailedDescription}
                  onChange={(e) => setProjectForm({ ...projectForm, detailedDescription: e.target.value })}
                  placeholder="Full scope, features, stack, and problem solved..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white text-xs"
                />
              </div>

              {/* COVER IMAGE */}
              <MediaUploader
                label="Cover Image *"
                folder="projects"
                mediaType="image"
                value={projectForm.image}
                onChange={(url) => setProjectForm({ ...projectForm, image: url })}
                hint="Main photo displayed on the portfolio card."
              />

              {/* DEMO VIDEO */}
              <MediaUploader
                label="Demonstration Video (Optional)"
                folder="projects"
                mediaType="video"
                value={projectForm.videoUrl}
                onChange={(url) => setProjectForm({ ...projectForm, videoUrl: url })}
                hint="Upload MP4/WebM (under 50MB) or paste YouTube / Drive video link."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-cyan-300 mb-1">
                    Live Website URL (optional)
                  </label>
                  <input
                    type="url"
                    value={projectForm.link}
                    onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cyan-300 mb-1">
                    GitHub Repository URL (optional)
                  </label>
                  <input
                    type="url"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* TOGGLES */}
              <div className="pt-2 border-t border-cyan-500/10 flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectForm.isFeatured}
                    onChange={(e) => setProjectForm({ ...projectForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-500"
                  />
                  <span className="text-xs text-white">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectForm.isPublished}
                    onChange={(e) => setProjectForm({ ...projectForm, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-500"
                  />
                  <span className="text-xs text-white">Publish Publicly</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProject}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,210,255,0.4)] disabled:opacity-50"
                >
                  {isSavingProject ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD / EDIT ELECTRICIAN WORK */}
      {/* ============================================================= */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-amber-500/30 p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                {editingGalleryId ? 'Edit Electrician Work' : 'Add Electrician Work'}
              </h3>
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    placeholder="e.g. Complete House Concealed Wiring"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-amber-500/30 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    Category
                  </label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-amber-500/30 text-white text-xs"
                  >
                    <option value="House Wiring">House Wiring</option>
                    <option value="Industrial Panel">Industrial Panel</option>
                    <option value="CCTV Installation">CCTV Installation</option>
                    <option value="Inverter & Battery">Inverter & Battery</option>
                    <option value="Smart Lighting">Smart Lighting</option>
                    <option value="Emergency Repairs">Emergency Repairs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={galleryForm.location}
                  onChange={(e) => setGalleryForm({ ...galleryForm, location: e.target.value })}
                  placeholder="e.g. Badnapur, Jalna"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-amber-500/30 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  Description of Work Done
                </label>
                <textarea
                  rows={2}
                  value={galleryForm.description}
                  onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  placeholder="What was installed or fixed..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-amber-500/30 text-white text-xs"
                />
              </div>

              {/* BEFORE & AFTER PHOTOS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MediaUploader
                  label="Before Photo (Optional)"
                  folder="electrician"
                  mediaType="image"
                  value={galleryForm.beforeImage}
                  onChange={(url) => setGalleryForm({ ...galleryForm, beforeImage: url })}
                  hint="Initial problem or pre-renovation photo."
                />

                <MediaUploader
                  label="After / Completed Photo"
                  folder="electrician"
                  mediaType="image"
                  value={galleryForm.afterImage}
                  onChange={(url) => setGalleryForm({ ...galleryForm, afterImage: url })}
                  hint="Finished job or clean electrical installation."
                />
              </div>

              {/* DEMO VIDEO */}
              <MediaUploader
                label="Demonstration Video (Optional)"
                folder="electrician"
                mediaType="video"
                value={galleryForm.videoUrl}
                onChange={(url) => setGalleryForm({ ...galleryForm, videoUrl: url })}
                hint="Demonstration video showing working switches/panels."
              />

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={galleryForm.isPublished}
                    onChange={(e) => setGalleryForm({ ...galleryForm, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span className="text-xs text-white">Publish to Electrician Gallery</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-500/20">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingGallery}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,183,3,0.4)] disabled:opacity-50"
                >
                  {isSavingGallery ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Work Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD / EDIT TOUR DESTINATION */}
      {/* ============================================================= */}
      {isDestinationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-teal-500/30 p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-teal-500/20 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plane className="w-5 h-5 text-teal-400" />
                {editingDestinationId ? 'Edit Destination' : 'Add Tour Destination'}
              </h3>
              <button
                onClick={() => setIsDestinationModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">
                    Destination / Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={destinationForm.name}
                    onChange={(e) => setDestinationForm({ ...destinationForm, name: e.target.value })}
                    placeholder="e.g. Kashmir Paradise Tour"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-teal-500/30 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">
                    Starting City
                  </label>
                  <input
                    type="text"
                    value={destinationForm.startingCity}
                    onChange={(e) => setDestinationForm({ ...destinationForm, startingCity: e.target.value })}
                    placeholder="e.g. Jalna / Aurangabad"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-teal-500/30 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">
                  Destination City / Sightseeing Locations *
                </label>
                <input
                  type="text"
                  required
                  value={destinationForm.destinationCity}
                  onChange={(e) => setDestinationForm({ ...destinationForm, destinationCity: e.target.value })}
                  placeholder="e.g. Srinagar, Gulmarg, Pahalgam"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-teal-500/30 text-white text-xs"
                />
              </div>

              <MediaUploader
                label="Destination Cover Image *"
                folder="tours"
                mediaType="image"
                value={destinationForm.coverImage}
                onChange={(url) => setDestinationForm({ ...destinationForm, coverImage: url })}
                hint="Scenic photo of the destination for the public tour card."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={destinationForm.duration}
                    onChange={(e) => setDestinationForm({ ...destinationForm, duration: e.target.value })}
                    placeholder="e.g. 5 Days / 4 Nights"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-teal-500/30 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-300 mb-1">
                    Approximate Price (e.g. ₹14,999 per person)
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      disabled={destinationForm.isPriceOnRequest}
                      value={destinationForm.price}
                      onChange={(e) => setDestinationForm({ ...destinationForm, price: e.target.value })}
                      placeholder="₹14,999 per person"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-teal-500/30 text-white text-xs disabled:opacity-50"
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={destinationForm.isPriceOnRequest}
                        onChange={(e) => setDestinationForm({ ...destinationForm, isPriceOnRequest: e.target.checked })}
                        className="w-3.5 h-3.5 rounded text-teal-500"
                      />
                      <span className="text-[11px] text-teal-300">Set as "Price on Request"</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">
                  Highlights (comma-separated)
                </label>
                <input
                  type="text"
                  value={destinationForm.highlightsText}
                  onChange={(e) => setDestinationForm({ ...destinationForm, highlightsText: e.target.value })}
                  placeholder="e.g. Houseboat Stay, Gondola Ride, Valley Tour"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-teal-500/30 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={destinationForm.description}
                  onChange={(e) => setDestinationForm({ ...destinationForm, description: e.target.value })}
                  placeholder="Overview of the journey, cab services, and inclusions..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-teal-500/30 text-white text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={destinationForm.isFeatured}
                    onChange={(e) => setDestinationForm({ ...destinationForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-500"
                  />
                  <span className="text-xs text-white">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={destinationForm.isPublished}
                    onChange={(e) => setDestinationForm({ ...destinationForm, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-500"
                  />
                  <span className="text-xs text-white">Publish Publicly</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-teal-500/20">
                <button
                  type="button"
                  onClick={() => setIsDestinationModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingDestination}
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(20,184,166,0.4)] disabled:opacity-50"
                >
                  {isSavingDestination ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: CUSTOMER INQUIRY FULL DETAILS */}
      {/* ============================================================= */}
      {isInquiryModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-panel w-full max-w-xl rounded-3xl border border-cyan-500/30 p-6 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {selectedInquiry.serviceType}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Inquiry: {selectedInquiry.name}
                </h3>
              </div>
              <button
                onClick={() => setIsInquiryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20">
                <div>
                  <span className="text-slate-400">Mobile Number:</span>
                  <div className="text-white font-mono font-bold mt-0.5">{selectedInquiry.phone}</div>
                </div>
                <div>
                  <span className="text-slate-400">Email Address:</span>
                  <div className="text-white font-mono font-bold mt-0.5">{selectedInquiry.email || 'None provided'}</div>
                </div>
                <div>
                  <span className="text-slate-400">Submission Date:</span>
                  <div className="text-white font-mono mt-0.5">
                    {selectedInquiry.createdAt ? new Date(selectedInquiry.createdAt).toLocaleString() : 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Current Status:</span>
                  <div className="font-bold text-cyan-300 mt-0.5">{selectedInquiry.status || 'New'}</div>
                </div>
              </div>

              {/* Service Specific Details */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/10">
                <div className="font-bold text-cyan-300 uppercase tracking-wider text-[11px]">
                  Submitted Service Details
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  {selectedInquiry.businessName && <div><strong>Business Name:</strong> {selectedInquiry.businessName}</div>}
                  {selectedInquiry.websiteType && <div><strong>Website Type:</strong> {selectedInquiry.websiteType}</div>}
                  {selectedInquiry.requiredFeatures && <div><strong>Features:</strong> {selectedInquiry.requiredFeatures}</div>}
                  {selectedInquiry.deadline && <div><strong>Deadline:</strong> {selectedInquiry.deadline}</div>}
                  {selectedInquiry.location && <div><strong>Location:</strong> {selectedInquiry.location}</div>}
                  {selectedInquiry.rooms && <div><strong>Room Count:</strong> {selectedInquiry.rooms}</div>}
                  {selectedInquiry.fittingsCount && <div><strong>Fittings:</strong> {selectedInquiry.fittingsCount}</div>}
                  {selectedInquiry.fromCity && <div><strong>Starting City:</strong> {selectedInquiry.fromCity}</div>}
                  {selectedInquiry.toDestination && <div><strong>Destination:</strong> {selectedInquiry.toDestination}</div>}
                  {selectedInquiry.travelDate && <div><strong>Travel Date:</strong> {selectedInquiry.travelDate}</div>}
                  {selectedInquiry.returnDate && <div><strong>Return Date:</strong> {selectedInquiry.returnDate}</div>}
                  {selectedInquiry.travelers && <div><strong>Travelers:</strong> {selectedInquiry.travelers}</div>}
                  {selectedInquiry.tripType && <div><strong>Vehicle/Trip Type:</strong> {selectedInquiry.tripType}</div>}
                  {selectedInquiry.budget && <div><strong>Budget:</strong> {selectedInquiry.budget}</div>}
                </div>

                {selectedInquiry.details && (
                  <div className="mt-3 pt-3 border-t border-cyan-500/10">
                    <span className="text-slate-400 block mb-1">Customer Message:</span>
                    <p className="text-white p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20 italic">
                      "{selectedInquiry.details}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Contact Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-cyan-500/20">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-400" /> Call Customer
                </a>

                <a
                  href={formatWhatsAppUrl(selectedInquiry.phone, selectedInquiry.name, selectedInquiry.serviceType)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> WhatsApp Customer
                </a>
              </div>

              <button
                onClick={() => setIsInquiryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
