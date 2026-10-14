const STORAGE_PREFIX = 'habitflow_';

/**
 * Safely read and parse JSON from localStorage.
 */
export function loadFromStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    // Corrupted data — return fallback
    console.warn(`[HabitFlow] Corrupted data for key "${key}", resetting.`);
    localStorage.removeItem(STORAGE_PREFIX + key);
    return fallback;
  }
}

/**
 * Write JSON to localStorage.
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('[HabitFlow] Failed to save:', e);
  }
}

/**
 * Remove a key from localStorage.
 */
export function removeFromStorage(key) {
  localStorage.removeItem(STORAGE_PREFIX + key);
}

/**
 * Clear all HabitFlow data from localStorage.
 */
export function clearAllData() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(k);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
}

/**
 * Generate a unique ID.
 */
export function generateId() {
  return 'h_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
