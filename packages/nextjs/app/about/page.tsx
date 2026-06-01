import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <p className="text-xs font-semibold text-[#3d6b4f] mb-3 tracking-widest uppercase">About Givvest</p>
        <h1 className="text-4xl font-bold text-[#1a1a18] mb-4 leading-tight">Giving without giving anything away</h1>
        <p className="text-lg text-[#6b6b62] leading-relaxed mb-16">
          Givvest lets anyone donate to charity using only the interest their money earns — not the money itself. Your
          principal stays yours. Always.
        </p>

        <hr className="border-[#e8e6e0] mb-16" />

        {/* The Problem */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-[#1a1a18] mb-4">The problem with traditional giving</h2>
          <p className="text-[#6b6b62] leading-relaxed mb-4">
            Most people want to give to charity. But money is finite, life is unpredictable, and parting with cash
            permanently carries real risk. What if you need it next month? What if your circumstances change?
          </p>
          <p className="text-[#6b6b62] leading-relaxed">
            These aren&rsquo;t excuses. They&rsquo;re rational concerns. The result is that billions of dollars in
            potential charity never gets donated — not because people don&rsquo;t care, but because giving forever feels
            irreversible.
          </p>
        </section>

        {/* The Givvest idea */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-[#1a1a18] mb-4">What if giving didn&rsquo;t cost you anything?</h2>
          <p className="text-[#6b6b62] leading-relaxed mb-4">
            Givvest is built around one insight: when money sits idle, it can still work. Banks, investment accounts,
            and digital finance protocols all earn interest on deposits. Usually, that interest flows back to the
            institution or the depositor.
          </p>
          <p className="text-[#6b6b62] leading-relaxed mb-4">Givvest redirects it to charity instead.</p>
          <p className="text-[#6b6b62] leading-relaxed">
            You deposit digital dollars (USDC — a 1:1 dollar-backed digital currency). Those dollars earn interest
            through Aave, a well-established lending protocol. The interest goes to charity. Your original deposit comes
            back to you whenever you ask for it.
          </p>
        </section>

        {/* Explainer box */}
        <div className="bg-white border border-[#e8e6e0] rounded-lg p-8 mb-14">
          <h3 className="font-bold text-[#1a1a18] mb-6">A simple example</h3>
          <div className="space-y-5">
            {[
              { step: "01", text: "You deposit $1,000 into Givvest." },
              { step: "02", text: "Your $1,000 earns, say, 5% interest per year — $50." },
              { step: "03", text: "That $50 goes to a charity voted on by the Givvest community." },
              { step: "04", text: "After a year, you withdraw your $1,000 back in full." },
              { step: "05", text: "You have lost nothing. A charity received $50." },
            ].map(({ step, text }) => (
              <div key={step} className="flex gap-4 items-start">
                <span className="text-[#3d6b4f] font-bold text-sm tabular-nums shrink-0 mt-0.5">{step}</span>
                <p className="text-[#6b6b62] leading-relaxed m-0">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[#e8e6e0]">
            <p className="text-sm font-semibold text-[#1a1a18]">
              The interest rate varies with market conditions and is never guaranteed. Your deposit, however, is always
              fully returned.
            </p>
          </div>
        </div>

        {/* What is USDC */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-[#1a1a18] mb-4">What is USDC?</h2>
          <p className="text-[#6b6b62] leading-relaxed mb-4">
            USDC is a digital dollar. Each USDC token is backed 1:1 by real US dollars held in regulated financial
            institutions. It doesn&rsquo;t fluctuate in value the way Bitcoin or other cryptocurrencies do. $1 of USDC
            is always worth approximately $1.
          </p>
          <p className="text-[#6b6b62] leading-relaxed">
            It&rsquo;s the type of digital asset most people use when they want the benefits of blockchain technology —
            transparency, speed, low fees — without exposure to price swings.
          </p>
        </section>

        {/* What is Aave */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-[#1a1a18] mb-4">How does the interest get generated?</h2>
          <p className="text-[#6b6b62] leading-relaxed mb-4">
            Givvest uses Aave — one of the largest and most battle-tested lending protocols in digital finance. Think of
            Aave as a transparent, automated lending bank that publishes every transaction publicly.
          </p>
          <p className="text-[#6b6b62] leading-relaxed mb-4">
            When you deposit USDC through Givvest, it gets lent to borrowers who post collateral. Borrowers pay
            interest. That interest is what gets donated to charity.
          </p>
          <p className="text-[#6b6b62] leading-relaxed">
            Aave has operated securely since 2020, managing billions of dollars in deposits. It is not infallible — no
            financial system is — but it represents the current standard for this type of activity in digital finance.
          </p>
        </section>

        {/* Risks */}
        <div className="bg-[#fdf8f0] border border-[#e8d9b8] rounded-lg p-8 mb-14">
          <h3 className="font-bold text-[#1a1a18] mb-4">Honest about the risks</h3>
          <p className="text-[#6b6b62] leading-relaxed mb-4">
            We want to be straight with you. Givvest is built on technology that is newer than traditional banking.
            There are risks:
          </p>
          <ul className="space-y-3 text-[#6b6b62] text-sm">
            <li className="flex gap-2 items-start">
              <span className="text-[#c9882a] shrink-0">—</span>
              <span>
                <strong className="text-[#1a1a18]">Variable yield:</strong> The interest rate Aave pays fluctuates with
                market demand. Your donation amount will vary month to month — sometimes higher, sometimes lower.
              </span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-[#c9882a] shrink-0">—</span>
              <span>
                <strong className="text-[#1a1a18]">Keep your wallet safe:</strong> Givvest is non-custodial — only you
                control your funds. Use a hardware wallet or a trusted software wallet, and never share your seed
                phrase.
              </span>
            </li>
          </ul>
          <p className="text-sm text-[#6b6b62] mt-4 leading-relaxed">
            Only deposit what you&rsquo;re comfortable exposing to these risks. Givvest is not a bank and deposits are
            not insured by government schemes.
          </p>
        </div>

        {/* Governance */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-[#1a1a18] mb-4">Who decides which charities receive the donations?</h2>
          <p className="text-[#6b6b62] leading-relaxed mb-4">
            The Givvest team currently controls the allocation of harvested yield to charities. Every distribution is
            made on-chain — meaning anyone can verify that funds went where we said they went.
          </p>
          <p className="text-[#6b6b62] leading-relaxed mb-4">
            We plan to transition to DAO governance over time, opening allocation decisions to the Givvest community.
          </p>
          <p className="text-[#6b6b62] leading-relaxed">
            At no point can governance access your principal. Governance can only direct the interest — the surplus
            above what depositors are owed — to charity recipients.
          </p>
        </section>

        {/* Built on Base */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-[#1a1a18] mb-4">Built on Base</h2>
          <p className="text-[#6b6b62] leading-relaxed mb-4">
            Givvest runs on Base, a blockchain built by Coinbase. Base is fast, inexpensive to use, and environmentally
            efficient compared to older blockchain technology. Transactions typically cost a few cents and settle in
            seconds.
          </p>
          <p className="text-[#6b6b62] leading-relaxed mb-6">
            Base also inherits the security properties of Ethereum, the most battle-tested smart-contract platform in
            existence.
          </p>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#9b9b90] uppercase tracking-widest mb-3">Smart Contracts</p>
            {[
              { name: "GivvestVault", address: "0x756371243cd7699beE5bFe538368f02e67Fd946a" },
              { name: "AaveV3Strategy", address: "0xD12fCAc36EA3D54E2A2ffB17A89f19C8E4509692" },
              { name: "GivvestTreasury", address: "0x266527CdeF53eF879E5bd358F8AD9d4DEabb0d79" },
            ].map(({ name, address }) => (
              <div key={name}>
                <p className="text-sm font-bold text-[#1a1a18] !m-0">{name}</p>
                <a
                  href={`https://sepolia.basescan.org/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[#b0b0a8] hover:text-[#3d6b4f] transition-colors"
                >
                  <span className="sm:hidden">{address.slice(0, 6) + "…" + address.slice(-4)}</span>
                  <span className="hidden sm:inline">{address}</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-[#e8e6e0] mb-12" />

        {/* CTA */}
        <div className="text-center">
          <p className="text-[#6b6b62] mb-6 leading-relaxed">
            Ready to start generating donations without giving anything away?
          </p>
          <Link
            href="/impact"
            className="inline-block px-8 py-3.5 bg-[#3d6b4f] text-white font-semibold rounded-md hover:bg-[#4a8060] transition-colors"
          >
            Givvest Now
          </Link>
        </div>
      </div>
    </div>
  );
}
