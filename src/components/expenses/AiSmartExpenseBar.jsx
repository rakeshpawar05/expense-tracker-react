import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { parseExpenseTextApi } from '../../api/aiApi';
import { createExpense } from '../../api/expenseApi';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Sparkles,
  ArrowRight,
  Check,
  Calendar,
  Tag,
  PartyPopper,
  Edit3,
  X,
  Loader2,
  Wand2,
} from 'lucide-react';

const EXAMPLE_PROMPTS = [
  'Dinner ₹1,450 at Social yesterday for Goa trip',
  'Uber ₹450 to Airport',
  'Swiggy ₹620 food',
  'Groceries ₹2,400 at Blinkit',
];

export const AiSmartExpenseBar = ({ onOpenModalWithData }) => {
  const { userDetails, currentYearMonth } = useAuth();
  const queryClient = useQueryClient();

  const [input, setInput] = useState('');
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleParse = async (customText) => {
    const textToParse = (customText || input).trim();
    if (!textToParse || parsing) return;

    try {
      setParsing(true);
      setParsedResult(null);
      setSuccessMsg(null);

      const res = await parseExpenseTextApi({
        userId: userDetails?.userId,
        text: textToParse,
        defaultDate: new Date().toISOString().split('T')[0],
        yearMonth: currentYearMonth,
      });

      if (res.data && res.data.description && res.data.amount) {
        setParsedResult(res.data);
      } else {
        alert('Could not detect amount or description. Please try with more details.');
      }
    } catch (err) {
      console.error('Failed to parse text:', err);
      alert('Failed to parse text. Please ensure backend is reachable.');
    } finally {
      setParsing(false);
    }
  };

  const handleConfirmSave = async () => {
    if (!parsedResult || saving) return;

    try {
      setSaving(true);
      await createExpense({
        description: parsedResult.description,
        amount: parsedResult.amount,
        date: parsedResult.date,
        categoryName: parsedResult.categoryName || 'General',
        eventName: parsedResult.eventName || null,
        userId: userDetails.userId,
        yearMonth: currentYearMonth,
      });

      // Invalidate queries so feed, dashboard, categories, events, and AI insight update
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['months'] });
      queryClient.invalidateQueries({ queryKey: ['aiMonthlyInsight'] });

      setSuccessMsg(`Logged "${parsedResult.description}" for ₹${parsedResult.amount.toLocaleString('en-IN')}!`);
      setParsedResult(null);
      setInput('');

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to save parsed expense:', err);
      alert('Failed to save expense. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditInModal = () => {
    if (!parsedResult) return;
    if (onOpenModalWithData) {
      onOpenModalWithData(parsedResult);
    }
    setParsedResult(null);
    setInput('');
  };

  return (
    <div className="space-y-3">
      {/* Smart Input Container with Glowing Gradient Border */}
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500/50 via-purple-500/30 to-pink-500/30 shadow-lg shadow-indigo-950/20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleParse();
          }}
          className="rounded-[15px] bg-slate-950/90 backdrop-blur-xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 relative z-10"
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 flex-shrink-0">
              {parsing ? (
                <Loader2 size={16} className="animate-spin text-indigo-400" />
              ) : (
                <Wand2 size={16} className="animate-pulse" />
              )}
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="✨ Magic Quick-Add: Type naturally or paste SMS (e.g. 'Dinner ₹1,450 yesterday at Social')..."
              className="w-full bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-0 px-1"
            />

            {input && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="text-slate-500 hover:text-slate-300 p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end flex-shrink-0">
            <Button
              type="submit"
              disabled={!input.trim() || parsing}
              size="sm"
              className="gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/30"
            >
              {parsing ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Parsing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  <span>Magic Parse</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Quick Example Chips */}
      {!parsedResult && !successMsg && (
        <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400 px-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex-shrink-0">
            Try:
          </span>
          {EXAMPLE_PROMPTS.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInput(ex);
                handleParse(ex);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition flex-shrink-0 cursor-pointer"
            >
              "{ex}"
            </button>
          ))}
        </div>
      )}

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-emerald-400" />
            <span className="font-medium">{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-400 hover:text-emerald-200 text-xs"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Parsed Result Confirmation Card */}
      {parsedResult && (
        <GlassCard className="p-4 border-indigo-500/40 bg-slate-950/95 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-400" />
                <span>AI Detected Transaction Details</span>
              </h4>
            </div>

            <button
              onClick={() => setParsedResult(null)}
              className="text-slate-500 hover:text-slate-300"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            {/* Description */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Description</span>
              <span className="font-semibold text-white truncate block">
                {parsedResult.description}
              </span>
            </div>

            {/* Amount */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Amount</span>
              <span className="font-mono font-bold text-rose-400 text-sm">
                -₹{parsedResult.amount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Date */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Date</span>
              <span className="font-mono text-slate-200 flex items-center gap-1 text-[11px]">
                <Calendar size={12} className="text-slate-500" />
                {parsedResult.date}
              </span>
            </div>

            {/* Category & Event */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Category & Tag</span>
              <div className="flex items-center gap-1 flex-wrap">
                <Badge variant="primary" className="text-[10px] py-0 px-1.5">
                  {parsedResult.categoryName || 'General'}
                </Badge>
                {parsedResult.eventName && (
                  <Badge variant="purple" className="text-[10px] py-0 px-1.5">
                    {parsedResult.eventName}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setParsedResult(null)}
              disabled={saving}
            >
              Discard
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleEditInModal}
              disabled={saving}
              className="gap-1.5"
            >
              <Edit3 size={13} />
              <span>Review in Modal</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleConfirmSave}
              loading={saving}
              className="gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20"
            >
              <Check size={14} />
              <span>Confirm & Save (1-Click)</span>
            </Button>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
