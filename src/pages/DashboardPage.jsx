import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getDashboardComplete } from '../api/dashboardApi';
import { KpiCard } from '../components/dashboard/KpiCard';
import { CategoryDonut } from '../components/dashboard/CategoryDonut';
import { TopExpensesCard } from '../components/dashboard/TopExpensesCard';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { userDetails, currentYearMonth } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', userDetails?.userId, currentYearMonth],
    queryFn: async () => {
      const res = await getDashboardComplete(userDetails.userId, currentYearMonth);
      return res.data;
    },
    enabled: Boolean(userDetails?.userId && currentYearMonth),
  });

  const totalEarning = data?.totalEarning ?? 0;
  const totalExpense = data?.totalExpense ?? 0;
  const balance = data?.balance ?? 0;
  const totalTransactions = data?.totalTransactions ?? 0;
  const topExpenses = data?.topExpenses ?? [];
  const categoryBreakdown = data?.categoryBreakdown ?? [];

  const spendPercentage = totalEarning > 0 ? (totalExpense / totalEarning) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner & AI Tip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 flex-shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              Welcome back, {userDetails?.name || 'User'} 👋
            </h1>
            <p className="text-xs text-slate-400">
              {spendPercentage > 80
                ? '⚠️ You have spent over 80% of your recorded income this month.'
                : '✨ Your cashflow is looking healthy for this cycle.'}
            </p>
          </div>
        </div>

        <Link
          to="/chatbot"
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 transition"
        >
          <span>Ask AI Assistant</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Income"
          amount={totalEarning}
          subtitle="Monthly Inflow"
          icon={ArrowUpRight}
          variant="emerald"
          badgeText="Active Budget"
          badgeVariant="positive"
        />

        <KpiCard
          title="Total Expenses"
          amount={totalExpense}
          subtitle={`${spendPercentage.toFixed(1)}% of income spent`}
          icon={ArrowDownRight}
          variant="rose"
          badgeText={spendPercentage > 80 ? 'High' : 'Normal'}
          badgeVariant={spendPercentage > 80 ? 'negative' : 'neutral'}
        />

        <KpiCard
          title="Net Balance"
          amount={balance}
          subtitle="Remaining Surplus"
          icon={Wallet}
          variant={balance >= 0 ? 'indigo' : 'rose'}
          badgeText={balance >= 0 ? 'Surplus' : 'Deficit'}
          badgeVariant={balance >= 0 ? 'positive' : 'negative'}
        />

        <KpiCard
          title="Total Transactions"
          amount={totalTransactions}
          subtitle="Recorded this month"
          icon={Activity}
          variant="amber"
          badgeText="Live"
          badgeVariant="neutral"
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CategoryDonut categories={categoryBreakdown} totalExpense={totalExpense} />
        <div className="lg:col-span-2">
          <TopExpensesCard expenses={topExpenses} />
        </div>
      </div>
    </div>
  );
};
