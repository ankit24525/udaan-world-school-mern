import { motion } from "framer-motion";
import { GraduationCap, PlayCircle, User } from "lucide-react";
import { Link } from "react-router-dom";
import useManagedSection from "../hooks/useManagedSection.js";
import { ensureArray } from "../utils/publicContent.js";

const fallbackStories = {
  title: "Hear it straight from our stars",
  body: "Join us in creating more stories of success",
  meta: {
    videoIds: ["CkjoKofx7v0", "_04T2vn-zGQ", "Xweq6X4wzek"],
  },
};

export default function StudentStories() {
  const section = useManagedSection("homeStories", fallbackStories);
  const videoIds = ensureArray(section.meta?.videoIds, fallbackStories.meta.videoIds);

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 text-white md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.15),transparent_22%)]" />
      <div className="containerx relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black md:text-6xl">
            {section.title || fallbackStories.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg md:leading-8">
            {section.body || fallbackStories.body}
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {videoIds.map((id, index) => (
            <motion.div
              key={`${id}-${index}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl"
            >
              <iframe
                title={`Student story ${index + 1}`}
                src={`https://www.youtube.com/embed/${id}?controls=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-[220px] w-full rounded-[20px] md:h-[240px]"
              />
              <div className="mt-4 flex items-center gap-2 text-cyan-300">
                <PlayCircle size={18} />
                <span className="text-sm font-semibold">Student Story</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/admission-enquiry"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 font-bold text-white shadow-xl"
          >
            <User size={18} />
            New Admission
          </Link>
          <Link
            to="/admission-procedure"
            className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-7 py-4 font-bold text-white"
          >
            <GraduationCap size={18} />
            Prospectus
          </Link>
        </div>
      </div>
    </section>
  );
}
