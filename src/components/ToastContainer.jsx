import React from 'react';
import { useHabits } from '../context/HabitContext';
import { CheckCircle2, AlertCircle, Trophy, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useHabits();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md pointer-events-none">
      {toasts.map(toast => {
        const isAchievement = toast.type === 'achievement';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3.5 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 ${
              isAchievement
                ? 'bg-gradient-to-r from-violet-950/90 to-purple-900/90 text-violet-100 border-violet-500/40 shadow-violet-500/20'
                : isError
                ? 'bg-rose-950/90 text-rose-100 border-rose-500/40 shadow-rose-500/20'
                : 'bg-slate-900/95 text-slate-100 border-slate-700/60 shadow-black/20'
            }`}
          >
            <div className="shrink-0">
              {isAchievement ? (
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center">
                  <Trophy className="w-4 h-4 animate-bounce" />
                </div>
              ) : isError ? (
                <AlertCircle className="w-5 h-5 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
            </div>

            <div className="flex-1 text-sm font-medium tracking-tight">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
