import { Check, Clock, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

export default function AdmissionsManagement() {
  const [activeTab, setActiveTab] = useState("enquiries");
  const [search, setSearch] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [editFees, setEditFees] = useState(false);
  const [fees, setFees] = useState({
    nursery: "1180",
    primary: "1370",
    middle: "1550",
    senior: "1700",
    annual: "1500",
    library: "50",
    computer: "50",
    electricity: "25",
  });

  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    try {
      const res = await api.get("/enquiries");
      setEnquiries(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSaveFees() {
    console.log("Updated Fees:", fees);
    // later:
    // await api.put("/fee-structure", fees);
    setEditFees(false);
  }

  async function updateStatus(id, status) {
    await api.patch(`/enquiries/${id}/status`, { status });
    fetchEnquiries();
    if (selectedApplication?._id === id) {
      setSelectedApplication((prev) => (prev ? { ...prev, status } : prev));
    }
  }

  async function scheduleTest(application) {
    const currentValue = application?.testDate || "";
    const testDate = window.prompt("Enter test date", currentValue);
    if (!testDate) return;

    await api.patch(`/enquiries/${application._id}/status`, {
      status: "test_scheduled",
      testDate,
    });

    fetchEnquiries();
    if (selectedApplication?._id === application._id) {
      setSelectedApplication((prev) =>
        prev ? { ...prev, status: "test_scheduled", testDate } : prev
      );
    }
  }

  const applications = useMemo(
    () => enquiries.filter((e) => e.type === "admission"),
    [enquiries]
  );

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return enquiries;
    return enquiries.filter((e) =>
      [e.studentName, e.className, e.phone, e.email, e.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [enquiries, search]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return applications;
    return applications.filter((e) =>
      [e.applicationId, e.studentName, e.className, e.status, e.testDate]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [applications, search]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admissions Management</h1>
        <p className="mt-2 text-gray-600">
          Manage admission enquiries & applications
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow">
          <h2 className="text-3xl font-bold">{enquiries.length}</h2>
          <p className="text-gray-600">Total Enquiries</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow">
          <h2 className="text-3xl font-bold">{applications.length}</h2>
          <p className="text-gray-600">Applications</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow">
          <h2 className="text-3xl font-bold">
            {applications.filter((e) => e.status === "test_scheduled").length}
          </h2>
          <p className="text-gray-600">Tests Scheduled</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow">
          <h2 className="text-3xl font-bold">
            {applications.filter((e) => e.status === "approved").length}
          </h2>
          <p className="text-gray-600">Admitted</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow">
        <div className="flex gap-6 border-b px-6 pt-4">
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`pb-3 ${
              activeTab === "enquiries"
                ? "border-b-2 border-[#C3292D] text-[#C3292D]"
                : "text-gray-500"
            }`}
          >
            Enquiries
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`pb-3 ${
              activeTab === "applications"
                ? "border-b-2 border-[#C3292D] text-[#C3292D]"
                : "text-gray-500"
            }`}
          >
            Applications
          </button>

          <button
            onClick={() => setActiveTab("fees")}
            className={`pb-3 ${
              activeTab === "fees"
                ? "border-b-2 border-[#C3292D] text-[#C3292D]"
                : "text-gray-500"
            }`}
          >
            Fee Structure
          </button>
        </div>

        <div className="border-b p-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-lg border py-2 pl-10 pr-4 focus:ring-2 focus:ring-[#C3292D]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "enquiries" && (
            <table className="w-full">
              <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredEnquiries.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{e.studentName}</td>
                    <td className="px-6 py-4">{e.className}</td>
                    <td className="px-6 py-4">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>{e.phone}</div>
                      <div className="text-xs text-gray-500">{e.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                        {e.status}
                      </span>
                    </td>
                    <td className="flex gap-2 px-6 py-4">
                      <button
                        onClick={() => updateStatus(e._id, "contacted")}
                        className="p-1 text-green-600"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => updateStatus(e._id, "test_scheduled")}
                        className="p-1 text-blue-600"
                      >
                        <Clock size={16} />
                      </button>
                      <button
                        onClick={() => updateStatus(e._id, "closed")}
                        className="p-1 text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "applications" && (
            <table className="w-full">
              <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Application ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Submitted</th>
                  <th className="px-6 py-3">Test Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredApplications.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{e.applicationId}</td>
                    <td className="px-6 py-4">{e.studentName}</td>
                    <td className="px-6 py-4">{e.className}</td>
                    <td className="px-6 py-4">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{e.testDate || "Not Set"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          e.status === "under_review"
                            ? "bg-yellow-100 text-yellow-700"
                            : e.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {e.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="flex gap-2 px-6 py-4">
                      <button
                        onClick={() => setSelectedApplication(e)}
                        className="p-1 text-blue-600 hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => scheduleTest(e)}
                        className="p-1 text-sky-600"
                        title="Schedule Test"
                      >
                        <Clock size={16} />
                      </button>
                      <button
                        onClick={() => updateStatus(e._id, "approved")}
                        className="p-1 text-green-600"
                      >
                        <Check size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "fees" && (
            <div className="p-6">
              <div className="mb-6 flex gap-3">
                <button
                  onClick={() => {
                    if (editFees) {
                      handleSaveFees();
                    } else {
                      setEditFees(true);
                    }
                  }}
                  className="rounded-lg bg-[#C3292D] px-4 py-2 text-white"
                >
                  {editFees ? "Save Changes" : "Update Fee Structure"}
                </button>

                {editFees && (
                  <button
                    onClick={() => setEditFees(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg border p-6">
                  <h3 className="mb-4 text-lg font-semibold">Day School Fee Structure</h3>

                  <div className="space-y-3">
                    <FeeRow
                      label="Nursery - UKG"
                      name="nursery"
                      value={fees.nursery}
                      editFees={editFees}
                      setFees={setFees}
                    />
                    <FeeRow
                      label="Class I - III"
                      name="primary"
                      value={fees.primary}
                      editFees={editFees}
                      setFees={setFees}
                    />
                    <FeeRow
                      label="Class IV - VI"
                      name="middle"
                      value={fees.middle}
                      editFees={editFees}
                      setFees={setFees}
                    />
                    <FeeRow
                      label="Class VII - X"
                      name="senior"
                      value={fees.senior}
                      editFees={editFees}
                      setFees={setFees}
                    />
                  </div>
                </div>

                <div className="rounded-lg border p-6">
                  <h3 className="mb-4 text-lg font-semibold">Additional Charges</h3>

                  <div className="space-y-3">
                    <FeeRow
                      label="Annual Charges"
                      name="annual"
                      value={fees.annual}
                      editFees={editFees}
                      setFees={setFees}
                      suffix="/year"
                    />
                    <FeeRow
                      label="Library"
                      name="library"
                      value={fees.library}
                      editFees={editFees}
                      setFees={setFees}
                      suffix="/month"
                    />
                    <FeeRow
                      label="Computer"
                      name="computer"
                      value={fees.computer}
                      editFees={editFees}
                      setFees={setFees}
                      suffix="/month"
                    />
                    <FeeRow
                      label="Electricity"
                      name="electricity"
                      value={fees.electricity}
                      editFees={editFees}
                      setFees={setFees}
                      suffix="/month"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedApplication ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedApplication.studentName || "Admission Application"}
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedApplication.applicationId || "Application"} ·{" "}
                  {selectedApplication.className || "Class not set"}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2">
              <DetailCard label="Student Name" value={selectedApplication.studentName} />
              <DetailCard label="Parent Name" value={selectedApplication.parentName} />
              <DetailCard label="Class" value={selectedApplication.className} />
              <DetailCard label="Phone" value={selectedApplication.phone} />
              <DetailCard label="Email" value={selectedApplication.email} />
              <DetailCard label="Submitted" value={selectedApplication.createdAt ? new Date(selectedApplication.createdAt).toLocaleDateString() : "-"} />
              <DetailCard label="Status" value={(selectedApplication.status || "-").replace("_", " ")} />
              <DetailCard label="Test Date" value={selectedApplication.testDate || "Not Set"} />
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t px-6 py-4">
              <button
                onClick={() => scheduleTest(selectedApplication)}
                className="rounded-lg border border-sky-200 px-4 py-2 text-sky-700 hover:bg-sky-50"
              >
                Schedule Test
              </button>
              <button
                onClick={() => updateStatus(selectedApplication._id, "contacted")}
                className="rounded-lg border border-emerald-200 px-4 py-2 text-emerald-700 hover:bg-emerald-50"
              >
                Mark Contacted
              </button>
              <button
                onClick={() => updateStatus(selectedApplication._id, "approved")}
                className="rounded-lg bg-[#C3292D] px-4 py-2 text-white hover:bg-[#A01F23]"
              >
                Approve Application
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FeeRow({ label, name, value, editFees, setFees, suffix = "/month" }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-600">{label}</span>

      {editFees ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Rs.</span>
          <input
            type="number"
            value={value}
            onChange={(e) =>
              setFees((prev) => ({
                ...prev,
                [name]: e.target.value,
              }))
            }
            className="w-28 rounded-lg border border-gray-300 px-3 py-1.5 text-right font-semibold focus:outline-none focus:ring-2 focus:ring-[#C3292D]"
          />
          <span className="text-sm text-gray-500">{suffix}</span>
        </div>
      ) : (
        <span className="font-semibold">
          Rs.{value}
          {suffix}
        </span>
      )}
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-900">{value || "-"}</p>
    </div>
  );
}
