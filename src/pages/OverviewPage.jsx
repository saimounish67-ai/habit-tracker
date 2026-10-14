import React, { useMemo } from 'react';
import { 
  CheckCircle2, 
  Flame, 
  Calendar, 
  Layers, 
  TrendingUp, 
  Sparkles, 
  Trophy, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { useHabits } from '../context/HabitContext';
import { HabitCard } from '../components/HabitCard';
import { calcTodayStats, calcWeeklyStats } from '../utils/streaks';
import { getWeekDays, dayLabel, isToday, formatShort } from '../utils/dates';
import { ACHIEVEMENT_DEFS } from '../data/constants';

const MOTIVATIONAL_QUOTES = [
  "“We are what we repeatedly do. Excellence, then, is not an act, but a habit.” — Will Durant",
  "“Small daily improvements over time lead to stunning results.” — Robin Sharma",
  "“You do not rise to the level of your goals. You fall to the level of your systems.” — James Clear",
  "“Success is the sum of small efforts, repeated day in and day out.” — Robert Collier",
  "“The secret of your future is hidden in your daily routine.” — Mike Murdock"
];

export function OverviewPage({ onOpenNewHabit, onNavigate, onEditHabit, onDeleteHabit }) {
  const { 
    habits, 
    toggleCompletion, 
    getCurrentOverallStreak, 
    getBestOverallStreak,
    getTotalCheckIns,
    achievements
  } = useHabits();

  // Pick a stable motivational quote based on day of month
  const quote = useMemo(() => {
    const day = new Date().getDate();
    return MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length];
  }, []);

  // Today's Stats
  const todayStats = useMemo(() => calcTodayStats(habits), [habits]);

  // Current Week Stats
  const currentWeekDays = useMemo(() => getWeekDays(new Date()), []);
  const weeklyStats = useMemo(() => calcWeeklyStats(habits, currentWeekDays), [habits, currentWeekDays]);

  const currentStreak = getCurrentOverallStreak();
  const bestStreak = getBestOverallStreak();
  const totalChecks = getTotalCheckIns();

  // Chart data for weekly trend
  const chartData = useMemo(() => {
    return weeklyStats.dailyStats.map(d => ({
      day: dayLabel(d.date),
      fullDate: formatShort(d.date),
      completion: d.pct,
      completed: d.completed,
      eligible: d.eligible,
      isFuture: d.isFuture,
    }));
  }, [weeklyStats]);

  // Unlocked achievements preview
  const recentUnlocked = useMemo(() => {
    return ACHIEVEMENT_DEFS.filter(def => achievements[def.id]).slice(0, 3);
  }, [achievements]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Motivational Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 text-white p-6 sm:p-8 shadow-xl shadow-violet-500/15">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-violet-100 mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Daily Inspiration
            </span>
            <p className="text-sm sm:text-base md:text-lg font-medium leading-relaxed text-violet-50 italic">
              {quote}
            </p>
          </div>

          <button
            onClick={onOpenNewHabit}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-violet-700 hover:bg-violet-50 font-bold text-sm shadow-lg shadow-black/10 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add Habit
          </button>
        </div>
      </div>

      {/* 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Today's Completion */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm card-hover-glow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Today's Progress
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
                {todayStats.percentage}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ({todayStats.done}/{todayStats.total} done)
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${todayStats.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Current Streak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm card-hover-glow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Current Streak
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-amber-500" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
                {currentStreak}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                days in a row
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
              All-time record: <strong className="text-slate-800 dark:text-slate-200">{bestStreak} days</strong>
            </p>
          </div>
        </div>

        {/* Metric 3: Weekly Completion */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm card-hover-glow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Weekly Accuracy
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
                {weeklyStats.percentage}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                of scheduled days
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500"
                style={{ width: `${weeklyStats.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 4: Total Active Habits */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm card-hover-glow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Habits
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
                {habits.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                routines tracked
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Total check-ins: <strong className="text-slate-800 dark:text-slate-200 font-mono">{totalChecks}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Checklist & Weekly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Today's Checklist
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {todayStats.done}/{todayStats.total}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tick off habits as you complete them throughout the day
              </p>
            </div>

            <button
              onClick={() => onNavigate('habits')}
              className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 flex items-center gap-1 group"
            >
              Manage habits
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Habit Cards List */}
          {habits.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                No habits defined yet
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-5">
                Start building your daily rituals. Add your first habit or choose from popular presets in just 10 seconds.
              </p>
              <button
                onClick={onOpenNewHabit}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-violet-500/25 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Create First Habit
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map(habit => (
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

        {/* Right 1 Col: Weekly Completion Chart & Achievements Preview */}
        <div className="space-y-6">
          {/* 7-Day Activity Chart */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  7-Day Trend
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Daily consistency percentage
                </p>
              </div>
              <button
                onClick={() => onNavigate('weekly')}
                className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline"
              >
                Full view
              </button>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0, 100]}
                    ticks={[0, 50, 100]}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-slate-700">
                            <p className="font-bold">{data.day} ({data.fullDate})</p>
                            <p className="text-violet-300 font-mono mt-0.5">
                              {data.isFuture ? 'Upcoming day' : `${data.completion}% completed`}
                            </p>
                            {!data.isFuture && (
                              <p className="text-slate-400 text-[10px]">
                                {data.completed} of {data.eligible} habits
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completion" 
                    stroke="#8b5cf6" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#trendGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                Unlocked Badges
              </h4>
              <button
                onClick={() => onNavigate('achievements')}
                className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline"
              >
                View all ({Object.keys(achievements).length}/{ACHIEVEMENT_DEFS.length})
              </button>
            </div>

            {recentUnlocked.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
                Complete daily routines to unlock achievement trophies!
              </p>
            ) : (
              <div className="space-y-2.5">
                {recentUnlocked.map(def => (
                  <div 
                    key={def.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                      🏆
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {def.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {def.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
