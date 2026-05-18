import React from "react";
import Image from "next/image";
import {
  RiUserLine,
  RiMoneyDollarCircleLine,
  RiMapPinLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import BookingButton from "@/app/Components/BookingButton";

const RoomDetails = async ({ params }) => {
  const { id } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${id}`,
    {},
  );
  const room = await res.json();

  return (
    <section className="bg-stone-50 min-h-screen">
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="relative w-full h-96 rounded-xl overflow-hidden mb-6">
              <Image
                src={
                  room.image ||
                  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800"
                }
                alt={room.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <RiMapPinLine className="text-base" />
                <span>{room.floor}</span>
              </div>
              <p className="text-gray-600">{room.description}</p>

              <div className="flex items-center gap-6 py-4 border-y border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-500">
                    <RiUserLine className="text-lg" />
                  </span>
                  <span className="text-gray-900 font-medium">
                    Capacity: {room.capacity} seats
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-500">
                    <RiMoneyDollarCircleLine className="text-lg" />
                  </span>
                  <span className="text-gray-900 font-medium">
                    ${room.hourlyRate}/hour
                  </span>
                </div>
              </div>

              {room.amenities && room.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 px-3 py-1 bg-stone-100 rounded-full text-sm text-gray-700"
                      >
                        <RiCheckboxCircleLine className="text-indigo-500 text-sm" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-stone-100 rounded-xl p-6 shadow-sm sticky top-24">
              <div className="mb-6 pb-4 border-b border-stone-200">
                <p className="text-2xl font-bold text-gray-900">
                  ${room.hourlyRate}
                </p>
                <p className="text-gray-500 text-sm">per hour</p>
              </div>

              <BookingButton room={room} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
