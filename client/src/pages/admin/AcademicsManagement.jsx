import { Award, BookOpen, Pencil, Plus, Trophy, Trash2, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const emptyGrowth = {
  year: "",
  className: "",
  highestResult: "",
};

const emptyPerformer = {
  topperName: "",
  className: "",
  topperPercentage: "",
  stream: "",
  imageUrl: "",
  publicId: "",
  resourceType: "",
};

function normalizeGrowth(item = {}) {
  return {
    year: item.meta?.year || "",
    className: item.meta?.className || item.category || "",
    highestResult: String(item.meta?.highestResult ?? item.meta?.passPercentage ?? ""),
  };
}

function normalizePerformer(item = {}) {
  return {
    topperName: item.meta?.topperName || item.title || "",
    className: item.meta?.className || item.category || "",
    topperPercentage: String(item.meta?.topperPercentage ?? ""),
    stream: item.meta?.stream || "",
    imageUrl: item.imageUrl || "",
    publicId: item.meta?.publicId || "",
    resourceType: item.meta?.resourceType || "",
  };
}

function buildGrowthPayload(form) {
  const cleanYear = String(form.year || "").trim();
  const cleanClassName = String(form.className || "").trim();
  const highestResult = Number(form.highestResult || 0);

  return {
    type: "result",
    title: `${cleanYear} ${cleanClassName} Highest Result`.trim(),
    excerpt: `Highest academic result recorded for ${cleanClassName || "selected class"} in ${cleanYear}.`,
    category: cleanClassName,
    meta: {
      section: "growth",
      year: cleanYear,
      className: cleanClassName,
      highestResult,
      passPercentage: highestResult,
    },
    published: true,
  };
}

function buildPerformerPayload(form) {
  const topperName = String(form.topperName || "").trim();
  const className = String(form.className || "").trim();
  const topperPercentage = Number(form.topperPercentage || 0);

  return {
    type: "result",
    title: topperName || "Star Performer",
    excerpt: `${topperName || "Student"} achieved ${topperPercentage ? `${topperPercentage}%` : "a top score"}.`,
    category: className,
    imageUrl: form.imageUrl || "",
    meta: {
      section: "performer",
      topperName,
      className,
      topperPercentage,
      stream: String(form.stream || "").trim(),
      publicId: form.publicId || "",
      resourceType: form.resourceType || "",
    },
    published: true,
  };
}

export default function AcademicsManagement() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showGrowthForm, setShowGrowthForm] = useState(false);
  const [editingGrowthId, setEditingGrowthId] = useState(null);
  const [growthForm, setGrowthForm] = useState(emptyGrowth);

  const [showPerformerForm, setShowPerformerForm] = useState(false);
  const [editingPerformerId, setEditingPerformerId] = useState(null);
  const [performerForm, setPerformerForm] = useState(emptyPerformer);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchResults();
  }, []);

  async function fetchResults() {
    try {
      setLoading(true);
      const res = await api.get("/content", {
        params: { type: "result", published: true },
      });
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const growthRows = useMemo(
    () =>
      results.filter(
        (item) => (item.meta?.section || "growth") === "growth" && item.meta?.year
      ),
    [results]
  );

  const performerRows = useMemo(
    () =>
      results.filter(
        (item) =>
          item.meta?.section === "performer" ||
          item.meta?.topperName ||
          item.imageUrl
      ),
    [results]
  );

  const stats = useMemo(() => {
    const highestGrowth = growthRows.reduce(
      (best, item) => Math.max(best, Number(item.meta?.highestResult || item.meta?.passPercentage || 0)),
      0
    );
    const bestPerformerScore = performerRows.reduce(
      (best, item) => Math.max(best, Number(item.meta?.topperPercentage || 0)),
      0
    );

    return {
      highestGrowth: highestGrowth ? `${highestGrowth.toFixed(1)}%` : "--",
      yearlyEntries: growthRows.length,
      starPerformers: performerRows.length,
      bestPerformerScore: bestPerformerScore ? `${bestPerformerScore.toFixed(1)}%` : "--",
    };
  }, [growthRows, performerRows]);

  function closeGrowthForm() {
    setShowGrowthForm(false);
    setEditingGrowthId(null);
    setGrowthForm(emptyGrowth);
  }

  function closePerformerForm() {
    setShowPerformerForm(false);
    setEditingPerformerId(null);
    setPerformerForm(emptyPerformer);
  }

  function openGrowthCreate() {
    closePerformerForm();
    setGrowthForm(emptyGrowth);
    setEditingGrowthId(null);
    setShowGrowthForm(true);
  }

  function openGrowthEdit(item) {
    closePerformerForm();
    setGrowthForm(normalizeGrowth(item));
    setEditingGrowthId(item._id);
    setShowGrowthForm(true);
  }

  function openPerformerCreate() {
    closeGrowthForm();
    setPerformerForm(emptyPerformer);
    setEditingPerformerId(null);
    setShowPerformerForm(true);
  }

  function openPerformerEdit(item) {
    closeGrowthForm();
    setPerformerForm(normalizePerformer(item));
    setEditingPerformerId(item._id);
    setShowPerformerForm(true);
  }

  async function saveGrowth() {
    if (!growthForm.year || !growthForm.className || !growthForm.highestResult) {
      alert("Please fill year, class, and highest result.");
      return;
    }

    try {
      const payload = buildGrowthPayload(growthForm);
      if (editingGrowthId) {
        await api.put(`/content/${editingGrowthId}`, payload);
      } else {
        await api.post("/content", payload);
      }

      closeGrowthForm();
      fetchResults();
    } catch (error) {
      console.error(error);
      alert("Unable to save yearly growth right now.");
    }
  }

  async function savePerformer() {
    if (!performerForm.topperName || !performerForm.className || !performerForm.topperPercentage) {
      alert("Please fill performer name, class, and percentage.");
      return;
    }

    try {
      const payload = buildPerformerPayload(performerForm);
      if (editingPerformerId) {
        await api.put(`/content/${editingPerformerId}`, payload);
      } else {
        await api.post("/content", payload);
      }

      closePerformerForm();
      fetchResults();
    } catch (error) {
      console.error(error);
      alert("Unable to save star performer right now.");
    }
  }

  async function deleteResult(id, label = "entry") {
    if (!window.confirm(`Delete this ${label}?`)) return;

    try {
      await api.delete(`/content/${id}`);
      if (editingGrowthId === id) closeGrowthForm();
      if (editingPerformerId === id) closePerformerForm();
      fetchResults();
    } catch (error) {
      console.error(error);
      alert(`Unable to delete ${label} right now.`);
    }
  }

  async function handlePerformerImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPerformerForm((prev) => ({
        ...prev,
        imageUrl: res.data?.url || "",
        publicId: res.data?.publicId || "",
        resourceType: res.data?.resourceType || "",
      }));
    } catch (error) {
      console.error(error);
      alert("Unable to upload performer image right now.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 admin-theme:bg-slate-950 admin-theme:text-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 admin-theme:text-white">
          Academics Management
        </h1>
        <p className="mt-2 text-slate-600 admin-theme:text-slate-400">
          Manage yearly growth and star performers separately so the public results page stays clean.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <StatCard icon={<Award className="h-5 w-5 text-white" />} iconClass="bg-blue-500" value={stats.highestGrowth} label="Highest Result" />
        <StatCard icon={<BookOpen className="h-5 w-5 text-white" />} iconClass="bg-emerald-500" value={String(stats.yearlyEntries)} label="Yearly Growth Entries" />
        <StatCard icon={<Trophy className="h-5 w-5 text-white" />} iconClass="bg-purple-500" value={String(stats.starPerformers)} label="Star Performers" />
        <StatCard icon={<Award className="h-5 w-5 text-white" />} iconClass="bg-amber-500" value={stats.bestPerformerScore} label="Top Performer Score" />
      </div>

      <SectionCard
        title="Yearly Growth"
        description="Add one row per class/year with the highest result."
        actionLabel="Add Yearly Growth"
        onAction={openGrowthCreate}
      >
        {loading ? (
          <p className="p-6 text-slate-500 admin-theme:text-slate-400">Loading yearly growth...</p>
        ) : (
          <DataTable
            headers={["Year", "Class", "Highest Result", "Actions"]}
            emptyMessage="No yearly growth entries added yet."
            rows={growthRows.map((item) => ({
              key: item._id,
              cells: [
                item.meta?.year || "--",
                item.meta?.className || item.category || "--",
                `${Number(item.meta?.highestResult || item.meta?.passPercentage || 0).toFixed(1)}%`,
                <ActionButtons
                  key={`growth-actions-${item._id}`}
                  onEdit={() => openGrowthEdit(item)}
                  onDelete={() => deleteResult(item._id, "yearly growth entry")}
                />,
              ],
            }))}
          />
        )}
      </SectionCard>

      <div className="mt-8" />

      <SectionCard
        title="Star Performers"
        description="Add topper image, class, score, and stream for the public Star Performers section."
        actionLabel="Add Star Performer"
        onAction={openPerformerCreate}
      >
        {loading ? (
          <p className="p-6 text-slate-500 admin-theme:text-slate-400">Loading star performers...</p>
        ) : (
          <DataTable
            headers={["Image", "Performer", "Class", "Score", "Stream", "Actions"]}
            emptyMessage="No star performers added yet."
            rows={performerRows.map((item) => ({
              key: item._id,
              cells: [
                item.imageUrl ? (
                  <img
                    key={`performer-image-${item._id}`}
                    src={item.imageUrl}
                    alt={item.meta?.topperName || item.title}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                ) : (
                  "No image"
                ),
                item.meta?.topperName || item.title || "--",
                item.meta?.className || item.category || "--",
                item.meta?.topperPercentage
                  ? `${Number(item.meta.topperPercentage).toFixed(1)}%`
                  : "--",
                item.meta?.stream || "--",
                <ActionButtons
                  key={`performer-actions-${item._id}`}
                  onEdit={() => openPerformerEdit(item)}
                  onDelete={() => deleteResult(item._id, "star performer")}
                />,
              ],
            }))}
          />
        )}
      </SectionCard>

      {showGrowthForm ? (
        <ModalShell
          title={editingGrowthId ? "Edit Yearly Growth" : "Add Yearly Growth"}
          subtitle="This controls the Yearly Growth section on the public Results page."
          onClose={closeGrowthForm}
          onSave={saveGrowth}
          saveLabel={editingGrowthId ? "Update Growth" : "Save Growth"}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Year">
              <input
                value={growthForm.year}
                onChange={(e) => setGrowthForm((prev) => ({ ...prev, year: e.target.value }))}
                placeholder="2025-26"
                className={inputClass}
              />
            </Field>
            <Field label="Class">
              <input
                value={growthForm.className}
                onChange={(e) =>
                  setGrowthForm((prev) => ({ ...prev, className: e.target.value }))
                }
                placeholder="Class 10"
                className={inputClass}
              />
            </Field>
            <Field label="Highest Result">
              <input
                type="number"
                step="0.1"
                value={growthForm.highestResult}
                onChange={(e) =>
                  setGrowthForm((prev) => ({ ...prev, highestResult: e.target.value }))
                }
                placeholder="98.5"
                className={inputClass}
              />
            </Field>
          </div>
        </ModalShell>
      ) : null}

      {showPerformerForm ? (
        <ModalShell
          title={editingPerformerId ? "Edit Star Performer" : "Add Star Performer"}
          subtitle="This controls the Star Performers section on the public Results page."
          onClose={closePerformerForm}
          onSave={savePerformer}
          saveLabel={editingPerformerId ? "Update Performer" : "Save Performer"}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Performer Name">
              <input
                value={performerForm.topperName}
                onChange={(e) =>
                  setPerformerForm((prev) => ({ ...prev, topperName: e.target.value }))
                }
                placeholder="Aarav Sharma"
                className={inputClass}
              />
            </Field>
            <Field label="Class">
              <input
                value={performerForm.className}
                onChange={(e) =>
                  setPerformerForm((prev) => ({ ...prev, className: e.target.value }))
                }
                placeholder="Class XII Science"
                className={inputClass}
              />
            </Field>
            <Field label="Score Percentage">
              <input
                type="number"
                step="0.1"
                value={performerForm.topperPercentage}
                onChange={(e) =>
                  setPerformerForm((prev) => ({ ...prev, topperPercentage: e.target.value }))
                }
                placeholder="98.6"
                className={inputClass}
              />
            </Field>
            <Field label="Stream">
              <input
                value={performerForm.stream}
                onChange={(e) =>
                  setPerformerForm((prev) => ({ ...prev, stream: e.target.value }))
                }
                placeholder="Science"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Performer Image">
              <div className="rounded-2xl border border-slate-200 p-4 admin-theme:border-slate-700">
                <div className="flex flex-wrap items-center gap-4">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 admin-theme:border-slate-700 admin-theme:text-slate-200 admin-theme:hover:bg-slate-800">
                    <Upload className="h-4 w-4" />
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePerformerImageUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-sm text-slate-500 admin-theme:text-slate-400">
                    {performerForm.imageUrl ? "Image uploaded successfully" : "No image uploaded yet"}
                  </span>
                </div>

                {performerForm.imageUrl ? (
                  <img
                    src={performerForm.imageUrl}
                    alt="Star performer preview"
                    className="mt-4 h-40 w-full rounded-2xl object-cover md:w-56"
                  />
                ) : null}
              </div>
            </Field>
          </div>
        </ModalShell>
      ) : null}
    </div>
  );
}

function SectionCard({ title, description, actionLabel, onAction, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm admin-theme:border-slate-800 admin-theme:bg-slate-900">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between admin-theme:border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 admin-theme:text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-500 admin-theme:text-slate-400">{description}</p>
        </div>
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-xl bg-[#C3292D] px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#A01F23]"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </button>
      </div>
      {children}
    </div>
  );
}

function DataTable({ headers, rows, emptyMessage }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 admin-theme:bg-slate-950 admin-theme:text-slate-400">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-6 py-4">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 admin-theme:divide-slate-800">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-6 py-10 text-center text-slate-500 admin-theme:text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.key} className="transition hover:bg-slate-50 admin-theme:hover:bg-slate-800/40">
                {row.cells.map((cell, index) => (
                  <td key={`${row.key}-${index}`} className="px-6 py-4 text-slate-700 admin-theme:text-slate-200">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onEdit}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 admin-theme:border-slate-700 admin-theme:text-slate-200 admin-theme:hover:bg-slate-800"
      >
        <Pencil className="h-4 w-4" />
        Edit
      </button>
      <button
        onClick={onDelete}
        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 admin-theme:border-red-900/60 admin-theme:hover:bg-red-950/30"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </div>
  );
}

function ModalShell({ title, subtitle, children, onClose, onSave, saveLabel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl admin-theme:border-slate-800 admin-theme:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 p-6 admin-theme:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 admin-theme:text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-500 admin-theme:text-slate-400">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 admin-theme:border-slate-700 admin-theme:text-slate-300 admin-theme:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
        <div className="flex justify-end gap-3 border-t border-slate-200 p-6 admin-theme:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 admin-theme:border-slate-700 admin-theme:text-slate-200 admin-theme:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="rounded-xl bg-[#C3292D] px-5 py-2 font-semibold text-white transition hover:bg-[#A01F23]"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, iconClass, value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg admin-theme:border-slate-800 admin-theme:bg-slate-900">
      <div className={`mb-4 inline-flex rounded-2xl p-3 ${iconClass}`}>{icon}</div>
      <div className="text-3xl font-bold text-slate-900 admin-theme:text-white">{value}</div>
      <div className="mt-2 text-sm text-slate-600 admin-theme:text-slate-400">{label}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 admin-theme:text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#C3292D] focus:ring-2 focus:ring-[#C3292D]/20 admin-theme:border-slate-700 admin-theme:bg-slate-950 admin-theme:text-slate-100";
