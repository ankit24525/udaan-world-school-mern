import { useEffect, useState } from "react";
import api from "../services/api";
import { attachLiveRefresh } from "../utils/liveUpdates";

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
          // Keep shimmer state instead of flashing fallback content when the backend is unavailable.
          setSection({ ...(fallbackData || {}), __loading: true, __error: true });
        }
      }
    }

    fetchSection();
    const cleanup = attachLiveRefresh(fetchSection);

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [sectionKey, fallbackData]);

  return section;
}
