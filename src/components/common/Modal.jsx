import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      const origBodyOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = origBodyOverflow || '';
        document.documentElement.style.overflow = origHtmlOverflow || '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-hidden overscroll-contain">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] flex flex-col rounded-2xl glass-panel border border-slate-700/80 shadow-2xl shadow-black/80 z-10 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Always-Visible Close Button */}
        <div className="flex-shrink-0 px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-800/90 bg-slate-900/95 backdrop-blur-md flex items-center justify-between gap-3 sticky top-0 z-20">
          <h3 className="text-sm font-bold text-white tracking-tight truncate pr-2">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700 hover:border-slate-600 active:scale-95 flex items-center justify-center transition flex-shrink-0 shadow-sm"
          >
            <X size={17} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
