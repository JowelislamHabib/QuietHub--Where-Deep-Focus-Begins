export const formatHourLabel = (hour24) => {
  const hour = Number(hour24);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:00 ${suffix}`;
};

export const buildHoursOptions = () =>
  Array.from({ length: 24 }, (_, hour) => {
    const value = hour.toString().padStart(2, "0");
    return { value, label: formatHourLabel(value) };
  });

export const parseBookingHour = (time) => {
  if (!time) return "09";
  const [hours] = String(time).split(":");
  return hours.padStart(2, "0");
};

export const formatDisplayTime = (time) => formatHourLabel(parseBookingHour(time));

/** Parse `YYYY-MM-DD` (or ISO prefix) into CalendarDate parts. */
export const parseBookingDate = (date) => {
  if (!date) return null;
  const [year, month, day] = String(date).split("T")[0].split("-").map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
};
