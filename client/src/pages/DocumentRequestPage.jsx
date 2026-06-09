import { Download, FileText, Search, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "../services/api";

const emptyForm = {
  registrationNo: "",
  dob: "",
  documentType: "",
  notes: "",
};

export default function DocumentRequestPage() {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [lookup, setLookup] = useState({ registrationNo: "", dob: "" });
  const [studentResult, setStudentResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const documentsSectionRef = useRef(null);

  useEffect(() => {
    async function fetchTypes() {
      try {
        const res = await api.get("/document-requests/types");
        const types = Array.isArray(res.data) ? res.data : [];
        setDocumentTypes(types);
        setForm((prev) => ({
          ...prev,
          documentType: prev.documentType || types[0]?.name || "",
        }));
      } catch (error) {
        console.error(error);
      }
    }

    fetchTypes();
  }, []);

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submitRequest(event) {
    event.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      await api.post("/document-requests/request", form);
      setMessage("Your document request has been submitted. Please check status below after admin approval.");
      setLookup({ registrationNo: form.registrationNo, dob: form.dob });
      setForm((prev) => ({
        ...emptyForm,
        registrationNo: prev.registrationNo,
        dob: prev.dob,
        documentType: documentTypes[0]?.name || "",
      }));
    } catch (error) {
      setMessage(error?.response?.data?.message || "Unable to submit request right now.");
    } finally {
      setLoading(false);
    }
  }

  async function checkStatus(event) {
    event.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      const res = await api.get("/document-requests/student", {
        params: lookup,
      });
      setStudentResult(res.data);
      window.setTimeout(() => {
        documentsSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
    } catch (error) {
      setStudentResult(null);
      setMessage(error?.response?.data?.message || "Unable to fetch documents right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-white text-slate-900">
      <section className="bg-slate-950 text-white">
        <div className="containerx py-16 md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200">
            <FileText size={16} />
            Student Documents
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Request And Download School Documents
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
            Enter your registration number and date of birth to request certificates,
            receipts, marksheets, and other approved school documents.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="containerx grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={submitRequest}
            className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-xl"
          >
            <h2 className="text-2xl font-black">Make A Document Request</h2>
            <div className="mt-6 grid gap-4">
              <Input
                label="Registration / Admission Number"
                value={form.registrationNo}
                onChange={(value) => updateForm("registrationNo", value)}
                placeholder="Enter student ID or admission number"
              />
              <Input
                label="Date Of Birth"
                type="date"
                value={form.dob}
                onChange={(value) => updateForm("dob", value)}
              />
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Document Type
                </span>
                <select
                  value={form.documentType}
                  onChange={(event) => updateForm("documentType", event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                >
                  {documentTypes.map((type) => (
                    <option key={type._id || type.name} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Notes
                </span>
                <textarea
                  value={form.notes}
                  onChange={(event) => updateForm("notes", event.target.value)}
                  placeholder="Optional message for admin"
                  className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </label>
            </div>

            <button
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 font-bold text-white shadow-xl transition hover:-translate-y-1 disabled:opacity-70"
            >
              <Send size={18} />
              {loading ? "Please wait..." : "Submit Request"}
            </button>
          </form>

          <form
            onSubmit={checkStatus}
            className="rounded-[28px] border border-slate-200 bg-slate-50 p-7 shadow-xl"
          >
            <h2 className="text-2xl font-black">Check Approved Documents</h2>
            <div className="mt-6 grid gap-4">
              <Input
                label="Registration / Admission Number"
                value={lookup.registrationNo}
                onChange={(value) =>
                  setLookup((prev) => ({ ...prev, registrationNo: value }))
                }
                placeholder="Enter student ID or admission number"
              />
              <Input
                label="Date Of Birth"
                type="date"
                value={lookup.dob}
                onChange={(value) => setLookup((prev) => ({ ...prev, dob: value }))}
              />
            </div>

            <button
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 font-bold text-white shadow-xl transition hover:-translate-y-1 disabled:opacity-70"
            >
              <Search size={18} />
              Check Status
            </button>

            {message ? (
              <p className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                {message}
              </p>
            ) : null}
          </form>
        </div>
      </section>

      {studentResult ? (
        <section ref={documentsSectionRef} className="scroll-mt-28 pb-20">
          <div className="containerx">
            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-xl">
              <h2 className="text-2xl font-black">
                Documents For {studentResult.student?.name}
              </h2>
              <div className="mt-6 grid gap-4">
                {(studentResult.requests || []).map((request) => (
                  <article
                    key={request._id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-bold">{request.documentType}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Status: <span className="font-semibold">{request.status}</span>
                      </p>
                      {request.adminNotes ? (
                        <p className="mt-2 text-sm text-slate-600">{request.adminNotes}</p>
                      ) : null}
                    </div>
                    {request.status === "approved" && request.fileUrl ? (
                      <a
                        href={request.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-600 px-5 py-3 font-bold text-white transition hover:-translate-y-1"
                      >
                        <Download size={16} />
                        Download
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function Input({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
      />
    </label>
  );
}
