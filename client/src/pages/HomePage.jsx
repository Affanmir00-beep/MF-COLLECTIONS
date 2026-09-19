import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import HeroSlider from '../components/home/HeroSlider';
import CollectionsGrid from '../components/home/CollectionsGrid';
import WatchAndBuy from '../components/home/WatchAndBuy';
import PromoGrid from '../components/home/PromoGrid';
import NewInSection from '../components/home/NewInSection';
import FormalsSplit from '../components/home/FormalsSplit';
import CoOrdsPromo from '../components/home/CoOrdsPromo';
import StoreLocator from '../components/home/StoreLocator';
import SpottedGallery from '../components/home/SpottedGallery';

const HomePage = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchConfig = async () => {
      try {
        const { data } = await apiClient.get('/content/homepage');
        setConfig(data);
      } catch (err) {
        console.error('Failed to load homepage config', err);
        setConfig({ error: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // Render all sections immediately — each component shows its own skeleton while loading=true
  if (config?.error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <h2 className="text-2xl font-serif text-red-600 mb-4">Error Loading Storefront</h2>
        <p className="text-gray-600 font-sans">{config.error}</p>
        <p className="text-xs mt-4 text-gray-400">If you are using the free Render tier, please wait 50 seconds and refresh.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <HeroSlider data={config?.heroSlider} loading={loading} />
      <CollectionsGrid data={config?.collectionsGrid} loading={loading} />
      <WatchAndBuy data={config?.watchAndBuy} loading={loading} />
      <PromoGrid data={config?.promoGrid} loading={loading} />
      <NewInSection data={config?.newInBanner} loading={loading} />
      <FormalsSplit data={config?.formalsSplit} loading={loading} />
      <CoOrdsPromo data={config?.coOrdsBanner} loading={loading} />
      <StoreLocator data={config?.storeLocatorBanner} loading={loading} />
      <SpottedGallery data={config?.spottedGallery} loading={loading} />
    </div>
  );
};

export default HomePage;
