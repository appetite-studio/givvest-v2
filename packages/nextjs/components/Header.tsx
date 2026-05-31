"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
};

export const menuLinks: HeaderMenuLink[] = [
  { label: "Home", href: "/" },
  { label: "My Impact", href: "/impact" },
  { label: "About", href: "/about" },
];

export const HeaderMenuLinks = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href }) => {
        const isActive = pathname === href;
        return (
          <li key={href} className="list-none">
            <Link
              href={href}
              onClick={onNavigate}
              className={`${
                isActive ? "text-[#3d6b4f] font-semibold" : "text-[#6b6b62]"
              } hover:text-[#1a1a18] py-1.5 px-3 text-sm transition-colors`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </>
  );
};

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setMobileOpen(false);

  return (
    <>
      <header className="sticky top-3 z-30 mx-4 sm:mx-6">
        <div className="bg-white border border-[#e8e6e0] rounded-2xl px-6 h-14 flex items-center justify-between max-w-none">
          {/* Logo */}
          <Link href="/" onClick={close} className="flex items-center shrink-0">
            <Image
              src="/givvest-logo.png"
              alt="Givvest"
              width={480}
              height={128}
              className="h-5 object-contain"
              style={{ width: "auto" }}
              priority
              unoptimized
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex">
            <ul className="flex items-center gap-1">
              <HeaderMenuLinks />
            </ul>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <RainbowKitCustomConnectButton />

            {/* Hamburger — mobile only */}
            <button
              className="lg:hidden p-2 -mr-1 text-[#1a1a18] hover:text-[#3d6b4f] transition-colors"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Full-screen mobile overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col lg:hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 h-14 border-b border-[#e8e6e0] shrink-0">
            <Link href="/" onClick={close} className="flex items-center">
              <Image
                src="/givvest-logo.png"
                alt="Givvest"
                width={480}
                height={128}
                className="h-6 object-contain"
                style={{ width: "auto" }}
                priority
                unoptimized
              />
            </Link>
            <button
              className="p-2 -mr-1 text-[#1a1a18] hover:text-[#3d6b4f] transition-colors"
              aria-label="Close menu"
              onClick={close}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 flex flex-col justify-center px-8">
            <ul className="space-y-2">
              {menuLinks.map(({ label, href }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={close}
                      className={`block text-4xl font-bold py-3 transition-colors ${
                        isActive ? "text-[#3d6b4f]" : "text-[#1a1a18] hover:text-[#3d6b4f]"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom — social links */}
          <div className="px-8 pb-10 shrink-0 border-t border-[#e8e6e0] pt-6">
            <p className="text-xs font-semibold text-[#9b9b90] uppercase tracking-widest mb-4">Follow us</p>
            <div className="flex items-center gap-6">
              <a
                href="https://www.instagram.com/givvest.app"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-[#6b6b62] hover:text-[#3d6b4f] transition-colors"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://x.com/givvest_app"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="text-[#6b6b62] hover:text-[#3d6b4f] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/givvest"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-[#6b6b62] hover:text-[#3d6b4f] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
