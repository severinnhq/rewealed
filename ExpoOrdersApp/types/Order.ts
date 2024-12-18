export interface OrderItem {
    id: string;
    n: string;
    s: string;
    q: number;
    p: number;
  }
  
  export interface Address {
    city: string;
    country: string;
    line1: string;
    line2: string | null;
    postal_code: string;
    state: string;
  }
  
  export interface ShippingDetails {
    address: Address;
    name: string;
  }
  
  export interface BillingDetails {
    address: Address;
    name: string;
  }
  
  export interface StripeDetails {
    paymentId: string;
    customerId: string | null;
    paymentMethodId: string | null;
    paymentMethodFingerprint: string | null;
    riskScore: number | null;
    riskLevel: string | null;
  }
  
  export interface Order {
    _id: string;
    sessionId: string;
    amount: number;
    currency?: string;
    status: string;
    items?: OrderItem[];
    shippingDetails?: ShippingDetails;
    billingDetails?: BillingDetails;
    shippingType?: string;
    stripeDetails?: StripeDetails;
    createdAt?: Date | string;
    fulfilled?: boolean;
  }
  
  