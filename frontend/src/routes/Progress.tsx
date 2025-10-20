import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Flame, Trophy, CheckCircle, Circle, BookOpen } from 'lucide-react';
import TopBar from '../components/TopBar';
import ProgressHeatmap from '../components/ProgressHeatmap';
import { AchievementShowcase } from '../components/AchievementBadge';
import { useReadingPlanStore } from '../store/readingPlanStore';
import { useBibleStore } from '../store/bibleStore';

export default function Progress() {
  const navigate = useNavigate();
  const {
    getActivePlan,
    getDayProgress,
    markDayComplete,
    markDayIncomplete,
    getReadingStats,
    achievements,
  } = useReadingPlanStore();
  const { setRef, translationId } = useBibleStore();

  const [selectedWeek, setSelectedWeek] = useState(0);

  const activePlan = getActivePlan();
  const stats = getReadingStats();
  const unlockedAchievements = achievements.filter((a) => a.unlocked);

  if (!activePlan) {
    return (
      <div className="min-h-screen bg-theme-bg pb-20">
        <TopBar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Calendar className="w-16 h-16 text-theme-text/40 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-theme-text mb-2">No Active Plan</h2>
          <p className="text-theme-text/60 mb-6">
            Start a reading plan to track your progress and earn achievements
          </p>
          <button
            onClick={() => navigate('/plans')}
            className="px-6 py-3 bg-theme-accent text-white rounded-lg font-semibold hover:bg-theme-accent/90 transition-colors"
          >
            Browse Plans
          </button>
        </div>
      </div>
    );
  }

  const progress = getDayProgress(activePlan.id);

  // Group days into weeks
  const weeksCount = Math.ceil(activePlan.duration / 7);
  const weeks = Array.from({ length: weeksCount }, (_, weekIndex) => {
    const startDay = weekIndex * 7 + 1;
    const endDay = Math.min(startDay + 6, activePlan.duration);
    return activePlan.days.filter((d) => d.day >= startDay && d.day <= endDay);
  });

  const handleToggleDay = (day: number, completed: boolean) => {
    if (completed) {
      markDayIncomplete(activePlan.id, day);
    } else {
      markDayComplete(activePlan.id, day);
    }
  };

  const handleReadChapter = (reading: string) => {
    // Parse reading (e.g., "Genesis 1" -> book: "Genesis", chapter: "1")
    const parts = reading.trim().split(' ');
    if (parts.length >= 2) {
      const chapter = parts.pop();
      const book = parts.join(' ');
      setRef(book, chapter!, '1');
      navigate(`/${translationId}/${book}/${chapter}`);
    }
  };

  // Prepare heatmap data
  const heatmapData = activePlan.days
    .filter((d) => d.completed && d.completedAt)
    .map((d) => ({
      date: new Date(d.completedAt!),
      count: 1,
    }));

  return (
    <div className="min-h-screen bg-theme-bg pb-20">
      <TopBar />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-theme-text/60 hover:text-theme-text transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-theme-text">{activePlan.name}</h1>
            <p className="text-theme-text/60 text-sm">{activePlan.description}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-theme-surface rounded-xl p-4 border border-theme-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-theme-accent/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-theme-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-theme-text">{progress.percentage}%</p>
                <p className="text-xs text-theme-text/60">Complete</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-theme-surface rounded-xl p-4 border border-theme-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-theme-text">{stats.currentStreak}</p>
                <p className="text-xs text-theme-text/60">Day Streak</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-theme-surface rounded-xl p-4 border border-theme-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-theme-text">
                  {progress.completed}/{progress.total}
                </p>
                <p className="text-xs text-theme-text/60">Days Done</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-theme-surface rounded-xl p-4 border border-theme-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-theme-text">{unlockedAchievements.length}</p>
                <p className="text-xs text-theme-text/60">Achievements</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="bg-theme-surface rounded-xl p-6 border border-theme-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-theme-text">Overall Progress</h3>
            <span className="text-theme-accent font-semibold">{progress.percentage}%</span>
          </div>
          <div className="h-4 bg-theme-bg rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-theme-accent to-theme-accent/70"
            />
          </div>
          <p className="text-sm text-theme-text/60 mt-2">
            {progress.completed} of {progress.total} days completed
          </p>
        </div>

        {/* Week Selector */}
        <div className="bg-theme-surface rounded-xl p-4 border border-theme-border">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {weeks.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedWeek(index)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedWeek === index
                    ? 'bg-theme-accent text-white'
                    : 'bg-theme-bg text-theme-text hover:bg-theme-bg/80'
                }`}
              >
                Week {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Readings */}
        <div className="bg-theme-surface rounded-xl p-6 border border-theme-border">
          <h3 className="text-lg font-semibold text-theme-text mb-4">
            Week {selectedWeek + 1} Readings
          </h3>
          <div className="space-y-3">
            {weeks[selectedWeek]?.map((dayData) => (
              <motion.div
                key={dayData.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  dayData.completed
                    ? 'bg-theme-accent/10 border-theme-accent'
                    : 'bg-theme-bg border-theme-border'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleDay(dayData.day, dayData.completed)}
                    className="flex-shrink-0 mt-1"
                  >
                    {dayData.completed ? (
                      <CheckCircle className="w-6 h-6 text-theme-accent" />
                    ) : (
                      <Circle className="w-6 h-6 text-theme-text/40 hover:text-theme-accent transition-colors" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-theme-text">Day {dayData.day}</span>
                      {dayData.completed && dayData.completedAt && (
                        <span className="text-xs text-theme-text/60">
                          {new Date(dayData.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {dayData.readings.map((reading, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleReadChapter(reading)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-theme-bg hover:bg-theme-bg/80 rounded-md text-sm text-theme-text transition-colors border border-theme-border hover:border-theme-accent"
                        >
                          <BookOpen className="w-3 h-3" />
                          {reading}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        {heatmapData.length > 0 && <ProgressHeatmap completedDays={heatmapData} months={3} />}

        {/* Achievements */}
        {achievements.length > 0 && (
          <AchievementShowcase
            achievements={achievements}
            title="Your Achievements"
            limit={8}
          />
        )}
      </div>
    </div>
  );
}

