import { useState, useEffect, useRef, useCallback } from "react";
import Anthropic from "@anthropic-ai/sdk";

// ─── BRAND TOKENS ───
const T = {
  dark: "#0f1729",
  navy: "#1b2a4a",
  accent: "#2e75b6",
  accentLight: "#4a9eed",
  surface: "#f8fafb",
  card: "#ffffff",
  border: "#e2e8f0",
  text: "#1e293b",
  textMid: "#475569",
  textLight: "#94a3b8",
  green: "#059669",
  greenBg: "#ecfdf5",
  amber: "#d97706",
  amberBg: "#fffbeb",
  red: "#dc2626",
  redBg: "#fef2f2",
};

// ─── MODULE DATA ───
const MODULES = [
  {
    id: "m1",
    title: "Castle Horizon Group",
    subtitle: "What we are and why we exist",
    domain: "1 — Strategy",
    duration: 8,
    icon: "🏰",
    content: [
      { type: "intro", text: "Castle Horizon Group is a UK-based holding company operating across housing, care, and technology. The group follows an asset-light, buy-and-build model targeting essential services — temporary accommodation, social housing, supported living — underpinned by a proprietary AI-powered back-office technology platform." },
      { type: "heading", text: "The Core Thesis" },
      { type: "text", text: "Most small-to-medium service businesses run on manual, fragmented processes. Castle Horizon acquires these businesses, improves them with technology and systems, and scales them within a unified operating model. The technology platform — CastleAgentIQ — is being built to serve the group's own operating businesses first, then scale as a standalone SaaS product." },
      { type: "heading", text: "Leadership Model" },
      { type: "text", text: "The group is founder-led by Magnus Strom and Aksana Green. Magnus sets strategy and product direction; Aksana drives operations and execution. The leadership model is remote-first, with team members distributed across multiple geographies. Asynchronous communication, structured documentation, and clear ownership are non-negotiable operating principles." },
      { type: "keypoint", text: "Remember: asset-light model + technology-enabled operations + disciplined acquisition = the Castle Horizon Group playbook." },
    ],
    checks: [
      { q: "What is Castle Horizon Group's core business model?", options: ["Asset-heavy property development", "Asset-light buy-and-build targeting service businesses", "Pure technology company", "Franchise operation"], answer: 1 },
      { q: "Who drives operational execution in the group?", options: ["Magnus Strom", "Aksana Green", "The Board of Directors", "External consultants"], answer: 1 },
    ],
  },
  {
    id: "m2",
    title: "Group Structure",
    subtitle: "Subsidiaries and legal entities",
    domain: "1 — Strategy",
    duration: 10,
    icon: "🏗️",
    content: [
      { type: "intro", text: "Castle Horizon Group Ltd is the parent company. Five subsidiaries sit beneath it, plus the technology business which operates through a separate legal entity in Belize." },
      { type: "entity", name: "Vitae Investments Ltd", desc: "Social housing portfolio — 16 assets across Southern England. Currently marked for 2026 sale on lease-back terms. You do not need to be deeply involved in this workstream, but awareness of it is important." },
      { type: "entity", name: "Castle Conversions Ltd", desc: "Property development vehicle. Future SPVs (Special Purpose Vehicles) will be created under this entity for specific development projects." },
      { type: "entity", name: "Castle Accommodation Ltd", desc: "Temporary accommodation for local authorities. This is an active operational business and a key user of AgentIQ tools." },
      { type: "entity", name: "Castle Support Homes", desc: "Future CQC-regulated supported living acquisitions. Pre-acquisition stage — this is where the buy-and-build strategy will be most visible." },
      { type: "entity", name: "Secure Steps Support CIC", desc: "Community Interest Company. Active and contributing to the group's social impact mission." },
      { type: "entity", name: "Coconut Drift Ltd (Belize)", desc: "Holds the CastleAgentIQ software IP. This is the legal entity through which all AgentIQ products operate. Your employment/contract will relate to this entity." },
      { type: "heading", text: "Key People" },
      { type: "principle", label: "Magnus Strom", text: "Founder & Director. Your primary contact for strategy, product direction, and priorities." },
      { type: "principle", label: "Aksana Green", text: "Co-founder & Operations. Operational decisions, process ownership, day-to-day business context." },
      { type: "principle", label: "Marisa", text: "Executive Assistant & Operations Coordinator. Integral to daily operations across all subsidiaries. Manages scheduling, internal communications, task tracking, and operational coordination. Your go-to for process questions, access requests, and keeping things moving." },
      { type: "principle", label: "Rob Clare", text: "Financial Adviser. Group financial structure, Vitae Investments Ltd portfolio, bond products." },
      { type: "keypoint", text: "Your onboarding contacts are Magnus and Marisa. Magnus for strategy and product direction; Marisa for operational coordination, access provisioning, and day-to-day questions." },
    ],
    checks: [
      { q: "Which entity holds the CastleAgentIQ software IP?", options: ["Castle Horizon Group Ltd", "Vitae Investments Ltd", "Coconut Drift Ltd (Belize)", "Castle Conversions Ltd"], answer: 2 },
      { q: "Which subsidiary provides temporary accommodation to local authorities?", options: ["Castle Support Homes", "Castle Accommodation Ltd", "Secure Steps Support CIC", "Vitae Investments Ltd"], answer: 1 },
    ],
  },
  {
    id: "m3",
    title: "Operating Philosophy",
    subtitle: "How we think and work",
    domain: "5 — People",
    duration: 6,
    icon: "🧭",
    content: [
      { type: "intro", text: "Four principles define how Castle Horizon Group operates. These are not aspirational statements — they are daily operating constraints." },
      { type: "principle", label: "Asset-Light", text: "We prefer management contracts, lease-backs, and intellectual property over heavy balance-sheet assets. Capital is deployed for returns, not for ownership pride." },
      { type: "principle", label: "Buy-and-Build", text: "Growth through disciplined acquisition of small, unglamorous service businesses, improved with technology and systems. We don't build from scratch when we can acquire and improve." },
      { type: "principle", label: "Remote-First", text: "The team is geographically distributed. Async communication is the default. Structured documentation and clear ownership replace office presence." },
      { type: "principle", label: "Technology-Enabled", text: "Every operational process should be measurable, automatable, or improvable through the AgentIQ platform. If it can't be measured, it can't be managed." },
      { type: "keypoint", text: "These four principles will inform every decision you make in this role. When in doubt, ask: does this make us lighter, more systematic, more autonomous, or more measurable?" },
    ],
    checks: [
      { q: "What is the default communication mode?", options: ["Daily standup calls", "In-person meetings", "Asynchronous written communication", "Slack huddles"], answer: 2 },
    ],
  },
  {
    id: "m4",
    title: "CastleAgentIQ Vision",
    subtitle: "What we're building and why",
    domain: "6 — Tech",
    duration: 8,
    icon: "🤖",
    content: [
      { type: "intro", text: "CastleAgentIQ is a suite of AI-powered back-office tools designed to automate, measure, and improve operational processes across Castle Horizon Group's service businesses." },
      { type: "heading", text: "The Problem We Solve" },
      { type: "text", text: "Most small-to-medium service businesses (housing, care, recruitment) run on manual, fragmented processes — spreadsheets, email chains, tribal knowledge. This creates inefficiency, inconsistency, and key-person dependency. AgentIQ replaces those with intelligent, integrated workflows." },
      { type: "heading", text: "Build Strategy" },
      { type: "text", text: "We are not selling generic AI. We solve specific operational problems encountered in our own businesses first, validate the solution internally, then package it for external customers. Every AgentIQ product starts as an internal tool with a real user." },
      { type: "heading", text: "The Lumo System" },
      { type: "text", text: "Across the group, Claude (Anthropic) is used as an embedded operational assistant referred to as 'Lumo.' Lumo is not a chatbot bolted on — it is integrated into how strategy is developed, documents are produced, products are prototyped, and decisions are structured. You will work with and alongside Lumo daily." },
      { type: "keypoint", text: "AgentIQ products are built from real operational pain, validated internally, then commercialised. That sequence is non-negotiable." },
    ],
    checks: [
      { q: "What is 'Lumo'?", options: ["A competitor product", "The group's AI-assisted operational system built on Claude", "A project management tool", "An external consultancy"], answer: 1 },
      { q: "How are AgentIQ products validated?", options: ["Market research first", "Internal deployment first, then external", "External beta testing", "Academic review"], answer: 1 },
    ],
  },
  {
    id: "m5",
    title: "The Product Suite",
    subtitle: "Current and planned AgentIQ products",
    domain: "6 — Tech",
    duration: 12,
    icon: "📦",
    content: [
      { type: "intro", text: "Your role spans all AgentIQ products in terms of technical operations, QA, deployment, and support. Here is the full suite at various stages of development." },
      { type: "product", name: "TalentIQ / HorizonHeads", status: "Live", desc: "Recruitment platform deployed at horizonheads.com (Cloudflare). Handles job listings, applicant intake, and candidate pipeline management for Castle Horizon Group and external clients." },
      { type: "product", name: "BondIQ", status: "Live", desc: "Investor management and client portal for Vitae Investments Norge AS. Bond product information, investor communications, and portfolio reporting." },
      { type: "product", name: "InvoxIQ", status: "Early Build", desc: "Invoice and receipt management including expense reports and mileage tracking. Connects to QuickBooks and Revolut Banking." },
      { type: "product", name: "MetrIQ", status: "Design", desc: "Business performance dashboards. Real-time KPIs, financial metrics, and operational health indicators across subsidiaries with full temporal context." },
      { type: "product", name: "AdeptIQ", status: "Prototype", desc: "SOP-to-learning-module converter. Takes structured operational knowledge and produces interactive onboarding and training content. You are experiencing this prototype right now." },
      { type: "product", name: "ForensIQ", status: "Concept", desc: "Document and file structure crawler. Analyses folder structures, identifies gaps, flags inconsistencies. The ingestion engine that feeds AdeptIQ and the shared knowledge store." },
      { type: "product", name: "DynamIQ", status: "Concept", desc: "Full CRM and outbound marketing suite. Lead management, email sequences, campaign tracking, and pipeline analytics." },
      { type: "product", name: "AscendIQ", status: "Concept", desc: "Post-acquisition improvement toolkit. Identifies areas of improvement in acquired businesses and tracks elevation of quality and professionalism." },
      { type: "product", name: "StrategIQ", status: "Concept", desc: "Goal setting and strategic management follow-up. Closely related to AscendIQ — potential future merge." },
      { type: "product", name: "ScoutIQ", status: "Concept", desc: "Business sourcing and acquisition target identification. Deal pipeline, scoring criteria, and due diligence coordination." },
      { type: "product", name: "LocatIQ", status: "Concept", desc: "Property sourcing and opportunity identification for the property portfolio." },
      { type: "product", name: "EstateIQ", status: "Concept", desc: "Property development project management for Castle Conversions Ltd projects." },
      { type: "product", name: "Horizon Command Centre", status: "Design", desc: "Executive intelligence hub. Aria executive assistant, email triage and routing, WorldPulse geopolitical intelligence, and Personal Estate management." },
      { type: "product", name: "Management Portal", status: "Concept", desc: "Care operations management platform for Castle Support Homes. CQC compliance, staff scheduling, incident tracking." },
      { type: "product", name: "HA-AI", status: "Concept", desc: "Home Assistant automation and server maintenance. Smart home control, monitoring, and AI-powered automation." },
      { type: "keypoint", text: "HorizonHeads and BondIQ are live. InvoxIQ is in early build. All products plug into ConnectIQ as modules — the central platform you will help build and operate." },
    ],
    checks: [
      { q: "Which products are currently live and deployed?", options: ["InvoxIQ and MetrIQ", "TalentIQ / HorizonHeads and BondIQ", "AdeptIQ and ForensIQ", "DynamIQ and ScoutIQ"], answer: 1 },
      { q: "What is InvoxIQ?", options: ["Email triage system", "Invoice and receipt management", "CRM platform", "Recruitment tool"], answer: 1 },
      { q: "What is AdeptIQ?", options: ["Email triage system", "SOP-to-learning-module converter", "Financial dashboard", "Recruitment platform"], answer: 1 },
    ],
  },
  {
    id: "m6",
    title: "Technical Environment",
    subtitle: "Stack, infrastructure, and architecture",
    domain: "6 — Tech",
    duration: 8,
    icon: "⚙️",
    content: [
      { type: "intro", text: "The current technical stack is lean by design. You are not inheriting a legacy codebase — much of this is greenfield. Your input on architecture, tooling, and DevOps decisions is expected from day one." },
      { type: "stack", label: "Hosting & CDN", value: "Cloudflare (Pages, Workers, DNS)" },
      { type: "stack", label: "AI Layer", value: "Anthropic Claude API (primary), architecture designed for model flexibility" },
      { type: "stack", label: "Frontend", value: "Web-based interfaces (React / HTML-JS as appropriate per product)" },
      { type: "stack", label: "Backend", value: "Node.js / Python depending on product; serverless-first where practical" },
      { type: "stack", label: "Data", value: "Structured storage TBD per product; current focus is schema design and integration architecture" },
      { type: "stack", label: "Version Control", value: "GitHub" },
      { type: "stack", label: "Communication", value: "Async-first. Slack / email for real-time when needed." },
      { type: "heading", text: "How Products Get Built" },
      { type: "text", text: "This is not a traditional dev shop. Magnus works extensively with Lumo to design, prototype, and iterate on products. The workflow: Magnus defines the problem and desired outcome → Rapid AI-assisted prototyping → You productionise (testing, hardening, deployment, monitoring) → Iterate based on internal feedback." },
      { type: "keypoint", text: "You need to be comfortable working with AI-generated code, able to assess and improve it, and willing to operate in a fast-moving, ambiguity-tolerant environment." },
    ],
    checks: [
      { q: "What is the primary hosting platform?", options: ["AWS", "Cloudflare", "Vercel", "Azure"], answer: 1 },
      { q: "What is your core role in the product development workflow?", options: ["Write all code from scratch", "Productionise prototypes — testing, hardening, deployment, monitoring", "Manage a team of developers", "Create product requirements documents"], answer: 1 },
    ],
  },
  {
    id: "m7",
    title: "Your Role",
    subtitle: "Technical Operations Lead — what success looks like",
    domain: "5 — People",
    duration: 10,
    icon: "🎯",
    content: [
      { type: "intro", text: "You are being hired to own the technical operations layer of CastleAgentIQ. You sit between product vision (Magnus) and reliable, deployed, monitored software. You are not a pure developer — you are an operator who can code, debug, deploy, and improve systems." },
      { type: "heading", text: "Core Responsibilities" },
      { type: "list", items: [
        "Take AI-assisted prototypes and productionise them",
        "Own the deployment pipeline: CI/CD, staging, release management",
        "Manage infrastructure: Cloudflare, DNS, serverless, API integrations",
        "Establish QA and reliability practices",
        "Maintain technical documentation for all products",
        "Contribute to architecture decisions (data models, API design, integrations)",
        "Co-build InvoxIQ and MetrIQ with Magnus, Marisa, and the Business Controller",
      ]},
      { type: "heading", text: "First 90 Days" },
      { type: "milestone", label: "Days 1–30", text: "Orientation and assessment. Understand the group, products, and current deployments. Audit HorizonHeads. Document what exists, what's missing, and where the risks are." },
      { type: "milestone", label: "Days 31–60", text: "Ownership. Take operational ownership of HorizonHeads. Propose and begin implementing deployment and monitoring practices. Start scoping InvoxIQ technical requirements." },
      { type: "milestone", label: "Days 61–90", text: "Building. Deliver first deployable increment of InvoxIQ or MetrIQ. Establish a working rhythm with Magnus. Demonstrate independent technical judgement." },
    ],
    checks: [
      { q: "What is your first operational responsibility?", options: ["Build InvoxIQ from scratch", "Audit and take ownership of HorizonHeads", "Hire a development team", "Redesign the group website"], answer: 1 },
    ],
  },
  {
    id: "m8",
    title: "Working With Magnus & Marisa",
    subtitle: "Communication style and expectations",
    domain: "5 — People",
    duration: 5,
    icon: "🤝",
    content: [
      { type: "intro", text: "A few things that will help you work effectively with the founder and the operations coordinator." },
      { type: "principle", label: "Be Direct", text: "Magnus is direct and expects directness in return. If something is unclear, say so. If you disagree, say so with reasoning." },
      { type: "principle", label: "Think in Systems", text: "Frame updates as systems, not activities. Not 'I did X' but 'X is done, which unblocks Y, and the next dependency is Z.'" },
      { type: "principle", label: "Initiative Over Permission", text: "If you can see the right thing to do, do it. Brief after, not before. The role rewards autonomous decision-making." },
      { type: "principle", label: "Be Specific", text: "'Soon', 'maybe', and 'I think so' are red flags. Be specific about timelines, blockers, and confidence levels." },
      { type: "principle", label: "Async Default", text: "Send structured written updates rather than scheduling calls for things that can be documented. Calls are for alignment and complex decisions." },
      { type: "keypoint", text: "The pattern: do the work → document what you did and what it unblocks → share async → escalate only when blocked or when the decision has significant consequences." },
      { type: "heading", text: "Working With Marisa" },
      { type: "text", text: "Marisa is the operational backbone of the group. She coordinates across all subsidiaries, keeps tasks and deadlines on track, and ensures nothing falls through the cracks. Treat her as your operational partner, not an assistant. If you need something unblocked, something chased, or something coordinated across the group — Marisa is your first call." },
    ],
    checks: [
      { q: "What is the preferred communication mode?", options: ["Schedule a video call for every update", "Send structured written updates asynchronously", "Wait to be asked for updates", "Use voice notes"], answer: 1 },
      { q: "When should you ask permission before acting?", options: ["Always", "When the decision has significant consequences", "Never", "Only on Mondays"], answer: 1 },
    ],
  },
];

// ─── STORAGE HELPERS ───
const STORAGE_KEY = "adeptiq-progress";
const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";
const ANTHROPIC_MAX_TOKENS = 1000;
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

async function loadProgress() {
  try {
    const r = await window.storage.get(STORAGE_KEY);
    return r ? JSON.parse(r.value) : null;
  } catch (error) {
    console.error("[AdeptIQ] Failed to load progress", { message: error.message });
    return null;
  }
}

async function saveProgress(data) {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("[AdeptIQ] Failed to save progress", { message: error.message });
  }
}

// ─── COMPONENTS ───

function ProgressRing({ pct, size = 40, stroke = 3 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={pct >= 100 ? T.green : T.accent}
        strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
    </svg>
  );
}

function VideoSlot({ title }) {
  return (
    <div style={{ background: T.dark, borderRadius: 12, padding: "40px 24px", textAlign: "center",
      marginBottom: 20, border: `1px solid ${T.navy}` }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
      <div style={{ color: T.textLight, fontSize: 14, fontWeight: 500 }}>VIDEO MODULE</div>
      <div style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "8px 0" }}>{title}</div>
      <div style={{ color: T.textLight, fontSize: 13 }}>
        AI-generated video will appear here once produced via HeyGen/Synthesia
      </div>
      <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6,
        background: "rgba(46,117,182,0.2)", color: T.accentLight, padding: "6px 14px",
        borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
        ◷ Pending generation
      </div>
    </div>
  );
}

function ContentRenderer({ items }) {
  return items.map((item, i) => {
    switch (item.type) {
      case "intro": return (
        <div key={i} style={{ fontSize: 16, lineHeight: 1.7, color: T.text, padding: "16px 20px",
          background: "linear-gradient(135deg, #eef4fb 0%, #f0f7ff 100%)",
          borderLeft: `3px solid ${T.accent}`, borderRadius: "0 8px 8px 0", marginBottom: 20 }}>
          {item.text}
        </div>
      );
      case "heading": return (
        <h3 key={i} style={{ fontSize: 18, fontWeight: 700, color: T.navy, margin: "28px 0 12px",
          letterSpacing: "-0.01em" }}>{item.text}</h3>
      );
      case "text": return (
        <p key={i} style={{ fontSize: 15, lineHeight: 1.75, color: T.textMid, margin: "0 0 16px" }}>
          {item.text}
        </p>
      );
      case "keypoint": return (
        <div key={i} style={{ background: T.amberBg, border: `1px solid #fde68a`, borderRadius: 8,
          padding: "14px 18px", margin: "20px 0", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 18 }}>💡</span>
          <span style={{ fontSize: 14, lineHeight: 1.65, color: "#92400e", fontWeight: 500 }}>{item.text}</span>
        </div>
      );
      case "entity": return (
        <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8,
          padding: "14px 18px", marginBottom: 10 }}>
          <div style={{ fontWeight: 700, color: T.navy, fontSize: 15, marginBottom: 4 }}>{item.name}</div>
          <div style={{ color: T.textMid, fontSize: 14, lineHeight: 1.6 }}>{item.desc}</div>
        </div>
      );
      case "principle": return (
        <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
          <div style={{ background: T.accent, color: "#fff", borderRadius: 6, padding: "4px 10px",
            fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", marginTop: 2, letterSpacing: "0.02em" }}>
            {item.label}
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.65, color: T.textMid }}>{item.text}</div>
        </div>
      );
      case "product": return (
        <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8,
          padding: "14px 18px", marginBottom: 10, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ background: item.status === "Live" ? T.greenBg : item.status === "Early Build" ? T.amberBg : "#f1f5f9",
            color: item.status === "Live" ? T.green : item.status === "Early Build" ? T.amber : T.textLight,
            borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", marginTop: 2 }}>
            {item.status}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: T.navy, fontSize: 15, marginBottom: 4 }}>{item.name}</div>
            <div style={{ color: T.textMid, fontSize: 14, lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        </div>
      );
      case "stack": return (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "baseline" }}>
          <span style={{ fontWeight: 700, color: T.navy, fontSize: 14, minWidth: 140 }}>{item.label}</span>
          <span style={{ color: T.textMid, fontSize: 14 }}>{item.value}</span>
        </div>
      );
      case "list": return (
        <div key={i} style={{ marginBottom: 16 }}>
          {item.items.map((li, j) => (
            <div key={j} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ color: T.accent, marginTop: 2, fontSize: 8 }}>●</span>
              <span style={{ fontSize: 15, lineHeight: 1.6, color: T.textMid }}>{li}</span>
            </div>
          ))}
        </div>
      );
      case "milestone": return (
        <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
          <div style={{ background: T.navy, color: "#fff", borderRadius: 6, padding: "4px 10px",
            fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", marginTop: 2 }}>{item.label}</div>
          <div style={{ fontSize: 15, lineHeight: 1.65, color: T.textMid }}>{item.text}</div>
        </div>
      );
      default: return null;
    }
  });
}

function KnowledgeCheck({ checks, onPass, alreadyPassed }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(alreadyPassed);
  const allCorrect = checks.every((c, i) => answers[i] === c.answer);

  const handleSubmit = () => {
    setSubmitted(true);
    if (allCorrect) onPass();
  };

  if (alreadyPassed) return (
    <div style={{ background: T.greenBg, border: `1px solid #a7f3d0`, borderRadius: 10,
      padding: "16px 20px", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 20 }}>✅</span>
      <span style={{ color: T.green, fontWeight: 600, fontSize: 15 }}>Knowledge check passed</span>
    </div>
  );

  return (
    <div style={{ background: "#f8fafc", border: `1px solid ${T.border}`, borderRadius: 10, padding: 20 }}>
      <div style={{ fontWeight: 700, color: T.navy, fontSize: 16, marginBottom: 16, display: "flex",
        alignItems: "center", gap: 8 }}>
        <span>📝</span> Knowledge Check
      </div>
      {checks.map((c, ci) => (
        <div key={ci} style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, color: T.text, fontSize: 14, marginBottom: 10 }}>{c.q}</div>
          {c.options.map((opt, oi) => {
            const selected = answers[ci] === oi;
            const isCorrect = c.answer === oi;
            const showResult = submitted;
            let bg = T.card, bdr = T.border, col = T.text;
            if (showResult && selected && isCorrect) { bg = T.greenBg; bdr = T.green; col = T.green; }
            else if (showResult && selected && !isCorrect) { bg = T.redBg; bdr = T.red; col = T.red; }
            else if (showResult && isCorrect) { bg = T.greenBg; bdr = "#a7f3d0"; }
            else if (selected) { bg = "#eef4fb"; bdr = T.accent; col = T.accent; }
            return (
              <div key={oi} onClick={() => !submitted && setAnswers(a => ({ ...a, [ci]: oi }))}
                style={{ padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${bdr}`,
                  background: bg, marginBottom: 6, cursor: submitted ? "default" : "pointer",
                  color: col, fontSize: 14, fontWeight: selected ? 600 : 400,
                  transition: "all 0.15s ease" }}>
                {opt}
              </div>
            );
          })}
        </div>
      ))}
      {!submitted ? (
        <button onClick={handleSubmit}
          disabled={Object.keys(answers).length < checks.length}
          style={{ background: Object.keys(answers).length < checks.length ? T.border : T.accent,
            color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px",
            fontWeight: 600, fontSize: 14, cursor: Object.keys(answers).length < checks.length ? "default" : "pointer" }}>
          Check Answers
        </button>
      ) : !allCorrect ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <span style={{ color: T.red, fontWeight: 600, fontSize: 14 }}>Some answers need another look.</span>
          <button onClick={() => { setSubmitted(false); setAnswers({}); }}
            style={{ background: T.accent, color: "#fff", border: "none", borderRadius: 8,
              padding: "8px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Retry
          </button>
        </div>
      ) : null}
    </div>
  );
}

function LumoAssistant({ moduleTitle, moduleContent }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      if (!ANTHROPIC_API_KEY) {
        throw new Error("Missing VITE_ANTHROPIC_API_KEY.");
      }

      const context = moduleContent.map(c => c.text || c.desc || c.value || c.items?.join(", ") || "").filter(Boolean).join("\n");
      const history = [...messages, { role: "user", content: userMsg }].map(m => ({
        role: m.role, content: m.content
      }));

      const client = new Anthropic({
        apiKey: ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const startedAt = performance.now();
      const data = await client.messages.create({
        model: ANTHROPIC_MODEL,
        max_tokens: ANTHROPIC_MAX_TOKENS,
        system: `You are Lumo, the AI advisor for Castle Horizon Group. You are embedded within the AdeptIQ learning platform, assisting a new hire (Technical Operations Lead for CastleAgentIQ) who is working through their onboarding modules.\n\nThe learner is currently on the module: "${moduleTitle}"\n\nModule content:\n${context}\n\nAnswer questions about this module and the broader Castle Horizon Group context. Be direct, structured, and helpful. Keep answers concise - 2-3 paragraphs maximum. If the question is outside the scope of what you know from this module, say so honestly.`,
        messages: history,
      });
      const latencyMs = Math.round(performance.now() - startedAt);

      console.info("[AdeptIQ] Claude response metadata", {
        latencyMs,
        inputTokens: data.usage?.input_tokens ?? 0,
        outputTokens: data.usage?.output_tokens ?? 0,
      });

      const reply = data.content?.map(c => c.text || "").join("") || "Sorry, I couldn't process that.";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("[AdeptIQ] Lumo assistant request failed", { message: error.message });
      setMessages(m => [...m, { role: "assistant", content: "Connection issue — please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return (
    <div onClick={() => setOpen(true)}
      style={{ position: "fixed", bottom: 20, right: 20, width: 56, height: 56,
        borderRadius: "50%", background: `linear-gradient(135deg, ${T.navy} 0%, ${T.accent} 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", boxShadow: "0 4px 20px rgba(15,23,41,0.3)",
        zIndex: 1000, transition: "transform 0.15s", fontSize: 24 }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
      💬
    </div>
  );

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, width: 380, maxWidth: "calc(100vw - 40px)",
      height: 480, maxHeight: "calc(100vh - 40px)",
      background: T.card, borderRadius: 16, boxShadow: "0 8px 40px rgba(15,23,41,0.2)",
      display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 1000,
      border: `1px solid ${T.border}` }}>
      <div style={{ background: T.navy, padding: "14px 18px", display: "flex",
        justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Ask Lumo</div>
          <div style={{ color: T.textLight, fontSize: 12 }}>Module: {moduleTitle}</div>
        </div>
        <div onClick={() => setOpen(false)}
          style={{ color: T.textLight, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 14 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: 20, color: T.textLight, fontSize: 13 }}>
            Ask any question about this module or the group.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 10 }}>
            <div style={{ maxWidth: "85%", padding: "10px 14px", borderRadius: 12,
              background: m.role === "user" ? T.accent : "#f1f5f9",
              color: m.role === "user" ? "#fff" : T.text,
              fontSize: 14, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 4, padding: "10px 14px" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: T.textLight,
                animation: `pulse 1s ${i * 0.15}s infinite` }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ padding: 12, borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ask a question..."
          style={{ flex: 1, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px",
            fontSize: 14, outline: "none", background: T.surface }} />
        <button onClick={sendMessage}
          style={{ background: T.accent, color: "#fff", border: "none", borderRadius: 8,
            padding: "8px 14px", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>→</button>
      </div>
    </div>
  );
}

// ─── MAIN APP ───

/**
 * AdeptIQ onboarding prototype application.
 */
export default function AdeptIQ() {
  const [activeModule, setActiveModule] = useState(0);
  const [progress, setProgress] = useState({ completed: {}, checksPassed: {} });
  const [loaded, setLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    loadProgress().then(p => {
      if (p) setProgress(p);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) saveProgress(progress);
  }, [progress, loaded]);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeModule]);

  const markComplete = useCallback((modId) => {
    setProgress(p => ({ ...p, completed: { ...p.completed, [modId]: true } }));
  }, []);

  const markCheckPassed = useCallback((modId) => {
    setProgress(p => ({ ...p, checksPassed: { ...p.checksPassed, [modId]: true } }));
  }, []);

  const completedCount = Object.keys(progress.completed).length;
  const totalModules = MODULES.length;
  const overallPct = Math.round((completedCount / totalModules) * 100);
  const mod = MODULES[activeModule];

  const handleReset = async () => {
    setProgress({ completed: {}, checksPassed: {} });
    try {
      await window.storage.delete(STORAGE_KEY);
    } catch (error) {
      console.error("[AdeptIQ] Failed to reset progress", { message: error.message });
    }
  };

  if (!loaded) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", background: T.surface, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
        <div style={{ color: T.textMid, fontSize: 15 }}>Loading AdeptIQ...</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif",
      background: T.surface, overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        @keyframes pulse { 0%,100% { opacity:0.3 } 50% { opacity:1 } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 49 }} />
      )}

      {/* ─── SIDEBAR ─── */}
      <div style={{
        width: 300, minWidth: 300, background: T.dark, display: "flex", flexDirection: "column",
        overflow: "hidden",
        position: window.innerWidth < 768 ? "fixed" : "relative",
        left: window.innerWidth < 768 ? (sidebarOpen ? 0 : -300) : 0,
        top: 0, bottom: 0, zIndex: 50,
        transition: "left 0.25s ease",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg, ${T.accent} 0%, ${T.accentLight} 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: "#fff" }}>A</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em" }}>AdeptIQ</div>
              <div style={{ color: T.textLight, fontSize: 11, letterSpacing: "0.04em" }}>LEARNING PLATFORM</div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ padding: "0 20px 20px" }}>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ color: T.textLight, fontSize: 12, fontWeight: 500 }}>PROGRESS</span>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{overallPct}%</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
              <div style={{ height: "100%", background: `linear-gradient(90deg, ${T.accent}, ${T.accentLight})`,
                borderRadius: 3, width: `${overallPct}%`, transition: "width 0.5s ease" }} />
            </div>
            <div style={{ color: T.textLight, fontSize: 12, marginTop: 8 }}>
              {completedCount} of {totalModules} modules complete
            </div>
          </div>
        </div>

        {/* Module list */}
        <div style={{ flex: 1, overflow: "auto", padding: "0 12px" }}>
          {MODULES.map((m, i) => {
            const isActive = i === activeModule;
            const isComplete = progress.completed[m.id];
            return (
              <div key={m.id} onClick={() => { setActiveModule(i); setSidebarOpen(false); }}
                style={{ padding: "10px 12px", borderRadius: 8, marginBottom: 2, cursor: "pointer",
                  background: isActive ? "rgba(46,117,182,0.15)" : "transparent",
                  transition: "background 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 14,
                    background: isComplete ? T.green : isActive ? T.accent : "rgba(255,255,255,0.08)",
                    color: "#fff", fontWeight: 600, flexShrink: 0 }}>
                    {isComplete ? "✓" : i + 1}
                  </div>
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ color: isActive ? "#fff" : isComplete ? "#94a3b8" : "#cbd5e1",
                      fontSize: 13, fontWeight: isActive ? 600 : 400, whiteSpace: "nowrap",
                      textOverflow: "ellipsis", overflow: "hidden" }}>
                      {m.title}
                    </div>
                    <div style={{ color: T.textLight, fontSize: 11 }}>{m.duration} min</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div onClick={handleReset}
            style={{ color: T.textLight, fontSize: 12, cursor: "pointer", textAlign: "center",
              padding: 8, borderRadius: 6, transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = T.textLight}>
            ↻ Reset Progress
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ padding: "14px 24px", borderBottom: `1px solid ${T.border}`, background: T.card,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div onClick={() => setSidebarOpen(true)}
              style={{ cursor: "pointer", fontSize: 20, display: window.innerWidth < 768 ? "block" : "none" }}>☰</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.accent, letterSpacing: "0.05em" }}>
                {mod.domain.toUpperCase()}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.navy, letterSpacing: "-0.02em" }}>
                {mod.icon} {mod.title}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.textLight, fontSize: 13 }}>
              ◷ {mod.duration} min
            </div>
            <ProgressRing pct={progress.completed[mod.id] ? 100 : progress.checksPassed[mod.id] ? 70 : 30} />
          </div>
        </div>

        {/* Scrollable content */}
        <div ref={contentRef} style={{ flex: 1, overflow: "auto", padding: "28px 32px 100px",
          maxWidth: 760, width: "100%", margin: "0 auto" }}>

          <div style={{ fontSize: 13, color: T.textLight, marginBottom: 8 }}>
            Module {activeModule + 1} of {totalModules}
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: T.navy, letterSpacing: "-0.02em",
            marginBottom: 4 }}>{mod.title}</h2>
          <p style={{ color: T.textMid, fontSize: 15, marginBottom: 28 }}>{mod.subtitle}</p>

          <VideoSlot title={mod.title} />

          <ContentRenderer items={mod.content} />

          <div style={{ margin: "32px 0" }}>
            <KnowledgeCheck checks={mod.checks}
              alreadyPassed={!!progress.checksPassed[mod.id]}
              onPass={() => markCheckPassed(mod.id)} />
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: 32, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
            <button onClick={() => activeModule > 0 && setActiveModule(activeModule - 1)}
              disabled={activeModule === 0}
              style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8,
                padding: "10px 20px", fontSize: 14, fontWeight: 500, color: activeModule === 0 ? T.textLight : T.text,
                cursor: activeModule === 0 ? "default" : "pointer" }}>
              ← Previous
            </button>

            {!progress.completed[mod.id] ? (
              <button onClick={() => markComplete(mod.id)}
                style={{ background: T.green, color: "#fff", border: "none", borderRadius: 8,
                  padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                ✓ Mark Complete
              </button>
            ) : (
              <span style={{ color: T.green, fontWeight: 600, fontSize: 14 }}>✓ Completed</span>
            )}

            <button onClick={() => activeModule < totalModules - 1 && setActiveModule(activeModule + 1)}
              disabled={activeModule === totalModules - 1}
              style={{ background: activeModule === totalModules - 1 ? T.border : T.accent,
                color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px",
                fontSize: 14, fontWeight: 600,
                cursor: activeModule === totalModules - 1 ? "default" : "pointer" }}>
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* ─── LUMO ASSISTANT ─── */}
      <LumoAssistant moduleTitle={mod.title} moduleContent={mod.content} />
    </div>
  );
}
