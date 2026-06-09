import { useState } from "react";
import * as XLSX from "xlsx";
import api from "../services/api";

export default function StudentImportModal({ onClose, onSuccess }) {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({
    name: "",
    className: "",
    section: "",
    rollNumber: "",
    studentId: "",
    admissionNo: "",
    dob: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  // 📂 HANDLE FILE
  const handleFile = async (file) => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    setData(json);
    setHeaders(Object.keys(json[0] || {}));
  };

  // 📥 IMPORT DATA
  const handleImport = async () => {
    setLoading(true);

    const mapped = data
      .map((row) => ({
        name: row[mapping.name],
        className: row[mapping.className],
        section: row[mapping.section]?.toUpperCase(),
        rollNumber: row[mapping.rollNumber],
        studentId: row[mapping.studentId],
        admissionNo: row[mapping.admissionNo],
        dob: row[mapping.dob],
        phone: row[mapping.phone],
        email: row[mapping.email],
        status: "Active",
      }))
      .filter((s) => s.name && s.className);

    try {
      await api.post("/students/bulk", mapped);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-[90%] max-w-4xl rounded-xl p-6">

        <h2 className="text-xl font-bold mb-4">Import Students</h2>

        {/* 📂 FILE INPUT */}
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {/* 🧠 COLUMN MAPPING */}
        {headers.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-4">

            {["name", "className", "section", "rollNumber", "studentId", "admissionNo", "dob", "phone", "email"].map((field) => (
              <div key={field}>
                <label className="text-sm">{field}</label>
                <select
                  className="w-full border px-2 py-1"
                  onChange={(e) =>
                    setMapping({ ...mapping, [field]: e.target.value })
                  }
                >
                  <option value="">Select column</option>
                  {headers.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>
              </div>
            ))}

          </div>
        )}

        {/* 📊 PREVIEW TABLE */}
        {data.length > 0 && (
          <div className="mt-4 max-h-60 overflow-auto border">

            <table className="w-full text-sm">
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="border px-2 py-1">{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {headers.map((h) => (
                      <td key={h} className="border px-2 py-1">
                        {row[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-4">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleImport}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            {loading ? "Importing..." : "Import"}
          </button>

        </div>

      </div>
    </div>
  );
}