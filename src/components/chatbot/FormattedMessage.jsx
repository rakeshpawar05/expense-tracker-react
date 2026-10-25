import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const FormattedMessage = ({ content }) => {
  if (!content) return null;

  return (
    <div className="formatted-ai-response text-xs leading-relaxed space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-slate-700/80 bg-slate-950/70 shadow-lg">
              <table className="w-full text-left border-collapse text-xs" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead
              className="bg-indigo-950/50 border-b border-slate-700/90 text-[11px] font-semibold text-indigo-300 uppercase tracking-wider"
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th className="px-4 py-2.5 text-indigo-300 font-semibold" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-slate-800/80" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-slate-800/40 transition-colors" {...props} />
          ),
          td: ({ node, children, ...props }) => {
            const textContent = String(children);
            const isRupee = textContent.includes('₹');
            return (
              <td
                className={`px-4 py-2.5 ${
                  isRupee
                    ? 'font-mono font-bold text-emerald-400'
                    : 'text-slate-200'
                }`}
                {...props}
              >
                {children}
              </td>
            );
          },
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-white tracking-wide" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-2 last:mb-0 leading-relaxed text-slate-200" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="space-y-1.5 my-2 list-disc list-inside text-slate-300" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="space-y-1.5 my-2 list-decimal list-inside text-slate-300" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed marker:text-indigo-400" {...props} />
          ),
          code: ({ node, inline, ...props }) => (
            <code
              className="bg-slate-800/80 border border-slate-700/60 rounded px-1.5 py-0.5 font-mono text-[11px] text-indigo-300"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
