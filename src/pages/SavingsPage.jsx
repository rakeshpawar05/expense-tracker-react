import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSavingsApi, createSavingApi, deleteSavingApi } from '../api/savingApi';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { PiggyBank, Plus, Trash2, Calendar, Target } from 'lucide-react';

export const SavingsPage = () => {
  const { userDetails, currentYearMonth } = useAuth();
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data: savings = [], isLoading } = useQuery({
    queryKey: ['savings', userDetails?.userId, currentYearMonth],
    queryFn: async () => {
      const res = await getSavingsApi(userDetails.userId, currentYearMonth);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: Boolean(userDetails?.userId && currentYearMonth),
  });

  const createMutation = useMutation({
    mutationFn: (newSaving) => createSavingApi(newSaving),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
      setIsAddOpen(false);
      setDescription('');
      setAmount('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteSavingApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
    },
  });

  const totalSaved = savings.reduce((acc, s) => acc + (s.amount || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    createMutation.mutate({
      description: description.trim(),
      amount: parseInt(amount, 10),
      date,
      categoryName: 'Savings',
      userId: userDetails.userId,
      yearMonth: currentYearMonth,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Savings Vault</h1>
          <p className="text-xs text-slate-400">Track allocations toward your savings goals</p>
        </div>

        <Button onClick={() => setIsAddOpen(true)}>
          <Plus size={16} />
          <span>Add Saving</span>
        </Button>
      </div>

      {/* Summary KPI Banner */}
      <GlassCard className="p-6 bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-500/10 border-amber-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
              <PiggyBank size={26} />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Allocated this Month
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-0.5">
                ₹{totalSaved.toLocaleString('en-IN')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="warning">{savings.length} deposits</Badge>
          </div>
        </div>
      </GlassCard>

      {/* Savings List */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-xs text-slate-400 text-center py-8">Loading savings records...</p>
        ) : savings.length === 0 ? (
          <GlassCard className="text-center py-12">
            <p className="text-xs text-slate-400 mb-3">No savings entries logged for this month.</p>
            <Button onClick={() => setIsAddOpen(true)} size="sm">
              <Plus size={14} /> Log First Deposit
            </Button>
          </GlassCard>
        ) : (
          savings.map((item) => (
            <div
              key={item.id}
              className="glass-card p-4 rounded-xl flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  ₹
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.description}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                    <Calendar size={12} className="text-slate-500" />
                    {item.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-amber-400 font-mono">
                  +₹{item.amount.toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => {
                    if (window.confirm('Delete saving entry?')) {
                      deleteMutation.mutate(item.id);
                    }
                  }}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Log Savings Deposit">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Description *</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Emergency Fund, Stocks SIP, Gold Deposit"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Amount (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              Save Deposit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
