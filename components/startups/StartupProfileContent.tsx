"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TbPencil, TbCalendarEvent, TbMapPin,
  TbBulb, TbRocket, TbTarget, TbDiamond,
  TbTrendingUp, TbEye,
  TbUsers, TbSchool, TbBook, TbFlame, TbUserCircle, TbStar,
  TbMail, TbWorld, TbMapPinFilled,
  TbChevronRight,
} from "react-icons/tb";
import { FONT, PageShell, cardBase } from "./shared";

// ─── Types ────────────────────────────────────────────────────────────────────

const TABS = ["Company Information", "Vision", "Founders & Team", "Contact Information"] as const;
type Tab = (typeof TABS)[number];

interface CompanyInfo {
  startupName: string;
  foundedYear: string;
  stage: string;
  fundingTarget: string;
  problemStatement: string;
  productDescription: string;
  targetCustomers: string;
  keyDifferentiator: string;
}

interface VisionInfo {
  shortTermVision: string;
  longTermVision: string;
}

interface FoundersInfo {
  foundersList: string;
  professionalBackgrounds: string;
  originStory: string;
  motivation: string;
  teamRoles: string;
  keyStrengths: string;
}

interface ContactInfo {
  email: string;
  website: string;
  location: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const sectionCard: React.CSSProperties = {
  ...cardBase,
  padding: "24px 20px",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "#9ca3af",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: 6,
};

const valueStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 500,
  color: "#111827",
  lineHeight: 1.5,
};

const divider: React.CSSProperties = {
  height: 1,
  background: "#f1f5f9",
  margin: "16px 0",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StartupProfileContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Company Information");
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const [company] = useState<CompanyInfo>({
    startupName: "ABC Inc",
    foundedYear: "2025",
    stage: "Idea",
    fundingTarget: "Not provided",
    problemStatement: "Solving ABC Problems",
    productDescription: "ABC Products",
    targetCustomers: "ABC Customers",
    keyDifferentiator: "Unique Advantages",
  });

  const [vision] = useState<VisionInfo>({
    shortTermVision: "Onboarding as much customers",
    longTermVision: "Getting Acquired",
  });

  const [founders] = useState<FoundersInfo>({
    foundersList: "ABC Founder 1, ABC Founder 2",
    professionalBackgrounds: "From ABC University",
    originStory: "Story",
    motivation: "ABC Motivation",
    teamRoles: "ABC Team\u2019s Roles",
    keyStrengths: "ABC Team\u2019s Founder\u2019s Strength",
  });

  const [contact] = useState<ContactInfo>({
    email: "abc@abc.com",
    website: "www.abc.com",
    location: "San Francisco, CA",
  });

  // scroll active tab into view
  useEffect(() => {
    if (!tabContainerRef.current) return;
    const idx = TABS.indexOf(activeTab);
    const container = tabContainerRef.current;
    const tabEl = container.children[idx] as HTMLElement | undefined;
    if (tabEl) {
      const offset = tabEl.offsetLeft - container.offsetWidth / 2 + tabEl.offsetWidth / 2;
      container.scrollTo({ left: offset, behavior: "smooth" });
    }
  }, [activeTab]);

  return (
    <PageShell title="Dashboard" defaultActive="profile">
      <div style={{ padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* ── Breadcrumb ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 2px" }}>
          <span
            onClick={() => router.push("/startups")}
            style={{ fontSize: 13, color: "#6b7280", fontWeight: 400, cursor: "pointer" }}
          >
            Dashboard
          </span>
          <TbChevronRight size={14} color="#9ca3af" />
          <span style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>Profile</span>
        </div>

        {/* ── Page Heading ── */}
        <div style={{ padding: "0 2px" }}>
          <h1 style={{
            fontSize: "clamp(26px,7vw,32px)", fontWeight: 600, color: "#0f172a",
            margin: "0 0 6px", letterSpacing: "-0.01em", lineHeight: 1.15,
          }}>
            My Profile
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
            Manage your company information and settings
          </p>
        </div>

        {/* ── Profile Card ── */}
        <div style={{
          ...cardBase,
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          {/* Top row: Avatar + Info side by side */}
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
            width: "100%",
            marginBottom: 18,
          }}>
            {/* Avatar */}
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "#f3f4f6", display: "flex",
              alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 22, fontWeight: 600, color: "#6b7280" }}>AB</span>
            </div>

            {/* Name + badge + meta */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0, paddingTop: 4 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {company.startupName}
              </h2>
              <span style={{
                display: "inline-block",
                fontSize: 12, fontWeight: 600,
                color: "#3B82F6",
                background: "#EFF6FF",
                borderRadius: 20,
                padding: "3px 14px",
                width: "fit-content",
              }}>
                {company.stage}
              </span>
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 13, color: "#6b7280", fontWeight: 400,
                flexWrap: "wrap",
              }}>
                <TbCalendarEvent size={15} color="#9ca3af" />
                <span>Founded {company.foundedYear}</span>
                <span style={{ color: "#d1d5db" }}>&bull;</span>
                <TbMapPin size={15} color="#9ca3af" />
                <span>{contact.location}</span>
              </div>
            </div>
          </div>

          {/* Edit Profile button */}
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 22px", borderRadius: 12,
            border: "1px solid #e5e7eb", background: "#fff",
            fontSize: 14, fontWeight: 500, color: "#374151",
            cursor: "pointer",
            transition: "background 0.15s, box-shadow 0.15s",
            fontFamily: FONT,
            WebkitTapHighlightColor: "transparent",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <TbPencil size={16} color="#374151" strokeWidth={2} />
            Edit Profile
          </button>
        </div>

        {/* ── Tabs ── */}
        <div
          ref={tabContainerRef}
          style={{
            display: "flex",
            gap: 0,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            borderBottom: "1px solid #f1f5f9",
            background: "#f9fafb",
            borderRadius: 14,
            padding: "4px",
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: "0 0 auto",
                  padding: "10px 18px",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#111827" : "#6b7280",
                  background: isActive ? "#fff" : "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: FONT,
                  transition: "all 0.18s ease",
                  boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        {activeTab === "Company Information" && (
          <div style={sectionCard}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Company Information
            </h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 18px", fontWeight: 400 }}>
              Core details about your startup and business modal
            </p>

            <div style={divider} />

            {/* 2-col grid fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <div style={labelStyle}>STARTUP NAME</div>
                <div style={valueStyle}>{company.startupName}</div>
              </div>
              <div>
                <div style={labelStyle}>FOUNDED YEAR</div>
                <div style={valueStyle}>{company.foundedYear}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <div style={labelStyle}>STAGE</div>
                <div style={valueStyle}>{company.stage}</div>
              </div>
              <div>
                <div style={labelStyle}>FUNDING TARGET</div>
                <div style={valueStyle}>{company.fundingTarget}</div>
              </div>
            </div>

            <div style={divider} />

            {/* Icon rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <IconField icon={TbBulb} iconColor="#6b7280" label="PROBLEM STATEMENT" value={company.problemStatement} />
              <IconField icon={TbRocket} iconColor="#6b7280" label="PRODUCT DESCRIPTION" value={company.productDescription} />
              <IconField icon={TbTarget} iconColor="#6b7280" label="TARGET CUSTOMERS" value={company.targetCustomers} />
              <IconField icon={TbDiamond} iconColor="#6b7280" label="KEY DIFFERENTIATOR" value={company.keyDifferentiator} />
            </div>
          </div>
        )}

        {activeTab === "Vision" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Short-Term Vision */}
            <div style={sectionCard}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <TbTrendingUp size={22} color="#6b7280" strokeWidth={2} />
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
                  Short-Term Vision
                </h3>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 14px", fontWeight: 400 }}>
                Your goals for the next 6-12 months
              </p>
              <div style={valueStyle}>{vision.shortTermVision}</div>
            </div>

            {/* Long-Term Vision */}
            <div style={sectionCard}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <TbEye size={22} color="#6b7280" strokeWidth={2} />
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
                  Long-Term Vision
                </h3>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 14px", fontWeight: 400 }}>
                Your goals for the next 6-12 months
              </p>
              <div style={valueStyle}>{vision.longTermVision}</div>
            </div>
          </div>
        )}

        {activeTab === "Founders & Team" && (
          <div style={sectionCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <TbUsers size={22} color="#6b7280" strokeWidth={2} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
                Founders & Team
              </h3>
            </div>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 18px", fontWeight: 400 }}>
              Information about yor founding team and their expertise
            </p>

            <div style={divider} />

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <FieldBlock label="FOUNDERS LIST" value={founders.foundersList} />
              <div style={divider} />
              <FieldBlock label="PROFFESIONAL BACKGROUNDS" value={founders.professionalBackgrounds} />
              <FieldBlock label="ORIGIN STORY" value={founders.originStory} />
              <FieldBlock label="MOTIVATION" value={founders.motivation} />
              <FieldBlock label="TEAM ROLES" value={founders.teamRoles} />
              <FieldBlock label="KEY STRENGTHS" value={founders.keyStrengths} />
            </div>
          </div>
        )}

        {activeTab === "Contact Information" && (
          <div style={sectionCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <TbMail size={22} color="#6b7280" strokeWidth={2} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
                Contact Information
              </h3>
            </div>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 18px", fontWeight: 400 }}>
              How investors and partners can reach you
            </p>

            <div style={divider} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <TbMail size={14} color="#9ca3af" />
                  <span style={labelStyle}>EMAIL</span>
                </div>
                <div style={valueStyle}>{contact.email}</div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <TbWorld size={14} color="#9ca3af" />
                  <span style={labelStyle}>WEBSITE</span>
                </div>
                <div style={valueStyle}>{contact.website}</div>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <TbMapPin size={14} color="#9ca3af" />
                <span style={labelStyle}>LOCATION</span>
              </div>
              <div style={valueStyle}>{contact.location}</div>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{ textAlign: "center", padding: "12px 8px 0" }}>
          <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6, margin: 0 }}>
            Your profile information is secure and encrypted. Last updated October 26, 2025.
          </p>
        </div>

      </div>
    </PageShell>
  );
}

// ─── Helper Components ────────────────────────────────────────────────────────

function IconField({ icon: Icon, iconColor, label, value }: {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div style={{ marginTop: 2, flexShrink: 0 }}>
        <Icon size={18} color={iconColor} strokeWidth={2} />
      </div>
      <div>
        <div style={{
          fontSize: 11, fontWeight: 600, color: "#9ca3af",
          letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4,
        }}>
          {label}
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "#111827", lineHeight: 1.5 }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function FieldBlock({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: "#9ca3af",
        letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 500, color: "#111827", lineHeight: 1.5 }}>
        {value}
      </div>
    </div>
  );
}
