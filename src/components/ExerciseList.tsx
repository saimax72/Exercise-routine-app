import React from 'react';
import { Clock, Timer } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableExercise } from './SortableExercise';
import type { Exercise } from '../types';

interface ExerciseListProps {
  exercises: Exercise[];
  currentIndex: number;
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string) => void;
  onClone: (exercise: Exercise) => void;
  onReorder: (exercises: Exercise[]) => void;
  isRunning: boolean;
}

export default function ExerciseList({
  exercises,
  currentIndex,
  onDelete,
  onEdit,
  onClone,
  onReorder,
  isRunning,
}: ExerciseListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = exercises.findIndex((ex) => ex.id === active.id);
      const newIndex = exercises.findIndex((ex) => ex.id === over.id);
      onReorder(arrayMove(exercises, oldIndex, newIndex));
    }
  };

  if (exercises.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <h2 className="text-xl font-medium text-white mb-2">
          No exercises added yet
        </h2>
        <p className="text-white/70">
          Add your first exercise to get started with your workout!
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={exercises}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <SortableExercise
              key={exercise.id}
              exercise={exercise}
              index={index}
              isActive={index === currentIndex}
              isRunning={isRunning}
              onDelete={onDelete}
              onEdit={onEdit}
              onClone={onClone}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}