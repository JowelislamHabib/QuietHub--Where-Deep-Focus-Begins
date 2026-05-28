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

export const formatSlotLabel = (startHour24, endHour24) => {
  const startHour = Number(startHour24);
  const endHour = Number(endHour24);

  if (Number.isNaN(startHour) || Number.isNaN(endHour)) return "";

  const formatBoundary = (hour) => {
    const normalized = ((hour % 24) + 24) % 24;
    const suffix = normalized >= 12 ? "PM" : "AM";
    const displayHour = normalized % 12 || 12;
    return `${String(displayHour).padStart(2, "0")}:00 ${suffix}`;
  };

  return `${formatBoundary(startHour)} - ${formatBoundary(endHour)}`;
};

export const buildBookingSlotOptions = (startHour = 9, endHour = 22) => {
  const safeStart = Number(startHour);
  const safeEnd = Number(endHour);
  if (Number.isNaN(safeStart) || Number.isNaN(safeEnd) || safeEnd <= safeStart) {
    return [];
  }

  return Array.from({ length: safeEnd - safeStart }, (_, idx) => {
    const start = safeStart + idx;
    const end = start + 1;
    const startValue = String(start).padStart(2, "0");
    const endValue = String(end).padStart(2, "0");

    return {
      value: `${startValue}-${endValue}`,
      startTime: `${startValue}:00`,
      endTime: `${endValue}:00`,
      label: formatSlotLabel(startValue, endValue),
    };
  });
};

export const buildBookingStartSlotOptions = (startHour = 9, endHour = 22) => {
  const safeStart = Number(startHour);
  const safeEnd = Number(endHour);
  if (Number.isNaN(safeStart) || Number.isNaN(safeEnd) || safeEnd <= safeStart) {
    return [];
  }

  return Array.from({ length: safeEnd - safeStart }, (_, idx) => {
    const start = safeStart + idx;
    const end = start + 1;
    const startValue = String(start).padStart(2, "0");
    const endValue = String(end).padStart(2, "0");

    return {
      value: startValue,
      label: formatSlotLabel(startValue, endValue),
    };
  });
};

export const getMaxBookingDuration = (startHour, endHour = 22) => {
  const start = Number(startHour);
  const safeEnd = Number(endHour);
  if (Number.isNaN(start) || Number.isNaN(safeEnd)) return 0;
  return Math.max(safeEnd - start, 0);
};

export const parseBookingSlotValue = (slotValue) => {
  if (!slotValue) return null;
  const [start, end] = String(slotValue).split("-");
  if (!start || !end) return null;
  const startHour = start.padStart(2, "0");
  const endHour = end.padStart(2, "0");
  return {
    startHour,
    endHour,
    startTime: `${startHour}:00`,
    endTime: `${endHour}:00`,
  };
};

export const parseBookingHour = (time) => {
  if (!time) return "09";
  const [hours] = String(time).split(":");
  return hours.padStart(2, "0");
};

export const formatDisplayTime = (time) =>
  formatHourLabel(parseBookingHour(time));

export const parseBookingDate = (date) => {
  if (!date) return null;
  const [year, month, day] = String(date).split("T")[0].split("-").map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
};

export const isBookingOnOrAfterToday = (date) => {
  const parts = parseBookingDate(date);
  if (!parts) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingDay = new Date(parts.year, parts.month - 1, parts.day);
  bookingDay.setHours(0, 0, 0, 0);
  return bookingDay >= today;
};

export const isBookingBeforeToday = (date) => {
  const parts = parseBookingDate(date);
  if (!parts) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingDay = new Date(parts.year, parts.month - 1, parts.day);
  bookingDay.setHours(0, 0, 0, 0);
  return bookingDay < today;
};

export const isSelectedDateToday = (dateStr) => {
  const parts = parseBookingDate(dateStr);
  if (!parts) return false;
  const now = new Date();
  return (
    parts.year === now.getFullYear() &&
    parts.month === now.getMonth() + 1 &&
    parts.day === now.getDate()
  );
};

export const getMinBookableHour = () => new Date().getHours();

export const isStartHourDisabled = (hourValue, dateStr) => {
  if (!isSelectedDateToday(dateStr)) return false;
  return Number(hourValue) < getMinBookableHour();
};

export const isEndHourDisabled = (hourValue, dateStr, startHour) => {
  if (Number(hourValue) <= Number(startHour)) return true;
  if (!isSelectedDateToday(dateStr)) return false;
  return Number(hourValue) <= getMinBookableHour();
};

export const getDefaultStartHour = (dateStr) => {
  const minHour = isSelectedDateToday(dateStr) ? getMinBookableHour() : 9;
  return Math.min(minHour, 22).toString().padStart(2, "0");
};

export const getDefaultEndHour = (startHour) => {
  const next = (Number(startHour) + 1).toString().padStart(2, "0");
  return next === "24" ? "23" : next;
};
