"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TbPencil, TbDeviceFloppy, TbCheck, TbAlertCircle,
  TbCalendarEvent, TbClock, TbInfoCircle, TbPlus, TbX,
  TbChevronRight, TbBuilding, TbCircleCheck, TbShieldCheck,
} from "react-icons/tb";
import { FONT, PageShell } from "./shared";

const TABS = ["Overview", "Investor Profile", "Financials", "Interests"] as const;
type Tab = (typeof TABS)[number];

const ALL_STAGES = ["Seed", "MVP", "Series A", "Series B", "Growth"];

const AVAILABLE_SECTORS = [
  "Technology", "Healthcare", "Real Estate", "Finance", "Energy",
  "Education", "Agriculture", "Manufacturing", "Retail", "Logistics",
];

const AVAILABLE_COINS = [
  "Aurioux", "EmirCoin", "HalalToken", "SukukChain", "ZakatFi",
  "WaqfDAO", "IjaraX", "TakafulBit",
];

// ─── Shared Styles ────────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 20,
  padding: "20px 18px",
  border: "1px solid rgba(0,0,0,0.07)",
  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: "#9ca3af",
  marginBottom: 4,
};

const valueStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 500,
  color: "#111827",
  lineHeight: 1.5,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  fontSize: 15,
  fontFamily: FONT,
  color: "#111827",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
};

// ─── Field (edit/view) ────────────────────────────────────────────────────────

function Field({ label, value, editing, onChange, linkStyle }: {
  label: string; value: string; editing: boolean;
  onChange?: (v: string) => void; linkStyle?: boolean;
}) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      {editing && onChange ? (
        <input style={inputStyle} value={value} onChange={e => onChange(e.target.value)} />
      ) : (
        <div style={{ ...valueStyle, ...(linkStyle ? { color: "#2563eb", cursor: "pointer" } : {}) }}>{value}</div>
      )}
    </div>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{children}</div>;
}

// ─── Section Header ──────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, editing, onToggle }: {
  title: string; subtitle: string; editing: boolean; onToggle: () => void;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>{title}</span>
        <button
          onClick={onToggle}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: editing ? "8px 16px" : "8px 14px",
            borderRadius: 10,
            border: editing ? "none" : "1px solid #e5e7eb",
            background: editing ? "#2563eb" : "#fff",
            color: editing ? "#fff" : "#374151",
            fontSize: 14, fontWeight: 500,
            cursor: "pointer",
            fontFamily: FONT,
            transition: "all 0.15s",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {editing ? <TbDeviceFloppy size={16} /> : <TbPencil size={16} />}
          {editing ? "Save" : "Edit"}
        </button>
      </div>
      <p style={{ fontSize: 13, color: "#64748b", margin: "5px 0 0", fontWeight: 400 }}>{subtitle}</p>
    </div>
  );
}

// ─── Quick Stats ──────────────────────────────────────────────────────────────

function QuickStats() {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      padding: "20px 18px",
      border: "1px solid rgba(0,0,0,0.07)",
      borderLeft: "3px solid #e2e8f0",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", margin: "0 0 16px", letterSpacing: "-0.02em" }}>Quick Stats</h2>

      <div style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500, marginBottom: 4 }}>Available Balance</div>
        <div style={{ fontSize: 32, fontWeight: 600, color: "#22c55e", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 4 }}>$4.1M</div>
        <div style={{ fontSize: 13, color: "#9ca3af" }}>of $6M total</div>
      </div>

      <div style={{ height: 1, background: "#f1f5f9", margin: "16px 0" }} />

      <div style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500, marginBottom: 4 }}>Available Balance</div>
        <div style={{ fontSize: 32, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.2 }}>0</div>
      </div>

      <div style={{ height: 1, background: "#f1f5f9", margin: "16px 0" }} />

      <div>
        <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500, marginBottom: 8 }}>Profile Status</div>
        <span style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: "#22c55e", color: "#fff", fontSize: 13, fontWeight: 600 }}>Approved</span>
      </div>
    </div>
  );
}

// ─── Account Timeline ─────────────────────────────────────────────────────────

function AccountTimeline() {
  const items = [
    { Icon: TbCircleCheck, iconColor: "#22c55e", iconBg: "#dcfce7", label: "Approved", date: "October 26, 2025" },
    { Icon: TbCalendarEvent, iconColor: "#3b82f6", iconBg: "#dbeafe", label: "Registered", date: "October 26, 2025" },
    { Icon: TbClock, iconColor: "#8b5cf6", iconBg: "#ede9fe", label: "Last Updated", date: "October 26, 2025" },
  ];

  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      padding: "20px 18px",
      border: "1px solid rgba(0,0,0,0.07)",
      borderLeft: "3px solid #e2e8f0",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", margin: "0 0 20px", letterSpacing: "-0.02em" }}>Account Timeline</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((item, i) => (
          <div key={item.label} style={{ display: "flex", gap: 14, position: "relative" }}>
            {/* Vertical connector line */}
            {i < items.length - 1 && (
              <div style={{
                position: "absolute", left: 20, top: 40, width: 2,
                height: "calc(100% - 16px)", background: "#e5e7eb",
              }} />
            )}
            {/* Icon */}
            <div style={{
              flexShrink: 0, position: "relative", zIndex: 1,
              width: 40, height: 40, borderRadius: "50%",
              background: item.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <item.Icon size={20} color={item.iconColor} strokeWidth={2} />
            </div>
            {/* Content */}
            <div style={{ paddingBottom: i < items.length - 1 ? 24 : 0, paddingTop: 2 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#9ca3af", marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 15, color: "#0f172a", fontWeight: 600 }}>{item.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Next Steps ───────────────────────────────────────────────────────────────

function NextSteps() {
  const steps = [
    { Icon: TbInfoCircle, iconColor: "#3b82f6", iconBg: "#dbeafe", bg: "#f0f4fa", title: "Complete KYC verification", sub: "Upload required documents" },
    { Icon: TbAlertCircle, iconColor: "#8b5cf6", iconBg: "#ede9fe", bg: "#f5f0fa", title: "Add sector preferences", sub: "Help us match you with startups" },
  ];

  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      padding: "20px 18px",
      border: "1px solid rgba(0,0,0,0.07)",
      borderLeft: "3px solid #e2e8f0",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", margin: "0 0 16px", letterSpacing: "-0.02em" }}>Next Steps</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {steps.map(step => (
          <div
            key={step.title}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "16px", background: step.bg, borderRadius: 16,
              cursor: "pointer", transition: "opacity 0.15s",
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: step.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <step.Icon size={20} color={step.iconColor} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 2 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 400 }}>{step.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function ProfileContent() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const router = useRouter();

  // Edit toggles
  const [editPersonal, setEditPersonal] = useState(false);
  const [editLocation, setEditLocation] = useState(false);
  const [editInvestor, setEditInvestor] = useState(false);
  const [editFinancial, setEditFinancial] = useState(false);

  // Personal info state
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Aurum Strategies",
    username: "investor_aurum",
    email: "invest@aurumstrategies.uk",
    mobile: "+442071230123",
    country: "UK",
    city: "London",
  });

  // Location state
  const [locationInfo, setLocationInfo] = useState({
    address: "N/A",
    linkedin: "N/A",
    twitter: "N/A",
  });

  // Investor profile state
  const [investorType, setInvestorType] = useState("Angel Investor / Venture Capital");
  const [organization, setOrganization] = useState("Individual");
  const [investmentGoal, setInvestmentGoal] = useState("Create a balanced halal portfolio");
  const [selectedStages, setSelectedStages] = useState<string[]>(["Seed", "MVP"]);

  // Financial state
  const [totalFunds, setTotalFunds] = useState("$6,000,000");
  const [totalInvested, setTotalInvested] = useState("$1,900,000");

  // Interests state
  const [sectors, setSectors] = useState<string[]>([]);
  const [coins, setCoins] = useState<string[]>(["Aurioux"]);
  const [geoPrefs, setGeoPrefs] = useState("");
  const [additionalCriteria, setAdditionalCriteria] = useState("");
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [preferencesSaved, setPreferencesSaved] = useState(false);

  const handleSavePreferences = () => {
    setPreferencesSaved(true);
    setTimeout(() => setPreferencesSaved(false), 3000);
  };

  const toggleStage = (stage: string) => {
    setSelectedStages(prev =>
      prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
    );
  };

  return (
    <PageShell title="Profile" defaultActive="profile">
      <div style={{ padding: "20px 16px 40px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#9ca3af", fontWeight: 400 }}>
          <span style={{ cursor: "pointer" }} onClick={() => router.push("/investors")}>Dashboard</span>
          <TbChevronRight size={14} strokeWidth={2} />
          <span style={{ color: "#0f172a", fontWeight: 500 }}>Profile</span>
        </div>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: "clamp(26px,7vw,30px)", fontWeight: 600, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>My Profile</h1>
          <span style={{ padding: "6px 16px", borderRadius: 20, background: "#22c55e", color: "#fff", fontSize: 13, fontWeight: 600 }}>Approved</span>
        </div>

        {/* ── Profile Card ── */}
        <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, border: "2px solid #e5e7eb",
          }}>
            <TbBuilding size={28} color="#9ca3af" strokeWidth={1.5} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", marginBottom: 4, letterSpacing: "-0.02em" }}>Aurum Strategies</div>
            <span style={{
              display: "inline-block", padding: "3px 10px", borderRadius: 6,
              background: "#fff7ed", color: "#f97316", fontSize: 11, fontWeight: 600, marginBottom: 6,
            }}>Not Verified</span>
            <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 400 }}>investor_aurum &nbsp;•&nbsp; London, UK</div>
            <div style={{ marginTop: 8 }}>
              <span style={{
                display: "inline-block", padding: "6px 16px", borderRadius: 20,
                border: "1px solid #e5e7eb", color: "#374151", fontSize: 13, fontWeight: 500,
              }}>Angel Investor</span>
            </div>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <style>{`
          .profile-tab-bar::-webkit-scrollbar { display: none; }
        `}</style>
        <div
          className="profile-tab-bar"
          style={{
            display: "flex", gap: 4,
            background: "#f3f4f6",
            borderRadius: 12,
            padding: 4,
            overflowX: "auto", WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none", scrollbarWidth: "none",
          }}
        >
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: "0 0 auto",
                padding: "10px 16px",
                fontSize: 13, fontWeight: activeTab === tab ? 600 : 500,
                color: activeTab === tab ? "#0f172a" : "#6b7280",
                background: activeTab === tab ? "#fff" : "transparent",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: FONT,
                transition: "all 0.2s",
                WebkitTapHighlightColor: "transparent",
                boxShadow: activeTab === tab ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ═══════════════════ OVERVIEW TAB ═══════════════════ */}
        {activeTab === "Overview" && (
          <>
            {/* ── Personal Information ── */}
            <div style={cardStyle}>
              <SectionHeader
                title="Personal Information"
                subtitle="Core details about the Investor"
                editing={editPersonal}
                onToggle={() => setEditPersonal(!editPersonal)}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <FieldGrid>
                  <Field label="Full Name" value={personalInfo.fullName} editing={editPersonal} onChange={v => setPersonalInfo(p => ({ ...p, fullName: v }))} />
                  <Field label="Username" value={personalInfo.username} editing={editPersonal} onChange={v => setPersonalInfo(p => ({ ...p, username: v }))} />
                </FieldGrid>
                <Field label="Email" value={personalInfo.email} editing={editPersonal} onChange={v => setPersonalInfo(p => ({ ...p, email: v }))} />
                <Field label="Mobile Number" value={personalInfo.mobile} editing={editPersonal} onChange={v => setPersonalInfo(p => ({ ...p, mobile: v }))} />
                <FieldGrid>
                  <Field label="Country" value={personalInfo.country} editing={editPersonal} onChange={v => setPersonalInfo(p => ({ ...p, country: v }))} />
                  <Field label="City" value={personalInfo.city} editing={editPersonal} onChange={v => setPersonalInfo(p => ({ ...p, city: v }))} />
                </FieldGrid>
              </div>
            </div>

            {/* ── Location & Contact ── */}
            <div style={cardStyle}>
              <SectionHeader
                title="Location & Contact"
                subtitle="Additional contact information"
                editing={editLocation}
                onToggle={() => setEditLocation(!editLocation)}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <FieldGrid>
                  <Field label="Address" value={locationInfo.address} editing={editLocation} onChange={v => setLocationInfo(l => ({ ...l, address: v }))} />
                  <Field label="LinkedIn" value={locationInfo.linkedin} editing={editLocation} onChange={v => setLocationInfo(l => ({ ...l, linkedin: v }))} linkStyle={!editLocation} />
                </FieldGrid>
                <Field label="Twitter" value={locationInfo.twitter} editing={editLocation} onChange={v => setLocationInfo(l => ({ ...l, twitter: v }))} linkStyle={!editLocation} />
              </div>
            </div>

            {/* ── KYC & Compliance ── */}
            <div style={cardStyle}>
              <div style={{ marginBottom: 18 }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>KYC &amp; Compliance</span>
                <p style={{ fontSize: 13, color: "#64748b", margin: "5px 0 0", fontWeight: 400 }}>Regulatory and compliance information</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {([
                  { Icon: TbCheck, iconColor: "#fff", iconBg: "#22c55e", bg: "#f0fdf4", border: "#22c55e", title: "Terms & Conditions", sub: "Accepted", badge: "Active", badgeBg: "#22c55e", badgeColor: "#fff", badgeBorder: undefined },
                  { Icon: TbAlertCircle, iconColor: "#fff", iconBg: "#f97316", bg: "#fff7ed", border: "#f97316", title: "KYC Verification", sub: "Under review", badge: "Pending", badgeBg: "#fff7ed", badgeColor: "#f97316", badgeBorder: "#fed7aa" },
                  { Icon: TbShieldCheck, iconColor: "#9ca3af", iconBg: "#e5e7eb", bg: "#f9fafb", border: "#d1d5db", title: "Shariah Compliance", sub: "Not verified", badge: "Pending", badgeBg: "#f3f4f6", badgeColor: "#6b7280", badgeBorder: "#e5e7eb" },
                ] as const).map(item => (
                  <div key={item.title} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px", background: item.bg, borderRadius: 14,
                    borderLeft: `4px solid ${item.border}`, cursor: "pointer",
                  }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: item.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <item.Icon size={20} color={item.iconColor} strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: "#64748b", fontWeight: 400 }}>{item.sub}</div>
                    </div>
                    <span style={{
                      padding: "5px 12px", borderRadius: 20,
                      background: item.badgeBg, color: item.badgeColor,
                      fontSize: 12, fontWeight: 600,
                      border: item.badgeBorder ? `1px solid ${item.badgeBorder}` : "none",
                    }}>{item.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════ INVESTOR PROFILE TAB ═══════════════════ */}
        {activeTab === "Investor Profile" && (
          <div style={cardStyle}>
            <SectionHeader
              title="Investor Profile"
              subtitle="Investor strategy and preferences"
              editing={editInvestor}
              onToggle={() => setEditInvestor(!editInvestor)}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Investor Type" value={investorType} editing={editInvestor} onChange={setInvestorType} />
              <Field label="Organization" value={organization} editing={editInvestor} onChange={setOrganization} />
              <Field label="Investment Goal" value={investmentGoal} editing={editInvestor} onChange={setInvestmentGoal} />
              <div>
                <div style={labelStyle}>Preferred Stages</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                  {(editInvestor ? ALL_STAGES : selectedStages).map(stage => (
                    editInvestor ? (
                      <button
                        key={stage}
                        onClick={() => toggleStage(stage)}
                        style={{
                          padding: "7px 14px", borderRadius: 20,
                          border: selectedStages.includes(stage) ? "1px solid #0f172a" : "1px solid #e5e7eb",
                          background: selectedStages.includes(stage) ? "#f1f5f9" : "#fff",
                          color: selectedStages.includes(stage) ? "#0f172a" : "#6b7280",
                          fontSize: 13, fontWeight: 500, cursor: "pointer",
                          fontFamily: FONT, transition: "all 0.15s",
                          WebkitTapHighlightColor: "transparent",
                        }}
                      >
                        {stage}
                      </button>
                    ) : (
                      <span key={stage} style={{
                        padding: "7px 14px", borderRadius: 20,
                        border: "1px solid #e5e7eb", color: "#374151",
                        fontSize: 13, fontWeight: 500,
                      }}>
                        {stage}
                      </span>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ FINANCIALS TAB ═══════════════════ */}
        {activeTab === "Financials" && (
          <>
            {/* ── Financial Overview ── */}
            <div style={cardStyle}>
              <SectionHeader
                title="Financial Overview"
                subtitle="Investment capacity and portfolio details"
                editing={editFinancial}
                onToggle={() => setEditFinancial(!editFinancial)}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <FieldGrid>
                  <Field label="Total Funds Available" value={totalFunds} editing={editFinancial} onChange={setTotalFunds} />
                  <Field label="Total Invested" value={totalInvested} editing={editFinancial} onChange={setTotalInvested} />
                </FieldGrid>
                <FieldGrid>
                  <div>
                    <div style={labelStyle}>Available Balance</div>
                    <div style={{ fontSize: editFinancial ? 18 : 20, fontWeight: 600, color: "#22c55e", marginBottom: editFinancial ? 2 : 0 }}>$4,100,000</div>
                    {editFinancial && <div style={{ fontSize: 12, color: "#9ca3af" }}>Auto Calculated</div>}
                  </div>
                  <div>
                    <div style={labelStyle}>Portfolio Value</div>
                    <div style={{ fontSize: editFinancial ? 18 : 20, fontWeight: 600, color: "#0f172a", marginBottom: editFinancial ? 2 : 0 }}>$1,900,000</div>
                    {editFinancial && <div style={{ fontSize: 12, color: "#9ca3af" }}>Based on current value</div>}
                  </div>
                </FieldGrid>
              </div>
            </div>

            {/* ── Investment Summary ── */}
            <div style={cardStyle}>
              <div style={{ marginBottom: 18 }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>Investment Summary</span>
                <p style={{ fontSize: 13, color: "#64748b", margin: "5px 0 0", fontWeight: 400 }}>Key financial metrics</p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={labelStyle}>Investment Capacity</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 10 }}>
                  68.3% available ($4.1M of $6M total)
                </div>
                <div style={{ height: 10, borderRadius: 6, background: "#f1f5f9", overflow: "hidden" }}>
                  <div style={{
                    width: "68.3%", height: "100%", borderRadius: 6,
                    background: "linear-gradient(90deg, #22c55e, #16a34a)",
                  }} />
                </div>
              </div>

              <div style={{ height: 1, background: "#f1f5f9", margin: "16px 0" }} />
              <div style={{ marginBottom: 16 }}>
                <div style={labelStyle}>Active Investments</div>
                <div style={valueStyle}>Information to be provided</div>
              </div>

              <div style={{ height: 1, background: "#f1f5f9", margin: "16px 0" }} />
              <div>
                <div style={labelStyle}>Average Investment Size</div>
                <div style={valueStyle}>Information to be provided</div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════ INTERESTS TAB ═══════════════════ */}
        {activeTab === "Interests" && (
          <div style={cardStyle}>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.02em" }}>Investment Interest</span>
              <p style={{ fontSize: 13, color: "#64748b", margin: "5px 0 0", fontWeight: 400 }}>
                Define your sector preferences and investment criteria
              </p>
            </div>

            {/* Sectors of interest */}
            <div style={{ paddingBottom: 20, position: "relative" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 10 }}>Sectors of interest</div>
              <button
                onClick={() => { setShowSectorDropdown(!showSectorDropdown); setShowCoinDropdown(false); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 20,
                  border: "1px solid #e5e7eb", background: "#fff",
                  color: "#374151", fontSize: 13, fontWeight: 500,
                  cursor: "pointer", fontFamily: FONT, marginBottom: 10,
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                + Add Sector
              </button>
              {showSectorDropdown && (
                <div style={{
                  position: "absolute", top: 72, left: 0, zIndex: 10,
                  background: "#fff", borderRadius: 14, padding: 6,
                  border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  maxHeight: 200, overflowY: "auto", width: 220,
                }}>
                  {AVAILABLE_SECTORS.filter(s => !sectors.includes(s)).map(s => (
                    <div
                      key={s}
                      onClick={() => { setSectors(prev => [...prev, s]); setShowSectorDropdown(false); }}
                      style={{
                        padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                        fontSize: 13, fontWeight: 500, color: "#374151",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      {s}
                    </div>
                  ))}
                  {AVAILABLE_SECTORS.filter(s => !sectors.includes(s)).length === 0 && (
                    <div style={{ padding: "10px 14px", fontSize: 13, color: "#9ca3af" }}>All sectors added</div>
                  )}
                </div>
              )}
              {sectors.length === 0 && (
                <div style={{ fontSize: 14, color: "#9ca3af", fontWeight: 400 }}>No sectors selected</div>
              )}
              {sectors.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {sectors.map(s => (
                    <span key={s} style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "7px 12px", borderRadius: 20, background: "#f1f5f9",
                      color: "#374151", fontSize: 13, fontWeight: 500,
                    }}>
                      {s}
                      <TbX
                        size={14} color="#9ca3af"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSectors(prev => prev.filter(x => x !== s))}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ height: 1, background: "#f1f5f9", margin: "0 0 20px" }} />

            {/* Emireq Coins Interest */}
            <div style={{ paddingBottom: 20, position: "relative" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 10 }}>Emireq Coins Interest</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                {coins.map(c => (
                  <span key={c} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 14px", borderRadius: 20, background: "#fef9c3",
                    color: "#92400e", fontSize: 13, fontWeight: 500,
                  }}>
                    {c}
                    <TbX
                      size={14} color="#92400e"
                      style={{ cursor: "pointer" }}
                      onClick={() => setCoins(prev => prev.filter(x => x !== c))}
                    />
                  </span>
                ))}
                <button
                  onClick={() => { setShowCoinDropdown(!showCoinDropdown); setShowSectorDropdown(false); }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "8px 16px", borderRadius: 20,
                    border: "1px solid #e5e7eb", background: "#fff",
                    color: "#374151", fontSize: 13, fontWeight: 500,
                    cursor: "pointer", fontFamily: FONT,
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  + Add Coin
                </button>
              </div>
              {showCoinDropdown && (
                <div style={{
                  position: "absolute", top: 72, left: 0, zIndex: 10,
                  background: "#fff", borderRadius: 14, padding: 6,
                  border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  maxHeight: 200, overflowY: "auto", width: 220,
                }}>
                  {AVAILABLE_COINS.filter(c => !coins.includes(c)).map(c => (
                    <div
                      key={c}
                      onClick={() => { setCoins(prev => [...prev, c]); setShowCoinDropdown(false); }}
                      style={{
                        padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                        fontSize: 13, fontWeight: 500, color: "#374151",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      {c}
                    </div>
                  ))}
                  {AVAILABLE_COINS.filter(c => !coins.includes(c)).length === 0 && (
                    <div style={{ padding: "10px 14px", fontSize: 13, color: "#9ca3af" }}>All coins added</div>
                  )}
                </div>
              )}
            </div>

            <div style={{ height: 1, background: "#f1f5f9", margin: "0 0 20px" }} />

            {/* Geographic Preferences */}
            <div style={{ paddingBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 10 }}>Geographic Preferences</div>
              <textarea
                value={geoPrefs}
                onChange={e => setGeoPrefs(e.target.value)}
                placeholder="Enter your geographic investment preferences..."
                style={{ ...inputStyle, minHeight: 80, resize: "vertical", background: "#f3f4f6", border: "none", borderRadius: 14 }}
              />
            </div>

            <div style={{ height: 1, background: "#f1f5f9", margin: "0 0 20px" }} />

            {/* Additional Criteria */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 10 }}>Additional Criteria</div>
              <textarea
                value={additionalCriteria}
                onChange={e => setAdditionalCriteria(e.target.value)}
                placeholder="Describe any additional criteria for your investments..."
                style={{ ...inputStyle, minHeight: 80, resize: "vertical", background: "#f3f4f6", border: "none", borderRadius: 14 }}
              />
            </div>

            {/* Save Preferences */}
            <button
              onClick={handleSavePreferences}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "14px 28px", borderRadius: 14,
                background: "#2563eb", color: "#fff",
                fontSize: 15, fontWeight: 600, border: "none",
                cursor: "pointer", fontFamily: FONT,
                WebkitTapHighlightColor: "transparent",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#1d4ed8")}
              onMouseLeave={e => (e.currentTarget.style.background = "#2563eb")}
            >
              <TbDeviceFloppy size={18} /> Save Preferences
            </button>

            {preferencesSaved && (
              <div style={{
                marginTop: 14, padding: "12px 16px", borderRadius: 12,
                background: "#f0fdf4", border: "1px solid #bbf7d0",
                display: "flex", alignItems: "center", gap: 8,
                animation: "fadeIn 0.2s ease",
              }}>
                <TbCheck size={18} color="#22c55e" strokeWidth={2.5} />
                <span style={{ fontSize: 14, fontWeight: 500, color: "#166534" }}>Preferences saved successfully!</span>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════ SHARED BOTTOM SECTIONS ═══════════════════ */}

        <QuickStats />

        <AccountTimeline />

        <NextSteps />

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "8px 0 0" }}>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, lineHeight: 1.7, fontWeight: 400 }}>
            Your profile information is secure and encrypted. Last<br />updated October 26, 2025.
          </p>
        </div>

      </div>
    </PageShell>
  );
}
