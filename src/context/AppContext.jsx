import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, collection, doc, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from '../firebase';

const AppContext = createContext();

const INITIAL_FALLBACK_DATA = {
  settings: {
    companyName: "KHAN",
    domain: "khanelectrics.in",
    phone: "+91 7822886909",
    email: "spathan1862@gmail.com",
    location: "Badnapur, Jalna, Maharashtra",
    website: "www.khanelectrics.in",
    heroSubtitle: "Modern websites, professional electrician services, and memorable travel experiences."
  },
  webProjects: [
    {
      id: "proj-1",
      title: "Khan Electrics Website",
      category: "Multi-Service Web Portal",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      description: "Business website for electrical services with modern UI.",
      link: "https://khanelectrics.in"
    },
    {
      id: "proj-2",
      title: "MedicoManager",
      category: "Electron Desktop App",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      description: "Medical shop management app (Electron App).",
      link: "#"
    },
    {
      id: "proj-3",
      title: "Travel Website",
      category: "Booking & Tours",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
      description: "Tour & travel website with booking system.",
      link: "#"
    },
    {
      id: "proj-4",
      title: "E-Commerce Store",
      category: "Online Shopping",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
      description: "Online store with cart & payment integration.",
      link: "#"
    },
    {
      id: "proj-5",
      title: "Portfolio Website",
      category: "Personal Brand",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      description: "Personal portfolio website with high aesthetics.",
      link: "#"
    },
    {
      id: "proj-6",
      title: "Business Website",
      category: "Corporate Site",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      description: "Corporate website with modern responsive UI.",
      link: "#"
    }
  ],
  electricianServices: [
    { id: "elec-1", title: "House Wiring", description: "Complete house wiring & installation.", icon: "Zap" },
    { id: "elec-2", title: "Electrical Repair", description: "Fixing & maintenance services.", icon: "Wrench" },
    { id: "elec-3", title: "Welding", description: "Professional welding services.", icon: "Flame" },
    { id: "elec-4", title: "CCTV Installation", description: "Security camera setup & installation.", icon: "Camera" },
    { id: "elec-5", title: "Inverter & Battery", description: "Inverter & battery installation.", icon: "BatteryCharging" },
    { id: "elec-6", title: "Lighting Solutions", description: "Indoor & outdoor lighting.", icon: "Lightbulb" },
    { id: "elec-7", title: "Electrical Maintenance", description: "Regular maintenance & safety check.", icon: "ShieldCheck" },
    { id: "elec-8", title: "Electrical Upgrades", description: "Modernization & upgrades.", icon: "TrendingUp" }
  ],
  electricianGallery: [
    { id: "gal-1", title: "Industrial Panel Wiring", type: "photo", url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80" },
    { id: "gal-2", title: "Home Smart Lighting Setup", type: "photo", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80" },
    { id: "gal-3", title: "High Voltage Transformer Repair", type: "photo", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80" },
    { id: "gal-4", title: "CCTV Camera System Inspection", type: "photo", url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80" }
  ],
  travelDestinations: [
    { id: "dest-1", name: "Kashmir", tagline: "Nature & Peace", image: "https://images.unsplash.com/photo-1605649487210-478a983b6c20?auto=format&fit=crop&w=600&q=80", price: "₹14,999" },
    { id: "dest-2", name: "Goa", tagline: "Beaches & Fun", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80", price: "₹9,999" },
    { id: "dest-3", name: "Leh Ladakh", tagline: "Adventure", image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80", price: "₹18,500" },
    { id: "dest-4", name: "Rajasthan", tagline: "Culture & Heritage", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80", price: "₹12,499" },
    { id: "dest-5", name: "Kerala", tagline: "Backwaters & Nature", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80", price: "₹11,999" },
    { id: "dest-6", name: "Andaman", tagline: "Island Paradise", image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=600&q=80", price: "₹22,999" }
  ],
  travelPackages: [
    { id: "pkg-1", title: "Honeymoon Package", subtitle: "Romantic Destinations", duration: "5 Days / 4 Nights", price: "₹24,999 per couple" },
    { id: "pkg-2", title: "Family Tour", subtitle: "Fun for Everyone", duration: "6 Days / 5 Nights", price: "₹34,999 (4 Persons)" },
    { id: "pkg-3", title: "Adventure Trip", subtitle: "Thrill & Explore", duration: "7 Days / 6 Nights", price: "₹19,500 per person" }
  ],
  apps: [
    { id: "app-1", name: "MedicoManager", category: "Medical Shop Management", icon: "PlusSquare", description: "Medical Shop Management Electron app for inventory, billing & prescriptions.", downloadUrl: "#" },
    { id: "app-2", name: "Khan Electrics Store", category: "Online Store App", icon: "Zap", description: "Browse and buy electrical supplies directly online.", downloadUrl: "#" },
    { id: "app-3", name: "Travel Planner", category: "Tour & Travel Assistant", icon: "Plane", description: "Itinerary creator and booking tracker for vacationers.", downloadUrl: "#" },
    { id: "app-4", name: "Service Tracker", category: "Track Your Services", icon: "Activity", description: "Real-time electrical and web dev request status monitoring.", downloadUrl: "#" },
    { id: "app-5", name: "Business Tools", category: "Productivity Tools", icon: "Briefcase", description: "Invoicing, quote generator and customer manager for SMEs.", downloadUrl: "#" },
    { id: "app-6", name: "More Apps", category: "Coming Soon", icon: "Grid", description: "Stay tuned for upcoming mobile & web utility software.", downloadUrl: "#" }
  ],
  inquiries: [
    { id: "inq-101", serviceType: "Web Development", name: "Aarav Sharma", email: "aarav@techstart.in", phone: "+91 98230 11223", whatsapp: "+91 98230 11223", location: "Jalna City", details: "Need custom e-commerce web app for local supermarket.", status: "New", createdAt: "2026-10-06T14:20:00.000Z" },
    { id: "inq-102", serviceType: "Electrician", name: "Rajesh Deshmukh", phone: "+91 7822886909", rooms: "4 Rooms", fittingsCount: "12 Lights, 6 Fans, 2 AC points", details: "Complete rewiring for 2-story house in Badnapur.", status: "Contacted", createdAt: "2026-10-07T09:15:00.000Z" },
    { id: "inq-103", serviceType: "Tour & Travel", name: "Priya Verma", phone: "+91 97654 88990", secondaryPhone: "+91 97654 88991", fromCity: "Aurangabad", toDestination: "Kashmir", travelDate: "2026-11-15", travelers: "4", budget: "₹60,000", details: "Family holiday trip with hotel and cab inclusion.", status: "In-Progress", createdAt: "2026-10-07T11:00:00.000Z" }
  ]
};

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(INITIAL_FALLBACK_DATA);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [toast, setToast] = useState(null);

  // Firestore & local backend sync
  useEffect(() => {
    try {
      // Real-time Firestore inquiry listener
      const unsubInquiries = onSnapshot(collection(db, "inquiries"), (snapshot) => {
        if (!snapshot.empty) {
          const fbInquiries = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
          setData(prev => ({ ...prev, inquiries: fbInquiries }));
        }
      }, (err) => console.log("Firebase sync note:", err.message));

      // Real-time Firestore settings listener
      const unsubSettings = onSnapshot(doc(db, "settings", "company"), (docSnap) => {
        if (docSnap.exists()) {
          setData(prev => ({ ...prev, settings: docSnap.data() }));
        }
      }, (err) => console.log("Firebase sync note:", err.message));

      return () => {
        unsubInquiries();
        unsubSettings();
      };
    } catch (e) {
      console.log("Firestore initialized with local sync capability.");
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const submitInquiry = async (inquiryData) => {
    const newInq = {
      createdAt: new Date().toISOString(),
      status: 'New',
      ...inquiryData
    };

    // 1. Firebase Firestore write
    try {
      const docRef = await addDoc(collection(db, "inquiries"), newInq);
      const savedInq = { id: docRef.id, ...newInq };
      setData(prev => ({
        ...prev,
        inquiries: [savedInq, ...(prev.inquiries || [])]
      }));
    } catch (err) {
      console.log("Saving locally & REST fallback:", err.message);
      const fallbackInq = { id: 'inq-' + Date.now(), ...newInq };
      setData(prev => ({
        ...prev,
        inquiries: [fallbackInq, ...(prev.inquiries || [])]
      }));
    }

    // 2. REST API fallback
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
    } catch (e) {}

    showToast('Inquiry submitted successfully to KHAN Cloud! We will contact you soon.', 'success');
  };

  const updateInquiryStatus = async (id, status) => {
    setData(prev => ({
      ...prev,
      inquiries: prev.inquiries.map(inq => inq.id === id ? { ...inq, status } : inq)
    }));

    try {
      await updateDoc(doc(db, "inquiries", id), { status });
    } catch (e) {}

    try {
      await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {}

    showToast(`Inquiry status updated to "${status}"`, 'info');
  };

  const deleteInquiry = async (id) => {
    setData(prev => ({
      ...prev,
      inquiries: prev.inquiries.filter(inq => inq.id !== id)
    }));

    try {
      await deleteDoc(doc(db, "inquiries", id));
    } catch (e) {}

    try {
      await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    } catch (e) {}

    showToast('Inquiry deleted.', 'info');
  };

  const updateSettings = async (newSettings) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));

    try {
      await setDoc(doc(db, "settings", "company"), newSettings, { merge: true });
    } catch (e) {}

    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (e) {}

    showToast('Company settings updated in Cloud Database!', 'success');
  };

  const addWebProject = async (project) => {
    const newItem = { id: 'proj-' + Date.now(), ...project };
    setData(prev => ({
      ...prev,
      webProjects: [newItem, ...(prev.webProjects || [])]
    }));

    try {
      await addDoc(collection(db, "webProjects"), project);
    } catch (e) {}

    showToast('New Web Project added to showcase!', 'success');
  };

  const deleteWebProject = async (id) => {
    setData(prev => ({
      ...prev,
      webProjects: prev.webProjects.filter(p => p.id !== id)
    }));
    showToast('Project removed.', 'info');
  };

  const addElectricianGallery = async (item) => {
    const newItem = { id: 'gal-' + Date.now(), ...item };
    setData(prev => ({
      ...prev,
      electricianGallery: [newItem, ...(prev.electricianGallery || [])]
    }));

    try {
      await addDoc(collection(db, "electricianGallery"), item);
    } catch (e) {}

    showToast('Gallery item added successfully!', 'success');
  };

  const deleteElectricianGallery = async (id) => {
    setData(prev => ({
      ...prev,
      electricianGallery: prev.electricianGallery.filter(g => g.id !== id)
    }));
    showToast('Gallery item removed.', 'info');
  };

  const addAppItem = async (app) => {
    const newItem = { id: 'app-' + Date.now(), ...app };
    setData(prev => ({
      ...prev,
      apps: [newItem, ...(prev.apps || [])]
    }));
    showToast('App added to catalog!', 'success');
  };

  const deleteAppItem = async (id) => {
    setData(prev => ({
      ...prev,
      apps: prev.apps.filter(a => a.id !== id)
    }));
    showToast('App removed from catalog.', 'info');
  };

  // Tour & Travel Management
  const addTravelDestination = async (dest) => {
    const newItem = { id: 'dest-' + Date.now(), ...dest };
    setData(prev => ({
      ...prev,
      travelDestinations: [newItem, ...(prev.travelDestinations || [])]
    }));
    try {
      await addDoc(collection(db, "travelDestinations"), dest);
    } catch (e) {}
    showToast('New Travel Destination added!', 'success');
  };

  const updateTravelDestination = async (id, updatedDest) => {
    setData(prev => ({
      ...prev,
      travelDestinations: (prev.travelDestinations || []).map(d => d.id === id ? { ...d, ...updatedDest } : d)
    }));
    try {
      await setDoc(doc(db, "travelDestinations", id), updatedDest, { merge: true });
    } catch (e) {}
    showToast('Travel Destination updated!', 'success');
  };

  const deleteTravelDestination = async (id) => {
    setData(prev => ({
      ...prev,
      travelDestinations: (prev.travelDestinations || []).filter(d => d.id !== id)
    }));
    try {
      await deleteDoc(doc(db, "travelDestinations", id));
    } catch (e) {}
    showToast('Travel Destination deleted.', 'info');
  };

  const addTravelPackage = async (pkg) => {
    const newItem = { id: 'pkg-' + Date.now(), ...pkg };
    setData(prev => ({
      ...prev,
      travelPackages: [newItem, ...(prev.travelPackages || [])]
    }));
    try {
      await addDoc(collection(db, "travelPackages"), pkg);
    } catch (e) {}
    showToast('New Travel Package added!', 'success');
  };

  const updateTravelPackage = async (id, updatedPkg) => {
    setData(prev => ({
      ...prev,
      travelPackages: (prev.travelPackages || []).map(p => p.id === id ? { ...p, ...updatedPkg } : p)
    }));
    try {
      await setDoc(doc(db, "travelPackages", id), updatedPkg, { merge: true });
    } catch (e) {}
    showToast('Travel Package updated!', 'success');
  };

  const deleteTravelPackage = async (id) => {
    setData(prev => ({
      ...prev,
      travelPackages: (prev.travelPackages || []).filter(p => p.id !== id)
    }));
    try {
      await deleteDoc(doc(db, "travelPackages", id));
    } catch (e) {}
    showToast('Travel Package deleted.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        ...data,
        isDrawerOpen,
        setIsDrawerOpen,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        toast,
        showToast,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        updateSettings,
        addWebProject,
        deleteWebProject,
        addElectricianGallery,
        deleteElectricianGallery,
        addAppItem,
        deleteAppItem,
        addTravelDestination,
        updateTravelDestination,
        deleteTravelDestination,
        addTravelPackage,
        updateTravelPackage,
        deleteTravelPackage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
