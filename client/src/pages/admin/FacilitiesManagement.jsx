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
  const [editingFacilityId, setEditingFacilityId] = useState(null);
  const [editingFacility, setEditingFacility] = useState(emptyFacility);

  useEffect(() => {
    fetchFacilities();
  }, []);

  function getFacilityKey(facility) {
    return facility._id || String(facility.name || "").trim().toLowerCase();
  }

  async function fetchFacilities() {
    try {
      const res = await api.get("/facilities");
      let backendFacilities = Array.isArray(res.data) ? res.data : [];
      const backendByName = new Map(
        backendFacilities.map((item) => [String(item.name || "").trim().toLowerCase(), item])
      );

      const missingDefaults = defaultFacilities.filter(
        (item) => !backendByName.has(String(item.name || "").trim().toLowerCase())
      );

      if (missingDefaults.length) {
        const created = await Promise.all(
          missingDefaults.map((item) => api.post("/facilities", item).then((response) => response.data))
        );
        backendFacilities = [...created, ...backendFacilities];
      }

      const refreshedByName = new Map(
        backendFacilities.map((item) => [String(item.name || "").trim().toLowerCase(), item])
      );

      const merged = defaultFacilities.map((item) => {
        const match = refreshedByName.get(String(item.name || "").trim().toLowerCase());
        return match ? { ...item, ...match } : item;
      });

      if (backendFacilities.length > 0) {
        backendFacilities.forEach((item) => {
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
      if (editingFacilityId === id) {
        cancelEditFacility();
      }
      fetchFacilities();
    } catch (err) {
      console.error(err);
      alert("Unable to delete facility");
    }
  }

  function startEditFacility(facility) {
    setAdding(false);
    setEditingFacilityId(getFacilityKey(facility));
    setEditingFacility({
      name: facility.name || "",
      category: facility.category || "",
      count: String(facility.count ?? ""),
      icon: facility.icon || "Building2",
    });
  }

  function cancelEditFacility() {
    setEditingFacilityId(null);
    setEditingFacility(emptyFacility);
  }

  async function updateFacility(id) {
    if (!editingFacility.name || !editingFacility.category || !editingFacility.count) {
      alert("Fill all fields");
      return;
    }

    try {
      await api.put(`/facilities/${id}`, {
        ...editingFacility,
        count: Number(editingFacility.count),
      });

      cancelEditFacility();
      fetchFacilities();
    } catch (err) {
      console.error(err);
      alert("Unable to update facility");
    }
  }

  async function saveEditedFacility(facility) {
    if (facility._id) {
      await updateFacility(facility._id);
      return;
    }

    if (!editingFacility.name || !editingFacility.category || !editingFacility.count) {
      alert("Fill all fields");
      return;
    }

    try {
      await api.post("/facilities", {
        ...editingFacility,
        count: Number(editingFacility.count),
      });

      cancelEditFacility();
      fetchFacilities();
    } catch (err) {
      console.error(err);
      alert("Unable to save facility");
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
            onClick={() => {
              cancelEditFacility();
              setAdding(true);
            }}
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

              <select
                value={newFacility.icon}
                onChange={(e) =>
                  setNewFacility({ ...newFacility, icon: e.target.value })
                }
                className="mb-2 w-full rounded border p-2"
              >
                {Object.keys(iconMap).map((iconName) => (
                  <option key={iconName} value={iconName}>
                    {iconName}
                  </option>
                ))}
              </select>

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
            const facilityKey = getFacilityKey(facility);

            return (
              <div key={facilityKey || index} className="rounded-lg border p-6">
                {editingFacilityId === facilityKey ? (
                  <>
                    <input
                      placeholder="Name"
                      value={editingFacility.name}
                      onChange={(e) =>
                        setEditingFacility({ ...editingFacility, name: e.target.value })
                      }
                      className="mb-2 w-full rounded border p-2"
                    />

                    <input
                      placeholder="Category"
                      value={editingFacility.category}
                      onChange={(e) =>
                        setEditingFacility({ ...editingFacility, category: e.target.value })
                      }
                      className="mb-2 w-full rounded border p-2"
                    />

                    <input
                      type="number"
                      placeholder="Count"
                      value={editingFacility.count}
                      onChange={(e) =>
                        setEditingFacility({ ...editingFacility, count: e.target.value })
                      }
                      className="mb-2 w-full rounded border p-2"
                    />

                    <select
                      value={editingFacility.icon}
                      onChange={(e) =>
                        setEditingFacility({ ...editingFacility, icon: e.target.value })
                      }
                      className="mb-3 w-full rounded border p-2"
                    >
                      {Object.keys(iconMap).map((iconName) => (
                        <option key={iconName} value={iconName}>
                          {iconName}
                        </option>
                      ))}
                    </select>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => saveEditedFacility(facility)}
                        className="rounded bg-green-600 px-3 py-1 text-sm text-white"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={cancelEditFacility}
                        className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700"
                      >
                        Cancel
                      </button>
                      {facility._id ? (
                        <button
                          onClick={() => deleteFacility(facility._id)}
                          className="rounded bg-red-50 px-3 py-1 text-sm text-red-600"
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4 flex justify-between">
                      <div className="rounded-lg bg-[#C3292D] p-3">
                        <Icon className="text-white" />
                      </div>

                      <button
                        onClick={() => startEditFacility(facility)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                        aria-label={`Edit ${facility.name}`}
                      >
                        <SquarePen size={18} />
                      </button>
                    </div>

                    <h3 className="text-lg font-semibold">{facility.name}</h3>

                    <div className="mt-2 flex justify-between text-sm">
                      <span>{facility.category}</span>
                      <span>Count: {facility.count}</span>
                    </div>

                    {facility._id && (
                      <button
                        onClick={() => deleteFacility(facility._id)}
                        className="mt-3 text-sm text-red-500"
                      >
                        Delete
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
