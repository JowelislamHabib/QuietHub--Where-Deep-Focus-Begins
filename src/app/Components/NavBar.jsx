"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Button, Dropdown } from "@heroui/react";
import {
  RiCloseLine,
  RiLogoutBoxLine,
  RiMenuLine,
  RiUserAddLine,
  RiUserLine,
} from "react-icons/ri";

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
                  <Dropdown.Trigger className="outline-none">
                    <div className="rounded-full border border-stone-200 bg-white/90 pl-4 shadow-sm backdrop-blur-sm">
                      <div className="flex items-center gap-3 cursor-pointer">
                        <div className="text-right hidden lg:block">
                          <p className="font-sans font-medium text-sm text-stone-900 leading-none">
                            {user?.name || user?.email || "User"}
                          </p>
                        </div>

                        <Avatar className="w-11 h-11 border-2 border-white shadow-md ring-1 ring-zinc-100 object-cover rounded-full">
                          <Avatar.Image
                            referrerPolicy="no-referrer"
                            alt={user?.name}
                            src={user?.image}
                          />
                          <Avatar.Fallback>
                            {user?.name?.charAt(0)}
                          </Avatar.Fallback>
                        </Avatar>
                      </div>
                    </div>
                  </Dropdown.Trigger>

                  <Dropdown.Popover className="w-60 rounded-xl border border-stone-200 bg-white/95 p-2 shadow-md backdrop-blur-sm">
                    <div className="mb-2 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
                      <p className="font-sans font-normal text-xs text-gray-500 mb-1">
                        Reservations Account
                      </p>

                      <p className="font-sans font-medium text-sm text-gray-900 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>

                    <Dropdown.Menu className="p-0">
                      <Dropdown.Item
                        key="profile"
                        className="rounded-lg hover:bg-stone-50"
                      >
                        <Link
                          href="/my-profile"
                          className="flex w-full items-center justify-between no-underline py-1"
                        >
                          <span className="font-sans font-medium text-sm text-gray-900">
                            Account
                          </span>

                          <span className="text-gray-500">
                            <RiUserLine className="text-lg" />
                          </span>
                        </Link>
                      </Dropdown.Item>

                      <Dropdown.Item
                        key="logout"
                        className="rounded-lg mt-1 border-t border-stone-200 pt-2 hover:bg-stone-50"
                      >
                        <div
                          onClick={handleLogout}
                          className="flex w-full items-center justify-between py-1 cursor-pointer"
                        >
                          <span className="font-sans font-medium text-sm text-gray-900">
                            Sign Out
                          </span>

                          <span className="text-gray-500">
                            <RiLogoutBoxLine className="text-lg" />
                          </span>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
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
