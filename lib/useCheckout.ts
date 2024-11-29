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
        } else {
          clearCart();
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to create checkout session:', errorData);
        alert(`Checkout failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(`Checkout error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return { handleCheckout };
}

