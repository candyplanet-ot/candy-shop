import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-fredoka text-3xl font-bold bg-gradient-candy bg-clip-text text-transparent">
              Candy Planet
            </h3>
            <p className="font-poppins text-background/80">
              Where sweet dreams come true — creating magical moments one Treat at a time.
            </p>
          </div>

          {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-baloo text-xl font-bold text-primary">Visit Us</h4>
              <div className="space-y-2 font-poppins text-background/80">
                <p>18 Rue Rouget de Lisle</p>
                <p>34200 Sète, France</p>
                <p>+33 766 548 711</p>
              </div>
              <a href="https://maps.app.goo.gl/TPeFRb3N6VLCP1XCA?g_st=ipc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-poppins">
                <MapPin className="w-4 h-4" />
                View on Google Maps
              </a>
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
              <a href="https://snapchat.com/t/abBiBDB7" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-candy rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <span className="text-white text-lg">👻</span>
              </a>
              <a href="https://www.tiktok.com/@candyplanet34?_t=ZN-903326FhUW6&_r=1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-sweet rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xs">TikTok</span>
              </a>
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
  );
};

export default Footer;
