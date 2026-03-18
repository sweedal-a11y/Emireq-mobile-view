"use client";

import { useState, useMemo } from "react";
import {
  TbCurrencyDollar, TbTrendingUp, TbTargetArrow, TbBuildingBank,
  TbEye, TbSearch, TbChevronLeft, TbChevronRight,
  TbDownload, TbUpload, TbSelector,
} from "react-icons/tb";
import { FONT, InfoIcon, PageShell, cardBase } from "./shared";

// ─── Stat Cards Data ──────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    Icon: TbCurrencyDollar,
    iconBg: "#3B82F6",
    label: "Total Invested",
    value: "$1,085,000",
    badge: "Total",
    badgeBg: "#EEF2FF",
    badgeColor: "#6366F1",
    blobColor: "rgba(191,204,255,0.35)",
    cardBg: "linear-gradient(145deg, #ffffff 40%, #f0f4ff 100%)",
  },
  {
    Icon: TbTrendingUp,
    iconBg: "#10B981",
    label: "Current Value",
    value: "$1,360,000",
    badge: "Current",
    badgeBg: "#D1FAE5",
    badgeColor: "#059669",
    blobColor: "rgba(167,243,208,0.35)",
    cardBg: "linear-gradient(145deg, #ffffff 40%, #ecfdf5 100%)",
  },
  {
    Icon: TbTargetArrow,
    iconBg: "#7C3AED",
    label: "Total ROI",
    value: "26.5%",
    badge: "ROI",
    badgeBg: "#FEF3C7",
    badgeColor: "#D97706",
    blobColor: "rgba(216,180,254,0.30)",
    cardBg: "linear-gradient(145deg, #ffffff 40%, #faf5ff 100%)",
  },
  {
    Icon: TbBuildingBank,
    iconBg: "#F97316",
    label: "Active Investments",
    value: "6",
    badge: "Active",
    badgeBg: "#D1FAE5",
    badgeColor: "#059669",
    blobColor: "rgba(253,186,116,0.30)",
    cardBg: "linear-gradient(145deg, #ffffff 40%, #fff7ed 100%)",
  },
] as const;

// ─── Investments Data ─────────────────────────────────────────────────────────

interface Investment {
  initials: string;
  name: string;
  sector: string;
  region: string;
  invested: string;
  currentValue: string;
  roi: string;
  roiPositive: boolean;
  status: string;
  statusColor: string;
  statusBg: string;
  stage: string;
}

const ALL_INVESTMENTS: Investment[] = [
  {
    initials: "DR", name: "Synesthia", sector: "HealthTech", region: "USA",
    invested: "$125,000", currentValue: "$148,000", roi: "+40%", roiPositive: true,
    status: "Growth", statusColor: "#16A34A", statusBg: "#DCFCE7", stage: "Growth",
  },
  {
    initials: "DR", name: "EnerTech Labs", sector: "Clean Energy", region: "Europe",
    invested: "$125,000", currentValue: "$148,000", roi: "-10%", roiPositive: false,
    status: "Series A", statusColor: "#2563EB", statusBg: "#DBEAFE", stage: "Series A",
  },
  {
    initials: "DR", name: "Emireq Metaverse", sector: "VR/AR", region: "UAE",
    invested: "$125,000", currentValue: "$148,000", roi: "+40%", roiPositive: true,
    status: "Seed", statusColor: "#16A34A", statusBg: "#DCFCE7", stage: "Seed",
  },
  {
    initials: "DR", name: "Voxel Capital", sector: "FinTech", region: "Asia",
    invested: "$125,000", currentValue: "$148,000", roi: "+40%", roiPositive: true,
    status: "Series B", statusColor: "#16A34A", statusBg: "#DCFCE7", stage: "Series B",
  },
  {
    initials: "DR", name: "NovaBio", sector: "HealthTech", region: "Europe",
    invested: "$100,000", currentValue: "$118,000", roi: "+18%", roiPositive: true,
    status: "Growth", statusColor: "#16A34A", statusBg: "#DCFCE7", stage: "Growth",
  },
  {
    initials: "DR", name: "SolarGrid AI", sector: "Clean Energy", region: "USA",
    invested: "$150,000", currentValue: "$172,000", roi: "+14.7%", roiPositive: true,
    status: "Series A", statusColor: "#2563EB", statusBg: "#DBEAFE", stage: "Series A",
  },
  {
    initials: "DR", name: "QuantEdge", sector: "FinTech", region: "Asia",
    invested: "$110,000", currentValue: "$130,000", roi: "+18.2%", roiPositive: true,
    status: "Seed", statusColor: "#16A34A", statusBg: "#DCFCE7", stage: "Seed",
  },
  {
    initials: "DR", name: "MedLink Pro", sector: "HealthTech", region: "UAE",
    invested: "$125,000", currentValue: "$152,000", roi: "+21.6%", roiPositive: true,
    status: "Series B", statusColor: "#16A34A", statusBg: "#DCFCE7", stage: "Series B",
  },
];

const SECTORS = ["All Sectors", "HealthTech", "Clean Energy", "VR/AR", "FinTech"];
const REGIONS = ["All Regions", "USA", "Europe", "UAE", "Asia"];
const STAGES = ["Stage", "Seed", "Series A", "Series B", "Growth"];

const ITEMS_PER_PAGE = 3;

// ─── FilterDropdown ───────────────────────────────────────────────────────────

function FilterDropdown({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "9px 14px",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background: "#fff",
          fontSize: 13,
          fontWeight: 500,
          color: "#374151",
          cursor: "pointer",
          fontFamily: FONT,
          whiteSpace: "nowrap",
          WebkitTapHighlightColor: "transparent",
          transition: "border-color 0.15s",
        }}
      >
        {value}
        <TbSelector size={15} color="#9ca3af" strokeWidth={1.8} />
      </button>
      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 60 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              minWidth: 160,
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              zIndex: 70,
              padding: "6px",
              fontFamily: FONT,
            }}
          >
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: value === opt ? "#f3f4f6" : "transparent",
                  fontSize: 13,
                  fontWeight: value === opt ? 600 : 400,
                  color: "#374151",
                  cursor: "pointer",
                  fontFamily: FONT,
                  WebkitTapHighlightColor: "transparent",
                  transition: "background 0.12s",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function PortfolioContent() {
  const [sector, setSector] = useState("All Sectors");
  const [region, setRegion] = useState("All Regions");
  const [stage, setStage] = useState("Stage");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return ALL_INVESTMENTS.filter(inv => {
      if (sector !== "All Sectors" && inv.sector !== sector) return false;
      if (region !== "All Regions" && inv.region !== region) return false;
      if (stage !== "Stage" && inv.stage !== stage) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !inv.name.toLowerCase().includes(q) &&
          !inv.sector.toLowerCase().includes(q) &&
          !inv.region.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [sector, region, stage, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleFilterChange = (setter: (v: string) => void) => (val: string) => {
    setter(val);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Sector", "Region", "Invested", "Current Value", "ROI", "Status"];
    const rows = filtered.map(inv => [inv.name, inv.sector, inv.region, inv.invested, inv.currentValue, inv.roi, inv.status]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio_investments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <PageShell title="Dashboard" defaultActive="portfolio">
      <div style={{ padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* ── Page Heading ── */}
        <div style={{ padding: "0 2px" }}>
          <h1 style={{
            fontSize: "clamp(26px,7vw,32px)", fontWeight: 600, color: "#0f172a",
            margin: "0 0 8px", letterSpacing: "-0.01em", lineHeight: 1.15,
          }}>
            Dashboard Overview
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
            Here&apos;s what&apos;s happening with your investments today
          </p>
        </div>

        {/* ── Stat Cards 2×2 ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {STAT_CARDS.map(card => (
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
                position: "relative",
                overflow: "hidden",
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
              {/* Decorative blob */}
              <div style={{
                position: "absolute",
                bottom: -20, right: -20,
                width: 100, height: 100,
                borderRadius: "50%",
                background: card.blobColor,
                pointerEvents: "none",
              }} />

              {/* Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: card.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginBottom: 14,
                boxShadow: `0 4px 14px ${card.iconBg}50`,
              }}>
                <card.Icon size={24} color="#fff" strokeWidth={2} />
              </div>

              {/* Label */}
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6, fontWeight: 500, position: "relative", zIndex: 1 }}>
                {card.label}
              </div>

              {/* Value */}
              <div style={{
                fontSize: "clamp(18px,4.5vw,22px)", fontWeight: 600, color: "#111827",
                letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 10,
                position: "relative", zIndex: 1,
              }}>
                {card.value}
              </div>

              {/* Badge */}
              <span style={{
                display: "inline-block",
                fontSize: 11, fontWeight: 600,
                color: card.badgeColor,
                background: card.badgeBg,
                borderRadius: 16, padding: "4px 10px",
                position: "relative", zIndex: 1,
              }}>
                {card.badge}
              </span>
            </div>
          ))}
        </div>

        {/* ── Active Investments Section ── */}
        <div style={cardBase}>
          {/* Title Row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>Active Investments</span>
              <InfoIcon size={17} />
            </div>
            <button
              style={{
                fontSize: 14, fontWeight: 600, color: "#2563eb",
                background: "none", border: "none", cursor: "pointer",
                WebkitTapHighlightColor: "transparent", fontFamily: FONT,
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              View all
            </button>
          </div>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px", fontWeight: 400 }}>
            Your current investment portfolio
          </p>

          {/* Filters Row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <FilterDropdown options={SECTORS} value={sector} onChange={handleFilterChange(setSector)} />
            <FilterDropdown options={REGIONS} value={region} onChange={handleFilterChange(setRegion)} />
            <FilterDropdown options={STAGES} value={stage} onChange={handleFilterChange(setStage)} />
          </div>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "11px 14px",
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            background: "#fff",
            marginBottom: 18,
          }}>
            <TbSearch size={18} color="#9ca3af" strokeWidth={1.8} style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              style={{
                border: "none", outline: "none",
                fontSize: 14, color: "#374151",
                fontFamily: FONT, fontWeight: 400,
                width: "100%", background: "transparent",
              }}
            />
          </div>

          {/* Investment Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {paginated.map((inv, i) => (
              <div
                key={`${inv.name}-${i}`}
                style={{
                  borderRadius: 18,
                  border: "1px solid #f1f5f9",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "box-shadow 0.18s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.09)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)")}
              >
                {/* Card Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 16px 14px" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 16,
                    background: "#3B82F6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "0.03em" }}>
                      {inv.initials}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", letterSpacing: "-0.01em" }}>
                      {inv.name}
                    </div>
                    <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 3, fontWeight: 400 }}>
                      {inv.sector} · {inv.region}
                    </div>
                  </div>
                  <TbEye size={20} color="#9ca3af" strokeWidth={1.6} style={{ flexShrink: 0, cursor: "pointer" }} />
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "#f1f5f9", margin: "0 16px" }} />

                {/* Card Details */}
                <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* Row: Invested */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 400 }}>Invested</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{inv.invested}</span>
                  </div>
                  {/* Row: Current Value */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 400 }}>Current Value</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{inv.currentValue}</span>
                  </div>
                  {/* Row: ROI */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 400 }}>ROI</span>
                    <span style={{
                      fontSize: 14, fontWeight: 600,
                      color: inv.roiPositive ? "#16A34A" : "#DC2626",
                      display: "inline-flex", alignItems: "center", gap: 4,
                    }}>
                      <TbTrendingUp
                        size={14} strokeWidth={2.2}
                        style={inv.roiPositive ? {} : { transform: "rotate(180deg)" }}
                      />
                      {inv.roi}
                    </span>
                  </div>
                  {/* Row: Status */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 400 }}>Status</span>
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: inv.statusColor,
                      background: inv.statusBg,
                      borderRadius: 16, padding: "4px 12px",
                    }}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {paginated.length === 0 && (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af", fontSize: 14 }}>
                No investments found matching your filters.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, marginTop: 24,
          }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              style={{
                width: 40, height: 40, borderRadius: 10,
                border: "none", background: "#f3f4f6",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: safePage <= 1 ? "default" : "pointer",
                opacity: safePage <= 1 ? 0.4 : 1,
                transition: "background 0.15s",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <TbChevronLeft size={18} color="#374151" strokeWidth={2} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  border: "none",
                  background: safePage === p ? "#0f172a" : "#f3f4f6",
                  color: safePage === p ? "#fff" : "#374151",
                  fontSize: 14, fontWeight: 600,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                  WebkitTapHighlightColor: "transparent",
                  fontFamily: FONT,
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              style={{
                width: 40, height: 40, borderRadius: 10,
                border: "none", background: "#f3f4f6",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: safePage >= totalPages ? "default" : "pointer",
                opacity: safePage >= totalPages ? 0.4 : 1,
                transition: "background 0.15s",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <TbChevronRight size={18} color="#374151" strokeWidth={2} />
            </button>
          </div>

          {/* Export Buttons */}
          <div style={{
            display: "flex", gap: 12, marginTop: 24,
            justifyContent: "center",
          }}>
            <button
              onClick={handleExportCSV}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 24px",
                borderRadius: 14,
                border: "1px solid #e5e7eb",
                background: "#fff",
                fontSize: 14, fontWeight: 600,
                color: "#374151",
                cursor: "pointer",
                fontFamily: FONT,
                WebkitTapHighlightColor: "transparent",
                transition: "background 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#f9fafb";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <TbDownload size={18} strokeWidth={2} />
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 24px",
                borderRadius: 14,
                border: "none",
                background: "#0f172a",
                fontSize: 14, fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
                fontFamily: FONT,
                WebkitTapHighlightColor: "transparent",
                transition: "background 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#1e293b";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.18)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#0f172a";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <TbUpload size={18} strokeWidth={2} />
              Export pdf
            </button>
          </div>

          {/* Footer Note */}
          <p style={{
            fontSize: 12, color: "#9ca3af", textAlign: "center",
            margin: "20px 0 0", lineHeight: 1.55, fontWeight: 400,
          }}>
            Market data is updated in real-time. Prices are for reference only and may vary across exchanges.
          </p>
        </div>

      </div>
    </PageShell>
  );
}
