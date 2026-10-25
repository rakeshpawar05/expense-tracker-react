import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { getMonthlyAiInsight } from '../../api/aiApi';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowUpRight,
  RotateCcw,
  Lightbulb,
  TrendingDown,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const AiMonthlyInsightCard = () => {
  const { userDetails, currentYearMonth } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('expenseflow_dashboard_ai_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('expenseflow_dashboard_ai_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const {
    data: res,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ['aiMonthlyInsight', userDetails?.userId, currentYearMonth],
    queryFn: async () => {
      const response = await getMonthlyAiInsight(userDetails.userId, currentYearMonth);
      return response.data;
    },
    enabled: Boolean(userDetails?.userId && currentYearMonth),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const insight = res;

  const getStatusBadge = (statusTag) => {
    switch (statusTag) {
      case 'Healthy Surplus':
        return {
          icon: ShieldCheck,
          variant: 'positive',
          className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'Balanced Pace':
        return {
          icon: ShieldCheck,
          variant: 'positive',
          className: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        };
      case 'Caution: High Spend':
        return {
          icon: AlertTriangle,
          variant: 'warning',
          className: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'Overspending Alert':
        return {
          icon: Flame,
          variant: 'negative',
          className: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
      default:
        return {
          icon: Sparkles,
          variant: 'neutral',
          className: 'bg-slate-800 text-slate-300 border-slate-700',
        };
    }
  };

  if (isLoading) {
    return (
      <GlassCard className="p-5 border-indigo-500/30 relative overflow-hidden animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles size={18} className="animate-spin text-indigo-400" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="h-4 bg-slate-800 rounded-md w-48" />
            <div className="h-3 bg-slate-800/60 rounded-md w-64" />
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <div className="h-3.5 bg-slate-800/80 rounded w-full" />
          <div className="h-3.5 bg-slate-800/60 rounded w-4/5" />
        </div>
      </GlassCard>
    );
  }

  if (isError || !insight) {
    return null;
  }

  const statusConfig = getStatusBadge(insight.statusTag);
  const StatusIcon = statusConfig.icon;

  const isPreviousMonthWrapup = insight.periodType === 'PREVIOUS_MONTH_WRAPUP';

  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500/40 via-purple-500/30 to-pink-500/20 shadow-xl shadow-indigo-950/30">
      <div className="rounded-[15px] bg-slate-950/90 backdrop-blur-xl p-5 sm:p-6 space-y-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 flex-shrink-0">
              <Sparkles size={20} className="animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {insight.title || 'AI Financial Insight'}
                </h3>

                {isPreviousMonthWrapup ? (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                    1st - 5th Month Wrap-Up
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                    Live Month Pacing
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-400 mt-0.5">
                {isPreviousMonthWrapup
                  ? 'Retrospective summary while your current month begins'
                  : 'Real-time velocity and budget analysis'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Status Tag Pill */}
            <span
              className={`px-2.5 py-1 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 ${statusConfig.className}`}
            >
              <StatusIcon size={13} />
              <span>{insight.statusTag || 'Active'}</span>
            </span>

            {/* Refresh Button */}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              title="Regenerate AI Insight"
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
            >
              <RotateCcw size={13} className={isFetching ? 'animate-spin text-indigo-400' : ''} />
            </button>

            {/* Link to Chatbot */}
            <Link
              to="/chatbot"
              className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1 transition"
            >
              <span>Ask AI</span>
              <ArrowUpRight size={13} />
            </Link>

            {/* Collapse / Expand Toggle Button */}
            <button
              onClick={toggleCollapse}
              title={isCollapsed ? 'Expand AI Briefing' : 'Minimize AI Briefing'}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 flex items-center gap-1 text-xs transition"
            >
              <span className="hidden sm:inline text-[11px] font-medium">
                {isCollapsed ? 'Expand' : 'Minimize'}
              </span>
              {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>

        {/* Collapsed Compact 1-Line Preview */}
        {isCollapsed ? (
          <div
            onClick={toggleCollapse}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-slate-400 cursor-pointer hover:text-slate-300 transition relative z-10"
          >
            <p className="truncate text-slate-300 text-xs font-medium max-w-2xl flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse flex-shrink-0" />
              <span className="text-indigo-200 font-semibold">{insight.headline}</span>
            </p>
            <div className="flex items-center gap-3 font-mono text-[11px] flex-shrink-0 self-end sm:self-auto">
              <span className="text-rose-400 font-bold">
                -₹{(insight.totalExpense || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-indigo-300 font-bold">
                {(insight.spendPercentage || 0).toFixed(1)}% spent
              </span>
              <span className="text-[10px] text-indigo-400 flex items-center gap-0.5 hover:underline font-sans font-medium">
                <span>View Full Briefing</span>
                <ChevronDown size={12} />
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Insight Headline & Body */}
            <div className="space-y-1.5 relative z-10 pt-1">
              <h4 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>{insight.headline}</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                {insight.insight}
              </p>
            </div>

            {/* Key Takeaway Callout Box */}
            {insight.keyTakeaway && (
              <div className="relative z-10 p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                  <Lightbulb size={13} />
                </div>
                <div className="text-xs text-slate-300 flex-1">
                  <span className="font-semibold text-amber-300 mr-1.5">Key Takeaway:</span>
                  <span>{insight.keyTakeaway}</span>
                </div>
              </div>
            )}

            {/* Financial Metrics Summary Strip */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800/80 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <span className="text-slate-400 block text-[10px]">Income Baseline</span>
                <span className="font-mono font-bold text-emerald-400 text-xs">
                  ₹{(insight.totalEarning || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <span className="text-slate-400 block text-[10px]">Total Outflow</span>
                <span className="font-mono font-bold text-rose-400 text-xs">
                  -₹{(insight.totalExpense || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <span className="text-slate-400 block text-[10px]">Budget Spent</span>
                <span className="font-mono font-bold text-indigo-300 text-xs">
                  {(insight.spendPercentage || 0).toFixed(1)}%
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <span className="text-slate-400 block text-[10px]">Top Outflow</span>
                <span className="font-mono font-bold text-white text-xs truncate block" title={insight.topCategory}>
                  {insight.topCategory && insight.topCategory !== 'None'
                    ? `${insight.topCategory} (₹${(insight.topCategoryAmount || 0).toLocaleString('en-IN')})`
                    : 'No Outflows'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
