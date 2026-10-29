import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, collection, doc, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from '../firebase';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AppContext = createContext();

const OWNER_EMAIL = 'spathan1862@gmail.com';

// Helper to validate if a string is a valid UUID
const isUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const INITIAL_FALLBACK_DATA = {
  settings: {
    companyName: "KHAN",
    domain: "khaneletrics.in",
    phone: "+91 7822886909",
    whatsapp: "+91 7822886909",
    email: "spathan1862@gmail.com",
    location: "Badnapur, Jalna, Maharashtra",
    serviceAreas: "Badnapur, Jalna, Aurangabad, Maharashtra",
    website: "www.khaneletrics.in",
    heroSubtitle: "Modern websites, professional electrician services, and memorable travel experiences.",
    githubUrl: "https://github.com/spathan1862-prog",
    linkedinUrl: "",
    instagramUrl: "",
    appearance: {
      hero_banner_image: "",
      featured_projects_visible: true,
      featured_destinations_visible: true,
      web_dev_card: {
        title: "Web Development",
        short_description: "Custom modern business websites, portals, and desktop applications.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        icon: "Code2",
        is_visible: true,
        sort_order: 1
      },
      electrician_card: {
        title: "Khan Electrician Service",
        short_description: "Residential & industrial wiring, panel boards, CCTV security, and repairs.",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
        icon: "Zap",
        is_visible: true,
        sort_order: 2
      },
      tour_travel_card: {
        title: "Tour and Travel",
        short_description: "Custom domestic vacation packages, pilgrimage yatras, and outstation cabs.",
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
        icon: "Plane",
        is_visible: true,
        sort_order: 3
      }
    }
  },
  servicePages: {
    'web-development': {
      id: 'web-development',
      pageName: 'Web Development',
      title: 'WEB DEVELOPMENT',
      badge: 'CYBER & TECH NEON ENVIRONMENT',
      subtitle: 'Modern websites & web applications for your business.',
      heroDescription: 'We build high-performance, responsive web portals, e-commerce stores, desktop applications, and custom software tailored to elevate your business presence in Badnapur, Jalna, Aurangabad, and beyond.',
      ctaText: 'Contact Us / Request Quote',
      ctaLink: '#inquiry-form',
      heroImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      sections: [
        { title: 'Custom Business Websites', description: 'High converting, mobile-first websites designed specifically for local businesses, shops, and institutions.', icon: 'Layout' },
        { title: 'E-Commerce & Online Stores', description: 'Product catalogs, secure payment gateways, cart flows, and real-time order tracking.', icon: 'ShoppingBag' },
        { title: 'Desktop & Electron Software', description: 'Inventory management, POS, and offline-capable desktop systems like MedicoManager.', icon: 'Monitor' },
        { title: 'SEO & Performance Speed', description: 'Fast load times, schema markup, and on-page optimization for Google search visibility in Jalna.', icon: 'Zap' }
      ],
      faqs: [
        { question: 'How long does it take to develop a business website?', answer: 'Standard business websites are typically delivered within 5 to 10 days, depending on custom features and revisions.' },
        { question: 'Do you provide hosting and custom domain support?', answer: 'Yes, we handle complete setup including domain linking (like khaneletrics.in), fast cloud hosting, SSL certificates, and Google indexing.' },
        { question: 'Can I edit my website content after launch?', answer: 'Yes! Through our integrated Admin CMS, you can update text, images, and service items directly without coding.' }
      ],
      seoTitle: 'Web Development in Badnapur & Jalna | Modern Websites & Software | KHAN',
      seoDescription: 'Professional web development and website design in Badnapur, Jalna, and Aurangabad, Maharashtra. Custom business portals, e-commerce stores, and software.',
      seoKeywords: 'web development in Badnapur, website development in Jalna Maharashtra, web developer in Jalna, website design Aurangabad, business website development',
      isPublished: true
    },
    'electrician': {
      id: 'electrician',
      pageName: 'Khan Electrician Service',
      title: 'KHAN ELECTRICIAN SERVICE',
      badge: 'INDUSTRIAL AMBER / ELECTRIC GLOW ENVIRONMENT',
      subtitle: 'Trusted, certified electrician & multi-service repairs.',
      heroDescription: 'Professional residential, commercial, and industrial electrical solutions across Badnapur, Jalna, and Aurangabad. Expert house wiring, panel installation, motor rewinding, CCTV security, and emergency repairs.',
      ctaText: 'Call Electrician / Request Service',
      ctaLink: '#inquiry-form',
      heroImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      sections: [
        { title: 'Complete House Wiring', description: 'Concealed and surface wiring for new constructions, renovation rewiring, and safety circuit breakers.', icon: 'Zap' },
        { title: 'Industrial Panel Wiring', description: 'Distribution panels, 3-phase machinery connections, switchgear assembly, and load balancing.', icon: 'Wrench' },
        { title: 'CCTV & Security Setup', description: 'High-definition camera surveillance, DVR/NVR configuration, and remote mobile viewing.', icon: 'Camera' },
        { title: 'Inverter & Battery Wiring', description: 'Home UPS installation, backup battery setup, and solar-compatible power wiring.', icon: 'BatteryCharging' }
      ],
      faqs: [
        { question: 'What areas do you serve for electrical work?', answer: 'We serve Badnapur, Jalna City, Ambad, Partur, Aurangabad (Chhatrapati Sambhaji Nagar), and nearby rural districts.' },
        { question: 'Do you provide emergency electrical repairs?', answer: 'Yes, we handle urgent short-circuit, tripping, and power outage issues. Contact us directly at +91 7822886909 for quick dispatch.' },
        { question: 'Do you do industrial 3-phase machinery wiring?', answer: 'Yes, we have extensive experience with industrial control panels, star-delta starters, and factory power distribution.' }
      ],
      seoTitle: 'Electrician in Badnapur & Jalna, Maharashtra | House Wiring & Repairs | KHAN',
      seoDescription: 'Certified electrician services in Badnapur, Jalna, and Aurangabad. Expert house wiring, industrial panels, CCTV installation, and electrical repairs.',
      seoKeywords: 'electrician in Badnapur, electrician in Jalna Maharashtra, electrician services in Aurangabad, house wiring services in Jalna, electrical repair',
      isPublished: true
    },
    'tour-travel': {
      id: 'tour-travel',
      pageName: 'Tour and Travel',
      title: 'TOUR & TRAVEL',
      badge: 'SCENIC / OUTDOOR EXPLORATION GLOW ENVIRONMENT',
      subtitle: 'Explore new places, create better memories.',
      heroDescription: 'Customized domestic travel, pilgrimage tours, airport transfers, and family vacation packages from Jalna, Aurangabad, and Maharashtra to major destinations across India.',
      ctaText: 'Plan Your Trip / Request Quote',
      ctaLink: '#inquiry-form',
      heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
      sections: [
        { title: 'Jalna to Mumbai & Pune Cabs', description: 'Comfortable one-way and round-trip car rentals and bus bookings with verified drivers.', icon: 'Compass' },
        { title: 'Holiday Vacation Packages', description: 'Handcrafted itineraries to Kashmir, Goa, Kerala, Rajasthan, and Himachal Pradesh with hotel bookings.', icon: 'Plane' },
        { title: 'Pilgrimage Yatra Tours', description: 'Shirdi, Jyotirlinga, Tirupati, and Chardham packages designed for families and elderly travelers.', icon: 'MapPin' },
        { title: 'Custom Group & Family Bookings', description: 'Tailored group packages, transparent pricing with no hidden charges, and 24/7 travel support.', icon: 'Users' }
      ],
      faqs: [
        { question: 'Can I book a one-way trip from Jalna to Mumbai or Pune?', answer: 'Yes, we offer clean, sanitized cabs with professional drivers for one-way drops and return journeys.' },
        { question: 'Do you include hotel stays in your vacation packages?', answer: 'Yes, all our holiday packages can be customized to include 3-star/4-star verified hotels, daily breakfast, and local sightseeing cabs.' },
        { question: 'How can I get an instant quote for my trip?', answer: 'Submit your dates, destination, and traveler count via our inquiry form or click our WhatsApp button for a quick estimate.' }
      ],
      seoTitle: 'Tour and Travel Services in Jalna | Mumbai, Pune, Kashmir Trips | KHAN',
      seoDescription: 'Trusted tour and travel agency in Jalna, Maharashtra. Jalna to Mumbai, Pune, and Aurangabad travel, custom holiday vacation packages, and cab booking.',
      seoKeywords: 'tour and travel services in Jalna, Jalna to Mumbai travel, Jalna to Pune travel, Jalna to Aurangabad travel, holiday tour packages Jalna',
      isPublished: true
    }
  },
  webProjects: [
    {
      id: "proj-1",
      title: "Khan Electrics Website",
      category: "Multi-Service Web Portal",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      description: "Business website for electrical services with modern UI.",
      link: "https://khaneletrics.in",
      isPublished: true
    },
    {
      id: "proj-2",
      title: "MedicoManager",
      category: "Electron Desktop App",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      description: "Medical shop management app (Electron App).",
      link: "#",
      isPublished: true
    },
    {
      id: "proj-3",
      title: "Travel Website",
      category: "Booking & Tours",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
      description: "Tour & travel website with booking system.",
      link: "#",
      isPublished: true
    },
    {
      id: "proj-4",
      title: "E-Commerce Store",
      category: "Online Shopping",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
      description: "Online store with cart & payment integration.",
      link: "#",
      isPublished: true
    },
    {
      id: "proj-5",
      title: "Portfolio Website",
      category: "Personal Brand",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      description: "Personal portfolio website with high aesthetics.",
      link: "#",
      isPublished: true
    },
    {
      id: "proj-6",
      title: "Business Website",
      category: "Corporate Site",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      description: "Corporate website with modern responsive UI.",
      link: "#",
      isPublished: true
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
    { id: "gal-1", title: "Industrial Panel Wiring", type: "photo", url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", isPublished: true },
    { id: "gal-2", title: "Home Smart Lighting Setup", type: "photo", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80", isPublished: true },
    { id: "gal-3", title: "High Voltage Transformer Repair", type: "photo", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80", isPublished: true },
    { id: "gal-4", title: "CCTV Camera System Inspection", type: "photo", url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80", isPublished: true }
  ],
  tourDestinations: [
    {
      id: "dest-1",
      name: "Kashmir Paradise Tour",
      startingCity: "Jalna / Aurangabad",
      destinationCity: "Srinagar, Gulmarg & Pahalgam",
      coverImage: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
      photos: [],
      videoUrl: "",
      description: "Scenic valley tour with houseboat stays, shikara rides, and snow mountain sightseeing.",
      highlights: ["Houseboat Stay in Dal Lake", "Gondola Ride in Gulmarg", "Pahalgam Valley Sightseeing"],
      price: "₹24,500 per person",
      isPriceOnRequest: false,
      duration: "6 Days / 5 Nights",
      availableDates: "Every Saturday & Custom",
      isFeatured: true,
      isPublished: true,
      sortOrder: 1
    },
    {
      id: "dest-2",
      name: "Goa Beach Holiday",
      startingCity: "Jalna / Aurangabad",
      destinationCity: "North & South Goa",
      coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      photos: [],
      videoUrl: "",
      description: "Beach getaway with watersports, cruise, resort stay, and cab transfer.",
      highlights: ["Calangute & Baga Beaches", "Mandovi River Cruise", "Dudhsagar Waterfalls Trip"],
      price: "₹14,999 per person",
      isPriceOnRequest: false,
      duration: "4 Days / 3 Nights",
      availableDates: "Weekly Departures",
      isFeatured: true,
      isPublished: true,
      sortOrder: 2
    },
    {
      id: "dest-3",
      name: "Shirdi & Jyotirlinga Darshan",
      startingCity: "Badnapur / Jalna",
      destinationCity: "Shirdi, Shani Shingnapur, Grishneshwar",
      coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      photos: [],
      videoUrl: "",
      description: "Comfortable family pilgrimage tour with verified cab driver, hotel accommodation, and VIP darshan assistance.",
      highlights: ["Sai Baba Samadhi Temple", "Shani Shingnapur Darshan", "Grishneshwar Jyotirlinga"],
      price: "₹6,500 per person",
      isPriceOnRequest: false,
      duration: "2 Days / 1 Night",
      availableDates: "Daily on Request",
      isFeatured: false,
      isPublished: true,
      sortOrder: 3
    }
  ],
  travelDestinations: [],
  travelPackages: [],
  apps: [
    { id: "app-1", name: "MedicoManager", category: "Medical Shop Management", icon: "PlusSquare", description: "Medical Shop Management Electron app for inventory, billing & prescriptions.", downloadUrl: "#", platform: "windows", pricingType: "free", isPublished: true },
    { id: "app-2", name: "Khan Electrics Store", category: "Online Store App", icon: "Zap", description: "Browse and buy electrical supplies directly online.", downloadUrl: "#", platform: "cross-platform", pricingType: "free", isPublished: true },
    { id: "app-3", name: "Travel Planner", category: "Tour & Travel Assistant", icon: "Plane", description: "Itinerary creator and booking tracker for vacationers.", downloadUrl: "#", platform: "cross-platform", pricingType: "free", isPublished: true },
    { id: "app-4", name: "Service Tracker", category: "Track Your Services", icon: "Activity", description: "Real-time electrical and web dev request status monitoring.", downloadUrl: "#", platform: "cross-platform", pricingType: "free", isPublished: true },
    { id: "app-5", name: "Business Tools", category: "Productivity Tools", icon: "Briefcase", description: "Invoicing, quote generator and customer manager for SMEs.", downloadUrl: "#", platform: "all", pricingType: "free", isPublished: true },
    { id: "app-6", name: "More Apps", category: "Coming Soon", icon: "Grid", description: "Stay tuned for upcoming mobile & web utility software.", downloadUrl: "#", platform: "all", pricingType: "free", isPublished: true }
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
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Helper to verify if an authenticated user has admin privileges
  const checkAdminPrivilege = useCallback(async (user) => {
    if (!user) return false;
    const email = (user.email || '').toLowerCase().trim();

    // Direct check against verified owner email
    if (email === OWNER_EMAIL.toLowerCase()) {
      return true;
    }

    // Secondary database check against admin_users table (protected by public.is_admin() RLS)
    if (isSupabaseConfigured && supabase) {
      try {
        const query = supabase.from('admin_users').select('role').limit(1);
        const { data: adminRows, error } = user.id
          ? await query.or(`user_id.eq.${user.id},email.ilike.${email}`)
          : await query.ilike('email', email);

        if (!error && adminRows && adminRows.length > 0) {
          return true;
        }
      } catch {
        // Fallback to false if query fails
      }
    }
    return false;
  }, []);

  // Load public data from Supabase
  const loadSupabaseData = useCallback(async (isAdmin = false) => {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      // 1. Load Company Site Settings
      const { data: settingsRow, error: sErr } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'company')
        .maybeSingle();

      if (!sErr && settingsRow) {
        setData(prev => ({
          ...prev,
          settings: {
            companyName: settingsRow.company_name || prev.settings.companyName,
            domain: settingsRow.domain || prev.settings.domain,
            phone: settingsRow.phone || prev.settings.phone,
            whatsapp: settingsRow.whatsapp || prev.settings.whatsapp || '+91 7822886909',
            email: settingsRow.email || prev.settings.email,
            location: settingsRow.location || prev.settings.location,
            serviceAreas: settingsRow.service_areas || prev.settings.serviceAreas || 'Badnapur, Jalna, Aurangabad, Maharashtra',
            website: settingsRow.website || prev.settings.website,
            heroSubtitle: settingsRow.hero_subtitle || prev.settings.heroSubtitle,
            githubUrl: settingsRow.github_url || prev.settings.githubUrl || '',
            linkedinUrl: settingsRow.linkedin_url || prev.settings.linkedinUrl || '',
            instagramUrl: settingsRow.instagram_url || prev.settings.instagramUrl || '',
            appearance: settingsRow.appearance || prev.settings.appearance
          }
        }));
      }

      // 2. Load Web Projects
      const { data: projectsRows, error: pErr } = await supabase
        .from('web_projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!pErr && projectsRows && projectsRows.length > 0) {
        setData(prev => ({
          ...prev,
          webProjects: projectsRows.map(p => ({
            id: p.id,
            title: p.title,
            category: p.category,
            image: p.image,
            shortDescription: p.short_description || p.description || '',
            detailedDescription: p.detailed_description || '',
            description: p.short_description || p.description || '',
            photos: p.photos || [],
            videoUrl: p.video_url || '',
            link: p.link || '#',
            githubUrl: p.github_url || '',
            isFeatured: Boolean(p.is_featured),
            isPublished: p.is_published,
            sortOrder: p.sort_order,
            createdAt: p.created_at
          }))
        }));
      }

      // 3. Load Electrician Gallery Items
      const { data: galleryRows, error: gErr } = await supabase
        .from('electrician_gallery')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!gErr && galleryRows && galleryRows.length > 0) {
        setData(prev => ({
          ...prev,
          electricianGallery: galleryRows.map(g => ({
            id: g.id,
            title: g.title,
            type: g.type || 'photo',
            url: g.url,
            description: g.description || '',
            category: g.category || 'General Electrical',
            location: g.location || 'Jalna & Badnapur',
            beforeImage: g.before_image || '',
            afterImage: g.after_image || '',
            photos: g.photos || [],
            videoUrl: g.video_url || '',
            isPublished: g.is_published,
            sortOrder: g.sort_order,
            createdAt: g.created_at
          }))
        }));
      }

      // 4. Load Tour Destinations
      const { data: destRows, error: dErr } = await supabase
        .from('tour_destinations')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!dErr && destRows && destRows.length > 0) {
        const mappedDestinations = destRows.map(d => ({
          id: d.id,
          name: d.name,
          startingCity: d.starting_city || 'Jalna',
          destinationCity: d.destination_city,
          coverImage: d.cover_image,
          photos: d.photos || [],
          videoUrl: d.video_url || '',
          description: d.description || '',
          highlights: d.highlights || [],
          price: d.price || '',
          isPriceOnRequest: Boolean(d.is_price_on_request),
          duration: d.duration || '',
          availableDates: d.available_dates || '',
          itinerary: d.itinerary || [],
          routeInfo: d.route_info || '',
          isFeatured: Boolean(d.is_featured),
          isPublished: d.is_published,
          sortOrder: d.sort_order,
          createdAt: d.created_at
        }));

        setData(prev => ({
          ...prev,
          tourDestinations: mappedDestinations,
          travelDestinations: mappedDestinations
        }));
      }

      // 5. Load Apps Marketplace
      const { data: appsRows, error: aErr } = await supabase
        .from('apps')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!aErr && appsRows && appsRows.length > 0) {
        setData(prev => ({
          ...prev,
          apps: appsRows.map(a => ({
            id: a.id,
            name: a.name,
            slug: a.slug,
            category: a.category,
            icon: a.icon || 'Grid',
            description: a.description,
            downloadUrl: a.download_url || '#',
            githubReleaseUrl: a.github_release_url || null,
            platform: a.platform || 'all',
            pricingType: a.pricing_type || 'free',
            price: a.price,
            currency: a.currency || 'INR',
            fileType: a.file_type || null,
            fileSizeBytes: a.file_size_bytes || 0,
            storagePath: a.storage_path || null,
            version: a.version || '1.0.0',
            releaseDate: a.release_date || null,
            releaseNotes: a.release_notes || null,
            isPublished: a.is_published,
            sortOrder: a.sort_order
          }))
        }));
      }

      // 6. Load Service Pages Customizations
      const { data: pageRows, error: spErr } = await supabase
        .from('service_pages')
        .select('*');

      if (!spErr && pageRows && pageRows.length > 0) {
        const pageMap = {};
        pageRows.forEach(p => {
          pageMap[p.id] = {
            id: p.id,
            pageName: p.page_name,
            title: p.title,
            badge: p.badge,
            subtitle: p.subtitle,
            heroDescription: p.hero_description,
            ctaText: p.cta_text,
            ctaLink: p.cta_link,
            heroImage: p.hero_image,
            sections: p.sections || [],
            faqs: p.faqs || [],
            seoTitle: p.seo_title,
            seoDescription: p.seo_description,
            seoKeywords: p.seo_keywords,
            isPublished: p.is_published,
            draftContent: p.draft_content
          };
        });
        setData(prev => ({
          ...prev,
          servicePages: { ...(prev.servicePages || {}), ...pageMap }
        }));
      }

      // 7. If authorized admin, load Inquiries securely from Supabase
      if (isAdmin) {
        const { data: inqRows, error: inqErr } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!inqErr && inqRows) {
          setData(prev => ({
            ...prev,
            inquiries: inqRows.map(i => ({
              id: i.id,
              serviceType: i.service_type,
              name: i.name,
              email: i.email || '',
              phone: i.phone || '',
              businessName: i.business_name || '',
              websiteType: i.website_type || '',
              requiredFeatures: i.required_features || '',
              budget: i.budget || '',
              deadline: i.deadline || '',
              referenceUrl: i.reference_url || '',
              location: i.location || '',
              fromCity: i.from_city || '',
              toDestination: i.to_destination || '',
              travelDate: i.travel_date || '',
              returnDate: i.return_date || '',
              travelers: i.travelers || '',
              tripType: i.trip_type || '',
              rooms: i.rooms || '',
              fittingsCount: i.fittings_count || '',
              details: i.details || '',
              notes: i.notes || '',
              status: i.status || 'New',
              createdAt: i.created_at
            }))
          }));
        }
      }
    } catch (err) {
      console.log('Supabase initial fetch note:', err.message);
    }
  }, []);

  // Supabase Auth Session Synchronization (Tab-scoped non-persistent session policy)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      loadSupabaseData(false);
      return;
    }

    // Check if an explicit active admin session was initiated in this tab
    const isTabActive = typeof window !== 'undefined' &&
      window.sessionStorage?.getItem('khan_admin_session_active') === 'true';

    if (!isTabActive) {
      // In a fresh visit / new tab, do NOT auto-login. Require manual credentials.
      setCurrentUser(null);
      setIsAuthorizedAdmin(false);
      setIsAdminLoggedIn(false);
      loadSupabaseData(false);
    } else {
      supabase.auth.getSession().then(async ({ data: sessionData, error }) => {
        if (!error && sessionData?.session?.user) {
          const user = sessionData.session.user;
          const isAdmin = await checkAdminPrivilege(user);
          if (isAdmin) {
            setCurrentUser(user);
            setIsAuthorizedAdmin(true);
            setIsAdminLoggedIn(true);
            loadSupabaseData(true);
          } else {
            setCurrentUser(null);
            setIsAuthorizedAdmin(false);
            setIsAdminLoggedIn(false);
            loadSupabaseData(false);
          }
        } else {
          setCurrentUser(null);
          setIsAuthorizedAdmin(false);
          setIsAdminLoggedIn(false);
          loadSupabaseData(false);
        }
      });
    }

    // Listen for auth changes (sign in, sign out, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const isStillActive = typeof window !== 'undefined' &&
        window.sessionStorage?.getItem('khan_admin_session_active') === 'true';

      if (session?.user && isStillActive) {
        const user = session.user;
        const isAdmin = await checkAdminPrivilege(user);
        if (isAdmin) {
          setCurrentUser(user);
          setIsAuthorizedAdmin(true);
          setIsAdminLoggedIn(true);
          loadSupabaseData(true);
        } else {
          setCurrentUser(null);
          setIsAuthorizedAdmin(false);
          setIsAdminLoggedIn(false);
          loadSupabaseData(false);
        }
      } else if (!session?.user || !isStillActive) {
        setCurrentUser(null);
        setIsAuthorizedAdmin(false);
        setIsAdminLoggedIn(false);
        loadSupabaseData(false);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [checkAdminPrivilege, loadSupabaseData]);

  // Firestore real-time listener (Preserves existing Firebase functionality as verified fallback)
  useEffect(() => {
    try {
      const unsubInquiries = onSnapshot(collection(db, "inquiries"), (snapshot) => {
        if (!snapshot.empty) {
          const fbInquiries = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
          setData(prev => {
            // Only update if we don't already have Supabase inquiries loaded with UUIDs
            if (!prev.inquiries || prev.inquiries.length === 0 || !isUUID(prev.inquiries[0]?.id)) {
              return { ...prev, inquiries: fbInquiries };
            }
            return prev;
          });
        }
      }, (err) => console.log("Firebase sync note:", err.message));

      const unsubSettings = onSnapshot(doc(db, "settings", "company"), (docSnap) => {
        if (docSnap.exists()) {
          setData(prev => ({ ...prev, settings: { ...prev.settings, ...docSnap.data() } }));
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

  // Admin authentication handlers using Supabase Auth
  const adminLogin = async (username, password) => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, message: 'Supabase credentials are not configured in .env.local.' };
    }

    const cleanUsername = (username || '').trim();
    if (!cleanUsername || !password) {
      return { success: false, message: 'Both Username and Password are required.' };
    }

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: cleanUsername,
        password
      });

      if (error) {
        return { success: false, message: error.message };
      }

      const isAdmin = await checkAdminPrivilege(authData.user);
      if (!isAdmin) {
        await supabase.auth.signOut();
        if (typeof window !== 'undefined') {
          window.sessionStorage?.removeItem('khan_admin_session_active');
        }
        setIsAuthorizedAdmin(false);
        setIsAdminLoggedIn(false);
        return {
          success: false,
          message: `Access Denied: The account "${cleanUsername}" is not authorized as an administrator for this website.`
        };
      }

      // Mark active admin session for this browser tab
      if (typeof window !== 'undefined') {
        window.sessionStorage?.setItem('khan_admin_session_active', 'true');
      }

      setCurrentUser(authData.user);
      setIsAuthorizedAdmin(true);
      setIsAdminLoggedIn(true);
      await loadSupabaseData(true);
      showToast('Welcome back, Admin! Secure Supabase session active.', 'success');
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Authentication failed.' };
    }
  };

  const adminSignUp = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, message: 'Supabase credentials are not configured in .env.local.' };
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail !== OWNER_EMAIL.toLowerCase()) {
      return {
        success: false,
        message: `Self-registration is restricted. Only the designated website owner (${OWNER_EMAIL}) may set up admin credentials.`
      };
    }

    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (signUpData.session) {
        if (typeof window !== 'undefined') {
          window.sessionStorage?.setItem('khan_admin_session_active', 'true');
        }
        setCurrentUser(signUpData.user);
        setIsAuthorizedAdmin(true);
        setIsAdminLoggedIn(true);
        await loadSupabaseData(true);
        showToast('Owner account registered and authenticated successfully!', 'success');
        return { success: true, needsConfirmation: false };
      } else {
        return {
          success: true,
          needsConfirmation: true,
          message: 'Account created! Please check your email inbox to confirm your email, then return here to sign in.'
        };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed.' };
    }
  };

  const adminLogout = async () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage?.removeItem('khan_admin_session_active');
      try {
        window.sessionStorage?.clear();
      } catch {}
    }
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Logout error:', err.message);
      }
    }
    setCurrentUser(null);
    setIsAuthorizedAdmin(false);
    setIsAdminLoggedIn(false);
    showToast('Logged out of Admin Panel.', 'info');
  };

  // Change Admin Password after verifying current credentials
  const updateAdminPassword = async (currentPassword, newPassword) => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, message: 'Supabase is not configured.' };
    }
    if (!currentUser?.email) {
      return { success: false, message: 'No active admin session found.' };
    }
    if (!currentPassword) {
      return { success: false, message: 'Current password is required to verify your identity.' };
    }
    if (!newPassword || newPassword.length < 8) {
      return { success: false, message: 'New password must be at least 8 characters long.' };
    }

    try {
      // 1. Verify current password
      const { error: verifyErr } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: currentPassword
      });
      if (verifyErr) {
        return {
          success: false,
          message: 'Current password verification failed: ' + verifyErr.message
        };
      }

      // 2. Update to new password
      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (updateErr) {
        return {
          success: false,
          message: 'Password update failed: ' + updateErr.message
        };
      }

      showToast('Password updated successfully!', 'success');
      return {
        success: true,
        message: 'Password updated successfully! Your new password is now active.'
      };
    } catch (err) {
      return { success: false, message: err.message || 'Password update failed.' };
    }
  };

  // Change Administrator Email via Supabase Auth
  const requestAdminEmailChange = async (newEmail) => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, message: 'Supabase is not configured.' };
    }
    if (!currentUser?.email) {
      return { success: false, message: 'No active admin session found.' };
    }
    const cleanEmail = (newEmail || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (cleanEmail === currentUser.email.toLowerCase()) {
      return { success: false, message: 'The new email is identical to your current email.' };
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        email: cleanEmail
      });

      if (error) {
        return { success: false, message: 'Email change request failed: ' + error.message };
      }

      const isConfirmationPending = Boolean(data?.user?.new_email);
      showToast(isConfirmationPending ? 'Verification link sent to new email!' : 'Email updated!', 'success');
      return {
        success: true,
        isConfirmationPending,
        message: isConfirmationPending
          ? `A confirmation link has been sent to ${cleanEmail}. Click the verification link in your inbox to finalize and activate the new address.`
          : `Email address successfully updated to ${cleanEmail}.`
      };
    } catch (err) {
      return { success: false, message: err.message || 'Email update request failed.' };
    }
  };

  // Request password reset for administrator email
  const sendAdminPasswordReset = async (email) => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, message: 'Supabase is not configured.' };
    }
    const targetEmail = (email || currentUser?.email || '').trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      return { success: false, message: 'Please provide a valid registered admin email.' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/admin` : undefined
      });

      if (error) {
        return { success: false, message: 'Password reset request failed: ' + error.message };
      }

      showToast('Password reset link sent to registered email.', 'success');
      return {
        success: true,
        message: `Password reset instructions sent to ${targetEmail}. Please check your inbox and spam folder.`
      };
    } catch (err) {
      return { success: false, message: err.message || 'Password reset request failed.' };
    }
  };

  // Submit inquiry to Supabase with proper field validation & Firebase fallback
  const submitInquiry = async (inquiryData) => {
    // 1. Validation & sanitization: ONLY Customer Name and Mobile Number are mandatory
    const name = inquiryData.name?.trim();
    const phone = inquiryData.phone?.trim();
    const email = inquiryData.email?.trim() || null;
    const serviceType = inquiryData.serviceType || 'General Contact';

    if (!name || name.length < 2) {
      showToast('Please enter your full name (at least 2 characters).', 'warning');
      return { success: false, message: 'Full Name is required.' };
    }

    if (name.length > 100) {
      showToast('Full name must be under 100 characters.', 'warning');
      return { success: false, message: 'Full name too long.' };
    }

    // Mobile Number is strictly MANDATORY
    if (!phone) {
      showToast('Please enter your mobile phone number.', 'warning');
      return { success: false, message: 'Mobile number is required.' };
    }

    // Phone format validation
    if (!/^[+]?[\d\s\-()]{7,20}$/.test(phone)) {
      showToast('Please enter a valid mobile number (at least 7 digits).', 'warning');
      return { success: false, message: 'Invalid mobile number format.' };
    }

    // Email is strictly OPTIONAL. If provided, validate format
    if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      showToast('Please enter a valid email address, or leave it blank.', 'warning');
      return { success: false, message: 'Invalid email address.' };
    }

    let supabaseSuccess = false;
    let firebaseSuccess = false;

    // 2. Primary: Supabase Database Write (Public Insert)
    if (isSupabaseConfigured && supabase) {
      try {
        const dbPayload = {
          service_type: serviceType,
          name: name,
          email: email || null,
          phone: phone,
          secondary_phone: inquiryData.secondaryPhone?.trim() || null,
          whatsapp: inquiryData.whatsapp?.trim() || null,
          business_name: inquiryData.businessName?.trim() || null,
          website_type: inquiryData.websiteType?.trim() || null,
          required_features: inquiryData.requiredFeatures?.trim() || null,
          deadline: inquiryData.deadline?.trim() || null,
          reference_url: inquiryData.referenceUrl?.trim() || null,
          location: inquiryData.location?.trim() || null,
          from_city: inquiryData.fromCity?.trim() || null,
          to_destination: inquiryData.toDestination?.trim() || null,
          travel_date: inquiryData.travelDate || null,
          return_date: inquiryData.returnDate || null,
          travelers: inquiryData.travelers ? String(inquiryData.travelers) : null,
          trip_type: inquiryData.tripType?.trim() || null,
          budget: inquiryData.budget?.trim() || null,
          rooms: inquiryData.rooms?.trim() || null,
          fittings_count: inquiryData.fittingsCount?.trim() || null,
          details: inquiryData.details?.trim() || inquiryData.message?.trim() || null,
          notes: inquiryData.notes?.trim() || null,
          status: 'New'
        };

        const { error } = await supabase.from('inquiries').insert([dbPayload]);
        if (!error) {
          supabaseSuccess = true;
        } else {
          console.error('Supabase inquiry insert error:', error.message);
        }
      } catch (err) {
        console.error('Supabase write exception:', err.message);
      }
    }

    // 3. Fallback / Dual-write: Firebase Firestore
    // If Supabase already succeeded, fire Firestore asynchronously in the background so the user is never delayed.
    const fbPayload = {
      createdAt: new Date().toISOString(),
      status: 'New',
      serviceType,
      name,
      phone,
      email: email || '',
      ...inquiryData
    };

    if (supabaseSuccess) {
      try {
        addDoc(collection(db, "inquiries"), fbPayload).catch(() => {});
      } catch {}
    } else {
      try {
        await Promise.race([
          addDoc(collection(db, "inquiries"), fbPayload),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 2500))
        ]);
        firebaseSuccess = true;
      } catch (err) {
        console.log('Firebase write fallback note:', err.message);
      }
    }

    // 4. REST endpoint fallback
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inquiryData, name, phone, email, serviceType })
      });
    } catch {}

    // 5. User Feedback (Never report success if both backends failed)
    if (supabaseSuccess || firebaseSuccess) {
      const newLocalLead = {
        id: 'inq-' + Date.now(),
        serviceType,
        name,
        email: email || '',
        phone,
        businessName: inquiryData.businessName?.trim() || '',
        websiteType: inquiryData.websiteType?.trim() || '',
        requiredFeatures: inquiryData.requiredFeatures?.trim() || '',
        deadline: inquiryData.deadline?.trim() || '',
        referenceUrl: inquiryData.referenceUrl?.trim() || '',
        location: inquiryData.location?.trim() || '',
        fromCity: inquiryData.fromCity?.trim() || '',
        toDestination: inquiryData.toDestination?.trim() || '',
        travelDate: inquiryData.travelDate || '',
        returnDate: inquiryData.returnDate || '',
        travelers: inquiryData.travelers ? String(inquiryData.travelers) : '',
        tripType: inquiryData.tripType?.trim() || '',
        budget: inquiryData.budget?.trim() || '',
        rooms: inquiryData.rooms?.trim() || '',
        fittingsCount: inquiryData.fittingsCount?.trim() || '',
        details: inquiryData.details?.trim() || inquiryData.message?.trim() || '',
        status: 'New',
        createdAt: new Date().toISOString()
      };
      setData(prev => ({
        ...prev,
        inquiries: [newLocalLead, ...(prev.inquiries || [])]
      }));

      showToast('Thank you! Your request has been recorded. We will contact you shortly.', 'success');
      return { success: true, message: 'Inquiry submitted successfully!' };
    } else {
      showToast('Failed to submit inquiry. Please check your internet connection or call +91 7822886909.', 'error');
      return { success: false, message: 'Failed to record inquiry in database.' };
    }
  };

  // Admin Inquiries: Update Status
  const updateInquiryStatus = async (id, status) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can update inquiries.', 'error');
      return { success: false, message: 'Unauthorized' };
    }

    if (isSupabaseConfigured && supabase && isUUID(id)) {
      try {
        const { error } = await supabase
          .from('inquiries')
          .update({ status })
          .eq('id', id);

        if (error) {
          console.error('Supabase inquiry update error:', error.message);
          showToast(`Error updating status: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.error('Supabase update exception:', err.message);
        showToast(`Failed to update status: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    setData(prev => ({
      ...prev,
      inquiries: prev.inquiries.map(inq => inq.id === id ? { ...inq, status } : inq)
    }));

    try {
      await updateDoc(doc(db, "inquiries", id), { status });
    } catch {}

    showToast(`Inquiry status updated to "${status}"`, 'info');
    return { success: true };
  };

  // Admin Inquiries: Delete Inquiry
  const deleteInquiry = async (id) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can delete inquiries.', 'error');
      return { success: false, message: 'Unauthorized' };
    }

    if (isSupabaseConfigured && supabase && isUUID(id)) {
      try {
        const { error } = await supabase
          .from('inquiries')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase delete inquiry error:', error.message);
          showToast(`Error deleting inquiry: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.error('Supabase delete exception:', err.message);
        showToast(`Failed to delete inquiry: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    setData(prev => ({
      ...prev,
      inquiries: prev.inquiries.filter(inq => inq.id !== id)
    }));

    try {
      await deleteDoc(doc(db, "inquiries", id));
    } catch {}

    showToast('Inquiry deleted from database.', 'info');
    return { success: true };
  };

  // Admin Company Settings: Update
  const updateSettings = async (newSettings) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can update company settings.', 'error');
      return { success: false, message: 'Unauthorized' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('site_settings')
          .update({
            company_name: newSettings.companyName,
            domain: newSettings.domain,
            phone: newSettings.phone,
            whatsapp: newSettings.whatsapp,
            email: newSettings.email,
            location: newSettings.location,
            service_areas: newSettings.serviceAreas,
            website: newSettings.website,
            hero_subtitle: newSettings.heroSubtitle,
            github_url: newSettings.githubUrl,
            linkedin_url: newSettings.linkedinUrl,
            instagram_url: newSettings.instagramUrl
          })
          .eq('id', 'company');

        if (error) {
          console.error('Supabase settings update error:', error.message);
          showToast(`Error updating settings: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.error('Supabase update exception:', err.message);
        showToast(`Failed to update settings: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));

    try {
      await setDoc(doc(db, "settings", "company"), newSettings, { merge: true });
    } catch {}

    showToast('Company settings updated in Cloud Database!', 'success');
    return { success: true };
  };

  // Admin Website Appearance: Update (Customizable service cards & hero appearance)
  const updateAppearance = async (newAppearance) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can change website appearance.', 'error');
      return { success: false, message: 'Unauthorized' };
    }

    const currentAppearance = data.settings?.appearance || INITIAL_FALLBACK_DATA.settings.appearance;
    const merged = { ...currentAppearance, ...newAppearance };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('site_settings')
          .update({ appearance: merged })
          .eq('id', 'company');

        if (error) {
          console.error('Supabase update appearance error:', error.message);
          showToast(`Error updating appearance: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.error('Supabase appearance exception:', err.message);
        showToast(`Failed to update appearance: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        appearance: merged
      }
    }));

    showToast('Website appearance updated and live on homepage!', 'success');
    return { success: true };
  };

  // Admin Web Projects: Add Project
  const addWebProject = async (project) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can add web projects.', 'error');
      return { success: false, message: 'Unauthorized' };
    }

    let createdProject = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          title: project.title,
          category: project.category || 'Web Application',
          image: project.image || '',
          short_description: project.shortDescription || project.description || '',
          detailed_description: project.detailedDescription || '',
          description: project.shortDescription || project.description || '',
          photos: Array.isArray(project.photos) ? project.photos : [],
          video_url: project.videoUrl || '',
          link: project.link || '#',
          github_url: project.githubUrl || '',
          is_featured: Boolean(project.isFeatured),
          is_published: project.isPublished !== undefined ? project.isPublished : true,
          sort_order: Number(project.sortOrder) || 0
        };

        const { data: inserted, error } = await supabase
          .from('web_projects')
          .insert([payload])
          .select()
          .single();

        if (error) {
          console.error('Supabase add project error:', error.message);
          showToast(`Error adding project: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }

        createdProject = {
          id: inserted.id,
          title: inserted.title,
          category: inserted.category,
          image: inserted.image,
          shortDescription: inserted.short_description || inserted.description || '',
          detailedDescription: inserted.detailed_description || '',
          description: inserted.short_description || inserted.description || '',
          photos: inserted.photos || [],
          videoUrl: inserted.video_url || '',
          link: inserted.link || '#',
          githubUrl: inserted.github_url || '',
          isFeatured: Boolean(inserted.is_featured),
          isPublished: inserted.is_published,
          sortOrder: inserted.sort_order,
          createdAt: inserted.created_at
        };
      } catch (err) {
        console.error('Supabase project exception:', err.message);
        showToast(`Failed to add project: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    if (!createdProject) {
      createdProject = { id: 'proj-' + Date.now(), ...project, isPublished: true };
    }

    setData(prev => ({
      ...prev,
      webProjects: [createdProject, ...(prev.webProjects || [])]
    }));

    try {
      await addDoc(collection(db, "webProjects"), project);
    } catch {}

    showToast('New Web Project added to showcase!', 'success');
    return { success: true, project: createdProject };
  };

  // Admin Web Projects: Update Project
  const updateWebProject = async (id, updatedFields) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can update web projects.', 'error');
      return { success: false, message: 'Unauthorized' };
    }

    if (isSupabaseConfigured && supabase && isUUID(id)) {
      try {
        const payload = {};
        if (updatedFields.title !== undefined) payload.title = updatedFields.title;
        if (updatedFields.category !== undefined) payload.category = updatedFields.category;
        if (updatedFields.image !== undefined) payload.image = updatedFields.image;
        if (updatedFields.shortDescription !== undefined) {
          payload.short_description = updatedFields.shortDescription;
          payload.description = updatedFields.shortDescription;
        }
        if (updatedFields.detailedDescription !== undefined) payload.detailed_description = updatedFields.detailedDescription;
        if (updatedFields.photos !== undefined) payload.photos = updatedFields.photos;
        if (updatedFields.videoUrl !== undefined) payload.video_url = updatedFields.videoUrl;
        if (updatedFields.link !== undefined) payload.link = updatedFields.link;
        if (updatedFields.githubUrl !== undefined) payload.github_url = updatedFields.githubUrl;
        if (updatedFields.isFeatured !== undefined) payload.is_featured = Boolean(updatedFields.isFeatured);
        if (updatedFields.isPublished !== undefined) payload.is_published = updatedFields.isPublished;
        if (updatedFields.sortOrder !== undefined) payload.sort_order = Number(updatedFields.sortOrder) || 0;

        const { error } = await supabase
          .from('web_projects')
          .update(payload)
          .eq('id', id);

        if (error) {
          console.error('Supabase update project error:', error.message);
          showToast(`Error updating project: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.error('Supabase update project exception:', err.message);
        showToast(`Failed to update project: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    setData(prev => ({
      ...prev,
      webProjects: prev.webProjects.map(p => p.id === id ? { ...p, ...updatedFields } : p)
    }));

    showToast('Web project updated successfully!', 'success');
    return { success: true };
  };

  // Admin Web Projects: Delete Project (Guarantees true database deletion)
  const deleteWebProject = async (id) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can delete web projects.', 'error');
      return { success: false, message: 'Unauthorized' };
    }

    if (isSupabaseConfigured && supabase && isUUID(id)) {
      try {
        const { error } = await supabase
          .from('web_projects')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase delete project error:', error.message);
          showToast(`Error deleting project: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.error('Supabase delete exception:', err.message);
        showToast(`Failed to delete project: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    setData(prev => ({
      ...prev,
      webProjects: prev.webProjects.filter(p => p.id !== id)
    }));

    showToast('Project removed.', 'info');
    return { success: true };
  };

  // Admin Web Projects: Toggle Publish
  const toggleWebProjectPublish = async (id, currentStatus) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can publish or unpublish.', 'error');
      return { success: false, message: 'Unauthorized' };
    }
    const newStatus = !currentStatus;

    if (isSupabaseConfigured && supabase && isUUID(id)) {
      try {
        const { error } = await supabase
          .from('web_projects')
          .update({ is_published: newStatus })
          .eq('id', id);
        if (error) {
          console.error('Supabase toggle project publish error:', error.message);
          showToast(`Error updating publish status: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.error('Supabase toggle exception:', err.message);
        showToast(`Failed to toggle publish: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    setData(prev => ({
      ...prev,
      webProjects: prev.webProjects.map(p => p.id === id ? { ...p, isPublished: newStatus } : p)
    }));

    showToast(`Web project ${newStatus ? 'published publicly' : 'unpublished (draft)'}.`, 'info');
    return { success: true };
  };

  // Admin Electrician Gallery: Add Item
  const addElectricianGallery = async (item) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can add gallery items.', 'error');
      return { success: false, message: 'Unauthorized' };
    }

    let createdGallery = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          title: item.title,
          category: item.category || 'General Electrical',
          location: item.location || 'Badnapur / Jalna',
          type: item.type || 'photo',
          url: item.url || '',
          description: item.description || '',
          before_image: item.beforeImage || null,
          after_image: item.afterImage || null,
          photos: Array.isArray(item.photos) ? item.photos : [],
          video_url: item.videoUrl || null,
          is_published: item.isPublished !== undefined ? item.isPublished : true,
          sort_order: Number(item.sortOrder) || 0
        };

        const { data: inserted, error } = await supabase
          .from('electrician_gallery')
          .insert([payload])
          .select()
          .single();

        if (error) {
          console.error('Supabase add gallery error:', error.message);
          showToast(`Error adding gallery item: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }

        createdGallery = {
          id: inserted.id,
          title: inserted.title,
          category: inserted.category,
          location: inserted.location,
          type: inserted.type,
          url: inserted.url,
          description: inserted.description,
          beforeImage: inserted.before_image || '',
          afterImage: inserted.after_image || '',
          photos: inserted.photos || [],
          videoUrl: inserted.video_url || '',
          isPublished: inserted.is_published,
          sortOrder: inserted.sort_order,
          createdAt: inserted.created_at
        };
      } catch (err) {
        console.error('Supabase gallery exception:', err.message);
        showToast(`Failed to add gallery item: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    if (!createdGallery) {
      createdGallery = { id: 'gal-' + Date.now(), ...item, isPublished: true };
    }

    setData(prev => ({
      ...prev,
      electricianGallery: [createdGallery, ...(prev.electricianGallery || [])]
    }));

    try {
      await addDoc(collection(db, "electricianGallery"), item);
    } catch {}

    showToast('Gallery item added successfully!', 'success');
    return { success: true, item: createdGallery };
  };

  // Admin Electrician Gallery: Update Item
  const updateElectricianGallery = async (id, updatedFields) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can update gallery items.', 'error');
      return { success: false, message: 'Unauthorized' };
    }

    if (isSupabaseConfigured && supabase && isUUID(id)) {
      try {
        const payload = {};
        if (updatedFields.title !== undefined) payload.title = updatedFields.title;
        if (updatedFields.category !== undefined) payload.category = updatedFields.category;
        if (updatedFields.location !== undefined) payload.location = updatedFields.location;
        if (updatedFields.type !== undefined) payload.type = updatedFields.type;
        if (updatedFields.url !== undefined) payload.url = updatedFields.url;
        if (updatedFields.description !== undefined) payload.description = updatedFields.description;
        if (updatedFields.beforeImage !== undefined) payload.before_image = updatedFields.beforeImage;
        if (updatedFields.afterImage !== undefined) payload.after_image = updatedFields.afterImage;
        if (updatedFields.photos !== undefined) payload.photos = updatedFields.photos;
        if (updatedFields.videoUrl !== undefined) payload.video_url = updatedFields.videoUrl;
        if (updatedFields.isPublished !== undefined) payload.is_published = updatedFields.isPublished;
        if (updatedFields.sortOrder !== undefined) payload.sort_order = Number(updatedFields.sortOrder) || 0;

        const { error } = await supabase
          .from('electrician_gallery')
          .update(payload)
          .eq('id', id);

        if (error) {
          console.error('Supabase update gallery error:', error.message);
          showToast(`Error updating gallery item: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.error('Supabase update gallery exception:', err.message);
        showToast(`Failed to update gallery item: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    setData(prev => ({
      ...prev,
      electricianGallery: prev.electricianGallery.map(g => g.id === id ? { ...g, ...updatedFields } : g)
    }));

    showToast('Gallery item updated successfully!', 'success');
    return { success: true };
  };

  // Admin Electrician Gallery: Delete Item (Guarantees true database deletion)
  const deleteElectricianGallery = async (id) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can delete gallery items.', 'error');
      return { success: false, message: 'Unauthorized' };
    }

    if (isSupabaseConfigured && supabase && isUUID(id)) {
      try {
        const { error } = await supabase
          .from('electrician_gallery')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase delete gallery error:', error.message);
          showToast(`Error deleting gallery item: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.error('Supabase delete exception:', err.message);
        showToast(`Failed to delete gallery item: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    setData(prev => ({
      ...prev,
      electricianGallery: prev.electricianGallery.filter(g => g.id !== id)
    }));

    showToast('Gallery item removed.', 'info');
    return { success: true };
  };

  // Admin Electrician Gallery: Toggle Publish
  const toggleElectricianGalleryPublish = async (id, currentStatus) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can publish or unpublish.', 'error');
      return { success: false, message: 'Unauthorized' };
    }
    const newStatus = !currentStatus;

    if (isSupabaseConfigured && supabase && isUUID(id)) {
      try {
        const { error } = await supabase
          .from('electrician_gallery')
          .update({ is_published: newStatus })
          .eq('id', id);
        if (error) {
          console.error('Supabase toggle gallery publish error:', error.message);
          showToast(`Error updating publish status: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.error('Supabase toggle exception:', err.message);
        showToast(`Failed to toggle gallery publish: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    setData(prev => ({
      ...prev,
      electricianGallery: prev.electricianGallery.map(g => g.id === id ? { ...g, isPublished: newStatus } : g)
    }));

    showToast(`Gallery media ${newStatus ? 'published publicly' : 'unpublished (draft)'}.`, 'info');
    return { success: true };
  };

  // Admin Tour Destinations: Add Destination
  const addTourDestination = async (dest) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can add tour destinations.', 'error');
      return { success: false, message: 'Unauthorized' };
    }

    let createdDest = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          name: dest.name,
          starting_city: dest.startingCity || 'Jalna',
          destination_city: dest.destinationCity,
          cover_image: dest.coverImage,
          photos: Array.isArray(dest.photos) ? dest.photos : [],
          video_url: dest.videoUrl || '',
          description: dest.description || '',
          highlights: Array.isArray(dest.highlights) ? dest.highlights : (dest.highlights ? dest.highlights.split(',').map(s => s.trim()).filter(Boolean) : []),
          price: dest.price || '',
          is_price_on_request: Boolean(dest.isPriceOnRequest),
          duration: dest.duration || '',
          available_dates: dest.availableDates || '',
          itinerary: Array.isArray(dest.itinerary) ? dest.itinerary : [],
          route_info: dest.routeInfo || '',
          is_featured: Boolean(dest.isFeatured),
          is_published: dest.isPublished !== undefined ? dest.isPublished : true,
          sort_order: Number(dest.sortOrder) || 0
        };

        const { data: inserted, error } = await supabase
          .from('tour_destinations')
          .insert([payload])
          .select()
          .single();

        if (error) {
          console.error('Supabase add destination error:', error.message);
          showToast(`Error adding destination: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }

        createdDest = {
          id: inserted.id,
          name: inserted.name,
          startingCity: inserted.starting_city,
          destinationCity: inserted.destination_city,
          coverImage: inserted.cover_image,
          photos: inserted.photos || [],
          videoUrl: inserted.video_url || '',
          description: inserted.description,
          highlights: inserted.highlights || [],
          price: inserted.price,
          isPriceOnRequest: Boolean(inserted.is_price_on_request),
          duration: inserted.duration,
          availableDates: inserted.available_dates,
          itinerary: inserted.itinerary || [],
          routeInfo: inserted.route_info,
          isFeatured: Boolean(inserted.is_featured),
          isPublished: inserted.is_published,
          sortOrder: inserted.sort_order,
          createdAt: inserted.created_at
        };
      } catch (err) {
        console.error('Supabase destination exception:', err.message);
        showToast(`Failed to add destination: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    if (!createdDest) {
      createdDest = { id: 'dest-' + Date.now(), ...dest, isPublished: true };
    }

    setData(prev => ({
      ...prev,
      tourDestinations: [createdDest, ...(prev.tourDestinations || [])],
      travelDestinations: [createdDest, ...(prev.travelDestinations || [])]
    }));

    showToast('Tour destination added successfully!', 'success');
    return { success: true, destination: createdDest };
  };

  // Admin Tour Destinations: Update Destination
  const updateTourDestination = async (id, updatedFields) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can update destinations.', 'error');
      return { success: false, message: 'Unauthorized' };
    }

    if (isSupabaseConfigured && supabase && isUUID(id)) {
      try {
        const payload = {};
        if (updatedFields.name !== undefined) payload.name = updatedFields.name;
        if (updatedFields.startingCity !== undefined) payload.starting_city = updatedFields.startingCity;
        if (updatedFields.destinationCity !== undefined) payload.destination_city = updatedFields.destinationCity;
        if (updatedFields.coverImage !== undefined) payload.cover_image = updatedFields.coverImage;
        if (updatedFields.photos !== undefined) payload.photos = updatedFields.photos;
        if (updatedFields.videoUrl !== undefined) payload.video_url = updatedFields.videoUrl;
        if (updatedFields.description !== undefined) payload.description = updatedFields.description;
        if (updatedFields.highlights !== undefined) {
          payload.highlights = Array.isArray(updatedFields.highlights) ? updatedFields.highlights : updatedFields.highlights.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (updatedFields.price !== undefined) payload.price = updatedFields.price;
        if (updatedFields.isPriceOnRequest !== undefined) payload.is_price_on_request = Boolean(updatedFields.isPriceOnRequest);
        if (updatedFields.duration !== undefined) payload.duration = updatedFields.duration;
        if (updatedFields.availableDates !== undefined) payload.available_dates = updatedFields.availableDates;
        if (updatedFields.itinerary !== undefined) payload.itinerary = updatedFields.itinerary;
        if (updatedFields.routeInfo !== undefined) payload.route_info = updatedFields.routeInfo;
        if (updatedFields.isFeatured !== undefined) payload.is_featured = Boolean(updatedFields.isFeatured);
        if (updatedFields.isPublished !== undefined) payload.is_published = updatedFields.isPublished;
        if (updatedFields.sortOrder !== undefined) payload.sort_order = Number(updatedFields.sortOrder) || 0;

        const { error } = await supabase
          .from('tour_destinations')
          .update(payload)
          .eq('id', id);

        if (error) {
          console.error('Supabase update destination error:', error.message);
          showToast(`Error updating destination: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.error('Supabase update destination exception:', err.message);
        showToast(`Failed to update destination: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    setData(prev => {
      const updateList = (list) => (list || []).map(d => d.id === id ? { ...d, ...updatedFields } : d);
      return {
        ...prev,
        tourDestinations: updateList(prev.tourDestinations),
        travelDestinations: updateList(prev.travelDestinations)
      };
    });

    showToast('Destination updated successfully!', 'success');
    return { success: true };
  };

  // Admin Tour Destinations: Delete Destination (Guarantees true database deletion)
  const deleteTourDestination = async (id) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can delete destinations.', 'error');
      return { success: false, message: 'Unauthorized' };
    }

    if (isSupabaseConfigured && supabase && isUUID(id)) {
      try {
        const { error } = await supabase
          .from('tour_destinations')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase delete destination error:', error.message);
          showToast(`Error deleting destination: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.error('Supabase delete destination exception:', err.message);
        showToast(`Failed to delete destination: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    setData(prev => ({
      ...prev,
      tourDestinations: (prev.tourDestinations || []).filter(d => d.id !== id),
      travelDestinations: (prev.travelDestinations || []).filter(d => d.id !== id)
    }));

    showToast('Tour destination removed.', 'info');
    return { success: true };
  };

  // Admin Tour Destinations: Toggle Publish
  const toggleTourDestinationPublish = async (id, currentStatus) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can publish or unpublish.', 'error');
      return { success: false, message: 'Unauthorized' };
    }
    const newStatus = !currentStatus;
    return updateTourDestination(id, { isPublished: newStatus });
  };

  // General Media Upload to Supabase Storage ('site-media' bucket, max 50MB free-tier limit)
  const uploadMediaFile = async (file, options = {}, onProgress = null) => {
    if (!isAuthorizedAdmin) {
      const msg = 'Unauthorized: Only verified administrators can upload media.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    if (!isSupabaseConfigured || !supabase) {
      const msg = 'Supabase client is not configured.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    // 1. Storage limit check (Supabase Free Tier ₹0 budget limit: 50 MB per file)
    const MAX_FREE_TIER_BYTES = 52428800; // 50 MB
    if (file.size > MAX_FREE_TIER_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const msg = `File size (${sizeMb} MB) exceeds Supabase Storage free-tier limit of 50 MB (₹0 budget). Please select a file under 50 MB or provide a YouTube / Google Drive / external video URL.`;
      return {
        success: false,
        limitExceeded: true,
        message: msg
      };
    }

    // 2. MIME type & extension check
    const ext = file.name.split('.').pop().toLowerCase();
    const isImage = file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext);
    const isVideo = file.type.startsWith('video/') || ['mp4', 'webm', 'mov'].includes(ext);

    if (!isImage && !isVideo) {
      const msg = `Unsupported media format: .${ext}. Allowed formats are JPG, PNG, WebP, SVG, GIF, MP4, WebM.`;
      return { success: false, message: msg };
    }

    // 3. Sanitized path
    const folder = options.folder || (isVideo ? 'videos' : 'photos');
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${folder}/${Date.now()}_${cleanName}`;

    try {
      if (onProgress) onProgress(15);
      const { data: uploadData, error: upErr } = await supabase.storage
        .from('site-media')
        .upload(storagePath, file, {
          contentType: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
          cacheControl: '3600',
          upsert: true
        });

      if (upErr) {
        console.error('Media upload error:', upErr);
        return { success: false, message: `Upload failed: ${upErr.message}` };
      }

      if (onProgress) onProgress(85);

      const { data: urlData } = supabase.storage
        .from('site-media')
        .getPublicUrl(storagePath);

      if (onProgress) onProgress(100);

      return {
        success: true,
        url: urlData.publicUrl,
        storagePath: uploadData.path,
        mediaType: isVideo ? 'video' : 'photo',
        fileName: file.name,
        sizeBytes: file.size
      };
    } catch (err) {
      console.error('Media upload exception:', err);
      return { success: false, message: err.message || 'Media upload failed.' };
    }
  };

  // Upload App Binary to Supabase Storage ('apps' bucket)
  const uploadAppFile = async (file, options = {}, onProgress = null) => {
    if (!isAuthorizedAdmin) {
      const msg = 'Unauthorized: Only verified administrators can upload apps.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    if (!isSupabaseConfigured || !supabase) {
      const msg = 'Supabase client is not configured in .env.local.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    // 1. Storage limits check (50MB free-tier budget limit)
    const MAX_FREE_TIER_BYTES = 52428800; // 50MB
    if (file.size > MAX_FREE_TIER_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const msg = `File size (${sizeMb} MB) exceeds Supabase Storage free-tier limit of 50 MB (₹0 budget). Please use an external download link instead.`;
      return {
        success: false,
        limitExceeded: true,
        message: msg
      };
    }

    // 2. Validate MIME / Extension against platform
    const ext = file.name.split('.').pop().toLowerCase();
    const platform = options.platform || 'all';
    if (platform === 'android' && ext !== 'apk') {
      const msg = `Invalid file for Android: Expected .apk package, but received .${ext}`;
      return { success: false, message: msg };
    }
    if (platform === 'windows' && !['exe', 'msi'].includes(ext)) {
      const msg = `Invalid file for Windows: Expected .exe or .msi file, but received .${ext}`;
      return { success: false, message: msg };
    }
    if (!['apk', 'exe', 'msi', 'zip'].includes(ext)) {
      const msg = `Unsupported file type: .${ext}. Allowed formats: .apk, .exe, .msi, .zip`;
      return { success: false, message: msg };
    }

    // 3. Generate sanitized path
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `releases/${Date.now()}_${sanitizedName}`;

    // Determine content type
    let contentType = file.type;
    if (ext === 'apk') contentType = 'application/vnd.android.package-archive';
    else if (ext === 'exe') contentType = 'application/x-msdownload';
    else if (ext === 'msi') contentType = 'application/x-msi';
    else if (ext === 'zip') contentType = 'application/zip';
    if (!contentType) contentType = 'application/octet-stream';

    try {
      if (onProgress) onProgress(15);

      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('apps')
        .upload(storagePath, file, {
          contentType,
          cacheControl: '3600',
          upsert: true
        });

      if (uploadErr) {
        console.error('Supabase storage upload error:', uploadErr);
        return { success: false, message: `Upload failed: ${uploadErr.message}` };
      }

      if (onProgress) onProgress(85);

      const { data: urlData } = supabase.storage
        .from('apps')
        .getPublicUrl(storagePath);

      if (onProgress) onProgress(100);

      return {
        success: true,
        downloadUrl: urlData.publicUrl,
        storagePath: uploadData.path,
        fileType: ext,
        fileSizeBytes: file.size,
        fileName: file.name
      };
    } catch (err) {
      console.error('Supabase upload exception:', err);
      return { success: false, message: `Upload exception: ${err.message}` };
    }
  };

  // Admin Apps: Add App Item
  const addAppItem = async (app) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can add apps.', 'error');
      return { success: false, message: 'Unauthorized' };
    }

    let createdApp = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: inserted, error } = await supabase
          .from('apps')
          .insert([{
            name: app.name,
            category: app.category || 'Software Utility',
            icon: app.icon || 'Grid',
            description: app.description || '',
            download_url: app.downloadUrl || '#',
            github_release_url: app.githubReleaseUrl || null,
            platform: app.platform || 'all',
            pricing_type: app.pricingType || 'free',
            price: app.price ? parseFloat(app.price) : 0.00,
            file_type: app.fileType || null,
            file_size_bytes: app.fileSizeBytes || 0,
            storage_path: app.storagePath || null,
            version: app.version || '1.0.0',
            release_date: app.releaseDate || new Date().toISOString().split('T')[0],
            release_notes: app.releaseNotes || null,
            is_published: app.isPublished !== undefined ? app.isPublished : true
          }])
          .select()
          .single();

        if (error) {
          console.error('Supabase add app error:', error.message);
          showToast(`Error adding app: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }

        createdApp = {
          id: inserted.id,
          name: inserted.name,
          category: inserted.category,
          icon: inserted.icon,
          description: inserted.description,
          downloadUrl: inserted.download_url,
          platform: inserted.platform,
          pricingType: inserted.pricing_type,
          price: inserted.price,
          fileType: inserted.file_type,
          fileSizeBytes: inserted.file_size_bytes,
          storagePath: inserted.storage_path,
          version: inserted.version,
          isPublished: inserted.is_published
        };
      } catch (err) {
        console.error('Supabase app exception:', err.message);
        showToast(`Error adding app: ${err.message}`, 'error');
        return { success: false, message: err.message };
      }
    }

    if (!createdApp) {
      createdApp = { id: 'app-' + Date.now(), ...app, isPublished: true };
    }

    setData(prev => ({
      ...prev,
      apps: [createdApp, ...(prev.apps || [])]
    }));

    showToast('App added to catalog successfully!', 'success');
    return { success: true, app: createdApp };
  };

  // Admin Apps: Delete App Item
  const deleteAppItem = async (id) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can delete apps.', 'error');
      return;
    }

    const appToDelete = data.apps?.find(a => a.id === id);
    if (appToDelete?.storagePath && isSupabaseConfigured && supabase) {
      try {
        await supabase.storage.from('apps').remove([appToDelete.storagePath]);
      } catch (e) {
        console.error('Storage file cleanup note:', e.message);
      }
    }

    setData(prev => ({
      ...prev,
      apps: prev.apps.filter(a => a.id !== id)
    }));

    if (isSupabaseConfigured && supabase && isUUID(id)) {
      try {
        const { error } = await supabase
          .from('apps')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase delete app error:', error.message);
          showToast(`Error deleting app: ${error.message}`, 'error');
        }
      } catch (err) {
        console.error('Supabase delete exception:', err.message);
      }
    }

    showToast('App removed from catalog.', 'info');
  };

  // Admin Apps: Toggle Publish
  const toggleAppPublish = async (id, currentStatus) => {
    if (!isAuthorizedAdmin) {
      showToast('Unauthorized: Only verified administrators can publish or unpublish.', 'error');
      return;
    }
    const newStatus = !currentStatus;
    setData(prev => ({
      ...prev,
      apps: prev.apps.map(a => a.id === id ? { ...a, isPublished: newStatus } : a)
    }));

    if (isSupabaseConfigured && supabase && isUUID(id)) {
      try {
        const { error } = await supabase
          .from('apps')
          .update({ is_published: newStatus })
          .eq('id', id);
        if (error) {
          console.error('Supabase toggle app publish error:', error.message);
          showToast(`Error updating publish status: ${error.message}`, 'error');
          return;
        }
      } catch (err) {
        console.error('Supabase toggle exception:', err.message);
      }
    }
    showToast(`App ${newStatus ? 'published in marketplace' : 'unpublished (draft)'}.`, 'info');
  };

  // Admin Service Pages: Update Page Content (Draft or Publish)
  const updateServicePage = async (pageId, content, isPublish = true) => {
    if (!isAuthorizedAdmin) {
      const msg = 'Unauthorized: Only verified administrators can customize pages.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    const updatedPage = {
      ...content,
      id: pageId,
      isPublished: isPublish ? true : (content.isPublished !== undefined ? content.isPublished : true)
    };

    setData(prev => ({
      ...prev,
      servicePages: {
        ...(prev.servicePages || {}),
        [pageId]: updatedPage
      }
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          page_name: content.pageName,
          title: content.title,
          badge: content.badge || 'FEATURED SERVICE',
          subtitle: content.subtitle,
          hero_description: content.heroDescription,
          cta_text: content.ctaText || 'Contact Us / Request Quote',
          cta_link: content.ctaLink || '#inquiry-form',
          hero_image: content.heroImage,
          sections: content.sections || [],
          faqs: content.faqs || [],
          seo_title: content.seoTitle,
          seo_description: content.seoDescription,
          seo_keywords: content.seoKeywords,
          is_published: isPublish ? true : (content.isPublished !== undefined ? content.isPublished : true),
          draft_content: isPublish ? null : content
        };

        const { error } = await supabase
          .from('service_pages')
          .upsert({ id: pageId, ...payload });

        if (error) {
          console.error('Supabase update service page error:', error.message);
          showToast(`Error saving page: ${error.message}`, 'error');
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.error('Supabase update page exception:', err);
        return { success: false, message: err.message };
      }
    }

    showToast(isPublish ? `${content.pageName || 'Page'} published live successfully!` : 'Draft saved successfully!', 'success');
    return { success: true };
  };

  // Upload Image/Media to Supabase Storage ('site-media' bucket)
  const uploadMediaImage = async (file, options = {}, onProgress = null) => {
    if (!isAuthorizedAdmin) {
      const msg = 'Unauthorized: Only verified administrators can upload media.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    if (!isSupabaseConfigured || !supabase) {
      const msg = 'Supabase client is not configured.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    // 1. Budget check (5 MB free-tier limit)
    const MAX_IMG_BYTES = 5242880; // 5 MB
    if (file.size > MAX_IMG_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const msg = `Image size (${sizeMb} MB) exceeds the 5 MB free-tier limit. Please optimize or choose a smaller image.`;
      return { success: false, message: msg };
    }

    // 2. Validate MIME
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      const msg = `Unsupported image format: ${file.type}. Allowed: JPG, PNG, WebP, SVG.`;
      return { success: false, message: msg };
    }

    // 3. Sanitized path
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const folder = options.folder || 'pages';
    const filePath = `${folder}/${Date.now()}_${cleanName}`;

    try {
      if (onProgress) onProgress(20);
      const { data: uploadData, error: upErr } = await supabase.storage
        .from('site-media')
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: true
        });

      if (upErr) {
        console.error('Media upload error:', upErr);
        return { success: false, message: `Image upload failed: ${upErr.message}` };
      }

      if (onProgress) onProgress(80);

      const { data: urlData } = supabase.storage
        .from('site-media')
        .getPublicUrl(filePath);

      if (onProgress) onProgress(100);

      return {
        success: true,
        url: urlData.publicUrl,
        storagePath: uploadData.path,
        fileName: file.name,
        sizeBytes: file.size
      };
    } catch (err) {
      console.error('Media upload exception:', err);
      return { success: false, message: err.message || 'Image upload failed.' };
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...data,
        isDrawerOpen,
        setIsDrawerOpen,
        currentUser,
        isAuthorizedAdmin,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        toast,
        showToast,
        adminLogin,
        adminSignUp,
        adminLogout,
        updateAdminPassword,
        requestAdminEmailChange,
        sendAdminPasswordReset,
        loadSupabaseData,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        updateSettings,
        updateAppearance,
        addWebProject,
        updateWebProject,
        deleteWebProject,
        toggleWebProjectPublish,
        addElectricianGallery,
        updateElectricianGallery,
        deleteElectricianGallery,
        toggleElectricianGalleryPublish,
        addTourDestination,
        updateTourDestination,
        deleteTourDestination,
        toggleTourDestinationPublish,
        addAppItem,
        uploadAppFile,
        deleteAppItem,
        toggleAppPublish,
        updateServicePage,
        uploadMediaImage,
        uploadMediaFile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
