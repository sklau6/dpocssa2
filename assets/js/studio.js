/* ================================================================
   T26 Platform · v3.1 — 3D Studio & live Platform Digital Twin
   Loaded after framework.js. Extends every 3D scene with orbit-camera
   studio controls and adds a data-driven 3D estate model.
   ================================================================ */
(function () {
  "use strict";

  function boot() {
    const T = window.T26, F = window.T26FW;
    if (!T || !F) return;
    const D = T.D, FW = F.FW, SC = F.SC, Axon = F.Axon;
    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
    const esc = T.esc, ic = T.ic;

    const sceneOf = (name) => name === "expanded" ? expanded : SC[name];
    let expanded = null;
    const twinLayers = { tenants: true, incidents: true, risks: true };

    /* ================================================================
       STUDIO CONTROL BAR — injected into every 3D card
       ================================================================ */
    const ops = [
      ["tilt-up", "Tilt +"], ["tilt-down", "Tilt −"],
      ["zoom-in", "Zoom +"], ["zoom-out", "Zoom −"],
      ["auto", "Auto rotate"], ["expand", "Expand"], ["svg", "Export SVG"]
    ];
    /* Keyboard orbit controls — make every 3D scene operable without a pointer */
    function enableKeyboard(mount, getScene) {
      const svg = $("svg", mount);
      if (svg) {
        svg.setAttribute("tabindex", "0");
        svg.setAttribute("role", "application");
        const s = getScene();
        svg.setAttribute("aria-label", (s && s.cfg.aria ? s.cfg.aria : "Interactive 3D model") +
          ". Focus and use arrow keys to rotate and tilt, plus or minus to zoom, zero to reset, Enter to select a shape.");
      }
      mount.addEventListener("keydown", (e) => {
        const s = getScene(); if (!s) return;
        let handled = true;
        switch (e.key) {
          case "ArrowLeft": s.az -= 6; break;
          case "ArrowRight": s.az += 6; break;
          case "ArrowUp": s.el = Math.max(8, Math.min(70, s.el + 4)); break;
          case "ArrowDown": s.el = Math.max(8, Math.min(70, s.el - 4)); break;
          case "+": case "=": s.zoom = Math.max(0.6, Math.min(1.9, s.zoom * 1.1)); break;
          case "-": case "_": s.zoom = Math.max(0.6, Math.min(1.9, s.zoom * 0.9)); break;
          case "0": s.reset(); break;
          case "Enter": {
            const boxes = s.cfg.boxes();
            if (boxes.length) { s.selected = boxes[0].key; s.cfg.onSelect && s.cfg.onSelect(boxes[0].key, boxes); }
            break;
          }
          default: handled = false;
        }
        if (handled) { e.preventDefault(); if (e.key !== "0") s.paint(); }
      });
    }

    function injectBars() {
      $$(".scene3d").forEach((mount) => {
        const name = mount.id.replace("scene-", "");
        if ($(".studio-bar", mount.parentElement)) return;
        const bar = document.createElement("div");
        bar.className = "studio-bar";
        bar.innerHTML = '<span class="studio-label">3D STUDIO</span>' +
          ops.map(([op, label]) => `<button class="mini-btn studio-btn" data-fw="studio" data-scene="${esc(name)}" data-op="${op}" title="${esc(label)}">${esc(label)}</button>`).join("") +
          '<span class="studio-hint">Drag to orbit · scroll to zoom · click a shape · keyboard: arrows / + − / 0 / Enter</span>';
        mount.insertAdjacentElement("afterend", bar);
        mount.addEventListener("wheel", (e) => {
          const s = sceneOf(name);
          if (!s) return;
          e.preventDefault();
          s.setZoom(e.deltaY < 0 ? 1.08 : 0.93);
        }, { passive: false });
        enableKeyboard(mount, () => sceneOf(name));
      });
    }

    /* ================================================================
       FULLSCENE EXPAND
       ================================================================ */
    function openExpanded(name) {
      const src = SC[name];
      if (!src) return;
      if (expanded) closeExpanded();
      const ov = document.createElement("div");
      ov.className = "studio-overlay";
      ov.id = "studio-overlay";
      ov.innerHTML = `<div class="studio-modal" role="dialog" aria-modal="true">
        <div class="studio-modal-head"><div><span class="modal-eyebrow">3D STUDIO · EXPANDED VIEW</span><h3>${esc(src.cfg.aria || "3D model")}</h3></div><button class="icon-btn" data-fw="studio-close" aria-label="Close expanded view">${ic("i-x")}</button></div>
        <div class="studio-modal-scene" id="scene-expanded"></div>
        <div class="studio-modal-foot">${ops.map(([op, label]) => `<button class="mini-btn studio-btn" data-fw="studio" data-scene="expanded" data-op="${op}">${esc(label)}</button>`).join("")}<span class="studio-hint">Drag to orbit · scroll to zoom</span></div>
      </div>`;
      document.body.appendChild(ov);
      const cfg = Object.assign({}, src.cfg, { name: "expanded" });
      expanded = new Axon("#scene-expanded", cfg);
      expanded.az = src.az; expanded.el = src.el; expanded.zoom = src.zoom; expanded.selected = src.selected;
      expanded.render();
      const expMount = $("#scene-expanded");
      expMount.addEventListener("wheel", (e) => {
        e.preventDefault(); expanded.setZoom(e.deltaY < 0 ? 1.08 : 0.93);
      }, { passive: false });
      enableKeyboard(expMount, () => expanded);
      $(`[data-fw="studio-close"]`, ov).focus();
    }
    function closeExpanded() {
      if (expanded) { expanded.auto = false; if (expanded.raf) cancelAnimationFrame(expanded.raf); }
      expanded = null;
      const ov = $("#studio-overlay"); if (ov) ov.remove();
    }

    /* ================================================================
       DIGITAL TWIN — live 3D estate model computed from workspace data
       ================================================================ */
    function twinBoxes() {
      const db = T.db, out = [];
      const live = db.bd.filter((b) => b.stage === "Live");
      const cb = live.filter((b) => b.platform !== "SMTA").length;
      const sm = live.length - cb;
      const openInc = db.tickets.filter((t) => t.status !== "Resolved");
      const highRisk = db.risks.filter((r) => r.level === "High");

      out.push({ key: "CBaaS", title: "Chatbot-as-a-Service", sub: cb + " live B/D tenants", color: "var(--brand-2)", x: -112, y: 0, z: 0, w: 96, d: 96, h: 104 });
      out.push({ key: "SMTA", title: "Social Media Text Analytics", sub: sm + " live B/D dashboards", color: "var(--accent)", x: 112, y: 0, z: 0, w: 96, d: 96, h: 104 });

      if (twinLayers.tenants) {
        live.forEach((b, i) => {
          const isCB = b.platform !== "SMTA";
          const group = isCB ? live.filter((x) => x.platform !== "SMTA") : live.filter((x) => x.platform === "SMTA");
          const gi = group.indexOf(b), n = group.length || 1;
          const a = gi / n * Math.PI * 2;
          const tickets = db.tickets.filter((t) => t.bd === b.name && t.status !== "Resolved").length;
          out.push({
            key: "BD:" + b.id, title: b.name, sub: b.abbr + " · " + b.stage + " · " + tickets + " open ticket" + (tickets === 1 ? "" : "s"),
            color: tickets ? "var(--amber)" : "var(--green)",
            x: (isCB ? -112 : 112) + Math.cos(a) * 92, y: Math.sin(a) * 92, z: 0,
            w: 25, d: 25, h: 16 + tickets * 9
          });
        });
      }
      if (twinLayers.incidents) {
        openInc.slice(0, 8).forEach((t, i) => {
          const a = i / Math.min(8, openInc.length || 1) * Math.PI * 2;
          out.push({
            key: "INC:" + t.id, title: t.id + " · " + t.subject, sub: t.priority + " · " + t.status,
            color: "var(--red)", x: Math.cos(a) * 168, y: Math.sin(a) * 168 - 22, z: 0,
            w: 18, d: 18, h: 26
          });
        });
      }
      if (twinLayers.risks) {
        highRisk.slice(0, 6).forEach((r, i) => {
          const a = (i + 0.5) / Math.min(6, highRisk.length || 1) * Math.PI * 2;
          out.push({
            key: "RISK:" + r.id, title: r.id + " · " + r.riskDesc, sub: r.level + " risk · " + r.treatment,
            color: "var(--violet)", x: Math.cos(a) * 196, y: Math.sin(a) * 196 + 20, z: 0,
            w: 20, d: 20, h: 22
          });
        });
      }
      return out;
    }

    const twin = new Axon("#scene-twin", {
      name: "twin", scale: 0.92, cy: 244, az: 34, el: 34, initial: null,
      aria: "Live 3D digital twin of the centralised AI platform estate",
      boxes: twinBoxes,
      lines: () => [{ from: [-112, 0, 104], to: [112, 0, 104], color: "var(--accent)" }],
      onSelect: (key) => renderTwinDetail(key)
    });
    SC.twin = twin;

    function renderTwinDetail(key) {
      const el = $("#twin-detail"); if (!el) return;
      const db = T.db;
      let body = `<strong>Platform estate · live model</strong><p>Two centralised platforms, live B/D tenants, open incidents and high risks. Click a shape to inspect; use layer toggles to isolate a view.</p>`;
      let openBtn = "";
      if (key) {
        const box = twinBoxes().find((b) => b.key === key);
        if (box) {
          body = `<strong>${esc(box.title)}</strong><p>${esc(box.sub || "")}</p>`;
          if (key.indexOf("BD:") === 0) openBtn = `<button class="btn btn-ghost btn-sm" data-fw="twin-open" data-id="${esc(key.slice(3))}">${ic("i-external")} Open B/D record</button>`;
          else if (key.indexOf("INC:") === 0) openBtn = `<button class="btn btn-ghost btn-sm" data-fw="twin-goto" data-view="desk">${ic("i-arrow-right")} Go to Service Desk</button>`;
          else if (key.indexOf("RISK:") === 0) openBtn = `<button class="btn btn-ghost btn-sm" data-fw="twin-goto" data-view="risk">${ic("i-arrow-right")} Go to Risk Register</button>`;
        }
      }
      el.innerHTML = `<div class="scene-detail-list">${[["CBaaS", "Chatbot-as-a-Service"], ["SMTA", "Text Analytics"], ["INC", "An incident"], ["RISK", "A high risk"]].map(([k, l]) => `<button class="layer-chip ${key === k ? "active" : ""}" data-fw="twin-focus" data-key="${esc(k)}">${esc(l)}</button>`).join("")}<button class="layer-chip" data-fw="twin-focus" data-key="CLEAR">Clear</button></div><div class="scene-detail-body">${body}${openBtn}</div>`;
    }

    function renderTwinDynamic() {
      const db = T.db, live = db.bd.filter((b) => b.stage === "Live");
      const openInc = db.tickets.filter((t) => t.status !== "Resolved");
      const highRisk = db.risks.filter((r) => r.level === "High");
      const set = (id, v) => { const e = $(id); if (e) e.textContent = v; };
      set("#twin-live", live.length);
      set("#twin-incidents", openInc.length);
      set("#twin-risks", highRisk.length);
      set("#twin-corpus", db.corpus.length);

      $("#twin-layers").innerHTML = [
        ["tenants", "Live B/D tenants", "var(--green)", live.length],
        ["incidents", "Open incidents", "var(--red)", openInc.length],
        ["risks", "High risks", "var(--violet)", highRisk.length]
      ].map(([k, label, color, n]) => `<label class="twin-layer"><input type="checkbox" data-fw="twin-layer" data-key="${k}" ${twinLayers[k] ? "checked" : ""}><span class="twin-swatch" style="background:${T.cssVar(color.slice(4, -1).trim())}"></span><div><strong>${esc(label)}</strong><small>${n} nodes in the model</small></div><b>${twinLayers[k] ? "ON" : "OFF"}</b></label>`).join("");

      $("#twin-legend").innerHTML = [
        ["Platform core", "var(--brand-2)"], ["Live B/D tenant", "var(--green)"],
        ["Tenant with open tickets", "var(--amber)"], ["Open incident", "var(--red)"], ["High risk", "var(--violet)"]
      ].map(([l, c]) => `<div class="twin-legend-row"><i style="background:${T.cssVar(c.slice(4, -1).trim())}"></i><span>${esc(l)}</span></div>`).join("");

      $("#twin-activity").innerHTML = db.activity.slice(0, 6).map((a) => `<div class="twin-act-row"><span class="hist-dot"></span><div><strong>${esc(a.title)}</strong><small>${esc(a.type)} · ${esc(T.fmtTime ? T.fmtTime(a.at) : "")}</small></div></div>`).join("");

      const rows = live.slice(0, 10).map((b) => {
        const n = db.tickets.filter((t) => t.bd === b.name && t.status !== "Resolved").length;
        return `<tr><td class="strong">${esc(b.name)}<span class="sub">${esc(b.abbr)}</span></td><td>${esc(b.platform)}</td><td><span class="pill ${n ? "pill-amber" : "pill-green"}">${n} open</span></td><td class="muted">${esc(b.usecase)}</td><td><button class="mini-btn" data-fw="twin-open" data-id="${esc(b.id)}">${ic("i-external")} Open</button></td></tr>`;
      }).join("");
      $("#twin-records").innerHTML = `<table class="data-table"><thead><tr><th>Live B/D</th><th>Platform</th><th>Support</th><th>Use case</th><th></th></tr></thead><tbody>${rows || `<tr class="empty-row"><td colspan="5">No live B/D records.</td></tr>`}</tbody></table>`;
      renderTwinDetail(twin.selected);
      twin.render();
    }

    /* ================================================================
       HANDLERS (registered into the framework dispatcher)
       ================================================================ */
    F.handlers.studio = (el) => {
      const s = sceneOf(el.dataset.scene);
      if (!s) return;
      const op = el.dataset.op;
      if (op === "tilt-up") s.setElevation(8);
      else if (op === "tilt-down") s.setElevation(-8);
      else if (op === "zoom-in") s.setZoom(1.12);
      else if (op === "zoom-out") s.setZoom(0.89);
      else if (op === "auto") { const on = s.toggleAuto(); el.classList.toggle("active", on); el.textContent = on ? "Stop rotation" : "Auto rotate"; }
      else if (op === "expand") { if (el.dataset.scene === "expanded") closeExpanded(); else openExpanded(el.dataset.scene); }
      else if (op === "svg") s.snapshot();
    };
    F.handlers["studio-close"] = () => closeExpanded();
    F.handlers["twin-layer"] = (el) => {
      twinLayers[el.dataset.key] = el.checked;
      /* Update in place: rebuilding the whole layer list here would detach the
         control the user just clicked and break rapid successive toggles. */
      const badge = el.closest(".twin-layer").querySelector("b");
      if (badge) badge.textContent = el.checked ? "ON" : "OFF";
      renderTwinDetail(twin.selected);
      twin.render();
      T.toast("3D estate layer " + (el.checked ? "enabled" : "hidden"), "i-layers", null, null);
    };
    F.handlers["twin-focus"] = (el) => {
      const k = el.dataset.key;
      twin.selected = k === "CLEAR" ? null : k;
      twin.render(); renderTwinDetail(twin.selected);
    };
    F.handlers["twin-goto"] = (el) => { T.closeOverlay(); closeExpanded(); T.navigate(el.dataset.view); };
    F.handlers["twin-open"] = (el) => {
      const r = T.findRec("bd", el.dataset.id); if (!r) return;
      const n = T.db.tickets.filter((t) => t.bd === r.name && t.status !== "Resolved").length;
      T.openDrawer({
        eyebrow: "Digital twin · B/D tenant",
        title: r.name, subtitle: r.abbr + " · " + r.stage,
        body: `<div class="detail-grid">${[["Platform", r.platform], ["Adoption stage", r.stage], ["Use case", r.usecase], ["Internal owner", r.owner], ["Target go-live", T.fmtDate(r.golive)], ["Open support tickets", String(n)]].map(([k, v]) => `<div class="detail-row"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join("")}</div><div class="detail-section"><span class="detail-label">Twin representation</span><p class="hint">This tenant is rendered as a 3D node orbiting its platform core. Node height increases with the number of open support tickets; amber nodes have active tickets.</p></div>`,
        foot: `<button class="btn btn-ghost" data-act="close-overlay">Close</button><button class="btn btn-primary" data-fw="twin-goto" data-view="adoption">${ic("i-arrow-right")} Adoption register</button>`
      });
    };

    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && expanded) closeExpanded(); });
    document.addEventListener("t26:refresh", renderTwinDynamic);
    document.addEventListener("t26:theme", () => { if (SC.twin) SC.twin.render(); });
    document.addEventListener("t26:view", (e) => { if (e.detail && e.detail.view === "twin") { SC.twin.render(); } });

    injectBars();
    renderTwinDynamic();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
