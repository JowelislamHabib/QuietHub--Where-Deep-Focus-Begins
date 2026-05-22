"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@heroui/react";
import {
  RiUserSharedLine,
  RiShutDownLine,
  RiCircleLine,
  RiLoaderLine,
} from "react-icons/ri";

const ImpersonationBanner = () => {
  const { data: session } = authClient.useSession();
  const [isStopping, setIsStopping] = useState(false);

  if (!session?.session?.impersonatedBy) {
    return null;
  }

  const handleStopImpersonating = async () => {
    if (isStopping) return;
    setIsStopping(true);

    try {
      const response = await authClient.admin.stopImpersonating();

      if (response?.error) {
        toast.danger(response.error.message || "Failed to stop impersonating.");
        setIsStopping(false);
      } else {
        toast.success("Returned to admin session");
        window.location.href = "/admin";
      }
    } catch (err) {
      console.error("Stop impersonating error:", err);
      toast.danger("An error occurred while stopping impersonation.");
      setIsStopping(false);
    }
  };

  return (
    <div className="sticky top-0 z-[100] w-full border-b border-blue-200/80 bg-linear-to-r from-blue-500 via-blue-600 to-blue-500 px-4 py-2 text-white shadow-md">
      <div className="container mx-auto flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div className="flex items-center gap-2.5 text-sm font-semibold">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
            <RiUserSharedLine className="size-4" />
          </div>
          <span>
            You are currently impersonating{" "}
            <span className="underline decoration-wavy underline-offset-2">
              {session.user?.name || session.user?.email || "User"}
            </span>{" "}
            (Admin Mode)
          </span>
        </div>

        <button
          onClick={handleStopImpersonating}
          disabled={isStopping}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-3.5 text-xs font-bold text-blue-700 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50"
        >
          {isStopping ? (
            <RiLoaderLine />
          ) : (
            <RiShutDownLine className="size-3.5" />
          )}
          Stop Impersonating
        </button>
      </div>
    </div>
  );
};

export default ImpersonationBanner;
