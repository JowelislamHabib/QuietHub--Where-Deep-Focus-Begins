"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, toast } from "@heroui/react";

const CancelBookingButton = ({ bookingId }) => {
  const router = useRouter();

  const handleCancel = async () => {
    const confirmed = confirm("Are you sure you want to cancel this booking?");

    if (!confirmed) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/${bookingId}`,
      {
        method: "DELETE",
      },
    );

    const data = await res.json();

    if (res.ok) {
      toast.success("Booking cancelled successfully");

      router.refresh();
    } else {
      toast.error(data.message || "Failed to cancel booking");
    }
  };

  return (
    <Button
      onPress={handleCancel}
      className="bg-rose-500 text-white rounded-full"
    >
      Cancel Booking
    </Button>
  );
};

export default CancelBookingButton;
