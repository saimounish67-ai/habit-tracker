import React, { useState } from 'react';
import { 
  Check, 
  Flame, 
  Clock, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Trophy,
  Sparkles
} from 'lucide-react';
import { HabitIcon } from './HabitIcon';
import { calcCurrentStreak, calcBestStreak } from '../utils/streaks';
import { todayKey } from '../utils/dates';

export function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [justChecked, setJustChecked] = useState(false);

  const today = todayKey();
  const isCompletedToday = Boolean(habit.completions && habit.completions[today]);
  const currentStreak = calcCurrentStreak(habit.completions);
  const bestStreak = calcBestStreak(habit.completions);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isCompletedToday) {
      setJustChecked(true);
      setTimeout(() => setJustChecked(false), 600);
    }
    onToggle(habit.id);
  };

  return (
    <div 
      className={`group relative rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border transition-all duration-300 card-hover-glow ${
        isCompletedToday 
          ? 'border-violet-300 dark:border-violet-900/60 bg-gradient-to-br from-violet-50/40 to-white dark:from-violet-950/20 dark:to-slate-900' 
          : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Colour accent strip */}
      <div 
        className="absolute top-4 bottom-4 left-0 w-1.5 rounded-r-full transition-all duration-300 group-hover:w-2"
        style={{ backgroundColor: habit.colour || '#8b5cf6' }}
      />

      <div className="flex items-start justify-between gap-3 pl-2">
        {/* Habit Icon & Info */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-transform duration-300 group-hover:scale-105"
            style={{ 
              backgroundColor: `${habit.colour}18`,
              color: habit.colour || '#8b5cf6',
              boxShadow: `0 4px 12px ${habit.colour}25`
            }}
          >
            <HabitIcon name={habit.icon} className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`font-bold text-sm sm:text-base tracking-tight truncate transition-colors ${
                isCompletedToday 
                  ? 'text-slate-800 dark:text-slate-200 line-through decoration-slate-400/60 decoration-2' 
                  : 'text-slate-900 dark:text-white'
              }`}>
                {habit.name}
              </h3>
            </div>

            {/* Streak & Info Badges */}
            <div className="flex items-center flex-wrap gap-2 mt-1.5">
              {/* Streak badge */}
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                <Flame className={`w-3.5 h-3.5 ${currentStreak > 0 ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                <span className="font-mono">{currentStreak}</span>
                <span className="text-[10px] text-amber-500/80">streak</span>
              </div>

              {/* Best streak */}
              {bestStreak > 0 && (
                <div className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  <Trophy className="w-3 h-3 text-amber-500" />
                  <span className="font-mono">Best: {bestStreak}d</span>
                </div>
              )}

              {/* Reminder time */}
              {habit.reminder && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-200/60 dark:border-violet-800/60">
                  <Clock className="w-3 h-3" />
                  <span>{habit.reminder}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions menu & Completion Checkbox */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Context Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Habit options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setMenuOpen(false)} 
                />
                <div className="absolute right-0 top-8 z-30 w-36 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 animate-in fade-in zoom-in-95">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onEdit(habit);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 text-slate-400" />
                    Edit Habit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onDelete(habit);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Completion Check Button */}
          <button
            onClick={handleToggle}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
              isCompletedToday
                ? 'bg-violet-600 text-white shadow-violet-500/30 scale-100'
                : 'bg-slate-100 dark:bg-slate-800 text-transparent hover:text-slate-300 dark:hover:text-slate-600 border border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 hover:scale-105'
            } ${justChecked ? 'animate-bounce' : ''}`}
            aria-label={isCompletedToday ? 'Mark habit as incomplete' : 'Mark habit as completed'}
            title={isCompletedToday ? 'Completed today! Click to undo' : 'Click to complete for today'}
          >
            <Check className={`w-5 h-5 stroke-[2.5] transition-transform duration-200 ${
              isCompletedToday ? 'scale-100 text-white' : 'scale-75'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}
