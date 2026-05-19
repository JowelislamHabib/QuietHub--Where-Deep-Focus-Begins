"use client";

import { useState } from "react";
import { Button, Input, Label, Modal, toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { RiArrowDownSLine, RiCalendarEventLine } from "react-icons/ri";
import { buildHoursOptions, parseBookingHour } from "@/lib/booking-time";

const fieldGroupClassName = "flex flex-col gap-2";
const labelClassName = "text-sm font-medium text-gray-900";
const inputClassName =
  "w-full h-12 rounded border border-stone-200 bg-white px-4 text-sm text-gray-900 transition-colors focus:border-indigo-500 focus:bg-white";
const fieldLabelClass = "mb-1.5 block text-sm font-medium text-stone-700";
const timeSelectClassName =
  "h-12 w-full appearance-none rounded-xl border border-stone-200 bg-white pl-3 pr-9 text-sm text-stone-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const RescheduleBookingButton = ({ booking }) => {
  const router = useRouter();
  const roomName = booking.roomName ?? booking.room?.name ?? "this space";
  const hourlyRate =
    Number(booking.hourlyRate ?? booking.room?.hourlyRate) || 0;

  const [date, setDate] = useState(booking.date ?? "");
  const [startTime, setStartTime] = useState(
    parseBookingHour(booking.startTime),
  );
  const [endTime, setEndTime] = useState(parseBookingHour(booking.endTime));
  const [loading, setLoading] = useState(false);

  const hoursOptions = buildHoursOptions();

  const handleStartTimeChange = (newStart) => {
    setStartTime(newStart);

    if (Number(newStart) >= Number(endTime)) {
      const nextHour = (Number(newStart) + 1).toString().padStart(2, "0");
      setEndTime(nextHour === "24" ? "23" : nextHour);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (Number(startTime) >= Number(endTime)) {
      toast.danger("End time must be after start time");
      return;
    }

    const duration = Number(endTime) - Number(startTime);
    const totalCost = duration * hourlyRate;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/${booking._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date,
            startTime: `${startTime}:00`,
            endTime: `${endTime}:00`,
            totalCost,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Booking rescheduled");
        router.refresh();
      } else {
        toast.danger(
          data.message ||
            "Failed to reschedule booking as it is already booked.",
        );
      }
    } catch {
      toast.danger("Failed to reschedule booking as it is already booked.");
    }
  };

  return (
    <Modal className="w-full">
      <Button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
        <RiCalendarEventLine className="size-4" />
        Reschedule
      </Button>

      <Modal.Backdrop className="bg-stone-900/40 backdrop-blur-sm">
        <Modal.Container placement="center">
          <Modal.Dialog className="sm:max-w-lg overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
            <Modal.CloseTrigger className="top-5 right-5 text-stone-400 transition-colors hover:text-indigo-600" />

            <Modal.Header className="flex flex-col gap-1 border-b border-stone-200 bg-stone-50 p-8 pb-6">
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <RiCalendarEventLine className="size-6" />
                </span>
                <div>
                  <Modal.Heading className="text-2xl font-bold text-gray-900">
                    Reschedule booking
                  </Modal.Heading>
                  <p className="mt-1 text-sm text-gray-500">
                    Pick a new date and hourly slot for {roomName}.
                  </p>
                </div>
              </div>
            </Modal.Header>

            <Modal.Body className="p-8">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className={fieldGroupClassName}>
                  <Label className={labelClassName}>Date</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputClassName}
                    isRequired
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className={fieldLabelClass}
                      htmlFor="reschedule-start"
                    >
                      Start
                    </label>
                    <div className="relative">
                      <select
                        id="reschedule-start"
                        required
                        value={startTime}
                        onChange={(e) => handleStartTimeChange(e.target.value)}
                        className={timeSelectClassName}
                      >
                        {hoursOptions.slice(0, -1).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <RiArrowDownSLine
                        aria-hidden
                        className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-stone-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={fieldLabelClass} htmlFor="reschedule-end">
                      End
                    </label>
                    <div className="relative">
                      <select
                        id="reschedule-end"
                        required
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className={timeSelectClassName}
                      >
                        {hoursOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            disabled={Number(option.value) <= Number(startTime)}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <RiArrowDownSLine
                        aria-hidden
                        className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-stone-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 border-t border-stone-200 pt-6">
                  <Button
                    slot="close"
                    variant="flat"
                    className="h-12 flex-1 rounded-xl bg-stone-100 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    slot="close"
                    isLoading={loading}
                    className="h-12 flex-[2] rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700"
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
};

export default RescheduleBookingButton;
