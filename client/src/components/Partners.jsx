import { motion } from "framer-motion";
import { partnerLogos } from "../data/siteData.js";
import useManagedSection from "../hooks/useManagedSection.js";
import { ensureArray } from "../utils/publicContent.js";

const fallbackPartners = {
  title: "Knowledge Partners",
  meta: {
    logos: partnerLogos,
  },
};

export default function Partners() {
  const section = useManagedSection("homePartners", fallbackPartners);
  const logos = ensureArray(section.meta?.logos, fallbackPartners.meta.logos);

  return (
    <section className="bg-slate-950 py-20 md:py-24">
      <div className="containerx">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Partnerships
          </p>
          <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">
            {section.title || fallbackPartners.title}
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {logos.map((logo, index) => (
            <motion.div
              key={`${logo}-${index}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className="flex h-24 items-center justify-center rounded-[20px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:h-32 md:rounded-[24px] md:p-6"
            >
              <img src={logo} alt="Knowledge partner" className="max-h-full w-full object-contain" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
