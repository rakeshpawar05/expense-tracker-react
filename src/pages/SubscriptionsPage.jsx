import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSubscriptionsApi,
  createSubscriptionApi,
  updateSubscriptionApi,
  deleteSubscriptionApi,
  toggleSubscriptionStatusApi,
  logSubscriptionExpenseApi,
} from '../api/subscriptionApi';
import { getCategoriesApi } from '../api/categoryApi';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import {
  CreditCard,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  Sparkles,
  Receipt,
  RotateCcw,
  Wallet,
  Zap,
  Check,
  Loader2,
  ChevronRight,
  Flame,
} from 'lucide-react';

const PRESETS = [
  { name: 'Netflix Premium', amount: 649, category: 'Entertainment', cycle: 'MONTHLY', day: 1, payment: 'Credit Card' },
  { name: 'Spotify Individual', amount: 119, category: 'Entertainment', cycle: 'MONTHLY', day: 1, payment: 'UPI AutoPay' },
  { name: 'Amazon Prime', amount: 1499, category: 'Entertainment', cycle: 'YEARLY', day: 15, payment: 'Credit Card' },
  { name: 'House Rent', amount: 18000, category: 'Housing', cycle: 'MONTHLY', day: 5, payment: 'NetBanking' },
  { name: 'Gym / Fitness SIP', amount: 1500, category: 'Health', cycle: 'MONTHLY', day: 1, payment: 'UPI AutoPay' },
  { name: 'Fiber Wi-Fi Internet', amount: 999, category: 'Bills', cycle: 'MONTHLY', day: 10, payment: 'UPI AutoPay' },
  { name: 'Mobile Postpaid', amount: 399, category: 'Bills', cycle: 'MONTHLY', day: 18, payment: 'Credit Card' },
  { name: 'Index Fund SIP', amount: 5000, category: 'Savings', cycle: 'MONTHLY', day: 10, payment: 'UPI AutoPay' },
  { name: 'YouTube Premium', amount: 149, category: 'Entertainment', cycle: 'MONTHLY', day: 22, payment: 'UPI AutoPay' },
];

export const SubscriptionsPage = () => {
  const { userDetails, currentYearMonth } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState('MONTHLY');
  const [billingDay, setBillingDay] = useState(1);
  const [categoryName, setCategoryName] = useState('Bills');
  const [paymentMethod, setPaymentMethod] = useState('UPI AutoPay');
  const [notes, setNotes] = useState('');

  // Logging animation state
  const [loggingId, setLoggingId] = useState(null);

  // Fetch subscriptions
  const { data: summary, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['subscriptions', userDetails?.userId, currentYearMonth],
    queryFn: async () => {
      const res = await getSubscriptionsApi({
        userId: userDetails.userId,
        yearMonth: currentYearMonth,
      });
      return res.data;
    },
    enabled: Boolean(userDetails?.userId),
  });

  // Fetch available categories for dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['categories', userDetails?.userId, currentYearMonth],
    queryFn: async () => {
      const res = await getCategoriesApi(userDetails.userId, currentYearMonth);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: Boolean(userDetails?.userId && currentYearMonth),
  });

  const createMutation = useMutation({
    mutationFn: (subData) => createSubscriptionApi(subData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSubscriptionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteSubscriptionApi(id, userDetails.userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => toggleSubscriptionStatusApi(id, userDetails.userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });

  const logExpenseMutation = useMutation({
    mutationFn: (subId) =>
      logSubscriptionExpenseApi(subId, {
        userId: userDetails.userId,
        yearMonth: currentYearMonth,
      }),
    onMutate: (subId) => {
      setLoggingId(subId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['months'] });
    },
    onSettled: () => {
      setLoggingId(null);
    },
  });

  const openCreateModal = () => {
    setEditingSub(null);
    setName('');
    setAmount('');
    setBillingCycle('MONTHLY');
    setBillingDay(1);
    setCategoryName('Bills');
    setPaymentMethod('UPI AutoPay');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (sub) => {
    setEditingSub(sub);
    setName(sub.name || '');
    setAmount(String(sub.amount || ''));
    setBillingCycle(sub.billingCycle || 'MONTHLY');
    setBillingDay(sub.billingDay || 1);
    setCategoryName(sub.categoryName || 'Bills');
    setPaymentMethod(sub.paymentMethod || 'UPI AutoPay');
    setNotes(sub.notes || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSub(null);
  };

  const applyPreset = (preset) => {
    setName(preset.name);
    setAmount(String(preset.amount));
    setCategoryName(preset.category);
    setBillingCycle(preset.cycle);
    setBillingDay(preset.day);
    setPaymentMethod(preset.payment);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    const payload = {
      name: name.trim(),
      amount: parseInt(amount, 10),
      billingCycle,
      billingDay: parseInt(billingDay, 10) || 1,
      categoryName: categoryName.trim() || 'Bills',
      paymentMethod: paymentMethod.trim() || 'AutoPay',
      notes: notes.trim(),
      userId: userDetails.userId,
    };

    if (editingSub?.id) {
      updateMutation.mutate({ id: editingSub.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const subscriptions = summary?.subscriptions || [];
  const dueSoonSubs = subscriptions.filter((s) => s.isDueSoon);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Subscriptions & Recurring Bills</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase">
              Auto Manager
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Track fixed commitments, renewal dates, and 1-click log recurring outflows for{' '}
            <span className="text-indigo-300 font-semibold">{currentYearMonth}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh subscriptions"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            <RotateCcw size={15} className={isFetching ? 'animate-spin text-indigo-400' : ''} />
          </button>
          <Button onClick={openCreateModal}>
            <Plus size={16} />
            <span>Add Subscription</span>
          </Button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Monthly Fixed Outflow */}
        <div className="p-4 rounded-2xl glass-card border border-indigo-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Monthly Commitment</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <CreditCard size={16} />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold text-white font-mono">
              ₹{(summary?.totalMonthlyCommitment || 0).toLocaleString('en-IN')}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Recurring each month</p>
          </div>
        </div>

        {/* Annualized Total */}
        <div className="p-4 rounded-2xl glass-card border border-purple-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Annualized Run-Rate</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Wallet size={16} />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold text-purple-300 font-mono">
              ₹{(summary?.totalAnnualCommitment || 0).toLocaleString('en-IN')}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Total yearly obligation</p>
          </div>
        </div>

        {/* Active Count */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Active Subscriptions</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold text-emerald-400 font-mono">
              {summary?.activeCount || 0}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {summary?.pausedCount || 0} paused / inactive
            </p>
          </div>
        </div>

        {/* Due Soon Alert */}
        <div className={`p-4 rounded-2xl glass-card border flex flex-col justify-between ${
          (summary?.dueSoonCount || 0) > 0
            ? 'border-amber-500/40 bg-amber-950/20 shadow-lg shadow-amber-950/30'
            : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Due in Next 7 Days</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              (summary?.dueSoonCount || 0) > 0
                ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                : 'bg-slate-800 text-slate-500'
            }`}>
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-xl font-extrabold font-mono ${
              (summary?.dueSoonCount || 0) > 0 ? 'text-amber-300' : 'text-slate-300'
            }`}>
              {summary?.dueSoonCount || 0}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Upcoming renewals</p>
          </div>
        </div>
      </div>

      {/* Due Soon Urgent Renewal Banner (if any) */}
      {dueSoonSubs.length > 0 && (
        <div className="rounded-2xl p-[1px] bg-gradient-to-r from-amber-500/40 via-amber-600/30 to-orange-500/20 shadow-lg">
          <div className="rounded-[15px] bg-slate-950/90 backdrop-blur-md p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle size={18} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Upcoming Renewals Due This Week</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold">
                    Action Needed
                  </span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  You have {dueSoonSubs.length} recurring subscription{dueSoonSubs.length > 1 ? 's' : ''} due in the next 7 days totaling{' '}
                  <span className="font-bold text-amber-300 font-mono">
                    ₹{dueSoonSubs.reduce((sum, s) => sum + s.amount, 0).toLocaleString('en-IN')}
                  </span>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
              {dueSoonSubs.slice(0, 3).map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => logExpenseMutation.mutate(sub.id)}
                  disabled={loggingId === sub.id}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-medium flex items-center gap-1.5 transition flex-shrink-0"
                >
                  {loggingId === sub.id ? (
                    <Loader2 size={12} className="animate-spin text-amber-400" />
                  ) : (
                    <Zap size={12} className="text-amber-400" />
                  )}
                  <span>Log {sub.name} (₹{sub.amount})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subscriptions Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold text-white">All Subscriptions ({subscriptions.length})</span>
          <span>Showing recurring schedules</span>
        </div>

        {isLoading ? (
          <div className="text-center py-12 rounded-2xl glass-card border border-slate-800">
            <Loader2 size={24} className="animate-spin text-indigo-400 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading your subscriptions & fixed bills...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <GlassCard className="text-center py-14">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <CreditCard size={24} />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">No Recurring Subscriptions Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Add your recurring bills (Netflix, Rent, Wi-Fi, Gym, SIP) to track renewals and auto-log monthly expenses with 1 click.
            </p>
            <Button onClick={openCreateModal} size="sm">
              <Plus size={14} /> Add First Subscription
            </Button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((sub) => {
              const isPaused = sub.status === 'PAUSED';
              const isLogging = loggingId === sub.id;

              return (
                <GlassCard
                  key={sub.id}
                  className={`p-5 flex flex-col justify-between relative group transition-all ${
                    isPaused
                      ? 'opacity-65 border-slate-800/60 bg-slate-900/40'
                      : sub.isDueSoon
                      ? 'border-amber-500/40 bg-amber-950/10'
                      : sub.isOverdue
                      ? 'border-rose-500/40 bg-rose-950/10'
                      : 'hover:border-indigo-500/40 hover:bg-slate-900/80'
                  }`}
                >
                  <div>
                    {/* Header: Service Name & Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-base flex-shrink-0 group-hover:scale-105 transition-transform">
                          {sub.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white tracking-tight truncate flex items-center gap-1.5">
                            <span>{sub.name}</span>
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium">
                              {sub.categoryName || 'Bills'}
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-semibold uppercase">
                              {sub.billingCycle}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Edit / Delete actions */}
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                        <button
                          onClick={() => toggleMutation.mutate(sub.id)}
                          title={isPaused ? 'Resume Subscription' : 'Pause Subscription'}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        >
                          {isPaused ? <PlayCircle size={15} /> : <PauseCircle size={15} />}
                        </button>
                        <button
                          onClick={() => openEditModal(sub)}
                          title="Edit"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete subscription "${sub.name}"?`)) {
                              deleteMutation.mutate(sub.id);
                            }
                          }}
                          title="Delete"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Amount & Status Strip */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-baseline justify-between">
                      <div>
                        <span className="text-lg font-bold text-white font-mono">
                          ₹{sub.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">
                          /{sub.billingCycle?.toLowerCase() === 'yearly' ? 'yr' : 'mo'}
                        </span>
                      </div>

                      <div className="text-right">
                        {sub.paymentMethod && (
                          <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                            {sub.paymentMethod}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Due Date & Timing Status */}
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Calendar size={12} className="text-slate-500" />
                        <span>Repeats Day {sub.billingDay}</span>
                      </div>

                      <div>
                        {sub.isLoggedThisMonth ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold">
                            <Check size={11} />
                            <span>Logged for {currentYearMonth}</span>
                          </span>
                        ) : sub.isOverdue ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-semibold">
                            <AlertTriangle size={11} />
                            <span>Overdue</span>
                          </span>
                        ) : sub.isDueSoon ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-semibold">
                            <Clock size={11} />
                            <span>Due in {sub.daysUntilDue}d</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">
                            Due {sub.nextDueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Log to Month Button */}
                  <div className="mt-4 pt-2">
                    {sub.isLoggedThisMonth ? (
                      <div className="w-full py-2 px-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-center gap-1.5">
                        <Check size={13} className="text-emerald-400" />
                        <span>Recorded in {currentYearMonth} Expenses</span>
                      </div>
                    ) : (
                      <Button
                        variant={sub.isDueSoon || sub.isOverdue ? 'primary' : 'secondary'}
                        size="sm"
                        disabled={isPaused || isLogging}
                        onClick={() => logExpenseMutation.mutate(sub.id)}
                        className="w-full justify-center gap-1.5 text-xs py-2"
                      >
                        {isLogging ? (
                          <Loader2 size={13} className="animate-spin text-white" />
                        ) : (
                          <Zap size={13} className="text-indigo-400 group-hover:scale-110" />
                        )}
                        <span>Log to {currentYearMonth} Expenses</span>
                      </Button>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit Subscription Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSub ? 'Edit Subscription' : 'Add Recurring Subscription'}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          {/* Quick Presets for New Subscriptions */}
          {!editingSub && (
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Sparkles size={11} className="text-indigo-400" />
                <span>1-Click Popular Presets:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-white transition"
                  >
                    {p.name} (₹{p.amount})
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Service / Bill Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Netflix, Cult.fit Gym, House Rent, Fiber Internet"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 649"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Billing Frequency</label>
                <select
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly / Annual</option>
                  <option value="QUARTERLY">Quarterly (3 Months)</option>
                  <option value="WEEKLY">Weekly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Billing Day of Month (1 - 31)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  value={billingDay}
                  onChange={(e) => setBillingDay(parseInt(e.target.value, 10) || 1)}
                  placeholder="e.g. 5"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Category</label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Housing">Housing</option>
                  <option value="Health">Health</option>
                  <option value="Food">Food</option>
                  <option value="Savings">Savings</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="UPI AutoPay">UPI AutoPay</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="NetBanking">NetBanking</option>
                  <option value="Cash / Manual">Cash / Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Shared with roommate, card ending in 4102"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingSub ? 'Update Subscription' : 'Save Subscription'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
