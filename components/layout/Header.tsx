"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Globe } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { uniqueProducts } from "@/data/products";
import type { CurrencyCode } from "@/lib/config";

// ─── Mega-menu data ───────────────────────────────────────────────────────────
const NAV = [
  {
    label: "Shop",
    href: "/shop",
    mega: [
      {
        heading: "Browse",
        links: [
          { label: "Best Sellers", href: "/shop?sort=bestseller" },
          { label: "Restocked", href: "/shop?badge=Restocked" },
          { label: "Staff Picks", href: "/shop?badge=Staff+Pick" },
          { label: "New Arrivals", href: "/shop?badge=New" },
          { label: "Bundles & Stacks", href: "/bundles" },
        ],
      },
      {
        heading: "Categories",
        links: [
          { label: "GLP-1 / Metabolic", href: "/shop/glp1-metabolic" },
          { label: "Growth Hormone Axis", href: "/shop/gh-secretagogues" },
          { label: "Tissue & Repair", href: "/shop/tissue-repair" },
          { label: "Cognitive / Nootropic", href: "/shop/cognitive" },
          { label: "Anti-Ageing / Bioregulators", href: "/shop/anti-ageing" },
          { label: "Melanocortin", href: "/shop/melanocortin" },
          { label: "Cellular / Longevity", href: "/shop/longevity" },
        ],
      },
    ],
  },
  {
    label: "Formats",
    href: "#",
    mega: [
      {
        heading: "Product Formats",
        links: [
          { label: "Lyophilised Vials", href: "/shop?format=Lyophilised+Vial" },
          { label: "Blends & Stacks", href: "/bundles" },
          { label: "Reconstitution Supplies", href: "/shop/reconstitution-lab-supplies" },
        ],
      },
    ],
  },
  { label: "Lab Tests", href: "/lab-tests" },
  {
    label: "Research Hub",
    href: "/research-hub",
    mega: [
      {
        heading: "Tools",
        links: [
          { label: "Peptide Calculator", href: "/peptide-calculator" },
          { label: "Storage & Handling", href: "/storage-handling" },
          { label: "Compound Glossary", href: "/glossary" },
          { label: "FAQ", href: "/faq" },
        ],
      },
      {
        heading: "Articles",
        links: [
          { label: "Research Hub", href: "/research-hub" },
        ],
      },
    ],
  },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const { currency, setCurrency, currencies } = useCurrency();
  const { user } = useAuth();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return uniqueProducts
      .filter((p) => {
        const haystack = [p.name, p.category, p.slug, ...(p.synonyms ?? [])]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 8);
  }, [searchQuery]);

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openItem(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }
  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  }

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(10,10,11,0.97)"
          : "var(--bg)",
        borderBottom: "1px solid var(--line)",
        backdropFilter: scrolled ? "blur(12px)" : undefined,
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center h-16 gap-6">
        {/* Logo */}
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1" aria-label="Main navigation">
          {NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.mega && openItem(item.label)}
              onMouseLeave={() => item.mega && scheduleClose()}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded transition-colors"
                style={{
                  color: openMenu === item.label ? "var(--accent)" : "var(--muted)",
                }}
                onFocus={() => item.mega && openItem(item.label)}
              >
                {item.label}
                {item.mega && <ChevronDown size={13} />}
              </Link>

              {/* Mega dropdown */}
              {item.mega && openMenu === item.label && (
                <div
                  className="absolute left-0 top-full pt-2"
                  onMouseEnter={() => openItem(item.label)}
                  onMouseLeave={scheduleClose}
                >
                  <div
                    className="rounded-lg p-6 flex gap-10 min-w-[480px]"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--line-med)",
                      boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                    }}
                  >
                    {item.mega.map((col) => (
                      <div key={col.heading} className="flex flex-col gap-2 min-w-[160px]">
                        <p className="label-upper mb-2">{col.heading}</p>
                        {col.links.map((link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setOpenMenu(null)}
                            className="text-sm transition-colors hover:text-[var(--accent)]"
                            style={{ color: "var(--text)" }}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Search */}
          <button
            onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
            aria-label="Search"
            aria-expanded={searchOpen}
            className="p-2 rounded transition-colors hover:text-[var(--accent)]"
            style={{ color: searchOpen ? "var(--accent)" : "var(--muted)" }}
          >
            <Search size={18} />
          </button>

          {/* Currency selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              aria-label="Select currency"
              className="flex items-center gap-1 p-2 rounded transition-colors text-sm"
              style={{ color: "var(--muted)" }}
            >
              <Globe size={15} />
              <span>{currency}</span>
              <ChevronDown size={12} />
            </button>
            {currencyOpen && (
              <div
                className="absolute right-0 top-full mt-1 rounded p-1 min-w-[80px] z-50"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--line-med)",
                }}
              >
                {(Object.keys(currencies) as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-sm rounded transition-colors hover:bg-[var(--surface-3)]"
                    style={{
                      color: c === currency ? "var(--accent)" : "var(--text)",
                      fontWeight: c === currency ? 600 : 400,
                    }}
                  >
                    {currencies[c].symbol} {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Account */}
          <Link
            href="/account"
            aria-label={user ? `Account — signed in as ${user.email}` : "Sign in"}
            className="relative p-2 rounded transition-colors hidden sm:block"
            style={{ color: user ? "var(--accent)" : "var(--muted)" }}
          >
            <User size={18} />
            {user && (
              <span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{ background: "var(--green)" }}
              />
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            aria-label={`Cart — ${count} item${count !== 1 ? "s" : ""}`}
            className="relative p-2 rounded transition-colors"
            style={{ color: "var(--muted)" }}
          >
            <ShoppingCart size={18} />
            {count > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>

          {/* CTA */}
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold tracking-wide transition-all hover:brightness-110 active:scale-95"
            style={{
              background: "var(--accent)",
              color: "#fff",
              letterSpacing: "0.06em",
            }}
          >
            ORDER PEPTIDES
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="lg:hidden p-2"
            style={{ color: "var(--text)" }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div
          className="border-t px-4 sm:px-6 py-3"
          style={{ borderColor: "var(--line)", background: "var(--surface)" }}
        >
          <div className="max-w-[1280px] mx-auto">
            <div className="flex items-center gap-2">
              <Search size={16} style={{ color: "var(--muted)" }} className="shrink-0" />
              <input
                type="search"
                placeholder="Search compounds, categories…"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
                style={{ color: "var(--text)" }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") closeSearch();
                  if (e.key === "Enter" && searchResults.length > 0) {
                    router.push(`/product/${searchResults[0].slug}`);
                    closeSearch();
                  }
                }}
              />
              <button
                onClick={closeSearch}
                aria-label="Close search"
                className="shrink-0 p-1 rounded transition-colors hover:text-[var(--accent)]"
                style={{ color: "var(--muted)" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Live results */}
            {searchQuery.trim() && (
              <div className="mt-3 flex flex-col gap-1">
                {searchResults.length === 0 ? (
                  <p className="text-sm py-2" style={{ color: "var(--muted)" }}>
                    No compounds found for “{searchQuery.trim()}”.
                  </p>
                ) : (
                  searchResults.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/product/${p.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-3 p-2 rounded transition-colors hover:bg-[var(--surface-2)]"
                    >
                      <span
                        className="relative w-9 h-9 shrink-0 rounded overflow-hidden"
                        style={{ background: "var(--surface-2)" }}
                      >
                        {p.image && (
                          <Image src={p.image} alt="" fill className="object-cover" sizes="36px" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span
                          className="block text-sm font-semibold truncate"
                          style={{ color: "var(--text)", fontFamily: "var(--font-syne), sans-serif" }}
                        >
                          {p.name}
                        </span>
                        <span className="block text-xs truncate" style={{ color: "var(--muted)" }}>
                          {p.category}
                        </span>
                      </span>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-16"
          style={{ background: "var(--bg)" }}
        >
          <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
            {NAV.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-base font-semibold border-b"
                  style={{ color: "var(--text)", borderColor: "var(--line)" }}
                >
                  {item.label}
                </Link>
                {item.mega?.flatMap((col) =>
                  col.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 pl-4 text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      {link.label}
                    </Link>
                  ))
                )}
              </div>
            ))}

            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="mt-6 block text-center py-3 rounded font-semibold border"
              style={{ borderColor: "var(--line-med)", color: user ? "var(--accent)" : "var(--text)" }}
            >
              {user ? `Account — ${user.email}` : "Sign In"}
            </Link>

            <Link
              href="/shop"
              onClick={() => setMobileOpen(false)}
              className="mt-3 block text-center py-3 rounded font-semibold tracking-wide"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              ORDER PEPTIDES
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
