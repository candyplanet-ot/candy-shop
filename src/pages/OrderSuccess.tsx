<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { clear } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutReference = params.get("checkout_reference");
    const status = params.get("status");

    if (!checkoutReference) {
      setError("Missing checkout reference");
      setLoading(false);
      return;
    }

    if (status !== "success") {
      setError("Payment was not successful");
      setLoading(false);
      return;
    }

    // Update order status in Supabase
    const confirmOrder = async () => {
      const { error } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", checkoutReference);

      if (error) {
        setError("Failed to confirm order");
      } else {
        setOrderConfirmed(true);
        clear();
      }
      setLoading(false);
    };

    confirmOrder();
  }, [clear]);

  if (loading) {
    return <div className="pt-16 p-6 container mx-auto max-w-3xl">Processing your order...</div>;
  }

  if (error) {
    return (
      <div className="pt-16 p-6 container mx-auto max-w-3xl">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
            <p className="text-lg">{error}</p>
            <Button onClick={() => navigate("/checkout")} className="w-full max-w-xs mx-auto">
              Return to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div className="pt-16 p-6 container mx-auto max-w-3xl">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">Thank you for your order!</h2>
            <p className="text-lg">Your payment was successful. We will process your order shortly.</p>
            <Button onClick={() => navigate("/")} className="w-full max-w-xs mx-auto">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default OrderSuccess;
=======
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { clear } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutReference = params.get("checkout_reference");
    const status = params.get("status");

    if (!checkoutReference) {
      setError("Missing checkout reference");
      setLoading(false);
      return;
    }

    if (status !== "success") {
      setError("Payment was not successful");
      setLoading(false);
      return;
    }

    // Update order status in Supabase
    const confirmOrder = async () => {
      const { error } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", checkoutReference);

      if (error) {
        setError("Failed to confirm order");
      } else {
        setOrderConfirmed(true);
        clear();
      }
      setLoading(false);
    };

    confirmOrder();
  }, [clear]);

  if (loading) {
    return <div className="pt-16 p-6 container mx-auto max-w-3xl">Processing your order...</div>;
  }

  if (error) {
    return (
      <div className="pt-16 p-6 container mx-auto max-w-3xl">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
            <p className="text-lg">{error}</p>
            <Button onClick={() => navigate("/checkout")} className="w-full max-w-xs mx-auto">
              Return to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div className="pt-16 p-6 container mx-auto max-w-3xl">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">Thank you for your order!</h2>
            <p className="text-lg">Your payment was successful. We will process your order shortly.</p>
            <Button onClick={() => navigate("/")} className="w-full max-w-xs mx-auto">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default OrderSuccess;
>>>>>>> cf3b96f63dd429b0a17bbe128b6c7a693ae364f5
