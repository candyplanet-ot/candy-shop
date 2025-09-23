import { useState } from "react";
import { ShoppingCart, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Chocolates", "Gummies", "Lollipops", "Cotton Candy"];

  const products = [
    {
      id: 1,
      name: "Rainbow Swirl Lollipops",
      category: "Lollipops",
      price: "€4.99",
      image: "/product-1.jpg",
      featured: true,
      description: "Handcrafted rainbow lollipops with natural fruit flavors",
    },
    {
      id: 2,
      name: "Premium Chocolate Truffles",
      category: "Chocolates",
      price: "€12.99",
      image: "/project-2.jpg",
      featured: true,
      description: "Belgian chocolate truffles with exotic fillings",
    },
    {
      id: 3,
      name: "Magical Gummy Bears",
      category: "Gummies",
      price: "€6.99",
      image: "/project-3.jpg",
      featured: false,
      description: "Soft, chewy gummies in 12 magical flavors",
    },
    {
      id: 4,
      name: "Cloud Cotton Candy",
      category: "Cotton Candy",
      price: "€3.99",
      image: "/project-4.jpg",
      featured: false,
      description: "Fluffy cotton candy that melts in your mouth",
    },
    {
      id: 5,
      name: "Unicorn Chocolate Bars",
      category: "Chocolates",
      price: "€8.99",
      image: "/project-5.jpg",
      featured: true,
      description: "White chocolate bars with colorful sprinkles",
    },
    {
      id: 6,
      name: "Fruit Explosion Gummies",
      category: "Gummies",
      price: "€7.99",
      image: "/project-6.jpg",
      featured: false,
      description: "Intense fruit flavors in fun shapes",
    },
  ];

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

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

      {/* Category Filter */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Filter className="w-5 h-5 text-muted-foreground mt-2" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full ${
                  selectedCategory === category 
                    ? "bg-gradient-candy text-white hover:opacity-90" 
                    : "hover:bg-secondary"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id}
                className={`group hover-tilt hover-bounce transition-all duration-300 overflow-hidden ${
                  product.featured ? "neon-gradient-card" : ""
                }`}
              >
                <CardContent className="p-6">
                  {product.featured && (
                    <Badge className="mb-4 bg-gradient-sweet text-white shine-border">
                      ✨ Featured
                    </Badge>
                  )}
                  
                  <div className="aspect-square mb-6 flex items-center justify-center bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="text-xl font-baloo font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
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
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="hover:bg-secondary"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-baloo font-bold bg-gradient-sweet bg-clip-text text-transparent mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl font-poppins text-muted-foreground mb-8 max-w-2xl mx-auto">
            We create custom candy collections for special occasions. Let us make your sweet dreams come true!
          </p>
          <Button variant="hero" size="lg" className="shine-border hover-bounce">
            Request Custom Order
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Products;