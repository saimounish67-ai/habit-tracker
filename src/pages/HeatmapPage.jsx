import React, { useMemo, useState } from 'react';
import { Grid3X3, Flame, Calendar, Info } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { getHeatmapDates, dateToKey, formatShort } from '../utils/dates';
import { buildHeatmapData } from '../utils/streaks';

export function HeatmapPage() {
  const { habits } = useHabits();
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate 12 months of dates
  const dates = useMemo(() => getHeatmapDates(12), []);
  const heatmapData = useMemo(() => buildHeatmapData(habits, dates), [habits, dates]);

  // Group dates by week columns (Sunday or Monday starting)
  const weeks = useMemo(() => {
    const cols = [];
    let currentWeek = [];

    // Pad start if first date isn't Sunday
    const firstDayOfWeek = dates[0].getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    dates.forEach(d => {
      currentWeek.push(d);
      if (currentWeek.length === 7) {
        cols.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      cols.push(currentWeek);
    }

    return cols;
  }, [dates]);

  // Month headers
  const monthLabels = useMemo(() => {
    const months = [];
    let lastMonth = -1;

    weeks.forEach((week, wIdx) => {
      const validDay = week.find(d => d !== null);
      if (validDay && validDay.getMonth() !== lastMonth) {
        lastMonth = validDay.getMonth();
        const monthName = validDay.toLocaleDateString('en-US', { month: 'short' });
        months.push({ weekIndex: wIdx, label: monthName });
      }
    });

    return months;
  }, [weeks]);

  const getIntensityClass = (pct, hasHabits) => {
    if (!hasHabits || pct === 0) return 'bg-slate-100 dark:bg-slate-800/80 hover:ring-slate-300';
    if (pct < 30) return 'bg-violet-200 dark:bg-violet-950 text-violet-900 hover:ring-violet-400';
    if (pct < 60) return 'bg-violet-400 dark:bg-violet-800 text-white hover:ring-violet-300';
    if (pct < 85) return 'bg-violet-600 dark:bg-violet-600 text-white hover:ring-violet-200';
    return 'bg-violet-800 dark:bg-violet-400 text-white hover:ring-violet-100';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-violet-500" />
              12-Month Consistency Heatmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Visual record of your daily habits and discipline over the past year
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              <span className="w-3.5 h-3.5 rounded-sm bg-violet-200 dark:bg-violet-950" />
              <span className="w-3.5 h-3.5 rounded-sm bg-violet-400 dark:bg-violet-800" />
              <span className="w-3.5 h-3.5 rounded-sm bg-violet-600 dark:bg-violet-600" />
              <span className="w-3.5 h-3.5 rounded-sm bg-violet-800 dark:bg-violet-400" />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid Container (Scrollable) */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[760px]">
            {/* Month labels */}
            <div className="flex text-[11px] font-semibold text-slate-400 mb-2 pl-6">
              {weeks.map((_, i) => {
                const labelObj = monthLabels.find(m => m.weekIndex === i);
                return (
                  <div key={i} className="w-4 shrink-0 text-center">
                    {labelObj ? labelObj.label : ''}
                  </div>
                );
              })}
            </div>

            {/* Heatmap rows & columns */}
            <div className="flex gap-1">
              {/* Day-of-week labels */}
              <div className="flex flex-col gap-1 text-[10px] font-medium text-slate-400 pr-2 select-none">
                <span className="h-3.5 leading-none">Sun</span>
                <span className="h-3.5 leading-none">Mon</span>
                <span className="h-3.5 leading-none">Tue</span>
                <span className="h-3.5 leading-none">Wed</span>
                <span className="h-3.5 leading-none">Thu</span>
                <span className="h-3.5 leading-none">Fri</span>
                <span className="h-3.5 leading-none">Sat</span>
              </div>

              {/* Matrix of Days */}
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1 shrink-0">
                  {week.map((day, dIdx) => {
                    if (!day) {
                      return <div key={`empty-${dIdx}`} className="w-3.5 h-3.5" />;
                    }

                    const key = dateToKey(day);
                    const stats = heatmapData[key] || { completed: 0, total: 0, pct: 0 };
                    const intensity = getIntensityClass(stats.pct, stats.total > 0);

                    return (
                      <div
                        key={key}
                        onMouseEnter={() => setHoveredDay({ date: day, key, ...stats })}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-3.5 h-3.5 rounded-sm cursor-pointer transition-all duration-150 hover:scale-125 hover:ring-2 ${intensity}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Tooltip Inspector */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
          {hoveredDay ? (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-500" />
              <span className="font-bold text-slate-900 dark:text-white">
                {formatShort(hoveredDay.date)}, {hoveredDay.date.getFullYear()}:
              </span>
              <span className="text-violet-600 dark:text-violet-400 font-semibold font-mono">
                {hoveredDay.completed} of {hoveredDay.total} habits completed ({hoveredDay.pct}%)
              </span>
            </div>
          ) : (
            <span className="text-slate-400">
              Hover over any square in the heatmap to inspect detailed completion rates.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
