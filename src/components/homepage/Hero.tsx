"use client"
import { useEffect, useState } from "react";


export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Grid texture background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative corner marks */}
      <span className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-black opacity-30" />
      <span className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-black opacity-30" />
      <span className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-black opacity-30" />
      <span className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-black opacity-30" />

      {/* Badge */}
      <div
        className="mb-8 flex items-center gap-2 transition-all duration-700"
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(-12px)",
          transitionDelay: "0ms",
        }}
      >
        <span className="inline-flex items-center gap-2 border border-black/20 rounded-full px-4 py-1.5 text-xs tracking-[0.2em] uppercase font-medium text-black/50">
          <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
          New Release
        </span>
      </div>

      {/* Headline */}
      <div className="text-center max-w-3xl relative z-10">
        <h1
          className="font-black uppercase leading-none mb-2 transition-all duration-700"
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(3.5rem, 10vw, 7rem)",
            letterSpacing: "-0.03em",
            color: "#0a0a0a",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "100ms",
          }}
        >
          Hello
        </h1>

        <h1
          className="font-black uppercase leading-none mb-10 transition-all duration-700"
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(3.5rem, 10vw, 7rem)",
            letterSpacing: "-0.03em",
            WebkitTextStroke: "2px #0a0a0a",
            color: "transparent",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "180ms",
          }}
        >
          There.
        </h1>

        {/* Divider line */}
        <div
          className="mx-auto mb-10 h-px bg-black transition-all duration-700"
          style={{
            width: loaded ? "80px" : "0px",
            transitionDelay: "280ms",
          }}
        />

        {/* Description */}
        <p
          className="text-base leading-relaxed mb-12 mx-auto transition-all duration-700"
          style={{
            fontFamily: "'Georgia', serif",
            color: "#444",
            maxWidth: "420px",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(12px)",
            transitionDelay: "360ms",
          }}
        >
          Connect with expert tutors who actually know their subject. Learn at your own pace, close your knowledge gaps, and score higher — all on a schedule that works around your life, not the other way around.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(12px)",
            transitionDelay: "440ms",
          }}
        >
          <button
            className="group relative px-10 py-4 bg-black text-white text-sm tracking-[0.15em] uppercase font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl active:scale-95"
            style={{ fontFamily: "monospace" }}
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
              Get Started
            </span>
            <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="absolute inset-0 border border-black" />
          </button>

          <button
            className="group px-10 py-4 bg-transparent text-black text-sm tracking-[0.15em] uppercase font-semibold border border-black/30 hover:border-black transition-all duration-300 active:scale-95"
            style={{ fontFamily: "monospace" }}
          >
            Learn More
            <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}