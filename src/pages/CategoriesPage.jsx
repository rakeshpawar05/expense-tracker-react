import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategoriesApi, createCategoryApi, deleteCategoryApi } from '../api/categoryApi';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { Tags, Plus, Trash2, Layers } from 'lucide-react';

export const CategoriesPage = () => {
  const { userDetails, currentYearMonth } = useAuth();
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');

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
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    createMutation.mutate(categoryName.trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Spending Categories</h1>
          <p className="text-xs text-slate-400">Manage budget buckets for this cycle</p>
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
              <GlassCard key={cat.id} className="p-5 flex flex-col justify-between group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                      <Tags size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">{cat.name}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {expenseCount} transaction{expenseCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete category "${cat.name}"?`)) {
                        deleteMutation.mutate(cat.id);
                      }
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Spent</span>
                  <span className="font-bold text-white font-mono">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

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
    </div>
  );
};
