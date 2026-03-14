// src/app/(tutor)/tutor/availability/page.tsx
"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const getTutorProfileId = async (): Promise<string | null> => {
  try {
    const sessionRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
      { credentials: "include" }
    );
    const sessionData = await sessionRes.json();
    const userId = sessionData?.user?.id;
    if (!userId) return null;

    const profileRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/get-id/tutor-user-to-profileid`,
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

const formatTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [saving, setSaving] = useState(false);

  const addSlot = () => {
    setSlots((prev) => [...prev, { day: "MONDAY", startTime: "", endTime: "" }]);
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: keyof TimeSlot, value: string) => {
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
    );
  };

  const handleSave = async () => {
    if (slots.length === 0) {
      await Swal.fire({
        title: "No Slots Added",
        text: "Please add at least one availability slot.",
        icon: "warning",
        confirmButtonColor: "#000000",
        customClass: { title: "!font-serif !font-black", popup: "!rounded-none" },
      });
      return;
    }

    // Validate all slots
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      if (!slot.startTime || !slot.endTime) {
        await Swal.fire({
          title: "Incomplete Slot",
          text: `Please fill in start and end time for slot #${i + 1}.`,
          icon: "warning",
          confirmButtonColor: "#000000",
          customClass: { title: "!font-serif !font-black", popup: "!rounded-none" },
        });
        return;
      }
    }

    setSaving(true);

    const profileId = await getTutorProfileId();
    if (!profileId) {
      setSaving(false);
      await Swal.fire({
        title: "Profile Not Found",
        text: "Could not retrieve your tutor profile.",
        icon: "error",
        confirmButtonColor: "#000000",
        customClass: { title: "!font-serif !font-black", popup: "!rounded-none" },
      });
      return;
    }

    // Format times to 12hr
    const updateData = slots.map((slot) => ({
      day: slot.day,
      startTime: formatTime(slot.startTime),
      endTime: formatTime(slot.endTime),
    }));

    try {
        console.log({ profileId, updateData });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tutor-profile/add-time`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileId, updateData }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save.");

      await Swal.fire({
        title: "Availability Saved!",
        text: `${slots.length} time slot${slots.length > 1 ? "s" : ""} added successfully.`,
        icon: "success",
        confirmButtonColor: "#000000",
        customClass: { title: "!font-serif !font-black", popup: "!rounded-none" },
      });

      setSlots([]);
    } catch (err: unknown) {
      await Swal.fire({
        title: "Failed",
        text: err instanceof Error ? err.message : "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#000000",
        customClass: { title: "!font-serif !font-black", popup: "!rounded-none" },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm tracking-[0.3em] uppercase font-mono text-black/60 mb-2 font-semibold">
          Tutor Panel
        </p>
        <div className="flex items-end justify-between border-b border-black/10 pb-6">
          <h1 className="text-4xl font-black tracking-tight text-black leading-none font-serif">
            Set{" "}
            <span
              className="font-serif font-black"
              style={{ WebkitTextStroke: "1.5px black", color: "transparent" }}
            >
              Availability.
            </span>
          </h1>
          <p className="text-base text-black/70 font-mono font-semibold">
            {slots.length} slot{slots.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Slots */}
      <div className="flex flex-col gap-4 mb-6">
        {slots.length === 0 && (
          <div className="border border-black/10 p-10 text-center">
            <p className="text-xl font-black font-serif text-black/20">No slots added.</p>
            <p className="text-sm font-mono text-black/40 mt-2">Click the button below to add your availability.</p>
          </div>
        )}

        {slots.map((slot, index) => (
          <div
            key={index}
            className="border border-black/10 hover:border-black/30 transition-all duration-200 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-mono uppercase tracking-widest text-black/60 font-semibold">
                Slot #{String(index + 1).padStart(2, "0")}
              </p>
              <button
                onClick={() => removeSlot(index)}
                className="text-xs font-mono uppercase tracking-widest text-black/30 hover:text-black border border-black/10 hover:border-black px-3 py-1 transition-all duration-200"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Day */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-black/50">Day</label>
                <select
                  value={slot.day}
                  onChange={(e) => updateSlot(index, "day", e.target.value)}
                  className="border border-black/20 px-3 py-2.5 text-sm font-mono text-black focus:outline-none focus:border-black transition-colors duration-200 bg-white"
                >
                  {DAYS.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Start Time */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-black/50">Start Time</label>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => updateSlot(index, "startTime", e.target.value)}
                  className="border border-black/20 px-3 py-2.5 text-sm font-mono text-black focus:outline-none focus:border-black transition-colors duration-200 bg-white"
                />
              </div>

              {/* End Time */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-black/50">End Time</label>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => updateSlot(index, "endTime", e.target.value)}
                  className="border border-black/20 px-3 py-2.5 text-sm font-mono text-black focus:outline-none focus:border-black transition-colors duration-200 bg-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={addSlot}
          className="flex-1 py-3 border border-black/20 text-black text-xs font-mono tracking-[0.15em] uppercase font-semibold hover:border-black transition-all duration-300"
        >
          + Add Slot
        </button>
        <button
          onClick={handleSave}
          disabled={saving || slots.length === 0}
          className="flex-1 py-3 bg-black text-white text-xs font-mono tracking-[0.15em] uppercase font-semibold hover:bg-white hover:text-black border border-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Availability →"}
        </button>
      </div>

    </div>
  );
}