import { useEffect, useState } from "react";
import api from "../services/api";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const res = await api.get("/content", { params: { type: "staffMember", published: "true" } });
        setTeachers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTeachers();
  }, []);

  return (
    <main className="bg-white overflow-hidden">
      <section className="relative min-h-[64vh] flex items-center bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-900 text-white">
        <div className="containerx relative z-10 text-center py-20">
          <h1 className="text-5xl md:text-7xl font-black">Senior Leader Team & Teachers</h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-white/90 leading-8">
            Meet the educators and mentors shaping confident, capable and future-ready learners.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="containerx">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {teachers.map((teacher) => (
              <article key={teacher._id} className="overflow-hidden rounded-[30px] bg-white shadow-2xl ring-1 ring-slate-200">
                <div className="h-80 bg-slate-100">
                  {teacher.imageUrl ? (
                    <img src={teacher.imageUrl} alt={teacher.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">Teacher Photo</div>
                  )}
                </div>
                <div className="p-7">
                  <p className="text-sm font-semibold uppercase tracking-[2px] text-cyan-700">{teacher.meta?.department || "Academics"}</p>
                  <h2 className="mt-3 text-3xl font-black text-slate-900">{teacher.title}</h2>
                  <p className="mt-2 font-semibold text-slate-600">{teacher.meta?.role || "Teacher"}</p>
                  <p className="mt-4 text-slate-600 leading-8">{teacher.excerpt || teacher.body || "Staff profile coming soon."}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
