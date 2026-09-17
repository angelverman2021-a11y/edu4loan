import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  ShieldCheck,
  Building2,
  Calculator,
  Percent,
  Landmark,
  FileCheck2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { api } from '@/services/api';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  relatedLink?: {
    label: string;
    url: string;
  };
}

const AUTHORITATIVE_FAQS: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'Interest & Moratorium',
    question: 'How is interest calculated during the moratorium period?',
    answer:
      'Under RBI guidelines, simple interest (not compound interest) accrues during the course duration plus the 1-year moratorium buffer period. If unserviced, this simple interest is capitalized (added to the principal) when the repayment tenure commences. Servicing interest monthly during your studies saves significant money over the loan lifetime.',
    relatedLink: {
      label: 'Simulate Moratorium Savings in EMI Calculator',
      url: '/calculator',
    },
  },
  {
    id: 'faq_2',
    category: 'Interest & Moratorium',
    question: 'What is EBLR and how does repo rate revision affect my EMI?',
    answer:
      'External Benchmark Lending Rate (EBLR) is linked directly to the RBI Repo Rate plus an operational spread. When the RBI adjusts repo rates, the bank resets your interest rate on the scheduled reset cycle (quarterly or monthly). Fixed-rate education loans are virtually non-existent among nationalized banks.',
    relatedLink: {
      label: 'Read Interest Rate Mechanics Guide',
      url: '/calculator?tab=interest',
    },
  },
  {
    id: 'faq_3',
    category: 'Collateral & Guarantees',
    question: 'Can a bank demand property collateral for an education loan of ₹6.5 Lakhs?',
    answer:
      'No. Under RBI Master Directions and the Credit Guarantee Fund Scheme for Education Loans (CGFSEL), education loans up to ₹7.5 Lakhs do NOT mandate physical property or land collateral. The bank secures 75% credit guarantee coverage through NCGTC. A co-obligation of parents is the statutory requirement.',
    relatedLink: {
      label: 'View Collateral Rules & Tiers',
      url: '/calculator?tab=collateral',
    },
  },
  {
    id: 'faq_4',
    category: 'Collateral & Guarantees',
    question: 'What constitutes acceptable collateral for education loans exceeding ₹7.5 Lakhs?',
    answer:
      'Acceptable collateral includes non-agricultural land, residential flats/houses with clear marketable title deeds (backed by a 13–30 year Title Search Report), fixed deposits (FD), Government bonds, or surrender-value Life Insurance policies. Agricultural land is strictly prohibited by central law.',
    relatedLink: {
      label: 'Review Acceptable Collateral Types',
      url: '/calculator?tab=collateral',
    },
  },
  {
    id: 'faq_5',
    category: 'Government Subsidies',
    question: 'Who qualifies for the new PM-Vidyalaxmi 2024 scheme?',
    answer:
      'The PM-Vidyalaxmi scheme applies to students admitted to eligible Higher Educational Institutions (HEIs ranked in NIRF Top 100 overall/category or 101–200) with gross annual family income up to ₹8.0 Lakhs. It provides 3% annual interest subvention during the moratorium on loans up to ₹10 Lakhs.',
    relatedLink: {
      label: 'Check PM-Vidyalaxmi Eligibility',
      url: '/schemes?tab=pm-vidyalaxmi',
    },
  },
  {
    id: 'faq_6',
    category: 'Government Subsidies',
    question: 'How does CSIS differ from PM-Vidyalaxmi?',
    answer:
      'CSIS (Central Sector Interest Subsidy) provides a 100% full interest waiver during the course and moratorium period exclusively for Economically Weaker Section (EWS) students with annual parental income up to ₹4.5 Lakhs. PM-Vidyalaxmi extends 3% subvention up to ₹8.0 Lakhs annual income on loans up to ₹10 Lakhs.',
    relatedLink: {
      label: 'Open Subsidy Eligibility Evaluator',
      url: '/schemes?tab=checker',
    },
  },
  {
    id: 'faq_7',
    category: 'VIT Bhopal Guides',
    question: 'How do I obtain the 4-year fee estimate Bonafide letter from VIT Bhopal?',
    answer:
      'Submit an online or in-person request to the VIT Bhopal Finance and Accounts Office (Administrative Block) with your provisional admission letter. The office provides an official stamped 4-year fee estimation detailing tuition, lab, examination, and hostel schedules required by bank credit managers.',
    relatedLink: {
      label: 'Read VIT Bhopal Campus Bank SOP',
      url: '/vit-bhopal',
    },
  },
  {
    id: 'faq_8',
    category: 'VIT Bhopal Guides',
    question: 'How are semester fee tranches disbursed by the bank to VIT Bhopal?',
    answer:
      'Banks release loan proceeds strictly semester-by-semester directly to the university institutional bank account via Demand Draft (DD) or RTGS in favor of "VIT Bhopal University". Never request cash disbursement. Submit preceding semester grade sheets and current fee demand to the branch 20 business days ahead of deadlines.',
    relatedLink: {
      label: 'View VIT Bhopal Tranche Workflow',
      url: '/vit-bhopal',
    },
  },
  {
    id: 'faq_9',
    category: 'Eligibility & Co-Borrower',
    question: 'What is the required CIBIL score for education loan sanction?',
    answer:
      'While students typically have no credit history (CIBIL -1 or 0), nationalized and private banks evaluate the co-borrower (parent/guardian). A CIBIL score of 700 or higher is standard. Scores below 650 indicate adverse credit history, requiring additional co-applicants or debt resolution.',
    relatedLink: {
      label: 'Simulate Your Co-Borrower FOIR',
      url: '/eligibility',
    },
  },
  {
    id: 'faq_10',
    category: 'Eligibility & Co-Borrower',
    question: 'What are the statutory margin money rules under IBA guidelines?',
    answer:
      'For studies in India: Up to ₹4.0 Lakhs — Nil (0% margin); Above ₹4.0 Lakhs — 5% margin. For studies abroad: 15% margin. Scholarships, fee waivers, or institution awards are factored towards fulfilling the required margin money contribution.',
    relatedLink: {
      label: 'Check Eligibility & Margin Norms',
      url: '/eligibility',
    },
  },
  {
    id: 'faq_11',
    category: 'Interest & Moratorium',
    question: 'How do tax deductions under Section 80E work for education loan interest?',
    answer:
      'Under Section 80E of the Income Tax Act, 100% of the interest paid on an education loan is deductible from gross taxable income with NO upper monetary ceiling. The benefit can be claimed by the student or parent for up to 8 consecutive assessment years starting from the year interest repayment commences.',
    relatedLink: {
      label: 'Calculate Section 80E Savings in EMI Calculator',
      url: '/calculator',
    },
  },
];

const CATEGORIES = [
  'All',
  'Interest & Moratorium',
  'Collateral & Guarantees',
  'Government Subsidies',
  'VIT Bhopal Guides',
  'Eligibility & Co-Borrower',
];

export const FaqsPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>(AUTHORITATIVE_FAQS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [openId, setOpenId] = useState<string | null>('faq_1');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get<any[]>('/faqs');
        if (res.data && res.data.length > 0) {
          // Merge API faqs with authoritative catalog
          const apiMapped: FAQItem[] = res.data.map((f, i) => ({
            id: f._id || `api_${i}`,
            category: f.category || 'General',
            question: f.question,
            answer: f.answer,
          }));
          setFaqs((prev) => [...prev, ...apiMapped.filter((a) => !prev.some((p) => p.question === a.question))]);
        }
      } catch {
        // keep fallback authoritative FAQs
      }
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return f.question.toLowerCase().includes(term) || f.answer.toLowerCase().includes(term);
    });
  }, [faqs, selectedCategory, search]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <Badge variant="info">Phase 12 — Module 20</Badge>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <HelpCircle className="h-8 w-8 text-brand-700" />
          <span>Education Loan Knowledge Base & FAQs</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Comprehensive, authoritative answers regarding RBI education loan directives, CGFSEL
          collateral exemptions, PM-Vidyalaxmi 2024 subventions, and VIT Bhopal administrative
          workflows.
        </p>

        {/* Search input */}
        <div className="pt-2 max-w-md mx-auto relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs (e.g. collateral, moratorium, 80E, CSIS)..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs Accordion */}
      {filteredFaqs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6 space-y-2">
          <HelpCircle className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500 font-medium">
            No questions found matching &ldquo;{search}&rdquo; in category &ldquo;{selectedCategory}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <Card key={faq.id} className="overflow-hidden border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full text-left p-4.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors focus:outline-none"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block">
                      {faq.category}
                    </span>
                    <span className="font-bold text-slate-900 text-sm block">{faq.question}</span>
                  </div>
                  <span className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </button>

                {isOpen && (
                  <CardContent className="pt-0 px-4.5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30 space-y-3">
                    <p className="mt-3">{faq.answer}</p>

                    {faq.relatedLink && (
                      <div className="pt-2 border-t border-slate-200/60">
                        <Link
                          to={faq.relatedLink.url}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800"
                        >
                          <span>{faq.relatedLink.label}</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Disclaimers & Neutrality Notice */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-700 block">
            Regulatory Knowledge Neutrality Statement
          </span>
          <p className="text-[11px] leading-relaxed">
            Answers provided in the Edu4Loan Knowledge Base are compiled from the Reserve Bank of India
            (RBI) Master Directions, Indian Banks Association (IBA) Model Education Loan Scheme,
            Ministry of Education (MoE) operational manuals, and VIT Bhopal University directives.
            Individual bank branch managers may require supplementary documentation in accordance with
            internal bank circulars and credit underwriting criteria.
          </p>
        </div>
      </div>
    </div>
  );
};
