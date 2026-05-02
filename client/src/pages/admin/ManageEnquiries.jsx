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
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td>
  <button type="button" onClick={() => deleteEnquiry(item._id)}>
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
