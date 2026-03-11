// Featured.tsx
"use client";

import { useEffect, useState } from "react";
import TutorCard from "./featured/TutorCard";


interface Tutor {
  id: string;
  ratingSum: number;
  ratingCount: number;
  featured: boolean;
  subjects: string[];
  category: string;
  price: number;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export default function Featured() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedTutors = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/public-features/tutor-profile-views?featured=true`
        );
        if (!res.ok) throw new Error("Failed to fetch tutors");
        const data = await res.json();
        setTutors(data.result);
      } catch (err) {
        setError("Could not load featured tutors.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTutors();
  }, []);

  return (
    <section className="bg-white py-24 px-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16">
        <p className="text-xs tracking-[0.3em] uppercase [font-family:monospace] text-black/40 mb-4">
          Top Educators
        </p>
        <div className="flex items-end justify-between gap-6 border-b border-black/10 pb-8">
          <h2 className="text-5xl font-black tracking-tight text-black leading-none [font-family:'Georgia',serif]">
            Featured{" "}
            <span
              className="[font-family:'Georgia',serif] font-black"
              style={{ WebkitTextStroke: "1.5px black", color: "transparent" }}
            >
              Tutors.
            </span>
          </h2>
          <p className="text-sm text-black/50 max-w-xs text-right leading-relaxed hidden sm:block">
            Handpicked educators with proven results and top student ratings.
          </p>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      )}

      {error && (
        <div className="max-w-6xl mx-auto border border-black/10 p-6">
          <p className="text-sm text-black/40 [font-family:monospace]">{error}</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      )}
    </section>
  );
}