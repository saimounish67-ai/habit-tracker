import React, { useState } from 'react';
import { 
  Database, 
  Trash2, 
  Bell, 
  Download, 
  Upload, 
  Sparkles, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Info,
  Check
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';

export function SettingsPage({ onOpenClearModal }) {
  const { loadDemoData, habits, addToast } = useHabits();
  const { theme, toggleTheme } = useTheme();
  const [notificationState, setNotificationState] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  const handleRequestNotification = async () => {
    if (typeof Notification === 'undefined') {
      addToast('Notifications are not supported in this browser', 'error');
      return;
    }

    try {
      const res = await Notification.requestPermission();
      setNotificationState(res);
      if (res === 'granted') {
        new Notification('HabitFlow Reminders Enabled', {
          body: 'You will receive gentle nudges for your scheduled habits!',
          icon: '/favicon.svg'
        });
        addToast('Notification permission granted!');
      } else {
        addToast('Notification permission denied', 'error');
      }
    } catch {
      addToast('Failed to request permission', 'error');
    }
  };

  const handleExportData = () => {
    const data = {
      habits: JSON.parse(localStorage.getItem('habitflow_habits') || '[]'),
      achievements: JSON.parse(localStorage.getItem('habitflow_achievements') || '{}'),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Habit data exported successfully');
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage sample data, reminder notifications, backups, and appearance
        </p>
      </div>

      <div className="space-y-4">
        {/* Section 1: Demonstration & Testing */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Demo & Evaluation Data
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly populate habits and 30-day realistic completion history for testing
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={loadDemoData}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-500/25 transition-all"
            >
              Load Demo Habits
            </button>
            <button
              onClick={onOpenClearModal}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>

        {/* Section 2: Notifications & Reminders */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Habit Reminders
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Permission Status: <strong className="uppercase font-mono text-[11px]">{notificationState}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={handleRequestNotification}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              {notificationState === 'granted' ? 'Test Notification' : 'Enable Reminders'}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              HabitFlow checks due reminders automatically while the application tab is open. Because HabitFlow operates strictly in-browser without external server costs, browser notifications may not trigger when the tab is completely closed.
            </p>
          </div>
        </div>

        {/* Section 3: Data Export Backup */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Backup & Export
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Save a copy of your habit history as a JSON file
                </p>
              </div>
            </div>

            <button
              onClick={handleExportData}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Export JSON
            </button>
          </div>
        </div>

        {/* Section 4: Privacy & Storage Architecture */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">
              100% Client-Side & Private
            </h4>
            <p className="mt-0.5 leading-relaxed">
              Your habits and streak analytics are stored exclusively in your browser's local storage. No logins, tracking cookies, or external databases are used.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
