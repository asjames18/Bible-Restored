import { useState, useEffect } from 'react';

interface ReadingStreakData {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;
  totalDaysRead: number;
}

export function useReadingStreak() {
  const [streakData, setStreakData] = useState<ReadingStreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastReadDate: null,
    totalDaysRead: 0
  });

  // Load streak data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('reading-streak');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setStreakData(data);
      } catch (error) {
        console.error('Error parsing reading streak data:', error);
      }
    }
  }, []);

  // Update streak when user reads
  const updateStreak = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    let newStreakData = { ...streakData };
    
    // If already read today, don't update
    if (streakData.lastReadDate === today) {
      return;
    }
    
    // If read yesterday, increment streak
    if (streakData.lastReadDate === yesterday) {
      newStreakData.currentStreak += 1;
    } else if (streakData.lastReadDate && streakData.lastReadDate !== yesterday) {
      // If missed a day, reset streak
      newStreakData.currentStreak = 1;
    } else {
      // First time reading
      newStreakData.currentStreak = 1;
    }
    
    // Update longest streak if current is longer
    if (newStreakData.currentStreak > newStreakData.longestStreak) {
      newStreakData.longestStreak = newStreakData.currentStreak;
    }
    
    // Update last read date and total days
    newStreakData.lastReadDate = today;
    newStreakData.totalDaysRead += 1;
    
    setStreakData(newStreakData);
    localStorage.setItem('reading-streak', JSON.stringify(newStreakData));
  };

  // Check if user has read today
  const hasReadToday = () => {
    const today = new Date().toDateString();
    return streakData.lastReadDate === today;
  };

  // Get streak status message
  const getStreakMessage = () => {
    if (streakData.currentStreak === 0) {
      return "Start your reading journey today! 🌱";
    } else if (streakData.currentStreak === 1) {
      return "Great start! Keep it up! 🌿";
    } else if (streakData.currentStreak < 7) {
      return `${streakData.currentStreak} days in a row! Growing strong! 🌳`;
    } else if (streakData.currentStreak < 30) {
      return `${streakData.currentStreak} days strong! You're on fire! 🔥`;
    } else {
      return `${streakData.currentStreak} days! You're a reading champion! 👑`;
    }
  };

  // Get streak emoji based on length
  const getStreakEmoji = () => {
    if (streakData.currentStreak === 0) return "🌱";
    if (streakData.currentStreak < 3) return "🌿";
    if (streakData.currentStreak < 7) return "🌳";
    if (streakData.currentStreak < 14) return "🔥";
    if (streakData.currentStreak < 30) return "💎";
    return "👑";
  };

  // Reset streak (for testing or user request)
  const resetStreak = () => {
    const newData = {
      currentStreak: 0,
      longestStreak: streakData.longestStreak,
      lastReadDate: null,
      totalDaysRead: streakData.totalDaysRead
    };
    setStreakData(newData);
    localStorage.setItem('reading-streak', JSON.stringify(newData));
  };

  return {
    streakData,
    updateStreak,
    hasReadToday,
    getStreakMessage,
    getStreakEmoji,
    resetStreak
  };
}
