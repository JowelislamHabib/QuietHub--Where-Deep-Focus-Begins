import Image from "next/image";
import Link from "next/link";
import {
  RiCalendarCheckLine,
  RiCalendarLine,
  RiSparklingLine,
  RiTimeLine,
} from "react-icons/ri";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import RescheduleBookingButton from "../Components/RescheduleBookingButton";
import CancelBookingButton from "../Components/CancelBookingButton";
import { formatDisplayTime } from "@/lib/booking-time";

const formatDisplayDate = (date) => {
  if (!date) return "";
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const MyBookingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/my-bookings/${userId}`,
    {
      cache: "no-store",
    },
  );

  const bookings = await res.json();
  const bookingList = Array.isArray(bookings) ? bookings : [];

  return (
    <section className="min-h-screen bg-stone-50">
      <div className="relative overflow-hidden border-b border-indigo-100/60 bg-gradient-to-br from-indigo-100/50 via-white to-violet-50">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-0 size-72 rounded-full bg-indigo-300/25 blur-3xl"
        />
        <div className="container relative mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-2xl space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-100">
              <RiSparklingLine className="size-3.5" />
              Your reservations
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              My bookings
            </h1>
            <p className="text-base leading-relaxed text-stone-600 sm:text-lg">
              View upcoming focus sessions, reschedule, or cancel when plans
              change.
            </p>
          </div>
          {bookingList.length > 0 && (
            <div className="mt-8 inline-flex rounded-xl border border-white/80 bg-white/80 px-6 py-4 shadow-sm ring-1 ring-indigo-100/80 backdrop-blur-sm">
              <p className="text-2xl font-bold text-stone-900">
                {bookingList.length}
              </p>
              <p className="ml-3 text-xs font-medium uppercase tracking-wide text-stone-500">
                Active
                <br />
                bookings
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-12">
        {bookingList.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm ring-1 ring-stone-900/5">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <RiCalendarCheckLine className="size-7" />
            </span>
            <h2 className="mt-5 text-xl font-semibold text-stone-900">
              No bookings yet
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-500">
              Browse focus spaces and reserve your first deep-work session.
            </p>
            <Link
              href="/rooms"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Browse rooms
            </Link>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-6">
            {bookingList.map((booking) => {
              const room = booking.room ?? {};
              const roomImage =
                room.image ||
                "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800";
              const roomName = room.name ?? booking.roomName ?? "Focus space";
              const roomId = room._id ?? booking.roomId;

              return (
                <article
                  key={booking._id}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm ring-1 ring-stone-900/5"
                >
                  <div className="flex flex-col sm:flex-row">
                    <Link
                      href={roomId ? `/rooms/${roomId}` : "/rooms"}
                      className="relative block aspect-[16/10] w-full shrink-0 bg-stone-100 sm:aspect-auto sm:w-52 sm:self-stretch"
                    >
                      <Image
                        src={roomImage}
                        alt={roomName}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 208px"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between gap-4 p-6 sm:p-7">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                            Upcoming session
                          </p>
                          <h2 className="mt-1 text-xl font-bold text-stone-900 sm:text-2xl">
                            {roomId ? (
                              <Link
                                href={`/rooms/${roomId}`}
                                className="transition-colors hover:text-indigo-700"
                              >
                                {roomName}
                              </Link>
                            ) : (
                              roomName
                            )}
                          </h2>
                        </div>

                        <ul className="grid gap-2 sm:grid-cols-2">
                          <li className="flex items-center gap-2.5 rounded-full bg-stone-50 px-4 py-2.5 text-sm text-stone-700 ring-1 ring-stone-200/60">
                            <RiCalendarLine className="size-4 shrink-0 text-indigo-500" />
                            {formatDisplayDate(booking.date)}
                          </li>
                          <li className="flex items-center gap-2.5 rounded-full bg-stone-50 px-4 py-2.5 text-sm text-stone-700 ring-1 ring-stone-200/60">
                            <RiTimeLine className="size-4 shrink-0 text-indigo-500" />
                            {formatDisplayTime(booking.startTime)} –{" "}
                            {formatDisplayTime(booking.endTime)}
                          </li>
                        </ul>
                      </div>

                      <p className="text-sm text-stone-500">
                        Total{" "}
                        <span className="font-semibold text-indigo-600">
                          ${Number(booking.totalCost).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 bg-stone-50/80 px-6 py-5">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                      Manage booking
                    </p>
                    <div className="flex flex-col gap-3 sm:max-w-md sm:flex-row">
                      <div className="min-w-0 flex-1">
                        <RescheduleBookingButton booking={booking} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CancelBookingButton bookingId={booking._id} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBookingsPage;
