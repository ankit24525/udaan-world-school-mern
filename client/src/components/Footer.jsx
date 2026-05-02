import { motion } from "framer-motion";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
    linkedin: "https://www.linkedin.com/school/udaan-world-school",
  },
};

export default function Footer() {
  const [settings, setSettings] = useState(defaultSettings);

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
      { label: "Facebook", short: "f", href: settings.social.facebook || "#" },
      { label: "Instagram", short: "ig", href: settings.social.instagram || "#" },
      { label: "LinkedIn", short: "in", href: settings.social.linkedin || "#" },
    ],
    [settings]
  );

  return (
    <footer className="relative -mt-1 overflow-hidden bg-slate-950 text-white">
      <section className="relative bg-black">
        <div className="h-[420px] w-full">
          <iframe title="Udaan World School Map" src="https://www.google.com/maps?q=Baheri%20Bareilly%20UP%20243201&output=embed" className="h-full w-full grayscale-[0.15]" loading="lazy" />
        </div>

        <div className="absolute -bottom-20 left-1/2 z-20 w-[92%] max-w-7xl -translate-x-1/2 md:-bottom-24">
          <motion.div whileHover={{ y: -4 }} className="rounded-2xl border-t-4 border-cyan-500 bg-[#f8fafc]/95 px-5 py-8 shadow-[0_35px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl md:px-14 md:py-10">
            <div className="relative flex flex-col items-center justify-between gap-6 lg:flex-row">
              <div className="flex w-full items-center gap-6">
                <h2 className="text-center text-2xl font-light text-black md:text-left md:text-5xl">
                  Connect with <span className="font-black">social media</span>
                </h2>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {socialLinks.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-white shadow-xl">
                    {item.short}
                  </a>
                ))}
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
