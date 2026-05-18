"use client";

import { useRouter } from "next/navigation";
import { AlertDialog, Button, toast } from "@heroui/react";

const DeleteRoomButton = ({ id }) => {
  const router = useRouter();

  const handleDelete = async (close) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Room deleted successfully");
        close();
        router.push("/rooms");
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } finally {
    }
  };

  return (
    <AlertDialog>
      <Button className="rounded-full bg-rose-500 text-white">Delete</Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container placement="center">
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            {(renderProps) => (
              <>
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Icon status="danger" />
                  <AlertDialog.Heading>Delete this room?</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <p>
                    Are you sure you want to delete this room? This action
                    cannot be undone.
                  </p>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button slot="close" variant="tertiary">
                    Cancel
                  </Button>
                  <Button
                    slot="close"
                    variant="danger"
                    onClick={() => handleDelete(renderProps.close)}
                  >
                    Delete
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

export default DeleteRoomButton;
