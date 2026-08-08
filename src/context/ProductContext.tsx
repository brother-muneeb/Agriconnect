import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { vegetables as initialVegetables } from '../data/vegetables';
import { fruits as initialFruits } from '../data/fruits';
import { dryfruits as initialDryFruits } from '../data/dryfruits';
import { grains as initialGrains } from '../data/grains';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, writeBatch, query, orderBy } from 'firebase/firestore';
import { initAgriData, updateProductInAgriData, refreshAllPrices } from '../lib/agriLocalStorage';

interface ProductContextType {
  allProducts: Product[];
  updateProductPrice: (id: number, newPrice: number) => void;
  updateProductDiscount: (id: number, discount: { percent: number, start: string, end: string } | null, productName?: string) => void;
  lastUpdated: string;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(() => {
    return localStorage.getItem('agriconnect_last_updated') || new Date().toLocaleString();
  });
  const hasSynced = useRef(false);

  useEffect(() => {
    const productsCollection = collection(db, 'products');
    const q = query(productsCollection, orderBy('id', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Seed initial data if Firestore is empty
        seedInitialData();
      } else {
        const productsData = snapshot.docs.map(doc => ({
          ...doc.data()
        } as Product));
        setAllProducts(productsData);
        
        // Synchronize local static data updates (such as newly updated image links or descriptions) with Firestore
        syncLocalData(productsData);
        
        // Initialize localStorage data manager
        initAgriData(productsData);
        // Initial refresh
        setTimeout(refreshAllPrices, 100);
        
        setLoading(false);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    // Start global refresh interval (every 1 second)
    const interval = setInterval(refreshAllPrices, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const seedInitialData = async () => {
    try {
      const batch = writeBatch(db);
      const initialData = [...initialVegetables, ...initialFruits, ...initialDryFruits, ...initialGrains];
      
      initialData.forEach(product => {
        const productRef = doc(db, 'products', product.id.toString());
        batch.set(productRef, product);
      });
      
      await batch.commit();
      console.log('Initial data seeded to Firestore');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products/seed');
    }
  };

  const syncLocalData = async (firestoreProducts: Product[]) => {
    try {
      const initialData = [...initialVegetables, ...initialFruits, ...initialDryFruits, ...initialGrains];
      const batch = writeBatch(db);
      let hasChanges = false;

      initialData.forEach(localProduct => {
        const dbProduct = firestoreProducts.find(p => p.id === localProduct.id);
        if (!dbProduct) {
          // If a new product was added locally in files, seed it to Firestore
          const productRef = doc(db, 'products', localProduct.id.toString());
          batch.set(productRef, localProduct);
          hasChanges = true;
        } else {
          // Compare and sync local properties to database
          const updates: Partial<Product> = {};
          
          if (localProduct.image !== dbProduct.image) {
            updates.image = localProduct.image;
          }
          if (localProduct.description !== dbProduct.description) {
            updates.description = localProduct.description;
          }
          if (localProduct.name !== dbProduct.name) {
            updates.name = localProduct.name;
          }
          if (localProduct.nameEnglish !== dbProduct.nameEnglish) {
            updates.nameEnglish = localProduct.nameEnglish;
          }
          if (localProduct.category !== dbProduct.category) {
            updates.category = localProduct.category;
          }
          if (localProduct.unit !== dbProduct.unit) {
            updates.unit = localProduct.unit;
          }
          if (localProduct.price !== dbProduct.price) {
            updates.price = localProduct.price;
          }

          if (Object.keys(updates).length > 0) {
            const productRef = doc(db, 'products', localProduct.id.toString());
            batch.update(productRef, updates);
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        await batch.commit();
        console.log('Local code-level edits (image links, etc.) have been synchronized with Firestore successfully!');
      }
    } catch (error) {
      console.error('Error synchronizing local data to Firestore:', error);
    }
  };

  const updateProductPrice = async (id: number, newPrice: number) => {
    try {
      const product = allProducts.find(p => p.id === id);
      if (product) {
        // Update localStorage
        updateProductInAgriData(product.name, { rate: newPrice });
      }

      const productRef = doc(db, 'products', id.toString());
      await updateDoc(productRef, { price: newPrice });
      
      const now = new Date().toLocaleString();
      setLastUpdated(now);
      localStorage.setItem('agriconnect_last_updated', now);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const updateProductDiscount = async (id: number, discount: { percent: number, start: string, end: string } | null, productName?: string) => {
    try {
      const pName = productName || allProducts.find(p => p.id === id)?.name;
      if (pName) {
        // Update localStorage
        updateProductInAgriData(pName, { 
          discount: discount ? discount.percent : 0,
          timerEnd: (discount && discount.end) ? discount.end : null
        });
      }

      const productRef = doc(db, 'products', id.toString());
      await updateDoc(productRef, { 
        discountPercent: discount ? discount.percent : null,
        discountStart: (discount && discount.start) ? discount.start : null,
        discountEnd: (discount && discount.end) ? discount.end : null
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  return (
    <ProductContext.Provider value={{ allProducts, updateProductPrice, updateProductDiscount, lastUpdated, loading }}>
      {children}
    </ProductContext.Provider>
  );
};
