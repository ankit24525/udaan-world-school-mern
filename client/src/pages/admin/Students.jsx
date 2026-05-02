import { useEffect, useState } from "react";
import api from "../../services/api";
import { Plus, Trash2 } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    className: "",
    section: "",
    rollNumber: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    const res = await api.get("/students");
    setStudents(res.data);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await api.post("/students", form);

    setForm({
      name: "",
      className: "",
      section: "",
      rollNumber: "",
    });

    fetchStudents();
  }

  async function handleDelete(id) {
    await api.delete(`/students/${id}`);
    fetchStudents();
  }

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">Student Management</h1>

      {/* ADD FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-6 space-y-4"
      >
        <input
          placeholder="Name"
          className="input"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <div className="grid grid-cols-3 gap-4">
          <input
            placeholder="Class"
            className="input"
            value={form.className}
            onChange={(e) =>
              setForm({ ...form, className: e.target.value })
            }
          />

          <input
            placeholder="Section"
            className="input"
            value={form.section}
            onChange={(e) =>
              setForm({ ...form, section: e.target.value })
            }
          />

          <input
            placeholder="Roll No"
            className="input"
            value={form.rollNumber}
            onChange={(e) =>
              setForm({ ...form, rollNumber: e.target.value })
            }
          />
        </div>

        <button className="bg-[#C3292D] text-white px-4 py-2 rounded">
          Add Student
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow">

        <table className="w-full">
          <thead className="bg-gray-50 text-sm text-gray-500">
            <tr>
              <th className="p-3">Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Roll</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-3">{s.name}</td>
                <td>{s.className}</td>
                <td>{s.section}</td>
                <td>{s.rollNumber}</td>
                <td>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}