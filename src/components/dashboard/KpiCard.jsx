import React from 'react';
import { GlassCard } from '../common/GlassCard';
import clsx from 'clsx';

export const KpiCard = ({
  title,
  amount,
  subtitle,
  icon: Icon,
  variant = 'indigo',
  badgeText,
  badgeVariant = 'positive',
}) => {
  const colorMap = {
    indigo: {
      text: 'text-indigo-400',
      iconBg: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400',
      borderLine: 'from-indigo-500 to-violet-500',
    },
    emerald: {
      text: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
      borderLine: 'from-emerald-500 to-teal-400',
    },
    rose: {
      text: 'text-rose-400',
      iconBg: 'bg-rose-500/10 border-rose-500/25 text-rose-400',
      borderLine: 'from-rose-500 to-amber-500',
    },
    amber: {
      text: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
      borderLine: 'from-amber-500 to-yellow-400',
    },
  };

  const scheme = colorMap[variant] || colorMap.indigo;

  return (
    <GlassCard className="relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">
            {title}
          </span>
          <h3 className="text-2xl font-bold tracking-tight text-white mt-1">
            {typeof amount === 'number'
              ? `₹${amount.toLocaleString('en-IN')}`
              : amount}
          </h3>
        </div>

        {Icon && (
          <div
            className={clsx(
              'w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0',
              scheme.iconBg
            )}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>{subtitle}</span>
        {badgeText && (
          <span
            className={clsx(
              'font-semibold text-xs',
              badgeVariant === 'positive' && 'text-emerald-400',
              badgeVariant === 'negative' && 'text-rose-400',
              badgeVariant === 'neutral' && 'text-slate-300'
            )}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div className={clsx('absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r', scheme.borderLine)} />
    </GlassCard>
  );
};
