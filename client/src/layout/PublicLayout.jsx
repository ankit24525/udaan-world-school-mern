import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuickAccessBand from "../components/QuickAccessBand";
import ScrollToTopButton from "../components/ScrollToTopButton";
import "../styles.css"; // ✅ ONLY HERE

export default function PublicLayout() {
  return (
    <div className="website">
      <Navbar />

      <main className="site-main">
        <Outlet />
      </main>

      <QuickAccessBand />

      <Footer />

      <ScrollToTopButton />
    </div>
  );
}
