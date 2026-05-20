import Link from "next/link";
import {
  RiArrowRightLine,
  RiBarChartBoxLine,
  RiBuildingLine,
  RiCheckboxCircleLine,
  RiFlashlightLine,
  RiMapPinLine,
  RiRocketLine,
  RiShieldCheckLine,
  RiSparklingLine,
  RiTimerFlashLine,
  RiUserHeartLine,
} from "react-icons/ri";
import Banner from "./Components/Banner";
import RoomCard from "./Components/RoomCard";

const getRooms = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms`, {
      cache: "no-store",
    });
    const data = await res.json();
    const roomList = Array.isArray(data) ? data : [];

    return roomList
      .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
      .slice(0, 3);
  } catch (error) {
    return [];
  }
};

export default async function Home() {
  const rooms = await getRooms();

  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 size-104 rounded-full bg-violet-300/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-128 size-100 rounded-full bg-indigo-300/20 blur-3xl"
      />
      <Banner />
      <section className="relative py-16 sm:py-20">
        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 shadow-sm ring-1 ring-white">
                <RiSparklingLine className="size-3.5" />
                Available now
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                Browse available study rooms
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-stone-500 sm:text-base">
                Pick from private rooms, compare amenities, and book the room
                that matches your session style.
              </p>
            </div>
            <Link
              href="/rooms"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 shadow-sm transition-all hover:border-indigo-200 hover:text-indigo-700 hover:shadow-md"
            >
              Browse all rooms
              <RiArrowRightLine className="size-4" />
            </Link>
          </div>

          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room?._id} room={room} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center ring-1 ring-stone-900/5">
              <p className="text-sm text-stone-500">
                No rooms available right now. Check again soon.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <article className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-sm ring-1 ring-stone-900/5 backdrop-blur-sm sm:p-8">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 shadow-sm ring-1 ring-white">
                <RiSparklingLine className="size-3.5" />
                Our story
              </p>
              <h3 className="mt-3 max-w-xl text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                Study spaces made simple, practical, and dependable
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-stone-500 sm:text-base">
                Silentium built for one goal: remove booking chaos so students
                can focus faster. Every listing emphasizes clarity, quality, and
                confidence before reservation starts.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                  <p className="text-sm font-semibold text-stone-900">
                    Mission
                  </p>
                  <p className="mt-2 text-sm text-stone-500">
                    Make room discovery fast and practical for real study needs.
                  </p>
                </div>
                <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
                  <p className="text-sm font-semibold text-stone-900">
                    Teamwork
                  </p>
                  <p className="mt-2 text-sm text-stone-500">
                    Students and hosts align schedules without communication
                    drag.
                  </p>
                </div>
              </div>
              <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80"
                  alt="Modern quiet study room interior"
                  className="h-52 w-full object-cover"
                  loading="lazy"
                />
              </div>
            </article>
            <article className="rounded-[2rem] border border-indigo-100 bg-linear-to-br from-indigo-50 to-violet-50 p-6 shadow-sm ring-1 ring-indigo-100 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Snapshot
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-white/80 bg-white p-4">
                  <p className="text-2xl font-bold text-stone-900">98%</p>
                  <p className="text-sm text-stone-500">Booking success rate</p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white p-4">
                  <p className="text-2xl font-bold text-stone-900">100+</p>
                  <p className="text-sm text-stone-500">Partner spaces</p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white p-4">
                  <p className="text-2xl font-bold text-stone-900">20+</p>
                  <p className="text-sm text-stone-500">
                    Active room categories
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8">
            <div className="mb-8 max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Success stories
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                Real results from focused students and hosts
              </h3>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr]">
              <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm ring-1 ring-stone-900/5">
                <p className="text-4xl font-bold text-stone-900">90%</p>
                <p className="mt-2 text-sm font-medium text-stone-600">
                  users report better study consistency after switching to
                  scheduled rooms on Silentium.
                </p>
                <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                    alt="Students collaborating in focused study environment"
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </article>
              <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm ring-1 ring-stone-900/5">
                <p className="text-sm leading-relaxed text-stone-600">
                  Booking used to take too long. Now I find right room in
                  minutes and spend time on revision, not searching.
                </p>
                <p className="mt-4 text-sm font-semibold text-stone-900">
                  Maya R - Final Year Student
                </p>
              </article>
              <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm ring-1 ring-stone-900/5">
                <p className="text-sm leading-relaxed text-stone-600">
                  Host panel made schedule management easy. Idle hours now turn
                  into recurring bookings every week.
                </p>
                <p className="mt-4 text-sm font-semibold text-stone-900">
                  Arif H - Room Host
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Quick step plan
            </p>
            <h3 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Simple process to book and start fast
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm ring-1 ring-stone-900/5">
              <p className="text-3xl font-bold text-indigo-600">01</p>
              <RiMapPinLine className="mb-2 mt-3 size-5 text-indigo-600" />
              <h4 className="text-base font-semibold text-stone-900">
                Start discovery
              </h4>
              <p className="mt-2 text-sm text-stone-500">
                Explore listings and compare environment details quickly.
              </p>
            </article>
            <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm ring-1 ring-stone-900/5">
              <p className="text-3xl font-bold text-indigo-600">02</p>
              <RiTimerFlashLine className="mb-2 mt-3 size-5 text-indigo-600" />
              <h4 className="text-base font-semibold text-stone-900">
                Reserve slot
              </h4>
              <p className="mt-2 text-sm text-stone-500">
                Pick timing that fits your exam prep or team session.
              </p>
            </article>
            <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm ring-1 ring-stone-900/5">
              <p className="text-3xl font-bold text-indigo-600">03</p>
              <RiCheckboxCircleLine className="mb-2 mt-3 size-5 text-indigo-600" />
              <h4 className="text-base font-semibold text-stone-900">
                Level up focus
              </h4>
              <p className="mt-2 text-sm text-stone-500">
                Confirm booking and move straight into deep work mode.
              </p>
            </article>
          </div>
          <div className="mt-5 overflow-hidden rounded-3xl border border-stone-200 bg-white p-2 shadow-sm ring-1 ring-stone-900/5">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80"
              alt="Digital booking dashboard on laptop screen"
              className="h-52 w-full rounded-2xl object-cover sm:h-64"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="pb-14 sm:pb-16">
        <div className="container mx-auto px-4">
          <div className="rounded-[2rem] bg-stone-900 px-6 py-9 text-white shadow-xl sm:px-10 sm:py-11">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_auto] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
                  <RiSparklingLine className="size-3.5" />
                  Deep focus starts now
                </p>
                <h3 className="mt-4 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
                  Ready to book right room or publish your own?
                </h3>
                <p className="mt-3 max-w-2xl text-sm text-stone-300 sm:text-base">
                  Join students and hosts using Silentium for faster booking,
                  cleaner schedules, and better outcomes each week.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/rooms"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-stone-900 transition-colors hover:bg-indigo-100"
                >
                  Browse rooms
                  <RiArrowRightLine className="ml-2 size-4" />
                </Link>
                <Link
                  href="/add-room"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 bg-transparent px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Become host
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
