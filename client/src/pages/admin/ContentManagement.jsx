import {
  Calendar,
  Edit,
  Eye,
  FileText,
  MessageSquare,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { managedPageSections } from "./contentRegistry.js";

const tabConfig = {
  pages: {
    label: "Pages",
    icon: FileText,
    backendType: "page",
    emptyTitle: "No pages available.",
  },
  blogs: {
    label: "Blogs",
    icon: MessageSquare,
    backendType: "blog",
    emptyTitle: "No blogs found.",
  },
  events: {
    label: "Events",
    icon: Calendar,
    backendType: "event",
    emptyTitle: "No events found.",
  },
};

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  mediaUrl: "",
  mediaKind: "image",
  location: "",
  eventDate: "",
  gallery: [],
  published: true,
};

const pagePreviewDefaults = {
  homeWhyChooseUs: ["Academic Excellence", "Safe Campus", "Smart Learning"],
  homeFacilities: ["Classrooms", "Library", "Labs"],
  homePartners: ["Partner Logos", "Brand Images", "Collaborations"],
  homeTestimonials: ["Parent Reviews", "Quotes", "Ratings"],
};

const pagePreviewImages = {
  homeHero: "/images/people/director.jpeg",
  homeAbout: "/images/people/principal.jpeg",
  homeCreativity: "/images/people/founder.jpeg",
  homeSportsFeature: "/images/people/director.jpeg",
  homeChairman: "/images/people/director.jpeg",
  homeWhyChooseUs: "/images/people/principal.jpeg",
  homeStories: "/images/people/founder.jpeg",
};

const MAX_EVENT_GALLERY_IMAGES = 6;

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState("pages");
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContent(activeTab);
  }, [activeTab]);

  const actionLabel = useMemo(() => {
    if (activeTab === "blogs") return "Add Blog";
    if (activeTab === "events") return "Add Event";
    return null;
  }, [activeTab]);

  async function fetchContent(tab) {
    setLoading(true);
    setError("");

    try {
      const type = tabConfig[tab].backendType;
      const res = await api.get("/content", {
        params: { type },
      });

      const rows = Array.isArray(res.data) ? res.data : [];

      if (tab === "pages") {
        const pageMap = Object.fromEntries(rows.map((item) => [item.key, item]));

        setContent(
          managedPageSections.map((page) => {
            const item = pageMap[page.key];

            return {
              id: page.key,
              key: page.key,
              title: item?.title || page.title,
              type: "Page",
              group: page.group,
              previewImage: getPagePreviewImage(page.key, item),
              sectionCount: Array.isArray(item?.meta?.sections) ? item.meta.sections.length : 0,
              mediaCount: countPageMedia(item),
              excerpt: item?.body || "",
              previewTags: getPagePreviewTags(page.key, item),
              status:
                item?.published === false ? "Draft" : item ? "Published" : "Draft",
              updatedAt: item?.updatedAt || null,
              existsInDb: Boolean(item),
            };
          })
        );
      } else {
        setContent(rows);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load content right now.");
      setContent([]);
    } finally {
      setLoading(false);
    }
  }

  function openCreateEditor() {
    setEditingItem(null);
    setForm(emptyForm);
    setIsEditorOpen(true);
  }

  function openEditEditor(item) {
    setEditingItem(item);
    setForm({
      title: item.title || "",
      slug: item.slug || "",
      excerpt: item.excerpt || "",
      body: item.body || "",
      mediaUrl: item.imageUrl || item.videoUrl || "",
      mediaKind: "image",
      location: item.location || "",
      eventDate: item.eventDate ? item.eventDate.slice(0, 10) : "",
      gallery: Array.isArray(item.meta?.gallery) ? item.meta.gallery : [],
      published: item.published ?? true,
    });
    setIsEditorOpen(true);
  }

  function closeEditor() {
    setIsEditorOpen(false);
    setEditingItem(null);
    setForm(emptyForm);
  }

  async function saveManagedContent() {
    if (!form.title || !form.body) {
      alert("Title and content body are required");
      return;
    }

    setSaving(true);

    const payload = {
      type: tabConfig[activeTab].backendType,
      title: form.title,
      slug: activeTab === "events" ? slugify(form.slug || form.title) : form.slug,
      excerpt: form.excerpt,
      body: form.body,
      published: form.published,
    };

    if (form.mediaUrl) {
      payload.imageUrl = form.mediaUrl;
    }

    if (activeTab === "events") {
      const cleanedGallery = Array.isArray(form.gallery) ? form.gallery.filter(Boolean) : [];
      payload.location = form.location;
      payload.eventDate = form.eventDate || null;
      if (!payload.imageUrl && cleanedGallery.length) {
        payload.imageUrl = cleanedGallery[0];
      }
      payload.meta = {
        ...(editingItem?.meta || {}),
        gallery: cleanedGallery,
      };
    }

    try {
      if (editingItem?._id) {
        await api.put(`/content/${editingItem._id}`, payload);
      } else {
        await api.post("/content", payload);
      }

      closeEditor();
      fetchContent(activeTab);
    } catch (err) {
      console.error(err);
      alert("Unable to save content");
    } finally {
      setSaving(false);
    }
  }

  async function deleteContent(item) {
    if (activeTab === "pages") {
      alert("Website pages are fixed. Open the page editor to update them.");
      return;
    }

    const confirmed = window.confirm("Delete this content item?");
    if (!confirmed) return;

    try {
      await api.delete(`/content/${item._id}`);
      setContent((prev) => prev.filter((row) => row._id !== item._id));
    } catch (err) {
      console.error(err);
      alert("Unable to delete content");
    }
  }

  function handleEdit(item) {
    if (activeTab === "pages") {
      navigate(`/admin/editor/${item.key}`);
      return;
    }

    openEditEditor(item);
  }

  function handleView(item) {
    if (activeTab === "pages") {
      navigate(`/admin/editor/${item.key}`);
      return;
    }

    if (activeTab === "blogs") {
      navigate(`/blogs/${item._id}`);
      return;
    }

    openEditEditor(item);
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload", formData);
      setForm((prev) => ({
        ...prev,
        mediaUrl: res.data.url,
        mediaKind: "image",
      }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      event.target.value = "";
    }
  }

  async function handleGalleryFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if ((form.gallery || []).length >= MAX_EVENT_GALLERY_IMAGES) {
      alert(`Only ${MAX_EVENT_GALLERY_IMAGES} gallery images can be added.`);
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload", formData);
      setForm((prev) => ({
        ...prev,
        mediaUrl: prev.mediaUrl || res.data.url,
        gallery: [...(prev.gallery || []), res.data.url],
      }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      event.target.value = "";
    }
  }

  function removeGalleryImage(indexToRemove) {
    setForm((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, index) => index !== indexToRemove),
    }));
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="mt-2 text-gray-600">
            Manage website pages, blogs, and events
          </p>
        </div>

        {actionLabel ? (
          <button
            onClick={openCreateEditor}
            className="flex items-center gap-2 rounded-lg bg-[#C3292D] px-4 py-2 text-white hover:bg-[#A01F23]"
          >
            <Plus size={16} />
            {actionLabel}
          </button>
        ) : null}
      </div>

      <div className="rounded-xl border bg-white shadow">
        <div className="flex gap-6 border-b px-6 pt-4">
          {Object.entries(tabConfig).map(([key, tab]) => {
            const Icon = tab.icon;

            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 border-b-2 pb-4 transition ${
                  activeTab === key
                    ? "border-[#C3292D] font-medium text-[#C3292D]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {loading && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: activeTab === "pages" ? 6 : 4 }).map((_, index) => (
                <div key={index} className="shadow-shimmer-card p-5">
                  <div className="space-y-3">
                    <div className="shadow-shimmer-line h-5 w-2/3" />
                    <div className="shadow-shimmer-line h-4 w-full" />
                    <div className="shadow-shimmer-line h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && error && <div className="text-sm text-red-600">{error}</div>}

          {!loading && !error && (
            activeTab === "pages" ? (
              <PagesGrid
                data={content}
                emptyText={tabConfig[activeTab].emptyTitle}
                onView={handleView}
                onEdit={handleEdit}
              />
            ) : (
              <Table
                tab={activeTab}
                data={content}
                emptyText={tabConfig[activeTab].emptyTitle}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={deleteContent}
              />
            )
          )}
        </div>
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {editingItem ? `Edit ${activeTab.slice(0, -1)}` : `Create ${activeTab.slice(0, -1)}`}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === "blogs"
                    ? "Manage blog content from the admin panel."
                    : "Manage event details from the admin panel."}
                </p>
              </div>

              <button
                onClick={closeEditor}
                className="rounded p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => {
                    const nextTitle = e.target.value;
                    return {
                      ...prev,
                      title: nextTitle,
                      slug:
                        activeTab === "events"
                          ? slugify(nextTitle)
                          : prev.slug,
                    };
                  })
                }
                placeholder={activeTab === "events" ? "Event title" : "Title"}
                className="w-full rounded-lg border px-4 py-3"
              />

              {activeTab !== "events" ? (
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="Slug"
                  className="w-full rounded-lg border px-4 py-3"
                />
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600">
                  Event URL: <span className="font-medium text-gray-900">/events/{form.slug || "event-slug"}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                  <Upload size={16} />
                  {activeTab === "events" ? "Upload Event Cover Image" : "Upload to Cloudinary"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>

                {form.mediaUrl ? (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                    {activeTab === "events" ? "Cover image ready" : "Uploaded media ready"}
                  </div>
                ) : null}
              </div>

              {activeTab === "events" && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="Location"
                      className="w-full rounded-lg border px-4 py-3"
                    />

                    <input
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>

                  <div className="space-y-3 rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Event Gallery</h3>
                        <p className="text-sm text-gray-500">
                          Add up to {MAX_EVENT_GALLERY_IMAGES} gallery images here. These exact images will appear in the public Event Gallery section.
                        </p>
                      </div>
                      <label
                        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm ${
                          (form.gallery || []).length >= MAX_EVENT_GALLERY_IMAGES
                            ? "cursor-not-allowed border-gray-200 text-gray-400"
                            : "cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Upload size={16} />
                        {(form.gallery || []).length >= MAX_EVENT_GALLERY_IMAGES
                          ? "Gallery Full"
                          : "Add Gallery Image"}
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          disabled={(form.gallery || []).length >= MAX_EVENT_GALLERY_IMAGES}
                          onChange={handleGalleryFileChange}
                        />
                      </label>
                    </div>

                    <div className="text-sm font-medium text-gray-600">
                      {(form.gallery || []).length}/{MAX_EVENT_GALLERY_IMAGES} images added
                    </div>

                    {(form.gallery || []).length ? (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {form.gallery.map((url, index) => (
                          <div key={`${url}-${index}`} className="overflow-hidden rounded-xl border bg-gray-50">
                            <img
                              src={url}
                              alt={`Gallery ${index + 1}`}
                              className="h-40 w-full object-cover"
                            />
                            <div className="flex items-center justify-between p-3">
                              <span className="text-sm text-gray-600">Image {index + 1}</span>
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(index)}
                                className="rounded p-2 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                        No gallery images added yet.
                      </div>
                    )}
                  </div>
                </>
              )}

              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder={activeTab === "events" ? "Short event summary" : "Short summary"}
                className="h-24 w-full rounded-lg border px-4 py-3"
              />

              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder={activeTab === "events" ? "Full event details" : "Full content"}
                className="h-56 w-full rounded-lg border px-4 py-3"
              />

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) =>
                    setForm({ ...form, published: e.target.checked })
                  }
                />
                Published
              </label>
            </div>

            <div className="flex gap-3 border-t p-6">
              <button
                onClick={saveManagedContent}
                disabled={saving}
                className="rounded-lg bg-[#C3292D] px-4 py-2 text-white hover:bg-[#A01F23] disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={closeEditor}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function countPageMedia(item) {
  if (!item) return 0;

  let count = 0;
  if (item.imageUrl) count += 1;

  const sections = Array.isArray(item.meta?.sections) ? item.meta.sections : [];
  sections.forEach((section) => {
    if (section.mediaUrl) count += 1;
    if (Array.isArray(section.items)) {
      section.items.forEach((entry) => {
        if (entry.image || entry.url) count += 1;
      });
    }
  });

  return count;
}

function getPagePreviewTags(key, item) {
  if (Array.isArray(item?.meta?.cards) && item.meta.cards.length) {
    return item.meta.cards
      .map((card) => card.title)
      .filter(Boolean)
      .slice(0, 3);
  }

  if (Array.isArray(item?.meta?.items) && item.meta.items.length) {
    return item.meta.items
      .map((entry) => (typeof entry === "string" ? entry : entry.title || entry.caption))
      .filter(Boolean)
      .slice(0, 3);
  }

  if (Array.isArray(item?.meta?.logos) && item.meta.logos.length) {
    return [`${item.meta.logos.length} logos`];
  }

  return pagePreviewDefaults[key] || [];
}

function getPagePreviewImage(key, item) {
  if (item?.imageUrl) return item.imageUrl;

  if (Array.isArray(item?.meta?.cards) && item.meta.cards.length) {
    const cardImage = item.meta.cards.find((card) => card?.image)?.image;
    if (cardImage) return cardImage;
  }

  if (Array.isArray(item?.meta?.items) && item.meta.items.length) {
    const firstItem = item.meta.items.find((entry) =>
      typeof entry === "object" ? entry?.image || entry?.url : false
    );
    if (firstItem?.image) return firstItem.image;
    if (firstItem?.url) return firstItem.url;
  }

  if (Array.isArray(item?.meta?.logos) && item.meta.logos.length) {
    return item.meta.logos[0];
  }

  return pagePreviewImages[key] || "";
}

function humanizePageKey(value = "") {
  return String(value || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getPageGroupLabel(item) {
  if (item?.key) {
    return `${humanizePageKey(item.key)} Page`;
  }

  if (item?.title) {
    return item.title.includes("Page") ? item.title : `${item.title} Page`;
  }

  return "Page";
}

function PagesGrid({ data, emptyText, onView, onEdit }) {
  if (!data.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center text-sm text-gray-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {data.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="relative h-44 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700">
            {item.previewImage ? (
              <img
                src={item.previewImage}
                alt={item.title}
                className="h-full w-full object-cover opacity-80"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                {getPageGroupLabel(item)}
              </span>
              <h3 className="mt-3 text-xl font-bold text-white">{item.title}</h3>
            </div>
          </div>

          <div className="space-y-4 p-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              <InfoBadge label="Sections" value={String(item.sectionCount || 0)} />
              <InfoBadge label="Media" value={String(item.mediaCount || 0)} />
              <InfoBadge label="Status" value={item.status} compact />
            </div>

            <p className="line-clamp-3 min-h-[72px] text-sm leading-6 text-gray-600">
              {item.excerpt || "Open this page to edit hero copy, sections, cards, galleries, videos, and CTA blocks."}
            </p>

            {item.previewTags?.length ? (
              <div className="flex flex-wrap gap-2">
                {item.previewTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="flex gap-3">
              <button
                onClick={() => onView(item)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md"
              >
                <Eye size={16} />
                View Editor
              </button>
              <button
                onClick={() => onEdit(item)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C3292D] px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#A01F23] hover:shadow-lg"
              >
                <Edit size={16} />
                Edit Page
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function InfoBadge({ label, value, compact = false }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-3">
      <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-1 font-semibold ${compact ? "text-xs" : "text-lg"} text-gray-900`}>
        {value}
      </p>
    </div>
  );
}

function Table({ tab, data, emptyText, onView, onEdit, onDelete }) {
  if (!data.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center text-sm text-gray-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Last Updated</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {data.map((item) => {
            const rowId = item._id || item.id;
            const status =
              item.status || (item.published === false ? "Draft" : "Published");
            const updatedAt = item.updatedAt || item.date || item.createdAt;

            return (
              <tr key={rowId} className="hover:bg-gray-50">
                <td className="px-6 py-4">{item.code || item.id || rowId}</td>
                <td className="px-6 py-4 font-medium">{item.title}</td>
                <td className="px-6 py-4">
                  {tab === "pages" ? (
                    getPageGroupLabel(item)
                  ) : tab === "events" ? (
                    <div className="space-y-1">
                      <div>{item.type || "Event"}</div>
                      <div className="text-xs text-gray-500">
                        Gallery: {Array.isArray(item.meta?.gallery) ? item.meta.gallery.length : 0}
                      </div>
                    </div>
                  ) : (
                    item.type || "Blog"
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {updatedAt ? new Date(updatedAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onView(item)}
                      className="rounded p-1 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => onEdit(item)}
                      className="rounded p-1 text-gray-600 hover:bg-gray-100"
                    >
                      <Edit size={16} />
                    </button>

                    {tab !== "pages" && (
                      <button
                        onClick={() => onDelete(item)}
                        className="rounded p-1 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
