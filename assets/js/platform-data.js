/* ================================================================
   T26 Platform · operational seed data & analysis models
   Loaded after data.js, before app.js
   ================================================================ */
(function () {
  "use strict";
  const D = window.DATA;

  /* ---- Service desk / incident records ---- */
  D.tickets = [
    { id: "INC-1042", subject: "Knowledge answers stale after policy update", bd: "Immigration Department", platform: "Chatbot", priority: "P1 · Critical", status: "In progress", assignee: "CSSA", category: "Content & knowledge", created: "2026-11-06T08:12", slaHours: 2, channel: "B/D portal", notes: "Corpus refresh requested; contractor engaged." },
    { id: "INC-1041", subject: "Sentiment dashboard export returns empty CSV", bd: "Information Services Department", platform: "SMTA", priority: "P2 · Major", status: "Open", assignee: "Analytics lead", category: "Data & reporting", created: "2026-11-06T09:35", slaHours: 24, channel: "Email", notes: "Awaiting reproduction in UAT." },
    { id: "INC-1040", subject: "Tenant administrator cannot approve corpus changes", bd: "Transport Department", platform: "Chatbot", priority: "P2 · Major", status: "In progress", assignee: "Support lead", category: "Configuration & access", created: "2026-11-05T14:20", slaHours: 24, channel: "Help desk", notes: "Role mapping under review." },
    { id: "INC-1039", subject: "Webhook retries causing duplicate conversations", bd: "Housing Department", platform: "Chatbot", priority: "P3 · Moderate", status: "Pending B/D", assignee: "CSSA", category: "Integration", created: "2026-11-05T10:05", slaHours: 72, channel: "B/D portal", notes: "B/D to confirm idempotency key format." },
    { id: "INC-1038", subject: "Collector lag above target during morning peak", bd: "Department of Health", platform: "SMTA", priority: "P2 · Major", status: "Resolved", assignee: "Analytics contractor", category: "Performance", created: "2026-11-04T07:48", slaHours: 24, channel: "Monitoring", notes: "Rate limit raised; lag back to 4.1 min." },
    { id: "INC-1037", subject: "Traditional Chinese fallback responses incorrect", bd: "Education Bureau", platform: "Chatbot", priority: "P3 · Moderate", status: "In progress", assignee: "CSSA", category: "Content & knowledge", created: "2026-11-04T11:30", slaHours: 72, channel: "Help desk", notes: "Language review batch scheduled." },
    { id: "INC-1036", subject: "New dashboard widget request for campaign monitoring", bd: "Environmental Protection Department", platform: "SMTA", priority: "P4 · Low", status: "Open", assignee: "Analytics lead", category: "Data & reporting", created: "2026-11-03T16:02", slaHours: 120, channel: "Email", notes: "Change request to be assessed." },
    { id: "INC-1035", subject: "SSO session expiry too short for departmental users", bd: "Inland Revenue Department", platform: "Both", priority: "P3 · Moderate", status: "Resolved", assignee: "Platform team", category: "Configuration & access", created: "2026-11-02T09:15", slaHours: 72, channel: "B/D portal", notes: "Session policy updated; B/D notified." },
    { id: "INC-1034", subject: "Topic model drifting on mixed-language posts", bd: "Food and Environmental Hygiene Department", platform: "SMTA", priority: "P2 · Major", status: "In progress", assignee: "Analytics contractor", category: "Data & reporting", created: "2026-11-01T13:40", slaHours: 24, channel: "Monitoring", notes: "Re-training validation in progress." },
    { id: "INC-1033", subject: "Onboarding checklist link broken in user guide", bd: "Leisure and Cultural Services Department", platform: "Chatbot", priority: "P4 · Low", status: "Resolved", assignee: "CSSA", category: "Content & knowledge", created: "2026-10-30T10:22", slaHours: 120, channel: "Help desk", notes: "Guide republished as v2.3." },
    { id: "INC-1032", subject: "Urgent deployment window requested for policy address", bd: "Digital Policy Office", platform: "Both", priority: "P2 · Major", status: "Pending B/D", assignee: "CSSA", category: "Change & release", created: "2026-10-29T15:10", slaHours: 24, channel: "Email", notes: "CAB approval pending supervisor sign-off." },
    { id: "INC-1031", subject: "Audit log export missing administrative events", bd: "Census and Statistics Department", platform: "Both", priority: "P3 · Moderate", status: "Resolved", assignee: "Platform team", category: "Integration", created: "2026-10-28T08:55", slaHours: 72, channel: "B/D portal", notes: "Log pipeline corrected and backfilled." }
  ];

  /* ---- Chatbot-as-a-Service knowledge base ---- */
  D.kb = [
    { id: "KB-001", intent: "Visa application status", tenant: "IMMD", patterns: ["visa", "status", "application progress", "簽證", "進度"], answer: "You can check visa application progress through the department's online enquiry service using your application reference number. Processing times vary by application type; the current indicative timeframe is published on the departmental service page.", source: "IMMD Service Guide v4.2 · §3.1", version: "v2.1", updated: "2026-10-28" },
    { id: "KB-002", intent: "Tax filing deadline", tenant: "IRD", patterns: ["tax", "filing", "deadline", "return", "報稅", "限期"], answer: "The filing deadline for individuals is normally 2 months from the date of issue of the tax return. Electronic filing may qualify for an extension. Please refer to the department's current notice for the exact dates of this year of assessment.", source: "IRD Tax Return Notes v6.0 · §2", version: "v3.0", updated: "2026-10-14" },
    { id: "KB-003", intent: "Licence renewal", tenant: "TD", patterns: ["licence", "license", "renew", "renewal", "vehicle", "牌照", "續牌"], answer: "Driving licence renewal can be submitted online, by post or at a licensing office. You will need your identity document, current licence and a recent photograph. Renewal may be made up to four months before expiry.", source: "TD Licensing FAQ v2.8 · §5", version: "v1.7", updated: "2026-09-30" },
    { id: "KB-004", intent: "Housing application", tenant: "HD", patterns: ["housing", "application", "estate", "flat", "公屋", "申請"], answer: "Applications for public rental housing are accepted during open application periods. Eligibility, waiting time information and the online application form are available on the department's housing application page.", source: "HD Application Guide v5.1 · §1", version: "v2.2", updated: "2026-10-02" },
    { id: "KB-005", intent: "Facility booking", tenant: "LCSD", patterns: ["facility", "booking", "book", "venue", "court", "場地", "預訂"], answer: "Sports and leisure facilities can be booked through the online booking system up to the advance booking limit for the facility type. A confirmed booking reference is required on arrival.", source: "LCSD Booking Terms v3.3 · §4", version: "v1.4", updated: "2026-09-18" },
    { id: "KB-006", intent: "School admission", tenant: "EDB", patterns: ["school", "admission", "enrol", "enrolment", "入學", "學位"], answer: "Primary and secondary school admission arrangements are published annually by the bureau. Key dates, application forms and school net information are available on the admission portal.", source: "EDB Admission Circular 2026 · §2", version: "v1.9", updated: "2026-08-27" },
    { id: "KB-007", intent: "Recycling and waste", tenant: "EPD", patterns: ["recycling", "waste", "recycle", "bin", "回收", "廢物"], answer: "Recyclable materials should be placed in the designated collection points. The department publishes a locator for recycling facilities and guidance on sorting common materials.", source: "EPD Recycling Guide v2.0 · §1", version: "v1.2", updated: "2026-09-05" },
    { id: "KB-008", intent: "Assistance schemes", tenant: "SWD", patterns: ["benefit", "assistance", "subsidy", "allowance", "援助", "津貼"], answer: "Information on financial assistance schemes, eligibility and application channels is published by the department. Applicants should use the scheme-specific application form and provide the required supporting documents.", source: "SWD Scheme Handbook v4.4 · §6", version: "v2.0", updated: "2026-10-21" },
    { id: "KB-009", intent: "General enquiry", tenant: "All", patterns: ["hello", "hi", "help", "service", "contact", "你好", "查詢"], answer: "Hello. I am the departmental virtual assistant. I can answer questions about departmental services, application procedures and published guidance. Please describe what you need help with.", source: "CBaaS Standard Dialogue v3.4", version: "v1.0", updated: "2026-11-01" }
  ];

  D.chatSamples = [
    "How do I check my visa application status?",
    "When is the tax filing deadline?",
    "How can I renew my driving licence?",
    "Where can I book a sports facility?",
    "What recycling guidance is available?",
    "Tell me about financial assistance schemes"
  ];

  /* ---- Social Media Text Analytics workbench ---- */
  D.socialSamples = [
    { label: "Positive service feedback", text: "The new online appointment system is fast and convenient. Staff at the counter were helpful and the whole process was smooth. 網上預約好方便，職員服務態度很好。" },
    { label: "Negative queue complaint", text: "Waited over an hour at the counter and the hotline was not answering. The website kept showing an error. Very frustrating and the service is too slow. 輪候時間太長，熱線無人接聽，網站不停出現錯誤。" },
    { label: "Mixed policy comment", text: "The new subsidy policy is useful but the application form is confusing and the fee is not clearly explained. 新資助政策有用，但申請表格混亂，收費說明不清楚。" },
    { label: "Facilities report", text: "The park facilities are clean and well maintained, however the booking app crashed during login this morning. 公園設施清潔，但預約程式今早登入時當機。" }
  ];

  D.corpusSeed = [
    { id: "TXT-2021", text: "The new online appointment system is fast and convenient. Staff were helpful and the process was smooth.", source: "Public post · monitored channel", at: "2026-11-06T08:14" },
    { id: "TXT-2020", text: "Waited over an hour at the counter and the hotline was not answering. Very frustrating service.", source: "Public post · monitored channel", at: "2026-11-06T08:02" },
    { id: "TXT-2019", text: "網上預約好方便，職員服務態度很好，程序清楚。", source: "Public post · monitored channel", at: "2026-11-06T07:48" },
    { id: "TXT-2018", text: "The subsidy application form is confusing and the fee is not clear.", source: "Public post · monitored channel", at: "2026-11-06T07:31" },
    { id: "TXT-2017", text: "The park facilities are clean and well maintained this week.", source: "Public post · monitored channel", at: "2026-11-05T18:22" },
    { id: "TXT-2016", text: "Booking app crashed during login again. This is the third failed attempt.", source: "Public post · monitored channel", at: "2026-11-05T17:55" },
    { id: "TXT-2015", text: "輪候時間太長，熱線無人接聽，網站不停出現錯誤，非常不滿。", source: "Public post · monitored channel", at: "2026-11-05T16:40" },
    { id: "TXT-2014", text: "Clear guidance on the new policy, thanks to the departmental team.", source: "Public post · monitored channel", at: "2026-11-05T15:12" },
    { id: "TXT-2013", text: "The chatbot answered my question about licence renewal immediately. Very useful.", source: "Public post · monitored channel", at: "2026-11-05T14:03" },
    { id: "TXT-2012", text: "Counter opening hours are difficult for working families and the queue is slow.", source: "Public post · monitored channel", at: "2026-11-05T11:26" }
  ];

  D.lexicon = {
    positive: ["good", "great", "helpful", "fast", "efficient", "clear", "convenient", "satisfied", "improved", "smooth", "useful", "excellent", "thanks", "appreciate", "well", "immediately", "clean", "maintained", "easy", "方便", "快捷", "好用", "清楚", "滿意", "讚", "改善", "有效率", "支持", "很好", "即時"],
    negative: ["slow", "broken", "error", "confusing", "difficult", "delay", "failed", "poor", "complaint", "useless", "frustrating", "wait", "waited", "crashed", "crash", "unclear", "again", "long", "慢", "錯誤", "混亂", "困難", "延誤", "失敗", "差", "投訴", "無用", "不滿", "當機", "太長", "無人接聽"],
    negation: ["not", "no", "never", "dont", "doesnt", "isnt", "cannot", "wont", "hardly", "不", "沒", "無", "未"],
    intensifier: ["very", "extremely", "really", "too", "over", "非常", "很", "太"]
  };

  D.topicRules = [
    { topic: "Digital channels", keywords: ["app", "website", "online", "portal", "chatbot", "login", "booking", "system", "網上", "程式", "網站", "登入", "平台", "預約", "預約系統"] },
    { topic: "Service accessibility", keywords: ["queue", "wait", "waited", "hotline", "counter", "opening", "appointment", "hour", "輪候", "排隊", "熱線", "櫃位", "時間", "辦公時間"] },
    { topic: "Policy & fees", keywords: ["fee", "charge", "policy", "subsidy", "allowance", "price", "form", "收費", "費用", "政策", "資助", "津貼", "表格"] },
    { topic: "Staff & service quality", keywords: ["staff", "service", "officer", "attitude", "helpful", "rude", "team", "職員", "服務", "態度", "人員"] },
    { topic: "Facilities & environment", keywords: ["facility", "facilities", "toilet", "clean", "park", "venue", "maintained", "設施", "清潔", "場地", "公園"] }
  ];

  /* ---- Seed audit trail & notifications ---- */
  D.activitySeed = [
    { id: "ACT-0006", at: "2026-11-06T09:40:00", type: "Release", title: "UAT cycle completed for Chatbot-as-a-Service v3.4", desc: "Regression, accessibility and intent-accuracy gates passed; release approved for staged deployment.", tone: "" },
    { id: "ACT-0005", at: "2026-11-05T16:20:00", type: "Adoption", title: "Adoption briefing held with two prospective B/Ds", desc: "Discovery sessions covered platform capabilities, onboarding effort and support arrangements.", tone: "teal" },
    { id: "ACT-0004", at: "2026-11-03T11:05:00", type: "Evaluation", title: "Sentiment model evaluation report published", desc: "Sampled validation against human-labelled data; 86.7% agreement, drift within tolerance.", tone: "violet" },
    { id: "ACT-0003", at: "2026-11-02T14:30:00", type: "Vendor", title: "Contractor performance review completed", desc: "SLA attainment, open defects and change requests reviewed with the delivery contractor.", tone: "amber" },
    { id: "ACT-0002", at: "2026-10-30T09:10:00", type: "Operations", title: "After-hours cover confirmed for upcoming public event", desc: "Technical and administrative standby rosters issued; escalation contacts verified.", tone: "" },
    { id: "ACT-0001", at: "2026-10-28T15:45:00", type: "Records", title: "Document registry quarterly review", desc: "Version and ownership checks completed; three records marked for update.", tone: "teal" }
  ];

  D.notificationSeed = [
    { id: "NTF-0004", at: "2026-11-06T09:42:00", title: "P1 incident requires acknowledgement", body: "INC-1042 · Knowledge answers stale after policy update", tone: "red", view: "desk", read: false },
    { id: "NTF-0003", at: "2026-11-06T08:05:00", title: "Release v3.4 approved for staged deployment", body: "All quality gates passed; change window confirmed.", tone: "green", view: "lifecycle", read: false },
    { id: "NTF-0002", at: "2026-11-05T17:20:00", title: "Three documents due for review", body: "Document registry currency check flagged records for update.", tone: "amber", view: "documents", read: false },
    { id: "NTF-0001", at: "2026-11-04T10:00:00", title: "Monthly evaluation pack published", body: "Rolling 30-day platform results are available to B/Ds.", tone: "blue", view: "performance", read: true }
  ];
})();
