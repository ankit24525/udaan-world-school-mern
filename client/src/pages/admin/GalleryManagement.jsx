import { Eye, Image as ImageIcon, Pencil, Plus, Trash2, Upload, Video, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const galleryTabs = {
  photos: { label: "Photo Gallery", icon: ImageIcon, accept: "image/*", mediaKind: "image" },
  videos: { label: "Video Gallery", icon: Video, accept: "video/*", mediaKind: "video" },
  events: { label: "Events Gallery", icon: ImageIcon, accept: "image/*", mediaKind: "image" },
};

const emptyForm = {
  title: "",
  excerpt: "",
  mediaUrl: "",
  thumbnailUrl: "",
  published: true,
};

function normalizeGalleryType(value = "") {
  const normalized = String(value).trim().toLowerCase();
  if (["photo", "photos", "photo gallery", "photo-gallery"].includes(normalized)) return "photos";
  if (["video", "videos", "video gallery", "video-gallery"].includes(normalized)) return "videos";
  if (["event", "events", "events gallery", "events-gallery"].includes(normalized)) return "events";
  return normalized;
}

export default function GalleryManagement() {
  const [activeTab, setActiveTab] = useState("photos");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => normalizeGalleryType(item.category || item.meta?.galleryType) === activeTab);
  }, [activeTab, items]);

  async function fetchGallery() {
    setLoading(true);
    try {
      const res = await api.get("/content", { params: { type: "gallery" } });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setItems([]);
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
      excerpt: item.excerpt || "",
      mediaUrl: item.videoUrl || item.imageUrl || "",
      thumbnailUrl: item.videoUrl ? item.imageUrl || "" : "",
      published: item.published ?? true,
    });
    setIsEditorOpen(true);
  }

  function closeEditor() {
    setEditingItem(null);
    setForm(emptyForm);
    setIsEditorOpen(false);
  }

  async function uploadFile(file, callback) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload", formData);
      callback(res.data.url);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Upload failed");
    }
  }

  async function saveItem() {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!form.mediaUrl.trim()) {
      alert(activeTab === "videos" ? "Please upload a video" : "Please upload an image");
      return;
    }

    setSaving(true);

    const payload = {
      type: "gallery",
      category: activeTab,
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      published: form.published,
      meta: {
        ...(editingItem?.meta || {}),
        galleryType: activeTab,
      },
    };

    if (activeTab === "videos") {
      payload.videoUrl = form.mediaUrl.trim();
      payload.imageUrl = form.thumbnailUrl.trim();
    } else {
      payload.imageUrl = form.mediaUrl.trim();
    }

    try {
      if (editingItem?._id) {
        await api.put(`/content/${editingItem._id}`, payload);
      } else {
        await api.post("/content", payload);
      }

      closeEditor();
      fetchGallery();
    } catch (error) {
      console.error(error);
      alert("Unable to save gallery item");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item) {
    if (!window.confirm("Delete this gallery item?")) return;

    try {
      await api.delete(`/content/${item._id}`);
      setItems((prev) => prev.filter((entry) => entry._id !== item._id));
    } catch (error) {
      console.error(error);
      alert("Unable to delete gallery item");
    }
  }

  const activeConfig = galleryTabs[activeTab];
  const ActiveIcon = activeConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-[#0b1120]">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gallery Management</h1>
          <p className="mt-2 text-gray-600 dark:text-slate-400">
            Manage photos, videos and event gallery media that appear on the public gallery pages.
          </p>
        </div>

        <button
          onClick={openCreateEditor}
          className="inline-flex items-center gap-2 rounded-lg bg-[#C3292D] px-4 py-2 text-white hover:bg-[#A01F23]"
        >
          <Plus size={16} />
          Add Media
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20">
        <div className="flex gap-6 border-b border-slate-200 px-6 pt-4 dark:border-white/10">
          {Object.entries(galleryTabs).map(([key, config]) => {
            const TabIcon = config.icon;
            const isActive = key === activeTab;

            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 border-b-2 pb-4 ${isActive ? "border-[#C3292D] font-medium text-[#C3292D]" : "border-transparent text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"}`}
              >
                <TabIcon size={16} />
                {config.label}
              </button>
            );
          })}
        </div>

        <div className="border-b border-slate-200 px-6 py-4 text-sm text-gray-600 dark:border-white/10 dark:text-slate-400">
          {activeTab === "photos" ? "Upload campus, classroom and school life photos." : null}
          {activeTab === "videos" ? "Upload video files or add video URLs with optional thumbnail images." : null}
          {activeTab === "events" ? "Upload celebration and event photos for the Events Gallery page." : null}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="shadow-shimmer-card overflow-hidden">
                  <div className="h-48 bg-slate-100" />
                  <div className="space-y-3 p-5">
                    <div className="shadow-shimmer-line h-5 w-2/3" />
                    <div className="shadow-shimmer-line h-4 w-full" />
                    <div className="shadow-shimmer-line h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => {
                const previewUrl = item.imageUrl || item.videoUrl;

                return (
                  <article key={item._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900 dark:shadow-black/20 dark:hover:border-cyan-400/40">
                    <div className="aspect-video bg-gray-100 dark:bg-white/5">
                      {activeTab === "videos" ? (
                        item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                        ) : item.videoUrl ? (
                          <video src={item.videoUrl} className="h-full w-full object-cover" controls />
                        ) : null
                      ) : previewUrl ? (
                        <img src={previewUrl} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400 dark:text-slate-500">
                          <ActiveIcon size={34} />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                          {item.excerpt ? (
                            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.excerpt}</p>
                          ) : null}
                        </div>
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.published === false ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                          {item.published === false ? "Draft" : "Published"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>{galleryTabs[normalizeGalleryType(item.category || item.meta?.galleryType)]?.label || "Gallery"}</span>
                        <span>{new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditEditor(item)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <a
                          href={item.videoUrl || item.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                        >
                          <Eye size={14} />
                        </a>
                        <button
                          onClick={() => deleteItem(item)}
                          className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-gray-500 dark:border-white/10 dark:text-slate-400">
              No media added in this gallery yet. Add your first item to make it appear on the public page.
            </div>
          )}
        </div>
      </div>

      {isEditorOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-950 dark:shadow-black/40">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingItem ? "Edit Gallery Item" : "Add Gallery Item"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{activeConfig.label}</p>
              </div>
              <button onClick={closeEditor} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Title"
                className="w-full rounded-lg border px-4 py-3"
              />

              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Short description"
                className="h-28 w-full rounded-lg border px-4 py-3"
              />

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                      <p className="font-medium text-slate-900 dark:text-white">{activeTab === "videos" ? "Video File / URL" : "Gallery Image"}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">This media will appear on the public gallery page.</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#C3292D] px-3 py-2 text-sm font-medium text-white hover:bg-[#A01F23]">
                    <Upload size={14} />
                    Upload
                    <input
                      type="file"
                      accept={activeConfig.accept}
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        await uploadFile(file, (url) => setForm((prev) => ({ ...prev, mediaUrl: url })));
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>

                <input
                  value={form.mediaUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, mediaUrl: e.target.value }))}
                  placeholder={activeTab === "videos" ? "Video URL" : "Image URL"}
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              {activeTab === "videos" ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Video Thumbnail</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Optional cover image for the public video gallery cards.</p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
                      <Upload size={14} />
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          await uploadFile(file, (url) => setForm((prev) => ({ ...prev, thumbnailUrl: url })));
                          event.target.value = "";
                        }}
                      />
                    </label>
                  </div>

                  <input
                    value={form.thumbnailUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, thumbnailUrl: e.target.value }))}
                    placeholder="Thumbnail image URL"
                    className="w-full rounded-lg border px-4 py-3"
                  />
                </div>
              ) : null}

              <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))}
                />
                Publish this gallery item
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
                  <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">Preview</p>
                  {activeTab === "videos" ? (
                    form.thumbnailUrl ? (
                      <img src={form.thumbnailUrl} alt="Thumbnail preview" className="h-48 w-full rounded-xl object-cover" />
                    ) : form.mediaUrl ? (
                      <video src={form.mediaUrl} controls className="h-48 w-full rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-48 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500">No preview yet</div>
                    )
                  ) : form.mediaUrl ? (
                    <img src={form.mediaUrl} alt="Preview" className="h-48 w-full rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-48 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500">No preview yet</div>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600 dark:border-white/10 dark:text-slate-400">
                  <p className="font-medium text-slate-800 dark:text-white">How this works</p>
                  <ul className="mt-3 space-y-2">
                    <li>Media added here appears on the public gallery pages.</li>
                    <li>Page titles and section text are edited from Pages.</li>
                    <li>Use Events Gallery for celebration and annual function images.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-white/10">
              <button onClick={closeEditor} className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">Cancel</button>
              <button
                onClick={saveItem}
                disabled={saving}
                className="rounded-lg bg-[#C3292D] px-4 py-2 font-medium text-white hover:bg-[#A01F23] disabled:opacity-60"
              >
                {saving ? "Saving..." : editingItem ? "Save Changes" : "Create Item"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
