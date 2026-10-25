import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExpenseFeedPaginated, deleteExpense } from '../../src/api/expenseApi';
import { ExpenseCard } from '../components/expenses/ExpenseCard';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/common/GlassCard';
import { Search, Filter, Loader2, Plus, Sparkles, Inbox } from 'lucide-react';
import { AddExpenseModal } from '../components/expenses/AddExpenseModal';
import { EditExpenseModal } from '../components/expenses/EditExpenseModal';
import { AiSmartExpenseBar } from '../components/expenses/AiSmartExpenseBar';

export const ExpensesPage = () => {
  const { userDetails, currentYearMonth } = useAuth();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleOpenModalWithData = (data) => {
    setModalInitialData(data);
    setIsAddModalOpen(true);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['expenses', userDetails?.userId, currentYearMonth, searchTerm],
    queryFn: async ({ pageParam = null }) => {
      const res = await getExpenseFeedPaginated({
        userId: userDetails.userId,
        yearMonth: currentYearMonth,
        limit: 20,
        cursor: pageParam,
        expenseName: searchTerm || undefined,
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.hasMore ? lastPage.nextCursor : undefined;
    },
    enabled: Boolean(userDetails?.userId && currentYearMonth),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // Flatten items from all pages
  const allExpenses = data?.pages.flatMap((page) => page.items || []) || [];

  // Group expenses by date
  const groupedExpenses = allExpenses.reduce((groups, expense) => {
    const date = expense.date || 'Unknown Date';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {});

  const dates = Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a));

  const formatDateHeader = (dateStr) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      }
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Expense Feed</h1>
          <p className="text-xs text-slate-400">Continuous feed of transactions for this period</p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          <span>Add Expense</span>
        </Button>
      </div>

      {/* AI Smart Expense Input Bar */}
      <AiSmartExpenseBar onOpenModalWithData={handleOpenModalWithData} />

      {/* Filter / Search Bar */}
      <GlassCard className="p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions by description..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="text-xs text-slate-400 font-mono">
          {allExpenses.length} transaction{allExpenses.length !== 1 ? 's' : ''} loaded
        </div>
      </GlassCard>

      {/* Expense Clusters */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
          <Loader2 size={24} className="animate-spin text-indigo-400" />
          <p className="text-xs">Loading transactions...</p>
        </div>
      ) : allExpenses.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-3">
            <Inbox size={24} />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">No Transactions Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            No expenses recorded for this month matching your query. Record your first expense to begin tracking.
          </p>
          <Button onClick={() => setIsAddModalOpen(true)} size="sm">
            <Plus size={14} /> Add Transaction
          </Button>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {dates.map((dateStr) => {
            const dateExpenses = groupedExpenses[dateStr];
            const dayTotal = dateExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);

            return (
              <div key={dateStr} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold px-1 text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 uppercase tracking-wider font-bold">
                      {formatDateHeader(dateStr)}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">({dateStr})</span>
                  </div>
                  <span className="font-mono text-slate-300">
                    Day Total: ₹{dayTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-2">
                  {dateExpenses.map((expense) => (
                    <ExpenseCard
                      key={expense.id}
                      expense={expense}
                      onEdit={(exp) => setEditingExpense(exp)}
                      onDelete={(id) => {
                        if (window.confirm('Delete this expense?')) {
                          deleteMutation.mutate(id);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Load More Trigger */}
          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="secondary"
                size="md"
                onClick={() => fetchNextPage()}
                loading={isFetchingNextPage}
              >
                Load Older Transactions
              </Button>
            </div>
          )}

          {!hasNextPage && allExpenses.length > 0 && (
            <p className="text-center text-xs text-slate-500 py-4 font-mono">
              &bull; End of expense feed for this period &bull;
            </p>
          )}
        </div>
      )}

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setModalInitialData(null);
        }}
        initialData={modalInitialData}
      />

      <EditExpenseModal
        isOpen={Boolean(editingExpense)}
        onClose={() => setEditingExpense(null)}
        expense={editingExpense}
      />
    </div>
  );
};
