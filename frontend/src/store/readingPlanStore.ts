import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ReadingPlanDay {
  day: number;
  readings: string[]; // e.g., ["Genesis 1", "Psalm 1"]
  completed: boolean;
  completedAt?: number;
}

export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // days
  category: 'chronological' | 'canonical' | 'topical' | 'devotional' | 'custom';
  days: ReadingPlanDay[];
  isActive: boolean;
  startDate?: number;
  currentDay?: number;
  completedDays: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'streak' | 'completion' | 'reading' | 'milestone';
  requirement: number;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
}

interface ReadingPlanState {
  plans: ReadingPlan[];
  achievements: Achievement[];
}

interface ReadingPlanActions {
  // Plan management
  addPlan: (plan: Omit<ReadingPlan, 'isActive' | 'completedDays'>) => void;
  removePlan: (planId: string) => void;
  setActivePlan: (planId: string) => void;
  getActivePlan: () => ReadingPlan | undefined;
  
  // Progress tracking
  markDayComplete: (planId: string, day: number) => void;
  markDayIncomplete: (planId: string, day: number) => void;
  getCurrentDay: (planId: string) => number;
  getDayProgress: (planId: string) => { completed: number; total: number; percentage: number };
  
  // Achievements
  checkAchievements: () => void;
  unlockAchievement: (achievementId: string) => void;
  getUnlockedAchievements: () => Achievement[];
  getProgressToNextAchievement: (type: Achievement['type']) => { current: number; next: number; achievement?: Achievement };
  
  // Statistics
  getTotalDaysCompleted: () => number;
  getCompletionStreak: () => number;
  getReadingStats: () => {
    totalPlansCompleted: number;
    totalDaysRead: number;
    currentStreak: number;
    longestStreak: number;
  };
}

export const useReadingPlanStore = create<ReadingPlanState & ReadingPlanActions>()(
  persist(
    (set, get) => ({
      plans: [],
      achievements: [
        // Streak achievements
        {
          id: 'streak-7',
          name: 'Week Warrior',
          description: 'Complete 7 days in a row',
          icon: '🔥',
          type: 'streak',
          requirement: 7,
          unlocked: false,
          progress: 0,
        },
        {
          id: 'streak-30',
          name: 'Monthly Master',
          description: 'Complete 30 days in a row',
          icon: '💪',
          type: 'streak',
          requirement: 30,
          unlocked: false,
          progress: 0,
        },
        {
          id: 'streak-100',
          name: 'Centurion',
          description: 'Complete 100 days in a row',
          icon: '👑',
          type: 'streak',
          requirement: 100,
          unlocked: false,
          progress: 0,
        },
        // Completion achievements
        {
          id: 'plan-1',
          name: 'Plan Pioneer',
          description: 'Complete your first reading plan',
          icon: '🎯',
          type: 'completion',
          requirement: 1,
          unlocked: false,
          progress: 0,
        },
        {
          id: 'plan-5',
          name: 'Plan Pro',
          description: 'Complete 5 reading plans',
          icon: '🏆',
          type: 'completion',
          requirement: 5,
          unlocked: false,
          progress: 0,
        },
        // Reading achievements
        {
          id: 'read-50',
          name: 'Bookworm',
          description: 'Read 50 chapters',
          icon: '📚',
          type: 'reading',
          requirement: 50,
          unlocked: false,
          progress: 0,
        },
        {
          id: 'read-365',
          name: 'Year Reader',
          description: 'Read 365 chapters',
          icon: '📖',
          type: 'reading',
          requirement: 365,
          unlocked: false,
          progress: 0,
        },
      ],

      // Plan management
      addPlan: (plan) => {
        const newPlan: ReadingPlan = {
          ...plan,
          isActive: get().plans.length === 0, // First plan is active by default
          completedDays: 0,
        };
        set((state) => ({
          plans: [...state.plans, newPlan],
        }));
      },

      removePlan: (planId) => {
        set((state) => ({
          plans: state.plans.filter((p) => p.id !== planId),
        }));
      },

      setActivePlan: (planId) => {
        set((state) => ({
          plans: state.plans.map((p) => ({
            ...p,
            isActive: p.id === planId,
          })),
        }));
      },

      getActivePlan: () => {
        return get().plans.find((p) => p.isActive);
      },

      // Progress tracking
      markDayComplete: (planId, day) => {
        set((state) => ({
          plans: state.plans.map((plan) => {
            if (plan.id !== planId) return plan;

            const updatedDays = plan.days.map((d) =>
              d.day === day
                ? { ...d, completed: true, completedAt: Date.now() }
                : d
            );

            const completedDays = updatedDays.filter((d) => d.completed).length;

            return {
              ...plan,
              days: updatedDays,
              completedDays,
              currentDay: day < plan.duration ? day + 1 : day,
            };
          }),
        }));

        // Check achievements after marking complete
        setTimeout(() => get().checkAchievements(), 100);
      },

      markDayIncomplete: (planId, day) => {
        set((state) => ({
          plans: state.plans.map((plan) => {
            if (plan.id !== planId) return plan;

            const updatedDays = plan.days.map((d) =>
              d.day === day
                ? { ...d, completed: false, completedAt: undefined }
                : d
            );

            const completedDays = updatedDays.filter((d) => d.completed).length;

            return {
              ...plan,
              days: updatedDays,
              completedDays,
            };
          }),
        }));
      },

      getCurrentDay: (planId) => {
        const plan = get().plans.find((p) => p.id === planId);
        if (!plan) return 1;

        // Find first incomplete day
        const firstIncomplete = plan.days.find((d) => !d.completed);
        return firstIncomplete?.day || plan.duration;
      },

      getDayProgress: (planId) => {
        const plan = get().plans.find((p) => p.id === planId);
        if (!plan) return { completed: 0, total: 0, percentage: 0 };

        const completed = plan.completedDays;
        const total = plan.duration;
        const percentage = Math.round((completed / total) * 100);

        return { completed, total, percentage };
      },

      // Achievements
      checkAchievements: () => {
        const state = get();
        const stats = state.getReadingStats();

        set((prevState) => ({
          achievements: prevState.achievements.map((achievement) => {
            if (achievement.unlocked) return achievement;

            let progress = 0;
            let shouldUnlock = false;

            switch (achievement.type) {
              case 'streak':
                progress = stats.currentStreak;
                shouldUnlock = stats.currentStreak >= achievement.requirement;
                break;
              case 'completion':
                progress = stats.totalPlansCompleted;
                shouldUnlock = stats.totalPlansCompleted >= achievement.requirement;
                break;
              case 'reading':
                progress = stats.totalDaysRead;
                shouldUnlock = stats.totalDaysRead >= achievement.requirement;
                break;
            }

            return {
              ...achievement,
              progress,
              unlocked: shouldUnlock,
              unlockedAt: shouldUnlock ? Date.now() : undefined,
            };
          }),
        }));
      },

      unlockAchievement: (achievementId) => {
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === achievementId
              ? { ...a, unlocked: true, unlockedAt: Date.now() }
              : a
          ),
        }));
      },

      getUnlockedAchievements: () => {
        return get().achievements.filter((a) => a.unlocked);
      },

      getProgressToNextAchievement: (type) => {
        const achievements = get().achievements
          .filter((a) => a.type === type && !a.unlocked)
          .sort((a, b) => a.requirement - b.requirement);

        if (achievements.length === 0) {
          return { current: 0, next: 0 };
        }

        const nextAchievement = achievements[0];
        return {
          current: nextAchievement.progress,
          next: nextAchievement.requirement,
          achievement: nextAchievement,
        };
      },

      // Statistics
      getTotalDaysCompleted: () => {
        return get().plans.reduce((sum, plan) => sum + plan.completedDays, 0);
      },

      getCompletionStreak: () => {
        const plans = get().plans;
        const allCompletedDays: number[] = [];

        // Collect all completion timestamps
        plans.forEach((plan) => {
          plan.days.forEach((day) => {
            if (day.completed && day.completedAt) {
              allCompletedDays.push(day.completedAt);
            }
          });
        });

        if (allCompletedDays.length === 0) return 0;

        // Sort by date
        allCompletedDays.sort((a, b) => b - a);

        // Group by day
        const dayMap = new Map<string, boolean>();
        allCompletedDays.forEach((timestamp) => {
          const date = new Date(timestamp);
          const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          dayMap.set(dayKey, true);
        });

        // Calculate current streak
        const today = new Date();
        let streak = 0;
        let checkDate = new Date(today);

        while (true) {
          const checkKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
          if (dayMap.has(checkKey)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            // If checking today and no reading, don't break streak yet
            const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
            if (checkKey === todayKey) {
              checkDate.setDate(checkDate.getDate() - 1);
              continue;
            }
            break;
          }
        }

        return streak;
      },

      getReadingStats: () => {
        const plans = get().plans;
        const totalPlansCompleted = plans.filter(
          (p) => p.completedDays === p.duration
        ).length;
        const totalDaysRead = get().getTotalDaysCompleted();
        const currentStreak = get().getCompletionStreak();

        // Calculate longest streak
        const allCompletedDays: number[] = [];
        plans.forEach((plan) => {
          plan.days.forEach((day) => {
            if (day.completed && day.completedAt) {
              allCompletedDays.push(day.completedAt);
            }
          });
        });

        allCompletedDays.sort();

        const dayMap = new Map<string, boolean>();
        allCompletedDays.forEach((timestamp) => {
          const date = new Date(timestamp);
          const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          dayMap.set(dayKey, true);
        });

        const sortedDays = Array.from(dayMap.keys()).sort();
        let longestStreak = 0;
        let tempStreak = 1;

        for (let i = 1; i < sortedDays.length; i++) {
          const prevDate = new Date(sortedDays[i - 1]);
          const currDate = new Date(sortedDays[i]);
          const dayDiff = Math.floor(
            (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (dayDiff === 1) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
          } else {
            tempStreak = 1;
          }
        }

        longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

        return {
          totalPlansCompleted,
          totalDaysRead,
          currentStreak,
          longestStreak,
        };
      },
    }),
    {
      name: 'reading-plan-storage',
    }
  )
);

