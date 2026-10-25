import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategoriesApi, createCategoryApi, deleteCategoryApi } from '../api/categoryApi';
import { deleteExpense } from '../api/expenseApi';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ExpenseListModal } from '../components/common/ExpenseListModal';
import { AddExpenseModal } from '../components/expenses/AddExpenseModal';
import { EditExpenseModal } from '../components/expenses/EditExpenseModal';
import { Tags, Plus, Trash2, ArrowUpRight, ChevronRight } from 'lucide-react';

export const CategoriesPage = () => {
  const { userDetails, currentYearMonth } = useAuth();
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [addExpenseCategory, setAddExpenseCategory] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories', userDetails?.userId, currentYearMonth],
    queryFn: async () => {
      const res = await getCategoriesApi(userDetails.userId, currentYearMonth);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: Boolean(userDetails?.userId && currentYearMonth),
  });

  const createMutation = useMutation({
    mutationFn: (name) =>
      createCategoryApi({
        name,
        userId: userDetails.userId,
        yearMonth: currentYearMonth,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsAddOpen(false);
      setCategoryName('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCategoryApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      if (selectedCategory?.id) {
        setSelectedCategory(null);
      }
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    createMutation.mutate(categoryName.trim());
  };

  // Find updated selected category from query cache if currently open
  const activeSelectedCategory = selectedCategory
    ? categories.find((c) => c.id === selectedCategory.id) || selectedCategory
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Spending Categories</h1>
          <p className="text-xs text-slate-400">
            Click any category to inspect its expenses for {currentYearMonth}
          </p>
        </div>

        <Button onClick={() => setIsAddOpen(true)}>
          <Plus size={16} />
          <span>New Category</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-xs text-slate-400 col-span-3 text-center py-8">Loading categories...</p>
        ) : categories.length === 0 ? (
          <GlassCard className="col-span-3 text-center py-12">
            <p className="text-xs text-slate-400 mb-3">No categories defined for this month yet.</p>
            <Button onClick={() => setIsAddOpen(true)} size="sm">
              <Plus size={14} /> Create First Category
            </Button>
          </GlassCard>
        ) : (
          categories.map((cat) => {
            const expenseCount = cat.expenses ? cat.expenses.length : 0;
            const totalAmount = cat.expenses
              ? cat.expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
              : 0;

            return (
              <GlassCard
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="p-5 flex flex-col justify-between group cursor-pointer hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                      <Tags size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                        {cat.name}
                        <ChevronRight
                          size={14}
                          className="text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition"
                        />
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {expenseCount} transaction{expenseCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete category "${cat.name}"?`)) {
                        deleteMutation.mutate(cat.id);
                      }
                    }}
                    title="Delete Category"
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Spent</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-white font-mono">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                    <ArrowUpRight size={13} className="text-indigo-400 opacity-60 group-hover:opacity-100" />
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Add New Category Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Category">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Category Name *</label>
            <input
              type="text"
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Groceries, Entertainment, Rent, Healthcare"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              Create Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Category Expenses Modal */}
      {activeSelectedCategory && (
        <ExpenseListModal
          isOpen={Boolean(activeSelectedCategory)}
          onClose={() => setSelectedCategory(null)}
          title={`Category: ${activeSelectedCategory.name}`}
          subtitle={`Billing cycle: ${currentYearMonth}`}
          badgeText="Category Expenses"
          badgeVariant="primary"
          expenses={activeSelectedCategory.expenses || []}
          onAddExpense={() => {
            const catName = activeSelectedCategory.name;
            setSelectedCategory(null);
            setAddExpenseCategory(catName);
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

      {/* Add Expense Pre-selected for Category */}
      {addExpenseCategory && (
        <AddExpenseModal
          isOpen={Boolean(addExpenseCategory)}
          onClose={() => setAddExpenseCategory(null)}
          defaultCategory={addExpenseCategory}
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
