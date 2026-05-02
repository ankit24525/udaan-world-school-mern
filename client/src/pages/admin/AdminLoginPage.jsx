import { ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    localStorage.removeItem("adminToken");

    const cleanEmail = form.email.trim().toLowerCase();
    const cleanPassword = form.password.trim();

    if (!cleanEmail || !cleanPassword) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", { email: cleanEmail, password: cleanPassword });
      if (data?.token) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard", { replace: true });
        return;
      }
      setMessage("Login succeeded but no admin token was returned.");
    } catch (error) {
      localStorage.removeItem("adminToken");
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#03133d] via-[#02102f] to-[#0d3b7a] px-4 py-10">
      <div className="w-full max-w-lg rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-xl">
          <ShieldCheck size={34} className="text-white" />
        </div>

        <p className="mt-6 text-center text-sm uppercase tracking-[0.45em] text-blue-200">Admin Panel</p>
        <h1 className="mt-3 text-center text-5xl font-bold leading-tight text-white">Secure Login</h1>
        <p className="mt-3 text-center text-base text-slate-300">Udaan World School Dashboard Access</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="relative">
            <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-14 pr-4 text-lg text-white placeholder:text-slate-400 outline-none focus:border-cyan-400"
            />
          </div>

          <div className="relative">
            <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-14 pr-14 text-lg text-white placeholder:text-slate-400 outline-none focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 transition hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {message ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-lg font-semibold text-white shadow-xl transition hover:scale-[1.02] disabled:opacity-70"
          >
            {loading ? "Please wait..." : "Login to Dashboard"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">Protected access • Authorized staff only</p>
      </div>
    </main>
  );
}
