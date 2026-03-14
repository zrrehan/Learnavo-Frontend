// src/app/(admin)/admin/bookings/page.tsx
import { cookies } from "next/headers";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  image: string | null;
  roles: string;
}

interface TutorProfile {
  id: string;
  subjects: string[];
  category: string;
  price: number;
  featured: boolean;
  user: UserInfo;
}

interface StudentProfile {
  id: string;
  userId: string;
  user: UserInfo;
}

interface Booking {
  id: string;
  completed: boolean;
  time: string;
  studentId: string;
  tutorId: string;
  tutorProfile: TutorProfile;
  studentProfile: StudentProfile;
}

const getBookings = async (): Promise<Booking[]> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin-features/view-all-bookings`,
      {
        cache: "no-store",
        headers: {
          Cookie: cookieHeader,
        },
      }
    );
    const data = await res.json();
    return data.result;
  } catch {
    return [];
  }
};

function Avatar({ user }: { user: UserInfo }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-black text-white flex items-center justify-center text-sm font-black shrink-0 overflow-hidden">
        {user.image ? (
          <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-serif">{user.name.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <div>
        <p className="text-base font-bold text-black font-serif leading-none">{user.name}</p>
        <p className="text-sm font-mono text-black/60 mt-1">{user.email}</p>
      </div>
    </div>
  );
}

export default async function BookingsPage() {
  const bookings = await getBookings();

  const completed = bookings.filter((b) => b.completed).length;
  const pending = bookings.filter((b) => !b.completed).length;

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm tracking-[0.3em] uppercase font-mono text-black/60 mb-2 font-semibold">
          Admin Panel
        </p>
        <div className="flex items-end justify-between border-b border-black/10 pb-6">
          <h1 className="text-4xl font-black tracking-tight text-black leading-none font-serif">
            All{" "}
            <span
              className="font-serif font-black"
              style={{ WebkitTextStroke: "1.5px black", color: "transparent" }}
            >
              Bookings.
            </span>
          </h1>
          <p className="text-base text-black/70 font-mono font-semibold">
            {bookings.length} total
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Total Bookings", count: bookings.length },
          { label: "Completed", count: completed },
          { label: "Pending", count: pending },
        ].map((stat) => (
          <div key={stat.label} className="border border-black/10 p-5">
            <p className="text-sm font-mono uppercase tracking-[0.2em] text-black/60 font-semibold">{stat.label}</p>
            <p className="text-3xl font-black font-serif text-black mt-1">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Bookings List */}
      <div className="flex flex-col gap-4">
        {bookings.map((booking, index) => (
          <div
            key={booking.id}
            className="border border-black/10 hover:border-black transition-all duration-200 p-6"
          >
            {/* Top Row — ID + Status + Time */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-sm font-mono text-black/60 tracking-widest uppercase mb-1 font-semibold">
                  Booking #{String(index + 1).padStart(2, "0")}
                </p>
                <p className="text-base font-mono text-black/70 font-semibold">{booking.time}</p>
              </div>
              <span className={`text-sm font-mono uppercase tracking-widest px-3 py-1 font-semibold shrink-0 ${
                booking.completed
                  ? "bg-black text-white"
                  : "bg-black/5 text-black/70"
              }`}>
                {booking.completed ? "Completed" : "Pending"}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-black/10 mb-5" />

            {/* Student + Tutor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Student */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-mono uppercase tracking-[0.2em] text-black/60 font-bold">
                  Student
                </p>
                <Avatar user={booking.studentProfile.user} />
              </div>

              {/* Tutor */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-mono uppercase tracking-[0.2em] text-black/60 font-bold">
                  Tutor
                </p>
                <Avatar user={booking.tutorProfile.user} />

                {/* Tutor extra info */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {booking.tutorProfile.subjects.map((s) => (
                    <span
                      key={s}
                      className="text-sm font-mono uppercase tracking-widest border border-black/20 px-2 py-1 text-black/70 font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                  <span className="text-sm font-mono uppercase tracking-widest border border-black/20 px-2 py-1 text-black/70 font-semibold capitalize">
                    {booking.tutorProfile.category}
                  </span>
                  <span className="text-sm font-mono uppercase tracking-widest border border-black/20 px-2 py-1 text-black/70 font-semibold">
                    ${booking.tutorProfile.price}/hr
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}