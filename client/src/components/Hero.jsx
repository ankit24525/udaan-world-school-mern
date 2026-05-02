import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import useManagedSection from "../hooks/useManagedSection.js";
import { ensureArray, pickImage, splitParagraphs } from "../utils/publicContent.js";

const fallbackHero = {
  eyebrow: "Admissions Open 2026",
  title: "UDAAN WORLD SCHOOL",
  body: "Where futures rise with confidence, care, and modern learning.",
  imageUrl: "/images/people/director.jpeg",
  meta: {
    slides: [
      "/images/people/director.jpeg",
      "/images/people/principal.jpeg",
      "/images/people/founder.jpeg",
    ],
  },
};

export default function Hero() {
  const hero = useManagedSection("homeHero", fallbackHero);
  const [index, setIndex] = useState(0);
  const slideImages = ensureArray(hero.meta?.slides, fallbackHero.meta.slides);
  const primaryImage = pickImage(hero.imageUrl, fallbackHero.imageUrl);
  const slides = slideImages.map((image, index) => ({
    image,
    badge: hero.eyebrow || fallbackHero.eyebrow,
    title: hero.title || fallbackHero.title,
    sub:
      splitParagraphs(hero.body, [fallbackHero.body])[0] ||
      fallbackHero.body,
    accent: index % 2 === 0 ? "text-cyan-300" : "text-amber-300",
  }));

  if (primaryImage && !slides.some((item) => item.image === primaryImage)) {
    slides.unshift({
      image: primaryImage,
      badge: hero.eyebrow || fallbackHero.eyebrow,
      title: hero.title || fallbackHero.title,
      sub:
        splitParagraphs(hero.body, [fallbackHero.body])[0] ||
        fallbackHero.body,
      accent: "text-cyan-300",
    });
  }

  useEffect(() => {
    if (hero.__loading || slides.length <= 1) return undefined;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [hero.__loading, slides.length]);

  if (hero.__loading) {
    return (
      <section className="relative min-h-[680px] overflow-hidden bg-slate-950 md:min-h-[760px]">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(3,15,31,0.94),rgba(9,48,97,0.76),rgba(3,15,31,0.86))]" />
        <div className="containerx relative z-10 flex min-h-[680px] items-center py-12 md:min-h-[760px] md:py-16">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-4xl">
              <div className="shadow-shimmer-line h-10 w-56 bg-white/20" />
              <div className="mt-7 space-y-4">
                <div className="shadow-shimmer-line h-20 w-full max-w-3xl bg-white/20" />
                <div className="shadow-shimmer-line h-16 w-full max-w-2xl bg-white/20" />
                <div className="shadow-shimmer-line h-6 w-full max-w-xl bg-white/20" />
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <div className="shadow-shimmer-line h-14 w-44 bg-white/20" />
                <div className="shadow-shimmer-line h-14 w-44 bg-white/20" />
              </div>
              <div className="mt-10 flex gap-3">
                <div className="shadow-shimmer-line h-3 w-12 bg-white/20" />
                <div className="shadow-shimmer-line h-3 w-3 bg-white/20" />
                <div className="shadow-shimmer-line h-3 w-3 bg-white/20" />
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="shadow-shimmer-card p-5">
                <div className="h-[480px] w-full rounded-[24px] bg-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const current = slides[index] || slides[0];
  const titleWords = String(current?.title || fallbackHero.title).split(" ");
  const titleTop = titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(" ");
  const titleBottom = titleWords.slice(Math.ceil(titleWords.length / 2)).join(" ");

  return (
    <section className="relative min-h-[680px] overflow-hidden md:min-h-[760px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.image}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${current.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(3,15,31,0.94),rgba(9,48,97,0.76),rgba(3,15,31,0.86))]" />

      <motion.div
        animate={{ y: [0, -24, 0], x: [0, 16, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute left-10 top-20 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 30, 0], x: [0, -14, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-20 right-12 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl"
      />

      <div className="containerx relative z-10 flex min-h-[680px] items-center py-12 md:min-h-[760px] md:py-16">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${current.image}-content`}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -28, opacity: 0 }}
                transition={{ duration: 0.65 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold tracking-wide text-cyan-100">
                  <Sparkles size={16} />
                  {current.badge}
                </span>

                <h1 className="mt-7 text-4xl font-black leading-[0.95] text-white sm:text-5xl md:text-7xl xl:text-8xl">
                  {titleTop}
                </h1>
                {titleBottom ? (
                  <h2 className={`mt-3 text-3xl font-black leading-tight sm:text-4xl md:text-6xl ${current.accent}`}>
                    {titleBottom}
                  </h2>
                ) : null}
                <p className="mt-6 max-w-2xl text-base font-light leading-7 text-white/80 md:text-2xl md:leading-8">
                  {current.sub}
                </p>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                to="/admission-enquiry"
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-sm font-bold text-white shadow-2xl transition hover:scale-[1.02]"
              >
                <GraduationCap size={20} />
                Start Admission
              </Link>
              <Link
                to="/about-us"
                className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 transition hover:scale-[1.02]"
              >
                Explore Campus
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            <div className="mt-10 flex gap-3">
              {slides.map((slide, itemIndex) => (
                <button
                  key={`${slide.image}-${itemIndex}`}
                  type="button"
                  onClick={() => setIndex(itemIndex)}
                  className={`rounded-full transition-all duration-300 ${
                    itemIndex === index
                      ? "h-3 w-12 bg-cyan-400"
                      : "h-3 w-3 bg-white/35"
                  }`}
                  aria-label={`Show slide ${itemIndex + 1}`}
                />
              ))}
            </div>
          </div>

          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-[32px] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl"
            >
              <div className="absolute -inset-4 rounded-[40px] bg-cyan-400/15 blur-3xl" />
              <img
                src={current.image}
                alt={current.title}
                className="relative h-[480px] w-full rounded-[24px] object-cover"
              />

              <div className="absolute -left-5 -top-5 rounded-2xl bg-white px-5 py-4 text-slate-900 shadow-2xl">
                <ShieldCheck className="text-cyan-500" />
                <p className="mt-2 text-sm font-black">Safe, modern campus</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
