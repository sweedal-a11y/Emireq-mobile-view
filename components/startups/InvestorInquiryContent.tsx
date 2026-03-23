"use client";

import { useState } from "react";
import {
  TbMail, TbTrendingUp, TbMessageCircle,
  TbCircleCheck, TbBulb, TbPlus, TbUpload, TbDownload,
  TbSearch, TbSelector, TbChevronRight,
  TbSend, TbPhone, TbEye, TbCalendarEvent, TbClock,
  TbBuildingSkyscraper, TbMapPin, TbStars,
} from "react-icons/tb";
import { FONT, InfoIcon, PageShell, cardBase } from "./shared";

// ─── Stat Cards Data ──────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    icon: TbMail,
    iconBg: "#3B82F6",
    label: "Total Contacted",
    value: "7",
    sub: "All Time",
    cardBg: "linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%)",
  },
  {
    icon: TbTrendingUp,
    iconBg: "#7C3AED",
    label: "Replies / Interest",
    value: "2",
    sub: "67% response rate",
    cardBg: "linear-gradient(135deg, #faf5ff 0%, #fcf8ff 100%)",
  },
  {
    icon: TbMessageCircle,
    iconBg: "#10B981",
    label: "Active Discussions",
    value: "2",
    sub: "In progress",
    cardBg: "linear-gradient(135deg, #ecfdf5 0%, #f4fdf9 100%)",
  },
  {
    icon: TbCircleCheck,
    iconBg: "#6B7280",
    label: "Closed",
    value: "1",
    sub: "Completed",
    cardBg: "linear-gradient(135deg, #f3f4f6 0%, #f9fafb 100%)",
  },
];

// ─── Inquiry Pipeline Data ────────────────────────────────────────────────────

type InquiryStatus = "In Discussion" | "Awaiting Reply" | "Interested" | "Closed";

interface InquiryContact {
  initials: string;
  name: string;
  company: string;
  location: string;
  status: InquiryStatus;
  investmentRange: string;
  stageFocus: string;
  interests: string[];
  lastContact: string;
  callNote: string;
  avatarBg: string;
}

const STATUS_STYLE: Record<InquiryStatus, { bg: string; color: string; dotColor: string }> = {
  "In Discussion":  { bg: "#DCFCE7", color: "#16A34A", dotColor: "#16A34A" },
  "Awaiting Reply":  { bg: "#FEF3C7", color: "#D97706", dotColor: "#F59E0B" },
  "Interested":      { bg: "#DBEAFE", color: "#2563EB", dotColor: "#3B82F6" },
  "Closed":          { bg: "#F3F4F6", color: "#6B7280", dotColor: "#6B7280" },
};

const INTEREST_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  "HealthTech": { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  "Oncology":   { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
};

const PIPELINE_CONTACTS: InquiryContact[] = [
  {
    initials: "SJ", name: "Sarah Johnson", company: "Novocure Capital", location: "Switzerland",
    status: "In Discussion", investmentRange: "$100k - $1M", stageFocus: "Series A",
    interests: ["HealthTech", "Oncology"], lastContact: "Oct 30, 2025",
    callNote: "Call with Monica — Nov 4, 2025 at 10:00 AM",
    avatarBg: "#E5E7EB",
  },
  {
    initials: "ML", name: "Michael Lee", company: "Novocure Capital", location: "Switzerland",
    status: "Awaiting Reply", investmentRange: "$100k – $1M", stageFocus: "Series A",
    interests: ["HealthTech", "Oncology"], lastContact: "Oct 30, 2025",
    callNote: "Call with Monica — Nov 4, 2025 at 10:00 AM",
    avatarBg: "#FDE68A",
  },
  {
    initials: "E", name: "Eva", company: "Novocure Capital", location: "Switzerland",
    status: "Interested", investmentRange: "$100k – $1M", stageFocus: "Series A",
    interests: ["HealthTech", "Oncology"], lastContact: "Oct 30, 2025",
    callNote: "Call with Monica — Nov 4, 2025 at 10:00 AM",
    avatarBg: "#D1D5DB",
  },
  {
    initials: "JS", name: "James Smith", company: "Novocure Capital", location: "Switzerland",
    status: "Closed", investmentRange: "$100k – $1M", stageFocus: "Series A",
    interests: ["HealthTech", "Oncology"], lastContact: "Oct 30, 2025",
    callNote: "Call with Monica — Nov 4, 2025 at 10:00 AM",
    avatarBg: "#C7D2FE",
  },
];

// ─── Upcoming Meetings ────────────────────────────────────────────────────────

const MEETINGS = [
  { initials: "MG", title: "Call with Monica", person: "Monica Gonzalez", date: "Nov 4, 2025 • 10:00 AM", bg: "#1E293B" },
  { initials: "SV", title: "Intro — Summit Ventures", person: "Monica Gonzalez", date: "Nov 4, 2025 • 10:00 AM", bg: "#6366F1" },
];

// ─── Saved Filters ────────────────────────────────────────────────────────────

const SAVED_FILTERS = [
  { label: "Seed Stage", count: 12 },
  { label: "MENA Region", count: 5 },
  { label: "HealthTech Focus", count: 8 },
];

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function InvestorInquiryContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roundFilter, setRoundFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("Last 30 days");

  const filteredContacts = PIPELINE_CONTACTS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageShell title="Dashboard" defaultActive="inquiries">
      <div style={{ padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: 18, fontFamily: FONT }}>

        {/* ── Page Heading ── */}
        <div style={{ padding: "0 2px" }}>
          <h1 style={{ fontSize: "clamp(26px,7vw,32px)", fontWeight: 600, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.01em", lineHeight: 1.15 }}>
            Investor Inquires
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
            Manage investors reaching out to your startup
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
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: card.iconBg, display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <card.icon size={26} color="#fff" strokeWidth={1.8} />
                </div>
              </div>
              <div style={{ fontSize: 13.5, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>{card.label}</div>
              <div style={{ fontSize: 34, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>{card.value}</div>
              <div style={{ fontSize: 12.5, color: "#9ca3af", fontWeight: 400 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div style={{ ...cardBase, padding: 0, overflow: "hidden" }}>
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "18px 20px",
            background: "#EFF6FF",
            borderBottom: "1px solid #DBEAFE",
          }}>
            <TbBulb size={22} color="#3B82F6" strokeWidth={1.8} />
            <span style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>Quick Actions</span>
          </div>

          {/* Action buttons */}
          <div style={{ padding: "20px 20px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
            <button style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#111827", color: "#fff", border: "none",
              borderRadius: 14, padding: "14px 20px",
              fontSize: 15, fontWeight: 600, fontFamily: FONT,
              cursor: "pointer", transition: "background 0.15s",
              WebkitTapHighlightColor: "transparent",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#1f2937")}
              onMouseLeave={e => (e.currentTarget.style.background = "#111827")}
            >
              <TbPlus size={18} strokeWidth={2.5} />
              Add New Investor
            </button>
            <button style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#fff", color: "#374151", border: "1px solid #e5e7eb",
              borderRadius: 14, padding: "13px 20px",
              fontSize: 15, fontWeight: 500, fontFamily: FONT,
              cursor: "pointer", transition: "background 0.15s",
              WebkitTapHighlightColor: "transparent",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
            >
              <TbUpload size={18} strokeWidth={1.8} />
              Import from CSV
            </button>
            <button style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#fff", color: "#374151", border: "1px solid #e5e7eb",
              borderRadius: 14, padding: "13px 20px",
              fontSize: 15, fontWeight: 500, fontFamily: FONT,
              cursor: "pointer", transition: "background 0.15s",
              WebkitTapHighlightColor: "transparent",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
            >
              <TbDownload size={18} strokeWidth={1.8} />
              Export Data
            </button>
          </div>
        </div>

        {/* ── Inquiry Pipeline ── */}
        <div style={{ ...cardBase }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>Inquiry Pipeline</span>
            <InfoIcon size={17} />
          </div>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px", fontWeight: 400 }}>Track and manage all incoming inquiries</p>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: 12, padding: "10px 14px", marginBottom: 12,
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

          {/* Filter pills */}
          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 10, padding: "8px 14px", cursor: "pointer",
              position: "relative",
            }}>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  border: "none", outline: "none", background: "transparent",
                  fontSize: 13, color: "#374151", fontFamily: FONT, fontWeight: 500,
                  cursor: "pointer", appearance: "none", paddingRight: 16,
                }}
              >
                <option value="all">All</option>
                <option value="In Discussion">In Discussion</option>
                <option value="Awaiting Reply">Awaiting Reply</option>
                <option value="Interested">Interested</option>
                <option value="Closed">Closed</option>
              </select>
              <TbSelector size={14} color="#6b7280" strokeWidth={2} style={{ position: "absolute", right: 10, pointerEvents: "none" }} />
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 10, padding: "8px 14px", cursor: "pointer",
              position: "relative",
            }}>
              <select
                value={roundFilter}
                onChange={e => setRoundFilter(e.target.value)}
                style={{
                  border: "none", outline: "none", background: "transparent",
                  fontSize: 13, color: "#374151", fontFamily: FONT, fontWeight: 500,
                  cursor: "pointer", appearance: "none", paddingRight: 16,
                }}
              >
                <option value="all">All</option>
                <option value="Series A">Series A</option>
                <option value="Seed">Seed</option>
              </select>
              <TbSelector size={14} color="#6b7280" strokeWidth={2} style={{ position: "absolute", right: 10, pointerEvents: "none" }} />
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 10, padding: "8px 14px", cursor: "pointer",
              position: "relative",
            }}>
              <select
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                style={{
                  border: "none", outline: "none", background: "transparent",
                  fontSize: 13, color: "#374151", fontFamily: FONT, fontWeight: 500,
                  cursor: "pointer", appearance: "none", paddingRight: 16,
                }}
              >
                <option value="Last 30 days">Last 30 days</option>
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 90 days">Last 90 days</option>
              </select>
              <TbSelector size={14} color="#6b7280" strokeWidth={2} style={{ position: "absolute", right: 10, pointerEvents: "none" }} />
            </div>
          </div>

          {/* Contact cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {filteredContacts.map((c, i) => (
              <div key={i} style={{
                borderRadius: 16, border: "1px solid #e5e7eb",
                overflow: "hidden", cursor: "pointer",
                transition: "transform 0.15s, box-shadow 0.15s",
                WebkitTapHighlightColor: "transparent",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Header row */}
                <div style={{ padding: "18px 18px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: "50%",
                      background: c.avatarBg, display: "flex",
                      alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{c.initials}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{c.name}</span>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          fontSize: 11, fontWeight: 600,
                          padding: "3px 10px", borderRadius: 20,
                          background: STATUS_STYLE[c.status].bg,
                          color: STATUS_STYLE[c.status].color,
                          whiteSpace: "nowrap",
                        }}>
                          <span style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: STATUS_STYLE[c.status].dotColor,
                            display: "inline-block", flexShrink: 0,
                          }} />
                          {c.status}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 5 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <TbBuildingSkyscraper size={13} color="#9ca3af" strokeWidth={1.8} />
                          <span style={{ fontSize: 12, color: "#9ca3af" }}>{c.company}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <TbMapPin size={13} color="#9ca3af" strokeWidth={1.8} />
                          <span style={{ fontSize: 12, color: "#9ca3af" }}>{c.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "#f1f5f9", margin: "0 18px" }} />

                {/* Details */}
                <div style={{ padding: "16px 18px 16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Investment Range */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Investment Range</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{c.investmentRange}</span>
                    </div>
                    {/* Stage Focus */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Stage Focus</span>
                      <span style={{
                        fontSize: 12, fontWeight: 500, color: "#374151",
                        padding: "4px 14px", borderRadius: 8,
                        border: "1px solid #d1d5db", background: "#fff",
                      }}>{c.stageFocus}</span>
                    </div>
                    {/* Interests */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Interests</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        {c.interests.map(tag => (
                          <span key={tag} style={{
                            fontSize: 12, fontWeight: 500,
                            padding: "4px 12px", borderRadius: 8,
                            background: INTEREST_STYLE[tag]?.bg ?? "#F3F4F6",
                            color: INTEREST_STYLE[tag]?.color ?? "#6B7280",
                            border: `1px solid ${INTEREST_STYLE[tag]?.border ?? "#e5e7eb"}`,
                            cursor: "pointer",
                          }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    {/* Last Contact */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Last Contact</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{c.lastContact}</span>
                    </div>
                  </div>
                </div>

                {/* Call note */}
                <div style={{ padding: "0 18px 14px" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "#ECFDF5", borderRadius: 10, padding: "11px 14px",
                    border: "1px solid #A7F3D0",
                    cursor: "pointer",
                  }}>
                    <TbCalendarEvent size={16} color="#059669" strokeWidth={1.8} />
                    <span style={{ fontSize: 12, color: "#065F46", fontWeight: 500 }}>{c.callNote}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ padding: "0 18px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: "#111827", color: "#fff", border: "1px solid #111827",
                      borderRadius: 10, padding: "9px 16px",
                      fontSize: 12, fontWeight: 600, fontFamily: FONT,
                      cursor: "pointer", WebkitTapHighlightColor: "transparent",
                      transition: "background 0.15s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#1f2937")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#111827")}
                    >
                      <TbMail size={14} strokeWidth={2} />
                      Send Message
                    </button>
                    <button style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: "#fff", color: "#374151", border: "none",
                      borderRadius: 10, padding: "9px 12px",
                      fontSize: 12, fontWeight: 500, fontFamily: FONT,
                      cursor: "pointer", WebkitTapHighlightColor: "transparent",
                      transition: "color 0.15s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#111827")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
                    >
                      <TbPhone size={14} strokeWidth={1.8} />
                      Schedule Call
                    </button>
                    <button style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "#f3f4f6", border: "1px solid #e5e7eb",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      WebkitTapHighlightColor: "transparent",
                      transition: "background 0.15s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#e5e7eb")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#f3f4f6")}
                    >
                      <TbEye size={16} color="#6b7280" strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Upcoming Meetings ── */}
        <div style={{ ...cardBase, padding: 0, overflow: "hidden" }}>
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 20px",
            background: "#FFFBEB",
            borderBottom: "1px solid #FDE68A",
          }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.02em" }}>Upcoming Meetings</span>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "#1E293B", display: "flex",
              alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{MEETINGS.length}</span>
            </div>
          </div>

          {/* Meeting cards */}
          <div style={{ padding: "20px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {MEETINGS.map((m, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "#fff", borderRadius: 14, padding: "16px 16px",
                border: "1px solid #e5e7eb",
                borderLeft: "3px solid #e5e7eb",
                cursor: "pointer", transition: "background 0.15s, box-shadow 0.15s",
                WebkitTapHighlightColor: "transparent",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: m.bg, display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{m.initials}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 3 }}>{m.title}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>{m.person}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <TbClock size={14} color="#94a3b8" strokeWidth={1.8} />
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{m.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Saved Filters ── */}
        <div style={{ ...cardBase, padding: 0, overflow: "hidden" }}>
          {/* Header */}
          <div style={{
            padding: "22px 20px",
            background: "linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)",
            borderBottom: "1px solid #A7F3D0",
          }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.02em" }}>Saved Filters</span>
          </div>

          {/* Filter items */}
          <div style={{ padding: "20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            {SAVED_FILTERS.map((f, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#fff", borderRadius: 14, padding: "16px 18px",
                border: "1px solid #e5e7eb",
                cursor: "pointer", transition: "background 0.15s, box-shadow 0.15s",
                WebkitTapHighlightColor: "transparent",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <span style={{ fontSize: 15, fontWeight: 500, color: "#1e293b" }}>{f.label}</span>
                <span style={{
                  fontSize: 13, fontWeight: 600, color: "#64748b",
                  background: "#fff", borderRadius: 20,
                  border: "1px solid #d1d5db",
                  padding: "3px 12px",
                  minWidth: 28, textAlign: "center",
                }}>{f.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pro Tip ── */}
        <div style={{
          ...cardBase,
          background: "linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 100%)",
          border: "1px solid #BFDBFE",
          display: "flex", alignItems: "flex-start", gap: 14,
          padding: "22px 20px",
          cursor: "pointer",
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "#3B82F6", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <TbStars size={22} color="#fff" strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>Pro Tip</div>
            <p style={{ fontSize: 14, color: "#3B82F6", margin: 0, lineHeight: 1.6, fontWeight: 500, fontStyle: "italic" }}>
              Respond to investor inquiries within 24 hours to increase your chances of securing meetings.
            </p>
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
