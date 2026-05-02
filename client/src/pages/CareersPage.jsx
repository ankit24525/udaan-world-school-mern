import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Send,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { pageContent } from "./pageContent.js";
import { pickImage, splitLines, splitParagraphs } from "../utils/publicContent.js";

const fallbackPage = pageContent.careers;

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  qualification: "",
  experience: "",
  appliedRole: "",
  coverLetter: "",
  resumeUrl: "",
};

function formatDate(value) {
  if (!value) return "Immediate";
  return new Date(value).toLocaleDateString();
}

export default function CareersPage() {
  const [page, setPage] = useState(fallbackPage);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const [pageRes, jobsRes] = await Promise.all([
          api.get("/content", { params: { type: "page" } }),
          api.get("/content", { params: { type: "career", published: "true" } }),
        ]);

        if (!mounted) return;

        const dbPage = Array.isArray(pageRes.data)
          ? pageRes.data.find((item) => item.key === "careers" && item.published !== false)
          : null;
        const jobRows = Array.isArray(jobsRes.data) ? jobsRes.data.filter((item) => item.published !== false) : [];

        if (dbPage) {
          setPage({
            eyebrow: dbPage.eyebrow || fallbackPage.eyebrow,
            title: dbPage.title || fallbackPage.title,
            image: dbPage.imageUrl || fallbackPage.image,
            body: dbPage.body || fallbackPage.body,
            highlights:
              Array.isArray(dbPage.highlights) && dbPage.highlights.length
                ? dbPage.highlights
                : fallbackPage.highlights,
            meta: {
              ...(fallbackPage.meta || {}),
              ...(dbPage.meta || {}),
            },
          });
        } else {
          setPage(fallbackPage);
        }

        setJobs(jobRows);
      } catch (error) {
        console.error(error);
        if (mounted) {
          setPage(fallbackPage);
          setJobs([]);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const heroImage = pickImage(
    page.image,
    fallbackPage.image ||
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1400&auto=format&fit=crop"
  );
  const paragraphs = splitParagraphs(page.body, splitParagraphs(fallbackPage.body));
  const highlights = splitLines(page.highlights, fallbackPage.highlights || []);
  const openJobs = useMemo(
    () => jobs.filter((job) => (job.meta?.status || "Open") !== "Closed"),
    [jobs]
  );

  function startApplication(job) {
    setForm((prev) => ({
      ...prev,
      appliedRole: job?.title || prev.appliedRole,
    }));
    setStatusMessage("");
    const target = document.getElementById("career-application-form");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function uploadResume(file) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload", formData);
      setForm((prev) => ({ ...prev, resumeUrl: res.data.url }));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Resume upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function submitApplication(event) {
    event.preventDefault();

    if (!form.fullName || !form.email || !form.phone || !form.appliedRole || !form.resumeUrl) {
      alert("Please complete all required fields and upload the resume.");
      return;
    }

    const matchedJob = jobs.find((job) => job.title === form.appliedRole);

    setSubmitting(true);
    setStatusMessage("");

    try {
      await api.post("/enquiries", {
        type: "career",
        fullName: form.fullName,
        studentName: form.fullName,
        email: form.email,
        phone: form.phone,
        appliedRole: form.appliedRole,
        department: matchedJob?.category || "",
        qualification: form.qualification,
        experience: form.experience,
        resumeUrl: form.resumeUrl,
        coverLetter: form.coverLetter,
        message: form.coverLetter,
        jobId: matchedJob?._id || "",
        status: "new",
      });

      setForm(emptyForm);
      setStatusMessage("Application submitted successfully. The admin team can now review it in Staff & Careers.");
    } catch (error) {
      console.error(error);
      setStatusMessage("Unable to submit the application right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="overflow-hidden bg-white">
      <section className="relative flex min-h-[74vh] items-center bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-900 text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="containerx relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 font-semibold text-cyan-200">
            <BriefcaseBusiness size={16} />
            {page.eyebrow || "Careers"}
          </span>
          <h1 className="mt-6 text-5xl font-black md:text-7xl">{page.title}</h1>
          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-lg leading-8 text-white/90">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {highlights.map((item) => (
              <span key={item} className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="containerx grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="font-bold uppercase tracking-[3px] text-cyan-600">Current Openings</span>
            <h2 className="mt-4 text-5xl font-black text-slate-900">Join Our Teaching Team</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Whenever admin adds a new job opening in the Staff & Careers section, it appears here automatically.
            </p>
          </div>
          <div className="rounded-[30px] bg-slate-950 p-8 text-white shadow-2xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-700 text-white">
              <GraduationCap size={24} />
            </div>
            <h3 className="mt-5 text-3xl font-black">Why Teachers Apply Here</h3>
            <p className="mt-4 leading-8 text-white/75">
              Professional growth, supportive leadership, student-focused culture and a campus that values both discipline and creativity.
            </p>
          </div>
        </div>

        <div className="containerx mt-14 grid gap-8 lg:grid-cols-2">
          {openJobs.length ? (
            openJobs.map((job) => (
              <article key={job._id} className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900">{job.title}</h3>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[2px] text-cyan-700">
                      {job.category || "Teaching Department"}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    {job.meta?.status || "Open"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="font-semibold text-slate-900">Location</p>
                    <p>{job.location || "Baheri Campus"}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="font-semibold text-slate-900">Type</p>
                    <p>{job.meta?.employmentType || "Full Time"}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="font-semibold text-slate-900">Posted</p>
                    <p>{formatDate(job.createdAt)}</p>
                  </div>
                </div>

                {job.excerpt ? (
                  <p className="mt-6 text-lg leading-8 text-slate-600">{job.excerpt}</p>
                ) : null}

                {job.body ? (
                  <div className="mt-4 whitespace-pre-line text-slate-600">{job.body}</div>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  {job.meta?.experience ? <span className="rounded-full bg-cyan-50 px-3 py-2">Experience: {job.meta.experience}</span> : null}
                  {job.meta?.salary ? <span className="rounded-full bg-cyan-50 px-3 py-2">Salary: {job.meta.salary}</span> : null}
                </div>

                <button
                  onClick={() => startApplication(job)}
                  className="mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-700 px-7 py-4 font-bold text-white"
                >
                  Apply For This Job
                  <ArrowRight size={18} />
                </button>
              </article>
            ))
          ) : (
            <div className="rounded-[30px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 lg:col-span-2">
              No active career openings right now. Admin can publish openings from Staff & Careers.
            </div>
          )}
        </div>
      </section>

      <section id="career-application-form" className="bg-slate-950 py-24 text-white">
        <div className="containerx grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="font-bold uppercase tracking-[3px] text-cyan-300">Teacher Application</span>
            <h2 className="mt-4 text-5xl font-black">Apply With Confidence</h2>
            <p className="mt-6 text-lg leading-8 text-white/75">
              Submit your profile, qualification details and resume. Admin will receive this application in the Staff & Careers dashboard.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 text-cyan-300" size={20} />
                <p className="text-white/75">Choose the exact job opening you want to apply for.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 text-cyan-300" size={20} />
                <p className="text-white/75">Upload your resume once and it becomes visible to admin instantly.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 text-cyan-300" size={20} />
                <p className="text-white/75">Admin can shortlist, hire or reject applicants directly from the dashboard.</p>
              </div>
            </div>
          </div>

          <form onSubmit={submitApplication} className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.fullName}
                onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="Full Name *"
                className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/45"
              />
              <input
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email *"
                className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/45"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone *"
                className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/45"
              />
              <select
                value={form.appliedRole}
                onChange={(e) => setForm((prev) => ({ ...prev, appliedRole: e.target.value }))}
                className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white"
              >
                <option value="" className="text-slate-900">Select Job Opening *</option>
                {openJobs.map((job) => (
                  <option key={job._id} value={job.title} className="text-slate-900">
                    {job.title}
                  </option>
                ))}
              </select>
              <input
                value={form.qualification}
                onChange={(e) => setForm((prev) => ({ ...prev, qualification: e.target.value }))}
                placeholder="Qualification"
                className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/45"
              />
              <input
                value={form.experience}
                onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))}
                placeholder="Experience"
                className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/45"
              />
            </div>

            <textarea
              value={form.coverLetter}
              onChange={(e) => setForm((prev) => ({ ...prev, coverLetter: e.target.value }))}
              placeholder="Why do you want to join Udaan World School?"
              className="mt-4 h-32 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/45"
            />

            <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">Resume Upload *</p>
                  <p className="text-sm text-white/60">Upload PDF, DOC or image file for admin review.</p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                  <Upload size={16} />
                  {uploading ? "Uploading..." : "Upload Resume"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      await uploadResume(file);
                      event.target.value = "";
                    }}
                  />
                </label>
              </div>
              {form.resumeUrl ? (
                <a href={form.resumeUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-cyan-300">
                  <MapPin size={14} />
                  View uploaded resume
                </a>
              ) : null}
            </div>

            {statusMessage ? (
              <div className="mt-4 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                {statusMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-700 px-8 py-4 font-bold text-white"
            >
              {submitting ? "Submitting..." : "Submit Application"}
              <Send size={18} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
