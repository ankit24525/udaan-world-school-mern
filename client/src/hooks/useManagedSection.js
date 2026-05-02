import { useEffect, useState } from "react";
import api from "../services/api";

export default function useManagedSection(sectionKey, fallbackData) {
  const [section, setSection] = useState({ ...(fallbackData || {}), __loading: true });

  useEffect(() => {
    let isMounted = true;

    async function fetchSection() {
      try {
        const res = await api.get("/content", {
          params: {
            type: "page",
            key: sectionKey,
            published: true,
          },
        });

        const item = Array.isArray(res.data) ? res.data[0] : null;

        if (!isMounted) return;

        if (item) {
          setSection({ ...item, __loading: false });
        } else {
          setSection({ ...(fallbackData || {}), __loading: false });
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setSection({ ...(fallbackData || {}), __loading: false });
        }
      }
    }

    fetchSection();

    return () => {
      isMounted = false;
    };
  }, [sectionKey]);

  return section;
}
