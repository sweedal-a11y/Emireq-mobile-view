"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  TbChevronsLeft, TbChartLine, TbUserCircle, TbSend,
  TbBriefcase, TbCurrencyDollar, TbFileText, TbMessage,
  TbLogout,
} from "react-icons/tb";
import logo1 from "@/public/assets/logo1.png";
import { FONT } from "./shared";

const NAV_GROUPS = [
  {
    label: "MAIN",
    items: [
      { key: "overview",   label: "Overview",   Icon: TbChartLine    },
      { key: "profile",    label: "My Profile",  Icon: TbUserCircle   },
    ],
  },
  {
    label: "INVESTORS",
    items: [
      { key: "outreach",         label: "Outreach Sent",      Icon: TbSend           },
      { key: "inquiries",        label: "Investor Inquiries",  Icon: TbBriefcase      },
      { key: "funding-progress", label: "Funding Progress",    Icon: TbCurrencyDollar },
    ],
  },
  {
    label: "COMPLIANCE",
    items: [
      { key: "documents", label: "Documents & Compliance", Icon: TbFileText },
    ],
  },
  {
    label: "COMMUNICATION",
    items: [
      { key: "messages", label: "Messages", Icon: TbMessage },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  defaultActive?: string;
}

const ROUTES: Record<string, string> = {
  overview: "/startups",
  profile: "/startups/profile",
  outreach: "/startups/outreach",
  inquiries: "/startups/inquiries",
  "funding-progress": "/startups/funding-progress",
  documents: "/startups/documents",
  messages: "/startups/messages",
};

export default function StartupsSidebar({ open, onClose, defaultActive = "overview" }: SidebarProps) {
  const [active, setActive] = useState(defaultActive);
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();

  function handleItem(key: string) {
    setActive(key);
    if (ROUTES[key]) {
      router.push(ROUTES[key]);
    }
    setTimeout(onClose, 160);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        aria-label="Close menu"
        tabIndex={-1}
        onClick={onClose}
        onKeyDown={e => e.key === "Escape" && onClose()}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.32)",
          backdropFilter: "blur(1px)",
          WebkitBackdropFilter: "blur(1px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.22s ease",
          cursor: "default",
        }}
      />

      {/* Drawer */}
      <nav
        aria-label="Startups navigation"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "min(272px, 80vw)",
          height: "100dvh",
          background: "#ffffff",
          zIndex: 50,
          boxShadow: open ? "6px 0 40px rgba(0,0,0,0.14)" : "none",
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.26s cubic-bezier(0.4,0,0.2,1), box-shadow 0.26s",
          fontFamily: FONT,
          overscrollBehavior: "contain",
        }}
      >
        {/* Logo row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 18px 18px",
          borderBottom: "1px solid #f0f0f0",
          flexShrink: 0,
        }}>
          <Image src={logo1} alt="emireq" width={130} height={36} style={{ objectFit: "contain", display: "block" }} priority />
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            style={{
              background: "none", border: "none", cursor: "pointer", padding: "6px",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 8, transition: "background 0.15s",
              WebkitTapHighlightColor: "transparent", flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <TbChevronsLeft size={22} color="#9ca3af" strokeWidth={2} />
          </button>
        </div>

        {/* Nav groups */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 12px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label} style={{ marginBottom: gi < NAV_GROUPS.length - 1 ? 8 : 0 }}>
              <div style={{
                fontSize: 10.5, fontWeight: 700, color: "#b0b0b8",
                letterSpacing: "0.09em", textTransform: "uppercase",
                padding: "4px 12px 8px", userSelect: "none",
              }}>
                {group.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {group.items.map(item => {
                  const isActive = active === item.key;
                  const isHovered = hovered === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleItem(item.key)}
                      onMouseEnter={() => setHovered(item.key)}
                      onMouseLeave={() => setHovered(null)}
                      aria-current={isActive ? "page" : undefined}
                      style={{
                        display: "flex", alignItems: "center", gap: 13, width: "100%",
                        padding: "12px 14px", borderRadius: 14, border: "none",
                        cursor: "pointer", fontFamily: FONT, fontSize: 14, fontWeight: isActive ? 600 : 500,
                        color: isActive ? "#0f172a" : "#6b7280",
                        background: isActive ? "#F5B731" : isHovered ? "#f9fafb" : "transparent",
                        transition: "all 0.15s ease",
                        WebkitTapHighlightColor: "transparent",
                        textAlign: "left",
                      }}
                    >
                      <item.Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} color={isActive ? "#0f172a" : "#9ca3af"} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Account / Logout */}
        <div style={{
          padding: "14px 12px 20px",
          flexShrink: 0,
        }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, color: "#b0b0b8",
            letterSpacing: "0.09em", textTransform: "uppercase",
            padding: "4px 12px 8px", userSelect: "none",
          }}>
            ACCOUNT
          </div>
          <button
            onClick={onClose}
            onMouseEnter={() => setHovered("logout")}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex", alignItems: "center", gap: 13, width: "100%",
              padding: "12px 14px", borderRadius: 14, border: "none",
              cursor: "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 500,
              color: hovered === "logout" ? "#dc2626" : "#6b7280",
              background: hovered === "logout" ? "#fef2f2" : "transparent",
              transition: "all 0.15s ease",
              WebkitTapHighlightColor: "transparent",
              textAlign: "left",
            }}
          >
            <TbLogout size={20} strokeWidth={1.8} color={hovered === "logout" ? "#dc2626" : "#9ca3af"} />
            Log out
          </button>
        </div>
      </nav>
    </>
  );
}
