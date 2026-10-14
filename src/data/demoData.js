import { todayKey, dateToKey, addDays } from '../utils/dates';

/**
 * Generate realistic demo data for showcasing the app.
 */
export function generateDemoData() {
  const today = new Date();

  const demoHabits = [
    { name: 'Read 20 minutes', icon: 'BookOpen', colour: '#8b5cf6', reminder: '08:00' },
    { name: 'Exercise', icon: 'Dumbbell', colour: '#4ade80', reminder: '07:00' },
    { name: 'Drink enough water', icon: 'Droplets', colour: '#38bdf8', reminder: '' },
    { name: 'Meditate', icon: 'Brain', colour: '#e879f9', reminder: '06:30' },
    { name: 'Study for one hour', icon: 'GraduationCap', colour: '#fb923c', reminder: '' },
  ];

  return demoHabits.map((preset, idx) => {
    const createdAt = addDays(today, -30 - idx * 5);
    const completions = {};

    // Generate semi-random completions over the past 30+ days
    for (let d = 0; d <= 30 + idx * 5; d++) {
      const date = addDays(today, -d);
      const key = dateToKey(date);
      // Higher chance of completion for recent days
      const chance = d < 7 ? 0.85 : d < 14 ? 0.7 : 0.55;
      if (Math.random() < chance && d > 0) { // Don't auto-complete today
        completions[key] = true;
      }
    }

    return {
      id: 'demo_' + Date.now().toString(36) + idx,
      name: preset.name,
      icon: preset.icon,
      colour: preset.colour,
      reminder: preset.reminder,
      completions,
      createdAt: dateToKey(createdAt),
    };
  });
}
