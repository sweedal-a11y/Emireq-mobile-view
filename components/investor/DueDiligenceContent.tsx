"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TbBuilding, TbDownload, TbTrendingUp, TbCalendar,
  TbAlertTriangle, TbShieldCheck, TbFileText, TbChartBar,
  TbScale, TbUsers, TbClipboard, TbCircleCheck,
  TbCurrencyDollar, TbTarget, TbActivity, TbChevronDown,
  TbChevronUp, TbWorld, TbBell, TbClock, TbSearch, TbDots,
  TbX, TbEye, TbShare, TbTrash, TbCheck,
} from "react-icons/tb";
import { FONT, PageShell, cardBase } from "./shared";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabKey = "summary" | "financials" | "risk" | "legal" | "governance" | "documents" | "aaoifi";

const TABS: { key: TabKey; label: string; Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }> }[] = [
  { key: "summary",     label: "Summary",          Icon: TbFileText },
  { key: "financials",  label: "Financials",        Icon: TbChartBar },
  { key: "risk",        label: "Risk",              Icon: TbAlertTriangle },
  { key: "legal",       label: "Legal",             Icon: TbScale },
  { key: "governance",  label: "Governance",        Icon: TbUsers },
  { key: "documents",   label: "Documents",         Icon: TbClipboard },
  { key: "aaoifi",      label: "AAOIFI & Shariah",  Icon: TbFileText },
];

// ─── Revenue Chart Data ───────────────────────────────────────────────────────
const REVENUE_DATA = [
  { year: "2021", revenue: 1.2, ebitda: 0.3 },
  { year: "2022", revenue: 2.1, ebitda: 0.6 },
  { year: "2023", revenue: 3.0, ebitda: 0.85 },
  { year: "2024", revenue: 4.2, ebitda: 1.2 },
  { year: "2025", revenue: 6.85, ebitda: 2.44 },
];

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1a1a2e", borderRadius: 10, padding: "8px 12px", fontFamily: FONT, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12, fontWeight: 600, color: p.color }}>
          {p.name}: ${p.value}M
        </div>
      ))}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
      zIndex: 100, background: "#111827", color: "#fff",
      fontSize: 13, fontWeight: 600, fontFamily: FONT,
      padding: "12px 24px", borderRadius: 14,
      boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
      whiteSpace: "nowrap", animation: "toastIn 0.24s ease-out",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <TbCheck size={16} strokeWidth={2.5} />
        {message}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Invest Confirmation Modal ────────────────────────────────────────────────

function InvestModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <>
      <div
        role="button" tabIndex={-1} aria-label="Close"
        onClick={onClose}
        onKeyDown={e => e.key === "Escape" && onClose()}
        style={{
          position: "fixed", inset: 0, zIndex: 60,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
        }}
      />
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, zIndex: 70,
        background: "#fff", borderRadius: "24px 24px 0 0",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
        padding: "28px 20px 32px", fontFamily: FONT,
        animation: "slideUp 0.28s ease-out",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Confirm Investment</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0" }}>Review before proceeding</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: "none", border: "none", padding: 4, cursor: "pointer",
            display: "flex", borderRadius: 8, WebkitTapHighlightColor: "transparent",
          }}>
            <TbX size={22} color="#9ca3af" />
          </button>
        </div>
        <div style={{ background: "#f9fafb", borderRadius: 16, padding: 16, marginBottom: 20 }}>
          {[
            { label: "Investment", value: "Crescent GreenTech SPV Ltd." },
            { label: "Minimum", value: "$50,000" },
            { label: "Expected IRR", value: "19–23%" },
            { label: "Tenure", value: "48 months" },
            { label: "Shariah Status", value: "AAOIFI Compliant" },
          ].map((r, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              paddingBottom: 10, marginBottom: 10,
              borderBottom: i < 4 ? "1px solid #f1f5f9" : "none",
            }}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{r.value}</span>
            </div>
          ))}
        </div>
        <button onClick={onConfirm} style={{
          width: "100%", padding: "15px", borderRadius: 14,
          background: "#16a34a", color: "#fff",
          fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer",
          fontFamily: FONT, WebkitTapHighlightColor: "transparent",
          transition: "opacity 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Confirm & Proceed
        </button>
        <button onClick={onClose} style={{
          width: "100%", padding: "14px", borderRadius: 14,
          background: "transparent", color: "#6b7280",
          fontSize: 14, fontWeight: 600, border: "1px solid #e5e7eb", cursor: "pointer",
          fontFamily: FONT, marginTop: 10, WebkitTapHighlightColor: "transparent",
        }}>
          Cancel
        </button>
        <style>{`@keyframes slideUp { from { transform: translateX(-50%) translateY(100%); } to { transform: translateX(-50%) translateY(0); } }`}</style>
      </div>
    </>
  );
}

// ─── Document Preview Modal ──────────────────────────────────────────────────

interface DDDoc { name: string; category: string; size: string; date: string }

function DocPreviewModal({ doc, onClose, onDownload }: { doc: DDDoc; onClose: () => void; onDownload: () => void }) {
  return (
    <>
      <div
        role="button" tabIndex={-1} aria-label="Close"
        onClick={onClose}
        onKeyDown={e => e.key === "Escape" && onClose()}
        style={{
          position: "fixed", inset: 0, zIndex: 60,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
        }}
      />
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, zIndex: 70,
        background: "#fff", borderRadius: "24px 24px 0 0",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
        padding: "24px 20px 28px", fontFamily: FONT,
        animation: "slideUp 0.28s ease-out",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.3 }}>{doc.name}</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0" }}>Document preview</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: "none", border: "none", padding: 4, cursor: "pointer",
            display: "flex", borderRadius: 8, flexShrink: 0, WebkitTapHighlightColor: "transparent",
          }}>
            <TbX size={22} color="#9ca3af" />
          </button>
        </div>
        {/* Simulated preview area */}
        <div style={{
          background: "#f9fafb", borderRadius: 16, padding: "40px 20px",
          display: "flex", flexDirection: "column", alignItems: "center",
          marginBottom: 18, border: "1px solid #f1f5f9",
        }}>
          <TbFileText size={48} color="#3b82f6" strokeWidth={1.2} />
          <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginTop: 12, textAlign: "center" }}>{doc.name}</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>{doc.size} · {doc.category}</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onDownload} style={{
            flex: 1, padding: "14px", borderRadius: 14,
            background: "#2563eb", color: "#fff",
            fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontFamily: FONT, WebkitTapHighlightColor: "transparent",
            transition: "opacity 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <TbDownload size={17} strokeWidth={2} /> Download
          </button>
          <button onClick={onClose} style={{
            flex: 1, padding: "14px", borderRadius: 14,
            background: "#fff", color: "#374151",
            fontSize: 14, fontWeight: 600, border: "1px solid #e5e7eb", cursor: "pointer",
            fontFamily: FONT, WebkitTapHighlightColor: "transparent",
          }}>
            Close
          </button>
        </div>
        <style>{`@keyframes slideUp { from { transform: translateX(-50%) translateY(100%); } to { transform: translateX(-50%) translateY(0); } }`}</style>
      </div>
    </>
  );
}

// ─── Document Context Menu ───────────────────────────────────────────────────

function DocContextMenu({
  doc, anchorRect, onView, onDownload, onShare, onClose,
}: {
  doc: DDDoc;
  anchorRect: { top: number; right: number };
  onView: () => void;
  onDownload: () => void;
  onShare: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = () => onClose();
    window.addEventListener("scroll", handler, true);
    return () => window.removeEventListener("scroll", handler, true);
  }, [onClose]);

  const items = [
    { label: "View", icon: TbEye, onClick: onView },
    { label: "Download", icon: TbDownload, onClick: onDownload },
    { label: "Share", icon: TbShare, onClick: onShare },
  ];

  return (
    <>
      <div
        role="button" tabIndex={-1} aria-label="Close menu"
        onClick={onClose}
        onKeyDown={e => e.key === "Escape" && onClose()}
        style={{ position: "fixed", inset: 0, zIndex: 55 }}
      />
      <div style={{
        position: "fixed",
        top: anchorRect.top + 4,
        right: Math.max(16, window.innerWidth - anchorRect.right + 8),
        zIndex: 56,
        background: "#fff", borderRadius: 14,
        boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
        border: "1px solid rgba(0,0,0,0.06)",
        padding: "6px 0", minWidth: 160, fontFamily: FONT,
        animation: "menuIn 0.15s ease-out",
      }}>
        {items.map((item, i) => (
          <button
            key={i}
            onClick={item.onClick}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 16px", border: "none", background: "none",
              cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151",
              fontFamily: FONT, WebkitTapHighlightColor: "transparent",
              transition: "background 0.12s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <item.icon size={16} color="#6b7280" strokeWidth={1.8} />
            {item.label}
          </button>
        ))}
        <style>{`@keyframes menuIn { from { opacity:0; transform: scale(0.95); } to { opacity:1; transform: scale(1); } }`}</style>
      </div>
    </>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────

function Breadcrumb({ onDashboardClick }: { onDashboardClick: () => void }) {
  return (
    <div style={{ fontSize: 14, color: "#9ca3af", padding: "14px 20px 0", fontWeight: 400 }}>
      <span
        onClick={onDashboardClick}
        style={{ color: "#6b7280", cursor: "pointer", transition: "color 0.15s" }}
        onMouseEnter={e => (e.currentTarget.style.color = "#2563eb")}
        onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
      >
        Dashboard
      </span>
      <span style={{ margin: "0 8px", color: "#d1d5db" }}>›</span>
      <span style={{ color: "#374151", fontWeight: 500 }}>Due Diligence</span>
    </div>
  );
}

function CompanyHeader({ onDownloadReport }: { onDownloadReport: () => void }) {
  return (
    <div style={{ ...cardBase, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Building icon avatar */}
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <TbBuilding size={30} color="#9ca3af" strokeWidth={1.5} />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111827", margin: 0, lineHeight: 1.25, letterSpacing: "-0.02em" }}>
            Crescent GreenTech SPV Ltd.
          </h2>
          <span style={{
            display: "inline-block", marginTop: 6,
            fontSize: 12, fontWeight: 600, color: "#16a34a",
            background: "#dcfce7", borderRadius: 6, padding: "3px 10px",
          }}>
            Verified
          </span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280" }}>
        <TbBuilding size={15} color="#9ca3af" strokeWidth={1.5} />
        <span>Industrial Sector</span>
        <span style={{ margin: "0 4px", color: "#d1d5db" }}>•</span>
        <span>Dubai, UAE</span>
      </div>
      <button
        onClick={onDownloadReport}
        style={{
        width: "100%", padding: "14px", borderRadius: 14,
        background: "#111827", color: "#fff",
        fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        fontFamily: FONT, WebkitTapHighlightColor: "transparent",
        transition: "opacity 0.15s",
      }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        <TbDownload size={17} strokeWidth={2} /> Full DD Report
      </button>
    </div>
  );
}

function MetricCards({ onMetricClick }: { onMetricClick: (tab: TabKey) => void }) {
  const metrics = [
    {
      icon: TbTrendingUp, iconBg: "#10b981", label: "Expected IRR",
      value: "19–23%", sub: "Above market average", subColor: "#16a34a",
      cardBg: "linear-gradient(145deg, #ffffff 30%, #f0fdf4 100%)",
      tab: "financials" as TabKey,
    },
    {
      icon: TbCalendar, iconBg: "#3b82f6", label: "Investment Tenure",
      value: "48 months", sub: "4 years Investment Period", subColor: "#2563eb",
      cardBg: "linear-gradient(145deg, #ffffff 30%, #eff6ff 100%)",
      tab: "summary" as TabKey,
    },
    {
      icon: TbAlertTriangle, iconBg: "#f97316", label: "Risk Raiting",
      value: "Medium-Low", sub: "Score: 3.2/10", subColor: "#f97316",
      cardBg: "linear-gradient(145deg, #ffffff 30%, #fff7ed 100%)",
      tab: "risk" as TabKey,
    },
    {
      icon: TbShieldCheck, iconBg: "#a855f7", label: "Shariah Status",
      value: "Compliant", sub: "AAOIFI certified", subColor: "#a855f7",
      cardBg: "linear-gradient(145deg, #ffffff 30%, #faf5ff 100%)",
      tab: "aaoifi" as TabKey,
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {metrics.map(m => (
        <div key={m.label}
          onClick={() => onMetricClick(m.tab)}
          style={{
          background: m.cardBg,
          borderRadius: 20, padding: "18px 14px 16px",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 2px 14px rgba(0,0,0,0.05)",
          cursor: "pointer",
          transition: "transform 0.18s, box-shadow 0.18s",
          WebkitTapHighlightColor: "transparent",
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 14px rgba(0,0,0,0.05)";
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: m.iconBg, display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 12, boxShadow: `0 4px 14px ${m.iconBg}50`,
          }}>
            <m.icon size={22} color="#fff" strokeWidth={2} />
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, marginBottom: 6 }}>{m.label}</div>
          <div style={{ fontSize: "clamp(16px,4vw,19px)", fontWeight: 600, color: "#111827", letterSpacing: "-0.02em", marginBottom: 4 }}>{m.value}</div>
          <div style={{ fontSize: 11, color: m.subColor, fontWeight: 500 }}>{m.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── TAB: Summary ─────────────────────────────────────────────────────────────

function SummaryTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Due Diligence Confidence */}
      <div style={cardBase}>
        <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 500, marginBottom: 6 }}>Due Diligence Confidence</div>
        <div style={{ fontSize: 36, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em", marginBottom: 12 }}>94%</div>
        <div style={{
          width: "100%", height: 8, borderRadius: 6,
          background: "#e5e7eb", overflow: "hidden", marginBottom: 10,
        }}>
          <div style={{
            width: "94%", height: "100%", borderRadius: 6,
            background: "linear-gradient(90deg,#3b82f6,#93c5fd)",
          }} />
        </div>
        <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 400 }}>
          Audit complete: PriceWaterhouseCoopers (PwC)
        </div>
      </div>

      {/* Investment Summary */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
          Investment Summary
        </h3>
        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 18px", lineHeight: 1.6 }}>
          A specialized vehicale focused on Phase IV of the Al Maktoum Solar Park.
          Leveraging bifacial PV technology with long-term PPA with DEWA.
        </p>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
          background: "#f9fafb", borderRadius: 16, padding: "16px 14px",
        }}>
          {[
            { icon: TbCurrencyDollar, color: "#6b7280", label: "Minimum Investment", value: "$50,000" },
            { icon: TbTarget, color: "#6b7280", label: "Total Raise", value: "$25M" },
            { icon: TbActivity, color: "#6b7280", label: "Current Progress", value: "68% Funded" },
            { icon: TbUsers, color: "#6b7280", label: "Investors", value: "142 Backers" },
          ].map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <m.icon size={18} color={m.color} strokeWidth={1.6} style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500, marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{m.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Highlights */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 18px", letterSpacing: "-0.02em" }}>
          Key Highlights
        </h3>
        {[
          { title: "Strong Fundamentals", desc: "Solid financial backing with established 5-year track record in renewable energy sector", type: "check" },
          { title: "Regulatory Compliance", desc: "Full compliance with UAE regulations and AAOIFI Shariah standards", type: "check" },
          { title: "Asset-Backed Security", desc: "Investments secured by tangible solar infrastructure assets valued at 150% of investment", type: "check" },
          { title: "Long-term Contracts", desc: "20-year power purchase agreements with government entities ensuring stable revenue", type: "check" },
          { title: "Monitored Risks", desc: "Market volatility and regulatory changes require ongoing monitoring", type: "warning" },
        ].map((h, i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < 4 ? 18 : 0 }}>
            <div style={{ flexShrink: 0, marginTop: 2 }}>
              {h.type === "check" ? (
                <TbCircleCheck size={22} color="#9ca3af" strokeWidth={1.5} />
              ) : (
                <TbAlertTriangle size={22} color="#d1d5db" strokeWidth={1.5} />
              )}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{h.title}</div>
              <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.55 }}>{h.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Fit Analysis */}
      <div style={cardBase}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <TbTarget size={22} color="#3b82f6" strokeWidth={2} />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.02em" }}>
            Portfolio Fit Analysis
          </h3>
        </div>
        {[
          { text: "Diversifies energy exposure", color: "#16a34a", icon: TbCircleCheck },
          { text: "Matches risk tolerance", color: "#16a34a", icon: TbCircleCheck },
          { text: "Increases GCC concentration to 42%", color: "#f59e0b", icon: TbAlertTriangle },
        ].map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <p.icon size={20} color={p.color} strokeWidth={2} />
            <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{p.text}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 8, paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Current Portfolio", value: "$2.4M" },
            { label: "Active Investments", value: "8 positions" },
            { label: "Available Capital", value: "$580K" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 400 }}>{r.label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TAB: Financials ──────────────────────────────────────────────────────────

function FinancialsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Investment Confidence */}
      <div style={cardBase}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Investment Confidence</div>
            <div style={{ fontSize: 13, color: "#9ca3af" }}>Due Diligence Score</div>
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>94%</span>
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "12px 0 0", lineHeight: 1.55 }}>
          Score based on audited financials, legal standing, and market competitive analysis.
        </p>
      </div>

      {/* Revenue & EBITDA Trend */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Revenue & EBITDA Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={REVENUE_DATA} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: FONT }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: FONT }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: FONT }} />
            <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="ebitda" name="EBITDA" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Income Statement */}
      <div style={cardBase}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Income Statement</h3>
            <div style={{
              width: 18, height: 18, borderRadius: "50%", background: "#e5e7eb",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>i</span>
            </div>
          </div>
        </div>
        {[
          {
            title: "Total Revenue", metric: "Metric",
            rows: [
              { label: "FY-1 (ACTUAL)", value: "$4.20M" },
              { label: "FY (PROJECTED)", value: "$6.85M" },
              { label: "YOY GROWTH", value: "+63.1%", color: "#16a34a" },
              { label: "TREND", icon: true },
            ],
          },
          {
            title: "EBITDA (Adjusted)", metric: "Metric",
            rows: [
              { label: "FY-1 (ACTUAL)", value: "$1.20M" },
              { label: "FY (PROJECTED)", value: "$2.44M" },
              { label: "YOY GROWTH", value: "+117.8%", color: "#16a34a" },
              { label: "TREND", icon: true },
            ],
          },
          {
            title: "Net Profit Margin", metric: "Metric",
            rows: [
              { label: "FY-1 (ACTUAL)", value: "18.4%" },
              { label: "FY (PROJECTED)", value: "22.1%" },
              { label: "YOY GROWTH", value: "+3.7bps%", color: "#16a34a" },
              { label: "TREND", icon: true },
            ],
          },
          {
            title: "Operating Cash Flow", metric: "Metric",
            rows: [
              { label: "FY-1 (ACTUAL)", value: "$0.88M" },
              { label: "FY (PROJECTED)", value: "$1.92M" },
              { label: "YOY GROWTH", value: "+118.1%", color: "#16a34a" },
              { label: "TREND", icon: true },
            ],
          },
        ].map((section, si) => (
          <div key={si} style={{
            borderBottom: si < 3 ? "1px solid #f1f5f9" : "none",
            paddingBottom: si < 3 ? 16 : 0, marginBottom: si < 3 ? 16 : 0,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{section.title}</div>
              <TbDots size={18} color="#9ca3af" style={{ cursor: "pointer" }} />
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>{section.metric}</div>
            {section.rows.map((row, ri) => (
              <div key={ri} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ri < section.rows.length - 1 ? 8 : 0 }}>
                <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>{row.label}</span>
                {"icon" in row && row.icon ? (
                  <TbTrendingUp size={20} color="#16a34a" strokeWidth={2} />
                ) : (
                  <span style={{ fontSize: 14, fontWeight: 600, color: row.color || "#111827" }}>{row.value}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Key Financial Ratios */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Key Financial Ratios</h3>
        {[
          { label: "Gross Margin", value: "45.3%", sub: "Industry avg: 42%" },
          { label: "EBITDA Margin", value: "28.7%", sub: "Industry avg: 25%" },
          { label: "Net Margin", value: "18.2%", sub: "Industry avg: 15%" },
          { label: "ROE", value: "24.6%", sub: "Strong returns" },
        ].map((r, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingBottom: 14, marginBottom: 14,
            borderBottom: i < 3 ? "1px solid #f5f5f5" : "none",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{r.label}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{r.sub}</div>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: Risk ────────────────────────────────────────────────────────────────

function RiskTab() {
  const [expandedRisk, setExpandedRisk] = useState<number | null>(0);

  const risks = [
    {
      icon: TbShieldCheck, iconBg: "#a855f7", title: "Regulatory Risk", severity: "Low", severityColor: "#16a34a",
      desc: "The investment structure complies with all UAE regulatory requirements and has obtained necessary approvals from relevant authorities. Regular compliance audits are conducted.",
      strategies: [
        "Ongoing regulatory monitoring and compliance updates",
        "Legal counsel retained for regulatory matters",
        "Annual third-party compliance verification",
      ],
    },
    {
      icon: TbCurrencyDollar, iconBg: "#f59e0b", title: "Financial Risk", severity: "Medium", severityColor: "#f59e0b",
      desc: "Moderate exposure to interest rate fluctuations, currency exchange risks, and...",
      strategies: [],
    },
    {
      icon: TbActivity, iconBg: "#ef4444", title: "Operational Risk", severity: "Low", severityColor: "#16a34a",
      desc: "Well-established operational procedures with experienced management team...",
      strategies: [],
    },
    {
      icon: TbTrendingUp, iconBg: "#f97316", title: "Market Risk", severity: "Medium", severityColor: "#f59e0b",
      desc: "Energy price volatility, evolving competitive landscape and potential...",
      strategies: [],
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Overall Risk Rating */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>Overall Risk Rating</h3>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "#16a34a" }}>B+</span>
          </div>
          <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>Low-Medium Risk</div>
        </div>
        {[
          { label: "Risk Score", value: "35/100" },
          { label: "Category", value: "Investment Grade" },
          { label: "Last Review", value: "Dec 2025" },
        ].map((r, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingBottom: 12, marginBottom: 12,
            borderBottom: i < 2 ? "1px solid #f5f5f5" : "none",
          }}>
            <span style={{ fontSize: 14, color: "#6b7280" }}>{r.label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* Investment Summary - Risk Items */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Investment Summary</h3>
        {risks.map((risk, i) => {
          const isExpanded = expandedRisk === i;
          return (
            <div key={i} style={{
              marginBottom: i < risks.length - 1 ? 12 : 0,
              borderBottom: i < risks.length - 1 ? "1px solid #f5f5f5" : "none",
              paddingBottom: i < risks.length - 1 ? 12 : 0,
            }}>
              <button
                onClick={() => setExpandedRisk(isExpanded ? null : i)}
                style={{
                  display: "flex", alignItems: "center", width: "100%", gap: 12,
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  fontFamily: FONT, WebkitTapHighlightColor: "transparent", textAlign: "left",
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: `${risk.iconBg}18`, display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <risk.icon size={20} color={risk.iconBg} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{risk.title}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: risk.severityColor,
                      background: `${risk.severityColor}15`, borderRadius: 10, padding: "2px 8px",
                    }}>
                      {risk.severity}
                    </span>
                  </div>
                </div>
                {isExpanded ? (
                  <TbChevronUp size={18} color="#9ca3af" />
                ) : (
                  <TbChevronDown size={18} color="#9ca3af" />
                )}
              </button>
              {isExpanded && (
                <div style={{ marginTop: 12, paddingLeft: 52 }}>
                  <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, margin: "0 0 14px" }}>{risk.desc}</p>
                  {risk.strategies.length > 0 && (
                    <>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", marginBottom: 8 }}>Key Mitigation Strategies:</div>
                      {risk.strategies.map((s, si) => (
                        <div key={si} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                          <TbCircleCheck size={16} color="#16a34a" strokeWidth={2} style={{ marginTop: 2, flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{s}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Monitoring */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Active Monitoring</h3>
        {[
          { icon: TbWorld, label: "Regulatory Watch", sub: "UAE energy policy updates" },
          { icon: TbBell, label: "Market Alerts", sub: "Energy price tracking" },
          { icon: TbClock, label: "Quarterly Review", sub: "Next: Mar 2026" },
        ].map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < 2 ? 14 : 0 }}>
            <m.icon size={20} color="#374151" strokeWidth={1.8} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{m.label}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>{m.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Trend */}
      <div style={cardBase}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <TbTrendingUp size={20} color="#ef4444" strokeWidth={2} />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>Risk Trend</h3>
        </div>
        {[
          { text: "Risk profile improving over 12 months", color: "#16a34a" },
          { text: "No critical risk alerts", color: "#16a34a" },
          { text: "All mitigation plans active", color: "#16a34a" },
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <TbCircleCheck size={18} color={t.color} strokeWidth={2} />
            <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: Legal ───────────────────────────────────────────────────────────────

function LegalTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Entity Information */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 18px" }}>Entity Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { label: "Legal Entity", value: "Crescent GreenTech SPV Ltd." },
            { label: "Registration No.", value: "CL-4582-2020" },
            { label: "Jurisdiction", value: "DIFC, Dubai" },
            { label: "Registration Date", value: "March 15, 2020" },
          ].map((f, i) => (
            <div key={i}>
              <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, marginBottom: 4 }}>{f.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Verification */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 18px" }}>Compliance Verification</h3>
        {[
          { title: "Entity registration verified", sub: "Verified with DIFC Registrar" },
          { title: "No material litigation", sub: "No pending legal disputes" },
          { title: "UBO & sanctions screening cleared", sub: "All beneficial owners identified and screened" },
          { title: "Operating licenses current", sub: "All required licenses valid" },
          { title: "Good standing certificate obtained", sub: "Current as of December 2025" },
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 4 ? 18 : 0 }}>
            <TbCircleCheck size={22} color="#16a34a" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>{c.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: Governance ──────────────────────────────────────────────────────────

function GovernanceTab() {
  const team = [
    { initials: "AK", color: "#16a34a", name: "Ahmed Al-Kuwari", role: "Chief Executive Officer", exp: "15 years experience" },
    { initials: "SH", color: "#3b82f6", name: "Sarah Hassan", role: "Chief Financial Officer", exp: "12 years experience" },
    { initials: "MR", color: "#ef4444", name: "Mohammed Rashid", role: "Chief Operating Officer", exp: "10 years experience" },
    { initials: "LM", color: "#a855f7", name: "Layla Mahmoud", role: "Head of Legal & Compliance", exp: "8 years experience" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Overall Risk Rating */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>Overall Risk Rating</h3>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
          }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "#16a34a" }}>B+</span>
          </div>
          <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>Low-Medium Risk</div>
        </div>
        {[
          { label: "Risk Score", value: "35/100" },
          { label: "Category", value: "Investment Grade" },
          { label: "Last Review", value: "Dec 2025" },
        ].map((r, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between",
            paddingBottom: 12, marginBottom: 12,
            borderBottom: i < 2 ? "1px solid #f5f5f5" : "none",
          }}>
            <span style={{ fontSize: 14, color: "#6b7280" }}>{r.label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* Management Team */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 18px" }}>Management Team</h3>
        {team.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: i < team.length - 1 ? 18 : 0 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.initials}</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{m.name}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>{m.role}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>{m.exp}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Board Composition */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 18px" }}>Board Composition</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { label: "Total Directors", value: "7 Members" },
            { label: "Independent Directors", value: "5 (71%)" },
            { label: "Executive Directors", value: "2 (29%)" },
            { label: "Board Chair", value: "Independent" },
          ].map((b, i) => (
            <div key={i}>
              <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, marginBottom: 4 }}>{b.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{b.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Governance Practices */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 18px" }}>Governance Practices</h3>
        {[
          { title: "Board meetings held quarterly", sub: "4 meetings conducted in 2025" },
          { title: "Audit committee established", sub: "Independent oversight of financial reporting" },
          { title: "Code of conduct implemented", sub: "All employees trained annually" },
          { title: "Conflict of interest policy active", sub: "Regular disclosures maintained" },
        ].map((g, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 18 : 0 }}>
            <TbCircleCheck size={22} color="#16a34a" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{g.title}</div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>{g.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: Documents ───────────────────────────────────────────────────────────

function DocumentsTab({ showToast, onPreviewDoc, onContextMenu }: {
  showToast: (msg: string) => void;
  onPreviewDoc: (doc: DDDoc) => void;
  onContextMenu: (doc: DDDoc, rect: { top: number; right: number }) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const docs = [
    { name: "Due Diligence Report(Cresent GreenTech SPV Ltd.)", category: "Due Diligence", size: "2.4 MB", date: "Nov 5, 1015" },
    { name: "Financial Model - 10 Year Projection", category: "Due Diligence", size: "2.4 MB", date: "Nov 5, 1015" },
    { name: "Risk Memorandum & Sensitivity Analysis", category: "Due Diligence", size: "2.4 MB", date: "Nov 5, 1015" },
    { name: "Shariah Opinion (Independent Scholar Review)", category: "Due Diligence", size: "2.4 MB", date: "Nov 5, 1015" },
    { name: "Legal Structure Documentation", category: "Due Diligence", size: "2.4 MB", date: "Nov 5, 1015" },
    { name: "Board Meeting Minutes Q4 2025", category: "Due Diligence", size: "2.4 MB", date: "Nov 5, 1015" },
  ];

  const filtered = docs.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={cardBase}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>Investor Reports & Documents</h3>
          <span style={{
            fontSize: 12, fontWeight: 500, color: "#6b7280",
            border: "1px solid #e5e7eb", borderRadius: 20, padding: "4px 10px",
          }}>
            {docs.length} documents
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 16px" }}>Quickly access your latest uploaded documents and reports.</p>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: 14,
          marginBottom: 18,
        }}>
          <TbSearch size={18} color="#9ca3af" strokeWidth={1.8} style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              border: "none", outline: "none", flex: 1,
              fontSize: 14, color: "#111827", fontFamily: FONT,
              background: "transparent",
            }}
          />
        </div>

        {/* Document list */}
        {filtered.map((doc, i) => (
          <div key={i}
            onClick={() => onPreviewDoc(doc)}
            style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 0",
            borderBottom: i < filtered.length - 1 ? "1px solid #f5f5f5" : "none",
            cursor: "pointer",
            transition: "background 0.12s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <TbFileText size={22} color="#3b82f6" strokeWidth={1.6} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 4, lineHeight: 1.35 }}>{doc.name}</div>
              <div style={{ fontSize: 11, color: "#9ca3af", display: "flex", gap: 10 }}>
                <span>{doc.category}</span>
                <span>{doc.size}</span>
                <span>{doc.date}</span>
              </div>
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                onContextMenu(doc, { top: rect.bottom, right: rect.right });
              }}
              style={{ background: "none", border: "none", padding: 4, cursor: "pointer", flexShrink: 0, WebkitTapHighlightColor: "transparent" }}
            >
              <TbDots size={18} color="#9ca3af" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB: AAOIFI & Shariah ────────────────────────────────────────────────────

function AaoifiTab({ onDownloadShariah, onProceedInvest }: {
  onDownloadShariah: () => void;
  onProceedInvest: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* AAOIFI & Shariah Compliance */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>AAOIFI & Shariah Compliance</h3>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
          Crescent GreenTech SPV Ltd. has been reviewed in accordance with AAOIFI Shariah and accounting standards.
        </p>
      </div>

      {/* Business Activity Screening */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Business Activity Screening</h3>
        {[
          "Core business is halal",
          "No riba-based lending",
          "No prohibited activities",
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <TbCircleCheck size={20} color="#16a34a" strokeWidth={2} />
            <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{t}</span>
          </div>
        ))}
      </div>

      {/* Financial Ratio Screening */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Financial Ratio Screening</h3>
        {[
          { label: "Interest bearing debt:", value: "1.8% (≤ 30%)" },
          { label: "Interest income:", value: "1.2% (≤ 5%)" },
          { label: "Non-compliant income:", value: "0.8% (≤ 5%)" },
        ].map((r, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between",
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 14, color: "#374151" }}>{r.label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* Structure Validation */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>Structure Validation</h3>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
          Wakalah + Ijarah hybrid structure with asset ownership linked to investors and profit based on actual performance.
        </p>
      </div>

      {/* Purification Mechanism */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>Purification Mechanism</h3>
        <p style={{ fontSize: 14, color: "#374151", margin: "0 0 4px" }}>0.8% income subject to purification</p>
        <p style={{ fontSize: 14, color: "#374151", margin: 0 }}>Auto-purification enabled</p>
      </div>

      {/* Shariah Governance */}
      <div style={cardBase}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Shariah Governance</h3>
        {[
          "Independent Shariah Scholar Appointed",
          "Quarterly Shariah Reviews",
          "Annual External Shariah Audit",
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <TbCircleCheck size={20} color="#16a34a" strokeWidth={2} />
            <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{t}</span>
          </div>
        ))}

        {/* Download + Proceed */}
        <button
          onClick={onDownloadShariah}
          style={{
          width: "100%", padding: "14px", borderRadius: 14,
          background: "#fff", color: "#374151",
          fontSize: 14, fontWeight: 600, border: "1px solid #e5e7eb", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          fontFamily: FONT, marginTop: 8, WebkitTapHighlightColor: "transparent",
          transition: "background 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
          onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
        >
          <TbDownload size={17} strokeWidth={2} /> Download Shariah Opinion
        </button>
        <button
          onClick={onProceedInvest}
          style={{
          width: "100%", padding: "14px", borderRadius: 14,
          background: "#16a34a", color: "#fff",
          fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
          fontFamily: FONT, marginTop: 10, WebkitTapHighlightColor: "transparent",
          transition: "opacity 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Proceed to Invest
        </button>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function DueDiligenceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>("summary");
  const tabBarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ── Toast state ──
  const [toast, setToast] = useState<string | null>(null);
  const showToast = useCallback((msg: string) => setToast(msg), []);

  // ── Modals ──
  const [investModalOpen, setInvestModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DDDoc | null>(null);
  const [contextMenu, setContextMenu] = useState<{ doc: DDDoc; rect: { top: number; right: number } } | null>(null);

  // ── Handlers ──
  const handleDashboardClick = useCallback(() => router.push("/investors"), [router]);

  const handleDownloadReport = useCallback(() => {
    showToast("Downloading Full DD Report...");
  }, [showToast]);

  const handleMetricClick = useCallback((tab: TabKey) => {
    setActiveTab(tab);
  }, []);

  const handleDownloadShariah = useCallback(() => {
    showToast("Downloading Shariah Opinion...");
  }, [showToast]);

  const handleProceedInvest = useCallback(() => {
    setInvestModalOpen(true);
  }, []);

  const handleConfirmInvest = useCallback(() => {
    setInvestModalOpen(false);
    showToast("Investment request submitted successfully!");
  }, [showToast]);

  const handlePreviewDoc = useCallback((doc: DDDoc) => {
    setPreviewDoc(doc);
  }, []);

  const handleDocContextMenu = useCallback((doc: DDDoc, rect: { top: number; right: number }) => {
    setContextMenu({ doc, rect });
  }, []);

  const handleDocDownload = useCallback((doc: DDDoc) => {
    setPreviewDoc(null);
    setContextMenu(null);
    showToast(`Downloaded ${doc.name}`);
  }, [showToast]);

  const handleDocShare = useCallback((doc: DDDoc) => {
    setContextMenu(null);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(doc.name);
    }
    showToast("Document info copied to clipboard");
  }, [showToast]);

  const tabContent: Record<TabKey, React.ReactNode> = {
    summary: <SummaryTab />,
    financials: <FinancialsTab />,
    risk: <RiskTab />,
    legal: <LegalTab />,
    governance: <GovernanceTab />,
    documents: <DocumentsTab showToast={showToast} onPreviewDoc={handlePreviewDoc} onContextMenu={handleDocContextMenu} />,
    aaoifi: <AaoifiTab onDownloadShariah={handleDownloadShariah} onProceedInvest={handleProceedInvest} />,
  };

  return (
    <PageShell title="Due Diligence" defaultActive="due-diligence">
      <div style={{ padding: "0 0 40px", display: "flex", flexDirection: "column", gap: 0 }}>

        {/* Breadcrumb */}
        <Breadcrumb onDashboardClick={handleDashboardClick} />

        {/* Company Header + Metrics */}
        <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 14 }}>
          <CompanyHeader onDownloadReport={handleDownloadReport} />
          <MetricCards onMetricClick={handleMetricClick} />
        </div>

        {/* Tab Bar */}
        <div
          ref={tabBarRef}
          className="hide-scrollbar"
          style={{
            display: "flex", gap: 6, padding: "18px 16px 4px",
            overflowX: "auto", WebkitOverflowScrolling: "touch",
          }}
        >
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "10px 18px", borderRadius: 24,
                  border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 600,
                  fontFamily: FONT,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  background: isActive ? "#2563eb" : "#f3f4f6",
                  color: isActive ? "#fff" : "#6b7280",
                  transition: "all 0.18s",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <tab.Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{ padding: "14px 16px 0" }}>
          {tabContent[activeTab]}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "32px 16px 0", fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>
          All documents are encrypted and stored securely. Your data privacy is our top priority.
        </div>
      </div>

      {/* ── Invest Modal ── */}
      {investModalOpen && (
        <InvestModal onClose={() => setInvestModalOpen(false)} onConfirm={handleConfirmInvest} />
      )}

      {/* ── Document Preview Modal ── */}
      {previewDoc && (
        <DocPreviewModal
          doc={previewDoc}
          onClose={() => setPreviewDoc(null)}
          onDownload={() => handleDocDownload(previewDoc)}
        />
      )}

      {/* ── Document Context Menu ── */}
      {contextMenu && (
        <DocContextMenu
          doc={contextMenu.doc}
          anchorRect={contextMenu.rect}
          onView={() => { setContextMenu(null); setPreviewDoc(contextMenu.doc); }}
          onDownload={() => handleDocDownload(contextMenu.doc)}
          onShare={() => handleDocShare(contextMenu.doc)}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </PageShell>
  );
}
