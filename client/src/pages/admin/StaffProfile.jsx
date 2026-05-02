import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, Calendar, Download, Mail, Phone, Upload, User, Users } from "lucide-react";
import api from "../../services/api";

const defaultMeta = {
  role: "",
  department: "",
  qualification: "",
  experience: "",
  phone: "",
  email: "",
  joinDate: "",
  resumeUrl: "",
  status: "Active",
};

export default function StaffProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const photoInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [staff, setStaff] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, [id]);

  async function fetchStaff() {
    try {
      const res = await api.get(`/content/id/${id}`);
      setStaff({
        ...res.data,
        meta: { ...defaultMeta, ...(res.data.meta || {}) },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function uploadAsset(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/upload", formData);
    return res.data.url;
  }

  async function updateStaff(payload, successMessage) {
    const res = await api.put(`/content/${id}`, payload);
    setStaff({ ...res.data, meta: { ...defaultMeta, ...(res.data.meta || {}) } });
    if (successMessage) alert(successMessage);
  }

  function updateField(field, value) {
    setStaff((prev) => ({ ...prev, [field]: value }));
  }

  function updateMeta(field, value) {
    setStaff((prev) => ({
      ...prev,
      meta: {
        ...defaultMeta,
        ...(prev.meta || {}),
        [field]: value,
      },
    }));
  }

  async function saveProfile() {
    await updateStaff(
      {
        type: "staffMember",
        title: staff.title,
        excerpt: staff.excerpt,
        body: staff.body,
        imageUrl: staff.imageUrl,
        published: staff.published ?? true,
        meta: staff.meta,
      },
      "Staff profile updated"
    );
  }

  async function handlePhotoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const imageUrl = await uploadAsset(file);
      await updateStaff(
        {
          ...staff,
          imageUrl,
        },
        "Staff photo updated"
      );
    } catch (error) {
      console.error(error);
      alert("Unable to upload staff photo");
    } finally {
      setUploadingPhoto(false);
      event.target.value = "";
    }
  }

  async function handleResumeUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      const resumeUrl = await uploadAsset(file);
      await updateStaff(
        {
          type: "staffMember",
          title: staff.title,
          excerpt: staff.excerpt,
          body: staff.body,
          imageUrl: staff.imageUrl,
          published: staff.published ?? true,
          meta: {
            ...staff.meta,
            resumeUrl,
          },
        },
        "Resume updated"
      );
    } catch (error) {
      console.error(error);
      alert("Unable to upload resume");
    } finally {
      setUploadingResume(false);
      event.target.value = "";
    }
  }

  if (!staff) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <input ref={photoInputRef} type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
      <input ref={resumeInputRef} type="file" hidden onChange={handleResumeUpload} />

      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Back to Staff
      </button>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-shrink-0">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg bg-gray-200">
                {staff.imageUrl ? (
                  <img src={staff.imageUrl} alt={staff.title} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-gray-400" />
                )}
              </div>

              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
              >
                <Upload className="h-3 w-3" />
                {uploadingPhoto ? "Uploading..." : "Upload Photo"}
              </button>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{staff.title || "Staff Member"}</h1>
              <p className="mt-1 text-gray-600">{staff.meta.role || "Teacher"}</p>

              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                <InfoCard label="Department" value={staff.meta.department || "N/A"} />
                <InfoCard label="Experience" value={staff.meta.experience || "N/A"} />
                <InfoCard label="Join Date" value={staff.meta.joinDate || "N/A"} />
                <InfoCard label="Status" value={staff.meta.status || "Active"} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Basic Information">
          <EditableRow label="Full Name" value={staff.title || ""} onChange={(value) => updateField("title", value)} />
          <EditableRow label="Role" value={staff.meta.role || ""} onChange={(value) => updateMeta("role", value)} />
          <EditableRow label="Department" value={staff.meta.department || ""} onChange={(value) => updateMeta("department", value)} />
          <EditableRow label="Qualification" value={staff.meta.qualification || ""} onChange={(value) => updateMeta("qualification", value)} />
          <EditableRow label="Experience" value={staff.meta.experience || ""} onChange={(value) => updateMeta("experience", value)} />
          <EditableRow label="Join Date" value={staff.meta.joinDate || ""} onChange={(value) => updateMeta("joinDate", value)} />
          <EditableRow label="Status" value={staff.meta.status || "Active"} onChange={(value) => updateMeta("status", value)} />
        </SectionCard>

        <SectionCard title="Contact & Profile">
          <EditableRow label="Phone" value={staff.meta.phone || ""} onChange={(value) => updateMeta("phone", value)} />
          <EditableRow label="Email" value={staff.meta.email || ""} onChange={(value) => updateMeta("email", value)} />
          <EditableTextArea label="Short Intro" value={staff.excerpt || ""} onChange={(value) => updateField("excerpt", value)} />
          <EditableTextArea label="Full Profile" value={staff.body || ""} onChange={(value) => updateField("body", value)} rows={6} />

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => resumeInputRef.current?.click()}
              disabled={uploadingResume}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
            >
              {uploadingResume ? "Uploading Resume..." : "Upload Resume"}
            </button>
            {staff.meta.resumeUrl ? (
              <a href={staff.meta.resumeUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
                View Resume
              </a>
            ) : null}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={saveProfile} className="rounded-lg bg-[#C3292D] px-5 py-3 text-white hover:bg-[#A01F23]">
          Save Staff Profile
        </button>
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function EditableRow({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-gray-600">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2" />
    </label>
  );
}

function EditableTextArea({ label, value, onChange, rows = 3 }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-gray-600">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full rounded-lg border border-gray-200 px-3 py-2" />
    </label>
  );
}

function InfoCard({ label, value }) {
  const iconMap = {
    Department: Briefcase,
    Experience: Users,
    "Join Date": Calendar,
    Status: User,
  };
  const Icon = iconMap[label] || User;

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-gray-500">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}
