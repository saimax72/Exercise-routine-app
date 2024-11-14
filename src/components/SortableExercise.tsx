import React from 'react';
import { Clock, Timer, Trash2, GripVertical, Copy } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Exercise } from '../types';
import { formatDuration } from '../utils/timeFormat';

interface SortableExerciseProps {
  exercise: Exercise;
  index: number;
  isActive: boolean;
  isRunning: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string) => void;
  onClone: (exercise: Exercise) => void;
}

export function SortableExercise({
  exercise,
  index,
  isActive,
  isRunning,
  onDelete,
  onEdit,
  onClone,
}: SortableExerciseProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-xl transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${
        isActive && isRunning
          ? 'glass border-2 border-white/30 bg-white/20'
          : 'glass-card'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {!isRunning && (
            <button
              className="cursor-grab text-white/60 hover:text-white focus:outline-none"
              {...attributes}
              {...listeners}
            >
              <GripVertical size={20} />
            </button>
          )}
          <span className="text-white/60 font-medium min-w-[24px]">{index + 1}</span>
          <input
            type="text"
            value={exercise.name}
            onChange={(e) => onEdit(exercise.id, e.target.value)}
            className="font-medium text-white bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg px-2 py-1 flex-1 sm:flex-none"
            disabled={isRunning}
          />
        </div>
        
        <div className="flex items-center gap-4 ml-12 sm:ml-auto">
          <div className="flex items-center gap-2 text-white/70">
            <Clock size={18} />
            <span>{formatDuration(exercise.duration)}</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <Timer size={18} />
            <span>{exercise.delay}s delay</span>
          </div>
          {!isRunning && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onClone(exercise)}
                className="text-white/60 hover:text-blue-300 focus:outline-none"
                aria-label="Clone exercise"
              >
                <Copy size={18} />
              </button>
              <button
                onClick={() => onDelete(exercise.id)}
                className="text-white/60 hover:text-red-300 focus:outline-none"
                aria-label="Delete exercise"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}