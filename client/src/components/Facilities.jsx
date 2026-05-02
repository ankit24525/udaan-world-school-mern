import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import useManagedSection from "../hooks/useManagedSection.js";
import api from "../services/api";
import { ensureArray } from "../utils/publicContent.js";

const fallbackFacilities = {
  title: "Campus Highlights",
  meta: {
    items: [
      {
        title: "Classrooms",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Library",
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Labs",
        image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Sports",
        image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Campus Life",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Canteen",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
      },
    ],
  },
};

export default function Facilities() {
  const section = useManagedSection("homeFacilities", fallbackFacilities);
  const [dynamicFacilities, setDynamicFacilities] = useState([]);

  useEffect(() => {
    async function fetchFacilities() {
      try {
        const res = await api.get("/facilities");
        setDynamicFacilities(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchFacilities();
  }, []);

  const managedFacilities = ensureArray(section.meta?.items, fallbackFacilities.meta.items).map((item, index) =>
    typeof item === "string"
      ? { title: item, image: fallbackFacilities.meta.items[index]?.image || fallbackFacilities.meta.items[0].image }
      : {
          title: item.title || fallbackFacilities.meta.items[index]?.title || `Facility ${index + 1}`,
          image: item.image || fallbackFacilities.meta.items[index]?.image || fallbackFacilities.meta.items[0].image,
        }
  );

  const facilities = useMemo(() => {
    const map = new Map();

    managedFacilities.forEach((item, index) => {
      map.set(String(item.title).toLowerCase(), {
        title: item.title,
        image: item.image,
        order: index,
      });
    });

    dynamicFacilities.forEach((item, index) => {
      const key = String(item.name || `facility-${index}`).toLowerCase();
      const fallbackImage = managedFacilities[index % managedFacilities.length]?.image || fallbackFacilities.meta.items[0].image;

      map.set(key, {
        title: item.name || `Facility ${index + 1}`,
        image: item.image || fallbackImage,
        order: map.has(key) ? map.get(key).order : managedFacilities.length + index,
      });
    });

    return [...map.values()].sort((a, b) => a.order - b.order);
  }, [managedFacilities, dynamicFacilities]);

  return (
    <section className="bg-white py-20">
      <div className="containerx">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
              Campus Highlights
            </p>
            <h2 className="mt-3 text-4xl font-black text-slate-900 md:text-5xl">
              {section.title || fallbackFacilities.title}
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {facilities.map((facility, index) => (
            <motion.article
              key={`${facility.title}-${index}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative h-[180px] overflow-hidden md:h-[210px]"
            >
              <img
                src={facility.image}
                alt={facility.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/45 transition group-hover:bg-black/25" />
              <h3 className="absolute bottom-5 left-5 text-2xl font-black text-white md:text-3xl">
                {facility.title}
              </h3>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
