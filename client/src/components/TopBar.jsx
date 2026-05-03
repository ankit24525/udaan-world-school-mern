import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { Icons } from "../data/siteData.js";

const defaultSettings = {
  social: {
    facebook: "https://www.facebook.com/udaanworldschool",
    instagram: "https://www.instagram.com/udaanworldschool",
    youtube: "https://www.youtube.com/@udaanworldschool",
  },
};

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
      { label: "Facebook", icon: FacebookIcon, href: settings.social.facebook || "#" },
      { label: "Instagram", icon: InstagramIcon, href: settings.social.instagram || "#" },
      { label: "YouTube", icon: YouTubeIcon, href: settings.social.youtube || "#" },
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
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              className="transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <item.icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
