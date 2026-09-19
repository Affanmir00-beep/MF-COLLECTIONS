import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import NavDrawer from './components/layout/NavDrawer';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import CheckoutModal from './components/checkout/CheckoutModal';
import useUIStore from './store/uiStore';

// Public Pages (Lazy loaded)
const HomePage = lazy(() => import('./pages/HomePage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ShippingPage = lazy(() => import('./pages/ShippingPage'));
const ExchangePage = lazy(() => import('./pages/ExchangePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQsPage = lazy(() => import('./pages/FAQsPage'));
const SizeGuidePage = lazy(() => import('./pages/SizeGuidePage'));
const CustomOrdersPage = lazy(() => import('./pages/CustomOrdersPage'));

// Auth Pages (Lazy loaded)
const AuthPage = lazy(() => import('./pages/auth/AuthPage'));
const OtpAuthPage = lazy(() => import('./pages/auth/OtpAuthPage'));
const ProfilePage = lazy(() => import('./pages/auth/ProfilePage'));

// Admin Pages (Lazy loaded)
const AdminRouteGuard = lazy(() => import('./components/admin/AdminRouteGuard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminHomePageConfig = lazy(() => import('./pages/admin/AdminHomePage'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));

function App() {
  const isNavOpen = useUIStore(state => state.isNavOpen);
  const closeNav = useUIStore(state => state.closeNav);
  const toggleNav = useUIStore(state => state.toggleNav);
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Fallback clientId for development if env var is missing
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id-here.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="flex flex-col min-h-screen font-sans bg-white text-[#111111] overflow-x-hidden">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-sans tracking-widest uppercase">Loading...</div>}>
          <Routes>
            {/* Protected Admin Routes (Admin Layout applied inside Guard) */}
            <Route path="/admin" element={<AdminRouteGuard />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="storefront" element={<AdminHomePageConfig />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>

            {/* Public Routes with standard Layout */}
            <Route path="/*" element={
              <>
                <AnnouncementBar />
                <Navbar onOpenMobileMenu={toggleNav} />
                <NavDrawer isOpen={isNavOpen} onClose={closeNav} />
                <CartDrawer onCheckoutClick={() => setIsCheckoutOpen(true)} />
                <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/signup" element={<AuthPage />} />
                    <Route path="/otp-verify" element={<OtpAuthPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/collections/:handle" element={<CollectionPage />} />
                  <Route path="/collections/:handle/products/:id" element={<ProductDetailPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/shipping" element={<ShippingPage />} />
                  <Route path="/exchange" element={<ExchangePage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faqs" element={<FAQsPage />} />
                  <Route path="/size-guide" element={<SizeGuidePage />} />
                  <Route path="/custom-orders" element={<CustomOrdersPage />} />
                </Routes>
              </main>

              <Footer />

              {/* Floating WhatsApp Button */}
              <a 
                href="https://wa.me/923117121215" 
                target="_blank" 
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-40 flex items-center justify-center"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-8 h-8" />
              </a>
            </>
          } />
        </Routes>
      </Suspense>
    </div>
    </GoogleOAuthProvider>
  );
}

export default App;
