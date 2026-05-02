import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api.js";

export default function AuthGuard({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    async function verifySession() {
      const token = localStorage.getItem("adminToken");
      if (!token || token === "undefined" || token === "null") {
        if (active) setStatus("unauthorized");
        return;
      }

      try {
        await api.get("/auth/me");
        if (active) setStatus("authorized");
      } catch (err) {
        localStorage.removeItem("adminToken");
        if (active) setStatus("unauthorized");
      }
    }

    verifySession();

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return <div className="p-6 text-sm text-gray-500">Checking admin session...</div>;
  }

  if (status === "unauthorized") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
