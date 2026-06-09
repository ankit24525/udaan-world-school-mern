import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  DollarSign,
  Download,
  Edit,
  Trash2,
  FileText,
  Heart,
  Mail,
  MapPin,
  Phone,
  Upload,
  User,
  Users,
} from "lucide-react";
import api from "../../services/api";

const tabs = [
  { key: "overview", label: "Overview", icon: User },
  { key: "academic", label: "Academic", icon: BookOpen },
  { key: "attendance", label: "Attendance", icon: Calendar },
  { key: "fees", label: "Fees", icon: DollarSign },
  { key: "guardian", label: "Guardian", icon: Users },
  { key: "medical", label: "Medical", icon: Heart },
  { key: "activities", label: "Activities", icon: Award },
  { key: "documents", label: "Documents", icon: FileText },
];

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const photoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const [student, setStudent] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  useEffect(() => {
    fetchStudent();
    fetchDocumentTypes();
  }, [id]);

  async function fetchStudent() {
    try {
      const res = await api.get(`/students/${id}`);
      setStudent(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchDocumentTypes() {
    try {
      const res = await api.get("/document-requests/types", { params: { all: true } });
      const types = Array.isArray(res.data) ? res.data : [];
      setDocumentTypes(types);
      setSelectedDocumentType((current) => current || types[0]?.name || "");
    } catch (err) {
      console.error(err);
      setDocumentTypes([]);
    }
  }

  async function uploadAsset(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  async function updateStudent(payload, successMessage) {
    const res = await api.put(`/students/${student._id}`, payload);
    setStudent(res.data);
    if (successMessage) alert(successMessage);
    return res.data;
  }

  async function handlePhotoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const uploaded = await uploadAsset(file);
      await updateStudent({ photo: uploaded?.url || "" }, "Profile photo updated");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to upload student photo");
    } finally {
      setUploadingPhoto(false);
      event.target.value = "";
    }
  }

  async function handleDocumentUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingDocument(true);
    try {
      if (!selectedDocumentType) {
        alert("Please select a document option before uploading.");
        return;
      }

      const uploaded = await uploadAsset(file);
      const res = await api.post(`/students/${student._id}/documents`, {
        name: file.name,
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        date: new Date().toISOString().slice(0, 10),
        type: selectedDocumentType,
        fileUrl: uploaded?.url || "",
        publicId: uploaded?.publicId || "",
        resourceType: uploaded?.resourceType || "",
        source: "Admin Upload",
      });

      setStudent(res.data);
      alert("Document uploaded");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to upload document");
    } finally {
      setUploadingDocument(false);
      event.target.value = "";
    }
  }

  async function removeDocument(document, index) {
    if (!window.confirm("Remove this document from the student profile?")) return;

    if (document?._id) {
      const res = await api.delete(`/students/${student._id}/documents/${document._id}`);
      setStudent(res.data);
      alert("Document removed");
      return;
    }

    const nextDocuments = (student.documents || []).filter((_, docIndex) => docIndex !== index);
    await updateStudent({ documents: nextDocuments }, "Document removed");
  }
  async function saveOverview() {
    await updateStudent(
      {
        name: student.name,
        email: student.email,
        phone: student.phone,
        address: student.address,
        dob: student.dob,
        gender: student.gender,
        bloodGroup: student.bloodGroup,
        religion: student.religion,
        nationality: student.nationality,
      },
      "Overview updated"
    );
  }

  async function saveAcademic() {
    await updateStudent(
      {
        studentId: student.studentId,
        admissionNo: student.admissionNo,
        className: student.className,
        section: student.section,
        rollNumber: student.rollNumber,
        academicYear: student.academicYear,
        house: student.house,
      },
      "Academic details updated"
    );
  }

  async function addPayment(payment) {
    await updateStudent({ payments: [...(student.payments || []), payment] });
  }

  async function saveGuardian() {
    await updateStudent(
      {
        father: student.father,
        mother: student.mother,
        guardian: student.guardian,
      },
      "Guardian updated"
    );
  }

  async function saveMedical() {
    await updateStudent(
      {
        medical: student.medical,
      },
      "Medical updated"
    );
  }

  async function saveActivities() {
    await updateStudent(
      {
        activities: student.activities,
        achievements: student.achievements,
      },
      "Activities updated"
    );
  }

  function updateField(field, value) {
    setStudent((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateNestedField(parent, field, value) {
    setStudent((prev) => ({
      ...prev,
      [parent]: {
        ...(prev?.[parent] || {}),
        [field]: value,
      },
    }));
  }

  if (!student) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-8">
      <input ref={photoInputRef} type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
      <input ref={documentInputRef} type="file" hidden onChange={handleDocumentUpload} />

      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Student List</span>
      </button>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-shrink-0">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg bg-gray-200">
                {student.photo ? (
                  <img
                    src={student.photo}
                    alt={student.name || "Student"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-gray-400" />
                )}
              </div>

              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-gray-50 disabled:opacity-60"
              >
                <Upload className="h-3 w-3" />
                {uploadingPhoto ? "Uploading..." : "Upload Photo"}
              </button>
            </div>

            <div className="flex-1">
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {student.name || "Student Name"}
                  </h1>
                  <p className="mt-1 text-gray-600">
                    Student ID: {student.studentId || student._id?.slice(-5) || "N/A"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 rounded-lg bg-[#C3292D] px-4 py-2 text-white transition-colors hover:bg-[#A01F23]"
                  >
                    <Download className="h-4 w-4" />
                    Generate Report
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <InfoCard
                  label="Class"
                  value={
                    student.className
                      ? `${student.className}${student.section ? `-${student.section}` : ""}`
                      : "N/A"
                  }
                />
                <InfoCard label="Roll Number" value={student.rollNumber || "N/A"} />
                <InfoCard label="Admission No." value={student.admissionNo || "AUTO"} />
                <StatusCard value={student.status || "Active"} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 overflow-x-auto px-6 pt-4">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 pb-4 transition-colors ${
                  activeTab === key
                    ? "border-[#C3292D] font-medium text-[#C3292D]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SectionCard title="Personal Information">
                <EditableRow
                  label="Full Name"
                  value={student.name || ""}
                  onChange={(value) => updateField("name", value)}
                />
                <EditableRow
                  label="Date of Birth"
                  value={student.dob || ""}
                  onChange={(value) => updateField("dob", value)}
                />
                <EditableRow
                  label="Gender"
                  value={student.gender || ""}
                  onChange={(value) => updateField("gender", value)}
                />
                <EditableRow
                  label="Blood Group"
                  value={student.bloodGroup || ""}
                  onChange={(value) => updateField("bloodGroup", value)}
                />
                <EditableRow
                  label="Religion"
                  value={student.religion || ""}
                  onChange={(value) => updateField("religion", value)}
                />
                <EditableRow
                  label="Nationality"
                  value={student.nationality || ""}
                  onChange={(value) => updateField("nationality", value)}
                />
              </SectionCard>

              <SectionCard title="Contact Information">
                <EditableRow
                  label="Phone"
                  value={student.phone || ""}
                  onChange={(value) => updateField("phone", value)}
                />
                <EditableRow
                  label="Email"
                  value={student.email || ""}
                  onChange={(value) => updateField("email", value)}
                />
                <EditableTextArea
                  label="Address"
                  value={student.address || ""}
                  onChange={(value) => updateField("address", value)}
                />
              </SectionCard>

              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={saveOverview}
                  className="rounded-lg bg-[#C3292D] px-4 py-2 text-white transition-colors hover:bg-[#A01F23]"
                >
                  Save Overview
                </button>
              </div>
            </div>
          )}

          {activeTab === "academic" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SectionCard title="Academic Details">
                <EditableRow
                  label="Student ID / Registration No"
                  value={student.studentId || ""}
                  onChange={(value) => updateField("studentId", value)}
                />
                <EditableRow
                  label="Admission Number"
                  value={student.admissionNo || ""}
                  onChange={(value) => updateField("admissionNo", value)}
                />
                <EditableRow
                  label="Class"
                  value={student.className || ""}
                  onChange={(value) => updateField("className", value)}
                />
                <EditableRow
                  label="Section"
                  value={student.section || ""}
                  onChange={(value) => updateField("section", value)}
                />
                <EditableRow
                  label="Roll Number"
                  value={student.rollNumber || ""}
                  onChange={(value) => updateField("rollNumber", value)}
                />
                <EditableRow
                  label="Academic Year"
                  value={student.academicYear || ""}
                  onChange={(value) => updateField("academicYear", value)}
                />
                <EditableRow
                  label="House"
                  value={student.house || ""}
                  onChange={(value) => updateField("house", value)}
                />
              </SectionCard>

              <SectionCard title="Performance Snapshot">
                <Stat title="Overall Percentage" value={student.percentage || student.overallPercentage || "N/A"} tone="blue" />
                <Stat title="Grade" value={student.grade || "N/A"} tone="green" />
                <Stat title="Rank" value={student.rank || "N/A"} tone="amber" />
                <Stat title="Subjects" value={student.subjects?.length || 0} tone="red" />
              </SectionCard>

              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={saveAcademic}
                  className="rounded-lg bg-[#C3292D] px-4 py-2 text-white transition-colors hover:bg-[#A01F23]"
                >
                  Save Academic Details
                </button>
              </div>

              <div className="md:col-span-2">
                <SectionCard title="Subjects">
                  {student.subjects?.length ? (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {student.subjects.map((subject, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-gray-200 px-4 py-3"
                        >
                          <p className="font-medium text-gray-900">
                            {typeof subject === "string" ? subject : subject.name || "Subject"}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Marks: {typeof subject === "object" ? subject.marks || "N/A" : "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="No academic subjects added yet." />
                  )}
                </SectionCard>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SectionCard title="Attendance Summary">
                <Stat title="Present Days" value={student.attendance?.present || 0} tone="green" />
                <Stat title="Absent Days" value={student.attendance?.absent || 0} tone="red" />
                <Stat title="Late Entries" value={student.attendance?.late || 0} tone="amber" />
                <Stat
                  title="Attendance %"
                  value={student.attendance?.percentage || "0%"}
                  tone="blue"
                />
              </SectionCard>

              <SectionCard title="Monthly Overview">
                <Row label="Working Days" value={student.attendance?.workingDays} />
                <Row label="Leaves Taken" value={student.attendance?.leaves} />
                <Row label="Last Present" value={student.attendance?.lastPresentDate} />
                <Row label="Remarks" value={student.attendance?.remarks} />
              </SectionCard>
            </div>
          )}

          {activeTab === "fees" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SectionCard title="Fee Summary">
                <Stat title="Total Fees" value={student.fees?.total || student.totalFee || "N/A"} tone="blue" />
                <Stat title="Paid" value={student.fees?.paid || student.paidAmount || "N/A"} tone="green" />
                <Stat title="Due" value={student.fees?.due || student.pendingAmount || "N/A"} tone="red" />
                <Stat title="Last Payment" value={student.fees?.lastPayment || student.nextDueDate || "N/A"} tone="amber" />
              </SectionCard>

              <SectionCard title="Recent Payments">
                {student.payments?.length ? (
                  <div className="space-y-3">
                    {student.payments.map((payment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.title || `Payment ${index + 1}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {payment.date || "No date"}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {payment.amount || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No payment records found." />
                )}

                <button
                  onClick={() =>
                    addPayment({
                      title: "Manual Payment",
                      date: new Date().toISOString().slice(0, 10),
                      amount: "0",
                    })
                  }
                  className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50"
                >
                  Add Dummy Payment
                </button>
              </SectionCard>
            </div>
          )}

          {activeTab === "guardian" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SectionCard title="Parent Details">
                <EditableRow
                  label="Father Name"
                  value={student.father?.name || ""}
                  onChange={(value) => updateNestedField("father", "name", value)}
                />
                <EditableRow
                  label="Father Phone"
                  value={student.father?.phone || ""}
                  onChange={(value) => updateNestedField("father", "phone", value)}
                />
                <EditableRow
                  label="Mother Name"
                  value={student.mother?.name || ""}
                  onChange={(value) => updateNestedField("mother", "name", value)}
                />
                <EditableRow
                  label="Mother Phone"
                  value={student.mother?.phone || ""}
                  onChange={(value) => updateNestedField("mother", "phone", value)}
                />
              </SectionCard>

              <SectionCard title="Guardian Information">
                <EditableRow
                  label="Guardian Name"
                  value={student.guardian?.name || ""}
                  onChange={(value) => updateNestedField("guardian", "name", value)}
                />
                <EditableRow
                  label="Relation"
                  value={student.guardian?.relation || ""}
                  onChange={(value) => updateNestedField("guardian", "relation", value)}
                />
                <EditableRow
                  label="Guardian Phone"
                  value={student.guardian?.phone || ""}
                  onChange={(value) => updateNestedField("guardian", "phone", value)}
                />
                <EditableTextArea
                  label="Guardian Address"
                  value={student.guardian?.address || ""}
                  onChange={(value) => updateNestedField("guardian", "address", value)}
                />
              </SectionCard>

              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={saveGuardian}
                  className="rounded-lg bg-[#C3292D] px-4 py-2 text-white transition-colors hover:bg-[#A01F23]"
                >
                  Save Guardian
                </button>
              </div>
            </div>
          )}

          {activeTab === "medical" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SectionCard title="Medical Details">
                <EditableRow
                  label="Blood Group"
                  value={student.medical?.bloodGroup || student.bloodGroup || ""}
                  onChange={(value) => updateNestedField("medical", "bloodGroup", value)}
                />
                <EditableRow
                  label="Allergies"
                  value={student.medical?.allergies || ""}
                  onChange={(value) => updateNestedField("medical", "allergies", value)}
                />
                <EditableRow
                  label="Medical Conditions"
                  value={student.medical?.conditions || ""}
                  onChange={(value) => updateNestedField("medical", "conditions", value)}
                />
                <EditableRow
                  label="Doctor Name"
                  value={student.medical?.doctor || ""}
                  onChange={(value) => updateNestedField("medical", "doctor", value)}
                />
              </SectionCard>

              <SectionCard title="Emergency Contact">
                <EditableRow
                  label="Emergency Contact Name"
                  value={student.medical?.emergencyName || ""}
                  onChange={(value) => updateNestedField("medical", "emergencyName", value)}
                />
                <EditableRow
                  label="Emergency Contact Phone"
                  value={student.medical?.emergencyPhone || ""}
                  onChange={(value) => updateNestedField("medical", "emergencyPhone", value)}
                />
                <EditableRow
                  label="Hospital Preference"
                  value={student.medical?.hospital || ""}
                  onChange={(value) => updateNestedField("medical", "hospital", value)}
                />
              </SectionCard>

              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={saveMedical}
                  className="rounded-lg bg-[#C3292D] px-4 py-2 text-white transition-colors hover:bg-[#A01F23]"
                >
                  Save Medical
                </button>
              </div>
            </div>
          )}

          {activeTab === "activities" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SectionCard title="Activities">
                {student.activities?.length ? (
                  <div className="space-y-3">
                    {student.activities.map((activity, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 px-4 py-3"
                      >
                        <p className="font-medium text-gray-900">
                          {activity.name || activity}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {activity.description || "No description"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No activities added yet." />
                )}
              </SectionCard>

              <SectionCard title="Achievements">
                {student.achievements?.length ? (
                  <div className="space-y-3">
                    {student.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 px-4 py-3"
                      >
                        <p className="font-medium text-gray-900">
                          {achievement.title || achievement}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {achievement.date || "No date"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No achievements added yet." />
                )}
              </SectionCard>

              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={saveActivities}
                  className="rounded-lg bg-[#C3292D] px-4 py-2 text-white transition-colors hover:bg-[#A01F23]"
                >
                  Save Activities
                </button>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <SectionCard title="Documents">
              <div className="mb-5 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-cyan-900">
                Documents approved from student requests are added here automatically. Admin can also upload extra student documents manually.
              </div>

              <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">
                    Document Option
                  </span>
                  <select
                    value={selectedDocumentType}
                    onChange={(event) => setSelectedDocumentType(event.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  >
                    {documentTypes.length === 0 ? (
                      <option value="">No document options added</option>
                    ) : null}
                    {documentTypes.map((type) => (
                      <option key={type._id || type.name} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  onClick={() => documentInputRef.current?.click()}
                  disabled={uploadingDocument || !selectedDocumentType}
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Upload className="h-4 w-4" />
                  {uploadingDocument ? "Uploading..." : "Upload Student Document"}
                </button>
              </div>

              {student.documents?.length ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {student.documents.map((doc, index) => (
                    <div
                      key={doc.requestId || doc.fileUrl || index}
                      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-gray-900">
                            {doc.name || `Document ${index + 1}`}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {doc.type || "File"} {doc.date ? `- ${doc.date}` : ""}
                          </p>
                          {doc.requestId ? (
                            <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                              Approved request
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {doc.fileUrl ? (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                          >
                            <Download className="h-4 w-4" />
                            View
                          </a>
                        ) : null}
                        <button
                          onClick={() => removeDocument(doc, index)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState text="No documents uploaded yet." />
              )}
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div>
      <h3 className="mb-4 font-semibold text-gray-900">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value || "N/A"}</p>
    </div>
  );
}

function StatusCard({ value }) {
  return (
    <div>
      <p className="mb-1 text-xs text-gray-500">Status</p>
      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
        {value}
      </span>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-100 py-2">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value || "N/A"}</span>
    </div>
  );
}

function EditableRow({ label, value, onChange }) {
  return (
    <label className="block border-b border-gray-100 py-2">
      <span className="mb-1 block text-sm text-gray-600">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-[#C3292D]"
      />
    </label>
  );
}

function EditableTextArea({ label, value, onChange }) {
  return (
    <label className="block border-b border-gray-100 py-2">
      <span className="mb-1 block text-sm text-gray-600">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-[#C3292D]"
      />
    </label>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
      {text}
    </div>
  );
}

function Stat({ title, value, tone }) {
  const toneMap = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className={`rounded-xl p-4 ${toneMap[tone] || toneMap.blue}`}>
      <p className="text-xs text-gray-500">{title}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}
