import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileDrawer from './components/MobileDrawer';
import HeroParticles from './components/HeroParticles';
import Toast from './components/Toast';

import HomePage from './pages/HomePage';
import WebDevPage from './pages/WebDevPage';
import ElectricianPage from './pages/ElectricianPage';
import TourTravelPage from './pages/TourTravelPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AppsPage from './pages/AppsPage';
import AdminDashboard from './pages/AdminDashboard';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-cyan-500 selection:text-black">
          
          {/* Dynamic Electric Particle Background */}
          <HeroParticles />

          {/* Navigation Bar */}
          <Navbar />

          {/* Mobile & Desktop Hamburger Side Drawer */}
          <MobileDrawer />

          {/* Main Content View */}
          <main className="flex-grow relative z-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services/web-development" element={<WebDevPage />} />
              <Route path="/services/electrician" element={<ElectricianPage />} />
              <Route path="/services/tour-travel" element={<TourTravelPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/apps" element={<AppsPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Toast Notification Container */}
          <Toast />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
