import { useEffect, useState } from "react";
import { ShoppingCart, Instagram, Facebook } from "lucide-react";
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
      const { data: prod, error } = await supabase
        .from('products')
        .select('id, name, category, price, image, featured, description, stock')
        .order('id', { ascending: true });
      if (!error && prod) {
        setDbProducts(prod);
      }
      setLoading(false);
    };
    init();
  }, []);

  const fallbackProducts = [
    {
      id: 1,
      name: "Rainbow Swirl Lollipops",
      category: "Lollipops",
      price: "€4.99",
      image: "/product-1.png",
      featured: true,
      description: "Handcrafted rainbow lollipops with natural fruit flavors",
    },
    {
      id: 2,
      name: "Premium Chocolate Truffles",
      category: "Chocolates",
      price: "€12.99",
      image: "/product-2.png",
      featured: true,
      description: "Belgian chocolate truffles with exotic fillings",
    },
    {
      id: 3,
      name: "Magical Gummy Bears",
      category: "Gummies",
      price: "€6.99",
      image: "/product-3.png",
      featured: false,
      description: "Soft, chewy gummies in 12 magical flavors",
    },
    {
      id: 4,
      name: "Cloud Cotton Candy",
      category: "Cotton Candy",
      price: "€3.99",
      image: "/product-4.png",
      featured: false,
      description: "Fluffy cotton candy that melts in your mouth",
    },
    {
      id: 5,
      name: "Unicorn Chocolate Bars",
      category: "Chocolates",
      price: "€8.99",
      image: "/product-5.png",
      featured: true,
      description: "White chocolate bars with colorful sprinkles",
    },
    {
      id: 6,
      name: "Fruit Explosion Gummies",
      category: "Gummies",
      price: "€7.99",
      image: "/product-6.png",
      featured: false,
      description: "Intense fruit flavors in fun shapes",
    },
    {
      id: 7,
      name: "Caramel Crunch Bites",
      category: "Chocolates",
      price: "€5.99",
      image: "/product-7.png",
      featured: false,
      description: "Buttery caramel coated in rich chocolate with a crispy bite",
    },
    {
      id: 8,
      name: "Sour Spark Gummies",
      category: "Gummies",
      price: "€4.49",
      image: "/product-8.png",
      featured: false,
      description: "Tangy, sour-coated gummies for a zesty kick",
    },
    {
      id: 9,
      name: "Twist Pop Lollies",
      category: "Lollipops",
      price: "€3.49",
      image: "/product-9.png",
      featured: false,
      description: "Colorful twist lollipops with fruity flavors",
    },
  ];

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
      price: typeof p.price === 'number' ? `€${p.price.toFixed(2)}` : String(p.price),
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

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((p) => p.category === selectedCategory);



  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/20 to-accent/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-baloo font-bold bg-gradient-hero bg-clip-text text-transparent mb-6 animate-fade-in">
            Our Magical Collection
          </h1>
          <p className="text-xl md:text-2xl font-poppins text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Discover handcrafted candies that bring joy to every moment
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
            <div className="mb-6">Loading products...</div>
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
                      ✨ Featured
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
                        const priceNumber = typeof product.price === 'string'
                          ? Number(String(product.price).replace(/[^0-9.]/g, ""))
                          : Number(product.price);
                        addItem({ id: String(product.id), name: product.name, price: priceNumber, imageUrl: product.image });
                        toast({ title: "Added to cart", description: product.name });
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline"
                        onClick={() => navigate('/admin/products')}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="font-fredoka text-3xl font-bold bg-gradient-candy bg-clip-text text-transparent">
                Candy Planet
              </h3>
              <p className="font-poppins text-background/80">
                Where sweet dreams come true — creating magical moments one candy at a time.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-baloo text-xl font-bold text-primary">Visit Us</h4>
              <div className="space-y-2 font-poppins text-background/80">
                <p>18 Rue Rouget de Lisle</p>
                <p>34200 Sète, France</p>
                <p>+33 1 23 45 67 89</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-baloo text-xl font-bold text-primary">Quick Links</h4>
              <div className="space-y-2 font-poppins">
                <Link to="/about" className="block text-background/80 hover:text-primary transition-colors">
                  About Us
                </Link>
                <Link to="/products" className="block text-background/80 hover:text-primary transition-colors">
                  Our Products
                </Link>
              </div>
            </div>

            {/* Social */}
            <div className="space-y-4">
              <h4 className="font-baloo text-xl font-bold text-primary">Follow Us</h4>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-gradient-candy rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Instagram className="w-5 h-5 text-white" />
                </button>
                <button className="w-10 h-10 bg-gradient-magical rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Facebook className="w-5 h-5 text-white" />
                </button>
                <button className="w-10 h-10 bg-gradient-sweet rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-sm">TT</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-background/20 mt-12 pt-8 text-center">
            <p className="font-poppins text-background/80 flex items-center justify-center gap-2">
              © 2024 Candy Planet. All rights reserved.
              <span className="text-primary">🍭</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Products;