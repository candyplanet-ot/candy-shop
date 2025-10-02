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
