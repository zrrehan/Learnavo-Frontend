// src/app/(tutor)/tutor/sessions/page.tsx
"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface StudentUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface StudentProfile {
  id: string;
  userId: string;
  user: StudentUser;
}

interface Session {
  id: string;
  completed: boolean;
  time: string;
  studentId: string;
  tutorId: string;
  studentProfile: StudentProfile;
}

export default function TutorSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [markLoading, setMarkLoading] = useState<string | null>(null);

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

  const handleMarkComplete = async (session: Session) => {
    const result = await Swal.fire({
      title: "Mark as Complete?",
      text: `This will mark the session with ${session.studentProfile.user.name} as completed.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, mark complete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#000000",
      customClass: {
        title: "!font-serif !font-black !text-black",
        popup: "!rounded-none",
      },
    });

    if (!result.isConfirmed) return;

    setMarkLoading(session.id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/book-session/mark-complete?sessionId=${session.id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to mark session complete.");

      setSessions((prev) =>
        prev.map((s) => (s.id === session.id ? { ...s, completed: true } : s))
      );

      await Swal.fire({
        title: "Session Completed!",
        text: `The session with ${session.studentProfile.user.name} has been marked as complete.`,
        icon: "success",
        confirmButtonColor: "#000000",
        customClass: { title: "!font-serif !font-black", popup: "!rounded-none" },
      });
    } catch (err: unknown) {
      await Swal.fire({
        title: "Failed",
        text: err instanceof Error ? err.message : "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#000000",
        customClass: { title: "!font-serif !font-black", popup: "!rounded-none" },
      });
    } finally {
      setMarkLoading(null);
    }
  };

  const completed = sessions.filter((s) => s.completed).length;
  const pending = sessions.filter((s) => !s.completed).length;

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm tracking-[0.3em] uppercase font-mono text-black/60 mb-2 font-semibold">
          Tutor Panel
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
          <p className="text-sm font-mono text-black/40 mt-2 font-semibold">
            Sessions booked by students will appear here.
          </p>
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

                {/* Student info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center text-lg font-black shrink-0 overflow-hidden">
                    {session.studentProfile.user.image ? (
                      <img
                        src={session.studentProfile.user.image}
                        alt={session.studentProfile.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-serif">
                        {session.studentProfile.user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-mono text-black/60 tracking-widest uppercase font-semibold">
                      Session #{String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="text-base font-black text-black font-serif leading-none">
                      {session.studentProfile.user.name}
                    </p>
                    <p className="text-xs font-mono text-black/50">
                      {session.studentProfile.user.email}
                    </p>
                    <p className="text-sm font-mono text-black/70 font-semibold mt-1">
                      {session.time}
                    </p>
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

                  {!session.completed && (
                    <button
                      onClick={() => handleMarkComplete(session)}
                      disabled={markLoading === session.id}
                      className="text-sm font-mono uppercase tracking-widest px-4 py-1.5 font-semibold border border-black/20 text-black/70 hover:bg-black hover:text-white hover:border-black transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {markLoading === session.id ? "Updating..." : "Mark Complete"}
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