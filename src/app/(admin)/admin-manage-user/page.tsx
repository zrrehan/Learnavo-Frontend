// src/app/(admin)/admin/manage-users/page.tsx
"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  roles: string;
  isBan: boolean;
}

const roleBadge: Record<string, string> = {
  admin: "bg-black text-white",
  tutor: "bg-black/10 text-black",
  student: "bg-black/5 text-black/70",
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin-features/get-all-user`,
        { credentials: "include", cache: "no-store" }
      );
      const data = await res.json();
      setUsers(Array.isArray(data.result) ? data.result : []);
    } catch {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBan = async (user: User) => {
    const action = user.isBan ? "Unban" : "Ban";
    const actionLower = action.toLowerCase();

    const result = await Swal.fire({
      title: `${action} ${user.name}?`,
      text: user.isBan
        ? `This will restore ${user.name}'s access to the platform.`
        : `This will block ${user.name} from accessing the platform.`,
      icon: user.isBan ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionLower}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: "#000000",
      cancelButtonColor: "#ffffff",
      customClass: {
        cancelButton: "!text-black !border !border-black/20",
        title: "!font-serif !font-black !text-black",
        popup: "!rounded-none",
      },
    });

    if (!result.isConfirmed) return;

    setActionLoading(user.id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin-features/ban-user`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user.id, isBan: !user.isBan }),
        }
      );

      if (!res.ok) throw new Error("Action failed.");

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isBan: !u.isBan } : u))
      );

      await Swal.fire({
        title: user.isBan ? "Unbanned!" : "Banned!",
        text: user.isBan
          ? `${user.name} has been unbanned successfully.`
          : `${user.name} has been banned successfully.`,
        icon: "success",
        confirmButtonColor: "#000000",
        customClass: {
          title: "!font-serif !font-black !text-black",
          popup: "!rounded-none",
        },
      });
    } catch {
      await Swal.fire({
        title: "Error",
        text: "Failed to update user. Please try again.",
        icon: "error",
        confirmButtonColor: "#000000",
        customClass: {
          title: "!font-serif !font-black !text-black",
          popup: "!rounded-none",
        },
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm tracking-[0.3em] uppercase font-mono text-black/60 mb-2 font-semibold">
          Admin Panel
        </p>
        <div className="flex items-end justify-between border-b border-black/10 pb-6">
          <h1 className="text-4xl font-black tracking-tight text-black leading-none font-serif">
            Manage{" "}
            <span
              className="font-serif font-black"
              style={{ WebkitTextStroke: "1.5px black", color: "transparent" }}
            >
              Users.
            </span>
          </h1>
          {!loading && (
            <p className="text-base text-black/70 font-mono font-semibold">
              {users.length} total
            </p>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="border border-black/20 px-4 py-3 mb-6">
          <p className="text-sm font-mono text-black/70">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-12">
          <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="border border-black/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.02]">
                <th className="text-left px-5 py-4 text-sm font-mono uppercase tracking-[0.2em] text-black/70 font-bold">User</th>
                <th className="text-left px-5 py-4 text-sm font-mono uppercase tracking-[0.2em] text-black/70 font-bold hidden md:table-cell">Email</th>
                <th className="text-left px-5 py-4 text-sm font-mono uppercase tracking-[0.2em] text-black/70 font-bold">Role</th>
                <th className="text-left px-5 py-4 text-sm font-mono uppercase tracking-[0.2em] text-black/70 font-bold">Status</th>
                <th className="text-left px-5 py-4 text-sm font-mono uppercase tracking-[0.2em] text-black/70 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b border-black/10 hover:bg-black/[0.02] transition-colors duration-150 ${
                    index === users.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  {/* Avatar + Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black text-white flex items-center justify-center text-sm font-black shrink-0 overflow-hidden">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-serif">{user.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-base font-bold text-black font-serif">{user.name}</p>
                        <p className="text-sm font-mono text-black/60 md:hidden">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm font-mono text-black/70">{user.email}</p>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <span className={`text-sm font-mono uppercase tracking-widest px-3 py-1 font-semibold ${roleBadge[user.roles] ?? "bg-black/5 text-black/70"}`}>
                      {user.roles}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    {user.isBan ? (
                      <span className="text-sm font-mono uppercase tracking-widest px-3 py-1 bg-black text-white font-semibold">
                        Banned
                      </span>
                    ) : (
                      <span className="text-sm font-mono uppercase tracking-widest px-3 py-1 bg-black/5 text-black/70 font-semibold">
                        Active
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleBan(user)}
                      disabled={actionLoading === user.id}
                      className="text-sm font-mono uppercase tracking-widest px-4 py-1.5 font-semibold border border-black/20 text-black/70 hover:bg-black hover:text-white hover:border-black transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {actionLoading === user.id
                        ? "..."
                        : user.isBan
                        ? "Unban"
                        : "Ban"}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}