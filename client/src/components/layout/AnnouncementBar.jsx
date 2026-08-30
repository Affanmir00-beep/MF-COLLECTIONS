import React, { useState, useEffect } from 'react';
import { mockApi } from '../../data/mockApi';
import { mockData } from '../../data/mockData';

const AnnouncementBar = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // In a real app we might fetch this, here we can just use the mockData object synchronously or pretend to fetch
    setAnnouncements(mockData.announcements);
  }, []);

  if (!announcements.length) return null;

  return (
    <div className="bg-[var(--color-accent)] text-[#FAF8F5] text-[11px] md:text-[13px] py-2 overflow-hidden whitespace-nowrap flex items-center w-full">
      <div className="flex w-max animate-marquee">
        {/* Duplicate the items multiple times for a seamless infinite scroll effect */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center shrink-0">
            {announcements.map((text, j) => (
              <React.Fragment key={`${i}-${j}`}>
                <span className="mx-8 mf-label text-[#FAF8F5] tracking-[0.1em]">{text}</span>
                <span className="text-[#FAF8F5]/30 text-[10px]">•</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
