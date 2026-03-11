// src/components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";

type Role = "student" | "tutor" | "admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    roles: "student" as Role,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/sign-up/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          roles: form.roles,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed.");

      setSuccess("Account created! Switching to login...");
      setForm({ name: "", email: "", password: "", confirmPassword: "", roles: "student" });
      setTimeout(() => onSwitch(), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">

      {error && (
        <div className="border border-black/20 px-4 py-3">
          <p className="text-xs font-mono text-black/70">{error}</p>
        </div>
      )}
      {success && (
        <div className="border border-black bg-black px-4 py-3">
          <p className="text-xs font-mono text-white">{success}</p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/50">Full Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="John Doe"
          className="border border-black/20 px-4 py-3 text-sm font-mono text-black placeholder:text-black/20 focus:outline-none focus:border-black transition-colors duration-200 bg-white"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/50">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          className="border border-black/20 px-4 py-3 text-sm font-mono text-black placeholder:text-black/20 focus:outline-none focus:border-black transition-colors duration-200 bg-white"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/50">Role</label>
        <div className="flex gap-2">
          {(["student", "tutor", "admin"] as Role[]).map((role) => (
            <button
              key={role}
              onClick={() => setForm({ ...form, roles: role })}
              className={`flex-1 py-2.5 text-[11px] font-mono tracking-[0.1em] uppercase font-semibold border transition-all duration-200 ${
                form.roles === role
                  ? "bg-black text-white border-black"
                  : "bg-white text-black/40 border-black/20 hover:border-black hover:text-black"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/50">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
          className="border border-black/20 px-4 py-3 text-sm font-mono text-black placeholder:text-black/20 focus:outline-none focus:border-black transition-colors duration-200 bg-white"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/50">Confirm Password</label>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          placeholder="••••••••"
          onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          className="border border-black/20 px-4 py-3 text-sm font-mono text-black placeholder:text-black/20 focus:outline-none focus:border-black transition-colors duration-200 bg-white"
        />
      </div>

      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full mt-2 py-3 bg-black text-white text-xs font-mono tracking-[0.15em] uppercase font-semibold hover:bg-white hover:text-black border border-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Creating account..." : "Create Account →"}
      </button>

      <p className="text-center text-xs font-mono text-black/30 mt-4 tracking-wide">
        Already have an account?{" "}
        <button onClick={onSwitch} className="text-black underline underline-offset-4">
          Login here
        </button>
      </p>

    </div>
  );
}