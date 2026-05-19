"use client";

import { useRouter } from "next/navigation";
import { AlertDialog, Button, toast } from "@heroui/react";
import { RiCloseCircleLine } from "react-icons/ri";

const CancelBookingButton = ({ bookingId }) => {
  const router = useRouter();

  const handleCancel = async (close) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/${bookingId}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Booking cancelled");
        close();
        router.refresh();
      } else {
        toast.danger(data.message || "Failed to cancel booking");
      }
    } catch {
      toast.danger("Failed to cancel booking");
    }
  };

  return (
    <AlertDialog className="w-full">
      <Button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-5 text-sm font-medium text-white transition-colors hover:bg-rose-600">
        <RiCloseCircleLine className="size-4" />
        Cancel booking
      </Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container placement="center">
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            {(renderProps) => (
              <>
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Icon status="danger" />
                  <AlertDialog.Heading>
                    Cancel this booking?
                  </AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <p>
                    This will free your reserved slot. You can book the space
                    again anytime.
                  </p>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button slot="close" variant="tertiary">
                    Keep booking
                  </Button>
                  <Button
                    slot="close"
                    variant="danger"
                    onClick={() => handleCancel(renderProps.close)}
                  >
                    Cancel booking
                  </Button>
                </AlertDialog.Footer>
              </>
            )}
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};

export default CancelBookingButton;
