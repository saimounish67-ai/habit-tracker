import { todayKey, keyToDate, dateToKey, addDays } from './dates';

const DAY_MS = 86400000;

/**
 * Calculate the current streak for a habit.
 * If today is completed, count back from today.
 * If today is not yet completed, count back from yesterday (the streak is "paused", not reset).
 * A streak resets only when a full calendar day is missed.
 */
export function calcCurrentStreak(completions = {}) {
  const today = todayKey();
  let cursor = new Date();

  if (!completions[today]) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;
  while (true) {
    const key = dateToKey(cursor);
    if (completions[key]) {
      streak++;
      cursor = addDays(cursor, -1);
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Calculate the longest-ever streak for a habit.
 */
export function calcBestStreak(completions = {}) {
  const dates = Object.keys(completions)
    .filter(k => completions[k])
    .sort();

  if (dates.length === 0) return 0;

  let best = 1;
  let run = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = keyToDate(dates[i - 1]);
    const cur = keyToDate(dates[i]);
    const diff = (cur - prev) / DAY_MS;
    if (diff === 1) {
      run++;
      if (run > best) best = run;
    } else {
      run = 1;
    }
  }
  return best;
}

/**
 * Total completed check-ins across all time.
 */
export function totalCheckIns(completions = {}) {
  return Object.values(completions).filter(Boolean).length;
}

/**
 * Calculate weekly completion stats for a set of habits over a given week (Mon-Sun).
 * Returns { completed, eligible, percentage, dailyStats }
 */
export function calcWeeklyStats(habits, weekDays) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  let totalCompleted = 0;
  let totalEligible = 0;

  const dailyStats = weekDays.map(day => {
    const key = dateToKey(day);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);
    const isFutureDay = dayEnd > today && dateToKey(day) !== dateToKey(new Date());

    // For today, it's eligible
    // For future days, not eligible
    if (isFutureDay && key !== dateToKey(new Date())) {
      return { date: day, key, completed: 0, eligible: 0, pct: 0, isFuture: true };
    }

    let dayCompleted = 0;
    let dayEligible = 0;

    habits.forEach(h => {
      // Only count habits that existed on or before this date
      const createdDate = h.createdAt ? keyToDate(h.createdAt) : new Date(0);
      createdDate.setHours(0, 0, 0, 0);
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);

      if (dayStart >= createdDate) {
        dayEligible++;
        if (h.completions && h.completions[key]) {
          dayCompleted++;
        }
      }
    });

    totalCompleted += dayCompleted;
    totalEligible += dayEligible;

    return {
      date: day,
      key,
      completed: dayCompleted,
      eligible: dayEligible,
      pct: dayEligible > 0 ? Math.round((dayCompleted / dayEligible) * 100) : 0,
      isFuture: false,
    };
  });

  return {
    completed: totalCompleted,
    eligible: totalEligible,
    percentage: totalEligible > 0 ? Math.round((totalCompleted / totalEligible) * 100) : 0,
    dailyStats,
  };
}

/**
 * Calculate overall completion for today.
 */
export function calcTodayStats(habits) {
  const today = todayKey();
  const total = habits.length;
  const done = habits.filter(h => h.completions && h.completions[today]).length;
  return {
    done,
    total,
    percentage: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}

/**
 * Build heatmap data: date → { completed, total, pct }
 */
export function buildHeatmapData(habits, dates) {
  const map = {};
  dates.forEach(d => {
    const key = dateToKey(d);
    let completed = 0;
    let total = 0;

    habits.forEach(h => {
      const created = h.createdAt ? keyToDate(h.createdAt) : new Date(0);
      created.setHours(0, 0, 0, 0);
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);

      if (dayStart >= created) {
        total++;
        if (h.completions && h.completions[key]) completed++;
      }
    });

    map[key] = { completed, total, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
  });
  return map;
}
