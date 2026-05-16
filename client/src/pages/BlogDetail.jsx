import { ArrowLeft, CalendarDays, Film } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { attachLiveRefresh } from "../utils/liveUpdates";

function hasHtml(content = "") {
  return /<[^>]+>/.test(content);
}

function plainText(content = "") {
  return content
    .replace(/<[^>]+>/g, " ")
    .replace(/^#+\s*/gm, "")
    .replace(/^\*\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function renderPlainContent(content = "") {
  const blocks = content.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);

  return blocks.map((block, index) => {
    if (/^##\s+/.test(block)) {
      return (
        <h2 key={`h2-${index}`} className="mt-10 text-3xl font-black text-slate-900 first:mt-0">
          {block.replace(/^##\s+/, "")}
        </h2>
      );
    }

    if (/^#\s+/.test(block)) {
      return (
        <h1 key={`h1-${index}`} className="mt-10 text-4xl font-black text-slate-900 first:mt-0">
          {block.replace(/^#\s+/, "")}
        </h1>
      );
    }

    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const bulletLines = lines.filter((line) => /^\*\s+/.test(line));

    if (lines.length && bulletLines.length === lines.length) {
      return (
        <ul key={`ul-${index}`} className="mt-6 list-disc space-y-3 pl-6 text-lg leading-8 text-slate-700">
          {bulletLines.map((line, itemIndex) => (
            <li key={`li-${index}-${itemIndex}`}>{line.replace(/^\*\s+/, "")}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={`p-${index}`} className="mt-6 whitespace-pre-line text-lg leading-8 text-slate-700 first:mt-0">
        {block}
      </p>
    );
  });
}

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [blogRes, recentRes] = await Promise.all([
          api.get(`/content/id/${id}`),
          api.get("/content", { params: { type: "blog", published: "true" } }),
        ]);

        setBlog(blogRes.data);
        setRecentBlogs((recentRes.data || []).filter((item) => item._id !== id).slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return attachLiveRefresh(fetchData);
  }, [id]);

  const articleBody = useMemo(() => {
    if (!blog?.body) return null;
    return hasHtml(blog.body) ? null : renderPlainContent(blog.body);
  }, [blog]);

  if (loading) {
    return (
      <main className="bg-[#F8FAFC] pb-24">
        <section className="bg-gradient-to-r from-[#0B1F4D] via-[#0FA4C6] to-[#1D4ED8] text-white">
          <div className="containerx py-10 md:py-12">
            <div className="shadow-shimmer-line h-11 w-40 bg-white/20" />
          </div>
        </section>

        <section className="py-10">
          <div className="containerx grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-8">
              <div className="shadow-shimmer-card p-8 md:p-10">
                <div className="flex gap-3">
                  <div className="shadow-shimmer-line h-10 w-40" />
                  <div className="shadow-shimmer-line h-10 w-36" />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="shadow-shimmer-line h-28 rounded-[24px]" />
                  <div className="shadow-shimmer-line h-28 rounded-[24px]" />
                  <div className="shadow-shimmer-line h-28 rounded-[24px]" />
                </div>
                <div className="mt-6 space-y-4">
                  <div className="shadow-shimmer-line h-14 w-full" />
                  <div className="shadow-shimmer-line h-14 w-5/6" />
                  <div className="shadow-shimmer-line h-5 w-full" />
                </div>
                <div className="mt-10 space-y-5">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="shadow-shimmer-line h-5 w-full" />
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="shadow-shimmer-card p-6">
                <div className="shadow-shimmer-line h-4 w-32" />
                <div className="mt-5 space-y-3">
                  <div className="shadow-shimmer-line h-4 w-full" />
                  <div className="shadow-shimmer-line h-4 w-5/6" />
                  <div className="shadow-shimmer-line h-4 w-4/6" />
                </div>
              </div>
              <div className="shadow-shimmer-dark p-6">
                <div className="shadow-shimmer-line h-7 w-40 bg-white/15" />
                <div className="mt-5 space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                      <div className="shadow-shimmer-line h-3 w-24 bg-white/15" />
                      <div className="mt-3 shadow-shimmer-line h-5 w-full bg-white/15" />
                      <div className="mt-2 shadow-shimmer-line h-4 w-5/6 bg-white/15" />
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    );
  }

  if (!blog) {
    return <p className="containerx py-24 text-slate-500">Blog not found.</p>;
  }

  return (
    <main className="bg-[#F8FAFC] pb-24">
      <section className="bg-gradient-to-r from-[#0B1F4D] via-[#0FA4C6] to-[#1D4ED8] text-white">
        <div className="containerx py-10 md:py-12">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-semibold text-cyan-100"
          >
            <ArrowLeft size={15} />
            Back To Blogs
          </Link>
        </div>
      </section>

      <section className="-mt-2 py-10">
        <div className="containerx grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            {blog.imageUrl ? (
              <div className="overflow-hidden rounded-[32px] bg-white p-3 shadow-2xl ring-1 ring-slate-200">
                <img src={blog.imageUrl} alt={blog.title} className="w-full rounded-[24px] object-cover" />
              </div>
            ) : null}

            <article className="rounded-[34px] bg-white px-6 py-8 shadow-2xl ring-1 ring-slate-200 md:px-10 md:py-10">
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-cyan-700">
                <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2">
                  <CalendarDays size={15} />
                  {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                {blog.videoUrl ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-white">
                    <Film size={15} />
                    Featured Video
                  </span>
                ) : null}
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight text-slate-900 md:text-6xl">{blog.title}</h1>
              {blog.excerpt ? <p className="mt-5 text-lg leading-8 text-slate-600">{blog.excerpt}</p> : null}

              {blog.videoUrl ? (
                <div className="mt-8 overflow-hidden rounded-[28px] bg-slate-950 p-3">
                  <video src={blog.videoUrl} controls className="max-h-[460px] w-full rounded-[22px] object-cover" />
                </div>
              ) : null}

              <div className="mt-10">
                {blog.body ? (
                  hasHtml(blog.body) ? (
                    <div
                      className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-8 prose-li:text-slate-700 prose-img:rounded-[24px]"
                      dangerouslySetInnerHTML={{ __html: blog.body }}
                    />
                  ) : (
                    <div>{articleBody}</div>
                  )
                ) : (
                  <p className="text-lg leading-8 text-slate-600">This blog does not have full content yet.</p>
                )}
              </div>
            </article>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-[30px] bg-white p-6 shadow-xl ring-1 ring-slate-200">
              <p className="text-sm font-semibold uppercase tracking-[3px] text-cyan-700">Article Snapshot</p>
              <p className="mt-4 text-slate-600 leading-8">
                {blog.excerpt || plainText(blog.body || "").slice(0, 240) || "Full article content appears here once the blog is written and saved."}
              </p>
            </div>

            <div className="rounded-[30px] bg-slate-950 p-6 text-white shadow-2xl">
              <h3 className="text-2xl font-black">Recent Posts</h3>
              <div className="mt-5 space-y-4">
                {recentBlogs.map((item) => (
                  <Link key={item._id} to={`/blogs/${item._id}`} className="block rounded-[20px] border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                    <p className="text-xs font-semibold uppercase tracking-[2px] text-cyan-300">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <h4 className="mt-2 text-lg font-black leading-snug">{item.title}</h4>
                    <p className="mt-2 line-clamp-2 text-sm leading-7 text-white/70">{plainText(item.body || item.excerpt || "")}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
