import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Check, 
  X, 
  Info,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { useHabits } from '../context/HabitContext';
import { HabitIcon } from '../components/HabitIcon';
import { getWeekDays, addDays, dateToKey, formatShort, dayLabel, isToday } from '../utils/dates';
import { calcWeeklyStats } from '../utils/streaks';

export function WeeklyPage() {
  const { habits } = useHabits();
  const [weekOffset, setWeekOffset] = useState(0);

  // Compute the 7 days for the selected week
  const weekDays = useMemo(() => {
    const base = addDays(new Date(), weekOffset * 7);
    return getWeekDays(base);
  }, [weekOffset]);

  const weeklyStats = useMemo(() => {
    return calcWeeklyStats(habits, weekDays);
  }, [habits, weekDays]);

  const dateRangeLabel = `${formatShort(weekDays[0])} – ${formatShort(weekDays[6])}, ${weekDays[0].getFullYear()}`;

  // Chart data
  const chartData = useMemo(() => {
    return weeklyStats.dailyStats.map(d => ({
      name: dayLabel(d.date),
      fullDate: formatShort(d.date),
      pct: d.pct,
      completed: d.completed,
      eligible: d.eligible,
      isFuture: d.isFuture,
    }));
  }, [weeklyStats]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls: Week Navigator & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setWeekOffset(w => w - 1)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              disabled={weekOffset === 0}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                weekOffset === 0 
                  ? 'text-violet-600 dark:text-violet-400 bg-white dark:bg-slate-700 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setWeekOffset(w => w + 1)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              aria-label="Next week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-500" />
              {dateRangeLabel}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monday to Sunday evaluation
            </p>
          </div>
        </div>

        {/* Weekly Completion Score */}
        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-6">
          <div className="text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Weekly Accuracy
            </span>
            <div className="flex items-baseline justify-end gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-violet-600 dark:text-violet-400">
                {weeklyStats.percentage}%
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({weeklyStats.completed}/{weeklyStats.eligible})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Table of Habits per Day */}
      <div className="overflow-x-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-56">
                Habit
              </th>
              {weekDays.map(day => {
                const key = dateToKey(day);
                const isCurrent = isToday(key);

                return (
                  <th 
                    key={key}
                    className={`py-3.5 px-2 text-center text-xs font-semibold ${
                      isCurrent 
                        ? 'text-violet-600 dark:text-violet-400 bg-violet-50/60 dark:bg-violet-950/20' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div>{dayLabel(day)}</div>
                    <div className="text-[11px] font-normal text-slate-400 mt-0.5">
                      {day.getDate()}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {habits.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-slate-400">
                  No habits tracked. Add habits to view your weekly breakdown.
                </td>
              </tr>
            ) : (
              habits.map(habit => (
                <tr key={habit.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2.5">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${habit.colour}20`, color: habit.colour }}
                    >
                      <HabitIcon name={habit.icon} className="w-4 h-4" />
                    </div>
                    <span className="truncate max-w-[180px]">{habit.name}</span>
                  </td>

                  {weekDays.map(day => {
                    const key = dateToKey(day);
                    const now = new Date();
                    now.setHours(23, 59, 59, 999);
                    const isFutureDay = day > now && key !== dateToKey(new Date());
                    const isDone = Boolean(habit.completions && habit.completions[key]);

                    return (
                      <td key={key} className="py-3.5 px-2 text-center">
                        {isFutureDay ? (
                          <span className="inline-block w-6 h-6 rounded-full border border-dashed border-slate-300 dark:border-slate-700" title="Future date" />
                        ) : isDone ? (
                          <span 
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-white shadow-sm"
                            style={{ backgroundColor: habit.colour || '#8b5cf6' }}
                            title="Completed"
                          >
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span 
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400"
                            title="Missed"
                          >
                            <X className="w-3.5 h-3.5 stroke-[2]" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Daily Completion Bar Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
          Daily Completion Distribution
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Percentage of habits completed per day this week
        </p>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-slate-700">
                        <p className="font-bold">{data.name} ({data.fullDate})</p>
                        <p className="text-violet-300 font-mono mt-0.5">
                          {data.isFuture ? 'Future day' : `${data.pct}% completed`}
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
              <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isFuture ? '#e2e8f0' : entry.pct === 100 ? '#10b981' : '#8b5cf6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Logic Note / Explanation Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-50/60 dark:bg-violet-950/20 border border-violet-200/60 dark:border-violet-800/40 text-violet-900 dark:text-violet-200 text-xs">
        <Info className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Calculation Explanation:</strong> Weekly completion percentage is computed as completed eligible check-ins divided by total eligible check-ins. Future dates in the current week are never counted as missed check-ins, ensuring your rate stays honest and motivating throughout the week.
        </p>
      </div>
    </div>
  );
}
