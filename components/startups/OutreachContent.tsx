"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  TbMail, TbTrendingUp, TbCalendarEvent, TbMessageCircle,
  TbMaximize, TbPencil, TbDots,
  TbChevronLeft, TbChevronRight, TbChevronDown,
  TbSearch, TbSelector,
} from "react-icons/tb";
import { FONT, InfoIcon, PageShell, cardBase } from "./shared";

// ─── Stats Data ───────────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    icon: TbMail,
    iconBg: "#3B82F6",
    badgeText: "+12.5%",
    badgeBg: "#EFF6FF",
    badgeColor: "#3B82F6",
    label: "Investor Contacted",
    value: "42",
    sub: "+4 this week",
    cardBg: "linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%)",
  },
  {
    icon: TbTrendingUp,
    iconBg: "#7C3AED",
    badgeText: "+$45,000",
    badgeBg: "#F3E8FF",
    badgeColor: "#7C3AED",
    label: "Responses Received",
    value: "17",
    sub: "+12% vs last month",
    cardBg: "linear-gradient(135deg, #faf5ff 0%, #fcf8ff 100%)",
  },
  {
    icon: TbCalendarEvent,
    iconBg: "#10B981",
    badgeText: "+3.2%",
    badgeBg: "#ECFDF5",
    badgeColor: "#10B981",
    label: "Follow-Ups Scheduled",
    value: "8",
    sub: "3 upcoming this week",
    cardBg: "linear-gradient(135deg, #ecfdf5 0%, #f4fdf9 100%)",
  },
  {
    icon: TbMessageCircle,
    iconBg: "#F97316",
    badgeText: "+22.5%",
    badgeBg: "#FFF7ED",
    badgeColor: "#F97316",
    label: "Active Discussions",
    value: "6",
    sub: "2 new this week",
    cardBg: "linear-gradient(135deg, #fff7ed 0%, #fffaf5 100%)",
  },
];

// ─── Investor Contact Data ────────────────────────────────────────────────────

type ContactStatus = "In Discussion" | "Interested" | "No Response" | "Follow up needed";

interface ContactRow {
  initials: string;
  name: string;
  company: string;
  status: ContactStatus;
  round: string;
  location: string;
  lastContact: string;
  nextFollowUp: string;
  color: string;
}

const CONTACT_STATUS_STYLE: Record<ContactStatus, { bg: string; color: string }> = {
  "In Discussion":      { bg: "#DCFCE7", color: "#16A34A" },
  "Interested":         { bg: "#DBEAFE", color: "#2563EB" },
  "No Response":        { bg: "#FEE2E2", color: "#DC2626" },
  "Follow up needed":   { bg: "#FEF3C7", color: "#D97706" },
};

const ALL_CONTACTS: ContactRow[] = [
  { initials: "S", name: "Sarah Johnson", company: "Novocure Ventures", status: "In Discussion", round: "Seed", location: "Switzerland", lastContact: "Nov 3, 2025", nextFollowUp: "Nov 6, 2025", color: "#6B9BF7" },
  { initials: "M", name: "Michael Chen", company: "Crescent Capital", status: "Interested", round: "Seed", location: "Switzerland", lastContact: "Nov 3, 2025", nextFollowUp: "Nov 6, 2025", color: "#7C3AED" },
  { initials: "E", name: "Emily Rodriguez", company: "FutureTech Angels", status: "No Response", round: "Seed", location: "Switzerland", lastContact: "Nov 3, 2025", nextFollowUp: "Nov 6, 2025", color: "#7C3AED" },
  { initials: "D", name: "David Park", company: "NeoFund Global", status: "Follow up needed", round: "Seed", location: "Switzerland", lastContact: "Nov 3, 2025", nextFollowUp: "Nov 6, 2025", color: "#F59E0B" },
  { initials: "A", name: "Alex Turner", company: "Horizon Capital", status: "Interested", round: "Seed", location: "Switzerland", lastContact: "Nov 3, 2025", nextFollowUp: "Nov 6, 2025", color: "#6B9BF7" },
];

// ─── Monthly Response Rate Data ───────────────────────────────────────────────

const RESPONSE_RATE_DATA = [
  { month: "Jan", rate: 12 },
  { month: "Feb", rate: 20 },
  { month: "Mar", rate: 45 },
  { month: "Apr", rate: 20 },
  { month: "May", rate: 32 },
  { month: "Jun", rate: 30 },
  { month: "Jul", rate: 40 },
  { month: "Aug", rate: 30 },
  { month: "Sep", rate: 30 },
];

const CHART_COLOR = "#6366F1";

// ─── Status Distribution Data ─────────────────────────────────────────────────

const STATUS_DISTRIBUTION = [
  { label: "In Discussion",    count: 2, color: "#84CC16" },
  { label: "Interested",       count: 2, color: "#06B6D4" },
  { label: "No Response",      count: 1, color: "#8B5CF6" },
  { label: "Follow up needed", count: 1, color: "#F97316" },
];

// ─── Follow-up Calendar Data ──────────────────────────────────────────────────

const THIS_WEEK_FOLLOWUPS = [
  { name: "Monica Gonzalez", company: "Novocure Ventures", date: "Nov 4 2025" },
  { name: "John Miler", company: "FutureTech Angels", date: "Nov 5 2025" },
];

const NEXT_WEEK_FOLLOWUPS = [
  { name: "Monica Gonzalez", company: "Novocure Ventures", date: "Nov 14 2025" },
  { name: "John Miler", company: "FutureTech Angels", date: "Nov 14 2025" },
];

// ─── Calendar Helpers ─────────────────────────────────────────────────────────

const DAYS_HEADER = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rows: (number | null)[][] = [];
  let week: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) week.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      rows.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    rows.push(week);
  }
  return rows;
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const TOTAL_RESULTS = 100;
const PAGE_SIZE = 5;
const TOTAL_PAGES = 20;

// ─── Donut Chart ──────────────────────────────────────────────────────────────

function StatusDonutChart() {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "10px 0" }}>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={STATUS_DISTRIBUTION}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={115}
            dataKey="count"
            stroke="#fff"
            strokeWidth={4}
            paddingAngle={3}
            cursor="pointer"
          >
            {STATUS_DISTRIBUTION.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Chart Tooltip ────────────────────────────────────────────────────────────

function ResponseTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1e1e2e", borderRadius: 10, padding: "8px 14px",
      fontFamily: FONT, boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      cursor: "pointer",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
        $400K <span style={{ fontSize: 11, color: "#a5b4fc", fontWeight: 500, marginLeft: 4 }}>+ 12%</span>
      </div>
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
            <button key={i} style={{
              background: "none", border: "none", borderRadius: 7,
              width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0, transition: "background 0.15s",
              WebkitTapHighlightColor: "transparent",
            }}
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

export default function OutreachContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [calYear, setCalYear] = useState(2025);
  const [calMonth, setCalMonth] = useState(8); // September = 8
  const [calOpen, setCalOpen] = useState(true);

  const filteredContacts = ALL_CONTACTS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calendarDays = getCalendarDays(calYear, calMonth);
  const eventDays = [8, 14]; // dots on these dates

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  }

  return (
    <PageShell title="Dashboard" defaultActive="outreach">
      <div style={{ padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* ── Page Heading ── */}
        <div style={{ padding: "0 2px" }}>
          <h1 style={{ fontSize: "clamp(26px,7vw,32px)", fontWeight: 600, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.01em", lineHeight: 1.15 }}>
            Investor Inquires
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
            Track outreach, manage relationships, and monitor engagement
          </p>
        </div>

        {/* ── Stat Cards 2x2 ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(150px, 100%), 1fr))", gap: 14 }}>
          {STAT_CARDS.map((card, i) => (
            <div key={i} style={{
              ...cardBase,
              padding: "20px 18px",
              background: card.cardBg,
              cursor: "pointer",
              transition: "transform 0.18s, box-shadow 0.18s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: card.iconBg, display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <card.icon size={26} color="#fff" strokeWidth={1.8} />
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: card.badgeBg, borderRadius: 20,
                  padding: "4px 10px",
                  cursor: "pointer",
                }}>
                  <TbTrendingUp size={13} color={card.badgeColor} strokeWidth={2.2} />
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: card.badgeColor }}>{card.badgeText}</span>
                </div>
              </div>
              <div style={{ fontSize: 13.5, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>{card.label}</div>
              <div style={{ fontSize: 34, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>{card.value}</div>
              <div style={{ fontSize: 12.5, color: "#9ca3af", fontWeight: 400 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Investor Contact List ── */}
        <div style={{ ...cardBase }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>Investor Contact List</span>
            <InfoIcon size={17} />
          </div>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px", fontWeight: 400 }}>Manage your outreach and follow-up progress.</p>

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
                <option value="In Discussion">In Discussion</option>
                <option value="Interested">Interested</option>
                <option value="No Response">No Response</option>
                <option value="Follow up needed">Follow up needed</option>
              </select>
              <TbSelector size={16} color="#9ca3af" strokeWidth={1.8} style={{ position: "absolute", right: 10, pointerEvents: "none" }} />
            </div>
          </div>

          {/* Contact Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filteredContacts.map((c, i) => (
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: "#f3f4f6", display: "flex",
                      alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>{c.initials}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{c.company}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    padding: "4px 12px", borderRadius: 20,
                    background: CONTACT_STATUS_STYLE[c.status].bg,
                    color: CONTACT_STATUS_STYLE[c.status].color,
                    whiteSpace: "nowrap",
                  }}>
                    {c.status}
                  </span>
                </div>
                <div style={{ height: 1, background: "#f1f1f1", margin: "0 16px" }} />

                {/* Details */}
                <div style={{ padding: "14px 16px 16px" }}>
                  {[
                    { label: "Round", value: c.round },
                    { label: "Location", value: c.location },
                    { label: "Last Contact", value: c.lastContact },
                    { label: "Next Follow-up", value: c.nextFollowUp },
                  ].map((row, ri) => (
                    <div key={ri} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      marginBottom: ri < 3 ? 10 : 0,
                    }}>
                      <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{row.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
            <span style={{ fontSize: 13, color: "#10B981", fontWeight: 500 }}>
              Showing {Math.min(filteredContacts.length, PAGE_SIZE)} of {TOTAL_RESULTS} results
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

        {/* ── Monthly Response Rate ── */}
        <div style={{ ...cardBase, cursor: "pointer", outline: "none" }} tabIndex={-1}>
          <CardTitle title="Monthly Response Rate" />
          <ResponsiveContainer width="100%" height={250} style={{ cursor: "pointer", outline: "none" }}>
            <LineChart data={RESPONSE_RATE_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 28 }} style={{ cursor: "pointer", outline: "none" }}
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
                    <g transform={`translate(${nx},${ny + 10})`} style={{ cursor: "pointer" }}>
                      {isHighlighted && (
                        <rect x={-20} y={-10} width={40} height={24} rx={8} fill="#6366F1" />
                      )}
                      <text
                        x={0} y={5}
                        textAnchor="middle"
                        fill={isHighlighted ? "#fff" : "#9ca3af"}
                        fontSize={12}
                        fontFamily={FONT}
                        fontWeight={isHighlighted ? 600 : 400}
                        style={{ cursor: "pointer" }}
                      >
                        {payload.value}
                      </text>
                    </g>
                  );
                }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: FONT }}
                axisLine={false} tickLine={false}
                domain={[0, 50]}
                ticks={[0, 15, 30, 45, 50]}
                width={36}
              />
              <Tooltip
                content={<ResponseTooltip />}
                cursor={{ stroke: "rgba(99,102,241,0.2)", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Line type="linear" dataKey="rate" stroke={CHART_COLOR} strokeWidth={2} dot={{ r: 4, fill: "#fff", stroke: CHART_COLOR, strokeWidth: 2 }} activeDot={{ r: 7, fill: "#fff", stroke: CHART_COLOR, strokeWidth: 2.5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ── Status Distribution ── */}
        <div style={{ ...cardBase }}>
          <CardTitle title="Status Distribution" />
          <StatusDonutChart />
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 24 }}>
            {STATUS_DISTRIBUTION.map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 4, background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: "#374151", fontWeight: 500 }}>{s.label}</span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Upcoming Follow-up Calendar ── */}
        <div style={{ ...cardBase }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>Upcoming Follow-up Calendar</span>
            <InfoIcon size={17} />
          </div>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 18px", fontWeight: 400 }}>Visualize scheduled meetings and reminders.</p>

          <div style={{ ...cardBase, border: "1px solid #e5e7eb", padding: "16px" }}>
            {/* This week */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500, marginBottom: 12 }}>Scheduled Follow-ups for this week</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {THIS_WEEK_FOLLOWUPS.map((f, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "#EFF6FF", borderRadius: 12, padding: "14px 16px",
                    cursor: "pointer", transition: "background 0.15s",
                    WebkitTapHighlightColor: "transparent",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#DBEAFE")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#EFF6FF")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{f.name}</div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{f.company}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500, whiteSpace: "nowrap" }}>{f.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next week */}
            <div>
              <div style={{ fontSize: 14, color: "#0f172a", fontWeight: 600, marginBottom: 12 }}>Next week</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {NEXT_WEEK_FOLLOWUPS.map((f, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "#EFF6FF", borderRadius: 12, padding: "14px 16px",
                    cursor: "pointer", transition: "background 0.15s",
                    WebkitTapHighlightColor: "transparent",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#DBEAFE")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#EFF6FF")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{f.name}</div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{f.company}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500, whiteSpace: "nowrap" }}>{f.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Calendar ── */}
        <div style={{ ...cardBase }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>Calendar</span>
            <button
              onClick={() => setCalOpen(o => !o)}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "transform 0.2s",
                transform: calOpen ? "rotate(0deg)" : "rotate(-90deg)",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <TbChevronDown size={22} color="#6b7280" strokeWidth={2} />
            </button>
          </div>

          {calOpen && (
            <>
              {/* Month navigation */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ fontSize: 16, fontWeight: 500, color: "#0f172a" }}>
                  {MONTH_NAMES[calMonth]} {calYear}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={prevMonth} style={{
                    background: "none", border: "none", cursor: "pointer", padding: 6,
                    display: "flex", alignItems: "center", WebkitTapHighlightColor: "transparent",
                  }}>
                    <TbChevronLeft size={20} color="#6b7280" strokeWidth={2} />
                  </button>
                  <button onClick={nextMonth} style={{
                    background: "none", border: "none", cursor: "pointer", padding: 6,
                    display: "flex", alignItems: "center", WebkitTapHighlightColor: "transparent",
                  }}>
                    <TbChevronRight size={20} color="#6b7280" strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div style={{ width: "100%", borderTop: "1px solid #e5e7eb", marginBottom: 16 }} />

              {/* Day headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0, marginBottom: 10 }}>
                {DAYS_HEADER.map(d => (
                  <div key={d} style={{
                    textAlign: "center", fontSize: 12, fontWeight: 600,
                    color: "#9ca3af", padding: "6px 0",
                    letterSpacing: "0.04em",
                  }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              {calendarDays.map((week, wi) => (
                <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0 }}>
                  {week.map((day, di) => (
                    <div key={di} style={{
                      textAlign: "center", padding: "10px 0",
                      position: "relative", cursor: day ? "pointer" : "default",
                    }}>
                      {day && (
                        <>
                          <span style={{
                            fontSize: 15, fontWeight: 500,
                            color: eventDays.includes(day) ? "#3B82F6" : "#374151",
                          }}>
                            {day}
                          </span>
                          {eventDays.includes(day) && (
                            <div style={{
                              width: 6, height: 6, borderRadius: "50%",
                              background: "#3B82F6", margin: "4px auto 0",
                            }} />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {/* Today section */}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>Today</div>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#EFF6FF", borderRadius: 16, padding: "16px 18px",
                  cursor: "pointer", transition: "background 0.15s",
                  WebkitTapHighlightColor: "transparent",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#DBEAFE")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#EFF6FF")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: "#DBEAFE", display: "flex",
                      alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 18, fontWeight: 600, color: "#3B82F6" }}>M</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>Monica</div>
                      <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 3 }}>Novocure Ventures</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 14, color: "#3B82F6", fontWeight: 600, whiteSpace: "nowrap" }}>Nov 4 2025</span>
                </div>
              </div>
            </>
          )}
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
