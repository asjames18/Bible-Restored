import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ProgressHeatmapProps {
  completedDays: { date: Date; count: number }[];
  months?: number; // Number of months to display (default 3)
}

export default function ProgressHeatmap({ completedDays, months = 3 }: ProgressHeatmapProps) {
  const heatmapData = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);

    // Create a map of dates to counts
    const dateMap = new Map<string, number>();
    completedDays.forEach(({ date, count }) => {
      const dateKey = date.toDateString();
      dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + count);
    });

    // Generate all weeks to display
    const weeks: Array<Array<{ date: Date; count: number; isCurrentMonth: boolean }>> = [];
    let currentDate = new Date(startDate);
    
    // Start from the beginning of the week
    while (currentDate.getDay() !== 0) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    const endDate = new Date(today);
    while (currentDate <= endDate) {
      const week: Array<{ date: Date; count: number; isCurrentMonth: boolean }> = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentDate);
        const dateKey = date.toDateString();
        const count = dateMap.get(dateKey) || 0;
        const isCurrentMonth = date.getMonth() === today.getMonth();
        
        week.push({ date, count, isCurrentMonth });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      weeks.push(week);
    }

    return weeks;
  }, [completedDays, months]);

  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-theme-border/20';
    if (count === 1) return 'bg-theme-accent/30';
    if (count === 2) return 'bg-theme-accent/60';
    return 'bg-theme-accent';
  };

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-theme-surface rounded-xl p-6 border border-theme-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-theme-text">Reading Activity</h3>
        <div className="flex items-center gap-2 text-xs text-theme-text/60">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getColorClass(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="inline-flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-2 pt-5">
            {weekDays.map((day, i) => (
              <div
                key={day}
                className="h-3 flex items-center justify-end text-xs text-theme-text/60"
              >
                {i % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {heatmapData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {/* Month label (first week of month) */}
              {weekIndex === 0 || week[0].date.getDate() <= 7 ? (
                <div className="h-4 text-xs text-theme-text/60 text-center">
                  {week[0].date.toLocaleDateString('en-US', { month: 'short' })}
                </div>
              ) : (
                <div className="h-4" />
              )}

              {/* Days */}
              {week.map((day, dayIndex) => (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm ${getColorClass(day.count)} ${
                    !day.isCurrentMonth ? 'opacity-40' : ''
                  }`}
                  title={`${day.date.toLocaleDateString()}: ${day.count} reading${day.count !== 1 ? 's' : ''}`}
                  whileHover={{ scale: 1.5 }}
                  transition={{ duration: 0.1 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-theme-border flex items-center justify-between text-sm">
        <span className="text-theme-text/70">
          {completedDays.reduce((sum, day) => sum + day.count, 0)} readings in the last {months} months
        </span>
      </div>
    </div>
  );
}

