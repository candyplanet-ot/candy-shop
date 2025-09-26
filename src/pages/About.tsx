import { Heart, Users, Award, Sparkles } from "lucide-react";
import shopImg from "@/assets/shop-img.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  // No special background logic needed; we use the exterior image with gradient overlay
  const teamMembers = [
    {
      name: "Marie Dupont",
      role: "Master Confectioner",
      description: "20 years of candy-making magic",
    },
    {
      name: "Pierre Martin",
      role: "Creative Director",
      description: "Dreams up our most whimsical treats",
    },
    {
      name: "Sophie Bernard",
      role: "Quality Specialist",
      description: "Ensures every candy is perfect",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Expensive Experience",
      description: "Unique Exclusive Experience — Discover rare treats and flavors unavailable anywhere else in your region",
    },
    {
      icon: Award,
      title: "Global Discoveries",
      description: "Curated specialties sourced from across the globe",
    },
    {
      icon: Sparkles,
      title: "Magical Taste",
      description: "Each bite delivers a moment of pure joy and wonder",
    },
    {
      icon: Users,
      title: "Joyful Experience",
      description: "Creating smiles and sweet memories for every customer",
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${shopImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-baloo font-bold mb-6 animate-fade-in">
            Our Sweet Story
          </h1>
          <p className="text-xl md:text-2xl font-poppins max-w-2xl mx-auto animate-fade-in">
            Where passion meets Adventure in every treat
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 candy-stripe" />
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-baloo font-bold bg-gradient-candy bg-clip-text text-transparent">
                Née d'un Réseau Mondial
              </h2>
              <p className="text-lg font-poppins text-muted-foreground leading-relaxed">
                Il y a seulement trois mois, notre fondateur avait une vision simple mais puissante : partager la joie unique que les spécialités internationales apportaient à sa famille avec tous ceux qui l'entourent. Grâce à des connexions tissées aux quatre coins du globe, Candy Planet a vu le jour au cœur de Sète.
              </p>
              <p className="text-lg font-poppins text-muted-foreground leading-relaxed">
                Ce qui nous rend spéciaux, ce n'est pas seulement notre incroyable sélection de confiseries, boissons et gourmandises du monde entier, c'est que chaque produit offre quelque chose d'authentiquement unique. Des saveurs et des expériences que vous ne trouverez tout simplement nulle part ailleurs.
              </p>
              <p className="text-lg font-poppins text-muted-foreground leading-relaxed">
                Ce qui a commencé par le partage de cette joie au sein de notre communauté sétoise s'étend aujourd'hui bien au-delà des frontières. Avec notre site internet, nous pouvons désormais livrer ces découvertes extraordinaires aux explorateurs culinaires du monde entier.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-magical p-8 rounded-3xl shadow-magical">
                <div className="bg-background rounded-2xl p-6 text-center">
                  <div className="text-4xl font-baloo font-bold text-primary mb-2">13+</div>
                  <div className="text-sm font-poppins text-muted-foreground mb-4">Years of Magic</div>
                  <div className="text-4xl font-baloo font-bold text-accent mb-2">50,000+</div>
                  <div className="text-sm font-poppins text-muted-foreground mb-4">Happy Customers</div>
                  <div className="text-4xl font-baloo font-bold text-candy-mint mb-2">100+</div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-baloo font-bold bg-gradient-sweet bg-clip-text text-transparent mb-6">
              Why Choose Candy Planet?
            </h2>
            <p className="text-xl font-poppins text-muted-foreground max-w-2xl mx-auto">
              Our commitment to Provide the best quality products to our customers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="neon-gradient-card hover-tilt hover-glow transition-all duration-300 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-candy rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-baloo font-bold mb-4 text-foreground">
                    {value.title}
                  </h3>
                  <p className="font-poppins text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      

      {/* Mission Statement */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-baloo font-bold bg-gradient-candy bg-clip-text text-transparent mb-8">
              Our Mission
            </h2>
            <p className="text-2xl font-poppins text-foreground leading-relaxed mb-8">
              "To create moments of pure magic through handcrafted candies that bring joy, wonder, and sweetness to every life we touch."
            </p>
            <div className="h-2 w-32 bg-gradient-candy mx-auto rounded-full mb-8" />
            <Button variant="hero" size="lg" className="shine-border hover-bounce">
              Join Our Sweet Journey
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;