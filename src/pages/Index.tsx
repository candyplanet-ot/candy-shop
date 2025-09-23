import { ArrowRight, Heart, Award, Sparkles, Users, ChevronLeft, ChevronRight, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-candy-land.jpg";
import featuredCandies from "@/assets/featured-candies.jpg";
import iconLollipop from "@/assets/icon-lollipop.png";
import iconGummy from "@/assets/icon-gummy.png";
import iconCottonCandy from "@/assets/icon-cotton-candy.png";
import iconChocolate from "@/assets/icon-chocolate.png";
import { useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts = [
    {
      name: "Rainbow Swirl Lollipops",
      price: "€4.99",
      image: iconLollipop,
      description: "Handcrafted rainbow lollipops with natural fruit flavors"
    },
    {
      name: "Premium Chocolate Truffles", 
      price: "€12.99",
      image: iconChocolate,
      description: "Belgian chocolate truffles with exotic fillings"
    },
    {
      name: "Magical Gummy Bears",
      price: "€6.99", 
      image: iconGummy,
      description: "Soft, chewy gummies in 12 magical flavors"
    },
    {
      name: "Cloud Cotton Candy",
      price: "€3.99",
      image: iconCottonCandy,
      description: "Fluffy cotton candy that melts in your mouth"
    }
  ];

  const whyChooseUs = [
    {
      icon: Heart,
      title: "Handmade with Love",
      description: "Every candy is crafted with passion and care by our skilled artisans"
    },
    {
      icon: Award,
      title: "Premium Ingredients", 
      description: "We source only the finest ingredients from around the world"
    },
    {
      icon: Sparkles,
      title: "Magical Taste",
      description: "Each bite delivers a moment of pure joy and wonder"
    },
    {
      icon: Users,
      title: "Joyful Experience",
      description: "Creating smiles and sweet memories for every customer"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-60" />
        
        {/* Floating 3D Elements */}
        <div className="absolute top-20 left-10 float-animation">
          <img src={iconLollipop} alt="Floating Lollipop" className="w-16 h-16 opacity-70" />
        </div>
        <div className="absolute top-40 right-20 float-animation" style={{ animationDelay: "2s" }}>
          <img src={iconGummy} alt="Floating Gummy" className="w-20 h-20 opacity-70" />
        </div>
        <div className="absolute bottom-32 left-16 float-animation" style={{ animationDelay: "4s" }}>
          <img src={iconCottonCandy} alt="Floating Cotton Candy" className="w-18 h-18 opacity-70" />
        </div>
        <div className="absolute top-60 left-1/4 float-animation" style={{ animationDelay: "1s" }}>
          <img src={iconChocolate} alt="Floating Chocolate" className="w-14 h-14 opacity-70" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-baloo font-bold mb-6 animate-fade-in bg-gradient-hero bg-clip-text text-transparent">
            Welcome to Candy Planet
          </h1>
          <p className="text-2xl md:text-3xl font-poppins mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Where sweet dreams come true — discover treats made to delight every moment
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Link to="/products">
              <Button variant="hero" size="lg" className="shine-border hover-bounce">
                Explore Our Candies
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="magical" size="lg" className="hover-bounce">
                Our Story
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-20 bg-gradient-to-br from-secondary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-baloo font-bold bg-gradient-candy bg-clip-text text-transparent mb-6">
              Featured Magical Treats
            </h2>
            <p className="text-xl font-poppins text-muted-foreground max-w-2xl mx-auto">
              Discover our most beloved creations, handcrafted with love and magic
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <Card 
                key={index}
                className="neon-gradient-card hover-tilt hover-bounce group transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-contain float-animation"
                    />
                  </div>
                  <h3 className="text-xl font-baloo font-bold mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-poppins text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>
                  <div className="text-2xl font-baloo font-bold text-primary mb-4">
                    {product.price}
                  </div>
                  <Button variant="sweet" className="w-full hover-bounce">
                    Order Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            <div className="flex overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredProducts.map((product, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card className="neon-gradient-card">
                      <CardContent className="p-6 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-contain"
                          />
                        </div>
                        <h3 className="text-xl font-baloo font-bold mb-2">
                          {product.name}
                        </h3>
                        <p className="font-poppins text-sm text-muted-foreground mb-4">
                          {product.description}
                        </p>
                        <div className="text-2xl font-baloo font-bold text-primary mb-4">
                          {product.price}
                        </div>
                        <Button variant="sweet" className="w-full">
                          Order Now
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel Controls */}
            <Button 
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur"
              onClick={prevSlide}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur"
              onClick={nextSlide}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            {/* Dots indicator */}
            <div className="flex justify-center mt-6 gap-2">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? "bg-primary" : "bg-primary/30"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-baloo font-bold bg-gradient-sweet bg-clip-text text-transparent mb-6">
              Why Choose Candy Planet?
            </h2>
            <p className="text-xl font-poppins text-muted-foreground max-w-2xl mx-auto">
              Our commitment to excellence in every aspect of candy making
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card 
                key={index}
                className="hover-tilt hover-glow group transition-all duration-300 text-center"
              >
                <CardContent className="p-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-magical rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-baloo font-bold mb-4 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-poppins text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={featuredCandies} 
            alt="Featured Candies" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-baloo font-bold text-white mb-6">
            Ready for a Sweet Adventure?
          </h2>
          <p className="text-xl md:text-2xl font-poppins text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who have discovered the magic of our handcrafted candies
          </p>
          <Link to="/products">
            <Button variant="sweet" size="lg" className="shine-border hover-bounce text-lg px-12">
              Shop All Products
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 candy-stripe" />
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
                <div className="block text-background/80 hover:text-primary transition-colors cursor-pointer">
                  Custom Orders
                </div>
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

export default Index;