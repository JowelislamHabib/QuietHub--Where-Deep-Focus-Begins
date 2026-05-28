"use client";

import { useState } from "react";
import {
  Button,
  Calendar,
  DateField,
  DatePicker,
  Label,
  Modal,
  toast,
} from "@heroui/react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { useRouter } from "next/navigation";
import { RiArrowDownSLine, RiCalendarEventLine } from "react-icons/ri";
import {
  buildHoursOptions,
  formatDisplayTime,
  getMaxBookingDuration,
  parseBookingDate,
  parseBookingHour,
} from "@/lib/booking-time";
import { authClient } from "@/lib/auth-client";

const fieldLabelClass = "mb-1.5 block text-sm font-medium text-stone-700";
const fieldClassName =
  "h-11 w-full rounded-xl border border-stone-200 bg-white text-sm text-stone-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
const timeSelectClassName = `${fieldClassName} appearance-none pl-3 pr-9`;

const toCalendarDate = (dateStr) => {
  const parts = parseBookingDate(dateStr);
  if (!parts) {
    const now = new Date();
    return new CalendarDate(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
    );
  }
  return new CalendarDate(parts.year, parts.month, parts.day);
};

const clampToMinDate = (date, minDate) => {
  if (!date || date.compare(minDate) < 0) return minDate;
  return date;
};

const RescheduleBookingButton = ({ booking }) => {
  const router = useRouter();
  const roomName = booking.roomName ?? booking.room?.name ?? "this space";
  const hourlyRate =
    Number(booking.hourlyRate ?? booking.room?.hourlyRate) || 0;
  const minSelectableDate = today(getLocalTimeZone());

  const [selectedDate, setSelectedDate] = useState(() =>
    clampToMinDate(toCalendarDate(booking.date), minSelectableDate),
  );
  const initialStartHour = parseBookingHour(booking.startTime);
  const initialEndHour = parseBookingHour(booking.endTime);
  const initialDuration = Math.max(Number(initialEndHour) - Number(initialStartHour), 1);
  const [startHour, setStartHour] = useState(initialStartHour);
  const [durationHours, setDurationHours] = useState(String(initialDuration));
  const [loading, setLoading] = useState(false);

  const startTimeOptions = buildHoursOptions().filter(
    (option) => Number(option.value) >= 9 && Number(option.value) < 22,
  );
  const maxDuration = startHour ? getMaxBookingDuration(startHour) : 0;
  const durationOptions = Array.from({ length: maxDuration }, (_, idx) => {
    const value = String(idx + 1);
    return {
      value,
      label: `${value} ${value === "1" ? "hour" : "hours"}`,
    };
  });

  const selectedSlotData = startHour
    ? {
        startHour,
        endHour: String(Number(startHour) + Number(durationHours)).padStart(2, "0"),
        startTime: `${startHour}:00`,
        endTime: `${String(Number(startHour) + Number(durationHours)).padStart(2, "0")}:00`,
      }
    : null;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlotData) {
      toast.danger("Please select a start time");
      return;
    }

    if (selectedDate.compare(minSelectableDate) < 0) {
      toast.danger("Date cannot be in the past");
      return;
    }

    const { data: tokenData } = await authClient.token();

    const duration =
      Number(selectedSlotData.endHour) - Number(selectedSlotData.startHour);
    const totalCost = duration * hourlyRate;
    const date = selectedDate.toString();

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/${booking._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData?.token}`,
          },
          body: JSON.stringify({
            date,
            startTime: selectedSlotData.startTime,
            endTime: selectedSlotData.endTime,
            totalCost,
          }),
        },
      );

      const data = await res.json();

      if (res.ok && data?.success !== false) {
        toast.success("Booking rescheduled");
        router.refresh();
      } else {
        toast.danger(data.message || "Failed to reschedule booking");
      }
    } catch {
      toast.danger("Failed to reschedule booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal className="w-full">
      <Button className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 text-sm font-medium text-white shadow-md shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98]">
        <RiCalendarEventLine className="size-4" />
        Reschedule
      </Button>

      <Modal.Backdrop className="bg-black/50 backdrop-blur-sm">
        <Modal.Container placement="center">
          <Modal.Dialog className="w-full max-w-md overflow-visible rounded-2xl border border-stone-200 bg-white p-0 shadow-2xl">
            <Modal.CloseTrigger />

            <form onSubmit={onSubmit}>
              <Modal.Header className="space-y-1 border-b border-stone-100 px-5 pb-4 pt-5 pr-12">
                <Modal.Heading className="text-lg font-semibold text-stone-900">
                  Reschedule booking
                </Modal.Heading>
                <p className="text-sm text-stone-500">
                  Pick a new date, start time, and duration for{" "}
                  <span className="font-medium text-stone-800">{roomName}</span>.
                </p>
              </Modal.Header>

              <Modal.Body className="space-y-4 overflow-visible px-5 py-4">
                <DatePicker
                  className="w-full"
                  name="date"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  minValue={minSelectableDate}
                >
                  <Label className={fieldLabelClass}>Date</Label>

                  <DateField.Group
                    fullWidth
                    className={`${fieldClassName} px-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100`}
                  >
                    <DateField.Input>
                      {(segment) => (
                        <DateField.Segment
                          segment={segment}
                          className="text-sm text-stone-800"
                        />
                      )}
                    </DateField.Input>

                    <DateField.Suffix>
                      <DatePicker.Trigger>
                        <DatePicker.TriggerIndicator className="text-stone-500" />
                      </DatePicker.Trigger>
                    </DateField.Suffix>
                  </DateField.Group>

                  <DatePicker.Popover className="rounded-xl border border-stone-200 bg-white p-3 shadow-xl">
                    <Calendar
                      aria-label="Reschedule date"
                      minValue={minSelectableDate}
                    >
                      <Calendar.Header className="mb-3 flex items-center justify-between">
                        <Calendar.YearPickerTrigger className="flex items-center gap-1 text-sm font-semibold text-stone-800">
                          <Calendar.YearPickerTriggerHeading />
                          <Calendar.YearPickerTriggerIndicator />
                        </Calendar.YearPickerTrigger>

                        <div className="flex items-center gap-1">
                          <Calendar.NavButton
                            slot="previous"
                            className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100"
                          />
                          <Calendar.NavButton
                            slot="next"
                            className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100"
                          />
                        </div>
                      </Calendar.Header>

                      <Calendar.Grid className="w-full text-center">
                        <Calendar.GridHeader className="text-xs font-medium text-stone-400">
                          {(day) => (
                            <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                          )}
                        </Calendar.GridHeader>

                        <Calendar.GridBody>
                          {(date) => (
                            <Calendar.Cell
                              date={date}
                              className="rounded-lg p-1.5 text-sm text-stone-800 hover:bg-indigo-50"
                            />
                          )}
                        </Calendar.GridBody>
                      </Calendar.Grid>
                    </Calendar>
                  </DatePicker.Popover>
                </DatePicker>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className={fieldLabelClass}
                      htmlFor="reschedule-start-time"
                    >
                      Start time
                    </label>
                    <div className="relative">
                      <select
                        id="reschedule-start-time"
                        value={startHour}
                        onChange={(e) => {
                          const nextStart = e.target.value;
                          setStartHour(nextStart);
                          const nextMax = nextStart
                            ? getMaxBookingDuration(nextStart)
                            : 0;
                          if (!nextStart) {
                            setDurationHours("1");
                            return;
                          }
                          if (Number(durationHours) > nextMax) {
                            setDurationHours(String(nextMax));
                          }
                        }}
                        className={timeSelectClassName}
                      >
                        <option value="">None</option>
                        {startTimeOptions.map((option) => (
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
                    <label className={fieldLabelClass} htmlFor="reschedule-duration">
                      Duration
                    </label>
                    <div className="relative">
                      <select
                        id="reschedule-duration"
                        value={durationHours}
                        onChange={(e) => setDurationHours(e.target.value)}
                        className={timeSelectClassName}
                        disabled={!startHour}
                      >
                        {!startHour ? (
                          <option value="1">Select start first</option>
                        ) : (
                          durationOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))
                        )}
                      </select>
                      <RiArrowDownSLine
                        aria-hidden
                        className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-stone-400"
                      />
                    </div>
                  </div>
                </div>

                {selectedSlotData && (
                  <div className="rounded-xl bg-stone-50 px-4 py-3 ring-1 ring-stone-200/60">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                      Booking preview
                    </p>
                    <p className="mt-1 text-sm text-stone-700">
                      {formatDisplayTime(selectedSlotData.startTime)} -{" "}
                      {formatDisplayTime(selectedSlotData.endTime)} ({durationHours}{" "}
                      {durationHours === "1" ? "hour" : "hours"})
                    </p>
                  </div>
                )}
              </Modal.Body>

              <Modal.Footer className="flex items-center justify-end gap-3 border-t border-stone-100 px-5 py-4">
                <Button
                  slot="close"
                  className="h-10 rounded-full border-0 bg-transparent px-3 text-sm font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  slot="close"
                  isLoading={loading}
                  className="h-10 rounded-full bg-indigo-600 px-5 text-sm font-medium text-white transition-all hover:bg-indigo-700"
                >
                  Save changes
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default RescheduleBookingButton;
