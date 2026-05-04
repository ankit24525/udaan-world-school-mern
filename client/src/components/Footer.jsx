import { motion } from "framer-motion";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useManagedSection from "../hooks/useManagedSection.js";
import api from "../services/api";

const aboutLinks = [
  ["About Us", "/about-us"],
  ["Founders", "/founders"],
  ["Principal Desk", "/principals-desk"],
  ["Gallery", "/photo-gallery"],
  ["Events", "/events"],
];

const helpLinks = [
  ["Admissions", "/admission-procedure"],
  ["Fee Structure", "/fee-structure"],
  ["Scholarships", "/scholarships"],
  ["Careers", "/careers"],
  ["Blogs", "/blogs"],
];

const defaultSettings = {
  contact: {
    address: "Tewari's Richolla Farm, Baheri Bareilly, UP 243201",
    email: "udaanworldschool@gmail.com",
    phone1: "+91-8650105946",
    phone2: "+91-7351171361",
  },
  social: {
    facebook: "https://www.facebook.com/udaanworldschool",
    instagram: "https://www.instagram.com/udaanworldschool",
    youtube: "https://www.youtube.com/@udaanworldschool",
  },
};

const footerSocialFallback = {
  title: "Connect with",
  body: "social media",
};

export default function Footer() {
  const [settings, setSettings] = useState(defaultSettings);
  const socialBand = useManagedSection("footerSocialBand", footerSocialFallback);

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
    () => [
      { label: "Facebook", icon: FacebookIcon, href: settings.social.facebook || "#" },
      { label: "Instagram", icon: InstagramIcon, href: settings.social.instagram || "#" },
      { label: "YouTube", icon: YouTubeIcon, href: settings.social.youtube || "#" },
    ],
    [settings]
  );

  return (
    <footer className="relative -mt-1 overflow-hidden bg-slate-950 text-white">
      <section className="relative bg-black">
        <div className="h-[420px] w-full">
          <iframe title="Udaan World School Map" src="https://www.google.com/maps?q=Baheri%20Bareilly%20UP%20243201&output=embed" className="h-full w-full grayscale-[0.15]" loading="lazy" />
        </div>

        <div className="absolute -bottom-20 left-1/2 z-20 w-[96%] max-w-7xl -translate-x-1/2 md:-bottom-24">
          <motion.div
            whileHover={{ y: -4 }}
            className="overflow-hidden rounded-[22px] border-t-[3px] border-cyan-400 bg-[#f8fbff]/95 shadow-[0_35px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          >
            <div className="bg-[radial-gradient(circle,rgba(15,23,42,0.09)_1px,transparent_1.5px)] bg-[length:16px_16px] px-6 py-8 md:px-14 md:py-10">
              <div className="relative flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-center">
                <div className="flex w-full items-center gap-6">
                  <h2 className="text-center text-[2rem] font-light tracking-[-0.03em] text-black sm:text-[2.4rem] md:text-left md:text-[3.75rem] md:leading-none">
                    {socialBand.title || footerSocialFallback.title}{" "}
                    <span className="font-black">{socialBand.body || footerSocialFallback.body}</span>
                  </h2>
                </div>
                <div className="flex shrink-0 flex-nowrap items-center justify-center gap-4 md:gap-5">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="group flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-white shadow-[0_18px_35px_rgba(6,182,212,0.28)] transition duration-300 hover:-translate-y-1.5 hover:scale-[1.03] hover:bg-cyan-400 hover:shadow-[0_24px_45px_rgba(6,182,212,0.38)]"
                    >
                      <item.icon
                        size={22}
                        className="transition duration-300 group-hover:scale-110"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative bg-slate-950 pb-8 pt-32 md:pt-36">
        <div className="containerx relative z-10">
          <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <div className="inline-block rounded-xl bg-white p-5 shadow-xl">
                <h2 className="text-4xl font-black text-cyan-600">UDAAN</h2>
                <p className="text-lg font-bold text-black">WORLD SCHOOL</p>
              </div>
              <p className="mt-6 leading-7 text-white/80">Udaan World School delivers modern education with discipline, values, innovation and overall personality growth for future leaders.</p>
            </div>

            <FooterList title="About Us" items={aboutLinks} />
            <FooterList title="Helpful Links" items={helpLinks} />

            <div>
              <h3 className="text-2xl font-bold">Get in touch</h3>
              <div className="mt-4 mb-6 h-[2px] w-14 bg-cyan-400" />
              <div className="space-y-5 text-white/80">
                <div className="flex gap-3"><MapPin size={18} className="mt-1 shrink-0 text-cyan-400" /><p>{settings.contact.address}</p></div>
                <div className="flex gap-3"><Mail size={18} className="mt-1 shrink-0 text-cyan-400" /><p>{settings.contact.email}</p></div>
                <div className="flex gap-3"><Phone size={18} className="mt-1 shrink-0 text-cyan-400" /><p>{settings.contact.phone1}</p></div>
                <div className="flex gap-3"><Phone size={18} className="mt-1 shrink-0 text-cyan-400" /><p>{settings.contact.phone2}</p></div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/60 md:flex-row">
            <span>Copyright © 2026 Udaan World School, All rights reserved.</span>
            <span>
              <Link to="/term-of-services">Term of Services</Link> · <Link to="/privacy-policy">Privacy Policy</Link> · <Link to="/admin-guide">Admin Guide</Link> · <Link to="/admin/login">Admin Login</Link>
            </span>
          </div>
        </div>
      </section>
    </footer>
  );
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H16.7V5c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.4-4.1 4.1V11H7.5v3h2.7v8h3.3Z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.6 7.2a2.9 2.9 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30.7 30.7 0 0 0 1.9 12c0 1.6.2 3.2.5 4.8a2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2c.3-1.6.5-3.2.5-4.8s-.2-3.2-.5-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

function FooterList({ title, items }) {
  return (
    <div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <div className="mt-4 mb-6 h-[2px] w-14 bg-cyan-400" />
      <div className="space-y-4">
        {items.map(([label, href]) => (
          <Link key={label} to={href} className="flex gap-3 text-white/80 hover:text-cyan-300">
            <BookOpen size={16} className="mt-1 text-cyan-400" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
