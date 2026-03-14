// src/components/homepage/Navbar.tsx
"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    setOpen(false);
    window.location.href = "/auth";
  };

  const user = session?.user ?? null;

  const menu = (
    <>
      <li>
        <Link href="/" className="relative text-sm tracking-widest uppercase font-medium text-black/50 hover:text-black hover:bg-transparent transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
          Home
        </Link>
      </li>
      <li>
        <Link href="/browse-tutor" className="relative text-sm tracking-widest uppercase font-medium text-black/50 hover:text-black hover:bg-transparent transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
          Find Tutors
        </Link>
      </li>
      
    </>
  );

  return (
    <div className="navbar bg-white border-b border-black/10 px-6 py-3">

      {/* Logo */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white border border-black/10 shadow-lg rounded-none z-50 mt-3 w-52 p-2">
            {menu}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost normal-case px-0 hover:bg-transparent font-serif">
          <span className="text-xl font-black tracking-tight text-black">Learnavo</span>
          <span className="text-xl font-black tracking-tight text-black/20">.</span>
        </Link>
      </div>

      {/* Center Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          {menu}
        </ul>
      </div>

      {/* CTA */}
      <div className="navbar-end gap-3">
        {isPending ? (
          // Loading skeleton
          <div className="w-9 h-9 bg-black/10 animate-pulse" />
        ) : !user ? (
          // Not logged in
          <Link
            href="/authentication"
            className="btn btn-sm rounded-none border border-black/20 bg-transparent text-black text-xs tracking-[0.15em] uppercase font-semibold hover:bg-black hover:text-white hover:border-black transition-all duration-300 font-mono"
          >
            Login
          </Link>
        ) : (
          // Logged in — avatar + dropdown
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 bg-black text-white flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-black hover:ring-offset-2 transition-all duration-200"
            >
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-black font-serif">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 top-12 w-52 bg-white border border-black/10 shadow-lg z-50">

                {/* User info */}
                <div className="px-4 py-3 border-b border-black/10">
                  <p className="text-xs font-black text-black font-serif truncate">{user.name}</p>
                  <p className="text-[10px] font-mono text-black/40 truncate mt-0.5">{user.email}</p>
                </div>

                {/* Dropdown items */}
                <div className="flex flex-col py-1">
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2.5 text-xs font-mono tracking-widest uppercase text-black/60 hover:text-black hover:bg-black/5 transition-colors duration-200"
                  >
                    My Profile
                  </Link>
                  <Link
                    href={
                      (user as any).roles === "admin"
                        ? "/admin-all-users"
                        : (user as any).roles === "tutor"
                        ? "/tutor-browse-all-session"
                        : "/my-bookings"
                    }
                    onClick={() => setOpen(false)}
                    className="px-4 py-2.5 text-xs font-mono tracking-widest uppercase text-black/60 hover:text-black hover:bg-black/5 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 text-xs font-mono tracking-widest uppercase text-left text-black/60 hover:text-black hover:bg-black/5 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>

              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}