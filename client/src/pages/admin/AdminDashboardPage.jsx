import { Bell, Briefcase, Calendar, GraduationCap, Image, Mail, TrendingUp, Users, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/dashboard");
        setDashboard(res.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data right now.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const statCards = useMemo(() => {
    const stats = dashboard?.stats || {};
    return [
      {
        icon: <Users />,
        color: "bg-blue-500",
        value: stats.totalStudents ?? 0,
        label: "Total Students",
        change: "Live data",
      },
      {
        icon: <UserPlus />,
        color: "bg-green-500",
        value: stats.newAdmissions ?? 0,
        label: "Admission Enquiries",
        change: "Live data",
      },
      {
        icon: <GraduationCap />,
        color: "bg-purple-500",
        value: stats.totalStaff ?? 0,
        label: "Hired Staff",
        change: "Live data",
      },
      {
        icon: <Calendar />,
        color: "bg-orange-500",
        value: stats.upcomingEvents ?? 0,
        label: "Upcoming Events",
        change: "Published",
      },
    ];
  }, [dashboard]);

  const quickStats = useMemo(() => {
    const stats = dashboard?.stats || {};
    return [
      { icon: <Briefcase size={18} />, label: "Blogs", value: stats.totalBlogs ?? 0 },
      { icon: <Image size={18} />, label: "Gallery Items", value: stats.totalGallery ?? 0 },
      { icon: <Mail size={18} />, label: "Contact Enquiries", value: stats.contactEnquiries ?? 0 },
    ];
  }, [dashboard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mb-8 space-y-4">
          <div className="shadow-shimmer-line h-5 w-32" />
          <div className="shadow-shimmer-line h-12 w-72 max-w-full" />
          <div className="shadow-shimmer-line h-4 w-96 max-w-full" />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="shadow-shimmer-card p-6">
              <div className="flex items-center justify-between">
                <div className="shadow-shimmer-line h-14 w-14 rounded-2xl" />
                <div className="shadow-shimmer-line h-4 w-20" />
              </div>
              <div className="mt-10 space-y-3">
                <div className="shadow-shimmer-line h-9 w-24" />
                <div className="shadow-shimmer-line h-4 w-32" />
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="shadow-shimmer-card p-5">
              <div className="flex items-center gap-3">
                <div className="shadow-shimmer-line h-10 w-10 rounded-xl" />
                <div className="shadow-shimmer-line h-4 w-28" />
              </div>
              <div className="mt-5 shadow-shimmer-line h-8 w-20" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="shadow-shimmer-card p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div className="shadow-shimmer-line h-5 w-36" />
              <div className="shadow-shimmer-line h-5 w-5 rounded-full" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-2xl bg-slate-50 p-4 shadow-sm">
                  <div className="shadow-shimmer-line h-4 w-full" />
                  <div className="mt-3 shadow-shimmer-line h-3 w-24" />
                </div>
              ))}
            </div>
          </div>

          <div className="shadow-shimmer-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="shadow-shimmer-line h-5 w-36" />
              <div className="shadow-shimmer-line h-5 w-5 rounded-full" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-2xl bg-slate-50 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="shadow-shimmer-line h-6 w-16" />
                    <div className="shadow-shimmer-line h-4 w-10" />
                  </div>
                  <div className="mt-3 shadow-shimmer-line h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-500">Welcome back! Here’s what’s happening across the school right now.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {quickStats.map((item) => (
          <div key={item.label} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-700">{item.icon}</div>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <div className="mt-4 text-3xl font-bold text-slate-900">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {(dashboard?.recentActivity || []).map((item, index) => (
              <Activity key={`${item.text}-${index}`} text={item.text} time={item.time} />
            ))}

            {!dashboard?.recentActivity?.length ? (
              <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">No recent activity yet.</div>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Pending Actions</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-3">
            {(dashboard?.pendingActions || []).map((item) => (
              <Action key={item.text} text={item.text} count={item.count} type={item.type} onClick={() => navigate(item.href)} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl bg-gradient-to-r from-[#C3292D] to-[#A01F23] p-6 text-white shadow md:flex-row md:items-center">
        <div>
          <h3 className="mb-1 text-xl font-semibold">Admissions In Motion</h3>
          <p className="text-white/90">
            {dashboard?.stats?.newAdmissions ?? 0} admission enquiries are currently stored in the backend and ready for review.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/admissions")}
          className="rounded-lg bg-white px-6 py-2 font-medium text-[#C3292D] transition hover:bg-gray-100"
        >
          Manage Admissions
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, color, value, label, change }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <div className={`${color} rounded-lg p-3 text-white`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-green-600">{change}</span>
      </div>

      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{label}</div>
    </div>
  );
}

function Activity({ text, time }) {
  return (
    <div className="flex items-start gap-4 rounded-lg bg-gray-50 p-4 transition hover:bg-gray-100">
      <div className="mt-2 h-2 w-2 rounded-full bg-[#C3292D]" />
      <div>
        <p className="text-sm text-gray-900">{text}</p>
        <p className="mt-1 text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}

function Action({ text, count, type, onClick }) {
  const styles = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-gray-100 text-gray-700",
  };

  return (
    <button onClick={onClick} className="w-full cursor-pointer rounded-lg border p-4 text-left transition hover:border-[#C3292D]">
      <div className="mb-2 flex justify-between">
        <span className={`rounded-full px-2 py-1 text-xs ${styles[type]}`}>
          {type}
        </span>
        <span className="text-sm font-semibold text-[#C3292D]">{count}</span>
      </div>
      <p className="text-sm text-gray-900">{text}</p>
    </button>
  );
}
