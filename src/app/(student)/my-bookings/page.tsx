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

interface TutorProfile {
  id: string;
  subjects: string[];
  category: string;
  price: number;
  featured: boolean;
  user: TutorUser;
}

interface Session {
  id: string;
  completed: boolean;
  time: string;
  studentId: string;
  tutorId: string;
  tutorProfile: TutorProfile;
}

export default function StudentSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/book-session/get-tuition-sessions`,
          { credentials: "include" }
        );
        const data = await res.json();
        setSessions(Array.isArray(data.result) ? data.result : []);
      } catch {
        Swal.fire({
          title: "Error",
          text: "Could not load sessions.",
          icon: "error",
          confirmButtonColor: "#000000",
          customClass: { title: "!font-serif !font-black", popup: "!rounded-none" },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const getStudentProfileId = async (): Promise<string | null> => {
    try {
      const sessionRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
        { credentials: "include" }
      );
      const sessionData = await sessionRes.json();
      const userId = sessionData?.user?.id;
      if (!userId) return null;

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

  const handleReview = async (session: Session) => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: "Leave a Review",
      html: `
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
          <div style="width:40px; height:40px; background:#000; color:#fff; display:flex; align-items:center; justify-content:center; font-family:serif; font-weight:900; font-size:1rem; overflow:hidden; flex-shrink:0;">
            ${session.tutorProfile.user.image
              ? `<img src="${session.tutorProfile.user.image}" style="width:100%;height:100%;object-fit:cover;" />`
              : session.tutorProfile.user.name.charAt(0).toUpperCase()
            }
          </div>
          <div style="text-align:left;">
            <p style="font-family:serif; font-weight:900; font-size:1rem; margin:0;">${session.tutorProfile.user.name}</p>
            <p style="font-family:monospace; font-size:0.7rem; color:#888; margin:2px 0 0;">${session.time}</p>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:14px; text-align:left;">
          <div>
            <label style="font-family:monospace; font-size:0.7rem; text-transform:uppercase; letter-spacing:0.15em; color:#555; display:block; margin-bottom:4px;">Rating</label>
            <select id="swal-rating" style="width:100%; border:1px solid rgba(0,0,0,0.2); padding:10px 14px; font-family:monospace; font-size:0.8rem; outline:none; box-sizing:border-box; background:white;">
              <option value="">Select rating</option>
              <option value="1">⭐ 1 — Poor</option>
              <option value="2">⭐⭐ 2 — Fair</option>
              <option value="3">⭐⭐⭐ 3 — Good</option>
              <option value="4">⭐⭐⭐⭐ 4 — Great</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 — Excellent</option>
            </select>
          </div>
          <div>
            <label style="font-family:monospace; font-size:0.7rem; text-transform:uppercase; letter-spacing:0.15em; color:#555; display:block; margin-bottom:4px;">Review</label>
            <textarea id="swal-content" placeholder="Share your experience with this tutor..." rows="4"
              style="width:100%; border:1px solid rgba(0,0,0,0.2); padding:10px 14px; font-family:monospace; font-size:0.8rem; outline:none; box-sizing:border-box; resize:none;"
            ></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Submit Review",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#000000",
      customClass: {
        title: "!font-serif !font-black !text-black",
        popup: "!rounded-none",
      },
      preConfirm: () => {
        const rating = (document.getElementById("swal-rating") as HTMLSelectElement)?.value;
        const content = (document.getElementById("swal-content") as HTMLTextAreaElement)?.value;
        if (!rating) { Swal.showValidationMessage("Please select a rating."); return false; }
        if (!content || content.trim() === "") { Swal.showValidationMessage("Please write a review."); return false; }
        return { rating: Number(rating), content: content.trim() };
      },
    });

    if (!isConfirmed || !formValues) return;

    setReviewLoading(session.id);

    const sessionRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
      { credentials: "include" }
    );
    const sessionData = await sessionRes.json();
    const studentId = sessionData?.user?.id;

    if (!studentId) {
      setReviewLoading(null);
      await Swal.fire({
        title: "Profile Not Found",
        text: "Could not retrieve your student profile.",
        icon: "error",
        confirmButtonColor: "#000000",
        customClass: { title: "!font-serif !font-black", popup: "!rounded-none" },
      });
      return;
    }

    try {
      console.log({
            content: formValues.content,
            tutorProfileId: session.tutorId,
            studentId,
            rating: formValues.rating,
          })
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tutor-review/post-review`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: formValues.content,
            tutorProfileId: session.tutorId,
            studentId,
            rating: formValues.rating,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Review failed.");

      await Swal.fire({
        title: "Review Submitted!",
        text: "Thank you for your feedback.",
        icon: "success",
        confirmButtonColor: "#000000",
        customClass: { title: "!font-serif !font-black", popup: "!rounded-none" },
      });
    } catch (err: unknown) {
      await Swal.fire({
        title: "Submission Failed",
        text: err instanceof Error ? err.message : "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#000000",
        customClass: { title: "!font-serif !font-black", popup: "!rounded-none" },
      });
    } finally {
      setReviewLoading(null);
    }
  };

  const completed = sessions.filter((s) => s.completed).length;
  const pending = sessions.filter((s) => !s.completed).length;

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm tracking-[0.3em] uppercase font-mono text-black/60 mb-2 font-semibold">
          Student Panel
        </p>
        <div className="flex items-end justify-between border-b border-black/10 pb-6">
          <h1 className="text-4xl font-black tracking-tight text-black leading-none font-serif">
            My{" "}
            <span
              className="font-serif font-black"
              style={{ WebkitTextStroke: "1.5px black", color: "transparent" }}
            >
              Sessions.
            </span>
          </h1>
          {!loading && (
            <p className="text-base text-black/70 font-mono font-semibold">
              {sessions.length} total
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total", count: sessions.length },
            { label: "Completed", count: completed },
            { label: "Pending", count: pending },
          ].map((stat) => (
            <div key={stat.label} className="border border-black/10 p-5">
              <p className="text-sm font-mono uppercase tracking-[0.2em] text-black/60 font-semibold">{stat.label}</p>
              <p className="text-3xl font-black font-serif text-black mt-1">{stat.count}</p>
            </div>
          ))}
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

      {/* Empty */}
      {!loading && sessions.length === 0 && (
        <div className="border border-black/10 p-12 text-center">
          <p className="text-2xl font-black font-serif text-black/30">No sessions yet.</p>
          <p className="text-sm font-mono text-black/40 mt-2 font-semibold">Book a session to get started.</p>
        </div>
      )}

      {/* Sessions List */}
      {!loading && sessions.length > 0 && (
        <div className="flex flex-col gap-4">
          {sessions.map((session, index) => (
            <div
              key={session.id}
              className="border border-black/10 hover:border-black transition-all duration-200 p-6"
            >
              <div className="flex items-start justify-between gap-4">

                {/* Tutor info + session details */}
                <div className="flex items-start gap-4">
                  {/* Tutor Avatar */}
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center text-lg font-black shrink-0 overflow-hidden">
                    {session.tutorProfile.user.image ? (
                      <img
                        src={session.tutorProfile.user.image}
                        alt={session.tutorProfile.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-serif">
                        {session.tutorProfile.user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-mono text-black/60 tracking-widest uppercase font-semibold">
                      Session #{String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="text-base font-black text-black font-serif leading-none">
                      {session.tutorProfile.user.name}
                    </p>
                    <p className="text-xs font-mono text-black/50">
                      {session.tutorProfile.user.email}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {session.tutorProfile.subjects.map((s) => (
                        <span key={s} className="text-xs font-mono uppercase tracking-widest border border-black/20 px-2 py-0.5 text-black/60">
                          {s}
                        </span>
                      ))}
                      <span className="text-xs font-mono uppercase tracking-widest border border-black/20 px-2 py-0.5 text-black/60 capitalize">
                        {session.tutorProfile.category}
                      </span>
                      <span className="text-xs font-mono uppercase tracking-widest border border-black/20 px-2 py-0.5 text-black/60">
                        ${session.tutorProfile.price}/hr
                      </span>
                    </div>
                    <p className="text-sm font-mono text-black/70 font-semibold mt-1">{session.time}</p>
                  </div>
                </div>

                {/* Status + Action */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <span className={`text-sm font-mono uppercase tracking-widest px-3 py-1 font-semibold ${
                    session.completed
                      ? "bg-black text-white"
                      : "bg-black/5 text-black/60"
                  }`}>
                    {session.completed ? "Completed" : "Pending"}
                  </span>

                  {session.completed && (
                    <button
                      onClick={() => handleReview(session)}
                      disabled={reviewLoading === session.id}
                      className="text-sm font-mono uppercase tracking-widest px-4 py-1.5 font-semibold border border-black/20 text-black/70 hover:bg-black hover:text-white hover:border-black transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {reviewLoading === session.id ? "Submitting..." : "Leave Review"}
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}