<<<<<<< HEAD
import { useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const SEOHead = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/signup';
  return (
    <Helmet>
      <meta name="robots" content={isAdminPath ? "noindex, nofollow" : "index, follow"} />
    </Helmet>
  );
};

export default SEOHead;
=======
import { useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const SEOHead = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/signup';
  return (
    <Helmet>
      <meta name="robots" content={isAdminPath ? "noindex, nofollow" : "index, follow"} />
    </Helmet>
  );
};

export default SEOHead;
>>>>>>> cf3b96f63dd429b0a17bbe128b6c7a693ae364f5
