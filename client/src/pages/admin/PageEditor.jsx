import { Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { pageContent } from "../pageContent.js";
import { getManagedSectionConfig } from "./contentRegistry.js";

function buildId(prefix = "section") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createSection(type = "text") {
  const id = buildId(type);

  if (type === "split") {
    return {
      id,
      type,
      title: "Split Section",
      eyebrow: "",
      body: "",
      mediaUrl: "",
      secondaryMediaUrl: "",
      ctaLabel: "",
      ctaHref: "",
      signatureName: "",
      signatureRole: "",
      quoteBadge: false,
      theme: "light",
    };
  }

  if (type === "cards") {
    return {
      id,
      type,
      title: "Card Section",
      body: "",
      theme: "light",
      align: "left",
      variant: "default",
      columns: 3,
      items: [{ title: "", text: "", image: "" }],
    };
  }

  if (type === "gallery") {
    return {
      id,
      type,
      title: "Gallery Section",
      body: "",
      items: [{ url: "", caption: "" }],
    };
  }

  if (type === "eventGallery") {
    return {
      id,
      type,
      title: "Event Gallery",
      body: "",
      items: [],
    };
  }

  if (type === "infoPanel") {
    return {
      id,
      type,
      title: "General Information",
      label: "A : GENERAL INFORMATION",
      image: "",
      items: [{ icon: "School", text: "" }],
      extraLines: [""],
    };
  }

  if (type === "documentsTable") {
    return {
      id,
      type,
      title: "Documents",
      label: "B : DOCUMENTS AND INFORMATION",
      items: [{ name: "", fileUrl: "" }],
    };
  }

  if (type === "simpleTable") {
    return {
      id,
      type,
      title: "Table",
      label: "",
      columns: 2,
      headers: ["Label", "Value"],
      items: [{ label: "", value: "" }],
    };
  }

  if (type === "textList") {
    return {
      id,
      type,
      title: "List Section",
      label: "",
      items: [{ text: "" }],
    };
  }

  if (type === "video") {
    return {
      id,
      type,
      title: "Video Section",
      body: "",
      mediaUrl: "",
    };
  }

  if (type === "cta") {
    return {
      id,
      type,
      title: "Call To Action",
      body: "",
      ctaLabel: "Contact Us",
      ctaHref: "/contact-us",
      mediaUrl: "",
    };
  }

  return {
    id,
    type: "text",
    title: "Text Section",
    body: "",
    theme: "light",
  };
}

function normalizeSections(sections = []) {
  if (!Array.isArray(sections) || !sections.length) return [];

  return sections.map((section) => {
    const normalized = {
      id: section.id || buildId(section.type || "section"),
      type: section.type || "text",
      title: section.title || "",
      body: section.body || "",
      theme: section.theme || "light",
    };

    if (normalized.type === "split") {
      normalized.eyebrow = section.eyebrow || "";
      normalized.mediaUrl = section.mediaUrl || "";
      normalized.secondaryMediaUrl = section.secondaryMediaUrl || "";
      normalized.ctaLabel = section.ctaLabel || "";
      normalized.ctaHref = section.ctaHref || "";
      normalized.signatureName = section.signatureName || "";
      normalized.signatureRole = section.signatureRole || "";
      normalized.quoteBadge = Boolean(section.quoteBadge);
      normalized.variant = section.variant || "default";
      normalized.sideTitle = section.sideTitle || "";
      normalized.sideBody = section.sideBody || "";
      normalized.sideIcon = section.sideIcon || "";
    }

    if (normalized.type === "cards") {
      normalized.align = section.align || "left";
      normalized.variant = section.variant || "default";
      normalized.columns = Number(section.columns || 3);
      normalized.items = Array.isArray(section.items) && section.items.length
        ? section.items.map((item) => ({
            title: item.title || "",
            subtitle: item.subtitle || "",
            text: item.text || "",
            image: item.image || "",
            icon: item.icon || "",
          }))
        : [{ title: "", subtitle: "", text: "", image: "", icon: "" }];
    }

    if (normalized.type === "gallery") {
      normalized.items = Array.isArray(section.items) && section.items.length
        ? section.items.map((item) => ({
            url: item.url || "",
            caption: item.caption || "",
          }))
        : [{ url: "", caption: "" }];
    }

    if (normalized.type === "managedGallery") {
      normalized.source = section.source || "photos";
      normalized.mediaKind = section.mediaKind || "image";
      normalized.limit = Number(section.limit || 12);
      normalized.items = Array.isArray(section.items) && section.items.length
        ? section.items.map((item) => ({
            url: item.url || "",
            caption: item.caption || "",
          }))
        : [];
    }

    if (normalized.type === "eventGallery") {
      normalized.items = Array.isArray(section.items) && section.items.length
        ? section.items.map((item) => ({
            url: item.url || "",
            caption: item.caption || "",
          }))
        : [];
    }

    if (normalized.type === "infoPanel") {
      normalized.label = section.label || "";
      normalized.image = section.image || "";
      normalized.items = Array.isArray(section.items) && section.items.length
        ? section.items.map((item) => ({
            icon: item.icon || "School",
            text: item.text || "",
          }))
        : [{ icon: "School", text: "" }];
      normalized.extraLines = Array.isArray(section.extraLines) && section.extraLines.length
        ? section.extraLines.map((item) => item || "")
        : [""];
    }

    if (normalized.type === "documentsTable") {
      normalized.label = section.label || "";
      normalized.items = Array.isArray(section.items) && section.items.length
        ? section.items.map((item) => ({
            name: item.name || "",
            fileUrl: item.fileUrl || "",
          }))
        : [{ name: "", fileUrl: "" }];
    }

    if (normalized.type === "simpleTable") {
      normalized.label = section.label || "";
      normalized.columns = Number(section.columns || 2);
      normalized.variant = section.variant || "default";
      normalized.body = section.body || "";
      normalized.sideTitle = section.sideTitle || "";
      normalized.sideBody = section.sideBody || "";
      normalized.sideIcon = section.sideIcon || "";
      normalized.headers = Array.isArray(section.headers) && section.headers.length
        ? section.headers.map((item) => item || "")
        : ["Label", "Value"];
      normalized.items = Array.isArray(section.items) && section.items.length
        ? section.items.map((item) => ({
            label: item.label || "",
            value: item.value || "",
          }))
        : [{ label: "", value: "" }];
    }

    if (normalized.type === "textList") {
      normalized.label = section.label || "";
      normalized.eyebrow = section.eyebrow || "";
      normalized.variant = section.variant || "default";
      normalized.mediaUrl = section.mediaUrl || "";
      normalized.items = Array.isArray(section.items) && section.items.length
        ? section.items.map((item) => ({
            text: item.text || "",
          }))
        : [{ text: "" }];
    }

    if (normalized.type === "video" || normalized.type === "cta") {
      normalized.mediaUrl = section.mediaUrl || "";
    }

    if (normalized.type === "cta") {
      normalized.ctaLabel = section.ctaLabel || "";
      normalized.ctaHref = section.ctaHref || "";
      normalized.variant = section.variant || "default";
      normalized.icon = section.icon || "";
    }

    return normalized;
  });
}

function getRequiredSectionIds(key) {
  if (key === "founders") {
    return ["founder-message", "founder-principles"];
  }

  return [];
}

function isImmutableSection(key, sectionId) {
  return key === "founders" && sectionId === "founder-principles";
}

function isStrictStructuredPage(key) {
  return ["events", "photoGallery", "videoGallery", "eventsGallery"].includes(key);
}

function isManagedGalleryPage(key) {
  return ["photoGallery", "videoGallery", "eventsGallery"].includes(key);
}

function isEventsPage(key) {
  return key === "events";
}

function getAddableSectionTypes(pageKey) {
  if (isEventsPage(pageKey) || isManagedGalleryPage(pageKey)) {
    return [];
  }

  return [
    ["text", "Text"],
    ["split", "Split"],
    ["cards", "Cards"],
    ["gallery", "Gallery"],
    ["infoPanel", "Info Panel"],
    ["documentsTable", "Docs Table"],
    ["simpleTable", "Simple Table"],
    ["textList", "Text List"],
    ["video", "Video"],
    ["cta", "CTA"],
  ];
}

function isLegacyGeneratedSection(section) {
  return (
    (section.type === "text" && section.title === "Overview") ||
    (section.type === "cards" && section.title === "Highlights") ||
    (section.type === "cta" && section.title === "Ready To Connect?")
  );
}

function ensureRequiredSections(key, sections = []) {
  const requiredIds = getRequiredSectionIds(key);
  const normalized = normalizeSections(sections);
  if (!requiredIds.length) return normalized;

  const fallbackSections = normalizeSections(pageContent[key]?.meta?.sections || []);

  requiredIds.forEach((requiredId) => {
    const exists = normalized.some((section) => section.id === requiredId);
    if (exists) return;

    const fallbackSection = fallbackSections.find((section) => section.id === requiredId);
    if (fallbackSection) {
      normalized.unshift(fallbackSection);
    }
  });

  return normalized;
}

function mergeSectionsWithFallback(key, sections = []) {
  const incoming = normalizeSections(sections);
  const fallbackSections = normalizeSections(pageContent[key]?.meta?.sections || []);
  const hasStructuredFallback = fallbackSections.length > 0;

  const merged = incoming
    .filter((section) => !(hasStructuredFallback && isLegacyGeneratedSection(section)))
    .map((section) => {
    const fallbackSection = fallbackSections.find((item) => item.id === section.id);
    if (!fallbackSection) return section;
    if (isImmutableSection(key, section.id)) return fallbackSection;

    return {
      ...fallbackSection,
      ...section,
      items: Array.isArray(section.items) && section.items.length
        ? section.items.map((item, index) => ({
            ...(fallbackSection.items?.[index] || {}),
            ...item,
          }))
        : fallbackSection.items,
    };
    });

  fallbackSections.forEach((fallbackSection) => {
    const exists = merged.some((section) => section.id === fallbackSection.id);
    if (!exists) {
      merged.push(fallbackSection);
    }
  });

  if (hasStructuredFallback) {
    const fallbackOrder = new Map(
      fallbackSections.map((section, index) => [section.id, index])
    );

    merged.sort((a, b) => {
      const aIndex = fallbackOrder.has(a.id) ? fallbackOrder.get(a.id) : Number.MAX_SAFE_INTEGER;
      const bIndex = fallbackOrder.has(b.id) ? fallbackOrder.get(b.id) : Number.MAX_SAFE_INTEGER;
      return aIndex - bIndex;
    });
  }

  const withRequired = ensureRequiredSections(key, merged);

  if (!isStrictStructuredPage(key)) {
    return withRequired;
  }

  const allowedIds = new Set(fallbackSections.map((section) => section.id).filter(Boolean));
  const filteredSections = withRequired.filter((section) => allowedIds.has(section.id));
  const legacyGalleryItems = incoming
    .filter((section) => section?.type === "gallery")
    .flatMap((section) => (Array.isArray(section.items) ? section.items : []))
    .map((item) => item?.url)
    .filter(Boolean);

  if (!legacyGalleryItems.length) {
    return filteredSections;
  }

  return filteredSections.map((section) => {
    if (section.id !== "event-gallery") {
      return section;
    }

    const currentItems = Array.isArray(section.items) ? section.items : [];
    const currentUrls = currentItems.map((item) => item?.url).filter(Boolean);
    const combinedUrls = [...currentUrls, ...legacyGalleryItems]
      .filter((url, index, array) => array.indexOf(url) === index)
      .slice(0, 6);

    return {
      ...section,
      items: combinedUrls.map((url, index) => ({
        url,
        caption: currentItems[index]?.caption || "",
      })),
    };
  });
}

function getDefaultPageSections(fallback) {
  const body = Array.isArray(fallback.body)
    ? fallback.body.join("\n\n")
    : fallback.body || "";
  const highlights = Array.isArray(fallback.highlights) ? fallback.highlights : [];

  return normalizeSections([
    {
      type: "text",
      title: "Overview",
      body,
    },
    {
      type: "cards",
      title: "Highlights",
      items: highlights.map((item) => ({
        title: item,
        text: "",
        image: "",
      })),
    },
    {
      type: "cta",
      title: "Ready To Connect?",
      body: "Reach out to the school team for admissions and school information.",
      ctaLabel: "Admission Enquiry",
      ctaHref: "/admission-enquiry",
      mediaUrl: fallback.image || "",
    },
  ]);
}

function buildFallbackPage(key) {
  const pageFallback = pageContent[key];

  const structuredFallbacks = {
    homeHero: {
      title: "Udaan World School",
      body: "Growth, Change",
      meta: {
        slides: ["/images/people/director.jpeg", "/images/people/principal.jpeg"],
        mobileBanners: ["/udaan-world-logo.jpeg", "/images/people/founder.jpeg"],
      },
    },
    homeAbout: {
      eyebrow: "Who we are",
      title: "Know About the School",
      body: "Udaan World School is built as a joyful, safe, and future-ready learning space...",
      meta: {},
    },
    homeCreativity: {
      title: "Unlock your child's creativity",
      body: "Where learning goes beyond books and every moment sparks imagination.",
      meta: {
        stats: [
          { label: "Alumni", value: "15,000+", icon: "School" },
          { label: "Educators", value: "66+", icon: "BookOpen" },
          { label: "Freshman Graduation Rate", value: "97%", icon: "Trophy" },
        ],
      },
    },
    homeSportsFeature: {
      title: "Champions Are Made Here!",
      body: "With world-class facilities and expert coaches, we turn potential into excellence.",
      meta: {
        images: [
          "/images/people/director.jpeg",
          "/images/people/principal.jpeg",
          "/images/people/founder.jpeg",
          "/udaan-world-logo.jpeg",
        ],
        videoUrl: "https://www.youtube.com/embed/7dBkJ1UGnTw",
      },
    },
    homeChairman: {
      eyebrow: "Chairman's Message",
      title: '"Creating a knowledge hub"',
      body:
        "At Udaan World School, we aim to ensure that students achieve their highest academic and personal potential while building a strong foundation rooted in Indian culture, society, and ideas.\n\nStudents at BIS must believe in themselves and their goals.",
      imageUrl: "/images/people/director.jpeg",
      meta: {
        signatureName: "BHARAT GOYAL",
        signatureRole: "Founder",
      },
    },
    homeWhyChooseUs: {
      eyebrow: "Why Choose Us",
      title: "Discover Why Our Campus is Your Gateway to Success.",
      body: "Premium education, discipline and innovation in a nurturing environment.",
      meta: {
        cards: [
          {
            title: "Academic Excellence",
            text: "Strong academics with modern teaching methods and outstanding results.",
            image: "/images/people/principal.jpeg",
            icon: "Trophy",
          },
          {
            title: "Safe Campus",
            text: "Secure environment with discipline, care and student wellbeing.",
            image: "/images/people/director.jpeg",
            icon: "ShieldCheck",
          },
          {
            title: "Smart Learning",
            text: "Technology-enabled classrooms and practical learning exposure.",
            image: "/images/people/founder.jpeg",
            icon: "BookOpen",
          },
          {
            title: "Holistic Growth",
            text: "Sports, arts, values and leadership development together.",
            image: "/udaan-world-logo.jpeg",
            icon: "HeartHandshake",
          },
        ],
      },
    },
    homeStories: {
      title: "Hear it straight from our stars",
      body: "Join us in creating more stories of success",
      meta: { videoIds: ["CkjoKofx7v0", "_04T2vn-zGQ", "Xweq6X4wzek"] },
    },
    homeFacilities: {
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
    },
    homePartners: {
      title: "Knowledge Partners",
      meta: {
        logos: [
          "/udaan-world-logo.jpeg",
          "/udaan-world-logo.jpeg",
          "/udaan-world-logo.jpeg",
          "/udaan-world-logo.jpeg",
        ],
      },
    },
    homeTestimonials: {
      title: "Parents Testimonials",
      meta: { stars: 4, items: [{ name: "Amit Gupta", text: "Great school." }] },
    },
  };

  if (structuredFallbacks[key]) {
    return {
      type: "page",
      key,
      slug: key,
      title: structuredFallbacks[key].title || "",
      eyebrow: structuredFallbacks[key].eyebrow || "",
      body: structuredFallbacks[key].body || "",
      imageUrl: structuredFallbacks[key].imageUrl || "",
      highlights: "",
      meta: structuredFallbacks[key].meta || {},
      published: true,
    };
  }

  const fallback = pageFallback || pageContent.about;
  const fallbackBody = Array.isArray(fallback.body) ? fallback.body.join("\n\n") : fallback.body || "";
  const fallbackSections = Array.isArray(fallback.meta?.sections) && fallback.meta.sections.length
    ? fallback.meta.sections
    : getDefaultPageSections(fallback);

  return {
    type: "page",
    key,
    slug: key,
    title: fallback.title || "",
    eyebrow: fallback.eyebrow || "",
    body: fallbackBody,
    imageUrl: fallback.image || "",
    highlights: Array.isArray(fallback.highlights) ? fallback.highlights.join("\n") : "",
    meta: {
      ...(fallback.meta || {}),
      sections: ensureRequiredSections(key, fallbackSections),
    },
    published: true,
  };
}

function isVideoUrl(url = "") {
  return /\.(mp4|webm|ogg)$/i.test(url) || url.includes("video/upload") || url.includes("youtube") || url.includes("youtu.be");
}

export default function PageEditor() {
  const { key } = useParams();
  const navigate = useNavigate();
  const sectionConfig = getManagedSectionConfig(key);
  const isHomePage = key.startsWith("home");

  const [pageId, setPageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState(buildFallbackPage(key));

  useEffect(() => {
    fetchPage();
  }, [key]);

  async function fetchPage() {
    setLoading(true);

    try {
      const res = await api.get("/content", {
        params: { type: "page", key },
      });

      const page = Array.isArray(res.data) ? res.data[0] : null;

      if (page) {
        const fallback = buildFallbackPage(key);
        setPageId(page._id);
        setContent({
          type: "page",
          key,
          slug: page.slug || key,
          title: page.title || "",
          eyebrow: page.eyebrow || "",
          body: page.body || "",
          imageUrl: page.imageUrl || "",
          highlights: Array.isArray(page.highlights) ? page.highlights.join("\n") : "",
          meta: {
            ...fallback.meta,
            ...(page.meta || {}),
            cards:
              Array.isArray(page.meta?.cards) && page.meta.cards.length
                ? page.meta.cards.map((card, index) => ({
                    ...(fallback.meta.cards?.[index] || {}),
                    ...card,
                  }))
                : fallback.meta.cards,
            items:
              Array.isArray(page.meta?.items) && page.meta.items.length
                ? page.meta.items.map((item, index) =>
                    typeof item === "string"
                      ? {
                          title: item,
                          image: fallback.meta.items?.[index]?.image || "",
                        }
                      : {
                          ...(fallback.meta.items?.[index] || {}),
                          ...item,
                        }
                  )
                : fallback.meta.items,
            logos:
              Array.isArray(page.meta?.logos) && page.meta.logos.length
                ? page.meta.logos
                : fallback.meta.logos,
            videoIds:
              Array.isArray(page.meta?.videoIds) && page.meta.videoIds.length
                ? page.meta.videoIds
                : fallback.meta.videoIds,
            stats:
              Array.isArray(page.meta?.stats) && page.meta.stats.length
                ? page.meta.stats
                : fallback.meta.stats,
            sections: isHomePage
              ? page.meta?.sections
              : mergeSectionsWithFallback(
                  key,
                  page.meta?.sections?.length
                    ? page.meta.sections
                    : fallback.meta.sections || []
                ),
          },
          published: page.published ?? true,
        });
      } else {
        setPageId(null);
        const fallback = buildFallbackPage(key);
        setContent({
          ...fallback,
          meta: {
            ...(fallback.meta || {}),
            sections: ensureRequiredSections(key, fallback.meta?.sections || []),
          },
        });
      }
    } catch (err) {
      console.error(err);
      setPageId(null);
      const fallback = buildFallbackPage(key);
      setContent({
        ...fallback,
        meta: {
          ...(fallback.meta || {}),
          sections: ensureRequiredSections(key, fallback.meta?.sections || []),
        },
      });
    } finally {
      setLoading(false);
    }
  }

  async function uploadAsset(file, onUploaded) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData);
      onUploaded(res.data.url, res.data.resourceType);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
    }
  }

  function updateMeta(field, value) {
    setContent((prev) => ({
      ...prev,
      meta: {
        ...(prev.meta || {}),
        [field]: value,
      },
    }));
  }

  function updateSections(nextSections) {
    updateMeta("sections", ensureRequiredSections(key, nextSections));
  }

  function updateSection(sectionId, field, value) {
    const sections = (content.meta?.sections || []).map((section) =>
      section.id === sectionId ? { ...section, [field]: value } : section
    );
    updateSections(sections);
  }

  function removeSection(sectionId) {
    if (getRequiredSectionIds(key).includes(sectionId)) return;
    updateSections((content.meta?.sections || []).filter((section) => section.id !== sectionId));
  }

  function addSection(type) {
    updateSections([...(content.meta?.sections || []), createSection(type)]);
  }

  function addSectionItem(sectionId) {
    const sections = (content.meta?.sections || []).map((section) => {
      if (section.id !== sectionId) return section;
      if (section.type === "cards") {
        return {
          ...section,
          items: [...(section.items || []), { title: "", text: "", image: "", icon: "" }],
        };
      }
      if (section.type === "gallery") {
        return {
          ...section,
          items: [...(section.items || []), { url: "", caption: "" }],
        };
      }
      if (section.type === "managedGallery") {
        if ((section.items || []).length >= Number(section.limit || 12)) {
          return section;
        }
        return {
          ...section,
          items: [...(section.items || []), { url: "", caption: "" }],
        };
      }
      if (section.type === "eventGallery") {
        if ((section.items || []).length >= 6) {
          return section;
        }
        return {
          ...section,
          items: [...(section.items || []), { url: "", caption: "" }],
        };
      }
      if (section.type === "infoPanel") {
        return {
          ...section,
          items: [...(section.items || []), { icon: "School", text: "" }],
        };
      }
      if (section.type === "documentsTable") {
        return {
          ...section,
          items: [...(section.items || []), { name: "", fileUrl: "" }],
        };
      }
      if (section.type === "simpleTable") {
        return {
          ...section,
          items: [...(section.items || []), { label: "", value: "" }],
        };
      }
      if (section.type === "textList") {
        return {
          ...section,
          items: [...(section.items || []), { text: "" }],
        };
      }
      return section;
    });
    updateSections(sections);
  }

  function updateSectionItem(sectionId, itemIndex, field, value) {
    const sections = (content.meta?.sections || []).map((section) => {
      if (section.id !== sectionId) return section;
      if (section.type === "eventGallery" || section.type === "managedGallery") {
        const items = Array.from({ length: Math.max(section.items?.length || 0, itemIndex + 1) }, (_, index) => (
          section.items?.[index] || { url: "", caption: "" }
        ));

        return {
          ...section,
          items: items.map((item, index) =>
            index === itemIndex ? { ...item, [field]: value } : item
          ),
        };
      }
      return {
        ...section,
        items: (section.items || []).map((item, index) =>
          index === itemIndex ? { ...item, [field]: value } : item
        ),
      };
    });
    updateSections(sections);
  }

  function removeSectionItem(sectionId, itemIndex) {
    const sections = (content.meta?.sections || []).map((section) => {
      if (section.id !== sectionId) return section;
      if (section.type === "eventGallery") {
        return {
          ...section,
          items: (section.items || []).map((item, index) =>
            index === itemIndex ? { url: "", caption: "" } : item
          ),
        };
      }
      if (section.type === "managedGallery") {
        return {
          ...section,
          items: (section.items || []).filter((_, index) => index !== itemIndex),
        };
      }
      return {
        ...section,
        items: (section.items || []).filter((_, index) => index !== itemIndex),
      };
    });
    updateSections(sections);
  }

  async function savePage() {
    setSaving(true);

    const payload = {
      type: "page",
      key,
      slug: content.slug || key,
      title: content.title,
      eyebrow: content.eyebrow,
      body: content.body,
      imageUrl: content.imageUrl,
      highlights: content.highlights
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      meta: {
        ...(content.meta || {}),
        sections: isHomePage
          ? content.meta?.sections
          : ensureRequiredSections(key, content.meta?.sections || []),
      },
      published: content.published,
    };

    try {
      if (pageId) {
        await api.put(`/content/${pageId}`, payload);
      } else {
        const res = await api.post("/content", payload);
        setPageId(res.data?._id || null);
      }

      alert("Page saved successfully");
      navigate("/admin/content");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        alert("Your admin session expired. Please log in again.");
        navigate("/admin/login");
        return;
      }
      alert(err.response?.data?.message || "Unable to save page");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="shadow-shimmer-card p-6">
            <div className="space-y-4">
              <div className="shadow-shimmer-line h-8 w-48" />
              <div className="shadow-shimmer-line h-4 w-96 max-w-full" />
            </div>
          </div>

          <div className="shadow-shimmer-card p-6">
            <div className="space-y-4">
              <div className="shadow-shimmer-line h-12 w-full rounded-2xl" />
              <div className="shadow-shimmer-line h-12 w-full rounded-2xl" />
              <div className="shadow-shimmer-line h-36 w-full rounded-[28px]" />
            </div>
          </div>

          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="shadow-shimmer-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="shadow-shimmer-line h-6 w-44" />
                <div className="shadow-shimmer-line h-9 w-28" />
              </div>
              <div className="space-y-4">
                <div className="shadow-shimmer-line h-12 w-full rounded-2xl" />
                <div className="shadow-shimmer-line h-24 w-full rounded-[24px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl rounded-2xl border bg-white p-6 shadow">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Edit {sectionConfig?.title || key}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Edit text, media, cards, galleries, and call-to-action sections for this page.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={content.published}
              onChange={(e) =>
                setContent({ ...content, published: e.target.checked })
              }
            />
            Published
          </label>
        </div>

        <div className="space-y-4">
          <input
            value={content.eyebrow}
            onChange={(e) => setContent({ ...content, eyebrow: e.target.value })}
            placeholder="Hero Eyebrow"
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            placeholder="Hero Title"
            className="w-full rounded-lg border px-4 py-3"
          />

          <textarea
            value={content.body}
            onChange={(e) => setContent({ ...content, body: e.target.value })}
            placeholder="Hero Intro / Summary"
            className="h-36 w-full rounded-lg border px-4 py-3"
          />

          <div className="rounded-xl border p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Hero Image</h3>
              <UploadButton
                label="Upload Hero Image"
                accept="image/*"
                onFile={async (file) => {
                  await uploadAsset(file, (url) =>
                    setContent((prev) => ({ ...prev, imageUrl: url }))
                  );
                }}
              />
            </div>

            {content.imageUrl ? (
              <img
                src={content.imageUrl}
                alt="Hero"
                className="h-52 rounded-lg object-cover"
              />
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-sm text-gray-500">
                No hero image uploaded
              </div>
            )}
          </div>

          {!key.startsWith("home") && (
            <>
              <textarea
                value={content.highlights}
                onChange={(e) =>
                  setContent({ ...content, highlights: e.target.value })
                }
                placeholder="Hero highlight chips, one per line"
                className="h-32 w-full rounded-lg border px-4 py-3"
              />

              <SectionBuilder
                sections={content.meta?.sections || []}
                onAddSection={addSection}
                onRemoveSection={removeSection}
                onUpdateSection={updateSection}
                onAddItem={addSectionItem}
                onUpdateItem={updateSectionItem}
                onRemoveItem={removeSectionItem}
                onUpload={uploadAsset}
                lockedSectionIds={getRequiredSectionIds(key)}
                immutableSectionIds={key === "founders" ? ["founder-principles"] : []}
                pageKey={key}
              />
            </>
          )}

          {key === "homeHero" && (
            <>
              <MediaListEditor
                title="Hero Slides"
                items={content.meta?.slides || []}
                onChange={(items) => updateMeta("slides", items)}
                accept="image/*"
                onUpload={uploadAsset}
              />
              <MediaListEditor
                title="Mobile Banners"
                items={content.meta?.mobileBanners || []}
                onChange={(items) => updateMeta("mobileBanners", items)}
                accept="image/*"
                onUpload={uploadAsset}
              />
            </>
          )}

          {key === "homeCreativity" && (
            <ObjectListEditor
              title="Stats"
              items={content.meta?.stats || []}
              fields={["label", "value", "icon"]}
              onChange={(items) => updateMeta("stats", items)}
            />
          )}

          {key === "homeSportsFeature" && (
            <>
              <MediaListEditor
                title="Sports Images"
                items={content.meta?.images || []}
                onChange={(items) => updateMeta("images", items)}
                accept="image/*"
                onUpload={uploadAsset}
              />
              <input
                value={content.meta?.videoUrl || ""}
                onChange={(e) => updateMeta("videoUrl", e.target.value)}
                placeholder="Sports video URL"
                className="w-full rounded-lg border px-4 py-3"
              />
            </>
          )}

          {key === "homeChairman" && (
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={content.meta?.signatureName || ""}
                onChange={(e) => updateMeta("signatureName", e.target.value)}
                placeholder="Signature Name"
                className="w-full rounded-lg border px-4 py-3"
              />
              <input
                value={content.meta?.signatureRole || ""}
                onChange={(e) => updateMeta("signatureRole", e.target.value)}
                placeholder="Signature Role"
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>
          )}

          {key === "homeWhyChooseUs" && (
            <ObjectListEditor
              title="Feature Cards"
              items={content.meta?.cards || []}
              fields={["title", "text", "image", "icon"]}
              onChange={(items) => updateMeta("cards", items)}
              onUpload={uploadAsset}
            />
          )}

          {key === "homeStories" && (
            <StringListEditor
              title="YouTube Video IDs"
              items={content.meta?.videoIds || []}
              onChange={(items) => updateMeta("videoIds", items)}
            />
          )}

          {key === "homeFacilities" && (
            <ObjectListEditor
              title="Facility Cards"
              items={content.meta?.items || []}
              fields={["title", "image"]}
              onChange={(items) => updateMeta("items", items)}
              onUpload={uploadAsset}
            />
          )}

          {key === "homePartners" && (
            <MediaListEditor
              title="Partner Logos"
              items={content.meta?.logos || []}
              onChange={(items) => updateMeta("logos", items)}
              accept="image/*"
              onUpload={uploadAsset}
            />
          )}

          {key === "homeTestimonials" && (
            <>
              <input
                type="number"
                value={content.meta?.stars ?? 4}
                onChange={(e) => updateMeta("stars", Number(e.target.value))}
                placeholder="Star Count"
                className="w-full rounded-lg border px-4 py-3"
              />
              <ObjectListEditor
                title="Testimonials"
                items={content.meta?.items || []}
                fields={["name", "text"]}
                onChange={(items) => updateMeta("items", items)}
              />
            </>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={savePage}
            disabled={saving}
            className="rounded-lg bg-[#C3292D] px-4 py-2 text-white hover:bg-[#A01F23] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Page"}
          </button>

          <button
            onClick={() => navigate("/admin/content")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadButton({ label, accept, onFile }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
      <Upload size={16} />
      {label}
      <input
        type="file"
        hidden
        accept={accept}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          await onFile(file);
          event.target.value = "";
        }}
      />
    </label>
  );
}

function SectionBuilder({
  sections,
  onAddSection,
  onRemoveSection,
  onUpdateSection,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onUpload,
  lockedSectionIds = [],
  immutableSectionIds = [],
  pageKey,
}) {
  const addableSectionTypes = getAddableSectionTypes(pageKey);

  return (
    <div className="rounded-2xl border p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">Page Sections</h3>
          <p className="text-sm text-gray-500">
            Build the page like the reference UI with separate content blocks.
          </p>
        </div>

        {addableSectionTypes.length ? (
          <div className="flex flex-wrap gap-2">
            {addableSectionTypes.map(([type, label]) => (
              <button
                key={type}
                type="button"
                onClick={() => onAddSection(type)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Plus size={14} className="mr-1 inline" />
                {label}
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-gray-500">
            This page uses a fixed events layout. Edit the existing sections below.
          </div>
        )}
      </div>

      <div className="mt-5 space-y-5">
        {sections.map((section, index) => (
          <div key={section.id} className="rounded-2xl border bg-gray-50 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#C3292D]">
                  Section {index + 1}
                </p>
                <p className="text-sm text-gray-500">
                  Type: {section.type}
                </p>
                {lockedSectionIds.includes(section.id) ? (
                  <p className="text-xs font-medium text-amber-600">
                    Required section
                  </p>
                ) : null}
                {immutableSectionIds.includes(section.id) ? (
                  <p className="text-xs font-medium text-blue-600">
                    Fixed design section
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onRemoveSection(section.id)}
                disabled={lockedSectionIds.includes(section.id)}
                className="rounded p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {immutableSectionIds.includes(section.id) ? (
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  This section is locked to keep the exact founders design you selected.
                </div>
              ) : null}
              <input
                value={section.title}
                onChange={(e) => onUpdateSection(section.id, "title", e.target.value)}
                placeholder="Section title"
                className="w-full rounded-lg border px-4 py-3"
                disabled={immutableSectionIds.includes(section.id)}
              />

              <textarea
                value={section.body || ""}
                onChange={(e) => onUpdateSection(section.id, "body", e.target.value)}
                placeholder="Section description"
                className="h-28 w-full rounded-lg border px-4 py-3"
                disabled={immutableSectionIds.includes(section.id)}
              />

              {section.type === "split" && !immutableSectionIds.includes(section.id) && (
                <SplitSectionEditor
                  section={section}
                  onUpdateSection={onUpdateSection}
                  onUpload={onUpload}
                />
              )}

              {section.type === "cards" && !immutableSectionIds.includes(section.id) && (
                <>
                  <div className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
                    <select
                      value={section.theme || "light"}
                      onChange={(e) => onUpdateSection(section.id, "theme", e.target.value)}
                      className="w-full rounded-lg border px-4 py-3"
                    >
                      <option value="light">Light Theme</option>
                      <option value="dark">Dark Theme</option>
                    </select>
                    <select
                      value={String(section.columns || 3)}
                      onChange={(e) => onUpdateSection(section.id, "columns", Number(e.target.value))}
                      className="w-full rounded-lg border px-4 py-3"
                    >
                      <option value="2">2 Columns</option>
                      <option value="3">3 Columns</option>
                    </select>
                  </div>
                  <div className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
                    <select
                      value={section.variant || "default"}
                      onChange={(e) => onUpdateSection(section.id, "variant", e.target.value)}
                      className="w-full rounded-lg border px-4 py-3"
                    >
                      <option value="default">Default Cards</option>
                      <option value="premium-centered">Premium Centered Cards</option>
                      <option value="process-grid">Process Grid</option>
                      <option value="age-grid">Age Grid</option>
                      <option value="subject-grid">Subject Grid</option>
                      <option value="icon-title-grid">Icon Title Grid</option>
                      <option value="metric-stats">Metric Stats</option>
                      <option value="topper-grid">Topper Grid</option>
                    </select>
                    <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-gray-500">
                      Use Premium Centered for the exact founders-style dark value cards.
                    </div>
                  </div>
                  <div className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
                    <select
                      value={section.align || "left"}
                      onChange={(e) => onUpdateSection(section.id, "align", e.target.value)}
                      className="w-full rounded-lg border px-4 py-3"
                    >
                      <option value="left">Left Align</option>
                      <option value="center">Center Align</option>
                    </select>
                    <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-gray-500">
                      Use center align for founders-style value cards.
                    </div>
                  </div>
                  <SectionItemsEditor
                    section={section}
                    onAddItem={onAddItem}
                    onUpdateItem={onUpdateItem}
                    onRemoveItem={onRemoveItem}
                    onUpload={onUpload}
                  />
                </>
              )}

              {section.type === "gallery" && !immutableSectionIds.includes(section.id) && (
                <GalleryItemsEditor
                  section={section}
                  onAddItem={onAddItem}
                  onUpdateItem={onUpdateItem}
                  onRemoveItem={onRemoveItem}
                  onUpload={onUpload}
                />
              )}

              {section.type === "managedGallery" && !immutableSectionIds.includes(section.id) && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-dashed bg-slate-50 p-4 text-sm text-slate-600">
                    You can upload gallery items here from Website Pages, or manage reusable media from <span className="font-semibold">Admin - Gallery Management</span>. Both will show on the public gallery page.
                  </div>
                  <ManagedGalleryEditor
                    section={section}
                    onAddItem={onAddItem}
                    onUpdateItem={onUpdateItem}
                    onRemoveItem={onRemoveItem}
                    onUpload={onUpload}
                  />
                </div>
              )}

              {section.type === "eventGallery" && !immutableSectionIds.includes(section.id) && (
                <EventGalleryEditor
                  section={section}
                  onAddItem={onAddItem}
                  onUpdateItem={onUpdateItem}
                  onRemoveItem={onRemoveItem}
                  onUpload={onUpload}
                />
              )}

              {section.type === "infoPanel" && !immutableSectionIds.includes(section.id) && (
                <InfoPanelEditor
                  section={section}
                  onAddItem={onAddItem}
                  onUpdateItem={onUpdateItem}
                  onRemoveItem={onRemoveItem}
                  onUpdateSection={onUpdateSection}
                  onUpload={onUpload}
                />
              )}

              {section.type === "documentsTable" && !immutableSectionIds.includes(section.id) && (
                <DocumentsTableEditor
                  section={section}
                  onAddItem={onAddItem}
                  onUpdateItem={onUpdateItem}
                  onRemoveItem={onRemoveItem}
                  onUpdateSection={onUpdateSection}
                  onUpload={onUpload}
                />
              )}

              {section.type === "simpleTable" && !immutableSectionIds.includes(section.id) && (
                <SimpleTableEditor
                  section={section}
                  onAddItem={onAddItem}
                  onUpdateItem={onUpdateItem}
                  onRemoveItem={onRemoveItem}
                  onUpdateSection={onUpdateSection}
                />
              )}

              {section.type === "textList" && !immutableSectionIds.includes(section.id) && (
                <TextListEditor
                  section={section}
                  onAddItem={onAddItem}
                  onUpdateItem={onUpdateItem}
                  onRemoveItem={onRemoveItem}
                  onUpdateSection={onUpdateSection}
                  onUpload={onUpload}
                />
              )}

              {section.type === "video" && !immutableSectionIds.includes(section.id) && (
                <div className="space-y-3 rounded-xl border bg-white p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">Video</p>
                    <UploadButton
                      label="Upload Video"
                      accept="video/*,image/*"
                      onFile={async (file) => {
                        await onUpload(file, (url) =>
                          onUpdateSection(section.id, "mediaUrl", url)
                        );
                      }}
                    />
                  </div>

                  <input
                    value={section.mediaUrl || ""}
                    onChange={(e) => onUpdateSection(section.id, "mediaUrl", e.target.value)}
                    placeholder="Video URL"
                    className="w-full rounded-lg border px-4 py-3"
                  />

                  <MediaPreview url={section.mediaUrl} />
                </div>
              )}

              {section.type === "cta" && !immutableSectionIds.includes(section.id) && (
                <div className="space-y-3 rounded-xl border bg-white p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <select
                      value={section.variant || "default"}
                      onChange={(e) => onUpdateSection(section.id, "variant", e.target.value)}
                      className="w-full rounded-lg border px-4 py-3"
                    >
                      <option value="default">Default CTA</option>
                      <option value="light-icon">Light Icon CTA</option>
                      <option value="dark-icon">Dark Icon CTA</option>
                    </select>
                    <input
                      value={section.icon || ""}
                      onChange={(e) => onUpdateSection(section.id, "icon", e.target.value)}
                      placeholder="CTA icon, e.g. GraduationCap"
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={section.ctaLabel || ""}
                      onChange={(e) => onUpdateSection(section.id, "ctaLabel", e.target.value)}
                      placeholder="CTA label"
                      className="w-full rounded-lg border px-4 py-3"
                    />
                    <input
                      value={section.ctaHref || ""}
                      onChange={(e) => onUpdateSection(section.id, "ctaHref", e.target.value)}
                      placeholder="CTA link"
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">Background Media</p>
                    <UploadButton
                      label="Upload Media"
                      accept="image/*,video/*"
                      onFile={async (file) => {
                        await onUpload(file, (url) =>
                          onUpdateSection(section.id, "mediaUrl", url)
                        );
                      }}
                    />
                  </div>

                  <input
                    value={section.mediaUrl || ""}
                    onChange={(e) => onUpdateSection(section.id, "mediaUrl", e.target.value)}
                    placeholder="Optional media URL"
                    className="w-full rounded-lg border px-4 py-3"
                  />

                  <MediaPreview url={section.mediaUrl} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionItemsEditor({ section, onAddItem, onUpdateItem, onRemoveItem, onUpload }) {
  const isLeadersGrid = section.variant === "leaders-grid";
  const isCalendarGrid = section.variant === "calendar-grid";
  const isProcessGrid = section.variant === "process-grid";
  const isAgeGrid = section.variant === "age-grid";
  const isSubjectGrid = section.variant === "subject-grid";
  const isIconTitleGrid = section.variant === "icon-title-grid";
  const isMetricStats = section.variant === "metric-stats";
  const isTopperGrid = section.variant === "topper-grid";

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-medium text-gray-800">Cards</p>
        <button
          type="button"
          onClick={() => onAddItem(section.id)}
          className="rounded p-2 text-[#C3292D] hover:bg-red-50"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {(section.items || []).map((item, index) => (
          <div key={`${section.id}-${index}`} className="rounded-xl border p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Card {index + 1}</p>
              <button
                type="button"
                onClick={() => onRemoveItem(section.id, index)}
                className="rounded p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                value={item.title}
                onChange={(e) => onUpdateItem(section.id, index, "title", e.target.value)}
                placeholder={isLeadersGrid ? "Leader name" : isCalendarGrid ? "Calendar title" : "Card title"}
                className="w-full rounded-lg border px-4 py-3"
              />
              <input
                value={item.subtitle || ""}
                onChange={(e) => onUpdateItem(section.id, index, "subtitle", e.target.value)}
                placeholder={isLeadersGrid ? "Leader role" : isCalendarGrid ? "Month label" : isAgeGrid ? "Age / short value" : isMetricStats ? "Metric label" : isTopperGrid ? "Student class / stage" : "Card subtitle / role"}
                className="w-full rounded-lg border px-4 py-3"
              />
              {!isLeadersGrid && !isCalendarGrid && !isAgeGrid && !isSubjectGrid && !isMetricStats ? (
                <>
                  {!isIconTitleGrid && !isTopperGrid ? (
                    <textarea
                      value={item.text}
                      onChange={(e) => onUpdateItem(section.id, index, "text", e.target.value)}
                      placeholder={isProcessGrid ? "Step description" : "Card description"}
                      className="h-24 w-full rounded-lg border px-4 py-3"
                    />
                  ) : null}
                  {isTopperGrid ? (
                    <>
                      <input
                        value={item.icon || ""}
                        onChange={(e) => onUpdateItem(section.id, index, "icon", e.target.value)}
                        placeholder="Badge text, e.g. Topper"
                        className="w-full rounded-lg border px-4 py-3"
                      />
                      <input
                        value={item.text || ""}
                        onChange={(e) => onUpdateItem(section.id, index, "text", e.target.value)}
                        placeholder="Score, e.g. 97.8%"
                        className="w-full rounded-lg border px-4 py-3"
                      />
                    </>
                  ) : (isProcessGrid || isIconTitleGrid) ? (
                    <input
                      value={item.icon || ""}
                      onChange={(e) => onUpdateItem(section.id, index, "icon", e.target.value)}
                      placeholder={isProcessGrid ? "Step icon, e.g. FileText" : "Card icon, e.g. Brain"}
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  ) : (
                    <input
                      value={item.icon || ""}
                      onChange={(e) => onUpdateItem(section.id, index, "icon", e.target.value)}
                      placeholder="Card icon, e.g. Trophy"
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  )}
                </>
              ) : null}
              {!isCalendarGrid && !isProcessGrid && !isAgeGrid && !isSubjectGrid && !isIconTitleGrid && !isMetricStats ? (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <input
                      value={item.image}
                      onChange={(e) => onUpdateItem(section.id, index, "image", e.target.value)}
                      placeholder={isLeadersGrid ? "Leader photo URL" : "Card image URL"}
                      className="w-full rounded-lg border px-4 py-3"
                    />
                    <UploadButton
                      label="Image"
                      accept="image/*"
                      onFile={async (file) => {
                        await onUpload(file, (url) =>
                          onUpdateItem(section.id, index, "image", url)
                        );
                      }}
                    />
                  </div>
                  <MediaPreview url={item.image} compact />
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SplitSectionEditor({ section, onUpdateSection, onUpload }) {
  return (
    <div className="space-y-3 rounded-xl border bg-white p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={section.eyebrow || ""}
          onChange={(e) => onUpdateSection(section.id, "eyebrow", e.target.value)}
          placeholder="Section eyebrow"
          className="w-full rounded-lg border px-4 py-3"
        />
        <select
          value={section.theme || "light"}
          onChange={(e) => onUpdateSection(section.id, "theme", e.target.value)}
          className="w-full rounded-lg border px-4 py-3"
        >
          <option value="light">Light Theme</option>
          <option value="dark">Dark Theme</option>
        </select>
      </div>

      <select
        value={section.variant || "default"}
        onChange={(e) => onUpdateSection(section.id, "variant", e.target.value)}
        className="w-full rounded-lg border px-4 py-3"
      >
        <option value="default">Default Split</option>
        <option value="panel-split">Panel Split</option>
      </select>

      {section.variant !== "panel-split" ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <input
              value={section.mediaUrl || ""}
              onChange={(e) => onUpdateSection(section.id, "mediaUrl", e.target.value)}
              placeholder="Primary image URL"
              className="w-full rounded-lg border px-4 py-3"
            />
            <UploadButton
              label="Primary Image"
              accept="image/*"
              onFile={async (file) => {
                await onUpload(file, (url) => onUpdateSection(section.id, "mediaUrl", url));
              }}
            />
          </div>
          <MediaPreview url={section.mediaUrl} compact />

          <div className="flex items-center justify-between gap-3">
            <input
              value={section.secondaryMediaUrl || ""}
              onChange={(e) => onUpdateSection(section.id, "secondaryMediaUrl", e.target.value)}
              placeholder="Secondary image URL"
              className="w-full rounded-lg border px-4 py-3"
            />
            <UploadButton
              label="Secondary Image"
              accept="image/*"
              onFile={async (file) => {
                await onUpload(file, (url) => onUpdateSection(section.id, "secondaryMediaUrl", url));
              }}
            />
          </div>
          <MediaPreview url={section.secondaryMediaUrl} compact />
        </>
      ) : (
        <div className="grid gap-3 rounded-xl border p-4 md:grid-cols-2">
          <input
            value={section.sideTitle || ""}
            onChange={(e) => onUpdateSection(section.id, "sideTitle", e.target.value)}
            placeholder="Right panel title"
            className="w-full rounded-lg border px-4 py-3"
          />
          <input
            value={section.sideIcon || ""}
            onChange={(e) => onUpdateSection(section.id, "sideIcon", e.target.value)}
            placeholder="Right panel icon, e.g. Laptop"
            className="w-full rounded-lg border px-4 py-3"
          />
          <textarea
            value={section.sideBody || ""}
            onChange={(e) => onUpdateSection(section.id, "sideBody", e.target.value)}
            placeholder="Right panel description"
            className="h-24 w-full rounded-lg border px-4 py-3 md:col-span-2"
          />
        </div>
      )}

      {section.variant !== "panel-split" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={section.signatureName || ""}
            onChange={(e) => onUpdateSection(section.id, "signatureName", e.target.value)}
            placeholder="Signature name"
            className="w-full rounded-lg border px-4 py-3"
          />
          <input
            value={section.signatureRole || ""}
            onChange={(e) => onUpdateSection(section.id, "signatureRole", e.target.value)}
            placeholder="Signature role"
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={section.ctaLabel || ""}
          onChange={(e) => onUpdateSection(section.id, "ctaLabel", e.target.value)}
          placeholder="Button label"
          className="w-full rounded-lg border px-4 py-3"
        />
        <input
          value={section.ctaHref || ""}
          onChange={(e) => onUpdateSection(section.id, "ctaHref", e.target.value)}
          placeholder="Button link"
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      {section.variant !== "panel-split" ? (
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={Boolean(section.quoteBadge)}
            onChange={(e) => onUpdateSection(section.id, "quoteBadge", e.target.checked)}
          />
          Show quote badge on image
        </label>
      ) : null}
    </div>
  );
}

function GalleryItemsEditor({ section, onAddItem, onUpdateItem, onRemoveItem, onUpload }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-medium text-gray-800">Gallery Items</p>
        <button
          type="button"
          onClick={() => onAddItem(section.id)}
          className="rounded p-2 text-[#C3292D] hover:bg-red-50"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {(section.items || []).map((item, index) => (
          <div key={`${section.id}-${index}`} className="rounded-xl border p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Media {index + 1}</p>
              <button
                type="button"
                onClick={() => onRemoveItem(section.id, index)}
                className="rounded p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <input
                  value={item.url}
                  onChange={(e) => onUpdateItem(section.id, index, "url", e.target.value)}
                  placeholder="Image or video URL"
                  className="w-full rounded-lg border px-4 py-3"
                />
                <UploadButton
                  label="Upload"
                  accept="image/*,video/*"
                  onFile={async (file) => {
                    await onUpload(file, (url) =>
                      onUpdateItem(section.id, index, "url", url)
                    );
                  }}
                />
              </div>
              <input
                value={item.caption}
                onChange={(e) => onUpdateItem(section.id, index, "caption", e.target.value)}
                placeholder="Caption"
                className="w-full rounded-lg border px-4 py-3"
              />
              <MediaPreview url={item.url} compact />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManagedGalleryEditor({ section, onAddItem, onUpdateItem, onRemoveItem, onUpload }) {
  const maxItems = Number(section.limit || 12);
  const isVideoGallery = section.mediaKind === "video";
  const items = Array.isArray(section.items) ? section.items : [];

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-800">Gallery Media</p>
          <p className="text-sm text-gray-500">
            Add up to {maxItems} {isVideoGallery ? "videos or thumbnails" : "images"} here.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAddItem(section.id)}
          disabled={items.length >= maxItems}
          className="rounded p-2 text-[#C3292D] hover:bg-red-50 disabled:opacity-40"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="mb-4 text-sm font-medium text-gray-600">
        {items.length}/{maxItems} items added
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={`${section.id}-${index}`} className="rounded-xl border p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Item {index + 1}</p>
              <button
                type="button"
                onClick={() => onRemoveItem(section.id, index)}
                className="rounded p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <input
                  value={item.url || ""}
                  onChange={(e) => onUpdateItem(section.id, index, "url", e.target.value)}
                  placeholder={isVideoGallery ? "Video URL" : "Image URL"}
                  className="w-full rounded-lg border px-4 py-3"
                />
                <UploadButton
                  label="Upload"
                  accept={isVideoGallery ? "image/*,video/*" : "image/*"}
                  onFile={async (file) => {
                    await onUpload(file, (url) => onUpdateItem(section.id, index, "url", url));
                  }}
                />
              </div>
              <input
                value={item.caption || ""}
                onChange={(e) => onUpdateItem(section.id, index, "caption", e.target.value)}
                placeholder="Caption"
                className="w-full rounded-lg border px-4 py-3"
              />
              <MediaPreview url={item.url} compact />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventGalleryEditor({ section, onAddItem, onUpdateItem, onRemoveItem, onUpload }) {
  const items = Array.from({ length: 6 }, (_, index) => section.items?.[index] || { url: "", caption: "" });
  const filledCount = items.filter((item) => item.url).length;

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-3">
        <div>
          <p className="font-medium text-gray-800">Event Gallery Images</p>
          <p className="text-sm text-gray-500">
            Add up to 6 images. These exact images will show on the public Event Gallery section.
          </p>
        </div>
      </div>

      <div className="mb-4 text-sm font-medium text-gray-600">
        {filledCount}/6 images added
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item, index) => (
          <div key={`${section.id}-${index}`} className="rounded-xl border p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Slot {index + 1}</p>
              <button
                type="button"
                onClick={() => onRemoveItem(section.id, index)}
                disabled={!item.url}
                className="rounded p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <input
                  value={item.url || ""}
                  onChange={(e) => onUpdateItem(section.id, index, "url", e.target.value)}
                  placeholder="Image URL"
                  className="w-full rounded-lg border px-4 py-3"
                />
                <UploadButton
                  label="Upload"
                  accept="image/*"
                  onFile={async (file) => {
                    await onUpload(file, (url) =>
                      onUpdateItem(section.id, index, "url", url)
                    );
                  }}
                />
              </div>
              <div className="text-xs text-gray-500">
                {item.url ? "Visible on the website gallery" : "Empty slot"}
              </div>
              <MediaPreview url={item.url} compact />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoPanelEditor({
  section,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onUpdateSection,
  onUpload,
}) {
  return (
    <div className="space-y-4 rounded-xl border bg-white p-4">
      <input
        value={section.label || ""}
        onChange={(e) => onUpdateSection(section.id, "label", e.target.value)}
        placeholder="Panel label, e.g. A : GENERAL INFORMATION"
        className="w-full rounded-lg border px-4 py-3"
      />
      <div className="flex items-center justify-between gap-3">
        <input
          value={section.image || ""}
          onChange={(e) => onUpdateSection(section.id, "image", e.target.value)}
          placeholder="Panel image URL"
          className="w-full rounded-lg border px-4 py-3"
        />
        <UploadButton
          label="Image"
          accept="image/*"
          onFile={async (file) => {
            await onUpload(file, (url) => onUpdateSection(section.id, "image", url));
          }}
        />
      </div>
      <MediaPreview url={section.image} compact />
      <div className="rounded-xl border p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-medium text-gray-800">Info Rows</p>
          <button
            type="button"
            onClick={() => onAddItem(section.id)}
            className="rounded p-2 text-[#C3292D] hover:bg-red-50"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-3">
          {(section.items || []).map((item, index) => (
            <div key={`${section.id}-info-${index}`} className="rounded-xl border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Row {index + 1}</p>
                <button
                  type="button"
                  onClick={() => onRemoveItem(section.id, index)}
                  className="rounded p-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={item.icon || ""}
                  onChange={(e) => onUpdateItem(section.id, index, "icon", e.target.value)}
                  placeholder="Icon name, e.g. School"
                  className="w-full rounded-lg border px-4 py-3"
                />
                <input
                  value={item.text || ""}
                  onChange={(e) => onUpdateItem(section.id, index, "text", e.target.value)}
                  placeholder="Row text"
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border p-4">
        <p className="mb-3 font-medium text-gray-800">Extra Lines</p>
        <textarea
          value={(section.extraLines || []).join("\n")}
          onChange={(e) =>
            onUpdateSection(
              section.id,
              "extraLines",
              e.target.value.split("\n").map((item) => item.trim()).filter(Boolean)
            )
          }
          placeholder="Principal: ...&#10;Director: ..."
          className="h-28 w-full rounded-lg border px-4 py-3"
        />
      </div>
    </div>
  );
}

function DocumentsTableEditor({
  section,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onUpdateSection,
  onUpload,
}) {
  return (
    <div className="space-y-4 rounded-xl border bg-white p-4">
      <input
        value={section.label || ""}
        onChange={(e) => onUpdateSection(section.id, "label", e.target.value)}
        placeholder="Section label, e.g. B : DOCUMENTS AND INFORMATION"
        className="w-full rounded-lg border px-4 py-3"
      />
      <div className="mb-3 flex items-center justify-between">
        <p className="font-medium text-gray-800">Documents</p>
        <button
          type="button"
          onClick={() => onAddItem(section.id)}
          className="rounded p-2 text-[#C3292D] hover:bg-red-50"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="space-y-3">
        {(section.items || []).map((item, index) => (
          <div key={`${section.id}-doc-${index}`} className="rounded-xl border p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Document {index + 1}</p>
              <button
                type="button"
                onClick={() => onRemoveItem(section.id, index)}
                className="rounded p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                value={item.name || ""}
                onChange={(e) => onUpdateItem(section.id, index, "name", e.target.value)}
                placeholder="Document name"
                className="w-full rounded-lg border px-4 py-3"
              />
              <div className="flex items-center justify-between gap-3">
                <input
                  value={item.fileUrl || ""}
                  onChange={(e) => onUpdateItem(section.id, index, "fileUrl", e.target.value)}
                  placeholder="File URL"
                  className="w-full rounded-lg border px-4 py-3"
                />
                <UploadButton
                  label="File"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onFile={async (file) => {
                    await onUpload(file, (url) =>
                      onUpdateItem(section.id, index, "fileUrl", url)
                    );
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleTableEditor({ section, onAddItem, onUpdateItem, onRemoveItem, onUpdateSection }) {
  return (
    <div className="space-y-4 rounded-xl border bg-white p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <select
          value={section.variant || "default"}
          onChange={(e) => onUpdateSection(section.id, "variant", e.target.value)}
          className="w-full rounded-lg border px-4 py-3"
        >
          <option value="default">Default Table</option>
          <option value="growth-split">Growth Split</option>
        </select>
        <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-gray-500">
          Use Growth Split for the premium results growth layout.
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={section.label || ""}
          onChange={(e) => onUpdateSection(section.id, "label", e.target.value)}
          placeholder="Section label"
          className="w-full rounded-lg border px-4 py-3 md:col-span-1"
        />
        <input
          value={section.headers?.[0] || ""}
          onChange={(e) => onUpdateSection(section.id, "headers", [e.target.value, section.headers?.[1] || "Value"])}
          placeholder="Header 1"
          className="w-full rounded-lg border px-4 py-3"
        />
        <input
          value={section.headers?.[1] || ""}
          onChange={(e) => onUpdateSection(section.id, "headers", [section.headers?.[0] || "Label", e.target.value])}
          placeholder="Header 2"
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>
      {section.variant === "growth-split" ? (
        <div className="grid gap-3 rounded-xl border p-4 md:grid-cols-2">
          <textarea
            value={section.body || ""}
            onChange={(e) => onUpdateSection(section.id, "body", e.target.value)}
            placeholder="Left-side description"
            className="h-24 w-full rounded-lg border px-4 py-3 md:col-span-2"
          />
          <input
            value={section.sideTitle || ""}
            onChange={(e) => onUpdateSection(section.id, "sideTitle", e.target.value)}
            placeholder="Right card title"
            className="w-full rounded-lg border px-4 py-3"
          />
          <input
            value={section.sideIcon || ""}
            onChange={(e) => onUpdateSection(section.id, "sideIcon", e.target.value)}
            placeholder="Right card icon, e.g. TrendingUp"
            className="w-full rounded-lg border px-4 py-3"
          />
          <textarea
            value={section.sideBody || ""}
            onChange={(e) => onUpdateSection(section.id, "sideBody", e.target.value)}
            placeholder="Right card description"
            className="h-24 w-full rounded-lg border px-4 py-3 md:col-span-2"
          />
        </div>
      ) : null}
      <div className="mb-3 flex items-center justify-between">
        <p className="font-medium text-gray-800">Table Rows</p>
        <button
          type="button"
          onClick={() => onAddItem(section.id)}
          className="rounded p-2 text-[#C3292D] hover:bg-red-50"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="space-y-3">
        {(section.items || []).map((item, index) => (
          <div key={`${section.id}-row-${index}`} className="grid gap-3 rounded-xl border p-4 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={item.label || ""}
              onChange={(e) => onUpdateItem(section.id, index, "label", e.target.value)}
              placeholder="Label"
              className="w-full rounded-lg border px-4 py-3"
            />
            <input
              value={item.value || ""}
              onChange={(e) => onUpdateItem(section.id, index, "value", e.target.value)}
              placeholder="Value"
              className="w-full rounded-lg border px-4 py-3"
            />
            <button
              type="button"
              onClick={() => onRemoveItem(section.id, index)}
              className="rounded p-2 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextListEditor({ section, onAddItem, onUpdateItem, onRemoveItem, onUpdateSection, onUpload }) {
  return (
    <div className="space-y-4 rounded-xl border bg-white p-4">
      <input
        value={section.label || ""}
        onChange={(e) => onUpdateSection(section.id, "label", e.target.value)}
        placeholder="Section label"
        className="w-full rounded-lg border px-4 py-3"
      />
      <div className="grid gap-3 md:grid-cols-2">
        <select
          value={section.variant || "default"}
          onChange={(e) => onUpdateSection(section.id, "variant", e.target.value)}
          className="w-full rounded-lg border px-4 py-3"
        >
          <option value="default">Default List</option>
          <option value="checklist-split">Checklist Split</option>
          <option value="checklist-split-light">Checklist Split Light</option>
        </select>
        <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-gray-500">
          Use Checklist Split for the admission documents section.
        </div>
      </div>
      {section.variant === "checklist-split" ? (
        <div className="space-y-3 rounded-xl border p-4">
          <input
            value={section.eyebrow || ""}
            onChange={(e) => onUpdateSection(section.id, "eyebrow", e.target.value)}
            placeholder="Section eyebrow"
            className="w-full rounded-lg border px-4 py-3"
          />
          <div className="flex items-center justify-between gap-3">
            <input
              value={section.mediaUrl || ""}
              onChange={(e) => onUpdateSection(section.id, "mediaUrl", e.target.value)}
              placeholder="Right-side image URL"
              className="w-full rounded-lg border px-4 py-3"
            />
            <UploadButton
              label="Image"
              accept="image/*"
              onFile={async (file) => {
                await onUpload(file, (url) => onUpdateSection(section.id, "mediaUrl", url));
              }}
            />
          </div>
          <MediaPreview url={section.mediaUrl} compact />
        </div>
      ) : null}
      {section.variant === "checklist-split-light" ? (
        <div className="space-y-3 rounded-xl border p-4">
          <input
            value={section.eyebrow || ""}
            onChange={(e) => onUpdateSection(section.id, "eyebrow", e.target.value)}
            placeholder="Section eyebrow"
            className="w-full rounded-lg border px-4 py-3"
          />
          <div className="flex items-center justify-between gap-3">
            <input
              value={section.mediaUrl || ""}
              onChange={(e) => onUpdateSection(section.id, "mediaUrl", e.target.value)}
              placeholder="Right-side image URL"
              className="w-full rounded-lg border px-4 py-3"
            />
            <UploadButton
              label="Image"
              accept="image/*"
              onFile={async (file) => {
                await onUpload(file, (url) => onUpdateSection(section.id, "mediaUrl", url));
              }}
            />
          </div>
          <MediaPreview url={section.mediaUrl} compact />
        </div>
      ) : null}
      <div className="mb-3 flex items-center justify-between">
        <p className="font-medium text-gray-800">List Items</p>
        <button
          type="button"
          onClick={() => onAddItem(section.id)}
          className="rounded p-2 text-[#C3292D] hover:bg-red-50"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="space-y-3">
        {(section.items || []).map((item, index) => (
          <div key={`${section.id}-list-${index}`} className="grid gap-3 rounded-xl border p-4 md:grid-cols-[1fr_auto]">
            <input
              value={item.text || ""}
              onChange={(e) => onUpdateItem(section.id, index, "text", e.target.value)}
              placeholder="List text"
              className="w-full rounded-lg border px-4 py-3"
            />
            <button
              type="button"
              onClick={() => onRemoveItem(section.id, index)}
              className="rounded p-2 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaPreview({ url, compact = false }) {
  if (!url) return null;

  if (isVideoUrl(url) && !url.includes("youtube")) {
    return (
      <video
        src={url}
        controls
        className={compact ? "h-24 rounded-lg" : "h-48 rounded-lg"}
      />
    );
  }

  if (url.includes("youtube")) {
    return (
      <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-gray-600">
        YouTube link added
      </div>
    );
  }

  return (
    <img
      src={url}
      alt=""
      className={compact ? "h-24 rounded-lg object-cover" : "h-48 rounded-lg object-cover"}
    />
  );
}

function MediaListEditor({ title, items, onChange, accept, onUpload }) {
  async function handleUpload(file) {
    await onUpload(file, (url) => onChange([...(items || []), url]));
  }

  return (
    <div className="rounded-xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <UploadButton label="Add Media" accept={accept} onFile={handleUpload} />
      </div>

      <div className="space-y-3">
        {(items || []).map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-3">
            <img src={item} alt="" className="h-16 w-24 rounded object-cover" />
            <button
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              className="rounded p-2 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StringListEditor({ title, items, onChange }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <button
          onClick={() => onChange([...(items || []), ""])}
          className="rounded p-2 text-[#C3292D] hover:bg-red-50"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {(items || []).map((item, index) => (
          <div key={`${title}-${index}`} className="flex gap-2">
            <input
              value={item}
              onChange={(e) =>
                onChange(items.map((value, itemIndex) => (itemIndex === index ? e.target.value : value)))
              }
              className="w-full rounded-lg border px-4 py-3"
            />
            <button
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              className="rounded p-2 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ObjectListEditor({ title, items, fields, onChange, onUpload }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <button
          onClick={() =>
            onChange([...(items || []), Object.fromEntries(fields.map((field) => [field, ""]))])
          }
          className="rounded p-2 text-[#C3292D] hover:bg-red-50"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {(items || []).map((item, index) => (
          <div key={`${title}-${index}`} className="rounded-xl border border-gray-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                Item {index + 1}
              </p>
              <button
                onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                className="rounded p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {fields.map((field) => (
                <div key={field} className="space-y-2">
                  <input
                    value={item[field] || ""}
                    onChange={(e) =>
                      onChange(
                        items.map((entry, itemIndex) =>
                          itemIndex === index
                            ? { ...entry, [field]: e.target.value }
                            : entry
                        )
                      )
                    }
                    placeholder={field}
                    className="w-full rounded-lg border px-4 py-3"
                  />
                  {field === "image" && onUpload ? (
                    <>
                      <UploadButton
                        label="Upload Image"
                        accept="image/*"
                        onFile={async (file) => {
                          await onUpload(file, (url) =>
                            onChange(
                              items.map((entry, itemIndex) =>
                                itemIndex === index
                                  ? { ...entry, image: url }
                                  : entry
                              )
                            )
                          );
                        }}
                      />
                      <MediaPreview url={item.image} compact />
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
