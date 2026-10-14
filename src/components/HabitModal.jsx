import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, Palette, Check } from 'lucide-react';
import { HABIT_PRESETS, COLOUR_OPTIONS, ICON_OPTIONS } from '../data/constants';
import { HabitIcon } from './HabitIcon';

export function HabitModal({ isOpen, onClose, onSave, editingHabit = null }) {
  const [name, setName] = useState('');
  const [colour, setColour] = useState(COLOUR_OPTIONS[0]);
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [reminder, setReminder] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name || '');
      setColour(editingHabit.colour || COLOUR_OPTIONS[0]);
      setIcon(editingHabit.icon || ICON_OPTIONS[0]);
      setReminder(editingHabit.reminder || '');
      setError('');
    } else {
      setName('');
      setColour(COLOUR_OPTIONS[0]);
      setIcon(ICON_OPTIONS[0]);
      setReminder('');
      setError('');
    }
  }, [editingHabit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Habit name cannot be empty');
      return;
    }

    const success = onSave({
      name: name.trim(),
      colour,
      icon,
      reminder,
    });

    if (success) {
      onClose();
    }
  };

  const applyPreset = (preset) => {
    setName(preset.name);
    setIcon(preset.icon);
    setColour(preset.colour);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingHabit ? 'Edit Habit' : 'Create New Habit'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Define your daily routine and commit to the streak
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-5 flex-1 pr-1">
          {/* Quick Presets (Only if creating new) */}
          {!editingHabit && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                Quick Suggestions
              </label>
              <div className="flex flex-wrap gap-1.5">
                {HABIT_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-600 dark:hover:text-violet-400 border border-transparent hover:border-violet-200 dark:hover:border-violet-800 transition-all"
                  >
                    <HabitIcon name={preset.icon} className="w-3.5 h-3.5" style={{ color: preset.colour }} />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Habit Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={40}
              placeholder="e.g. Read 20 minutes daily"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-violet-500 dark:focus:border-violet-400 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all text-sm font-medium"
            />
            {error && (
              <p className="text-xs text-rose-500 font-medium mt-1">{error}</p>
            )}
          </div>

          {/* Colour Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-violet-500" />
              Accent Colour
            </label>
            <div className="flex flex-wrap gap-2.5">
              {COLOUR_OPTIONS.map((c) => {
                const isSelected = colour === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColour(c)}
                    className="w-8 h-8 rounded-full transition-transform flex items-center justify-center hover:scale-110 relative"
                    style={{ backgroundColor: c }}
                  >
                    {isSelected && (
                      <Check className="w-4 h-4 text-white stroke-[3] drop-shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Select Icon
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-100 dark:border-slate-800 rounded-xl">
              {ICON_OPTIONS.map((iconName) => {
                const isSelected = icon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setIcon(iconName)}
                    className={`h-10 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25 ring-2 ring-violet-400'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <HabitIcon name={iconName} className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reminder Time */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-violet-500" />
              Daily Reminder Time <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="time"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 text-sm font-medium"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              HabitFlow will notify you at this time when the application is open.
            </p>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-500/25 transition-all"
            >
              {editingHabit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
