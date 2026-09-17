# Edu4Loan 🎓💳

> **Smart Education Loan Guidance & Decision-Support Platform for VIT Bhopal Students**

[![Platform Nature: Decision Support](https://img.shields.io/badge/Platform%20Type-Educational%20%26%20Decision%20Support-blue.svg)](#critical-regulatory-stance)
[![Strict Neutrality: Zero Ranking](https://img.shields.io/badge/Financial%20Neutrality-Zero%20Ranking-green.svg)](#political--financial-neutrality)
[![VIT Bhopal Focused](https://img.shields.io/badge/Institutional%20Focus-VIT%20Bhopal-purple.svg)](#vit-bhopal-guidance)

---

## 📌 Critical Disclaimer & Regulatory Stance

**Edu4Loan is NOT a loan approval, loan recommendation, loan brokerage, or financial-advisory platform.**

Edu4Loan is an educational decision-support platform that empowers students and parents to:
- Discover verified education loan schemes
- Compare banks and loan structures objectively
- Understand floating interest rate dynamics (Repo rate, spread, EBLR, MCLR)
- Understand collateral thresholds and government guarantees
- Prepare comprehensive, structured document dossiers
- Navigate government initiatives like **Vidya Lakshmi Portal** and **PM-Vidyalaxmi Scheme (2024)**
- Calculate estimated EMIs, repayment schedules, and moratorium interest accruals
- Access verified branch contacts and VIT Bhopal specific nodal desks

**The bank / financial institution remains solely responsible for:**
- Final eligibility assessment
- Verification of documents
- Interest rate offering and concession approvals
- Collateral valuation and legal vetting
- Loan sanctioning, rejection, and disbursement

---

## 🛡️ Core Architectural Principles

1. **Zero Artificial Ranking:** Banks are never ranked as "Best", "Worst", "#1", or given subjective algorithmic scores. Factual matrices allow students to filter by interest rate ranges, collateral requirements, and margin money.
2. **Strict Financial Data Attribution:** Every interest rate, margin percentage, and fee must carry:
   - Numerical value
   - Primary official source (RBI, Ministry of Education, Bank circular, VIT Bhopal nodal office)
   - Source URL
   - Last verified date
   - Status badge (`verified`, `needs_verification`, `expired`)
3. **Impartial Conditional Language:** All discovery queries present results conditionally:  
   *"Based on the information entered, this scheme may be relevant. Final eligibility is determined by the bank."*
4. **FinTech UI Design System:** Deep navy primary (`#0F172A`), royal blue highlights (`#1D4ED8`), soft slate canvas (`#F8FAFC`), emerald verification badges, and amber advisory alerts.

---

## 🏗️ Monorepo Structure

```
edu4loan/
├── ARCHITECTURE.md          # Comprehensive architectural specification
├── PROJECT_PROGRESS.md      # Live phase-by-phase implementation tracker
├── shared/                  # Shared TypeScript types & data validation contracts
├── backend/                 # Node.js + Express REST API + MongoDB
└── frontend/                # React + TypeScript + Vite + Tailwind CSS + Recharts
```

---

## 📋 22 Core Modules

1. **Home** — Hero, trust metrics, quick finder, scheme highlights, strict legal disclaimers.
2. **Student Loan Finder** — Multi-parameter wizard (degree, fees, collateral, family income).
3. **Bank Database** — Filterable directory of public, private, and regional lenders.
4. **Bank Comparison Matrix** — Factual side-by-side comparison without bias or scores.
5. **Interest Rate Education** — Clear breakdown of Repo Rate, spread, EBLR vs MCLR, moratorium simple vs compound interest.
6. **EMI & Repayment Calculator** — Moratorium-aware amortization tables and interactive Recharts visualizations.
7. **Collateral Explainer** — Deep-dive into ₹7.5L / ₹4L collateral-free tiers, third-party guarantees, and tangible security.
8. **Document Checklist** — Category-wise printable/downloadable dossier preparation guide.
9. **Vidya Lakshmi Guide** — Step-by-step CELFS registration, application guidelines, and common mistakes to avoid.
10. **PM-Vidyalaxmi Guide** — 2024 scheme guidelines, NIRF criteria, 3% interest subvention for annual income $\le ₹8$ Lakhs.
11. **VIT Bhopal Education Loan Guide** — Campus branch details, semester fee schedules, bonafide & fee estimate letter procedure.
12. **Bank Directory** — Contact details of education loan branches and verified loan desks.
13. **Loan Scheme Details** — Comprehensive modal/page views for individual schemes with primary circular citations.
14. **Personalized Document Engine** — Dynamic checklist tailored to individual loan quantums and co-borrower profiles.
15. **Loan Eligibility Explainer** — Transparent educational guide on CIBIL, student-parent relationship, and margin requirements.
16. **Application Tracking** — Self-service student stage tracker and bank interaction log.
17. **Student Dashboard** — Document readiness score, saved schemes, and application milestones.
18. **Admin Dashboard** — Operational portal for managing bank schemes, interest rates, and audit trails.
19. **Source Verification System** — Timestamping, verification status tracking, and source URL audits.
20. **Interactive FAQ** — Categorized search-enabled FAQ addressing common student and parent concerns.
21. **Global Search** — Fast multi-entity search across banks, schemes, documents, and regulatory guides.
22. **Financial Disclaimer & Legal Framework** — Persistent notices and legal protections.

---

## 🚀 Getting Started

Instructions for running the backend and frontend locally will be detailed as phases are completed. Follow the development log in [`PROJECT_PROGRESS.md`](PROJECT_PROGRESS.md).
