"use client";

import React, { useState } from "react";
import { RiEyeLine, RiLoaderLine } from "react-icons/ri";
import { authClient } from "@/lib/auth-client";
import { toast } from "@heroui/react";

const ImpersonateButton = ({ userId, userName }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleImpersonate = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await authClient.admin.impersonateUser({
        userId,
      });

      if (response?.error) {
        toast.danger(response.error.message || "Failed to impersonate user.");
        setIsLoading(false);
      } else {
        toast.success(`Now impersonating ${userName || "user"}`);
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Impersonation error:", err);
      toast.danger("An error occurred during impersonation.");
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleImpersonate}
      disabled={isLoading}
      title={`Impersonate ${userName || "User"}`}
      aria-label={`Impersonate ${userName || "User"}`}
      className="flex size-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? <RiLoaderLine /> : <RiEyeLine className="size-4" />}
    </button>
  );
};

export default ImpersonateButton;
