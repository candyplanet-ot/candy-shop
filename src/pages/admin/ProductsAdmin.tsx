import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  featured: boolean;
  description: string;
  stock: number;
};

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  category: "",
  price: 0,
  image: "",
  featured: false,
  description: "",
  stock: 0,
};

const ProductsAdmin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [seeding, setSeeding] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<{ path: string; url: string; name: string }[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const galleryPrefix = (() => {
    const d = new Date();
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  })();
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
    if (!error && data) setProducts(data as Product[]);
    setLoading(false);

    // Derive categories from products only
    if (!error && data) {
      const fromDb = Array.from(new Set((data as Product[]).map((p) => p.category).filter(Boolean)));
      setCategories(fromDb);
    }
  };

  const openGallery = async () => {
    setGalleryOpen(true);
    await refreshGallery();
  };

  const refreshGallery = async () => {
    setGalleryLoading(true);
    const { data, error } = await supabase.storage.from("gallery").list(galleryPrefix, {
      limit: 100,
      sortBy: { column: "updated_at", order: "desc" },
    });
    if (!error && data) {
      // Only include file objects (folders don't have metadata/id consistently)
      const files = (data as any[]).filter((f) => f && f.id && f.metadata);
      const items = files.map((f: any) => {
        const fullPath = `${galleryPrefix}/${f.name}`;
        const { data: pub } = supabase.storage.from("gallery").getPublicUrl(fullPath);
        return { path: fullPath, url: pub.publicUrl, name: f.name };
      });
      setGalleryItems(items);
    }
    setGalleryLoading(false);
  };

  const uploadToGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const date = new Date();
    const folder = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}`;
    const path = `${folder}/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from("gallery").upload(path, file, { upsert: false });
    setUploading(false);
    if (!error) {
      await refreshGallery();
      // Preselect the newly uploaded image into the form
      const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
      setForm((prev) => ({ ...prev, image: pub.publicUrl }));
    } else {
      // eslint-disable-next-line no-alert
      alert(error.message);
    }
    e.target.value = "";
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
      price: p.price, // Price is already in euros
      image: p.image,
      featured: p.featured,
      description: p.description,
      stock: p.stock,
    });

    // Ensure current product's category exists in the selector
    if (p.category && !categories.includes(p.category)) {
      setCategories((prev) => Array.from(new Set([...prev, p.category])));
    }
  };

  const save = async () => {
    try {
      if (editing) {
        const { error } = await supabase.from("products").update(form).eq("id", editing.id);
        if (error) {
          console.error('Error updating product:', error);
          alert('Error updating product: ' + error.message);
          return;
        }
      } else {
        // Generate a unique ID for new products - price is already in euros
        const productData = {
          ...form,
          id: crypto.randomUUID()
        };
        const { error } = await supabase.from("products").insert(productData);
        if (error) {
          console.error('Error creating product:', error);
          alert('Error creating product: ' + error.message);
          return;
        }
      }
      await loadProducts();
      // Also refresh products on the main products page
      if (window.parent) {
        window.parent.location.reload();
      }
      setEditing(null);
      setForm(emptyProduct);
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Unexpected error occurred');
    }
  };

  const remove = async (id: number) => {
    await supabase.from("products").delete().eq("id", id);
    await loadProducts();
  };

  const deleteCategory = async (categoryToDelete: string) => {
    if (!confirm(`Supprimer la catégorie "${categoryToDelete}" ? Cela effacera la catégorie pour tous les produits qui l'utilisent.`)) return;

    console.log('Deleting category:', categoryToDelete);

    try {
      // First check how many products have this category
      const { data: productsWithCategory, error: countError } = await supabase
        .from("products")
        .select("id")
        .eq("category", categoryToDelete);

      if (countError) {
        console.error('Error counting products:', countError);
        alert(`Erreur lors du comptage des produits: ${countError.message}`);
        return;
      }

      console.log(`Found ${productsWithCategory?.length || 0} products with category "${categoryToDelete}"`);

      // Update DB: set category = '' for all products with this category
      const { data: updateData, error: updateError } = await supabase
        .from("products")
        .update({ category: null })
        .eq("category", categoryToDelete)
        .select();

      if (updateError) {
        console.error('Error updating products:', updateError);
        alert(`Erreur lors de la mise à jour des produits: ${updateError.message}`);
        return;
      }

      console.log('Update result:', updateData);

      // Update local categories temporarily
      setCategories((prev) => prev.filter((c) => c !== categoryToDelete));

      // Reset form if it was using this category
      if (form.category === categoryToDelete) {
        setForm((prev) => ({ ...prev, category: null }));
      }

      // Reload products to reflect changes and refresh categories
      await loadProducts();

      alert(`Catégorie "${categoryToDelete}" supprimée avec succès. ${updateData?.length || 0} produits mis à jour.`);
    } catch (error) {
      console.error('Unexpected error deleting category:', error);
      alert('Une erreur inattendue s\'est produite lors de la suppression de la catégorie.');
    }
  };

  const seedDefaults = async () => {
    setSeeding(true);
    // A curated set of default products derived from the storefront
    const defaults: Omit<Product, "id">[] = [
      {
        name: "Rainbow Swirl Lollipops",
        category: "Lollipops",
        price: 4.99,
        image: "/product-1.png",
        featured: true,
        description: "Handcrafted rainbow lollipops with natural fruit flavors",
        stock: 100,
      },
      {
        name: "Premium Chocolate Truffles",
        category: "Chocolates",
        price: 12.99,
        image: "/product-2.png",
        featured: true,
        description: "Belgian chocolate truffles with exotic fillings",
        stock: 50,
      },
      {
        name: "Magical Gummy Bears",
        category: "Gummies",
        price: 6.99,
        image: "/product-3.png",
        featured: false,
        description: "Soft, chewy gummies in 12 magical flavors",
        stock: 200,
      },
      {
        name: "Cloud Cotton Candy",
        category: "Cotton Candy",
        price: 3.99,
        image: "/product-4.png",
        featured: false,
        description: "Fluffy cotton candy that melts in your mouth",
        stock: 150,
      },
    ];
    await supabase.from("products").insert(defaults);
    await loadProducts();
    setSeeding(false);
  };

  return (
    <div className="pt-16 p-6">
      <div className="container mx-auto grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-baloo font-bold">Manage Products</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={seedDefaults} disabled={seeding}>
              {seeding ? "Seeding..." : "Seed default products"}
            </Button>
            <Button onClick={startCreate}>New Product</Button>
          </div>
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
                    <div className="text-sm">€{p.price.toFixed(2)}</div>
                    <div className="text-sm">In stock: {p.stock}</div>
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
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const value = newCategory.trim();
                      if (!value) return;
                      setCategories((prev) => Array.from(new Set([...prev, value])));
                      setForm((prev) => ({ ...prev, category: value }));
                      setNewCategory("");
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-2 space-y-1 max-h-32 overflow-y-auto border rounded p-2 bg-muted/50">
                  {categories.map((c) => (
                    <div key={c} className="flex items-center justify-between text-sm">
                      <span className="flex-1 truncate">{c}</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteCategory(c)}
                        className="ml-2"
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Price (number)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Stock (quantity)</Label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Math.max(0, Number(e.target.value)) })} />
              </div>
              <div>
                <Label>Image URL</Label>
                <div className="flex gap-2">
                  <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                  <Button type="button" variant="outline" onClick={openGallery}>Choose from Gallery</Button>
                </div>
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
        <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Select Image from Gallery</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-between gap-2 pb-3">
              <div className="text-sm text-muted-foreground">
                Choose an existing image or upload a new one.
              </div>
              <Input type="file" accept="image/*" onChange={uploadToGallery} disabled={uploading} />
            </div>
            {galleryLoading ? (
              <div>Loading...</div>
            ) : galleryItems.length === 0 ? (
              <div className="text-sm text-muted-foreground">No images yet.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryItems.map((it) => (
                  <button
                    key={it.path}
                    type="button"
                    className="border rounded-lg overflow-hidden hover:ring-2 ring-primary"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, image: it.url }));
                      setGalleryOpen(false);
                    }}
                  >
                    <div className="aspect-square bg-muted">
                      <img src={it.url} alt={it.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="text-xs p-2 truncate" title={it.name}>{it.name}</div>
                  </button>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductsAdmin;
