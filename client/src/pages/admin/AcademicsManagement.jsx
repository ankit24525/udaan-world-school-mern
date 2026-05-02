import { Plus, Award, BookOpen } from "lucide-react";

export default function AcademicsManagement() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Academics Management</h1>
        <p className="text-gray-600 mt-2">
          Manage academic results, achievements, and curriculum
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-xl shadow border flex gap-4">
          <div className="bg-blue-500 p-3 rounded-lg">
            <Award className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">98.5%</h2>
            <p className="text-sm text-gray-600">Class 10 Pass Rate</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border flex gap-4">
          <div className="bg-green-500 p-3 rounded-lg">
            <Award className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">97.2%</h2>
            <p className="text-sm text-gray-600">Class 12 Pass Rate</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border flex gap-4">
          <div className="bg-purple-500 p-3 rounded-lg">
            <BookOpen className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">20</h2>
            <p className="text-sm text-gray-600">Top Performers</p>
          </div>
        </div>

      </div>

      {/* RESULTS TABLE */}
      <div className="bg-white rounded-xl shadow border mb-6">

        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Academic Results</h2>

          <button className="flex items-center gap-2 bg-[#C3292D] text-white px-4 py-2 rounded-lg">
            <Plus size={16} />
            Add Results
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="p-3">Year</th>
              <th>Class</th>
              <th>Pass %</th>
              <th>Distinction</th>
              <th>Toppers</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="p-3">2024-25</td>
              <td>Class 10</td>
              <td className="text-green-600 font-semibold">98.5%</td>
              <td>45%</td>
              <td>8</td>
            </tr>

            <tr className="border-t">
              <td className="p-3">2024-25</td>
              <td>Class 12</td>
              <td className="text-green-600 font-semibold">97.2%</td>
              <td>52%</td>
              <td>12</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TOPPERS TABLE */}
      <div className="bg-white rounded-xl shadow border">

        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">School Toppers</h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="p-3">Name</th>
              <th>Class</th>
              <th>Percentage</th>
              <th>Stream</th>
              <th>Year</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="p-3">Aarav Sharma</td>
              <td>Class 12</td>
              <td className="text-green-600 font-semibold">98.6%</td>
              <td>Science</td>
              <td>2024-25</td>
            </tr>
          </tbody>
        </table>

      </div>

    </div>
  );
}