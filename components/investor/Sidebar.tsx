"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  TbChevronsLeft, TbLayoutDashboard, TbUser, TbBriefcase,
  TbCoin, TbChartBar, TbFileText, TbLogout, TbSearch,
} from "react-icons/tb";
import logo1 from "@/public/assets/logo1.png";
import { FONT } from "./shared";

const NAV_GROUPS = [
  {
    label: "MAIN",
    items: [
      { key: "overview",   label: "Overview",  Icon: TbLayoutDashboard },
      { key: "profile",    label: "Profile",   Icon: TbUser            },
    ],
  },
  {
    label: "ASSETS",
    items: [
      { key: "portfolio",  label: "Portfolio",       Icon: TbBriefcase },
      { key: "token",      label: "Token",           Icon: TbCoin      },
      { key: "due-diligence", label: "Due Diligence", Icon: TbSearch    },
    ],
  },
  {
    label: "INSIGHTS",
    items: [
      { key: "analytics",  label: "Analytics", Icon: TbChartBar  },
      { key: "documents",  label: "Documents", Icon: TbFileText  },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  defaultActive?: string;
}

const ROUTES: Record<string, string> = {
  overview: "/investors",
  profile: "/investors/profile",
  portfolio: "/investors/portfolio",
  token: "/investors/token",
  "due-diligence": "/investors/due-diligence",
  analytics: "/investors/analytics",
  documents: "/investors/documents",
};

export default function Sidebar({ open, onClose, defaultActive = "overview" }: SidebarProps) {
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
      {/* ── Backdrop ── */}
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

      {/* ── Drawer ── */}
      <nav
        aria-label="Main navigation"
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
        {/* ── Logo / Header row ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 18px 18px",
            borderBottom: "1px solid #f0f0f0",
            flexShrink: 0,
          }}
        >
          {/* Logo */}
          <Image
            src={logo1}
            alt="emireq"
            width={130}
            height={36}
            style={{ objectFit: "contain", display: "block" }}
            priority
          />

          {/* Close / collapse button */}
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              transition: "background 0.15s",
              WebkitTapHighlightColor: "transparent",
              flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <TbChevronsLeft size={22} color="#9ca3af" strokeWidth={2} />
          </button>
        </div>

        {/* ── Nav groups ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 12px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label} style={{ marginBottom: gi < NAV_GROUPS.length - 1 ? 8 : 0 }}>
              {/* Group label */}
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#b0b0b8",
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  padding: "4px 12px 8px",
                  userSelect: "none",
                }}
              >
                {group.label}
              </div>

              {/* Items */}
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
                        display: "flex",
                        alignItems: "center",
                        gap: 13,
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 14,
                        border: "none",
                        cursor: "pointer",
                        background: isActive
                          ? "#F6A800"
                          : isHovered
                          ? "#f3f4f6"
                          : "transparent",
                        color: isActive ? "#ffffff" : "#374151",
                        fontSize: 15,
                        fontWeight: isActive ? 600 : 500,
                        textAlign: "left",
                        transition: "background 0.15s, color 0.15s",
                        WebkitTapHighlightColor: "transparent",
                        outline: "none",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      <item.Icon
                        size={20}
                        color={isActive ? "#ffffff" : "#6b7280"}
                        strokeWidth={isActive ? 2.2 : 1.7}
                        style={{ flexShrink: 0 }}
                      />
                      <span style={{ lineHeight: 1 }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Account / Logout ── */}
        <div
          style={{
            padding: "12px 12px 28px",
            borderTop: "1px solid #f0f0f0",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "#b0b0b8",
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              padding: "8px 12px 8px",
              userSelect: "none",
            }}
          >
            ACCOUNT
          </div>

          <button
            aria-label="Log out"
            onMouseEnter={e => {
              e.currentTarget.style.background = "#fef2f2";
              e.currentTarget.style.color = "#ef4444";
              const svg = e.currentTarget.querySelector("svg");
              if (svg) svg.style.color = "#ef4444";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#374151";
              const svg = e.currentTarget.querySelector("svg");
              if (svg) svg.style.color = "#6b7280";
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 13,
              width: "100%",
              padding: "12px 14px",
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              background: "transparent",
              color: "#374151",
              fontSize: 15,
              fontWeight: 500,
              textAlign: "left",
              transition: "background 0.15s, color 0.15s",
              WebkitTapHighlightColor: "transparent",
              outline: "none",
              letterSpacing: "-0.01em",
            }}
          >
            <TbLogout
              size={20}
              color="#6b7280"
              strokeWidth={1.7}
              style={{ flexShrink: 0, transition: "color 0.15s" }}
            />
            <span style={{ lineHeight: 1 }}>Log out</span>
          </button>
        </div>
      </nav>
    </>
  );
}
