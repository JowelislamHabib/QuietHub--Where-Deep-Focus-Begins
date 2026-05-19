"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, Button } from "@heroui/react";
import {
  RiAddLine,
  RiArrowRightLine,
  RiBuildingLine,
  RiCalendarCheckLine,
  RiDoorOpenLine,
  RiLogoutBoxLine,
  RiMailLine,
  RiMoneyDollarCircleLine,
  RiPencilLine,
  RiSparklingLine,
  RiTimeLine,
  RiUserLine,
} from "react-icons/ri";
import { authClient } from "@/lib/auth-client";
import { formatDisplayTime } from "@/lib/booking-time";
import { UserUpdate } from "@/app/Components/UserUpdate";

const formatDisplayDate = (date) => {
  if (!date) return "";
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatMemberSince = (date) => {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const quickLinks = [
  {
    href: "/my-bookings",
    label: "My reservations",
    description: "View, reschedule, or cancel sessions",
    icon: RiCalendarCheckLine,
  },
  {
    href: "/rooms",
    label: "Browse rooms",
    description: "Find your next focus space",
    icon: RiDoorOpenLine,
  },
  {
    href: "/my-listings",
    label: "My listings",
    description: "Manage spaces you host",
    icon: RiBuildingLine,
  },
  {
    href: "/add-room",
    label: "List a room",
    description: "Share a focus space with others",
    icon: RiAddLine,
  },
];

const MyProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [listingCount, setListingCount] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setIsLoadingStats(false);
      return;
    }

    let cancelled = false;

    const loadStats = async () => {
      setIsLoadingStats(true);
      try {
        const base = process.env.NEXT_PUBLIC_SERVER_URL;
        const [bookingsRes, listingsRes] = await Promise.all([
          fetch(`${base}/my-bookings/${user.id}`, { cache: "no-store" }),
          fetch(`${base}/my-listings/${user.id}`, { cache: "no-store" }),
        ]);

        if (cancelled) return;

        const bookingsData = await bookingsRes.json();
        const listingsData = await listingsRes.json();

        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setListingCount(
          Array.isArray(listingsData) ? listingsData.length : 0,
        );
      } catch {
        if (!cancelled) {
          setBookings([]);
          setListingCount(0);
        }
      } finally {
        if (!cancelled) setIsLoadingStats(false);
      }
    };

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  const totalSpent = bookings.reduce(
    (sum, booking) => sum + (Number(booking.totalCost) || 0),
    0,
  );
  const recentBookings = bookings.slice(0, 3);
  const memberSince = formatMemberSince(user?.createdAt);

  const stats = [
    {
      label: "Active bookings",
      value: isLoadingStats ? "—" : String(bookings.length),
      icon: RiCalendarCheckLine,
    },
    {
      label: "Listed rooms",
      value: isLoadingStats ? "—" : String(listingCount),
      icon: RiBuildingLine,
    },
    {
      label: "Total spent",
      value: isLoadingStats ? "—" : `$${totalSpent.toFixed(2)}`,
      icon: RiMoneyDollarCircleLine,
    },
  ];

  return (
    <section className="min-h-screen bg-stone-50">
      <div className="relative overflow-hidden border-b border-indigo-100/60 bg-gradient-to-br from-indigo-100/50 via-white to-violet-50">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-0 size-72 rounded-full bg-indigo-300/25 blur-3xl"
        />
        <div className="container relative mx-auto px-4 py-12 lg:py-16">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-5">
              <Avatar className="size-20 shrink-0 ring-4 ring-white shadow-md">
                {user?.image ? (
                  <Avatar.Image
                    src={user.image}
                    alt={user.name ?? "Profile"}
                  />
                ) : null}
                <Avatar.Fallback className="bg-indigo-100 text-2xl font-semibold text-indigo-700">
                  {user?.name?.charAt(0) ?? "?"}
                </Avatar.Fallback>
              </Avatar>
              <div className="min-w-0 space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-100">
                  <RiSparklingLine className="size-3.5" />
                  Your account
                </div>
                <h1 className="truncate text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                  {isPending ? "Loading…" : (user?.name ?? "Guest")}
                </h1>
                <p className="flex items-center gap-2 text-sm font-medium text-stone-600">
                  <RiMailLine className="size-4 shrink-0 text-indigo-500" />
                  <span className="truncate">
                    {user?.email ?? "Sign in to view your profile"}
                  </span>
                </p>
                {memberSince && (
                  <p className="text-xs font-medium text-stone-500">
                    Member since {memberSince}
                  </p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <UserUpdate
                user={user}
                isOpen={isUpdateOpen}
                onOpenChange={setIsUpdateOpen}
                customTrigger={
                  <Button
                    onPress={() => setIsUpdateOpen(true)}
                    className="h-11 rounded-full border border-indigo-200 bg-white/80 px-5 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-indigo-50 hover:text-indigo-800"
                  >
                    <RiPencilLine className="size-4" />
                    Edit profile
                  </Button>
                }
              />
              <Button
                onPress={handleLogout}
                className="h-11 rounded-full border border-stone-200 bg-white/80 px-5 text-sm font-medium text-stone-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-stone-900"
              >
                <RiLogoutBoxLine className="size-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-12">
        <div className="mb-10 grid gap-3 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-white/80 bg-white/80 px-6 py-5 shadow-sm ring-1 ring-indigo-100/80 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-2xl font-bold text-stone-900">{value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-stone-500">
                    {label}
                  </p>
                </div>
                <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon className="size-5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          {quickLinks.map(({ href, label, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm ring-1 ring-stone-900/5 transition-colors hover:border-indigo-200 hover:ring-indigo-100"
            >
              <div className="flex min-w-0 items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-stone-900">{label}</p>
                  <p className="mt-0.5 text-sm text-stone-500">{description}</p>
                </div>
              </div>
              <RiArrowRightLine className="size-5 shrink-0 text-stone-300 transition-colors group-hover:text-indigo-500" />
            </Link>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm ring-1 ring-stone-900/5">
            <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
                Upcoming sessions
              </h2>
              {bookings.length > 0 && (
                <Link
                  href="/my-bookings"
                  className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700"
                >
                  View all
                </Link>
              )}
            </div>

            {isLoadingStats ? (
              <div className="space-y-3 p-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-xl bg-stone-100"
                  />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="grid place-items-center gap-4 p-10 text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <RiCalendarCheckLine className="size-6" />
                </span>
                <div>
                  <p className="font-semibold text-stone-900">No bookings yet</p>
                  <p className="mt-1 text-sm text-stone-500">
                    Reserve a focus room to see sessions here.
                  </p>
                </div>
                <Link
                  href="/rooms"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-indigo-600 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Browse rooms
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-stone-100">
                {recentBookings.map((booking) => {
                  const room = booking.room ?? {};
                  const roomName =
                    room.name ?? booking.roomName ?? "Focus space";
                  const roomImage =
                    room.image ||
                    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200";

                  return (
                    <li key={booking._id}>
                      <Link
                        href="/my-bookings"
                        className="flex items-center gap-4 p-4 transition-colors hover:bg-stone-50 sm:p-5"
                      >
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                          <Image
                            src={roomImage}
                            alt={roomName}
                            fill
                            unoptimized
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-stone-900">
                            {roomName}
                          </p>
                          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                            <span className="inline-flex items-center gap-1">
                              <RiCalendarCheckLine className="size-3.5 text-indigo-500" />
                              {formatDisplayDate(booking.date)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <RiTimeLine className="size-3.5 text-indigo-500" />
                              {formatDisplayTime(booking.startTime)} –{" "}
                              {formatDisplayTime(booking.endTime)}
                            </span>
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-indigo-600">
                          ${Number(booking.totalCost).toFixed(2)}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm ring-1 ring-stone-900/5">
            <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
                Account details
              </h2>
              <Button
                onPress={() => setIsUpdateOpen(true)}
                className="h-9 rounded-full px-4 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                variant="light"
              >
                <RiPencilLine className="size-3.5" />
                Edit
              </Button>
            </div>
            <dl className="divide-y divide-stone-100">
              <div className="flex items-start gap-3 px-6 py-4">
                <RiUserLine className="mt-0.5 size-4 shrink-0 text-indigo-500" />
                <div className="min-w-0">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                    Full name
                  </dt>
                  <dd className="mt-0.5 font-medium text-stone-800">
                    {user?.name ?? "—"}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3 px-6 py-4">
                <RiMailLine className="mt-0.5 size-4 shrink-0 text-indigo-500" />
                <div className="min-w-0">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                    Email
                  </dt>
                  <dd className="mt-0.5 break-all font-medium text-stone-800">
                    {user?.email ?? "—"}
                  </dd>
                </div>
              </div>
              {memberSince && (
                <div className="flex items-start gap-3 px-6 py-4">
                  <RiSparklingLine className="mt-0.5 size-4 shrink-0 text-indigo-500" />
                  <div className="min-w-0">
                    <dt className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                      Member since
                    </dt>
                    <dd className="mt-0.5 font-medium text-stone-800">
                      {memberSince}
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
          >
            Return to home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MyProfilePage;
