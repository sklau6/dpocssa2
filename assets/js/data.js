/* ================================================================
   T26 · Centralised AI & Data Analytics Platform Operations
   Reference data — illustrative sample records for demonstration
   ================================================================ */
(function () {
  "use strict";

  const DATA = {

    pages: {
      overview:    { crumb: "Overview",             eyebrow: "Executive summary",       title: "Overview",               subtitle: "Platform health, adoption momentum and operational priorities at a glance." },
      position:    { crumb: "Position Profile",     eyebrow: "Position definition",     title: "Position Profile",       subtitle: "Project nature, duties, requirements and mandatory experience thresholds for T26." },
      platforms:   { crumb: "Platform Catalogue",   eyebrow: "Service catalogue",       title: "Centralised Platforms",  subtitle: "Architecture, capabilities and administration profile of the two shared AI and analytics services." },
      console:     { crumb: "Chatbot Console",      eyebrow: "Live application",        title: "Chatbot Console",        subtitle: "Operate the tenant-scoped conversational service: grounded answers, intent confidence, knowledge governance and escalation." },
      lab:         { crumb: "Text Analytics Lab",   eyebrow: "Live application",        title: "Text Analytics Lab",     subtitle: "Analyse public text for sentiment, topics, entities and privacy screening, and manage the monitored stream." },
      adoption:    { crumb: "Adoption & B/Ds",      eyebrow: "B/D engagement",          title: "Adoption & B/Ds",        subtitle: "Promoting, arranging and supporting adoption of centralised platforms across Government bureaux and departments." },
      desk:        { crumb: "Service Desk",         eyebrow: "Working application",     title: "Service Desk",           subtitle: "Triage, assign and resolve technical and user support requests against priority-based SLA windows." },
      performance: { crumb: "Performance",          eyebrow: "Measurement & evaluation",title: "Performance Evaluation", subtitle: "Evaluating platform performance with defined metrics to facilitate evidence-based B/D adoption." },
      lifecycle:   { crumb: "Delivery Lifecycle",   eyebrow: "Design to administration",title: "Delivery Lifecycle",    subtitle: "Support across design, implementation, testing, maintenance and administration of the platforms." },
      vendors:     { crumb: "Stakeholders & Vendors",eyebrow:"Coordination & governance",title: "Stakeholders & Vendors",subtitle: "Effective information flow among contractors, internal teams, consulting teams and B/Ds." },
      research:    { crumb: "Gen AI Research",      eyebrow: "Market intelligence",     title: "Gen AI Research",        subtitle: "Market research and analysis of Gen AI and data analytics developments." },
      documents:   { crumb: "Document Registry",    eyebrow: "Records management",      title: "Document Registry",      subtitle: "Electronic and physical files kept up-to-date, accurately recorded and easily accessible." },
      operations:  { crumb: "Support & Operations", eyebrow: "Service continuity",      title: "Support & Operations",   subtitle: "After-hours technical and administrative support for special events, fire-fighting and urgent deployment." },
      assessment:  { crumb: "Capability Assessment",eyebrow: "Self-check worksheet",    title: "Capability Assessment",  subtitle: "Map evidence against the stated requirements and mandatory three-year skill thresholds." },
      security:    { crumb: "Security Framework",   eyebrow: "Compiled framework · DPO-CSSA-SEC-2026", title: "Security Framework",       subtitle: "IT Security Compliance & Operational Support Framework for centralised AI and data analytics platforms." },
      controls:    { crumb: "Security Controls",    eyebrow: "S17 / G3 control domains", title: "Security Controls",       subtitle: "Seven key control domains, S17 area mapping and a working control compliance register." },
      risk:        { crumb: "Risk Assessment",      eyebrow: "ISPG-SM01 · SRAA",       title: "Risk Assessment",         subtitle: "Iterative security risk assessment cycle, AI-specific risks and a live risk register with a 3D heatmap." },
      governance:  { crumb: "Governance & RACI",    eyebrow: "Organisation & accountability", title: "Governance & RACI",   subtitle: "Central IT security bodies, DPO roles, organisation interfaces and the Annex A responsibility matrix." },
      actionplan:  { crumb: "Action Plan",          eyebrow: "Assurance & improvement",  title: "Action Plan & Assurance", subtitle: "Prioritised engagement actions, compliance obligations, reviews, continuous improvement and references." },
      twin:        { crumb: "Platform Digital Twin", eyebrow: "3D Studio · live estate",    title: "Platform Digital Twin",   subtitle: "A live three-dimensional model of both centralised platforms, production B/D tenants, open incidents and high risks." },
      report:      { crumb: "Compiled Assurance Report", eyebrow: "Board-ready · DPO-CSSA-SEC-2026", title: "Compiled Assurance Report", subtitle: "The security framework compiled together with live workspace data into a printable, exportable board report." }
    },

    /* ---------- Overview ---------- */
    sparks: {
      availability: [99.62,99.68,99.71,99.66,99.74,99.78,99.73,99.81,99.79,99.84,99.83,99.87],
      adoption:     [6,7,8,8,9,10,10,11,12,12,13,14],
      volume:       [284,302,316,332,355,372,389,414,437,459,471,486],
      tickets:      [86,92,88,101,96,108,113,105,119,116,124,128]
    },

    health: [
      { name: "Chatbot-as-a-Service", icon: "i-message", uptime: 99.92, note: "14 live B/D tenants · 312K conversations / month · no open P1", status: "Operational" },
      { name: "Social Media Text Analytics System", icon: "i-activity", uptime: 99.81, note: "9 dashboards · 174K text items / month · 1 collector in watch", status: "Operational" }
    ],

    funnel: [
      { label: "Live", value: 14, color: "var(--green)", note: "Production tenants with signed support arrangements" },
      { label: "Pilot", value: 3, color: "var(--brand-2)", note: "Controlled rollout with evaluation checkpoints" },
      { label: "Assessment", value: 2, color: "var(--violet)", note: "Requirements and data-governance review" },
      { label: "Discovery", value: 3, color: "var(--faint)", note: "Initial briefing and use-case qualification" }
    ],

    activity: [
      { title: "UAT cycle completed for Chatbot-as-a-Service v3.4", desc: "Regression, accessibility and intent-accuracy gates passed; release approved for staged deployment.", time: "Today 09:40", tone: "" },
      { title: "Adoption briefing held with two prospective B/Ds", desc: "Discovery sessions covered platform capabilities, onboarding effort and support arrangements.", time: "Yesterday", tone: "teal" },
      { title: "Sentiment model evaluation report published", desc: "Sampled validation against human-labelled data; 86.7% agreement, drift within tolerance.", time: "3 Nov", tone: "violet" },
      { title: "Contractor performance review completed", desc: "SLA attainment, open defects and change requests reviewed with the delivery contractor.", time: "2 Nov", tone: "amber" },
      { title: "After-hours cover confirmed for upcoming public event", desc: "Technical and administrative standby rosters issued; escalation contacts verified.", time: "30 Oct", tone: "" },
      { title: "Document registry quarterly review", desc: "Version and ownership checks completed; three records marked for update.", time: "28 Oct", tone: "teal" }
    ],

    priorities: [
      { text: "Close remaining UAT observations for v3.4", sub: "Release management · due Fri", done: true },
      { text: "Prepare platform evaluation pack for steering meeting", sub: "Performance evaluation · due Mon", done: false },
      { text: "Confirm onboarding plan for three pilot B/Ds", sub: "Adoption · due Wed", done: false },
      { text: "Refresh physical file index and access log", sub: "Records management · due Thu", done: false },
      { text: "Validate on-call escalation contacts", sub: "Operations · due Fri", done: false }
    ],

    scope: [
      { icon: "i-cpu",       title: "Design & implementation", text: "Support design and implementation of centralised AI applications and the data analytics platform." },
      { icon: "i-clipboard", title: "Testing & maintenance", text: "Plan and support test cycles, ongoing maintenance and platform administration." },
      { icon: "i-building",  title: "Promotion & adoption", text: "Promote services, arrange adoption and give technical and user support to B/Ds." },
      { icon: "i-users",     title: "Coordination", text: "Keep information flowing between contractors, internal teams, consulting teams and B/Ds." },
      { icon: "i-book",      title: "Market research", text: "Research and analyse Gen AI and data analytics developments." },
      { icon: "i-archive",   title: "Records management", text: "Maintain electronic and physical files so documents stay current and accessible." },
      { icon: "i-zap",       title: "After-hours support", text: "Provide technical and administrative support for special events, fire-fighting and urgent deployment." }
    ],

    /* ---------- Position ---------- */
    duties: [
      { icon: "i-cpu", title: "Design, implementation & administration", text: "Provide support for the design, implementation, testing, maintenance and administration of centralised AI applications and data analytics platform, including Chatbot-as-a-Service and the Social Media Text Analytics System.", tags: ["Solution design", "Build support", "UAT", "Maintenance", "Administration"] },
      { icon: "i-building", title: "Promotion, adoption & user support", text: "Promote, arrange adoption and provide technical and user support of centralised AI applications and data analytics platform for Government B/Ds.", tags: ["Briefings", "Onboarding", "Help desk", "Training"] },
      { icon: "i-users", title: "Multi-party coordination", text: "Coordinate with different parties, including contractors, internal teams, consulting teams and other B/Ds, to ensure effective information flow among them for AI development in the Government.", tags: ["Contractors", "Internal teams", "Consulting teams", "B/Ds"] },
      { icon: "i-book", title: "Market research & analysis", text: "Conduct market researches and analyses of the development of Gen AI and data analytics related subjects.", tags: ["Gen AI", "Data analytics", "Vendor landscape", "Trend analysis"] },
      { icon: "i-archive", title: "Electronic & physical file management", text: "Maintain and organise electronic and physical files, ensuring all documents are up-to-date, accurately recorded, and easily accessible for team members.", tags: ["Version control", "Filing", "Retention", "Access"] },
      { icon: "i-lifebuoy", title: "After-hours technical & administrative support", text: "When necessary, provide both technical and administrative support related to the projects after normal office hours for special events, fire-fighting and urgent deployment of services, etc.", tags: ["On-call", "Fire-fighting", "Urgent deployment", "Special events"] },
      { icon: "i-list", title: "Other assigned duties", text: "Carry out other duties as assigned by the supervisors.", tags: ["Flexibility", "Supervisor direction"] }
    ],

    requirements: [
      "Possess knowledge and experience on <strong>managing and supporting government systems or platforms</strong>.",
      "Possess knowledge and experience on <strong>supporting AI-related project</strong>.",
      "Possess strong sense of <strong>analytical and problem solving skills</strong>.",
      "Possess <strong>good communication and interpersonal skills</strong>.",
      "<strong>Hard working and self-motivated</strong> with good working attitudes.",
      "<strong>Can work independently</strong>."
    ],

    thresholds: {
      tech: [
        { name: "IT Application Development and Management", note: "at least 3 years" },
        { name: "System Implementation and Maintenance / Support", note: "at least 3 years" }
      ],
      nontech: [
        { name: "Management and Support of Gov't Systems & Services", note: "at least 3 years" },
        { name: "Vendor Management", note: "at least 3 years" }
      ]
    },

    /* ---------- Platforms ---------- */
    flowChatbot: [
      { icon: "i-globe", label: "Citizen channels", sub: "Web · portal · mobile · API" },
      { icon: "i-shield", label: "Access & identity", sub: "Authentication gateway" },
      { icon: "i-message", label: "Dialogue engine", sub: "Intent · flow · fallback" },
      { icon: "i-sparkles", label: "Model layer", sub: "Retrieval · LLM gateway" },
      { icon: "i-database", label: "Knowledge base", sub: "Versioned corpora" },
      { icon: "i-chart", label: "Analytics & audit", sub: "Logs · KPIs · reporting" }
    ],
    flowSmta: [
      { icon: "i-globe", label: "Public text sources", sub: "Social platforms · feeds" },
      { icon: "i-download", label: "Ingestion layer", sub: "Collectors · rate limits" },
      { icon: "i-filter", label: "Normalisation", sub: "De-dup · language · PII" },
      { icon: "i-cpu", label: "Analytics engine", sub: "Sentiment · topic · trend" },
      { icon: "i-database", label: "Text store", sub: "Partitioned · retention" },
      { icon: "i-chart", label: "Dashboards", sub: "Insight · digest · export" }
    ],
    capChatbot: [
      { icon: "i-message", title: "Reusable dialogue framework", text: "Standard intents, flows and fallback patterns shared across B/D tenants." },
      { icon: "i-database", title: "Governed knowledge base", text: "Version-controlled corpora with maker-checker approval before publication." },
      { icon: "i-sparkles", title: "Gen AI integration", text: "Controlled LLM gateway with retrieval augmentation and response guardrails." },
      { icon: "i-globe", title: "Multi-language support", text: "Traditional Chinese, Simplified Chinese and English content handling." },
      { icon: "i-chart", title: "Tenant analytics", text: "Containment, resolution and satisfaction metrics per department." },
      { icon: "i-shield", title: "Isolation & audit", text: "Tenant separation, role-based access and complete conversation audit trails." }
    ],
    capSmta: [
      { icon: "i-download", title: "Managed ingestion", text: "Scheduled and streaming collectors with health and freshness monitoring." },
      { icon: "i-cpu", title: "Sentiment & topic analytics", text: "Model-based classification with sampled human validation and drift checks." },
      { icon: "i-trend", title: "Trend & spike detection", text: "Volume anomalies and emerging themes surfaced for departmental review." },
      { icon: "i-chart", title: "Role-based dashboards", text: "Configurable views, scheduled digests and exportable reporting." },
      { icon: "i-lock", title: "Privacy-aware processing", text: "PII screening, data classification and documented retention rules." },
      { icon: "i-refresh", title: "Model lifecycle", text: "Re-training, evaluation records and change history for every model version." }
    ],
    roadmapChatbot: [
      { when: "NOW", title: "v3.4 · Intent tuning & accessibility", text: "Improved fallback handling, WCAG alignment and expanded analytics exports.", state: "Released", cls: "pill-green" },
      { when: "Q1", title: "v3.5 · Retrieval quality programme", text: "Corpus hygiene tooling, citation display and answer-grounding evaluation.", state: "In progress", cls: "pill-blue" },
      { when: "Q2", title: "v4.0 · Multi-agent orchestration", text: "Controlled agentic workflows for complex departmental enquiry handling.", state: "Assessment", cls: "pill-violet" },
      { when: "Q3", title: "Tenant self-service console", text: "Delegated content publishing and analytics access for B/D administrators.", state: "Planned", cls: "pill-soft" }
    ],
    roadmapSmta: [
      { when: "NOW", title: "v2.7 · Collector resilience", text: "Retry logic, source health dashboards and ingestion lag alerting.", state: "Released", cls: "pill-green" },
      { when: "Q1", title: "v2.8 · Topic model refresh", text: "Re-trained clustering with improved Traditional Chinese coverage.", state: "In progress", cls: "pill-blue" },
      { when: "Q2", title: "v3.0 · Narrative summarisation", text: "Gen AI assisted theme summaries with human review before release.", state: "Assessment", cls: "pill-violet" },
      { when: "Q3", title: "Cross-platform insight layer", text: "Joint signals from chatbot enquiries and social text trends.", state: "Planned", cls: "pill-soft" }
    ],
    shared: [
      { icon: "i-shield", title: "Identity & access", text: "Central authentication, role-based access control and periodic entitlement review across both services." },
      { icon: "i-lock", title: "Security & privacy", text: "Data classification, privacy impact assessment, encryption and controlled handling of personal data." },
      { icon: "i-activity", title: "Monitoring & alerting", text: "Unified availability, latency and error-rate monitoring with a common incident routing path." },
      { icon: "i-file", title: "Audit & logging", text: "Consistent administrative and user activity logs retained to the approved schedule." },
      { icon: "i-database", title: "Data governance", text: "Shared taxonomy, retention rules, quality checks and controlled export mechanisms." },
      { icon: "i-git", title: "Change & release", text: "One change calendar, regression baseline and rollback standard protecting all B/D tenants." }
    ],
    sharedControls: [
      ["Access control", "Role-based access · quarterly entitlement review", "Internal security team", "Quarterly", "Compliant"],
      ["Logging & audit", "Central log retention · immutable admin trail", "Platform operations", "Monthly", "Compliant"],
      ["Availability", "≥ 99.5% monthly · synthetic probes", "Platform operations", "Continuous", "Compliant"],
      ["Data classification", "Approved classification & handling standard", "Data governance lead", "Half-yearly", "Compliant"],
      ["Privacy assessment", "PIA before new data source or model", "Project governance", "Per change", "1 in review"],
      ["Change management", "CAB approval · regression · rollback plan", "Release manager", "Per release", "Compliant"],
      ["Incident response", "P1–P4 matrix · post-incident review", "On-call CSSA", "Per incident", "Compliant"]
    ],

    /* ---------- Adoption ---------- */
    bdStages: ["All", "Live", "Pilot", "Assessment", "Discovery", "On hold"],
    bd: [
      { name: "Digital Policy Office", abbr: "DPO", platform: "Both", stage: "Live", usecase: "Internal AI help desk & policy sentiment", owner: "Platform team", golive: "2025-04-18" },
      { name: "Immigration Department", abbr: "IMMD", platform: "Chatbot", stage: "Live", usecase: "Enquiry handling on visa services", owner: "Adoption lead", golive: "2025-06-02" },
      { name: "Inland Revenue Department", abbr: "IRD", platform: "Chatbot", stage: "Live", usecase: "Tax filing guidance assistant", owner: "Adoption lead", golive: "2025-07-14" },
      { name: "Transport Department", abbr: "TD", platform: "Chatbot", stage: "Live", usecase: "Licence & vehicle service enquiries", owner: "Support lead", golive: "2025-08-25" },
      { name: "Housing Department", abbr: "HD", platform: "Chatbot", stage: "Live", usecase: "Housing application FAQs", owner: "Adoption lead", golive: "2025-09-11" },
      { name: "Department of Health", abbr: "DH", platform: "Both", stage: "Live", usecase: "Public health enquiries & sentiment", owner: "Platform team", golive: "2025-10-06" },
      { name: "Education Bureau", abbr: "EDB", platform: "Chatbot", stage: "Live", usecase: "School admission information", owner: "Support lead", golive: "2025-11-20" },
      { name: "Information Services Department", abbr: "ISD", platform: "SMTA", stage: "Live", usecase: "Public opinion trend monitoring", owner: "Analytics lead", golive: "2025-12-04" },
      { name: "Food and Environmental Hygiene Department", abbr: "FEHD", platform: "SMTA", stage: "Live", usecase: "Service feedback theme analysis", owner: "Analytics lead", golive: "2026-01-22" },
      { name: "Leisure and Cultural Services Department", abbr: "LCSD", platform: "Chatbot", stage: "Live", usecase: "Facility booking assistant", owner: "Adoption lead", golive: "2026-02-16" },
      { name: "Environmental Protection Department", abbr: "EPD", platform: "SMTA", stage: "Live", usecase: "Recycling campaign sentiment", owner: "Analytics lead", golive: "2026-04-09" },
      { name: "Social Welfare Department", abbr: "SWD", platform: "Chatbot", stage: "Live", usecase: "Benefit scheme guidance", owner: "Support lead", golive: "2026-06-18" },
      { name: "Census and Statistics Department", abbr: "C&SD", platform: "SMTA", stage: "Live", usecase: "Publication feedback analysis", owner: "Analytics lead", golive: "2026-08-27" },
      { name: "Working Family and Student Financial Assistance Agency", abbr: "WFSFAA", platform: "Chatbot", stage: "Live", usecase: "Assistance scheme enquiries", owner: "Adoption lead", golive: "2026-10-05" },
      { name: "Commerce and Economic Development Bureau", abbr: "CEDB", platform: "Both", stage: "Pilot", usecase: "Business enquiries & trade sentiment", owner: "Adoption lead", golive: "2026-12-11" },
      { name: "Hong Kong Police Force", abbr: "HKPF", platform: "SMTA", stage: "Pilot", usecase: "Public safety rumour detection", owner: "Analytics lead", golive: "2027-01-15" },
      { name: "Government Logistics Department", abbr: "GLD", platform: "Chatbot", stage: "Pilot", usecase: "Supplier enquiry triage", owner: "Support lead", golive: "2027-02-03" },
      { name: "Hospital Authority", abbr: "HA", platform: "Chatbot", stage: "Assessment", usecase: "Patient enquiry routing", owner: "Adoption lead", golive: "2027-04-20" },
      { name: "Labour Department", abbr: "LD", platform: "SMTA", stage: "Assessment", usecase: "Employment sentiment tracking", owner: "Analytics lead", golive: "TBC" },
      { name: "Buildings Department", abbr: "BD", platform: "Chatbot", stage: "Discovery", usecase: "Building safety guidance", owner: "Adoption lead", golive: "TBC" },
      { name: "Water Supplies Department", abbr: "WSD", platform: "Chatbot", stage: "Discovery", usecase: "Service interruption enquiries", owner: "Support lead", golive: "TBC" },
      { name: "Agriculture, Fisheries and Conservation Department", abbr: "AFCD", platform: "SMTA", stage: "On hold", usecase: "Conservation campaign monitoring", owner: "Analytics lead", golive: "TBC" }
    ],
    adoptionSteps: [
      { title: "Brief & qualify", text: "Present platform capabilities, eligibility, effort and support model; record the candidate use case." },
      { title: "Assess", text: "Review data, integration, security, accessibility and governance requirements with the B/D." },
      { title: "Pilot", text: "Configure a controlled tenant, agree success criteria and run an evaluation checkpoint." },
      { title: "Go live", text: "Complete training, documentation handover, support routing and operating arrangements." },
      { title: "Review & extend", text: "Measure performance, capture feedback and identify further use cases or platform extensions." }
    ],
    support: [
      { icon: "i-building", title: "Pre-adoption briefing", text: "Capability walkthrough, service catalogue, effort estimate and reference architecture for the B/D." },
      { icon: "i-clipboard", title: "Onboarding & configuration", text: "Tenant setup, content preparation, integration support and acceptance criteria definition." },
      { icon: "i-book", title: "Training & user guides", text: "Role-based training, quick reference guides and maintained FAQ content for departmental users." },
      { icon: "i-lifebuoy", title: "First-line technical support", text: "Ticket triage, issue reproduction, contractor coordination and progress feedback to the B/D." },
      { icon: "i-chart", title: "Performance feedback", text: "Regular metric reviews showing benefit realised and tuning actions for each live tenant." },
      { icon: "i-refresh", title: "Continuous improvement", text: "Consolidated feedback into the platform roadmap and shared good-practice patterns." }
    ],

    /* ---------- Performance ---------- */
    months: ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
    seriesChatbot: [186,198,205,214,228,241,252,268,281,295,306,312],
    seriesSmta:    [98,104,111,118,124,131,139,146,152,161,168,174],
    metrics: [
      { label: "Platform availability", value: "99.87%", note: "Target ≥ 99.5%", ok: true },
      { label: "Intent resolution rate", value: "92.4%", note: "Target ≥ 90%", ok: true },
      { label: "Median response time", value: "1.2 s", note: "Target ≤ 2.0 s", ok: true },
      { label: "Sentiment agreement", value: "86.7%", note: "Target ≥ 85%", ok: true },
      { label: "Support response SLA", value: "94%", note: "Target ≥ 95%", ok: false },
      { label: "Monthly interactions", value: "486K", note: "+18.4% YoY", ok: true }
    ],
    ticketMix: [
      { label: "Configuration & access", value: 34, color: "var(--brand-2)" },
      { label: "Content & knowledge", value: 27, color: "var(--accent)" },
      { label: "Integration", value: 18, color: "var(--violet)" },
      { label: "Data & reporting", value: 13, color: "var(--amber)" },
      { label: "Performance", value: 8, color: "var(--faint)" }
    ],
    sla: [
      { label: "Chatbot-as-a-Service", value: 96, color: "var(--brand-2)" },
      { label: "Social Media Text Analytics", value: 93, color: "var(--accent)" },
      { label: "Shared foundation", value: 91, color: "var(--violet)" },
      { label: "Overall", value: 94, color: "var(--green)" }
    ],
    framework: [
      ["Reliability", "Platform availability", "Percentage of scheduled uptime measured by synthetic probes", "≥ 99.5%", "99.87%", "Met"],
      ["Reliability", "P1 incident count", "Critical incidents affecting all tenants in the period", "0", "0", "Met"],
      ["Responsiveness", "Median response time", "Chatbot end-to-end response measured at the gateway", "≤ 2.0 s", "1.2 s", "Met"],
      ["Responsiveness", "Support response SLA", "Tickets acknowledged within the target window", "≥ 95%", "94%", "Watch"],
      ["Quality", "Intent resolution rate", "Sessions resolved without escalation or fallback", "≥ 90%", "92.4%", "Met"],
      ["Quality", "Fallback rate", "Sessions routed to fallback or human handover", "≤ 10%", "7.6%", "Met"],
      ["Quality", "Sentiment agreement", "Model output agreement with sampled human labels", "≥ 85%", "86.7%", "Met"],
      ["Quality", "Ingestion lag", "Time from source publication to availability for analysis", "≤ 5 min", "4.1 min", "Met"],
      ["Adoption", "Live B/D tenants", "Departments in production on a centralised platform", "20 by year end", "14", "In progress"],
      ["Adoption", "Active monthly users", "Distinct departmental users in the last 30 days", "≥ 1,200", "1,148", "Watch"],
      ["Experience", "User satisfaction", "Post-interaction and post-support satisfaction score", "≥ 4.2 / 5", "4.3 / 5", "Met"],
      ["Governance", "Documentation currency", "Registered records reviewed within their cycle", "100%", "87.5%", "Watch"]
    ],
    evalSteps: [
      { title: "Define the measure", text: "Agree metric definitions, formulas, data source and owner with internal teams and the contractor." },
      { title: "Instrument & collect", text: "Use platform telemetry, ticket records and sampled human validation rather than one-off manual estimates." },
      { title: "Validate & normalise", text: "Check for gaps, duplicates and seasonality; keep the calculation reproducible between periods." },
      { title: "Compare against target", text: "Assess each result against the agreed target and attach a clear status and explanation." },
      { title: "Publish & act", text: "Share an evaluation pack with B/Ds and log tuning, remediation or roadmap actions with owners." }
    ],
    cadence: [
      { when: "Daily", title: "Service health check", text: "Availability, error rates, collector freshness and open incidents.", tag: "Internal" },
      { when: "Weekly", title: "Operations review", text: "Ticket trends, SLA performance, change calendar and adoption actions.", tag: "Team + contractor" },
      { when: "Monthly", title: "Evaluation pack", text: "Consolidated KPI results, exceptions and improvement actions.", tag: "Steering / B/Ds" },
      { when: "Quarterly", title: "Adoption & roadmap review", text: "Benefit realised, pipeline status and research-informed priorities.", tag: "All parties" }
    ],

    /* ---------- Lifecycle ---------- */
    lifecycle: [
      { icon: "i-cpu", num: "01", title: "Design", text: "Requirements, reference architecture, data and integration design." },
      { icon: "i-git", num: "02", title: "Implementation", text: "Build coordination, configuration and tenant onboarding." },
      { icon: "i-clipboard", num: "03", title: "Testing", text: "SIT, UAT, performance, security and accessibility gates." },
      { icon: "i-refresh", num: "04", title: "Maintenance", text: "Patching, tuning, defect management and model upkeep." },
      { icon: "i-shield", num: "05", title: "Administration", text: "Access, content approval, records and service governance." }
    ],
    stages: [
      { title: "Design", text: "Translate B/D needs and policy constraints into a solution that fits the shared platform.", activities: "Requirements workshops, use-case definition, data classification, integration mapping and threat modelling.", artefacts: ["Solution design", "Requirements traceability", "Data flow diagram", "PIA screening"], exit: "Design approved by internal teams and consulting team; no unresolved high-risk gaps." },
      { title: "Implementation", text: "Coordinate build and configuration with contractors while protecting shared-service standards.", activities: "Sprint coordination, tenant configuration, knowledge corpus preparation, connector setup, environment promotion.", artefacts: ["Build & config record", "Environment checklist", "Interface specification"], exit: "Feature-complete build deployed to the test environment with a passing smoke test." },
      { title: "Testing", text: "Verify function, quality, resilience and compliance before any production change.", activities: "SIT, regression, UAT with B/D users, performance/load, security and accessibility testing.", artefacts: ["Test plan & cases", "UAT sign-off", "Defect log", "Evaluation report"], exit: "All critical defects closed; UAT signed off; performance and security gates passed." },
      { title: "Maintenance", text: "Keep services stable and models effective through their operating life.", activities: "Patch management, monitoring, incident resolution, model drift review, knowledge refresh, capacity planning.", artefacts: ["Maintenance log", "Incident records", "Model evaluation", "Capacity report"], exit: "No overdue critical patches; SLA met; evaluation results within tolerance." },
      { title: "Administration", text: "Operate the controls that keep a multi-B/D service accountable and auditable.", activities: "Role and entitlement administration, content approval, change control, records management, reporting.", artefacts: ["Access register", "Change record", "Document register", "Service report"], exit: "Entitlements reviewed, documents current, changes traceable and reports issued on time." }
    ],
    gates: [
      ["Unit / component", "Individual functions, prompts and connectors", "Code complete", "Contractor", "Pass / fail"],
      ["System integration (SIT)", "End-to-end flow across shared foundation", "Unit gate passed", "Contractor + CSSA", "Test report"],
      ["User acceptance (UAT)", "B/D scenarios, language and accessibility", "SIT passed", "B/D + CSSA", "Sign-off"],
      ["Performance & load", "Peak concurrency, response time, ingestion lag", "Stable test build", "Contractor", "Benchmark report"],
      ["Security & privacy", "Access control, logging, data handling", "PIA complete", "Security team", "Clearance"],
      ["Regression", "Existing tenants and shared components", "Release candidate", "CSSA", "No critical regression"],
      ["Operational readiness", "Runbook, monitoring, rollback, support rota", "All gates passed", "CSSA + supervisor", "Go / no-go"]
    ],
    changeList: [
      "Every change is logged with rationale, affected tenants, risk and rollback plan.",
      "Contractor change requests are reviewed against platform standards before scheduling.",
      "Regression baselines are maintained for both platforms and the shared foundation.",
      "Change Advisory Board approval is required for production releases affecting multiple B/Ds.",
      "B/Ds receive advance notice of changes affecting their tenant or reporting.",
      "Post-release verification and a short outcome note are filed in the document registry."
    ],
    raci: [
      ["Requirements & design", "C", "R", "C", "A"],
      ["Build & configuration", "C", "A/R", "C", "I"],
      ["Test execution & UAT", "A/R", "C", "C", "R"],
      ["Production release", "A", "R", "I", "C"],
      ["Incident response", "A/R", "R", "I", "C"],
      ["Performance reporting", "R", "C", "C", "A"]
    ],

    /* ---------- Stakeholders & vendors ---------- */
    stakeholders: [
      { icon: "i-briefcase", title: "Contractors", text: "Delivery and maintenance partners responsible for build, defects, enhancements and agreed service levels.", items: ["Delivery milestones", "Defect & change pipeline", "SLA performance", "Resource and competence"] },
      { icon: "i-users", title: "Internal teams", text: "Platform operations, security, infrastructure, data governance and supervisory colleagues.", items: ["Architecture decisions", "Security clearance", "Environment & capacity", "Escalation and approvals"] },
      { icon: "i-book", title: "Consulting teams", text: "Advisory partners contributing analysis, evaluation methodology and independent assurance.", items: ["Market analysis", "Evaluation method", "Independent review", "Good-practice guidance"] },
      { icon: "i-building", title: "Other B/Ds", text: "Adopting departments and prospective users of the centralised platforms.", items: ["Use-case requirements", "UAT participation", "Content ownership", "Feedback and benefit tracking"] }
    ],
    infoGroups: [
      { title: "Inputs", icon: "i-download", cls: "", items: ["B/D requirements & feedback", "Contractor delivery status", "Market & Gen AI research", "Incidents and service metrics"] },
      { title: "CSSA coordination hub", icon: "i-target", cls: "centre", items: ["Single consolidated status", "Decision & action log", "Risk and dependency register", "Change and release calendar"] },
      { title: "Outputs", icon: "i-arrow-up-right", cls: "", items: ["Steering & evaluation packs", "Adoption briefings", "Prioritised change requests", "Updated documentation"] }
    ],
    vendors: [
      ["Core platform contractor", "Chatbot-as-a-Service build, maintenance & L3 support", "T26/CB/2025-01", "99.5% availability · P1 ≤ 30 min", "Monthly", "Active"],
      ["Analytics contractor", "Social Media Text Analytics operation & model upkeep", "T26/SM/2025-02", "Ingestion ≤ 5 min · quality ≥ 85%", "Monthly", "Active"],
      ["Consulting partner", "Independent evaluation methodology & assurance", "T26/CS/2026-01", "Deliverable acceptance", "Quarterly", "Active"],
      ["Cloud & infrastructure provider", "Hosting, networking, backup and DR services", "GOV/INF/2024-08", "99.9% infra SLA", "Quarterly", "Active"],
      ["Security assessment vendor", "Annual security testing and remediation verification", "T26/SEC/2026-03", "Report within 10 working days", "Annual", "In progress"],
      ["Content & language services", "Corpus preparation and multilingual review support", "T26/CT/2026-02", "5-day turnaround per batch", "Monthly", "Active"]
    ],
    coordination: [
      { when: "Daily", title: "Standing operational touchpoint", text: "Open incidents, blockers, planned changes and urgent deployment needs.", tag: "Internal + contractor" },
      { when: "Weekly", title: "Delivery & support review", text: "Progress, defects, SLA, tickets and adoption actions with named owners.", tag: "CSSA + contractors" },
      { when: "Bi-weekly", title: "Adoption working session", text: "Prospective B/Ds, onboarding steps, UAT planning and training.", tag: "CSSA + B/Ds" },
      { when: "Monthly", title: "Contractor performance review", text: "KPI scorecard, invoice milestones, risks and corrective actions.", tag: "Vendor management" },
      { when: "Quarterly", title: "Steering & research readout", text: "Platform performance, roadmap direction and Gen AI market findings.", tag: "All parties" }
    ],
    vendorControls: [
      "Maintain one authoritative contract, scope and SLA register with review dates.",
      "Record every deliverable acceptance against agreed criteria, not informal approval.",
      "Track KPI evidence monthly and raise corrective actions before review meetings.",
      "Keep a single issue, risk and dependency log shared with the contractor.",
      "Control change requests through impact assessment and written approval.",
      "Retain meeting minutes, decisions and correspondence in the document registry."
    ],

    /* ---------- Research ---------- */
    researchCats: ["All", "Gen AI", "Data Analytics", "Governance", "Market"],
    research: [
      { id: "RES-2026-08", cat: "Gen AI", title: "Retrieval-augmented generation for government knowledge services", finding: "Grounded retrieval with citation display materially improves answer traceability for public-facing assistants, but quality depends on corpus hygiene and a maintained approval workflow.", implication: "Prioritise corpus governance and citation display in the Chatbot-as-a-Service roadmap before expanding generative features.", date: "Oct 2026", maturity: "Adopt" },
      { id: "RES-2026-07", cat: "Gen AI", title: "Guardrails, hallucination control and human review", finding: "Layered guardrails plus sampled human review remain necessary for public-sector deployments; fully autonomous answers carry unacceptable reputational risk.", implication: "Define mandatory human review points and confidence thresholds for any Gen AI output shown to the public.", date: "Sep 2026", maturity: "Adopt" },
      { id: "RES-2026-06", cat: "Data Analytics", title: "Multilingual sentiment models for Traditional Chinese", finding: "General-purpose models underperform on local code-mixed text; domain-adapted re-training improves agreement by a meaningful margin.", implication: "Schedule a topic and sentiment model refresh with a local-language validation set.", date: "Sep 2026", maturity: "Trial" },
      { id: "RES-2026-05", cat: "Governance", title: "Gen AI assurance and accountability frameworks", finding: "Emerging frameworks converge on impact assessment, model inventory, logging, evaluation records and clear human accountability.", implication: "Extend the shared control matrix with a model inventory and evaluation record requirement.", date: "Aug 2026", maturity: "Adopt" },
      { id: "RES-2026-04", cat: "Market", title: "Centralised vs departmental AI platform models", finding: "Shared platforms reduce duplicated procurement and assurance effort, but require strong tenant isolation and responsive support to sustain departmental confidence.", implication: "Keep adoption briefings focused on time-to-value, isolation guarantees and the support model.", date: "Jul 2026", maturity: "Adopt" },
      { id: "RES-2026-03", cat: "Gen AI", title: "Agentic workflows in public service delivery", finding: "Multi-agent orchestration shows promise for complex multi-step enquiries, with cost, latency and controllability still maturing.", implication: "Maintain at assessment stage; run a bounded evaluation before any production commitment.", date: "Jun 2026", maturity: "Assess" },
      { id: "RES-2026-02", cat: "Data Analytics", title: "Cross-signal insight: enquiries and public text", finding: "Correlating chatbot enquiry volumes with social media themes can give earlier warning of emerging public concerns.", implication: "Explore a joint insight layer once both platforms have stable, comparable metrics.", date: "May 2026", maturity: "Assess" },
      { id: "RES-2026-01", cat: "Governance", title: "Privacy and retention for public social text", finding: "Retention minimisation, PII screening and purpose limitation should be designed into ingestion rather than applied later.", implication: "Re-confirm the ingestion pipeline screening steps and retention schedule in the next review.", date: "Apr 2026", maturity: "Adopt" }
    ],
    radar: [
      { title: "Retrieval-augmented generation", text: "Grounded answers with citations", ring: "Adopt", cls: "pill-green" },
      { title: "Model guardrails & evaluation", text: "Confidence thresholds, human review", ring: "Adopt", cls: "pill-green" },
      { title: "Domain-adapted sentiment models", text: "Local language validation sets", ring: "Trial", cls: "pill-blue" },
      { title: "Narrative theme summarisation", text: "Gen AI summaries, human reviewed", ring: "Trial", cls: "pill-blue" },
      { title: "Agentic workflow orchestration", text: "Multi-step autonomous handling", ring: "Assess", cls: "pill-violet" },
      { title: "Fully autonomous public answers", text: "No human oversight", ring: "Hold", cls: "pill-amber" }
    ],
    researchSteps: [
      { title: "Frame the question", text: "Agree the decision the research must support and the scope of the subject area." },
      { title: "Gather evidence", text: "Review vendor material, public-sector references, standards, evaluations and internal telemetry." },
      { title: "Assess & compare", text: "Compare options on maturity, risk, cost, effort and fit with government requirements." },
      { title: "State a position", text: "Record a clear recommendation with caveats and an indicative adoption ring." },
      { title: "File & review", text: "Version the brief in the registry, brief stakeholders and set a review date." }
    ],

    /* ---------- Documents ---------- */
    docCats: ["All", "Governance", "Technical", "Operations", "Adoption", "Meeting"],
    docs: [
      { ref: "T26-GOV-001", title: "Project governance & role charter", category: "Governance", format: "Electronic", version: "v2.1", owner: "Project lead", updated: "2026-10-28", status: "Current" },
      { ref: "T26-GOV-002", title: "Platform service catalogue", category: "Governance", format: "Electronic", version: "v3.0", owner: "CSSA", updated: "2026-11-03", status: "Current" },
      { ref: "T26-GOV-003", title: "Data classification & handling standard", category: "Governance", format: "Electronic", version: "v1.4", owner: "Data governance", updated: "2026-09-19", status: "Review due" },
      { ref: "T26-TEC-001", title: "Chatbot-as-a-Service solution design", category: "Technical", format: "Electronic", version: "v3.4", owner: "Contractor", updated: "2026-11-01", status: "Current" },
      { ref: "T26-TEC-002", title: "SMTA data pipeline specification", category: "Technical", format: "Electronic", version: "v2.7", owner: "Contractor", updated: "2026-10-22", status: "Current" },
      { ref: "T26-TEC-003", title: "Interface & integration register", category: "Technical", format: "Electronic", version: "v2.2", owner: "CSSA", updated: "2026-10-11", status: "Current" },
      { ref: "T26-TEC-004", title: "UAT test plan and case library", category: "Technical", format: "Electronic", version: "v3.4", owner: "CSSA", updated: "2026-11-04", status: "Current" },
      { ref: "T26-OPS-001", title: "System administration manual", category: "Operations", format: "Electronic", version: "v2.6", owner: "CSSA", updated: "2026-10-30", status: "Current" },
      { ref: "T26-OPS-002", title: "Incident response & escalation playbook", category: "Operations", format: "Electronic", version: "v2.0", owner: "CSSA", updated: "2026-10-17", status: "Current" },
      { ref: "T26-OPS-003", title: "On-call roster & emergency contact sheet", category: "Operations", format: "Both", version: "v1.9", owner: "CSSA", updated: "2026-11-05", status: "Current" },
      { ref: "T26-OPS-004", title: "Signed UAT acceptance certificates", category: "Operations", format: "Physical", version: "—", owner: "Project lead", updated: "2026-10-08", status: "Archived" },
      { ref: "T26-OPS-005", title: "Original contract & SLA counterparts", category: "Operations", format: "Physical", version: "—", owner: "Admin team", updated: "2026-08-14", status: "Archived" },
      { ref: "T26-ADO-001", title: "B/D adoption register", category: "Adoption", format: "Electronic", version: "v4.1", owner: "CSSA", updated: "2026-11-05", status: "Current" },
      { ref: "T26-ADO-002", title: "Departmental user guide & FAQ", category: "Adoption", format: "Electronic", version: "v2.3", owner: "CSSA", updated: "2026-10-24", status: "Review due" },
      { ref: "T26-ADO-003", title: "Training attendance & feedback records", category: "Adoption", format: "Both", version: "v1.5", owner: "Support lead", updated: "2026-09-30", status: "Current" },
      { ref: "T26-MIN-001", title: "Weekly operations meeting minutes", category: "Meeting", format: "Electronic", version: "v1.0", owner: "CSSA", updated: "2026-11-04", status: "Current" },
      { ref: "T26-MIN-002", title: "Monthly contractor review minutes", category: "Meeting", format: "Electronic", version: "v1.0", owner: "CSSA", updated: "2026-10-31", status: "Current" },
      { ref: "T26-MIN-003", title: "Quarterly steering committee papers", category: "Meeting", format: "Both", version: "v1.0", owner: "Project lead", updated: "2026-09-28", status: "Review due" },
      { ref: "T26-EVL-001", title: "Monthly platform evaluation pack", category: "Governance", format: "Electronic", version: "v11", owner: "CSSA", updated: "2026-11-02", status: "Current" },
      { ref: "T26-RES-001", title: "Gen AI market research briefs", category: "Governance", format: "Electronic", version: "v8", owner: "CSSA", updated: "2026-10-19", status: "Current" },
      { ref: "T26-SEC-001", title: "Security assessment reports", category: "Technical", format: "Physical", version: "—", owner: "Security team", updated: "2026-07-22", status: "Restricted" },
      { ref: "T26-CHG-001", title: "Change request & approval log", category: "Operations", format: "Both", version: "v3.2", owner: "Release manager", updated: "2026-11-01", status: "Current" },
      { ref: "T26-PHY-001", title: "Physical file index & location register", category: "Operations", format: "Physical", version: "v1.3", owner: "Admin team", updated: "2026-10-29", status: "Current" },
      { ref: "T26-FIN-001", title: "Signed deliverable acceptance forms", category: "Meeting", format: "Physical", version: "—", owner: "Project lead", updated: "2026-08-30", status: "Archived" }
    ],
    filingRules: [
      "One authoritative location per record: the electronic repository holds the master copy; physical files are referenced by the same ID.",
      "Version numbers increment on every approved change; superseded versions are retained read-only for the agreed retention period.",
      "Owner, last-updated date and review status are mandatory fields in the register.",
      "Restricted and physical-only records are listed with location and access rules, not their contents.",
      "A monthly currency check flags stale records before they are relied on by team members."
    ],
    physical: [
      { icon: "i-archive", title: "Indexed locations", text: "Cabinet, folder and box references recorded against each physical file ID." },
      { icon: "i-lock", title: "Access control", text: "Restricted documents held in controlled storage with a sign-out log." },
      { icon: "i-refresh", title: "Reconciliation", text: "Monthly check that physical holdings match the electronic register." },
      { icon: "i-calendar", title: "Retention & disposal", text: "Retention schedule applied with documented approval for disposal." }
    ],

    /* ---------- Operations ---------- */
    severity: [
      ["P1 · Critical", "Platform unavailable, data exposure risk, or all B/D tenants affected", "15 min", "2 hours", "Supervisor + contractor L3", "pill-red"],
      ["P2 · Major", "Core function degraded, multiple B/Ds or a key reporting window affected", "30 min", "1 business day", "On-call CSSA + contractor", "pill-amber"],
      ["P3 · Moderate", "Single-tenant issue with workaround available; non-critical defect", "4 hours", "3 business days", "Support lead", "pill-blue"],
      ["P4 · Low", "Query, guidance, cosmetic issue or scheduled administrative request", "1 business day", "5 business days", "First-line support", "pill-soft"]
    ],
    roster: [
      { week: "Wk 01", primary: "CSSA (Primary)", psub: "Technical & admin", secondary: "Platform ops lead", ssub: "Escalation", tag: "pill-green" },
      { week: "Wk 02", primary: "Support lead", psub: "Technical", secondary: "CSSA", ssub: "Escalation", tag: "pill-blue" },
      { week: "Wk 03", primary: "CSSA (Primary)", psub: "Technical & admin", secondary: "Infra on-call", ssub: "Escalation", tag: "pill-green" },
      { week: "Wk 04", primary: "Analytics lead", psub: "Platform", secondary: "CSSA", ssub: "Escalation", tag: "pill-blue" }
    ],
    incidentSteps: [
      { title: "Confirm & classify", text: "Verify the symptom, identify affected tenants and assign a P1–P4 severity against the matrix." },
      { title: "Mobilise", text: "Notify the on-call chain, open an incident record and establish a single communication channel." },
      { title: "Contain", text: "Apply the agreed workaround, roll back a recent change or isolate the affected component." },
      { title: "Coordinate", text: "Keep contractors, internal teams, consulting teams and affected B/Ds on the same factual update." },
      { title: "Restore & verify", text: "Recover service, confirm with synthetic checks and B/D validation, then close the incident." },
      { title: "Review & record", text: "Hold a post-incident review, log root cause and actions, and update runbooks and documentation." }
    ],
    runbook: [
      { text: "Confirm authorisation and change reference", sub: "Supervisor approval for urgent deployment" },
      { text: "Verify target environment and current version", sub: "No unreconciled changes outstanding" },
      { text: "Confirm backup / rollback point is valid", sub: "Configuration and knowledge corpus" },
      { text: "Run pre-deployment smoke and regression checks", sub: "Shared foundation and affected tenants" },
      { text: "Notify affected B/Ds and update status channel", sub: "Include expected window and contact" },
      { text: "Deploy with contractor and monitor telemetry", sub: "Error rate, latency, ingestion lag" },
      { text: "Perform post-deployment verification", sub: "Key journeys, dashboards, exports" },
      { text: "File change record, evidence and outcome note", sub: "Document registry within one working day" }
    ],
    events: [
      { icon: "i-calendar", title: "Policy address & major announcements", text: "Surge in public enquiries and social text volume; enhanced monitoring and standby cover.", time: "Annual · scheduled" },
      { icon: "i-zap", title: "Urgent service deployment", text: "Time-critical release outside the normal change window with shortened approval path.", time: "As required" },
      { icon: "i-alert", title: "Public incident / fire-fighting", text: "Rapid restoration coordination across contractors, internal teams and affected B/Ds.", time: "On demand" },
      { icon: "i-globe", title: "Large-scale public campaigns", text: "Anticipated spike in chatbot traffic and text analytics reporting demand.", time: "Campaign calendar" }
    ],
    escalation: [
      { icon: "i-lifebuoy", title: "First-line / on-call CSSA", text: "Triage, containment, factual status updates and administrative coordination.", tag: "0–15 min" },
      { icon: "i-users", title: "Internal platform lead", text: "Decision on workarounds, resource mobilisation and cross-team coordination.", tag: "15–30 min" },
      { icon: "i-briefcase", title: "Contractor L3 / vendor", text: "Deep technical diagnosis, fix development and vendor escalation under SLA.", tag: "≤ 30 min" },
      { icon: "i-shield", title: "Supervisor / steering", text: "Approval for major decisions, external communication and post-incident direction.", tag: "As required" }
    ],

    /* ---------- Assessment ---------- */
    assessReq: [
      { text: "Knowledge and experience in managing and supporting government systems or platforms", hint: "Evidence: government system support roles, service reports, change records" },
      { text: "Knowledge and experience in supporting AI-related projects", hint: "Evidence: chatbot, NLP, analytics or Gen AI project involvement" },
      { text: "Strong analytical and problem solving skills", hint: "Evidence: root-cause analyses, evaluation reports, complex incident handling" },
      { text: "Good communication and interpersonal skills", hint: "Evidence: cross-party coordination, briefings, stakeholder feedback" },
      { text: "Hard working and self-motivated with good working attitudes", hint: "Evidence: self-directed delivery, after-hours support, ownership of outcomes" },
      { text: "Able to work independently", hint: "Evidence: solo ownership of workstreams, minimal supervision examples" }
    ],
    assessSkills: [
      { text: "IT Application Development and Management", hint: "Technical · minimum 3 years" },
      { text: "System Implementation and Maintenance / Support", hint: "Technical · minimum 3 years" },
      { text: "Management and Support of Gov't Systems & Services", hint: "Non-technical · minimum 3 years" },
      { text: "Vendor Management", hint: "Non-technical · minimum 3 years" }
    ],
    evidence: [
      "Project records with dates, scope and your specific responsibilities.",
      "System support logs, incident reports and change approvals showing hands-on work.",
      "Vendor meeting minutes, SLA scorecards and contract review evidence.",
      "Evaluation packs, dashboards or research briefs you authored.",
      "References or appraisals confirming independent working and communication."
    ]
  };

  window.DATA = DATA;
})();
