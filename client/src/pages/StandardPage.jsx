import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, BookOpen, CalendarDays, Camera, CircleCheck, CreditCard, Download, FileText, GraduationCap, Mail, Music, Phone, Quote, Sparkles, Trophy, User, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { documents } from "../data/siteData.js";
import { pageContent } from "./pageContent.js";
import {
  pickImage,
  resolveIcon,
  splitLines,
  splitParagraphs,
} from "../utils/publicContent.js";

function buildFallbackPage(pageKey) {
  return pageContent[pageKey] || pageContent.about;
}

function isStrictStructuredPage(pageKey) {
  return ["events", "photoGallery", "videoGallery", "eventsGallery"].includes(pageKey);
}

function isGalleryDrivenPage(pageKey) {
  return ["photoGallery", "videoGallery", "eventsGallery"].includes(pageKey);
}

function normalizeGallerySource(value = "") {
  const normalized = String(value).trim().toLowerCase();

  if (["photo", "photos", "photo-gallery", "photo gallery"].includes(normalized)) return "photos";
  if (["video", "videos", "video-gallery", "video gallery"].includes(normalized)) return "videos";
  if (["event", "events", "events-gallery", "events gallery", "event-gallery", "event gallery"].includes(normalized)) return "events";

  return normalized;
}

function buildManagedGalleryItems(source, galleryItems = [], sectionItems = []) {
  const normalizedSource = normalizeGallerySource(source);
  const manualItems = Array.isArray(sectionItems)
    ? sectionItems
        .map((item, index) => {
          const url = typeof item === "string" ? item : item?.url;
          if (!url) return null;
          return {
            _id: `manual-${normalizedSource}-${index}`,
            title: item?.caption || "",
            excerpt: "",
            imageUrl: url,
            videoUrl: normalizedSource === "videos" ? url : "",
            category: normalizedSource,
            meta: { galleryType: normalizedSource },
          };
        })
        .filter(Boolean)
    : [];

  const backendItems = galleryItems.filter(
    (item) => normalizeGallerySource(item.category || item.meta?.galleryType) === normalizedSource
  );

  const combined = [...manualItems, ...backendItems];
  const seen = new Set();

  return combined.filter((item) => {
    const mediaKey = item.videoUrl || item.imageUrl || item.fileUrl || item.title;
    if (!mediaKey || seen.has(mediaKey)) return false;
    seen.add(mediaKey);
    return true;
  });
}

function getYoutubeEmbedUrl(url = "") {
  if (!url) return "";
  if (url.includes("/embed/")) return url;

  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  return url;
}

function normalizeCloudinaryDocumentUrl(url = "") {
  return String(url || "")
    .trim()
    .replace(/\/upload\/(?:[^/]+,)*fl_attachment,?/i, "/upload/")
    .replace(/\/upload\/fl_attachment\//i, "/upload/")
    .replace(/([^:]\/)\/+/g, "$1");
}

function parseCloudinaryAssetMeta(url = "") {
  const normalized = normalizeCloudinaryDocumentUrl(url);
  const match = normalized.match(
    /res\.cloudinary\.com\/[^/]+\/(image|raw|video)\/upload\/(?:[^/]+\/)?v\d+\/(.+?)(?:\.[a-z0-9]+)?(?:\?|$)/i
  );

  if (!match) return null;

  const [, resourceType, publicId] = match;
  return {
    resourceType: resourceType.toLowerCase(),
    publicId,
  };
}

function getDisclosureFallbackHref(name = "") {
  const normalizedName = String(name || "").toLowerCase();
  const fallbackMap = [
    { match: ["recognition"], href: "/documents/recognition-certificate.pdf" },
    { match: ["noc", "deo"], href: "/documents/deo-certificate.pdf" },
    { match: ["trust registration", "trust certificate"], href: "/documents/trust-certificate.pdf" },
    { match: ["affiliation"], href: "/documents/affiliation-letter.pdf" },
    { match: ["staff details", "teacher list"], href: "/documents/teacher-list.xlsx" },
  ];

  return (
    fallbackMap.find((entry) => entry.match.some((keyword) => normalizedName.includes(keyword)))
      ?.href || ""
  );
}

function resolveDisclosureFileUrl(item = {}) {
  const raw = normalizeCloudinaryDocumentUrl(item.fileUrl || "");
  const fallbackHref = getDisclosureFallbackHref(item.name);

  const isLegacyCloudinaryPdf =
    raw &&
    raw !== "#" &&
    /\.pdf(?:\?|$)/i.test(raw) &&
    raw.includes("res.cloudinary.com") &&
    !item.publicId;

  if (isLegacyCloudinaryPdf && fallbackHref) {
    return fallbackHref;
  }

  if (raw && raw !== "#") return raw;

  if (fallbackHref) return fallbackHref;

  return "";
}

function buildDisclosureDownloadHref(item = {}) {
  const fileUrl = normalizeCloudinaryDocumentUrl(resolveDisclosureFileUrl(item));
  if (!fileUrl) return "";
  if (fileUrl.startsWith("/")) return fileUrl;

  const apiOrigin = String(api.defaults.baseURL || "").replace(/\/api\/?$/i, "");
  if (!apiOrigin) return fileUrl;

  const legacyMeta = parseCloudinaryAssetMeta(fileUrl);
  const extensionMatch = fileUrl.match(/\.([a-z0-9]+)(?:\?|$)/i);
  const safeBaseName = String(item.fileName || item.name || "document")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "document";
  const fileName = safeBaseName.includes(".")
    ? safeBaseName
    : `${safeBaseName}.${extensionMatch?.[1] || "pdf"}`;

  const resolvedPublicId = item.publicId || legacyMeta?.publicId || "";
  const resolvedResourceType = item.resourceType || legacyMeta?.resourceType || "raw";

  if (resolvedPublicId) {
    return `${apiOrigin}/api/content/download?publicId=${encodeURIComponent(resolvedPublicId)}&resourceType=${encodeURIComponent(resolvedResourceType)}&url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}`;
  }

  return `${apiOrigin}/api/content/download?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}`;
}

function replaceChairmanWithDirector(value) {
  return String(value || "")
    .replace(/Chairman's/gi, "Director's")
    .replace(/\bChairman\b/gi, "Director");
}

function normalizeDirectorPageCopy(pageKey, page) {
  if (pageKey !== "chairman" || !page) return page;

  return {
    ...page,
    eyebrow: replaceChairmanWithDirector(page.eyebrow),
    title: replaceChairmanWithDirector(page.title),
    body: replaceChairmanWithDirector(page.body),
    meta: {
      ...(page.meta || {}),
      sections: Array.isArray(page.meta?.sections)
        ? page.meta.sections.map((section) => ({
            ...section,
            title: replaceChairmanWithDirector(section.title),
            eyebrow: replaceChairmanWithDirector(section.eyebrow),
            signatureRole: replaceChairmanWithDirector(section.signatureRole),
          }))
        : page.meta?.sections,
    },
  };
}

function isLegacyGeneratedSection(section) {
  return (
    (section.type === "text" && section.title === "Overview") ||
    (section.type === "cards" && section.title === "Highlights") ||
    (section.type === "cta" && section.title === "Ready To Connect?")
  );
}

function mergeSectionsWithFallback(savedSections = [], fallbackSections = []) {
  if (!Array.isArray(savedSections) || !savedSections.length) {
    return Array.isArray(fallbackSections) ? fallbackSections : [];
  }

  const normalizedFallback = Array.isArray(fallbackSections) ? fallbackSections : [];
  const hasStructuredFallback = normalizedFallback.length > 0;

  function isImmutableSection(sectionId) {
    return sectionId === "founder-principles";
  }

  const merged = savedSections
    .filter((section) => !(hasStructuredFallback && isLegacyGeneratedSection(section)))
    .map((section) => {
      const fallbackSection = normalizedFallback.find((item) => item.id === section.id);
      if (!fallbackSection) return section;
      if (isImmutableSection(section.id)) return fallbackSection;

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

  normalizedFallback.forEach((fallbackSection) => {
    const exists = merged.some((section) => section.id === fallbackSection.id);
    if (!exists) {
      merged.push(fallbackSection);
    }
  });

  if (hasStructuredFallback) {
    const fallbackOrder = new Map(
      normalizedFallback.map((section, index) => [section.id, index])
    );

    merged.sort((a, b) => {
      const aIndex = fallbackOrder.has(a.id) ? fallbackOrder.get(a.id) : Number.MAX_SAFE_INTEGER;
      const bIndex = fallbackOrder.has(b.id) ? fallbackOrder.get(b.id) : Number.MAX_SAFE_INTEGER;
      return aIndex - bIndex;
    });
  }

  return merged;
}

function mergeSectionsForPage(pageKey, savedSections = [], fallbackSections = []) {
  const merged = mergeSectionsWithFallback(savedSections, fallbackSections);

  if (!isStrictStructuredPage(pageKey)) {
    return merged;
  }

  const allowedIds = new Set(
    (Array.isArray(fallbackSections) ? fallbackSections : [])
      .map((section) => section.id)
      .filter(Boolean)
  );

  const filteredSections = merged.filter((section) => allowedIds.has(section.id));
  const legacyGalleryItems = (Array.isArray(savedSections) ? savedSections : [])
    .filter((section) => section?.type === "gallery")
    .flatMap((section) => (Array.isArray(section.items) ? section.items : []))
    .map((item) => (typeof item === "string" ? item : item?.url))
    .filter(Boolean);

  if (!legacyGalleryItems.length) {
    return filteredSections;
  }

  return filteredSections.map((section) => {
    if (section.id !== "event-gallery") {
      return section;
    }

    const currentItems = Array.isArray(section.items) ? section.items : [];
    const currentUrls = currentItems
      .map((item) => (typeof item === "string" ? item : item?.url))
      .filter(Boolean);

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

function getEventGalleryUrls(section = {}, eventItems = []) {
  const sectionGalleryItems = Array.isArray(section.items)
    ? section.items
        .map((item) => (typeof item === "string" ? item : item?.url))
        .filter(Boolean)
    : [];

  if (sectionGalleryItems.length) {
    return sectionGalleryItems
      .filter((url, index, array) => array.indexOf(url) === index)
      .slice(0, 6);
  }

  const explicitGalleryItems = eventItems
    .flatMap((item) => (Array.isArray(item.meta?.gallery) ? item.meta.gallery : []))
    .filter(Boolean);

  const fallbackCoverItems = eventItems
    .map((item) => item.imageUrl)
    .filter(Boolean);

  return (explicitGalleryItems.length ? explicitGalleryItems : fallbackCoverItems)
    .filter((url, index, array) => array.indexOf(url) === index)
    .slice(0, 6);
}

export default function StandardPage({ pageKey }) {
  const fallbackPage = buildFallbackPage(pageKey);
  const [page, setPage] = useState(fallbackPage);
  const [eventItems, setEventItems] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchPage() {
      try {
        const requests = {
          page: api.get("/content", {
            params: { type: "page" },
          }),
          events: pageKey === "events"
            ? api.get("/content", {
                params: { type: "event", published: "true" },
              })
            : Promise.resolve(null),
          gallery: isGalleryDrivenPage(pageKey)
            ? api.get("/content", {
                params: { type: "gallery", published: "true" },
              })
            : Promise.resolve(null),
        };

        const [pageRes, eventRes, galleryRes] = await Promise.all([
          requests.page,
          requests.events,
          requests.gallery,
        ]);

        const dbPage = Array.isArray(pageRes.data)
          ? pageRes.data.find((item) => item.key === pageKey && item.published !== false)
          : null;

        if (!isMounted) return;

        if (dbPage) {
          setPage(normalizeDirectorPageCopy(pageKey, {
            eyebrow: dbPage.eyebrow || fallbackPage.eyebrow,
            title: dbPage.title || fallbackPage.title,
            image: dbPage.imageUrl || fallbackPage.image,
            body: dbPage.body || fallbackPage.body,
            highlights:
              Array.isArray(dbPage.highlights) && dbPage.highlights.length
                ? dbPage.highlights
                : fallbackPage.highlights,
            meta: {
              ...(fallbackPage.meta || {}),
              ...(dbPage.meta || {}),
              sections: mergeSectionsForPage(
                pageKey,
                dbPage.meta?.sections,
                fallbackPage.meta?.sections
              ),
            },
          }));
        } else {
          setPage(normalizeDirectorPageCopy(pageKey, fallbackPage));
        }

        if (pageKey === "events") {
          const rows = Array.isArray(eventRes?.data) ? eventRes.data : [];
          const publishedEvents = rows
            .filter((item) => item.published !== false)
            .sort((a, b) => new Date(a.eventDate || 0) - new Date(b.eventDate || 0));

          if (isMounted) {
            setEventItems(publishedEvents);
          }
        } else if (isMounted) {
          setEventItems([]);
        }

        if (isGalleryDrivenPage(pageKey)) {
          const rows = Array.isArray(galleryRes?.data) ? galleryRes.data : [];
          if (isMounted) {
            setGalleryItems(rows.filter((item) => item.published !== false));
          }
        } else if (isMounted) {
          setGalleryItems([]);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setPage(fallbackPage);
        if (isMounted) setEventItems([]);
        if (isMounted) setGalleryItems([]);
      }
    }

    fetchPage();

    return () => {
      isMounted = false;
    };
  }, [fallbackPage, pageKey]);

  const paragraphs = splitParagraphs(page.body, splitParagraphs(fallbackPage.body));
  const highlights = splitLines(page.highlights, fallbackPage.highlights || []);
  const heroImage = pickImage(page.image, fallbackPage.image || "/images/people/director.jpeg");
  const sections = Array.isArray(page.meta?.sections) ? page.meta.sections : [];
  const isFullHero = page.meta?.heroVariant === "full";

  return (
    <main className={isFullHero ? "overflow-hidden bg-white" : "bg-slate-950 text-white"}>
      {isFullHero ? (
        <FullHero
          eyebrow={page.eyebrow}
          title={page.title}
          paragraphs={paragraphs}
          heroImage={heroImage}
          iconName={page.meta?.heroBadgeIcon}
        />
      ) : (
        <section className="bg-slate-950 text-white">
          <div className="containerx py-16 md:py-20">
            <div className="grid items-center gap-10 overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                  <Sparkles size={16} />
                  {page.eyebrow}
                </span>
                <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
                  {page.title}
                </h1>
                <div className="mt-6 space-y-5">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph} className="max-w-2xl text-lg leading-8 text-white/75">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/admission-enquiry"
                    className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 font-bold text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(14,116,144,0.32)]"
                  >
                    <User size={18} />
                    Admission Enquiry
                  </Link>
                  <Link
                    to="/contact-us"
                    className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-7 py-4 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-[0_20px_40px_rgba(15,23,42,0.2)]"
                  >
                    <Phone size={18} />
                    Contact School
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/10 p-3">
                <img src={heroImage} alt={page.title} className="h-[420px] w-full rounded-[24px] object-cover" />
              </div>
            </div>

            {highlights.length ? (
              <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {highlights.map((item) => (
                  <article
                    className="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl"
                    key={item}
                  >
                    <Sparkles className="text-cyan-300" />
                    <h3 className="mt-4 text-xl font-bold">{item}</h3>
                  </article>
                ))}
              </div>
            ) : null}

            {sections.length ? (
              <div className="mt-16 space-y-14">
                {sections.map((section, index) => (
                  <PageSectionRenderer
                    key={section.id || `${section.type}-${index}`}
                    section={section}
                    eventItems={eventItems}
                    galleryItems={galleryItems}
                  />
                ))}
              </div>
            ) : null}

            {pageKey === "admissionProcedure" ? (
              <div className="mt-12 rounded-[28px] border border-cyan-300/15 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 p-8">
                <h2 className="text-3xl font-black">Admission Documents</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {documents.slice(0, 2).map((doc) => (
                    <a
                      href={doc.href}
                      key={doc.title}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white transition hover:bg-white/10"
                    >
                      <BookOpen className="text-cyan-300" />
                      <span className="font-semibold">{doc.title}</span>
                      <b className="ml-auto text-cyan-200">{doc.type}</b>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {isFullHero && sections.length ? (
        <>
          {sections.map((section, index) => (
            <PageSectionRenderer
              key={section.id || `${section.type}-${index}`}
              section={section}
              eventItems={eventItems}
              galleryItems={galleryItems}
            />
          ))}
        </>
      ) : null}
    </main>
  );
}

function PageSectionRenderer({ section, eventItems = [], galleryItems = [] }) {
  if (section.type === "eventHighlights") {
    const eventIcons = [Trophy, Music, GraduationCap];
    const items = eventItems.slice(0, 3);

    return (
      <section className="py-24">
        <div className="containerx">
          <div className="text-center">
            <SectionHeading title={section.title} body={section.body} dark={false} centered />
          </div>
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {items.map((item, index) => {
              const Icon = eventIcons[index % eventIcons.length];
              const eventDate = item.eventDate
                ? new Date(item.eventDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "";

              return (
                <article
                  key={item._id || item.slug || item.title}
                  className="group overflow-hidden rounded-[30px] bg-white shadow-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_60px_rgba(15,23,42,0.18)]"
                >
                  <div className="relative h-64">
                    <img
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      src={
                        item.imageUrl ||
                        "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1400&auto=format&fit=crop"
                      }
                    />
                    <div className="absolute inset-0 bg-slate-950/30" />
                    <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-cyan-600">
                      <Icon size={26} />
                    </div>
                  </div>
                  <div className="p-7">
                    {eventDate ? (
                      <div className="flex items-center gap-2 font-semibold text-cyan-600">
                        <CalendarDays size={16} />
                        {eventDate}
                      </div>
                    ) : null}
                    <h3 className="mt-4 text-3xl font-black text-slate-900">{item.title}</h3>
                    <p className="mt-4 leading-7 text-slate-600">
                      {item.excerpt || item.body || "Event details coming soon."}
                    </p>
                    <Link
                      to={`/events/${item.slug || item._id}`}
                      className="mt-6 inline-flex items-center gap-2 font-bold text-cyan-600"
                    >
                      Learn More
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "eventGallery") {
    const galleryItems = getEventGalleryUrls(section, eventItems);

    return (
      <section className="py-24">
        <div className="containerx">
          <div className="text-center">
            <SectionHeading title={section.title} body={section.body} dark={false} centered />
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((url, index) => (
              <div key={`${url}-${index}`} className="group overflow-hidden rounded-[26px] shadow-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(15,23,42,0.16)]">
                <img alt="gallery" className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" src={url} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "managedGallery") {
    const items = buildManagedGalleryItems(section.source, galleryItems, section.items).slice(0, section.limit || 12);
    const isVideoGallery = section.mediaKind === "video";

    return (
      <section className="py-24 bg-white text-slate-900">
        <div className="containerx">
          <div className="text-center">
            <SectionHeading title={section.title} body={section.body} dark={false} centered />
          </div>

          {items.length ? (
            <div className={`mt-14 grid gap-6 ${isVideoGallery ? "md:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
              {items.map((item, index) => {
                const mediaUrl = item.videoUrl || item.imageUrl || item.fileUrl || "";
                const embedUrl = item.videoUrl ? getYoutubeEmbedUrl(item.videoUrl) : "";

                return (
                  <article
                    key={item._id || item.slug || item.title || `${mediaUrl}-${index}`}
                    className="group overflow-hidden rounded-[26px] bg-white shadow-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(15,23,42,0.16)]"
                  >
                    <div className="overflow-hidden bg-slate-950">
                      {isVideoGallery ? (
                        item.videoUrl?.includes("youtube") || item.videoUrl?.includes("youtu.be") ? (
                          <iframe
                            src={embedUrl}
                            title={item.title || `Video ${index + 1}`}
                            className="h-72 w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : item.videoUrl ? (
                          <video
                            src={item.videoUrl}
                            poster={item.imageUrl || undefined}
                            controls
                            className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                          />
                        ) : item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title || `Video ${index + 1}`}
                            className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : null
                      ) : mediaUrl ? (
                        <img
                          src={mediaUrl}
                          alt={item.title || `Gallery ${index + 1}`}
                          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : null}
                    </div>

                    {(item.title || item.excerpt) ? (
                      <div className="p-5">
                        {item.title ? (
                          <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                        ) : null}
                        {item.excerpt ? (
                          <p className="mt-2 leading-7 text-slate-600">{item.excerpt}</p>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-14 rounded-[26px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              Gallery items will appear here after they are added from Admin - Gallery Management.
            </div>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "split") {
    const paragraphs = splitParagraphs(section.body, []);
    if (section.variant === "panel-split") {
      const SideIcon = resolveIcon(section.sideIcon, Sparkles);
      return (
        <section className="py-24 bg-white text-slate-900">
          <div className="containerx">
            <div className="grid items-center gap-10 rounded-[34px] bg-cyan-50 p-10 transition duration-300 hover:shadow-[0_28px_60px_rgba(8,47,73,0.12)] md:p-16 lg:grid-cols-2">
              <div>
                <h2 className="text-5xl font-black text-slate-900">{section.title}</h2>
                <div className="space-y-5">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mt-6 text-lg leading-8 text-slate-600">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.ctaLabel ? (
                  <a
                    href={section.ctaHref || "/contact-us"}
                    className="mt-8 inline-flex items-center gap-3 rounded-full bg-slate-900 px-8 py-4 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-slate-800 hover:shadow-[0_20px_40px_rgba(15,23,42,0.24)]"
                  >
                    {section.ctaLabel}
                    <ArrowRight size={18} />
                  </a>
                ) : null}
              </div>
              <div className="rounded-[30px] bg-gradient-to-r from-cyan-500 to-blue-700 p-12 text-white shadow-2xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(8,47,73,0.2)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                  <SideIcon size={28} />
                </div>
                <h3 className="mt-6 text-4xl font-black">{section.sideTitle}</h3>
                {section.sideBody ? (
                  <p className="mt-5 leading-8 text-white/85">{section.sideBody}</p>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className={`py-24 ${section.theme === "dark" ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
        <div className="containerx grid items-center gap-14 lg:grid-cols-2">
          <div className="group relative">
            <img
              src={section.mediaUrl}
              className="h-[520px] w-full rounded-[30px] object-cover shadow-2xl transition duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_30px_70px_rgba(15,23,42,0.22)]"
              alt={section.title}
            />
            {section.quoteBadge ? (
              <div className="absolute -bottom-8 -right-8 flex h-36 w-36 items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl">
                <Quote size={50} />
              </div>
            ) : null}
            {section.secondaryMediaUrl && !section.quoteBadge ? (
              <img
                src={section.secondaryMediaUrl}
                className="absolute -bottom-10 -right-10 h-52 w-64 rounded-3xl border-8 border-white object-cover shadow-2xl transition duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                alt=""
              />
            ) : null}
          </div>
          <div>
            {section.eyebrow ? (
              <span className="font-bold uppercase tracking-[3px] text-cyan-600">
                {section.eyebrow}
              </span>
            ) : null}
            <h2 className={`mt-4 text-5xl font-black leading-tight ${section.theme === "dark" ? "text-white" : "text-slate-900"}`}>
              {section.title}
            </h2>
            <div className="space-y-5">
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className={`mt-6 text-lg leading-8 ${section.theme === "dark" ? "text-white/75" : "text-slate-600"}`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            {section.signatureName ? (
              <div className="mt-8">
                <h4 className={`text-2xl font-black ${section.theme === "dark" ? "text-white" : "text-slate-900"}`}>
                  {`- ${section.signatureName}`}
                </h4>
                {section.signatureRole ? (
                  <p className="font-semibold text-cyan-600">{section.signatureRole}</p>
                ) : null}
              </div>
            ) : null}
            {section.ctaLabel ? (
              <a
                href={section.ctaHref || "/contact-us"}
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-bold text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(14,116,144,0.32)]"
              >
                {section.ctaLabel}
                <ArrowRight size={18} />
              </a>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "cards") {
    const dark = section.theme === "dark";
    const centered = section.align === "center";
    const premiumCentered = section.variant === "premium-centered";
    const leadersGrid = section.variant === "leaders-grid";
    const processGrid = section.variant === "process-grid";
    const ageGrid = section.variant === "age-grid";
    const subjectGrid = section.variant === "subject-grid";
    const iconTitleGrid = section.variant === "icon-title-grid";
    const metricStats = section.variant === "metric-stats";
    const topperGrid = section.variant === "topper-grid";
    const columnClass =
      section.columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3";

    if (metricStats && !dark) {
      return (
        <section className="py-24 bg-white text-slate-900">
          <div className="containerx grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {(section.items || []).map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="rounded-[30px] border border-slate-100 bg-white p-8 text-center shadow-2xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(15,23,42,0.14)]"
              >
                <div className="text-5xl font-black text-cyan-600">{item.title}</div>
                {item.subtitle ? (
                  <p className="mt-3 font-semibold text-slate-700">{item.subtitle}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (processGrid && !dark) {
      return (
        <section className="py-24 bg-white text-slate-900">
          <div className="containerx">
            <div className="text-center">
              <SectionHeading title={section.title} body={section.body} dark={false} centered />
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-2">
              {(section.items || []).map((item, index) => {
                const Icon = resolveIcon(item.icon, FileText);
                return (
                  <article
                    key={`${item.title}-${index}`}
                    className="rounded-[30px] border border-slate-100 bg-white p-8 shadow-2xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(15,23,42,0.14)]"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-700 text-white">
                      <Icon size={28} />
                    </div>
                    <h3 className="mt-6 text-3xl font-black text-slate-900">{item.title}</h3>
                    <p className="mt-4 leading-8 text-slate-600">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    if (ageGrid && !dark) {
      return (
        <section className="py-24 bg-white text-slate-900">
          <div className="containerx">
            <div className="rounded-[34px] bg-cyan-50 p-10 md:p-16">
              <SectionHeading title={section.title} body={section.body} dark={false} />
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {(section.items || []).map((item, index) => (
                  <article
                    key={`${item.title}-${index}`}
                    className="rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)]"
                  >
                    <h3 className="text-2xl font-black text-slate-900">{item.title}</h3>
                    {item.subtitle ? (
                      <p className="mt-2 font-semibold text-cyan-700">{item.subtitle}</p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (subjectGrid && !dark) {
      return (
        <section className="py-24 bg-white text-slate-900">
          <div className="containerx">
            <div className="rounded-[34px] bg-cyan-50 p-10 md:p-16">
              <SectionHeading title={section.title} body={section.body} dark={false} centered />
              <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {(section.items || []).map((item, index) => (
                  <article
                    key={`${item.title}-${index}`}
                    className="rounded-2xl bg-white p-6 text-center shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)]"
                  >
                    <p className="text-lg font-bold text-slate-800">{item.title}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (iconTitleGrid && !dark) {
      return (
        <section className="pb-24 bg-white text-slate-900">
          <div className="containerx grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {(section.items || []).map((item, index) => {
              const Icon = resolveIcon(item.icon, Sparkles);
              return (
                <article
                  key={`${item.title}-${index}`}
                  className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(15,23,42,0.14)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-700 text-white">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-slate-900">{item.title}</h3>
                </article>
              );
            })}
          </div>
        </section>
      );
    }

    if (topperGrid && dark) {
      return (
        <section className="bg-slate-950 py-24 text-white">
          <div className="containerx">
            <div className="text-center">
              <SectionHeading title={section.title} body={section.body} dark centered />
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {(section.items || []).map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(8,47,73,0.28)]"
                >
                  {item.image ? (
                    <img
                      alt={item.title}
                      className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                      src={item.image}
                    />
                  ) : null}
                  <div className="p-7">
                    <div className="flex items-center gap-2 font-bold text-cyan-300">
                      <Trophy size={18} />
                      {item.icon || "Topper"}
                    </div>
                    <h3 className="mt-4 text-3xl font-black">{item.title}</h3>
                    {item.subtitle ? (
                      <p className="mt-2 text-white/70">{item.subtitle}</p>
                    ) : null}
                    {item.text ? (
                      <div className="mt-4 text-2xl font-black text-cyan-300">{item.text}</div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (leadersGrid && !dark) {
      return (
        <section className="bg-white py-24 text-slate-900">
          <div className="containerx text-center">
            <SectionHeading title={section.title} body={section.body} dark={false} centered />
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {(section.items || []).map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="group overflow-hidden rounded-[30px] bg-white shadow-2xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(15,23,42,0.16)]"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-[320px] w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-slate-900">{item.title}</h3>
                    {item.subtitle ? (
                      <p className="mt-2 font-semibold text-cyan-600">{item.subtitle}</p>
                    ) : null}
                    <Link
                      to="/contact-us"
                      className="mt-5 inline-flex items-center gap-2 text-slate-600 transition hover:text-cyan-600"
                    >
                      <Mail size={16} />
                      Contact
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (section.variant === "calendar-grid" && dark) {
      return (
        <section className="bg-slate-950 py-24 text-white">
          <div className="containerx">
            <h2 className="text-center text-5xl font-black">{section.title}</h2>
            <div className="mt-14 grid gap-8 md:grid-cols-2">
              {(section.items || []).map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="rounded-[26px] border border-white/10 bg-white/5 p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(8,47,73,0.22)]"
                >
                  {item.subtitle ? (
                    <div className="text-sm font-bold uppercase tracking-[3px] text-cyan-300">
                      {item.subtitle}
                    </div>
                  ) : null}
                  <h3 className="mt-3 text-2xl font-black">{item.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (premiumCentered && dark) {
      return (
        <section className="bg-slate-950 py-24 text-white">
          <div className="containerx text-center">
            <SectionHeading
              title={section.title}
              body={section.body}
              dark
              centered
            />
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {(section.items || []).map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="rounded-[30px] border border-white/10 bg-white/5 p-10 backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(8,47,73,0.24)]"
                >
                  {item.icon ? (
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                      {(() => {
                        const Icon = resolveIcon(item.icon, Sparkles);
                        return <Icon size={28} />;
                      })()}
                    </div>
                  ) : null}
                  <h3 className="mt-6 text-3xl font-black text-white">{item.title}</h3>
                  <p className="mt-4 leading-8 text-white/70">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className={`py-24 ${dark ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
        <div className="containerx">
          <SectionHeading
            title={section.title}
            body={section.body}
            dark={dark}
            centered={centered}
          />
        </div>
        <div className={`containerx mt-10 grid gap-6 ${columnClass}`}>
          {(section.items || []).map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className={`rounded-[30px] p-10 ${
                dark
                  ? "border border-white/10 bg-white/5 backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(8,47,73,0.24)]"
                  : "group overflow-hidden border border-slate-200 bg-slate-50 shadow-lg transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(15,23,42,0.12)]"
              }`}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full object-cover ${
                    dark
                      ? "mb-6 h-52 rounded-[22px]"
                      : "h-52 transition duration-500 group-hover:scale-105"
                  }`}
                />
              ) : null}
              <div className={`${dark ? "" : "p-6"} ${centered ? "text-center" : ""}`}>
                {item.icon ? (
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white ${
                      centered ? "mx-auto" : ""
                    }`}
                  >
                    {(() => {
                      const Icon = resolveIcon(item.icon, Sparkles);
                      return <Icon size={28} />;
                    })()}
                  </div>
                ) : null}
                <h3 className={`mt-6 text-3xl font-black ${dark ? "text-white" : "text-slate-900"}`}>
                  {item.title}
                </h3>
                <p className={`mt-5 leading-8 ${dark ? "text-white/75" : "text-slate-600"}`}>
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "stats") {
    return (
      <section className={`py-24 ${section.theme === "soft" ? "bg-cyan-50" : "bg-white"}`}>
        <div className="containerx grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {(section.items || []).map((item, index) => {
            const Icon = resolveIcon(item.icon, Sparkles);
            return (
              <article
                key={`${item.label}-${index}`}
                className="rounded-[28px] bg-white p-8 text-center shadow-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(15,23,42,0.14)]"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                  <Icon size={28} />
                </div>
                <h3 className="mt-5 text-5xl font-black text-slate-900">{item.value}</h3>
                <p className="mt-2 font-semibold text-slate-600">{item.label}</p>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  if (section.type === "gallery") {
    return (
      <section className="rounded-[34px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:p-12">
        <SectionHeading title={section.title} body={section.body} />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(section.items || []).map((item, index) => (
            <article
              key={`${item.url}-${index}`}
              className="group overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/40 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(8,47,73,0.24)]"
            >
              {item.url ? (
                isVideoUrl(item.url) ? (
                  <video src={item.url} controls className="h-60 w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
                ) : (
                  <img src={item.url} alt={item.caption || `Gallery ${index + 1}`} className="h-60 w-full object-cover transition duration-500 group-hover:scale-105" />
                )
              ) : null}
              {item.caption ? (
                <p className="p-4 text-sm text-white/75">{item.caption}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "infoPanel") {
    return (
      <section className="py-16">
        <div className="containerx">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-xl">
            <div className="bg-blue-700 px-6 py-4 text-xl font-bold text-white">
              {section.label || section.title}
            </div>
            <div className="grid gap-8 p-8 lg:grid-cols-2">
              <div className="space-y-5 text-lg">
                {(section.items || []).map((item, index) => {
                  const Icon = resolveIcon(item.icon, Sparkles);
                  return (
                    <div key={`${item.text}-${index}`} className="flex gap-3">
                      <Icon size={20} className="mt-1 text-blue-700" />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
                {(section.extraLines || []).map((line, index) => (
                  <p key={`${line}-${index}`}>{line}</p>
                ))}
              </div>
              {section.image ? (
                <img
                  src={section.image}
                  alt={section.title || "Section image"}
                  className="h-80 w-full rounded-2xl object-cover"
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "documentsTable") {
    return (
      <section className="pb-16">
        <div className="containerx">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-xl">
              <div className="bg-blue-700 px-6 py-4 text-xl font-bold text-white">
                {section.label || section.title}
              </div>
            <div className="table-scroll">
            <table className="w-full min-w-[720px]">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left font-bold text-slate-900">S.No</th>
                  <th className="p-4 text-left font-bold text-slate-900">Document Name</th>
                  <th className="p-4 text-left font-bold text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {(section.items || []).map((item, index) => (
                  <tr key={`${item.name}-${index}`} className="border-t text-slate-800 hover:bg-blue-50">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4">
                      {resolveDisclosureFileUrl(item) ? (
                        <a
                          href={buildDisclosureDownloadHref(item)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 font-semibold text-blue-700 transition duration-300 hover:-translate-y-0.5 hover:text-blue-900"
                        >
                          <Download size={16} />
                          View / Download
                        </a>
                      ) : (
                        <span className="text-slate-400">No file</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "simpleTable") {
    if (section.variant === "growth-split") {
      const SideIcon = resolveIcon(section.sideIcon, Sparkles);
      return (
        <section className="py-24 bg-white text-slate-900">
          <div className="containerx grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-5xl font-black text-slate-900">{section.title}</h2>
              {section.body ? (
                <p className="mt-6 text-lg leading-8 text-slate-600">{section.body}</p>
              ) : null}
              <div className="mt-10 space-y-5">
                {(section.items || []).map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="flex items-center justify-between rounded-2xl bg-cyan-50 p-5"
                  >
                    <span className="text-xl font-black text-slate-900">{item.label}</span>
                    <span className="font-semibold text-cyan-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[34px] bg-gradient-to-r from-cyan-500 to-blue-700 p-12 text-white shadow-2xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                <SideIcon size={28} />
              </div>
              <h3 className="mt-6 text-4xl font-black">{section.sideTitle}</h3>
              {section.sideBody ? (
                <p className="mt-5 leading-8 text-white/85">{section.sideBody}</p>
              ) : null}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="pb-16">
        <div className="containerx">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-xl">
            <div className="bg-blue-700 px-6 py-4 text-xl font-bold text-white">
              {section.label || section.title}
            </div>
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left font-bold">{section.headers?.[0] || "Label"}</th>
                  <th className="p-4 text-left font-bold">{section.headers?.[1] || "Value"}</th>
                </tr>
              </thead>
              <tbody>
                {(section.items || []).map((item, index) => (
                  <tr key={`${item.label}-${index}`} className="border-t text-slate-800 hover:bg-cyan-50">
                    <td className="p-4 font-medium">{item.label}</td>
                    <td className="p-4">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "textList") {
    if (section.variant === "checklist-split-light") {
      return (
        <section className="py-24 bg-white text-slate-900">
          <div className="containerx grid items-center gap-14 lg:grid-cols-2">
            <div>
              {section.eyebrow ? (
                <span className="font-bold uppercase tracking-[3px] text-cyan-600">
                  {section.eyebrow}
                </span>
              ) : null}
              <h2 className="mt-4 text-5xl font-black text-slate-900">{section.title}</h2>
              {section.body ? (
                <p className="mt-6 text-lg leading-8 text-slate-600">{section.body}</p>
              ) : null}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {(section.items || []).map((item, index) => (
                  <div key={`${item.text}-${index}`} className="flex items-center gap-3">
                    <CircleCheck size={20} className="text-cyan-600" />
                    <span className="font-medium text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            {section.mediaUrl ? (
              <img
                alt={section.title || "Curriculum"}
                className="h-[460px] w-full rounded-[30px] object-cover shadow-2xl"
                src={section.mediaUrl}
              />
            ) : null}
          </div>
        </section>
      );
    }

    if (section.variant === "checklist-split") {
      return (
        <section className="bg-slate-950 py-24 text-white">
          <div className="containerx">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-5xl font-black">{section.title}</h2>
                <div className="mt-10 space-y-5">
                  {(section.items || []).map((item, index) => (
                    <div key={`${item.text}-${index}`} className="flex items-center gap-3">
                      <CircleCheck size={22} className="text-cyan-400" />
                      <span className="text-lg">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              {section.mediaUrl ? (
                <img
                  alt={section.title || "Admission"}
                  className="h-[420px] w-full rounded-[30px] object-cover shadow-2xl"
                  src={section.mediaUrl}
                />
              ) : null}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="pb-20">
        <div className="containerx">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-xl">
            <div className="bg-blue-700 px-6 py-4 text-xl font-bold text-white">
              {section.label || section.title}
            </div>
            <div className="space-y-5 p-8 text-lg text-slate-800">
              {(section.items || []).map((item, index) => (
                <p key={`${item.text}-${index}`}>{item.text}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "video") {
    return (
      <section className="rounded-[34px] bg-white px-8 py-14 text-slate-900 shadow-2xl md:px-12">
        <SectionHeading title={section.title} body={section.body} dark={false} />
        <div className="mt-10 overflow-hidden rounded-[28px] bg-slate-100">
          {section.mediaUrl?.includes("youtube") ? (
            <iframe
              src={section.mediaUrl}
              title={section.title}
              className="h-[420px] w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={section.mediaUrl}
              controls
              className="h-[420px] w-full object-cover"
            />
          )}
        </div>
      </section>
    );
  }

  if (section.type === "cta") {
    if (section.variant === "light-icon") {
      const CtaIcon = resolveIcon(section.icon, Sparkles);
      return (
        <section className="py-24 bg-white">
          <div className="containerx">
            <div className="rounded-[34px] bg-cyan-50 p-10 text-center md:p-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-700 text-white">
                <CtaIcon size={28} />
              </div>
              <h2 className="mt-6 text-4xl font-black text-slate-900 md:text-6xl">{section.title}</h2>
              {section.body ? (
                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">{section.body}</p>
              ) : null}
              {section.ctaLabel ? (
                <a
                  href={section.ctaHref || "/contact-us"}
                  className="mt-8 inline-flex items-center gap-3 rounded-full bg-slate-900 px-8 py-4 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-slate-800 hover:shadow-[0_20px_40px_rgba(15,23,42,0.24)]"
                >
                  {section.ctaLabel}
                  <ArrowRight size={18} />
                </a>
              ) : null}
            </div>
          </div>
        </section>
      );
    }

    if (section.variant === "dark-icon") {
      const CtaIcon = resolveIcon(section.icon, GraduationCap);
      return (
        <section className="pb-24 bg-white">
          <div className="containerx">
            <div className="rounded-[34px] bg-slate-950 px-8 py-16 text-center text-white shadow-2xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <CtaIcon size={28} />
              </div>
              <h2 className="mt-6 text-4xl font-black md:text-6xl">{section.title}</h2>
              {section.body ? (
                <p className="mx-auto mt-5 max-w-2xl text-white/75">{section.body}</p>
              ) : null}
              {section.ctaLabel ? (
                <a
                  href={section.ctaHref || "/contact-us"}
                  className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-slate-900 transition duration-300 hover:-translate-y-1 hover:bg-slate-100 hover:shadow-[0_20px_40px_rgba(15,23,42,0.18)]"
                >
                  {section.ctaLabel}
                  <ArrowRight size={18} />
                </a>
              ) : null}
            </div>
          </div>
        </section>
      );
    }

    const backgroundStyle = section.mediaUrl && !isVideoUrl(section.mediaUrl)
      ? {
          backgroundImage: `linear-gradient(rgba(8, 47, 73, 0.7), rgba(29, 78, 216, 0.7)), url(${section.mediaUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : undefined;

    return (
      <section
        className="overflow-hidden rounded-[36px] bg-gradient-to-r from-cyan-500 to-blue-700 px-8 py-16 text-center text-white shadow-2xl"
        style={backgroundStyle}
      >
        <h2 className="text-4xl font-black md:text-6xl">{section.title}</h2>
        {section.body ? (
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">
            {section.body}
          </p>
        ) : null}
        {section.ctaLabel ? (
          <a
            href={section.ctaHref || "/contact-us"}
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-slate-900 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-slate-100 hover:shadow-[0_20px_40px_rgba(15,23,42,0.18)]"
          >
            {section.ctaLabel}
            <ArrowRight size={18} />
          </a>
        ) : null}
      </section>
    );
  }

  return (
    <section className="grid items-center gap-10 rounded-[34px] bg-white px-8 py-14 text-slate-900 shadow-2xl md:px-12 lg:grid-cols-[1fr_0.9fr]">
      <div>
        <SectionHeading title={section.title} body={section.body} dark={false} />
      </div>
      <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-6">
        <div className="rounded-[24px] bg-gradient-to-br from-cyan-50 to-blue-100 p-8">
          <Sparkles className="text-cyan-600" />
          <p className="mt-6 text-lg leading-8 text-slate-700">
            {section.body || "Use this space to expand the story of the page with a strong visual split section."}
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ title, body, dark = true, centered = false }) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : ""}>
      {title ? (
        <h2 className={`text-4xl font-black md:text-5xl ${dark ? "text-white" : "text-slate-900"}`}>
          {title}
        </h2>
      ) : null}
      {body ? (
        <p className={`mt-5 max-w-3xl text-lg leading-8 ${dark ? "text-white/75" : "text-slate-600"}`}>
          {body}
        </p>
      ) : null}
    </div>
  );
}

function isVideoUrl(url = "") {
  return /\.(mp4|webm|ogg)$/i.test(url) || url.includes("video/upload") || url.includes("youtube") || url.includes("youtu.be");
}

function FullHero({ eyebrow, title, paragraphs, heroImage, iconName }) {
  const lines = String(title).split("<br />");
  const titleParts =
    lines.length > 1 ? lines : String(title).split("\n").filter(Boolean);
  const HeroIcon = resolveIcon(iconName, Sparkles);

  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-slate-950/75" />
      <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="containerx relative z-10 text-center text-white">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 font-semibold text-cyan-300">
          <HeroIcon size={16} />
          {eyebrow}
        </span>
        <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">
          {titleParts.length > 1 ? (
            <>
              {titleParts[0]}
              <br />
              {titleParts.slice(1).join(" ")}
            </>
          ) : (
            title
          )}
        </h1>
        <div className="mx-auto mt-6 max-w-3xl space-y-4">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-8 text-white/75">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
