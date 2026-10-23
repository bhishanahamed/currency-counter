import React from 'react';
import {
  Home,
  Calculator,
  Receipt,
  History,
  Settings,
  Info
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'Home', label: 'Home', icon: Home },
  { id: 'Counter', label: 'Counter', icon: Calculator },
  { id: 'Report', label: 'Report', icon: Receipt },
  { id: 'History', label: 'History', icon: History },
  { id: 'Settings', label: 'Settings', icon: Settings },
  { id: 'About', label: 'About', icon: Info },
];

export default function BottomNav({ activeTab, onTabSelect, darkMode }) {
  const handleItemClick = (tabId) => {
    // Subtle haptic feedback on supported mobile devices
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(8);
      } catch (err) {
        // Ignore vibration errors
      }
    }
    if (onTabSelect) {
      onTabSelect(tabId);
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Mobile and Tablet Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden no-print select-none transition-colors duration-200"
      style={{
        background: darkMode ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: `1px solid ${darkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(226, 232, 240, 0.9)'}`,
        boxShadow: darkMode
          ? '0 -4px 25px rgba(0, 0, 0, 0.45)'
          : '0 -4px 20px rgba(0, 0, 0, 0.05)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)'
      }}
    >
      <div className="max-w-xl md:max-w-2xl mx-auto px-1.5 sm:px-4 pt-1 sm:pt-1.5">
        <div className="grid grid-cols-6 items-center justify-items-stretch gap-0.5 sm:gap-1">
          {NAV_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleItemClick(item.id);
                }}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className="group relative flex flex-col items-center justify-center py-1 sm:py-1.5 px-0.5 sm:px-2 rounded-xl outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 active:scale-95 transition-all duration-150"
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span
                    className="absolute top-0 w-7 sm:w-8 h-[3px] rounded-full transition-all duration-200"
                    style={{
                      background: darkMode ? '#34d399' : '#16a34a',
                      boxShadow: darkMode ? '0 0 10px rgba(52, 211, 153, 0.6)' : '0 0 8px rgba(22, 163, 74, 0.4)'
                    }}
                  />
                )}

                {/* Icon Wrapper with pill highlight */}
                <div
                  className={`flex items-center justify-center w-9 h-7 sm:w-10 sm:h-8 rounded-lg transition-all duration-150 ${
                    isActive
                      ? darkMode
                        ? 'bg-emerald-500/20 text-emerald-400 scale-105'
                        : 'bg-emerald-50 text-emerald-600 scale-105'
                      : darkMode
                        ? 'text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800/40'
                        : 'text-slate-500 group-hover:text-slate-900 group-hover:bg-slate-100/70'
                  }`}
                >
                  <IconComponent
                    size={20}
                    className="sm:w-[21px] sm:h-[21px] transition-transform duration-150"
                    strokeWidth={isActive ? 2.3 : 1.9}
                  />
                </div>

                {/* Tab Label */}
                <span
                  className={`mt-0.5 text-[10px] sm:text-[11px] leading-tight text-center truncate max-w-full tracking-tight transition-colors duration-150 ${
                    isActive
                      ? darkMode
                        ? 'font-bold text-emerald-400'
                        : 'font-bold text-emerald-700'
                      : darkMode
                        ? 'font-medium text-slate-400 group-hover:text-slate-200'
                        : 'font-medium text-slate-500 group-hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
