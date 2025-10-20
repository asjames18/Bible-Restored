import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Filter } from 'lucide-react';
import TopBar from '../components/TopBar';
import PlanCard from '../components/PlanCard';
import { useReadingPlanStore, type ReadingPlan, type ReadingPlanDay } from '../store/readingPlanStore';
import plansData from '../data/readingPlans.json';

export default function ReadingPlans() {
  const navigate = useNavigate();
  const { plans, addPlan, setActivePlan, getDayProgress } = useReadingPlanStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Plans' },
    { id: 'topical', label: 'Topical' },
    { id: 'canonical', label: 'Canonical' },
    { id: 'chronological', label: 'Chronological' },
    { id: 'devotional', label: 'Devotional' },
  ];

  const filteredPlans =
    selectedCategory === 'all'
      ? plansData.plans
      : plansData.plans.filter((p: any) => p.category === selectedCategory);

  const handleStartPlan = (planId: string) => {
    const planTemplate = plansData.plans.find((p: any) => p.id === planId);
    if (!planTemplate) return;

    // Check if plan already exists
    const existingPlan = plans.find((p) => p.id === planId);
    if (existingPlan) {
      setActivePlan(planId);
      navigate('/progress');
      return;
    }

    // Create new plan
    const newPlan: Omit<ReadingPlan, 'isActive' | 'completedDays'> = {
      id: planTemplate.id,
      name: planTemplate.name,
      description: planTemplate.description,
      duration: planTemplate.duration,
      category: planTemplate.category as any,
      days: (planTemplate.days as any[]).map((day) => ({
        day: day.day,
        readings: day.readings,
        completed: false,
      })),
      startDate: Date.now(),
      currentDay: 1,
    };

    addPlan(newPlan);
    setActivePlan(planId);
    navigate('/progress');
  };

  const handleContinuePlan = (planId: string) => {
    setActivePlan(planId);
    navigate('/progress');
  };

  // Get progress for existing plans
  const getPlanProgress = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return 0;
    const progress = getDayProgress(planId);
    return progress.percentage;
  };

  const isPlanActive = (planId: string) => {
    return plans.find((p) => p.id === planId)?.isActive || false;
  };

  const isPlanStarted = (planId: string) => {
    return plans.some((p) => p.id === planId);
  };

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
          <div>
            <h1 className="text-2xl font-bold text-theme-text">Reading Plans</h1>
            <p className="text-theme-text/60 text-sm">
              Choose a plan to guide your Bible reading journey
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="w-5 h-5 text-theme-text/60 flex-shrink-0" />
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-theme-accent text-white'
                  : 'bg-theme-surface text-theme-text border border-theme-border hover:border-theme-accent'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* Plans Grid */}
        {filteredPlans.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-theme-text/60">No plans found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan: any) => (
              <PlanCard
                key={plan.id}
                id={plan.id}
                name={plan.name}
                description={plan.description}
                duration={plan.duration}
                category={plan.category}
                estimatedTime={plan.estimatedTime}
                difficulty={plan.difficulty}
                popularity={plan.popularity}
                isActive={isPlanActive(plan.id)}
                progress={isPlanStarted(plan.id) ? getPlanProgress(plan.id) : 0}
                onStart={handleStartPlan}
                onContinue={handleContinuePlan}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

