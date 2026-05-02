import { useState } from "react";
import api from "../../services/api";

export default function BlogForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/content", {
  type: "blog",
  title,
  body: content,
  imageUrl,
  videoUrl,
});

      setTitle("");
      setContent("");

      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      alert("Error creating blog");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-xl shadow space-y-4"
    >
      <h3 className="font-semibold text-lg">Create Blog</h3>

      <input
        className="border p-2 w-full rounded"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
  placeholder="Image URL"
  className="border p-2 w-full"
  onChange={(e) => setImageUrl(e.target.value)}
/>

<input
  placeholder="Video URL (optional)"
  className="border p-2 w-full"
  onChange={(e) => setVideoUrl(e.target.value)}
/>

      <textarea
        className="border p-2 w-full rounded h-28"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Blog"}
      </button>
    </form>
  );
}