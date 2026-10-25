import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMonthDeltaAiInsight } from '../../api/aiApi';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Flame,
  RotateCcw,
  Lightbulb,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  PiggyBank,
  Scale,
  Receipt,
  Loader2,
} from 'lucide-react';

export const AiMonthDeltaCard = ({
  userId,
  currentYearMonth,
  availableMonths = [],
  initialCompareMonth = null,
}) => {
  // Compute previous month as default comparison
  const getDefaultCompareMonth = (ym) => {
    if (!ym) return '';
    try {
      const [yearStr, monthStr] = ym.split('-');
      const y = parseInt(yearStr, 10);
      const m = parseInt(monthStr, 10);
      const prevDate = new Date(y, m - 2, 1);
      const prevY = prevDate.getFullYear();
      const prevM = String(prevDate.getMonth() + 1).padStart(2, '0');
      return `${prevY}-${prevM}`;
    } catch {
      return '';
    }
  };

  const [targetYm, setTargetYm] = useState(currentYearMonth || '');
  const [compareYm, setCompareYm] = useState(
    initialCompareMonth || getDefaultCompareMonth(currentYearMonth)
  );

  // Sync if currentYearMonth changes and user hasn't modified
  React.useEffect(() => {
    if (currentYearMonth && !targetYm) {
      setTargetYm(currentYearMonth);
      setCompareYm(getDefaultCompareMonth(currentYearMonth));
    }
  }, [currentYearMonth]);

  const {
    data: delta,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ['aiMonthDeltaInsight', userId, targetYm, compareYm],
    queryFn: async () => {
      const res = await getMonthDeltaAiInsight({
        userId,
        yearMonth: targetYm,
        compareYearMonth: compareYm,
      });
      return res.data;
    },
    enabled: Boolean(userId && targetYm && compareYm),
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  const getVerdictBadge = (verdict) => {
    const text = verdict || 'Analyzed';
    const lower = text.toLowerCase();

    if (lower.includes('disciplined') || lower.includes('frugal') || lower.includes('contraction')) {
      return {
        icon: ShieldCheck,
        label: text,
        className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      };
    }
    if (lower.includes('balanced') || lower.includes('stable')) {
      return {
        icon: CheckCircle,
        label: text,
        className: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      };
    }
    if (lower.includes('moderate') || lower.includes('creep')) {
      return {
        icon: AlertTriangle,
        label: text,
        className: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      };
    }
    if (lower.includes('surge') || lower.includes('high') || lower.includes('expansion')) {
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

  const formatMonthName = (ym) => {
    if (!ym) return '';
    try {
      const [year, month] = ym.split('-');
      const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return ym;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl p-5 bg-slate-900/80 border border-indigo-500/30 animate-pulse space-y-3 mb-6">
        <div className="flex items-center gap-2.5">
          <Loader2 size={16} className="animate-spin text-indigo-400" />
          <span className="text-xs text-indigo-300 font-medium">
            Generating AI Month-over-Month Delta Analysis...
          </span>
        </div>
        <div className="h-3.5 bg-slate-800 rounded w-2/3" />
        <div className="h-3 bg-slate-800/60 rounded w-full" />
      </div>
    );
  }

  if (isError || !delta) {
    return null;
  }

  const verdictConfig = getVerdictBadge(delta.verdictTag);
  const VerdictIcon = verdictConfig.icon;

  const isSpendUp = delta.percentageChange > 0;
  const isSpendDown = delta.percentageChange < 0;

  const savingsRateDelta = (delta.currentSavingsRate || 0) - (delta.previousSavingsRate || 0);
  const isSavingsUp = savingsRateDelta > 0;

  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500/40 via-purple-500/30 to-pink-500/20 shadow-xl mb-6">
      <div className="rounded-[15px] bg-slate-950/90 backdrop-blur-xl p-5 sm:p-6 space-y-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-52 h-52 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Comparators */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 flex-shrink-0">
              <Scale size={19} className="animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>AI Month-over-Month Delta</span>
                </h3>

                <span
                  className={`px-2 py-0.5 rounded-lg border text-[10px] font-semibold flex items-center gap-1 ${verdictConfig.className}`}
                >
                  <VerdictIcon size={11} />
                  <span>{verdictConfig.label}</span>
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mt-0.5">
                Comparative spending velocity & category swing analysis
              </p>
            </div>
          </div>

          {/* Month Comparison Selectors & Refresh */}
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto text-xs">
            {/* Target Month Select */}
            <select
              value={targetYm}
              onChange={(e) => setTargetYm(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-white text-[11px] font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {availableMonths.map((ym) => (
                <option key={ym} value={ym}>
                  {formatMonthName(ym)}
                </option>
              ))}
              {!availableMonths.includes(targetYm) && targetYm && (
                <option value={targetYm}>{formatMonthName(targetYm)}</option>
              )}
            </select>

            <span className="text-slate-500 text-[11px] flex items-center gap-0.5">
              <span>vs</span>
            </span>

            {/* Compare Month Select */}
            <select
              value={compareYm}
              onChange={(e) => setCompareYm(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-slate-300 text-[11px] font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {availableMonths.map((ym) => (
                <option key={ym} value={ym}>
                  {formatMonthName(ym)}
                </option>
              ))}
              {!availableMonths.includes(compareYm) && compareYm && (
                <option value={compareYm}>{formatMonthName(compareYm)}</option>
              )}
            </select>

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              title="Regenerate Delta Analysis"
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
            >
              <RotateCcw
                size={13}
                className={isFetching ? 'animate-spin text-indigo-400' : ''}
              />
            </button>
          </div>
        </div>

        {/* Narrative Headline & Insight */}
        <div className="space-y-1 relative z-10 pt-1">
          {delta.headline && (
            <h4 className="text-sm font-bold text-white tracking-tight">
              {delta.headline}
            </h4>
          )}
          {delta.insight && (
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              {delta.insight}
            </p>
          )}
        </div>

        {/* 4 Key Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 relative z-10">
          {/* Net Outflow Delta */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col">
            <span className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Outflow Shift</span>
              {isSpendUp ? (
                <span className="text-rose-400 font-bold flex items-center text-[10px]">
                  <ArrowUpRight size={12} />
                  +{delta.percentageChange}%
                </span>
              ) : isSpendDown ? (
                <span className="text-emerald-400 font-bold flex items-center text-[10px]">
                  <ArrowDownRight size={12} />
                  {delta.percentageChange}%
                </span>
              ) : (
                <span className="text-slate-400 text-[10px]">0.0%</span>
              )}
            </span>
            <span
              className={`text-base font-bold font-mono mt-0.5 ${
                isSpendUp ? 'text-rose-400' : isSpendDown ? 'text-emerald-400' : 'text-white'
              }`}
            >
              {delta.absoluteChange >= 0 ? '+' : ''}₹{Math.round(delta.absoluteChange || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">
              ₹{Math.round(delta.currentTotalSpent || 0).toLocaleString('en-IN')} vs ₹{Math.round(delta.previousTotalSpent || 0).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Savings Rate Shift */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col">
            <span className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Savings Rate</span>
              {isSavingsUp ? (
                <span className="text-emerald-400 font-bold flex items-center text-[10px]">
                  <ArrowUpRight size={12} />
                  +{savingsRateDelta.toFixed(1)}%
                </span>
              ) : savingsRateDelta < 0 ? (
                <span className="text-rose-400 font-bold flex items-center text-[10px]">
                  <ArrowDownRight size={12} />
                  {savingsRateDelta.toFixed(1)}%
                </span>
              ) : (
                <span className="text-slate-400 text-[10px]">Flat</span>
              )}
            </span>
            <span
              className={`text-base font-bold font-mono mt-0.5 ${
                isSavingsUp ? 'text-emerald-400' : savingsRateDelta < 0 ? 'text-rose-400' : 'text-indigo-300'
              }`}
            >
              {(delta.currentSavingsRate || 0).toFixed(1)}%
            </span>
            <span className="text-[9px] text-slate-400 font-mono mt-0.5">
              vs {(delta.previousSavingsRate || 0).toFixed(1)}% in {formatMonthName(compareYm)}
            </span>
          </div>

          {/* Primary Surge Category */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Flame size={11} className="text-rose-400" />
              <span>Surge Driver</span>
            </span>
            <span className="text-sm font-bold text-rose-300 mt-0.5 truncate">
              {delta.topSurgeCategory || 'None (Stable)'}
            </span>
            <span className="text-[9px] text-slate-400 font-mono mt-0.5">
              {delta.topSurgeAmount > 0
                ? `+₹${Math.round(delta.topSurgeAmount).toLocaleString('en-IN')} (+${delta.topSurgePercentage}%)`
                : 'No major surge'}
            </span>
          </div>

          {/* Primary Cooling Category */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldCheck size={11} className="text-emerald-400" />
              <span>Cooling / Savings</span>
            </span>
            <span className="text-sm font-bold text-emerald-300 mt-0.5 truncate">
              {delta.topCoolingCategory || 'None (Flat)'}
            </span>
            <span className="text-[9px] text-slate-400 font-mono mt-0.5">
              {delta.topCoolingAmount < 0
                ? `-₹${Math.round(Math.abs(delta.topCoolingAmount)).toLocaleString('en-IN')} (${delta.topCoolingPercentage}%)`
                : 'No major reduction'}
            </span>
          </div>
        </div>

        {/* Notable Category MoM Movers Breakdown */}
        {delta.categoryDeltas && delta.categoryDeltas.length > 0 && (
          <div className="space-y-2 pt-1 relative z-10">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Receipt size={12} className="text-indigo-400" />
                <span>Category MoM Shifts ({formatMonthName(targetYm)} vs {formatMonthName(compareYm)})</span>
              </span>
              <span>{delta.categoryDeltas.length} tracked categories</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {delta.categoryDeltas.slice(0, 6).map((c) => {
                const isUp = c.absoluteChange > 0;
                const isDown = c.absoluteChange < 0;
                return (
                  <div
                    key={c.categoryName}
                    className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]"
                  >
                    <span className="font-medium text-white">{c.categoryName}</span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      ₹{Math.round(c.currentAmount).toLocaleString('en-IN')}
                    </span>
                    <span
                      className={`font-mono text-[10px] font-bold inline-flex items-center ${
                        isUp ? 'text-rose-400' : isDown ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {isUp && <ArrowUpRight size={11} />}
                      {isDown && <ArrowDownRight size={11} />}
                      {c.absoluteChange >= 0 ? '+' : ''}₹{Math.round(c.absoluteChange).toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actionable Takeaway */}
        {delta.takeaway && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 relative z-10">
            <Lightbulb size={14} className="text-indigo-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-white">MoM Strategic Takeaway: </span>
              <span>{delta.takeaway}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
