import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadRole = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        setIsAdmin(false);
        setIsLoggedIn(false);
        return;
      }
      setIsLoggedIn(true);
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      setIsAdmin(profile?.role === 'admin');
    };
    loadRole();
  }, [location.pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Products", path: "/products" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-background/95 backdrop-blur-md border-b border-border/50 shadow-lg" 
        : "bg-background/90 backdrop-blur-sm border-b border-border"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="w-10 h-10 group">
            <img 
              src="/favicon.ico" 
              alt="logo" 
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-poppins font-medium transition-all duration-300 hover:text-primary hover:scale-105 ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {!isLoggedIn && (() => {
              const current = `${location.pathname}${location.search}${location.hash}`;
              const loginHref = `/login?returnTo=${encodeURIComponent(current)}`;
              return (
                <Link to={loginHref}>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                  >
                    Login
                  </Button>
                </Link>
              );
            })()}
            {isAdmin && (
              <Link to="/admin">
                <Button
                  variant="outline"
                  className="rounded-xl border-primary/30 text-primary hover:bg-primary/10"
                >
                  Admin
                </Button>
              </Link>
            )}
            <Link to="/cart">
              <Button 
                variant="default" 
                className="relative rounded-xl bg-gradient-candy text-white border-0 px-6 py-2 font-medium hover:shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                <span className="relative z-10">Cart</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm" />
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:bg-secondary/20 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block font-poppins font-medium transition-colors hover:text-primary hover:scale-105 ${
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!isLoggedIn && (() => {
                const current = `${location.pathname}${location.search}${location.hash}`;
                const loginHref = `/login?returnTo=${encodeURIComponent(current)}`;
                return (
                  <Link to={loginHref} onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full rounded-xl mb-2"
                    >
                      Login
                    </Button>
                  </Link>
                );
              })()}
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-xl border-primary/30 text-primary mb-2"
                  >
                    Admin
                  </Button>
                </Link>
              )}
              <Link to="/cart" onClick={() => setIsOpen(false)}>
                <Button 
                  variant="default" 
                  className="w-full rounded-xl bg-gradient-candy text-white border-0 font-medium hover:shadow-lg transition-all duration-300"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;