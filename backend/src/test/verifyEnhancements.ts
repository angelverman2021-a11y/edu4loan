import http from "http";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import { runProductionSeed } from "../seeds/seedProduction";
import { Bank } from "../models/Bank";
import { LoanScheme as LoanSchemeModel } from "../models/LoanScheme";
import { signToken } from "../utils/jwt";

const runEnhancementTests = async () => {
  console.log("====================================================");
  console.log("  EDU4LOAN BACKEND ENHANCEMENT VERIFICATION SUITE");
  console.log("====================================================\n");

  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  process.env.NODE_ENV = "test";

  await mongoose.connect(process.env.MONGODB_URI);
  await runProductionSeed();

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));

  const apiCall = (options: { method: string; path: string; body?: any }) => {
    return new Promise<{ status: number; body: any }>((resolve, reject) => {
      const address = server.address() as any;
      const postData = options.body ? JSON.stringify(options.body) : "";
      const headers: Record<string, string> = {};
      if (postData) {
        headers["Content-Type"] = "application/json";
        headers["Content-Length"] = Buffer.byteLength(postData).toString();
      }

      const req = http.request(
        {
          hostname: "127.0.0.1",
          port: address.port,
          path: options.path,
          method: options.method,
          headers,
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              resolve({ status: res.statusCode || 500, body: JSON.parse(data) });
            } catch {
              resolve({ status: res.statusCode || 500, body: data });
            }
          });
        }
      );
      req.on("error", reject);
      if (postData) req.write(postData);
      req.end();
    });
  };

  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, msg: string) => {
    if (condition) {
      console.log(`[PASS] ${msg}`);
      passed++;
    } else {
      console.error(`[FAIL] ${msg}`);
      failed++;
    }
  };

  try {
    // 1. Bank Statistics
    const statsRes = await apiCall({ method: "GET", path: "/api/bank-statistics" });
    assert(statsRes.status === 200, "GET /api/bank-statistics returns 200 OK");
    assert(statsRes.body.success === true, "Bank statistics response success is true");
    assert(statsRes.body.data.summary.totalPublishedBanks >= 3, "Published banks count >= 3");
    assert(statsRes.body.data.summary.totalPublishedSchemes >= 3, "Published schemes count >= 3");
    assert(
      statsRes.body.data.summary.notice.includes("not currently available"),
      "Contains notice regarding absence of speculative approval statistics"
    );

    // 2. What-If Scenarios
    const whatIfList = await apiCall({ method: "GET", path: "/api/what-if" });
    assert(whatIfList.status === 200, "GET /api/what-if returns 200 OK");
    assert(whatIfList.body.data.length >= 10, "Returns at least 10 practical What-If scenarios");

    const salaryScenario = await apiCall({ method: "GET", path: "/api/what-if/NO_SALARY_SLIP" });
    assert(salaryScenario.status === 200, "GET /api/what-if/NO_SALARY_SLIP returns 200 OK");
    assert(
      salaryScenario.body.data.title.includes("Salary Slip"),
      "Scenario contains verified salary slip title"
    );
    assert(
      salaryScenario.body.data.relevantDocuments.length >= 3,
      "Scenario provides alternative documents (ITR, bank statement, income certificate)"
    );

    // 3. Ask Edu4Loan Chatbot
    const chatRes = await apiCall({
      method: "POST",
      path: "/api/chatbot/ask",
      body: {
        question: "Salary slip nahi hai to kya kare?",
        context: { university: "VIT Bhopal", loanAmount: 1200000, incomeType: "Self-employed" },
      },
    });
    assert(chatRes.status === 200, "POST /api/chatbot/ask returns 200 OK");
    assert(chatRes.body.data.answer.length > 50, "Chatbot produces structured, detailed answer");
    assert(chatRes.body.data.citations.length >= 1, "Chatbot returns verified source citations");
    assert(
      chatRes.body.data.citations[0].status === "verified",
      "Chatbot citation has verified status"
    );

    // 4. Extended Comparison Scheme Details
    const compareRes = await apiCall({ method: "GET", path: "/api/loan-schemes" });
    assert(compareRes.status === 200, "GET /api/loan-schemes returns 200 OK");
    const sbiScheme = compareRes.body.data.find(
      (s: any) => s.schemeCode === "SBI_STUDENT_LOAN"
    );
    assert(Boolean(sbiScheme), "Found SBI Student Loan scheme in database");
    assert(
      sbiScheme.guaranteeRequirement.includes("CGFSEL"),
      "SBI scheme includes guaranteeRequirement"
    );
    assert(
      sbiScheme.coApplicantRequirement.includes("Parent"),
      "SBI scheme includes coApplicantRequirement"
    );
    assert(
      sbiScheme.eligibleExpenses.length >= 4,
      "SBI scheme includes eligibleExpenses list"
    );
    assert(
      sbiScheme.applicationProcess.length >= 3,
      "SBI scheme includes applicationProcess list"
    );
    assert(
      sbiScheme.termsAndConditions.length >= 2,
      "SBI scheme includes termsAndConditions with plain explanations"
    );

    // 5. Section 20 Source-Based Answer Engine Fallback Verification
    const unverifiedChatRes = await apiCall({
      method: "POST",
      path: "/api/chatbot/ask",
      body: {
        question: "Can I get an unverified loan from an unknown foreign private lender?",
      },
    });
    assert(unverifiedChatRes.status === 200, "POST /api/chatbot/ask fallback returns 200 OK");
    assert(
      unverifiedChatRes.body.data.answer.startsWith("Information not currently verified."),
      "Unverified query strictly begins with 'Information not currently verified.'"
    );

    // 6. Section 21 Multilingual & Conversational Global Search Upgrades
    const searchRes = await apiCall({ method: "GET", path: "/api/search?q=salary" });
    assert(searchRes.status === 200, "GET /api/search?q=salary returns 200");
    assert(
      searchRes.body.data.whatIfScenarios.length >= 1,
      "Search resolves query to What-If scenarios"
    );
    assert(
      Array.isArray(searchRes.body.data.sources) && Array.isArray(searchRes.body.data.chatbotAnswers),
      "Search returns sources and chatbotAnswers collections (Section 21)"
    );

    // Test specific target queries from Section 21
    const testQueries = [
      "Salary slip nahi hai to kya kare?",
      "Parent is self employed",
      "No collateral",
      "Documents required",
      "Minimum documents for VIT Bhopal",
      "Compare banks",
      "Which banks published processing time?",
      "How does bank verify student information?",
      "Loan approval statistics",
      "Parents ke liye simple explanation",
      "ગુજરાતીમાં લોનની માહિતી",
    ];

    for (const tq of testQueries) {
      const qRes = await apiCall({
        method: "GET",
        path: `/api/search?q=${encodeURIComponent(tq)}`,
      });
      assert(
        qRes.status === 200 && qRes.body.data.totalMatches > 0,
        `Section 21 Search resolves '${tq}' (matches: ${qRes.body.data?.totalMatches})`
      );
    }

    // 7. Section 23 Data Model Extension (source, sourceUrl, lastVerifiedAt, verificationStatus)
    const sampleBank = await Bank.findOne();
    assert(Boolean(sampleBank), "Database has at least one bank record");
    assert(
      typeof sampleBank?.source !== "undefined" || typeof sampleBank?.overallSource?.source !== "undefined",
      "Bank supports source field"
    );
    assert(
      typeof sampleBank?.verificationStatus !== "undefined" || typeof sampleBank?.overallSource?.status !== "undefined",
      "Bank supports verificationStatus"
    );

    const sampleScheme = await LoanSchemeModel.findOne();
    assert(Boolean(sampleScheme), "Database has at least one loan scheme record");
    assert(
      typeof sampleScheme?.sourceUrl !== "undefined" || typeof sampleScheme?.source?.sourceUrl !== "undefined",
      "LoanScheme supports sourceUrl"
    );
    assert(
      typeof sampleScheme?.verificationStatus !== "undefined" || typeof sampleScheme?.status !== "undefined",
      "LoanScheme supports verificationStatus"
    );

    // 8. Section 24 Admin Catalog & Status Management
    const adminToken = signToken({
      userId: "admin_test_id",
      email: "admin@edu4loan.org",
      role: "admin",
    });

    const adminCatalogRes = await new Promise<{ status: number; body: any }>((resolve, reject) => {
      const address = server.address() as any;
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port: address.port,
          path: "/api/admin/catalog/bank",
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => resolve({ status: res.statusCode || 500, body: JSON.parse(data) }));
        }
      );
      req.on("error", reject);
      req.end();
    });

    assert(adminCatalogRes.status === 200, "GET /api/admin/catalog/bank returns 200 for admin");
    assert(adminCatalogRes.body.data.length >= 3, "Admin catalog returns bank records");

    // Test Admin Status Update: POST /api/admin/status/bank/:id
    const targetBank = sampleBank!;
    const adminStatusRes = await new Promise<{ status: number; body: any }>((resolve, reject) => {
      const address = server.address() as any;
      const postData = JSON.stringify({
        status: "VERIFIED",
        verificationDate: "2026-10-04",
        reason: "Section 24 automated test status update",
      });
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port: address.port,
          path: `/api/admin/status/bank/${targetBank._id}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData).toString(),
            Authorization: `Bearer ${adminToken}`,
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => resolve({ status: res.statusCode || 500, body: JSON.parse(data) }));
        }
      );
      req.on("error", reject);
      req.write(postData);
      req.end();
    });

    assert(adminStatusRes.status === 200, "POST /api/admin/status/bank/:id returns 200 OK");
    assert(
      adminStatusRes.body.data.verificationStatus === "VERIFIED",
      "Bank status successfully updated to VERIFIED"
    );

    console.log("\n====================================================");
    console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log("====================================================\n");

    if (failed > 0) process.exit(1);
  } finally {
    server.close();
    await mongoose.disconnect();
    await mongod.stop();
  }
};

runEnhancementTests().catch((e) => {
  console.error("Test error:", e);
  process.exit(1);
});
