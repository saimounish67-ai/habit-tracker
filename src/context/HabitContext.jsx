import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { loadFromStorage, saveToStorage, clearAllData, generateId } from '../utils/storage';
import { todayKey, msUntilMidnight } from '../utils/dates';
import { calcCurrentStreak, calcBestStreak, totalCheckIns } from '../utils/streaks';
import { ACHIEVEMENT_DEFS } from '../data/constants';
import { generateDemoData } from '../data/demoData';

const HabitContext = createContext(null);

export function HabitProvider({ children }) {
  const [habits, setHabits] = useState(() => loadFromStorage('habits', []));
  const [achievements, setAchievements] = useState(() => loadFromStorage('achievements', {}));
  const [toasts, setToasts] = useState([]);
  const [dateKey, setDateKey] = useState(todayKey);
  const toastIdRef = useRef(0);

  // Persist habits
  useEffect(() => {
    saveToStorage('habits', habits);
  }, [habits]);

  // Persist achievements
  useEffect(() => {
    saveToStorage('achievements', achievements);
  }, [achievements]);

  // Midnight rollover
  useEffect(() => {
    const schedule = () => {
      const ms = msUntilMidnight();
      return setTimeout(() => {
        setDateKey(todayKey());
        schedule();
      }, ms);
    };
    const timer = schedule();
    return () => clearTimeout(timer);
  }, []);

  // ── Toast system ──
  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Achievement checker ──
  const checkAchievements = useCallback((currentHabits) => {
    setAchievements(prev => {
      const next = { ...prev };
      let changed = false;

      ACHIEVEMENT_DEFS.forEach(def => {
        if (!next[def.id]) {
          const unlocked = def.check(currentHabits, { calcCurrentStreak, todayKey });
          if (unlocked) {
            next[def.id] = todayKey();
            changed = true;
            addToast(`🏆 Achievement Unlocked: ${def.name}`, 'achievement');
          }
        }
      });

      return changed ? next : prev;
    });
  }, [addToast]);

  // ── CRUD Operations ──
  const addHabit = useCallback((habitData) => {
    // Check for duplicates
    const exists = habits.some(h =>
      h.name.toLowerCase().trim() === habitData.name.toLowerCase().trim()
    );
    if (exists) {
      addToast('A habit with this name already exists', 'error');
      return false;
    }

    const newHabit = {
      id: generateId(),
      name: habitData.name.trim(),
      icon: habitData.icon || 'Target',
      colour: habitData.colour || '#8b5cf6',
      reminder: habitData.reminder || '',
      completions: {},
      createdAt: todayKey(),
    };

    const updated = [...habits, newHabit];
    setHabits(updated);
    addToast(`"${newHabit.name}" added successfully`);
    checkAchievements(updated);
    return true;
  }, [habits, addToast, checkAchievements]);

  const editHabit = useCallback((id, updates) => {
    // Check for duplicates (excluding self)
    if (updates.name) {
      const exists = habits.some(h =>
        h.id !== id && h.name.toLowerCase().trim() === updates.name.toLowerCase().trim()
      );
      if (exists) {
        addToast('A habit with this name already exists', 'error');
        return false;
      }
    }

    setHabits(prev =>
      prev.map(h => h.id === id ? { ...h, ...updates, name: updates.name?.trim() || h.name } : h)
    );
    addToast('Habit updated');
    return true;
  }, [habits, addToast]);

  const deleteHabit = useCallback((id) => {
    const habit = habits.find(h => h.id === id);
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    if (habit) addToast(`"${habit.name}" deleted`);
  }, [habits, addToast]);

  const toggleCompletion = useCallback((id) => {
    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id !== id) return h;
        const key = todayKey();
        const completions = { ...h.completions };
        completions[key] = !completions[key];
        if (!completions[key]) delete completions[key];
        return { ...h, completions };
      });

      // Check achievements after toggle
      setTimeout(() => checkAchievements(updated), 0);
      return updated;
    });
  }, [checkAchievements]);

  // ── Demo data ──
  const loadDemoData = useCallback(() => {
    const demo = generateDemoData();
    setHabits(demo);
    addToast('Demo data loaded! You can reset anytime in Settings.');
    setTimeout(() => checkAchievements(demo), 100);
  }, [addToast, checkAchievements]);

  const resetAllData = useCallback(() => {
    setHabits([]);
    setAchievements({});
    clearAllData();
    addToast('All data cleared');
  }, [addToast]);

  // ── Computed values ──
  const getBestOverallStreak = useCallback(() => {
    return habits.reduce((best, h) => {
      const s = calcBestStreak(h.completions);
      return s > best ? s : best;
    }, 0);
  }, [habits]);

  const getCurrentOverallStreak = useCallback(() => {
    return habits.reduce((best, h) => {
      const s = calcCurrentStreak(h.completions);
      return s > best ? s : best;
    }, 0);
  }, [habits]);

  const getTotalCheckIns = useCallback(() => {
    return habits.reduce((sum, h) => sum + totalCheckIns(h.completions), 0);
  }, [habits]);

  const value = {
    habits,
    achievements,
    toasts,
    dateKey,
    addHabit,
    editHabit,
    deleteHabit,
    toggleCompletion,
    loadDemoData,
    resetAllData,
    addToast,
    removeToast,
    getBestOverallStreak,
    getCurrentOverallStreak,
    getTotalCheckIns,
    checkAchievements,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used within HabitProvider');
  return ctx;
}
