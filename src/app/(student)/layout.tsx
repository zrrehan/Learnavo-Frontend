// src/app/(student)/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import BanAlert from "@/components/BanAlert";

const studentItems = [
  {
    label: "Find Tutors",
    href: "/student-find-tutors",
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
  },
  {
    label: "My Bookings",
    href: "/student/bookings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  
];

const getSession = async () => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`, {
      headers: { Cookie: cookieHeader },
      cache: "no-cache",
    });

    const session = await res.json();
    console.log("Student layout session:", JSON.stringify(session, null, 2));
    return session;
  } catch (error) {
    console.log("Session error:", error);
    return null;
  }
};

const createStudentProfile = async (userId: string, cookieHeader: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/book-session/create-student-profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        body: JSON.stringify({ userId }),
      }
    );
    const data = await res.json();
    console.log("Student profile creation:", JSON.stringify(data, null, 2));
  } catch (error) {
    // Silently ignore — duplicate profile error is expected on subsequent visits
    console.log("Student profile note:", error);
  }
};

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const session = await getSession();
  const user = session?.user ?? null;

  // Not logged in
  if (!user) redirect("/auth");

  // Not student
  if (user.roles !== "student") redirect("/");

  // Banned
  if (user.isBan) return <BanAlert />;

  // Create student profile (silently ignores duplicate)
  await createStudentProfile(user.id, cookieHeader);

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar items={studentItems} title="Student Panel" />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}