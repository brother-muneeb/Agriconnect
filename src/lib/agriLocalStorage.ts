
import { Product } from '../types';

export interface AgriDataEntry {
  rate: number;
  discount: number;
  timerEnd: string | null;
}

export interface AgriConnectData {
  [productName: string]: AgriDataEntry;
}

const STORAGE_KEY = 'AgriConnectData';

export const getAgriData = (): AgriConnectData => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

export const saveAgriData = (data: AgriConnectData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const updateProductInAgriData = (name: string, entry: Partial<AgriDataEntry>) => {
  const data = getAgriData();
  data[name] = {
    ...data[name],
    ...entry
  };
  saveAgriData(data);
  if (window.refreshAllPrices) {
    window.refreshAllPrices();
  }
};

export const initAgriData = (products: Product[]) => {
  const existing = getAgriData();
  let changed = false;
  
  products.forEach(p => {
    if (!existing[p.name]) {
      existing[p.name] = {
        rate: p.price,
        discount: p.discountPercent || 0,
        timerEnd: p.discountEnd || null
      };
      changed = true;
    } else if (existing[p.name].rate !== p.price) {
      existing[p.name].rate = p.price;
      changed = true;
    }
  });

  if (changed) {
    saveAgriData(existing);
  }
};

// Global types for window extensions
declare global {
  interface Window {
    refreshAllPrices: () => void;
    updateProductInAgriData: (name: string, update: Partial<AgriDataEntry>) => void;
  }
}

export const refreshAllPrices = () => {
  const data = getAgriData();
  const now = new Date().getTime();
  let dataChanged = false;

  Object.entries(data).forEach(([name, entry]) => {
    // Check for timer expiration
    if (entry.timerEnd) {
      const end = new Date(entry.timerEnd).getTime();
      if (now >= end) {
        entry.discount = 0;
        entry.timerEnd = null;
        dataChanged = true;
      }
    }

    const discountedPrice = Math.round(entry.rate * (1 - entry.discount / 100));

    // Update ALL elements with this product name
    const elements = document.querySelectorAll(`[data-product-name="${name}"]`);
    elements.forEach((el) => {
      // 1. Update Price elements
      const priceEl = el.querySelector('[data-type="price"]');
      const strikethroughEl = el.querySelector('[data-type="strikethrough"]');
      const badgeEl = el.querySelector('[data-type="badge"]');
      const timerEl = el.querySelector('[data-type="timer"]');
      const rateColEl = el.querySelector('[data-type="rate-column"]');
      const discountColEl = el.querySelector('[data-type="discount-column"]');

      // Rate List Logic (KisanTips)
      if (rateColEl) {
        rateColEl.innerHTML = `Rs. ${entry.rate}`;
      }
      if (discountColEl) {
        discountColEl.innerHTML = `${entry.discount}%`;
        discountColEl.className = entry.discount > 0 ? "px-6 py-5 text-red-600 font-black text-xl" : "px-6 py-5 text-gray-400 font-bold";
      }

      // Product Card Logic
      if (entry.discount > 0) {
        if (badgeEl) {
          badgeEl.innerHTML = `${entry.discount}% OFF`;
          (badgeEl as HTMLElement).style.display = 'block';
        }
        if (strikethroughEl) {
          strikethroughEl.innerHTML = `Rs. ${entry.rate}`;
          (strikethroughEl as HTMLElement).style.display = 'inline';
        }
        if (priceEl) {
          priceEl.innerHTML = `Rs. ${discountedPrice}`;
          (priceEl as HTMLElement).style.color = '#16a34a'; // text-green-600
        }
      } else {
        if (badgeEl) (badgeEl as HTMLElement).style.display = 'none';
        if (strikethroughEl) (strikethroughEl as HTMLElement).style.display = 'none';
        if (priceEl) {
          priceEl.innerHTML = `Rs. ${entry.rate}`;
          (priceEl as HTMLElement).style.color = '#2d5a27'; // agri-green default
        }
      }

      // Timer Logic
      if (timerEl) {
        if (entry.timerEnd) {
          const end = new Date(entry.timerEnd).getTime();
          const diff = end - now;
          if (diff > 0) {
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            timerEl.innerHTML = `${h}h ${m}m ${s}s`;
            (timerEl as HTMLElement).style.display = 'flex';
          } else {
            (timerEl as HTMLElement).style.display = 'none';
          }
        } else {
          (timerEl as HTMLElement).style.display = 'none';
        }
      }
    });
  });

  if (dataChanged) {
    saveAgriData(data);
  }
};

// Expose to window
if (typeof window !== 'undefined') {
  (window as any).refreshAllPrices = refreshAllPrices;
  (window as any).updateProductInAgriData = updateProductInAgriData;
}
