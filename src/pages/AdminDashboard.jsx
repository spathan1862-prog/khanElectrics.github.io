import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, LogOut, CheckCircle2, Trash2, Plus, Edit, Download, Filter, Save, Layers, Phone, Mail, MapPin, Globe, Layout, Grid, Users } from 'lucide-react';

const AdminDashboard = () => {
  const {
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    showToast,
    settings,
    updateSettings,
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    webProjects,
    addWebProject,
    deleteWebProject,
    electricianGallery,
    addElectricianGallery,
    deleteElectricianGallery,
    travelDestinations,
    addAppItem,
    deleteAppItem,
    apps
  } = useApp();

  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState('leads'); // 'leads', 'content', 'apps', 'company'
  const [filterService, setFilterService] = useState('All');

  // Form states for adding items
  const [newProject, setNewProject] = useState({ title: '', category: '', image: '', description: '', link: '' });
  const [newGallery, setNewGallery] = useState({ title: '', type: 'photo', url: '' });
  const [newApp, setNewApp] = useState({ name: '', category: '', icon: 'Grid', description: '', downloadUrl: '' });
  const [companyForm, setCompanyForm] = useState(settings);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'admin') {
      setIsAdminLoggedIn(true);
      showToast('Welcome to Khan Admin Dashboard CMS!', 'success');
      setCompanyForm(settings);
    } else {
      showToast('Invalid passcode. Default passcode is: admin123', 'warning');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    showToast('Logged out of Admin Panel', 'info');
  };

  const handleAddProjectSubmit = (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.image) return;
    addWebProject(newProject);
    setNewProject({ title: '', category: '', image: '', description: '', link: '' });
  };

  const handleAddGallerySubmit = (e) => {
    e.preventDefault();
    if (!newGallery.title || !newGallery.url) return;
    addElectricianGallery(newGallery);
    setNewGallery({ title: '', type: 'photo', url: '' });
  };

  const handleAddAppSubmit = (e) => {
    e.preventDefault();
    if (!newApp.name) return;
    addAppItem(newApp);
    setNewApp({ name: '', category: '', icon: 'Grid', description: '', downloadUrl: '' });
  };

  const handleSaveCompanySettings = (e) => {
    e.preventDefault();
    updateSettings(companyForm);
  };

  const exportInquiriesCSV = () => {
    if (!inquiries || inquiries.length === 0) {
      showToast('No inquiries to export.', 'warning');
      return;
    }
    const headers = ['ID', 'ServiceType', 'Name', 'Phone', 'Email', 'Status', 'Date', 'Details'];
    const rows = inquiries.map(i => [
      i.id,
      `"${i.serviceType || ''}"`,
      `"${i.name || ''}"`,
      `"${i.phone || ''}"`,
      `"${i.email || ''}"`,
      `"${i.status || ''}"`,
      `"${i.createdAt || ''}"`,
      `"${(i.details || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Khan_Inquiries_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Inquiries exported to CSV file successfully!', 'success');
  };

  // If not logged in, show passcode screen
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_40px_rgba(0,210,255,0.2)] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-display font-extrabold text-2xl text-white">
              ADMIN CMS AUTHENTICATION
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Enter admin passcode to access the website management dashboard.
            </p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
              Default Passcode: admin123
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-medium text-cyan-300 mb-1">
                Admin Security Passcode
              </label>
              <input
                type="password"
                required
                placeholder="Enter admin passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(0,210,255,0.7)] transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredInquiries = inquiries?.filter(i => {
    if (filterService === 'All') return true;
    return i.serviceType === filterService;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* HEADER & LOGOUT */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-cyan-500/30">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-metallic flex items-center gap-2">
            <Layout className="w-7 h-7 text-cyan-400" />
            ADMIN CMS CONTROL PANEL
          </h1>
          <p className="text-xs text-cyan-200 mt-1">
            Dynamic Site Management System for {settings.domain || 'khanelectrics.in'}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 hover:bg-red-900/80 font-semibold text-xs transition-all flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          Logout Admin
        </button>
      </div>

      {/* DASHBOARD NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 border-b border-cyan-500/20 pb-2">
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'leads'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.4)]'
              : 'glass-panel text-slate-300 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Booking & Leads ({inquiries?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'content'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.4)]'
              : 'glass-panel text-slate-300 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          Sub-Pages Media & Showcase
        </button>

        <button
          onClick={() => setActiveTab('apps')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'apps'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.4)]'
              : 'glass-panel text-slate-300 hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          Apps Management ({apps?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('company')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'company'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.4)]'
              : 'glass-panel text-slate-300 hover:text-white'
          }`}
        >
          <Phone className="w-4 h-4" />
          Company Details
        </button>
      </div>

      {/* TAB 1: BOOKINGS & LEADS MANAGER */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-300 font-medium">Filter Service:</span>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-white text-xs focus:outline-none"
              >
                <option value="All">All Services</option>
                <option value="Web Development">Web Development</option>
                <option value="Electrician">Electrician</option>
                <option value="Tour & Travel">Tour & Travel</option>
                <option value="General Contact">General Contact</option>
              </select>
            </div>

            <button
              onClick={exportInquiriesCSV}
              className="px-4 py-2 rounded-xl bg-teal-950/60 border border-teal-500/40 text-teal-300 hover:bg-teal-900/80 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Leads to CSV
            </button>
          </div>

          {/* LEADS LIST */}
          <div className="space-y-4">
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="glass-panel p-5 rounded-2xl border border-cyan-500/20 hover:border-cyan-400 transition-all flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        inq.serviceType === 'Web Development'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                          : inq.serviceType === 'Electrician'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          : 'bg-teal-950 text-teal-300 border border-teal-500/30'
                      }`}>
                        {inq.serviceType}
                      </span>

                      <span className="text-[11px] text-slate-400 font-mono">
                        ID: {inq.id} • {new Date(inq.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white">
                      {inq.name}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
                      {inq.phone && <div><strong className="text-cyan-400">Phone:</strong> {inq.phone}</div>}
                      {inq.email && <div><strong className="text-cyan-400">Email:</strong> {inq.email}</div>}
                      {inq.location && <div><strong className="text-cyan-400">Location:</strong> {inq.location}</div>}
                      {inq.rooms && <div><strong className="text-amber-400">Rooms:</strong> {inq.rooms}</div>}
                      {inq.fittingsCount && <div><strong className="text-amber-400">Fittings:</strong> {inq.fittingsCount}</div>}
                      {inq.toDestination && <div><strong className="text-teal-400">Destination:</strong> {inq.toDestination}</div>}
                      {inq.travelers && <div><strong className="text-teal-400">Travelers:</strong> {inq.travelers}</div>}
                    </div>

                    {inq.details && (
                      <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-cyan-500/10 italic">
                        "{inq.details}"
                      </p>
                    )}
                  </div>

                  {/* Actions & Status */}
                  <div className="flex md:flex-col items-center justify-between md:justify-center gap-3 border-t md:border-t-0 md:border-l border-cyan-500/10 pt-3 md:pt-0 md:pl-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">Status:</span>
                      <select
                        value={inq.status || 'New'}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/30 text-xs text-white focus:outline-none"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <button
                      onClick={() => deleteInquiry(inq.id)}
                      className="p-2 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900 border border-red-500/20 text-xs transition-all"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-panel p-8 text-center rounded-2xl text-slate-400 text-xs">
                No inquiries found matching selected filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SUB-PAGES MEDIA & CONTENT MANAGER */}
      {activeTab === 'content' && (
        <div className="space-y-10">
          
          {/* SECTION A: WEB DEV PROJECTS MANAGER */}
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-6">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              Add Web Development Project
            </h2>

            <form onSubmit={handleAddProjectSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-cyan-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MedicoManager App Site"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-cyan-300 mb-1">Category / Tech</label>
                <input
                  type="text"
                  placeholder="e.g. Electron Desktop App / React"
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-cyan-300 mb-1">Preview Thumbnail Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newProject.image}
                  onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-cyan-300 mb-1">Project / External Link</label>
                <input
                  type="text"
                  placeholder="#"
                  value={newProject.link}
                  onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-cyan-300 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Short project description..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Web Project
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-cyan-500/20">
              <h3 className="font-bold text-sm text-white mb-3">Existing Web Projects</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {webProjects.map(p => (
                  <div key={p.id} className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{p.title}</p>
                      <p className="text-[10px] text-cyan-400">{p.category}</p>
                    </div>
                    <button
                      onClick={() => deleteWebProject(p.id)}
                      className="p-1.5 rounded bg-red-950 text-red-400 hover:bg-red-900 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION B: ELECTRICIAN GALLERY MANAGER */}
          <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-6">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              Add Electrician Gallery Media
            </h2>

            <form onSubmit={handleAddGallerySubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-amber-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Home Panel Setup"
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-amber-950/50 border border-amber-500/30 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-300 mb-1">Media Type</label>
                <select
                  value={newGallery.type}
                  onChange={(e) => setNewGallery({ ...newGallery, type: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-amber-950/50 border border-amber-500/30 text-white text-xs"
                >
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-300 mb-1">Image / Video URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newGallery.url}
                  onChange={(e) => setNewGallery({ ...newGallery, url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-amber-950/50 border border-amber-500/30 text-white text-xs"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Gallery Item
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-amber-500/20">
              <h3 className="font-bold text-sm text-white mb-3">Existing Gallery Media</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {electricianGallery.map(g => (
                  <div key={g.id} className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{g.title}</p>
                      <p className="text-[10px] text-amber-400 uppercase">{g.type}</p>
                    </div>
                    <button
                      onClick={() => deleteElectricianGallery(g.id)}
                      className="p-1.5 rounded bg-red-950 text-red-400 hover:bg-red-900 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: APPS MANAGEMENT */}
      {activeTab === 'apps' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-6">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              Add App to "Our Apps" Catalog & Drawer Menu
            </h2>

            <form onSubmit={handleAddAppSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-cyan-300 mb-1">App Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MedicoManager"
                  value={newApp.name}
                  onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-cyan-300 mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Medical Shop Management"
                  value={newApp.category}
                  onChange={(e) => setNewApp({ ...newApp, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-cyan-300 mb-1">Download / External Link</label>
                <input
                  type="text"
                  placeholder="#"
                  value={newApp.downloadUrl}
                  onChange={(e) => setNewApp({ ...newApp, downloadUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-cyan-300 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Brief description..."
                  value={newApp.description}
                  onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add App
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {apps.map(a => (
              <div key={a.id} className="glass-panel p-4 rounded-2xl border border-cyan-500/20 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{a.name}</h4>
                  <p className="text-[10px] text-cyan-400">{a.category}</p>
                </div>
                <button
                  onClick={() => deleteAppItem(a.id)}
                  className="p-1.5 rounded bg-red-950 text-red-400 hover:bg-red-900 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMPANY DETAILS MANAGER */}
      {activeTab === 'company' && (
        <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 max-w-2xl space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-white">
              Company Details Manager
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Changes updated here will reflect dynamically across the website footer, navbar, contact page, and hero subtitle.
            </p>
          </div>

          <form onSubmit={handleSaveCompanySettings} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-cyan-300 mb-1">Company / Brand Name</label>
              <input
                type="text"
                value={companyForm.companyName || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-cyan-300 mb-1">Domain Name</label>
              <input
                type="text"
                value={companyForm.domain || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, domain: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-cyan-300 mb-1">Phone Number (Hotline)</label>
              <input
                type="text"
                value={companyForm.phone || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-cyan-300 mb-1">Email Address</label>
              <input
                type="email"
                value={companyForm.email || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-cyan-300 mb-1">Location Address</label>
              <input
                type="text"
                value={companyForm.location || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-cyan-300 mb-1">Hero Tagline Subtitle</label>
              <textarea
                rows="2"
                value={companyForm.heroSubtitle || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, heroSubtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-white text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(0,210,255,0.7)] transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Company Details
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
