import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from 'recharts';
import {
  Building2,
  CheckCircle2,
  X,
  TrendingDown,
  ShieldCheck,
  Clock,
  Banknote,
  ChevronDown,
  Star,
  AlertCircle,
  ExternalLink,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { clsx } from 'clsx';

export const ComparePage = () => {
  const [loanTypes, setLoanTypes] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [loanProducts, setLoanProducts] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('EDUCATION');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  const [loanAmount, setLoanAmount] = useState(100000);
  const [tenureMonths, setTenureMonths] = useState(60);

  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const colors = ['#2563eb', '#16a34a', '#dc2626', '#eab308', '#9333ea', '#0891b2', '#ea580c'];

  useEffect(() => {
    // Fetch loan types and initial products
    const init = async () => {
      try {
        const typesRes = await fetch('http://localhost:5000/api/dataset/loan-types').then(res => res.json());
        const productsRes = await fetch('http://localhost:5000/api/dataset/products/education').then(res => res.json());
        
        setLoanTypes(typesRes?.data || []);
        setLoanProducts(productsRes?.data || []);
        
        // Select first 3 by default
        if (productsRes?.data?.length > 0) {
           setSelectedProducts(productsRes.data.slice(0, 3).map((p: any) => p.loan_product_id));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const fetchProducts = async (type: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/dataset/products/${type.toLowerCase()}`).then(res => res.json());
      setLoanProducts(res?.data || []);
      if (res?.data?.length > 0) {
         setSelectedProducts(res.data.slice(0, 3).map((p: any) => p.loan_product_id));
      } else {
         setSelectedProducts([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    fetchProducts(type);
  };

  const toggleProduct = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    if (selectedProducts.length === 0) {
      setComparisonData([]);
      return;
    }
    
    const fetchComparison = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/dataset/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            loanProductIds: selectedProducts,
            loanAmount,
            tenureMonths
          })
        }).then(res => res.json());
        setComparisonData(res?.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchComparison();
  }, [selectedProducts, loanAmount, tenureMonths]);

  if (isLoading && loanTypes.length === 0) {
    return <div className="p-10 text-center">Loading comparison data...</div>;
  }

  // Formatting for Radar
  const radarData = [
    { metric: 'Eligibility Score' },
    { metric: 'Customer XP' },
    { metric: 'Low Interest' },
    { metric: 'Low Fees' }
  ];
  
  if (comparisonData.length > 0) {
      radarData.forEach(r => {
         comparisonData.forEach(d => {
             if (r.metric === 'Eligibility Score') r[d.bankName] = d.eligibilityScore;
             if (r.metric === 'Customer XP') r[d.bankName] = d.customerExperience * 20; // scale to 100
             if (r.metric === 'Low Interest') r[d.bankName] = Math.max(0, 100 - (d.interestRate * 5));
             if (r.metric === 'Low Fees') r[d.bankName] = Math.max(0, 100 - (d.processingFee / loanAmount * 1000));
         });
      });
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <header className="mb-8">
          <Badge variant="brand" className="mb-3">Dynamic Multi-Loan Comparison</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Dataset-Driven Comparison</h1>
          <p className="mt-2 text-slate-600 max-w-2xl text-lg">Compare any loan product dynamically. The graphs below adapt instantly based on factual dataset records.</p>
        </header>

        {/* CONTROLS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-wrap gap-2">
            {loanTypes.map((t: any) => (
              <Button 
                key={t.loan_type_id} 
                variant={selectedType === t.loan_type_id ? 'primary' : 'outline'}
                onClick={() => handleTypeChange(t.loan_type_id)}
                size="sm"
              >
                {t.loan_type_name}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="text-sm font-bold text-slate-700 block mb-2">Loan Amount (₹ {loanAmount.toLocaleString('en-IN')})</label>
               <input type="range" min="10000" max="5000000" step="10000" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} className="w-full" />
             </div>
             <div>
               <label className="text-sm font-bold text-slate-700 block mb-2">Tenure (Months: {tenureMonths})</label>
               <input type="range" min="6" max="360" step="6" value={tenureMonths} onChange={e => setTenureMonths(Number(e.target.value))} className="w-full" />
             </div>
          </div>

          <div>
             <label className="text-sm font-bold text-slate-700 block mb-2">Select Products to Compare (Max 5)</label>
             <div className="flex flex-wrap gap-2">
                {loanProducts.map((p: any) => {
                   const isSelected = selectedProducts.includes(p.loan_product_id);
                   return (
                     <Button 
                       key={p.loan_product_id}
                       variant={isSelected ? 'brand' : 'outline'}
                       size="sm"
                       onClick={() => toggleProduct(p.loan_product_id)}
                       disabled={!isSelected && selectedProducts.length >= 5}
                     >
                       {p.bankName} - {p.product_name}
                     </Button>
                   );
                })}
             </div>
          </div>
        </div>

        {selectedProducts.length === 0 ? (
          <div className="p-10 text-center text-slate-500 bg-white rounded-xl border border-slate-200">Please select at least one product to compare.</div>
        ) : (
          <>
            {/* GRAPHS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Interest Rate Comparison */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Interest Rates (%)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="bankName" tick={{fontSize: 12}} />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip />
                      <Bar dataKey="interestRate" fill="#3b82f6" radius={[4,4,0,0]} name="Interest Rate" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Total Interest & Processing Fees */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Total Cost (Interest + Fees)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="bankName" tick={{fontSize: 12}} />
                      <YAxis />
                      <Tooltip formatter={(v: number) => `₹ ${v.toLocaleString('en-IN')}`} />
                      <Legend />
                      <Bar dataKey="totalInterest" stackId="a" fill="#ef4444" name="Total Interest" />
                      <Bar dataKey="processingFee" stackId="a" fill="#f59e0b" name="Processing Fee" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly EMI Comparison */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Monthly EMI</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="bankName" tick={{fontSize: 12}} />
                      <YAxis />
                      <Tooltip formatter={(v: number) => `₹ ${v.toLocaleString('en-IN')}`} />
                      <Line type="monotone" dataKey="emi" stroke="#10b981" strokeWidth={3} dot={{r: 6}} name="Monthly EMI" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Radar Recommendation */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Overall Score Radar</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{fontSize: 12, fill: '#64748b'}} />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      {comparisonData.map((d, i) => (
                         <Radar key={d.id} name={d.bankName} dataKey={d.bankName} stroke={colors[i % colors.length]} fill={colors[i % colors.length]} fillOpacity={0.4} />
                      ))}
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
              <div className="px-6 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-900">Detailed Comparison</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Parameter</th>
                      {comparisonData.map(d => <th key={d.id} className="px-4 py-3 font-bold text-brand-700">{d.bankName}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-700">Product Name</td>
                      {comparisonData.map(d => <td key={d.id} className="px-4 py-3">{d.productName}</td>)}
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-700">Interest Rate</td>
                      {comparisonData.map(d => <td key={d.id} className="px-4 py-3">{d.interestRate}%</td>)}
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-700">Monthly EMI</td>
                      {comparisonData.map(d => <td key={d.id} className="px-4 py-3 font-bold">₹ {d.emi.toLocaleString('en-IN')}</td>)}
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-700">Total Interest</td>
                      {comparisonData.map(d => <td key={d.id} className="px-4 py-3 text-red-600">₹ {d.totalInterest.toLocaleString('en-IN')}</td>)}
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-700">Processing Fee</td>
                      {comparisonData.map(d => <td key={d.id} className="px-4 py-3">₹ {d.processingFee.toLocaleString('en-IN')}</td>)}
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-700">Customer XP (1-5)</td>
                      {comparisonData.map(d => <td key={d.id} className="px-4 py-3 flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500 fill-current"/> {d.customerExperience}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
