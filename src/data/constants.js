export const ACHIEVEMENT_DEFS = [
  {
    id: 'first_step',
    name: 'First Step',
    desc: 'Complete your first habit check-in',
    icon: 'Footprints',
    check: (habits) => {
      return habits.some(h =>
        Object.values(h.completions || {}).some(Boolean)
      );
    },
  },
  {
    id: 'streak_3',
    name: 'Hat Trick',
    desc: 'Reach a 3-day streak on any habit',
    icon: 'Flame',
    check: (habits, { calcCurrentStreak }) => {
      return habits.some(h => calcCurrentStreak(h.completions) >= 3);
    },
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    desc: 'Reach a 7-day streak on any habit',
    icon: 'Zap',
    check: (habits, { calcCurrentStreak }) => {
      return habits.some(h => calcCurrentStreak(h.completions) >= 7);
    },
  },
  {
    id: 'streak_14',
    name: 'Fortnight Force',
    desc: 'Maintain a 14-day streak on any habit',
    icon: 'Diamond',
    check: (habits, { calcCurrentStreak }) => {
      return habits.some(h => calcCurrentStreak(h.completions) >= 14);
    },
  },
  {
    id: 'checkins_25',
    name: 'Quarter Century',
    desc: 'Complete 25 total check-ins',
    icon: 'BarChart3',
    check: (habits) => {
      const total = habits.reduce((sum, h) =>
        sum + Object.values(h.completions || {}).filter(Boolean).length, 0
      );
      return total >= 25;
    },
  },
  {
    id: 'checkins_100',
    name: 'Centurion',
    desc: 'Complete 100 total check-ins',
    icon: 'Trophy',
    check: (habits) => {
      const total = habits.reduce((sum, h) =>
        sum + Object.values(h.completions || {}).filter(Boolean).length, 0
      );
      return total >= 100;
    },
  },
  {
    id: 'perfect_day',
    name: 'Perfect Day',
    desc: 'Complete every habit in a single day',
    icon: 'Star',
    check: (habits, { todayKey }) => {
      if (habits.length === 0) return false;
      const today = todayKey();
      return habits.every(h => h.completions && h.completions[today]);
    },
  },
  {
    id: 'five_habits',
    name: 'Multi-Tracker',
    desc: 'Track 5 or more habits simultaneously',
    icon: 'Target',
    check: (habits) => habits.length >= 5,
  },
];

export const HABIT_PRESETS = [
  { name: 'Read 20 minutes', icon: 'BookOpen', colour: '#8b5cf6' },
  { name: 'Drink enough water', icon: 'Droplets', colour: '#38bdf8' },
  { name: 'Exercise', icon: 'Dumbbell', colour: '#4ade80' },
  { name: 'Meditate', icon: 'Brain', colour: '#e879f9' },
  { name: 'Study for one hour', icon: 'GraduationCap', colour: '#fb923c' },
  { name: 'Sleep on time', icon: 'Moon', colour: '#6366f1' },
];

export const COLOUR_OPTIONS = [
  '#8b5cf6', '#6366f1', '#3b82f6', '#38bdf8',
  '#14b8a6', '#4ade80', '#facc15', '#fb923c',
  '#f87171', '#e879f9', '#ec4899', '#a78bfa',
];

export const ICON_OPTIONS = [
  'BookOpen', 'Dumbbell', 'Droplets', 'Brain', 'GraduationCap',
  'Moon', 'Sun', 'Heart', 'Music', 'Pencil', 'Code',
  'Bike', 'Coffee', 'Apple', 'Salad', 'Flame',
  'Target', 'Clock', 'Smile', 'Camera',
];
