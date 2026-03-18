"use client";

import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  TbCurrencyDollar, TbTargetArrow, TbTrendingUp, TbCircleCheck,
  TbMaximize, TbPencil, TbDots,
  TbPlus, TbArrowUpRight, TbDownload, TbRefresh,
  TbWorld, TbActivity,
} from "react-icons/tb";
import { FONT, InfoIcon, PageShell, cardBase } from "./shared";

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
    <svg viewBox="0 0 220 220" style={{ width: "100%", maxWidth: 220, display: "block", margin: "0 auto" }}>
      <circle cx="110" cy="110" r="93" fill="none" stroke="#e8eaf6" strokeWidth="1.5" />
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
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
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
          tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: FONT }}
          axisLine={false} tickLine={false}
          domain={[0, 500000]}
          ticks={[0, 150000, 300000, 450000, 500000]}
          width={52}
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
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>{title}</span>
          <InfoIcon size={17} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 2, border: "1px solid #e5e7eb", borderRadius: 11, padding: "5px 8px", background: "#fff" }}>
          {[TbMaximize, TbPencil, TbDots].map((Icon, i) => (
            <button key={i} style={{ background: "none", border: "none", borderRadius: 7, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "background 0.15s", WebkitTapHighlightColor: "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <Icon size={13} color="#6b7280" strokeWidth={1.8} />
            </button>
          ))}
        </div>
      </div>
      {subtitle && <p style={{ fontSize: 13, color: "#64748b", margin: "5px 0 0", fontWeight: 400 }}>{subtitle}</p>}
    </div>
  );
}



// ─── Main Export ──────────────────────────────────────────────────────────────

const PERIODS = ["1W", "1M", "3M", "6M", "1Y", "ALL"] as const;

const STAT_CARDS = [
  {
    Icon: TbCurrencyDollar,
    iconBg: "#3B82F6",
    cardBg: "linear-gradient(145deg, #ffffff 30%, #eff6ff 100%)",
    badge: "+12.5%", badgeBg: "rgba(99,102,241,0.09)", badgeColor: "#6366f1",
    showArrow: true,
    label: "Total Portfolio Value", value: "$410,000", sub: "vs last month",
  },
  {
    Icon: TbTargetArrow,
    iconBg: "#7C3AED",
    cardBg: "linear-gradient(145deg, #ffffff 30%, #f5f3ff 100%)",
    badge: "+$45,000", badgeBg: "rgba(124,58,237,0.09)", badgeColor: "#7c3aed",
    showArrow: true,
    label: "Total Invested", value: "$320,000", sub: "new investments",
  },
  {
    Icon: TbTrendingUp,
    iconBg: "#10B981",
    cardBg: "linear-gradient(145deg, #ffffff 30%, #f0fdf4 100%)",
    badge: "+3.2%", badgeBg: "rgba(16,185,129,0.1)", badgeColor: "#10b981",
    showArrow: true,
    label: "Return On Investment", value: "28%", sub: "annual ROI",
  },
  {
    Icon: TbCircleCheck,
    iconBg: "#F97316",
    cardBg: "linear-gradient(145deg, #ffffff 30%, #fff7ed 100%)",
    badge: "+22.5%", badgeBg: "rgba(249,115,22,0.1)", badgeColor: "#f97316",
    showArrow: false,
    label: "Active Investments", value: "12", sub: "Shariah compliant",
  },
] as const;

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
  const [activePeriod, setActivePeriod] = useState<string>("1Y");

  return (
    <PageShell title="Dashboard">
      <div style={{ padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Page heading */}
        <div style={{ padding: "0 2px" }}>
          <h1 style={{ fontSize: "clamp(26px,7vw,32px)", fontWeight: 600, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.01em", lineHeight: 1.15 }}>
            Dashboard Overview
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
            Here&apos;s what&apos;s happening with your investments today
          </p>
        </div>

        {/* ── Stat cards 2×2 ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {STAT_CARDS.map((card) => (
            <div
              key={card.label}
              style={{
                background: card.cardBg,
                borderRadius: 20,
                padding: "18px 14px 16px",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 2px 14px rgba(0,0,0,0.05)",
                cursor: "pointer",
                transition: "transform 0.18s, box-shadow 0.18s",
                WebkitTapHighlightColor: "transparent",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 14px rgba(0,0,0,0.05)";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: card.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: `0 4px 14px ${card.iconBg}60`,
                }}>
                  <card.Icon size={26} color="#fff" strokeWidth={2} />
                </div>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  fontSize: 11, fontWeight: 600,
                  color: card.badgeColor,
                  background: card.badgeBg,
                  borderRadius: 20, padding: "5px 9px",
                  whiteSpace: "nowrap",
                }}>
                  {card.showArrow && <TbTrendingUp size={10} strokeWidth={2.5} />}
                  {card.badge}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6, fontWeight: 500 }}>{card.label}</div>
              <div style={{ fontSize: "clamp(18px,4.5vw,22px)", fontWeight: 600, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>{card.value}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Portfolio Performance ── */}
        <div style={cardBase}>
          <CardTitle title="Portfolio Performance" subtitle="Your investment growth over time" />

          {/* Value + badge */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: "clamp(28px,7vw,34px)", fontWeight: 600, color: "#0f172a", letterSpacing: "-0.04em", lineHeight: 1 }}>$410,000</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#dcfce7", color: "#16a34a", fontSize: 13, fontWeight: 600, borderRadius: 20, padding: "5px 12px", whiteSpace: "nowrap" }}>
                <TbTrendingUp size={13} strokeWidth={2.5} /> +46.4%
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0, fontWeight: 400 }}>Current portfolio value</p>
          </div>

          {/* Period selector */}
          <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 14, padding: "5px", marginBottom: 20 }}>
            {PERIODS.map(p => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: activePeriod === p ? 600 : 500,
                  background: activePeriod === p ? "#fff" : "transparent",
                  color: activePeriod === p ? "#0f172a" : "#94a3b8",
                  boxShadow: activePeriod === p ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.18s",
                  WebkitTapHighlightColor: "transparent",
                  letterSpacing: "-0.01em",
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <PortfolioChart period={activePeriod} />
        </div>

        {/* ── Quick Action ── */}
        <div style={cardBase}>
          <CardTitle title="Quick Action" subtitle="Common tasks and operations" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {QUICK_ACTIONS.map(action => (
              <button
                key={action.label}
                style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "14px 16px",
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  cursor: "pointer",
                  textAlign: "left", width: "100%",
                  fontFamily: FONT,
                  WebkitTapHighlightColor: "transparent",
                  transition: "box-shadow 0.18s, border-color 0.18s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,0.09)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                  e.currentTarget.style.borderColor = "#f1f5f9";
                }}
              >
                <div style={{ width: 54, height: 54, borderRadius: 16, background: action.rowBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <action.Icon size={24} color={action.iconBg} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 3, letterSpacing: "-0.01em" }}>{action.label}</div>
                  <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 400 }}>{action.sub}</div>
                </div>
                <TbArrowUpRight size={18} color="#cbd5e1" strokeWidth={2} style={{ flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Sector Allocation ── */}
        <div style={cardBase}>
          <CardTitle title="Sector Allocation" subtitle="Portfolio diversification by sector" />
          <DonutChart />
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20 }}>
            {SECTORS.map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 13, height: 13, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500, flex: 1 }}>{s.label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#111827", minWidth: 38, textAlign: "right" }}>{s.pct}%</span>
                <div style={{ width: 72, height: 6, borderRadius: 4, background: "#f1f5f9", overflow: "hidden", flexShrink: 0 }}>
                  <div style={{ width: `${(s.pct / 35) * 100}%`, height: "100%", borderRadius: 4, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Active Investments ── */}
        <div style={cardBase}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>Active Investments</span>
              <InfoIcon size={17} />
            </div>
            <button
              style={{ fontSize: 14, fontWeight: 600, color: "#2563eb", background: "none", border: "none", cursor: "pointer", WebkitTapHighlightColor: "transparent", fontFamily: FONT }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >View all</button>
          </div>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 18px", fontWeight: 400 }}>Your current investment portfolio</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {INVESTMENTS.map((inv, i) => (
              <div
                key={i}
                style={{ borderRadius: 18, border: "1px solid #f1f5f9", overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.18s", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.09)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 16px 14px" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 18, background: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "0.03em" }}>{inv.initials}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", letterSpacing: "-0.01em" }}>{inv.name}</div>
                    <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 3, fontWeight: 400 }}>{inv.category}</div>
                  </div>
                </div>
                <div style={{ height: 1, background: "#f1f5f9", margin: "0 16px" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px" }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", letterSpacing: "-0.02em" }}>{inv.invested}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3, fontWeight: 400 }}>Invested</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", letterSpacing: "-0.02em" }}>{inv.current}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3, fontWeight: 400 }}>Current Value</div>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(220,252,231,0.7)", color: "#16a34a", fontSize: 13, fontWeight: 600, borderRadius: 24, padding: "7px 13px", border: "1px solid rgba(22,163,74,0.15)", whiteSpace: "nowrap" }}>
                    <TbArrowUpRight size={13} strokeWidth={2.5} /> {inv.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Global Insights ── */}
        <div style={cardBase}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <div style={{ width: 50, height: 50, borderRadius: 16, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <TbWorld size={24} color="#3B82F6" strokeWidth={1.6} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>Global Insights</span>
                <InfoIcon size={17} />
              </div>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0, marginTop: 3, fontWeight: 400 }}>Market trends and opportunities</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {INSIGHTS.map((ins, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "#f8fafc", borderRadius: 16, border: "1px solid #f1f5f9", cursor: "pointer", transition: "box-shadow 0.18s" }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.07)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                <div style={{ width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <ins.Icon size={17} color="#374151" strokeWidth={1.7} />
                </div>
                <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.55, fontWeight: 500 }}>{ins.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageShell>
  );
}
