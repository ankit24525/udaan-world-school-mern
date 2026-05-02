import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { Icons } from "../data/siteData.js";

const defaultSettings = {
  social: {
    facebook: "https://www.facebook.com/udaanworldschool",
    instagram: "https://www.instagram.com/udaanworldschool",
    linkedin: "https://www.linkedin.com/school/udaan-world-school",
  },
};

export default function TopBar() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.get("/content", { params: { type: "page", key: "adminSettings" } });
        const saved = Array.isArray(res.data) ? res.data[0] : null;
        if (saved?.meta?.social) {
          setSettings({
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
    ].filter((item) => item.href && item.href !== "#"),
    [settings]
  );

  return (
    <>
      <div className="announcement">
        <div className="marquee">
          <span>Empowering Minds, Shaping Futures - Admissions Open 2025-26, Join Udaan World School Today!</span>
          <span>Empowering Minds, Shaping Futures - Admissions Open 2025-26, Join Udaan World School Today!</span>
        </div>
      </div>

      <div className="contact-strip">
        <div className="contact-inner">
          <a href="tel:+918650105946"><Icons.Phone size={16} />+91 8650105946</a>
          <a href="tel:+917351171361"><Icons.Phone size={16} />+91 7351171361</a>
          <a href="mailto:udaanworldschool@gmail.com"><Icons.Mail size={16} />udaanworldschool@gmail.com</a>
        </div>
        <div className="socials" aria-label="Social links">
          {socialLinks.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
              {item.short}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
