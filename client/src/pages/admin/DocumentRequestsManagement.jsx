import { Check, FileText, Plus, Trash2, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const emptyType = {
  name: "",
  description: "",
};

export default function DocumentRequestsManagement() {
  const [requests, setRequests] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [newType, setNewType] = useState(emptyType);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [requestRes, typeRes] = await Promise.all([
        api.get("/document-requests"),
        api.get("/document-requests/types", { params: { all: true } }),
      ]);

      setRequests(Array.isArray(requestRes.data) ? requestRes.data : []);
      setDocumentTypes(Array.isArray(typeRes.data) ? typeRes.data : []);
    } catch (error) {
      console.error(error);
      setRequests([]);
      setDocumentTypes([]);
    } finally {
      setLoading(false);
    }
  }

  async function addDocumentType() {
    if (!newType.name.trim()) {
      alert("Document name is required");
      return;
    }

    try {
      await api.post("/document-requests/types", newType);
      setNewType(emptyType);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Unable to add document option");
    }
  }

  async function deleteDocumentType(id) {
    if (!window.confirm("Delete this document option?")) return;

    try {
      await api.delete(`/document-requests/types/${id}`);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Unable to delete document option");
    }
  }

  async function updateRequest(id, payload) {
    try {
      const res = await api.patch(`/document-requests/${id}`, payload);
      setRequests((current) =>
        current.map((item) => (item._id === id ? { ...item, ...res.data } : item))
      );
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to update request");
    }
  }

  async function approveRequest(request) {
    if (!request.fileUrl) {
      alert("Upload the approved document before approving this request.");
      return;
    }

    await updateRequest(request._id, { status: "approved" });
  }

  async function uploadApprovedFile(request, event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingId(request._id);
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await updateRequest(request._id, {
        status: "approved",
        fileUrl: res.data?.url || "",
        fileName: file.name,
        publicId: res.data?.publicId || "",
        resourceType: res.data?.resourceType || "",
      });
    } catch (error) {
      console.error(error);
      alert("Unable to upload approved document");
    } finally {
      setUploadingId(null);
      event.target.value = "";
    }
  }

  const stats = useMemo(
    () => ({
      pending: requests.filter((item) => item.status === "pending").length,
      approved: requests.filter((item) => item.status === "approved").length,
      rejected: requests.filter((item) => item.status === "rejected").length,
    }),
    [requests]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 admin-theme:bg-slate-950 admin-theme:text-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 admin-theme:text-white">
          Document Requests
        </h1>
        <p className="mt-2 text-slate-600 admin-theme:text-slate-400">
          Manage document options, approve student requests, and upload final files.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Approved" value={stats.approved} />
        <StatCard label="Rejected" value={stats.rejected} />
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm admin-theme:border-slate-800 admin-theme:bg-slate-900">
        <div className="border-b border-slate-200 p-6 admin-theme:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 admin-theme:text-white">
            Document Options
          </h2>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-[1fr_1fr_auto]">
          <input
            value={newType.name}
            onChange={(event) => setNewType((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Document name"
            className={inputClass}
          />
          <input
            value={newType.description}
            onChange={(event) =>
              setNewType((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Short description"
            className={inputClass}
          />
          <button
            onClick={addDocumentType}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C3292D] px-5 py-3 font-semibold text-white transition hover:bg-[#A01F23]"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        <div className="grid gap-3 px-6 pb-6 md:grid-cols-3">
          {documentTypes.map((type) => (
            <div
              key={type._id}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4 admin-theme:border-slate-800"
            >
              <div>
                <p className="font-semibold text-slate-900 admin-theme:text-white">{type.name}</p>
                <p className="text-sm text-slate-500 admin-theme:text-slate-400">
                  {type.description || "Available for student requests"}
                </p>
              </div>
              <button
                onClick={() => deleteDocumentType(type._id)}
                className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 admin-theme:hover:bg-red-950/30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm admin-theme:border-slate-800 admin-theme:bg-slate-900">
        <div className="border-b border-slate-200 p-6 admin-theme:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 admin-theme:text-white">
            Student Requests
          </h2>
        </div>

        {loading ? (
          <p className="p-6 text-slate-500 admin-theme:text-slate-400">Loading requests...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 admin-theme:bg-slate-950 admin-theme:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Reg. No</th>
                  <th className="px-6 py-4">Document</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">File</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 admin-theme:divide-slate-800">
                {requests.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-slate-500 admin-theme:text-slate-400"
                    >
                      No document requests yet.
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr
                      key={request._id}
                      className="transition hover:bg-slate-50 admin-theme:hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 admin-theme:text-white">
                          {request.studentName || request.student?.name || "-"}
                        </p>
                        <p className="text-sm text-slate-500 admin-theme:text-slate-400">
                          {request.className || request.student?.className || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-700 admin-theme:text-slate-200">
                        {request.registrationNo}
                      </td>
                      <td className="px-6 py-4 text-slate-700 admin-theme:text-slate-200">
                        {request.documentType}
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill status={request.status} />
                      </td>
                      <td className="px-6 py-4">
                        {request.fileUrl ? (
                          <a
                            href={request.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 font-semibold text-cyan-600"
                          >
                            <FileText className="h-4 w-4" />
                            {request.fileName || "View file"}
                          </a>
                        ) : (
                          <span className="text-slate-400">No file</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 admin-theme:border-slate-700 admin-theme:text-slate-200 admin-theme:hover:bg-slate-800">
                            <Upload className="h-4 w-4" />
                            {uploadingId === request._id ? "Uploading" : "Upload"}
                            <input
                              type="file"
                              onChange={(event) => uploadApprovedFile(request, event)}
                              className="hidden"
                            />
                          </label>
                          <button
                            onClick={() => approveRequest(request)}
                            className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-50"
                            title="Approve uploaded document"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updateRequest(request._id, { status: "rejected" })}
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm admin-theme:border-slate-800 admin-theme:bg-slate-900">
      <div className="text-3xl font-bold text-slate-900 admin-theme:text-white">{value}</div>
      <div className="mt-2 text-sm text-slate-600 admin-theme:text-slate-400">{label}</div>
    </div>
  );
}

function StatusPill({ status }) {
  const classes = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${classes[status] || classes.pending}`}
    >
      {status || "pending"}
    </span>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#C3292D] focus:ring-2 focus:ring-[#C3292D]/20 admin-theme:border-slate-700 admin-theme:bg-slate-950 admin-theme:text-slate-100";
