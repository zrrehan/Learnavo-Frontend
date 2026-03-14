// src/components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
}

export default function Sidebar({ items, title = "Dashboard" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white flex flex-col shrink-0 shadow-[4px_0_24px_0_rgba(0,0,0,0.06)] relative z-10">

      {/* Brand */}
      <div className="px-6 py-6 border-b border-black/10">
        <p className="font-mono uppercase tracking-[0.2em] text-black/30 mt-1 text-xl">
          {title}
        </p>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-[0.15em] uppercase font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-black text-white"
                  : "text-black/40 hover:text-black hover:bg-black/5"
              }`}
            >
              {item.icon && (
                <span className="w-4 h-4 shrink-0">{item.icon}</span>
              )}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — Logout */}
      <div className="px-3 py-4 border-t border-black/10">
        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/auth";
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-[0.15em] uppercase font-semibold text-black/30 hover:text-black hover:bg-black/5 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

    </aside>
  );
}