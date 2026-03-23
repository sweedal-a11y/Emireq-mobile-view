"use client";

import { useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import {
  TbCurrencyDollar, TbTargetArrow, TbUsers, TbChartBar,
  TbSparkles, TbDownload, TbMaximize, TbPencil, TbDots,
  TbBulb, TbCalendar, TbTrendingUp, TbFileText,
  TbExternalLink, TbChevronRight,
} from "react-icons/tb";
import { FONT, InfoIcon, PageShell, cardBase } from "./shared";

// ─── Status Distribution Data ─────────────────────────────────────────────────

const STATUS_DATA = [
  { label: "In Discussion",     value: 2, color: "#84CC16" },
  { label: "Interested",        value: 2, color: "#3B82F6" },
  { label: "No Response",       value: 1, color: "#8B5CF6" },
  { label: "Follow up needed",  value: 1, color: "#F97316" },
];

// ─── CardTitle Row (matches StartupsDashboard) ──────────────────────────────

function CardTitle({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>{title}</span>
        <InfoIcon size={17} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 2, border: "1px solid #e5e7eb", borderRadius: 11, padding: "5px 8px", background: "#fff" }}>
        {[TbMaximize, TbPencil, TbDots].map((Icon, i) => (
          <button key={i} style={{
            background: "none", border: "none", borderRadius: 7, width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
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
  );
}

// ─── Stat Card Config ─────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    label: "TOTAL RAISED",
    value: "$0",
    sub: "Ready to grow",
    SubIcon: TbCurrencyDollar,
    gradient: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
  },
  {
    label: "TARGET AMOUNT",
    value: "$250,000",
    sub: "Seed Round goal",
    SubIcon: TbTargetArrow,
    gradient: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
  },
  {
    label: "ACTIVE INVESTORS",
    value: "0",
    sub: "Committed partners",
    SubIcon: TbUsers,
    gradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
  },
  {
    label: "PROGRESS",
    value: "0%",
    sub: "Of target reached",
    SubIcon: TbChartBar,
    gradient: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FundingContent() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <PageShell title="Dashboard" defaultActive="funding-progress">
      <div style={{ padding: "24px 16px 40px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* ── Page Heading ── */}
        <div style={{ padding: "0 2px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{
              fontSize: "clamp(26px,7vw,32px)", fontWeight: 600, color: "#0f172a",
              margin: "0 0 8px", letterSpacing: "-0.01em", lineHeight: 1.15,
            }}>
              Funding Status
            </h1>
            <p style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
              Track your fundraising progress and investor activity
            </p>
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#F0FDF4", border: "1px solid #BBF7D0",
            borderRadius: 20, padding: "6px 14px", flexShrink: 0, marginTop: 4,
          }}>
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#22C55E" strokeWidth="1.5" fill="none" />
              <path d="M5 8l2 2 4-4" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#22C55E" }}>Approved</span>
          </div>
        </div>

        {/* ── 4 Stat Cards (2×2 grid) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {STAT_CARDS.map((card, i) => (
            <div
              key={i}
              style={{
                background: card.gradient,
                borderRadius: 18,
                padding: "20px 18px",
                cursor: "pointer",
                transition: "transform 0.18s, box-shadow 0.18s",
                transform: hoveredCard === i ? "translateY(-3px)" : "translateY(0)",
                boxShadow: hoveredCard === i ? "0 8px 28px rgba(0,0,0,0.18)" : "0 4px 16px rgba(0,0,0,0.08)",
                position: "relative",
                overflow: "hidden",
                WebkitTapHighlightColor: "transparent",
              }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Decorative circle overlay */}
              <div style={{
                position: "absolute", top: -20, right: -20,
                width: 80, height: 80, borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
              }} />
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em", marginBottom: 8, textTransform: "uppercase" }}>
                {card.label}
              </div>
              <div style={{ fontSize: "clamp(28px,7vw,36px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 14 }}>
                {card.value}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <card.SubIcon size={16} color="rgba(255,255,255,0.8)" strokeWidth={1.8} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 400 }}>{card.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Seed Round Progress ── */}
        <div style={{ ...cardBase, padding: "22px 20px", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <TbSparkles size={24} color="#3B82F6" strokeWidth={2} />
              <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>Seed Round Progress</span>
            </div>
            <div style={{
              fontSize: 13, fontWeight: 600, color: "#3B82F6",
              background: "#fff", border: "1.5px solid #BFDBFE",
              borderRadius: 20, padding: "6px 16px",
            }}>
              0.0% Complete
            </div>
          </div>
          <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>
            Track your fundraising journey to reach your goal
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 15, color: "#64748b", fontWeight: 500 }}>$0 raised</span>
            <span style={{ fontSize: 15, color: "#0f172a" }}>
              Goal:<strong style={{ fontWeight: 700 }}>$250,000</strong>
            </span>
          </div>
          {/* Progress bar with pill-shaped leading edge */}
          <div style={{ position: "relative", width: "100%", height: 12, borderRadius: 8, background: "#E5E7EB" }}>
            <div style={{
              position: "absolute", left: 0, top: 0,
              width: "12%", minWidth: 40,
              height: "100%",
              borderRadius: 8,
              background: "linear-gradient(90deg, #D946EF, #3B82F6)",
            }} />
          </div>
        </div>

        {/* ── Recent Investment Activity ── */}
        <div style={{ ...cardBase, padding: 0, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Gold coin/clock SVG icon */}
                <svg width={28} height={28} viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M6.66663 11.6667C9.42805 11.6667 11.6666 9.42811 11.6666 6.66669C11.6666 3.90526 9.42805 1.66669 6.66663 1.66669C3.9052 1.66669 1.66663 3.90526 1.66663 6.66669C1.66663 9.42811 3.9052 11.6667 6.66663 11.6667Z" stroke="#FFC300" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.075 8.64166C15.8628 8.93535 16.5638 9.42294 17.1132 10.0593C17.6625 10.6957 18.0426 11.4604 18.2182 12.2826C18.3937 13.1047 18.3591 13.9579 18.1176 14.7632C17.876 15.5685 17.4353 16.2998 16.8362 16.8897C16.2371 17.4795 15.499 17.9087 14.69 18.1377C13.8811 18.3666 13.0275 18.3879 12.2081 18.1995C11.3888 18.0112 10.6301 17.6192 10.0024 17.06C9.37465 16.5007 8.89806 15.7922 8.6167 15" stroke="#FFC300" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.83337 5H6.66671V8.33333" stroke="#FFC300" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.925 11.5667L14.5083 12.1583L12.1583 14.5083" stroke="#FFC300" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>Recent Investment Activity</span>
              </div>
              <button style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#3B82F6", color: "#fff", border: "none",
                borderRadius: 10, padding: "9px 18px",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                transition: "background 0.15s",
                WebkitTapHighlightColor: "transparent",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "#2563EB")}
                onMouseLeave={e => (e.currentTarget.style.background = "#3B82F6")}
              >
                <TbDownload size={16} strokeWidth={2} />
                Export
              </button>
            </div>
            <p style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.55 }}>
              Monitor incoming investments and commitments
            </p>
          </div>

          {/* Empty state */}
          <div style={{
            padding: "52px 24px 40px", display: "flex", flexDirection: "column",
            alignItems: "center", textAlign: "center", background: "#FFFBEB",
          }}>
            {/* Large circle with gray coin/clock SVG icon */}
            <div style={{
              width: 88, height: 88, borderRadius: "50%",
              background: "#E2E8F0", display: "flex",
              alignItems: "center", justifyContent: "center", marginBottom: 24,
            }}>
              <svg width={40} height={40} viewBox="0 0 40 40" fill="none">
                <path d="M13.3334 23.3333C18.8562 23.3333 23.3334 18.8562 23.3334 13.3333C23.3334 7.81047 18.8562 3.33331 13.3334 3.33331C7.81053 3.33331 3.33337 7.81047 3.33337 13.3333C3.33337 18.8562 7.81053 23.3333 13.3334 23.3333Z" stroke="#90A1B9" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30.1501 17.2833C31.7256 17.8707 33.1275 18.8459 34.2263 20.1187C35.3251 21.3914 36.0852 22.9207 36.4363 24.5651C36.7874 26.2095 36.7182 27.9159 36.2351 29.5264C35.7521 31.137 34.8706 32.5997 33.6724 33.7793C32.4742 34.959 30.9979 35.8175 29.38 36.2754C27.7621 36.7333 26.0549 36.7758 24.4162 36.3991C22.7775 36.0223 21.2603 35.2385 20.0048 34.12C18.7493 33.0015 17.7961 31.5845 17.2334 30" stroke="#90A1B9" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.6666 10H13.3333V16.6667" stroke="#90A1B9" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M27.85 23.1334L29.0166 24.3167L24.3167 29.0167" stroke="#90A1B9" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", marginBottom: 10 }}>
              No investment activity yet
            </div>
            <p style={{ fontSize: 15, color: "#9CA3AF", margin: "0 0 24px", lineHeight: 1.6, maxWidth: 300, fontWeight: 400 }}>
              Start reaching out to investors to track funding progress. Once you receive commitments, they&apos;ll appear here.
            </p>
            <button style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#0f172a", color: "#fff", border: "none",
              borderRadius: 14, padding: "13px 28px",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
              transition: "background 0.15s, transform 0.15s",
              WebkitTapHighlightColor: "transparent",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1e293b"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <TbUsers size={18} strokeWidth={1.8} />
              View Investors
            </button>
          </div>
        </div>

        {/* ── Status Distribution ── */}
        <div style={{ ...cardBase }}>
          <CardTitle title="Status Distribution" />
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  dataKey="value"
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {STATUS_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "0 4px" }}>
            {STATUS_DATA.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 4, background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: "#374151", fontWeight: 400 }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Funding Stage ── */}
        <div style={{
          ...cardBase,
          padding: 0,
          overflow: "hidden",
          border: "1px solid #BFDBFE",
        }}>
          {/* Header */}
          <div style={{
            padding: "22px 20px",
            background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
            borderBottom: "1px solid #BFDBFE",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <TbBulb size={22} color="#3B82F6" strokeWidth={1.8} />
              <span style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>Funding Stage</span>
            </div>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
              Your Current fundraising phase
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: "22px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Current Stage card */}
            <div style={{
              border: "1px solid #BFDBFE", borderRadius: 14, padding: "18px 18px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#3B82F6", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
                  CURRENT STAGE
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#3B82F6" }}>Idea</div>
              </div>
              <div style={{
                background: "#3B82F6", color: "#fff", borderRadius: 10,
                padding: "5px 16px", fontSize: 13, fontWeight: 600,
              }}>
                Active
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#E5E7EB" }} />

            {/* Founded row */}
            <div style={{
              background: "#F3F4F6", borderRadius: 14, padding: "18px 18px",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "#fff", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <TbCalendar size={22} color="#6B7280" strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 2 }}>Founded</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>2024</div>
              </div>
            </div>

            {/* Update Stage button */}
            <button style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#fff", border: "1px solid #E5E7EB",
              borderRadius: 14, padding: "14px 20px",
              fontSize: 15, fontWeight: 600, color: "#374151",
              cursor: "pointer", transition: "background 0.15s, box-shadow 0.15s",
              WebkitTapHighlightColor: "transparent", width: "100%",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <TbFileText size={18} color="#6B7280" strokeWidth={1.8} />
              Update Stage
            </button>
          </div>
        </div>

        {/* ── Investments Terms ── */}
        <div style={{
          ...cardBase,
          padding: 0,
          overflow: "hidden",
          border: "1px solid #A7F3D0",
        }}>
          {/* Header */}
          <div style={{
            padding: "22px 20px",
            background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
            borderBottom: "1px solid #A7F3D0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <TbFileText size={22} color="#10B981" strokeWidth={1.8} />
              <span style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>Investments Terms</span>
            </div>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
              Key terms for potential investors
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: "22px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Minimum Investment card */}
            <div style={{
              border: "1px solid #A7F3D0", borderRadius: 14, padding: "18px 18px",
              background: "#F0FDF4",
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#10B981", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
                MINIMUM INVESTMENT
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#10B981" }}>$25,000</div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#E5E7EB" }} />

            {/* Equity offered row */}
            <div style={{
              background: "#F3F4F6", borderRadius: 14, padding: "18px 18px",
              display: "flex", alignItems: "flex-start", gap: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "#fff", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <TbTrendingUp size={22} color="#6B7280" strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 2 }}>Equity offered</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>To be discussed</div>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                  Negotiate based on investment amount and strategic value
                </p>
              </div>
            </div>

            {/* View Term Sheet button */}
            <button style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#fff", border: "1px solid #E5E7EB",
              borderRadius: 14, padding: "14px 20px",
              fontSize: 15, fontWeight: 600, color: "#374151",
              cursor: "pointer", transition: "background 0.15s, box-shadow 0.15s",
              WebkitTapHighlightColor: "transparent", width: "100%",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <TbExternalLink size={18} color="#6B7280" strokeWidth={1.8} />
              View Term Sheet
            </button>
          </div>
        </div>

      </div>
    </PageShell>
  );
}
