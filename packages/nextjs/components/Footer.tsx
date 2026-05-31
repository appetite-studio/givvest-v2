"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const SocialIcon = ({ href, label, children }: { href: string; label: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    className="text-[#6b6b62] hover:text-[#3d6b4f] transition-colors"
  >
    {children}
  </a>
);

export const Footer = () => {
  return (
    <footer className="mt-8 pb-8">
      {/* Floating card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-4">
        <div className="bg-white border border-[#e8e6e0] rounded-2xl px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-10 sm:gap-6">
          {/* Brand icon + wordmark */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/givvest-logo.png"
              alt="Givvest"
              width={360}
              height={96}
              className="h-6 object-contain"
              style={{ width: "auto" }}
              unoptimized
            />
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6 text-sm text-[#6b6b62]">
            <Link href="/" className="hover:text-[#1a1a18] transition-colors">
              Home
            </Link>
            <Link href="/impact" className="hover:text-[#1a1a18] transition-colors">
              My Impact
            </Link>
            <Link href="/about" className="hover:text-[#1a1a18] transition-colors">
              About
            </Link>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <SocialIcon href="https://www.instagram.com/givvest.app" label="Instagram">
              <svg
                width="18"
                height="18"
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
            </SocialIcon>

            <SocialIcon href="https://x.com/givvest_app" label="X (Twitter)">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </SocialIcon>

            <SocialIcon href="https://www.linkedin.com/company/givvest" label="LinkedIn">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>

      {/* Copyright — outside the card */}
      <p className="text-center text-xs text-[#9b9b90] mt-8">
        &copy; {new Date().getFullYear()} Givvest. All rights reserved.
      </p>
    </footer>
  );
};
