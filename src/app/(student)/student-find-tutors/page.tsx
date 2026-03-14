// src/app/(student)/student/bookings/page.tsx
"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface TutorUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface Tutor {
  id: string;
  ratingSum: number;
  ratingCount: number;
  featured: boolean;
  subjects: string[];
  category: string;
  price: number;
  userId: string;
  user: TutorUser;
  reviews: { id: string; content: string }[];
}

export default function StudentBookingsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/public-features/tutor-profile-views`,
          { credentials: "include" }
        );
        const data = await res.json();
        setTutors(Array.isArray(data.result) ? data.result : []);
      } catch {
        Swal.fire({
          title: "Error",
          text: "Could not load tutors. Please try again.",
          icon: "error",
          confirmButtonColor: "#000000",
          customClass: { title: "!font-serif !font-black", popup: "!rounded-none" },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const getStudentProfileId = async (): Promise<string | null> => {
    try {
      // Get userId from session
      const sessionRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
        { credentials: "include" }
      );
      const sessionData = await sessionRes.json();
      const userId = sessionData?.user?.id;
      if (!userId) return null;

      // Convert userId to student profile id
      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get-id/student-user-to-profileid`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const profileData = await profileRes.json();
      return profileData?.result?.id ?? null;
    } catch {
      return null;
    }
  };

const handleBook = async (tutor: Tutor) => {
  const { value: formValues, isConfirmed } = await Swal.fire({
    title: `Book a Session`,
    html: `
      <p style="font-family: serif; font-weight: 900; font-size: 1.1rem; margin-bottom: 4px;">${tutor.user.name}</p>
      <p style="font-family: monospace; font-size: 0.72rem; color: #888; margin-bottom: 20px;">
        ${tutor.subjects.join(", ")} · ${tutor.category} · $${tutor.price}/hr
      </p>

      <div style="display: flex; flex-direction: column; gap: 12px; text-align: left;">

        <div>
          <label style="font-family: monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: #555; display: block; margin-bottom: 4px;">Date</label>
          <input
            id="swal-date"
            type="date"
            style="width: 100%; border: 1px solid rgba(0,0,0,0.2); padding: 10px 14px; font-family: monospace; font-size: 0.8rem; outline: none; box-sizing: border-box;"
          />
        </div>

        <div>
          <label style="font-family: monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: #555; display: block; margin-bottom: 4px;">Day</label>
          <select
            id="swal-day"
            style="width: 100%; border: 1px solid rgba(0,0,0,0.2); padding: 10px 14px; font-family: monospace; font-size: 0.8rem; outline: none; box-sizing: border-box; background: white;"
          >
            <option value="">Select day</option>
            <option>MONDAY</option>
            <option>TUESDAY</option>
            <option>WEDNESDAY</option>
            <option>THURSDAY</option>
            <option>FRIDAY</option>
            <option>SATURDAY</option>
            <option>SUNDAY</option>
          </select>
        </div>

        <div style="display: flex; gap: 10px;">
          <div style="flex: 1;">
            <label style="font-family: monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: #555; display: block; margin-bottom: 4px;">Start Time</label>
            <input
              id="swal-start"
              type="time"
              style="width: 100%; border: 1px solid rgba(0,0,0,0.2); padding: 10px 14px; font-family: monospace; font-size: 0.8rem; outline: none; box-sizing: border-box;"
            />
          </div>
          <div style="flex: 1;">
            <label style="font-family: monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: #555; display: block; margin-bottom: 4px;">End Time</label>
            <input
              id="swal-end"
              type="time"
              style="width: 100%; border: 1px solid rgba(0,0,0,0.2); padding: 10px 14px; font-family: monospace; font-size: 0.8rem; outline: none; box-sizing: border-box;"
            />
          </div>
        </div>

      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Confirm Booking",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#000000",
    customClass: {
      title: "!font-serif !font-black !text-black",
      popup: "!rounded-none",
    },
    preConfirm: () => {
      const date = (document.getElementById("swal-date") as HTMLInputElement)?.value;
      const day = (document.getElementById("swal-day") as HTMLSelectElement)?.value;
      const start = (document.getElementById("swal-start") as HTMLInputElement)?.value;
      const end = (document.getElementById("swal-end") as HTMLInputElement)?.value;

      if (!date) { Swal.showValidationMessage("Please select a date."); return false; }
      if (!day) { Swal.showValidationMessage("Please select a day."); return false; }
      if (!start) { Swal.showValidationMessage("Please enter a start time."); return false; }
      if (!end) { Swal.showValidationMessage("Please enter an end time."); return false; }

      // Format date from yyyy-mm-dd to mm/dd/yyyy
      const [year, month, dayNum] = date.split("-");
      const formattedDate = `${month}/${dayNum}/${year}`;

      // Format time to 12hr
      const formatTime = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        const ampm = h >= 12 ? "PM" : "AM";
        const hour = h % 12 || 12;
        return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
      };

      const time = `${formattedDate} ${day} ${formatTime(start)} - ${formatTime(end)}`;
      return time;
    },
  });

  if (!isConfirmed || !formValues) return;

  const time = formValues;

  setBookingLoading(tutor.id);

  const studentId = await getStudentProfileId();
  if (!studentId) {
    setBookingLoading(null);
    await Swal.fire({
      title: "Profile Not Found",
      text: "Could not retrieve your student profile. Please try again.",
      icon: "error",
      confirmButtonColor: "#000000",
      customClass: { title: "!font-serif !font-black", popup: "!rounded-none" },
    });
    return;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/book-session/book-session`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, tutorId: tutor.id, time }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Booking failed.");

    await Swal.fire({
      title: "Session Booked!",
      html: `
        <p style="font-family: monospace; font-size: 0.8rem; color: #555;">
          Your session with <strong>${tutor.user.name}</strong> has been booked for:
        </p>
        <p style="font-family: monospace; font-size: 0.85rem; font-weight: 700; margin-top: 8px;">${time}</p>
      `,
      icon: "success",
      confirmButtonColor: "#000000",
      customClass: { title: "!font-serif !font-black", popup: "!rounded-none" },
    });
  } catch (err: unknown) {
    await Swal.fire({
      title: "Booking Failed",
      text: err instanceof Error ? err.message : "Something went wrong.",
      icon: "error",
      confirmButtonColor: "#000000",
      customClass: { title: "!font-serif !font-black", popup: "!rounded-none" },
    });
  } finally {
    setBookingLoading(null);
  }
};

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm tracking-[0.3em] uppercase font-mono text-black/60 mb-2 font-semibold">
          Student Panel
        </p>
        <div className="flex items-end justify-between border-b border-black/10 pb-6">
          <h1 className="text-4xl font-black tracking-tight text-black leading-none font-serif">
            Book a{" "}
            <span
              className="font-serif font-black"
              style={{ WebkitTextStroke: "1.5px black", color: "transparent" }}
            >
              Session.
            </span>
          </h1>
          {!loading && (
            <p className="text-base text-black/70 font-mono font-semibold">
              {tutors.length} tutor{tutors.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-12">
          <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      )}

      {/* Tutor Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => {
            const rating = tutor.ratingCount > 0
              ? (tutor.ratingSum / tutor.ratingCount).toFixed(1)
              : "N/A";

            return (
              <div
                key={tutor.id}
                className="border border-black/10 hover:border-black transition-all duration-300 p-6 flex flex-col gap-4 relative"
              >
                {/* Featured Badge */}
                {tutor.featured && (
                  <span className="absolute top-4 right-4 text-[10px] tracking-[0.2em] uppercase font-mono text-black/30 border border-black/10 px-2 py-1">
                    Featured
                  </span>
                )}

                {/* Avatar + Name */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center text-lg font-black shrink-0 overflow-hidden">
                    {tutor.user.image ? (
                      <img src={tutor.user.image} alt={tutor.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-serif">{tutor.user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-black font-serif text-lg leading-none">{tutor.user.name}</h3>
                    <p className="text-xs text-black/50 font-mono mt-1">{tutor.user.email}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-black/10 w-full" />

                {/* Subjects */}
                <div className="flex flex-wrap gap-2">
                  {(tutor.subjects ?? []).map((subject) => (
                    <span key={subject} className="text-xs tracking-widest uppercase font-mono border border-black/20 px-2 py-1 text-black/70">
                      {subject}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-black/50 uppercase tracking-widest font-mono">Rating</span>
                    <span className="text-black font-black font-serif text-xl">{rating}<span className="text-black/30 text-sm font-normal">{tutor.ratingCount > 0 ? " /5" : ""}</span></span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xs text-black/50 uppercase tracking-widest font-mono">Mode</span>
                    <span className="text-black font-black font-serif text-xl capitalize">{tutor.category}</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-xs text-black/50 uppercase tracking-widest font-mono">Price</span>
                    <span className="text-black font-black font-serif text-xl">${tutor.price}<span className="text-black/30 text-sm font-normal"> /hr</span></span>
                  </div>
                </div>

                {/* Reviews count */}
                {(tutor.reviews ?? []).length > 0 && (
                  <p className="text-xs font-mono text-black/40 tracking-widest uppercase">
                    {tutor.reviews.length} review{tutor.reviews.length > 1 ? "s" : ""}
                  </p>
                )}

                {/* Book Button */}
                <button
                  onClick={() => handleBook(tutor)}
                  disabled={bookingLoading === tutor.id}
                  className="w-full mt-auto btn btn-sm rounded-none border border-black bg-black text-white text-xs tracking-[0.15em] uppercase font-semibold hover:bg-white hover:text-black transition-all duration-300 font-mono py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {bookingLoading === tutor.id ? "Booking..." : "Book Session →"}
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}