/* ──────────────────────────────────────────────
   Date Utilities — Always local timezone
   ────────────────────────────────────────────── */

/** YYYY-MM-DD for today in local tz */
export function todayKey() {
  return dateToKey(new Date());
}

/** Date object → YYYY-MM-DD string (local) */
export function dateToKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/** YYYY-MM-DD string → local Date at midnight */
export function keyToDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Add n days to a date (returns new Date) */
export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/** Get Monday of the week containing `date` */
export function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun,1=Mon,...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Get the 7 days (Mon-Sun) of the week containing `date` */
export function getWeekDays(date) {
  const mon = getMonday(date);
  return Array.from({ length: 7 }, (_, i) => addDays(mon, i));
}

/** Check if two dates are the same calendar day */
export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

/** Check if a date is in the future compared to today */
export function isFuture(date) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d > now;
}

/** Check if a date key is today */
export function isToday(key) {
  return key === todayKey();
}

/** Format date for display: "Oct 14" */
export function formatShort(date) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

/** Format full date: "Wednesday, October 14, 2026" */
export function formatFull(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

/** Get day-of-week label */
export function dayLabel(date) {
  return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getDay()];
}

/** Get time-of-day greeting */
export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Get all dates in a month (for heatmap) */
export function getDaysInMonth(year, month) {
  const days = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

/** Get past N months of dates for heatmap */
export function getHeatmapDates(months = 12) {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - months + 1, 1);
  const dates = [];
  const cursor = new Date(start);
  while (cursor <= today) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

/** ms until next midnight — for auto-refresh */
export function msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 100);
  return midnight - now;
}
