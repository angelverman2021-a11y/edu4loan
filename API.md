# Edu4Loan — Production REST API Specification

> **Regulatory & Architecture Notice:**  
> Edu4Loan is strictly an information and decision-support platform designed for VIT Bhopal students.  
> It is **NOT** a lending institution, loan broker, credit rating agency, or financial advisory. It does not approve, recommend, rank, or guarantee education loans. Final loan terms, interest rates, margin money, collateral acceptance, and sanction decisions rest exclusively with the lending financial institutions and government nodal authorities.

---

## 1. Global API Architecture & Conventions

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://api.edu4loan.org/api` (or configured `API_URL`)

### Content Types
- Request: `Content-Type: application/json`
- Response: `Content-Type: application/json; charset=utf-8`

### Standard Response Envelopes

#### Successful Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "data": { ... } | [ ... ],
  "message": "Optional human-readable confirmation message",
  "meta": {
    "count": 10,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42,
      "totalPages": 3
    },
    "disclaimer": "Regulatory guidance and terms notice..."
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

#### Error Response (`400`, `401`, `403`, `404`, `429`, `500`)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable explanation of error condition",
    "details": [ ... ]
  }
}
```

### Standard Error Codes
| HTTP Status | Error Code | Description |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Request payload fails schema validation or bounds check |
| `400` | `INVALID_ID` | Provided ID is not a valid 24-character hexadecimal ObjectId |
| `401` | `UNAUTHORIZED` | Missing, malformed, or expired JWT bearer token |
| `403` | `FORBIDDEN` | Authenticated user lacks required administrative role |
| `404` | `NOT_FOUND` / `*_NOT_FOUND` | Target resource does not exist |
| `404` | `ROUTE_NOT_FOUND` | Unmapped API route |
| `409` | `DUPLICATE_KEY` | Unique constraint violation (e.g. email already registered) |
| `429` | `RATE_LIMIT_EXCEEDED` | Request threshold exceeded |
| `500` | `INTERNAL_SERVER_ERROR` | Unhandled runtime exception |

---

## 2. Authentication & Student Profile (`/api/auth`)

### 2.1 Register Student Account
- **Method:** `POST`
- **Route:** `/api/auth/register`
- **Access:** Public

#### Request Body
```json
{
  "name": "Aarav Sharma",
  "email": "aarav.sharma2024@vitbhopal.ac.in",
  "password": "SecurePassword123!",
  "role": "student",
  "admissionYear": 2024,
  "degreeProgram": "B.Tech Computer Science and Engineering",
  "phone": "+919876543210"
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "66bc11223344556677889900",
      "name": "Aarav Sharma",
      "email": "aarav.sharma2024@vitbhopal.ac.in",
      "role": "student",
      "admissionYear": 2024,
      "degreeProgram": "B.Tech Computer Science and Engineering"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully."
}
```

### 2.2 Login User
- **Method:** `POST`
- **Route:** `/api/auth/login`
- **Access:** Public

#### Request Body
```json
{
  "email": "aarav.sharma2024@vitbhopal.ac.in",
  "password": "SecurePassword123!"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "66bc11223344556677889900",
      "name": "Aarav Sharma",
      "email": "aarav.sharma2024@vitbhopal.ac.in",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful."
}
```

### 2.3 Get Current Profile
- **Method:** `GET`
- **Route:** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Authenticated User

---

## 3. Bank Discovery API (`/api/banks`)

### 3.1 List Banks
- **Method:** `GET`
- **Route:** `/api/banks`
- **Access:** Public

#### Query Parameters
| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | Integer | `1` | Page number |
| `limit` | Integer | `20` | Items per page (max 100) |
| `search` | String | — | Safe regex search against bank name, slug, or shortCode |
| `category` | String | — | Filter by `public`, `private`, `regional_rural`, `nbfc` |
| `status` | String | — | Filter by source status (`verified`, `needs_verification`) |

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "_id": "66bc10010010010010010001",
      "name": "State Bank of India",
      "slug": "sbi",
      "shortCode": "SBI",
      "category": "public",
      "logoUrl": "https://assets.edu4loan.org/banks/sbi.svg",
      "officialWebsite": "https://sbi.co.in",
      "educationLoanPortalUrl": "https://sbi.co.in/web/student-platform/student-loan-scheme",
      "vidyaLakshmiRegistered": true,
      "pmVidyalaxmiRegistered": true,
      "headquarters": "Mumbai, Maharashtra",
      "vitBhopalTieUp": {
        "hasFormalMOU": true,
        "onCampusDeskAvailable": true,
        "designatedBranchName": "SBI Ashta Branch (Branch Code: 030141)",
        "details": "SBI Ashta branch serves as the nodal campus processing branch for VIT Bhopal students.",
        "status": "verified",
        "lastVerified": "2026-08-15"
      },
      "overallSource": {
        "value": "SBI Corporate Portal & Student Loan Circulars",
        "source": "State Bank of India Corporate Website",
        "sourceUrl": "https://sbi.co.in/web/student-platform/student-loan-scheme",
        "lastVerified": "2026-08-15",
        "status": "verified"
      }
    }
  ],
  "meta": {
    "count": 1,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

### 3.2 Get Bank Details
- **Method:** `GET`
- **Route:** `/api/banks/:id` (Accepts 24-character ObjectId or bank slug like `sbi`)
- **Access:** Public

Returns bank profile populated with active `loanSchemes` belonging to this bank.

---

## 4. Education Loan Scheme API (`/api/loan-schemes`)

### 4.1 Discover & Filter Schemes
- **Method:** `GET`
- **Route:** `/api/loan-schemes`
- **Access:** Public

#### Query Parameters
| Parameter | Type | Description |
|---|---|---|
| `page` | Integer | Page number (default: 1) |
| `limit` | Integer | Items per page (default: 20, max: 100) |
| `bankId` / `bank` | String | Filter by bank ObjectId or slug |
| `degreeLevel` | String | Filter by degree (`Undergraduate`, `Postgraduate`, `Doctoral`, etc.) |
| `loanAmount` | Number | Returns schemes where documented maximum inland limit covers requested amount |
| `collateralRequirement` | String | `free` (nil tangible collateral required) or `required` |
| `search` | String | Keyword search in schemeName, bankName, or overview |

### 4.2 Side-by-Side Scheme Comparison
- **Method:** `GET`
- **Route:** `/api/loan-schemes/compare?ids=<id1>,<id2>[,<id3>,<id4>]`
- **Access:** Public

> **CRITICAL RULE:** This endpoint provides objective, factual side-by-side attribute alignment with **ZERO** bank rankings, "best bank" tags, or winner declarations.

#### Query Parameters
| Parameter | Type | Required | Description |
|---|---|---|---|
| `ids` | Comma-separated strings | Yes | Between 2 and 4 valid loan scheme ObjectIds |

#### Sample Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "count": 2,
    "disclaimer": "Comparison values are extracted from official circulars and primary sources. Final rates, limits, and eligibility are determined exclusively by the lending bank upon formal application.",
    "schemes": [
      {
        "id": "66bc20010010010010010001",
        "schemeName": "SBI Scholar Loan Scheme (List B - VIT Bhopal)",
        "schemeCode": "SBI_SCHOLAR_VIT",
        "bank": {
          "name": "State Bank of India",
          "category": "public",
          "slug": "sbi"
        },
        "interestRate": {
          "benchmarkType": "EBLR",
          "minRate": { "value": 8.15, "sourceUrl": "https://sbi.co.in/web/interest-rates/interest-rates/loan-schemes-list" },
          "maxRate": { "value": 9.35, "sourceUrl": "https://sbi.co.in/web/interest-rates/interest-rates/loan-schemes-list" },
          "girlChildConcessionPercent": { "value": 0.5 }
        },
        "loanAmount": {
          "inlandMax": { "value": 2000000 }
        },
        "collateral": {
          "upTo4Lakhs": "Nil (Co-obligation of parents mandatory)",
          "from4To7point5Lakhs": "Nil (Third-party guarantee or parent co-obligation)",
          "above7point5Lakhs": "Tangible collateral security equal to 100% of loan amount"
        },
        "marginMoney": {
          "upTo4LakhsPercent": 0,
          "above4LakhsIndiaPercent": 5,
          "scholarshipAdjustmentAllowed": true
        },
        "moratorium": {
          "moratoriumBufferMonths": 12,
          "explanation": "Course duration plus 12 months post-course completion."
        },
        "officialPortals": {
          "applicationUrl": "https://www.vidyalakshmi.co.in/Students/",
          "circularUrl": "https://sbi.co.in/web/student-platform/scholar-loan-scheme"
        }
      }
    ],
    "featureMatrix": [
      {
        "feature": "Bank Category",
        "values": ["public", "public"]
      },
      {
        "feature": "Interest Rate (Min - Max)",
        "values": ["8.15% - 9.35%", "8.50% - 9.75%"]
      },
      {
        "feature": "Max Inland Limit",
        "values": ["₹20,00,000", "₹15,00,000"]
      }
    ]
  },
  "meta": {
    "disclaimer": "Comparison values are extracted from official circulars and primary sources. Final rates, limits, and eligibility are determined exclusively by the lending bank upon formal application."
  }
}
```

---

## 5. Loan Finder Decision-Support Engine (`/api/loan-finder`)

- **Method:** `POST`
- **Route:** `/api/loan-finder`
- **Access:** Public

Matches student inputs with factual bank eligibility rules, regulatory collateral tiers (₹4L, ₹7.5L), margin money, and government subsidy schemes.

#### Request Body
```json
{
  "courseType": "btech",
  "annualFamilyIncome": 400000,
  "loanAmount": 650000,
  "hasCollateral": false,
  "admissionConfirmed": true,
  "studyLocation": "india"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "message": "Based on the information entered, these schemes may be relevant. Final eligibility is determined by the bank.",
    "disclaimer": "Edu4Loan is an information and decision-support platform. It does not sanction, approve, or guarantee loan issuance. All sanctions and terms remain under the sole discretion of the respective lending institution.",
    "inputSummary": {
      "loanAmount": 650000,
      "studyLocation": "india",
      "familyIncome": 400000,
      "collateralAvailable": false
    },
    "totalFound": 3,
    "schemes": [
      {
        "schemeId": "66bc20010010010010010001",
        "schemeName": "SBI Scholar Loan Scheme (List B - VIT Bhopal)",
        "schemeCode": "SBI_SCHOLAR_VIT",
        "bankName": "State Bank of India",
        "bankSlug": "sbi",
        "bankCategory": "public",
        "interestRateRange": {
          "min": 8.15,
          "max": 9.35,
          "benchmark": "EBLR",
          "girlChildConcession": 0.5
        },
        "relevanceReasons": [
          "Institution matches: VIT Bhopal University degree programs qualify under recognized university norms for this scheme.",
          "Loan amount of ₹6,50,000 falls within documented maximum inland limit of ₹20,00,000.",
          "Collateral framework: Under RBI guidelines and CGFSEL cover, loans up to ₹7.5 Lakhs require suitable third-party guarantee or credit guarantee cover; tangible collateral is not mandatory.",
          "Government subsidy relevance: Annual family income of ₹4,00,000 falls within the ₹8,00,000 ceiling for PM-Vidyalaxmi 3% interest subvention during moratorium.",
          "Central Sector Interest Subsidy (CSIS) relevance: Family income of ₹4,00,000 falls within the ₹4,50,000 ceiling for 100% full interest subsidy during the moratorium period."
        ],
        "collateralSummary": "Nil tangible collateral required up to ₹7.5 Lakhs",
        "marginMoneySummary": "5% above ₹4 Lakhs",
        "moratoriumSummary": "Course duration plus 12 months",
        "verification": {
          "status": "verified",
          "lastVerified": "2026-08-15",
          "source": "State Bank of India Corporate Website",
          "sourceUrl": "https://sbi.co.in/web/student-platform/scholar-loan-scheme"
        },
        "officialApplicationUrl": "https://www.vidyalakshmi.co.in/Students/"
      }
    ],
    "applicableGovernmentSchemes": [
      {
        "schemeName": "PM-Vidyalaxmi Scheme (Central Sector Scheme 2024)",
        "schemeCode": "PM_VIDYALAXMI",
        "benefit": "3% interest subvention during moratorium for family income <= ₹8 Lakhs at eligible HEIs.",
        "portalUrl": "https://pmvidyalaxmi.gov.in"
      },
      {
        "schemeName": "Central Sector Interest Subsidy Scheme (CSIS)",
        "schemeCode": "CSIS",
        "benefit": "100% full interest subsidy during moratorium for EWS family income <= ₹4.5 Lakhs.",
        "portalUrl": "https://www.canarabank.com/csis"
      },
      {
        "schemeName": "Vidya Lakshmi Common Education Loan Portal (CELFS)",
        "schemeCode": "VIDYA_LAKSHMI_PORTAL",
        "benefit": "Common application portal for 40+ scheduled commercial banks.",
        "portalUrl": "https://www.vidyalakshmi.co.in/Students/"
      }
    ]
  }
}
```

---

## 6. EMI & Moratorium Calculator Engine (`/api/calculator/emi`)

- **Method:** `POST`
- **Route:** `/api/calculator/emi`
- **Access:** Public

Accurately computes:
1. Simple interest accrued during course study and grace period (moratorium)
2. Interest capitalization impact vs monthly servicing
3. Standard reducing-balance repayment EMI
4. 0% interest handling (e.g. government full subsidy under CSIS)
5. Multi-year amortization preview

#### Request Body
```json
{
  "loanAmount": 1000000,
  "interestRate": 9.5,
  "courseDurationMonths": 48,
  "gracePeriodMonths": 12,
  "repaymentTenureMonths": 120,
  "interestServicingDuringMoratorium": false
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "isEstimate": true,
    "disclaimer": "Actual EMI may differ depending on bank terms, disbursement schedule, interest capitalization, moratorium and repayment conditions.",
    "principal": 1000000,
    "loanAmount": 1000000,
    "annualInterestRatePercent": 9.5,
    "courseDurationYears": 4,
    "moratoriumPostCourseMonths": 12,
    "moratoriumMonths": 60,
    "totalMoratoriumMonths": 60,
    "repaymentTenureYears": 10,
    "totalRepaymentMonths": 120,
    "serviceInterestDuringMoratorium": false,
    "moratoriumInterest": 475000,
    "moratoriumSimpleInterest": 475000,
    "estimatedOutstandingAtRepaymentStart": 1475000,
    "repaymentPrincipal": 1475000,
    "estimatedEMI": 19086.14,
    "monthlyEmi": 19086.14,
    "totalRepaymentInterest": 815336.8,
    "totalInterest": 1290336.8,
    "totalInterestPayable": 1290336.8,
    "totalRepayment": 2290336.8,
    "savingsByServicingInterestDuringMoratorium": 262376.5,
    "amortizationSchedule": {
      "yearly": [
        {
          "year": 1,
          "principalPaid": 93245,
          "interestPaid": 135788,
          "closingBalance": 1381755
        }
      ],
      "monthlySample": [ ... ]
    },
    "amortizationSchedulePreview": [ ... ]
  }
}
```

---

## 7. Document Taxonomy & Personalized Checklist (`/api/documents`)

### 7.1 List Master Documents Catalog
- **Method:** `GET`
- **Route:** `/api/documents`
- **Query Params:** `category`, `isRequired`, `search`, `page`, `limit`
- **Access:** Public

### 7.2 Get Document Details
- **Method:** `GET`
- **Route:** `/api/documents/:id`
- **Access:** Public

### 7.3 Generate Personalized Document Checklist
- **Method:** `POST`
- **Route:** `/api/documents/personalized`
- **Access:** Public

Dynamically categorizes documents into **Required**, **Optional**, and **Not Applicable** based on loan amount, co-applicant occupation, collateral requirements, and application portal.

#### Request Body
```json
{
  "estimatedLoanAmount": 850000,
  "coApplicantType": "business",
  "hasCollateral": true,
  "collateralType": "property",
  "applyingThroughVidyaLakshmi": true,
  "degreeLevel": "Undergraduate"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "profileParameters": {
      "estimatedLoanAmount": 850000,
      "coApplicantType": "business",
      "hasCollateral": true,
      "collateralType": "property",
      "applyingThroughVidyaLakshmi": true,
      "degreeLevel": "Undergraduate"
    },
    "summary": {
      "totalRequired": 17,
      "totalOptional": 1,
      "totalNotApplicable": 3
    },
    "requiredDocuments": [
      {
        "name": "Property Title Deed (Original Chain of Title)",
        "category": "collateral_property",
        "isRequired": true,
        "issuingAuthority": "Sub-Registrar Office / Revenue Authority",
        "verificationTip": "Banks require 13 to 30 years title search report by an empanelled advocate."
      }
    ],
    "optionalDocuments": [ ... ],
    "notApplicableDocuments": [ ... ],
    "verificationNotes": [
      {
        "documentName": "Student Aadhaar Card",
        "tip": "Ensure the mobile number linked to Aadhaar is active to complete online Aadhaar OTP e-sign on Vidya Lakshmi / PM-Vidyalaxmi portals.",
        "authority": "Unique Identification Authority of India (UIDAI)"
      }
    ],
    "disclaimer": "This personalized checklist is an educational guidance tool based on IBA model guidelines and VIT Bhopal admissions procedures. Final document requirements and formats are determined exclusively by the lending bank upon formal credit appraisal."
  }
}
```

---

## 8. Government Schemes API (`/api/government-schemes`)

### 8.1 List Government Schemes
- **Method:** `GET`
- **Route:** `/api/government-schemes`
- **Query Params:** `search`, `page`, `limit`
- **Access:** Public

### 8.2 Get Scheme By Code / Alias
- **Method:** `GET`
- **Route:** `/api/government-schemes/:code`
- **Access:** Public

Supports normalized alias resolution:
- `/pm-vidyalaxmi` or `/PM_VIDYALAXMI` -> **PM-Vidyalaxmi Scheme (Central Sector Scheme 2024)** (Family income ceiling: ₹8,00,000, 3% interest subvention)
- `/vidya-lakshmi` or `/VIDYA_LAKSHMI_PORTAL` -> **Vidya Lakshmi CELFS Portal**
- `/csis` or `/CSIS` -> **Central Sector Interest Subsidy Scheme** (EWS income ceiling: ₹4,50,000, 100% full interest subsidy)

---

## 9. Institution Information API (`/api/institutions`)

### 9.1 Get VIT Bhopal University Profile
- **Method:** `GET`
- **Route:** `/api/institutions` or `/api/institutions/vit-bhopal`
- **Access:** Public

#### Response (`200 OK`)
Includes:
- Campus location (Kothrikalan, Sehore, Madhya Pradesh)
- Recognized approvals (UGC, AICTE, Govt of MP)
- 4-year tuition fee categories & caution deposits for B.Tech programs
- Hostel room rent & mess charge estimates
- On-campus bank helpdesk & admissions desk partner banks (`State Bank of India`, `Bank of Baroda`, `Punjab National Bank`)
- Multi-year fee estimation bonafide letter process

---

## 10. Multi-Collection Global Search (`/api/search`)

- **Method:** `GET`
- **Route:** `/api/search?q=<query>`
- **Access:** Public

Performs parallel regex search across 6 collections:
1. **Banks** (name, slug, shortCode, headquarters)
2. **Loan Schemes** (schemeName, bankName, schemeCode, overview)
3. **Government Schemes** (schemeName, schemeCode, managingAuthority, keyBenefits)
4. **Institutions** (name, address, approvals)
5. **Documents** (name, description, category, issuingAuthority)
6. **FAQs** (question, answer, tags)

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "query": "State",
    "totalMatches": 8,
    "summary": {
      "totalMatches": 8,
      "banksCount": 1,
      "loanSchemesCount": 1,
      "governmentSchemesCount": 0,
      "institutionsCount": 1,
      "documentsCount": 2,
      "faqsCount": 3
    },
    "banks": [ ... ],
    "loanSchemes": [ ... ],
    "governmentSchemes": [ ... ],
    "institutions": [ ... ],
    "documents": [ ... ],
    "faqs": [ ... ],
    "results": { ... }
  }
}
```

---

## 11. Student Self-Reported Application Tracker (`/api/applications`)

> **Multi-Tenant Ownership Isolation:**  
> Students can only view, update, or delete applications associated with their authenticated `userId`. Attempts to access another student's application return `404 APPLICATION_NOT_FOUND`.

### 11.1 List My Applications
- **Method:** `GET`
- **Route:** `/api/applications`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Authenticated Student

### 11.2 Create Tracking Entry
- **Method:** `POST`
- **Route:** `/api/applications`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Authenticated Student

#### Request Body
```json
{
  "targetBankId": "66bc10010010010010010001",
  "targetSchemeId": "66bc20010010010010010001",
  "requestedAmount": 750000,
  "degreeProgram": "B.Tech Computer Science and Engineering",
  "admissionYear": 2024,
  "status": "submitted",
  "vidyaLakshmiApplicationId": "CELFS-2026-99881",
  "notes": "Applied online on Vidya Lakshmi portal"
}
```

### 11.3 Log Bank Branch Visit
- **Method:** `POST`
- **Route:** `/api/applications/:id/bank-visits`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Authenticated Student (Owner)

#### Request Body
```json
{
  "date": "2026-09-15",
  "branchName": "SBI Ashta Branch",
  "officerContactName": "Branch Manager",
  "discussionSummary": "Submitted original bonafide fee structure from VIT Bhopal.",
  "pendingRequirementsGiven": ["Co-borrower salary slips for June 2026"],
  "followUpDate": "2026-09-22"
}
```

### 11.4 Delete Tracking Entry
- **Method:** `DELETE`
- **Route:** `/api/applications/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Authenticated Student (Owner)

---

## 12. FAQ API (`/api/faqs`)

### 12.1 Discover FAQs
- **Method:** `GET`
- **Route:** `/api/faqs`
- **Query Params:** `category`, `search`, `page`, `limit`
- **Access:** Public

Returns authoritative answers categorized by `moratorium_and_repayment`, `collateral_and_guarantees`, `pm_vidyalaxmi_scheme`, `vidya_lakshmi_portal`, `vit_bhopal_processes`, `interest_rates_and_subsidies`, `cibil_and_credit_score`. Sorted with high priority items first.

---

## 13. Primary Source Citation Registry (`/api/sources`)

### 13.1 List Official Citations
- **Method:** `GET`
- **Route:** `/api/sources`
- **Query Params:** `status`, `sourceType`, `search`, `page`, `limit`
- **Access:** Public

Every financial metric, interest rate, and margin rule throughout Edu4Loan is backed by an entry in this authoritative registry (`value`, `source`, `sourceUrl`, `lastVerified`, `status`).

---

## 14. Admin & Data Quality Governance (`/api/admin`)

- All admin endpoints require `Authorization: Bearer <token>` with `role: "admin"`.

| Endpoint | Method | Description |
|---|---|---|
| `/api/admin/metrics` | `GET` | Aggregated system metrics & recent audit activities |
| `/api/admin/audit-logs` | `GET` | Immutable security and data modification audit trail |
| `/api/admin/data-quality` | `GET` | Comprehensive data quality and source integrity report |
| `/api/admin/freshness-scan`| `POST` | Scans and flags expired records (> 90 / 180 days) |
| `/api/admin/verify/:entity/:id` | `POST` | Safely marks unverified production records as verified |
| `/api/admin/reset-demo` | `POST` | Safely purges demo records (`isDemo: true`) |
