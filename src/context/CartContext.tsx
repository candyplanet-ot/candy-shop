import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type CartItem = {
  id: string; // product id (uuid or string)
  name: string;
  price: number; // numeric price per unit
  imageUrl?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  subtotal: number;
  loading: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: JSX.Element }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestToken, setGuestToken] = useState<string | null>(null);

  // Generate or get guest token for anonymous users
  const getGuestToken = useCallback(() => {
    let token = localStorage.getItem('guest_token');
    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem('guest_token', token);
    }
    return token;
  }, []);

  // Load cart from Supabase
  const loadCart = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session.session?.user.id;
      const token = userId ? null : getGuestToken();

      console.log('Loading cart for:', userId ? `user ${userId}` : `guest ${token}`);

      if (!userId && !token) {
        console.log('No user or token, skipping cart load');
        setLoading(false);
        return;
      }

      // Try direct query without RLS first to test
      let query = supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          products!inner (
            id,
            name,
            price,
            image
          )
        `);

      if (userId) {
        query = query.eq('user_id', userId);
      } else if (token) {
        query = query.eq('guest_token', token);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading cart:', error);
        // Fallback: try without the products join to see if it's a join issue
        const fallbackQuery = supabase
          .from('cart_items')
          .select('*');

        if (userId) {
          fallbackQuery.eq('user_id', userId);
        } else if (token) {
          fallbackQuery.eq('guest_token', token);
        }

        const { data: fallbackData, error: fallbackError } = await fallbackQuery;
        console.log('Fallback query result:', fallbackData, fallbackError);
        setLoading(false);
        return;
      }

      console.log('Cart data received:', data);

      if (data && data.length > 0) {
        const cartItems: CartItem[] = data
          .filter(item => item.products) // Ensure product exists
          .map(item => {
            const price = Number((item.products as any).price);
            console.log('Processing cart item:', item.products, 'price:', price, 'isNaN:', isNaN(price));
            return {
              id: String((item.products as any).id),
              name: String((item.products as any).name || 'Unknown Product'),
              price: price,
              imageUrl: (item.products as any).image,
              quantity: Number(item.quantity) || 1
            };
          })
          .filter(item => {
            const isValid = item.price > 0 && item.quantity > 0 && !isNaN(item.price);
            console.log('Cart item validity check:', item.name, 'price:', item.price, 'valid:', isValid);
            return isValid;
          });

        console.log('Processed cart items:', cartItems);
        setItems(cartItems);
      } else {
        console.log('No cart items found');
        setItems([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [getGuestToken]);

  // Save cart item to Supabase
  const saveCartItem = useCallback(async (item: CartItem) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session.session?.user.id;
      const token = userId ? null : getGuestToken();

      console.log('Saving cart item:', item, 'for user:', userId, 'token:', token);

      if (!userId && !token) {
        console.log('No user or token, cannot save cart item');
        return;
      }

      const cartData = {
        user_id: userId,
        guest_token: token,
        product_id: item.id,
        quantity: item.quantity
      };

      console.log('Cart data to save:', cartData);

      const { data, error } = await supabase
        .from('cart_items')
        .upsert(cartData, {
          onConflict: userId ? 'user_id,product_id' : 'guest_token,product_id'
        })
        .select();

      if (error) {
        console.error('Error saving cart item:', error);
      } else {
        console.log('Cart item saved successfully:', data);
      }
    } catch (error) {
      console.error('Error saving cart item:', error);
    }
  }, [getGuestToken]);

  // Remove cart item from Supabase
  const removeCartItem = useCallback(async (productId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session.session?.user.id;
      const token = userId ? null : getGuestToken();

      if (!userId && !token) return;

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq(userId ? 'user_id' : 'guest_token', userId || token)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing cart item:', error);
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  }, [getGuestToken]);

  // Clear cart from Supabase
  const clearCart = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session.session?.user.id;
      const token = userId ? null : getGuestToken();

      if (!userId && !token) return;

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq(userId ? 'user_id' : 'guest_token', userId || token);

      if (error) {
        console.error('Error clearing cart:', error);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }, [getGuestToken]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = useCallback(async (item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        const updated = prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + qty } : p));
        saveCartItem({ ...existing, quantity: existing.quantity + qty });
        return updated;
      }
      const newItem = { ...item, quantity: qty };
      saveCartItem(newItem);
      return [...prev, newItem];
    });
  }, [saveCartItem]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      removeCartItem(id);
      return prev.filter((p) => p.id !== id);
    });
  }, [removeCartItem]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) => prev.map((p) => {
      if (p.id === id) {
        const updatedItem = { ...p, quantity: Math.max(1, quantity) };
        saveCartItem(updatedItem);
        return updatedItem;
      }
      return p;
    }));
  }, [saveCartItem]);

  const clear = useCallback(() => {
    clearCart();
    setItems([]);
  }, [clearCart]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0), [items]);

  const value: CartContextValue = { items, addItem, removeItem, updateQuantity, clear, subtotal, loading };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
