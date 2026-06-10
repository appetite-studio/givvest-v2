"use client";

import Image from "next/image";
import Link from "next/link";
import { formatUnits } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const CATEGORIES = [
  { label: "Clean Water", img: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=80&q=80" },
  { label: "Education", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=80&q=80" },
  { label: "Climate", img: "https://images.unsplash.com/photo-1542601098-3adb3baeb1ec?w=80&q=80" },
  { label: "Food Aid", img: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=80&q=80" },
  { label: "Health", img: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&q=80" },
  { label: "Disability", img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=80&q=80" },
  { label: "Emergency", img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=80&q=80" },
];

const CAUSES = [
  {
    title: "Gift a School Kit. Gift a Future.",
    org: "Human Welfare Foundation India",
    category: "Education",
    tag: "Urgent",
    tagColor: "bg-[#c0392b]",
    img: "/causes/hwf-gift-a-school-kit.webp",
  },
  {
    title: "UYAREE – Paraplegia Rehabilitation Project",
    org: "People's Foundation",
    category: "Health & Disability",
    tag: "Ongoing",
    tagColor: "bg-[#c9882a]",
    img: "/causes/uyare-paraplegia.jpeg",
  },
  {
    title: "People's Drinking Water Project by People's Foundation",
    org: "People's Foundation",
    category: "Clean Water",
    tag: "Active",
    tagColor: "bg-[#3d6b4f]",
    img: "/causes/drinking-water-project.jpg",
  },
  {
    title: "Help Disabled Children with Shelter & Care",
    org: "Give.do",
    category: "Disability & Care",
    tag: "Active",
    tagColor: "bg-[#3d6b4f]",
    img: "/causes/shelter-and-care.webp",
  },
  {
    title: "Support Khan Academy's Impactful Mission",
    org: "Khan Academy",
    category: "Education",
    tag: "Active",
    tagColor: "bg-[#3d6b4f]",
    img: "/causes/khan-academy.webp",
  },
];

const HOW_IT_WORKS = [
  {
    n: "1",
    title: "Deposit money",
    body: "Put in what you're comfortable with — like a savings account. Your principal is yours forever, no lock-ups, no minimum.",
  },
  {
    n: "2",
    title: "Donate the interest",
    body: "Your deposit earns interest automatically. Only the interest is donated — never your principal. The community votes on the cause.",
  },
  {
    n: "3",
    title: "Withdraw anytime",
    body: "Take back every dollar you put in, any time. No fees, no catch, no notice period required.",
  },
];

const PARTNERS = [
  {
    name: "People's Foundation",
    href: "https://peoplesfoundation.in",
    img: "/charity-partners/peoples-foundation.png",
  },
  {
    name: "Smile Foundation",
    href: "https://smilefoundationindia.org",
    img: "/charity-partners/smile-foundation.jpeg",
  },
  {
    name: "Detox Mind",
    href: "https://detoxmind.in",
    img: "/charity-partners/detoxmind-icon.jpg",
  },
  {
    name: "Ketto",
    href: "https://ketto.org",
    img: "/charity-partners/ketto.webp",
  },
  {
    name: "UNICEF India",
    href: "https://unicef.org/india",
    img: "/charity-partners/unicef-india.jpg",
  },
  {
    name: "Give.do",
    href: "https://give.do",
    img: "/charity-partners/give-do.jpg",
  },
  {
    name: "Human Welfare Foundation",
    href: "https://hwfindia.org",
    img: "/charity-partners/human-welfare-foundation.jpeg",
  },
];

export default function HomePage() {
  const { data: totalPrincipal } = useScaffoldReadContract({
    contractName: "GivvestVault",
    functionName: "totalPrincipal",
  });

  const totalDeposited =
    totalPrincipal !== undefined
      ? Number(formatUnits(totalPrincipal, 6)).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00";

  return (
    <div className="min-h-screen">
      {/* ─────────────────────────────────────────
          HERO
      ───────────────────────────────────────── */}
      <section>
        <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16 py-20 lg:py-28">
          <div className="grid lg:grid-cols-[1fr_340px] gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ccf88e] text-[#2d5a3d] text-[12px] font-bold mb-7">
                Zero-cost charity
              </span>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-[#0f0f0e] leading-[1.06] mb-6">
                Donate without Spending.
              </h1>
              <p className="text-[#6b6b62] text-base leading-relaxed mb-10 max-w-md">
                Deposit money. Donate the interest. Your principal stays 100% yours and can be withdrawn any time.
              </p>

              {/* CTA buttons */}
              <div className="flex gap-3 mb-12">
                <Link
                  href="/impact"
                  className="px-6 py-3 bg-[#3d6b4f] text-[#ccf88e] font-bold rounded-full hover:bg-[#2d5a3d] transition-colors text-sm"
                >
                  Givvest Now
                </Link>
                <Link
                  href="/about"
                  className="px-6 py-3 bg-white text-[#0f0f0e] font-semibold rounded-full hover:bg-[#f5f5f3] transition-colors text-sm border border-[#e8e6e0]"
                >
                  How it works
                </Link>
              </div>

              {/* Category pills */}
              <p className="text-[11px] font-semibold text-[#9b9b90] uppercase tracking-widest mb-4">
                causes supported
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <div
                    key={c.label}
                    className="flex items-center gap-2 pl-1 pr-3.5 py-1 rounded-full text-[13px] font-semibold bg-white border border-[#e8e6e0] text-[#0f0f0e]"
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={c.img}
                        alt={c.label}
                        width={24}
                        height={24}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                    {c.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: featured card */}
            <div className="w-full">
              <div className="rounded-3xl overflow-hidden border border-[#e8e6e0] bg-white">
                <div className="relative aspect-[1/1] overflow-hidden">
                  <Image
                    src="/poor-boy.jpg"
                    alt="Humanitarian giving"
                    fill
                    className="object-cover object-center"
                    sizes="340px"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <span className="text-white/90 text-xs font-medium">5 active causes</span>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-0.5 rounded-full border border-white/30">
                      Live on Base
                    </span>
                  </div>
                </div>
                <div className="bg-white px-6 pt-4 pb-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="leading-tight">
                      <p className="font-bold text-[#0f0f0e] text-sm !m-0 leading-tight">Total deposited funds</p>
                      <p className="text-xs text-[#6b6b62] !m-0 !mt-0.5 leading-none">actively generating donations</p>
                    </div>
                    <p className="text-2xl font-extrabold text-[#3d6b4f] tabular-nums">${totalDeposited}</p>
                  </div>
                  <Link
                    href="/impact"
                    className="block w-full text-center bg-[#3d6b4f] text-[#ccf88e] font-bold py-3 rounded-full hover:bg-[#2d5a3d] transition-colors text-sm"
                  >
                    Givvest Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          TESTIMONIAL — centered, card
      ───────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white border border-[#e8e6e0] rounded-3xl py-16 px-8 text-center animate-fade-in-up">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#0f0f0e] leading-snug mb-10 max-w-2xl mx-auto">
              &ldquo;These small yields with no effort will do great things for the world 🌍🙏🏽&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#e8e6e0] shrink-0">
                <Image
                  src="/esther.jpg"
                  alt="Esther Joy"
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
              <p className="font-semibold text-[#6b6b62] text-sm">@esther_vibes</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          WHERE IT GOES — 3-col cards
      ───────────────────────────────────────── */}
      <section className="py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ccf88e] text-[#2d5a3d] text-[12px] font-bold mb-4 block w-fit">
              Where it goes
            </span>
            <h2 className="text-3xl font-extrabold text-[#0f0f0e]">Active Causes</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {CAUSES.map(c => (
              <div
                key={c.title}
                className="bg-white rounded-2xl overflow-hidden border border-[#e8e6e0] group w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={c.img}
                    alt={c.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#0f0f0e] text-sm leading-snug mb-5">{c.title}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-[#9b9b90] uppercase tracking-wider mb-1">Organisation</p>
                      <p className="text-[11px] font-semibold text-[#0f0f0e] leading-tight">{c.org}</p>
                    </div>
                    <span
                      className={`inline-block ${c.tagColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0`}
                    >
                      {c.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          CHARITY PARTNERS — card
      ───────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white border border-[#e8e6e0] rounded-3xl py-14 px-10 sm:px-14">
            <div className="mb-12">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ccf88e] text-[#2d5a3d] text-[12px] font-bold mb-4 block w-fit">
                Vetted organisations
              </span>
              <h2 className="text-3xl font-extrabold text-[#0f0f0e]">Charity Partners</h2>
            </div>
            <div className="grid grid-cols-3 gap-x-6 gap-y-8 place-items-center sm:flex sm:flex-wrap sm:justify-center sm:gap-12 lg:gap-16">
              {PARTNERS.map(p => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#e8e6e0] group-hover:border-[#3d6b4f] transition-colors">
                    <Image
                      src={p.img}
                      alt={p.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#0f0f0e] group-hover:text-[#3d6b4f] transition-colors text-center max-w-[96px] leading-tight">
                    {p.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          HOW IT WORKS — 3 steps, cards + line
      ───────────────────────────────────────── */}
      <section className="pt-28 pb-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ccf88e] text-[#2d5a3d] text-[12px] font-bold mb-4 block w-fit">
              Simple by design
            </span>
            <h2 className="text-3xl font-extrabold text-[#0f0f0e]">How Givvest works</h2>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-[51px] left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-[#c2dac8] z-0" />
            <div className="grid lg:grid-cols-3 gap-6">
              {HOW_IT_WORKS.map(({ n, title, body }, idx) => (
                <div
                  key={n}
                  className="relative bg-white border border-[#e8e6e0] rounded-3xl p-9 z-10 hover:-translate-y-1.5 transition-transform duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 120}ms` }}
                >
                  <div className="w-10 h-10 rounded-full bg-[#eaf3ec] border-2 border-[#c2dac8] flex items-center justify-center text-[#3d6b4f] font-extrabold text-sm mb-8">
                    {n}
                  </div>
                  <h3 className="font-bold text-[#0f0f0e] mb-3 text-base">{title}</h3>
                  <p className="text-sm text-[#6b6b62] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          POWERED BY — card
      ───────────────────────────────────────── */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white border border-[#e8e6e0] rounded-3xl py-8 px-10 text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ccf88e] text-[#2d5a3d] text-[12px] font-bold mb-8">
              Powered by
            </span>
            <div className="flex items-center gap-10 lg:gap-20 flex-wrap justify-center">
              {[
                { name: "Aave", href: "https://aave.com", img: "/logo-aave.png" },
                { name: "Base", href: "https://base.org", img: "/logo-base.png" },
                { name: "Ethereum", href: "https://ethereum.org", img: "/logo-ethereum.png" },
                { name: "USDC", href: "https://www.circle.com/usdc", img: "/logo-usdc.png" },
                { name: "OpenZeppelin", href: "https://openzeppelin.com", img: "/logo-openzeppelin.png" },
              ].map(p => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src={p.img}
                    alt={p.name}
                    width={48}
                    height={48}
                    className="h-10 w-auto object-contain"
                    unoptimized
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          FINAL CTA
      ───────────────────────────────────────── */}
      <section className="py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0f0f0e] leading-tight">
                Ready to make your savings matter?
              </h2>
            </div>
            <div className="lg:flex lg:justify-end">
              <div className="bg-white border border-[#e8e6e0] rounded-3xl p-10 max-w-sm w-full">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ccf88e] text-[#2d5a3d] text-[12px] font-bold mb-6">
                  Start in 30 seconds
                </span>
                <ol className="space-y-4 mb-10">
                  {["Connect your wallet", "Deposit money", "Start generating yield"].map((s, i) => (
                    <li key={s} className="flex items-center gap-3 text-sm text-[#6b6b62]">
                      <span className="w-6 h-6 rounded-full bg-[#eaf3ec] flex items-center justify-center text-[10px] font-bold text-[#3d6b4f] shrink-0">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
                <Link
                  href="/impact"
                  className="block w-full text-center bg-[#3d6b4f] text-[#ccf88e] font-bold py-4 rounded-full hover:bg-[#2d5a3d] transition-colors text-sm"
                >
                  Givvest Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
