// src/app/(admin)/admin/users/page.tsx
import { cookies } from "next/headers";

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

const getUsers = async (): Promise<User[]> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-features/get-all-user`, {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader,
      },
    });
    const data = await res.json();
    return data.result;
  } catch {
    return [];
  }
};

const roleBadge: Record<string, string> = {
  admin: "bg-black text-white",
  tutor: "bg-black/10 text-black",
  student: "bg-black/5 text-black/70",
};

export default async function AllUsersPage() {
  const users = await getUsers();

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm tracking-[0.3em] uppercase font-mono text-black/60 mb-2">
          Admin Panel
        </p>
        <div className="flex items-end justify-between border-b border-black/10 pb-6">
          <h1 className="text-4xl font-black tracking-tight text-black leading-none font-serif">
            All{" "}
            <span
              className="font-serif font-black"
              style={{ WebkitTextStroke: "1.5px black", color: "transparent" }}
            >
              Users.
            </span>
          </h1>
          <p className="text-base text-black/70 font-mono font-semibold">
            {users.length} total
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Students", count: users.filter((u) => u.roles === "student").length },
          { label: "Tutors", count: users.filter((u) => u.roles === "tutor").length },
          { label: "Admins", count: users.filter((u) => u.roles === "admin").length },
        ].map((stat) => (
          <div key={stat.label} className="border border-black/10 p-5">
            <p className="text-sm font-mono uppercase tracking-[0.2em] text-black/60 font-semibold">{stat.label}</p>
            <p className="text-3xl font-black font-serif text-black mt-1">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="border border-black/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/10 bg-black/2">
              <th className="text-left px-5 py-4 text-sm font-mono uppercase tracking-[0.2em] text-black/70 font-bold">User</th>
              <th className="text-left px-5 py-4 text-sm font-mono uppercase tracking-[0.2em] text-black/70 font-bold hidden md:table-cell">Email</th>
              <th className="text-left px-5 py-4 text-sm font-mono uppercase tracking-[0.2em] text-black/70 font-bold">Role</th>
              <th className="text-left px-5 py-4 text-sm font-mono uppercase tracking-[0.2em] text-black/70 font-bold hidden lg:table-cell">Joined</th>
              <th className="text-left px-5 py-4 text-sm font-mono uppercase tracking-[0.2em] text-black/70 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`border-b border-black/10 hover:bg-black/2 transition-colors duration-150 ${
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

                {/* Joined */}
                <td className="px-5 py-4 hidden lg:table-cell">
                  <p className="text-sm font-mono text-black/70">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </td>

                {/* Ban Status */}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}