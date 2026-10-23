"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasDarkClass = document.documentElement.classList.contains("dark");
    setIsDark(hasDarkClass);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);

    if (nextIsDark) {
      root.classList.add("dark");
      localStorage.setItem("velora-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("velora-theme", "light");
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme mode"
      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center cursor-pointer"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400"/>
      ) : (
        <Moon className="w-4 h-4 text-slate-600"/>
      )}
    </button>
  );
}
