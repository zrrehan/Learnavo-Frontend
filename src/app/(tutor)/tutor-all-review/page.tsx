// src/app/(tutor)/tutor/reviews/page.tsx
import { cookies } from "next/headers";

interface TutorProfile {
  id: string;
  ratingSum: number;
  ratingCount: number;
  featured: boolean;
  subjects: string[];
  category: string;
  price: number;
  userId: string;
}

interface Review {
  id: string;
  content: string;
  tutorProfileId: string;
  studentUserId: string;
  tutorProfile: TutorProfile;
}

const getData = async () => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    // Step 1 — get session to get userId
    const sessionRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
      { headers: { Cookie: cookieHeader }, cache: "no-cache" }
    );
    const sessionData = await sessionRes.json();
    const userId = sessionData?.user?.id;
    if (!userId) return { reviews: [], profile: null };

    // Step 2 — convert userId to tutor profile id
    const profileRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/get-id/tutor-user-to-profileid`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: cookieHeader },
        body: JSON.stringify({ userId }),
      }
    );
    const profileData = await profileRes.json();
    const tutorProfileId = profileData?.result?.id;
    const profile = profileData?.result ?? null;
    if (!tutorProfileId) return { reviews: [], profile: null };

    // Step 3 — get reviews
    const reviewsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tutor-review/get-reviews?id=${tutorProfileId}`,
      { headers: { Cookie: cookieHeader }, cache: "no-store" }
    );
    const reviewsData = await reviewsRes.json();
    return {
      reviews: Array.isArray(reviewsData.result) ? reviewsData.result : [],
      profile,
    };
  } catch {
    return { reviews: [], profile: null };
  }
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-4 h-4"
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

export default async function TutorReviewsPage() {
  const { reviews, profile } = await getData();

  const avgRating = profile && profile.ratingCount > 0
    ? (profile.ratingSum / profile.ratingCount).toFixed(1)
    : "N/A";

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm tracking-[0.3em] uppercase font-mono text-black/60 mb-2 font-semibold">
          Tutor Panel
        </p>
        <div className="flex items-end justify-between border-b border-black/10 pb-6">
          <h1 className="text-4xl font-black tracking-tight text-black leading-none font-serif">
            Ratings &{" "}
            <span
              className="font-serif font-black"
              style={{ WebkitTextStroke: "1.5px black", color: "transparent" }}
            >
              Reviews.
            </span>
          </h1>
          <p className="text-base text-black/70 font-mono font-semibold">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      {profile && (
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="border border-black/10 p-5">
            <p className="text-sm font-mono uppercase tracking-[0.2em] text-black/60 font-semibold">Avg Rating</p>
            <p className="text-3xl font-black font-serif text-black mt-1">{avgRating}</p>
            {profile.ratingCount > 0 && (
              <div className="mt-2">
                <StarRating rating={profile.ratingSum / profile.ratingCount} />
              </div>
            )}
          </div>
          <div className="border border-black/10 p-5">
            <p className="text-sm font-mono uppercase tracking-[0.2em] text-black/60 font-semibold">Total Ratings</p>
            <p className="text-3xl font-black font-serif text-black mt-1">{profile.ratingCount}</p>
          </div>
          <div className="border border-black/10 p-5">
            <p className="text-sm font-mono uppercase tracking-[0.2em] text-black/60 font-semibold">Reviews</p>
            <p className="text-3xl font-black font-serif text-black mt-1">{reviews.length}</p>
          </div>
        </div>
      )}

      {/* Empty */}
      {reviews.length === 0 && (
        <div className="border border-black/10 p-12 text-center">
          <p className="text-2xl font-black font-serif text-black/20">No reviews yet.</p>
          <p className="text-sm font-mono text-black/40 mt-2 font-semibold">
            Reviews from your students will appear here.
          </p>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="flex flex-col gap-4">
          {reviews.map((review: Review, index: number) => (
            <div
              key={review.id}
              className="border border-black/10 hover:border-black transition-all duration-200 p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center text-sm font-black shrink-0">
                    <span className="font-serif">S</span>
                  </div>
                  <div>
                    <p className="text-sm font-mono text-black/60 tracking-widest uppercase font-semibold">
                      Review #{String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="text-xs font-mono text-black/40 mt-0.5">
                      {review.studentUserId.slice(0, 16)}...
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-black/10 mb-4" />

              <p className="text-base text-black/80 leading-relaxed font-serif">
                "{review.content}"
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}