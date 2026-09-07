'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useGetBusinessesQuery } from "@/hooks/useBusinessQuery";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: "🌐",
    title: "Live in Minutes",
    desc: "Set up your store, add products, and share your link — all in under 5 minutes. No technical knowledge needed.",
    tag: "No code required",
    accent: "fc-steel",
    iconBg: "bg-linear-to-br from-blue-50 to-steel-light",
  },
  {
    icon: "🎨",
    title: "Fully Customisable",
    desc: "Add your logo, business name, description, opening hours, and social links. Your store, your identity.",
    tag: "Your brand, your way",
    accent: "fc-gold",
    iconBg: "bg-linear-to-br from-gold-pale to-gold-light",
  },
  {
    icon: "💬",
    title: "WhatsApp Enquiries",
    desc: "Customers tap 'Enquire' and WhatsApp opens with a pre-filled message. Get orders directly, no middleman.",
    tag: "Instant customer connect",
    accent: "fc-green",
    iconBg: "bg-linear-to-br from-green-50 to-green-200",
  },
  {
    icon: "🏢",
    title: "Any Business Type",
    desc: "Broker, bakery, wholesale dealer, guest lodge, or retailer — Catalogr works for every kind of business.",
    tag: "Universal platform",
    accent: "fc-purple",
    iconBg: "bg-linear-to-br from-purple-50 to-purple-200",
  },
];

const STEPS = [
  {
    num: "1",
    title: "Create your store",
    desc: "Click 'Create Free Store', enter your Tenant ID, and choose your business type. Takes 30 seconds.",
    tag: "⚡ Instant setup",
    tagColor: "bg-gold-pale border-gold/30 text-amber-700",
    numBg: "bg-linear-to-br from-steel-dark to-steel-mid",
    numColor: "text-white",
  },
  {
    num: "2",
    title: "Customise your profile",
    desc: "Add your logo, business description, contact details, social media links, and opening hours.",
    tag: "🎨 Make it yours",
    tagColor: "bg-gold-pale border-gold/30 text-amber-700",
    numBg: "bg-linear-to-br from-steel-dark to-steel-mid",
    numColor: "text-white",
  },
  {
    num: "3",
    title: "Add your products",
    desc: "Upload product photos, names, and descriptions. Your catalog is live the moment you save.",
    tag: "📦 Unlimited products",
    tagColor: "bg-gold-pale border-gold/30 text-amber-700",
    numBg: "bg-linear-to-br from-steel-dark to-steel-mid",
    numColor: "text-white",
  },
  {
    num: "4",
    title: "Share & get enquiries",
    desc: "Share your Catalogr link on WhatsApp, Instagram, or anywhere. Customers browse and enquire directly.",
    tag: "🚀 You're live!",
    tagColor: "bg-green-50 border-green-200 text-green-700",
    numBg: "bg-linear-to-br from-gold to-gold-light",
    numColor: "text-steel-dark",
    isLast: true,
  },
];

/* ─────────────────────────────────────────────────────────────
   HEADER
───────────────────────────────────────────────────────────── */
function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goToAdminSettings = () => {
    setMobileMenuOpen(false);
    router.push(`/admin/settings`);
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-(--shadow-card)">
      <div className="max-w-6xl mx-auto px-6 h-[70px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-steel-dark to-steel-mid flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
          </div>
          <div className="leading-none">
            <div className="font-display text-xl font-black text-steel-dark tracking-tight">
              Catalo<span className="text-gold">gr</span>
            </div>
            <div className="text-[10px] text-steel uppercase tracking-widest mt-0.5">
              Business Showcase
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          <Link href="#features" className="px-4 py-2 rounded-full text-sm font-medium text-steel-mid hover:text-steel-dark hover:bg-cream transition-all duration-200">Features</Link>
          <Link href="#how-it-works" className="px-4 py-2 rounded-full text-sm font-medium text-steel-mid hover:text-steel-dark hover:bg-cream transition-all duration-200">How it Works</Link>
          <Link href="#directory" className="px-4 py-2 rounded-full text-sm font-medium text-steel-mid hover:text-steel-dark hover:bg-cream transition-all duration-200">Directory</Link>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <div
            onClick={goToAdminSettings}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-steel-dark text-white text-sm font-semibold hover:bg-gold hover:text-steel-dark transition-all duration-200 shadow-md hover:shadow-(--shadow-gold) hover:-translate-y-0.5 cursor-pointer"
          >
            <span>✦</span> Create Free Store
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 border-none bg-transparent cursor-pointer"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span className={`block w-5 h-0.5 bg-steel-dark rounded transition-transform duration-200 ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block w-5 h-0.5 bg-steel-dark rounded transition-opacity duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-steel-dark rounded transition-transform duration-200 ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile Nav Panel */}
      {mobileMenuOpen && (
        <nav className="md:hidden flex flex-col gap-1 px-6 py-4 border-t border-gray-100 bg-white">
          <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-steel-mid hover:text-steel-dark hover:bg-cream transition-all duration-200">Features</Link>
          <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-steel-mid hover:text-steel-dark hover:bg-cream transition-all duration-200">How it Works</Link>
          <Link href="#directory" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-steel-mid hover:text-steel-dark hover:bg-cream transition-all duration-200">Directory</Link>
          <div
            onClick={goToAdminSettings}
            className="flex items-center justify-center gap-2 mt-2 px-5 py-3 rounded-full bg-steel-dark text-white text-sm font-semibold hover:bg-gold hover:text-steel-dark transition-all duration-200 cursor-pointer"
          >
            <span>✦</span> Create Free Store
          </div>
        </nav>
      )}
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────── */
function Hero() {
  const router = useRouter();

  return (
    <section className="hero-clip hero-grid relative overflow-hidden bg-linear-to-br from-steel-dark via-[#3a5570] to-[#2c4a62] pt-24 pb-32 px-6">
      {/* Glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-1/4 w-64 h-64 bg-steel/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left: Content */}
        <div className="animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold-light px-4 py-2 rounded-full text-xs font-semibold tracking-wide mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-dot" />
            Free for every business · No credit card needed
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-black text-white leading-[1.1] tracking-tight mb-6">
            Your business,
            <br />
            <em className="not-italic text-gold-light">beautifully</em>
            <br />
            showcased.
          </h1>

          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-[460px]">
            Catalogr lets any business — shop, broker, bakery, guest lodge —
            build a stunning digital product catalog and share it with customers
            in minutes. Free, forever.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 mb-12">
            <div
              onClick={() => router.push(`/admin/settings `)}
              className="flex items-center gap-2 bg-gold hover:bg-gold-light text-steel-dark font-bold text-sm px-7 py-4 rounded-full shadow-(--shadow-gold) hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              Create Your Free Store →
            </div>
            <Link
              href="#directory"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 text-sm font-medium px-6 py-4 rounded-full transition-all duration-200"
            >
              Browse Businesses ↓
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 flex-wrap">
            <div>
              <div className="font-display text-3xl font-bold text-gold-light">50+</div>
              <div className="text-white/50 text-xs uppercase tracking-wider mt-1">Businesses Live</div>
            </div>
            <div className="w-px h-9 bg-white/15" />
            <div>
              <div className="font-display text-3xl font-bold text-gold-light">5 min</div>
              <div className="text-white/50 text-xs uppercase tracking-wider mt-1">To Go Live</div>
            </div>
            <div className="w-px h-9 bg-white/15" />
            <div>
              <div className="font-display text-3xl font-bold text-gold-light">100%</div>
              <div className="text-white/50 text-xs uppercase tracking-wider mt-1">Free Forever</div>
            </div>
          </div>
        </div>

        {/* Right: Floating Mockup */}
        <div className="flex justify-center lg:justify-end animate-fade-up-2">
          <div className="w-full max-w-[360px] bg-white/8 border border-white/12 rounded-2xl p-4 backdrop-blur-md shadow-2xl animate-float">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <div className="flex-1 bg-white/10 rounded-md px-3 py-1 text-[10px] text-white/40 font-mono">
                catalogr.app/store?id=rajsteel
              </div>
            </div>

            {/* Mockup header bar */}
            <div className="bg-steel-dark rounded-xl px-3 py-2.5 flex items-center justify-between mb-2">
              <span className="font-display text-sm font-bold text-white">
                Raj <span className="text-gold-light">Wholesale</span>
              </span>
              <span className="bg-gold text-steel-dark text-[9px] font-bold px-2 py-1 rounded-full">
                🛒 2
              </span>
            </div>

            {/* Mockup hero strip */}
            <div className="bg-linear-to-r from-steel-dark/80 to-steel-mid/60 rounded-lg p-3 mb-2 text-center">
              <div className="font-display text-[11px] font-bold text-white">
                Stainless Steel Shop
              </div>
              <div className="text-[8px] text-white/55 mt-0.5">
                Wholesale · Bangalore · Est. 2004
              </div>
            </div>

            {/* Mockup product grid */}
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {[
                { emoji: "🥘", label: "Pressure Cooker", inCart: false },
                { emoji: "🍳", label: "Steel Pan Set", inCart: false },
                { emoji: "🍱", label: "Tiffin Box", inCart: true },
              ].map((p) => (
                <div key={p.label} className="bg-white/10 rounded-lg p-2 flex flex-col items-center gap-1">
                  <span className="text-xl">{p.emoji}</span>
                  <span className="text-[7px] text-white/70 text-center leading-tight">{p.label}</span>
                  {p.inCart ? (
                    <span className="bg-white/20 text-white/60 text-[6px] font-bold px-1.5 py-0.5 rounded">✓ Cart</span>
                  ) : (
                    <span className="bg-gold text-steel-dark text-[6px] font-bold px-1.5 py-0.5 rounded">Add</span>
                  )}
                </div>
              ))}
            </div>

            {/* Mockup contact row */}
            <div className="flex items-center justify-between bg-white/6 rounded-lg px-2.5 py-2">
              <span className="text-[8px] text-white/50">📞 9909090909</span>
              <span className="text-[8px] text-white/50">📍 Chikpete, Blr</span>
              <span className="bg-[#25D366]/80 text-white text-[7px] font-bold px-2 py-0.5 rounded-full">
                WhatsApp
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FEATURES
───────────────────────────────────────────────────────────── */
function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-cream">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-[2px] uppercase text-gold mb-3 block">
            Why Catalogr
          </span>
          <h2 className="font-display text-4xl font-black text-steel-dark leading-tight tracking-tight mb-4">
            Everything your business
            <br />
            <em className="not-italic text-steel-mid">needs to shine online</em>
          </h2>
          <p className="text-steel text-base leading-relaxed max-w-lg mx-auto">
            No code, no designers, no monthly fees. Just a beautiful digital
            catalog your customers can browse and enquire from.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`feature-card ${f.accent} bg-white border border-gray-200 rounded-[18px] p-7 shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) hover:-translate-y-1.5 transition-all duration-250 group`}
            >
              <div
                className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200`}
              >
                {f.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-steel-dark mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-steel leading-relaxed">{f.desc}</p>
              <div className="flex items-center gap-1 mt-5 text-xs text-steel font-medium">
                <span className="text-green-600">✓</span> {f.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────────────────────────── */
function HowItWorks() {
  const router = useRouter();

  return (
    <section id="how-it-works" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Steps */}
        <div>
          <span className="text-xs font-semibold tracking-[2px] uppercase text-gold mb-3 block">
            Get Started
          </span>
          <h2 className="font-display text-4xl font-black text-steel-dark leading-tight tracking-tight mb-3">
            Up and running
            <br />
            <em className="not-italic text-steel-mid">in 4 simple steps</em>
          </h2>
          <p className="text-steel text-base leading-relaxed mb-10">
            No downloads. No developers. Just you and your business.
          </p>

          <div className="flex flex-col gap-0">
            {STEPS.map((step, i) => (
              <div key={step.num} className={`flex gap-5 ${!step.isLast ? "pb-8" : ""} relative`}>
                {!step.isLast && <div className="step-connector" />}
                <div
                  className={`w-11 h-11 rounded-full ${step.numBg} flex items-center justify-center font-display text-lg font-bold ${step.numColor} shadow-md flex-shrink-0 z-10`}
                >
                  {step.num}
                </div>
                <div className="pt-1.5">
                  <h4 className="font-display text-lg font-bold text-steel-dark mb-1">
                    {step.title}
                  </h4>
                  <p className="text-sm text-steel leading-relaxed">{step.desc}</p>
                  <span
                    className={`inline-flex items-center gap-1.5 mt-3 border ${step.tagColor} text-xs font-medium px-3 py-1 rounded-full`}
                  >
                    {step.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info panel */}
        <div className="flex flex-col gap-5">
          {/* CTA card */}
          <div className="bg-linear-to-br from-steel-dark to-steel-mid rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gold/10 rounded-full" />
            <div className="relative z-10">
              <div className="text-3xl mb-4">🏪</div>
              <h3 className="font-display text-2xl font-bold mb-3">
                Works for every business
              </h3>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {["Wholesale dealers", "Brokers & agents", "Bakeries", "Guest lodges", "Boutiques", "Any business!"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                    <span className="text-gold">✓</span> {item}
                  </div>
                ))}
              </div>
              <div
                onClick={() => router.push(`/admin/settings `)}
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-steel-dark font-bold text-sm px-6 py-3 rounded-full transition-all duration-200 shadow-(--shadow-gold) cursor-pointer"
              >
                Start for free →
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "🔒", label: "Secure", sub: "Private by default" },
              { icon: "📱", label: "Mobile-first", sub: "Works on all devices" },
              { icon: "💸", label: "Free forever", sub: "No hidden charges" },
            ].map((b) => (
              <div key={b.label} className="bg-cream rounded-xl p-4 text-center border border-gray-200">
                <div className="text-2xl mb-1">{b.icon}</div>
                <div className="text-xs font-semibold text-steel-dark">{b.label}</div>
                <div className="text-[10px] text-steel mt-0.5">{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   DIRECTORY  (API-driven with filtering)
───────────────────────────────────────────────────────────── */
function Directory() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: businesses = [], isLoading } = useGetBusinessesQuery();

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredBusinesses = businesses.filter((biz) => {
    const matchesCategory =
      selectedCategory === "all" ||
      biz.shopType?.toLowerCase() === selectedCategory;

    const matchesSearch =
      !normalizedSearch ||
      biz.siteTitle?.toLowerCase().includes(normalizedSearch) ||
      biz.ownerName?.toLowerCase().includes(normalizedSearch) ||
      biz.shopType?.toLowerCase().includes(normalizedSearch) ||
      biz.address?.toLowerCase().includes(normalizedSearch) ||
      biz.siteDescription?.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  const allCategories = ["all", "broker", "shop", "bakery", "lodge"];
  const getCategoryCount = (cat: string) => {
    if (cat === "all") return businesses.length;
    return businesses.filter((b) => b.shopType?.toLowerCase() === cat).length;
  };

  const displayedBusinesses = filteredBusinesses;

  return (
    <section id="directory" className="py-24 px-6 bg-cream">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-[2px] uppercase text-gold mb-3 block">
            Explore
          </span>
          <h2 className="font-display text-4xl font-black text-steel-dark leading-tight tracking-tight mb-4">
            Browse Businesses
          </h2>
          <p className="text-steel text-base leading-relaxed max-w-md mx-auto">
            Discover shops, brokers, bakeries, and more — all registered on Catalogr.
          </p>
        </div>

        {/* Search + Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-xs">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-steel pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-white text-sm text-steel-dark placeholder:text-steel shadow-(--shadow-card) focus:outline-none focus:border-steel-mid focus:ring-2 focus:ring-steel-light/40 transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {allCategories.map((cat) => {
              const tabLabels: Record<string, { icon: string; label: string }> = {
                all: { icon: "🏢", label: "All" },
                broker: { icon: "🤝", label: "Brokers" },
                shop: { icon: "🏪", label: "Shops" },
                bakery: { icon: "🥐", label: "Bakeries" },
                lodge: { icon: "🏨", label: "Lodges" },
              };
              const tabInfo = tabLabels[cat] || { icon: "🏢", label: "All" };
              const count = getCategoryCount(cat);

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`dir-tab ${
                    selectedCategory === cat ? "active" : ""
                  } flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "border-steel-mid bg-white text-steel-dark"
                      : "border-gray-200 bg-white text-steel-mid hover:border-steel-light hover:bg-cream"
                  }`}
                >
                  <span>{tabInfo.icon}</span>
                  {tabInfo.label}
                  <span className="tab-count bg-cream text-steel text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-steel">
            Showing <strong className="text-steel-dark">{displayedBusinesses.length}</strong> businesses
            {isLoading && <span className="text-xs text-steel ml-2">(loading...)</span>}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-steel">Live directory</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-steel">Loading businesses...</p>
            </div>
          ) : displayedBusinesses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-steel">No businesses found. Try adjusting your filters.</p>
            </div>
          ) : (
            displayedBusinesses.map((biz) => (
              <Link
                key={biz.tenantid}
                href={`/store?tenantid=${biz.tenantid}`}
                className="biz-card bg-white border border-gray-200 rounded-2xl p-5 shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) hover:-translate-y-1 transition-all duration-200 no-underline block"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-linear-to-br from-steel-dark to-steel-mid flex items-center justify-center text-2xl flex-shrink-0">
                    {typeof biz.siteLogo === "string" ? (
                      <Image
                        src={biz.siteLogo}
                        alt={biz.siteTitle || "Business logo"}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : typeof biz.siteLogo === "object" && biz.siteLogo !== null && "url" in biz.siteLogo ? (
                      <Image
                        src={(biz.siteLogo as { url?: string }).url || ""}
                        alt={biz.siteTitle || "Business logo"}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{biz.siteTitle?.charAt(0) ?? "🏢"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-base font-bold text-steel-dark leading-tight truncate">
                      {biz.siteTitle || "Untitled Business"}
                    </h4>
                    <p className="text-xs text-steel mt-0.5">{biz.ownerName || "Owner"}</p>
                  </div>
                  <span className="flex-shrink-0 bg-cream text-steel-dark border text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    {biz.shopType || "Business"}
                  </span>
                </div>
                <p className="text-xs text-steel leading-relaxed mb-4 line-clamp-3">
                  {biz.siteDescription || "No description available."}
                </p>
                <div className="flex items-center justify-between text-[10px] text-steel">
                  <span>📍 {biz.address || "Location not set"}</span>
                  <span className="font-semibold text-steel-dark">View Store</span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Join CTA */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-(--shadow-card)">
            <span className="text-2xl">✨</span>
            <span className="text-sm text-steel-mid">Want your business listed here?</span>
            <div
              onClick={() => router.push(`/admin/settings`)}
              className="bg-steel-dark hover:bg-gold text-white hover:text-steel-dark text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 cursor-pointer"
            >
              Join for free →
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER CTA BANNER
───────────────────────────────────────────────────────────── */
function FooterCTA() {
  const router = useRouter();
  return (
    <section className="bg-linear-to-br from-steel-dark to-steel-mid py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-50" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="font-display text-4xl font-black text-white mb-4 tracking-tight">
          Ready to showcase
          <br />
          <em className="not-italic text-gold-light">your business?</em>
        </h2>
        <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          Join 50+ businesses already on Catalogr. Free to start, free forever.
          Your store goes live in minutes.
        </p>
        <div
          onClick={() => router.push(`/admin/settings`)}
          className="inline-flex items-center gap-3 bg-gold hover:bg-gold-light text-steel-dark font-bold text-base px-8 py-4 rounded-full shadow-(--shadow-gold) hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
          ✦ Create Your Free Store
        </div>
        <p className="text-white/35 text-xs mt-5">
          No credit card · No downloads · No code
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-steel-dark border-t border-white/5 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
          </div>
          <span className="font-display text-white font-bold">
            Catalo<span className="text-gold">gr</span>
          </span>
        </div>
        <p className="text-white/40 text-xs text-center">
          © 2026 Catalogr. Built for every business. · Contact:{" "}
          <a href="mailto:professor3416@gmail.com" className="text-gold-light hover:underline">
            professor3416@gmail.com
          </a>
        </p>
        <a href="#" className="text-white/40 hover:text-gold-light text-xs transition-colors">
          WhatsApp
        </a>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE  (default export)
───────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Directory />
        <FooterCTA />
      </main>
      <Footer />
    </>
  );
}
