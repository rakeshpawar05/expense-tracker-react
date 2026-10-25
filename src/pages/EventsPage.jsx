import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEventsApi, createEventApi, deleteEventApi } from '../api/eventApi';
import { deleteExpense } from '../api/expenseApi';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ExpenseListModal } from '../components/common/ExpenseListModal';
import { AddExpenseModal } from '../components/expenses/AddExpenseModal';
import { EditExpenseModal } from '../components/expenses/EditExpenseModal';
import { PartyPopper, Plus, Trash2, ArrowUpRight, ChevronRight, Sparkles } from 'lucide-react';

export const EventsPage = () => {
  const { userDetails } = useAuth();
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [addExpenseEvent, setAddExpenseEvent] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', userDetails?.userId],
    queryFn: async () => {
      const res = await getEventsApi(userDetails.userId);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: Boolean(userDetails?.userId),
  });

  const createMutation = useMutation({
    mutationFn: (name) =>
      createEventApi({
        name,
        userId: userDetails.userId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setIsAddOpen(false);
      setEventName('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteEventApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      if (selectedEvent?.id) {
        setSelectedEvent(null);
      }
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventName.trim()) return;
    createMutation.mutate(eventName.trim());
  };

  const activeSelectedEvent = selectedEvent
    ? events.find((ev) => ev.id === selectedEvent.id) || selectedEvent
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Event Tags</h1>
          <p className="text-xs text-slate-400">
            Click any event to view all tagged expenses and occasion totals
          </p>
        </div>

        <Button onClick={() => setIsAddOpen(true)}>
          <Plus size={16} />
          <span>New Event</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-xs text-slate-400 col-span-3 text-center py-8">Loading events...</p>
        ) : events.length === 0 ? (
          <GlassCard className="col-span-3 text-center py-12">
            <p className="text-xs text-slate-400 mb-3">No event tags created yet.</p>
            <Button onClick={() => setIsAddOpen(true)} size="sm">
              <Plus size={14} /> Create First Event
            </Button>
          </GlassCard>
        ) : (
          events.map((ev) => {
            const expenseCount = ev.expenses ? ev.expenses.length : 0;
            const totalAmount = ev.expenses
              ? ev.expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
              : 0;

            return (
              <GlassCard
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className="p-5 flex flex-col justify-between group cursor-pointer hover:border-purple-500/40 hover:bg-slate-900/80 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                      <PartyPopper size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                        {ev.name}
                        <ChevronRight
                          size={14}
                          className="text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition"
                        />
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[11px] text-slate-400 font-mono">
                          {expenseCount} transaction{expenseCount !== 1 ? 's' : ''}
                        </p>
                        {expenseCount > 0 && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px]">
                            <Sparkles size={10} className="text-purple-400 animate-pulse" />
                            <span>AI Debrief</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete event "${ev.name}"?`)) {
                        deleteMutation.mutate(ev.id);
                      }
                    }}
                    title="Delete Event"
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
                    <ArrowUpRight size={13} className="text-purple-400 opacity-60 group-hover:opacity-100" />
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Add New Event Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create Event Tag">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Event Name *</label>
            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Goa Trip 2026, Wedding, Home Renovation"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              Create Event
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Event Expenses Modal */}
      {activeSelectedEvent && (
        <ExpenseListModal
          isOpen={Boolean(activeSelectedEvent)}
          onClose={() => setSelectedEvent(null)}
          title={`Event: ${activeSelectedEvent.name}`}
          subtitle="All transactions tagged under this event"
          badgeText="Event Expenses"
          badgeVariant="purple"
          expenses={activeSelectedEvent.expenses || []}
          eventData={activeSelectedEvent}
          onAddExpense={() => {
            const name = activeSelectedEvent.name;
            setSelectedEvent(null);
            setAddExpenseEvent(name);
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

      {/* Add Expense Pre-selected for Event */}
      {addExpenseEvent && (
        <AddExpenseModal
          isOpen={Boolean(addExpenseEvent)}
          onClose={() => setAddExpenseEvent(null)}
          defaultEvent={addExpenseEvent}
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
