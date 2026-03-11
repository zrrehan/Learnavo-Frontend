// src/app/browse-tutor/page.tsx
"use client";

import BrowseFilters from "@/components/browse-tutor/BrowseFilter";
import BrowseTutorCard, { Tutor } from "@/components/browse-tutor/BrowseTutorCard";
import { useEffect, useState, useCallback } from "react";

const DEFAULT_FILTERS = {
  subjects: "",
  lowerRating: "",
  higherRating: "",
  lowerPrice: "",
  higherPrice: "",
  category: "",
};

export default function BrowseTutorPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const fetchTutors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const body: Record<string, string | string[]> = {};
      if (filters.subjects) body.subjects = [filters.subjects];
      if (filters.lowerRating) body.lowerRating = filters.lowerRating;
      if (filters.higherRating) body.higherRating = filters.higherRating;
      if (filters.lowerPrice) body.lowerPrice = filters.lowerPrice;
      if (filters.higherPrice) body.higherPrice = filters.higherPrice;
      if (filters.category) body.category = filters.category;

      const res = await fetch("http://localhost:8080/public-features/tutor-browse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to fetch tutors");
      const data = await res.json();
      setTutors(data.result);
    } catch {
      setError("Could not load tutors. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  return (
    <div className="min-h-screen bg-white">

      {/* Filter Navbar */}
      <BrowseFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase font-mono text-black/60 mb-3">
            Explore
          </p>
          <div className="flex items-end justify-between border-b border-black/10 pb-6">
            <h1 className="text-5xl font-black tracking-tight text-black leading-none font-serif">
              Browse{" "}
              <span
                className="font-serif font-black"
                style={{ WebkitTextStroke: "1.5px black", color: "transparent" }}
              >
                Tutors.
              </span>
            </h1>
            {!loading && (
              <p className="text-sm text-black/60 font-mono font-semibold">
                {tutors.length} tutor{tutors.length !== 1 ? "s" : ""} found
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

        {/* Error */}
        {error && (
          <div className="border border-black/10 p-6">
            <p className="text-sm text-black/70 font-mono font-semibold">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && tutors.length === 0 && (
          <div className="border border-black/10 p-12 text-center">
            <p className="text-2xl font-black font-serif text-black/40">No tutors found.</p>
            <p className="text-sm font-mono text-black/50 mt-2 font-semibold">Try adjusting your filters.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && tutors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <BrowseTutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}