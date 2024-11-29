import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '@/lib/CartContext';

export function useCheckout() {
  const { cartItems, clearCart } = useCart();

  const handleCheckout = async () => {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItems),
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        const result = await stripe?.redirectToCheckout({ sessionId });

        if (result?.error) {
          console.error('Stripe redirect error:', result.error);
          throw new Error(result.error.message);
        } else {
          clearCart();
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to create checkout session:', errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error; // Re-throw the error to be handled by the component
    }
  };

  return { handleCheckout };
}

