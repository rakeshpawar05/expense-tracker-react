import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getDashboardComplete } from '../api/dashboardApi';
import { KpiCard } from '../components/dashboard/KpiCard';
import { CategoryDonut } from '../components/dashboard/CategoryDonut';
import { TopExpensesCard } from '../components/dashboard/TopExpensesCard';
import { AiMonthlyInsightCard } from '../components/dashboard/AiMonthlyInsightCard';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity } from 'lucide-react';

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
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Real-time overview and budget analysis for <span className="text-indigo-300 font-semibold">{currentYearMonth}</span>
          </p>
        </div>
      </div>

      {/* AI Monthly Intelligence Banner */}
      <AiMonthlyInsightCard />

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
