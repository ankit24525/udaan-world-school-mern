import { ArrowRight, CalendarDays, Film, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { attachLiveRefresh } from "../utils/liveUpdates";

function plainText(content = "") {
  return content
    .replace(/<[^>]+>/g, " ")
    .replace(/^#+\s*/gm, "")
    .replace(/^\*\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getSummary(blog) {
  return blog.excerpt || plainText(blog.body || "").slice(0, 170) || "Read the full story from our campus updates.";
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await api.get("/content", { params: { type: "blog", published: "true" } });
        setBlogs((res.data || []).filter((item) => item.title));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
    return attachLiveRefresh(fetchBlogs);
  }, []);

  const featured = blogs[0] || null;
  const recent = blogs.slice(1, 5);
  const cards = useMemo(() => blogs.slice(1), [blogs]);

  if (loading) {
    return (
      <main className="overflow-hidden bg-white">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F4D] via-[#0FA4C6] to-[#1D4ED8]" />
          <div className="containerx relative z-10 py-24 text-center">
            <div className="mx-auto shadow-shimmer-line h-10 w-44 bg-white/20" />
            <div className="mx-auto mt-6 shadow-shimmer-line h-16 w-80 max-w-full bg-white/20" />
            <div className="mx-auto mt-5 shadow-shimmer-line h-5 w-[640px] max-w-full bg-white/20" />
          </div>
        </section>

        <section className="py-20">
          <div className="containerx grid gap-10 xl:grid-cols-[1fr_340px]">
            <div className="space-y-8">
              <div className="shadow-shimmer-card p-8 md:p-10">
                <div className="shadow-shimmer-line h-10 w-40" />
                <div className="mt-6 space-y-4">
                  <div className="shadow-shimmer-line h-14 w-full" />
                  <div className="shadow-shimmer-line h-14 w-5/6" />
                  <div className="shadow-shimmer-line h-5 w-full" />
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="shadow-shimmer-line h-24 rounded-[20px]" />
                  <div className="shadow-shimmer-line h-24 rounded-[20px]" />
                  <div className="shadow-shimmer-line h-24 rounded-[20px]" />
                </div>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="shadow-shimmer-card overflow-hidden">
                    <div className="p-6 md:p-7">
                      <div className="shadow-shimmer-line h-4 w-28" />
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="shadow-shimmer-line h-20 rounded-[18px]" />
                        <div className="shadow-shimmer-line h-20 rounded-[18px]" />
                      </div>
                      <div className="mt-4 shadow-shimmer-line h-8 w-full" />
                      <div className="mt-3 shadow-shimmer-line h-8 w-5/6" />
                      <div className="mt-6 space-y-3">
                        <div className="shadow-shimmer-line h-4 w-full" />
                        <div className="shadow-shimmer-line h-4 w-11/12" />
                        <div className="shadow-shimmer-line h-4 w-8/12" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="shadow-shimmer-dark p-6">
                <div className="shadow-shimmer-line h-4 w-32 bg-white/15" />
                <div className="mt-5 space-y-5">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                      <div className="shadow-shimmer-line h-3 w-24 bg-white/15" />
                      <div className="mt-3 shadow-shimmer-line h-5 w-full bg-white/15" />
                      <div className="mt-2 shadow-shimmer-line h-4 w-5/6 bg-white/15" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="shadow-shimmer-card p-6">
                <div className="shadow-shimmer-line h-4 w-28" />
                <div className="mt-4 space-y-3">
                  <div className="shadow-shimmer-line h-4 w-full" />
                  <div className="shadow-shimmer-line h-4 w-5/6" />
                  <div className="shadow-shimmer-line h-4 w-4/6" />
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="overflow-hidden bg-white">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F4D] via-[#0FA4C6] to-[#1D4ED8]" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,white,transparent_45%)]" />
        <div className="containerx relative z-10 py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-semibold text-cyan-200">
            <Sparkles size={16} />
            School Stories
          </span>
          <h1 className="mt-6 text-5xl font-black md:text-7xl">Blogs</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/80">
            Articles, student growth stories, academic guidance and campus insights presented in a cleaner editorial format.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="containerx grid gap-10 xl:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            {featured ? (
              <article className="overflow-hidden rounded-[34px] bg-white shadow-2xl ring-1 ring-slate-200">
                <div className="relative h-[420px] bg-slate-100">
                  {featured.videoUrl ? (
                    <video src={featured.videoUrl} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                  ) : featured.imageUrl ? (
                    <img src={featured.imageUrl} alt={featured.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-100 text-slate-500">Featured blog media</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900">
                      <CalendarDays size={15} />
                      {new Date(featured.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    <h2 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-white md:text-5xl">{featured.title}</h2>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-white/80 md:text-lg">{getSummary(featured)}</p>
                    <Link
                      to={`/blogs/${featured._id}`}
                      className="mt-7 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 font-bold text-slate-900 shadow-xl"
                    >
                      Read More
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </article>
            ) : (
              <div className="rounded-[30px] border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center text-slate-500">
                No published blogs yet.
              </div>
            )}

            <div className="grid gap-8 md:grid-cols-2">
              {cards.map((blog) => (
                <article key={blog._id} className="flex h-full flex-col overflow-hidden rounded-[30px] bg-white shadow-xl ring-1 ring-slate-200">
                  <div className="relative h-64 shrink-0 bg-slate-100">
                    {blog.videoUrl ? (
                      <video src={blog.videoUrl} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                    ) : blog.imageUrl ? (
                      <img src={blog.imageUrl} alt={blog.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-slate-100 text-slate-500">No media added</div>
                    )}
                    {blog.videoUrl ? (
                      <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                        <Film size={13} />
                        Video Story
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <p className="text-sm font-semibold text-cyan-700">
                      {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <h3 className="mt-3 line-clamp-2 min-h-[68px] text-2xl font-black leading-tight text-slate-900">{blog.title}</h3>
                    <p className="mt-4 flex-1 text-sm leading-8 text-slate-600 md:text-base">{getSummary(blog)}</p>
                    <Link to={`/blogs/${blog._id}`} className="mt-6 inline-flex items-center gap-2 font-bold text-cyan-700">
                      Read More
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[30px] bg-slate-950 p-6 text-white shadow-2xl">
              <p className="text-sm font-semibold uppercase tracking-[3px] text-cyan-300">Recent Posts</p>
              <div className="mt-5 space-y-5">
                {(featured ? [featured, ...recent] : recent).slice(0, 5).map((blog) => (
                  <Link key={blog._id} to={`/blogs/${blog._id}`} className="block rounded-[22px] border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                    <p className="text-xs font-semibold uppercase tracking-[2px] text-cyan-300">
                      {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <h3 className="mt-2 text-lg font-black leading-snug text-white">{blog.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-7 text-white/70">{getSummary(blog)}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] bg-cyan-50 p-6 shadow-lg ring-1 ring-slate-200">
              <p className="text-sm font-semibold uppercase tracking-[3px] text-cyan-700">Why Read</p>
              <h3 className="mt-3 text-3xl font-black text-slate-900">Stay connected with student growth and school life</h3>
              <p className="mt-4 text-slate-600 leading-8">
                From study habits to campus updates, this section now works like a proper school editorial space instead of a plain notice board.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
