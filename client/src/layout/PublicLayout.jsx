import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuickAccessBand from "../components/QuickAccessBand";
import ScrollToTopButton from "../components/ScrollToTopButton";
import DisclosureSideButton from "../components/DisclosureSideButton";
import "../styles.css"; // ✅ ONLY HERE

export default function PublicLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="website">
      <Navbar />

      <main className="site-main">
        <Outlet />
      </main>

      <QuickAccessBand />

      <Footer />

      <DisclosureSideButton />
      <ScrollToTopButton />
    </div>
  );
}
