// TutorCard.tsx

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

export default function TutorCard({ tutor }: { tutor: Tutor }) {
  const rating =
    tutor.ratingCount > 0
      ? (tutor.ratingSum / tutor.ratingCount).toFixed(1)
      : "N/A";

  return (
    <div className="group border border-black/10 bg-white hover:border-black transition-all duration-300 p-6 flex flex-col gap-4 relative overflow-hidden">
      {/* Featured Badge */}
      <span className="absolute top-4 right-4 text-[10px] tracking-[0.2em] uppercase font-mono text-black/30 border border-black/10 px-2 py-1">
        Featured
      </span>

      {/* Avatar + Name */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-none bg-black text-white flex items-center justify-center text-lg font-black shrink-0 overflow-hidden relative">
          {tutor.user.image ? (
            <img
              src={tutor.user.image}
              alt={tutor.user.name}
              className="object-cover"
            />
          ) : (
            <span className="font-serif">
              {tutor.user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h3 className="font-black text-black tracking-tight font-serif text-lg leading-none">
            {tutor.user.name}
          </h3>
          <p className="text-xs text-black/40 font-mono mt-1">
            {tutor.user.email}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black/10 w-full" />

      {/* Subjects */}
      <div className="flex flex-wrap gap-2">
        {tutor.subjects.map((subject) => (
          <span
            key={subject}
            className="text-[10px] tracking-[0.15em] uppercase font-mono border border-black/20 px-2 py-1 text-black/60"
          >
            {subject}
          </span>
        ))}
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-black/30 uppercase tracking-widest font-mono">
            Rating
          </span>
          <span className="text-black font-black font-serif text-xl leading-tight">
            {rating}
            <span className="text-black/20 text-sm font-normal"> /5</span>
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-black/30 uppercase tracking-widest font-mono">
            Mode
          </span>
          <span className="text-black font-black font-serif text-xl leading-tight capitalize">
            {tutor.category}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] text-black/30 uppercase tracking-widest font-mono">
            Price
          </span>
          <span className="text-black font-black font-serif text-xl leading-tight">
            ${tutor.price}
            <span className="text-black/20 text-sm font-normal"> /hr</span>
          </span>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full mt-2 btn btn-sm rounded-none border border-black bg-white text-black text-xs tracking-[0.15em] uppercase font-semibold hover:bg-black hover:text-white transition-all duration-300 font-mono">
        View Profile →
      </button>
    </div>
  );
}