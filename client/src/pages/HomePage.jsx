import React, { useEffect } from 'react';
import HeroSlider from '../components/home/HeroSlider';
import CategoryBanners from '../components/home/CategoryBanners';
import TabbedProductGrid from '../components/home/TabbedProductGrid';
import WatchAndBuy from '../components/home/WatchAndBuy';
import EditorialSplit from '../components/home/EditorialSplit';
import ValueProps from '../components/home/ValueProps';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-fade-in">
      <HeroSlider />
      <ValueProps />
      <CategoryBanners />
      <WatchAndBuy />
      <TabbedProductGrid />
      <EditorialSplit />
    </div>
  );
};

export default HomePage;
