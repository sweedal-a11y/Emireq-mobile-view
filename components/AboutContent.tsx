"use client";

import { useState } from "react";
import Image from "next/image";
import about1 from "../public/assets/about1.png";
import about2 from "../public/assets/about2.png";
import about3 from "../public/assets/about3.png";
import { FiShield }           from "react-icons/fi";
import { BsLightningCharge }  from "react-icons/bs";
import { HiOutlineEye, HiOutlineTrendingUp, HiOutlineMail } from "react-icons/hi";
import { TbWorld, TbTargetArrow } from "react-icons/tb";
import { RiMedalLine }        from "react-icons/ri";
import { PiUsersFour, PiUsers, PiSparkle } from "react-icons/pi";
import { LuRocket }           from "react-icons/lu";
import { GoArrowRight }       from "react-icons/go";

const FONT = "'URWGeometric', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const NAVY = "#152B5A";
const B: React.CSSProperties = { fontFamily: FONT, userSelect: "none" };
const sec: React.CSSProperties = { ...B, maxWidth: 480, margin: "0 auto", width: "100%", boxSizing: "border-box" };

// ─── Data ─────────────────────────────────────────────────────────────────────

const CORE_VALUES = [
  { id: 1, title: "Trust & Security", desc: "Building trust through complete transparency and enterprise-grade security.",   iconBg: NAVY,     Icon: FiShield,          iconColor: "#fff",    accent: "lavender" },
  { id: 2, title: "Innovation",        desc: "Pushing boundaries with cutting-edge technology and smart financial solutions.", iconBg: "#FFC300", Icon: BsLightningCharge, iconColor: NAVY,      accent: "yellow"   },
  { id: 3, title: "Transparency",      desc: "Every transaction is visible and verifiable, ensuring complete openness.",       iconBg: NAVY,     Icon: HiOutlineEye,      iconColor: "#fff",    accent: "lavender" },
  { id: 4, title: "Accessibility",     desc: "Making ethical investment accessible to everyone, regardless of background.",    iconBg: "#FFC300", Icon: TbWorld,           iconColor: NAVY,      accent: "yellow"   },
] as const;

const WHY_ITEMS = [
  { id: 1, label: "Regulatory\nCompliance", Icon: RiMedalLine       },
  { id: 2, label: "Secure",                 Icon: FiShield           },
  { id: 3, label: "Global\nReach",          Icon: TbWorld            },
  { id: 4, label: "Smart\nAnalytics",       Icon: HiOutlineTrendingUp },
  { id: 5, label: "Dedicated\nSupport",     Icon: PiUsersFour        },
  { id: 6, label: "Flexible\nSolutions",    Icon: TbTargetArrow      },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const imgHover = (scale: string) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLImageElement>) => { (e.currentTarget as HTMLImageElement).style.transform = `scale(${scale})`; },
    onMouseLeave: (e: React.MouseEvent<HTMLImageElement>) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; },
  });

  return (
    <section style={{ ...sec, background: "#fff", padding: "40px 20px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ ...B, fontSize: "clamp(32px,9vw,44px)", fontWeight: 600, letterSpacing: "-0.03em", color: "#0A0E28", margin: "0 0 18px", lineHeight: 1.1 }}>
          About{" "}
          <span style={{ display: "inline-block", position: "relative", background: "linear-gradient(to top,rgba(255,195,0,0.35) 22%,transparent 22%)", paddingBottom: 2 }}>
            Emireq
          </span>
        </h1>
        <p style={{ ...B, fontSize: 17, color: "#43536D", lineHeight: 1.7, margin: "0 auto", fontWeight: 400 }}>
          Emireq is the first ethical sharia compliant business tokenization platform, making capital accessible to entrepreneurs worldwide.
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ borderRadius: 18, overflow: "hidden", height: 210, position: "relative", marginBottom: 8, cursor: "pointer" }}>
          <Image src={about1} alt="Emireq team" fill style={{ objectFit: "cover", filter: "grayscale(100%)", transition: "transform 0.3s" }} {...imgHover("1.03")} />
        </div>
        <div style={{ display: "flex", gap: 8, position: "relative" }}>
          {[about2, about3].map((img, i) => (
            <div key={i} style={{ flex: 1, borderRadius: 16, overflow: "hidden", height: 140, position: "relative", cursor: "pointer" }}>
              <Image src={img} alt={i === 0 ? "Investment" : "Mobile app"} fill style={{ objectFit: "cover", transition: "transform 0.3s" }} {...imgHover("1.04")} />
            </div>
          ))}
          {/* Floating badge */}
          <div style={{ position: "absolute", bottom: 12, left: 12, background: "#fff", borderRadius: 100, padding: "7px 16px 7px 7px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 24px rgba(0,0,0,0.16)", zIndex: 10, cursor: "pointer", transition: "transform 0.2s,box-shadow 0.2s", userSelect: "none" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 28px rgba(0,0,0,0.22)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.16)"; }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LuRocket size={14} color="#f1ee2c" />
            </div>
            <div>
              <div style={{ ...B, fontSize: 10, color: "#717182", lineHeight: 1.3 }}>Total Funded</div>
              <div style={{ ...B, fontSize: 13, fontWeight: 600, color: "#0A0E28", lineHeight: 1.3 }}>150+ Startups</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", background: "#fff", border: "1px solid #E8EDF5", borderRadius: 100, overflow: "hidden", marginBottom: 36 }}>
        {["500+", "$2M+", "150+", "40+"].map((stat, i, arr) => (
          <div key={stat} style={{ flex: 1, textAlign: "center", padding: "14px 4px", borderRight: i === arr.length - 1 ? "none" : "1px solid #E8EDF5", cursor: "pointer", transition: "background 0.2s", userSelect: "none" }}
            onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = "#F4F7FB")}
            onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}>
            <span style={{ ...B, fontSize: 14, fontWeight: 500, color: "#0A0E28", letterSpacing: "-0.01em" }}>{stat}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Investment Cards ─────────────────────────────────────────────────────────

function InvestmentCardsSection() {
  const [hov, setHov] = useState<"start" | "fund" | null>(null);

  const cardStats = (items: { val: string; lbl: string }[], light: boolean) => (
    <div style={{ display: "flex", gap: 40 }}>
      {items.map(s => (
        <div key={s.lbl}>
          <div style={{ ...B, fontSize: "clamp(26px,7vw,30px)", fontWeight: 600, color: light ? "#0A0E28" : "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.val}</div>
          <div style={{ ...B, fontSize: 12, color: light ? "#5A6B82" : "rgba(255,255,255,0.45)", marginTop: 5 }}>{s.lbl}</div>
        </div>
      ))}
    </div>
  );

  return (
    <section style={{ ...sec, padding: "0 20px 36px" }}>
      <div style={{ borderRadius: 28, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.13)" }}>

        {/* Investors */}
        <div style={{ background: "linear-gradient(160deg,#dce8ff 0%,#b8cefe 100%)", padding: "28px 24px 32px", position: "relative", overflow: "hidden", minHeight: 320 }}>
          <div style={{ position: "absolute", right: -60, bottom: -60, width: 260, height: 260, borderRadius: "50%", border: "52px solid rgba(255,255,255,0.28)", pointerEvents: "none" }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", borderRadius: 100, padding: "6px 16px 6px 10px", marginBottom: 20, boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
            <PiUsers size={15} color={NAVY} />
            <span style={{ ...B, fontSize: 12, fontWeight: 600, color: NAVY }}>For Investors</span>
          </div>
          <h2 style={{ ...B, fontSize: "clamp(28px,8vw,36px)", fontWeight: 600, color: "#0A0E28", letterSpacing: "-0.03em", lineHeight: 1.12, margin: "0 0 14px", maxWidth: 260 }}>Invest Your Money Now</h2>
          <p style={{ ...B, fontSize: 14, color: "#3C4D68", lineHeight: 1.65, margin: "0 0 24px", maxWidth: 260 }}>Join 500+ investors who are earning returns by funding ethical businesses worldwide.</p>
          <button onMouseEnter={() => setHov("start")} onMouseLeave={() => setHov(null)}
            style={{ ...B, display: "inline-flex", alignItems: "center", gap: 10, background: "#0C1B3D", color: "#fff", border: "none", borderRadius: 14, padding: "13px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: 28, transition: "all 0.18s", transform: hov === "start" ? "translateY(-2px)" : "none", boxShadow: hov === "start" ? "0 8px 24px rgba(12,27,61,0.38)" : "0 3px 14px rgba(12,27,61,0.22)" }}>
            Start Investing <GoArrowRight size={15} color="white" />
          </button>
          {cardStats([{ val: "8.5%", lbl: "Avg. Returns" }, { val: "500+", lbl: "Active Investors" }], true)}
        </div>

        {/* Businesses */}
        <div style={{ background: "#0C1B3D", padding: "28px 24px 32px", position: "relative", overflow: "hidden", minHeight: 320 }}>
          <div style={{ position: "absolute", right: -55, bottom: -55, width: 240, height: 240, borderRadius: "50%", border: "46px solid rgba(60,90,110,0.45)", pointerEvents: "none" }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.1)", borderRadius: 100, padding: "6px 16px 6px 10px", marginBottom: 20 }}>
            <PiSparkle size={15} color="#FFC300" />
            <span style={{ ...B, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>For Businesses</span>
          </div>
          <h2 style={{ ...B, fontSize: "clamp(28px,8vw,36px)", fontWeight: 600, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.12, margin: "0 0 14px", maxWidth: 260 }}>Fund Your Business Now</h2>
          <p style={{ ...B, fontSize: 14, color: "rgba(255,255,255,0.62)", lineHeight: 1.65, margin: "0 0 24px", maxWidth: 260 }}>Get fast access to capital through tokenization. Flexible terms up to £500k to grow your business.</p>
          <button onMouseEnter={() => setHov("fund")} onMouseLeave={() => setHov(null)}
            style={{ ...B, display: "inline-flex", alignItems: "center", gap: 10, background: "#FFC300", color: NAVY, border: "none", borderRadius: 14, padding: "13px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 28, transition: "all 0.18s", transform: hov === "fund" ? "translateY(-2px)" : "none", boxShadow: hov === "fund" ? "0 8px 24px rgba(255,195,0,0.48)" : "0 3px 14px rgba(255,195,0,0.28)" }}>
            Get Funding <GoArrowRight size={15} color={NAVY} />
          </button>
          {cardStats([{ val: "£500k", lbl: "Max Funding" }, { val: "150+", lbl: "Funded Startups" }], false)}
        </div>
      </div>
    </section>
  );
}

// ─── Core Values ──────────────────────────────────────────────────────────────

function CoreValuesSection() {
  return (
    <section style={{ ...B, ...sec, padding: "0 0 36px", background: "#fff" }}>
      <div style={{ padding: "0 20px 24px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#EEEEF0", borderRadius: 100, padding: "10px 22px 10px 14px", marginBottom: 20, cursor: "default", userSelect: "none" }}>
          <RiMedalLine size={20} color={NAVY} />
          <span style={{ ...B, fontSize: 13, fontWeight: 600, color: NAVY, letterSpacing: "0.08em", textTransform: "uppercase" }}>What Drives Us</span>
        </div>
        <h2 style={{ ...B, fontSize: 30, fontWeight: 600, color: "#0A0E28", letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1 }}>Our Core Values</h2>
      </div>
      <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "8px 20px 16px", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
        {CORE_VALUES.map(v => (
          <div key={v.id} style={{ flex: "0 0 260px", background: "#fff", borderRadius: 24, border: "1.5px solid rgba(0,0,0,0.09)", padding: "28px 24px", position: "relative", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 110, height: 110, borderRadius: "50%", background: v.accent === "yellow" ? "rgba(255,195,0,0.10)" : "rgba(200,210,230,0.32)", pointerEvents: "none" }} />
            <div style={{ width: 68, height: 68, borderRadius: 20, background: v.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 56 }}>
              <v.Icon size={28} color={v.iconColor} />
            </div>
            <h3 style={{ ...B, fontSize: 22, fontWeight: 600, color: "#0A0E28", margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{v.title}</h3>
            <p style={{ ...B, fontSize: 14, color: "#717182", lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Why Choose ───────────────────────────────────────────────────────────────

function WhyChooseSection() {
  const [hov, setHov]   = useState<number | null>(null);
  const [prs, setPrs]   = useState<number | null>(null);
  return (
    <section style={{ background: "#F2F3F7", padding: "36px 20px 44px", ...sec }}>
      <h2 style={{ ...B, fontSize: "clamp(32px,9vw,42px)", fontWeight: 600, color: "#0A0E28", letterSpacing: "-0.03em", margin: "0 0 28px", lineHeight: 1.1 }}>Why Choose Emireq</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {WHY_ITEMS.map(item => {
          const on = hov === item.id, pr = prs === item.id;
          return (
            <div key={item.id}
              onMouseEnter={() => setHov(item.id)} onMouseLeave={() => { setHov(null); setPrs(null); }}
              onMouseDown={() => setPrs(item.id)}   onMouseUp={() => setPrs(null)}
              style={{ background: "#fff", border: `1.5px solid ${on ? "rgba(21,43,90,0.18)" : "rgba(0,0,0,0.06)"}`, borderRadius: 22, padding: "22px 10px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, cursor: "pointer", transition: "all 0.18s", transform: pr ? "scale(0.96)" : on ? "translateY(-3px)" : "none", boxShadow: on ? "0 8px 24px rgba(0,0,0,0.09)" : "0 1px 6px rgba(0,0,0,0.04)", userSelect: "none" }}>
              <div style={{ width: 58, height: 58, borderRadius: 16, background: on ? "#dde2f4" : "#ECEEF6", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.18s" }}>
                <item.Icon size={26} color={NAVY} />
              </div>
              <span style={{ ...B, fontSize: 15, fontWeight: 500, color: "#0A0E28", textAlign: "center", lineHeight: 1.45, whiteSpace: "pre-line", letterSpacing: "-0.01em" }}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

function NewsletterSection() {
  const [email, setEmail]       = useState("");
  const [subbed, setSubbed]     = useState(false);
  const [focused, setFocused]   = useState(false);
  const subscribe = () => { if (email.includes("@")) setSubbed(true); };

  return (
    <section style={{ ...sec, padding: "28px 20px 40px" }}>
      <div style={{ background: "#F2F3F7", borderRadius: 28, padding: "32px 26px 30px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -35, bottom: -35, width: 150, height: 150, borderRadius: "50%", background: "rgba(21,43,90,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 45,  bottom: 25,  width: 70,  height: 70,  borderRadius: "50%", background: "rgba(21,43,90,0.05)", pointerEvents: "none" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 100, padding: "9px 20px 9px 14px", marginBottom: 22, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", userSelect: "none" }}>
          <HiOutlineMail size={18} color={NAVY} />
          <span style={{ ...B, fontSize: 14, fontWeight: 600, color: NAVY }}>Stay Updated</span>
        </div>

        <h2 style={{ ...B, fontSize: "clamp(22px,6vw,28px)", fontWeight: 600, color: "#0A0E28", letterSpacing: "-0.025em", margin: "0 0 12px", lineHeight: 1.2 }}>Get Emireq Updates</h2>
        <p style={{ ...B, fontSize: 15, color: "#43536D", lineHeight: 1.65, margin: "0 0 28px", maxWidth: 320 }}>
          Sign up to get notified when our latest offers go live, relevant news and more from the world of ethical tokenization.
        </p>

        <input type="email" value={email} placeholder="Enter your email address..."
          onChange={e => setEmail(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onKeyDown={e => e.key === "Enter" && subscribe()}
          style={{ width: "100%", padding: "17px 20px", borderRadius: 18, border: `1.5px solid ${focused ? NAVY : "rgba(0,0,0,0.1)"}`, background: "#fff", fontSize: 15, color: "#0A0E28", fontFamily: FONT, outline: "none", marginBottom: 12, boxSizing: "border-box", transition: "border-color 0.18s,box-shadow 0.18s", boxShadow: focused ? "0 0 0 3px rgba(21,43,90,0.08)" : "none" }} />

        <button onClick={subscribe}
          style={{ width: "100%", padding: 18, borderRadius: 18, border: "none", background: subbed ? "#1e3d7a" : "#0C1B3D", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", marginBottom: 20, fontFamily: FONT, letterSpacing: "-0.01em", transition: "all 0.18s", boxShadow: "0 4px 18px rgba(12,27,61,0.22)", userSelect: "none" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#1e3d7a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = subbed ? "#1e3d7a" : "#0C1B3D"; e.currentTarget.style.transform = "translateY(0)"; }}>
          {subbed ? "Subscribed ✓" : "Subscribe"}
        </button>

        <p style={{ ...B, fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.55 }}>
          By subscribing, you agree to our{" "}
          <span style={{ color: NAVY, fontWeight: 600, cursor: "pointer" }}
            onMouseEnter={e => ((e.currentTarget as HTMLSpanElement).style.textDecoration = "underline")}
            onMouseLeave={e => ((e.currentTarget as HTMLSpanElement).style.textDecoration = "none")}>
            Privacy Policy
          </span>{" "}and consent to receive updates.
        </p>
      </div>
    </section>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function AboutContent() {
  return (
    <div style={{ background: "#fff", userSelect: "none", fontFamily: FONT }}>
      <HeroSection />
      <InvestmentCardsSection />
      <CoreValuesSection />
      <WhyChooseSection />
      <NewsletterSection />
    </div>
  );
}










