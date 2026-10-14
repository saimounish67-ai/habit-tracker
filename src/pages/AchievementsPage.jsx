import React from 'react';
import { Trophy, Award, Lock, CheckCircle2, Sparkles, Flame } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { ACHIEVEMENT_DEFS } from '../data/constants';

export function AchievementsPage() {
  const { achievements, habits, getCurrentOverallStreak, getTotalCheckIns } = useHabits();

  const currentStreak = getCurrentOverallStreak();
  const totalChecks = getTotalCheckIns();
  const unlockedCount = Object.keys(achievements).length;
  const totalBadges = ACHIEVEMENT_DEFS.length;
  const progressPct = Math.round((unlockedCount / totalBadges) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Trophy Hall Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-violet-500/10 to-indigo-500/10 border border-amber-200/40 dark:border-amber-900/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Achievement Trophies
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Celebrate discipline milestones and unlock commemorative badges as you build consistency
          </p>
        </div>

        {/* Level & Progress */}
        <div className="text-right shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Trophy Completion
          </span>
          <div className="flex items-baseline justify-end gap-2 mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-500">
              {unlockedCount}/{totalBadges}
            </span>
            <span className="text-xs text-slate-500 font-medium">({progressPct}%)</span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ACHIEVEMENT_DEFS.map(def => {
          const isUnlocked = Boolean(achievements[def.id]);
          const unlockedDate = achievements[def.id];

          return (
            <div
              key={def.id}
              className={`relative rounded-2xl p-5 border transition-all duration-300 card-hover-glow flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-gradient-to-br from-amber-50/40 to-white dark:from-amber-950/20 dark:to-slate-900 border-amber-200/80 dark:border-amber-900/60 shadow-md shadow-amber-500/5'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-60 hover:opacity-80'
              }`}
            >
              {/* Badge Icon & State */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-md ${
                    isUnlocked
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shadow-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {isUnlocked ? '🏆' : <Lock className="w-5 h-5 text-slate-400" />}
                  </div>

                  {isUnlocked && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      Unlocked
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {def.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {def.desc}
                </p>
              </div>

              {/* Footer info */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 font-medium">
                {isUnlocked ? (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    Earned on {unlockedDate}
                  </span>
                ) : (
                  <span>Keep practicing habits to unlock</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
