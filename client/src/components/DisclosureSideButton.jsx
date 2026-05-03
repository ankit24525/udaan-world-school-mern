import { AnimatePresence, motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DisclosureSideButton() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (location.pathname === "/mandatory-public-disclosure") {
    return null;
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.22 }}
          className="fixed right-0 top-1/2 z-[55] -translate-y-1/2"
        >
          <Link
            to="/mandatory-public-disclosure"
            className="flex items-center gap-2 rounded-l-2xl bg-gradient-to-b from-cyan-500 to-blue-700 px-3 py-5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_rgba(14,165,233,0.28)] [writing-mode:vertical-rl] md:px-4"
          >
            <FileText size={16} className="rotate-90" />
            Mandatory Public Disclosure
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
