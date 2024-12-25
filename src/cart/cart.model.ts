export interface CartItem {
    upc: string;       // UPC code of the product
    quantity: number;  // Quantity to add to the cart
    modality?: string; // Optional modality ("PICKUP" or "DELIVERY")
  }