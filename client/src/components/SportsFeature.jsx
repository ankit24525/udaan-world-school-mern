import { motion } from "framer-motion";
import { PlayCircle, Sparkles } from "lucide-react";
import useManagedSection from "../hooks/useManagedSection.js";
import { ensureArray, pickImage, splitParagraphs } from "../utils/publicContent.js";

const fallbackSports = {
  eyebrow: "Sports and Campus Life",
  title: "Champions are made here",
  body: "With world-class facilities and expert coaches, we turn potential into excellence.",
  imageUrl: "/images/people/director.jpeg",
  meta: {
    images: [
      "/images/people/director.jpeg",
      "/images/people/principal.jpeg",
      "/images/people/founder.jpeg",
    ],
    videoUrl: "",
  },
};

function getEmbedUrl(url) {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) return url;
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&]+)/);
  if (shortsMatch?.[1]) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch?.[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

function isEmbeddableVideoUrl(url = "") {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}

export default function SportsFeature() {
  const section = useManagedSection("homeSportsFeature", fallbackSports);
  if (section.__loading) {
    return (
      <section className="relative overflow-hidden bg-slate-950 py-28">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(3,21,45,0.95),rgba(8,61,140,0.86),rgba(2,19,42,0.95))]" />
        <div className="containerx relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto shadow-shimmer-line h-10 w-56 bg-white/20" />
            <div className="mx-auto mt-6 shadow-shimmer-line h-14 w-full max-w-2xl bg-white/20" />
            <div className="mx-auto mt-6 shadow-shimmer-line h-5 w-full max-w-xl bg-white/20" />
          </div>
          <div className="mt-16 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="shadow-shimmer-card h-[452px]" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="shadow-shimmer-card h-[204px]" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  const title = section.title || fallbackSports.title;
  const eyebrow = section.eyebrow || fallbackSports.eyebrow;
  const paragraphs = splitParagraphs(section.body, splitParagraphs(fallbackSports.body));
  const gallery = ensureArray(section.meta?.images, fallbackSports.meta.images);
  const heroImage = pickImage(section.imageUrl, gallery[0] || fallbackSports.imageUrl);
  const rawVideoUrl = section.meta?.videoUrl || fallbackSports.meta.videoUrl;
  const videoUrl = getEmbedUrl(rawVideoUrl);
  const useIframe = isEmbeddableVideoUrl(rawVideoUrl);

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(3,21,45,0.95),rgba(8,61,140,0.86),rgba(2,19,42,0.95))]" />

      <div className="containerx relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-cyan-300 md:px-5 md:text-sm">
            <Sparkles size={16} />
            {eyebrow}
          </span>
          <h2 className="mt-6 text-4xl font-black leading-tight text-white md:text-6xl">
            {title}
          </h2>
          <div className="mt-6 space-y-4">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-7 text-white/75 md:text-lg md:leading-8">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="overflow-hidden rounded-[30px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl"
          >
            {videoUrl && useIframe ? (
              <iframe
                src={videoUrl}
                title={title}
                className="h-[280px] w-full rounded-[22px] md:h-[420px]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : videoUrl ? (
              <video
                src={videoUrl}
                controls
                playsInline
                className="h-[280px] w-full rounded-[22px] object-cover md:h-[420px]"
              />
            ) : (
              <div className="relative">
                <img src={heroImage} alt={title} className="h-[280px] w-full rounded-[22px] object-cover md:h-[420px]" />
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30">
                  <div className="rounded-full bg-white/15 p-5 backdrop-blur-md">
                    <PlayCircle className="text-white" size={48} />
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {gallery.slice(0, 3).map((image, index) => (
              <motion.div
                key={`${image}-${index}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="overflow-hidden rounded-[24px] border border-white/10 bg-white/10 p-3 backdrop-blur-xl"
              >
                <img src={image} alt={`Sports ${index + 1}`} className="h-[150px] w-full rounded-[18px] object-cover md:h-[180px]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
