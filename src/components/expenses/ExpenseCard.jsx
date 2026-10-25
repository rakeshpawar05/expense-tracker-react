import React from 'react';
import { Badge } from '../common/Badge';
import { Trash2, Calendar, Tag } from 'lucide-react';

export const ExpenseCard = ({ expense, onDelete }) => {
  return (
    <div className="glass-card p-4 rounded-xl flex items-center justify-between gap-4 group">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-indigo-400 font-bold text-sm flex-shrink-0 group-hover:scale-105 transition-transform">
          ₹
        </div>

        <div className="min-w-0">
          <h4 className="text-xs font-bold text-white tracking-tight truncate">
            {expense.description}
          </h4>

          <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-mono text-slate-400">
              <Calendar size={12} className="text-slate-500" />
              {expense.date}
            </span>

            {expense.categoryName && (
              <Badge variant="primary" className="text-[10px] py-0 px-2">
                {expense.categoryName}
              </Badge>
            )}

            {expense.eventName && (
              <Badge variant="purple" className="text-[10px] py-0 px-2">
                {expense.eventName}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-sm font-bold text-rose-400 font-mono">
          -₹{expense.amount.toLocaleString('en-IN')}
        </span>

        {onDelete && (
          <button
            onClick={() => onDelete(expense.id)}
            title="Delete Expense"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
};
