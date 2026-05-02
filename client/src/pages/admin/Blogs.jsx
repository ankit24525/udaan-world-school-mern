import { Eye, Pencil, Plus, Search, Trash2, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import BlogEditor from "../../components/BlogEditor";
import api from "../../services/api";

function plainText(html = "") {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    const res = await api.get("/content", { params: { type: "blog" } });
    setBlogs(res.data || []);
  }

  function openCreate() {
    setEditing(null);
    setEditorOpen(true);
  }

  function openEdit(blog) {
    setEditing(blog);
    setEditorOpen(true);
  }

  function closeEditor() {
    if (saving) return;
    setEditing(null);
    setEditorOpen(false);
  }

  async function handleSubmit(data) {
    setSaving(true);
    try {
      if (editing?._id) {
        await api.put(`/content/${editing._id}`, data);
      } else {
        await api.post("/content", data);
      }
      await fetchBlogs();
      closeEditor();
    } catch (error) {
      console.error(error);
      alert("Unable to save blog");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this blog?");
    if (!confirmed) return;

    try {
      await api.delete(`/content/${id}`);
      await fetchBlogs();
    } catch (error) {
      console.error(error);
      alert("Unable to delete blog");
    }
  }

  const filteredBlogs = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return blogs;

    return blogs.filter((blog) => {
      const haystack = [blog.title, blog.excerpt, plainText(blog.body)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [blogs, search]);

  const stats = useMemo(() => {
    const published = blogs.filter((blog) => blog.published).length;
    const withVideo = blogs.filter((blog) => Boolean(blog.videoUrl)).length;
    return [
      { label: "Total Blogs", value: blogs.length },
      { label: "Published", value: published },
      { label: "With Video", value: withVideo },
    ];
  }, [blogs]);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] bg-gradient-to-r from-[#0F172A] via-[#102A56] to-[#1647A6] px-6 py-8 text-white shadow-2xl md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[3px] text-cyan-300">Blogs Control Room</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">Create richer stories with images, videos and formatted content</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
              Publish school updates in a cleaner format so the website blog section feels premium and the admin workflow stays simple.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 shadow-lg"
          >
            <Plus size={18} />
            Create Blog
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[2px] text-slate-500">{item.label}</p>
            <p className="mt-3 text-4xl font-black text-slate-900">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">All Blog Posts</h2>
            <p className="mt-1 text-slate-500">Manage published and draft articles from one place.</p>
          </div>

          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blog title or content"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-[#C3292D] focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          {filteredBlogs.map((blog) => {
            const summary = blog.excerpt || plainText(blog.body).slice(0, 120);
            return (
              <article key={blog._id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">
                <div className="relative h-56 bg-slate-100">
                  {blog.videoUrl ? (
                    <video src={blog.videoUrl} controls className="h-full w-full object-cover" />
                  ) : blog.imageUrl ? (
                    <img src={blog.imageUrl} alt={blog.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500">
                      No cover uploaded
                    </div>
                  )}

                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${blog.published ? "bg-emerald-500 text-white" : "bg-amber-400 text-slate-900"}`}>
                      {blog.published ? "Published" : "Draft"}
                    </span>
                    {blog.videoUrl ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
                        <Video size={12} />
                        Video
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[2px] text-slate-400">
                      {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-slate-900">{blog.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{summary}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => openEdit(blog)}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                    <a
                      href={`/blogs/${blog._id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      <Eye size={15} />
                      Preview
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(blog._id)}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!filteredBlogs.length ? (
          <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
            No blogs found for this search yet.
          </div>
        ) : null}
      </section>

      {editorOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl rounded-[32px] bg-[#F8FAFC] p-4 shadow-2xl md:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[2px] text-[#C3292D]">Blog Editor</p>
                <h2 className="text-2xl font-black text-slate-900">{editing ? "Update blog story" : "Create a new blog story"}</h2>
              </div>
              <button type="button" onClick={closeEditor} className="rounded-full border px-4 py-2 font-semibold text-slate-700">
                Close
              </button>
            </div>

            <BlogEditor
              initialData={editing}
              onSubmit={handleSubmit}
              onCancel={closeEditor}
              saving={saving}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
