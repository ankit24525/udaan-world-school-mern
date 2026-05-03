import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, GraduationCap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import useManagedSection from "../hooks/useManagedSection.js";
import { pickImage, splitLines, splitParagraphs } from "../utils/publicContent.js";

const fallbackAbout = {
  eyebrow: "About Udaan World School",
  title: "Learn Today Lead Tomorrow",
  body:
    "Udaan World School provides a premium learning environment focused on academics, discipline, innovation and all-round student success.",
  imageUrl: "/images/people/principal.jpeg",
  highlights: [
    "Modern academics with future-ready curriculum",
    "Smart classrooms, labs and activity learning",
    "Discipline, values and leadership building",
    "Sports, arts and personality development",
  ],
};

export default function About() {
  const about = useManagedSection("homeAbout", fallbackAbout);
  if (about.__loading) {
    return (
      <section className="relative overflow-hidden bg-white py-28 text-slate-900">
        <div className="containerx relative z-10 grid items-center gap-16 lg:grid-cols-2">
          <div className="shadow-shimmer-card h-[560px]" />
          <div>
            <div className="shadow-shimmer-line h-10 w-52" />
            <div className="mt-6 space-y-4">
              <div className="shadow-shimmer-line h-14 w-full" />
              <div className="shadow-shimmer-line h-14 w-5/6" />
            </div>
            <div className="mt-8 space-y-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="shadow-shimmer-line h-5 w-full" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  const paragraphs = splitParagraphs(about.body, splitParagraphs(fallbackAbout.body));
  const points = splitLines(about.highlights, fallbackAbout.highlights);
  const image = pickImage(about.imageUrl, fallbackAbout.imageUrl);

  return (
    <section className="relative overflow-hidden bg-white py-20 text-slate-900 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.08),transparent_30%)]" />
      <div className="containerx relative z-10 grid items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
          className="relative"
        >
          <motion.div
            whileHover={{ y: -8 }}
            className="overflow-hidden rounded-[32px] shadow-2xl"
          >
            <img src={image} alt={about.title || fallbackAbout.title} className="h-[360px] w-full object-cover md:h-[560px]" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity }}
            className="absolute -bottom-6 left-4 w-[220px] rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 p-5 text-white shadow-2xl md:-bottom-8 md:left-8 md:w-64 md:p-6"
          >
            <GraduationCap />
            <h4 className="mt-3 text-2xl font-black">Admissions Open</h4>
            <p className="mt-2 text-sm text-white/80">Build your child&apos;s next chapter with us</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ x: 60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-600">
            <Sparkles size={16} />
            {about.eyebrow || fallbackAbout.eyebrow}
          </span>
          <h2 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
            {about.title || fallbackAbout.title}
          </h2>

          <div className="mt-7 space-y-5">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 space-y-5">
            {points.map((item, index) => (
              <motion.div
                key={`${item}-${index}`}
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex items-start gap-4"
              >
                <CheckCircle2 className="mt-1 shrink-0 text-cyan-500" size={22} />
                <p className="text-base text-slate-700 md:text-lg">{item}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-5">
            <Link
              to="/about-us"
              className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-bold text-white shadow-xl"
            >
              Know More
            </Link>
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-3 rounded-full border border-slate-300 px-8 py-4 font-bold text-slate-900 transition duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:text-cyan-700 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)]"
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
