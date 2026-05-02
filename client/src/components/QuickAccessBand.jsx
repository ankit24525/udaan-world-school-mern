import { motion } from "framer-motion";
import { ArrowRight, FileText, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const quickActions = [
  {
    label: "New Admission",
    href: "/admission-enquiry",
    icon: GraduationCap,
    variant: "solid",
  },
  {
    label: "Prospectus",
    href: "/admission-procedure",
    icon: ArrowRight,
    variant: "ghost",
  },
  {
    label: "Disclosure",
    href: "/mandatory-public-disclosure",
    icon: FileText,
    variant: "ghost",
  },
];

export default function QuickAccessBand() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a5cff] via-[#0b63ff] to-[#003fc7] py-20 md:py-24">
      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:60px_60px]" />

      <motion.div
        animate={{ x: [0, 12, 0], y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-10 top-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -18, 0], y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl"
      />

      <div className="containerx relative z-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75 }}
          className="text-white"
        >
          <h2 className="text-4xl font-black leading-tight md:text-7xl">
            Udaan <br /> World School
          </h2>

          <div className="mt-6 overflow-hidden">
            <motion.p
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-xl font-semibold tracking-wide text-cyan-200 md:text-3xl"
            >
              A Place For Growth
            </motion.p>
          </div>

          <div className="mt-5 h-[3px] w-[140px] rounded-full bg-white/80" />

          <div className="mt-10 flex flex-wrap gap-4">
            {quickActions.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.55 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.href}
                    className={
                      item.variant === "solid"
                        ? "inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 font-bold text-blue-700 shadow-2xl md:px-7"
                        : "inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/15 px-6 py-4 font-bold text-white backdrop-blur-md md:px-7"
                    }
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="overflow-hidden rounded-[28px] border border-white/20 shadow-[0_35px_80px_rgba(0,0,0,0.28)]"
          >
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400&auto=format&fit=crop"
              alt="Udaan World School students"
              className="h-[320px] w-full object-cover md:h-[520px]"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
