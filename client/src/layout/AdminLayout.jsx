import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    async function logoutForInactivity() {
      try {
        await api.post("/auth/logout");
      } catch (error) {
        console.error(error);
      } finally {
        localStorage.removeItem("adminToken");
        navigate("/admin/login", { replace: true });
        alert("You were logged out after 5 minutes of inactivity.");
      }
    }

    function resetTimer() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logoutForInactivity, IDLE_TIMEOUT_MS);
    }

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
