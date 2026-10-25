import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMonthsApi, createMonthApi, updateMonthApi, deleteMonthApi } from '../api/monthApi';
import { deleteExpense } from '../api/expenseApi';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ExpenseListModal } from '../components/common/ExpenseListModal';
import { AddExpenseModal } from '../components/expenses/AddExpenseModal';
import { EditExpenseModal } from '../components/expenses/EditExpenseModal';
import { Calendar, Plus, Trash2, Edit3, ArrowRight, ExternalLink, ChevronRight, Check } from 'lucide-react';

export const MonthsPage = () => {
  const navigate = useNavigate();
  const { userDetails, currentYearMonth, setCurrentYearMonth, fetchMonths } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMonth, setEditingMonth] = useState(null);
  const [yearMonthInput, setYearMonthInput] = useState(currentYearMonth);
  const [earningInput, setEarningInput] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const { data: months = [], isLoading } = useQuery({
    queryKey: ['months', userDetails?.userId],
    queryFn: async () => {
      const res = await getMonthsApi(userDetails.userId);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: Boolean(userDetails?.userId),
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, yearMonth, earning }) => {
      if (id) {
        return await updateMonthApi(id, {
          name: yearMonth,
          yearMonth,
          earning: parseFloat(earning) || 0,
          userId: userDetails.userId,
        });
      } else {
        return await createMonthApi({
          name: yearMonth,
          yearMonth,
          earning: parseFloat(earning) || 0,
          userId: userDetails.userId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['months'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      fetchMonths(userDetails.userId);
      setIsModalOpen(false);
      setEditingMonth(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMonthApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['months'] });
      fetchMonths(userDetails.userId);
      if (selectedMonth?.id) {
        setSelectedMonth(null);
      }
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['months'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const handleOpenCreate = () => {
    setEditingMonth(null);
    setYearMonthInput(currentYearMonth);
    setEarningInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (month) => {
    setEditingMonth(month);
    setYearMonthInput(month.yearMonth || currentYearMonth);
    setEarningInput(month.earning ? String(month.earning) : '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!yearMonthInput) return;
    saveMutation.mutate({
      id: editingMonth ? editingMonth.id : null,
      yearMonth: yearMonthInput,
      earning: earningInput,
    });
  };

  const handleGoToExpenses = (yearMonth) => {
    setCurrentYearMonth(yearMonth);
    navigate('/expenses');
  };

  const activeSelectedMonth = selectedMonth
    ? months.find((m) => m.id === selectedMonth.id) || selectedMonth
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Billing Cycles & Months</h1>
          <p className="text-xs text-slate-400">
            Click any month to inspect its expenses or jump straight to its full expense feed
          </p>
        </div>

        <Button onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>New Month Cycle</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-xs text-slate-400 col-span-3 text-center py-8">Loading billing cycles...</p>
        ) : months.length === 0 ? (
          <GlassCard className="col-span-3 text-center py-12">
            <p className="text-xs text-slate-400 mb-3">No billing cycles created yet.</p>
            <Button onClick={handleOpenCreate} size="sm">
              <Plus size={14} /> Add First Month
            </Button>
          </GlassCard>
        ) : (
          months.map((m) => {
            const isCurrent = m.yearMonth === currentYearMonth;
            const expenseCount = m.expenses ? m.expenses.length : 0;
            const totalSpent = m.expenses
              ? m.expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
              : 0;

            return (
              <GlassCard
                key={m.id}
                onClick={() => setSelectedMonth(m)}
                className={`p-5 flex flex-col justify-between group cursor-pointer transition-all ${
                  isCurrent
                    ? 'border-indigo-500/50 bg-indigo-950/20 glow-card-primary'
                    : 'hover:border-indigo-500/30 hover:bg-slate-900/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          {m.name || m.yearMonth}
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                              Active
                            </span>
                          )}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {expenseCount} transaction{expenseCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleOpenEdit(m)}
                        title="Edit Month Income"
                        className="p-1.5 text-slate-400 hover:text-white transition"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete month cycle "${m.name}"?`)) {
                            deleteMutation.mutate(m.id);
                          }
                        }}
                        title="Delete Month Cycle"
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Monthly Income</span>
                      <span className="font-bold text-emerald-400 font-mono text-xs">
                        ₹{(m.earning || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Total Spent</span>
                      <span className="font-bold text-rose-400 font-mono text-xs">
                        ₹{totalSpent.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setCurrentYearMonth(m.yearMonth)}
                    className={`text-[11px] font-medium flex items-center gap-1 transition ${
                      isCurrent
                        ? 'text-indigo-400 font-semibold cursor-default'
                        : 'text-slate-400 hover:text-indigo-300'
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <Check size={12} className="text-indigo-400" /> Currently Selected
                      </>
                    ) : (
                      'Set as Active Month'
                    )}
                  </button>

                  <button
                    onClick={() => handleGoToExpenses(m.yearMonth)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group/btn transition"
                  >
                    <span>View Expenses</span>
                    <ArrowRight
                      size={13}
                      className="group-hover/btn:translate-x-0.5 transition-transform"
                    />
                  </button>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Create / Edit Month Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMonth ? 'Edit Month & Income' : 'Create Month Cycle'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Year-Month (YYYY-MM) *</label>
            <input
              type="month"
              required
              value={yearMonthInput}
              onChange={(e) => setYearMonthInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Monthly Income / Earning (₹)</label>
            <input
              type="number"
              min="0"
              value={earningInput}
              onChange={(e) => setEarningInput(e.target.value)}
              placeholder="e.g. 75000"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">This sets your monthly budget baseline in the dashboard.</p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saveMutation.isPending}>
              Save Month Cycle
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Month Expenses Modal */}
      {activeSelectedMonth && (
        <ExpenseListModal
          isOpen={Boolean(activeSelectedMonth)}
          onClose={() => setSelectedMonth(null)}
          title={`Month Cycle: ${activeSelectedMonth.name || activeSelectedMonth.yearMonth}`}
          subtitle={`Income Baseline: ₹${(activeSelectedMonth.earning || 0).toLocaleString('en-IN')}`}
          badgeText="Month Breakdown"
          badgeVariant="success"
          expenses={activeSelectedMonth.expenses || []}
          onNavigateToFeed={() => {
            const ym = activeSelectedMonth.yearMonth;
            setSelectedMonth(null);
            handleGoToExpenses(ym);
          }}
          onAddExpense={() => {
            setCurrentYearMonth(activeSelectedMonth.yearMonth);
            setSelectedMonth(null);
            setIsAddExpenseOpen(true);
          }}
          onEditExpense={(expense) => {
            setEditingExpense(expense);
          }}
          onDeleteExpense={(expenseId) => {
            if (window.confirm('Delete this expense?')) {
              deleteExpenseMutation.mutate(expenseId);
            }
          }}
        />
      )}

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <AddExpenseModal
          isOpen={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
        />
      )}

      {/* Edit Expense Modal */}
      <EditExpenseModal
        isOpen={Boolean(editingExpense)}
        onClose={() => setEditingExpense(null)}
        expense={editingExpense}
      />
    </div>
  );
};
