// src/components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setSuccess(null);

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/sign-in/email`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed.");

      setSuccess("Logged in successfully! Redirecting...");
      setTimeout(() => router.push("/"), 1500);
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
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/50">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="border border-black/20 px-4 py-3 text-sm font-mono text-black placeholder:text-black/20 focus:outline-none focus:border-black transition-colors duration-200 bg-white"
        />
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full mt-2 py-3 bg-black text-white text-xs font-mono tracking-[0.15em] uppercase font-semibold hover:bg-white hover:text-black border border-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Sign In →"}
      </button>

      <p className="text-center text-xs font-mono text-black/30 mt-4 tracking-wide">
        No account?{" "}
        <button onClick={onSwitch} className="text-black underline underline-offset-4">
          Register here
        </button>
      </p>

    </div>
  );
}