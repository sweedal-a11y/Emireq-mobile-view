"use client";

import { useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import {
  TbFileText, TbCircleCheck, TbClockHour4, TbAlertTriangle,
  TbMaximize, TbPencil, TbDots,
  TbSearch, TbSelector,
  TbCalendar, TbChevronLeft, TbChevronRight,
  TbDotsVertical, TbSparkles, TbInfoCircle,
} from "react-icons/tb";
import { FONT, InfoIcon, PageShell, cardBase } from "./shared";

// ─── Types ────────────────────────────────────────────────────────────────────

type ComplianceStatus = "Approved" | "In Review" | "Pending" | "Non-Compliant";
type DeadlineStatus = "Pending" | "In Review" | "Non-Compliant";
type DocCategory = "Legal" | "Financial" | "Finance";

interface ComplianceRecord {
  id: number;
  name: string;
  category: DocCategory;
  date: string;
  assignee: string;
  status: ComplianceStatus;
}

interface Deadline {
  id: number;
  name: string;
  date: string;
  category: string;
  status: DeadlineStatus;
}

interface Insight {
  id: number;
  text: string;
  action: string;
  iconBg: string;
  borderColor: string;
  icon: "warning" | "info" | "check" | "info-purple";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COMPLIANCE_PIE = [
  { label: "Approved", value: 31, pct: 78, color: "#10B981" },
  { label: "In Review", value: 6, pct: 15, color: "#3B82F6" },
  { label: "Pending", value: 2, pct: 5, color: "#F59E0B" },
  { label: "Non-Compliant", value: 1, pct: 2, color: "#EF4444" },
];

const DEADLINES: Deadline[] = [
  { id: 1, name: "Trade License Renewal", date: "08 Nov 2025", category: "Legal", status: "Pending" },
  { id: 2, name: "Annual Audit Report", date: "11 Nov 2025", category: "Finance", status: "In Review" },
  { id: 3, name: "Data Privacy Update", date: "01 Jan 2026", category: "Finance", status: "Non-Compliant" },
];

const ALL_RECORDS: ComplianceRecord[] = [
  { id: 1, name: "Certificate of Incorporation", category: "Legal", date: "2025-08-15", assignee: "Legal Team", status: "Approved" },
  { id: 2, name: "Trade License", category: "Legal", date: "2025-08-20", assignee: "Compliance Officer", status: "In Review" },
  { id: 3, name: "GST Registration", category: "Financial", date: "2025-10-15", assignee: "Finance Director", status: "Pending" },
  { id: 4, name: "Shareholder Agreement", category: "Legal", date: "2025-10-15", assignee: "Legal Dept", status: "Non-Compliant" },
  { id: 5, name: "Board Resolution", category: "Legal", date: "2025-09-01", assignee: "Legal Team", status: "Approved" },
  { id: 6, name: "Tax Filing", category: "Financial", date: "2025-11-01", assignee: "Finance Director", status: "Approved" },
];

const INSIGHTS: Insight[] = [
  {
    id: 1,
    text: "Your Trade License expires on 12-Dec-2025 — renewal recommended",
    action: "Start Renewal",
    iconBg: "#FFF7ED",
    borderColor: "#FFF7ED",
    icon: "warning",
  },
  {
    id: 2,
    text: "Missing Board Meeting Minutes for Q4 2025 — upload before audit",
    action: "Upload Now",
    iconBg: "#EFF6FF",
    borderColor: "#EFF6FF",
    icon: "info",
  },
  {
    id: 3,
    text: "Investor Agreement pending one digital signature — initiate via Emireq Sign",
    action: "Sign Now",
    iconBg: "#ECFDF5",
    borderColor: "#ECFDF5",
    icon: "check",
  },
  {
    id: 4,
    text: "Tax Filing Window opens on Nov 17th 2025 — Learn auto-reminders",
    action: "Set Reminder",
    iconBg: "#F5F3FF",
    borderColor: "#F5F3FF",
    icon: "info-purple",
  },
];

const STATUS_STYLE: Record<ComplianceStatus, { bg: string; color: string }> = {
  Approved: { bg: "#ECFDF5", color: "#10B981" },
  "In Review": { bg: "#EFF6FF", color: "#3B82F6" },
  Pending: { bg: "#FFF7ED", color: "#F59E0B" },
  "Non-Compliant": { bg: "#FEF2F2", color: "#EF4444" },
};

const DEADLINE_STATUS_STYLE: Record<DeadlineStatus, { bg: string; color: string }> = {
  Pending: { bg: "#FFF7ED", color: "#F59E0B" },
  "In Review": { bg: "#EFF6FF", color: "#3B82F6" },
  "Non-Compliant": { bg: "#FEF2F2", color: "#EF4444" },
};

const TOTAL_RESULTS = 100;
const PAGE_SIZE = 4;
const TOTAL_PAGES = 20;

// ─── Stat Card Icon Components ────────────────────────────────────────────────

function StatIcon({ type }: { type: "documents" | "compliance" | "reviews" | "expiring" }) {
  const configs = {
    documents: { bg: "#3B82F6", Icon: TbFileText },
    compliance: { bg: "#10B981", Icon: TbCircleCheck },
    reviews: { bg: "#F97316", Icon: TbClockHour4 },
    expiring: { bg: "#EF4444", Icon: TbAlertTriangle },
  };
  const c = configs[type];
  return (
    <div style={{
      width: 48, height: 48, borderRadius: 14, background: c.bg,
      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
    }}>
      <c.Icon size={22} color="#fff" strokeWidth={1.8} />
    </div>
  );
}

// ─── Insight Icon ─────────────────────────────────────────────────────────────

function InsightIcon({ type }: { type: Insight["icon"] }) {
  if (type === "warning") {
    return (
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <TbAlertTriangle size={24} color="#F97316" strokeWidth={2} />
      </div>
    );
  }
  if (type === "info") {
    return (
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <TbInfoCircle size={24} color="#3B82F6" strokeWidth={2} />
      </div>
    );
  }
  if (type === "check") {
    return (
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <TbCircleCheck size={24} color="#10B981" strokeWidth={2} />
      </div>
    );
  }
  return (
    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F3E8FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <TbInfoCircle size={24} color="#8B5CF6" strokeWidth={2} />
    </div>
  );
}

// ─── Compliance Donut Chart ───────────────────────────────────────────────────

function ComplianceDonut() {
  const total = COMPLIANCE_PIE.reduce((s, d) => s + d.value, 0);
  return (
    <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={COMPLIANCE_PIE}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            dataKey="value"
            stroke="none"
            startAngle={90}
            endAngle={-270}
          >
            {COMPLIANCE_PIE.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a", lineHeight: 1.1 }}>{total}</div>
        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 400, marginTop: 2 }}>Total</div>
      </div>
    </div>
  );
}

// ─── Card Title Row ───────────────────────────────────────────────────────────

function CardTitle({ title, subtitle, rightContent }: { title: string; subtitle?: string; rightContent?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>{title}</span>
          <InfoIcon size={17} />
        </div>
        {rightContent || (
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
        )}
      </div>
      {subtitle && <p style={{ fontSize: 13, color: "#64748b", margin: "5px 0 0", fontWeight: 400 }}>{subtitle}</p>}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function DocumentsComplianceContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRecords = ALL_RECORDS.filter(rec => {
    const matchesSearch = rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageShell title="Dashboard" defaultActive="documents">
      <div style={{ padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* ── Page Heading ── */}
        <div style={{ padding: "0 2px" }}>
          <h1 style={{ fontSize: "clamp(26px,7vw,32px)", fontWeight: 600, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.01em", lineHeight: 1.15 }}>
            Documents &amp; Compliance
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
            Manage all legal documents and compliance requirements
          </p>
        </div>

        {/* ── Stat Cards Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Total Documents */}
          <div style={{
            ...cardBase,
            padding: "18px 16px",
            cursor: "pointer",
            transition: "transform 0.18s, box-shadow 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
          >
            <StatIcon type="documents" />
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 500 }}>Total Documents</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 4 }}>7</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>+4 this week</div>
          </div>

          {/* Compliance Up To Date */}
          <div style={{
            ...cardBase,
            padding: "18px 16px",
            cursor: "pointer",
            transition: "transform 0.18s, box-shadow 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
          >
            <StatIcon type="compliance" />
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 500 }}>Compliance Up To Date</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 4 }}>4</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>3 upcoming this week</div>
          </div>

          {/* Pending Reviews */}
          <div style={{
            ...cardBase,
            padding: "18px 16px",
            cursor: "pointer",
            background: "linear-gradient(135deg, #fff 0%, #FFF7ED 100%)",
            transition: "transform 0.18s, box-shadow 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
          >
            <StatIcon type="reviews" />
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 500 }}>Pending Reviews</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 4 }}>2</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Needs Attention</div>
          </div>

          {/* Expiring Soon */}
          <div style={{
            ...cardBase,
            padding: "18px 16px",
            cursor: "pointer",
            transition: "transform 0.18s, box-shadow 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
          >
            <StatIcon type="expiring" />
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 500 }}>Expiring Soon</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 4 }}>1</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Requires action</div>
          </div>
        </div>

        {/* ── Compliance Status Donut ── */}
        <div style={{ ...cardBase }}>
          <CardTitle title="Compliance Status" subtitle="Current status breakdown" />
          <ComplianceDonut />
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
            {COMPLIANCE_PIE.map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{s.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{s.value}</span>
                  <span style={{ fontSize: 13, color: "#9ca3af" }}>({s.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Upcoming Compliance Deadlines ── */}
        <div style={{ ...cardBase }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>Upcoming Compliance Deadlines</span>
              <InfoIcon size={17} />
            </div>
            <div style={{
              width: 30, height: 30, borderRadius: "50%", background: "#FEF2F2",
              border: "1.5px solid #FECACA",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#EF4444",
            }}>
              3
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {DEADLINES.map(d => (
              <div key={d.id} style={{
                borderRadius: 16, border: "1px solid #e5e7eb",
                padding: "18px 16px", cursor: "pointer",
                transition: "transform 0.15s, box-shadow 0.15s",
                WebkitTapHighlightColor: "transparent",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{d.name}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    padding: "5px 14px", borderRadius: 20,
                    background: DEADLINE_STATUS_STYLE[d.status].bg,
                    color: DEADLINE_STATUS_STYLE[d.status].color,
                    flexShrink: 0, marginLeft: 8,
                  }}>
                    {d.status}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <TbCalendar size={15} color="#9ca3af" strokeWidth={1.8} />
                  <span style={{ fontSize: 13, color: "#64748b" }}>{d.date}</span>
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 500, color: "#374151",
                  padding: "5px 12px", borderRadius: 8,
                  background: "#f3f4f6", display: "inline-block",
                }}>
                  {d.category}
                </span>
              </div>
            ))}
          </div>

          {/* View All Deadlines Button */}
          <button style={{
            width: "100%", marginTop: 18,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "#2563EB", color: "#fff", border: "none",
            borderRadius: 14, padding: "14px 20px",
            fontSize: 15, fontWeight: 600, cursor: "pointer",
            transition: "background 0.18s",
            WebkitTapHighlightColor: "transparent",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "#1d4ed8")}
            onMouseLeave={e => (e.currentTarget.style.background = "#2563EB")}
          >
            <TbCalendar size={18} strokeWidth={2} />
            View All Deadlines
          </button>
        </div>

        {/* ── Compliance Records ── */}
        <div style={{ ...cardBase }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>Compliance Records</span>
            <InfoIcon size={17} />
          </div>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px", fontWeight: 400 }}>
            Detailed history of compliance document reviews
          </p>

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
                <option value="Approved">Approved</option>
                <option value="In Review">In Review</option>
                <option value="Pending">Pending</option>
                <option value="Non-Compliant">Non-Compliant</option>
              </select>
              <TbSelector size={16} color="#9ca3af" strokeWidth={1.8} style={{ position: "absolute", right: 10, pointerEvents: "none" }} />
            </div>
          </div>

          {/* Record Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filteredRecords.map((rec) => (
              <div key={rec.id} style={{
                borderRadius: 16, border: "1px solid #e5e7eb",
                padding: "18px 16px", cursor: "pointer",
                transition: "transform 0.15s, box-shadow 0.15s",
                WebkitTapHighlightColor: "transparent",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "#f3f4f6", display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <TbFileText size={22} color="#1f2937" strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>{rec.name}</span>
                      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexShrink: 0, marginLeft: 8, WebkitTapHighlightColor: "transparent" }}>
                        <TbDotsVertical size={20} color="#6b7280" strokeWidth={1.8} />
                      </button>
                    </div>
                    <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
                      {rec.category} &nbsp;•&nbsp; {rec.date}
                    </div>
                  </div>
                </div>
                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                  <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>{rec.assignee}</span>
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    padding: "5px 14px", borderRadius: 20,
                    background: STATUS_STYLE[rec.status].bg,
                    color: STATUS_STYLE[rec.status].color,
                  }}>
                    {rec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
            <span style={{ fontSize: 13, color: "#10B981", fontWeight: 500 }}>
              Showing {Math.min(filteredRecords.length, PAGE_SIZE)} of {TOTAL_RESULTS} results
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

        {/* ── Smart Insights (AI-Powered) ── */}
        <div style={{ ...cardBase }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <TbSparkles size={22} color="#0f172a" strokeWidth={1.8} />
            <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>Smart Insights (AI-Powered)</span>
          </div>
          <p style={{ fontSize: 15, color: "#2563EB", margin: "0 0 20px", fontWeight: 500, lineHeight: 1.5 }}>
            Actionable recommendations based on your investor engagement data
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {INSIGHTS.map(insight => (
              <div key={insight.id} style={{
                borderRadius: 18, border: `1px solid ${insight.borderColor}`,
                background: insight.iconBg + "55",
                padding: "20px 18px", cursor: "pointer",
                display: "flex", alignItems: "flex-start", gap: 14,
                transition: "transform 0.15s, box-shadow 0.15s",
                WebkitTapHighlightColor: "transparent",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <InsightIcon type={insight.icon} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, color: "#374151", margin: "0 0 10px", lineHeight: 1.55, fontWeight: 500 }}>
                    {insight.text}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#2563EB" }}>{insight.action}</span>
                    <TbChevronRight size={16} color="#2563EB" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageShell>
  );
}
