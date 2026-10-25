import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { PieChart as PieIcon } from 'lucide-react';

const PALETTE = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#f97316', // Orange
  '#14b8a6', // Teal
];

export const CategoryDonut = ({ categories = [], totalExpense = 0 }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!categories || categories.length === 0 || totalExpense <= 0) {
    return (
      <GlassCard className="flex flex-col items-center justify-center p-8 text-center min-h-[340px]">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-3">
          <PieIcon size={24} />
        </div>
        <h4 className="text-sm font-bold text-white mb-1">No Category Data</h4>
        <p className="text-xs text-slate-400 max-w-xs">
          Record expenses with categories this month to view your spending distribution.
        </p>
      </GlassCard>
    );
  }

  // Calculate SVG stroke dashes
  let cumulativePercent = 0;
  const segments = categories.map((cat, i) => {
    const percent = (cat.totalAmount / totalExpense) * 100;
    const offset = cumulativePercent;
    cumulativePercent += percent;
    return {
      name: cat.categoryName,
      amount: cat.totalAmount,
      count: cat.expenseCount,
      percent,
      color: PALETTE[i % PALETTE.length],
      dashArray: `${percent} ${100 - percent}`,
      dashOffset: -offset,
    };
  });

  const activeCategory = hoveredIdx !== null ? segments[hoveredIdx] : null;

  return (
    <GlassCard className="flex flex-col justify-between p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Category Breakdown</h3>
          <p className="text-xs text-slate-400">Monthly expenditure distribution</p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60 text-xs font-semibold">
          {categories.length} Categories
        </span>
      </div>

      {/* SVG Donut Chart */}
      <div className="relative flex items-center justify-center my-3">
        <svg
          className="w-48 h-48 transform -rotate-90"
          viewBox="0 0 42 42"
        >
          {segments.map((seg, idx) => (
            <circle
              key={seg.name}
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              stroke={seg.color}
              strokeWidth={hoveredIdx === idx ? '5.5' : '4.5'}
              strokeDasharray={seg.dashArray}
              strokeDashoffset={seg.dashOffset}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
            {activeCategory ? activeCategory.name : 'Total Outflow'}
          </span>
          <span className="text-lg font-bold text-white tracking-tight">
            ₹{(activeCategory ? activeCategory.amount : totalExpense).toLocaleString('en-IN')}
          </span>
          {activeCategory && (
            <span className="text-xs font-semibold text-indigo-400">
              {activeCategory.percent.toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* Category List / Legend */}
      <div className="space-y-2 mt-3 max-h-48 overflow-y-auto pr-1">
        {segments.map((seg, idx) => (
          <div
            key={seg.name}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`flex items-center justify-between text-xs p-2 rounded-xl transition cursor-pointer ${
              hoveredIdx === idx ? 'bg-slate-800/80 border border-slate-700' : 'hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-slate-300 font-medium truncate">{seg.name}</span>
            </div>
            <div className="text-right flex items-center gap-2">
              <span className="text-slate-400 font-mono">{seg.percent.toFixed(0)}%</span>
              <span className="font-semibold text-white">
                ₹{seg.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
