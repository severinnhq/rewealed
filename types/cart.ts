export interface CartItem {
    product: {
      _id: string;
      name: string;
      mainImage: string;
      price: number;
      salePrice?: number;
    };
    size: string;
    quantity: number;
  }
  
  