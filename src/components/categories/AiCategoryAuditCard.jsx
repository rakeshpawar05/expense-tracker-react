import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategoryAiInsight } from '../../api/aiApi';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Flame,
  RotateCcw,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Target,
  Receipt,
  Loader2,
} from 'lucide-react';

export const AiCategoryAuditCard = ({ category, yearMonth, userId }) => {
  const categoryId = category?.id;
  const categoryName = category?.name;

  const {
    data: insight,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ['aiCategoryInsight', userId, categoryId, categoryName, yearMonth],
    queryFn: async () => {
      const res = await getCategoryAiInsight({
        userId,
        categoryId,
        categoryName,
        yearMonth,
      });
      return res.data;
    },
    enabled: Boolean(userId && (categoryId || categoryName)),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const getHealthBadge = (healthStatus) => {
    switch (healthStatus) {
      case 'HEALTHY':
        return {
          icon: ShieldCheck,
          label: 'Healthy Share',
          className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'BALANCED':
        return {
          icon: CheckCircle,
          label: 'Balanced Pace',
          className: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        };
      case 'ELEVATED':
        return {
          icon: AlertTriangle,
          label: 'Elevated Outflows',
          className: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'CRITICAL':
        return {
          icon: Flame,
          label: 'High Burn Risk',
          className: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
      default:
        return {
          icon: Sparkles,
          label: 'Tracked',
          className: 'bg-slate-800 text-slate-300 border-slate-700',
        };
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30 animate-pulse space-y-2.5">
        <div className="flex items-center gap-2">
          <Loader2 size={15} className="animate-spin text-indigo-400" />
          <span className="text-xs text-indigo-300 font-medium">
            Generating AI Category Spending Audit...
          </span>
        </div>
        <div className="h-3 bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-800/60 rounded w-full" />
      </div>
    );
  }

  if (isError || !insight) {
    return null;
  }

  const healthConfig = getHealthBadge(insight.healthStatus);
  const HealthIcon = healthConfig.icon;

  const pctChange = insight.percentageChangeVsPrevious;
  const isUp = pctChange != null && pctChange > 0;
  const isDown = pctChange != null && pctChange < 0;

  return (
    <div className="rounded-xl p-[1px] bg-gradient-to-r from-indigo-500/40 via-purple-500/30 to-pink-500/20 shadow-lg mb-2">
      <div className="rounded-[11px] bg-slate-950/90 backdrop-blur-md p-4 space-y-3 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles size={14} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>AI Category Audit</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({categoryName})
                </span>
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Pill */}
            <span
              className={`px-2 py-0.5 rounded-lg border text-[10px] font-semibold flex items-center gap-1 ${healthConfig.className}`}
            >
              <HealthIcon size={12} />
              <span>{healthConfig.label}</span>
            </span>

            {/* Refresh Button */}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              title="Regenerate Audit"
              className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
            >
              <RotateCcw
                size={12}
                className={isFetching ? 'animate-spin text-indigo-400' : ''}
              />
            </button>
          </div>
        </div>

        {/* Headline & Insight */}
        <div className="space-y-1 relative z-10">
          <h5 className="text-xs font-bold text-indigo-200">
            {insight.headline}
          </h5>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {insight.insight}
          </p>
        </div>

        {/* Actionable Tip Box */}
        {insight.actionableTip && (
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-2 relative z-10">
            <div className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
              <Lightbulb size={11} />
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="font-semibold text-amber-300 mr-1">Recommended Action:</span>
              <span>{insight.actionableTip}</span>
            </div>
          </div>
        )}

        {/* Metric Quick-Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[10px] relative z-10">
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="text-slate-400 block text-[9px]">Share of Budget</span>
            <span className="font-mono font-bold text-indigo-300 text-[11px]">
              {(insight.percentOfTotalExpenses || 0).toFixed(1)}%
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="text-slate-400 block text-[9px]">Avg / Transaction</span>
            <span className="font-mono font-bold text-slate-200 text-[11px]">
              ₹{(insight.averagePerTransaction || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="text-slate-400 block text-[9px] flex items-center gap-1">
              <Target size={10} className="text-emerald-400" />
              <span>Target Ceiling</span>
            </span>
            <span className="font-mono font-bold text-emerald-400 text-[11px]">
              ₹{(insight.recommendedBudgetCeiling || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="text-slate-400 block text-[9px]">vs Last Month</span>
            {pctChange != null ? (
              <span
                className={`font-mono font-bold text-[11px] flex items-center gap-0.5 ${
                  isUp ? 'text-rose-400' : isDown ? 'text-emerald-400' : 'text-slate-300'
                }`}
              >
                {isUp && <TrendingUp size={11} />}
                {isDown && <TrendingDown size={11} />}
                <span>
                  {pctChange > 0 ? `+${pctChange.toFixed(0)}%` : `${pctChange.toFixed(0)}%`}
                </span>
              </span>
            ) : (
              <span className="font-mono text-slate-400 text-[10px]">Baseline</span>
            )}
          </div>
        </div>

        {/* Largest Single Expense in Category */}
        {insight.largestExpenseDescription && insight.largestExpenseAmount > 0 && (
          <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 font-mono">
            <Receipt size={11} className="text-slate-500" />
            <span>Largest item:</span>
            <span className="text-slate-200 font-medium">"{insight.largestExpenseDescription}"</span>
            <span className="text-rose-400 font-bold">
              (-₹{insight.largestExpenseAmount.toLocaleString('en-IN')})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
