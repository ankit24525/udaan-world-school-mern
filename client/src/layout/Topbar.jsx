import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function Topbar() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="flex justify-between items-center border-b border-slate-200 bg-white/60 px-6 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/60">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>

      <button
        onClick={() => setDark(!dark)}
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}
