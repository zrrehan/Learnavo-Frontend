// src/app/auth/page.tsx
"use client";

import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useState } from "react";

type Tab = "login" | "register";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<Tab>("login");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Corner marks */}
      <span className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-black opacity-20" />
      <span className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-black opacity-20" />
      <span className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-black opacity-20" />
      <span className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-black opacity-20" />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-10">
          <a href="/" className="text-3xl font-black tracking-tight font-serif text-black">
            Learnavo<span className="text-black/20">.</span>
          </a>
          <p className="text-xs font-mono text-black/40 tracking-[0.2em] uppercase mt-2">
            {activeTab === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border border-black/10 mb-8">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 text-xs font-mono tracking-[0.15em] uppercase font-semibold transition-all duration-300 ${
              activeTab === "login"
                ? "bg-black text-white"
                : "bg-white text-black/40 hover:text-black"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 text-xs font-mono tracking-[0.15em] uppercase font-semibold transition-all duration-300 ${
              activeTab === "register"
                ? "bg-black text-white"
                : "bg-white text-black/40 hover:text-black"
            }`}
          >
            Register
          </button>
        </div>

        {/* Forms */}
        {activeTab === "login" && (
          <LoginForm onSwitch={() => setActiveTab("register")} />
        )}
        {activeTab === "register" && (
          <RegisterForm onSwitch={() => setActiveTab("login")} />
        )}

      </div>
    </div>
  );
}