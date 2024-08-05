'use client';

import React, { createContext, useState, useContext, useCallback } from 'react';

interface ProductContextType {
  productsUpdated: boolean;
  setProductsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productsUpdated, setProductsUpdated] = useState(false);

  return (
    <ProductContext.Provider value={{ productsUpdated, setProductsUpdated }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};
