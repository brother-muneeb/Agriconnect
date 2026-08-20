export interface ProductCategoryMapping {
  key: string;
  labelEN: string;
  labelRU: string;
  icon: string;
  categoryNames: string[];
  keywords: string[];
}

// -------------------------------------------------------------
// PUNJAB CITIES LIST FOR LOCATION MATCHING
// -------------------------------------------------------------
export const PUNJAB_CITIES = [
  'Lahore', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 'Multan', 'Sialkot',
  'Bahawalpur', 'Sargodha', 'Gujrat', 'Sheikhupura', 'Sahiwal', 'Wazirabad',
  'Kasur', 'Okara', 'Khanewal', 'Hafizabad', 'Chiniot', 'Vehari', 'Narowal',
  'Mianwali', 'Pakpattan', 'Attock', 'Chakwal', 'Jhelum', 'Khushab',
  'Muzaffargarh', 'Layyah', 'Lodhran', 'Rahim Yar Khan', 'Jhang'
];

export function isPunjabCity(cityName?: string): boolean {
  if (!cityName) return false;
  const c = cityName.toLowerCase().trim();
  if (c.includes('punjab')) return true;
  if (c === 'gujarat' || c === 'gujrat') return true;
  return PUNJAB_CITIES.some(pCity => {
    const norm = pCity.toLowerCase().trim();
    return c === norm || c.includes(norm) || norm.includes(c);
  });
}

// -------------------------------------------------------------
// EXACT CATEGORY PRODUCT DEFINITIONS
// -------------------------------------------------------------
export const VEGETABLES_PRODUCTS = [
  'Potato', 'Onion', 'Tomato', 'Garlic', 'Ginger', 'Green Chili', 'Coriander',
  'Mint', 'Spinach', 'Fenugreek', 'Mustard Greens', 'Radish Leaves', 'Dill',
  'Carrot', 'Radish', 'Turnip', 'Taro', 'Cucumber', 'Apple Gourd', 'Bitter Gourd',
  'Bottle Gourd', 'Pumpkin', 'Eggplant', 'Cauliflower', 'Capsicum', 'Peas',
  'Hyacinth Bean', 'Okra', 'Ridge Gourd', 'Jackfruit', 'Lotus Root', 'Broccoli',
  'Turmeric', 'Red Chili', 'Cluster Beans', 'Snake Gourd', 'Wild Melon',
  'Sweet Pumpkin', 'Zucchini', 'Cherry Tomato', 'Red Lobiya'
];

export const FRUITS_PRODUCTS = [
  'Mango', 'Kinnow', 'Guava', 'Banana', 'Apple', 'Pear', 'Grapes', 'Watermelon',
  'Cantaloupe', 'Pomegranate', 'Blood Orange', 'Lemon', 'Grapefruit', 'Mandarin',
  'Phalsa Berry', 'Lychee', 'Black Plum', 'Plum', 'Apricot', 'Persimmon',
  'Sapodilla', 'Papaya', 'Jujube', 'Mud Apple', 'Tamarind', 'Strawberry',
  'Dates', 'Figs', 'Olive', 'Nectarine', 'Peach', 'Cherry', 'Kiwi', 'Loquat',
  'Dragon Fruit', 'Pineapple', 'Mulberry', 'Wood Apple'
];

export const DRY_FRUITS_PRODUCTS = [
  'Walnuts', 'Almonds', 'Raisins', 'Pistachios', 'Cashews', 'Peanuts',
  'Pine Nuts', 'Dried Figs', 'Dried Peach', 'Sesame Seeds', 'Nigella Seeds',
  'Flax Seeds', 'Sunflower Seeds', 'Pumpkin Seeds', 'Dried Melon Seeds',
  'Chia Seeds', 'Poppy Seeds', 'Fenugreek Seeds', 'Fennel Seeds', 'Dried Grapes',
  'Dried Apricot', 'Dried Plum', 'Dried Mulberry', 'Dried Cranberry',
  'Dried Blueberry', 'Dried Mango', 'Dried Coconut', 'Dried Pineapple',
  'Tragacanth Gum', 'Mixed Nuts', 'Saffron', 'Fox Nuts', 'Beetroot Chips',
  'Dry Cherry', 'Sweet Potato Chips', 'Dried Amla', 'Dried Tamarind',
  'Dried Raw Mango', 'Dried Dates', 'Dry Coconut'
];

export const GRAINS_PRODUCTS = [
  'Wheat', 'Red Rice', 'Corn', 'Barley', 'Pearl Millet', 'Sorghum', 'Cowpeas',
  'Red Lentils', 'Green Lentils', 'Black Lentils', 'Mung Beans', 'Split Peas',
  'Pigeon Peas', 'Red Kidney Beans', 'Garbanzo Beans', 'Moth Beans', 'Horse Gram',
  'Whole Red Lentils', 'Whole Green Lentils', 'Split Chickpeas', 'Basmati Rice',
  'Parboiled Rice', 'Brown Rice', 'Kalijeera Rice', 'Sugdasi Rice', 'Chinor Rice',
  'Super Kernel Rice', 'Irri Rice', 'Jasmine Rice', 'Quinoa', 'Oats', 'Buckwheat',
  'Rye', 'Amaranth', 'Finger Millet', 'Soya Beans', 'Flaxseed', 'Hemp Seeds', 'Teff'
];

// Product name aliases for cross-language (Urdu / Roman Urdu / English) keyword matching
export const PRODUCT_ALIASES: Record<string, string[]> = {
  // Vegetables
  'Potato': ['aalu', 'aalo', 'potato', 'potatoes', 'patata'],
  'Onion': ['pyaz', 'piyaz', 'onion', 'onions', 'piaz'],
  'Tomato': ['tamatar', 'tomato', 'tomatoes'],
  'Garlic': ['lehsan', 'lahsan', 'garlic'],
  'Ginger': ['adrak', 'adrakh', 'ginger'],
  'Green Chili': ['hari mirch', 'green chilli', 'green chili', 'chilli', 'mirch', 'mirchi'],
  'Coriander': ['dhaniya', 'dhania', 'coriander', 'cilantro'],
  'Mint': ['pudina', 'podina', 'mint'],
  'Spinach': ['palak', 'spinach'],
  'Fenugreek': ['methi', 'fenugreek'],
  'Mustard Greens': ['saag', 'mustard greens', 'sarson ka saag', 'sarson'],
  'Radish Leaves': ['mooli ke patte', 'moli leaves', 'radish leaves'],
  'Dill': ['soya', 'dill'],
  'Carrot': ['gajar', 'carrot', 'carrots'],
  'Radish': ['mooli', 'moli', 'radish'],
  'Turnip': ['shalgam', 'turnip', 'shaljam'],
  'Taro': ['arvi', 'arbi', 'taro', 'taro root'],
  'Cucumber': ['kheera', 'khira', 'cucumber'],
  'Apple Gourd': ['tinda', 'apple gourd', 'tinday'],
  'Bitter Gourd': ['karela', 'bitter gourd', 'karaila'],
  'Bottle Gourd': ['loki', 'lauki', 'kaddu', 'bottle gourd'],
  'Pumpkin': ['kaddu', 'halwa kaddu', 'pumpkin'],
  'Eggplant': ['baingan', 'baigan', 'eggplant', 'brinjal', 'aubergine'],
  'Cauliflower': ['phool gobi', 'gobi', 'cauliflower'],
  'Capsicum': ['shimla mirch', 'capsicum', 'bell pepper'],
  'Peas': ['matar', 'green peas', 'peas'],
  'Hyacinth Bean': ['sem phali', 'sem', 'hyacinth bean', 'valor'],
  'Okra': ['bhindi', 'okra', 'lady finger', 'ladyfinger'],
  'Ridge Gourd': ['tori', 'turai', 'ridge gourd'],
  'Jackfruit': ['kathal', 'jackfruit'],
  'Lotus Root': ['kamal kakri', 'bhein', 'lotus root'],
  'Broccoli': ['broccoli', 'brocoli', 'sabz gobi'],
  'Turmeric': ['haldi', 'turmeric'],
  'Red Chili': ['lal mirch', 'surkh mirch', 'red chili', 'red chilli'],
  'Cluster Beans': ['gawar phali', 'cluster beans', 'guar'],
  'Snake Gourd': ['chichinda', 'snake gourd'],
  'Wild Melon': ['chibber', 'wild melon'],
  'Sweet Pumpkin': ['meetha kaddu', 'sweet pumpkin'],
  'Zucchini': ['zucchini', 'tori'],
  'Cherry Tomato': ['cherry tomato', 'chota tamatar'],
  'Red Lobiya': ['red lobiya', 'surkh lobia', 'red cowpeas'],

  // Fruits
  'Mango': ['aam', 'mango', 'mangoes', 'chaunsa', 'sindhri', 'anwar ratol', 'langra', 'dussehri'],
  'Kinnow': ['kino', 'kinnow', 'mandarin', 'orange', 'malta', 'mosambi', 'sweet lime'],
  'Guava': ['amrood', 'amrud', 'guava'],
  'Banana': ['kela', 'banana', 'bananas'],
  'Apple': ['saib', 'seb', 'apple', 'apples', 'kala kullu', 'gacha'],
  'Pear': ['nashpati', 'pear', 'pears'],
  'Grapes': ['angoor', 'grapes', 'sundarkhani', 'gola'],
  'Watermelon': ['tarbooz', 'tarbuz', 'watermelon'],
  'Cantaloupe': ['kharbooza', 'kharbuza', 'cantaloupe', 'melon', 'garma'],
  'Pomegranate': ['anaar', 'anar', 'pomegranate', 'kandhari'],
  'Blood Orange': ['surkh malta', 'blood orange', 'red orange'],
  'Lemon': ['leemo', 'nimbu', 'lemon', 'lemons'],
  'Grapefruit': ['chakotra', 'grapefruit'],
  'Mandarin': ['frooter', 'narangi', 'mandarin'],
  'Phalsa Berry': ['falsa', 'phalsa', 'phalsa berry', 'grewia'],
  'Lychee': ['lichi', 'lychee'],
  'Black Plum': ['jaman', 'jamun', 'black plum'],
  'Plum': ['aloobukhara', 'aloo bukhara', 'plum', 'plums'],
  'Apricot': ['khobani', 'khubani', 'apricot', 'apricots'],
  'Persimmon': ['japani phal', 'persimmon', 'amlok'],
  'Sapodilla': ['chiku', 'chikoo', 'sapodilla'],
  'Papaya': ['pappita', 'papita', 'papaya'],
  'Jujube': ['bair', 'ber', 'jujube'],
  'Mud Apple': ['mud apple', 'chikoo'],
  'Tamarind': ['imli', 'tamarind'],
  'Strawberry': ['strawberry', 'strawberries'],
  'Dates': ['khajoor', 'dates', 'ajwa', 'aseel', 'mabroom'],
  'Figs': ['injeer', 'anjeer', 'figs', 'fresh figs'],
  'Olive': ['zaitoon', 'olive', 'olives'],
  'Nectarine': ['shuftalu', 'nectarine'],
  'Peach': ['aaroo', 'aru', 'peach', 'peaches'],
  'Cherry': ['cherry', 'cherries'],
  'Kiwi': ['kiwi'],
  'Loquat': ['loquat', 'lokat'],
  'Dragon Fruit': ['dragon fruit'],
  'Pineapple': ['ananas', 'pineapple'],
  'Mulberry': ['shehtoot', 'mulberry'],
  'Wood Apple': ['wood apple', 'bail giri', 'bael'],

  // Dry Fruits
  'Walnuts': ['akhrot', 'walnut', 'walnuts'],
  'Almonds': ['badam', 'almond', 'almonds'],
  'Raisins': ['kishmish', 'raisins', 'munakka', 'sundarkhani'],
  'Pistachios': ['pista', 'pistachio', 'pistachios'],
  'Cashews': ['kaju', 'cashew', 'cashews'],
  'Peanuts': ['moongphali', 'mungphali', 'peanut', 'peanuts'],
  'Pine Nuts': ['chilgoza', 'pine nuts', 'pine nut'],
  'Dried Figs': ['sukhi injeer', 'dry figs', 'dried figs', 'injeer', 'anjeer'],
  'Dried Peach': ['sukha aaroo', 'dried peach'],
  'Sesame Seeds': ['til', 'sesame seeds', 'safaid til', 'kala til'],
  'Nigella Seeds': ['kalonji', 'nigella seeds', 'black seed'],
  'Flax Seeds': ['alsi', 'flax seeds', 'alsi ke beej'],
  'Sunflower Seeds': ['surajmukhi ke beej', 'sunflower seeds'],
  'Pumpkin Seeds': ['kaddu ke beej', 'pumpkin seeds', 'maghaz kaddu'],
  'Dried Melon Seeds': ['char maghaz', 'maghaz', 'dried melon seeds'],
  'Chia Seeds': ['tukhme malanga', 'chia seeds', 'chia'],
  'Poppy Seeds': ['khashkhash', 'khas khas', 'poppy seeds'],
  'Fenugreek Seeds': ['methi dana', 'fenugreek seeds'],
  'Fennel Seeds': ['saunf', 'sonf', 'fennel seeds'],
  'Dried Grapes': ['munaqqa', 'dried grapes'],
  'Dried Apricot': ['sukhi khobani', 'dry apricot', 'dried apricot'],
  'Dried Plum': ['sukha aloobukhara', 'dry plum', 'dried plum'],
  'Dried Mulberry': ['sukha shehtoot', 'dried mulberry'],
  'Dried Cranberry': ['dried cranberry', 'cranberry'],
  'Dried Blueberry': ['dried blueberry', 'blueberry'],
  'Dried Mango': ['aam papad', 'dried mango', 'dry mango'],
  'Dried Coconut': ['khopra', 'sukha nariyal', 'dried coconut', 'dry coconut', 'nariyal giri'],
  'Dried Pineapple': ['dried pineapple', 'dry pineapple'],
  'Tragacanth Gum': ['gond katira', 'tragacanth gum'],
  'Mixed Nuts': ['mix dry fruit', 'mixed nuts', 'mix nuts'],
  'Saffron': ['zafran', 'saffron', 'kesar'],
  'Fox Nuts': ['phool makhana', 'makhana', 'fox nuts', 'lotus seeds'],
  'Beetroot Chips': ['beetroot chips', 'chukandar chips'],
  'Dry Cherry': ['dry cherry', 'dried cherry'],
  'Sweet Potato Chips': ['shakarkandi chips', 'sweet potato chips'],
  'Dried Amla': ['sukha amla', 'dry amla', 'dried amla'],
  'Dried Tamarind': ['sukhi imli', 'dry tamarind', 'dried tamarind'],
  'Dried Raw Mango': ['amchur', 'aamchur', 'dry raw mango', 'dried raw mango'],
  'Dried Dates': ['chhohara', 'chohara', 'dry dates', 'dried dates'],
  'Dry Coconut': ['khopra', 'dry coconut', 'dried coconut'],

  // Grains
  'Wheat': ['gandum', 'gehun', 'wheat', 'atta', 'chakki atta', 'desi gandum', 'wheat flour'],
  'Red Rice': ['lal chawal', 'red rice'],
  'Corn': ['makai', 'makki', 'corn', 'corn flour', 'makai ka atta'],
  'Barley': ['jau', 'jao', 'barley'],
  'Pearl Millet': ['bajra', 'pearl millet', 'millet'],
  'Sorghum': ['jowar', 'sorghum'],
  'Cowpeas': ['lobia', 'safaid lobia', 'white beans', 'cowpeas'],
  'Red Lentils': ['daal masoor', 'masoor daal', 'red lentils', 'masoor'],
  'Green Lentils': ['daal moong', 'sabz masoor', 'green lentils'],
  'Black Lentils': ['daal mash', 'kaali daal', 'black lentils', 'urad'],
  'Mung Beans': ['moong daal', 'mung beans', 'moong sabut'],
  'Split Peas': ['matar daal', 'split peas'],
  'Pigeon Peas': ['daal toor', 'arhar daal', 'pigeon peas'],
  'Red Kidney Beans': ['surkh rajma', 'rajma', 'red kidney beans'],
  'Garbanzo Beans': ['safaid chana', 'kabuli chana', 'chickpeas', 'garbanzo beans'],
  'Moth Beans': ['moth daal', 'moth', 'moth beans'],
  'Horse Gram': ['kulthi', 'horse gram'],
  'Whole Red Lentils': ['sabut masoor', 'whole red lentils'],
  'Whole Green Lentils': ['sabut moong', 'whole green lentils'],
  'Split Chickpeas': ['daal chana', 'split chickpeas', 'chana daal'],
  'Basmati Rice': ['basmati', 'basmati rice', 'super basmati', 'kainat', '1121', 'saila', 'chawal', 'rice'],
  'Parboiled Rice': ['saila chawal', 'parboiled rice'],
  'Brown Rice': ['brown rice', 'bhura chawal'],
  'Kalijeera Rice': ['kalijeera rice', 'kalijeera'],
  'Sugdasi Rice': ['sugdasi rice', 'sugdasi'],
  'Chinor Rice': ['chinor rice', 'chinor'],
  'Super Kernel Rice': ['super kernel', 'super kernel rice'],
  'Irri Rice': ['irri rice', 'irri 6', 'irri 9', 'irri'],
  'Jasmine Rice': ['jasmine rice'],
  'Quinoa': ['quinoa'],
  'Oats': ['oats', 'daliya', 'jaye', 'porridge'],
  'Buckwheat': ['kuttu', 'buckwheat'],
  'Rye': ['rye'],
  'Amaranth': ['rajgira', 'amaranth'],
  'Finger Millet': ['ragi', 'finger millet'],
  'Soya Beans': ['soybean', 'soya beans', 'soyabean'],
  'Flaxseed': ['alsi dana', 'flaxseed'],
  'Hemp Seeds': ['hemp seeds'],
  'Teff': ['teff']
};

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
    keywords: VEGETABLES_PRODUCTS.map(p => p.toLowerCase())
  },
  {
    key: 'fruits',
    labelEN: 'Fruits',
    labelRU: 'Phal',
    icon: '🍎',
    categoryNames: [
      'fruits', 'fruit', 'phal', 'phall', 'aam phal', 'mausami phal', 'khaas phal', 'fresh fruits', 'seasonal fruits'
    ],
    keywords: FRUITS_PRODUCTS.map(p => p.toLowerCase())
  },
  {
    key: 'dryfruits',
    labelEN: 'Dry Fruits',
    labelRU: 'Khushk Mewa',
    icon: '🥜',
    categoryNames: [
      'dry fruits', 'dry fruit', 'dryfruits', 'khushk mewa', 'khushk meway', 'aam dry fruits', 'seeds walay', 'meethy dry fruits', 'khaas dry fruits'
    ],
    keywords: DRY_FRUITS_PRODUCTS.map(p => p.toLowerCase())
  },
  {
    key: 'grains',
    labelEN: 'Grains & Pulses',
    labelRU: 'Anaaj Aur Daalein',
    icon: '🌾',
    categoryNames: [
      'grains', 'grain', 'anaaj', 'anaj', 'aam anaaj', 'daliyan', 'chawal ki kismein', 'khaas anaaj', 'pulses', 'daalein', 'daal'
    ],
    keywords: GRAINS_PRODUCTS.map(p => p.toLowerCase())
  }
];

// Helper to normalize strings for comparison
function cleanString(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/[()\-–—_.,/\\#+]/g, ' ')
    .replace(/\b\d+(\.\d+)?(kg|g|gm|gram|grams|kilo|litre|l|ml|pack|dozen|darjan)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if an item belongs to a specific Category ("vegetables", "fruits", "dryfruits", "grains").
 */
export function doesItemBelongToCategory(
  item: { name: string; category?: string },
  categoryKey: 'vegetables' | 'fruits' | 'dryfruits' | 'grains'
): boolean {
  const prodName = cleanString(item.name);
  const prodCat = cleanString(item.category || '');

  let categoryProductList: string[] = [];
  if (categoryKey === 'vegetables') categoryProductList = VEGETABLES_PRODUCTS;
  else if (categoryKey === 'fruits') categoryProductList = FRUITS_PRODUCTS;
  else if (categoryKey === 'dryfruits') categoryProductList = DRY_FRUITS_PRODUCTS;
  else if (categoryKey === 'grains') categoryProductList = GRAINS_PRODUCTS;

  // 1. Direct Category Name Match
  const catDef = PRODUCT_CATEGORIES.find(c => c.key === categoryKey);
  if (catDef && prodCat) {
    if (catDef.categoryNames.some(cn => prodCat.includes(cn) || cn.includes(prodCat))) {
      return true;
    }
  }

  // 2. Check each product name in that category
  for (const stdProd of categoryProductList) {
    const stdClean = cleanString(stdProd);
    if (prodName.includes(stdClean) || stdClean.includes(prodName)) {
      return true;
    }
    
    // Check aliases
    const aliases = PRODUCT_ALIASES[stdProd] || [];
    for (const alias of aliases) {
      const aliasClean = cleanString(alias);
      if (prodName.includes(aliasClean) || aliasClean.includes(prodName)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Identifies the category key for a given product.
 */
export function classifyItemCategory(product: { name: string; category?: string }): string | null {
  if (doesItemBelongToCategory(product, 'vegetables')) return 'vegetables';
  if (doesItemBelongToCategory(product, 'fruits')) return 'fruits';
  if (doesItemBelongToCategory(product, 'dryfruits')) return 'dryfruits';
  if (doesItemBelongToCategory(product, 'grains')) return 'grains';
  return null;
}

/**
 * Checks whether a specific product selection matches an item.
 */
export function doesItemMatchSpecificProduct(
  item: { name: string; category?: string },
  specificProductName: string
): boolean {
  const prodName = cleanString(item.name);
  const targetName = cleanString(specificProductName);

  if (!targetName) return false;

  // Exact or contains match
  if (prodName === targetName || prodName.includes(targetName) || targetName.includes(prodName)) {
    return true;
  }

  // Check aliases of target product if available
  // Search in all alias tables
  for (const [canonicalName, aliases] of Object.entries(PRODUCT_ALIASES)) {
    const canonicalClean = cleanString(canonicalName);
    const isTargetThisCanonical = canonicalClean === targetName || aliases.some(a => cleanString(a) === targetName);
    
    if (isTargetThisCanonical) {
      // Check if item matches canonical or any alias
      if (prodName.includes(canonicalClean) || canonicalClean.includes(prodName)) return true;
      for (const a of aliases) {
        const aClean = cleanString(a);
        if (prodName.includes(aClean) || aClean.includes(prodName)) return true;
      }
    }
  }

  return false;
}

/**
 * Checks if an individual product in an order matches the seller's selected categories/products.
 */
export function doesItemMatchSeller(
  product: { name: string; category?: string },
  sellerSelections: string[]
): boolean {
  if (!sellerSelections || sellerSelections.length === 0) return true;

  for (const sel of sellerSelections) {
    const s = cleanString(sel);
    if (!s) continue;

    // Check if seller selected whole category
    if (s.includes('vegetable') || s.includes('sabzi') || s === 'vegetables' || s === 'sabziyaan') {
      if (doesItemBelongToCategory(product, 'vegetables')) return true;
    }
    else if (s.includes('fruit') || s.includes('phal') || s === 'fruits') {
      if (doesItemBelongToCategory(product, 'fruits')) return true;
    }
    else if (s.includes('dry fruit') || s.includes('dryfruit') || s.includes('khushk mewa') || s === 'dryfruits') {
      if (doesItemBelongToCategory(product, 'dryfruits')) return true;
    }
    else if (s.includes('grain') || s.includes('anaaj') || s.includes('anaj') || s.includes('daal') || s === 'grains') {
      if (doesItemBelongToCategory(product, 'grains')) return true;
    }
    else {
      // Specific product match (e.g. "Apple", "Potato", "Basmati Rice")
      if (doesItemMatchSpecificProduct(product, sel)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * FIX 2: Location-based matching for orders and sellers.
 * Checks whether customer location matches seller location / delivery range.
 */
export function doesOrderMatchSellerLocation(
  order: any, 
  seller: { city?: string; deliveryRange?: string }
): boolean {
  if (!order || !seller) return true;

  const customerCity = (
    order.customerCity || 
    order.deliveryAddress?.city || 
    order.city || 
    ''
  ).toLowerCase().trim();

  const sellerCity = (seller.city || '').toLowerCase().trim();
  const deliveryRange = (seller.deliveryRange || 'Punjab').toLowerCase().trim();

  // If customer city is not recorded, allow matching
  if (!customerCity) return true;

  const isCustInPunjab = isPunjabCity(customerCity) || (order.customerProvince && order.customerProvince.toLowerCase() === 'punjab');
  const isSellerInPunjab = isPunjabCity(sellerCity) || sellerCity.includes('punjab') || !sellerCity;

  // 1. If seller delivery range is "Whole Pakistan": Show orders from all cities.
  if (
    deliveryRange.includes('pakistan') || 
    deliveryRange.includes('whole') || 
    deliveryRange.includes('poora pakistan') ||
    deliveryRange.includes('all pakistan')
  ) {
    return true;
  }

  // 2. If seller delivery range is "Only My City": Show only orders from same city.
  if (
    deliveryRange.includes('shehar') || 
    deliveryRange.includes('apna') || 
    deliveryRange.includes('my city') || 
    deliveryRange.includes('same') ||
    deliveryRange === 'city'
  ) {
    if (!sellerCity) return true;
    const normCust = customerCity.replace('gujarat', 'gujrat');
    const normSell = sellerCity.replace('gujarat', 'gujrat');
    return normCust === normSell || normCust.includes(normSell) || normSell.includes(normCust);
  }

  // 3. If seller delivery range is "All Punjab": Show orders from all Punjab cities only.
  if (
    deliveryRange.includes('punjab') || 
    deliveryRange.includes('poora punjab') || 
    deliveryRange.includes('all punjab')
  ) {
    return isCustInPunjab && isSellerInPunjab;
  }

  // If customer city is in Punjab: Only match with sellers whose city is also in Punjab.
  if (isCustInPunjab) {
    return isSellerInPunjab;
  }

  return true;
}

/**
 * Filters an order to include only the items relevant to this seller,
 * enforcing BOTH Product match AND Location match.
 * Returns null if the order does not match location or contains NO matching items.
 */
export function filterOrderForSeller(
  order: any, 
  seller: { 
    products?: string[]; 
    categories?: string[]; 
    otherProducts?: string[]; 
    city?: string; 
    deliveryRange?: string; 
  }
) {
  if (!order || !seller) return null;

  // 1. Location match check
  if (!doesOrderMatchSellerLocation(order, seller)) {
    return null;
  }

  // Aggregate all seller selections
  const sellerSelections: string[] = [
    ...(seller.products || []),
    ...(seller.categories || []),
    ...(seller.otherProducts || [])
  ];

  const products = order.products || [];

  // If seller has selected no products or categories, default to all
  if (sellerSelections.length === 0) {
    return {
      ...order,
      sellerItems: products,
      sellerTotal: order.orderSummary?.total || 0,
      totalMatchedItemsCount: products.length
    };
  }

  // 2. Product match check: Filter items to only those matching seller's selections
  const matchingItems = products.filter((item: any) => doesItemMatchSeller(item, sellerSelections));

  if (matchingItems.length === 0) {
    return null; // Exclude this order completely
  }

  // Calculate total for matching items only
  const sellerSubtotal = matchingItems.reduce((acc: number, item: any) => {
    return acc + (item.totalPrice || item.finalPrice || ((item.price || 0) * (item.quantity || 1)) || 0);
  }, 0);

  return {
    ...order,
    sellerItems: matchingItems,
    sellerTotal: sellerSubtotal,
    totalMatchedItemsCount: matchingItems.length
  };
}
