import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Tags,
  Calendar,
  PartyPopper,
  Sparkles,
  LogOut,
  Radio,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePing } from '../../context/PingContext';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/savings', label: 'Savings', icon: PiggyBank },
  { to: '/categories', label: 'Categories', icon: Tags },
  { to: '/months', label: 'Months', icon: Calendar },
  { to: '/events', label: 'Events', icon: PartyPopper },
  { to: '/chatbot', label: 'AI Assistant', icon: Sparkles, badge: 'AI' },
];

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { userDetails, logout } = useAuth();
  const { isBackendActive } = usePing();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-50 w-64 glass-panel border-r border-slate-800/80 p-5 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div>
          {/* Logo / App Name */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/25">
                ₹
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  ExpenseFlow
                </h1>
                <p className="text-[11px] text-slate-400">Wealth & Budget</p>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group',
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-inner'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} className="transition-transform group-hover:scale-110" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer: User profile & Live status */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          {/* Service Ping Status */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px]">
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  'w-2 h-2 rounded-full',
                  isBackendActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                )}
              />
              <span className="text-slate-400 font-medium">
                {isBackendActive ? 'Backend Active' : 'Backend Connecting'}
              </span>
            </div>
            <Radio size={13} className={isBackendActive ? 'text-emerald-400' : 'text-slate-500'} />
          </div>

          {/* User Account & Logout */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold text-xs uppercase flex-shrink-0">
                {userDetails?.name ? userDetails.name.charAt(0) : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {userDetails?.name || 'User'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">Online</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
