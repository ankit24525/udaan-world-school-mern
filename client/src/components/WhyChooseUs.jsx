import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import useManagedSection from "../hooks/useManagedSection.js";
import { ensureArray, resolveIcon } from "../utils/publicContent.js";

function getCardHref(item = {}) {
  const title = String(item.title || "").trim().toLowerCase();
  const rawHref = String(item.href || "").trim();

  if (title.includes("safe campus")) {
    return "/safe-campus";
  }

  if (title.includes("holistic")) {
    return "/holistic-growth";
  }

  if (rawHref) return rawHref;

  if (title.includes("academic")) return "/academics";
  if (title.includes("safe campus") || title.includes("campus")) return "/safe-campus";
  if (title.includes("smart learning") || title.includes("smart")) return "/smart-classes";
  if (title.includes("holistic")) return "/holistic-growth";

  return "/about-us";
}

const fallbackWhyChooseUs = {
  eyebrow: "Why Choose Us",
  title: "A school built for future leaders",
  body: "Premium education, discipline and innovation in a nurturing environment.",
  meta: {
    cards: [
      {
        title: "Academic Excellence",
        image: "/images/people/principal.jpeg",
        text: "Strong academics with modern teaching methods and outstanding results.",
        icon: "Trophy",
        href: "/academics",
      },
      {
        title: "Safe Campus",
        image: "/images/people/director.jpeg",
        text: "Secure environment with discipline, care and student wellbeing.",
        icon: "ShieldCheck",
        href: "/safe-campus",
      },
      {
        title: "Smart Learning",
        image: "/images/people/founder.jpeg",
        text: "Technology-enabled classrooms and practical learning exposure.",
        icon: "BookOpen",
        href: "/smart-classes",
      },
      {
        title: "Holistic Growth",
        image: "/udaan-world-logo.jpeg",
        text: "Sports, arts, values and leadership development together.",
        icon: "HeartHandshake",
        href: "/holistic-growth",
      },
    ],
  },
};

export default function WhyChooseUs() {
  const section = useManagedSection("homeWhyChooseUs", fallbackWhyChooseUs);
  const cards = ensureArray(section.meta?.cards, fallbackWhyChooseUs.meta.cards);

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.12),transparent_26%)]" />
      <div className="containerx relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold text-cyan-300">
            <Sparkles size={16} />
            {section.eyebrow || fallbackWhyChooseUs.eyebrow}
          </span>
          <h2 className="mt-6 text-4xl font-black leading-tight text-white md:text-6xl">
            {section.title || fallbackWhyChooseUs.title}
          </h2>
          <p className="mt-6 text-base leading-7 text-white/70 md:text-lg md:leading-8">
            {section.body || fallbackWhyChooseUs.body}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {cards.map((item, index) => (
            <WhyChooseCard key={`${item.title}-${index}`} item={item} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
            className="mt-14 rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl md:p-8"
          >
          <p className="text-lg font-semibold text-white md:text-2xl">
            Empowering students to dream bigger, achieve higher and lead better.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function WhyChooseCard({ item, index }) {
  const Icon = resolveIcon(item.icon, Sparkles);
  const href = getCardHref(item);

  return (
    <motion.article
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
    >
      <div className="relative h-[240px] overflow-hidden md:h-[320px]">
        <img
          src={item.image || fallbackWhyChooseUs.meta.cards[0].image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: index * 0.15 }}
          className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-400 blur-3xl"
        />
      </div>
      <div className="p-7">
        <div className="relative z-10 -mt-14 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 shadow-xl">
          <Icon className="text-white" size={28} />
        </div>
        <h3 className="mt-5 text-2xl font-black text-white md:text-3xl">{item.title}</h3>
        <div className="mt-3 h-[3px] w-[90px] rounded-full bg-cyan-400" />
        <p className="mt-5 text-sm leading-7 text-white/70 md:text-base">{item.text}</p>
        <Link
          to={href}
          className="mt-6 inline-flex items-center gap-2 font-semibold text-cyan-300 transition duration-300 hover:translate-x-1 hover:text-cyan-200"
        >
          Learn More
          <ArrowRight size={18} />
        </Link>
      </div>
    </motion.article>
  );
}
