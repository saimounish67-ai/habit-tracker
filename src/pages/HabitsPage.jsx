import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Sparkles, Flame, Trophy, Clock, CheckCircle2 } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { HabitCard } from '../components/HabitCard';
import { todayKey } from '../utils/dates';

export function HabitsPage({ onOpenNewHabit, onEditHabit, onDeleteHabit, searchQuery }) {
  const { habits, toggleCompletion } = useHabits();
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const today = todayKey();

  const filteredHabits = useMemo(() => {
    return habits.filter(h => {
      // Search query
      const matchesSearch = !searchQuery || h.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Filter status
      const isDone = Boolean(h.completions && h.completions[today]);
      if (filter === 'completed') return isDone;
      if (filter === 'pending') return !isDone;
      return true;
    });
  }, [habits, searchQuery, filter, today]);

  const completedCount = habits.filter(h => h.completions && h.completions[today]).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Title and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Habits
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your daily routine, monitor streaks, and configure reminders
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Status Filters */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              All ({habits.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'pending'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Pending ({habits.length - completedCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'completed'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Done ({completedCount})
            </button>
          </div>

          <button
            onClick={onOpenNewHabit}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-violet-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Habit</span>
          </button>
        </div>
      </div>

      {/* Habits Grid */}
      {filteredHabits.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No habits match your criteria
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
            {searchQuery ? `No habits found matching "${searchQuery}"` : 'Get started by creating your first daily habit'}
          </p>
          <button
            onClick={onOpenNewHabit}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold transition-all"
          >
            Create Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHabits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={toggleCompletion}
              onEdit={onEditHabit}
              onDelete={onDeleteHabit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
