import React from 'react';
import { Calendar, Clock, Trash2, Copy, GripVertical } from 'lucide-react';
import type { Plan } from '../types';
import { getBackgroundImage } from '../utils/backgroundImages';

interface PlansListProps {
  plans: Plan[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClone: (plan: Plan) => void;
}

export default function PlansList({ plans, onSelect, onDelete, onClone }: PlansListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTotalTime = (plan: Plan) => {
    return plan.exercises.reduce(
      (acc, exercise) => acc + exercise.duration + exercise.delay,
      0
    );
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-12 glass rounded-2xl">
        <h2 className="text-2xl font-medium text-white mb-2">
          No workout plans yet
        </h2>
        <p className="text-white/70">
          Create your first plan to get started with your fitness journey!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="glass-card rounded-2xl overflow-hidden group relative"
        >
          <div className="absolute inset-0 -z-10">
            <img
              src={getBackgroundImage(plan.createdAt)}
              alt="Exercise background"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
          </div>

          <div className="relative p-6">
            <div className="flex justify-between items-start mb-4">
              <button
                onClick={() => onSelect(plan.id)}
                className="text-xl font-semibold text-white hover:text-white/80 text-left"
              >
                {plan.name}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClone(plan);
                  }}
                  className="text-white/60 hover:text-blue-400 focus:outline-none p-2 rounded-lg hover:bg-white/10"
                  aria-label="Clone plan"
                >
                  <Copy size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(plan.id);
                  }}
                  className="text-white/60 hover:text-red-400 focus:outline-none p-2 rounded-lg hover:bg-white/10"
                  aria-label="Delete plan"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>
                  {plan.exercises.length} exercises • {getTotalTime(plan)}s total
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Last updated {formatDate(plan.updatedAt)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelect(plan.id)}
            className="w-full px-6 py-4 border-t border-white/10 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors text-left"
          >
            View and Edit Plan →
          </button>
        </div>
      ))}
    </div>
  );
}