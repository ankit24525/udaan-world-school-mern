import { motion } from "framer-motion";
import { ArrowRight, Quote, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import useManagedSection from "../hooks/useManagedSection.js";
import { pickImage, splitParagraphs } from "../utils/publicContent.js";

const fallbackChairman = {
  eyebrow: "Director's Message",
  title: "Shaping futures with vision",
  body:
    "Every child carries limitless potential. Our mission is to create a nurturing, disciplined and inspiring environment where students rise with confidence, values and excellence.",
  imageUrl: "/images/people/director.jpeg",
  meta: {
    signatureName: "Udaan Leadership",
    signatureRole: "Director, Udaan World School",
  },
};

export default function Chairman() {
  const section = useManagedSection("homeChairman", fallbackChairman);
  if (section.__loading) {
    return (
      <section className="relative overflow-hidden bg-white py-28">
        <div className="containerx relative z-10 grid items-center gap-16 lg:grid-cols-2">
          <div className="flex justify-center">
            <div className="shadow-shimmer-card h-[420px] w-[420px] rounded-full" />
          </div>
          <div>
            <div className="shadow-shimmer-line h-10 w-44" />
            <div className="mt-6 shadow-shimmer-line h-14 w-full" />
            <div className="mt-8 shadow-shimmer-card p-8">
              <div className="space-y-5">
                <div className="shadow-shimmer-line h-5 w-full" />
                <div className="shadow-shimmer-line h-5 w-11/12" />
                <div className="shadow-shimmer-line h-5 w-9/12" />
                <div className="shadow-shimmer-line h-8 w-40" />
                <div className="shadow-shimmer-line h-4 w-52" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  const image = pickImage(section.imageUrl, fallbackChairman.imageUrl);
  const paragraphs = splitParagraphs(section.body, splitParagraphs(fallbackChairman.body));

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="containerx relative z-10 grid items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative flex justify-center"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="relative h-[280px] w-[280px] overflow-hidden rounded-full border-[10px] border-blue-500 shadow-[0_35px_80px_rgba(0,0,0,0.22)] md:h-[420px] md:w-[420px]"
          >
            <img src={image} alt={section.title || fallbackChairman.title} className="h-full w-full scale-110 object-cover" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-600">
            <Sparkles size={16} />
            {section.eyebrow || fallbackChairman.eyebrow}
          </span>
          <h2 className="mt-6 text-4xl font-black leading-tight text-slate-900 md:text-6xl">
            {section.title || fallbackChairman.title}
          </h2>

          <div className="relative mt-8 rounded-[28px] border border-slate-100 bg-white p-8 shadow-xl">
            <Quote className="absolute right-6 top-6 text-blue-100" size={60} />
            <div className="relative z-10 space-y-5">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-7 text-slate-600 md:text-lg md:leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-6 text-2xl font-black text-slate-900">
              {section.meta?.signatureName || fallbackChairman.meta.signatureName}
            </p>
            <p className="font-semibold text-blue-600">
              {section.meta?.signatureRole || fallbackChairman.meta.signatureRole}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/chairmans-message"
              className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-bold text-white shadow-xl"
            >
              Read Full Message
            </Link>
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-3 rounded-full border border-slate-300 px-8 py-4 font-bold text-slate-900"
            >
              Contact Us
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
