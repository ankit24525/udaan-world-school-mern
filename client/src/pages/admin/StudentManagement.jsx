import { useEffect, useState } from "react";
import {
  Search,
  Trash2,
  Eye,
  Edit,
  Download,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import * as XLSX from "xlsx";
import StudentImportModal from "../../components/StudentImportModal";

export default function StudentManagement() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [search, classFilter, sectionFilter]);

  async function fetchStudents() {
    const res = await api.get(
      `/students?search=${search}&className=${classFilter}&section=${sectionFilter}`
    );
    setStudents(res.data.data || res.data);
  }

  async function fetchClasses() {
    const res = await api.get("/classes");
    setClassOptions(res.data);
  }

  // SELECT
  function toggleSelect(id) {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  }

  function toggleSelectAll() {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s._id));
    }
  }

  // DELETE
  async function handleDelete(id) {
    await api.delete(`/students/${id}`);
    fetchStudents();
  }

  // BULK DELETE
  async function handleBulkDelete() {
    if (!selectedStudents.length) return;

    await api.post("/students/bulk-delete", {
      ids: selectedStudents,
    });

    setSelectedStudents([]);
    fetchStudents();
  }

  // STATUS
  async function toggleStatus(student) {
    const newStatus =
      student.status === "Active" ? "Inactive" : "Active";

    await api.put(`/students/${student._id}`, {
      status: newStatus,
    });

    fetchStudents();
  }

  // EXPORT
  function handleExport() {
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students.xlsx");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-[#0b1120]">

      {/* 🔥 TOP BAR */}
      <div className="mb-4 flex flex-wrap justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20">

        <div className="flex gap-3">

          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-slate-500" size={18} />
            <input
              placeholder="Search..."
              className="rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-400"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CLASS */}
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
            value={classFilter}
            onChange={(e) => {
              const val = e.target.value;
              setClassFilter(val);
              setSectionFilter("All");

              const selected = classOptions.find(c => c.name === val);
              setSectionOptions(selected?.sections || []);
            }}
          >
            <option value="All">All Classes</option>
            {classOptions.map(c => (
              <option key={c._id}>{c.name}</option>
            ))}
          </select>

          {/* SECTION */}
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
          >
            <option value="All">All Sections</option>
            {sectionOptions.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>

        </div>

        <div className="flex gap-2">

          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
          >
            <Download size={16}/> Export
          </button>

          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
          >
            <Upload size={16}/> Import
          </button>

          {selectedStudents.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Delete ({selectedStudents.length})
            </button>
          )}

        </div>
      </div>

      {/* 🔥 TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20">

        <table className="min-w-full table-fixed text-sm">

          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={
                    students.length > 0 &&
                    selectedStudents.length === students.length
                  }
                />
              </th>

              <th className="w-24 px-4 py-3 text-left">ID</th>
              <th className="w-48 px-4 py-3 text-left">Name</th>
              <th className="w-32 px-4 py-3 text-left">Class</th>
              <th className="w-24 px-4 py-3 text-left">Roll</th>
              <th className="w-64 px-4 py-3 text-left">Email</th>
              <th className="w-32 px-4 py-3 text-left">Status</th>
              <th className="w-32 px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {students.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-white/5">

                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(s._id)}
                    onChange={() => toggleSelect(s._id)}
                  />
                </td>

                <td className="px-4 py-3 truncate whitespace-nowrap">
                  {s._id.slice(-5)}
                </td>

                <td className="px-4 py-3 font-medium truncate whitespace-nowrap text-slate-900 dark:text-white">
                  {s.name}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {s.className}-{s.section}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {s.rollNumber}
                </td>

                <td className="px-4 py-3 truncate whitespace-nowrap text-slate-700 dark:text-slate-300">
                  {s.email}
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleStatus(s)}
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      s.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.status}
                  </button>
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/admin/students/${s._id}`)} className="text-slate-700 dark:text-slate-300">
                      <Eye size={16}/>
                    </button>
                    <button onClick={() => navigate(`/admin/students/${s._id}`)} className="text-slate-700 dark:text-slate-300">
                      <Edit size={16}/>
                    </button>
                    <button onClick={() => handleDelete(s._id)}>
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </td>

              </tr>
            ))}

          </tbody>
        </table>

      </div>

      {/* IMPORT MODAL */}
      {showImport && (
        <StudentImportModal
          onClose={() => setShowImport(false)}
          onSuccess={fetchStudents}
        />
      )}

    </div>
  );
}
