import {
  BookOpen,
  Building2,
  Bus,
  Microscope,
  Plus,
  SquarePen,
  Trash2,
  Trophy,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api";

const defaultFacilities = [
  { name: "Smart Classrooms", icon: "Building2", category: "Academic", count: 45 },
  { name: "Science Labs", icon: "Microscope", category: "Academic", count: 6 },
  { name: "Library", icon: "BookOpen", category: "Academic", count: 1 },
  { name: "Sports Complex", icon: "Trophy", category: "Sports", count: 1 },
  { name: "Transport", icon: "Bus", category: "Transport", count: 15 },
  { name: "Cafeteria", icon: "Utensils", category: "Infrastructure", count: 2 },
];

const emptyFacility = {
  name: "",
  category: "",
  count: "",
  icon: "Building2",
};

const emptyScholarship = {
  name: "",
  amount: "",
  criteria: "",
  seats: "",
  awarded: "",
};

const iconMap = {
  Building2,
  Microscope,
  BookOpen,
  Trophy,
  Bus,
  Utensils,
};

export default function FacilitiesManagement() {
  const [facilities, setFacilities] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newFacility, setNewFacility] = useState(emptyFacility);

  const [scholarships, setScholarships] = useState([]);
  const [addingScholarship, setAddingScholarship] = useState(false);
  const [editingScholarshipId, setEditingScholarshipId] = useState(null);
  const [newScholarship, setNewScholarship] = useState(emptyScholarship);
  const [editingScholarship, setEditingScholarship] = useState(emptyScholarship);

  useEffect(() => {
    fetchFacilities();
    fetchScholarships();
  }, []);

  async function fetchFacilities() {
    try {
      const res = await api.get("/facilities");
      const merged = [...defaultFacilities];

      if (Array.isArray(res.data) && res.data.length > 0) {
        res.data.forEach((item) => {
          const exists = merged.find(
            (facility) => facility.name.toLowerCase() === item.name.toLowerCase()
          );

          if (!exists) merged.push(item);
        });
      }

      setFacilities(merged);
    } catch (err) {
      console.error(err);
      setFacilities(defaultFacilities);
    }
  }

  async function fetchScholarships() {
    try {
      const res = await api.get("/scholarships");
      setScholarships(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setScholarships([]);
    }
  }

  async function saveFacility() {
    if (!newFacility.name || !newFacility.category || !newFacility.count) {
      alert("Fill all fields");
      return;
    }

    try {
      await api.post("/facilities", {
        ...newFacility,
        count: Number(newFacility.count),
      });

      setAdding(false);
      setNewFacility(emptyFacility);
      fetchFacilities();
    } catch (err) {
      console.error(err);
      alert("Unable to save facility");
    }
  }

  async function deleteFacility(id) {
    try {
      await api.delete(`/facilities/${id}`);
      fetchFacilities();
    } catch (err) {
      console.error(err);
      alert("Unable to delete facility");
    }
  }

  async function saveScholarship() {
    if (!newScholarship.name || !newScholarship.amount || !newScholarship.criteria) {
      alert("Fill all scholarship fields");
      return;
    }

    try {
      await api.post("/scholarships", {
        ...newScholarship,
        seats: Number(newScholarship.seats),
        awarded: Number(newScholarship.awarded),
      });

      setAddingScholarship(false);
      setNewScholarship(emptyScholarship);
      fetchScholarships();
    } catch (err) {
      console.error(err);
      alert("Unable to save scholarship");
    }
  }

  function startEditScholarship(scholarship) {
    setEditingScholarshipId(scholarship._id);
    setEditingScholarship({
      name: scholarship.name || "",
      amount: scholarship.amount || "",
      criteria: scholarship.criteria || "",
      seats: String(scholarship.seats ?? ""),
      awarded: String(scholarship.awarded ?? ""),
    });
  }

  function cancelEditScholarship() {
    setEditingScholarshipId(null);
    setEditingScholarship(emptyScholarship);
  }

  async function updateScholarship(id) {
    if (!editingScholarship.name || !editingScholarship.amount || !editingScholarship.criteria) {
      alert("Fill all scholarship fields");
      return;
    }

    try {
      await api.put(`/scholarships/${id}`, {
        ...editingScholarship,
        seats: Number(editingScholarship.seats),
        awarded: Number(editingScholarship.awarded),
      });

      cancelEditScholarship();
      fetchScholarships();
    } catch (err) {
      console.error(err);
      alert("Unable to update scholarship");
    }
  }

  async function deleteScholarship(id) {
    try {
      await api.delete(`/scholarships/${id}`);
      if (editingScholarshipId === id) {
        cancelEditScholarship();
      }
      fetchScholarships();
    } catch (err) {
      console.error(err);
      alert("Unable to delete scholarship");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Facilities Management</h1>
      </div>

      <div className="mb-6 rounded-xl border bg-white shadow">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold">School Facilities</h2>

          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 rounded-lg bg-[#C3292D] px-4 py-2 text-white"
          >
            <Plus size={16} />
            Add Facility
          </button>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-3">
          {adding && (
            <div className="rounded-lg border bg-gray-50 p-6">
              <input
                placeholder="Name"
                value={newFacility.name}
                onChange={(e) =>
                  setNewFacility({ ...newFacility, name: e.target.value })
                }
                className="mb-2 w-full rounded border p-2"
              />

              <input
                placeholder="Category"
                value={newFacility.category}
                onChange={(e) =>
                  setNewFacility({ ...newFacility, category: e.target.value })
                }
                className="mb-2 w-full rounded border p-2"
              />

              <input
                type="number"
                placeholder="Count"
                value={newFacility.count}
                onChange={(e) =>
                  setNewFacility({ ...newFacility, count: e.target.value })
                }
                className="mb-2 w-full rounded border p-2"
              />

              <button
                onClick={saveFacility}
                className="mt-2 w-full rounded bg-green-600 px-3 py-1 text-white"
              >
                Save Facility
              </button>

              <button
                onClick={() => setAdding(false)}
                className="mt-2 text-sm text-gray-500"
              >
                Cancel
              </button>
            </div>
          )}

          {facilities.map((facility, index) => {
            const Icon = iconMap[facility.icon] || Building2;

            return (
              <div key={facility._id || index} className="rounded-lg border p-6">
                <div className="mb-4 flex justify-between">
                  <div className="rounded-lg bg-[#C3292D] p-3">
                    <Icon className="text-white" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold">{facility.name}</h3>

                <div className="mt-2 flex justify-between text-sm">
                  <span>{facility.category}</span>
                  <span>Count: {facility.count}</span>
                </div>

                {facility._id && (
                  <button
                    onClick={() => deleteFacility(facility._id)}
                    className="mt-2 text-sm text-red-500"
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Scholarship Programs</h2>

            <button
              onClick={() => {
                setAddingScholarship(true);
                cancelEditScholarship();
              }}
              className="flex items-center gap-2 rounded-lg bg-[#C3292D] px-4 py-2 text-white transition-colors hover:bg-[#A01F23]"
            >
              <Plus className="h-4 w-4" />
              <span>Add Scholarship</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Scholarship Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Criteria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total Seats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Awarded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {addingScholarship && (
                <tr className="bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      value={newScholarship.name}
                      onChange={(e) =>
                        setNewScholarship({
                          ...newScholarship,
                          name: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="Scholarship name"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      value={newScholarship.amount}
                      onChange={(e) =>
                        setNewScholarship({
                          ...newScholarship,
                          amount: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="50% Fee Waiver"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      value={newScholarship.criteria}
                      onChange={(e) =>
                        setNewScholarship({
                          ...newScholarship,
                          criteria: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="Academic Excellence"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={newScholarship.seats}
                      onChange={(e) =>
                        setNewScholarship({
                          ...newScholarship,
                          seats: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="20"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={newScholarship.awarded}
                      onChange={(e) =>
                        setNewScholarship({
                          ...newScholarship,
                          awarded: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={saveScholarship}
                        className="rounded bg-green-600 px-3 py-2 text-sm text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setAddingScholarship(false);
                          setNewScholarship(emptyScholarship);
                        }}
                        className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {scholarships.map((scholarship) => {
                const isEditing = editingScholarshipId === scholarship._id;

                if (isEditing) {
                  return (
                    <tr key={scholarship._id} className="bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          value={editingScholarship.name}
                          onChange={(e) =>
                            setEditingScholarship({
                              ...editingScholarship,
                              name: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          value={editingScholarship.amount}
                          onChange={(e) =>
                            setEditingScholarship({
                              ...editingScholarship,
                              amount: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          value={editingScholarship.criteria}
                          onChange={(e) =>
                            setEditingScholarship({
                              ...editingScholarship,
                              criteria: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={editingScholarship.seats}
                          onChange={(e) =>
                            setEditingScholarship({
                              ...editingScholarship,
                              seats: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={editingScholarship.awarded}
                          onChange={(e) =>
                            setEditingScholarship({
                              ...editingScholarship,
                              awarded: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateScholarship(scholarship._id)}
                            className="rounded bg-green-600 px-3 py-2 text-sm text-white"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditScholarship}
                            className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={scholarship._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {scholarship.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#C3292D]">
                      {scholarship.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {scholarship.criteria}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {scholarship.seats}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {scholarship.awarded}/{scholarship.seats}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditScholarship(scholarship)}
                          className="rounded p-1 text-gray-600 hover:bg-gray-50"
                          title="Edit"
                        >
                          <SquarePen className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteScholarship(scholarship._id)}
                          className="rounded p-1 text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!addingScholarship && scholarships.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No scholarship programs added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
