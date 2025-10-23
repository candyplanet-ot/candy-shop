import { useEffect, useState } from "react";
import { ShoppingCart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const categories = Array.from(
    new Set([
      "All",
      ...(
        dbProducts.length > 0
          ? dbProducts.map((p) => p.category).filter(Boolean)
          : [
              "Lollipops",
              "Chocolates",
              "Gummies",
              "Cotton Candy",
            ]
      )
    ])
  );

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        setIsAdmin(false);
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setIsAdmin(profile?.role === 'admin');
      }

      // Load products from DB
      loadProducts();
    };
    init();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data: prod, error } = await supabase
      .from('products')
      .select('id, name, category, price, image, featured, description, stock')
      .order('created_at', { ascending: false });
    if (!error && prod) {
      setDbProducts(prod);
    }
    setLoading(false);
  };

  const fallbackProducts = [];

  let products = [] as Array<{
    id: string | number;
    name: string;
    category: string;
    price: string | number;
    image: string;
    featured: boolean;
    description: string;
    stock?: number;
  }>;

  if (dbProducts.length > 0) {
    const db = dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: typeof p.price === 'number' ? `€${(p.price / 100).toFixed(2)}` : String(p.price),
      image: p.image,
      featured: !!p.featured,
      description: p.description ?? '',
      stock: p.stock,
    }));
    const dbNames = new Set(db.map((p) => p.name.toLowerCase()));
    const fallbackTransformed = fallbackProducts
      .filter((f) => !dbNames.has(f.name.toLowerCase()))
      .map((f) => ({ ...f, id: `seed-${f.id}` }));
    products = [...db, ...fallbackTransformed];
  } else {
    products = fallbackProducts;
  }

  const uniqueProducts = Array.from(new Map(products.map(p => [p.name.toLowerCase(), p])).values());

  const filteredProducts = selectedCategory === "All"
    ? uniqueProducts
    : uniqueProducts.filter((p) => p.category === selectedCategory);



  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/20 to-accent/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-baloo font-bold bg-gradient-hero bg-clip-text text-transparent mb-6 animate-fade-in">
            Notre Collection Magique
          </h1>
          <p className="text-xl md:text-2xl font-poppins text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Découvrez différentes friandises qui apportent de la joie à chaque instant
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="pt-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={selectedCategory === cat ? "bg-gradient-candy text-white border-0" : ""}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading && (
            <div className="mb-6">Chargement des produits...</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id}
                className={`group hover-tilt hover-bounce transition-all duration-300 overflow-hidden ${
                  product.featured ? "neon-gradient-card" : ""
                }`}
              >
                <CardContent className="p-4 md:p-6">
                  {product.featured && (
                    <Badge className="mb-4 bg-gradient-sweet text-white shine-border">
                      ✨ Vedette
                    </Badge>
                  )}
                  
                  <div className="aspect-square mb-4 md:mb-6 flex items-center justify-center bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`${product.name === "Fruit Explosion Gummies" ? "w-[190px] h-[190px]" : "w-24 h-24"} object-contain group-hover:scale-110 transition-transform duration-300`}
                      onError={(ev) => {
                        (ev.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="100%" height="100%" fill="#f4f4f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#a1a1aa" font-family="Arial" font-size="12">Image not available</text></svg>');
                      }}
                    />
                  </div>

                  <h3 className="text-lg md:text-xl font-baloo font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="font-poppins text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-baloo font-bold text-primary">
                      {product.price}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      className="flex-1 bg-gradient-candy hover:opacity-90 text-white border-0"
                      onClick={() => {
                        // product.price is in cents from database, convert to euros for cart
                        const priceInEuros = Number(product.price) / 100;
                        addItem({ id: String(product.id), name: product.name, price: priceInEuros, imageUrl: product.image });
                        toast({ title: "Added to cart", description: product.name });
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Ajouter au Panier
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline"
                        onClick={() => navigate('/admin/products')}
                      >
                        Modifier
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Products;