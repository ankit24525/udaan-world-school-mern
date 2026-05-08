import { useEffect, useState } from "react";
import api from "../../services/api.js";

export default function ManageEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [status, setStatus] = useState("Loading enquiries...");

  async function loadEnquiries() {
    try {
      const { data } = await api.get("/enquiries");
      setEnquiries(data);
      setStatus("");
    } catch (error) {
      setStatus("Unable to load enquiries. Please login again.");
    }
  }

  async function updateStatus(id, value) {
    try {
      await api.patch(`/enquiries/${id}/status`, {
        status: value,
      });

      setEnquiries((current) =>
        current.map((item) =>
          item._id === id ? { ...item, status: value } : item
        )
      );
    } catch (error) {
      alert("Status update failed");
    }
  }
  async function deleteEnquiry(id) {
  const confirmDelete = window.confirm("Delete this enquiry?");
  if (!confirmDelete) return;

  try {
    await api.delete(`/enquiries/${id}`);
    setEnquiries((current) => current.filter((item) => item._id !== id));
  } catch (error) {
    alert("Delete failed");
  }
}


  useEffect(() => {
    loadEnquiries();
  }, []);

  const statusClasses = {
    new: "border-emerald-200 bg-emerald-50 text-emerald-700",
    contacted: "border-amber-200 bg-amber-50 text-amber-700",
    closed: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <section className="inner-page">
      <div className="section-title">
        <h6>Admin</h6>
        <h2>Admission Enquiries</h2>
        <p>View and manage admission/contact enquiries submitted from website.</p>
      </div>

      {status ? <p>{status}</p> : null}

      <div className="teacher-table-wrap">
        <table className="fee-table teacher-table">
          <thead>
<tr>
  <th>Type</th>
  <th>Student</th>
  <th>Class</th>
  <th>Parent</th>
  <th>Phone</th>
  <th>Email</th>
  <th>Status</th>
  <th>Action</th>
</tr>


          </thead>

          <tbody>
            {enquiries.map((item) => (
              <tr key={item._id}>
              <td>{item.type || "-"}</td>
  <td>{item.studentName || "-"}</td>
  <td>{item.className || "-"}</td>
  <td>{item.parentName || "-"}</td>
  <td>{item.phone || "-"}</td>
  <td>{item.email || "-"}</td>
  <td>
                  <select
                    value={item.status}
                    onChange={(event) =>
                      updateStatus(item._id, event.target.value)
                    }
                    className={`min-w-[130px] rounded-full border px-3 py-2 text-sm font-medium outline-none transition focus:border-[#C3292D] ${statusClasses[item.status] || "border-slate-200 bg-white text-slate-700"}`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td>
  <button
    type="button"
    onClick={() => deleteEnquiry(item._id)}
    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
  >
    Delete
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
