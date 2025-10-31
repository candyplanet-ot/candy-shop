import { ArrowRight, Heart, Award, Sparkles, Users, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  // Tiled SVG background pattern featuring categories (candy, chips, chocolate, noodles, drinks, energy)
  const heroPatternSvg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
      <rect width='100%' height='100%' fill='white'/>
      <g font-family='Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji' font-size='48' opacity='0.12'>
        <text x='40' y='70'>🍫</text>
        <text x='180' y='100'>🍭</text>
        <text x='320' y='60'>🍪</text>
        <text x='70' y='190'>🍜</text>
        <text x='240' y='220'>🥤</text>
        <text x='320' y='180'>⚡️</text>
        <text x='30' y='330'>🍬</text>
        <text x='180' y='320'>🥤</text>
        <text x='290' y='300'>🍫</text>
      </g>
    </svg>`;
  const heroPatternUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(heroPatternSvg)}`;
  const defaultHeroImage = "/wmremove-transformed.jpeg"; // served from public/
  const homeHeroBg = (import.meta as any).env?.VITE_HOME_HERO_BG_URL || defaultHeroImage || heroPatternUrl;
  const [currentSlide, setCurrentSlide] = useState(0);


  const whyChooseUs = [
    {
      icon: Heart,
      title: "Expérience Exceptionnelle",
      description: "Expérience Unique et Exclusive — Découvrez des friandises et saveurs rares introuvables ailleurs dans votre région"
    },
    {
      icon: Award,
      title: "Découvertes Mondiales",
      description: "Spécialités sélectionnées provenant du monde entier"
    },
    {
      icon: Sparkles,
      title: "Goût Magique",
      description: "Chaque bouchée apporte un moment de joie pure et d'émerveillement"
    },
    {
      icon: Users,
      title: "Expérience Joyeuse",
      description: "Créer des sourires et des souvenirs sucrés pour chaque client"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 1) % 1);
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden flex items-center">
        {/* Parallax background */}
        <div 
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: `url(${homeHeroBg})`,
            backgroundSize: homeHeroBg === heroPatternUrl ? '400px 400px' : 'cover',
            backgroundRepeat: homeHeroBg === heroPatternUrl ? 'repeat' : 'no-repeat',
            backgroundPosition: 'center'
          }}
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
            <ambientLight intensity={1.0} />
            <directionalLight position={[2, 4, 3]} intensity={1.5} />
            <pointLight position={[-2, 2, 2]} intensity={1.2} />
            <pointLight position={[2, -2, -2]} intensity={1.0} />
            <hemisphereLight args={["#ffffff", "#444444", 0.6]} />
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

              <ContactShadows position={[0, -1.3, 0]} opacity={0.15} scale={8} blur={2} far={2.5} />
              <Preload all />
            </Suspense>
            <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.8} />
          </Canvas>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 container mx-auto px-4 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="font-poppins text-white/80 mb-3 animate-fade-in">Un Monde de Délices Vous Attend 🍬</div>
            <h1 className="text-5xl md:text-7xl font-baloo font-bold mb-4 animate-fade-in text-white text-shadow">
              Bienvenue sur <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">Candy</span> Planet
            </h1>
            <p className="text-xl md:text-2xl font-poppins mb-8 animate-fade-in text-white/90 max-w-2xl mx-auto">
              Différentes friandises magiques arrangées pour ravir chaque instant.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/products">
                <Button
                  variant="default"
                  className="group relative rounded-xl bg-gradient-candy text-white border-0 px-8 py-6 text-lg shine-border hover:shadow-magical hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Découvrez Nos Produits
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
                  Notre Histoire
                  <Heart className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 text-white text-sm font-poppins shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                ⭐ Approuvé par plus de 10 000 amateurs de sucreries
              </div>
              <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-white/20 text-white text-sm font-poppins shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                🍃 Ingrédients Biologiques
              </div>
              <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-white/20 text-white text-sm font-poppins shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                🍬 Friandises Artisanales
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-baloo font-bold bg-gradient-sweet bg-clip-text text-transparent mb-6">
              Pourquoi Choisir Candy Planet ?
            </h2>
            <p className="text-xl font-poppins text-muted-foreground max-w-2xl mx-auto">
              Notre engagement envers l'excellence dans tous les aspects de la qualité, du goût et de la joie des clients
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
            Prêt pour une Aventure Sucrée ?
          </h2>
          <p className="text-xl md:text-2xl font-poppins text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de clients heureux qui ont découvert la magie de Candy Planet
          </p>
          <Link to="/products">
            <Button variant="sweet" size="lg" className="shine-border hover-bounce text-lg px-12">
              Acheter Tous les Produits
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 candy-stripe" />
      </section>

    </div>
  );
};

export default Index;