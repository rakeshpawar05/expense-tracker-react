import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { createExpense } from '../../api/expenseApi';
import { getCategoriesApi } from '../../api/categoryApi';
import { getEventsApi } from '../../api/eventApi';
import { useAuth } from '../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export const AddExpenseModal = ({ isOpen, onClose }) => {
  const { userDetails, currentYearMonth } = useAuth();
  const queryClient = useQueryClient();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [categoryName, setCategoryName] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (isOpen && userDetails?.userId) {
      // Fetch available categories and events
      getCategoriesApi(userDetails.userId, currentYearMonth)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setCategories(res.data);
            if (res.data.length > 0) setCategoryName(res.data[0].name);
          }
        })
        .catch(console.error);

      getEventsApi(userDetails.userId)
        .then((res) => {
          if (Array.isArray(res.data)) setEvents(res.data);
        })
        .catch(console.error);
    }
  }, [isOpen, userDetails?.userId, currentYearMonth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    try {
      setLoading(true);
      const chosenCategory = categoryName === '__NEW__' ? customCategory.trim() : categoryName;

      await createExpense({
        description: description.trim(),
        amount: parseInt(amount, 10),
        date,
        categoryName: chosenCategory || 'General',
        eventName: eventName.trim() || null,
        userId: userDetails.userId,
        yearMonth: currentYearMonth,
      });

      // Invalidate queries so dashboard and feed update immediately
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });

      // Reset form
      setDescription('');
      setAmount('');
      setCustomCategory('');
      setEventName('');
      onClose();
    } catch (err) {
      console.error('Failed to create expense:', err);
      alert('Failed to save expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record New Expense">
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

        <div>
          <label className="block text-slate-400 font-medium mb-1.5">Category</label>
          <select
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
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

        <div>
          <label className="block text-slate-400 font-medium mb-1.5">Event Tag (Optional)</label>
          <input
            type="text"
            list="eventsList"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. Goa Vacation, Diwali, Wedding"
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <datalist id="eventsList">
            {events.map((ev) => (
              <option key={ev.id} value={ev.name} />
            ))}
          </datalist>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Save Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};
