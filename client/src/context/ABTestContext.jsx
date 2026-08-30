import React, { createContext, useContext, useState, useEffect } from 'react';

// Basic A/B Testing Context
const ABTestContext = createContext();

export const ABTestProvider = ({ children }) => {
  const [variants, setVariants] = useState({});

  useEffect(() => {
    // In a real scenario, this could fetch assigned variants from an API
    // For now, we randomly assign user to a variant (e.g., A/B test for Product Grid Layout)
    const storedVariants = localStorage.getItem('ab_variants');
    if (storedVariants) {
      setVariants(JSON.parse(storedVariants));
    } else {
      const newVariants = {
        productGridTest: Math.random() > 0.5 ? 'variant_A' : 'variant_B',
      };
      localStorage.setItem('ab_variants', JSON.stringify(newVariants));
      setVariants(newVariants);
    }
  }, []);

  return (
    <ABTestContext.Provider value={{ variants }}>
      {children}
    </ABTestContext.Provider>
  );
};

export const useABTest = () => {
  return useContext(ABTestContext);
};
