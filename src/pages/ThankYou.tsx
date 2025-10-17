import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";

const ThankYou = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clear } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      // Verify payment was successful and update order status
      verifyPayment(sessionId);
    } else {
      setLoading(false);
      setError('No session ID provided');
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      // Call your backend to verify the session
      const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
      const data = await response.json();

      if (data.success) {
        // Clear the cart since payment was successful
        clear();
        setLoading(false);
      } else {
        setError('Payment verification failed');
        setLoading(false);
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError('Failed to verify payment');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 p-6 container mx-auto max-w-3xl">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold">Verifying Payment...</h2>
            <p>Please wait while we confirm your payment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 p-6 container mx-auto max-w-3xl">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Payment Verification Failed</h2>
            <p className="text-lg">{error}</p>
            <p>If you believe this is an error, please contact our support team.</p>
            <Button onClick={() => navigate("/")} className="w-full max-w-xs mx-auto">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-16 p-6 container mx-auto max-w-3xl">
      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold text-green-600">Thank You for Your Order!</h2>
          <p className="text-lg">Your payment has been processed successfully.</p>
          <p className="text-lg">We hope you enjoy your candies!</p>
          <Button onClick={() => navigate("/")} className="w-full max-w-xs mx-auto">
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYou;
