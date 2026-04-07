import { useState, useEffect } from "react";

const APPS = [
  { id: "connectiq", name: "ConnectIQ", icon: "🔗", status: "Build", tagline: "Central Operating Platform",
    desc: "The single source of truth. Data platform, application shell, admin interface. Four data layers, temporal engine, GraphQL API. Every other product plugs into ConnectIQ.",
    reads: [], writes: [], color: "#2e75b6" },
  { id: "talentiq", name: "TalentIQ", icon: "👥", status: "Live", tagline: "Recruitment Pipeline",
    desc: "Deployed as HorizonHeads (horizonheads.com). Recruitment platform handling job listings, applicant intake, Loom review, and candidate pipeline management.",
    reads: ["Org Context", "Role Specs"], writes: ["Candidates", "Pipeline Data", "Hiring Records"], color: "#0ea5e9" },
  { id: "bondiq", name: "BondIQ", icon: "💎", status: "Live", tagline: "Investor Management & Portal",
    desc: "Investor management and client portal for Vitae Investments Norge AS. Bond product information, investor communications, and portfolio reporting.",
    reads: ["Business State", "Documents"], writes: ["Investor Records", "Communications"], color: "#a855f7" },
  { id: "invoxiq", name: "InvoxIQ", icon: "🧾", status: "Early Build", tagline: "Invoice & Receipt Management",
    desc: "Invoice and receipt management including expense reports and mileage tracking. Connects to QuickBooks and Revolut Banking.",
    reads: ["Business State", "Org Context"], writes: ["Financial Records", "Expense Data"], color: "#ec4899" },
  { id: "horizon", name: "Horizon Command Centre", icon: "🛰️", status: "Design", tagline: "Executive Intelligence Hub",
    desc: "Executive assistant (Aria), email triage and routing, WorldPulse geopolitical intelligence, and Personal Estate management. The founder's operational cockpit.",
    reads: ["All Layers"], writes: ["Correspondence", "Triage Records", "Briefings"], color: "#f97316" },
  { id: "metriq", name: "MetrIQ", icon: "📊", status: "Design", tagline: "Performance Dashboards",
    desc: "Reads business state records with full temporal context. Renders historical trend dashboards, board packs, and operational health indicators across subsidiaries.",
    reads: ["Business State", "Documents", "Gaps"], writes: [], color: "#f59e0b" },
  { id: "adeptiq", name: "AdeptIQ", icon: "🎓", status: "Prototype", tagline: "Learning & Onboarding",
    desc: "Reads knowledge chunks, generates learning paths and interactive modules with AI video, writes learner progress and training records.",
    reads: ["Chunks", "Relationships"], writes: ["Learning Paths", "Modules", "Learner Progress"], color: "#8b5cf6" },
  { id: "forensiq", name: "ForensIQ", icon: "🔍", status: "Concept", tagline: "Document Intelligence",
    desc: "Ingests raw documents, parses content, creates knowledge chunks, classifies, maps relationships, and detects gaps. Central to due diligence, compliance, and operational knowledge management.",
    reads: ["Documents", "Chunks", "Relationships"], writes: ["Documents", "Chunks", "Relationships", "Gaps"], color: "#6366f1" },
  { id: "dynamiq", name: "DynamIQ", icon: "📣", status: "Concept", tagline: "CRM & Outbound Marketing",
    desc: "Full CRM and outbound marketing suite. Lead management, email sequences, campaign tracking, pipeline analytics.",
    reads: ["Business State", "Org Context"], writes: ["Contacts", "Campaigns", "Pipeline", "Analytics"], color: "#f43f5e" },
  { id: "ascendiq", name: "AscendIQ", icon: "🚀", status: "Concept", tagline: "Post-Acquisition Improvement",
    desc: "Elevates quality and professionalism of acquired businesses. Identifies improvement areas, benchmarks against standards, tracks progress.",
    reads: ["All Layers", "Temporal History"], writes: ["Improvement Plans", "Gaps", "Business State"], color: "#10b981" },
  { id: "strategiq", name: "StrategIQ", icon: "🎯", status: "Concept", tagline: "Strategic Goal Management",
    desc: "Goal setting and strategic follow-up for management. Tracks objectives, milestones, and accountability. Closely related to AscendIQ — potential future merge.",
    reads: ["Business State", "Gaps"], writes: ["Goals", "Milestones", "Progress Records"], color: "#14b8a6" },
  { id: "scoutiq", name: "ScoutIQ", icon: "🔭", status: "Concept", tagline: "Business Sourcing",
    desc: "Identifies, evaluates, and tracks potential acquisition targets. Deal pipeline, scoring criteria, and due diligence coordination.",
    reads: ["Business State", "Documents"], writes: ["Targets", "Deal Pipeline", "Evaluations"], color: "#22c55e" },
  { id: "locatiq", name: "LocatIQ", icon: "📍", status: "Concept", tagline: "Property Sourcing",
    desc: "Property sourcing and opportunity identification. Location analysis, market data, and pipeline tracking for the property portfolio.",
    reads: ["Business State", "Assets"], writes: ["Property Opportunities", "Location Data"], color: "#84cc16" },
  { id: "estateiq", name: "EstateIQ", icon: "🏗️", status: "Concept", tagline: "Development Project Management",
    desc: "Property development project management. Tracks timelines, budgets, contractors, planning permissions, and milestones for Castle Conversions Ltd projects.",
    reads: ["Business State", "Documents", "Assets"], writes: ["Projects", "Milestones", "Budgets"], color: "#059669" },
  { id: "management", name: "Management Portal", icon: "🏥", status: "Concept", tagline: "Care Operations Management",
    desc: "Operational management platform for Castle Support Homes and care service delivery. CQC compliance, staff scheduling, incident tracking, resident management.",
    reads: ["Business State", "Documents", "Compliance"], writes: ["Care Records", "Incidents", "Schedules"], color: "#eab308" },
  { id: "haai", name: "HA-AI", icon: "🏠", status: "Concept", tagline: "Home Automation & Server Ops",
    desc: "Home Assistant automation and server maintenance. Smart home control, monitoring, and AI-powered automation routines.",
    reads: ["Device State"], writes: ["Automation Rules", "Logs"], color: "#64748b" },
  { id: "general", name: "General / Cross-Product", icon: "💡", status: "", tagline: "Platform-wide ideas",
    desc: "Notes that span multiple products.", reads: [], writes: [], color: "#94a3b8" },
];

const CATEGORIES = [
  { id: "feature", label: "Feature Idea", color: "#6366f1", icon: "✨" },
  { id: "change", label: "Change / Improvement", color: "#f59e0b", icon: "🔄" },
  { id: "strategic", label: "Strategic Thought", color: "#2e75b6", icon: "🧭" },
  { id: "question", label: "Open Question", color: "#ec4899", icon: "❓" },
  { id: "priority", label: "Priority / Urgent", color: "#dc2626", icon: "🔥" },
  { id: "integration", label: "Integration Idea", color: "#10b981", icon: "🔗" },
];

const LAYERS = [
  { id: "l1", name: "Layer 1: Document Registry", desc: "Master record of every file. Metadata, classification, version chains, deduplication.", color: "#1e3a5f" },
  { id: "l2", name: "Layer 2: Knowledge Chunks", desc: "Self-contained units of knowledge extracted from documents.", color: "#1e4d6f" },
  { id: "l3", name: "Layer 3: Relationships & Gaps", desc: "Knowledge graph. Dependencies, references, contradictions. Gap detection.", color: "#1e5f7f" },
  { id: "l4", name: "Layer 4: Business State", desc: "Temporal structured data. KPIs, financials, headcount, assets.", color: "#1e718f" },
];

const DOMAINS = [
  { num: 1, name: "Strategy, Risk & Governance", color: "#1e3a5f" },
  { num: 2, name: "Growth & Business Development", color: "#0ea5e9" },
  { num: 3, name: "Operations & Delivery", color: "#10b981" },
  { num: 4, name: "Finance & Performance", color: "#f59e0b" },
  { num: 5, name: "People & Culture", color: "#ec4899" },
  { num: 6, name: "Tech, Data & AI Platform", color: "#6366f1" },
  { num: 7, name: "Everything Else", color: "#94a3b8" },
];

const INFRA = [
  { name: "Cloudflare", role: "Edge, CDN, DNS, Pages, Workers", tier: 1 },
  { name: "Supabase", role: "PostgreSQL, Auth, Storage, Admin", tier: 1 },
  { name: "GitHub", role: "Source Control, CI/CD (Actions)", tier: 1 },
  { name: "Claude API", role: "AI Layer (Anthropic)", tier: 1 },
  { name: "Railway", role: "Persistent processes, workers", tier: 2 },
  { name: "HeyGen", role: "AI video generation", tier: 2 },
];

const statusColor = s => s==="Live"?"#059669":s==="Early Build"?"#d97706":s==="Prototype"?"#8b5cf6":s==="Design"?"#0ea5e9":s==="Build"?"#2e75b6":"#94a3b8";
const statusBg = s => s==="Live"?"#ecfdf5":s==="Early Build"?"#fffbeb":s==="Prototype"?"#f5f3ff":s==="Design"?"#f0f9ff":s==="Build"?"#eff6ff":"#f8fafc";
const statusOrder = {"Live":0,"Early Build":1,"Build":2,"Prototype":3,"Design":4,"Concept":5};

const NOTES_KEY = "ecosystem-notes-v3";
async function loadNotes() { try { const r = await window.storage.get(NOTES_KEY); return r ? JSON.parse(r.value) : []; } catch { return []; } }
async function saveNotes(notes) { try { await window.storage.set(NOTES_KEY, JSON.stringify(notes)); } catch {} }
function formatDate(ts) { const d=new Date(ts); const m=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()} ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`; }

export default function EcosystemMap() {
  const [view, setView] = useState("ecosystem");
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [noteFilter, setNoteFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState({ product: "general", category: "feature", title: "", body: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { loadNotes().then(n => { setNotes(n); setLoaded(true); }); }, []);
  useEffect(() => { if (loaded) saveNotes(notes); }, [notes, loaded]);

  const addNote = () => { if (!newNote.title.trim()) return; if (editingId) { setNotes(p=>p.map(n=>n.id===editingId?{...n,...newNote,updated_at:Date.now()}:n)); setEditingId(null); } else { setNotes(p=>[{id:Date.now().toString(),...newNote,created_at:Date.now(),updated_at:Date.now()},...p]); } setNewNote({product:"general",category:"feature",title:"",body:""}); setShowAddNote(false); };
  const deleteNote = id => setNotes(p => p.filter(n => n.id !== id));
  const editNote = note => { setNewNote({product:note.product,category:note.category,title:note.title,body:note.body}); setEditingId(note.id); setShowAddNote(true); };
  const filteredNotes = notes.filter(n => { if (noteFilter!=="all"&&n.product!==noteFilter) return false; if (catFilter!=="all"&&n.category!==catFilter) return false; if (searchTerm&&!n.title.toLowerCase().includes(searchTerm.toLowerCase())&&!(n.body||"").toLowerCase().includes(searchTerm.toLowerCase())) return false; return true; });

  const productApps = APPS.filter(a => a.id !== "general" && a.id !== "connectiq");
  const noteCounts = {}; notes.forEach(n => { noteCounts[n.product] = (noteCounts[n.product]||0)+1; });
  const statusSummary = {}; productApps.forEach(a => { statusSummary[a.status] = (statusSummary[a.status]||0)+1; });

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0", overflow: "auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(46,117,182,0.4); } 70% { box-shadow: 0 0 0 12px rgba(46,117,182,0); } 100% { box-shadow: 0 0 0 0 rgba(46,117,182,0); } }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
        textarea, input, select { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div style={{ padding: "20px 28px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#2e75b6", marginBottom: 2 }}>CASTLEAGENTIQ</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: "#fff" }}>Application Ecosystem</h1>
            <p style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>{productApps.length} modules on ConnectIQ</p>
          </div>
          <div style={{ display: "flex", gap: 3, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 3, flexWrap: "wrap" }}>
            {["ecosystem","layers","domains","infrastructure","notes"].map(v => (
              <button key={v} onClick={() => { setView(v); setSelected(null); }}
                style={{ padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, background: view===v?"#2e75b6":"transparent", position: "relative", color: view===v?"#fff":"#64748b", cursor: "pointer", textTransform: "capitalize" }}>
                {v}{v==="notes"&&notes.length>0&&(<span style={{ position:"absolute",top:-4,right:-4,width:16,height:16,borderRadius:"50%",background:"#6366f1",color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{notes.length}</span>)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 28px 48px" }}>
        {view === "ecosystem" && (<div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            {Object.entries(statusSummary).sort((a,b)=>(statusOrder[a[0]]||9)-(statusOrder[b[0]]||9)).map(([s,c]) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(s) }} /><span style={{ fontSize: 12, color: "#94a3b8" }}>{s}: {c}</span></div>
            ))}
          </div>

          <div style={{ position: "relative", background: "linear-gradient(145deg, #0f172a 0%, #1a1f3a 100%)", borderRadius: 18, border: "1px solid rgba(46,117,182,0.3)", padding: 24, marginBottom: 20 }}>
            <div style={{ position: "absolute", top: -1, left: 40, right: 40, height: 2, background: "linear-gradient(90deg, transparent, #2e75b6, transparent)" }} />
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ flex: "1 1 240px", textAlign: "center", minWidth: 200 }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #1b2a4a 0%, #2e75b6 100%)", fontSize: 24, marginBottom: 10, animation: "pulse-ring 2s infinite" }}>🔗</div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>ConnectIQ</h2>
                <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Central Operating Platform</p>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
                  {["Data Platform","App Shell","Temporal","GraphQL","Multi-tenant"].map(tag => (<span key={tag} style={{ padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600, background: "rgba(46,117,182,0.15)", color: "#4a9eed" }}>{tag}</span>))}
                </div>
              </div>
              <div style={{ flex: "2 1 400px", display: "flex", flexDirection: "column", gap: 4 }}>
                {LAYERS.map((layer, i) => (
                  <div key={layer.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 12px", borderRadius: 8, background: `linear-gradient(90deg, ${layer.color}33 0%, transparent 100%)`, border: `1px solid ${layer.color}44` }}>
                    <div style={{ width: 26, height: 26, borderRadius: 6, background: layer.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{i+1}</div>
                    <div><div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{layer.name}</div><div style={{ fontSize: 10, color: "#94a3b8" }}>{layer.desc}</div></div>
                  </div>
                ))}
                <div style={{ padding: "7px 12px", borderRadius: 8, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>⏱️</span><span style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b" }}>Temporal Engine</span><span style={{ fontSize: 10, color: "#94a3b8" }}>— full history on every entity</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 10 }}>
            {productApps.map(app => {
              const isSel = selected===app.id; const count = noteCounts[app.id]||0;
              return (<div key={app.id} onClick={()=>setSelected(s=>s===app.id?null:app.id)}
                style={{ background: isSel?`${app.color}12`:"rgba(255,255,255,0.02)", border: `1.5px solid ${isSel?app.color:"rgba(255,255,255,0.06)"}`, borderRadius: 12, padding: 14, cursor: "pointer", transition: "all 0.15s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${app.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{app.icon}</div>
                    <div><div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{app.name}</div><div style={{ fontSize: 10, color: "#64748b" }}>{app.tagline}</div></div>
                  </div>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {count>0&&<span style={{ padding: "1px 6px", borderRadius: 6, fontSize: 9, fontWeight: 700, background: `${app.color}22`, color: app.color }}>{count}</span>}
                    <span style={{ padding: "1px 6px", borderRadius: 6, fontSize: 9, fontWeight: 700, background: statusBg(app.status), color: statusColor(app.status) }}>{app.status}</span>
                  </div>
                </div>
                {isSel&&(<div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${app.color}33` }}>
                  <p style={{ fontSize: 11, lineHeight: 1.6, color: "#94a3b8", marginBottom: 10 }}>{app.desc}</p>
                  <div style={{ display: "flex", gap: 14 }}>
                    {app.reads.length>0&&<div><div style={{ fontSize: 9, fontWeight: 700, color: "#059669", letterSpacing: "0.05em", marginBottom: 3 }}>READS</div>{app.reads.map(r=><div key={r} style={{ fontSize: 10, color: "#64748b" }}>← {r}</div>)}</div>}
                    {app.writes.length>0&&<div><div style={{ fontSize: 9, fontWeight: 700, color: "#2e75b6", letterSpacing: "0.05em", marginBottom: 3 }}>WRITES</div>{app.writes.map(w=><div key={w} style={{ fontSize: 10, color: "#64748b" }}>→ {w}</div>)}</div>}
                  </div>
                  <button onClick={e=>{e.stopPropagation();setNewNote(n=>({...n,product:app.id}));setShowAddNote(true);setView("notes");}} style={{ marginTop: 10, padding: "5px 12px", borderRadius: 6, border: `1px solid ${app.color}44`, background: `${app.color}11`, color: app.color, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>+ Add note</button>
                </div>)}
              </div>);
            })}
          </div>
        </div>)}

        {view==="layers"&&(<div style={{ maxWidth: 760 }}>
          <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20, lineHeight: 1.6 }}>ConnectIQ stores all group data across four stacked layers. The temporal engine spans all layers.</p>
          {LAYERS.map((layer, i) => (<div key={layer.id} style={{ marginBottom: 12 }}>
            <div style={{ padding: "16px 20px", borderRadius: 12, background: `linear-gradient(135deg, ${layer.color}22 0%, ${layer.color}08 100%)`, border: `1px solid ${layer.color}44` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: layer.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff" }}>{i+1}</div>
                <div><div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{layer.name}</div><div style={{ fontSize: 12, color: "#94a3b8" }}>{layer.desc}</div></div>
              </div>
            </div>
            {i<LAYERS.length-1&&<div style={{ display: "flex", justifyContent: "center", padding: "2px 0" }}><div style={{ width: 2, height: 8, background: "rgba(255,255,255,0.1)" }} /></div>}
          </div>))}
          <div style={{ marginTop: 8, padding: "14px 20px", borderRadius: 12, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b" }}>⏱️ Temporal Engine (all layers)</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>effective_from, effective_to, change_event_id on every entity.</div>
          </div>
        </div>)}

        {view==="domains"&&(<div style={{ maxWidth: 760 }}>
          <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20, lineHeight: 1.6 }}>Every entity is classified by purpose into one of seven domains.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 }}>
            {DOMAINS.map(d => (<div key={d.num} style={{ padding: "14px 18px", borderRadius: 10, background: `${d.color}11`, border: `1px solid ${d.color}33`, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: d.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{d.num}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{d.name}</div>
            </div>))}
          </div>
        </div>)}

        {view==="infrastructure"&&(<div style={{ maxWidth: 760 }}>
          <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20, lineHeight: 1.6 }}>Two-tier model. Tier 1 default. Tier 2 justified only.</p>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", letterSpacing: "0.05em", marginBottom: 8 }}>TIER 1 — DEFAULT</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, marginBottom: 20 }}>
            {INFRA.filter(i=>i.tier===1).map(inf=>(<div key={inf.name} style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.2)" }}><div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{inf.name}</div><div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{inf.role}</div></div>))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#d97706", letterSpacing: "0.05em", marginBottom: 8 }}>TIER 2 — JUSTIFIED</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, marginBottom: 20 }}>
            {INFRA.filter(i=>i.tier===2).map(inf=>(<div key={inf.name} style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.2)" }}><div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{inf.name}</div><div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{inf.role}</div></div>))}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", letterSpacing: "0.05em", lineHeight: "28px" }}>PROHIBITED:</span>
            {["AWS","DigitalOcean","Firebase","Heroku"].map(x=>(<span key={x} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "rgba(220,38,38,0.08)", color: "#ef4444" }}>✕ {x}</span>))}
            <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "rgba(245,158,11,0.08)", color: "#f59e0b" }}>⚠ Vercel (needs justification)</span>
          </div>
        </div>)}

        {view==="notes"&&(<div style={{ maxWidth: 860 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div><h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Product Notes & Ideas</h2><p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{notes.length} notes</p></div>
            <button onClick={()=>{setShowAddNote(true);setEditingId(null);setNewNote({product:"general",category:"feature",title:"",body:""});}} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#2e75b6", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ New Note</button>
          </div>
          {showAddNote&&(<div style={{ padding: 20, borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14 }}>{editingId?"Edit Note":"New Note"}</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px" }}><label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>Product</label>
                <select value={newNote.product} onChange={e=>setNewNote(n=>({...n,product:e.target.value}))} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "#e2e8f0", fontSize: 13 }}>{APPS.map(a=><option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}</select></div>
              <div style={{ flex: "1 1 200px" }}><label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>Category</label>
                <select value={newNote.category} onChange={e=>setNewNote(n=>({...n,category:e.target.value}))} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "#e2e8f0", fontSize: 13 }}>{CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}</select></div>
            </div>
            <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>Title</label>
              <input value={newNote.title} onChange={e=>setNewNote(n=>({...n,title:e.target.value}))} placeholder="Brief title..." style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "#e2e8f0", fontSize: 14, outline: "none" }} /></div>
            <div style={{ marginBottom: 14 }}><label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>Details (optional)</label>
              <textarea value={newNote.body} onChange={e=>setNewNote(n=>({...n,body:e.target.value}))} placeholder="Expand on the idea..." rows={4} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "#e2e8f0", fontSize: 13, outline: "none", resize: "vertical", lineHeight: 1.6 }} /></div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={addNote} disabled={!newNote.title.trim()} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: newNote.title.trim()?"#2e75b6":"#1e293b", color: "#fff", fontSize: 13, fontWeight: 700, cursor: newNote.title.trim()?"pointer":"default" }}>{editingId?"Update":"Save"}</button>
              <button onClick={()=>{setShowAddNote(false);setEditingId(null);setNewNote({product:"general",category:"feature",title:"",body:""});}} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>)}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            <input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search..." style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "#e2e8f0", fontSize: 12, outline: "none", width: 160 }} />
            <select value={noteFilter} onChange={e=>setNoteFilter(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "#e2e8f0", fontSize: 12 }}><option value="all">All Products</option>{APPS.map(a=><option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}</select>
            <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "#e2e8f0", fontSize: 12 }}><option value="all">All Categories</option>{CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}</select>
            {(noteFilter!=="all"||catFilter!=="all"||searchTerm)&&<button onClick={()=>{setNoteFilter("all");setCatFilter("all");setSearchTerm("");}} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: "rgba(255,255,255,0.06)", color: "#94a3b8", fontSize: 11, cursor: "pointer" }}>Clear</button>}
            <span style={{ fontSize: 11, color: "#64748b", marginLeft: "auto" }}>{filteredNotes.length}</span>
          </div>
          {filteredNotes.length===0?(<div style={{ textAlign: "center", padding: 40, color: "#475569" }}><div style={{ fontSize: 32, marginBottom: 8 }}>📝</div><div style={{ fontSize: 14 }}>{notes.length===0?"No notes yet.":"No matches."}</div></div>
          ):(<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredNotes.map(note => {
              const app = APPS.find(a=>a.id===note.product)||APPS[APPS.length-1];
              const cat = CATEGORIES.find(c=>c.id===note.category)||CATEGORIES[0];
              return (<div key={note.id} style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", transition: "border-color 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=`${app.color}44`} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: `${app.color}22`, color: app.color }}>{app.icon} {app.name}</span>
                      <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: `${cat.color}18`, color: cat.color }}>{cat.icon} {cat.label}</span>
                      <span style={{ fontSize: 10, color: "#475569" }}>{formatDate(note.created_at)}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>{note.title}</div>
                    {note.body&&<div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{note.body}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    <button onClick={()=>editNote(note)} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#64748b", fontSize: 11, cursor: "pointer" }}>Edit</button>
                    <button onClick={()=>deleteNote(note.id)} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid rgba(220,38,38,0.15)", background: "transparent", color: "#ef4444", fontSize: 11, cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              </div>);
            })}
          </div>)}
        </div>)}
      </div>
    </div>
  );
}
