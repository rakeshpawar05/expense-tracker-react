import React from 'react';
import { Menu, Plus, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const Header = ({ onOpenMobile, onOpenAddModal }) => {
  const { currentYearMonth, setCurrentYearMonth, availableMonths } = useAuth();

  const formatMonthDisplay = (ymStr) => {
    if (!ymStr) return '';
    try {
      const [year, month] = ymStr.split('-');
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return ymStr;
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 lg:hidden transition"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-xs font-semibold text-slate-400">Current Billing Cycle</h2>
          <p className="text-sm font-bold text-white">{formatMonthDisplay(currentYearMonth)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Month Selector Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200">
            <CalendarIcon size={14} className="text-indigo-400 flex-shrink-0" />
            <select
              value={currentYearMonth}
              onChange={(e) => setCurrentYearMonth(e.target.value)}
              className="bg-transparent text-xs text-white appearance-none pr-6 focus:outline-none cursor-pointer"
            >
              {availableMonths && availableMonths.length > 0 ? (
                availableMonths.map((ym) => (
                  <option key={ym} value={ym} className="bg-slate-900 text-white">
                    {formatMonthDisplay(ym)}
                  </option>
                ))
              ) : (
                <option value={currentYearMonth} className="bg-slate-900 text-white">
                  {formatMonthDisplay(currentYearMonth)}
                </option>
              )}
            </select>
            <ChevronDown size={14} className="text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Quick Add Expense Action */}
        <Button onClick={onOpenAddModal} size="md" className="shadow-indigo-600/30">
          <Plus size={16} />
          <span className="hidden sm:inline">Add Expense</span>
        </Button>
      </div>
    </header>
  );
};
