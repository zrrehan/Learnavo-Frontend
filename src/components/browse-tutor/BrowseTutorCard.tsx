// src/components/browse/BrowseTutorCard.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

interface StudentUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface StudentId {
  id: string;
  userId: string;
  user: StudentUser;
}

interface Review {
  id: string;
  content: string;
  tutorProfileId: string;
  studentUserId: string;
  studentId: StudentId;
}

export interface Tutor {
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
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5"
          fill={star <= Math.round(rating) ? "black" : "none"}
          stroke="black"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      ))}
    </div>
  );
}

export default function BrowseTutorCard({ tutor }: { tutor: Tutor }) {
  const [showReviews, setShowReviews] = useState(false);

  const rating = tutor.ratingCount > 0 ? tutor.ratingSum / tutor.ratingCount : 0;
  const ratingDisplay = tutor.ratingCount > 0 ? rating.toFixed(1) : "N/A";

  return (
    <div className="group border border-black/10 bg-white hover:border-black transition-all duration-300 p-6 flex flex-col gap-4 relative overflow-hidden">

      {/* Featured Badge */}
      {tutor.featured && (
        <span className="absolute top-4 right-4 text-[10px] tracking-[0.2em] uppercase font-mono text-black/30 border border-black/10 px-2 py-1">
          Featured
        </span>
      )}

      {/* Avatar + Name */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-black text-white flex items-center justify-center text-xl font-black shrink-0 overflow-hidden relative">
          {tutor.user.image ? (
            <img src={tutor.user.image} alt={tutor.user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-serif">{tutor.user.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div>
          <h3 className="font-black text-black tracking-tight font-serif text-lg leading-none">
            {tutor.user.name}
          </h3>
          <p className="text-xs text-black/60 font-mono mt-1">{tutor.user.email}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black/10 w-full" />

      {/* Subjects */}
      <div className="flex flex-wrap gap-2">
        {tutor.subjects.map((subject) => (
          <span
            key={subject}
            className="text-[11px] tracking-[0.15em] uppercase font-mono border border-black/30 px-2 py-1 text-black/80"
          >
            {subject}
          </span>
        ))}
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-black/60 uppercase tracking-widest font-mono font-semibold">Rating</span>
          <span className="text-black font-black font-serif text-xl leading-tight">
            {ratingDisplay}
            {tutor.ratingCount > 0 && <span className="text-black/30 text-sm font-normal"> /5</span>}
          </span>
          {tutor.ratingCount > 0 && <StarRating rating={rating} />}
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] text-black/60 uppercase tracking-widest font-mono font-semibold">Mode</span>
          <span className="text-black font-black font-serif text-xl leading-tight capitalize">
            {tutor.category}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[11px] text-black/60 uppercase tracking-widest font-mono font-semibold">Price</span>
          <span className="text-black font-black font-serif text-xl leading-tight">
            ${tutor.price}
            <span className="text-black/30 text-sm font-normal"> /hr</span>
          </span>
        </div>
      </div>

      {/* Reviews Toggle */}
      {tutor.reviews.length > 0 && (
        <div className="border-t border-black/10 pt-4">
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="flex items-center justify-between w-full text-left group/rev"
          >
            <span className="text-[11px] font-mono uppercase tracking-widest text-black/60 font-semibold group-hover/rev:text-black transition-colors duration-200">
              {tutor.reviews.length} Review{tutor.reviews.length > 1 ? "s" : ""}
            </span>
            <span
              className="text-black/40 font-mono text-xs transition-transform duration-300 group-hover/rev:text-black inline-block"
              style={{ transform: showReviews ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ▼
            </span>
          </button>

          {/* Reviews List */}
          {showReviews && (
            <div className="mt-3 flex flex-col gap-4 max-h-52 overflow-y-auto pr-1">
              {tutor.reviews.map((review) => (
                <div key={review.id} className="flex gap-3">

                  {/* Student Avatar */}
                  <div className="w-8 h-8 bg-black/10 text-black flex items-center justify-center text-xs font-black shrink-0 overflow-hidden">
                    {review.studentId.user.image ? (
                      <img
                        src={review.studentId.user.image}
                        alt={review.studentId.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-serif">
                        {review.studentId.user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-black/80 font-mono tracking-wide">
                      {review.studentId.user.name}
                    </p>
                    <p className="text-xs text-black/60 leading-relaxed">
                      {review.content}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <Link
        href={`/browse-tutor/${tutor.id}`}
        className="w-full mt-auto btn btn-sm rounded-none border border-black bg-white text-black text-xs tracking-[0.15em] uppercase font-semibold hover:bg-black hover:text-white transition-all duration-300 font-mono text-center py-2"
      >
        View Profile →
      </Link>

    </div>
  );
}