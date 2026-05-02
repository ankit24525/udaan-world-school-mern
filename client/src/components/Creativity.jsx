import { motion } from "framer-motion";
import { ArrowRight, FileText, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import useManagedSection from "../hooks/useManagedSection.js";
import { ensureArray, pickImage, resolveIcon, splitParagraphs } from "../utils/publicContent.js";

const fallbackCreativity = {
  title: "Unlock your child&apos;s creativity",
  body: "Where learning goes beyond books and every moment sparks imagination.",
  imageUrl: "/images/people/founder.jpeg",
  meta: {
    stats: [
      { label: "Alumni", value: "15,000+", icon: "School" },
      { label: "Educators", value: "66+", icon: "BookOpen" },
      { label: "Graduation Rate", value: "97%", icon: "Trophy" },
    ],
  },
};

export default function Creativity() {
  const section = useManagedSection("homeCreativity", fallbackCreativity);
  if (section.__loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a5cff] via-[#0b63ff] to-[#003fc7] py-24">
        <div className="containerx relative z-10 grid items-center gap-16 lg:grid-cols-2">
          <div className="text-white">
            <div className="shadow-shimmer-line h-16 w-full max-w-2xl bg-white/20" />
            <div className="mt-6 space-y-4">
              <div className="shadow-shimmer-line h-6 w-full max-w-xl bg-white/20" />
              <div className="shadow-shimmer-line h-6 w-5/6 max-w-xl bg-white/20" />
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="shadow-shimmer-line h-14 w-40 bg-white/20" />
              <div className="shadow-shimmer-line h-14 w-40 bg-white/20" />
              <div className="shadow-shimmer-line h-14 w-40 bg-white/20" />
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="shadow-shimmer-dark p-5">
                  <div className="shadow-shimmer-line h-5 w-12 bg-white/15" />
                  <div className="mt-4 shadow-shimmer-line h-8 w-20 bg-white/15" />
                  <div className="mt-2 shadow-shimmer-line h-4 w-24 bg-white/15" />
                </div>
              ))}
            </div>
          </div>

          <div className="shadow-shimmer-card h-[520px]" />
        </div>
      </section>
    );
  }
  const paragraphs = splitParagraphs(section.body, splitParagraphs(fallbackCreativity.body));
  const stats = ensureArray(section.meta?.stats, fallbackCreativity.meta.stats);
  const image = pickImage(section.imageUrl, fallbackCreativity.imageUrl);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a5cff] via-[#0b63ff] to-[#003fc7] py-20 md:py-24">
      <div className="containerx relative z-10 grid items-center gap-16 lg:grid-cols-2">
        <div className="text-white">
          <motion.h2
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-black leading-tight md:text-7xl"
          >
            {section.title || fallbackCreativity.title}
          </motion.h2>

          <div className="mt-6 space-y-4">
            {paragraphs.map((paragraph) => (
              <motion.p
                key={paragraph}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75 }}
                className="max-w-2xl text-lg font-medium tracking-wide text-cyan-100 md:text-xl"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              to="/admission-enquiry"
              className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 font-bold text-blue-700 shadow-2xl"
            >
              <GraduationCap size={18} />
              New Admission
            </Link>
            <Link
              to="/about-us"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/15 px-7 py-4 font-bold text-white backdrop-blur-md"
            >
              About School
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/mandatory-public-disclosure"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/15 px-7 py-4 font-bold text-white backdrop-blur-md"
            >
              <FileText size={18} />
              Disclosure
            </Link>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {stats.map((item, index) => {
              const Icon = resolveIcon(item.icon);
              return (
                <motion.div
                  key={`${item.label}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl"
                >
                  <Icon className="text-cyan-200" size={22} />
                  <p className="mt-4 text-3xl font-black">{item.value}</p>
                  <p className="mt-2 text-sm text-white/75">{item.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="overflow-hidden rounded-[28px] border border-white/20 shadow-[0_35px_80px_rgba(0,0,0,0.28)]"
          >
            <img src={image} alt={section.title || fallbackCreativity.title} className="h-[340px] w-full object-cover md:h-[520px]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
