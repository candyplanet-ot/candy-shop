import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  featured: boolean;
  description: string;
};

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  category: "",
  price: 0,
  image: "",
  featured: false,
  description: "",
};

const ProductsAdmin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
    if (!error && data) setProducts(data as Product[]);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyProduct);
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      image: p.image,
      featured: p.featured,
      description: p.description,
    });
  };

  const save = async () => {
    if (editing) {
      await supabase.from("products").update(form).eq("id", editing.id);
    } else {
      await supabase.from("products").insert(form);
    }
    await loadProducts();
    setEditing(null);
    setForm(emptyProduct);
  };

  const remove = async (id: number) => {
    await supabase.from("products").delete().eq("id", id);
    await loadProducts();
  };

  return (
    <div className="pt-16 p-6">
      <div className="container mx-auto grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-baloo font-bold">Manage Products</h1>
          <Button onClick={startCreate}>New Product</Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div>Loading...</div>
              ) : products.length === 0 ? (
                <div>No products yet.</div>
              ) : (
                products.map((p) => (
                  <div key={p.id} className="rounded-lg border p-4 space-y-2">
                    <div className="font-bold">{p.name}</div>
                    <div className="text-sm text-muted-foreground">{p.category}</div>
                    <div className="text-sm">€{p.price}</div>
                    <div className="text-sm line-clamp-2">{p.description}</div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={() => startEdit(p)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(p.id)}>Delete</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <Label>Price (number)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div className="pt-4">
              <Button onClick={save}>{editing ? "Update" : "Create"}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductsAdmin;


