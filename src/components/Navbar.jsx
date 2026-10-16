import React from 'react';
import { Menu, X } from 'lucide-react';

const NAV_TABS = ["Home", "Counter", "Report", "History", "Settings", "About"];

export default function Navbar({ activeTab, onTabSelect, isMobileMenuOpen, onToggleMobileMenu, darkMode, clickKey }) {
  return (
    <header
      className="w-full sticky top-0 z-40"
      style={{
        background: darkMode ? "#111827" : "#ffffff",
        borderBottom: `1px solid ${darkMode ? "#1f2937" : "#e5e7eb"}`,
        height: "64px"
      }}
    >
      <div className="max-w-[1280px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onTabSelect && onTabSelect("Home")}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg transition-opacity hover:opacity-90"
          aria-label="Currency Counter Home"
        >
          <img
            src="/icon-192.png"
            alt="Currency Counter Logo"
            className="w-9 h-9 object-contain flex-shrink-0"
            style={{ imageRendering: "crisp-edges" }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: "17px",
              color: darkMode ? "#f1f5f9" : "#0f172a",
              letterSpacing: "-0.01em"
            }}
          >
            Currency Counter
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabSelect(tab)}
                style={
                  isActive
                    ? {
                        background: "#16a34a",
                        color: "white",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        fontWeight: 600,
                        fontSize: "14px"
                      }
                    : {
                        background: "transparent",
                        color: darkMode ? "#9ca3af" : "#6b7280",
                        padding: "8px 14px",
                        fontWeight: 500,
                        fontSize: "14px",
                        borderRadius: "8px"
                      }
                }
                className={`transition-colors ${!isActive ? (darkMode ? "hover:text-white" : "hover:text-black") : ""}`}
                data-nav-click={clickKey}
              >
                {tab}
              </button>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button (hidden as bottom navigation is used on mobile & tab) */}
        <button
          onClick={onToggleMobileMenu}
          className="hidden inline-flex items-center justify-center w-9 h-9 rounded-md"
          style={{ color: darkMode ? "#e5e7eb" : "#111827" }}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden absolute left-0 top-[64px] w-full border-t shadow-sm"
          style={{
            background: darkMode ? "#111827" : "#ffffff",
            borderColor: darkMode ? "#1f2937" : "#e5e7eb"
          }}
        >
          <div className="px-2 py-3 flex flex-col gap-1">
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => onTabSelect(tab)}
                  style={
                    isActive
                      ? {
                          background: "#16a34a",
                          color: "white",
                          borderRadius: "8px",
                          padding: "10px 14px",
                          fontWeight: 600,
                          textAlign: "left"
                        }
                      : {
                          background: "transparent",
                          color: darkMode ? "#9ca3af" : "#6b7280",
                          padding: "10px 14px",
                          fontWeight: 500,
                          textAlign: "left",
                          borderRadius: "8px"
                        }
                  }
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
