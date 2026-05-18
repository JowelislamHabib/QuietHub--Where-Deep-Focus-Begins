"use client";

import React, { useState } from "react";
import {
  Calendar,
  DateField,
  DatePicker,
  Label,
  Button,
  Input,
  Modal,
  TextField,
} from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import {
  RiCalendarCheckLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
} from "react-icons/ri";

const BookingButton = ({ room }) => {
  const roomName = room?.name || "Focus Space Pod";
  const hourlyRate = Number(room?.hourlyRate) || 0;

  const [selectedDate, setSelectedDate] = useState(
    new CalendarDate(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate(),
    ),
  );
  const [startTime, setStartTime] = useState("09");
  const [endTime, setEndTime] = useState("10");
  const [note, setNote] = useState("");

  const hoursOptions = [
    { value: "00", label: "12:00 AM" },
    { value: "01", label: "01:00 AM" },
    { value: "02", label: "02:00 AM" },
    { value: "03", label: "03:00 AM" },
    { value: "04", label: "04:00 AM" },
    { value: "05", label: "05:00 AM" },
    { value: "06", label: "06:00 AM" },
    { value: "07", label: "07:00 AM" },
    { value: "08", label: "08:00 AM" },
    { value: "09", label: "09:00 AM" },
    { value: "10", label: "10:00 AM" },
    { value: "11", label: "11:00 AM" },
    { value: "12", label: "12:00 PM" },
    { value: "13", label: "01:00 PM" },
    { value: "14", label: "02:00 PM" },
    { value: "15", label: "03:00 PM" },
    { value: "16", label: "04:00 PM" },
    { value: "17", label: "05:00 PM" },
    { value: "18", label: "06:00 PM" },
    { value: "19", label: "07:00 PM" },
    { value: "20", label: "08:00 PM" },
    { value: "21", label: "09:00 PM" },
    { value: "22", label: "10:00 PM" },
    { value: "23", label: "11:00 PM" },
  ];

  const calculateTotalCost = () => {
    const startDecimal = Number(startTime);
    const endDecimal = Number(endTime);
    const duration = endDecimal - startDecimal;

    if (duration <= 0 || isNaN(duration)) return 0;

    return duration * hourlyRate;
  };

  const computedCost = calculateTotalCost();
  const calculatedHours = computedCost / hourlyRate;

  const handleStartTimeChange = (newStart) => {
    setStartTime(newStart);
    if (Number(newStart) >= Number(endTime)) {
      const nextHour = (Number(newStart) + 1).toString().padStart(2, "0");
      setEndTime(nextHour === "24" ? "23" : nextHour);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (Number(startTime) >= Number(endTime)) return;

    const reservationData = {
      roomId: room?._id,
      date: selectedDate?.toString(),
      startTime: `${startTime}:00`,
      endTime: `${endTime}:00`,
      note,
      totalCost: computedCost,
    };

    console.log(reservationData);
  };

  return (
    <div>
      <Modal>
        <Button className="w-full h-12 bg-indigo-500 text-white rounded-full text-base font-medium hover:bg-indigo-600 flex items-center justify-center gap-2 transition-colors duration-150">
          <RiCalendarCheckLine className="text-lg" />
          <span>Reserve Space</span>
        </Button>
        <Modal.Backdrop>
          <Modal.Container placement="auto">
            <Modal.Dialog className="sm:max-w-md bg-stone-100 border border-stone-200 rounded-lg shadow-md overflow-hidden">
              <Modal.CloseTrigger />
              <Modal.Header className="p-6 pb-0">
                <div className="flex items-center gap-2 text-gray-900">
                  <RiCalendarCheckLine className="text-indigo-500 text-xl" />
                  <Modal.Heading className="text-xl font-bold">
                    Confirm Reservation
                  </Modal.Heading>
                </div>
                <p className="mt-1.5 text-sm font-normal leading-relaxed text-gray-500">
                  Reserving infrastructure allocation window for{" "}
                  <span className="font-semibold text-gray-800">
                    {roomName}
                  </span>
                  .
                </p>
              </Modal.Header>

              <Modal.Body className="p-6">
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                  <form
                    onSubmit={handleFormSubmit}
                    className="flex flex-col gap-4"
                  >
                    <DatePicker
                      className="w-full"
                      name="date"
                      value={selectedDate}
                      onChange={setSelectedDate}
                    >
                      <Label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                        Target Date
                      </Label>
                      <DateField.Group
                        fullWidth
                        className="bg-stone-100 border border-stone-200 rounded-lg px-3 h-11"
                      >
                        <DateField.Input>
                          {(segment) => (
                            <DateField.Segment
                              segment={segment}
                              className="text-sm text-gray-900"
                            />
                          )}
                        </DateField.Input>
                        <DateField.Suffix>
                          <DatePicker.Trigger>
                            <DatePicker.TriggerIndicator className="text-gray-500" />
                          </DatePicker.Trigger>
                        </DateField.Suffix>
                      </DateField.Group>
                      <DatePicker.Popover className="bg-stone-100 border border-stone-200 rounded-lg shadow-md p-4">
                        <Calendar aria-label="Reservation Date Target">
                          <Calendar.Header className="flex items-center justify-between mb-2">
                            <Calendar.YearPickerTrigger className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                              <Calendar.YearPickerTriggerHeading />
                              <Calendar.YearPickerTriggerIndicator />
                            </Calendar.YearPickerTrigger>
                            <div className="flex gap-1">
                              <Calendar.NavButton
                                slot="previous"
                                className="text-gray-500 hover:text-gray-900"
                              />
                              <Calendar.NavButton
                                slot="next"
                                className="text-gray-500 hover:text-gray-900"
                              />
                            </div>
                          </Calendar.Header>
                          <Calendar.Grid className="w-full text-center">
                            <Calendar.GridHeader className="text-xs font-medium text-gray-500">
                              {(day) => (
                                <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                              )}
                            </Calendar.GridHeader>
                            <Calendar.GridBody>
                              {(date) => (
                                <Calendar.Cell
                                  date={date}
                                  className="p-1 text-sm text-gray-900 rounded hover:bg-indigo-50"
                                />
                              )}
                            </Calendar.GridBody>
                          </Calendar.Grid>
                        </Calendar>
                      </DatePicker.Popover>
                    </DatePicker>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                          Start Time
                        </label>
                        <select
                          required
                          value={startTime}
                          onChange={(e) =>
                            handleStartTimeChange(e.target.value)
                          }
                          className="w-full h-11 px-3 bg-stone-100 border border-stone-200 rounded-lg text-sm text-gray-900 focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer"
                        >
                          {hoursOptions.slice(0, -1).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                          End Time
                        </label>
                        <select
                          required
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full h-11 px-3 bg-stone-100 border border-stone-200 rounded-lg text-sm text-gray-900 focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer"
                        >
                          {hoursOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              disabled={
                                Number(option.value) <= Number(startTime)
                              }
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <TextField className="w-full" name="note">
                      <Label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                        Special Note
                      </Label>
                      <Input
                        placeholder="Add specific arrangements or requests"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full h-11 px-3 bg-stone-100 border border-stone-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
                      />
                    </TextField>

                    {computedCost > 0 && (
                      <div className="mt-2 p-4 bg-indigo-50 border border-indigo-100 rounded-lg space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <RiTimeLine className="text-indigo-500 text-base" />
                            <span>Calculated Duration</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {calculatedHours.toFixed(1)} hours
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 font-medium text-gray-700">
                            <RiMoneyDollarCircleLine className="text-indigo-500 text-base" />
                            <span>Total Cost</span>
                          </div>
                          <span className="text-lg font-bold text-indigo-600">
                            ${computedCost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </Modal.Body>

              <Modal.Footer className="p-6 pt-0 flex justify-end gap-4">
                <Button
                  slot="close"
                  className="bg-stone-50 border border-stone-200 text-gray-900 rounded-full text-sm font-medium hover:bg-stone-200 px-6 h-10 transition-colors duration-150"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={computedCost <= 0}
                  className={`rounded-full text-sm font-medium px-6 h-10 transition-colors duration-150 ${
                    computedCost > 0
                      ? "bg-indigo-500 text-white hover:bg-indigo-600"
                      : "bg-stone-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Confirm Reservation
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};

export default BookingButton;
