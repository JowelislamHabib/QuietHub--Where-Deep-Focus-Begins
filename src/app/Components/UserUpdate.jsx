"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Button,
  FieldError,
  Input,
  Modal,
  TextField,
  toast,
} from "@heroui/react";
import {
  RiLinkM,
  RiPencilLine,
  RiUserLine,
} from "react-icons/ri";

export function UserUpdate({ user, customTrigger, isOpen, onOpenChange }) {
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const image = String(formData.get("image") ?? "").trim();

    const { data, error } = await authClient.updateUser({
      name,
      ...(image ? { image } : {}),
    });

    if (error) {
      toast.danger(error.message ?? "Update failed. Please try again.");
      return;
    }

    if (data) {
      toast.success("Profile updated");
      onOpenChange?.(false);
      router.refresh();
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      {customTrigger ?? (
        <Button className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
          <RiPencilLine className="size-4" />
          Edit profile
        </Button>
      )}

      <Modal.Backdrop className="bg-stone-900/40 backdrop-blur-sm">
        <Modal.Container placement="center">
          <Modal.Dialog className="w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
            <Modal.CloseTrigger className="top-5 right-5 text-stone-400 transition-colors hover:text-indigo-600" />

            <Modal.Header className="flex flex-col gap-1 border-b border-stone-200 bg-stone-50 px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <RiPencilLine className="size-5" />
                </span>
                <div>
                  <Modal.Heading className="text-lg font-semibold text-stone-900">
                    Update profile
                  </Modal.Heading>
                  <p className="text-sm text-stone-500">
                    Change your display name and avatar.
                  </p>
                </div>
              </div>
            </Modal.Header>

            <Modal.Body className="p-6">
              <form
                key={`${user?.id}-${user?.name}-${user?.image}`}
                className="flex flex-col gap-5"
                onSubmit={onSubmit}
              >
                <TextField
                  isRequired
                  name="name"
                  defaultValue={user?.name ?? ""}
                  validate={(v) =>
                    v.trim().length < 3
                      ? "Name must be at least 3 characters"
                      : null
                  }
                  className="flex flex-col gap-1.5"
                >
                  <span className="text-xs font-semibold text-gray-900 ml-1">
                    Full name
                  </span>
                  <div className="relative flex items-center">
                    <RiUserLine className="absolute left-4 text-gray-500 text-lg z-10" />
                    <Input
                      name="name"
                      placeholder="Your name"
                      className="w-full pl-12 pr-4 h-12 bg-white border border-stone-200 rounded-full text-gray-900 font-medium text-sm transition-all focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <FieldError className="text-red-500 text-xs font-medium mt-1 ml-1" />
                </TextField>

                <TextField
                  name="image"
                  defaultValue={user?.image ?? ""}
                  validate={(v) => {
                    const trimmed = v.trim();
                    if (!trimmed) return null;
                    if (
                      !trimmed.startsWith("https://") &&
                      !trimmed.startsWith("http://")
                    ) {
                      return "Enter a valid image URL";
                    }
                    return null;
                  }}
                  className="flex flex-col gap-1.5"
                >
                  <span className="text-xs font-semibold text-gray-900 ml-1">
                    Avatar URL
                  </span>
                  <div className="relative flex items-center">
                    <RiLinkM className="absolute left-4 text-gray-500 text-lg z-10" />
                    <Input
                      name="image"
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full pl-12 pr-4 h-12 bg-white border border-stone-200 rounded-full text-gray-900 font-medium text-sm transition-all focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <FieldError className="text-red-500 text-xs font-medium mt-1 ml-1" />
                </TextField>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <Button
                    type="button"
                    variant="secondary"
                    slot="close"
                    className="h-11 rounded-full border border-stone-200 bg-white px-5 text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-11 rounded-full bg-indigo-600 px-6 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Save changes
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
