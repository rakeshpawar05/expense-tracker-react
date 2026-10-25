import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { updateExpense } from '../../api/expenseApi';
import { getCategoriesApi } from '../../api/categoryApi';
import { getEventsApi } from '../../api/eventApi';
import { useAuth } from '../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export const EditExpenseModal = ({ isOpen, onClose, expense }) => {
  const { userDetails, currentYearMonth } = useAuth();
  const queryClient = useQueryClient();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [eventName, setEventName] = useState('');
  const [customEvent, setCustomEvent] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);

  // Populate state when modal opens or expense changes
  useEffect(() => {
    if (isOpen && expense) {
      setDescription(expense.description || '');
      setAmount(expense.amount ? String(expense.amount) : '');
      setDate(expense.date || new Date().toISOString().split('T')[0]);
      setCategoryName(expense.categoryName || '');
      setCustomCategory('');
      setEventName(expense.eventName || '');
      setCustomEvent('');
    }
  }, [isOpen, expense]);

  // Load existing categories and events for dropdowns
  useEffect(() => {
    if (isOpen && userDetails?.userId) {
      getCategoriesApi(userDetails.userId, currentYearMonth)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setCategories(res.data);
          }
        })
        .catch(console.error);

      getEventsApi(userDetails.userId)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setEvents(res.data);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, userDetails?.userId, currentYearMonth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || !expense?.id) return;

    try {
      setLoading(true);
      const chosenCategory = categoryName === '__NEW__' ? customCategory.trim() : categoryName;
      const chosenEvent = eventName === '__NEW__' ? customEvent.trim() : eventName;

      await updateExpense(expense.id, {
        description: description.trim(),
        amount: parseInt(amount, 10),
        date,
        categoryName: chosenCategory || null,
        eventName: chosenEvent ? chosenEvent : '',
        userId: userDetails.userId,
        yearMonth: currentYearMonth,
      });

      // Invalidate queries so dashboard, expenses feed, categories, and events update immediately
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['months'] });

      onClose();
    } catch (err) {
      console.error('Failed to update expense:', err);
      alert('Failed to update expense. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Expense">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-400 font-medium mb-1.5">Description *</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Grocery Shopping, Uber, Wi-Fi Bill"
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
              placeholder="e.g. 1500"
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

        {/* Category Dropdown */}
        <div>
          <label className="block text-slate-400 font-medium mb-1.5">Category</label>
          <select
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {categoryName && !categories.some((c) => c.name.toLowerCase() === categoryName.toLowerCase()) && (
              <option value={categoryName}>{categoryName}</option>
            )}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
            <option value="__NEW__">+ Create New Category...</option>
          </select>
        </div>

        {categoryName === '__NEW__' && (
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">New Category Name</label>
            <input
              type="text"
              required
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="e.g. Fitness, Pets, Subscriptions"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Event Dropdown */}
        <div>
          <label className="block text-slate-400 font-medium mb-1.5">Event (Optional)</label>
          <select
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">-- No Event Tag --</option>
            {eventName && !events.some((ev) => ev.name.toLowerCase() === eventName.toLowerCase()) && (
              <option value={eventName}>{eventName}</option>
            )}
            {events.map((ev) => (
              <option key={ev.id} value={ev.name}>
                {ev.name}
              </option>
            ))}
            <option value="__NEW__">+ Create New Event...</option>
          </select>
        </div>

        {eventName === '__NEW__' && (
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">New Event Name</label>
            <input
              type="text"
              required
              value={customEvent}
              onChange={(e) => setCustomEvent(e.target.value)}
              placeholder="e.g. Goa Vacation, Diwali, Wedding"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Update Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};
