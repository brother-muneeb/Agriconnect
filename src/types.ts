export interface Product {
  id: number;
  name: string; // Roman Urdu
  nameEnglish: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  rating: number;
  discountPercent?: number;
  discountStart?: string;
  discountEnd?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedWeight: string;
  originalPrice: number;
  discount: number;
  finalPrice: number;
}
