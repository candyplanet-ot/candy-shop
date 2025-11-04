import { useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const SEOHead = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/signup';

  // Default meta tags
  const defaultTitle = "Candy Planet - Délices Sucrés Magiques | Bonbons Artisanaux";
  const defaultDescription = "Découvrez Candy Planet, votre destination pour des friandises magiques et des bonbons artisanaux. Lollipops, chocolats, gummies et plus encore. Livraison en France.";
  const defaultImage = "https://candyplanet.fr/favicon.ico";
  const siteUrl = "https://candyplanet.fr";

  // Page-specific meta tags
  const getPageMeta = () => {
    switch (location.pathname) {
      case '/':
        return {
          title: "Candy Planet - Bonbons Magiques & Friandises Artisanaux | Accueil",
          description: "Bienvenue sur Candy Planet ! Découvrez notre collection unique de friandises magiques, lollipops arc-en-ciel, chocolats belges et gummies artisanales. Commandez en ligne !",
          image: "https://candyplanet.fr/wmremove-transformed.jpeg"
        };
      case '/products':
        return {
          title: "Nos Produits - Candy Planet | Bonbons & Friandises en Ligne",
          description: "Explorez notre gamme complète de produits sucrés : lollipops, chocolats, gummies, cotton candy et spécialités internationales. Livraison rapide en France.",
          image: "https://candyplanet.fr/product-1.png"
        };
      case '/about':
        return {
          title: "À Propos - Candy Planet | Notre Histoire & Engagement Qualité",
          description: "Découvrez l'histoire de Candy Planet, notre engagement envers des ingrédients biologiques et notre passion pour créer des moments de joie sucrée.",
          image: "https://candyplanet.fr/wmremove-transformed.jpeg"
        };
      case '/cart':
        return {
          title: "Panier - Candy Planet | Vos Friandises Sélectionnées",
          description: "Vérifiez votre panier et finalisez votre commande de friandises magiques. Livraison gratuite dès 50€.",
        };
      case '/checkout':
        return {
          title: "Paiement - Candy Planet | Commande Sécurisée",
          description: "Finalisez votre commande en toute sécurité. Paiement protégé pour vos friandises préférées.",
        };
      default:
        return {
          title: defaultTitle,
          description: defaultDescription,
          image: defaultImage
        };
    }
  };

  const pageMeta = getPageMeta();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageMeta.title}</title>
      <meta name="description" content={pageMeta.description} />
      <meta name="robots" content={isAdminPath ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      <link rel="canonical" href={`${siteUrl}${location.pathname}`} />

      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${siteUrl}${location.pathname}`} />
      <meta property="og:title" content={pageMeta.title} />
      <meta property="og:description" content={pageMeta.description} />
      <meta property="og:image" content={pageMeta.image} />
      <meta property="og:site_name" content="Candy Planet" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageMeta.title} />
      <meta name="twitter:description" content={pageMeta.description} />
      <meta name="twitter:image" content={pageMeta.image} />

      {/* Additional SEO */}
      <meta name="author" content="Candy Planet" />
      <meta name="language" content="fr-FR" />
      <meta name="geo.region" content="FR" />
      <meta name="geo.country" content="France" />

      {/* Structured Data for Local Business */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Candy Planet",
          "description": "Boutique en ligne de friandises magiques et bonbons artisanaux",
          "url": "https://candyplanet.fr",
          "logo": "https://candyplanet.fr/favicon.ico",
          "image": "https://candyplanet.fr/wmremove-transformed.jpeg",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "FR"
          },
          "priceRange": "€€",
          "paymentAccepted": "Credit Card, PayPal",
          "currenciesAccepted": "EUR",
          "openingHours": "Mo-Su 00:00-23:59",
          "sameAs": [
            // Add social media URLs here when available
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
