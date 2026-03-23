"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { RiCloseLine, RiMenu3Line } from "react-icons/ri";
import logo from "../public/assets/logo.png";

const FONT = "'URWGeometric', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const NAVY = "#152B5A";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Startups", href: "/startups" },
  { label: "Tokenize", href: "/tokenize" },
  { label: "Investors", href: "/investors" },
  { label: "Events", href: "/events" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const activeTab: "startups" | "investors" = pathname.startsWith("/investors") ? "investors" : pathname.startsWith("/startups") ? "startups" : "startups";

  return (
    <>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.06)", width: "100%", maxWidth: "430px", fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", padding: 4, cursor: "pointer", display: "flex", alignItems: "center", WebkitTapHighlightColor: "transparent" }} aria-label="Open menu">
            <RiMenu3Line size={22} color="#C1C1C1" />
          </button>
          <Image src={logo} alt="Logo" width={37} height={32} style={{ objectFit: "contain" }} />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {(["startups", "investors"] as const).map((tab) => {
            const active = activeTab === tab;
            return (
              <button key={tab} onClick={() => router.push(tab === "investors" ? "/investors" : "/startups")}
                style={{ padding: "9px 20px", borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: "pointer", border: active ? "none" : "1px solid #C1C1C1", background: active ? NAVY : "#fff", color: active ? "#fff" : "#717182", transition: "all 0.18s", letterSpacing: "-0.01em", WebkitTapHighlightColor: "transparent", boxShadow: active ? "0 4px 12px rgba(21,43,90,0.18)" : "none", whiteSpace: "nowrap" }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Backdrop */}
      <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.4)", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none", transition: "opacity 0.22s" }} />

      {/* Drawer */}
      <div onClick={(e) => e.stopPropagation()} style={{ position: "fixed", top: 0, left: 0, width: 260, height: "100%", background: "#fff", zIndex: 50, boxShadow: "4px 0 32px rgba(0,0,0,0.12)", padding: "20px 24px", display: "flex", flexDirection: "column", transform: menuOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)", fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <Image src={logo} alt="Logo" width={37} height={32} style={{ objectFit: "contain" }} />
          <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", WebkitTapHighlightColor: "transparent" }}>
            <RiCloseLine size={22} color="#9ca3af" />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link key={label} href={href} onClick={() => setMenuOpen(false)}
                style={{ textDecoration: "none", display: "block", fontSize: 16, fontWeight: isActive ? 700 : 500, color: isActive ? NAVY : "#1f2937", padding: "10px 8px", borderRadius: 10, background: isActive ? "#f0f4ff" : "none", transition: "background 0.15s, color 0.15s", WebkitTapHighlightColor: "transparent" }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = NAVY; } }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? "#f0f4ff" : "none"; e.currentTarget.style.color = isActive ? NAVY : "#1f2937"; }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}