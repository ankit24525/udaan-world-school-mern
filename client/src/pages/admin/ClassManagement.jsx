import { useEffect, useState } from "react";
import { Plus, Trash2, Lock } from "lucide-react";
import api from "../../services/api";

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState("");
  const [sectionInput, setSectionInput] = useState({});

  useEffect(() => {
    fetchClasses();
  }, []);

  async function fetchClasses() {
    const res = await api.get("/classes");
    setClasses(res.data);
  }

  // ➕ ADD CLASS
  async function addClass() {
    if (!newClass.trim()) return;

    try {
      await api.post("/classes", { name: newClass });
      setNewClass("");
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding class");
    }
  }

  // ➕ ADD SECTION
  async function addSection(classId) {
    const section = sectionInput[classId];

    if (!section) return;

    try {
      await api.put(`/classes/${classId}`, { section });

      setSectionInput({
        ...sectionInput,
        [classId]: "",
      });

      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  }

  // ❌ DELETE CLASS
  async function deleteClass(id) {
    try {
      await api.delete(`/classes/${id}`);
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Class Management</h1>
          <p className="text-gray-500">
            Manage classes and their sections
          </p>
        </div>
      </div>

      {/* ➕ ADD CLASS */}
      <div className="bg-white p-4 rounded-xl shadow border mb-6 flex gap-2">

        <input
          placeholder="Enter class name (e.g. Playgroup)"
          className="border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
        />

        <button
          onClick={addClass}
          className="bg-red-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
        >
          <Plus size={16} />
          Add Class
        </button>

      </div>

      {/* 🔥 CLASS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {classes.map((cls) => (
          <div
            key={cls._id}
            className="bg-white p-5 rounded-xl shadow border hover:shadow-lg transition"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">

              <h2 className="text-lg font-semibold text-gray-800">
                {cls.name}
              </h2>

              {/* 🔒 DEFAULT OR DELETE */}
              {cls.isDefault ? (
                <div
                  className="flex items-center gap-1 text-gray-400"
                  title="Default class cannot be deleted"
                >
                  <Lock size={16} />
                </div>
              ) : (
                <button
                  onClick={() => deleteClass(cls._id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded transition"
                >
                  <Trash2 size={16} />
                </button>
              )}

            </div>

            {/* SECTIONS */}
            <div className="flex flex-wrap gap-2 mb-4">
              {cls.sections.map((sec, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
                >
                  {sec}
                </span>
              ))}
            </div>

            {/* ADD SECTION */}
            <div className="flex gap-2">

              <input
                placeholder="Section (A, B...)"
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sectionInput[cls._id] || ""}
                onChange={(e) =>
                  setSectionInput({
                    ...sectionInput,
                    [cls._id]: e.target.value.toUpperCase(),
                  })
                }
              />

              <button
                onClick={() => addSection(cls._id)}
                className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Add
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}