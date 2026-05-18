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
    { href: "https://twitter.com", label: "X", icon: RiTwitterXLine },
    { href: "https://linkedin.com", label: "LinkedIn", icon: RiLinkedinFill },
    {
      href: "https://instagram.com",
      label: "Instagram",
      icon: RiInstagramLine,
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-50 border-t border-stone-200">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Silentium
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Where Deep Focus Begins
            </p>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">contact@silentium.com</p>
              <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Useful Links
            </h4>
            <ul className="space-y-3">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-500 transition-colors duration-150 text-sm"
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
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Private Routes
              </h4>
              <ul className="space-y-3">
                {privateRoutes.map((route) => (
                  <li key={route.href}>
                    <Link
                      href={route.href}
                      className="flex items-center justify-between text-gray-600 hover:text-indigo-500 transition-colors duration-150 text-sm"
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
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Follow Us
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-indigo-500 transition-colors duration-150"
                  aria-label={social.label}
                >
                  <social.icon className="text-2xl" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Silentium. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
