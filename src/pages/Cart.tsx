import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

const Cart = () => {
  const { items, removeItem, updateQuantity, subtotal, clear } = useCart();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeOrder = async () => {
    setError(null);
    setPlacing(true);
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const returnTo = encodeURIComponent("/cart");
      window.location.href = `/login?returnTo=${returnTo}`;
      return;
    }
    const userId = data.session.user.id;

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({ user_id: userId, status: "pending" })
      .select("id")
      .single();
    if (orderErr || !order) {
      setError(orderErr?.message ?? "Failed to create order");
      setPlacing(false);
      return;
    }
    const rows = items.map((i) => ({ order_id: order.id, product_id: i.id, quantity: i.quantity, price: i.price }));
    const { error: itemsErr } = await supabase.from("order_items").insert(rows);
    if (itemsErr) {
      setError(itemsErr.message);
      setPlacing(false);
      return;
    }
    clear();
    setPlacing(false);
    alert("Order placed!");
  };

  return (
    <div className="pt-16 p-6">
      <div className="container mx-auto grid gap-6">
        <h1 className="text-2xl font-baloo font-bold">Votre Panier</h1>
        <Card>
          <CardContent className="p-4">
            {items.length === 0 ? (
              <div>Votre panier est vide.</div>
            ) : (
              <div className="grid gap-4">
                {items.map((i) => (
                  <div key={i.id} className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-4">
                    {i.imageUrl ? (
                      <img src={i.imageUrl} alt={i.name} className="w-16 h-16 object-contain self-start md:self-auto" />
                    ) : null}
                    <div className="flex-1">
                      <div className="font-medium break-words">{i.name}</div>
                      <div className="text-sm text-muted-foreground">€{i.price.toFixed(2)}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground hidden sm:inline">Qté</span>
                        <Input
                          type="number"
                          className="w-24"
                          value={i.quantity}
                          min={1}
                          onChange={(e) => updateQuantity(i.id, Number(e.target.value))}
                        />
                      </div>
                      <div className="md:w-24 text-left md:text-right font-medium">€{(i.price * i.quantity).toFixed(2)}</div>
                      <Button variant="destructive" className="w-full sm:w-auto" onClick={() => removeItem(i.id)}>Supprimer</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">Total : €{subtotal.toFixed(2)}</div>
          <Button disabled={items.length === 0} onClick={() => {
            window.location.href = "/checkout";
          }}>
            Commander
          </Button>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
    </div>
  );
};

export default Cart;


