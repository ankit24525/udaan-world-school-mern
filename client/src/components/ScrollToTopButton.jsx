import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(20);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 420);

      const documentHeight = document.documentElement.scrollHeight;
      const viewportBottom = window.scrollY + window.innerHeight;
      const distanceToBottom = Math.max(0, documentHeight - viewportBottom);
      const baseOffset = window.innerWidth >= 768 ? 32 : 20;
      const footerLift = Math.max(0, 180 - distanceToBottom);

      setBottomOffset(baseOffset + footerLift);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          onClick={handleClick}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          whileHover={{ y: -4, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed right-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-gradient-to-r from-cyan-500 to-blue-700 text-white shadow-[0_18px_40px_rgba(14,165,233,0.32)] backdrop-blur-xl md:right-6 md:h-14 md:w-14"
          style={{ bottom: `${bottomOffset}px` }}
          aria-label="Scroll to top"
        >
          <ChevronUp size={22} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
