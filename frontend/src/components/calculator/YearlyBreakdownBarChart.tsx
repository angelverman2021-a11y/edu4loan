import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartBarPoint } from '@/types';

export interface YearlyBreakdownBarChartProps {
  data: ChartBarPoint[];
}

export const YearlyBreakdownBarChart: React.FC<YearlyBreakdownBarChartProps> = ({ data }) => {
  const formatCurrency = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const principal = payload.find((p: any) => p.dataKey === 'principalPaid')?.value || 0;
      const interest = payload.find((p: any) => p.dataKey === 'interestPaid')?.value || 0;
      const total = principal + interest;

      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-sm space-y-1">
          <p className="font-bold text-slate-800">{label}</p>
          <p className="text-brand-700">
            Principal Paid: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(principal)}
          </p>
          <p className="text-amber-700">
            Interest Paid: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(interest)}
          </p>
          <p className="font-bold text-slate-900 border-t border-slate-100 pt-1">
            Total Annual Outflow: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(total)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: '#64748B' }}
            tickLine={false}
            axisLine={{ stroke: '#CBD5E1' }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fontSize: 11, fill: '#64748B' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-sm text-slate-600 font-medium">
                {value === 'principalPaid' ? 'Principal Repaid' : 'Interest Paid'}
              </span>
            )}
          />
          <Bar dataKey="principalPaid" stackId="a" fill="#1D4ED8" radius={[0, 0, 0, 0]} />
          <Bar dataKey="interestPaid" stackId="a" fill="#D97706" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
