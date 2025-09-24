import { ArrowRight, Heart, Award, Sparkles, Users, ChevronLeft, ChevronRight, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-candy-land.jpg";
import featuredCandies from "@/assets/featured-candies.jpg";
import { useState, Suspense, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, ContactShadows, AdaptiveDpr, useGLTF, OrbitControls, Preload } from "@react-three/drei";

// 3D Candy centerpiece component
function CandyModel(props: { mobile?: boolean }) {
  // Try to load a glTF model placed at public/models/candy.glb
  // If not present, render a glossy torus-knot as a tasteful fallback
  let gltf: any | null = null;
  try {
    gltf = useGLTF("/models/candy.glb");
  } catch {
    gltf = null;
  }

  const materialProps = useMemo(
    () => ({ color: "#ff8ac9", roughness: 0.2, metalness: 0.6 }),
    []
  );

  return (
    <group rotation={[0, 0, 0]}>
      {gltf ? (
        <primitive object={gltf.scene} scale={props.mobile ? 0.6 : 0.7} />
      ) : (
        <mesh scale={props.mobile ? 0.5 : 0.6}>
          <torusKnotGeometry args={[1, 0.35, 256, 32]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      )}
    </group>
  );
}

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts = [
    {
      name: "Rainbow Swirl Lollipops",
      price: "€4.99",
      image: "/product-1.png",
      description: "Handcrafted rainbow lollipops with natural fruit flavors"
    },
    {
      name: "Premium Chocolate Truffles", 
      price: "€12.99",
      image: "/product-2.png",
      description: "Belgian chocolate truffles with exotic fillings"
    },
    {
      name: "Magical Gummy Bears",
      price: "€6.99", 
      image: "/product-3.png",
      description: "Soft, chewy gummies in 12 magical flavors"
    },
    {
      name: "Cloud Cotton Candy",
      price: "€3.99",
      image: "/product-4.png",
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
      <section className="relative min-h-screen overflow-hidden flex items-center">
        {/* Parallax background */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-70" />

        {/* 3D Model directly in hero background */}
        <div className="absolute inset-0 z-0">
          <Canvas 
            dpr={[1, 1.5]} 
            camera={{ position: [0, 0, 3.0], fov: 55 }} 
            gl={{ alpha: true, antialias: true }}
            className="w-full h-full"
          >
            <AdaptiveDpr pixelated />
            <ambientLight intensity={0.6} />
            <directionalLight position={[2, 4, 3]} intensity={1} />
            <Suspense fallback={null}>
              {/* Floating candies (ambient) */}
              <Float speed={1} rotationIntensity={0.4} floatIntensity={0.6}>
                <mesh position={[-2, 1.2, -1]} scale={0.3}>
                  <icosahedronGeometry args={[1, 0]} />
                  <meshStandardMaterial color="#6FCFFF" metalness={0.5} roughness={0.25} />
                </mesh>
              </Float>
              <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.7}>
                <mesh position={[1.8, -0.6, -1.4]} scale={0.25}>
                  <sphereGeometry args={[1, 32, 32]} />
                  <meshStandardMaterial color="#FF6FB5" metalness={0.55} roughness={0.2} />
                </mesh>
              </Float>
              <Float speed={0.8} rotationIntensity={0.35} floatIntensity={0.5}>
                <mesh position={[0.2, 1.8, -1.2]} scale={0.22}>
                  <dodecahedronGeometry args={[1, 0]} />
                  <meshStandardMaterial color="#7FFFD4" metalness={0.45} roughness={0.25} />
                </mesh>
              </Float>

              {/* Main centerpiece with floating animation */}
              <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
                <group rotation={[0, 0, 0]}>
                  <CandyModel />
                </group>
              </Float>

              <Environment preset="sunset" />
              <ContactShadows position={[0, -1.3, 0]} opacity={0.15} scale={8} blur={2} far={2.5} />
              <Preload all />
            </Suspense>
            <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.8} />
          </Canvas>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 container mx-auto px-4 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="font-poppins text-white/80 mb-3 animate-fade-in">A Treat World Awaits 🍬</div>
            <h1 className="text-5xl md:text-7xl font-baloo font-bold mb-4 animate-fade-in text-white text-shadow">
              Welcome to <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">Candy</span> Planet
            </h1>
            <p className="text-xl md:text-2xl font-poppins mb-8 animate-fade-in text-white/90 max-w-2xl mx-auto">
              Handcrafted treats made to delight every moment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/products">
                <Button
                  variant="default"
                  className="group relative rounded-xl bg-gradient-candy text-white border-0 px-8 py-6 text-lg shine-border hover:shadow-magical hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Explore Our Products
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  className="group rounded-xl bg-black/20 border-2 border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 hover:-translate-y-1 px-8 py-6 text-lg transition-all duration-300"
                >
                  Our Story
                  <Heart className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 text-white text-sm font-poppins shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                ⭐ Trusted by 10,000+ sweet lovers
              </div>
              <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-white/20 text-white text-sm font-poppins shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                🍃 Organic Ingredients
              </div>
              <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-white/20 text-white text-sm font-poppins shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                🍬 Handcrafted Treats
              </div>
            </div>
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
                      className="w-16 h-16 object-contain"
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
                  <Link to="/products">
                    <Button variant="sweet" className="w-full hover-bounce">
                      Order Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            <Carousel className="w-full">
              <CarouselContent>
                {featuredProducts.map((product, index) => (
                  <CarouselItem key={index} className="px-3">
                    <Card className="neon-gradient-card">
                      <CardContent className="p-5 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
                          <img src={product.image} alt={product.name} className="w-14 h-14 object-contain" />
                        </div>
                        <h3 className="text-lg font-baloo font-bold mb-2">{product.name}</h3>
                        <p className="font-poppins text-sm text-muted-foreground mb-3">{product.description}</p>
                        <div className="text-xl font-baloo font-bold text-primary mb-3">{product.price}</div>
                        <Link to="/products">
                          <Button variant="sweet" className="w-full">Order Now</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-background/90" />
              <CarouselNext className="right-2 bg-background/90" />
            </Carousel>
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