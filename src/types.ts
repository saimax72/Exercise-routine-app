export interface Exercise {
  id: string;
  name: string;
  duration: number;
  delay: number;
}

export interface ExerciseState {
  currentIndex: number;
  isRunning: boolean;
  isPaused: boolean;
  timeLeft: number;
  delayLeft: number;
}

export interface WorkoutHistory {
  id: string;
  date: string;
  duration: number;
  exerciseCount: number;
}

export interface Plan {
  id: string;
  name: string;
  exercises: Exercise[];
  history: WorkoutHistory[];
  createdAt: string;
  updatedAt: string;
}