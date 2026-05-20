"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Button, Dropdown } from "@heroui/react";
import {
  RiCloseLine,
  RiLogoutBoxLine,
  RiMenuLine,
  RiSparklingLine,
  RiUserAddLine,
  RiUserLine,
} from "react-icons/ri";

const dropdownItemClass =
  "rounded-xl px-2 py-1 outline-none transition-colors data-[hover=true]:bg-indigo-50/80 data-[focus-visible=true]:bg-indigo-50/80";

const dropdownIconBoxClass =
  "flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100";

import { authClient } from "@/lib/auth-client";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();

    router.push("/login");
    router.refresh();
  };

  const navLinkClass = (path) =>
    `rounded-full px-4 py-2 font-sans text-sm font-semibold no-underline transition-all duration-200 ${
      pathname === path
        ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
        : "text-stone-600 hover:bg-white hover:text-stone-900"
    }`;

  const mobileNavLinkClass = (path) =>
    `block font-heading font-semibold text-xl no-underline ${
      pathname === path ? "text-indigo-500 font-bold" : "text-gray-900"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/80 bg-white/60 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="no-underline">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-heading text-2xl font-bold tracking-tight text-stone-900 shadow-sm ring-1 ring-stone-100">
              <span className="size-2 rounded-full bg-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.15)]" />
              Silentium
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-stone-200/80 bg-white/80 p-1 shadow-sm md:flex">
            <Link href="/" className={navLinkClass("/")}>
              Home
            </Link>

            <Link href="/rooms" className={navLinkClass("/rooms")}>
              Rooms
            </Link>

            {user && (
              <>
                <Link href="/add-room" className={navLinkClass("/add-room")}>
                  Add Room
                </Link>

                <Link
                  href="/my-listings"
                  className={navLinkClass("/my-listings")}
                >
                  My Listings
                </Link>

                <Link
                  href="/my-bookings"
                  className={navLinkClass("/my-bookings")}
                >
                  My Bookings
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <div className="flex items-center gap-2">
                <Link href="/login" className={navLinkClass("/login")}>
                  Sign In
                </Link>

                <Link href="/register">
                  <Button className="flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 font-sans text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md">
                    <RiUserAddLine className="text-lg" />
                    Create account
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="h-6 w-px bg-stone-200" />

                <Dropdown placement="bottom-end">
                  <Dropdown.Trigger className="rounded-full outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500/25">
                    <div className="flex cursor-pointer items-center gap-2.5 rounded-full border border-stone-200/90 bg-white/90 py-1.5 pl-3 pr-1.5 shadow-sm ring-1 ring-stone-900/5 transition-all hover:border-indigo-200 hover:shadow-md sm:gap-3 sm:pl-4">
                      <p className="hidden max-w-36 truncate text-sm font-semibold text-stone-900 lg:block">
                        {user?.name || "Account"}
                      </p>

                      <Avatar className="size-10 shrink-0 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-indigo-100">
                        <Avatar.Image
                          referrerPolicy="no-referrer"
                          alt={user?.name}
                          src={user?.image}
                        />
                        <Avatar.Fallback className="bg-indigo-50 text-sm font-semibold text-indigo-700">
                          {user?.name?.charAt(0) ?? "S"}
                        </Avatar.Fallback>
                      </Avatar>
                    </div>
                  </Dropdown.Trigger>

                  <Dropdown.Popover className="w-72 overflow-hidden rounded-2xl border border-stone-200/90 bg-white/95 p-0 shadow-xl shadow-indigo-100/35 ring-1 ring-stone-900/5 backdrop-blur-xl">
                    <div className="border-b border-stone-200/90 bg-linear-to-r from-indigo-50/90 via-white to-violet-50/50 px-4 py-4">
                      <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-600">
                        <RiSparklingLine className="size-3" />
                        Signed in
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <Avatar className="size-11 shrink-0 rounded-full border-2 border-white shadow-sm ring-1 ring-indigo-100">
                          <Avatar.Image
                            referrerPolicy="no-referrer"
                            alt={user?.name}
                            src={user?.image}
                          />
                          <Avatar.Fallback className="bg-indigo-100 text-sm font-semibold text-indigo-700">
                            {user?.name?.charAt(0) ?? "S"}
                          </Avatar.Fallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-stone-900">
                            {user?.name || "Silentium member"}
                          </p>
                          <p className="truncate text-xs text-stone-500">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Dropdown.Menu className="gap-0.5 p-2">
                      <Dropdown.Item
                        key="profile"
                        className={dropdownItemClass}
                        textValue="Account"
                      >
                        <Link
                          href="/my-profile"
                          className="flex w-full items-center gap-3 py-1.5 no-underline"
                        >
                          <span className={dropdownIconBoxClass}>
                            <RiUserLine className="size-[18px]" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-stone-900">
                              My profile
                            </span>
                            <span className="block text-xs text-stone-500">
                              Account & preferences
                            </span>
                          </span>
                        </Link>
                      </Dropdown.Item>
                    </Dropdown.Menu>

                    <div className="border-t border-stone-200/90 bg-stone-50/50 p-3">
                      <Button
                        type="button"
                        onPress={handleLogout}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-stone-200 bg-white text-sm font-semibold text-stone-900 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <RiLogoutBoxLine className="size-[18px]" />
                        Sign out
                      </Button>
                    </div>
                  </Dropdown.Popover>
                </Dropdown>
              </>
            )}
          </div>

          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full border border-stone-200 bg-white p-2 text-stone-900 shadow-sm transition-colors duration-150 hover:bg-stone-100 md:hidden"
          >
            {isOpen ? (
              <RiCloseLine className="text-xl" />
            ) : (
              <RiMenuLine className="text-xl" />
            )}
          </Button>
        </div>

        {isOpen && (
          <div className="space-y-6 border-t border-stone-200 bg-white/95 py-8 backdrop-blur-sm md:hidden">
            <div className="space-y-4">
              <Link href="/" className={mobileNavLinkClass("/")}>
                Home
              </Link>

              <Link href="/rooms" className={mobileNavLinkClass("/rooms")}>
                Rooms
              </Link>

              {user && (
                <>
                  <Link
                    href="/add-room"
                    className={mobileNavLinkClass("/add-room")}
                  >
                    Add Room
                  </Link>

                  <Link
                    href="/my-listings"
                    className={mobileNavLinkClass("/my-listings")}
                  >
                    My Listings
                  </Link>

                  <Link
                    href="/my-bookings"
                    className={mobileNavLinkClass("/my-bookings")}
                  >
                    My Bookings
                  </Link>
                </>
              )}
            </div>

            {!user ? (
              <div className="pt-6 border-t border-stone-200 space-y-6">
                <div className="flex flex-col gap-4">
                  <Link
                    href="/login"
                    className="block rounded-full border border-stone-200 bg-stone-100 py-2.5 text-center font-sans text-sm font-medium text-gray-900 no-underline"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-2 rounded-full bg-stone-900 py-2.5 text-center font-sans text-sm font-medium text-white no-underline"
                  >
                    <RiUserAddLine className="text-lg" />
                    Register
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t border-stone-200">
                <Link
                  href="/my-profile"
                  className={mobileNavLinkClass("/my-profile")}
                >
                  Account
                </Link>

                <div
                  onClick={handleLogout}
                  className="block font-heading font-semibold text-xl text-gray-500 cursor-pointer"
                >
                  Sign Out
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
