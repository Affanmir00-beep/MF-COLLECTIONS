import React, { useEffect } from 'react';
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
  const [config, setConfig] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchConfig = async () => {
      try {
        const { data } = await import('axios').then(axios => axios.default.get('/api/v1/content/homepage'));
        setConfig(data);
      } catch (err) {
        console.error('Failed to load homepage config', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center font-sans tracking-widest text-sm uppercase">Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      <HeroSlider data={config?.heroSlider} />
      <CollectionsGrid data={config?.collectionsGrid} />
      <WatchAndBuy data={config?.watchAndBuy} />
      <PromoGrid data={config?.promoGrid} />
      <NewInSection data={config?.newInBanner} />
      <FormalsSplit data={config?.formalsSplit} />
      <CoOrdsPromo data={config?.coOrdsBanner} />
      <StoreLocator data={config?.storeLocatorBanner} />
      <SpottedGallery data={config?.spottedGallery} />
    </div>
  );
};

export default HomePage;
