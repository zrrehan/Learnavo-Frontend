// src/components/browse/BrowseFilters.tsx
"use client";

interface Filters {
  subjects: string;
  lowerRating: string;
  higherRating: string;
  lowerPrice: string;
  higherPrice: string;
  category: string;
}

interface BrowseFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

const CATEGORIES = ["", "online", "offline", "hybrid"];
const SUBJECTS = ["", "math", "physics", "chemistry", "biology", "bangla", "english"];

export default function BrowseFilters({ filters, onChange, onReset }: BrowseFiltersProps) {
  const handleChange = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white border-b border-black/10 px-6 py-4 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] tracking-[0.3em] uppercase font-mono text-black/40">
            Filter Tutors
          </p>
          <button
            onClick={onReset}
            className="text-[15px] tracking-[0.2em] uppercase font-mono  hover:text-black transition-colors duration-200 border border-black/10 hover:border-black px-3 py-1"
          >
            Reset
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3">

          {/* Subject */}
          <select
            value={filters.subjects}
            onChange={(e) => handleChange("subjects", e.target.value)}
            className="text-xs font-mono uppercase tracking-widest border border-black/20 bg-white text-black/60 px-3 py-2 focus:outline-none focus:border-black transition-colors duration-200"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s === "" ? "All Subjects" : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="text-xs font-mono uppercase tracking-widest border border-black/20 bg-white text-black/60 px-3 py-2 focus:outline-none focus:border-black transition-colors duration-200"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "" ? "All Modes" : c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          {/* Price Range */}
          <div className="flex items-center gap-2 border border-black/20 px-3 py-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-black/30">Price</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.lowerPrice}
              onChange={(e) => handleChange("lowerPrice", e.target.value)}
              className="w-14 text-xs font-mono text-black/60 bg-transparent focus:outline-none placeholder:text-black/20"
            />
            <span className="text-black/20 font-mono text-xs">—</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.higherPrice}
              onChange={(e) => handleChange("higherPrice", e.target.value)}
              className="w-14 text-xs font-mono text-black/60 bg-transparent focus:outline-none placeholder:text-black/20"
            />
          </div>

          {/* Rating Range */}
          <div className="flex items-center gap-2 border border-black/20 px-3 py-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-black/30">Rating</span>
            <input
              type="number"
              placeholder="Min"
              min="0"
              max="5"
              value={filters.lowerRating}
              onChange={(e) => handleChange("lowerRating", e.target.value)}
              className="w-14 text-xs font-mono text-black/60 bg-transparent focus:outline-none placeholder:text-black/20"
            />
            <span className="text-black/20 font-mono text-xs">—</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              max="5"
              value={filters.higherRating}
              onChange={(e) => handleChange("higherRating", e.target.value)}
              className="w-14 text-xs font-mono text-black/60 bg-transparent focus:outline-none placeholder:text-black/20"
            />
          </div>

        </div>
      </div>
    </div>
  );
}