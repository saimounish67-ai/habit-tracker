import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarDays, 
  Grid3X3, 
  Trophy, 
  Settings, 
  Flame, 
  Sparkles,
  Zap,
  X
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'habits', label: 'My Habits', icon: CheckSquare },
  { id: 'weekly', label: 'Weekly Progress', icon: CalendarDays },
  { id: 'heatmap', label: 'Activity Heatmap', icon: Grid3X3 },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ currentTab, onTabChange, mobileOpen, onCloseMobile }) {
  const { getCurrentOverallStreak, getBestOverallStreak, habits, achievements } = useHabits();

  const currentStreak = getCurrentOverallStreak();
  const bestStreak = getBestOverallStreak();
  const unlockedBadgesCount = Object.keys(achievements).length;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Tagline */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  HabitFlow
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
                    Pro
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Build Better, One Day at a Time
                </p>
              </div>
            </div>

            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                  <span className="flex-1">{item.label}</span>
                  {item.id === 'habits' && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {habits.length}
                    </span>
                  )}
                  {item.id === 'achievements' && unlockedBadgesCount > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    }`}>
                      {unlockedBadgesCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Motivational Card at bottom */}
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-violet-900 to-indigo-950 text-white border border-violet-800/50 shadow-xl shadow-violet-950/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-24 h-24 bg-violet-500/20 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-400 shadow-inner">
                  <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-200">
                  Global Streak
                </span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 font-mono text-violet-200">
                Best: {bestStreak}d
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mb-1.5">
              <span className="text-3xl font-extrabold tracking-tight font-mono text-white">
                {currentStreak}
              </span>
              <span className="text-xs font-medium text-violet-300">
                consecutive days
              </span>
            </div>

            <p className="text-xs text-violet-200/80 leading-relaxed">
              {currentStreak === 0 
                ? 'Check in your first habit today to spark your daily routine!'
                : currentStreak < 7
                ? 'Momentum is building! Keep going towards the 7-day milestone.'
                : 'Unstoppable discipline. You are forming permanent life habits!'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
