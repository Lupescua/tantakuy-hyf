'use client';
import { createContext, useContext, useState } from 'react';

const MobileSearchContext = createContext();

export function MobileSearchProvider({ children }) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const toggleMobileSearch = () => {
    setShowMobileSearch((prev) => !prev);
  };

  return (
    <MobileSearchContext.Provider
      value={{ showMobileSearch, toggleMobileSearch }}
    >
      {children}
    </MobileSearchContext.Provider>
  );
}

// Hook to use in components
export function useMobileSearch() {
  return useContext(MobileSearchContext);
}
