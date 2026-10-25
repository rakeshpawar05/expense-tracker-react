import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEventAiInsight } from '../../api/aiApi';
import {
  Sparkles,
  Compass,
  CheckCircle,
  AlertCircle,
  Flame,
  Calendar,
  FlameKindling,
  PieChart,
  Lightbulb,
  Receipt,
  RotateCcw,
  Loader2,
  TrendingUp,
} from 'lucide-react';

export const AiEventAuditCard = ({ event, userId }) => {
  const eventId = event?.id;
  const eventName = event?.name;

  const {
    data: insight,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ['aiEventInsight', userId, eventId, eventName],
    queryFn: async () => {
      const res = await getEventAiInsight({
        userId,
        eventId,
        eventName,
      });
      return res.data;
    },
    enabled: Boolean(userId && (eventId || eventName)),
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  const getVerdictBadge = (verdict) => {
    const text = verdict || 'Analyzed';
    const lower = text.toLowerCase();

    if (lower.includes('budget') || lower.includes('frugal')) {
      return {
        icon: CheckCircle,
        label: text,
        className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      };
    }
    if (lower.includes('balanced') || lower.includes('disciplined')) {
      return {
        icon: Compass,
        label: text,
        className: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      };
    }
    if (lower.includes('moderate') || lower.includes('paced')) {
      return {
        icon: TrendingUp,
        label: text,
        className: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      };
    }
    if (lower.includes('travel') || lower.includes('adventure')) {
      return {
        icon: Sparkles,
        label: text,
        className: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      };
    }
    if (lower.includes('premium') || lower.includes('heavy') || lower.includes('high')) {
      return {
        icon: Flame,
        label: text,
        className: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      };
    }

    return {
      icon: Sparkles,
      label: text,
      className: 'bg-slate-800 text-slate-300 border-slate-700',
    };
  };

  if (isLoading) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30 animate-pulse space-y-2.5 mb-4">
        <div className="flex items-center gap-2">
          <Loader2 size={15} className="animate-spin text-purple-400" />
          <span className="text-xs text-purple-300 font-medium">
            Generating AI Event Cost Debrief & Burn Rate...
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

  const verdictConfig = getVerdictBadge(insight.verdictTag);
  const VerdictIcon = verdictConfig.icon;

  const categories = insight.categoryBreakdown ? Object.entries(insight.categoryBreakdown) : [];
  const totalSpent = insight.totalSpent || 0;

  return (
    <div className="rounded-xl p-[1px] bg-gradient-to-r from-purple-500/40 via-indigo-500/30 to-pink-500/20 shadow-lg mb-4">
      <div className="rounded-[11px] bg-slate-950/90 backdrop-blur-md p-4 space-y-3 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Sparkles size={14} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>AI Event Cost Debrief</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({eventName})
                </span>
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-lg border text-[10px] font-semibold flex items-center gap-1 ${verdictConfig.className}`}
            >
              <VerdictIcon size={12} />
              <span>{verdictConfig.label}</span>
            </span>

            <button
              onClick={() => refetch()}
              disabled={isFetching}
              title="Regenerate Debrief"
              className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
            >
              <RotateCcw
                size={12}
                className={isFetching ? 'animate-spin text-purple-400' : ''}
              />
            </button>
          </div>
        </div>

        {/* Headline & Insight narrative */}
        <div className="relative z-10 space-y-1">
          {insight.headline && (
            <p className="text-xs font-semibold text-purple-200">
              {insight.headline}
            </p>
          )}
          {insight.insight && (
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {insight.insight}
            </p>
          )}
        </div>

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 relative z-10">
          {/* Total Outflow */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex flex-col">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Receipt size={10} className="text-purple-400" /> Total Outflow
            </span>
            <span className="text-sm font-bold text-white mt-0.5">
              ₹{Math.round(totalSpent).toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] text-slate-400">
              {insight.transactionCount || 0} entries
            </span>
          </div>

          {/* Active Duration */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex flex-col">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Calendar size={10} className="text-indigo-400" /> Active Duration
            </span>
            <span className="text-sm font-bold text-indigo-300 mt-0.5">
              {insight.activeDays || 1} day{insight.activeDays > 1 ? 's' : ''}
            </span>
            <span className="text-[9px] text-slate-400 truncate">
              {insight.startDate ? `${insight.startDate} → ${insight.endDate}` : 'Milestone period'}
            </span>
          </div>

          {/* Daily Burn Velocity */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex flex-col">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <FlameKindling size={10} className="text-amber-400" /> Daily Burn
            </span>
            <span className="text-sm font-bold text-amber-300 mt-0.5">
              ₹{Math.round(insight.dailyBurnRate || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] text-slate-400">per active day</span>
          </div>

          {/* Top Category */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex flex-col">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <PieChart size={10} className="text-pink-400" /> Top Category
            </span>
            <span className="text-sm font-bold text-pink-300 mt-0.5 truncate">
              {insight.topCategory || 'N/A'}
            </span>
            <span className="text-[9px] text-slate-400">
              ₹{Math.round(insight.topCategoryAmount || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Category Breakdown Bar */}
        {categories.length > 0 && totalSpent > 0 && (
          <div className="space-y-1.5 pt-1 relative z-10">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Category Allocation</span>
              <span>{categories.length} categories</span>
            </div>
            {/* Visual stacked bar */}
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
              {categories.map(([cat, amt], idx) => {
                const pct = Math.max(2, Math.round((amt / totalSpent) * 100));
                const colors = [
                  'bg-purple-500',
                  'bg-indigo-500',
                  'bg-pink-500',
                  'bg-cyan-500',
                  'bg-amber-500',
                  'bg-emerald-500',
                ];
                const bg = colors[idx % colors.length];
                return (
                  <div
                    key={cat}
                    style={{ width: `${pct}%` }}
                    className={`${bg} h-full transition-all`}
                    title={`${cat}: ₹${Math.round(amt).toLocaleString('en-IN')} (${pct}%)`}
                  />
                );
              })}
            </div>
            {/* Legend badges */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {categories.slice(0, 4).map(([cat, amt]) => {
                const pct = Math.round((amt / totalSpent) * 100);
                return (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] bg-slate-900 text-slate-300 border border-slate-800"
                  >
                    <span className="font-medium text-white">{cat}:</span>
                    <span className="text-slate-400">₹{Math.round(amt).toLocaleString('en-IN')}</span>
                    <span className="text-purple-300 font-mono">({pct}%)</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Largest Single Expense Item */}
        {insight.largestExpenseDescription && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] relative z-10">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Receipt size={12} className="text-indigo-400" />
              <span>Largest single outlay:</span>
              <span className="text-white font-medium">
                "{insight.largestExpenseDescription}"
              </span>
            </span>
            <span className="font-bold text-purple-300">
              ₹{Math.round(insight.largestExpenseAmount || 0).toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* Actionable Takeaway */}
        {insight.takeaway && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/30 text-[11px] text-purple-200 relative z-10">
            <Lightbulb size={13} className="text-purple-400 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="font-semibold text-white">Event Key Takeaway: </span>
              <span>{insight.takeaway}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
