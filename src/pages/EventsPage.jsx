import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEventsApi, createEventApi, deleteEventApi } from '../api/eventApi';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { PartyPopper, Plus, Trash2 } from 'lucide-react';

export const EventsPage = () => {
  const { userDetails } = useAuth();
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [eventName, setEventName] = useState('');

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
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventName.trim()) return;
    createMutation.mutate(eventName.trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Event Tags</h1>
          <p className="text-xs text-slate-400">Tag expenses and savings across special occasions</p>
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
          events.map((ev) => (
            <GlassCard key={ev.id} className="p-5 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <PartyPopper size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{ev.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Event ID: #{ev.id}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (window.confirm(`Delete event "${ev.name}"?`)) {
                    deleteMutation.mutate(ev.id);
                  }
                }}
                className="p-1.5 text-slate-500 hover:text-rose-400 transition opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={15} />
              </button>
            </GlassCard>
          ))
        )}
      </div>

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
    </div>
  );
};
