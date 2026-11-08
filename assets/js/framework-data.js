/* ================================================================
   T26 Platform · v3.0
   Compiled from: DPO_CSSA_AI_Platforms_Security_Framework.docx
   "IT Security Compliance & Operational Support Framework for
    Centralised Artificial Intelligence and Data Analytics Platforms"
   DPO-CSSA-SEC-2026 · Version 1.0 · October 2026

   All section text, tables, control lists, RACI, risk register,
   action plan and references are transcribed from the supplied
   document. Operational status/progress fields are workspace
   extensions and are marked as such.
   ================================================================ */
(function () {
  "use strict";
  const D = window.DATA;

  D.FW = {
    meta: {
      title: "IT Security Compliance & Operational Support Framework",
      subtitle: "for Centralised Artificial Intelligence and Data Analytics Platforms",
      department: "Digital Policy Office (DPO)",
      org: "Digital Policy Office · Information Security",
      position: "CSSA (T26) – Contract Systems Support Analyst",
      ref: "DPO-CSSA-SEC-2026",
      version: "Version 1.0",
      issued: "October 2026",
      period: "09 November 2026 – 29 January 2027",
      location: "Level 6, Cyberport 1",
      copyright: "© The Government of the Hong Kong Special Administrative Region of the People's Republic of China",
      policies: [
        "Baseline IT Security Policy [S17] v8.2",
        "IT Security Guidelines [G3] v10.1",
        "Practice Guide for SRAA [ISPG-SM01] v2.1"
      ]
    },

    toc: [
      ["1", "Executive Summary", "security"], ["2", "Purpose and Scope", "security"],
      ["3", "CSSA Role Overview and Responsibilities", "governance"],
      ["4", "Government IT Security Management Framework", "governance"],
      ["5", "Core Security Principles Applied to AI Platforms", "security"],
      ["6", "Security Risk Assessment Framework for AI Systems", "risk"],
      ["7", "Key Security Control Domains for Platform Operations", "controls"],
      ["8", "Operational Support Model and Coordination", "governance"],
      ["9", "Compliance, Audit and Continuous Improvement", "actionplan"],
      ["10", "Action Plan and Recommendations", "actionplan"],
      ["11", "References", "actionplan"],
      ["A", "Annex A – Responsibility Matrix (RACI)", "governance"],
      ["B", "Annex B – Sample Risk Register Template", "risk"]
    ],

    exec: {
      intro: [
        "This document establishes a comprehensive IT Security Compliance and Operational Support Framework for the Contract Systems Support Analyst (CSSA) position (T26) within the Digital Policy Office (DPO). The role is responsible for supporting and operating multiple centralised Artificial Intelligence (AI) and data analytics platforms, including Chatbot-as-a-Service and the Social Media Text Analytics System.",
        "The framework aligns the day-to-day responsibilities of the CSSA with the mandatory requirements of the Baseline IT Security Policy [S17] (Version 8.2, April 2025), the detailed implementation guidance in the IT Security Guidelines [G3] (Version 10.1, July 2024), and the structured methodology of the Practice Guide for Security Risk Assessment & Audit [ISPG-SM01] (Version 2.1, July 2024)."
      ],
      outcomes: [
        "Clear mapping of CSSA duties to the 14 mandatory security areas defined in S17.",
        "A practical security risk assessment approach tailored to AI and data analytics platforms.",
        "Defined operational controls covering access management, data protection, vendor coordination, change management and incident response.",
        "A continuous improvement cycle that supports adoption by Government bureaux and departments (B/Ds) while maintaining the required security posture."
      ],
      closing: "The CSSA is expected to act as a key operational interface between platform technical teams, contractors, internal DPO teams, consulting teams and adopting B/Ds, ensuring that security requirements are embedded throughout the platform lifecycle."
    },

    purpose: "This document provides the CSSA with a structured reference to fulfil the security-related aspects of the role while supporting the design, implementation, testing, maintenance and administration of centralised AI applications and data analytics platforms. It ensures that all activities remain compliant with Government IT security requirements and facilitate secure adoption by B/Ds.",
    scope: [
      "Support for design, implementation, testing, maintenance and administration of Chatbot-as-a-Service and Social Media Text Analytics System.",
      "Promotion, arrangement of adoption, and provision of technical and user support to Government B/Ds.",
      "Coordination with contractors, internal teams, consulting teams and other B/Ds.",
      "Market research and analysis of Generative AI and data analytics developments.",
      "Maintenance of electronic and physical documentation.",
      "Provision of after-hours technical and administrative support for special events, fire-fighting and urgent deployments."
    ],
    scopeNote: "The security controls address the 14 mandatory areas specified in S17 Section 2.1, adapted to the AI platform context.",

    positionProfile: [
      ["Position Title", "Contract Systems Support Analyst (CSSA) – T26"],
      ["Department", "Digital Policy Office (DPO)"],
      ["Engagement Period", "09 November 2026 – 29 January 2027"],
      ["Location", "Level 6, Cyberport 1"],
      ["Experience Required", "6 years post-qualification IT experience; 2 years in similar capacity"],
      ["Technical Skills", "IT Application Development & Management (≥3 yrs); System Implementation & Maintenance/Support (≥3 yrs)"],
      ["Non-Technical Skills", "Management & Support of Gov't Systems & Services (≥3 yrs); Vendor Management (≥3 yrs)"]
    ],

    responsibilityMap: [
      ["Platform design, implementation, testing, maintenance & administration", "System Acquisition, Development & Maintenance (S16); Operations Security (S14)", "Security-by-design, secure configuration, change control, vulnerability management"],
      ["Promote adoption & provide technical/user support to B/Ds", "Human Resource Security (S9); Access Control (S11)", "User awareness, least privilege, secure onboarding of B/D users"],
      ["Coordinate with contractors, internal & consulting teams", "Outsourcing Security (S17); Management Responsibilities (S7)", "Vendor security clauses, information flow control, segregation of duties"],
      ["Market research on GenAI & data analytics", "IT Security Threat Management (S14.7)", "Threat intelligence gathering, emerging risk identification"],
      ["Maintain electronic & physical files", "Asset Management (S10); Information Classification", "Proper classification, secure storage, access control to documentation"],
      ["After-hours support for urgent events", "Security Incident Management (S18); Business Continuity (S19)", "Incident response readiness, resilience, recovery procedures"]
    ],

    centralBodies: [
      ["ISMC", "Information Security Management Committee", "Oversees Government-wide IT security policy."],
      ["ITSWG", "IT Security Working Group", "Executive arm for promulgation and compliance monitoring."],
      ["GIRO", "Government Information Security Incident Response Office", "Central coordination of security incidents."],
      ["GovCERT.HK", "Government Computer Emergency Response Team", "Disseminates security alerts and acts as bridge to the CERT community."],
      ["B/Ds", "Bureaux / Departments", "Responsible for security of their own information assets and systems."]
    ],
    centralNote: "In accordance with S17 Section 5 and G3 Section 5, the Government maintains a structured Information Security Management Framework. The CSSA operates within the DPO organisational structure and must understand the interfaces with central and departmental bodies.",

    dpoRoles: [
      ["Departmental IT Security Officer (DITSO)", "Senior management accountable for overall IT security."],
      ["IT Security Management Unit", "Supports DITSO in strategy, policy and monitoring."],
      ["IT Security Administrators", "Day-to-day security administration, logging, vulnerability management."],
      ["LAN / System Administrators", "Operational configuration of platforms."],
      ["Application Development & Maintenance Team", "Secure development practices."],
      ["Information Owners", "Determine classification and authorised usage of platform data."],
      ["Users (including B/D adopters)", "Accountable for their own activities on the platforms."]
    ],
    orgFigure: "Figure 1 – CSSA Position within the Government IT Security Organisation Structure. Policy, guidance, alerts and coordination flow from the central level (ISMC / ITSWG / GIRO / GovCERT.HK) to DPO Senior Management and the DITSO / IT Security Management Unit, then to the CSSA, who coordinates laterally with System Admins, the App Dev Team, Contractors and B/D Users.",

    principles: [
      { id: "C", name: "Confidentiality", text: "Only authorised persons and systems may access platform data (including training data, user queries, analytics outputs and model parameters). The CSSA shall ensure that data classification is applied, access is restricted on a need-to-know basis, and encryption is used for data at rest and in transit where required by classification level.", color: "var(--brand-2)" },
      { id: "I", name: "Integrity", text: "Platform configurations, models, logs and analytic results must be protected against unauthorised modification. Change management procedures, configuration baselines, and integrity monitoring (e.g., file integrity checking of model files) are essential.", color: "var(--accent)" },
      { id: "A", name: "Availability", text: "The Chatbot-as-a-Service and Social Media Text Analytics System must remain accessible to authorised B/Ds according to agreed service levels. Capacity management, backup, resilience measures and after-hours support arrangements contribute to this principle.", color: "var(--green)" },
      { id: "AL", name: "Accountability & Least Privilege", text: "All platform users (including CSSA, contractors and B/D staff) shall be uniquely identified and held accountable for their actions. Privileges shall be granted strictly according to the principle of least privilege and reviewed regularly.", color: "var(--violet)" },
      { id: "DD", name: "Security by Design & Defence in Depth", text: "Security requirements must be embedded from the design stage of any platform enhancement. Multiple layers of controls (preventive, detective, responsive and recovery) shall be implemented so that failure of a single control does not compromise the overall security posture.", color: "var(--amber)" }
    ],
    principlesNote: "S17 Section 6 and G3 Section 6 establish the fundamental principles that must underpin all security measures.",

    defenceLayers: [
      { key: "Governance", sub: "Policy, ownership, risk appetite", color: "var(--violet)", desc: "S17 / G3 policy baseline, DITSO accountability and the ISMC / ITSWG central framework." },
      { key: "Preventive", sub: "Access control, RBAC, encryption", color: "var(--brand-2)", desc: "Least privilege, MFA, information classification, TLS and cryptographic key management." },
      { key: "Detective", sub: "Logging, monitoring, scanning", color: "var(--accent)", desc: "Audit logs, vulnerability scanning, threat intelligence and GovCERT.HK alerts." },
      { key: "Responsive", sub: "ISIRT, containment, eradication", color: "var(--amber)", desc: "Incident reporting channels, after-hours response and post-incident review." },
      { key: "Recovery", sub: "Backup, resilience, continuity", color: "var(--green)", desc: "Tested recovery procedures, capacity management and business continuity (S19)." }
    ],

    sraaCycle: [
      ["1", "Assess Security Risks", "Identify assets, threats, vulnerabilities; analyse and evaluate risk."],
      ["2", "Implement & Maintain Secure Framework", "Select controls, record treatment plans and embed security by design."],
      ["3", "Monitor & Record", "Collect evidence, maintain the risk register and confirm control effectiveness."],
      ["4", "Review & Improve", "Feed observations, audits and near-misses back into the cycle."]
    ],
    sraaNote: "Figure 2 – Iterative Security Risk Assessment & Audit Cycle (adapted from ISPG-SM01). In line with ISPG-SM01 and S17 Section 7.2 / G3 Section 7.2, a risk-based approach is mandatory.",
    riskSteps: [
      ["Risk Identification", "Identify assets (models, data stores, APIs, user interfaces), threats (data poisoning, model inversion, prompt injection, unauthorised access, availability attacks), and vulnerabilities."],
      ["Risk Analysis", "Evaluate likelihood and impact on confidentiality, integrity and availability of the platforms and the data they process."],
      ["Risk Evaluation", "Compare residual risks against DPO risk appetite and classification of the systems."],
      ["Risk Treatment", "Select and implement controls (mitigate, transfer, accept or avoid). Document in a risk treatment plan."],
      ["Verification & Monitoring", "Confirm controls are effective; maintain system risk register; feed results into continuous improvement."]
    ],
    riskStepsNote: "For the AI platforms, the CSSA shall support the following steps as described in ISPG-SM01 Section 4.4.",
    aiRisks: [
      "Data privacy risks arising from training data and user prompts (Personal Data (Privacy) Ordinance considerations).",
      "Model security risks (adversarial inputs, model extraction, poisoning).",
      "Supply-chain risks associated with third-party AI models or cloud services.",
      "Insider risks related to privileged access to model parameters and analytics outputs.",
      "Availability risks that could affect multiple B/Ds simultaneously if the centralised platform is disrupted."
    ],

    domains: [
      { id: "S11", title: "Access Control", ref: "S17 Section 11 / G3 Section 11", controls: [
        "Apply principle of least privilege for all platform accounts (administrators, operators, B/D users).",
        "Enforce strong password policy and multi-factor authentication where technically feasible.",
        "Implement role-based access control (RBAC) aligned with job functions.",
        "Regularly review and promptly remove access rights upon termination or change of role.",
        "Control privileged accounts used for model deployment and configuration changes."
      ] },
      { id: "S10", title: "Asset Management & Information Classification", ref: "S17 Section 10", controls: [
        "Maintain an accurate inventory of all platform components (servers, containers, models, datasets, APIs).",
        "Classify information according to Security Regulations (e.g., Restricted, Confidential).",
        "Ensure secure handling, storage and disposal of media containing classified or personal data.",
        "Protect documentation and configuration files with appropriate access controls."
      ] },
      { id: "S14", title: "Operations Security", ref: "S17 Section 14 / G3 Section 14", controls: [
        "Follow documented operational procedures and change management processes.",
        "Implement malware protection and content filtering appropriate to the platforms.",
        "Perform regular backups of critical configuration, models and data; test recovery procedures.",
        "Collect and retain audit logs for a sufficient period; protect logs against tampering.",
        "Conduct vulnerability scanning, penetration testing and patch management on a defined schedule.",
        "Monitor threat intelligence sources (including GovCERT.HK alerts) relevant to AI systems."
      ] },
      { id: "S15", title: "Communications & Network Security", ref: "S17 Section 15", controls: [
        "Ensure network segmentation between platform components and external networks.",
        "Use encrypted channels (TLS) for all data transfers, especially those involving classified or personal data.",
        "Apply gateway-level and client-level protections for any Internet-facing components.",
        "Control and monitor API access between the platforms and consuming B/D systems."
      ] },
      { id: "S12", title: "Cryptography", ref: "S17 Section 12", controls: [
        "Apply cryptographic controls for data at rest and in transit commensurate with information classification.",
        "Manage cryptographic keys securely throughout their lifecycle.",
        "Ensure algorithms and key lengths meet current Government standards."
      ] },
      { id: "S17", title: "Outsourcing & Cloud Computing Security", ref: "S17 Section 17", controls: [
        "Ensure contracts with platform contractors include appropriate security clauses and right-to-audit provisions.",
        "Verify that any cloud services used meet Government cloud security requirements.",
        "Maintain clear delineation of security responsibilities between DPO and service providers.",
        "Monitor service delivery against agreed security service levels."
      ] },
      { id: "S18", title: "Security Incident Management", ref: "S17 Section 18", controls: [
        "Be familiar with DPO's Information Security Incident Response Team (ISIRT) procedures.",
        "Report suspected or actual security incidents promptly according to established channels.",
        "Support containment, eradication, recovery and post-incident review activities.",
        "Maintain readiness for after-hours incident response as required by the role."
      ] }
    ],
    domainsNote: "The following sections summarise the mandatory and recommended controls that the CSSA must support or enforce, drawn from S17 and G3.",

    /* S17 / G3 areas referenced by the compiled framework (Section 2.1 mapping) */
    mandatoryAreas: [
      ["S7", "Management Responsibilities", "Vendor coordination, segregation of duties"],
      ["S9", "Human Resource Security", "User awareness, secure B/D onboarding"],
      ["S10", "Asset Management", "Component inventory, documentation control"],
      ["S11", "Access Control", "Least privilege, RBAC, MFA"],
      ["S12", "Cryptography", "Encryption at rest / in transit, key lifecycle"],
      ["S14", "Operations Security", "Change control, backup, audit logs, patching"],
      ["S14.7", "IT Security Threat Management", "Threat intelligence, emerging GenAI risk"],
      ["S15", "Communications & Network Security", "Segmentation, TLS, API control"],
      ["S16", "System Acquisition, Development & Maintenance", "Security by design, secure configuration"],
      ["S17", "Outsourcing & Cloud Computing Security", "Contract clauses, right to audit"],
      ["S18", "Security Incident Management", "ISIRT, reporting, after-hours readiness"],
      ["S19", "Business Continuity", "Resilience and recovery procedures"],
      ["S20", "Compliance, Assessment & Audit", "S17 20.2, ISPG-SM01 SRAA"],
      ["IC", "Information Classification", "Classification, labelling, handling"]
    ],
    areasNote: "Areas cited across Sections 3–9 of the compiled framework. The framework states that controls address the 14 mandatory areas specified in S17 Section 2.1, adapted to the AI platform context.",

    operational: {
      intro: "The CSSA acts as a central coordination point. Effective information flow among the following parties is essential:",
      parties: ["Internal DPO technical and security teams", "Platform contractors / vendors", "Consulting teams engaged for AI development", "Adopting B/Ds (users and their local IT security officers)", "Central bodies (GIRO, GovCERT.HK) when incidents or alerts arise"],
      documentation: [
        "Maintain up-to-date electronic and physical files of platform documentation, configuration baselines, user guides and security procedures.",
        "Ensure version control and access control for all controlled documents.",
        "Make documents readily accessible to authorised team members while protecting sensitive content."
      ],
      afterHours: [
        "Special events requiring elevated platform availability or monitoring.",
        "Fire-fighting of production incidents affecting platform availability or security.",
        "Urgent deployment of security patches or emergency configuration changes."
      ]
    },

    complianceObligations: [
      "Baseline IT Security Policy [S17] – mandatory minimum requirements.",
      "IT Security Guidelines [G3] – implementation standards.",
      "Security Regulations issued by Security Bureau.",
      "General Circular No. 6/2024 – Strengthening the Governance and Security of IT Systems.",
      "Personal Data (Privacy) Ordinance where personal data is processed by the platforms.",
      "Any additional contractual or legal requirements applicable to the platforms."
    ],
    reviews: [
      "Support periodic security risk assessments of the AI platforms.",
      "Facilitate independent security audits as required.",
      "Assist in the preparation of evidence and documentation for audit purposes.",
      "Track and report on the status of remediation actions arising from assessments and audits."
    ],
    continuousImprovement: [
      "Feeding operational observations and near-misses into the risk register.",
      "Proposing enhancements based on market research into GenAI security best practices.",
      "Participating in post-implementation reviews after major changes.",
      "Supporting security awareness activities for B/D adopters."
    ],

    actions: [
      ["P1", "Familiarise with current platform architecture, asset inventory and existing risk register", "Week 1-2", "S10, ISPG-SM01"],
      ["P1", "Review and confirm access control matrix and privileged account list for both platforms", "Week 1-3", "S11 / G3-11"],
      ["P1", "Establish clear escalation and incident reporting channels with DITSO / ISIRT", "Week 1-2", "S18"],
      ["P2", "Support or initiate system-level security risk assessment for Chatbot-as-a-Service", "Month 1-2", "ISPG-SM01"],
      ["P2", "Review vendor contracts for security clause adequacy and residual risk acceptance", "Month 1", "S17"],
      ["P2", "Document operational procedures and update platform run-books", "Ongoing", "S14"],
      ["P3", "Conduct market research on GenAI security threats and propose control enhancements", "Month 2-3", "S14.7"],
      ["P3", "Support security awareness materials for B/D adopters of the platforms", "Month 2-3", "S9"],
      ["P3", "Prepare handover documentation and lessons-learned report at end of engagement", "Final 2 weeks", "Continuous Improvement"]
    ],
    actionNote: "The following prioritised actions are recommended for the CSSA engagement period (November 2026 – January 2027).",

    references: [
      "Baseline IT Security Policy [S17], Version 8.2, April 2025, Digital Policy Office.",
      "IT Security Guidelines [G3], Version 10.1, July 2024, Digital Policy Office.",
      "Practice Guide for Security Risk Assessment & Audit [ISPG-SM01], Version 2.1, July 2024, Digital Policy Office.",
      "ISO/IEC 27001:2022 – Information security, cybersecurity and privacy protection – Information security management systems – Requirements.",
      "ISO/IEC 27002:2022 – Information security, cybersecurity and privacy protection – Information security controls.",
      "ISO/IEC 27005:2022 – Information security, cybersecurity and privacy protection – Guidance on managing information security risks.",
      "General Circular No. 6/2024 – Strengthening the Governance and Security of IT Systems.",
      "Security Regulations, Security Bureau, Government of the HKSAR."
    ],

    raciHeader: ["Activity", "CSSA", "DITSO", "Sys Admin", "Vendor", "B/D User"],
    raci: [
      ["Platform daily operations & monitoring", "R", "A", "C", "C", "I"],
      ["Access rights administration", "R", "A", "C", "I", "I"],
      ["Security risk assessment support", "R", "A", "C", "C", "I"],
      ["Incident detection & initial response", "R", "A", "C", "C", "I"],
      ["Vendor performance & security monitoring", "R", "A", "I", "C", "I"],
      ["B/D adoption support & user guidance", "R", "A", "C", "I", "C"],
      ["Documentation & knowledge base maintenance", "R", "A", "C", "C", "I"],
      ["Change management & release control", "C", "A", "R", "C", "I"],
      ["Policy compliance oversight", "C", "A / R", "I", "I", "I"]
    ],
    raciNote: "R = Responsible, A = Accountable, C = Consulted, I = Informed (Annex A).",

    riskRegister: [
      ["AI-001", "Unauthorised access to chatbot conversation logs containing personal data", "Weak access control / privilege escalation", "Medium", "High", "High", "Mitigate"],
      ["AI-002", "Prompt injection leading to leakage of system instructions or sensitive data", "Insufficient input validation / model guardrails", "Medium", "High", "High", "Mitigate"],
      ["AI-003", "Service disruption of centralised platforms affecting multiple B/Ds", "Single point of failure / insufficient resilience", "Low", "High", "Medium", "Mitigate"],
      ["AI-004", "Supply-chain compromise of third-party AI model or library", "Unverified third-party components", "Low", "High", "Medium", "Mitigate / Transfer"],
      ["AI-005", "Data poisoning of social media analytics training set", "Inadequate data provenance controls", "Low", "Medium", "Low", "Accept / Mitigate"]
    ],
    riskNote: "Note: Likelihood and Impact ratings (Low / Medium / High) should be calibrated against DPO's risk appetite and the classification of the specific information system. Residual risk after treatment must be formally accepted by the appropriate authority (normally DITSO or senior management)."
  };

  /* ---------- Workspace extensions: editable registers seeded from the document ---------- */
  const owners = ["CSSA", "DITSO", "IT Security Admin", "Platform contractor", "Information Owner", "System Admin"];
  const statuses = ["Compliant", "In progress", "Review due", "Not started"];
  D.FW.controlSeed = [];
  D.FW.domains.forEach((dom, di) => {
    dom.controls.forEach((c, ci) => {
      D.FW.controlSeed.push({
        id: "CTL-" + String(di * 10 + ci + 1).padStart(3, "0"),
        control: c,
        domain: dom.id + " · " + dom.title,
        ref: dom.ref,
        owner: owners[(di + ci) % owners.length],
        status: statuses[(di + ci) % statuses.length],
        evidence: "DPO-CSSA-SEC-2026 §7." + (di + 1),
        review: "2026-12-" + String(4 + ((di + ci) % 20)).padStart(2, "0")
      });
    });
  });
  D.FW.riskSeed = D.FW.riskRegister.map((r) => ({
    id: r[0], riskDesc: r[1], threat: r[2], likelihood: r[3], impact: r[4], level: r[5], treatment: r[6],
    owner: "CSSA", residual: "To be accepted by DITSO", status: "Open"
  }));
  D.FW.actionSeed = D.FW.actions.map((a, i) => ({
    id: "AP-" + String(i + 1).padStart(2, "0"), priority: a[0], action: a[1], target: a[2], reference: a[3],
    status: i < 2 ? "In progress" : "Not started", owner: "CSSA", progress: i < 2 ? 35 : 0
  }));
})();
