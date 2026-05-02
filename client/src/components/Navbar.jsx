import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { images, navItems } from "../data/siteData.js";
import api from "../services/api";

const defaultNotice =
  "Admissions Open 2026 • Limited Seats Available • Smart Classes • Hostel Facility • Apply Now";

const defaultSettings = {
  contact: {
    email: "udaanworldschool@gmail.com",
  },
  social: {
    facebook: "https://www.facebook.com/udaanworldschool",
    instagram: "https://www.instagram.com/udaanworldschool",
    linkedin: "https://www.linkedin.com/school/udaan-world-school",
    youtube: "https://www.youtube.com/@udaanworldschool",
  },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notice, setNotice] = useState(defaultNotice);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    const saved = localStorage.getItem("school_notice");
    if (saved) setNotice(saved);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.get("/content", { params: { type: "page", key: "adminSettings" } });
        const saved = Array.isArray(res.data) ? res.data[0] : null;
        if (saved?.meta) {
          setSettings({
            contact: { ...defaultSettings.contact, ...(saved.meta.contact || {}) },
            social: { ...defaultSettings.social, ...(saved.meta.social || {}) },
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchSettings();
  }, []);

  const socialLinks = useMemo(
    () =>
      [
        { label: "Facebook", short: "F", href: settings.social.facebook || "#" },
        { label: "Instagram", short: "IG", href: settings.social.instagram || "#" },
        { label: "LinkedIn", short: "IN", href: settings.social.linkedin || "#" },
        { label: "YouTube", short: "YT", href: settings.social.youtube || "#" },
      ].filter((item) => item.href && item.href !== "#"),
    [settings]
  );

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-700 to-cyan-600 text-white h-10 flex items-center border-b border-white/10">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap font-semibold text-sm flex"
        >
          <span className="px-8">{notice}</span>
          <span className="px-8">{notice}</span>
          <span className="px-8">{notice}</span>
          <span className="px-8">{notice}</span>
        </motion.div>
      </div>

      <section className="hidden md:block bg-slate-950 text-white border-b border-white/10">
        <div className="containerx py-3 flex justify-between items-center text-sm">
          <div className="flex gap-6 items-center">
            <a href="tel:+918650105946" className="flex gap-2 items-center hover:text-cyan-300">
              <Phone size={15} className="text-cyan-400" />
              +91 86501 05946
            </a>
            <a href={`mailto:${settings.contact.email || defaultSettings.contact.email}`} className="flex gap-2 items-center hover:text-cyan-300">
              <Mail size={15} className="text-cyan-400" />
              {settings.contact.email || defaultSettings.contact.email}
            </a>
            <div className="hidden xl:flex gap-2 items-center text-white/70">
              <MapPin size={15} className="text-cyan-400" />
              Baheri Bareilly, UP
            </div>
          </div>
          <div className="flex gap-2">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="social-dot"
              >
                {item.short}
              </a>
            ))}
          </div>
        </div>
      </section>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-slate-900/90 backdrop-blur-xl border-b border-white/10"
            : "bg-slate-950 border-b border-white/10"
        }`}
      >
        <div className="containerx h-[76px] md:h-[84px] flex items-center justify-between gap-4 md:gap-6">
          <Link to="/" className="shrink-0">
            <img src={images.logo} alt="Udaan World School" className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/50 md:w-16 md:h-16" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div className="relative group" key={item.label}>
                <NavLink
                  to={item.href || "#"}
                  className="px-4 py-3 text-white/90 hover:text-cyan-300 font-semibold text-sm inline-flex items-center gap-1"
                >
                  {item.label}
                  {item.items ? <ChevronDown size={14} /> : null}
                </NavLink>
                {item.items ? (
                  <div className="absolute top-full left-0 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition bg-white text-slate-900 rounded-xl shadow-2xl min-w-[240px] p-2 z-50">
                    {item.items.map((child) => (
                      <Link key={child.label} to={child.href} className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-sm font-medium">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <Link to="/admission-enquiry" className="hidden lg:inline-flex px-5 py-3 rounded-full blue-gradient text-white font-bold text-sm">
            Admission Enquiry
          </Link>

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="lg:hidden w-11 h-11 rounded-xl border border-white/15 text-white grid place-items-center"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-white/10 bg-slate-950"
            >
              <div className="containerx max-h-[70vh] overflow-y-auto py-4 space-y-1">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <Link
                      to={item.href || "#"}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 font-medium"
                    >
                      {item.label}
                    </Link>
                    {item.items ? (
                      <div className="ml-3 border-l border-white/10 pl-3">
                        {item.items.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            onClick={() => setOpen(false)}
                            className="block px-3 py-1.5 rounded text-white/70 hover:text-cyan-300 text-sm"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
