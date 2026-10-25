import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { useAuth } from '../../context/AuthContext';
import { AiCategoryAuditCard } from '../categories/AiCategoryAuditCard';
import { AiEventAuditCard } from '../events/AiEventAuditCard';
import { AiMonthDeltaCard } from '../months/AiMonthDeltaCard';
import { Calendar, Plus, ExternalLink, Receipt, Trash2, Edit3 } from 'lucide-react';

export const ExpenseListModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badgeText,
  badgeVariant = 'primary',
  expenses = [],
  totalAmount = null,
  categoryData = null,
  eventData = null,
  monthData = null,
  onAddExpense = null,
  onNavigateToFeed = null,
  onEditExpense = null,
  onDeleteExpense = null,
}) => {
  const { userDetails, currentYearMonth, availableMonths } = useAuth();
  const calculatedTotal =
    totalAmount !== null
      ? totalAmount
      : expenses.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-2xl">
      <div className="space-y-4">
        {/* Header Summary Bar */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Total Spent</span>
              {badgeText && (
                <Badge variant={badgeVariant} className="text-[10px] py-0 px-2">
                  {badgeText}
                </Badge>
              )}
            </div>
            {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          <div className="text-right">
            <span className="text-base font-extrabold text-rose-400 font-mono">
              ₹{calculatedTotal.toLocaleString('en-IN')}
            </span>
            <p className="text-[10px] text-slate-500">
              {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Optional AI Category Audit */}
        {categoryData && (
          <AiCategoryAuditCard
            category={categoryData}
            yearMonth={currentYearMonth}
            userId={userDetails?.userId}
          />
        )}

        {/* Optional AI Event Debrief */}
        {eventData && (
          <AiEventAuditCard
            event={eventData}
            userId={userDetails?.userId}
          />
        )}

        {/* Optional AI Month-over-Month Delta Audit */}
        {monthData && (
          <AiMonthDeltaCard
            userId={userDetails?.userId}
            currentYearMonth={monthData.yearMonth || monthData.name}
            availableMonths={availableMonths}
          />
        )}

        {/* Expenses List */}
        <div className="space-y-2">
          {expenses.length === 0 ? (
            <div className="text-center py-10 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <Receipt size={28} className="mx-auto text-slate-600 mb-2" />
              <p className="text-xs text-slate-400 font-medium">No expenses recorded here yet.</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Expenses tagged under this will appear automatically.
              </p>
            </div>
          ) : (
            expenses.map((expense, idx) => (
              <div
                key={expense.id || idx}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 group transition"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white tracking-tight truncate">
                    {expense.description}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-slate-400 text-[10px]">
                      <Calendar size={11} className="text-slate-500" />
                      {expense.date}
                    </span>
                    {expense.categoryName && (
                      <Badge variant="primary" className="text-[9px] py-0 px-1.5">
                        {expense.categoryName}
                      </Badge>
                    )}
                    {expense.eventName && (
                      <Badge variant="purple" className="text-[9px] py-0 px-1.5">
                        {expense.eventName}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-bold text-rose-400 font-mono">
                    -₹{(expense.amount || 0).toLocaleString('en-IN')}
                  </span>
                  {onEditExpense && (
                    <button
                      onClick={() => onEditExpense(expense)}
                      className="p-1 rounded text-slate-500 hover:text-indigo-300 hover:bg-indigo-500/10 transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      title="Edit"
                    >
                      <Edit3 size={13} />
                    </button>
                  )}
                  {onDeleteExpense && (
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <div>
            {onNavigateToFeed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateToFeed}
                className="gap-1.5 text-indigo-400 hover:text-indigo-300"
              >
                <span>Go to Expenses Page</span>
                <ExternalLink size={13} />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onAddExpense && (
              <Button size="sm" onClick={onAddExpense} className="gap-1">
                <Plus size={14} />
                <span>Add Expense</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
