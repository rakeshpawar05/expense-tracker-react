import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendAiChat } from '../api/aiApi';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { FormattedMessage } from '../components/chatbot/FormattedMessage';
import {
  Sparkles,
  Send,
  Bot,
  User,
  RotateCcw,
  Copy,
  Check,
  TrendingDown,
  PieChart,
  Calendar,
  Zap,
} from 'lucide-react';

const SUGGESTIONS = [
  { label: 'Total spend this month', icon: Calendar, query: 'How much did I spend this month?' },
  { label: 'Category breakdown', icon: PieChart, query: 'Give me a summary of my category spending for this month' },
  { label: 'Top 5 expenses', icon: TrendingDown, query: 'What are my top expenses this month?' },
  { label: 'March 2026 summary', icon: Zap, query: 'Give me a summary of my category spending for March 2026' },
];

export const ChatbotPage = () => {
  const { userDetails, currentYearMonth } = useAuth();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello, **${userDetails?.name || 'there'}**! 👋 \n\nI'm your **AI Financial Advisor** powered by **Groq GPT-OSS**. I can analyze your transactions, calculate category totals, identify budget leaks, and answer questions about your monthly spending.\n\nAsk me anything or pick one of the suggestions below!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendAiChat(userDetails?.userId, userMsg.text);
      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: typeof res.data === 'string' ? res.data : JSON.stringify(res.data),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Sorry, I encountered an issue connecting to the AI service. Please ensure the backend server is reachable and try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: `Chat reset. I'm ready to answer any new questions about your spending in **${currentYearMonth}** or previous billing cycles!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
                <Sparkles size={20} className="animate-pulse" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
            </span>
          </div>

          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>AI Financial Advisor</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                Groq GPT-OSS
              </span>
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              <span>Real-time analysis on your financial records</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          title="Reset conversation"
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition"
        >
          <RotateCcw size={13} />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Main Glassmorphism Chat Container */}
      <GlassCard className="p-0 overflow-hidden flex flex-col h-[650px] border-slate-800/90 shadow-2xl relative">
        {/* Ambient Glowing Background Elements */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 relative z-10">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Bot Avatar */}
              {msg.sender === 'bot' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-950 to-slate-900 border border-indigo-500/30 text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-950/40 mt-0.5">
                  <Bot size={17} />
                </div>
              )}

              {/* Message Bubble Container */}
              <div
                className={`group relative max-w-xl transition-all ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`rounded-2xl px-5 py-3.5 text-xs shadow-xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white rounded-tr-sm shadow-indigo-600/20'
                      : 'bg-slate-900/90 backdrop-blur-md border border-slate-700/70 text-slate-200 rounded-tl-sm shadow-slate-950/60'
                  }`}
                >
                  {msg.sender === 'bot' ? (
                    <FormattedMessage content={msg.text} />
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}

                  {/* Message Timestamp & Status */}
                  <div
                    className={`text-[10px] mt-2 flex items-center gap-2 font-mono ${
                      msg.sender === 'user' ? 'text-indigo-200/75 justify-end' : 'text-slate-500'
                    }`}
                  >
                    <span>{msg.time}</span>
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        title="Copy message"
                        className="opacity-0 group-hover:opacity-100 hover:text-indigo-300 transition-opacity ml-1"
                      >
                        {copiedId === msg.id ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Check size={11} /> Copied
                          </span>
                        ) : (
                          <Copy size={11} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* User Avatar */}
              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 border border-indigo-400/40 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md shadow-indigo-600/30 mt-0.5">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-start gap-3.5 animate-in fade-in duration-200">
              <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot size={17} />
              </div>
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-xl flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Analyzing expense database with Groq...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompt Chips */}
        <div className="px-4 py-2.5 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-sm flex items-center gap-2 overflow-x-auto relative z-10">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1 flex-shrink-0">
            <Sparkles size={11} className="text-indigo-400" /> Prompts:
          </span>
          {SUGGESTIONS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(item.query)}
                disabled={loading}
                className="text-[11px] text-slate-300 hover:text-white bg-slate-900/90 hover:bg-indigo-950/50 hover:border-indigo-500/50 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-1.5 flex-shrink-0 transition-all shadow-sm"
              >
                <Icon size={12} className="text-indigo-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3.5 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center gap-2.5 relative z-10"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. 'How much did I spend in March 2026?')..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
            />
          </div>

          <Button
            type="submit"
            disabled={!input.trim() || loading}
            size="md"
            className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/30"
          >
            <Send size={14} />
            <span className="hidden sm:inline font-semibold">Send</span>
          </Button>
        </form>
      </GlassCard>
    </div>
  );
};
