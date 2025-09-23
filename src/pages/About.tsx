import { Heart, Users, Award, Sparkles } from "lucide-react";
import candyShopExterior from "@/assets/candy-shop-exterior.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
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
      title: "Handmade with Love",
      description: "Every candy is crafted with passion and care by our skilled artisans",
    },
    {
      icon: Award,
      title: "Premium Ingredients",
      description: "We source only the finest ingredients from around the world",
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
          style={{ backgroundImage: `url(${candyShopExterior})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-baloo font-bold mb-6 animate-fade-in">
            Our Sweet Story
          </h1>
          <p className="text-xl md:text-2xl font-poppins max-w-2xl mx-auto animate-fade-in">
            Where passion meets craftsmanship in every magical bite
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
                Born from a Dream
              </h2>
              <p className="text-lg font-poppins text-muted-foreground leading-relaxed">
                In 2010, our founders Marie and Pierre shared a simple dream: to bring back the magic of childhood through handcrafted candies. What started as a small workshop in Sète has grown into a beloved destination where every sweet creation tells a story.
              </p>
              <p className="text-lg font-poppins text-muted-foreground leading-relaxed">
                We believe that candy isn't just a treat—it's a moment of pure joy, a spark of wonder, and a bridge to cherished memories. Every day, we pour our hearts into creating confections that don't just taste incredible, but transport you to a world of sweetness and magic.
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
                  <div className="text-sm font-poppins text-muted-foreground">Unique Recipes</div>
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
              Our commitment to excellence in every aspect of candy making
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

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-baloo font-bold bg-gradient-magical bg-clip-text text-transparent mb-6">
              Meet Our Sweet Team
            </h2>
            <p className="text-xl font-poppins text-muted-foreground max-w-2xl mx-auto">
              The passionate artisans behind every magical creation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card 
                key={index}
                className="hover-tilt hover-bounce transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-sweet rounded-full flex items-center justify-center">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-baloo font-bold mb-2 text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-primary font-poppins font-semibold mb-4">
                    {member.role}
                  </p>
                  <p className="font-poppins text-muted-foreground">
                    {member.description}
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