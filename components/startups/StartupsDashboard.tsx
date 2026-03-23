"use client";

import { useState } from "react";
import Image from "next/image";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  TbSend, TbMailOpened, TbTrendingUp,
  TbMaximize, TbPencil, TbDots,
  TbPlus, TbTargetArrow, TbUsers, TbBox, TbBolt,
  TbMail, TbPhone, TbDotsVertical,
  TbChevronLeft, TbChevronRight, TbSearch,
  TbSelector,
} from "react-icons/tb";
import { FONT, InfoIcon, PageShell, cardBase } from "./shared";
import fin from "@/public/assets/coin.png";

// ─── Growth Overview Data ─────────────────────────────────────────────────────

const GROWTH_DATA = [
  { month: "Jan", revenue: 50, users: 70 },
  { month: "Feb", revenue: 55, users: 115 },
  { month: "Mar", revenue: 100, users: 145 },
  { month: "Apr", revenue: 55, users: 80 },
  { month: "May", revenue: 95, users: 95 },
  { month: "Jun", revenue: 10, users: 75 },
  { month: "Jul", revenue: 130, users: 120 },
  { month: "Aug", revenue: 145, users: 140 },
  { month: "Sep", revenue: 95, users: 155 },
];

// ─── Investor Mix Data ────────────────────────────────────────────────────────

const INVESTOR_MIX = [
  { label: "Angel Investors", pct: 35, color: "#7C3AED" },
  { label: "VC Firms",        pct: 30, color: "#6B9BF7" },
  { label: "Strategic Partners", pct: 20, color: "#10B981" },
  { label: "Others",          pct: 15, color: "#F59E0B" },
];

// ─── Recent Investor Engagement Data ──────────────────────────────────────────

type InvestorStatus = "Meeting Scheduled" | "Interested" | "Contacted" | "Due Diligence";

interface InvestorRow {
  initials: string;
  name: string;
  company: string;
  status: InvestorStatus;
  amount: string;
  lastContact: string;
  color: string;
}

const ALL_INVESTORS: InvestorRow[] = [
  { initials: "S", name: "Sarah Johnson", company: "Venture Capital Partners", status: "Meeting Scheduled", amount: "$125,000", lastContact: "2 hrs ago", color: "#6B9BF7" },
  { initials: "M", name: "Michael Chen", company: "Tech Angles Fund", status: "Interested", amount: "$125,000", lastContact: "1 day ago", color: "#7C3AED" },
  { initials: "E", name: "Emily Rodriguez", company: "Growth Equity LLC", status: "Contacted", amount: "$125,000", lastContact: "2 days ago", color: "#7C3AED" },
  { initials: "J", name: "John Doe", company: "Venture Capital Partners", status: "Due Diligence", amount: "$125,000", lastContact: "3 days ago", color: "#F59E0B" },
  { initials: "A", name: "Alex Turner", company: "Horizon Capital", status: "Meeting Scheduled", amount: "$125,000", lastContact: "4 hrs ago", color: "#6B9BF7" },
];

const STATUS_STYLE: Record<InvestorStatus, { bg: string; color: string }> = {
  "Meeting Scheduled": { bg: "#FFF3E0", color: "#E65100" },
  "Interested":        { bg: "#E8F5E9", color: "#2E7D32" },
  "Contacted":         { bg: "#E3F2FD", color: "#1565C0" },
  "Due Diligence":     { bg: "#FCE4EC", color: "#C62828" },
};

const TOTAL_RESULTS = 100;
const PAGE_SIZE = 5;
const TOTAL_PAGES = 20;

// ─── Pie Chart Component ─────────────────────────────────────────────────────

function InvestorPieChart() {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={INVESTOR_MIX}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={90}
            dataKey="pct"
            stroke="none"
          >
            {INVESTOR_MIX.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Growth Chart Tooltip ─────────────────────────────────────────────────────

function GrowthTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1a1a2e", borderRadius: 10, padding: "8px 12px", fontFamily: FONT, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12, fontWeight: 600, color: p.color }}>
          {p.dataKey === "revenue" ? "Revenue" : "Users"}: {p.value}
        </div>
      ))}
    </div>
  );
}

// ─── Card Title Row ───────────────────────────────────────────────────────────

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

// ─── Company Summary Items ────────────────────────────────────────────────────

const COMPANY_ITEMS = [
  { Icon: TbTargetArrow, label: "Problem Statement", value: "Solving ABC Problems", iconBg: "#F3E8FF", iconColor: "#7C3AED" },
  { Icon: TbUsers,       label: "Target Customers",  value: "ABC Customers",       iconBg: "#EFF6FF", iconColor: "#3B82F6" },
  { Icon: TbBox,         label: "Product Description", value: "ABC Products",       iconBg: "#ECFDF5", iconColor: "#10B981" },
  { Icon: TbBolt,        label: "Key Differentiator", value: "Unique Advantages",   iconBg: "#FFF7ED", iconColor: "#F97316" },
];

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function StartupsDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  const filteredInvestors = ALL_INVESTORS.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageShell title="Dashboard">
      <div style={{ padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* ── Page Heading ── */}
        <div style={{ padding: "0 2px" }}>
          <h1 style={{ fontSize: "clamp(26px,7vw,32px)", fontWeight: 600, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.01em", lineHeight: 1.15 }}>
            Dashboard Overview
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
            Assalamu Alaikum, welcome to your Islamic investment platform
          </p>
        </div>

        {/* ── Stat Cards Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Contacted Investors */}
          <div style={{
            ...cardBase,
            padding: "18px 16px",
            cursor: "pointer",
            transition: "transform 0.18s, box-shadow 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <TbSend size={22} color="#3B82F6" strokeWidth={1.8} />
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 500 }}>Contacted Investors</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 4 }}>0</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Total outreach sent</div>
          </div>

          {/* Interested Investors */}
          <div style={{
            ...cardBase,
            padding: "18px 16px",
            cursor: "pointer",
            transition: "transform 0.18s, box-shadow 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <TbMailOpened size={22} color="#10B981" strokeWidth={1.8} />
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 500 }}>Interested Investors</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 4 }}>0</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Reached out to you</div>
          </div>
        </div>

        {/* ── Funding Progress ── */}
        <div style={{
          ...cardBase,
          padding: "18px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          transition: "transform 0.18s, box-shadow 0.18s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
        >
          <div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4, fontWeight: 500 }}>Funding Progress</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 4 }}>0%</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Of target goal</div>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "#F3E8FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TbTrendingUp size={24} color="#7C3AED" strokeWidth={1.8} />
          </div>
        </div>

        {/* ── Securely Invest Banner ── */}
        <div style={{
          borderRadius: 20,
          overflow: "hidden",
          position: "relative",
          minHeight: 160,
          cursor: "pointer",
          transition: "transform 0.18s",
        }}
          onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <Image
            src={fin}
            alt="Invest background"
            fill
            style={{ objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 100%)",
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "24px 20px",
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
              Securely Invest your money
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", margin: "0 0 4px" }}>
              You can start your journey here
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 16px" }}>
              20th October, 2025
            </p>
            <button style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#F5B731", color: "#0f172a", border: "none",
              borderRadius: 10, padding: "12px 24px",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
              width: "fit-content",
              transition: "background 0.18s, transform 0.15s",
              WebkitTapHighlightColor: "transparent",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#e5a820")}
              onMouseLeave={e => (e.currentTarget.style.background = "#F5B731")}
            >
              <TbPlus size={18} strokeWidth={2.5} />
              Create your fund
            </button>
          </div>
        </div>

        {/* ── Company Summary ── */}
        <div style={{ ...cardBase }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>Company Summary</span>
            <button style={{
              fontSize: 13, fontWeight: 500, color: "#374151",
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 10, padding: "8px 16px",
              cursor: "pointer", transition: "background 0.15s",
              WebkitTapHighlightColor: "transparent",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
            >
              Complete Profile
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {COMPANY_ITEMS.map(item => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "16px 14px", borderRadius: 16,
                background: item.iconBg + "33",
                border: "1px solid " + item.iconBg,
                cursor: "pointer",
                transition: "transform 0.15s",
                WebkitTapHighlightColor: "transparent",
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateX(4px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateX(0)")}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: item.iconBg, display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <item.Icon size={22} color={item.iconColor} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 2, fontWeight: 400 }}>{item.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Growth Overview ── */}
        <div style={{ ...cardBase, cursor: "pointer", outline: "none" }} tabIndex={-1}>
          <CardTitle title="Growth Overview" subtitle="User acquisition and revenue trends" />
          <ResponsiveContainer width="100%" height={210} style={{ cursor: "pointer", outline: "none" }}>
            <LineChart data={GROWTH_DATA} margin={{ top: 10, right: 8, left: -10, bottom: 0 }} style={{ cursor: "pointer", outline: "none" }}
              onMouseMove={(state: { activeLabel?: string | number }) => {
                if (state?.activeLabel != null) setHoveredMonth(String(state.activeLabel));
              }}
              onMouseLeave={() => setHoveredMonth(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={({ x, y, payload }: { x: string | number; y: string | number; payload: { value: string } }) => {
                  const isHighlighted = hoveredMonth ? payload.value === hoveredMonth : payload.value === "Jul";
                  const nx = Number(x);
                  const ny = Number(y);
                  return (
                    <g transform={`translate(${nx},${ny + 10})`}>
                      {isHighlighted && (
                        <rect x={-18} y={-10} width={36} height={22} rx={6} fill="#64748b" />
                      )}
                      <text
                        x={0} y={4}
                        textAnchor="middle"
                        fill={isHighlighted ? "#fff" : "#9ca3af"}
                        fontSize={11}
                        fontFamily={FONT}
                        fontWeight={isHighlighted ? 600 : 400}
                      >
                        {payload.value}
                      </text>
                    </g>
                  );
                }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: FONT }}
                axisLine={false} tickLine={false}
                domain={[0, 250]}
                ticks={[0, 50, 100, 150, 200, 250]}
                width={36}
              />
              <Tooltip
                content={<GrowthTooltip />}
                cursor={{ stroke: "rgba(0,0,0,0.12)", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Line type="linear" dataKey="revenue" stroke="#7C3AED" strokeWidth={2} dot={{ r: 4, fill: "#7C3AED", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#7C3AED", stroke: "#fff", strokeWidth: 2 }} name="Revenue ($)" />
              <Line type="linear" dataKey="users" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4, fill: "#3B82F6", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#3B82F6", stroke: "#fff", strokeWidth: 2 }} name="Users" />
            </LineChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7C3AED" }} />
              <span style={{ fontSize: 12, color: "#7C3AED", fontWeight: 500 }}>Revenue ($)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6" }} />
              <span style={{ fontSize: 12, color: "#3B82F6", fontWeight: 500 }}>Users</span>
            </div>
          </div>
        </div>

        {/* ── Investor Mix ── */}
        <div style={{ ...cardBase }}>
          <CardTitle title="Investor Mix" subtitle="Distribution by investor type" />
          <InvestorPieChart />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 20 }}>
            {INVESTOR_MIX.map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 20, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400, marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{s.pct}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Investor Engagement ── */}
        <div style={{ ...cardBase }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>Recent Investor Engagement</span>
            <InfoIcon size={17} />
          </div>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px", fontWeight: 400 }}>Track your investor conversations</p>

          {/* Search & Status Filter */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: 8,
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 12, padding: "10px 14px",
            }}>
              <TbSearch size={18} color="#9ca3af" strokeWidth={1.8} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  border: "none", outline: "none", background: "transparent",
                  fontSize: 14, color: "#374151", width: "100%",
                  fontFamily: FONT,
                }}
              />
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 12, padding: "10px 14px",
              cursor: "pointer", position: "relative",
            }}>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  border: "none", outline: "none", background: "transparent",
                  fontSize: 14, color: "#374151", fontFamily: FONT,
                  cursor: "pointer", appearance: "none", paddingRight: 20,
                }}
              >
                <option value="all">Status</option>
                <option value="Meeting Scheduled">Meeting Scheduled</option>
                <option value="Interested">Interested</option>
                <option value="Contacted">Contacted</option>
                <option value="Due Diligence">Due Diligence</option>
              </select>
              <TbSelector size={16} color="#9ca3af" strokeWidth={1.8} style={{ position: "absolute", right: 10, pointerEvents: "none" }} />
            </div>
          </div>

          {/* Investor Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filteredInvestors.map((inv, i) => (
              <div key={i} style={{
                borderRadius: 16, border: "1px solid #f1f1f1",
                overflow: "hidden", cursor: "pointer",
                transition: "transform 0.15s, box-shadow 0.15s",
                WebkitTapHighlightColor: "transparent",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 16px 14px" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "#f3f4f6", display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>{inv.initials}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{inv.name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{inv.company}</div>
                  </div>
                </div>
                <div style={{ height: 1, background: "#f1f1f1", margin: "0 16px" }} />

                {/* Details */}
                <div style={{ padding: "14px 16px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Status</span>
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      padding: "4px 12px", borderRadius: 20,
                      background: STATUS_STYLE[inv.status].bg,
                      color: STATUS_STYLE[inv.status].color,
                    }}>
                      {inv.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Amount ($k)</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{inv.amount}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Last Contact</span>
                    <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{inv.lastContact}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Actions</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", WebkitTapHighlightColor: "transparent" }}>
                        <TbMail size={18} color="#9ca3af" strokeWidth={1.8} />
                      </button>
                      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", WebkitTapHighlightColor: "transparent" }}>
                        <TbPhone size={18} color="#9ca3af" strokeWidth={1.8} />
                      </button>
                      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", WebkitTapHighlightColor: "transparent" }}>
                        <TbDotsVertical size={18} color="#9ca3af" strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
            <span style={{ fontSize: 13, color: "#10B981", fontWeight: 500 }}>
              Showing {Math.min(filteredInvestors.length, PAGE_SIZE)} of {TOTAL_RESULTS} results
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb",
                  background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  opacity: currentPage === 1 ? 0.4 : 1,
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <TbChevronLeft size={16} color="#374151" />
              </button>
              {[1, 2].map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: currentPage === p ? "none" : "1px solid #e5e7eb",
                  background: currentPage === p ? "#152B5A" : "#fff",
                  color: currentPage === p ? "#fff" : "#374151",
                  fontSize: 13, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", WebkitTapHighlightColor: "transparent",
                }}>
                  {p}
                </button>
              ))}
              <span style={{ fontSize: 13, color: "#9ca3af", padding: "0 4px" }}>...</span>
              <button onClick={() => setCurrentPage(TOTAL_PAGES)} style={{
                width: 32, height: 32, borderRadius: 8,
                border: currentPage === TOTAL_PAGES ? "none" : "1px solid #e5e7eb",
                background: currentPage === TOTAL_PAGES ? "#152B5A" : "#fff",
                color: currentPage === TOTAL_PAGES ? "#fff" : "#374151",
                fontSize: 13, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", WebkitTapHighlightColor: "transparent",
              }}>
                {TOTAL_PAGES}
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(TOTAL_PAGES, p + 1))}
                disabled={currentPage === TOTAL_PAGES}
                style={{
                  width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb",
                  background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: currentPage === TOTAL_PAGES ? "not-allowed" : "pointer",
                  opacity: currentPage === TOTAL_PAGES ? 0.4 : 1,
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <TbChevronRight size={16} color="#374151" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer Disclaimer ── */}
        <div style={{ textAlign: "center", padding: "12px 8px 0" }}>
          <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6, margin: 0 }}>
            Market data is updated in real-time. Prices are for reference only and may vary across exchanges.
          </p>
        </div>

      </div>
    </PageShell>
  );
}
