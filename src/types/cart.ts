export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface DetailedCartLine extends CartItem {
  productName: string;
  variantLabel: string;
  sku: string;
  imageUrl: string;
  unitPriceMad: number;
  lineTotalMad: number;
}
