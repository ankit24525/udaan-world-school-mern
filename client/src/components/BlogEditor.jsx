import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Eye, Film, Heading2, Image as ImageIcon, Italic, List, Save, Type, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const emptyState = {
  title: "",
  excerpt: "",
  coverImage: "",
  featuredVideo: "",
  published: true,
};

function extractFirstMatch(content = "", tag) {
  const match = content.match(new RegExp(`<${tag}.*?src="(.*?)"`, "i"));
  return match ? match[1] : "";
}

export default function BlogEditor({ onSubmit, initialData, onCancel, saving = false }) {
  const [form, setForm] = useState(emptyState);
  const [preview, setPreview] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class: "min-h-[320px] prose max-w-none focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (initialData) {
      setForm({
        title: initialData.title || "",
        excerpt: initialData.excerpt || "",
        coverImage: initialData.imageUrl || "",
        featuredVideo: initialData.videoUrl || "",
        published: initialData.published ?? true,
      });
      editor.commands.setContent(initialData.body || "");
      return;
    }

    setForm(emptyState);
    editor.commands.setContent("");
  }, [initialData, editor]);

  const previewHtml = useMemo(() => editor?.getHTML() || "", [editor, form]);

  if (!editor) return null;

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/upload", formData);
    return res.data.url;
  }

  async function handleInlineUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file);
      editor
        .chain()
        .focus()
        .insertContent(
          file.type.startsWith("video")
            ? `<video controls src="${url}" style="max-width:100%;border-radius:16px;"></video>`
            : `<img src="${url}" style="max-width:100%;border-radius:16px;" />`
        )
        .run();
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      event.target.value = "";
    }
  }

  async function handleCoverUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file);
      setForm((prev) => ({ ...prev, coverImage: url }));
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      event.target.value = "";
    }
  }

  async function handleFeaturedVideoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file);
      setForm((prev) => ({ ...prev, featuredVideo: url }));
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      event.target.value = "";
    }
  }

  function submitEditor(event) {
    event.preventDefault();

    const body = editor.getHTML();
    const extractedImage = extractFirstMatch(body, "img");
    const extractedVideo = extractFirstMatch(body, "video");

    if (!form.title.trim() || !body.trim()) {
      alert("Title and blog content are required");
      return;
    }

    onSubmit({
      type: "blog",
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      body,
      imageUrl: form.coverImage || extractedImage,
      videoUrl: form.featuredVideo || extractedVideo,
      published: form.published,
    });
  }

  return (
    <form onSubmit={submitEditor} className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[2px] text-[#C3292D]">Blog Details</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">Write and style the article</h3>
          </div>

          <input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Blog title"
            className="w-full rounded-xl border px-4 py-3"
          />

          <textarea
            value={form.excerpt}
            onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Short summary for cards and previews"
            className="h-24 w-full rounded-xl border px-4 py-3"
          />

          <div className="flex flex-wrap gap-2 rounded-2xl border bg-slate-50 p-3">
            <ToolbarButton label="Paragraph" icon={Type} onClick={() => editor.chain().focus().setParagraph().run()} />
            <ToolbarButton label="Bold" icon={Save} onClick={() => editor.chain().focus().toggleBold().run()} />
            <ToolbarButton label="Italic" icon={Italic} onClick={() => editor.chain().focus().toggleItalic().run()} />
            <ToolbarButton label="Heading" icon={Heading2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
            <ToolbarButton label="List" icon={List} onClick={() => editor.chain().focus().toggleBulletList().run()} />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium text-slate-700">
              <Upload size={15} />
              Add Image / Video
              <input type="file" hidden accept="image/*,video/*" onChange={handleInlineUpload} />
            </label>
            <button
              type="button"
              onClick={() => setPreview((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              <Eye size={15} />
              {preview ? "Back To Edit" : "Preview"}
            </button>
          </div>

          {!preview ? (
            <div className="rounded-2xl border bg-white p-4">
              <EditorContent editor={editor} />
            </div>
          ) : (
            <div className="prose max-w-none rounded-2xl border bg-white p-4" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          )}
        </div>

        <div className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[2px] text-[#C3292D]">Media & Publish</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">Control the blog presentation</h3>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900">Cover Image</p>
                <p className="text-sm text-slate-500">Used on blog cards and article header.</p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#C3292D] px-4 py-2 text-sm font-medium text-white">
                <ImageIcon size={15} />
                Upload
                <input type="file" hidden accept="image/*" onChange={handleCoverUpload} />
              </label>
            </div>
            <input
              value={form.coverImage}
              onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
              placeholder="Cover image URL"
              className="w-full rounded-xl border px-4 py-3"
            />
            {form.coverImage ? <img src={form.coverImage} alt="Cover preview" className="mt-4 h-48 w-full rounded-2xl object-cover" /> : null}
          </div>

          <div className="rounded-2xl border bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900">Featured Video</p>
                <p className="text-sm text-slate-500">Optional video for the article hero.</p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                <Film size={15} />
                Upload
                <input type="file" hidden accept="video/*" onChange={handleFeaturedVideoUpload} />
              </label>
            </div>
            <input
              value={form.featuredVideo}
              onChange={(e) => setForm((prev) => ({ ...prev, featuredVideo: e.target.value }))}
              placeholder="Featured video URL"
              className="w-full rounded-xl border px-4 py-3"
            />
            {form.featuredVideo ? <video src={form.featuredVideo} controls className="mt-4 h-48 w-full rounded-2xl object-cover" /> : null}
          </div>

          <label className="flex items-center gap-3 rounded-2xl border px-4 py-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))}
            />
            Publish this blog on the website
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#C3292D] px-5 py-3 font-semibold text-white disabled:opacity-60">
              <Save size={16} />
              {saving ? "Saving..." : initialData ? "Update Blog" : "Publish Blog"}
            </button>
            {initialData && onCancel ? (
              <button type="button" onClick={onCancel} className="rounded-full border px-5 py-3 font-semibold text-slate-700">
                Cancel Edit
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
}

function ToolbarButton({ label, icon: Icon, onClick }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium text-slate-700">
      <Icon size={15} />
      {label}
    </button>
  );
}
