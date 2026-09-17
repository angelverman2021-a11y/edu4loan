# Edu4Loan — Architecture & Technical Design Document

**Project:** Edu4Loan — Smart Education Loan Guidance for VIT Bhopal Students  
**Platform Nature:** Pure Information & Decision-Support Platform (Non-commercial, non-brokerage, no loan sanctioning/advisory)  
**Target Audience:** Students & Aspirants of VIT Bhopal University  
**Date:** September 2026  
**Status:** Inception & Architectural Formulation  

---

## 1. Executive Summary & Regulatory Stance

Edu4Loan is conceived as an educational and decision-support portal specifically designed for students of **VIT Bhopal University**. It serves as an impartial aggregator and explainer of education loan schemes, interest rate dynamics, collateral frameworks, required documentation, and government platforms like **Vidya Lakshmi** and **PM-Vidyalaxmi**.

### Critical Platform Boundaries:
- **NO Loan Approvals / Disbursals:** Edu4Loan never processes loan sanctions, approvals, or disbursements.
- **NO Financial Advisory / Intermediary Role:** Edu4Loan does not offer personalized financial advice or loan brokerage.
- **NO Artificial Ranking or Biased Scoring:** Banks are never marked as "Best", "Worst", "#1", or given subjective algorithmic scores.
- **Strict Verification Protocol:** Financial data points (interest rates, limits, margins, fees) must be tied to an official primary source (Ministry of Education, official bank portal/circular, or official VIT Bhopal guidance) with a timestamp and status badge (`verified`, `needs_verification`, `expired`).
- **Conditional Eligibility Language:** When a student enters criteria, the system always uses neutral phrasing: *"Based on the information entered, this scheme may be relevant. Final eligibility is determined by the bank."*

---

## 2. System Architecture

The project follows a clean, modular full-stack architecture divided into distinct domains:

```
edu4loan/
├── ARCHITECTURE.md                 # System architecture decisions & blueprints
├── PROJECT_PROGRESS.md             # Phase-by-phase tracker and checklist
├── shared/                         # Shared TypeScript types & validation schemas
│   ├── types/                      # Domain interfaces (Bank, Scheme, User, etc.)
│   └── constants/                  # Source tiers, verification rules, static categories
├── backend/                        # Node.js + Express REST API
│   ├── src/
│   │   ├── config/                 # DB, environment, security configs
│   │   ├── controllers/            # Request handlers
│   │   ├── middleware/             # Auth, role check, error handling, validation
│   │   ├── models/                 # Mongoose schemas & indexes
│   │   ├── routes/                 # Versioned REST endpoints (/api/...)
│   │   ├── services/               # Business logic & financial calculation engine
│   │   └── utils/                  # Audit loggers, sanitizers, seeders
│   ├── package.json
│   └── tsconfig.json
└── frontend/                       # React 18+ / TypeScript / Tailwind CSS / Vite
    ├── src/
    │   ├── assets/                 # SVGs, verified badges, logos
    │   ├── components/             # Reusable UI library (Fintech design system)
    │   │   ├── common/             # Button, Badge, Modal, Card, Table, EmptyState
    │   │   ├── layout/             # Navbar, Footer, Sidebar, DisclaimerBanner
    │   │   ├── forms/              # Validated inputs, step-by-step filters
    │   │   └── data-display/       # VerifiedSourceCard, RateDisplay, EmiChart
    │   ├── pages/                  # Routed views (22 core modules)
    │   ├── context/                # AuthContext, FilterContext, ComparisonContext
    │   ├── hooks/                  # Custom react hooks (useCalculator, useAuth)
    │   ├── services/               # Axios/Fetch API clients
    │   └── utils/                  # Formatters (INR ₹ currency, date, EMI math)
    ├── package.json
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## 3. Database Schema Blueprint (MongoDB / Mongoose)

1. **`users`**: Authentication credentials, roles (`student`, `admin`), profile metadata (enrolled degree, admission year, saved schemes).
2. **`banks`**: Bank directory data (public sector, private sector, regional rural, NBFCs), contact info, VIT Bhopal on-campus or designated branch tie-ups (verified only).
3. **`loanSchemes`**: Detailed schemes (e.g., SBI Scholar Loan for Premier Institutions, BoB Baroda Vidya/Gyan, PNB Saraswati), interest rates (min, max, repo-spread basis), collateral tiers, margin money, repayment holiday/moratorium terms.
4. **`documents`**: Document taxonomy (KYC, Academic proof, VIT Bhopal Admission Letter, Fee Structure, Co-applicant income proof, IT returns, property title deeds for collateral).
5. **`governmentSchemes`**: Deep-dive datasets for **Vidya Lakshmi Portal (VLP)**, **PM-Vidyalaxmi Scheme (2024)**, CSIS (Central Sector Interest Subsidy Scheme), Dr. Ambedkar Central Sector Scheme, and Credit Guarantee Fund for Education Loans (CGFSEL).
6. **`institutions`**: Detailed institutional metadata for **VIT Bhopal University** (NIRF standing, approved degree programs, official fee structures per branch, designated nodal officers / education loan desk contact where verified).
7. **`applications`**: Student's self-managed prep & tracking sheet (drafting document checklist status, bank visit logs, application timeline tracker).
8. **`sources`**: The source verification registry storing citation URLs, issuing authorities, circular reference numbers, archive dates, verification expiry windows, and confidence flags.
9. **`faqs`**: Frequently asked questions categorised by topic (Moratorium, CIBIL/Credit Score, Collateral, VIT Bhopal fee schedule payment deadlines).
10. **`auditLogs`**: Administrative action logs recording who changed interest rate values, modified source URLs, or updated scheme details.

---

## 4. Design Language & FinTech UI System

- **Color Palette:**
  - Primary Navy: `#0F172A` (Slate 900) & `#1E293B` (Slate 800)
  - Brand Royal Blue: `#1D4ED8` (Blue 700) & `#2563EB` (Blue 600)
  - Surface Background: Pure White `#FFFFFF` & Soft Slate `#F8FAFC`
  - Accent / Secondary: Soft Cyan/Blue `#E0F2FE` (Sky 100)
  - Trust / Verified Green: `#059669` (Emerald 600) & `#ECFDF5` (Emerald 50)
  - Warning / Informational Amber: `#D97706` (Amber 600) & `#FFFBEB` (Amber 50)
  - Alert Red: `#DC2626` (Red 600) & `#FEF2F2` (Red 50)
- **Typography:** Inter / Plus Jakarta Sans — crisp tabular numerals for financial figures.
- **Data Display Standards:**
  - All currency formatted to Indian Numbering System (`₹15,00,000` instead of `$1.5M` or `1,500,000`).
  - Strict Source Badge on every financial cell: `[✓ Official Bank Circular (Aug 2026)]`.
  - Non-verified values explicitly labeled with: *"Rate not verified — check official bank source."*

---

## 5. Security & Compliance Architecture

- **Authentication:** JWT with HTTP-only cookies or Bearer Authorization header, bcrypt password hashing.
- **Authorization:** Role-Based Access Control (`student` vs `admin`) with middleware guards on all mutating routes.
- **Sanitization & Validation:** Express-validator / Zod schemas to protect against NoSQL injection, XSS, and parameter pollution.
- **Rate Limiting:** Helmet security headers, CORS origin restrictions, and Express rate limiting on sensitive auth and calculation endpoints.

---

## 6. Backend Implementation & Security Blueprint (Phase 2 Completed)

### 6.1 Modular Directory Organization
```
backend/
├── src/
│   ├── config/          # env.ts (strict validation), database.ts (Mongoose + In-Memory fallback)
│   ├── controllers/     # Modular handlers (auth, bank, scheme, document, gov, inst, app, source, faq, admin)
│   ├── middleware/      # auth.middleware.ts, role.middleware.ts, validation.middleware.ts, error.middleware.ts
│   ├── models/          # 10 Mongoose models with strict type mapping & security pre-save hooks
│   ├── routes/          # REST route modules mounted under /api/
│   ├── services/        # Business logic, audit logging, factual sorting
│   ├── utils/           # apiResponse.ts, jwt.ts, password.ts
│   ├── validators/      # Zod validation schemas for request bodies and queries
│   ├── test/            # verifyPhase2.ts (13-point automated verification suite)
│   ├── app.ts           # Express application setup, Helmet, CORS, centralized errorHandler
│   └── server.ts        # Lifecycle management, graceful shutdown (SIGTERM/SIGINT)
```

### 6.2 Data Verification Guardrails
- **Pre-save Validation:** Both `LoanScheme` and `Source` models enforce Mongoose pre-save hooks. If an administrator or script attempts to save a record with status `verified` without valid primary `source` or `sourceUrl` links, Mongoose automatically demotes the status to `needs_verification`.
- **Factual Sorting Guarantee:** All bank and scheme discovery queries strictly sort by `name: 1` or `schemeName: 1`. Algorithmic rankings, "best bank" tags, or subjective scores are strictly forbidden by architecture.

### 6.3 Authentication & RBAC Architecture
- **Password Protection:** Passwords hashed with `bcryptjs` using 12 salt rounds. Plaintext passwords are never persisted.
- **JWT Standard:** Signed with HS256 containing only minimal non-sensitive identity claims: `{ userId, role }`.
- **Authorization Enforcement:** Mutating operations (`POST /api/banks`, `PUT /api/loan-schemes/:id`, etc.) enforce server-side `requireRole('admin')`. Unauthorized attempts receive HTTP 403 `FORBIDDEN`.
- **Student Data Isolation:** Application tracking endpoints (`/api/applications`) strictly scope data access to `req.user.userId`. Students can never inspect or alter other students' application records.
- **Self-Reported Disclosure:** The `Application` model features an immutable `isStudentEnteredSelfReported: true` flag to prevent any misrepresentation of live bank status feeds.

### 6.4 Standardized API Response Protocol
- **Success Format:**
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Optional user-friendly confirmation",
    "meta": { "count": 10 }
  }
  ```
- **Error Format:**
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | DUPLICATE_KEY_ERROR",
      "message": "Descriptive human-readable explanation",
      "details": [ { "field": "email", "message": "..." } ]
    }
  }
  ```
