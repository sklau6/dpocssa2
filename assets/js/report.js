/* ================================================================
   T26 Platform · v3.2 — Compiled Assurance Report
   Merges the compiled DPO-CSSA-SEC-2026 framework with live workspace
   data into a board-ready, printable, exportable report.
   ================================================================ */
(function () {
  "use strict";

  function boot() {
    const T = window.T26;
    if (!T) return;
    const D = T.D, FW = D.FW;
    const $ = (s, r) => (r || document).querySelector(s);
    const esc = T.esc, ic = T.ic, fmtDate = T.fmtDate;
    let generatedAt = new Date();

    const pct = (n, d) => d ? Math.round(n / d * 100) : 0;
    const levelPill = (l) => `<span class="rp-pill ${l === "High" ? "bad" : l === "Medium" ? "warn" : "ok"}">${esc(l)}</span>`;
    const statusPill = (s) => `<span class="rp-pill ${s === "Compliant" || s === "Done" || s === "Resolved" ? "ok" : s === "Review due" || s === "Open" ? "warn" : "neutral"}">${esc(s)}</span>`;

    function stamp() {
      return generatedAt.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    }

    function metrics() {
      const db = T.db;
      const live = db.bd.filter((b) => b.stage === "Live");
      const pipeline = db.bd.length - live.length;
      const open = db.tickets.filter((t) => t.status !== "Resolved");
      const resolved = db.tickets.length - open.length;
      const compliant = db.controls.filter((c) => c.status === "Compliant");
      const review = db.controls.filter((c) => c.status === "Review due");
      const high = db.risks.filter((r) => r.level === "High");
      const done = db.actions.filter((a) => a.status === "Done");
      const avgProgress = db.actions.length ? Math.round(db.actions.reduce((s, a) => s + (Number(a.progress) || 0), 0) / db.actions.length) : 0;
      return { live, pipeline, open, resolved, compliant, review, high, done, avgProgress };
    }

    function sectionHead(n, title, source) {
      return `<div class="rp-section-head"><span class="rp-sec-no">${n}</span><div><h3>${esc(title)}</h3>${source ? `<small>Compiled from ${esc(source)}</small>` : ""}</div></div>`;
    }

    function buildReport() {
      const db = T.db, m = metrics();
      const domainRows = FW.domains.map((d) => {
        const key = d.id + " · " + d.title;
        const recs = db.controls.filter((c) => c.domain === key);
        const ok = recs.filter((c) => c.status === "Compliant").length;
        return `<tr><td><strong>${esc(d.id)} · ${esc(d.title)}</strong><small>${esc(d.ref)}</small></td><td class="rp-num">${recs.length}</td><td class="rp-num">${ok}</td><td class="rp-num">${pct(ok, recs.length)}%</td><td>${statusPill(recs.some((c) => c.status === "Review due") ? "Review due" : ok === recs.length ? "Compliant" : "In progress")}</td></tr>`;
      }).join("");

      const riskRows = db.risks.map((r) => `<tr><td class="rp-mono">${esc(r.id)}</td><td><strong>${esc(r.riskDesc)}</strong><small>${esc(r.threat)}</small></td><td>${esc(r.likelihood)}</td><td>${esc(r.impact)}</td><td>${levelPill(r.level)}</td><td>${esc(r.treatment)}</td></tr>`).join("");

      const actionRows = db.actions.map((a) => `<tr><td class="rp-mono">${esc(a.id)}</td><td><span class="rp-pill ${a.priority === "P1" ? "bad" : a.priority === "P2" ? "warn" : "neutral"}">${esc(a.priority)}</span></td><td><strong>${esc(a.action)}</strong></td><td>${esc(a.target)}</td><td>${statusPill(a.status)}</td><td class="rp-num">${Number(a.progress) || 0}%</td></tr>`).join("");

      const principles = FW.principles.map((p) => `<li><strong>${esc(p.name)}.</strong> ${esc(p.text)}</li>`).join("");
      const obligations = FW.complianceObligations.map((o) => `<li>${esc(o)}</li>`).join("");
      const references = FW.references.map((r, i) => `<li><span>${i + 1}.</span>${esc(r)}</li>`).join("");
      const raciRows = FW.raci.slice(0, 5).map((r) => `<tr><td>${esc(r[0])}</td>${r.slice(1).map((v) => `<td class="rp-num">${esc(v)}</td>`).join("")}</tr>`).join("");

      return `
      <article class="rp-paper" id="rp-paper">
        <header class="rp-cover">
          <div class="rp-cover-top"><span>DIGITAL POLICY OFFICE · INFORMATION SECURITY</span><span class="rp-mono">${esc(FW.meta.ref)} · ${esc(FW.meta.version)}</span></div>
          <div class="rp-cover-title"><span class="rp-kicker">COMPILED ASSURANCE REPORT</span><h1>IT Security Compliance &amp; Operational Support Framework</h1><p>for Centralised Artificial Intelligence and Data Analytics Platforms · CSSA Position (T26)</p></div>
          <div class="rp-cover-grid">
            <div><span>Department</span><strong>${esc(FW.meta.department)}</strong></div>
            <div><span>Engagement period</span><strong>${esc(FW.meta.period)}</strong></div>
            <div><span>Work location</span><strong>${esc(FW.meta.location)}</strong></div>
            <div><span>Framework issued</span><strong>${esc(FW.meta.issued)}</strong></div>
            <div><span>Report generated</span><strong>${esc(stamp())}</strong></div>
            <div><span>Prepared by</span><strong>CSSA · Platform Operations Workspace</strong></div>
          </div>
          <div class="rp-cover-note">${ic("i-info")} This report compiles the framework document with live workspace records. Operational figures are sample data held locally in this browser and are not statements of official Government compliance.</div>
        </header>

        <section class="rp-section">${sectionHead("01", "Executive summary", "Section 1 · DPO-CSSA-SEC-2026")}
          ${FW.exec.intro.map((p) => `<p>${esc(p)}</p>`).join("")}
          <div class="rp-callout"><strong>Key outcomes</strong><ol>${FW.exec.outcomes.map((o) => `<li>${esc(o)}</li>`).join("")}</ol></div>
          <p>${esc(FW.exec.closing)}</p>
        </section>

        <section class="rp-section">${sectionHead("02", "Live operational posture", "workspace registers")}
          <div class="rp-kpis">
            <div><span>B/Ds in programme</span><strong>${db.bd.length}</strong><small>${m.live.length} live · ${m.pipeline} in pipeline</small></div>
            <div><span>Adoption rate</span><strong>${pct(m.live.length, db.bd.length)}%</strong><small>target 20 by year end</small></div>
            <div><span>Support tickets</span><strong>${db.tickets.length}</strong><small>${m.resolved} resolved · ${m.open.length} open</small></div>
            <div><span>Control records</span><strong>${db.controls.length}</strong><small>${m.compliant.length} compliant · ${m.review.length} review due</small></div>
            <div><span>Risks registered</span><strong>${db.risks.length}</strong><small>${m.high.length} high severity</small></div>
            <div><span>Action plan</span><strong>${m.avgProgress}%</strong><small>${m.done.length} of ${db.actions.length} complete</small></div>
          </div>
          <p class="rp-muted">Both centralised platforms — Chatbot-as-a-Service and the Social Media Text Analytics System — remain operational at 99.87% rolling 90-day availability. ${db.corpus.length} text items are held in the monitored analytics stream.</p>
        </section>

        <section class="rp-section">${sectionHead("03", "Core security principles", "Section 5 · S17 §6 / G3 §6")}
          <ol class="rp-principles">${principles}</ol>
        </section>

        <section class="rp-section">${sectionHead("04", "Control domain compliance", "Section 7 + live control register")}
          <div class="rp-table-wrap"><table class="rp-table"><thead><tr><th>Control domain</th><th>Controls</th><th>Compliant</th><th>Coverage</th><th>Status</th></tr></thead><tbody>${domainRows}</tbody></table></div>
          <p class="rp-muted">${esc(FW.domainsNote)} Compliance status, ownership and evidence are workspace extensions layered on the compiled framework.</p>
        </section>

        <section class="rp-section">${sectionHead("05", "Security risk register", "Section 6 / Annex B + live risk register")}
          <div class="rp-table-wrap"><table class="rp-table"><thead><tr><th>ID</th><th>Risk description &amp; threat</th><th>Likelihood</th><th>Impact</th><th>Level</th><th>Treatment</th></tr></thead><tbody>${riskRows}</tbody></table></div>
          <p class="rp-muted">${esc(FW.riskNote)}</p>
        </section>

        <section class="rp-section">${sectionHead("06", "Prioritised action plan", "Section 10 + live tracker")}
          <div class="rp-table-wrap"><table class="rp-table"><thead><tr><th>ID</th><th>Priority</th><th>Action item</th><th>Target</th><th>Status</th><th>Progress</th></tr></thead><tbody>${actionRows}</tbody></table></div>
        </section>

        <section class="rp-section">${sectionHead("07", "Governance &amp; responsibility", "Section 4 / Annex A")}
          <p>${esc(FW.centralNote)}</p>
          <div class="rp-table-wrap"><table class="rp-table rp-compact"><thead><tr><th>Activity</th><th>CSSA</th><th>DITSO</th><th>Sys Admin</th><th>Vendor</th><th>B/D User</th></tr></thead><tbody>${raciRows}</tbody></table></div>
          <p class="rp-muted">${esc(FW.raciNote)} Table shows the first five of ${FW.raci.length} mapped activities.</p>
        </section>

        <section class="rp-section">${sectionHead("08", "Compliance obligations", "Section 9.1")}
          <ul class="rp-list">${obligations}</ul>
        </section>

        <section class="rp-section">${sectionHead("09", "References", "Section 11")}
          <ol class="rp-refs">${references}</ol>
        </section>

        <footer class="rp-foot">
          <div><strong>${esc(FW.meta.ref)} · ${esc(FW.meta.version)}</strong><p>${esc(FW.meta.copyright)}</p></div>
          <div class="rp-foot-right"><span>Compiled ${esc(stamp())}</span><span>Page 1 of 1 · generated locally</span></div>
        </footer>
      </article>`;
    }

    function render() {
      const el = $("#rp-content"); if (!el) return;
      el.innerHTML = buildReport();
      const stampEl = $("#rp-generated"); if (stampEl) stampEl.textContent = "Generated " + stamp();
    }

    function plainSummary() {
      const db = T.db, m = metrics();
      return [
        "T26 / CSSA — COMPILED ASSURANCE REPORT", FW.meta.ref + " · " + FW.meta.version,
        "Generated: " + stamp(), "",
        "OPERATIONAL POSTURE",
        "  B/Ds: " + db.bd.length + " (" + m.live.length + " live, " + m.pipeline + " in pipeline)",
        "  Support tickets: " + db.tickets.length + " (" + m.resolved + " resolved, " + m.open.length + " open)",
        "  Control records: " + db.controls.length + " (" + m.compliant.length + " compliant)",
        "  Risks: " + db.risks.length + " (" + m.high.length + " high)",
        "  Action plan: " + m.avgProgress + "% average progress, " + m.done.length + " complete",
        "  Monitored text items: " + db.corpus.length, "",
        "KEY OUTCOMES", ...FW.exec.outcomes.map((o, i) => "  " + (i + 1) + ". " + o), "",
        "NOTE: Operational figures are sample data held locally; not official Government compliance."
      ].join("\n");
    }

    const STANDALONE_CSS = `
      :root{--ink:#0e1d30;--muted:#5b7089;--line:#dde6ef;--brand:#1c63b7;--soft:#f5f8fc}
      *{box-sizing:border-box}body{margin:0;background:#eef2f7;color:var(--ink);font:14px/1.65 "Segoe UI",Arial,sans-serif}
      .rp-paper{max-width:960px;margin:28px auto;background:#fff;padding:52px 58px;box-shadow:0 12px 40px rgba(16,38,66,.12)}
      h1,h2,h3{font-family:"Manrope","Segoe UI",Arial,sans-serif;letter-spacing:-.02em;line-height:1.3}
      .rp-cover{border-bottom:3px solid var(--brand);padding-bottom:26px;margin-bottom:34px}
      .rp-cover-top{display:flex;justify-content:space-between;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:700}
      .rp-kicker{display:block;font-size:10px;letter-spacing:.16em;color:var(--brand);font-weight:800;margin:34px 0 10px}
      .rp-cover h1{font-size:29px;margin:0 0 8px}.rp-cover-title p{color:var(--muted);font-size:14px;margin:0}
      .rp-cover-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:28px 0 18px}
      .rp-cover-grid div{background:var(--soft);border:1px solid var(--line);border-radius:8px;padding:11px 13px}
      .rp-cover-grid span{display:block;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
      .rp-cover-grid strong{display:block;font-size:12px;margin-top:3px}
      .rp-cover-note{background:#fff8e8;border:1px solid #ecd9a8;border-radius:8px;padding:11px 14px;font-size:11px;color:#7a5c14}
      .rp-section{margin:0 0 34px;break-inside:avoid}
      .rp-section-head{display:flex;gap:13px;align-items:flex-start;border-bottom:1px solid var(--line);padding-bottom:11px;margin-bottom:16px}
      .rp-sec-no{font:700 12px ui-monospace,monospace;color:#fff;background:var(--brand);border-radius:6px;padding:5px 8px}
      .rp-section-head h3{font-size:17px;margin:0}.rp-section-head small{color:var(--muted);font-size:10px}
      .rp-section p{font-size:12px;color:#31465e;margin:0 0 11px}
      .rp-muted{color:var(--muted)!important;font-size:11px!important}
      .rp-callout{background:var(--soft);border-left:3px solid var(--brand);padding:15px 18px;margin:14px 0;border-radius:0 8px 8px 0}
      .rp-callout strong{font-size:12px}.rp-callout ol{margin:9px 0 0;padding-left:20px}.rp-callout li{font-size:11.5px;margin:5px 0}
      .rp-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;margin-bottom:14px}
      .rp-kpis div{border:1px solid var(--line);border-radius:8px;padding:13px;background:var(--soft)}
      .rp-kpis span{display:block;font-size:10px;color:var(--muted)}.rp-kpis strong{display:block;font-size:24px;line-height:1.2;margin:3px 0}
      .rp-kpis small{font-size:10px;color:var(--muted)}
      .rp-table-wrap{overflow-x:auto}.rp-table{width:100%;border-collapse:collapse;font-size:11px;margin:12px 0}
      .rp-table th{background:var(--soft);text-align:left;font-size:9.5px;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);padding:9px 10px;border-bottom:1px solid var(--line)}
      .rp-table td{padding:9px 10px;border-bottom:1px solid var(--line);vertical-align:top}
      .rp-table td small{display:block;color:var(--muted);font-size:9.5px;margin-top:2px}
      .rp-num{text-align:center;font-family:ui-monospace,monospace}.rp-mono{font-family:ui-monospace,monospace;font-size:10px}
      .rp-pill{display:inline-block;padding:2px 8px;border-radius:20px;font-size:9.5px;font-weight:700}
      .rp-pill.ok{background:#e1f4ec;color:#12805f}.rp-pill.warn{background:#fdf3df;color:#a9741a}.rp-pill.bad{background:#fbe9e7;color:#bb3b36}.rp-pill.neutral{background:#eef2f7;color:#5b7089}
      .rp-principles{padding-left:20px}.rp-principles li{font-size:11.5px;margin:8px 0}
      .rp-list{padding-left:20px}.rp-list li{font-size:11.5px;margin:5px 0}
      .rp-refs{padding-left:20px}.rp-refs li{font-size:11px;margin:6px 0}.rp-refs span{font-family:ui-monospace,monospace;color:var(--brand);margin-right:6px}
      .rp-foot{display:flex;justify-content:space-between;border-top:2px solid var(--brand);padding-top:16px;margin-top:36px;font-size:10px;color:var(--muted)}
      .rp-foot strong{font-size:12px;color:var(--ink)}.rp-foot p{margin:3px 0 0;font-size:10px}
      .rp-foot-right{text-align:right;display:flex;flex-direction:column;gap:3px}
      @media print{body{background:#fff}.rp-paper{box-shadow:none;margin:0;max-width:none;padding:20px 26px}.rp-section{break-inside:avoid}}
      @media(max-width:700px){.rp-paper{padding:24px}.rp-cover-grid,.rp-kpis{grid-template-columns:1fr 1fr}}
    `;

    function exportStandalone() {
      const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>T26 Compiled Assurance Report · ${esc(FW.meta.ref)}</title><style>${STANDALONE_CSS}</style></head><body>${buildReport()}</body></html>`;
      T.download("T26-Compiled-Assurance-Report-" + new Date().toISOString().slice(0, 10) + ".html", html, "text/html;charset=utf-8");
      T.toast("Standalone report exported as HTML", "i-download", null, null);
    }

    /* Keys must match the bare data-rp values used by the toolbar buttons. */
    const handlers = {
      "regenerate": () => { generatedAt = new Date(); render(); T.toast("Report regenerated from live data", "i-refresh", null, null); },
      "print": () => window.print(),
      "html": exportStandalone,
      "copy": () => {
        const text = plainSummary();
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => T.toast("Executive summary copied", "i-copy", null, null), () => fallbackCopy(text));
        else fallbackCopy(text);
      }
    };
    function fallbackCopy(text) {
      const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); T.toast("Executive summary copied", "i-copy", null, null); } catch (e) { T.toast("Copy unavailable", "i-alert", null, null); }
      ta.remove();
    }

    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-rp]"); if (!el) return;
      const fn = handlers[el.dataset.rp]; if (fn) fn();
    });
    document.addEventListener("t26:refresh", render);
    document.addEventListener("t26:theme", render);
    document.addEventListener("t26:view", (e) => { if (e.detail && e.detail.view === "report") { generatedAt = new Date(); render(); } });

    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
