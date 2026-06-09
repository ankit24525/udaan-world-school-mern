import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import {
  LayoutDashboard,
  Mail,
  Users,
  GraduationCap,
  FileText,
  Image,
  Briefcase,
  BookOpen,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [sectionFilter, setSectionFilter] = useState("All");
  const navigate = useNavigate(); // ✅ FIX

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
    }`;

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-r shadow-lg p-4 
      h-screen flex flex-col`}  // ✅ IMPORTANT
    >
      {/* TOGGLE */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-6 text-sm text-gray-500"
      >
        ☰
      </button>

      {/* 🔥 MENU */}
      <nav className="flex flex-col gap-2 flex-1 overflow-y-auto"> {/* ✅ IMPORTANT */}

        <NavLink to="/admin/dashboard" className={linkClass}>
          <LayoutDashboard size={18} />
          {!collapsed && "Dashboard"}
        </NavLink>

        <NavLink to="/admin/students" className={linkClass}>
          <Users size={18} />
          {!collapsed && "Student Management"}
        </NavLink>
     <NavLink to="/admin/classes" className={linkClass}>
        <Users size={18} />
          {!collapsed && "Classes"}
</NavLink>
        <NavLink to="/admin/admissions" className={linkClass}>
          <GraduationCap size={18} />
          {!collapsed && "Admission"}
        </NavLink>

        <NavLink to="/admin/facilities" className={linkClass}>
          <Building2 size={18} />
          {!collapsed && "Facilities"}
        </NavLink>

        <NavLink to="/admin/documents" className={linkClass}>
          <FileText size={18} />
          {!collapsed && "Documents"}
        </NavLink>

        <NavLink to="/admin/content" className={linkClass}>
          <FileText size={18} />
          {!collapsed && "Content"}
        </NavLink>

        <NavLink to="/admin/gallery" className={linkClass}>
          <Image size={18} />
          {!collapsed && "Gallery"}
        </NavLink>

        <NavLink to="/admin/staff" className={linkClass}>
          <Briefcase size={18} />
          {!collapsed && "Staff & Careers"}
        </NavLink>

        <NavLink to="/admin/enquiries" className={linkClass}>
          <Mail size={18} />
          {!collapsed && "Enquiries"}
        </NavLink>

        <NavLink to="/admin/academics" className={linkClass}>
          <BookOpen size={18} />
          {!collapsed && "Academics"}
        </NavLink>

        <NavLink to="/admin/blogs" className={linkClass}>
          <FileText size={18} />
          {!collapsed && "Blogs"}
        </NavLink>

        <NavLink to="/admin/settings" className={linkClass}>
          <Settings size={18} />
          {!collapsed && "Settings"}
        </NavLink>

      </nav>

      {/* 🔻 LOGOUT FIXED */}
      <div className="border-t pt-4 mt-2">
        <button
          onClick={async () => {
            try {
              await api.post("/auth/logout");
            } catch (error) {
              console.error(error);
            } finally {
              localStorage.removeItem("adminToken");
              navigate("/admin/login");
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-100 transition"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

    </aside>
  );
}
