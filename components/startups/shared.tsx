"use client";

import { useState } from "react";
import { RiMenu3Line } from "react-icons/ri";
import StartupsSidebar from "./Sidebar";

export const FONT = "'URWGeometric', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
export const F: React.CSSProperties = { fontFamily: FONT };

export function InfoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="8" fill="#AFAFAF" />
      <path fillRule="evenodd" clipRule="evenodd" d="M9.30469 5.24219C9.42969 5.02344 9.5 4.76953 9.5 4.5C9.5 3.67188 8.82812 3 8 3C7.17188 3 6.5 3.67188 6.5 4.5C6.5 5.32812 7.17188 6 8 6C8.55859 6 9.04688 5.69531 9.30469 5.24219ZM7 7H7.5H8.5C9.05273 7 9.5 7.44727 9.5 8V9V13C9.5 13.5527 9.05273 14 8.5 14C7.94727 14 7.5 13.5527 7.5 13V9.75C7.5 9.33594 7.16406 9 6.75 9C6.33594 9 6 8.66406 6 8.25V8C6 7.64844 6.18164 7.33789 6.45508 7.16016C6.61133 7.05859 6.79883 7 7 7Z" fill="white" />
    </svg>
  );
}

export function PageShell({
  title,
  defaultActive,
  children,
}: {
  title: string;
  defaultActive?: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ ...F, background: "#fff", minHeight: "100vh", WebkitTapHighlightColor: "transparent" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px", background: "#fff",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        position: "sticky", top: 0, zIndex: 30,
      }}>
        <button
          onClick={() => setSidebarOpen(true)}
          style={{ background: "none", border: "none", padding: 6, cursor: "pointer", display: "flex", alignItems: "center", WebkitTapHighlightColor: "transparent" }}
          aria-label="Open menu"
        >
          <RiMenu3Line size={22} color="#374151" />
        </button>
        <span style={{ fontSize: 17, fontWeight: 600, color: "#111827", letterSpacing: "-0.02em" }}>{title}</span>
        <div style={{ width: 34 }} />
      </div>
      <StartupsSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} defaultActive={defaultActive} />
      {children}
    </div>
  );
}

export const cardBase: React.CSSProperties = {
  background: "#fff",
  borderRadius: 20,
  padding: "20px 16px",
  border: "1px solid rgba(0,0,0,0.07)",
  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
};
