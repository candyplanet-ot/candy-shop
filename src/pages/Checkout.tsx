import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    if (items.length === 0) {
      setError("Your cart is empty");
      setLoading(false);
      return;
    }

    // Insert order (address currently not persisted in schema)
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({ user_id: data.session?.user.id || null, status: "pending" })
      .select("id")
      .single();

    console.log("Order ID:", order?.id);
    if (orderErr || !order) {
      setError(orderErr?.message ?? "Failed to create order");
      setLoading(false);
      return;
    }

    // Helper function to validate UUID v4 format
    const isValidUUID = (uuid: string) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(uuid);
    };

    const rows = items
      .filter((i) => isValidUUID(String(i.id)))
      .map((i) => ({
        order_id: String(order.id), // Cast order_id to string to avoid UUID error
        product_id: String(i.id), // Cast product_id to string to avoid UUID error
        quantity: i.quantity,
        price: i.price,
      }));
    const { error: itemsErr } = await supabase.from("order_items").insert(rows);
    if (itemsErr) {
      setError(itemsErr.message);
      setLoading(false);
      return;
    }

    // Call Cloudflare function to create SumUp checkout
    try {
    const response = await fetch('https://candy-shop4.pages.dev/api/sumup/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.id, amount: subtotal }),
    });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("SumUp checkout error:", errorData);
        setError(errorData.error || 'Failed to initiate payment');
        setLoading(false);
        return;
      }
      const { checkoutUrl } = await response.json();
      // Redirect to SumUp checkout page
      window.location.href = checkoutUrl;
    } catch (err) {
      setError('Payment initiation failed');
      setLoading(false);
      return;
    }
  };

  if (success) {
    return (
      <div className="pt-16 p-6 container mx-auto max-w-3xl">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">Thanks for ordering!</h2>
            <p className="text-lg">We hope to see you again soon.</p>
            <Button onClick={() => navigate("/")} className="w-full max-w-xs mx-auto">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-16 p-6">
      <div className="container mx-auto grid gap-6 max-w-3xl">
        <h1 className="text-2xl font-baloo font-bold">Checkout</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-4 space-y-3">
              <h2 className="font-bold mb-2">Shipping Details</h2>
              <div>
                <Label>Full Name</Label>
                <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div>
                <Label>Address Line 1</Label>
                <Input value={form.address1} onChange={(e) => setForm({ ...form, address1: e.target.value })} />
              </div>
              <div>
                <Label>Address Line 2 (optional)</Label>
                <Input value={form.address2} onChange={(e) => setForm({ ...form, address2: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>City</Label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div>
                  <Label>Postal Code</Label>
                  <Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Country</Label>
                <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-3">
              <h2 className="font-bold mb-2">Order Summary</h2>
              <div className="space-y-2 max-h-64 overflow-auto pr-1">
                {items.map((i) => (
                  <div key={i.id} className="flex items-center justify-between text-sm">
                    <span className="truncate pr-2">{i.name} × {i.quantity}</span>
                    <span>€{(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="font-medium">Total</span>
                <span className="font-bold">€{subtotal.toFixed(2)}</span>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button className="w-full" onClick={placeOrder} disabled={loading || items.length === 0}>
                {loading ? "Placing..." : "Pay & Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
