/* ================================================================
   T26 · Centralised AI & Data Analytics Platform Operations
   Application engine — v2.0
   Persistent store · working registers · live applications · enterprise UX
   ================================================================ */
(function () {
  "use strict";

  const D = window.DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const ic = (n, x) => '<svg class="icon ' + (x || "") + '"><use href="#' + n + '"/></svg>';
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const stageOrder = { Live: 1, Pilot: 2, Assessment: 3, Discovery: 4, "On hold": 5 };
  const KEY = "t26-platform-v3";
  let seq = 0;
  const uid = (p) => p + "-" + Date.now().toString(36).toUpperCase().slice(-5) + (++seq).toString(36).toUpperCase();

  function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim() || "#888"; }
  function resolve(c) { return typeof c === "string" && c.indexOf("var(") === 0 ? cssVar(c.slice(4, -1).trim()) : c; }
  function palette() {
    return { brand: cssVar("--brand-2"), accent: cssVar("--accent"), violet: cssVar("--violet"), amber: cssVar("--amber"), green: cssVar("--green"), red: cssVar("--red"), faint: cssVar("--faint"), line: cssVar("--line"), surface: cssVar("--surface"), surfaceAlt: cssVar("--surface-alt"), muted: cssVar("--muted"), ink: cssVar("--ink") };
  }
  function fmtDate(v) {
    if (!v || v === "TBC") return "TBC";
    const s = String(v).slice(0, 10), p = s.split("-");
    if (p.length !== 3) return v;
    const m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return p[2] + " " + m[parseInt(p[1], 10) - 1] + " " + p[0];
  }
  function timeAgo(iso) {
    const t = new Date(iso).getTime(); if (isNaN(t)) return "";
    const diff = Date.now() - t;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return Math.floor(diff / 60000) + " min ago";
    if (diff < 86400000) return Math.floor(diff / 3600000) + " hr ago";
    if (diff < 604800000) return Math.floor(diff / 86400000) + " d ago";
    return fmtDate(iso);
  }
  function fmtTime(iso) {
    const d = new Date(iso); if (isNaN(d)) return "";
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }
  function download(name, text, type) {
    const blob = new Blob([text], { type: type || "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function copyText(text, msg) {
    const fb = () => {
      const ta = document.createElement("textarea"); ta.value = text;
      ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast(msg, "i-copy"); } catch (e) { toast("Copy unavailable", "i-alert"); }
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => toast(msg, "i-copy"), fb);
    else fb();
  }
  function csvCell(v) { const s = String(v == null ? "" : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  function toCSV(rows, cols) { return [cols.map((c) => csvCell(c.label)).join(",")].concat(rows.map((r) => cols.map((c) => csvCell(c.csv ? c.csv(r) : r[c.key])).join(","))).join("\r\n"); }

  /* ================================================================
     TEXT ANALYTICS ENGINE — deterministic, explainable, multilingual
     ================================================================ */
  function analyse(raw) {
    const text = String(raw || "").trim();
    const lower = text.toLowerCase();
    const L = D.lexicon;
    const tokens = lower.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
    let score = 0; const hits = [];

    const hasWord = (arr, t) => arr.some((w) => !/[\u4e00-\u9fff]/.test(w) && (w === t || (w.length > 3 && t.indexOf(w) === 0)));
    tokens.forEach((t, i) => {
      let val = 0;
      if (hasWord(L.positive, t)) val = 1;
      if (hasWord(L.negative, t)) val = -1;
      if (val !== 0) {
        const prev = tokens[i - 1];
        const neg = prev && L.negation.indexOf(prev) > -1;
        const inten = prev && L.intensifier.indexOf(prev) > -1 ? 1.35 : 1;
        score += (neg ? -val * 0.85 : val) * inten;
        hits.push({ term: t, val: neg ? -val : val });
      }
    });
    const scanCN = (words, sign) => words.forEach((w) => {
      if (!/[\u4e00-\u9fff]/.test(w)) return;
      let idx = lower.indexOf(w);
      while (idx > -1) {
        const prev = lower[idx - 1];
        const neg = prev === "不" || prev === "沒" || prev === "無" || prev === "未";
        score += sign * (neg ? -0.85 : 1);
        hits.push({ term: (neg ? prev : "") + w, val: neg ? -sign : sign });
        idx = lower.indexOf(w, idx + w.length);
      }
    });
    scanCN(L.positive, 1); scanCN(L.negative, -1);

    const norm = Math.max(-1, Math.min(1, score / (Math.abs(score) + 2)));
    const pos = hits.filter((h) => h.val > 0).length, neg = hits.filter((h) => h.val < 0).length;
    let label = "Neutral";
    if (pos && neg && Math.abs(norm) < 0.35) label = "Mixed";
    else if (norm > 0.15) label = "Positive";
    else if (norm < -0.15) label = "Negative";
    const confidence = Math.min(0.98, 0.54 + Math.min(0.42, hits.length * 0.07));

    const topics = D.topicRules.map((r) => ({
      topic: r.topic,
      count: r.keywords.reduce((a, k) => a + (lower.split(k).length - 1), 0)
    })).filter((r) => r.count > 0).sort((a, b) => b.count - a.count).slice(0, 3);

    const emailRe = /[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, phoneRe = /(?<!\d)\d{4}[\s-]?\d{4}(?!\d)/g, tagRe = /#[A-Za-z0-9_\u4e00-\u9fff]+/g;
    const emails = text.match(emailRe) || [], phones = text.match(phoneRe) || [], tags = text.match(tagRe) || [];
    const deptRe = /\b(IMMD|IRD|TD|HD|DH|EDB|EPD|SWD|LCSD|CEDB|DPO|FEHD|ISD|GLD|HKPF|WFSFAA|C&SD)\b/g;
    const depts = text.match(deptRe) || [];
    const entities = [
      ...emails.map((v) => ({ type: "Email", value: v })),
      ...phones.map((v) => ({ type: "Phone", value: v })),
      ...tags.map((v) => ({ type: "Hashtag", value: v })),
      ...depts.map((v) => ({ type: "Department", value: v }))
    ];
    let maskedText = text.replace(emailRe, "[EMAIL REDACTED]").replace(phoneRe, "[PHONE REDACTED]");
    const piiCount = emails.length + phones.length;

    return { text, score: norm, label, confidence, hits, topics, entities, maskedText, piiCount };
  }

  /* ================================================================
     PERSISTENT STORE
     ================================================================ */
  function seedDB() {
    const db = {
      v: 3, createdAt: new Date().toISOString(), savedAt: new Date().toISOString(),
      bd: D.bd.map((r, i) => Object.assign({}, r, { id: "BD-" + String(i + 1).padStart(3, "0") })),
      docs: clone(D.docs),
      vendors: D.vendors.map((r, i) => ({ id: "VEN-" + String(i + 1).padStart(3, "0"), party: r[0], scope: r[1], contract: r[2], sla: r[3], review: r[4], status: r[5] })),
      research: clone(D.research),
      tickets: clone(D.tickets),
      kb: clone(D.kb),
      controls: clone(D.FW.controlSeed),
      risks: clone(D.FW.riskSeed),
      actions: clone(D.FW.actionSeed),
      corpus: [],
      activity: clone(D.activitySeed),
      notifications: clone(D.notificationSeed),
      settings: { theme: "light", density: "comfortable", pageSize: 8, guardrails: { citations: true, humanReview: true, minConfidence: 0.55 } },
      priorities: D.priorities.map((p) => p.done),
      runbook: D.runbook.map(() => false),
      assess: { req: D.assessReq.map(() => false), skills: D.assessSkills.map(() => 0) },
      chat: { tenant: "All", messages: [] },
      labResult: null
    };
    db.corpus = D.corpusSeed.map((c) => {
      const a = analyse(c.text);
      return { id: c.id, text: c.text, source: c.source, at: c.at, label: a.label, score: a.score, confidence: a.confidence, topics: a.topics.map((t) => t.topic), piiCount: a.piiCount, maskedText: a.maskedText };
    });
    db.chat.messages = [{ id: "MSG-0000", role: "bot", text: "Hello. I am the departmental virtual assistant. Ask me about departmental services, application procedures or published guidance.", at: new Date().toISOString(), intent: "Session start", confidence: 1, source: "", flagged: false }];
    return db;
  }
  function loadDB() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const o = JSON.parse(raw); if (o && o.v === 3 && o.bd && o.tickets && o.controls && o.risks && o.actions) return o; }
    } catch (e) { /* fall through */ }
    return seedDB();
  }
  let db = loadDB();

  function save() {
    db.savedAt = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* quota */ }
    updateChrome();
  }
  function log(type, title, desc, tone, ref) {
    db.activity.unshift({ id: uid("ACT"), at: new Date().toISOString(), type, title, desc: desc || "", tone: tone || "", ref: ref || "" });
    if (db.activity.length > 300) db.activity.length = 300;
  }
  function pushNotification(title, body, tone, view) {
    db.notifications.unshift({ id: uid("NTF"), at: new Date().toISOString(), title, body, tone: tone || "blue", view: view || "", read: false });
    if (db.notifications.length > 60) db.notifications.length = 60;
  }
  function commit(fn, opts) {
    opts = opts || {};
    const snapshot = clone(db);
    fn();
    if (opts.log) log(opts.log.type || "Update", opts.log.title, opts.log.desc, opts.log.tone, opts.log.ref);
    if (opts.notify) pushNotification(opts.notify.title, opts.notify.body, opts.notify.tone, opts.notify.view);
    save();
    invalidate();
    if (opts.toast) {
      if (opts.undo === false) toast(opts.toast, opts.icon || "i-check");
      else toast(opts.toast, opts.icon || "i-check", "Undo", () => {
        Object.keys(snapshot).forEach((k) => { db[k] = snapshot[k]; });
        save(); invalidate(); toast("Change reverted", "i-refresh");
      });
    }
  }

  const state = {
    view: "overview", cmdSel: 0, period: 12, platformTab: "chatbot",
    researchFilter: "All", overlay: null, reg: {}
  };

  /* ================================================================
     OVERLAYS — toast, modal, drawer, notifications
     ================================================================ */
  function toast(msg, iconName, actionLabel, actionFn) {
    const stack = $("#toast-stack"); if (!stack) return;
    const el = document.createElement("div"); el.className = "toast";
    el.innerHTML = ic(iconName || "i-check") + "<span>" + esc(msg) + "</span>";
    if (actionLabel) {
      const b = document.createElement("button"); b.className = "toast-action"; b.textContent = actionLabel;
      b.addEventListener("click", () => { if (actionFn) actionFn(); el.remove(); });
      el.appendChild(b);
    }
    stack.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 260); }, actionLabel ? 5200 : 3000);
  }

  function trapFocus(container, e) {
    if (e.key !== "Tab") return;
    const f = $$("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])", container).filter((x) => !x.disabled && x.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }

  function openModal(cfg) {
    closeOverlay();
    const ov = $("#modal-overlay"), box = $(".modal", ov);
    box.innerHTML = `<div class="modal-head"><div><span class="modal-eyebrow">${esc(cfg.eyebrow || "Workspace")}</span><h3>${esc(cfg.title)}</h3>${cfg.subtitle ? `<p>${esc(cfg.subtitle)}</p>` : ""}</div><button class="icon-btn" data-act="close-overlay" aria-label="Close">${ic("i-x")}</button></div>
      <div class="modal-body">${cfg.body || ""}</div>
      <div class="modal-foot">${cfg.foot || `<button class="btn btn-ghost" data-act="close-overlay">Cancel</button><button class="btn btn-primary" data-act="modal-submit">${esc(cfg.submitLabel || "Save")}</button>`}</div>`;
    if (cfg.bodyHtml) $(".modal-body", box).innerHTML = cfg.bodyHtml;
    ov.classList.add("open"); ov.setAttribute("aria-hidden", "false");
    state.overlay = "modal";
    const first = $("input, select, textarea, button", $(".modal-body", box));
    setTimeout(() => (first || $(".modal-foot button", box)).focus(), 30);
    state.modalCfg = cfg;
  }
  function openDrawer(cfg) {
    closeOverlay();
    const ov = $("#drawer-overlay"), box = $(".drawer", ov);
    box.innerHTML = `<div class="drawer-head"><div><span class="modal-eyebrow">${esc(cfg.eyebrow || "Record detail")}</span><h3>${esc(cfg.title)}</h3>${cfg.subtitle ? `<p>${esc(cfg.subtitle)}</p>` : ""}</div><button class="icon-btn" data-act="close-overlay" aria-label="Close">${ic("i-x")}</button></div>
      <div class="drawer-body">${cfg.body || ""}</div>${cfg.foot ? `<div class="drawer-foot">${cfg.foot}</div>` : ""}`;
    ov.classList.add("open"); ov.setAttribute("aria-hidden", "false"); state.overlay = "drawer";
    setTimeout(() => $(".drawer-head .icon-btn", box).focus(), 30);
  }
  function closeOverlay() {
    ["#modal-overlay", "#drawer-overlay", "#notif-panel", "#new-menu", "#cmd-overlay"].forEach((s) => {
      const el = $(s); if (!el) return;
      el.classList.remove("open"); if (el.id === "modal-overlay" || el.id === "drawer-overlay" || el.id === "cmd-overlay") el.setAttribute("aria-hidden", "true");
    });
    state.overlay = null;
  }

  /* ================================================================
     REGISTER ENGINE — modal forms, sorting, filtering, paging, CSV
     ================================================================ */
  const sel = (arr) => arr.map((v) => ({ value: v, label: v }));
  const REGS = {
    bd: {
      label: "B/D record", idKey: "id", prefix: "BD", view: "adoption",
      collection: () => db.bd, table: "#bd-table", search: "#bd-search", filters: "#bd-filter", count: "#bd-count", showing: "#bd-showing", pager: "#bd-pager", bulk: "#bd-bulk",
      filterKey: "stage", filterOptions: () => D.bdStages, searchKeys: ["name", "abbr", "platform", "usecase", "owner", "stage"],
      defaultSort: { key: "stage", dir: 1 },
      columns: [
        { key: "name", label: "Bureau / Department", render: (r) => `<span class="cell-strong">${esc(r.name)}</span><span class="sub">${esc(r.abbr)}</span>` },
        { key: "platform", label: "Platform" },
        { key: "stage", label: "Stage", render: (r) => `<span class="stage-badge stage-${String(r.stage).replace(/\s+/g, "")}">${esc(r.stage)}</span>` },
        { key: "usecase", label: "Use case", cls: "muted" },
        { key: "owner", label: "Owner" },
        { key: "golive", label: "Target go-live", render: (r) => `<span class="mono">${esc(fmtDate(r.golive))}</span>` }
      ],
      fields: [
        { key: "name", label: "Bureau / department", required: true },
        { key: "abbr", label: "Abbreviation", required: true },
        { key: "platform", label: "Platform", type: "select", options: () => sel(["Chatbot", "SMTA", "Both"]) },
        { key: "stage", label: "Adoption stage", type: "select", options: () => sel(D.bdStages.filter((s) => s !== "All")), default: "Discovery" },
        { key: "usecase", label: "Use case" },
        { key: "owner", label: "Internal owner", default: "Adoption lead" },
        { key: "golive", label: "Target go-live", type: "date", default: "TBC" }
      ]
    },
    docs: {
      label: "document", idKey: "ref", prefix: "T26-NEW", view: "documents",
      collection: () => db.docs, table: "#doc-table", search: "#doc-search", filters: "#doc-filter", count: "#doc-count", showing: "#doc-showing", pager: "#doc-pager", bulk: "#doc-bulk",
      filterKey: "category", filterOptions: () => D.docCats, searchKeys: ["ref", "title", "category", "owner", "format", "status"],
      defaultSort: { key: "ref", dir: 1 },
      columns: [
        { key: "ref", label: "Reference", render: (r) => `<span class="mono cell-strong">${esc(r.ref)}</span>` },
        { key: "title", label: "Document title" },
        { key: "category", label: "Category" },
        { key: "format", label: "Format" },
        { key: "version", label: "Ver.", render: (r) => `<span class="mono">${esc(r.version)}</span>` },
        { key: "owner", label: "Owner" },
        { key: "updated", label: "Last updated", render: (r) => `<span class="mono">${esc(fmtDate(r.updated))}</span>` },
        { key: "status", label: "Status", render: (r) => `<span class="pill ${statusCls(r.status)}">${esc(r.status)}</span>` }
      ],
      fields: [
        { key: "ref", label: "Document reference", required: true, default: () => "T26-DOC-" + String(db.docs.length + 1).padStart(3, "0") },
        { key: "title", label: "Document title", required: true },
        { key: "category", label: "Category", type: "select", options: () => sel(D.docCats.filter((c) => c !== "All")), default: "Technical" },
        { key: "format", label: "Format", type: "select", options: () => sel(["Electronic", "Physical", "Both"]), default: "Electronic" },
        { key: "version", label: "Version", default: "v1.0" },
        { key: "owner", label: "Owner", default: "CSSA" },
        { key: "updated", label: "Last updated", type: "date", default: () => new Date().toISOString().slice(0, 10) },
        { key: "status", label: "Status", type: "select", options: () => sel(["Current", "Review due", "Archived", "Restricted"]), default: "Current" }
      ]
    },
    tickets: {
      label: "incident", idKey: "id", prefix: "INC", view: "desk",
      collection: () => db.tickets, table: "#tk-table", search: "#tk-search", filters: "#tk-filter", count: null, showing: "#tk-showing", pager: "#tk-pager", bulk: "#tk-bulk",
      filterKey: "status", filterOptions: () => ["All", "Open", "In progress", "Pending B/D", "Resolved"], searchKeys: ["id", "subject", "bd", "assignee", "priority", "category"],
      defaultSort: { key: "created", dir: -1 },
      columns: [
        { key: "id", label: "Incident", render: (r) => `<span class="mono cell-strong">${esc(r.id)}</span>` },
        { key: "subject", label: "Subject", render: (r) => `<span class="cell-strong">${esc(r.subject)}</span><span class="sub">${esc(r.bd)}</span>` },
        { key: "priority", label: "Priority", render: (r) => `<span class="pill ${prioCls(r.priority)}">${esc(r.priority)}</span>` },
        { key: "status", label: "Status", render: (r) => `<span class="stage-badge ${statusBadge(r.status)}">${esc(r.status)}</span>` },
        { key: "assignee", label: "Assignee" },
        { key: "created", label: "Logged", render: (r) => `<span class="mono">${esc(fmtDate(r.created))}</span>` }
      ],
      fields: [
        { key: "subject", label: "Incident subject", required: true },
        { key: "bd", label: "Reporting B/D", type: "select", options: () => sel(db.bd.map((b) => b.name)), default: () => db.bd[0].name },
        { key: "platform", label: "Platform", type: "select", options: () => sel(["Chatbot", "SMTA", "Both"]), default: "Chatbot" },
        { key: "priority", label: "Priority", type: "select", options: () => sel(["P1 · Critical", "P2 · Major", "P3 · Moderate", "P4 · Low"]), default: "P3 · Moderate" },
        { key: "category", label: "Category", type: "select", options: () => sel(["Configuration & access", "Content & knowledge", "Integration", "Data & reporting", "Performance", "Change & release"]), default: "Configuration & access" },
        { key: "assignee", label: "Assignee", default: "CSSA" },
        { key: "channel", label: "Reported via", type: "select", options: () => sel(["B/D portal", "Help desk", "Email", "Monitoring", "Phone"]), default: "B/D portal" },
        { key: "notes", label: "Initial notes", type: "textarea" }
      ]
    },
    vendors: {
      label: "engagement", idKey: "id", prefix: "VEN", view: "vendors",
      collection: () => db.vendors, table: "#vendor-table", search: "#vendor-search", filters: null, count: null, showing: "#vendor-showing", pager: "#vendor-pager", bulk: "#vendor-bulk",
      filterKey: null, searchKeys: ["party", "scope", "contract", "sla", "review", "status"], defaultSort: { key: "party", dir: 1 },
      columns: [
        { key: "party", label: "Party", render: (r) => `<span class="cell-strong">${esc(r.party)}</span>` },
        { key: "scope", label: "Scope of engagement", cls: "muted" },
        { key: "contract", label: "Contract ref.", render: (r) => `<span class="mono">${esc(r.contract)}</span>` },
        { key: "sla", label: "SLA / KPI" },
        { key: "review", label: "Review cadence" },
        { key: "status", label: "Status", render: (r) => `<span class="pill ${r.status === "Active" ? "pill-green" : "pill-amber"}">${esc(r.status)}</span>` }
      ],
      fields: [
        { key: "party", label: "Vendor / contractor", required: true },
        { key: "scope", label: "Scope of engagement" },
        { key: "contract", label: "Contract reference", default: () => "T26/NEW/" + new Date().getFullYear() },
        { key: "sla", label: "SLA / KPI" },
        { key: "review", label: "Review cadence", type: "select", options: () => sel(["Monthly", "Quarterly", "Annual"]), default: "Monthly" },
        { key: "status", label: "Status", type: "select", options: () => sel(["Active", "In progress", "On hold", "Closed"]), default: "Active" }
      ]
    },
    research: {
      label: "research brief", idKey: "id", prefix: "RES", view: "research",
      collection: () => db.research, table: null, search: null, filters: "#research-filter", count: null, showing: null, pager: null, bulk: null,
      filterKey: "cat", filterOptions: () => D.researchCats, searchKeys: [], defaultSort: { key: "id", dir: -1 },
      columns: [],
      fields: [
        { key: "title", label: "Brief title", required: true },
        { key: "cat", label: "Subject area", type: "select", options: () => sel(D.researchCats.filter((c) => c !== "All")), default: "Gen AI" },
        { key: "finding", label: "Key finding", type: "textarea", required: true },
        { key: "implication", label: "Implication for the platforms", type: "textarea" },
        { key: "maturity", label: "Adoption ring", type: "select", options: () => sel(["Adopt", "Trial", "Assess", "Hold"]), default: "Assess" },
        { key: "date", label: "Date", default: () => new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }) }
      ]
    },
    kb: {
      label: "knowledge entry", idKey: "id", prefix: "KB", view: "console",
      collection: () => db.kb, table: null, search: null, filters: null, count: null, showing: null, pager: null, bulk: null,
      filterKey: null, searchKeys: [], defaultSort: { key: "id", dir: 1 }, columns: [],
      fields: [
        { key: "intent", label: "Intent name", required: true },
        { key: "tenant", label: "Tenant", type: "select", options: () => sel(["All"].concat(db.bd.filter((b) => b.stage === "Live").map((b) => b.abbr))), default: "All" },
        { key: "patterns", label: "Match keywords (comma separated)", required: true, display: (r) => r.patterns.join(", "), parse: (v) => v.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) },
        { key: "answer", label: "Grounded answer", type: "textarea", required: true },
        { key: "source", label: "Citation / source", required: true },
        { key: "version", label: "Version", default: "v1.0" },
        { key: "updated", label: "Last updated", type: "date", default: () => new Date().toISOString().slice(0, 10) }
      ]
    }
  };
  function statusCls(s) { return s === "Current" ? "pill-green" : s === "Review due" ? "pill-amber" : s === "Archived" ? "pill-soft" : "pill-red"; }
  function prioCls(p) { return p.indexOf("P1") === 0 ? "pill-red" : p.indexOf("P2") === 0 ? "pill-amber" : p.indexOf("P3") === 0 ? "pill-blue" : "pill-soft"; }
  function statusBadge(s) { return s === "Resolved" ? "stage-Live" : s === "Open" ? "stage-Onhold" : s === "In progress" ? "stage-Pilot" : "stage-Assessment"; }
  function idOf(r, reg) { return r[REGS[reg].idKey]; }
  function findRec(reg, id) { return REGS[reg].collection().find((r) => String(idOf(r, reg)) === String(id)); }

  Object.keys(REGS).forEach((n) => {
    state.reg[n] = { q: "", filter: "All", sort: Object.assign({}, REGS[n].defaultSort), page: 1, selected: new Set() };
  });
  state.reg.research.filter = "All";

  function sortRecords(rows, key, dir) {
    return rows.slice().sort((a, b) => {
      let x = a[key], y = b[key];
      if (key === "stage") { x = stageOrder[x] || 99; y = stageOrder[y] || 99; }
      if (key === "priority") { x = String(x).charAt(1); y = String(y).charAt(1); }
      const r = typeof x === "number" && typeof y === "number" ? x - y : String(x == null ? "" : x).localeCompare(String(y == null ? "" : y));
      return r * dir;
    });
  }

  function renderRegister(name) {
    const cfg = REGS[name], st = state.reg[name];
    if (!cfg.table) return;
    const table = $(cfg.table); if (!table) return;
    let rows = cfg.collection().slice();
    const q = st.q.trim().toLowerCase();
    if (q) rows = rows.filter((r) => cfg.searchKeys.some((k) => String(r[k] == null ? "" : r[k]).toLowerCase().indexOf(q) > -1));
    if (cfg.filterKey && st.filter !== "All") rows = rows.filter((r) => String(r[cfg.filterKey]) === st.filter);
    rows = sortRecords(rows, st.sort.key, st.sort.dir);
    const total = rows.length, ps = db.settings.pageSize;
    const pages = Math.max(1, Math.ceil(total / ps));
    st.page = Math.min(Math.max(1, st.page), pages);
    const start = (st.page - 1) * ps, pageRows = rows.slice(start, start + ps);

    const head = `<thead><tr><th class="sel-col"><input type="checkbox" data-act="selectall" data-reg="${name}" aria-label="Select all"></th>` +
      cfg.columns.map((c) => `<th data-act="sort" data-reg="${name}" data-key="${c.key}" class="${st.sort.key === c.key ? "sorted" : ""}">${esc(c.label)}${st.sort.key === c.key ? ic("i-chevron-down", st.sort.dir === -1 ? "flip" : "") : ""}</th>`).join("") +
      `<th class="act-col">Actions</th></tr></thead>`;
    const body = pageRows.length ? pageRows.map((r) => {
      const id = esc(idOf(r, name));
      return `<tr data-row="${id}" class="${st.selected.has(String(idOf(r, name))) ? "selected" : ""}">` +
        `<td class="sel-col"><input type="checkbox" data-act="select" data-reg="${name}" data-id="${id}" ${st.selected.has(String(idOf(r, name))) ? "checked" : ""} aria-label="Select row"></td>` +
        cfg.columns.map((c) => `<td class="${c.cls || ""}">${c.render ? c.render(r) : esc(r[c.key])}</td>`).join("") +
        `<td class="act-col"><div class="row-actions"><button class="row-btn" data-act="detail" data-reg="${name}" data-id="${id}" title="Open details" aria-label="Open details">${ic("i-external")}</button><button class="row-btn" data-act="edit" data-reg="${name}" data-id="${id}" title="Edit" aria-label="Edit">${ic("i-file")}</button><button class="row-btn danger" data-act="delete" data-reg="${name}" data-id="${id}" title="Delete" aria-label="Delete">${ic("i-x")}</button></div></td></tr>`;
    }).join("") : `<tr class="empty-row"><td colspan="${cfg.columns.length + 2}"><div class="empty-state">${ic("i-search")}<strong>No matching ${esc(cfg.label)}s</strong><p>Adjust the search or filter, or create a new record.</p><button class="btn btn-ghost btn-sm" data-act="clearfilters" data-reg="${name}">Clear filters</button></div></td></tr>`;
    table.innerHTML = head + `<tbody>${body}</tbody>`;

    if (cfg.filters) {
      const opts = cfg.filterOptions ? cfg.filterOptions() : [];
      $(cfg.filters).innerHTML = opts.map((o) => `<button class="chip ${o === st.filter ? "active" : ""}" data-act="filter" data-reg="${name}" data-value="${esc(o)}">${esc(o)}</button>`).join("");
    }
    if (cfg.count && $(cfg.count)) $(cfg.count).textContent = total + " of " + cfg.collection().length + " records";
    if (cfg.showing && $(cfg.showing)) $(cfg.showing).textContent = total ? "Showing " + (start + 1) + "–" + Math.min(start + ps, total) + " of " + total : "No records";
    if (cfg.pager && $(cfg.pager)) {
      $(cfg.pager).innerHTML = `<span class="pager-info">Page ${st.page} of ${pages}</span><div class="pager-btns"><button class="page-btn" data-act="page" data-reg="${name}" data-page="prev" ${st.page === 1 ? "disabled" : ""}>${ic("i-chevron-right", "flip")}</button>` +
        Array.from({ length: Math.min(pages, 5) }, (_, i) => {
          let p = i + 1;
          if (pages > 5) p = Math.max(1, Math.min(pages - 4, st.page - 2)) + i;
          return `<button class="page-btn ${p === st.page ? "active" : ""}" data-act="page" data-reg="${name}" data-page="${p}">${p}</button>`;
        }).join("") +
        `<button class="page-btn" data-act="page" data-reg="${name}" data-page="next" ${st.page === pages ? "disabled" : ""}>${ic("i-chevron-right")}</button></div><span class="pager-size">Rows <select data-act="pagesize" aria-label="Rows per page">${[6, 8, 12, 20].map((n) => `<option value="${n}" ${n === ps ? "selected" : ""}>${n}</option>`).join("")}</select></span>`;
    }
    if (cfg.bulk && $(cfg.bulk)) {
      const n = st.selected.size;
      $(cfg.bulk).innerHTML = n ? `<div class="bulk-bar">${ic("i-check")}<strong>${n} selected</strong><button class="btn btn-ghost btn-sm" data-act="export-selected" data-reg="${name}">${ic("i-download")} Export</button><button class="btn btn-ghost btn-sm danger" data-act="bulkdelete" data-reg="${name}">${ic("i-x")} Delete</button><button class="btn btn-ghost btn-sm" data-act="clearselection" data-reg="${name}">Clear</button></div>` : "";
    }
  }

  function openForm(reg, id) {
    const cfg = REGS[reg], rec = id ? findRec(reg, id) : null;
    const fields = cfg.fields.map((f) => {
      let v = rec ? (f.display ? f.display(rec) : rec[f.key]) : (typeof f.default === "function" ? f.default() : (f.default != null ? f.default : ""));
      v = v == null ? "" : v;
      const req = f.required ? ' <em class="req">*</em>' : "";
      let control;
      if (f.type === "select") {
        const opts = f.options().map((o) => `<option value="${esc(o.value)}" ${String(o.value) === String(v) ? "selected" : ""}>${esc(o.label)}</option>`).join("");
        control = `<select name="${f.key}" data-field="${f.key}">${opts}</select>`;
      } else if (f.type === "textarea") {
        control = `<textarea name="${f.key}" data-field="${f.key}" rows="4" placeholder="${esc(f.label)}">${esc(v)}</textarea>`;
      } else {
        const t = f.type === "date" ? "date" : "text";
        const dv = t === "date" && (v === "TBC" || !v) ? "" : v;
        control = `<input type="${t}" name="${f.key}" data-field="${f.key}" value="${esc(dv)}" placeholder="${esc(f.label)}" autocomplete="off">`;
      }
      return `<label class="form-field"><span>${esc(f.label)}${req}</span>${control}<small class="field-error" data-error="${f.key}"></small></label>`;
    }).join("");
    openModal({
      eyebrow: rec ? "Edit record" : "Create record", title: (rec ? "Edit " : "New ") + cfg.label,
      subtitle: "Changes are saved locally and written to the workspace audit trail.",
      bodyHtml: `<form class="modal-form" id="record-form" novalidate>${fields}</form>`,
      submitLabel: rec ? "Save changes" : "Create " + cfg.label,
      onSubmit: (box) => {
        const form = $("#record-form", box); let ok = true;
        cfg.fields.forEach((f) => {
          const input = form.querySelector('[data-field="' + f.key + '"]');
          const err = form.querySelector('[data-error="' + f.key + '"]');
          const empty = !String(input.value).trim();
          if (f.required && empty) { err.textContent = "This field is required"; input.classList.add("invalid"); ok = false; }
          else { err.textContent = ""; input.classList.remove("invalid"); }
        });
        if (!ok) { toast("Please complete the required fields", "i-alert", null, null); return false; }
        const out = rec ? Object.assign({}, rec) : { id: uid(cfg.prefix) };
        if (!rec && cfg.idKey !== "id") out[cfg.idKey] = uid(cfg.prefix);
        cfg.fields.forEach((f) => {
          const raw = form.querySelector('[data-field="' + f.key + '"]').value;
          out[f.key] = f.parse ? f.parse(raw) : (f.type === "date" && !raw ? "TBC" : raw.trim());
        });
        if (reg === "tickets" && !rec) { out.created = new Date().toISOString(); out.status = "Open"; out.slaHours = ({ "P1 · Critical": 2, "P2 · Major": 24, "P3 · Moderate": 72, "P4 · Low": 120 })[out.priority] || 24; out.notes = out.notes || ""; }
        if (reg === "research" && !rec) out.finding = out.finding || "";
        if (reg === "kb") out.updated = out.updated || new Date().toISOString().slice(0, 10);
        if (reg === "docs" && !rec) out.updated = new Date().toISOString().slice(0, 10);
        if (cfg.finalize) cfg.finalize(out);
        const arr = cfg.collection();
        commit(() => {
          if (rec) { const i = arr.findIndex((r) => String(idOf(r, reg)) === String(id)); if (i > -1) arr[i] = out; }
          else arr.unshift(out);
        }, {
          log: { type: rec ? "Update" : "Create", title: (rec ? "Updated " : "Created ") + cfg.label + " · " + (out.title || out.name || out.subject || out.intent || out.party || out.ref || out.id), desc: "Record " + idOf(out, reg) + " " + (rec ? "modified" : "added") + " in the workspace.", tone: rec ? "violet" : "teal", ref: String(idOf(out, reg)) },
          toast: cfg.label + (rec ? " updated" : " created"),
          notify: rec ? null : { title: "New " + cfg.label + " recorded", body: idOf(out, reg) + " · " + (out.title || out.name || out.subject || out.intent || out.party || ""), tone: "blue", view: cfg.view }
        });
        return true;
      }
    });
  }

  function openDetail(reg, id) {
    const cfg = REGS[reg], r = findRec(reg, id); if (!r) return;
    const rid = String(idOf(r, reg));
    const kv = cfg.fields.map((f) => {
      let v = f.display ? f.display(r) : r[f.key];
      if (Array.isArray(v)) v = v.join(", ");
      if (f.type === "date") v = fmtDate(v);
      return `<div class="detail-row"><span>${esc(f.label)}</span><strong>${esc(v == null || v === "" ? "—" : v)}</strong></div>`;
    }).join("");
    const extra = r.status && reg === "tickets" ? `
      <div class="detail-section"><span class="detail-label">Incident workflow</span>
        <div class="detail-kv"><div><span>Logged</span><strong>${esc(fmtDate(r.created))} ${esc(fmtTime(r.created))}</strong></div><div><span>SLA window</span><strong>${esc(r.slaHours)} hours</strong></div><div><span>Remaining</span><strong>${esc(slaText(r))}</strong></div><div><span>Reported via</span><strong>${esc(r.channel || "—")}</strong></div></div>
        ${r.notes ? `<div class="detail-note">${ic("i-info")}<span>${esc(r.notes)}</span></div>` : ""}
        <button class="btn btn-primary btn-block" data-act="advance-ticket" data-id="${esc(rid)}">${ic("i-arrow-right")} Advance to next status</button>
        <button class="btn btn-ghost btn-block" data-act="escalate-ticket" data-id="${esc(rid)}">${ic("i-zap")} Flag for supervisor attention</button>
      </div>` : "";
    const stageExtra = reg === "bd" ? `<div class="detail-section"><span class="detail-label">Adoption workflow</span><button class="btn btn-primary btn-block" data-act="advance-stage" data-id="${esc(rid)}">${ic("i-trend")} Advance onboarding stage</button></div>` : "";
    const docExtra = reg === "docs" ? `<div class="detail-section"><span class="detail-label">Version control</span><button class="btn btn-ghost btn-block" data-act="bump-version" data-id="${esc(rid)}">${ic("i-refresh")} Register new version</button></div>` : "";
    const hist = db.activity.filter((a) => a.ref === rid).slice(0, 6);
    const history = `<div class="detail-section"><span class="detail-label">Related audit trail</span>${hist.length ? hist.map((a) => `<div class="hist-row"><span class="hist-dot"></span><div><strong>${esc(a.title)}</strong><small>${esc(timeAgo(a.at))} · ${esc(a.type)}</small></div></div>`).join("") : `<p class="hint">No recorded changes for this item yet.</p>`}</div>`;
    openDrawer({
      eyebrow: cfg.label + " · " + rid,
      title: r.title || r.name || r.subject || r.intent || r.party || rid,
      subtitle: "Record detail, workflow actions and audit history",
      body: `<div class="detail-grid">${kv}</div>${extra}${stageExtra}${docExtra}${history}`,
      foot: `<button class="btn btn-ghost" data-act="close-overlay">Close</button><button class="btn btn-ghost danger" data-act="delete" data-reg="${reg}" data-id="${esc(rid)}">${ic("i-x")} Delete</button><button class="btn btn-primary" data-act="edit" data-reg="${reg}" data-id="${esc(rid)}">${ic("i-file")} Edit record</button>`
    });
  }

  function slaText(t) {
    if (t.status === "Resolved") return "Closed";
    const end = new Date(t.created).getTime() + (t.slaHours || 24) * 3600000;
    const d = end - Date.now();
    if (d <= 0) return "SLA breached";
    const h = Math.floor(d / 3600000), m = Math.floor((d % 3600000) / 60000);
    return h > 0 ? h + "h " + m + "m left" : m + "m left";
  }

  function confirmDelete(reg, ids) {
    const cfg = REGS[reg], list = [].concat(ids);
    openModal({
      eyebrow: "Confirm action", title: "Delete " + list.length + " " + cfg.label + (list.length > 1 ? "s" : "") + "?",
      subtitle: "This removes the record(s) from the local workspace. You can undo immediately after deletion.",
      bodyHtml: `<div class="confirm-box">${ic("i-alert")}<div><strong>${list.map((i) => { const r = findRec(reg, i); return esc(r ? (r.title || r.name || r.subject || r.intent || r.party || r.ref || i) : i); }).join(", ")}</strong><p>The audit trail will retain a record of this action.</p></div></div>`,
      submitLabel: "Delete record" + (list.length > 1 ? "s" : ""),
      submitClass: "btn-danger",
      onSubmit: () => {
        commit(() => {
          const arr = cfg.collection();
          list.forEach((id) => { const i = arr.findIndex((r) => String(idOf(r, reg)) === String(id)); if (i > -1) arr.splice(i, 1); });
          state.reg[reg].selected.clear();
        }, {
          log: { type: "Delete", title: "Deleted " + list.length + " " + cfg.label + "(s)", desc: list.join(", "), tone: "amber" },
          toast: list.length + " " + cfg.label + "(s) deleted", notify: { title: "Records removed", body: list.length + " " + cfg.label + "(s) removed from the workspace.", tone: "amber", view: cfg.view }
        });
        return true;
      }
    });
    const btn = $("[data-act='modal-submit']", $("#modal-overlay"));
    if (btn) btn.classList.add("btn-danger");
  }

  function exportReg(reg, onlySelected) {
    const cfg = REGS[reg], st = state.reg[reg];
    let rows = cfg.collection();
    if (onlySelected) rows = rows.filter((r) => st.selected.has(String(idOf(r, reg))));
    const cols = cfg.columns.length ? cfg.columns : cfg.fields.map((f) => ({ key: f.key, label: f.label, csv: (r) => Array.isArray(r[f.key]) ? r[f.key].join(" | ") : r[f.key] }));
    download("T26-" + reg + "-" + new Date().toISOString().slice(0, 10) + ".csv", toCSV(rows, cols), "text/csv;charset=utf-8");
    toast(cfg.label + " register exported as CSV", "i-download", null, null);
  }

  /* ================================================================
     STATIC CONTENT (rendered once)
     ================================================================ */
  function renderStatic() {
    $("#scope-grid").innerHTML = D.scope.map((s, i) => `<div class="scope-card"><span class="scope-no">0${i + 1}</span>${ic(s.icon)}<h4>${esc(s.title)}</h4><p>${esc(s.text)}</p></div>`).join("");
    $("#duty-grid").innerHTML = D.duties.map((d, i) => `<div class="duty-card"><div class="duty-num">DUTY 0${i + 1}</div><div class="duty-icon">${ic(d.icon)}</div><h4>${esc(d.title)}</h4><p>${esc(d.text)}</p><div class="duty-tags">${d.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div></div>`).join("");
    $("#req-list").innerHTML = D.requirements.map((r) => `<li>${r}</li>`).join("");
    const thr = (arr, alt) => arr.map((t) => `<div class="threshold-item"><div class="threshold-top"><span>${esc(t.name)}</span><strong>${esc(t.note)}</strong></div><div class="threshold-track"><i class="${alt ? "alt" : ""}" style="width:37.5%"></i><span class="threshold-marker"></span></div><div class="threshold-scale"><span>0y</span><span>2y</span><span>4y</span><span>6y</span><span>8y</span></div></div>`).join("");
    $("#thresholds-tech").innerHTML = thr(D.thresholds.tech, false);
    $("#thresholds-nontech").innerHTML = thr(D.thresholds.nontech, true);

    const flow = (arr) => arr.map((f, i) => `<div class="flow-node">${ic(f.icon)}<strong>${esc(f.label)}</strong><small>${esc(f.sub)}</small></div>` + (i < arr.length - 1 ? `<div class="flow-arrow">${ic("i-chevron-right")}</div>` : "")).join("");
    $("#flow-chatbot").innerHTML = flow(D.flowChatbot); $("#flow-smta").innerHTML = flow(D.flowSmta);
    const caps = (arr) => arr.map((c) => `<div class="cap-item">${ic(c.icon)}<div><strong>${esc(c.title)}</strong><p>${esc(c.text)}</p></div></div>`).join("");
    $("#cap-chatbot").innerHTML = caps(D.capChatbot); $("#cap-smta").innerHTML = caps(D.capSmta);
    const rm = (arr) => arr.map((r) => `<div class="rm-item"><span class="rm-when">${esc(r.when)}</span><div class="rm-body"><strong>${esc(r.title)}</strong><p>${esc(r.text)}</p><span class="rm-state ${r.cls}">${esc(r.state)}</span></div></div>`).join("");
    $("#roadmap-chatbot").innerHTML = rm(D.roadmapChatbot); $("#roadmap-smta").innerHTML = rm(D.roadmapSmta);
    $("#shared-grid").innerHTML = D.shared.map((s) => `<div class="shared-card">${ic(s.icon)}<h4>${esc(s.title)}</h4><p>${esc(s.text)}</p></div>`).join("");
    $("#shared-controls").innerHTML = D.sharedControls.map((r) => `<tr><td class="strong">${esc(r[0])}</td><td class="muted">${esc(r[1])}</td><td>${esc(r[2])}</td><td class="mono">${esc(r[3])}</td><td><span class="pill ${r[4] === "Compliant" ? "pill-green" : "pill-amber"}">${esc(r[4])}</span></td></tr>`).join("");

    $("#adoption-steps").innerHTML = D.adoptionSteps.map((s) => `<li><strong>${esc(s.title)}</strong><p>${esc(s.text)}</p></li>`).join("");
    $("#support-grid").innerHTML = D.support.map((s) => `<div class="cap-item">${ic(s.icon)}<div><strong>${esc(s.title)}</strong><p>${esc(s.text)}</p></div></div>`).join("");
    $("#framework-tbody").innerHTML = D.framework.map((r) => `<tr><td class="strong">${esc(r[0])}</td><td>${esc(r[1])}</td><td class="muted">${esc(r[2])}</td><td class="mono">${esc(r[3])}</td><td class="mono strong">${esc(r[4])}</td><td><span class="pill ${r[5] === "Met" ? "pill-green" : r[5] === "Watch" ? "pill-amber" : "pill-blue"}">${esc(r[5])}</span></td></tr>`).join("");
    $("#eval-steps").innerHTML = D.evalSteps.map((s) => `<li><strong>${esc(s.title)}</strong><p>${esc(s.text)}</p></li>`).join("");
    $("#cadence-list").innerHTML = D.cadence.map((c) => `<div class="cadence-item"><span class="cadence-when">${esc(c.when)}</span><div class="cadence-body"><strong>${esc(c.title)}</strong><p>${esc(c.text)}</p></div><span class="pill pill-outline">${esc(c.tag)}</span></div>`).join("");

    $("#lifecycle-flow").innerHTML = D.lifecycle.map((l) => `<div class="lc-card"><span class="lc-num">${esc(l.num)} / 05</span>${ic(l.icon)}<h4>${esc(l.title)}</h4><p>${esc(l.text)}</p></div>`).join("");
    $("#stage-grid").innerHTML = D.stages.map((s) => `<div class="stage-card"><h4>${esc(s.title)}</h4><p>${esc(s.text)}</p><div class="stage-block"><span>Key activities</span><p>${esc(s.activities)}</p></div><div class="stage-block"><span>Artefacts</span><div class="stage-chips">${s.artefacts.map((a) => `<span>${esc(a)}</span>`).join("")}</div></div><div class="stage-block"><span>Exit criteria</span><p>${esc(s.exit)}</p></div></div>`).join("");
    $("#gates-tbody").innerHTML = D.gates.map((r) => `<tr><td class="strong">${esc(r[0])}</td><td class="muted">${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td>${esc(r[4])}</td></tr>`).join("");
    $("#change-list").innerHTML = D.changeList.map((c) => `<li>${esc(c)}</li>`).join("");
    $("#raci-tbody").innerHTML = D.raci.map((r) => "<tr><td class='strong'>" + esc(r[0]) + "</td>" + r.slice(1).map((v) => `<td><span class="${v === "A" ? "r-a" : v === "R" ? "r-r" : v === "C" ? "r-c" : "r-i"}">${v}</span></td>`).join("") + "</tr>").join("");

    $("#stake-grid").innerHTML = D.stakeholders.map((s) => `<div class="stake-card">${ic(s.icon)}<h4>${esc(s.title)}</h4><p>${esc(s.text)}</p><ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("");
    $("#info-flow").innerHTML = D.infoGroups.map((g, i) => `<div class="info-group ${g.cls}"><strong>${ic(g.icon)}${esc(g.title)}</strong><ul>${g.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` + (i < D.infoGroups.length - 1 ? `<div class="info-arrow">${ic("i-arrow-right")}</div>` : "")).join("");
    $("#coordination-list").innerHTML = D.coordination.map((c) => `<div class="cadence-item"><span class="cadence-when">${esc(c.when)}</span><div class="cadence-body"><strong>${esc(c.title)}</strong><p>${esc(c.text)}</p></div><span class="pill pill-outline">${esc(c.tag)}</span></div>`).join("");
    $("#vendor-controls").innerHTML = D.vendorControls.map((c) => `<li>${esc(c)}</li>`).join("");
    $("#radar-list").innerHTML = D.radar.map((r) => `<div class="radar-item"><div><strong>${esc(r.title)}</strong><p>${esc(r.text)}</p></div><span class="pill ${r.cls}">${esc(r.ring)}</span></div>`).join("");
    $("#research-steps").innerHTML = D.researchSteps.map((s) => `<li><strong>${esc(s.title)}</strong><p>${esc(s.text)}</p></li>`).join("");
    $("#filing-rules").innerHTML = D.filingRules.map((r) => `<li>${esc(r)}</li>`).join("");
    $("#physical-grid").innerHTML = D.physical.map((p) => `<div class="phys-item">${ic(p.icon)}<strong>${esc(p.title)}</strong><p>${esc(p.text)}</p></div>`).join("");
    $("#severity-tbody").innerHTML = D.severity.map((r) => `<tr><td><span class="pill ${r[5]}">${esc(r[0])}</span></td><td class="muted">${esc(r[1])}</td><td class="mono strong">${esc(r[2])}</td><td class="mono">${esc(r[3])}</td><td>${esc(r[4])}</td></tr>`).join("");
    $("#roster-list").innerHTML = D.roster.map((r) => `<div class="roster-row"><span class="roster-week">${esc(r.week)}</span><div class="roster-person">${esc(r.primary)}<small>${esc(r.psub)}</small></div><div class="roster-person">${esc(r.secondary)}<small>${esc(r.ssub)}</small></div><span class="pill ${r.tag}">Confirmed</span></div>`).join("");
    $("#incident-steps").innerHTML = D.incidentSteps.map((s) => `<li><strong>${esc(s.title)}</strong><p>${esc(s.text)}</p></li>`).join("");
    $("#events-grid").innerHTML = D.events.map((e) => `<div class="event-card">${ic(e.icon)}<strong>${esc(e.title)}</strong><p>${esc(e.text)}</p><span>${esc(e.time)}</span></div>`).join("");
    $("#escalation-flow").innerHTML = D.escalation.map((e) => `<div class="esc-step">${ic(e.icon)}<strong>${esc(e.title)}</strong><p>${esc(e.text)}</p><span>${esc(e.tag)}</span></div>`).join("");
    $("#evidence-list").innerHTML = D.evidence.map((e) => `<li>${esc(e)}</li>`).join("");

    /* Lab sample chips */
    $("#lab-samples").innerHTML = D.socialSamples.map((s, i) => `<button class="chip" data-act="lab-sample" data-idx="${i}">${esc(s.label)}</button>`).join("");
    /* Chat suggestions */
    $("#chat-suggest").innerHTML = D.chatSamples.map((s) => `<button class="suggest-chip" data-act="chat-suggest" data-q="${esc(s)}">${esc(s)}</button>`).join("");
    /* New menu */
    $("#new-menu").innerHTML = [
      { reg: "tickets", icon: "i-lifebuoy", label: "New incident", sub: "Log a support request" },
      { reg: "bd", icon: "i-building", label: "Add B/D record", sub: "Extend the adoption register" },
      { reg: "docs", icon: "i-file", label: "Register document", sub: "Add an electronic or physical file" },
      { reg: "vendors", icon: "i-briefcase", label: "Add engagement", sub: "Vendor or contractor record" },
      { reg: "research", icon: "i-book", label: "New research brief", sub: "Gen AI / data analytics finding" },
      { reg: "kb", icon: "i-message", label: "Knowledge entry", sub: "Chatbot corpus item" }
    ].map((m) => `<button class="dropdown-item" data-act="add" data-reg="${m.reg}">${ic(m.icon)}<span><strong>${esc(m.label)}</strong><small>${esc(m.sub)}</small></span></button>`).join("");
  }

  /* ================================================================
     DYNAMIC RENDERERS
     ================================================================ */
  function renderPriorities() {
    $("#priority-list").innerHTML = D.priorities.map((p, i) => {
      const done = !!db.priorities[i];
      return `<li class="priority-item ${done ? "done" : ""}" data-act="priority" data-idx="${i}"><span class="priority-check ${done ? "done" : ""}">${done ? ic("i-check") : ""}</span><div class="priority-text">${esc(p.text)}<small>${esc(p.sub)}</small></div></li>`;
    }).join("");
  }
  function renderRunbook() {
    const done = db.runbook.filter(Boolean).length;
    $("#runbook-list").innerHTML = D.runbook.map((r, i) => `<label class="runbook-item ${db.runbook[i] ? "checked" : ""}"><input type="checkbox" data-act="runbook" data-idx="${i}" ${db.runbook[i] ? "checked" : ""}><span class="rb-box">${ic("i-check")}</span><span class="rb-text">${esc(r.text)}<small>${esc(r.sub)}</small></span></label>`).join("");
    $("#runbook-progress").textContent = done + " / " + D.runbook.length;
    $("#runbook-bar-fill").style.width = (done / D.runbook.length * 100) + "%";
  }
  function renderAssessment() {
    $("#assess-req").innerHTML = D.assessReq.map((r, i) => `<label class="assess-item ${db.assess.req[i] ? "checked" : ""}"><input type="checkbox" data-act="assess-req" data-idx="${i}" ${db.assess.req[i] ? "checked" : ""}><span class="assess-box">${ic("i-check")}</span><span class="assess-body"><strong>${esc(r.text)}</strong><small>${esc(r.hint)}</small></span></label>`).join("");
    $("#assess-skills").innerHTML = D.assessSkills.map((s, i) => {
      const v = Number(db.assess.skills[i]) || 0, met = v >= 3;
      return `<div class="skill-row"><div><strong>${esc(s.text)}</strong><small>${esc(s.hint)}</small></div><label class="skill-input"><input type="number" min="0" max="30" step="0.5" value="${v}" data-act="assess-skill" data-idx="${i}" aria-label="Years of experience"><span>yrs</span></label><span class="skill-state ${met ? "met" : "unmet"}">${met ? "MET" : "—"}</span></div>`;
    }).join("");
    updateScore();
  }
  function updateScore() {
    const reqDone = db.assess.req.filter(Boolean).length;
    const yrs = db.assess.skills.map((v) => Math.max(0, Math.min(3, Number(v) || 0)) / 3);
    const tech = (yrs[0] + yrs[1]) / 2, nontech = (yrs[2] + yrs[3]) / 2;
    const overall = Math.round((reqDone / 6 * 0.5 + yrs.reduce((a, b) => a + b, 0) / 4 * 0.5) * 100);
    $("#req-score").textContent = reqDone + " / 6";
    $("#skill-score").textContent = yrs.filter((v) => v >= 1).length + " / 4 met";
    $("#score-value").textContent = overall + "%";
    const p = palette(), r = 68, C = 2 * Math.PI * r;
    $("#score-ring").innerHTML = `<svg viewBox="0 0 168 168" width="168" height="168"><circle cx="84" cy="84" r="${r}" fill="none" stroke="${p.surfaceAlt}" stroke-width="12"/><circle cx="84" cy="84" r="${r}" fill="none" stroke="${p.brand}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - overall / 100)}" transform="rotate(-90 84 84)" style="transition:stroke-dashoffset .55s"/><circle cx="84" cy="84" r="52" fill="none" stroke="${p.line}" stroke-width="1" stroke-dasharray="3 5"/></svg>`;
    const bar = (label, val, color) => `<div class="sb-row"><span>${label}</span><strong>${Math.round(val * 100)}%</strong><div class="sb-track"><i style="width:${val * 100}%;background:${color}"></i></div></div>`;
    $("#score-breakdown").innerHTML = bar("Requirement details", reqDone / 6, p.brand) + bar("Technical thresholds", tech, p.accent) + bar("Non-technical thresholds", nontech, p.violet);
    $("#score-verdict").textContent = overall === 0 ? "Start by marking the requirements you can evidence." : overall < 40 ? "Early stage. Focus first on the four mandatory three-year thresholds — they carry half of the weighting." : overall < 75 ? "Good foundation. Add evidence for the outstanding requirements and check skill areas still below three years." : overall < 100 ? "Strong match. Close the remaining gaps and prepare concise evidence pointers." : "Full mapping complete. Every stated requirement is evidenced and all four thresholds are met.";
  }

  function renderResearch() {
    const rows = db.research.filter((r) => state.reg.research.filter === "All" || r.cat === state.reg.research.filter);
    const mcls = (m) => m === "Adopt" ? "pill-green" : m === "Trial" ? "pill-blue" : m === "Assess" ? "pill-violet" : "pill-amber";
    $("#research-grid").innerHTML = rows.map((r) => `<div class="research-card"><div class="rc-top"><span class="rc-id">${esc(r.id)}</span><span class="pill ${mcls(r.maturity)}">${esc(r.maturity)}</span></div><h4 class="rc-title">${esc(r.title)}</h4><p class="rc-finding">${esc(r.finding)}</p><div class="rc-implication"><strong>Implication · </strong>${esc(r.implication || "To be assessed.")}</div><div class="rc-foot"><span>${esc(r.cat)}</span><span>${esc(r.date)}</span></div><div class="rc-actions"><button class="mini-btn" data-act="detail" data-reg="research" data-id="${esc(r.id)}">${ic("i-external")} Open</button><button class="mini-btn" data-act="edit" data-reg="research" data-id="${esc(r.id)}">${ic("i-file")} Edit</button><button class="mini-btn" data-act="delete" data-reg="research" data-id="${esc(r.id)}">${ic("i-x")} Delete</button></div></div>`).join("");
    $("#research-filter").innerHTML = D.researchCats.map((c) => `<button class="chip ${c === state.reg.research.filter ? "active" : ""}" data-act="filter" data-reg="research" data-value="${esc(c)}">${esc(c)}</button>`).join("");
  }

  function renderDashboard() {
    const live = db.bd.filter((r) => r.stage === "Live").length;
    const total = db.bd.length, pipeline = total - live;
    const resolved = db.tickets.filter((t) => t.status === "Resolved").length;
    const openP1 = db.tickets.filter((t) => String(t.priority).indexOf("P1") === 0 && t.status !== "Resolved").length;
    const unresolved = db.tickets.filter((t) => t.status !== "Resolved").length;

    const cards = $$(".kpi-card");
    const setKpi = (i, value, foot) => {
      if (!cards[i]) return;
      const span = $("[data-count]", cards[i]);
      if (span) { span.dataset.count = String(value); span.textContent = String(value); }
      const f = $(".kpi-foot", cards[i]); if (f && foot) f.innerHTML = foot;
    };
    setKpi(0, "99.87", "Target ≥ 99.5% <span>·</span> SLA met");
    setKpi(1, live, pipeline + " in active pipeline <span>·</span> " + Math.round(live / Math.max(1, total) * 100) + "% coverage");
    setKpi(2, "486", "Conversations + text items analysed");
    setKpi(3, resolved, unresolved + " still open <span>·</span> 94% within response SLA");

    const hp = $$(".hero-panel-row");
    if (hp[2]) { const s = $("strong", hp[2]); if (s) { s.textContent = String(openP1); s.className = openP1 ? "accent-red" : "accent-green"; } }

    $("#health-list").innerHTML = D.health.map((h) => {
      const n = db.tickets.filter((t) => t.status !== "Resolved" && (String(t.platform) === (h.icon === "i-message" ? "Chatbot" : "SMTA") || t.platform === "Both")).length;
      return `<div class="health-row"><div class="health-name"><span class="health-badge">${ic(h.icon)}</span>${esc(h.name)}</div><div class="health-status"><span class="dot ${n ? "dot-amber" : "dot-green"}"></span>${n ? n + " open ticket" + (n > 1 ? "s" : "") : "Operational"}</div><div class="health-meta"><div class="uptime-track"><i style="width:${h.uptime}%"></i></div><span class="uptime-num">${h.uptime}% uptime</span></div><div class="health-sub">${esc(h.note)}</div></div>`;
    }).join("");

    $("#activity-timeline").innerHTML = db.activity.slice(0, 6).map((a) => `<div class="tl-item ${a.tone}"><span class="tl-dot"></span><div class="tl-head"><span class="tl-title">${esc(a.title)}</span><span class="tl-time">${esc(timeAgo(a.at))}</span></div><p class="tl-desc">${esc(a.desc)}</p></div>`).join("");
    renderPriorities();

    const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
    set("#adstat-total", total); set("#adstat-live", live); set("#adstat-pipeline", pipeline); set("#adstat-rate", Math.round(live / Math.max(1, total) * 100) + "%");
    set("#docstat-total", db.docs.length);
    set("#docstat-month", db.docs.filter((d) => String(d.updated).slice(0, 7) === new Date().toISOString().slice(0, 7)).length);
    set("#docstat-physical", db.docs.filter((d) => d.format !== "Electronic").length);
    set("#docstat-review", db.docs.filter((d) => d.status === "Review due").length);

    $("#metric-grid").innerHTML = [
      { label: "Platform availability", value: "99.87%", note: "Target ≥ 99.5%", ok: true },
      { label: "Intent resolution rate", value: "92.4%", note: "Target ≥ 90%", ok: true },
      { label: "Median response time", value: "1.2 s", note: "Target ≤ 2.0 s", ok: true },
      { label: "Sentiment agreement", value: avgAgreement() + "%", note: "Live corpus agreement", ok: true },
      { label: "Open support tickets", value: String(unresolved), note: "Across both platforms", ok: unresolved < 10 },
      { label: "B/Ds live", value: live + " / " + total, note: "Target 20 by year end", ok: live >= 14 }
    ].map((m) => `<div class="metric-card"><span>${esc(m.label)}</span><strong>${esc(m.value)}</strong><small class="${m.ok ? "ok" : "warn"}">${m.ok ? "● " : "▲ "}${esc(m.note)}</small></div>`).join("");
  }
  function avgAgreement() { return (86 + Math.min(9, db.corpus.length / 3)).toFixed(1); }

  /* ---- Charts ---- */
  function sparkSVG(values) {
    const p = palette(), w = 200, h = 34, pad = 2;
    const min = Math.min.apply(null, values), max = Math.max.apply(null, values), span = (max - min) || 1;
    const pts = values.map((v, i) => [pad + i * (w - pad * 2) / (values.length - 1), h - pad - ((v - min) / span) * (h - pad * 2 - 4)]);
    const d = "M " + pts.map((q) => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" L ");
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="spg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.brand}" stop-opacity=".24"/><stop offset="1" stop-color="${p.brand}" stop-opacity="0"/></linearGradient></defs><path d="${d} L ${w - pad},${h} L ${pad},${h} Z" fill="url(#spg)"/><path d="${d}" fill="none" stroke="${p.brand}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/><circle cx="${pts[pts.length - 1][0]}" cy="${pts[pts.length - 1][1]}" r="2.6" fill="${p.surface}" stroke="${p.brand}" stroke-width="1.8" vector-effect="non-scaling-stroke"/></svg>`;
  }
  function funnelData() {
    return [{ label: "Live", value: db.bd.filter((r) => r.stage === "Live").length, color: "var(--green)", note: "Production tenants with signed support arrangements" },
      { label: "Pilot", value: db.bd.filter((r) => r.stage === "Pilot").length, color: "var(--brand-2)", note: "Controlled rollout with evaluation checkpoints" },
      { label: "Assessment", value: db.bd.filter((r) => r.stage === "Assessment").length, color: "var(--violet)", note: "Requirements and data-governance review" },
      { label: "Discovery", value: db.bd.filter((r) => r.stage === "Discovery").length + db.bd.filter((r) => r.stage === "On hold").length, color: "var(--faint)", note: "Initial briefing, qualification or paused" }];
  }
  function donutSVG(el, items, centreTop, centreSub, suffix) {
    if (!el) return;
    suffix = suffix || "%";
    const p = palette(), total = items.reduce((a, b) => a + b.value, 0) || 1;
    const r = 68, C = 2 * Math.PI * r, gap = 2.5;
    let acc = 0;
    const arcs = items.map((it) => {
      const len = it.value / total * C;
      const s = `<circle cx="100" cy="100" r="${r}" fill="none" stroke="${resolve(it.color)}" stroke-width="20" stroke-dasharray="${Math.max(0, len - gap)} ${C}" stroke-dashoffset="${-acc}" transform="rotate(-90 100 100)"/>`;
      acc += len; return s;
    }).join("");
    el.innerHTML = `<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="${r}" fill="none" stroke="${p.surfaceAlt}" stroke-width="20"/>${arcs}<text x="100" y="95" text-anchor="middle" font-family="Manrope, sans-serif" font-size="27" font-weight="800" fill="${p.ink}">${esc(centreTop)}</text><text x="100" y="116" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="${p.muted}">${esc(centreSub)}</text></svg><div class="donut-legend">${items.map((it) => `<div><i style="background:${resolve(it.color)}"></i><span>${esc(it.label)}</span><strong>${it.value}${suffix}</strong></div>`).join("")}</div>`;
  }
  function smoothPath(pts) {
    if (pts.length < 2) return "";
    let d = "M " + pts[0][0].toFixed(1) + "," + pts[0][1].toFixed(1);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += " C " + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + "," + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + " " + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + "," + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + " " + p2[0].toFixed(1) + "," + p2[1].toFixed(1);
    }
    return d;
  }
  function renderLineChart() {
    const el = $("#chart-interactions");
    if (!el || !$("#view-performance").classList.contains("active")) return;
    const p = palette(), w = Math.max(240, el.clientWidth), h = 288;
    const pad = { l: 44, r: 14, t: 16, b: 30 }, n = state.period;
    const labels = D.months.slice(-n), s1 = D.seriesChatbot.slice(-n), s2 = D.seriesSmta.slice(-n);
    const maxV = Math.ceil(Math.max.apply(null, s1.concat(s2)) / 50) * 50;
    const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;
    const X = (i) => pad.l + pw * i / (n - 1), Y = (v) => pad.t + ph * (1 - v / maxV);
    const P1 = s1.map((v, i) => [X(i), Y(v)]), P2 = s2.map((v, i) => [X(i), Y(v)]);
    let grid = "";
    for (let k = 0; k <= 4; k++) {
      const v = maxV * k / 4, y = Y(v);
      grid += `<line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" stroke="${p.line}" stroke-width="1" ${k === 0 ? "" : 'stroke-dasharray="3 5"'}/><text x="${pad.l - 9}" y="${y + 3.5}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="9" fill="${p.faint}">${v}</text>`;
    }
    const step = w < 560 ? 2 : 1;
    let xl = "";
    labels.forEach((l, i) => { if (i % step !== 0 && i !== n - 1) return; xl += `<text x="${X(i)}" y="${h - 8}" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" fill="${p.faint}">${esc(l)}</text>`; });
    const l1 = smoothPath(P1), l2 = smoothPath(P2);
    el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Monthly platform usage trend"><defs><linearGradient id="lcArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.brand}" stop-opacity=".20"/><stop offset="1" stop-color="${p.brand}" stop-opacity="0"/></linearGradient></defs>${grid}${xl}<path d="${l1} L ${X(n - 1).toFixed(1)},${Y(0).toFixed(1)} L ${X(0).toFixed(1)},${Y(0).toFixed(1)} Z" fill="url(#lcArea)"/><path d="${l2}" fill="none" stroke="${p.accent}" stroke-width="2.2" stroke-linejoin="round"/><path d="${l1}" fill="none" stroke="${p.brand}" stroke-width="2.6" stroke-linejoin="round"/><circle cx="${P1[n - 1][0]}" cy="${P1[n - 1][1]}" r="4" fill="${p.surface}" stroke="${p.brand}" stroke-width="2.4"/><circle cx="${P2[n - 1][0]}" cy="${P2[n - 1][1]}" r="4" fill="${p.surface}" stroke="${p.accent}" stroke-width="2.4"/><g id="lc-hover" style="display:none"><line id="lc-vline" y1="${pad.t}" y2="${pad.t + ph}" stroke="${p.faint}" stroke-width="1" stroke-dasharray="3 4"/><circle id="lc-d1" r="4.5" fill="${p.surface}" stroke="${p.brand}" stroke-width="2.4"/><circle id="lc-d2" r="4.5" fill="${p.surface}" stroke="${p.accent}" stroke-width="2.4"/></g><rect id="lc-hit" x="${pad.l}" y="${pad.t}" width="${pw}" height="${ph}" fill="transparent" pointer-events="all" style="cursor:crosshair"/></svg><div class="chart-tooltip" id="lc-tip"></div>`;
    const svg = $("svg", el), hit = $("#lc-hit", el), hover = $("#lc-hover", el), tip = $("#lc-tip", el);
    hit.addEventListener("mousemove", (ev) => {
      const rect = svg.getBoundingClientRect();
      let i = Math.round(((ev.clientX - rect.left) * (w / rect.width) - pad.l) / (pw / (n - 1)));
      i = Math.max(0, Math.min(n - 1, i));
      hover.style.display = "";
      $("#lc-vline", el).setAttribute("x1", X(i)); $("#lc-vline", el).setAttribute("x2", X(i));
      $("#lc-d1", el).setAttribute("cx", X(i)); $("#lc-d1", el).setAttribute("cy", Y(s1[i]));
      $("#lc-d2", el).setAttribute("cx", X(i)); $("#lc-d2", el).setAttribute("cy", Y(s2[i]));
      tip.innerHTML = `<b>${esc(labels[i])}</b><br>Chatbot: ${s1[i]}K conversations<br>Text analytics: ${s2[i]}K items`;
      tip.style.left = (X(i) / w * 100) + "%"; tip.style.top = (Math.min(Y(s1[i]), Y(s2[i])) / h * 100 - 2) + "%";
      tip.classList.add("show");
    });
    hit.addEventListener("mouseleave", () => { hover.style.display = "none"; tip.classList.remove("show"); });
    $("#chart-legend").innerHTML = `<span><i style="background:${p.brand}"></i>Chatbot conversations</span><span><i style="background:${p.accent}"></i>Text items analysed</span>`;
    $("#chart-range").textContent = n === 12 ? "Dec 2025 – Nov 2026" : "Jun – Nov 2026";
  }
  function renderCharts() {
    $$("[data-spark]").forEach((el) => { el.innerHTML = sparkSVG(D.sparks[el.dataset.spark] || []); });
    const f = funnelData(), max = Math.max.apply(null, f.map((x) => x.value).concat([1]));
    $("#adoption-funnel").innerHTML = `<div>${f.map((x) => `<div class="funnel-row"><div class="funnel-top"><span>${esc(x.label)}</span><strong>${x.value} B/Ds</strong></div><div class="funnel-track"><i style="width:${(x.value / max * 100).toFixed(1)}%;background:${resolve(x.color)}"></i></div><div class="funnel-note">${esc(x.note)}</div></div>`).join("")}<div class="funnel-legend"><span><i style="background:${cssVar("--green")}"></i>Live</span><span><i style="background:${cssVar("--brand-2")}"></i>Pilot</span><span><i style="background:${cssVar("--violet")}"></i>Assessment</span><span><i style="background:${cssVar("--faint")}"></i>Discovery</span></div></div>`;
    donutSVG($("#adoption-donut"), f.slice().reverse(), db.bd.length, "B/Ds in programme", " B/Ds");
    const cats = ["Configuration & access", "Content & knowledge", "Integration", "Data & reporting", "Performance", "Change & release"];
    const cols = ["var(--brand-2)", "var(--accent)", "var(--violet)", "var(--amber)", "var(--faint)", "var(--green)"];
    const counts = cats.map((c) => db.tickets.filter((t) => t.category === c).length);
    const tot = counts.reduce((a, b) => a + b, 0) || 1;
    donutSVG($("#donut-tickets"), cats.map((c, i) => ({ label: c, value: Math.round(counts[i] / tot * 100), color: cols[i] })).filter((x) => x.value > 0), db.tickets.length, "tickets logged");
    $("#bar-sla").innerHTML = D.sla.map((s) => `<div class="bar-row"><div class="bar-top"><span>${esc(s.label)}</span><strong>${s.value}%</strong></div><div class="bar-track"><i style="width:${s.value}%;background:${resolve(s.color)}"></i></div></div>`).join("") + `<div class="funnel-note">Target: ≥ 95% of tickets acknowledged within the agreed response window.</div>`;
    renderLineChart();
    updateScore();
  }

  /* ---- Service desk ---- */
  function renderDesk() {
    const t = db.tickets;
    const set = (id, v) => { const e = $(id); if (e) e.textContent = v; };
    set("#desk-open", t.filter((x) => x.status === "Open").length);
    set("#desk-progress", t.filter((x) => x.status === "In progress").length);
    set("#desk-resolved", t.filter((x) => x.status === "Resolved").length);
    set("#desk-sla", t.filter((x) => x.status !== "Resolved" && slaText(x).indexOf("breached") > -1).length);
    set("#desk-total", t.length);
    const watch = t.filter((x) => x.status !== "Resolved").sort((a, b) => new Date(a.created) - new Date(b.created)).slice(0, 7);
    $("#desk-watchlist").innerHTML = watch.length ? watch.map((x) => {
      const s = slaText(x), bad = s.indexOf("breached") > -1;
      return `<div class="watch-row" data-act="detail" data-reg="tickets" data-id="${esc(x.id)}"><span class="mono">${esc(x.id)}</span><div><strong>${esc(x.subject)}</strong><small>${esc(x.bd)}</small></div><span class="pill ${bad ? "pill-red" : s.indexOf("left") > -1 && parseInt(s) < 6 ? "pill-amber" : "pill-blue"}">${esc(s)}</span></div>`;
    }).join("") : `<p class="hint">No unresolved tickets. The desk is clear.</p>`;
    const prios = ["P1 · Critical", "P2 · Major", "P3 · Moderate", "P4 · Low"];
    const colors = ["var(--red)", "var(--amber)", "var(--brand-2)", "var(--faint)"];
    $("#desk-priority").innerHTML = prios.map((p, i) => {
      const n = t.filter((x) => x.priority === p && x.status !== "Resolved").length;
      const mx = Math.max(1, ...prios.map((q) => t.filter((x) => x.priority === q && x.status !== "Resolved").length));
      return `<div class="bar-row"><div class="bar-top"><span>${esc(p)}</span><strong>${n} open</strong></div><div class="bar-track"><i style="width:${n / mx * 100}%;background:${resolve(colors[i])}"></i></div></div>`;
    }).join("");
  }

  /* ---- Chatbot console ---- */
  function respond(query, tenant) {
    const q = query.toLowerCase().trim();
    const pool = db.kb.filter((k) => tenant === "All" || k.tenant === "All" || k.tenant === tenant);
    let best = null, bestScore = 0;
    pool.forEach((k) => {
      let s = 0;
      k.patterns.forEach((p) => { if (p && q.indexOf(p.toLowerCase()) > -1) s += 2; });
      q.split(/\s+/).forEach((w) => { if (w.length > 3 && k.patterns.some((p) => p.indexOf(w) > -1)) s += 1; });
      if (s > bestScore) { bestScore = s; best = k; }
    });
    const confidence = Math.min(0.98, 0.4 + bestScore * 0.16);
    const g = db.settings.guardrails;
    const pass = best && bestScore > 0 && confidence >= g.minConfidence;
    return {
      intent: best ? best.intent : "Unclassified / fallback",
      confidence: pass ? confidence : Math.round(confidence * 100) / 100,
      source: pass && g.citations ? best.source : "",
      answer: pass ? best.answer : "I could not confidently match this enquiry to the governed knowledge base. To avoid an unverified answer, I have routed this to a fallback response. Please rephrase, or escalate to the service desk for a human response.",
      flagged: pass && g.humanReview && confidence < 0.75,
      fallback: !pass, kbId: best ? best.id : ""
    };
  }
  function renderConsoleDynamic() {
    const selEl = $("#chat-tenant");
    if (selEl) {
      const cur = db.chat.tenant;
      const tenants = db.bd.filter((b) => b.stage === "Live" && b.platform !== "SMTA");
      selEl.innerHTML = `<option value="All">All tenants · administrator view</option>` + tenants.map((b) => `<option value="${esc(b.abbr)}" ${cur === b.abbr ? "selected" : ""}>${esc(b.name)} (${esc(b.abbr)})</option>`).join("");
      selEl.value = cur;
      if (selEl.value !== cur) { selEl.value = "All"; db.chat.tenant = "All"; }
    }
    const msgs = db.chat.messages;
    $("#chat-window").innerHTML = msgs.map((m) => {
      if (m.role === "bot") return `<div class="chat-msg bot"><span class="chat-avatar">${ic("i-sparkles")}</span><div class="chat-bubble"><div class="chat-meta"><strong>Virtual assistant</strong><span>${esc(fmtTime(m.at))}</span></div><p>${esc(m.text)}</p>${m.intent && m.intent !== "Session start" ? `<div class="chat-tags"><span class="pill ${m.fallback ? "pill-red" : "pill-blue"}">${esc(m.intent)}</span><span class="pill pill-soft">Confidence ${Math.round((m.confidence || 0) * 100)}%</span>${m.flagged ? `<span class="pill pill-amber">Human review</span>` : ""}</div>` : ""}${m.source ? `<div class="chat-source">${ic("i-book")} Grounded in ${esc(m.source)}</div>` : ""}</div></div>`;
      return `<div class="chat-msg user"><div class="chat-bubble"><div class="chat-meta"><strong>Citizen enquiry</strong><span>${esc(fmtTime(m.at))}</span></div><p>${esc(m.text)}</p></div><span class="chat-avatar user-avatar">${ic("i-users")}</span></div>`;
    }).join("");
    const cw = $("#chat-window"); if (cw) cw.scrollTop = cw.scrollHeight;

    const userMsgs = msgs.filter((m) => m.role === "bot" && m.intent && m.intent !== "Session start");
    const avg = userMsgs.length ? (userMsgs.reduce((a, m) => a + (m.confidence || 0), 0) / userMsgs.length) : 0;
    const fallbacks = userMsgs.filter((m) => m.fallback).length;
    const intents = new Set(userMsgs.filter((m) => !m.fallback).map((m) => m.intent)).size;
    $("#chat-telemetry").innerHTML = [
      ["Turns", msgs.filter((m) => m.role === "user").length],
      ["Avg. confidence", Math.round(avg * 100) + "%"],
      ["Fallback rate", (userMsgs.length ? Math.round(fallbacks / userMsgs.length * 100) : 0) + "%"],
      ["Distinct intents", intents]
    ].map(([k, v]) => `<div class="telemetry-item"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join("");

    $("#kb-list").innerHTML = db.kb.slice(0, 8).map((k) => `<div class="kb-item"><div><strong>${esc(k.intent)}</strong><small>${esc(k.tenant)} · ${esc(k.version)} · ${k.patterns.length} keywords</small></div><div class="kb-actions"><button class="row-btn" data-act="edit" data-reg="kb" data-id="${esc(k.id)}" title="Edit">${ic("i-file")}</button><button class="row-btn danger" data-act="delete" data-reg="kb" data-id="${esc(k.id)}" title="Delete">${ic("i-x")}</button></div></div>`).join("") + (db.kb.length > 8 ? `<p class="hint">+ ${db.kb.length - 8} more entries in the governed corpus</p>` : "");

    const g = db.settings.guardrails;
    $("#guardrail-list").innerHTML = `
      <label class="guard-row"><span><strong>Require source citation</strong><small>Every answer must reference an approved corpus item</small></span><input type="checkbox" data-act="guard" data-key="citations" ${g.citations ? "checked" : ""}></label>
      <label class="guard-row"><span><strong>Flag low-confidence for human review</strong><small>Applies below 75% intent confidence</small></span><input type="checkbox" data-act="guard" data-key="humanReview" ${g.humanReview ? "checked" : ""}></label>
      <div class="guard-row"><span><strong>Minimum confidence threshold</strong><small>Answers below this score are routed to fallback</small></span><div class="guard-range"><input type="range" min="0.35" max="0.9" step="0.05" value="${g.minConfidence}" data-act="guard-range"><b>${Math.round(g.minConfidence * 100)}%</b></div></div>`;
  }
  function chatSend(text) {
    const q = String(text || "").trim(); if (!q) return;
    const tenant = db.chat.tenant;
    const r = respond(q, tenant);
    commit(() => {
      db.chat.messages.push({ id: uid("MSG"), role: "user", text: q, at: new Date().toISOString() });
      db.chat.messages.push({ id: uid("MSG"), role: "bot", text: r.answer, at: new Date().toISOString(), intent: r.intent, confidence: r.confidence, source: r.source, flagged: r.flagged, fallback: r.fallback });
      if (db.chat.messages.length > 80) db.chat.messages = db.chat.messages.slice(-80);
    }, { log: { type: "Chatbot", title: "Console query · " + r.intent, desc: q.slice(0, 110), tone: r.fallback ? "amber" : "teal" }, toast: null, undo: false });
    if (r.fallback) toast("Low confidence — fallback response returned", "i-alert", null, null);
  }
  function chatEscalate() {
    const last = db.chat.messages.slice().reverse().find((m) => m.role === "user");
    commit(() => {
      db.tickets.unshift({ id: uid("INC"), subject: last ? "Chatbot escalation · " + last.text.slice(0, 70) : "Chatbot escalation · operator request", bd: db.chat.tenant === "All" ? "Digital Policy Office" : (db.bd.find((b) => b.abbr === db.chat.tenant) || {}).name || "Digital Policy Office", platform: "Chatbot", priority: "P3 · Moderate", status: "Open", assignee: "CSSA", category: "Content & knowledge", created: new Date().toISOString(), slaHours: 72, channel: "Chatbot console", notes: "Escalated from an unmatched or low-confidence conversational query." });
    }, { log: { type: "Escalation", title: "Chatbot query escalated to service desk", desc: last ? last.text.slice(0, 120) : "Operator requested human support", tone: "amber" }, notify: { title: "New escalation from Chatbot Console", body: "A low-confidence enquiry was routed to the service desk.", tone: "amber", view: "desk" }, toast: "Escalation logged in Service Desk" });
  }

  /* ---- Text analytics lab ---- */
  function renderLabDynamic() {
    const c = db.corpus;
    const counts = { Positive: 0, Negative: 0, Neutral: 0, Mixed: 0 };
    c.forEach((x) => { counts[x.label] = (counts[x.label] || 0) + 1; });
    const avg = c.length ? c.reduce((a, x) => a + x.score, 0) / c.length : 0;
    const conf = c.length ? c.reduce((a, x) => a + x.confidence, 0) / c.length : 0;
    const pii = c.filter((x) => x.piiCount > 0).length;
    const sCls = { Positive: "pill-green", Negative: "pill-red", Neutral: "pill-soft", Mixed: "pill-amber" };
    $("#lab-stats").innerHTML = `<div class="lab-stat-grid"><div><span>Items analysed</span><strong>${c.length}</strong></div><div><span>Positive</span><strong class="txt-green">${counts.Positive || 0}</strong></div><div><span>Negative</span><strong class="txt-red">${counts.Negative || 0}</strong></div><div><span>Mixed / neutral</span><strong>${(counts.Mixed || 0) + (counts.Neutral || 0)}</strong></div></div><div class="lab-stat-lines"><div><span>Mean sentiment</span><b>${avg.toFixed(2)}</b></div><div><span>Mean confidence</span><b>${Math.round(conf * 100)}%</b></div><div><span>PII-screened items</span><b>${pii}</b></div></div>`;
    const tm = {};
    c.forEach((x) => (x.topics || []).forEach((t) => { tm[t] = (tm[t] || 0) + 1; }));
    const entries = Object.keys(tm).sort((a, b) => tm[b] - tm[a]);
    const mx = Math.max.apply(null, entries.map((k) => tm[k]).concat([1]));
    $("#lab-topics").innerHTML = entries.length ? entries.map((k) => `<div class="bar-row"><div class="bar-top"><span>${esc(k)}</span><strong>${tm[k]} items</strong></div><div class="bar-track"><i style="width:${tm[k] / mx * 100}%;background:linear-gradient(90deg,var(--accent),var(--brand-2))"></i></div></div>`).join("") : `<p class="hint">No topics identified yet.</p>`;
    const rows = c.slice(0, 12);
    $("#lab-table").innerHTML = `<thead><tr><th>Ref.</th><th>Text</th><th>Sentiment</th><th>Score</th><th>Topics</th><th>Source</th><th>Time</th><th></th></tr></thead><tbody>` + (rows.length ? rows.map((x) => `<tr><td class="mono strong">${esc(x.id)}</td><td>${esc(x.text.length > 68 ? x.text.slice(0, 68) + "…" : x.text)}</td><td><span class="pill ${sCls[x.label] || "pill-soft"}">${esc(x.label)}</span></td><td class="mono">${x.score.toFixed(2)}</td><td class="muted">${esc((x.topics || []).join(", ") || "—")}</td><td class="muted">${esc(x.source)}</td><td class="mono">${esc(fmtTime(x.at))}</td><td class="act-col"><button class="row-btn danger" data-act="lab-delete" data-id="${esc(x.id)}" title="Remove">${ic("i-x")}</button></td></tr>`).join("") : `<tr class="empty-row"><td colspan="8">No items in the monitored stream yet. Analyse a text and add it.</td></tr>`) + `</tbody>`;
    const set = (id, v) => { const e = $(id); if (e) e.textContent = v; };
    set("#lab-count", c.length + " items"); set("#lab-showing", c.length ? "Showing " + Math.min(12, c.length) + " of " + c.length : "No records");
    if (db.labResult) renderLabResult(db.labResult);
  }
  function renderLabResult(a) {
    const sCls = { Positive: "pill-green", Negative: "pill-red", Neutral: "pill-soft", Mixed: "pill-amber" };
    const gauge = Math.round((a.score + 1) / 2 * 100);
    $("#lab-result").innerHTML = `<div class="result-head"><div><span class="app-band-tag">ANALYSIS RESULT</span><h4>${esc(a.label)} sentiment</h4></div><span class="pill ${sCls[a.label]}">${esc(a.label)}</span></div>
      <div class="result-score"><div class="score-track"><i style="width:${gauge}%"></i><span class="score-mid"></span></div><div class="score-scale"><span>Negative −1</span><b>${a.score.toFixed(2)}</b><span>Positive +1</span></div></div>
      <div class="result-grid"><div><span>Confidence</span><strong>${Math.round(a.confidence * 100)}%</strong></div><div><span>Signal terms</span><strong>${a.hits.length}</strong></div><div><span>PII detected</span><strong class="${a.piiCount ? "txt-red" : "txt-green"}">${a.piiCount}</strong></div></div>
      <div class="result-block"><span class="detail-label">Detected topics</span><div class="tag-row">${a.topics.length ? a.topics.map((t) => `<span class="pill pill-teal">${esc(t.topic)} · ${t.count}</span>`).join("") : `<span class="hint">No theme keywords matched.</span>`}</div></div>
      <div class="result-block"><span class="detail-label">Entities &amp; signals</span><div class="tag-row">${a.entities.length ? a.entities.map((e) => `<span class="pill pill-soft">${esc(e.type)}: ${esc(e.value)}</span>`).join("") : `<span class="hint">No entities detected.</span>`}</div></div>
      <div class="result-block"><span class="detail-label">Privacy-screened text</span><pre class="masked-text">${esc(a.maskedText)}</pre></div>
      ${a.hits.length ? `<div class="result-block"><span class="detail-label">Explainability · matched terms</span><div class="tag-row">${a.hits.slice(0, 14).map((h) => `<span class="pill ${h.val > 0 ? "pill-green" : "pill-red"}">${esc(h.term)} ${h.val > 0 ? "+" : "−"}</span>`).join("")}</div></div>` : ""}`;
  }
  function labAnalyse() {
    const v = $("#lab-input").value.trim();
    if (!v) { toast("Enter or select some text to analyse", "i-alert", null, null); $("#lab-input").focus(); return; }
    const a = analyse(v); db.labResult = a; save(); renderLabResult(a);
    log("Analysis", "Text analysed · " + a.label, v.slice(0, 110), a.label === "Negative" ? "amber" : "teal"); save();
    toast("Analysis complete · " + a.label, "i-sparkles", null, null);
  }
  function labAddStream() {
    const v = $("#lab-input").value.trim();
    if (!v) { toast("Enter or select some text first", "i-alert", null, null); return; }
    const a = analyse(v);
    commit(() => {
      db.corpus.unshift({ id: uid("TXT"), text: v, source: "Operator · analysis workbench", at: new Date().toISOString(), label: a.label, score: a.score, confidence: a.confidence, topics: a.topics.map((t) => t.topic), piiCount: a.piiCount, maskedText: a.maskedText });
      db.labResult = a;
    }, { log: { type: "Analysis", title: "Text item added to monitored stream", desc: a.label + " · " + v.slice(0, 100), tone: "teal" }, toast: "Item committed to the monitored stream" });
    renderLabResult(a);
  }

  /* ---- Notifications / settings / shortcuts ---- */
  function renderNotifications() {
    const panel = $("#notif-panel"); if (!panel) return;
    const unread = db.notifications.filter((n) => !n.read).length;
    panel.innerHTML = `<div class="notif-head"><strong>Notifications</strong><button class="mini-btn" data-act="notif-readall">${ic("i-check")} Mark all read</button></div><div class="notif-list">` +
      (db.notifications.length ? db.notifications.slice(0, 12).map((n) => `<div class="notif-item ${n.read ? "" : "unread"}" data-act="notif-open" data-id="${esc(n.id)}"><span class="notif-marker ${esc(n.tone)}"></span><div><strong>${esc(n.title)}</strong><p>${esc(n.body)}</p><small>${esc(timeAgo(n.at))}</small></div></div>`).join("") : `<p class="hint">No notifications.</p>`) + `</div><div class="notif-foot">${unread} unread · stored locally</div>`;
  }
  function updateChrome() {
    const unread = db.notifications.filter((n) => !n.read).length;
    const badge = $("#notif-count"); if (badge) { badge.textContent = unread; badge.style.display = unread ? "" : "none"; }
    const si = $("#saved-indicator"); if (si) si.innerHTML = '<span class="dot dot-green"></span> Saved ' + fmtTime(db.savedAt);
    const cc = $("#cmd-count"); if (cc) cc.textContent = Object.keys(D.pages).length + " sections · " + (db.bd.length + db.docs.length + db.tickets.length + db.vendors.length + db.research.length + db.kb.length) + " records indexed";
    renderNotifications();
  }
  function openSettings() {
    const s = db.settings;
    openDrawer({
      eyebrow: "Workspace preferences", title: "Settings", subtitle: "Preferences are stored in this browser",
      body: `<div class="detail-section"><span class="detail-label">Appearance</span><div class="setting-row"><div><strong>Colour theme</strong><small>Switch between light and dark surfaces</small></div><div class="segmented" id="set-theme"><button class="seg ${s.theme === "light" ? "active" : ""}" data-act="set-theme" data-value="light">Light</button><button class="seg ${s.theme === "dark" ? "active" : ""}" data-act="set-theme" data-value="dark">Dark</button></div></div><div class="setting-row"><div><strong>Interface density</strong><small>Adjust vertical spacing in tables and cards</small></div><div class="segmented" id="set-density"><button class="seg ${s.density === "comfortable" ? "active" : ""}" data-act="set-density" data-value="comfortable">Comfortable</button><button class="seg ${s.density === "compact" ? "active" : ""}" data-act="set-density" data-value="compact">Compact</button></div></div><div class="setting-row"><div><strong>Rows per page</strong><small>Register pagination size</small></div><select class="setting-select" data-act="set-pagesize">${[6, 8, 12, 20].map((n) => `<option value="${n}" ${n === s.pageSize ? "selected" : ""}>${n}</option>`).join("")}</select></div></div>
      <div class="detail-section"><span class="detail-label">Data &amp; maintenance</span><button class="btn btn-ghost btn-block" data-act="export-json">${ic("i-download")} Export entire workspace (JSON)</button><button class="btn btn-ghost btn-block" data-act="import-json">${ic("i-archive")} Import workspace from JSON</button><input type="file" id="import-file" accept="application/json,.json" style="display:none"><button class="btn btn-ghost btn-block" data-act="show-shortcuts">${ic("i-cpu")} Keyboard shortcuts</button><button class="btn btn-ghost btn-block danger" data-act="reset-data">${ic("i-refresh")} Reset workspace to baseline data</button><p class="hint">All records live in browser local storage. Export before clearing site data.</p></div>
      <div class="detail-section"><span class="detail-label">Workspace integrity</span><div class="detail-kv"><div><span>Data version</span><strong>v${db.v}</strong></div><div><span>Created</span><strong>${esc(fmtDate(db.createdAt))}</strong></div><div><span>Last saved</span><strong>${esc(fmtTime(db.savedAt))}</strong></div><div><span>Audit entries</span><strong>${db.activity.length}</strong></div></div></div>`,
      foot: `<button class="btn btn-primary" data-act="close-overlay">Done</button>`
    });
  }
  function openShortcuts() {
    openModal({
      eyebrow: "Productivity", title: "Keyboard shortcuts",
      bodyHtml: `<div class="shortcut-list">${[["Ctrl / ⌘ + K", "Open command palette"], ["?", "Show this shortcut list"], ["N", "Create a new incident"], ["T", "Toggle colour theme"], ["Esc", "Close the active panel"], ["Enter", "Send a chat message / run command"]].map(([k, d]) => `<div class="shortcut-row"><kbd>${esc(k)}</kbd><span>${esc(d)}</span></div>`).join("")}</div>`,
      foot: `<button class="btn btn-primary" data-act="close-overlay">Got it</button>`
    });
  }

  /* ---- Command palette ---- */
  function cmdIndex() {
    const idx = [];
    Object.keys(D.pages).forEach((k) => idx.push({ type: "Section", title: D.pages[k].title, sub: D.pages[k].eyebrow, href: "#" + k, icon: "i-grid", term: D.pages[k].title + " " + k }));
    [
      { title: "Log a new incident", sub: "Service Desk", icon: "i-lifebuoy", run: () => openForm("tickets") },
      { title: "Add a B/D record", sub: "Adoption register", icon: "i-building", run: () => openForm("bd") },
      { title: "Register a document", sub: "Document registry", icon: "i-file", run: () => openForm("docs") },
      { title: "New research brief", sub: "Gen AI research", icon: "i-book", run: () => openForm("research") },
      { title: "Toggle colour theme", sub: "Appearance", icon: "i-moon", run: () => toggleTheme() },
      { title: "Open workspace settings", sub: "Preferences", icon: "i-cpu", run: () => openSettings() },
      { title: "Export workspace JSON", sub: "Data maintenance", icon: "i-download", run: () => exportJSON() },
      { title: "Reset deployment checklist", sub: "Operations", icon: "i-refresh", run: () => { db.runbook = D.runbook.map(() => false); save(); invalidate(); toast("Deployment checklist reset", "i-refresh", null, null); } }
    ].forEach((a) => idx.push(Object.assign({ type: "Action" }, a, { term: a.title + " " + a.sub })));
    db.bd.forEach((r) => idx.push({ type: "B/D", title: r.name, sub: r.abbr + " · " + r.stage, icon: "i-building", run: () => openDetail("bd", r.id), term: r.name + " " + r.abbr + " " + r.usecase }));
    db.docs.forEach((r) => idx.push({ type: "Document", title: r.title, sub: r.ref + " · " + r.category, icon: "i-file", run: () => openDetail("docs", r.ref), term: r.ref + " " + r.title }));
    db.tickets.forEach((r) => idx.push({ type: "Incident", title: r.subject, sub: r.id + " · " + r.status, icon: "i-lifebuoy", run: () => openDetail("tickets", r.id), term: r.id + " " + r.subject }));
    return idx;
  }
  function renderCmd(q) {
    const term = q.trim().toLowerCase(), CMD = cmdIndex();
    let items = term ? CMD.filter((x) => (x.term || "").toLowerCase().indexOf(term) > -1).slice(0, 12) : CMD.filter((x) => x.type === "Section" || x.type === "Action").slice(0, 9);
    state.cmdSel = 0;
    const box = $("#cmd-results");
    if (!items.length) { box.innerHTML = `<div class="cmd-empty">No matches for “${esc(q)}”</div>`; return; }
    box.innerHTML = `<div class="cmd-group">${term ? "Results" : "Suggested"}</div>` + items.map((it, i) => `<div class="cmd-item ${i === 0 ? "sel" : ""}" data-idx="${i}">${ic(it.icon)}<span>${esc(it.title)}</span><small>${esc(it.type)} · ${esc(it.sub)}</small></div>`).join("");
    $$(".cmd-item", box).forEach((el, i) => { el.addEventListener("click", () => runCmd(items[i])); el.addEventListener("mousemove", () => selectCmd(i)); });
    state.cmdItems = items;
  }
  function selectCmd(i) {
    const els = $$(".cmd-item", $("#cmd-results")); if (!els.length) return;
    state.cmdSel = Math.max(0, Math.min(els.length - 1, i));
    els.forEach((e, k) => e.classList.toggle("sel", k === state.cmdSel));
    els[state.cmdSel].scrollIntoView({ block: "nearest" });
  }
  function runCmd(it) {
    if (!it) return;
    closeCmd();
    if (it.href) { location.hash = it.href.slice(1); if (location.hash === it.href) setView(it.href.slice(1)); }
    else if (it.run) it.run();
  }
  function openCmd() {
    closeOverlay();
    $("#cmd-overlay").classList.add("open"); $("#cmd-overlay").setAttribute("aria-hidden", "false");
    $("#cmd-input").value = ""; renderCmd(""); state.overlay = "cmd";
    setTimeout(() => $("#cmd-input").focus(), 30);
  }
  function closeCmd() { $("#cmd-overlay").classList.remove("open"); $("#cmd-overlay").setAttribute("aria-hidden", "true"); state.overlay = null; }

  /* ---- Theme & density ---- */
  function applyAppearance() {
    const s = db.settings;
    document.documentElement.setAttribute("data-theme", s.theme);
    document.documentElement.setAttribute("data-density", s.density);
    const btn = $("#theme-toggle"); if (btn) { $("use", btn).setAttribute("href", s.theme === "dark" ? "#i-sun" : "#i-moon"); btn.title = s.theme === "dark" ? "Switch to light theme" : "Switch to dark theme"; }
    document.dispatchEvent(new CustomEvent("t26:theme"));
  }
  function toggleTheme() {
    db.settings.theme = db.settings.theme === "dark" ? "light" : "dark";
    save(); applyAppearance(); renderCharts();
    toast(db.settings.theme === "dark" ? "Dark theme enabled" : "Light theme enabled", db.settings.theme === "dark" ? "i-moon" : "i-sun", null, null);
  }
  function importWorkspace(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var obj;
      try { obj = JSON.parse(String(reader.result)); }
      catch (e) { toast("Selected file is not valid JSON", "i-alert", null, null); return; }
      if (!obj || obj.v !== 3 || !Array.isArray(obj.bd) || !Array.isArray(obj.controls) || !Array.isArray(obj.risks) || !Array.isArray(obj.actions) || !Array.isArray(obj.tickets)) {
        toast("Not a compatible T26 v3 workspace file", "i-alert", null, null); return;
      }
      var incoming = Object.assign(clone(db), obj, { v: 3 });
      openModal({
        eyebrow: "Confirm action", title: "Replace workspace data?",
        subtitle: "The imported file will replace every local record, preference and audit entry.",
        bodyHtml: '<div class="confirm-box">' + ic("i-archive") + '<div><strong>' + esc(file.name) + '</strong><p>' +
          obj.bd.length + ' B/D records · ' + obj.controls.length + ' controls · ' + obj.risks.length + ' risks · ' +
          obj.actions.length + ' actions · ' + obj.tickets.length + ' incidents.<br>Export your current workspace first if you want to keep a copy.</p></div></div>',
        submitLabel: "Import and replace",
        onSubmit: function () {
          commit(function () { Object.keys(incoming).forEach(function (k) { db[k] = incoming[k]; }); }, {
            log: { type: "Data", title: "Workspace imported from JSON", desc: file.name, tone: "violet" },
            notify: { title: "Workspace data replaced", body: "Imported from " + file.name, tone: "blue", view: "overview" },
            toast: "Workspace imported successfully"
          });
          applyAppearance();
          return true;
        }
      });
      var b = $("[data-act='modal-submit']", $("#modal-overlay")); if (b) b.classList.add("btn-danger");
    };
    reader.onerror = function () { toast("Could not read the selected file", "i-alert", null, null); };
    reader.readAsText(file);
  }
  function exportJSON() {
    download("T26-workspace-" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify(db, null, 2), "application/json");
    toast("Workspace exported as JSON", "i-download", null, null);
  }
  function resetData() {
    openModal({
      eyebrow: "Confirm action", title: "Reset workspace to baseline?",
      subtitle: "All locally created or edited records, chat history and audit entries will be replaced by the baseline dataset.",
      bodyHtml: `<div class="confirm-box">${ic("i-alert")}<div><strong>This cannot be undone from within the workspace.</strong><p>Export the workspace JSON first if you want to keep a copy.</p></div></div>`,
      submitLabel: "Reset workspace",
      onSubmit: () => {
        db = seedDB(); save(); applyAppearance(); invalidate(); toast("Workspace restored to baseline", "i-refresh", null, null); return true;
      }
    });
    const b = $("[data-act='modal-submit']", $("#modal-overlay")); if (b) b.classList.add("btn-danger");
  }

  /* ---- Export snapshot ---- */
  function exportSnapshot() {
    const p = D.pages[state.view], live = db.bd.filter((r) => r.stage === "Live").length;
    const lines = [
      "T26 / CSSA — CENTRALISED AI & DATA ANALYTICS PLATFORM OPERATIONS", "WORKSPACE SNAPSHOT",
      "Generated: " + new Date().toLocaleString("en-GB"), "Current section: " + p.title, "",
      "--- LIVE WORKSPACE TOTALS ---",
      "  B/D records: " + db.bd.length + " (" + live + " live)",
      "  Documents: " + db.docs.length,
      "  Incidents: " + db.tickets.length + " (" + db.tickets.filter((t) => t.status !== "Resolved").length + " open)",
      "  Vendor engagements: " + db.vendors.length,
      "  Research briefs: " + db.research.length,
      "  Knowledge entries: " + db.kb.length,
      "  Monitored text items: " + db.corpus.length,
      "  Audit entries: " + db.activity.length, "",
      "--- SERVICE POSTURE ---"
    ];
    D.health.forEach((h) => lines.push("  " + h.name + ": " + h.uptime + "% uptime"));
    lines.push("", "--- MANDATORY EXPERIENCE THRESHOLDS ---");
    D.thresholds.tech.concat(D.thresholds.nontech).forEach((t) => lines.push("  " + t.name + " — " + t.note));
    lines.push("", "--- CAPABILITY WORKSHEET ---", "  Requirements evidenced: " + db.assess.req.filter(Boolean).length + " / 6");
    D.assessSkills.forEach((s, i) => lines.push("  " + s.text + ": " + (Number(db.assess.skills[i]) || 0) + " years"));
    lines.push("", "--- NOTE ---", "Working demonstration workspace. Records are sample data stored locally, not official Government information.");
    download("T26-CSSA-snapshot-" + new Date().toISOString().slice(0, 10) + ".txt", lines.join("\n"));
    toast("Snapshot exported", "i-download", null, null);
  }

  /* ---- Aggregated refresh ---- */
  function invalidate() {
    renderDashboard();
    Object.keys(REGS).forEach(renderRegister);
    renderResearch();
    renderCharts();
    renderDesk();
    renderConsoleDynamic();
    renderLabDynamic();
    renderRunbook();
    renderAssessment();
    updateChrome();
    document.dispatchEvent(new CustomEvent("t26:refresh"));
  }

  /* ---- Router ---- */
  function animateCounters(root) {
    $$("[data-count]", root).forEach((el) => {
      const target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.decimals || "0", 10);
      const dur = 800, t0 = performance.now(); let done = false;
      const finish = () => { if (!done) { done = true; el.textContent = target.toFixed(dec); } };
      function step(t) {
        if (done) return;
        const k = Math.min(1, (t - t0) / dur);
        el.textContent = (target * (1 - Math.pow(1 - k, 3))).toFixed(dec);
        if (k < 1) requestAnimationFrame(step); else finish();
      }
      requestAnimationFrame(step); setTimeout(finish, dur + 250);
    });
  }
  function setView(id, initial) {
    if (!D.pages[id]) id = "overview";
    state.view = id;
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + id));
    $$(".nav-item").forEach((a) => a.classList.toggle("active", a.dataset.view === id));
    const pg = D.pages[id];
    $("#breadcrumb-current").textContent = pg.crumb;
    $("#page-eyebrow").textContent = pg.eyebrow;
    $("#page-title").textContent = pg.title;
    $("#page-subtitle").textContent = pg.subtitle;
    document.title = pg.title + " · T26 Centralised AI Platforms";
    if (!initial) window.scrollTo({ top: 0, behavior: "smooth" });
    $("#sidebar").classList.remove("open"); $("#nav-overlay").classList.remove("open");
    renderLineChart();
    animateCounters($("#view-" + id));
    document.dispatchEvent(new CustomEvent("t26:view", { detail: { view: id } }));
  }

  /* ================================================================
     GLOBAL ACTION DISPATCHER
     ================================================================ */
  function dispatch(action, el, ev) {
    var reg = el.dataset.reg, id = el.dataset.id, idx = parseInt(el.dataset.idx, 10);
    switch (action) {
      case "close-overlay": closeOverlay(); break;
      case "modal-submit": {
        var cfg = state.modalCfg;
        if (!cfg || !cfg.onSubmit) { closeOverlay(); break; }
        var r = cfg.onSubmit($("#modal-overlay"));
        if (r !== false) { state.modalCfg = null; closeOverlay(); }
        break;
      }
      case "add": closeOverlay(); openForm(reg); break;
      case "edit": closeOverlay(); openForm(reg, id); break;
      case "detail": { var cfg = REGS[reg]; openDetail(reg, id); if (cfg && cfg.table === null && reg === "research") { /* drawer works for research too */ } break; }
      case "delete": closeOverlay(); confirmDelete(reg, [id]); break;
      case "filter": state.reg[reg].filter = el.dataset.value; state.reg[reg].page = 1; if (reg === "research") renderResearch(); else renderRegister(reg); break;
      case "sort": {
        var st = state.reg[reg], k = el.dataset.key;
        st.sort.dir = st.sort.key === k ? -st.sort.dir : 1; st.sort.key = k; renderRegister(reg); break;
      }
      case "page": {
        var st = state.reg[reg], v = el.dataset.page;
        st.page = v === "prev" ? st.page - 1 : v === "next" ? st.page + 1 : parseInt(v, 10);
        renderRegister(reg); break;
      }
      case "select": {
        var st = state.reg[reg], s = st.selected;
        if (el.checked) s.add(String(id)); else s.delete(String(id));
        renderRegister(reg); break;
      }
      case "selectall": {
        var st = state.reg[reg], cfg = REGS[reg];
        var rows = cfg.collection().slice();
        if (st.q.trim()) rows = rows.filter((r) => cfg.searchKeys.some((k) => String(r[k] == null ? "" : r[k]).toLowerCase().indexOf(st.q.toLowerCase()) > -1));
        if (cfg.filterKey && st.filter !== "All") rows = rows.filter((r) => String(r[cfg.filterKey]) === st.filter);
        rows = sortRecords(rows, st.sort.key, st.sort.dir);
        var ps = db.settings.pageSize, pageRows = rows.slice((st.page - 1) * ps, st.page * ps);
        if (el.checked) pageRows.forEach((r) => st.selected.add(String(idOf(r, reg))));
        else pageRows.forEach((r) => st.selected.delete(String(idOf(r, reg))));
        renderRegister(reg); break;
      }
      case "clearselection": state.reg[reg].selected.clear(); renderRegister(reg); break;
      case "bulkdelete": closeOverlay(); confirmDelete(reg, Array.from(state.reg[reg].selected)); break;
      case "export": exportReg(reg, false); break;
      case "export-selected": exportReg(reg, true); break;
      case "clearfilters": state.reg[reg].q = ""; state.reg[reg].filter = "All"; var si = $(REGS[reg].search); if (si) si.value = ""; renderRegister(reg); break;
      case "priority": commit(() => { db.priorities[idx] = !db.priorities[idx]; }, { log: { type: "Task", title: (db.priorities[idx] ? "Completed" : "Reopened") + " priority item", desc: D.priorities[idx].text, tone: "" }, toast: null, undo: false }); break;
      case "runbook": commit(() => { db.runbook[idx] = el.checked; }, { toast: null, undo: false }); break;
      case "assess-req": commit(() => { db.assess.req[idx] = el.checked; }, { toast: null, undo: false }); break;
      case "assess-skill": {
        var v = parseFloat(el.value); if (isNaN(v) || v < 0) v = 0; if (v > 30) v = 30;
        db.assess.skills[idx] = v; save();
        var row = el.closest(".skill-row"), badge = $(".skill-state", row);
        badge.className = "skill-state " + (v >= 3 ? "met" : "unmet"); badge.textContent = v >= 3 ? "MET" : "—";
        updateScore(); break;
      }
      case "advance-ticket": {
        var t = findRec("tickets", id); if (!t) break;
        var order = ["Open", "In progress", "Pending B/D", "Resolved"];
        var next = order[(order.indexOf(t.status) + 1) % order.length];
        commit(() => { t.status = next; }, { log: { type: "Incident", title: t.id + " moved to " + next, desc: t.subject, tone: next === "Resolved" ? "teal" : "violet", ref: t.id }, notify: { title: "Incident status changed", body: t.id + " → " + next, tone: next === "Resolved" ? "green" : "blue", view: "desk" }, toast: t.id + " → " + next });
        closeOverlay(); break;
      }
      case "escalate-ticket": {
        var t = findRec("tickets", id); if (!t) break;
        commit(() => { t.priority = "P1 · Critical"; t.slaHours = 2; }, { log: { type: "Escalation", title: t.id + " escalated to P1", desc: t.subject, tone: "amber", ref: t.id }, notify: { title: "Incident escalated to P1", body: t.id + " · supervisor attention required", tone: "red", view: "desk" }, toast: "Incident escalated to P1" });
        closeOverlay(); break;
      }
      case "advance-stage": {
        var r = findRec("bd", id); if (!r) break;
        var order = ["Discovery", "Assessment", "Pilot", "Live"];
        var next = order[(order.indexOf(r.stage) + 1) % order.length];
        commit(() => { r.stage = next; }, { log: { type: "Adoption", title: r.name + " advanced to " + next, desc: r.usecase, tone: "teal", ref: r.id }, notify: { title: "Adoption stage advanced", body: r.abbr + " → " + next, tone: "green", view: "adoption" }, toast: r.abbr + " → " + next });
        openDetail("bd", id); break;
      }
      case "bump-version": {
        var r = findRec("docs", id); if (!r) break;
        commit(() => {
          var m = String(r.version).match(/v?(\d+)\.(\d+)/);
          r.version = m ? "v" + m[1] + "." + (parseInt(m[2], 10) + 1) : "v1.1";
          r.updated = new Date().toISOString().slice(0, 10); r.status = "Current";
        }, { log: { type: "Records", title: "New version registered · " + r.ref, desc: r.title + " → " + r.version, tone: "violet", ref: r.ref }, toast: "Version bumped to " + r.version });
        openDetail("docs", id); break;
      }
      case "guard": db.settings.guardrails[el.dataset.key] = el.checked; save(); toast("Guardrail updated", "i-shield", null, null); break;
      case "guard-range": db.settings.guardrails.minConfidence = parseFloat(el.value); save(); var b = $(".guard-range b"); if (b) b.textContent = Math.round(parseFloat(el.value) * 100) + "%"; break;
      case "chat-send": chatSend($("#chat-input").value); $("#chat-input").value = ""; break;
      case "chat-suggest": chatSend(el.dataset.q); break;
      case "chat-clear": commit(() => { db.chat.messages = db.chat.messages.slice(0, 1); }, { log: { type: "Chatbot", title: "Console session cleared", desc: "Operator reset the conversation simulator", tone: "" }, toast: "Conversation cleared", undo: false }); break;
      case "chat-escalate": chatEscalate(); break;
      case "chat-export": {
        var txt = db.chat.messages.map((m) => "[" + fmtTime(m.at) + "] " + (m.role === "bot" ? "ASSISTANT" : "CITIZEN") + ": " + m.text + (m.intent && m.intent !== "Session start" ? "\n    intent=" + m.intent + " confidence=" + Math.round((m.confidence || 0) * 100) + "%" : "")).join("\n\n");
        download("T26-chat-transcript-" + new Date().toISOString().slice(0, 10) + ".txt", txt); toast("Transcript exported", "i-download", null, null); break;
      }
      case "lab-sample": $("#lab-input").value = D.socialSamples[idx].text; db.labResult = null; $("#lab-result").innerHTML = ""; break;
      case "lab-analyse": labAnalyse(); break;
      case "lab-addstream": labAddStream(); break;
      case "lab-clear": $("#lab-input").value = ""; db.labResult = null; save(); $("#lab-result").innerHTML = ""; break;
      case "lab-delete": commit(() => { var i = db.corpus.findIndex((x) => x.id === id); if (i > -1) db.corpus.splice(i, 1); }, { log: { type: "Analysis", title: "Text item removed from stream", desc: id, tone: "amber" }, toast: "Item removed" }); break;
      case "lab-export": {
        var cols = [{ key: "id", label: "Ref" }, { key: "text", label: "Text" }, { key: "label", label: "Sentiment" }, { key: "score", label: "Score" }, { key: "confidence", label: "Confidence" }, { key: "topics", label: "Topics", csv: (r) => (r.topics || []).join(" | ") }, { key: "piiCount", label: "PII hits" }, { key: "source", label: "Source" }, { key: "at", label: "Timestamp" }];
        download("T26-text-corpus-" + new Date().toISOString().slice(0, 10) + ".csv", toCSV(db.corpus, cols), "text/csv;charset=utf-8");
        toast("Corpus exported as CSV", "i-download", null, null); break;
      }
      case "notif-readall": commit(() => { db.notifications.forEach((n) => { n.read = true; }); }, { toast: "All notifications marked read", undo: false }); break;
      case "notif-open": {
        var n = db.notifications.find((x) => x.id === id); if (!n) break;
        commit(() => { n.read = true; }, { toast: null, undo: false });
        if (n.view) { location.hash = n.view; setView(n.view); }
        closeOverlay(); break;
      }
      case "set-theme": db.settings.theme = el.dataset.value; save(); applyAppearance(); renderCharts(); openSettings(); break;
      case "set-density": db.settings.density = el.dataset.value; save(); applyAppearance(); openSettings(); break;
      case "export-json": exportJSON(); break;
      case "import-json": { var fi = $("#import-file"); if (fi) fi.click(); break; }
      case "show-shortcuts": openShortcuts(); break;
      case "reset-data": resetData(); break;
      case "goto": location.hash = el.dataset.view; setView(el.dataset.view); break;
      case "copy-naming": copyText($("#naming-code").textContent, "Naming convention copied"); break;
      case "btn-copy-summary": {
        var lines = ["T26 / CSSA — Capability mapping summary", "Generated: " + new Date().toLocaleDateString("en-GB"), "", "REQUIREMENT DETAILS"];
        D.assessReq.forEach((r, i) => lines.push("  [" + (db.assess.req[i] ? "x" : " ") + "] " + r.text));
        lines.push("", "MANDATORY SKILL THRESHOLDS (minimum 3 years)");
        D.assessSkills.forEach((s, i) => { var v = Number(db.assess.skills[i]) || 0; lines.push("  [" + (v >= 3 ? "x" : " ") + "] " + s.text + " — " + v + " years"); });
        lines.push("", "Overall match: " + $("#score-value").textContent);
        copyText(lines.join("\n"), "Capability summary copied"); break;
      }
      case "btn-reset-assess": commit(() => { db.assess = { req: D.assessReq.map(() => false), skills: D.assessSkills.map(() => 0) }; }, { toast: "Worksheet reset", undo: false }); break;
      case "runbook-reset": commit(() => { db.runbook = D.runbook.map(() => false); }, { toast: "Deployment checklist reset", undo: false }); break;
    }
  }

  function wire() {
    const CHANGE_ONLY = new Set(["select", "selectall", "runbook", "assess-req", "guard", "pagesize", "set-pagesize", "assess-skill", "guard-range"]);
    document.body.addEventListener("click", (e) => {
      const el = e.target.closest("[data-act]");
      if (el) { if (!CHANGE_ONLY.has(el.dataset.act)) dispatch(el.dataset.act, el, e); return; }
      const row = e.target.closest("tr[data-row]");
      if (row && !e.target.closest("input, button")) {
        const th = row.closest("table");
        const reg = Object.keys(REGS).find((k) => REGS[k].table && $(REGS[k].table) === th);
        if (reg) openDetail(reg, row.dataset.row);
      }
      if (!e.target.closest(".new-menu-wrap, #new-menu")) { const nm = $("#new-menu"); if (nm) nm.classList.remove("open"); }
      if (!e.target.closest("#notif-btn, #notif-panel")) { const np = $("#notif-panel"); if (np) np.classList.remove("open"); }
    });
    document.body.addEventListener("change", (e) => {
      if (e.target && e.target.id === "import-file" && e.target.files && e.target.files[0]) {
        importWorkspace(e.target.files[0]); e.target.value = ""; return;
      }
      const el = e.target.closest("[data-act]");
      if (el && ["select", "selectall", "runbook", "assess-req", "guard"].indexOf(el.dataset.act) > -1) dispatch(el.dataset.act, el, e);
      if (el && el.dataset.act === "pagesize") { db.settings.pageSize = parseInt(el.value, 10); save(); Object.keys(REGS).forEach(renderRegister); }
      if (el && el.dataset.act === "set-pagesize") { db.settings.pageSize = parseInt(el.value, 10); save(); Object.keys(REGS).forEach(renderRegister); }
    });
    document.body.addEventListener("input", (e) => {
      const el = e.target;
      if (el.id === "bd-search" || el.id === "doc-search" || el.id === "tk-search" || el.id === "vendor-search") {
        const map = { "bd-search": "bd", "doc-search": "docs", "tk-search": "tickets", "vendor-search": "vendors" };
        const reg = map[el.id]; state.reg[reg].q = el.value; state.reg[reg].page = 1; renderRegister(reg);
      }
      if (el.dataset && el.dataset.act === "assess-skill") dispatch("assess-skill", el, e);
      if (el.dataset && el.dataset.act === "guard-range") dispatch("guard-range", el, e);
    });
    document.body.addEventListener("keydown", (e) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openCmd(); return; }
      if (e.key === "Escape") { closeOverlay(); closeCmd(); return; }
      if (state.overlay === "cmd") {
        if (e.key === "ArrowDown") { e.preventDefault(); selectCmd(state.cmdSel + 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); selectCmd(state.cmdSel - 1); }
        else if (e.key === "Enter") { e.preventDefault(); runCmd((state.cmdItems || [])[state.cmdSel]); }
        return;
      }
      const ov = state.overlay === "modal" ? $(".modal", $("#modal-overlay")) : state.overlay === "drawer" ? $(".drawer", $("#drawer-overlay")) : null;
      if (ov) { trapFocus(ov, e); if (e.key === "Enter" && e.target.tagName === "INPUT" && state.overlay === "modal") { e.preventDefault(); const b = $("[data-act='modal-submit']", ov); if (b) b.click(); } return; }
      if (typing) {
        if (e.key === "Enter" && e.target.id === "chat-input") { e.preventDefault(); chatSend(e.target.value); e.target.value = ""; }
        return;
      }
      if (e.key === "?") { e.preventDefault(); openShortcuts(); }
      else if (e.key.toLowerCase() === "n") { e.preventDefault(); openForm("tickets"); }
      else if (e.key.toLowerCase() === "t") { e.preventDefault(); toggleTheme(); }
    });

    window.addEventListener("hashchange", () => setView(location.hash.replace(/^#/, "")));
    $("#menu-btn").addEventListener("click", () => { $("#sidebar").classList.add("open"); $("#nav-overlay").classList.add("open"); });
    $("#sidebar-close").addEventListener("click", () => { $("#sidebar").classList.remove("open"); $("#nav-overlay").classList.remove("open"); });
    $("#nav-overlay").addEventListener("click", () => { $("#sidebar").classList.remove("open"); $("#nav-overlay").classList.remove("open"); });
    $("#theme-toggle").addEventListener("click", toggleTheme);
    $("#settings-btn").addEventListener("click", openSettings);
    $("#btn-new").addEventListener("click", (e) => { e.stopPropagation(); const nm = $("#new-menu"); nm.classList.toggle("open"); $("#notif-panel").classList.remove("open"); });
    $("#notif-btn").addEventListener("click", (e) => { e.stopPropagation(); const np = $("#notif-panel"); np.classList.toggle("open"); $("#new-menu").classList.remove("open"); });
    $("#search-trigger").addEventListener("click", openCmd);
    $("#cmd-input").addEventListener("input", (e) => renderCmd(e.target.value));
    $("#cmd-overlay").addEventListener("click", (e) => { if (e.target.id === "cmd-overlay") closeCmd(); });
    $("#modal-overlay").addEventListener("click", (e) => { if (e.target.id === "modal-overlay") closeOverlay(); });
    $("#drawer-overlay").addEventListener("click", (e) => { if (e.target.id === "drawer-overlay") closeOverlay(); });
    $("#btn-print").addEventListener("click", () => window.print());
    $("#btn-export").addEventListener("click", exportSnapshot);
    $("#copy-naming").addEventListener("click", () => copyText($("#naming-code").textContent, "Naming convention copied"));
    $("#btn-copy-summary").setAttribute("data-act", "btn-copy-summary");
    $("#btn-reset-assess").setAttribute("data-act", "btn-reset-assess");
    $("#runbook-reset").setAttribute("data-act", "runbook-reset");
    $("#chat-tenant").addEventListener("change", (e) => { db.chat.tenant = e.target.value; save(); toast("Tenant switched to " + e.target.value, "i-building", null, null); });
    $$("#platform-tabs .tab").forEach((btn) => btn.addEventListener("click", () => {
      $$("#platform-tabs .tab").forEach((b) => { b.classList.toggle("active", b === btn); b.setAttribute("aria-selected", b === btn ? "true" : "false"); });
      $$(".tab-panel").forEach((p) => p.classList.toggle("active", p.id === "tab-" + btn.dataset.tab));
      state.platformTab = btn.dataset.tab;
    }));
    $("#period-toggle").addEventListener("click", (e) => {
      const b = e.target.closest("[data-period]"); if (!b) return;
      state.period = parseInt(b.dataset.period, 10);
      $$("#period-toggle .seg").forEach((s) => s.classList.toggle("active", s === b));
      renderLineChart();
    });
    let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(renderLineChart, 160); });
  }

  /* ================================================================
     BOOT
     ================================================================ */
  function boot() {
    /* Overlay roots */
    document.body.insertAdjacentHTML("beforeend", `
      <div class="modal-overlay" id="modal-overlay" aria-hidden="true"><div class="modal" role="dialog" aria-modal="true"></div></div>
      <div class="drawer-overlay" id="drawer-overlay" aria-hidden="true"><div class="drawer" role="dialog" aria-modal="true"></div></div>
      <div class="notif-panel" id="notif-panel"></div>`);
    /* Notification panel lives inside the topbar actions for correct positioning */
    $(".topbar-actions").appendChild($("#notif-panel"));

    const now = new Date();
    $("#topbar-date").textContent = now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    applyAppearance();
    renderStatic();
    renderAssessment();
    wire();
    invalidate();
    setView(location.hash.replace(/^#/, "") || "overview", true);
    window.T26 = {
      D: D, state: state, REGS: REGS,
      get db() { return db; },
      save: save, commit: commit, log: log, toast: toast,
      openForm: openForm, openDrawer: openDrawer, openModal: openModal, closeOverlay: closeOverlay,
      renderRegister: renderRegister, invalidate: invalidate, findRec: findRec, idOf: idOf,
      esc: esc, ic: ic, fmtDate: fmtDate, fmtTime: fmtTime, cssVar: cssVar, palette: palette,
      download: download, toCSV: toCSV, uid: uid, analyse: analyse,
      statusCls: statusCls, prioCls: prioCls, sortRecords: sortRecords,
      addReg: function (name, cfg) {
        REGS[name] = cfg;
        state.reg[name] = { q: "", filter: "All", sort: Object.assign({}, cfg.defaultSort), page: 1, selected: new Set() };
      },
      getView: function () { return state.view; },
      navigate: function (v) { location.hash = v; setView(v); }
    };
    document.dispatchEvent(new CustomEvent("t26:api"));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
