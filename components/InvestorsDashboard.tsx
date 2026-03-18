"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  TbCurrencyDollar, TbTargetArrow, TbTrendingUp, TbCircleCheck,
  TbInfoCircle, TbArrowsMaximize, TbPencil, TbDots,
  TbPlus, TbArrowUpRight, TbDownload, TbRefresh,
  TbWorld, TbActivity, TbChevronsLeft,
  TbLayoutDashboard, TbUser, TbBriefcase, TbCoin,
  TbChartBar, TbFileText, TbLogout,
} from "react-icons/tb";
import { RiMenu3Line } from "react-icons/ri";
import logo from "../public/assets/logo1.png";

const FONT = "'URWGeometric', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const F: React.CSSProperties = { fontFamily: FONT };

// ─── Chart Data ───────────────────────────────────────────────────────────────

const CHART_DATA: Record<string, { month: string; value: number }[]> = {
  "1W": [
    { month: "Mon", value: 398000 }, { month: "Tue", value: 402000 },
    { month: "Wed", value: 399000 }, { month: "Thu", value: 405000 },
    { month: "Fri", value: 408000 }, { month: "Sat", value: 407000 },
    { month: "Sun", value: 410000 },
  ],
  "1M": [
    { month: "W1", value: 385000 }, { month: "W2", value: 390000 },
    { month: "W3", value: 395000 }, { month: "W4", value: 410000 },
  ],
  "3M": [
    { month: "Jan", value: 370000 }, { month: "Feb", value: 385000 },
    { month: "Mar", value: 410000 },
  ],
  "6M": [
    { month: "Oct", value: 340000 }, { month: "Nov", value: 355000 },
    { month: "Dec", value: 362000 }, { month: "Jan", value: 375000 },
    { month: "Feb", value: 392000 }, { month: "Mar", value: 410000 },
  ],
  "1Y": [
    { month: "Jan", value: 310000 }, { month: "Feb", value: 295000 },
    { month: "Mar", value: 308000 }, { month: "Apr", value: 322000 },
    { month: "May", value: 441000 }, { month: "Jun", value: 432000 },
  ],
  "ALL": [
    { month: "2021", value: 180000 }, { month: "2022", value: 240000 },
    { month: "2023", value: 295000 }, { month: "2024", value: 370000 },
    { month: "2025", value: 410000 }, { month: "2026", value: 432000 },
  ],
};

// ─── Sector Data ──────────────────────────────────────────────────────────────

const SECTORS = [
  { label: "Real Estate",   pct: 35, color: "#3B82F6" },
  { label: "Technology",    pct: 25, color: "#7C3AED" },
  { label: "Healthcare",    pct: 20, color: "#10B981" },
  { label: "Finance",       pct: 12, color: "#F59E0B" },
  { label: "Manufacturing", pct:  8, color: "#EF4444" },
];

// ─── Donut Chart ──────────────────────────────────────────────────────────────

function DonutChart() {
  function polar(cx: number, cy: number, r: number, deg: number) {
    const rad = (deg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function arc(cx: number, cy: number, oR: number, iR: number, sa: number, ea: number) {
    const p1 = polar(cx, cy, oR, sa + 1.2);
    const p2 = polar(cx, cy, oR, ea - 1.2);
    const p3 = polar(cx, cy, iR, ea - 1.2);
    const p4 = polar(cx, cy, iR, sa + 1.2);
    const f = ea - sa > 180 ? 1 : 0;
    return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${oR} ${oR} 0 ${f} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)} A ${iR} ${iR} 0 ${f} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)} Z`;
  }
  let start = 0;
  const paths = SECTORS.map(s => {
    const span = (s.pct / 100) * 360;
    const d = arc(110, 110, 88, 54, start, start + span);
    start += span;
    return { ...s, d };
  });
  return (
    <svg viewBox="0 0 220 220" style={{ width: "100%", maxWidth: 200, display: "block", margin: "0 auto" }}>
      {paths.map(s => <path key={s.label} d={s.d} fill={s.color} />)}
    </svg>
  );
}

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div style={{ background: "#1a1a2e", borderRadius: 10, padding: "8px 12px", fontFamily: FONT, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>{label}, 01:30 AM</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>${val.toLocaleString()}</div>
    </div>
  );
}

// ─── Portfolio Chart ──────────────────────────────────────────────────────────

function PortfolioChart({ period }: { period: string }) {
  const data = CHART_DATA[period] ?? CHART_DATA["1Y"];
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.28} />
            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: FONT }}
          axisLine={false} tickLine={false} dy={6}
        />
        <YAxis
          tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: FONT }}
          axisLine={false} tickLine={false}
          domain={[0, 500000]}
          ticks={[0, 150000, 300000, 450000, 500000]}
          width={42}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "rgba(0,0,0,0.12)", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#7C3AED"
          strokeWidth={2}
          fill="url(#portGrad)"
          dot={false}
          activeDot={{ r: 5, fill: "#7C3AED", stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Shared Card Title Row ────────────────────────────────────────────────────

function CardTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#111827", letterSpacing: "-0.02em" }}>{title}</span>
          <TbInfoCircle size={16} color="#9ca3af" strokeWidth={1.5} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {[TbArrowsMaximize, TbPencil, TbDots].map((Icon, i) => (
            <button key={i} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <Icon size={13} color="#374151" strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>
      {subtitle && <p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0" }}>{subtitle}</p>}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const SIDEBAR_GROUPS = [
  {
    label: "MAIN",
    items: [
      { label: "Overview", Icon: TbLayoutDashboard, active: true  },
      { label: "Profile",  Icon: TbUser,            active: false },
    ],
  },
  {
    label: "ASSETS",
    items: [
      { label: "Portfolio", Icon: TbBriefcase, active: false },
      { label: "Token",     Icon: TbCoin,      active: false },
    ],
  },
  {
    label: "INSIGHTS",
    items: [
      { label: "Analytics", Icon: TbChartBar, active: false },
      { label: "Documents", Icon: TbFileText, active: false },
    ],
  },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.35)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.22s",
        }}
      />
      {/* Drawer */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, width: 260, height: "100%",
          background: "#fff", zIndex: 50,
          boxShadow: "4px 0 32px rgba(0,0,0,0.12)",
          display: "flex", flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          fontFamily: FONT,
        }}
      >
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 18px", borderBottom: "1px solid #f1f1f1" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 36, height: 36, border: "1.5px solid #d1d5db", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <Image src={logo} alt="emireq" width={26} height={22} style={{ objectFit: "contain" }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>emireq</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", WebkitTapHighlightColor: "transparent" }}>
            <TbChevronsLeft size={20} color="#9ca3af" strokeWidth={2} />
          </button>
        </div>

        {/* Nav groups */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px 0" }}>
          {SIDEBAR_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.07em", padding: "0 10px", marginBottom: 6 }}>{group.label}</div>
              {group.items.map(item => (
                <button
                  key={item.label}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, width: "100%",
                    padding: "11px 12px", borderRadius: 12, border: "none", cursor: "pointer",
                    background: item.active ? "#F6A800" : "transparent",
                    color: item.active ? "#fff" : "#374151",
                    fontSize: 15, fontWeight: item.active ? 600 : 500,
                    textAlign: "left", transition: "background 0.15s",
                    WebkitTapHighlightColor: "transparent",
                  }}
                  onMouseEnter={e => { if (!item.active) e.currentTarget.style.background = "#f3f4f6"; }}
                  onMouseLeave={e => { if (!item.active) e.currentTarget.style.background = "transparent"; }}
                >
                  <item.Icon size={20} color={item.active ? "#fff" : "#6b7280"} strokeWidth={item.active ? 2 : 1.6} />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Account / Logout */}
        <div style={{ padding: "12px 12px 24px", borderTop: "1px solid #f1f1f1" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.07em", padding: "8px 10px 6px" }}>ACCOUNT</div>
          <button
            style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 12px", borderRadius: 12, border: "none", cursor: "pointer", background: "transparent", color: "#374151", fontSize: 15, fontWeight: 500, textAlign: "left", transition: "background 0.15s, color 0.15s", WebkitTapHighlightColor: "transparent" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; (e.currentTarget.querySelector("svg") as SVGElement | null)?.setAttribute("color", "#ef4444"); }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151"; }}
          >
            <TbLogout size={20} color="#6b7280" strokeWidth={1.6} />
            Log out
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

const PERIODS = ["1W", "1M", "3M", "6M", "1Y", "ALL"] as const;

const QUICK_ACTIONS = [
  { label: "New Investment",  sub: "Explore opportunities",  Icon: TbPlus,        iconBg: "#3B82F6", rowBg: "#EFF6FF" },
  { label: "Withdraw Funds",  sub: "Transfer to bank",       Icon: TbArrowUpRight, iconBg: "#7C3AED", rowBg: "#F5F3FF" },
  { label: "Download Report", sub: "Get monthly statement",  Icon: TbDownload,    iconBg: "#10B981", rowBg: "#F0FDF4" },
  { label: "Reinvest Returns",sub: "Compound earnings",      Icon: TbRefresh,     iconBg: "#F59E0B", rowBg: "#FFFBEB" },
];

const INVESTMENTS = [
  { initials: "DR", name: "Dubai Real Estate Fund", category: "Real Estate", invested: "$125,000", current: "$148,125", growth: "+3.2%" },
  { initials: "DR", name: "Halal Tech Innovation",  category: "Technology",  invested: "$125,000", current: "$148,125", growth: "+3.2%" },
  { initials: "DR", name: "Healthcare Growth Fund", category: "Healthcare",  invested: "$125,000", current: "$148,125", growth: "+3.2%" },
];

const INSIGHTS = [
  { Icon: TbActivity,       text: "Healthtech investments in GCC grew ~13% in 2025"        },
  { Icon: TbTrendingUp,     text: "AI-driven platforms projected to ROI by 2026"            },
  { Icon: TbCurrencyDollar, text: "FinTech sees early-stage funding in India & MENA"        },
  { Icon: TbWorld,          text: "Islamic finance market expected to reach $3.8T by 2026"  },
];

export default function InvestorsDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePeriod, setActivePeriod] = useState<string>("1Y");

  return (
    <div style={{ ...F, background: "#fff", minHeight: "100vh", WebkitTapHighlightColor: "transparent" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.06)", position: "sticky", top: 0, zIndex: 30 }}>
        <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", padding: 6, cursor: "pointer", display: "flex", alignItems: "center", WebkitTapHighlightColor: "transparent" }} aria-label="Open menu">
          <RiMenu3Line size={22} color="#374151" />
        </button>
        <span style={{ fontSize: 17, fontWeight: 600, color: "#111827", letterSpacing: "-0.02em" }}>Dashboard</span>
        <div style={{ width: 34 }} />
      </div>

      {/* ── Sidebar ── */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Scrollable content ── */}
      <div style={{ padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Page heading */}
        <div style={{ padding: "0 4px" }}>
          <h1 style={{ fontSize: "clamp(22px,6vw,28px)", fontWeight: 700, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
            Dashboard Overview
          </h1>
          <p style={{ fontSize: 14, color: "#9ca3af", margin: 0, lineHeight: 1.5 }}>
            Here&apos;s what&apos;s happening with your investments today
          </p>
        </div>

        {/* ── Stat cards 2×2 ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

          {/* Total Portfolio Value */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "16px 14px 14px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <TbCurrencyDollar size={22} color="#fff" strokeWidth={2} />
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 2, fontSize: 11, fontWeight: 600, color: "#6b7280", background: "rgba(107,114,128,0.1)", borderRadius: 20, padding: "4px 8px", whiteSpace: "nowrap" }}>
                <TbTrendingUp size={10} strokeWidth={2.5} /> +12.5%
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Total Portfolio Value</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 4 }}>$410,000</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>vs last month</div>
          </div>

          {/* Total Invested */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "16px 14px 14px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <TbTargetArrow size={22} color="#fff" strokeWidth={1.8} />
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 2, fontSize: 11, fontWeight: 600, color: "#6b7280", background: "rgba(107,114,128,0.1)", borderRadius: 20, padding: "4px 8px", whiteSpace: "nowrap" }}>
                <TbTrendingUp size={10} strokeWidth={2.5} /> +$45,000
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Total Invested</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 4 }}>$320,000</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>new investments</div>
          </div>

          {/* Return On Investment */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "16px 14px 14px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <TbTrendingUp size={22} color="#fff" strokeWidth={2} />
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 2, fontSize: 11, fontWeight: 600, color: "#10B981", background: "rgba(16,185,129,0.1)", borderRadius: 20, padding: "4px 8px", whiteSpace: "nowrap" }}>
                <TbTrendingUp size={10} strokeWidth={2.5} /> +3.2%
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Return On Investment</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 4 }}>28%</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>annual ROI</div>
          </div>

          {/* Active Investments */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "16px 14px 14px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <TbCircleCheck size={22} color="#fff" strokeWidth={2} />
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 2, fontSize: 11, fontWeight: 600, color: "#F97316", background: "rgba(249,115,22,0.1)", borderRadius: 20, padding: "4px 8px", whiteSpace: "nowrap" }}>
                +22.5%
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Active Investments</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 4 }}>12</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>Shariah compliant</div>
          </div>
        </div>

        {/* ── Portfolio Performance ── */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "20px 16px 16px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <CardTitle title="Portfolio Performance" subtitle="Your investment growth over time" />
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: "#111827", letterSpacing: "-0.04em" }}>$410,000</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#dcfce7", color: "#16a34a", fontSize: 12, fontWeight: 600, borderRadius: 20, padding: "4px 10px" }}>
                <TbTrendingUp size={12} strokeWidth={2.5} /> +46.4%
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Current portfolio value</p>
          </div>
          {/* Period selector */}
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 12, padding: 4, marginBottom: 14 }}>
            {PERIODS.map(p => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                style={{
                  flex: 1, padding: "7px 0", borderRadius: 9, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: activePeriod === p ? 600 : 500,
                  background: activePeriod === p ? "#fff" : "transparent",
                  color: activePeriod === p ? "#111827" : "#9ca3af",
                  boxShadow: activePeriod === p ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.18s", WebkitTapHighlightColor: "transparent",
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <PortfolioChart period={activePeriod} />
        </div>

        {/* ── Quick Action ── */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "20px 16px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <CardTitle title="Quick Action" subtitle="Common tasks and operations" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {QUICK_ACTIONS.map(action => (
              <button
                key={action.label}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "13px 14px", background: action.rowBg,
                  borderRadius: 16, border: "none", cursor: "pointer",
                  textAlign: "left", width: "100%",
                  WebkitTapHighlightColor: "transparent",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                onMouseDown={e => (e.currentTarget.style.opacity = "0.7")}
                onMouseUp={e => (e.currentTarget.style.opacity = "1")}
              >
                <div style={{ width: 44, height: 44, borderRadius: 14, background: action.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  <action.Icon size={20} color="#fff" strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{action.label}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{action.sub}</div>
                </div>
                <TbArrowUpRight size={18} color="#9ca3af" strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Sector Allocation ── */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "20px 16px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <CardTitle title="Sector Allocation" subtitle="Portfolio diversification by sector" />
          <DonutChart />
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
            {SECTORS.map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 500, flex: 1 }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#111827", minWidth: 36, textAlign: "right" }}>{s.pct}%</span>
                <div style={{ width: 64, height: 6, borderRadius: 3, background: "#f3f4f6", overflow: "hidden", flexShrink: 0 }}>
                  <div style={{ width: `${(s.pct / 35) * 100}%`, height: "100%", borderRadius: 3, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Active Investments ── */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "20px 16px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: "#111827", letterSpacing: "-0.02em" }}>Active Investments</span>
              <TbInfoCircle size={16} color="#9ca3af" strokeWidth={1.5} />
            </div>
            <button style={{ fontSize: 13, fontWeight: 600, color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}>View all</button>
          </div>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 16px" }}>Your current investment portfolio</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {INVESTMENTS.map((inv, i) => (
              <div key={i} style={{ borderRadius: 16, border: "1px solid #f1f1f1", overflow: "hidden", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px 12px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.02em" }}>{inv.initials}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{inv.name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{inv.category}</div>
                  </div>
                </div>
                <div style={{ height: 1, background: "#f1f1f1" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{inv.invested}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Invested</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{inv.current}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Current Value</div>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#dcfce7", color: "#16a34a", fontSize: 12, fontWeight: 600, borderRadius: 20, padding: "6px 12px" }}>
                    <TbTrendingUp size={12} strokeWidth={2.5} /> {inv.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Global Insights ── */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "20px 16px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <TbWorld size={20} color="#3B82F6" strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#111827", letterSpacing: "-0.02em" }}>Global Insights</span>
                <TbInfoCircle size={16} color="#9ca3af" strokeWidth={1.5} />
              </div>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, marginTop: 2 }}>Market trends and opportunities</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {INSIGHTS.map((ins, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: "#f9fafb", borderRadius: 14, cursor: "pointer" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#fff", border: "1px solid #f1f1f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <ins.Icon size={16} color="#374151" strokeWidth={1.8} />
                </div>
                <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.55, fontWeight: 500, paddingTop: 7 }}>{ins.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
