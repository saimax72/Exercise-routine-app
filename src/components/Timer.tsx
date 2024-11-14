import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import CircleTimer from './CircleTimer';
import type { Exercise } from '../types';

interface TimerProps {
  totalTime: number;
  currentTime: number;
  delayTime: number;
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  nextExercise: string;
  isDelay: boolean;
  currentExercise: Exercise | null;
}

export default function Timer({
  totalTime,
  currentTime,
  delayTime,
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
  nextExercise,
  isDelay,
  currentExercise,
}: TimerProps) {
  // Calculate progress ensuring we have valid numbers
  const delayProgress = currentExercise?.delay ? 
    (delayTime / currentExercise.delay) * 100 : 0;
  
  const exerciseProgress = currentExercise?.duration ? 
    (currentTime / currentExercise.duration) * 100 : 0;

  return (
    <div className="glass rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex flex-col items-center">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
          {/* Show Rest Timer first when in delay period */}
          {isDelay ? (
            <div className="relative">
              <CircleTimer
                radius={120}
                progress={delayProgress}
                color="#FCA5A5"
                label="Rest"
                time={delayTime}
                total={currentExercise?.delay || 0}
                showTotal={true}
              />
            </div>
          ) : (
            /* Show Exercise Duration Timer when not in delay */
            <div className="relative">
              <CircleTimer
                radius={120}
                progress={exerciseProgress}
                color="#86EFAC"
                label="Exercise"
                time={currentTime}
                total={currentExercise?.duration || 0}
                showTotal={true}
              />
            </div>
          )}
        </div>

        {isRunning && currentExercise && (
          <div 
            className={`text-lg mb-6 max-w-xs text-center ${
              isDelay ? 'text-red-300' : 'text-green-300'
            }`}
          >
            {isDelay
              ? `Rest time: ${delayTime}s before ${nextExercise}`
              : `Current exercise: ${currentExercise.name}`}
          </div>
        )}

        <div className="flex justify-center gap-4">
          {!isRunning ? (
            <button
              onClick={onStart}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 border border-white/20 hover:border-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <Play size={20} />
              Start Workout
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  onClick={onResume}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 border border-white/20 hover:border-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <Play size={20} />
                  Resume
                </button>
              ) : (
                <button
                  onClick={onPause}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 border border-white/20 hover:border-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <Pause size={20} />
                  Pause
                </button>
              )}
            </>
          )}
          <button
            onClick={onReset}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 border border-white/20 hover:border-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}