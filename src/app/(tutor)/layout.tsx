// src/app/(tutor)/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import BanAlert from "@/components/BanAlert";

const tutorItems = [
  {
    label: "Add Time",
    href: "/tutor-add-time",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "My Sessions",
    href: "/tutor-browse-all-session",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Ratings & Reviews",
    href: "/tutor-all-review",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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
    console.log("Tutor layout session:", JSON.stringify(session, null, 2));
    return session;
  } catch (error) {
    console.log("Session error:", error);
    return null;
  }
};

const createTutorProfile = async (userId: string, cookieHeader: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tutor-profile/post-profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        body: JSON.stringify({
          userId,
          availableTime: [],
        }),
      }
    );
    const data = await res.json();
    console.log("Tutor profile creation:", JSON.stringify(data, null, 2));
  } catch (error) {
    // Silently ignore — duplicate profile error expected on subsequent visits
    console.log("Tutor profile note:", error);
  }
};

export default async function TutorLayout({
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

  if (!user) redirect("/auth");
  if (user.roles !== "tutor") redirect("/");
  if (user.isBan) return <BanAlert />;

  // Create tutor profile on every layout load — silently ignores duplicate
  await createTutorProfile(user.id, cookieHeader);

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar items={tutorItems} title="Tutor Panel" />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}