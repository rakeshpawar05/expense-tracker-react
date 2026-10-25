import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Link } from 'react-router-dom';
import { ArrowRight, ReceiptText } from 'lucide-react';

export const TopExpensesCard = ({ expenses = [] }) => {
  return (
    <GlassCard className="flex flex-col justify-between p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Top Expenses</h3>
          <p className="text-xs text-slate-400">Largest single expenditures this month</p>
        </div>
        <Link
          to="/expenses"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[220px]">
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-2.5">
            <ReceiptText size={20} />
          </div>
          <p className="text-xs text-slate-400">No recorded expenses for this month.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 border-b border-slate-800/80 pb-2">
              <tr>
                <th className="py-2.5 font-semibold">Expense</th>
                <th className="py-2.5 font-semibold">Category</th>
                <th className="py-2.5 font-semibold">Event Tag</th>
                <th className="py-2.5 font-semibold">Date</th>
                <th className="py-2.5 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-medium text-white">{expense.description}</td>
                  <td className="py-3">
                    <Badge variant="primary">{expense.categoryName || 'General'}</Badge>
                  </td>
                  <td className="py-3">
                    {expense.eventName ? (
                      <Badge variant="purple">{expense.eventName}</Badge>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td className="py-3 text-slate-400 font-mono text-[11px]">{expense.date}</td>
                  <td className="py-3 font-bold text-white text-right font-mono">
                    ₹{expense.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </GlassCard>
  );
};
