"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  TbSearch, TbPlus, TbArrowLeft, TbPhone, TbVideo,
  TbPaperclip, TbPhoto, TbMoodSmile, TbSend,
  TbMessageCircle, TbPencil, TbMail, TbPhoneCall,
  TbExternalLink, TbDots, TbChecks,
  TbCurrencyDollar, TbTargetArrow, TbMapPin, TbBuilding,
  TbCalendar, TbClock,
} from "react-icons/tb";
import { FONT, PageShell, cardBase } from "./shared";
import p1 from "@/public/assets/person.png";
import p2 from "@/public/assets/person.png";

// ─── Types ────────────────────────────────────────────────────────────────────

type View = "list" | "chat" | "contact";

interface Conversation {
  id: string;
  name: string;
  company: string;
  avatar: typeof p1 | null;
  initials: string;
  online: boolean;
  lastMessage: string;
  timestamp: string;
  section: "recent" | "all";
}

interface ChatMessage {
  id: string;
  sender: "them" | "me";
  text: string;
  time: string;
  read?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CONVERSATIONS: Conversation[] = [
  { id: "1", name: "Sarah Johnson", company: "Growth Equity Fund", avatar: p1, initials: "SJ", online: true, lastMessage: "Thanks for sharing the upd...", timestamp: "Today", section: "recent" },
  { id: "2", name: "Sarah Johnson", company: "Tech Venture", avatar: p1, initials: "SJ", online: true, lastMessage: "Thanks for sharing the upd...", timestamp: "09:15 AM", section: "recent" },
  { id: "3", name: "Sarah Johnson", company: "Growth Equity Fund", avatar: p1, initials: "SJ", online: true, lastMessage: "Thanks for sharing the upd...", timestamp: "Today", section: "recent" },
  { id: "4", name: "Sarah Johnson", company: "Seed Stage Partners", avatar: p1, initials: "SJ", online: true, lastMessage: "Thanks for sharing the upd...", timestamp: "2 days ago", section: "all" },
  { id: "5", name: "Sarah Johnson", company: "Tech Venture", avatar: p1, initials: "SJ", online: true, lastMessage: "Thanks for sharing the upd...", timestamp: "2 days ago", section: "all" },
];

const CHAT_MESSAGES: ChatMessage[] = [
  { id: "1", sender: "them", text: "Hi! I reviewed your pitch deck and I am impressed with your traction.", time: "10:15 AM" },
  { id: "2", sender: "me", text: "Thank you! We are excited about the opportunity to discuss further.", time: "10:20 AM", read: true },
  { id: "3", sender: "them", text: "I would love to schedule a call to discuss your metrics in more detail.", time: "10:30 AM" },
];

const CONTACT_INFO = {
  name: "Sarah Johnson",
  gender: "Female",
  contact: "+1-555-123-4567",
  email: "sarahjohnson@mail.com",
  address: "123 Maplewood Drive, Apt 4B\nSpringfield, IL 62704, United States",
  investmentRange: "$2M – $10M",
  stage: "Series A–B",
  geographicFocus: "North America",
  investmentFocus: ["SaaS", "FinTech", "B2B"],
  registered: "October 26, 2025",
  lastUpdated: "October 26, 2025",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function MessagesContent() {
  const [view, setView] = useState<View>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES);
  const [showConversations, setShowConversations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredConversations = CONVERSATIONS.filter(
    c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentConvos = filteredConversations.filter(c => c.section === "recent");
  const allConvos = filteredConversations.filter(c => c.section === "all");

  function handleSelectConversation(id: string) {
    setSelectedId(id);
    setView("chat");
  }

  function handleStartNewConversation() {
    setShowConversations(true);
  }

  function handleSendMessage() {
    if (!messageText.trim()) return;
    const newMsg: ChatMessage = {
      id: String(messages.length + 1),
      sender: "me",
      text: messageText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setMessages(prev => [...prev, newMsg]);
    setMessageText("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  // ── Messages List View ──────────────────────────────────────────────────────
  if (view === "list") {
    const hasConversations = showConversations && filteredConversations.length > 0;
    return (
      <PageShell title="Messages" defaultActive="messages">
        <div style={{ padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Header */}
          <div style={{ padding: "0 2px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <h1 style={{ fontSize: "clamp(26px,7vw,32px)", fontWeight: 600, color: "#0f172a", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.15 }}>
                Messages
              </h1>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#ECFDF5", color: "#10B981",
                fontSize: 13, fontWeight: 600,
                padding: "5px 14px", borderRadius: 20,
                border: "1px solid #D1FAE5",
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
                Online
              </span>
            </div>
            <p style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
              Communicate with investors and partners
            </p>
          </div>

          {/* Search + New Button */}
          <div style={{ ...cardBase, padding: "16px", marginBottom: 0 }}>
            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#f3f4f6", borderRadius: 14,
              padding: "12px 14px",
            }}>
              <TbSearch size={20} color="#9ca3af" strokeWidth={1.8} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  border: "none", outline: "none", background: "transparent",
                  fontSize: 15, color: "#111827", fontFamily: FONT,
                  width: "100%", fontWeight: 400,
                }}
              />
            </div>

            <div style={{ height: 1, background: "#e5e7eb", margin: "16px 0" }} />

            {!hasConversations ? (
              /* Empty State */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0 20px" }}>
                <div style={{
                  width: 100, height: 100, borderRadius: "50%",
                  background: "#f1f5f9", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  marginBottom: 20,
                }}>
                  <TbMessageCircle size={44} color="#c4c9d2" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 600, color: "#0f172a", margin: "0 0 8px", textAlign: "center" }}>
                  No Conversation Yet
                </h3>
                <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px", textAlign: "center", lineHeight: 1.6 }}>
                  Start a conversation with<br />the investors
                </p>
                <button
                  onClick={handleStartNewConversation}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "#111827", color: "#fff", border: "none",
                    borderRadius: 14, padding: "14px 28px",
                    fontSize: 15, fontWeight: 600, cursor: "pointer",
                    fontFamily: FONT,
                    transition: "background 0.18s, transform 0.15s",
                    WebkitTapHighlightColor: "transparent",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#1f2937")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#111827")}
                >
                  <TbPlus size={18} strokeWidth={2.5} />
                  Start New Conversation
                </button>
              </div>
            ) : (
              /* Conversation Lists */
              <div>
                {/* Recent */}
                {recentConvos.length > 0 && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, marginTop: 4 }}>
                      <TbMessageCircle size={16} color="#9ca3af" strokeWidth={1.8} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#9ca3af", letterSpacing: "0.01em" }}>Recent</span>
                    </div>
                    {recentConvos.map((c) => (
                      <ConversationItem
                        key={c.id}
                        conversation={c}
                        isSelected={selectedId === c.id}
                        onSelect={() => handleSelectConversation(c.id)}
                      />
                    ))}
                  </>
                )}

                {/* All Messages */}
                {allConvos.length > 0 && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, marginTop: 20 }}>
                      <TbMessageCircle size={16} color="#9ca3af" strokeWidth={1.8} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#9ca3af", letterSpacing: "0.01em" }}>All Message</span>
                    </div>
                    {allConvos.map((c) => (
                      <ConversationItem
                        key={c.id}
                        conversation={c}
                        isSelected={selectedId === c.id}
                        onSelect={() => handleSelectConversation(c.id)}
                      />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  // ── Chat View ───────────────────────────────────────────────────────────────
  if (view === "chat") {
    const selectedConvo = CONVERSATIONS.find(c => c.id === selectedId);
    return (
      <div style={{ fontFamily: FONT, background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", WebkitTapHighlightColor: "transparent" }}>
        {/* Chat Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 16px",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          background: "#fff",
          position: "sticky", top: 0, zIndex: 30,
        }}>
          <button
            onClick={() => { setView("list"); setSelectedId(null); }}
            style={{ background: "none", border: "none", padding: 4, cursor: "pointer", display: "flex", alignItems: "center", WebkitTapHighlightColor: "transparent" }}
            aria-label="Back"
          >
            <TbArrowLeft size={22} color="#374151" strokeWidth={2} />
          </button>

          {/* Avatar with initials */}
          <div
            style={{ position: "relative", cursor: "pointer", flexShrink: 0 }}
            onClick={() => setView("contact")}
          >
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "#f1f5f9", border: "2px solid #e5e7eb",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 600, color: "#64748b",
            }}>
              {selectedConvo?.initials ?? "SJ"}
            </div>
            <span style={{
              position: "absolute", bottom: 1, left: 0,
              width: 10, height: 10, borderRadius: "50%",
              background: "#10B981", border: "2px solid #fff",
            }} />
          </div>

          <div style={{ flex: 1, cursor: "pointer", minWidth: 0 }} onClick={() => setView("contact")}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", lineHeight: 1.25 }}>
              {selectedConvo?.name ?? "Sarah Johnson"}
            </div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400, marginTop: 1 }}>
              {selectedConvo?.company ?? "Venture Capital Partners"}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <button
              style={{ background: "none", border: "none", padding: 8, cursor: "pointer", display: "flex", alignItems: "center", borderRadius: 8, transition: "background 0.15s", WebkitTapHighlightColor: "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
              aria-label="Voice call"
            >
              <TbPhone size={22} color="#374151" strokeWidth={1.8} />
            </button>
            <button
              style={{ background: "none", border: "none", padding: 8, cursor: "pointer", display: "flex", alignItems: "center", borderRadius: 8, transition: "background 0.15s", WebkitTapHighlightColor: "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
              aria-label="Video call"
            >
              <TbVideo size={22} color="#374151" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.sender === "me" ? "flex-end" : "flex-start" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, maxWidth: "82%", flexDirection: msg.sender === "me" ? "row-reverse" : "row" }}>
                {msg.sender === "them" && (
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "#f1f5f9", border: "1px solid #e5e7eb",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 600, color: "#64748b",
                    flexShrink: 0, marginTop: 2,
                  }}>
                    SJ
                  </div>
                )}
                <div style={{
                  padding: "14px 18px",
                  borderRadius: msg.sender === "me" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  background: msg.sender === "me" ? "#3B82F6" : "#f3f4f6",
                  color: msg.sender === "me" ? "#fff" : "#1f2937",
                  fontSize: 15, lineHeight: 1.6, fontWeight: 400,
                }}>
                  {msg.text}
                </div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 4,
                marginTop: 6,
                paddingLeft: msg.sender === "them" ? 38 : 0,
              }}>
                <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}>{msg.time}</span>
                {msg.sender === "me" && msg.read && (
                  <TbChecks size={15} color="#3B82F6" strokeWidth={2} />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          borderTop: "1px solid rgba(0,0,0,0.08)",
          padding: "14px 16px 10px",
          background: "#fff",
          position: "sticky", bottom: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              style={{ background: "none", border: "none", padding: 6, cursor: "pointer", display: "flex", alignItems: "center", WebkitTapHighlightColor: "transparent" }}
              aria-label="Attach file"
            >
              <TbPaperclip size={22} color="#9ca3af" strokeWidth={1.8} />
            </button>
            <button
              style={{ background: "none", border: "none", padding: 6, cursor: "pointer", display: "flex", alignItems: "center", WebkitTapHighlightColor: "transparent" }}
              aria-label="Attach image"
            >
              <TbPhoto size={22} color="#9ca3af" strokeWidth={1.8} />
            </button>

            <div style={{
              flex: 1, display: "flex", alignItems: "center",
              background: "#f3f4f6", borderRadius: 24,
              padding: "10px 14px",
            }}>
              <textarea
                placeholder="Type your message..."
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                style={{
                  border: "none", outline: "none", background: "transparent",
                  fontSize: 14, color: "#111827", fontFamily: FONT,
                  width: "100%", fontWeight: 400, resize: "none",
                  lineHeight: 1.4, maxHeight: 80, overflow: "auto",
                }}
              />
              <button
                style={{ background: "none", border: "none", padding: 4, cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0, WebkitTapHighlightColor: "transparent" }}
                aria-label="Emoji"
              >
                <TbMoodSmile size={22} color="#9ca3af" strokeWidth={1.8} />
              </button>
            </div>

            <button
              onClick={handleSendMessage}
              style={{
                width: 44, height: 44, borderRadius: 14,
                background: "#3B82F6", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
                transition: "background 0.15s, transform 0.15s",
                WebkitTapHighlightColor: "transparent",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#3B82F6"; e.currentTarget.style.transform = "scale(1)"; }}
              aria-label="Send message"
            >
              <TbSend size={20} color="#fff" strokeWidth={2} style={{ transform: "rotate(-25deg)" }} />
            </button>
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: "10px 0 4px", fontWeight: 400 }}>
            Press Enter to send Shift + Enter for new line
          </p>
        </div>
      </div>
    );
  }

  // ── Contact Info View ───────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: FONT, background: "#fff", minHeight: "100vh", WebkitTapHighlightColor: "transparent" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "12px 20px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        background: "#fff",
        position: "sticky", top: 0, zIndex: 30,
      }}>
        <button
          onClick={() => setView("chat")}
          style={{ position: "absolute", left: 16, background: "none", border: "none", padding: 4, cursor: "pointer", display: "flex", alignItems: "center", WebkitTapHighlightColor: "transparent" }}
          aria-label="Back to chat"
        >
          <TbArrowLeft size={22} color="#374151" strokeWidth={2} />
        </button>
        <span style={{ fontSize: 17, fontWeight: 600, color: "#111827", letterSpacing: "-0.02em" }}>Contact Info</span>
      </div>

      <div style={{ padding: "20px 16px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Founder Contact Card */}
        <div style={{ ...cardBase, padding: "24px 20px" }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", margin: "0 0 24px", letterSpacing: "-0.01em" }}>Founder Contact</h3>

          {/* Avatar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
            <div style={{
              width: 100, height: 100, borderRadius: "50%",
              overflow: "hidden", marginBottom: 14,
              border: "2px solid #e5e7eb",
            }}>
              <Image src={p2} alt={CONTACT_INFO.name} width={100} height={100} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
            <h4 style={{ fontSize: 19, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>{CONTACT_INFO.name}</h4>
          </div>

          {/* Action Icons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
            {[
              { Icon: TbPencil, label: "Edit" },
              { Icon: TbMail, label: "Email" },
              { Icon: TbPhoneCall, label: "Call" },
              { Icon: TbExternalLink, label: "External" },
              { Icon: TbDots, label: "More" },
            ].map(({ Icon, label }) => (
              <button
                key={label}
                style={{
                  width: 46, height: 46, borderRadius: "50%",
                  background: "#f3f4f6", border: "1px solid #e5e7eb",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  transition: "background 0.18s, transform 0.15s",
                  WebkitTapHighlightColor: "transparent",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#e5e7eb"; e.currentTarget.style.transform = "scale(1.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.transform = "scale(1)"; }}
                aria-label={label}
              >
                <Icon size={19} color="#4b5563" strokeWidth={1.8} />
              </button>
            ))}
          </div>

          {/* Contact Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Gender", value: CONTACT_INFO.gender },
              { label: "Contact", value: CONTACT_INFO.contact },
              { label: "Email ID", value: CONTACT_INFO.email, isLink: true },
              { label: "Address", value: CONTACT_INFO.address },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", minWidth: 90, flexShrink: 0 }}>{item.label}</span>
                {item.isLink ? (
                  <span style={{ fontSize: 15, color: "#3B82F6", fontWeight: 400, wordBreak: "break-all", cursor: "pointer" }}>{item.value}</span>
                ) : (
                  <span style={{ fontSize: 15, color: "#64748b", fontWeight: 400, whiteSpace: "pre-line", lineHeight: 1.5 }}>{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Investment Profile Card */}
        <div style={{ ...cardBase, padding: "24px 20px" }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", margin: "0 0 24px", letterSpacing: "-0.01em" }}>Investment Profile</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {[
              { Icon: TbCurrencyDollar, label: "Investment Range", value: CONTACT_INFO.investmentRange, iconBg: "#EFF6FF", iconColor: "#3B82F6" },
              { Icon: TbTargetArrow, label: "Stage", value: CONTACT_INFO.stage, iconBg: "#F3F4F6", iconColor: "#6B7280" },
              { Icon: TbMapPin, label: "Geographic Focus", value: CONTACT_INFO.geographicFocus, iconBg: "#F3F4F6", iconColor: "#6B7280" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: item.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <item.Icon size={20} color={item.iconColor} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 400, marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" }}>{item.value}</div>
                </div>
              </div>
            ))}

            {/* Investment Focus with tags */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer" }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "#F3F4F6",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <TbBuilding size={20} color="#6B7280" strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 400, marginBottom: 8 }}>Investment Focus</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {CONTACT_INFO.investmentFocus.map(tag => (
                    <span key={tag} style={{
                      fontSize: 14, fontWeight: 500, color: "#3B82F6",
                      background: "#EFF6FF", border: "1px solid #DBEAFE",
                      borderRadius: 10, padding: "5px 16px",
                      cursor: "pointer",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Card */}
        <div style={{ ...cardBase, padding: "24px 20px" }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", margin: "0 0 24px", letterSpacing: "-0.01em" }}>Timeline</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "#EFF6FF",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <TbCalendar size={20} color="#3B82F6" strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 400, marginBottom: 3 }}>Registered</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" }}>{CONTACT_INFO.registered}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "#F3E8FF",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <TbClock size={20} color="#7C3AED" strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 400, marginBottom: 3 }}>Last Updated</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" }}>{CONTACT_INFO.lastUpdated}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Conversation Item Component ──────────────────────────────────────────────

function ConversationItem({
  conversation,
  isSelected,
  onSelect,
}: {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 12px",
        borderRadius: 14,
        cursor: "pointer",
        background: isSelected ? "#EFF6FF" : hovered ? "#f9fafb" : "transparent",
        borderLeft: isSelected ? "3px solid #3B82F6" : "3px solid transparent",
        transition: "background 0.15s, border-color 0.15s",
        marginBottom: 4,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden" }}>
          {conversation.avatar ? (
            <Image src={conversation.avatar} alt={conversation.name} width={48} height={48} style={{ objectFit: "cover" }} />
          ) : (
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: "#6B9BF7", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 600, color: "#fff",
            }}>
              {conversation.initials}
            </div>
          )}
        </div>
        {conversation.online && (
          <span style={{
            position: "absolute", bottom: 1, right: 1,
            width: 12, height: 12, borderRadius: "50%",
            background: "#10B981", border: "2px solid #fff",
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", lineHeight: 1.3, marginBottom: 2 }}>
          {conversation.name}
        </div>
        <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400, marginBottom: 2 }}>
          {conversation.company}
        </div>
        <div style={{
          fontSize: 13, color: "#64748b", fontWeight: 400,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {conversation.lastMessage}
        </div>
      </div>

      {/* Timestamp */}
      <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400, flexShrink: 0, alignSelf: "flex-start", marginTop: 2 }}>
        {conversation.timestamp}
      </span>
    </div>
  );
}
