/* ================================================================
   T26 Platform · v3.0 — Security Framework module
   Compiled from DPO-CSSA-SEC-2026 · interactive axonometric 3D,
   working control / risk / action registers, full document content.
   ================================================================ */
(function () {
  "use strict";

  function boot() {
    const T = window.T26;
    if (!T) return;
    const D = T.D, FW = D.FW;
    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
    const ic = T.ic, esc = T.esc, fmtDate = T.fmtDate;
    const sel = (arr) => arr.map((v) => ({ value: v, label: v }));
    const LVL = { Low: 1, Medium: 2, High: 3 };
    function riskLevel(l, i) {
      const s = (LVL[l] || 1) * (LVL[i] || 1);
      return s >= 6 ? "High" : s >= 3 ? "Medium" : "Low";
    }
    function pillFor(level) {
      return level === "High" ? "pill-red" : level === "Medium" ? "pill-amber" : "pill-green";
    }
    function statusPill(s) {
      return s === "Compliant" || s === "Done" || s === "Treated" ? "pill-green" :
        s === "In progress" ? "pill-blue" : s === "Review due" ? "pill-amber" : "pill-soft";
    }
    function progressBar(v) {
      const n = Math.max(0, Math.min(100, Number(v) || 0));
      return `<div class="progress-mini"><i style="width:${n}%"></i><span>${n}%</span></div>`;
    }

    /* ================================================================
       REGISTER EXTENSIONS — reuse the platform's CRUD engine
       ================================================================ */
    const domainNames = FW.domains.map((d) => d.id + " · " + d.title);
    T.addReg("controls", {
      label: "control", idKey: "id", prefix: "CTL", view: "controls",
      collection: () => T.db.controls,
      table: "#fw-controls-table", search: "#fw-controls-search", filters: "#fw-controls-filter",
      count: null, showing: "#fw-controls-showing", pager: "#fw-controls-pager", bulk: "#fw-controls-bulk",
      filterKey: "domain", filterOptions: () => ["All"].concat(domainNames),
      searchKeys: ["id", "control", "domain", "ref", "owner", "status", "evidence"],
      defaultSort: { key: "id", dir: 1 },
      columns: [
        { key: "id", label: "Ref", render: (r) => `<span class="mono cell-strong">${esc(r.id)}</span>` },
        { key: "control", label: "Control requirement" },
        { key: "domain", label: "Domain", cls: "muted" },
        { key: "owner", label: "Owner" },
        { key: "status", label: "Status", render: (r) => `<span class="pill ${statusPill(r.status)}">${esc(r.status)}</span>` },
        { key: "review", label: "Review", render: (r) => `<span class="mono">${esc(fmtDate(r.review))}</span>` }
      ],
      fields: [
        { key: "control", label: "Control requirement", type: "textarea", required: true },
        { key: "domain", label: "Control domain", type: "select", options: () => sel(domainNames), default: domainNames[0] },
        { key: "ref", label: "Policy reference", default: "S17 / G3" },
        { key: "owner", label: "Control owner", default: "CSSA" },
        { key: "status", label: "Compliance status", type: "select", options: () => sel(["Compliant", "In progress", "Review due", "Not started"]), default: "Not started" },
        { key: "evidence", label: "Evidence / source", default: "DPO-CSSA-SEC-2026" },
        { key: "review", label: "Next review", type: "date", default: () => new Date().toISOString().slice(0, 10) }
      ]
    });

    T.addReg("risks", {
      label: "risk", idKey: "id", prefix: "AI", view: "risk",
      collection: () => T.db.risks,
      table: "#fw-risks-table", search: "#fw-risks-search", filters: "#fw-risks-filter",
      count: null, showing: "#fw-risks-showing", pager: "#fw-risks-pager", bulk: "#fw-risks-bulk",
      filterKey: "level", filterOptions: () => ["All", "High", "Medium", "Low"],
      searchKeys: ["id", "riskDesc", "threat", "likelihood", "impact", "level", "treatment"],
      defaultSort: { key: "id", dir: 1 },
      columns: [
        { key: "id", label: "Risk ID", render: (r) => `<span class="mono cell-strong">${esc(r.id)}</span>` },
        { key: "riskDesc", label: "Risk description" },
        { key: "threat", label: "Threat / vulnerability", cls: "muted" },
        { key: "likelihood", label: "Likelihood" },
        { key: "impact", label: "Impact" },
        { key: "level", label: "Risk level", render: (r) => `<span class="pill ${pillFor(r.level)}">${esc(r.level)}</span>` },
        { key: "treatment", label: "Treatment" }
      ],
      fields: [
        { key: "riskDesc", label: "Risk description", type: "textarea", required: true },
        { key: "threat", label: "Threat / vulnerability", type: "textarea" },
        { key: "likelihood", label: "Likelihood", type: "select", options: () => sel(["Low", "Medium", "High"]), default: "Low" },
        { key: "impact", label: "Impact", type: "select", options: () => sel(["Low", "Medium", "High"]), default: "Low" },
        { key: "treatment", label: "Treatment", type: "select", options: () => sel(["Mitigate", "Mitigate / Transfer", "Accept / Mitigate", "Transfer", "Accept", "Avoid"]), default: "Mitigate" },
        { key: "owner", label: "Risk owner", default: "CSSA" },
        { key: "status", label: "Status", type: "select", options: () => sel(["Open", "Monitoring", "Treated", "Accepted"]), default: "Open" }
      ],
      finalize: (out) => {
        out.level = riskLevel(out.likelihood, out.impact);
        if (!out.residual) out.residual = "To be accepted by DITSO";
      }
    });

    T.addReg("actions", {
      label: "action", idKey: "id", prefix: "AP", view: "actionplan",
      collection: () => T.db.actions,
      table: "#fw-actions-table", search: "#fw-actions-search", filters: "#fw-actions-filter",
      count: null, showing: "#fw-actions-showing", pager: "#fw-actions-pager", bulk: "#fw-actions-bulk",
      filterKey: "priority", filterOptions: () => ["All", "P1", "P2", "P3"],
      searchKeys: ["id", "action", "target", "reference", "status", "owner"],
      defaultSort: { key: "id", dir: 1 },
      columns: [
        { key: "id", label: "Ref", render: (r) => `<span class="mono cell-strong">${esc(r.id)}</span>` },
        { key: "priority", label: "Priority", render: (r) => `<span class="pill ${r.priority === "P1" ? "pill-red" : r.priority === "P2" ? "pill-amber" : "pill-blue"}">${esc(r.priority)}</span>` },
        { key: "action", label: "Action item" },
        { key: "target", label: "Target", cls: "mono" },
        { key: "reference", label: "Reference", cls: "muted" },
        { key: "status", label: "Status", render: (r) => `<span class="pill ${statusPill(r.status)}">${esc(r.status)}</span>` },
        { key: "progress", label: "Progress", render: (r) => progressBar(r.progress) + `<button class="mini-btn progress-btn" data-fw="action-progress" data-id="${esc(r.id)}">+25%</button>` }
      ],
      fields: [
        { key: "priority", label: "Priority", type: "select", options: () => sel(["P1", "P2", "P3"]), default: "P2" },
        { key: "action", label: "Action item", type: "textarea", required: true },
        { key: "target", label: "Target", default: "TBC" },
        { key: "reference", label: "Policy reference", default: "S17 / G3" },
        { key: "status", label: "Status", type: "select", options: () => sel(["Not started", "In progress", "Done"]), default: "Not started" },
        { key: "owner", label: "Owner", default: "CSSA" },
        { key: "progress", label: "Progress", type: "select", options: () => [{ value: "0", label: "0%" }, { value: "25", label: "25%" }, { value: "50", label: "50%" }, { value: "75", label: "75%" }, { value: "100", label: "100%" }], default: "0", parse: (v) => Number(v) }
      ],
      finalize: (out) => { if (out.status === "Done") out.progress = 100; }
    });

    /* ================================================================
       AXONOMETRIC 3D ENGINE (pure SVG, dependency-free)
       ================================================================ */
    const C30 = Math.cos(Math.PI / 6), S30 = Math.sin(Math.PI / 6);
    function Axon(mountSel, cfg) {
      this.mount = $(mountSel);
      this.cfg = cfg;
      this.az = cfg.az == null ? 35 : cfg.az;
      this.defAz = this.az;
      this.selected = cfg.initial || null;
      this.scale = cfg.scale || 1.15;
      this.cy = cfg.cy || 208;
      this.el = cfg.el == null ? 30 : cfg.el;      // camera elevation above the ground plane
      this.defEl = this.el;
      this.zoom = 1;
      this.auto = false;
      this.raf = null;
    }
    Axon.prototype.proj = function (x, y, z) {
      const a = this.az * Math.PI / 180;
      const X = x * Math.cos(a) - y * Math.sin(a);
      const Y = x * Math.sin(a) + y * Math.cos(a);
      const s = this.scale * this.zoom;
      const tilt = Math.sin(this.el * Math.PI / 180);
      return { x: 320 + (X - Y) * C30 * s, y: this.cy + (X + Y) * tilt * s - z * s, depth: X + Y + z * 0.04 };
    };
    Axon.prototype.setColor = function (c) {
      return c.indexOf("var(") === 0 ? T.cssVar(c.slice(4, -1).trim()) : c;
    };
    Axon.prototype.render = function () {
      if (!this.mount) return;
      if (!this.svg || !this.mount.contains(this.svg)) {
        const glow = T.cssVar("--brand-2");
        this.mount.innerHTML = '<svg class="axon-svg" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + esc(this.cfg.aria || "Interactive 3D model") + '">' +
          '<defs><radialGradient id="axonGlow-' + esc(this.cfg.name) + '" cx="50%" cy="42%" r="68%"><stop offset="0" stop-color="' + glow + '" stop-opacity=".12"/><stop offset="1" stop-color="' + glow + '" stop-opacity="0"/></radialGradient></defs>' +
          '<rect x="0" y="0" width="640" height="400" fill="url(#axonGlow-' + esc(this.cfg.name) + ')"/>' +
          '<g class="axon-shapes"></g></svg><div class="scene-tip"></div>';
        this.svg = $("svg", this.mount);
        this.shapes = $(".axon-shapes", this.mount);
        this.tip = $(".scene-tip", this.mount);
        this.attach();
      }
      this.paint();
    };

    Axon.prototype.attach = function () {
      const self = this, svg = this.svg, tip = this.tip;
      let dragging = false, startX = 0, startY = 0, moved = false;
      svg.addEventListener("pointerdown", (e) => {
        dragging = true; startX = e.clientX; startY = e.clientY; moved = false;
        try { svg.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
      });
      svg.addEventListener("pointermove", (e) => {
        if (dragging) {
          const dx = e.clientX - startX, dy = e.clientY - startY;
          if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
          self.az += dx * 0.35;
          self.el = Math.max(8, Math.min(70, self.el - dy * 0.18));
          startX = e.clientX; startY = e.clientY; self.paint();
        } else {
          const g = e.target.closest("[data-fw='scene-select']");
          if (g && tip) {
            const box = self.cfg.boxes().find((x) => String(x.key) === g.dataset.key);
            const r = self.mount.getBoundingClientRect();
            tip.textContent = box ? box.title + (box.sub ? " · " + box.sub : "") : "";
            tip.style.left = (e.clientX - r.left) + "px";
            tip.style.top = (e.clientY - r.top - 12) + "px";
            tip.classList.add("show");
          } else if (tip) tip.classList.remove("show");
        }
      });
      const stop = (e) => {
        if (!dragging) return;
        dragging = false;
        try { svg.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }
        if (!moved) {
          /* Pointer capture retargets events to the SVG; resolve the element
             under the cursor instead of relying on e.target. */
          const under = document.elementFromPoint(e.clientX, e.clientY);
          const g = under && under.closest ? under.closest("[data-fw='scene-select']") : null;
          if (g) {
            self.selected = g.dataset.key;
            self.cfg.onSelect && self.cfg.onSelect(g.dataset.key, self.cfg.boxes());
            self.paint();
          }
        }
      };
      svg.addEventListener("pointerup", stop);
      svg.addEventListener("pointercancel", stop);
      svg.addEventListener("pointerleave", () => { if (tip) tip.classList.remove("show"); });
    };

    Axon.prototype.paint = function () {
      if (!this.shapes) return;
      const p = T.palette(), boxes = this.cfg.boxes(), lines = this.cfg.lines ? this.cfg.lines() : [];
      const self = this, faces = [];
      boxes.forEach((b, bi) => {
        const hw = b.w / 2, hd = b.d / 2, z = b.z || 0, h = b.h;
        const P = [
          self.proj(b.x - hw, b.y - hd, z), self.proj(b.x + hw, b.y - hd, z),
          self.proj(b.x + hw, b.y + hd, z), self.proj(b.x - hw, b.y + hd, z),
          self.proj(b.x - hw, b.y - hd, z + h), self.proj(b.x + hw, b.y - hd, z + h),
          self.proj(b.x + hw, b.y + hd, z + h), self.proj(b.x - hw, b.y + hd, z + h)
        ];
        [
          { idx: [4, 5, 6, 7], shade: 0.98, edge: 0.34 },
          { idx: [0, 1, 5, 4], shade: 0.78, edge: 0.22 },
          { idx: [1, 2, 6, 5], shade: 0.62, edge: 0.18 },
          { idx: [2, 3, 7, 6], shade: 0.48, edge: 0.14 },
          { idx: [3, 0, 4, 7], shade: 0.66, edge: 0.18 }
        ].forEach((f) => {
          const pts = f.idx.map((i) => P[i]);
          faces.push({
            pts: pts, depth: pts.reduce((sum, q) => sum + q.depth, 0) / pts.length,
            shade: f.shade, edge: f.edge, box: b, bi: bi, top: f.idx[0] === 4
          });
        });
      });
      faces.sort((x, y) => x.depth - y.depth);

      let grid = "";
      for (let g = -220; g <= 220; g += 55) {
        const a1 = this.proj(g, -220, 0), a2 = this.proj(g, 220, 0);
        const b1 = this.proj(-220, g, 0), b2 = this.proj(220, g, 0);
        grid += '<line x1="' + a1.x.toFixed(1) + '" y1="' + a1.y.toFixed(1) + '" x2="' + a2.x.toFixed(1) + '" y2="' + a2.y.toFixed(1) + '" stroke="' + p.line + '" stroke-width="1" opacity=".5"/>';
        grid += '<line x1="' + b1.x.toFixed(1) + '" y1="' + b1.y.toFixed(1) + '" x2="' + b2.x.toFixed(1) + '" y2="' + b2.y.toFixed(1) + '" stroke="' + p.line + '" stroke-width="1" opacity=".5"/>';
      }
      let shadows = "";
      boxes.forEach((b) => {
        const hw = b.w / 2 * 1.08, hd = b.d / 2 * 1.08;
        const Q = [self.proj(b.x - hw, b.y - hd, 0), self.proj(b.x + hw, b.y - hd, 0),
                   self.proj(b.x + hw, b.y + hd, 0), self.proj(b.x - hw, b.y + hd, 0)];
        shadows += '<polygon points="' + Q.map((q) => q.x.toFixed(1) + ',' + q.y.toFixed(1)).join(' ') + '" fill="' + p.ink + '" fill-opacity=".07"/>';
      });
      let connectors = "";
      lines.forEach((l) => {
        const a = this.proj(l.from[0], l.from[1], l.from[2]);
        const b = this.proj(l.to[0], l.to[1], l.to[2]);
        connectors += '<line x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '" stroke="' + this.setColor(l.color || "var(--brand-2)") + '" stroke-width="1.6" stroke-dasharray="4 4" opacity=".6"/>';
      });

      const groups = {};
      faces.forEach((f) => {
        const color = this.setColor(f.box.color);
        const isSel = this.selected != null && String(f.box.key) === String(this.selected);
        const pts = f.pts.map((q) => q.x.toFixed(1) + "," + q.y.toFixed(1)).join(" ");
        const stroke = isSel ? p.ink : (f.top ? "#ffffff" : color);
        const strokeOpacity = isSel ? 0.85 : (f.top ? 0.3 : f.edge);
        const face = '<polygon points="' + pts + '" fill="' + color + '" fill-opacity="' + (isSel ? Math.min(1, f.shade + 0.12) : f.shade) + '" stroke="' + stroke + '" stroke-opacity="' + strokeOpacity + '" stroke-width="' + (isSel ? 1.6 : 0.7) + '"/>';
        if (!groups[f.bi]) groups[f.bi] = [];
        groups[f.bi].push(face);
      });
      let svgFaces = "";
      Object.keys(groups).forEach((k) => {
        const b = boxes[Number(k)];
        svgFaces += '<g class="axon-box ' + (this.selected != null && String(b.key) === String(this.selected) ? "selected" : "") + '" data-fw="scene-select" data-scene="' + esc(this.cfg.name) + '" data-key="' + esc(b.key) + '" style="cursor:pointer">' + groups[k].join("") + '</g>';
      });
      this.shapes.innerHTML = "<g>" + grid + "</g><g>" + shadows + "</g>" + connectors + "<g>" + svgFaces + "</g>";
      const angleEl = $("#defence-angle");
      if (angleEl && this.cfg.name === "defence") angleEl.textContent = "Azimuth " + Math.round(((this.az % 360) + 360) % 360) + "° · Elevation " + Math.round(this.el) + "° · Zoom " + Math.round(this.zoom * 100) + "%";
    };
    Axon.prototype.rotate = function (dir) { this.az += dir * 15; this.paint(); };
    Axon.prototype.setZoom = function (factor) { this.zoom = Math.max(0.6, Math.min(1.9, this.zoom * factor)); this.paint(); };
    Axon.prototype.setElevation = function (delta) { this.el = Math.max(8, Math.min(70, this.el + delta)); this.paint(); };
    Axon.prototype.toggleAuto = function () {
      const self = this;
      this.auto = !this.auto;
      if (this.auto) {
        const step = function () {
          if (!self.auto || !self.svg || !self.mount.contains(self.svg)) { self.auto = false; return; }
          self.az += 0.22; self.paint(); self.raf = requestAnimationFrame(step);
        };
        this.raf = requestAnimationFrame(step);
      } else if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
      return this.auto;
    };
    Axon.prototype.snapshot = function () {
      if (!this.svg) return;
      const clone = this.svg.cloneNode(true);
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      clone.setAttribute("width", "1280");
      clone.setAttribute("height", "800");
      const bg = T.cssVar("--surface");
      const text = new XMLSerializer().serializeToString(clone).replace("<svg", '<svg style="background:' + bg + '"');
      T.download("T26-3D-" + this.cfg.name + "-" + new Date().toISOString().slice(0, 10) + ".svg", text, "image/svg+xml");
      T.toast("3D scene exported as SVG", "i-download", null, null);
    };
    Axon.prototype.reset = function () {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.auto = false; this.raf = null;
      this.az = this.defAz; this.el = this.defEl; this.zoom = 1;
      this.selected = null;
      this.cfg.onSelect && this.cfg.onSelect(null, []);
      this.paint();
    };

    /* ---- Scene definitions ---- */
    const SC = {};
    function buildScenes() {
      SC.defence = new Axon("#scene-defence", {
        name: "defence", scale: 1.32, cy: 250, az: 35, initial: "Governance",
        aria: "Defence in depth: five stacked security control layers",
        boxes: () => FW.defenceLayers.map((l, i) => ({
          key: l.key, title: l.key, sub: l.sub, desc: l.desc, color: l.color,
          x: 0, y: 0, z: i * 27, w: 205 - i * 20, d: 158 - i * 15, h: 14
        })),
        onSelect: (key) => renderDefenceDetail(key)
      });
      SC.controls = new Axon("#scene-controls", {
        name: "controls", scale: 1.12, az: 28, initial: null,
        aria: "Seven security control domains arranged as a 3D ring",
        boxes: () => {
          const cs = FW.domains.map((d, i) => {
            const a = i / FW.domains.length * Math.PI * 2;
            return {
              key: d.id + " · " + d.title, title: d.id + " · " + d.title, sub: d.controls.length + " controls",
              color: ["var(--brand-2)", "var(--accent)", "var(--violet)", "var(--amber)", "var(--green)", "var(--red)", "var(--faint)"][i],
              x: Math.cos(a) * 128, y: Math.sin(a) * 128, z: 0, w: 54, d: 54, h: 22 + d.controls.length * 9
            };
          });
          cs.push({ key: "CORE", title: "Centralised AI platforms", sub: "Chatbot-as-a-Service · SMTA", color: "var(--brand)", x: 0, y: 0, z: 0, w: 78, d: 78, h: 96 });
          return cs;
        },
        onSelect: (key) => {
          if (!key) { T.state.reg.controls.filter = "All"; }
          else T.state.reg.controls.filter = key;
          T.state.reg.controls.page = 1;
          T.renderRegister("controls");
          renderControlLegend(key);
        }
      });
      SC.risk = new Axon("#scene-risk", {
        name: "risk", scale: 1.3, az: 38, initial: null,
        aria: "3D risk heatmap: likelihood by impact with extruded risk counts",
        boxes: () => {
          const out = [], order = ["Low", "Medium", "High"];
          order.forEach((lik, i) => order.forEach((imp, j) => {
            const n = T.db.risks.filter((r) => r.likelihood === lik && r.impact === imp).length;
            const level = riskLevel(lik, imp);
            out.push({
              key: lik + "|" + imp, title: lik + " likelihood × " + imp + " impact", sub: n + " risk" + (n === 1 ? "" : "s") + " · " + level + " level",
              color: level === "High" ? "var(--red)" : level === "Medium" ? "var(--amber)" : "var(--green)",
              x: (i - 1) * 82, y: (j - 1) * 82, z: 0, w: 62, d: 62, h: 14 + n * 34
            });
          }));
          return out;
        },
        onSelect: (key) => renderRiskDetail(key)
      });
      SC.org = new Axon("#scene-org", {
        name: "org", scale: 1.06, az: 30, initial: "central",
        aria: "Government IT security organisation: central, departmental and operational tiers",
        boxes: () => {
          const out = [];
          FW.centralBodies.slice(0, 4).forEach((b, i) => out.push({
            key: "central", title: "Central level · " + b[0], sub: b[1], color: "var(--violet)",
            x: (i - 1.5) * 76, y: -105, z: 118, w: 62, d: 44, h: 22
          }));
          out.push({ key: "dpo", title: "DPO Senior Management / DITSO", sub: "IT Security Management Unit", color: "var(--brand-2)", x: 0, y: 0, z: 62, w: 210, d: 62, h: 26 });
          const ops = ["CSSA", "System Admins", "Contractors", "B/D Users"];
          ops.forEach((o, i) => out.push({
            key: "ops", title: "Operational tier · " + o, sub: "Coordination interface", color: o === "CSSA" ? "var(--accent)" : "var(--green)",
            x: (i - 1.5) * 82, y: 112, z: 0, w: 66, d: 46, h: 32
          }));
          return out;
        },
        lines: () => {
          const l = [];
          for (let i = 0; i < 4; i++) l.push({ from: [(i - 1.5) * 76, -105, 118], to: [0, 0, 88], color: "var(--violet)" });
          for (let i = 0; i < 4; i++) l.push({ from: [0, 0, 62], to: [(i - 1.5) * 82, 112, 32], color: "var(--accent)" });
          return l;
        },
        onSelect: (key) => renderOrgDetail(key)
      });
    }

    /* ================================================================
       STATIC CONTENT — compiled document
       ================================================================ */
    function renderStatic() {
      $("#fw-meta").innerHTML = [
        ["Department", FW.meta.department], ["Position", FW.meta.position],
        ["Planned period", FW.meta.period], ["Work location", FW.meta.location],
        ["Document ref", FW.meta.ref], ["Version", FW.meta.version + " · " + FW.meta.issued]
      ].map(([k, v]) => `<div class="fw-def-row"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join("");
      $("#fw-policies").innerHTML = FW.meta.policies.map((p, i) => `<div class="fw-policy">${ic(i === 0 ? "i-shield" : i === 1 ? "i-book" : "i-clipboard")}<div><strong>${esc(p)}</strong><small>${i === 0 ? "Mandatory minimum requirements" : i === 1 ? "Implementation standards" : "Security risk assessment & audit methodology"}</small></div></div>`).join("");
      $("#fw-exec").innerHTML = `<div class="fw-exec-intro">${FW.exec.intro.map((p) => `<p>${esc(p)}</p>`).join("")}</div><div class="fw-outcomes"><span class="detail-label">Key outcomes</span>${FW.exec.outcomes.map((o, i) => `<div class="fw-outcome"><b>0${i + 1}</b><span>${esc(o)}</span></div>`).join("")}</div><p class="fw-closing">${esc(FW.exec.closing)}</p>`;
      $("#fw-principles").innerHTML = FW.principles.map((p) => `<div class="fw-principle"><span class="fw-principle-id" style="background:${T.cssVar(p.color.slice(4, -1).trim())}">${esc(p.id)}</span><div><strong>${esc(p.name)}</strong><p>${esc(p.text)}</p></div></div>`).join("") + `<p class="hint">${esc(FW.principlesNote)}</p>`;
      $("#fw-scope").innerHTML = `<p class="fw-lead">${esc(FW.purpose)}</p><span class="detail-label">Scope · platform activities</span><ul class="tick-list">${FW.scope.map((s) => `<li>${esc(s)}</li>`).join("")}</ul><div class="threshold-note">${ic("i-info")}<span>${esc(FW.scopeNote)}</span></div>`;
      $("#fw-toc").innerHTML = FW.toc.map(([n, title, view]) => `<a class="fw-toc-item" href="#${esc(view)}"><span>${esc(n)}</span><strong>${esc(title)}</strong>${ic("i-arrow-up-right")}</a>`).join("");

      $("#fw-areas").innerHTML = FW.mandatoryAreas.map(([code, title, note]) => `<div class="fw-area"><span class="mono">${esc(code)}</span><div><strong>${esc(title)}</strong><small>${esc(note)}</small></div></div>`).join("") + `<p class="hint">${esc(FW.areasNote)}</p>`;
      $("#fw-domains").innerHTML = FW.domains.map((d, i) => `<div class="fw-acc" data-fw="acc" data-idx="${i}"><div class="fw-acc-head"><span class="mono">${esc(d.id)}</span><div><strong>${esc(d.title)}</strong><small>${esc(d.ref)} · ${d.controls.length} controls</small></div>${ic("i-chevron-down")}</div><ul class="fw-acc-body">${d.controls.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></div>`).join("");
      $("#fw-cycle").innerHTML = FW.sraaCycle.map(([n, t, d]) => `<div class="fw-cycle-step"><span>${esc(n)}</span><div><strong>${esc(t)}</strong><p>${esc(d)}</p></div></div>`).join("") + `<p class="hint">${esc(FW.sraaNote)}</p>`;
      $("#fw-risksteps").innerHTML = FW.riskSteps.map(([t, d], i) => `<div class="fw-step"><span class="fw-step-n">${i + 1}</span><div><strong>${esc(t)}</strong><p>${esc(d)}</p></div></div>`).join("") + `<p class="hint">${esc(FW.riskStepsNote)}</p>`;
      $("#fw-airisks").innerHTML = `<ul class="tick-list">${FW.aiRisks.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>`;
      $("#fw-risknote").textContent = FW.riskNote;

      $("#fw-central").innerHTML = FW.centralBodies.map((b) => `<div class="fw-role"><span class="mono">${esc(b[0])}</span><div><strong>${esc(b[1])}</strong><p>${esc(b[2])}</p></div></div>`).join("") + `<p class="hint">${esc(FW.centralNote)}</p>`;
      $("#fw-dporoles").innerHTML = FW.dpoRoles.map((r) => `<div class="fw-role"><span class="fw-role-dot"></span><div><strong>${esc(r[0])}</strong><p>${esc(r[1])}</p></div></div>`).join("");
      $("#fw-raci").innerHTML = `<table class="data-table raci"><thead><tr>${FW.raciHeader.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${FW.raci.map((r) => `<tr><td class="strong">${esc(r[0])}</td>${r.slice(1).map((v) => `<td><span class="raci-chip ${v.indexOf("R") > -1 ? "r" : v.indexOf("A") > -1 ? "a" : v === "C" ? "c" : "i"}">${esc(v)}</span></td>`).join("")}</tr>`).join("")}</tbody></table><p class="hint">${esc(FW.raciNote)}</p>`;
      $("#fw-responsibility").innerHTML = `<table class="data-table"><thead><tr><th>CSSA responsibility</th><th>Primary S17 / G3 domain</th><th>Key security focus</th></tr></thead><tbody>${FW.responsibilityMap.map((r) => `<tr><td class="strong">${esc(r[0])}</td><td class="muted">${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</tbody></table>`;
      $("#fw-operational").innerHTML = `<p class="fw-lead">${esc(FW.operational.intro)}</p><ul class="tick-list">${FW.operational.parties.map((p) => `<li>${esc(p)}</li>`).join("")}</ul><span class="detail-label">8.2 Documentation &amp; knowledge management</span><ul class="tick-list">${FW.operational.documentation.map((p) => `<li>${esc(p)}</li>`).join("")}</ul><span class="detail-label">8.3 After-hours &amp; emergency support</span><ul class="tick-list">${FW.operational.afterHours.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`;

      $("#fw-compliance").innerHTML = `<ul class="tick-list">${FW.complianceObligations.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>`;
      $("#fw-reviews").innerHTML = `<ul class="tick-list">${FW.reviews.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>`;
      $("#fw-improve").innerHTML = `<ul class="tick-list">${FW.continuousImprovement.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>`;
      $("#fw-references").innerHTML = FW.references.map((r, i) => `<div class="fw-ref"><span>${i + 1}</span><p>${esc(r)}</p></div>`).join("");
      $("#fw-provenance").innerHTML = `<div class="fw-provenance-grid"><div><span>Source document</span><strong>DPO_CSSA_AI_Platforms_Security_Framework.docx</strong></div><div><span>Framework reference</span><strong>${esc(FW.meta.ref)} · ${esc(FW.meta.version)}</strong></div><div><span>Compiled sections</span><strong>11 sections + Annex A + Annex B</strong></div><div><span>Workspace extensions</span><strong>Control / risk / action registers with status, owners and progress</strong></div></div><p class="hint">${esc(FW.meta.copyright)}. Section text, tables, control lists, the RACI matrix, the Annex B risk register, the Section 10 action plan and the reference list are transcribed from the supplied document. Status, ownership, progress and evidence fields are editable workspace extensions and are not statements of official compliance.</p>`;
    }

    /* ================================================================
       DYNAMIC CONTENT
       ================================================================ */
    function renderDefenceDetail(key) {
      const l = FW.defenceLayers.find((x) => x.key === key);
      const el = $("#defence-detail");
      if (!el) return;
      el.innerHTML = `<div class="scene-detail-list">${FW.defenceLayers.map((x) => `<button class="layer-chip ${x.key === key ? "active" : ""}" data-fw="layer" data-key="${esc(x.key)}" style="--chip:${T.cssVar(x.color.slice(4, -1).trim())}">${esc(x.key)}</button>`).join("")}</div>` +
        (l ? `<div class="scene-detail-body"><strong>${esc(l.key)} · ${esc(l.sub)}</strong><p>${esc(l.desc)}</p></div>` : `<div class="scene-detail-body"><strong>Select a layer</strong><p>Click a layer in the 3D model to read its control focus.</p></div>`);
    }
    function renderControlLegend(key) {
      const el = $("#control-legend"); if (!el) return;
      el.innerHTML = `<div class="scene-detail-list">${FW.domains.map((d) => `<button class="layer-chip ${key === d.id + " · " + d.title ? "active" : ""}" data-fw="domain" data-key="${esc(d.id + " · " + d.title)}">${esc(d.id)}</button>`).join("")}<button class="layer-chip" data-fw="domain" data-key="All">All</button></div>` +
        `<div class="scene-detail-body"><strong>${key ? esc(key) : "All control domains"}</strong><p>${key ? "The compliance register is filtered to this domain. Click again or choose All to clear." : "Click a domain column in the 3D model to filter the register below."}</p></div>`;
    }
    function renderRiskDetail(key) {
      const el = $("#risk-heatmap-detail"); if (!el) return;
      let body = `<strong>3D risk surface</strong><p>Axes: likelihood (Low → High) and impact (Low → High). Column height is the number of recorded risks in that cell; colour shows the computed risk level. Click a column to inspect it.</p>`;
      if (key) {
        const [lik, imp] = key.split("|");
        const rows = T.db.risks.filter((r) => r.likelihood === lik && r.impact === imp);
        body = `<strong>${esc(lik)} likelihood × ${esc(imp)} impact · ${rows.length} risk${rows.length === 1 ? "" : "s"}</strong><p>${rows.length ? rows.map((r) => esc(r.id) + " " + esc(r.riskDesc)).join(" · ") : "No risks currently recorded in this cell."}</p>`;
      }
      el.innerHTML = `<div class="scene-detail-list">${["High", "Medium", "Low"].map((v) => `<button class="layer-chip" data-fw="risk-filter" data-key="${v}">${v} risks</button>`).join("")}<button class="layer-chip" data-fw="risk-filter" data-key="All">All</button></div><div class="scene-detail-body">${body}</div>`;
    }
    function renderOrgDetail(key) {
      const el = $("#org-detail"); if (!el) return;
      const map = {
        central: ["Central level", "ISMC · ITSWG · GIRO · GovCERT.HK issue policy, guidance, alerts and coordination."],
        dpo: ["Departmental level", "DPO Senior Management / DITSO and the IT Security Management Unit own strategy, policy and monitoring."],
        ops: ["Operational tier", "CSSA coordinates laterally with System Admins, the App Dev Team, Contractors and B/D Users."]
      };
      const v = map[key] || ["Security organisation", FW.orgFigure];
      el.innerHTML = `<div class="scene-detail-list">${["central", "dpo", "ops"].map((k) => `<button class="layer-chip ${k === key ? "active" : ""}" data-fw="org-tier" data-key="${k}">${k === "central" ? "Central" : k === "dpo" ? "DPO" : "Operations"}</button>`).join("")}</div><div class="scene-detail-body"><strong>${esc(v[0])}</strong><p>${esc(v[1])}</p></div>`;
    }

    function renderDynamic() {
      const c = T.db.controls, a = T.db.actions;
      const set = (id, v) => { const e = $(id); if (e) e.textContent = v; };
      set("#fw-ctl-total", c.length);
      set("#fw-ctl-compliant", c.filter((x) => x.status === "Compliant").length);
      set("#fw-ctl-progress", c.filter((x) => x.status === "In progress").length);
      set("#fw-ctl-review", c.filter((x) => x.status === "Review due").length);
      set("#fw-act-total", a.length);
      set("#fw-act-progress", a.filter((x) => x.status === "In progress").length);
      set("#fw-act-done", a.filter((x) => x.status === "Done").length);
      set("#fw-act-avg", (a.length ? Math.round(a.reduce((s, x) => s + (Number(x.progress) || 0), 0) / a.length) : 0) + "%");

      ["controls", "risks", "actions"].forEach((n) => T.renderRegister(n));
      Object.keys(SC).forEach((k) => SC[k].render());
      renderDefenceDetail(SC.defence.selected);
      renderControlLegend(SC.controls.selected);
      renderRiskDetail(SC.risk.selected);
      renderOrgDetail(SC.org.selected);
    }

    /* ================================================================
       EVENTS
       ================================================================ */
    const handlers = {
      "scene": (el) => { const s = SC[el.dataset.scene]; if (s) s.rotate(Number(el.dataset.dir)); },
      "scene-reset": (el) => { const s = SC[el.dataset.scene]; if (s) s.reset(); },
      "scene-select": (el) => {
        const s = SC[el.dataset.scene]; if (!s) return;
        s.selected = el.dataset.key;
        s.cfg.onSelect && s.cfg.onSelect(el.dataset.key, s.cfg.boxes());
        s.render();
      },
      "layer": (el) => { SC.defence.selected = el.dataset.key; SC.defence.render(); renderDefenceDetail(el.dataset.key); },
      "domain": (el) => {
        const k = el.dataset.key === "All" ? null : el.dataset.key;
        SC.controls.selected = k;
        T.state.reg.controls.filter = k || "All"; T.state.reg.controls.page = 1;
        T.renderRegister("controls"); SC.controls.render(); renderControlLegend(k);
      },
      "risk-filter": (el) => {
        T.state.reg.risks.filter = el.dataset.key; T.state.reg.risks.page = 1;
        T.renderRegister("risks");
        SC.risk.selected = null; SC.risk.render(); renderRiskDetail(null);
      },
      "org-tier": (el) => { SC.org.selected = el.dataset.key; SC.org.render(); renderOrgDetail(el.dataset.key); },
      "acc": (el) => { el.classList.toggle("open"); },
      "action-progress": (el) => {
        const r = T.findRec("actions", el.dataset.id); if (!r) return;
        T.commit(() => {
          r.progress = Math.min(100, (Number(r.progress) || 0) + 25);
          r.status = r.progress >= 100 ? "Done" : r.progress > 0 ? "In progress" : "Not started";
        }, { log: { type: "Action plan", title: "Action progress updated · " + r.id, desc: r.action.slice(0, 100) + " → " + r.progress + "%", tone: "teal", ref: r.id }, toast: r.id + " progress " + r.progress + "%" });
      }
    };

    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-fw]");
      if (!el) return;
      const fn = handlers[el.dataset.fw];
      if (fn) fn(el);
    });
    document.addEventListener("t26:refresh", renderDynamic);
    document.addEventListener("t26:theme", () => { Object.keys(SC).forEach((k) => SC[k].render()); });
    document.addEventListener("t26:view", (e) => {
      const v = e.detail && e.detail.view;
      if (["security", "controls", "risk", "governance", "actionplan"].indexOf(v) > -1) {
        Object.keys(SC).forEach((k) => SC[k].render());
      }
    });
    /* Search inputs for the three framework registers */
    [["#fw-controls-search", "controls"], ["#fw-risks-search", "risks"], ["#fw-actions-search", "actions"]].forEach(([s, reg]) => {
      const el = $(s); if (!el) return;
      el.addEventListener("input", () => { T.state.reg[reg].q = el.value; T.state.reg[reg].page = 1; T.renderRegister(reg); });
    });

    renderStatic();
    buildScenes();
    renderDynamic();
    window.T26FW = { Axon: Axon, SC: SC, FW: FW, renderDynamic: renderDynamic, handlers: handlers };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
