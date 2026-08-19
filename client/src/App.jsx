import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import NavDrawer from './components/layout/NavDrawer';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import CheckoutModal from './components/checkout/CheckoutModal';

import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductDetailPage from './pages/ProductDetailPage';

function App() {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar onOpenMobileMenu={() => setIsNavDrawerOpen(true)} />
      <NavDrawer isOpen={isNavDrawerOpen} onClose={() => setIsNavDrawerOpen(false)} />
      <CartDrawer onCheckoutClick={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          {/* Add more routes here */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
