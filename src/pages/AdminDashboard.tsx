
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [bestSeller, setBestSeller] = useState<{name: string, quantity: number} | null>(null);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthed(!!data.session);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!isAuthed) return;
    const fetchMetrics = async () => {
      setMetricsLoading(true);
      // Total products
      const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      setTotalProducts(productsCount || 0);
      // Total orders
      const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      setTotalOrders(count || 0);
      // Total revenue
      const { data: items } = await supabase.from('order_items').select('product_id, quantity, price');
      const revenue = items?.reduce((sum, item) => sum + item.quantity * item.price, 0) || 0;
      setTotalRevenue(revenue);
      // Best seller
      if (items && items.length > 0) {
        const grouped = items.reduce((acc, item) => {
          acc[item.product_id] = (acc[item.product_id] || 0) + item.quantity;
          return acc;
        }, {} as Record<string, number>);
        const bestProductId = Object.keys(grouped).reduce((a, b) => grouped[a] > grouped[b] ? a : b);
        if (bestProductId) {
          const { data: product } = await supabase.from('products').select('name').eq('id', bestProductId).single();
          if (product) {
            setBestSeller({ name: product.name, quantity: grouped[bestProductId] });
          }
        }
      }
      setMetricsLoading(false);
    };
    fetchMetrics();
  }, [isAuthed]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) return <div className="pt-16 p-6">Loading...</div>;
  if (!isAuthed) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="pt-16 p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-baloo font-bold">Admin</h1>
          <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
        </div>
        <div className="grid gap-4">
          {metricsLoading ? (
            <div className="rounded-lg border p-4">
              <p>Loading metrics...</p>
            </div>
          ) : (
            <>
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-bold mb-2">Total Orders</h2>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-bold mb-2">Total Products</h2>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-bold mb-2">Total Revenue</h2>
                  <p className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-bold mb-2">Best Seller</h2>
                  <p className="text-lg">
                    {bestSeller ? `${bestSeller.name} - ${bestSeller.quantity} sold` : 'No sales yet'}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
          <div className="rounded-lg border p-4">
            <h2 className="font-bold mb-2">Products</h2>
            <p className="mb-3">Create, edit, and delete products.</p>
            <Link to="/admin/products">
              <Button>Open Products</Button>
            </Link>
          </div>
          <div className="rounded-lg border p-4">
            <h2 className="font-bold mb-2">Gallery</h2>
            <p className="mb-3">Upload, browse, copy URLs, and delete images.</p>
            <Link to="/admin/gallery">
              <Button>Open Gallery</Button>
            </Link>
          </div>
          <div className="rounded-lg border p-4">
            <h2 className="font-bold mb-2">Users</h2>
            <p className="mb-3">Assign roles to users (admin/staff/user).</p>
            <Link to="/admin/users">
              <Button>Open Users</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


=======
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [bestSeller, setBestSeller] = useState<{name: string, quantity: number} | null>(null);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthed(!!data.session);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!isAuthed) return;
    const fetchMetrics = async () => {
      setMetricsLoading(true);
      // Total products
      const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      setTotalProducts(productsCount || 0);
      // Total orders
      const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      setTotalOrders(count || 0);
      // Total revenue
      const { data: items } = await supabase.from('order_items').select('product_id, quantity, price');
      const revenue = items?.reduce((sum, item) => sum + item.quantity * item.price, 0) || 0;
      setTotalRevenue(revenue);
      // Best seller
      if (items && items.length > 0) {
        const grouped = items.reduce((acc, item) => {
          acc[item.product_id] = (acc[item.product_id] || 0) + item.quantity;
          return acc;
        }, {} as Record<string, number>);
        const bestProductId = Object.keys(grouped).reduce((a, b) => grouped[a] > grouped[b] ? a : b);
        if (bestProductId) {
          const { data: product } = await supabase.from('products').select('name').eq('id', bestProductId).single();
          if (product) {
            setBestSeller({ name: product.name, quantity: grouped[bestProductId] });
          }
        }
      }
      setMetricsLoading(false);
    };
    fetchMetrics();
  }, [isAuthed]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) return <div className="pt-16 p-6">Loading...</div>;
  if (!isAuthed) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="pt-16 p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-baloo font-bold">Admin</h1>
          <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
        </div>
        <div className="grid gap-4">
          {metricsLoading ? (
            <div className="rounded-lg border p-4">
              <p>Loading metrics...</p>
            </div>
          ) : (
            <>
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-bold mb-2">Total Orders</h2>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-bold mb-2">Total Products</h2>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-bold mb-2">Total Revenue</h2>
                  <p className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-bold mb-2">Best Seller</h2>
                  <p className="text-lg">
                    {bestSeller ? `${bestSeller.name} - ${bestSeller.quantity} sold` : 'No sales yet'}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
          <div className="rounded-lg border p-4">
            <h2 className="font-bold mb-2">Products</h2>
            <p className="mb-3">Create, edit, and delete products.</p>
            <Link to="/admin/products">
              <Button>Open Products</Button>
            </Link>
          </div>
          <div className="rounded-lg border p-4">
            <h2 className="font-bold mb-2">Gallery</h2>
            <p className="mb-3">Upload, browse, copy URLs, and delete images.</p>
            <Link to="/admin/gallery">
              <Button>Open Gallery</Button>
            </Link>
          </div>
          <div className="rounded-lg border p-4">
            <h2 className="font-bold mb-2">Users</h2>
            <p className="mb-3">Assign roles to users (admin/staff/user).</p>
            <Link to="/admin/users">
              <Button>Open Users</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;




