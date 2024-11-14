import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Edit2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Exercise, Plan, WorkoutHistory } from '../types';
import Timer from './Timer';
import ExerciseForm from './ExerciseForm';
import ExerciseList from './ExerciseList';
import WorkoutHistory from './WorkoutHistory';
import WorkoutChart from './WorkoutChart';
import { getBackgroundImage } from '../utils/backgroundImages';
import { formatDuration } from '../utils/timeFormat';

interface WorkoutPlanProps {
  plan: Plan;
  onUpdate: (plan: Plan) => void;
  onBack: () => void;
}

export default function WorkoutPlan({ plan, onUpdate, onBack }: WorkoutPlanProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [planName, setPlanName] = useState(plan.name);
  const [exercises, setExercises] = useState(plan.exercises);
  const [workoutState, setWorkoutState] = useState({
    currentIndex: 0,
    isRunning: false,
    isPaused: false,
    timeLeft: 0,
    delayLeft: 0,
  });

  // Sync local state with prop changes
  useEffect(() => {
    setExercises(plan.exercises);
    setPlanName(plan.name);
  }, [plan.exercises, plan.name]);

  // Update plan when local state changes
  const updatePlan = useCallback(() => {
    if (exercises !== plan.exercises || planName !== plan.name) {
      onUpdate({
        ...plan,
        name: planName,
        exercises: exercises,
      });
    }
  }, [exercises, planName, plan, onUpdate]);

  // Debounce plan updates
  useEffect(() => {
    const timeoutId = setTimeout(updatePlan, 500);
    return () => clearTimeout(timeoutId);
  }, [updatePlan]);

  const handleCloneExercise = (exerciseToClone: Exercise) => {
    const clonedExercise: Exercise = {
      ...exerciseToClone,
      id: crypto.randomUUID(),
      name: `${exerciseToClone.name} (Copy)`,
    };
    setExercises([...exercises, clonedExercise]);
  };

  const handleStartWorkout = useCallback(() => {
    if (exercises.length === 0) return;
    
    setWorkoutState(prev => ({
      ...prev,
      isRunning: true,
      currentIndex: 0,
      timeLeft: exercises[0].duration,
      delayLeft: exercises[0].delay,
    }));
  }, [exercises]);

  const handlePauseWorkout = () => {
    setWorkoutState(prev => ({ ...prev, isPaused: true }));
  };

  const handleResumeWorkout = () => {
    setWorkoutState(prev => ({ ...prev, isPaused: false }));
  };

  const handleResetWorkout = () => {
    setWorkoutState({
      currentIndex: 0,
      isRunning: false,
      isPaused: false,
      timeLeft: 0,
      delayLeft: 0,
    });
  };

  useEffect(() => {
    let timer: number;
    
    if (workoutState.isRunning && !workoutState.isPaused) {
      timer = window.setInterval(() => {
        setWorkoutState(prev => {
          if (prev.delayLeft > 0) {
            return { ...prev, delayLeft: prev.delayLeft - 1 };
          } else if (prev.timeLeft > 0) {
            return { ...prev, timeLeft: prev.timeLeft - 1 };
          } else {
            const nextIndex = prev.currentIndex + 1;
            if (nextIndex < exercises.length) {
              return {
                ...prev,
                currentIndex: nextIndex,
                timeLeft: exercises[nextIndex].duration,
                delayLeft: exercises[nextIndex].delay,
              };
            } else {
              confetti();
              const newHistory: WorkoutHistory = {
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                duration: exercises.reduce((acc, ex) => acc + ex.duration + ex.delay, 0),
                exerciseCount: exercises.length,
              };
              onUpdate({
                ...plan,
                history: [...plan.history, newHistory],
              });
              return {
                ...prev,
                isRunning: false,
                currentIndex: 0,
              };
            }
          }
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [workoutState.isRunning, workoutState.isPaused, exercises, plan, onUpdate]);

  const currentExercise = exercises[workoutState.currentIndex];
  const nextExercise = exercises[workoutState.currentIndex + 1];

  const currentTime = workoutState.delayLeft > 0 ? workoutState.delayLeft : workoutState.timeLeft;
  const totalTime = exercises.reduce(
    (acc, exercise) => acc + exercise.duration,
    0
  );

  const hasHistory = plan.history.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-black">
      <div className="relative h-80 mb-12">
        <div className="absolute inset-0">
          <img
            src={getBackgroundImage(plan.createdAt)}
            alt="Exercise equipment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white w-full px-4">
            {isEditing ? (
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                onBlur={() => setIsEditing(false)}
                className="text-4xl md:text-5xl font-bold bg-transparent border-b-2 border-white/20 focus:border-white/40 focus:outline-none text-center w-full max-w-xl mx-auto"
                autoFocus
              />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-4xl md:text-5xl font-bold">{planName}</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Edit2 size={20} />
                </button>
              </div>
            )}
            <p className="text-xl text-gray-200 mt-4">
              {exercises.length} exercises • {formatDuration(totalTime)}
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-white hover:text-gray-200 focus:outline-none flex items-center gap-2"
        >
          <ArrowLeft size={24} />
          <span>Back to Plans</span>
        </button>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className={`grid grid-cols-1 ${hasHistory ? 'lg:grid-cols-2' : ''} gap-8`}>
          <div>
            <Timer
              totalTime={totalTime}
              currentTime={currentTime}
              delayTime={workoutState.delayLeft}
              isRunning={workoutState.isRunning}
              isPaused={workoutState.isPaused}
              onStart={handleStartWorkout}
              onPause={handlePauseWorkout}
              onResume={handleResumeWorkout}
              onReset={handleResetWorkout}
              nextExercise={nextExercise?.name || ''}
              isDelay={workoutState.delayLeft > 0}
              currentExercise={currentExercise}
            />

            <ExerciseForm
              onAdd={(exercise) => setExercises([...exercises, exercise])}
            />

            <ExerciseList
              exercises={exercises}
              currentIndex={workoutState.currentIndex}
              onDelete={(id) => setExercises(exercises.filter((ex) => ex.id !== id))}
              onEdit={(id, name) =>
                setExercises(
                  exercises.map((ex) =>
                    ex.id === id ? { ...ex, name } : ex
                  )
                )
              }
              onClone={handleCloneExercise}
              onReorder={setExercises}
              isRunning={workoutState.isRunning}
            />
          </div>

          {hasHistory && (
            <div className="space-y-8">
              <WorkoutChart history={plan.history} />
              <WorkoutHistory history={plan.history} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}