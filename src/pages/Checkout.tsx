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

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const createCheckoutSession = async (orderId: string) => {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        amount: Math.round(subtotal * 100), // Convert to cents
        currency: 'EUR',
        productName: `Candy Shop Order - ${items.length} item${items.length > 1 ? 's' : ''}`
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    return data.sessionUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Votre panier est vide");
      return;
    }

    setLoading(true);

    try {
      // Validate cart items against database products
      const { data: validProducts } = await supabase
        .from('products')
        .select('id');

      if (!validProducts) {
        throw new Error('Unable to validate products');
      }

      const validProductIds = validProducts.map(p => p.id);

      // Filter cart items to only include valid products
      const validItems = items.filter(item => validProductIds.includes(item.id));

      if (validItems.length === 0) {
        throw new Error('No valid products in cart');
      }

      if (validItems.length !== items.length) {
        console.warn('Some invalid products were filtered from cart');
      }

      // Get current user session (optional for guest checkout)
      const { data } = await supabase.auth.getSession();

      // Insert order with shipping details - guest checkout compatible
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: data.session?.user.id || null, // null for guests
          status: "pending",
          subtotal: Math.round(subtotal * 100), // Store subtotal in cents (matches DB column name)
          shipping_address: {
            address1: form.address1,
            address2: form.address2,
            city: form.city,
            postal_code: form.postalCode,
            country: form.country,
            phone: form.phone,
          },
        })
        .select("id")
        .single();

      if (orderErr || !order) {
        throw new Error(orderErr?.message ?? "Failed to create order");
      }

      console.log("Order created successfully:", order.id);

      // Insert order items
      const isValidUUID = (uuid: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
      };

      const orderItems = validItems
        .map((i) => ({
          order_id: String(order.id),
          product_id: String(i.id),
          quantity: i.quantity,
          price: Math.round(i.price * 100), // Convert to cents for database
          product_name: i.name, // Store product name at time of order
        }));

      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) {
        throw new Error(itemsErr.message);
      }

      console.log("Order items inserted successfully");

      // Create Stripe Checkout Session and redirect
      const sessionUrl = await createCheckoutSession(order.id);
      console.log("Redirecting to Stripe checkout:", sessionUrl);
      window.location.assign(sessionUrl);

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 p-6">
      <div className="container mx-auto grid gap-6 max-w-3xl">
        <h1 className="text-2xl font-baloo font-bold">Paiement</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-4 space-y-3">
                <h2 className="font-bold mb-2">Détails de Livraison</h2>
                <div>
                  <Label>Nom Complet</Label>
                  <Input
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Adresse Ligne 1</Label>
                  <Input
                    value={form.address1}
                    onChange={(e) => setForm({ ...form, address1: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Adresse Ligne 2 (optionnel)</Label>
                  <Input
                    value={form.address2}
                    onChange={(e) => setForm({ ...form, address2: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Ville</Label>
                    <Input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Code Postal</Label>
                    <Input
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>Pays</Label>
                  <Input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 space-y-3">
                <h2 className="font-bold mb-2">Résumé de la Commande</h2>
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
                <Button className="w-full" type="submit" disabled={loading || items.length === 0}>
                  {loading ? "Création du Paiement..." : "Procéder au Paiement"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
