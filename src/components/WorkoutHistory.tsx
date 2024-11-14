import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { WorkoutHistory as WorkoutHistoryType } from '../types';
import { formatDuration } from '../utils/timeFormat';

interface WorkoutHistoryProps {
  history: WorkoutHistoryType[];
}

export default function WorkoutHistory({ history }: WorkoutHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="glass rounded-xl p-6">
      <div className="space-y-4">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="glass-light rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Calendar className="text-white/70" size={20} />
              <span className="text-white">{formatDate(entry.date)}</span>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="text-white/70" size={20} />
              <span className="text-white">{formatDuration(entry.duration)}</span>
              <span className="text-white/70">•</span>
              <span className="text-white">{entry.exerciseCount} exercises</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}