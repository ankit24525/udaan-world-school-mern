import { motion } from "framer-motion";
import { ArrowRight, Quote, Sparkles, Star } from "lucide-react";
import useManagedSection from "../hooks/useManagedSection.js";
import { ensureArray, getInitials } from "../utils/publicContent.js";

const fallbackTestimonials = {
  title: "What parents say about us",
  meta: {
    stars: 5,
    items: [
      {
        name: "Ritika Sharma",
        text: "Udaan World School has transformed my child&apos;s confidence and academic growth.",
      },
      {
        name: "Aman Verma",
        text: "Excellent teachers, modern facilities and discipline. One of the best decisions for our family.",
      },
      {
        name: "Neha Singh",
        text: "The school focuses on studies as well as values, creativity and personality development.",
      },
    ],
  },
};

export default function Testimonials() {
  const section = useManagedSection("homeTestimonials", fallbackTestimonials);
  const items = ensureArray(section.meta?.items, fallbackTestimonials.meta.items);
  const stars = Number(section.meta?.stars || fallbackTestimonials.meta.stars);

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.08),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.08),transparent_26%)]" />
      <div className="containerx relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-600">
            <Sparkles size={16} />
            Testimonials
          </span>
          <h2 className="mt-6 text-4xl font-black leading-tight text-slate-900 md:text-6xl">
            {section.title || fallbackTestimonials.title}
          </h2>
        </motion.div>

        <div className="mt-16 overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            className="flex w-max gap-7"
          >
            {[...items, ...items].map((item, index) => (
              <motion.article
                key={`${item.name}-${index}`}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative w-[300px] overflow-hidden rounded-[26px] border border-slate-100 bg-white p-6 shadow-2xl md:w-[420px] md:rounded-[30px] md:p-8"
              >
                <Quote size={52} className="absolute right-6 top-6 text-cyan-100" />
                <div className="relative z-10 flex gap-1">
                  {Array.from({ length: Math.max(1, Math.min(stars, 5)) }).map((_, starIndex) => (
                    <Star key={starIndex} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="relative z-10 mt-6 text-sm leading-7 text-slate-600 md:text-base md:leading-8">{item.text}</p>
                <div className="relative z-10 mt-8 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-black text-white">
                    {getInitials(item.name)}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900">{item.name}</h4>
                    <p className="font-medium text-cyan-600">Parent</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-14 text-center"
        >
          <a
            href="/admission-enquiry"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-bold text-white shadow-xl"
          >
            Join Our Family
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
