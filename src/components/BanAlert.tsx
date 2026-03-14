// src/components/dashboard/BanAlert.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function BanAlert() {
  const router = useRouter();

  useEffect(() => {
    Swal.fire({
      title: "Account Banned",
      text: "Your account has been banned. You no longer have access to this platform.",
      icon: "error",
      confirmButtonText: "Go to Home",
      confirmButtonColor: "#000000",
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        title: "!font-serif !font-black !text-black",
        popup: "!rounded-none",
      },
    }).then(() => {
      router.push("/");
    });
  }, [router]);

  return null;
}