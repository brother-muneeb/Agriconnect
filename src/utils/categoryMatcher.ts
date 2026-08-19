export interface ProductCategoryMapping {
  key: string;
  labelEN: string;
  labelRU: string;
  icon: string;
  categoryNames: string[];
  keywords: string[];
}

export const PRODUCT_CATEGORIES: ProductCategoryMapping[] = [
  {
    key: 'vegetables',
    labelEN: 'Vegetables',
    labelRU: 'Sabziyaan',
    icon: '🥬',
    categoryNames: [
      'vegetables', 'vegetable', 'sabziyaan', 'sabzi', 'sabziyan', 'sabziyaat',
      'rozmarra wali', 'patti wali', 'aam sabziyaan', 'khaas sabziyaan', 'daily vegetables', 'leafy vegetables', 'special vegetables'
    ],
    keywords: [
      'aalu', 'aalo', 'potato', 'potatoes', 'pyaz', 'piyaz', 'onion', 'onions', 'tamatar', 'tomato', 'tomatoes',
      'lehsan', 'garlic', 'adrak', 'ginger', 'hari mirch', 'green chilli', 'chilli', 'mirch',
      'gobi', 'cauliflower', 'band gobi', 'cabbage', 'red cabbage', 'palak', 'spinach', 'methi', 'fenugreek',
      'saag', 'mustard greens', 'dhaniya', 'coriander', 'pudina', 'mint', 'bhindi', 'okra', 'lady finger', 'ladyfinger',
      'baingan', 'eggplant', 'brinjal', 'shimla mirch', 'capsicum', 'bell pepper', 'kheera', 'cucumber',
      'karela', 'bitter gourd', 'tinda', 'apple gourd', 'loki', 'kaddu', 'bottle gourd', 'pumpkin', 'halwa kaddu',
      'tori', 'ridge gourd', 'gajar', 'carrot', 'carrots', 'mooli', 'radish', 'shalgam', 'turnip',
      'chukandar', 'beetroot', 'matar', 'green peas', 'peas', 'arvi', 'taro', 'taro root', 'mushroom', 'mushrooms',
      'khumbi', 'broccoli', 'baby corn', 'zucchini', 'lemon', 'lemons', 'leemo'
    ]
  },
  {
    key: 'fruits',
    labelEN: 'Fruits',
    labelRU: 'Phal',
    icon: '🍎',
    categoryNames: [
      'fruits', 'fruit', 'phal', 'aam phal', 'mausami phal', 'khaas phal', 'fresh fruits', 'seasonal fruits'
    ],
    keywords: [
      'kino', 'kinnow', 'mandarin', 'orange', 'malta', 'mausami', 'sweet lime', 'grapefruit', 'chakotra',
      'chaunsa', 'anwar ratol', 'sindhri', 'langra', 'dussehri', 'aam', 'mango', 'mangoes',
      'saib', 'apple', 'apples', 'kala kullu', 'gacha saib', 'kela', 'banana', 'bananas',
      'amrood', 'guava', 'kharbooza', 'melon', 'cantaloupe', 'tarbooz', 'watermelon',
      'anaar', 'pomegranate', 'angoor', 'grapes', 'sundarkhani', 'gola', 'pappita', 'papaya',
      'aaroo', 'peach', 'peaches', 'aloobukhara', 'plum', 'plums', 'nashpati', 'pear', 'pears',
      'chiku', 'sapodilla', 'jaman', 'black plum', 'falsa', 'grewia', 'strawberry', 'strawberries',
      'cherry', 'cherries', 'lychee', 'dragon fruit', 'kiwi', 'avocado', 'fresh figs'
    ]
  },
  {
    key: 'grains',
    labelEN: 'Grains & Pulses',
    labelRU: 'Anaaj Aur Daalein',
    icon: '🌾',
    categoryNames: [
      'grains', 'grain', 'anaaj', 'anaj', 'aam anaaj', 'daliyan', 'chawal ki kismein', 'khaas anaaj', 'pulses', 'daalein', 'daal'
    ],
    keywords: [
      'gehun', 'gandum', 'wheat', 'wheat flour', 'atta', 'chakki atta', 'desi gandum', 'organic atta',
      'chawal', 'rice', 'basmati', 'super basmati', 'kainat', '1121', 'saila', 'tota', 'brown rice',
      'makai', 'corn', 'corn flour', 'makai ka atta', 'jau', 'barley', 'bajra', 'millet', 'pearl millet',
      'jowar', 'sorghum', 'daliya', 'daliyan', 'porridge', 'oats',
      'daal', 'daal chana', 'daal moong', 'daal masoor', 'daal mash', 'lentil', 'lentils',
      'kala chana', 'safaid chana', 'chana', 'chickpeas', 'lobia', 'white beans', 'kidney beans', 'rajma',
      'moongphali', 'peanuts', 'til', 'sesame', 'sarson', 'mustard seed', 'sunflower seeds', 'surajmukhi',
      'canola', 'choker', 'kunda', 'khal', 'wanda', 'cattle feed', 'rice polish', 'makai khal'
    ]
  },
  {
    key: 'dryfruits',
    labelEN: 'Dry Fruits',
    labelRU: 'Khushk Mewa',
    icon: '🥜',
    categoryNames: [
      'dry fruits', 'dry fruit', 'dryfruits', 'khushk mewa', 'aam dry fruits', 'seeds walay', 'meethy dry fruits', 'khaas dry fruits'
    ],
    keywords: [
      'badam', 'almond', 'almonds', 'kaju', 'cashew', 'cashews', 'pista', 'pistachio', 'pistachios',
      'akhrot', 'walnut', 'walnuts', 'kishmish', 'raisins', 'dry figs', 'injeer', 'anjeer', 'khajoor', 'dates',
      'ajwa', 'mabroom', 'aseel', 'chilgoza', 'pine nuts', 'khobani', 'dry apricot', 'apricots',
      'munakka', 'zafran', 'saffron', 'alsi', 'flax seeds', 'chia seeds', 'char maghaz', 'maghaz',
      'kaddu ke beej', 'pumpkin seeds', 'revdi', 'gajak', 'til patti', 'gurr', 'jaggery', 'shakar'
    ]
  },
  {
    key: 'seeds',
    labelEN: 'Seeds',
    labelRU: 'Beej',
    icon: '🌱',
    categoryNames: ['seeds', 'seed', 'beej', 'tukhme'],
    keywords: ['beej', 'seed', 'seeds', 'tukhme', 'hybrid seed', 'desi beej']
  },
  {
    key: 'fertilizer',
    labelEN: 'Fertilizer',
    labelRU: 'Khaad',
    icon: '🧪',
    categoryNames: ['fertilizer', 'fertilizers', 'khaad', 'khad'],
    keywords: ['khaad', 'khad', 'fertilizer', 'urea', 'dap', 'sop', 'potash', 'gobar', 'compost', 'vermicompost']
  },
  {
    key: 'dairy',
    labelEN: 'Dairy Products',
    labelRU: 'Dairy Products',
    icon: '🥛',
    categoryNames: ['dairy', 'dairy products', 'doodh', 'milk'],
    keywords: ['doodh', 'milk', 'makhan', 'butter', 'ghee', 'desi ghee', 'paneer', 'cheese', 'khoya', 'dahi', 'yogurt', 'lassi']
  }
];

/**
 * Determines which category a product item belongs to.
 */
export function classifyItemCategory(product: { name: string; category?: string }): string | null {
  const cat = (product.category || '').toLowerCase().trim();
  const name = (product.name || '').toLowerCase().trim();

  // 1. Check direct category names
  for (const catDef of PRODUCT_CATEGORIES) {
    if (cat && catDef.categoryNames.some(cName => cat.includes(cName) || cName.includes(cat))) {
      return catDef.key;
    }
  }

  // 2. Check keywords in item name
  for (const catDef of PRODUCT_CATEGORIES) {
    if (catDef.keywords.some(kw => name.includes(kw) || kw.includes(name))) {
      return catDef.key;
    }
  }

  return null;
}

/**
 * Checks if an individual product matches the seller's selected products/categories.
 */
export function doesItemMatchSeller(
  product: { name: string; category?: string },
  sellerProducts: string[]
): boolean {
  if (!sellerProducts || sellerProducts.length === 0) return true;

  const normalizedSellerOpts = sellerProducts.map(p => p.toLowerCase().trim());
  const prodName = (product.name || '').toLowerCase().trim();
  const prodCategory = (product.category || '').toLowerCase().trim();

  // 1. Direct name match with custom product tag
  for (const opt of normalizedSellerOpts) {
    if (prodName.includes(opt) || opt.includes(prodName)) {
      return true;
    }
    if (prodCategory && (prodCategory.includes(opt) || opt.includes(prodCategory))) {
      return true;
    }
  }

  // 2. Check if product category matches seller's category selection
  const itemCategoryKey = classifyItemCategory(product);

  for (const opt of normalizedSellerOpts) {
    // Check if opt represents one of the major categories
    for (const catDef of PRODUCT_CATEGORIES) {
      const matchesCatDef = 
        opt === catDef.key ||
        opt === catDef.labelEN.toLowerCase() ||
        opt === catDef.labelRU.toLowerCase() ||
        catDef.categoryNames.some(cn => opt.includes(cn) || cn.includes(opt));

      if (matchesCatDef) {
        // If this seller sells this category, does our item belong to this category?
        if (itemCategoryKey === catDef.key) {
          return true;
        }
        // Also check if item name matches keywords of this category
        if (catDef.keywords.some(kw => prodName.includes(kw) || kw.includes(prodName))) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Filters an order to include only the items relevant to this seller.
 * Returns null if the order contains NO items matching what the seller sells.
 */
export function filterOrderForSeller(order: any, sellerProducts: string[]) {
  if (!order) return null;
  const products = order.products || [];

  // If no seller products specified, seller sees all products
  if (!sellerProducts || sellerProducts.length === 0) {
    return {
      ...order,
      sellerItems: products,
      sellerTotal: order.orderSummary?.total || 0,
      totalMatchedItemsCount: products.length
    };
  }

  const matchingItems = products.filter((item: any) => doesItemMatchSeller(item, sellerProducts));

  if (matchingItems.length === 0) {
    return null; // Exclude this order completely
  }

  const sellerSubtotal = matchingItems.reduce((acc: number, item: any) => {
    return acc + (item.totalPrice || item.finalPrice || (item.price * (item.quantity || 1)) || 0);
  }, 0);

  return {
    ...order,
    sellerItems: matchingItems,
    sellerTotal: sellerSubtotal,
    totalMatchedItemsCount: matchingItems.length
  };
}
