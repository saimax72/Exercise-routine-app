import React from 'react';
import { useState, useEffect } from 'react';
import { Dumbbell, Plus, Clock, Calendar, Activity, Target } from 'lucide-react';
import PlansList from './components/PlansList';
import WorkoutPlan from './components/WorkoutPlan';
import type { Plan } from './types';

function App() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    const savedPlans = localStorage.getItem('exercise-plans');
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('exercise-plans', JSON.stringify(plans));
  }, [plans]);

  const handleCreatePlan = () => {
    const newPlan: Plan = {
      id: crypto.randomUUID(),
      name: 'New Workout Plan',
      exercises: [],
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => [...prev, newPlan]);
    setSelectedPlanId(newPlan.id);
  };

  const handleClonePlan = (planToClone: Plan) => {
    const clonedPlan: Plan = {
      ...planToClone,
      id: crypto.randomUUID(),
      name: `${planToClone.name} (Copy)`,
      history: [], // Reset history for the clone
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => [...prev, clonedPlan]);
  };

  const handleDeletePlan = (id: string) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== id));
    if (selectedPlanId === id) {
      setSelectedPlanId(null);
    }
  };

  const handleUpdatePlan = (updatedPlan: Plan) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === updatedPlan.id
          ? { ...updatedPlan, updatedAt: new Date().toISOString() }
          : plan
      )
    );
  };

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);

  // Calculate dashboard statistics
  const totalWorkouts = plans.reduce((acc, plan) => acc + plan.history.length, 0);
  const totalExercises = plans.reduce((acc, plan) => acc + plan.exercises.length, 0);
  const totalDuration = plans.reduce(
    (acc, plan) => acc + plan.history.reduce((sum, h) => sum + h.duration, 0),
    0
  );
  const lastWorkout = plans
    .flatMap((plan) => plan.history)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <div className="min-h-screen">
      {selectedPlan ? (
        <WorkoutPlan
          plan={selectedPlan}
          onUpdate={handleUpdatePlan}
          onBack={() => setSelectedPlanId(null)}
        />
      ) : (
        <>
          <div className="fixed inset-0 -z-10">
            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=2000&q=80"
              alt="Workout background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] mb-12 flex items-center justify-center">
            <div className="text-center px-4">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white">SetFlow</h2>
              </div>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
                SetFlow is the only fitness app you'll need to streamline your workout journey! Designed for everyone from beginners to seasoned athletes, SetFlow allows you to build personalized workout plans, track your progress, and stay motivated. Easily create multiple workout plans, each with customized exercises, sets, reps, and rest times to fit your fitness goals.
              </p>
              <button
                onClick={handleCreatePlan}
                className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 mx-auto border border-white/20 hover:border-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <Plus size={24} />
                Create New Plan
              </button>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="container mx-auto px-4 mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-indigo-500/20">
                    <Target className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Total Plans</h3>
                </div>
                <p className="text-3xl font-bold text-white">{plans.length}</p>
                <p className="text-white/60 text-sm mt-1">Active workout plans</p>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <Activity className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Workouts</h3>
                </div>
                <p className="text-3xl font-bold text-white">{totalWorkouts}</p>
                <p className="text-white/60 text-sm mt-1">Completed sessions</p>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-pink-500/20">
                    <Dumbbell className="w-6 h-6 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Exercises</h3>
                </div>
                <p className="text-3xl font-bold text-white">{totalExercises}</p>
                <p className="text-white/60 text-sm mt-1">Across all plans</p>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-cyan-500/20">
                    <Clock className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Time Spent</h3>
                </div>
                <p className="text-3xl font-bold text-white">
                  {Math.round(totalDuration / 60)} min
                </p>
                <p className="text-white/60 text-sm mt-1">
                  Last workout: {lastWorkout ? new Date(lastWorkout.date).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 lg:px-8 pb-12">
            <PlansList
              plans={plans}
              onSelect={setSelectedPlanId}
              onDelete={handleDeletePlan}
              onClone={handleClonePlan}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;