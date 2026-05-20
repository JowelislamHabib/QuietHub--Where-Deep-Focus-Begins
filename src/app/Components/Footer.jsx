"use client";
import React from "react";
import Link from "next/link";
import { RiHomeLine, RiHotelLine, RiInformationLine } from "react-icons/ri";
import {
  RiFacebookFill,
  RiTwitterXLine,
  RiLinkedinFill,
  RiInstagramLine,
} from "react-icons/ri";
import { authClient } from "@/lib/auth-client";

const Footer = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const usefulLinks = [
    { href: "/", label: "Home", icon: RiHomeLine },
    { href: "/rooms", label: "Rooms", icon: RiHotelLine },
    { href: "/about", label: "About", icon: RiInformationLine },
  ];

  const privateRoutes = [
    { href: "/add-room", label: "Add Room", requiresAuth: true },
    { href: "/my-listings", label: "My Listings", requiresAuth: true },
    { href: "/my-bookings", label: "My Bookings", requiresAuth: true },
    {
      href: "/rooms",
      label: "Room Details",
      requiresAuth: true,
      action: "Book Now",
    },
  ];

  const socialLinks = [
    { href: "https://facebook.com", label: "Facebook", icon: RiFacebookFill },
    { href: "https://x.com", label: "X", icon: RiTwitterXLine },
    { href: "https://linkedin.com", label: "LinkedIn", icon: RiLinkedinFill },
    {
      href: "https://instagram.com",
      label: "Instagram",
      icon: RiInstagramLine,
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-stone-200/90 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Silentium
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-500">
              Book distraction-free study rooms in minutes. Host your own room
              and build recurring income.
            </p>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">contact@silentium.com</p>
              <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-900">
              Explore
            </h4>
            <ul className="space-y-3">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-gray-600 transition-colors duration-150 hover:text-indigo-600"
                  >
                    <link.icon className="text-base" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {user && (
            <div>
              <h4 className="mb-4 text-lg font-semibold text-gray-900">
                Workspace
              </h4>
              <ul className="space-y-3">
                {privateRoutes.map((route) => (
                  <li key={route.href}>
                    <Link
                      href={route.href}
                      className="flex items-center justify-between text-sm text-gray-600 transition-colors duration-150 hover:text-indigo-600"
                    >
                      <span>{route.label}</span>
                      {route.action && (
                        <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded">
                          {route.action}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-900">
              Follow updates
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-stone-200 bg-white text-gray-500 shadow-sm transition-all duration-150 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md"
                  aria-label={social.label}
                >
                  <social.icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-stone-200 pt-8 text-center sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-500 text-sm">
            © {currentYear} Silentium. All rights reserved.
          </p>
          <p className="text-xs text-stone-400">
            Designed for deep focus sessions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
