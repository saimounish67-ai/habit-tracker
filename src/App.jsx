import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { ToastContainer } from './components/ToastContainer';
import { HabitModal } from './components/HabitModal';
import { DeleteModal } from './components/DeleteModal';
import { ClearDataModal } from './components/ClearDataModal';

import { OverviewPage } from './pages/OverviewPage';
import { HabitsPage } from './pages/HabitsPage';
import { WeeklyPage } from './pages/WeeklyPage';
import { HeatmapPage } from './pages/HeatmapPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { SettingsPage } from './pages/SettingsPage';

import { useHabits } from './context/HabitContext';

export default function App() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deletingHabit, setDeletingHabit] = useState(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const { habits, addHabit, editHabit, deleteHabit, resetAllData, addToast } = useHabits();
  const notifiedRemindersRef = useRef({});

  // Background reminder scheduler
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentHH = String(now.getHours()).padStart(2, '0');
      const currentMM = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHH}:${currentMM}`;
      const todayDate = now.toISOString().slice(0, 10);

      habits.forEach(habit => {
        if (!habit.reminder) return;
        const reminderKey = `${todayDate}_${habit.id}_${habit.reminder}`;

        if (habit.reminder === currentTime && !notifiedRemindersRef.current[reminderKey]) {
          notifiedRemindersRef.current[reminderKey] = true;

          // In-app toast reminder
          addToast(`⏰ Reminder: Time for "${habit.name}"!`);

          // Browser Notification fallback
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            try {
              new Notification(`Habit Reminder: ${habit.name}`, {
                body: "Keep your daily streak alive!",
                icon: '/favicon.svg'
              });
            } catch {
              // Ignore notification errors
            }
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 20000);
    return () => clearInterval(interval);
  }, [habits, addToast]);

  const handleOpenNewHabit = () => {
    setEditingHabit(null);
    setIsHabitModalOpen(true);
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleDeleteHabit = (habit) => {
    setDeletingHabit(habit);
  };

  const handleSaveHabit = (data) => {
    if (editingHabit) {
      return editHabit(editingHabit.id, data);
    } else {
      return addHabit(data);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <TopNav
          onOpenNewHabit={handleOpenNewHabit}
          onOpenMobileMenu={() => setMobileOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <OverviewPage
              onOpenNewHabit={handleOpenNewHabit}
              onNavigate={setCurrentTab}
              onEditHabit={handleEditHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          )}

          {currentTab === 'habits' && (
            <HabitsPage
              onOpenNewHabit={handleOpenNewHabit}
              onEditHabit={handleEditHabit}
              onDeleteHabit={handleDeleteHabit}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'weekly' && <WeeklyPage />}

          {currentTab === 'heatmap' && <HeatmapPage />}

          {currentTab === 'achievements' && <AchievementsPage />}

          {currentTab === 'settings' && (
            <SettingsPage
              onOpenClearModal={() => setIsClearModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modals & Toasts */}
      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => {
          setIsHabitModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
        editingHabit={editingHabit}
      />

      <DeleteModal
        isOpen={Boolean(deletingHabit)}
        onClose={() => setDeletingHabit(null)}
        onConfirm={deleteHabit}
        habit={deletingHabit}
      />

      <ClearDataModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={resetAllData}
      />

      <ToastContainer />
    </div>
  );
}
