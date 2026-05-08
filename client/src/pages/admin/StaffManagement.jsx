import { Briefcase, Check, Eye, Pencil, Plus, Search, Trash2, Upload, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const emptyJobForm = {
  title: "",
  category: "Academics",
  location: "Baheri Campus",
  employmentType: "Full Time",
  experience: "",
  salary: "",
  excerpt: "",
  body: "",
  published: true,
  status: "Open",
};

const emptyStaffForm = {
  title: "",
  excerpt: "",
  body: "",
  imageUrl: "",
  role: "Teacher",
  department: "Academics",
  qualification: "",
  experience: "",
  phone: "",
  email: "",
  joinDate: "",
  status: "Active",
  published: true,
};

function slugify(value = "") {
  return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function formatStatusLabel(value = "") {
  return String(value).replace(/_/g, " ");
}

function statusBadgeClass(status = "") {
  switch (status) {
    case "hired":
    case "approved":
    case "active":
    case "Active":
      return "bg-green-100 text-green-700";
    case "shortlisted":
    case "interview_scheduled":
      return "bg-blue-100 text-blue-700";
    case "rejected":
    case "closed":
    case "Inactive":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function StaffManagement() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("staff");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [jobEditorOpen, setJobEditorOpen] = useState(false);
  const [staffEditorOpen, setStaffEditorOpen] = useState(false);
  const [savingJob, setSavingJob] = useState(false);
  const [savingStaff, setSavingStaff] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [jobForm, setJobForm] = useState(emptyJobForm);
  const [staffForm, setStaffForm] = useState(emptyStaffForm);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [jobsRes, enquiriesRes, staffRes] = await Promise.all([
        api.get("/content", { params: { type: "career" } }),
        api.get("/enquiries"),
        api.get("/content", { params: { type: "staffMember" } }),
      ]);

      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      setStaffMembers(Array.isArray(staffRes.data) ? staffRes.data : []);
      setApplications(Array.isArray(enquiriesRes.data) ? enquiriesRes.data.filter((item) => item.type === "career") : []);
    } catch (error) {
      console.error(error);
    }
  }

  const pendingApplications = useMemo(
    () => applications.filter((item) => ["new", "under_review", "shortlisted", "interview_scheduled"].includes(item.status)),
    [applications]
  );
  const openJobs = useMemo(
    () => jobs.filter((job) => (job.meta?.status || "Open") !== "Closed" && job.published !== false),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return jobs;
    return jobs.filter((job) =>
      [job.title, job.category, job.location, job.meta?.employmentType, job.meta?.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [jobs, search]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return applications;
    return applications.filter((application) =>
      [application.applicationId, application.fullName, application.studentName, application.appliedRole, application.email, application.phone, application.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [applications, search]);

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return staffMembers;
    return staffMembers.filter((item) =>
      [item.title, item.meta?.role, item.meta?.department, item.meta?.qualification, item.meta?.email, item.meta?.phone]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [staffMembers, search]);

  function openCreateJob() {
    setEditingJob(null);
    setJobForm(emptyJobForm);
    setJobEditorOpen(true);
  }

  function openEditJob(job) {
    setEditingJob(job);
    setJobForm({
      title: job.title || "",
      category: job.category || "Academics",
      location: job.location || "Baheri Campus",
      employmentType: job.meta?.employmentType || "Full Time",
      experience: job.meta?.experience || "",
      salary: job.meta?.salary || "",
      excerpt: job.excerpt || "",
      body: job.body || "",
      published: job.published ?? true,
      status: job.meta?.status || "Open",
    });
    setJobEditorOpen(true);
  }

  function closeJobEditor() {
    setEditingJob(null);
    setJobForm(emptyJobForm);
    setJobEditorOpen(false);
  }

  function openCreateStaff() {
    setEditingStaff(null);
    setStaffForm(emptyStaffForm);
    setStaffEditorOpen(true);
  }

  function openEditStaff(member) {
    setEditingStaff(member);
    setStaffForm({
      title: member.title || "",
      excerpt: member.excerpt || "",
      body: member.body || "",
      imageUrl: member.imageUrl || "",
      role: member.meta?.role || "Teacher",
      department: member.meta?.department || "Academics",
      qualification: member.meta?.qualification || "",
      experience: member.meta?.experience || "",
      phone: member.meta?.phone || "",
      email: member.meta?.email || "",
      joinDate: member.meta?.joinDate || "",
      status: member.meta?.status || "Active",
      published: member.published ?? true,
    });
    setStaffEditorOpen(true);
  }

  function closeStaffEditor() {
    setEditingStaff(null);
    setStaffForm(emptyStaffForm);
    setStaffEditorOpen(false);
  }

  async function saveJob() {
    if (!jobForm.title.trim()) {
      alert("Job title is required");
      return;
    }

    setSavingJob(true);
    const payload = {
      type: "career",
      title: jobForm.title.trim(),
      slug: slugify(jobForm.title),
      category: jobForm.category,
      location: jobForm.location,
      excerpt: jobForm.excerpt,
      body: jobForm.body,
      published: jobForm.published,
      meta: {
        ...(editingJob?.meta || {}),
        employmentType: jobForm.employmentType,
        experience: jobForm.experience,
        salary: jobForm.salary,
        status: jobForm.status,
      },
    };

    try {
      if (editingJob?._id) {
        await api.put(`/content/${editingJob._id}`, payload);
      } else {
        await api.post("/content", payload);
      }
      closeJobEditor();
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Unable to save job opening");
    } finally {
      setSavingJob(false);
    }
  }

  async function saveStaff() {
    if (!staffForm.title.trim()) {
      alert("Staff name is required");
      return;
    }

    setSavingStaff(true);
    const payload = {
      type: "staffMember",
      title: staffForm.title.trim(),
      slug: slugify(staffForm.title),
      excerpt: staffForm.excerpt,
      body: staffForm.body,
      imageUrl: staffForm.imageUrl,
      published: staffForm.published,
      meta: {
        role: staffForm.role,
        department: staffForm.department,
        qualification: staffForm.qualification,
        experience: staffForm.experience,
        phone: staffForm.phone,
        email: staffForm.email,
        joinDate: staffForm.joinDate,
        status: staffForm.status,
      },
    };

    try {
      if (editingStaff?._id) {
        await api.put(`/content/${editingStaff._id}`, payload);
      } else {
        const res = await api.post("/content", payload);
        if (res.data?._id) navigate(`/admin/staff/${res.data._id}`);
      }
      closeStaffEditor();
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Unable to save staff member");
    } finally {
      setSavingStaff(false);
    }
  }

  async function deleteJob(job) {
    if (!window.confirm("Delete this job opening?")) return;
    await api.delete(`/content/${job._id}`);
    fetchData();
  }

  async function deleteStaff(member) {
    if (!window.confirm("Delete this staff member?")) return;
    await api.delete(`/content/${member._id}`);
    fetchData();
  }

  async function updateApplicationStatus(id, status) {
    try {
      await api.patch(`/enquiries/${id}/status`, { status });
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Unable to update application status");
    }
  }

  async function deleteApplication(id) {
    if (!window.confirm("Delete this teacher application?")) return;
    await api.delete(`/enquiries/${id}`);
    setSelectedApplication(null);
    fetchData();
  }

  async function uploadStaffImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/upload", formData);
      setStaffForm((prev) => ({ ...prev, imageUrl: res.data.url }));
    } catch (error) {
      console.error(error);
      alert("Unable to upload staff image");
    } finally {
      event.target.value = "";
    }
  }

  const tabLabelClass = (value) => `pb-4 flex items-center gap-2 border-b-2 ${tab === value ? "border-[#C3292D] text-[#C3292D]" : "border-transparent text-gray-600"}`;

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-[#0b1120]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Staff & Careers</h1>
        <p className="mt-2 text-gray-600 dark:text-slate-400">Manage manual staff profiles, live job openings and teacher applications from one place.</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <SummaryCard label="Staff Members" value={staffMembers.length} />
        <SummaryCard label="Job Openings" value={jobs.length} />
        <SummaryCard label="Open Positions" value={openJobs.length} />
        <SummaryCard label="Pending Applications" value={pendingApplications.length} />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20">
        <div className="flex gap-6 border-b border-slate-200 px-6 pt-4 dark:border-white/10">
          <button onClick={() => setTab("staff")} className={tabLabelClass("staff")}>
            <Users size={16} /> Staff Members
          </button>
          <button onClick={() => setTab("openings")} className={tabLabelClass("openings")}>
            <Briefcase size={16} /> Career Openings
          </button>
          <button onClick={() => setTab("applications")} className={tabLabelClass("applications")}>
            <Users size={16} /> Applied Teachers
          </button>
        </div>

        <div className="border-b border-slate-200 p-6 dark:border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-slate-500" size={18} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staff, jobs or applicants..." className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-400" />
            </div>

            {tab === "openings" ? (
              <button onClick={openCreateJob} className="inline-flex items-center gap-2 rounded-lg bg-[#C3292D] px-4 py-2 text-white">
                <Plus size={16} /> Add Job Opening
              </button>
            ) : null}

            {tab === "staff" ? (
              <button onClick={openCreateStaff} className="inline-flex items-center gap-2 rounded-lg bg-[#C3292D] px-4 py-2 text-white">
                <Plus size={16} /> Add Staff Member
              </button>
            ) : null}
          </div>
        </div>

        <div className="overflow-x-auto">
          {tab === "staff" ? (
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-white/5 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Qualification</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStaff.map((staff) => (
                  <tr key={staff._id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{staff.title}</td>
                    <td className="px-6 py-4">{staff.meta?.role || "Teacher"}</td>
                    <td className="px-6 py-4">{staff.meta?.department || "Academics"}</td>
                    <td className="px-6 py-4">{staff.meta?.qualification || "-"}</td>
                    <td className="px-6 py-4 text-sm">
                      <div>{staff.meta?.phone || "-"}</div>
                      <div className="text-slate-500 dark:text-slate-400">{staff.meta?.email || "-"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/admin/staff/${staff._id}`)} className="rounded p-2 text-blue-600 hover:bg-blue-50"><Eye size={16} /></button>
                        <button onClick={() => openEditStaff(staff)} className="rounded p-2 text-slate-700 hover:bg-slate-100"><Pencil size={16} /></button>
                        <button onClick={() => deleteStaff(staff)} className="rounded p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {tab === "openings" ? (
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-white/5 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3">Job Title</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="px-6 py-4"><div className="font-medium text-slate-900 dark:text-white">{job.title}</div><div className="text-sm text-slate-500 dark:text-slate-400">{job.excerpt}</div></td>
                    <td className="px-6 py-4">{job.category || "Academics"}</td>
                    <td className="px-6 py-4">{job.location || "Baheri Campus"}</td>
                    <td className="px-6 py-4">{job.meta?.employmentType || "Full Time"}</td>
                    <td className="px-6 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadgeClass(job.meta?.status)}`}>{job.meta?.status || "Open"}</span></td>
                    <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => openEditJob(job)} className="rounded p-2 text-blue-600 hover:bg-blue-50"><Eye size={16} /></button><button onClick={() => openEditJob(job)} className="rounded p-2 text-slate-700 hover:bg-slate-100"><Check size={16} /></button><button onClick={() => deleteJob(job)} className="rounded p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {tab === "applications" ? (
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-white/5 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3">Application ID</th>
                  <th className="px-6 py-3">Applicant</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Qualification</th>
                  <th className="px-6 py-3">Resume</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredApplications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="px-6 py-4 font-medium">{application.applicationId}</td>
                    <td className="px-6 py-4"><div className="font-medium text-slate-900 dark:text-white">{application.fullName || application.studentName}</div><div className="text-sm text-slate-500 dark:text-slate-400">{application.email} · {application.phone}</div></td>
                    <td className="px-6 py-4">{application.appliedRole || "Teacher"}</td>
                    <td className="px-6 py-4">{application.qualification || "-"}</td>
                    <td className="px-6 py-4">{application.resumeUrl ? <a href={application.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Resume</a> : <span className="text-slate-400">No file</span>}</td>
                    <td className="px-6 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadgeClass(application.status)}`}>{formatStatusLabel(application.status)}</span></td>
                    <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => setSelectedApplication(application)} className="rounded p-2 text-blue-600 hover:bg-blue-50"><Eye size={16} /></button><button onClick={() => updateApplicationStatus(application._id, "shortlisted")} className="rounded p-2 text-slate-700 hover:bg-slate-100"><Check size={16} /></button><button onClick={() => updateApplicationStatus(application._id, "hired")} className="rounded p-2 text-green-600 hover:bg-green-50"><Users size={16} /></button><button onClick={() => updateApplicationStatus(application._id, "rejected")} className="rounded p-2 text-red-600 hover:bg-red-50"><X size={16} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>

      {staffEditorOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl dark:bg-slate-950 dark:shadow-black/40">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editingStaff ? "Edit Staff Member" : "Add Staff Member"}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Create a real staff profile that can open like a student profile.</p>
              </div>
              <button onClick={closeStaffEditor} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <input value={staffForm.title} onChange={(e) => setStaffForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Full name" className="rounded-lg border px-4 py-3" />
              <input value={staffForm.role} onChange={(e) => setStaffForm((prev) => ({ ...prev, role: e.target.value }))} placeholder="Role" className="rounded-lg border px-4 py-3" />
              <input value={staffForm.department} onChange={(e) => setStaffForm((prev) => ({ ...prev, department: e.target.value }))} placeholder="Department" className="rounded-lg border px-4 py-3" />
              <input value={staffForm.qualification} onChange={(e) => setStaffForm((prev) => ({ ...prev, qualification: e.target.value }))} placeholder="Qualification" className="rounded-lg border px-4 py-3" />
              <input value={staffForm.experience} onChange={(e) => setStaffForm((prev) => ({ ...prev, experience: e.target.value }))} placeholder="Experience" className="rounded-lg border px-4 py-3" />
              <input value={staffForm.joinDate} onChange={(e) => setStaffForm((prev) => ({ ...prev, joinDate: e.target.value }))} placeholder="Join date" className="rounded-lg border px-4 py-3" />
              <input value={staffForm.phone} onChange={(e) => setStaffForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone" className="rounded-lg border px-4 py-3" />
              <input value={staffForm.email} onChange={(e) => setStaffForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" className="rounded-lg border px-4 py-3" />
              <input value={staffForm.status} onChange={(e) => setStaffForm((prev) => ({ ...prev, status: e.target.value }))} placeholder="Status" className="rounded-lg border px-4 py-3" />
              <label className="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" checked={staffForm.published} onChange={(e) => setStaffForm((prev) => ({ ...prev, published: e.target.checked }))} />
                Publish this staff member
              </label>
              <textarea value={staffForm.excerpt} onChange={(e) => setStaffForm((prev) => ({ ...prev, excerpt: e.target.value }))} placeholder="Short intro" className="h-24 rounded-lg border px-4 py-3 md:col-span-2" />
              <textarea value={staffForm.body} onChange={(e) => setStaffForm((prev) => ({ ...prev, body: e.target.value }))} placeholder="Detailed profile" className="h-32 rounded-lg border px-4 py-3 md:col-span-2" />
                <div className="md:col-span-2 rounded-lg border border-slate-200 p-4 dark:border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Profile Image</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Upload a teacher photo for admin and public pages.</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#C3292D] px-4 py-2 text-sm font-medium text-white">
                    <Upload size={14} /> Upload
                    <input type="file" hidden accept="image/*" onChange={uploadStaffImage} />
                  </label>
                </div>
                {staffForm.imageUrl ? <img src={staffForm.imageUrl} alt="staff" className="mt-4 h-48 w-full rounded-2xl object-cover" /> : null}
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-white/10">
              <button onClick={closeStaffEditor} className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">Cancel</button>
              <button onClick={saveStaff} disabled={savingStaff} className="rounded-lg bg-[#C3292D] px-4 py-2 text-white disabled:opacity-60">{savingStaff ? "Saving..." : editingStaff ? "Save Changes" : "Create Staff Member"}</button>
            </div>
          </div>
        </div>
      ) : null}

      {jobEditorOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-950 dark:shadow-black/40">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editingJob ? "Edit Job Opening" : "Add Job Opening"}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">This opening will appear on the public careers page.</p>
              </div>
              <button onClick={closeJobEditor} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <input value={jobForm.title} onChange={(e) => setJobForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Job title" className="rounded-lg border px-4 py-3" />
              <input value={jobForm.category} onChange={(e) => setJobForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Department" className="rounded-lg border px-4 py-3" />
              <input value={jobForm.location} onChange={(e) => setJobForm((prev) => ({ ...prev, location: e.target.value }))} placeholder="Location" className="rounded-lg border px-4 py-3" />
              <input value={jobForm.employmentType} onChange={(e) => setJobForm((prev) => ({ ...prev, employmentType: e.target.value }))} placeholder="Employment type" className="rounded-lg border px-4 py-3" />
              <input value={jobForm.experience} onChange={(e) => setJobForm((prev) => ({ ...prev, experience: e.target.value }))} placeholder="Experience required" className="rounded-lg border px-4 py-3" />
              <input value={jobForm.salary} onChange={(e) => setJobForm((prev) => ({ ...prev, salary: e.target.value }))} placeholder="Salary / package" className="rounded-lg border px-4 py-3" />
              <select value={jobForm.status} onChange={(e) => setJobForm((prev) => ({ ...prev, status: e.target.value }))} className="rounded-lg border px-4 py-3"><option value="Open">Open</option><option value="Closed">Closed</option></select>
              <label className="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm text-slate-700"><input type="checkbox" checked={jobForm.published} onChange={(e) => setJobForm((prev) => ({ ...prev, published: e.target.checked }))} /> Publish this opening</label>
              <textarea value={jobForm.excerpt} onChange={(e) => setJobForm((prev) => ({ ...prev, excerpt: e.target.value }))} placeholder="Short description" className="h-28 rounded-lg border px-4 py-3 md:col-span-2" />
              <textarea value={jobForm.body} onChange={(e) => setJobForm((prev) => ({ ...prev, body: e.target.value }))} placeholder="Detailed job description" className="h-40 rounded-lg border px-4 py-3 md:col-span-2" />
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-white/10"><button onClick={closeJobEditor} className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">Cancel</button><button onClick={saveJob} disabled={savingJob} className="rounded-lg bg-[#C3292D] px-4 py-2 text-white disabled:opacity-60">{savingJob ? "Saving..." : editingJob ? "Save Changes" : "Create Opening"}</button></div>
          </div>
        </div>
      ) : null}

      {selectedApplication ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-950 dark:shadow-black/40">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedApplication.fullName || selectedApplication.studentName}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedApplication.applicationId} · {selectedApplication.appliedRole || "Teacher"}</p>
              </div>
              <button onClick={() => setSelectedApplication(null)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-4 p-6 text-sm text-slate-700 dark:text-slate-300">
              <DetailRow label="Email" value={selectedApplication.email} />
              <DetailRow label="Phone" value={selectedApplication.phone} />
              <DetailRow label="Qualification" value={selectedApplication.qualification} />
              <DetailRow label="Experience" value={selectedApplication.experience} />
              <DetailRow label="Status" value={formatStatusLabel(selectedApplication.status)} />
              <DetailRow label="Cover Letter" value={selectedApplication.coverLetter || selectedApplication.message} multiline />
              <DetailRow label="Resume" value={selectedApplication.resumeUrl} link />
            </div>
            <div className="flex justify-between gap-3 border-t border-slate-200 px-6 py-4 dark:border-white/10"><button onClick={() => deleteApplication(selectedApplication._id)} className="rounded-lg border border-red-200 px-4 py-2 text-red-600">Delete</button><div className="flex gap-3"><button onClick={() => updateApplicationStatus(selectedApplication._id, "shortlisted")} className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">Shortlist</button><button onClick={() => updateApplicationStatus(selectedApplication._id, "hired")} className="rounded-lg bg-[#C3292D] px-4 py-2 text-white">Move To Staff</button></div></div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SummaryCard({ label, value }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20"><h2 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h2><p className="text-gray-600 dark:text-slate-400">{label}</p></div>;
}

function DetailRow({ label, value, multiline = false, link = false }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      {link && value ? <a href={value} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-blue-600 hover:underline">View File</a> : multiline ? <p className="mt-2 whitespace-pre-line text-slate-800 dark:text-slate-100">{value || "-"}</p> : <p className="mt-2 text-slate-800 dark:text-slate-100">{value || "-"}</p>}
    </div>
  );
}
