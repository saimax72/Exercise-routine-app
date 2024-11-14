import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import type { Exercise } from '../types';

interface ExerciseFormProps {
  onAdd: (exercise: Exercise) => void;
}

export default function ExerciseForm({ onAdd }: ExerciseFormProps) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('1');
  const [delay, setDelay] = useState('10');
  const [isMinutes, setIsMinutes] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !duration) return;

    const durationValue = parseFloat(duration);
    const durationInSeconds = isMinutes 
      ? Math.round(durationValue * 60) 
      : Math.round(durationValue);

    onAdd({
      id: crypto.randomUUID(),
      name,
      duration: durationInSeconds,
      delay: parseInt(delay),
    });

    setName('');
    setDuration(isMinutes ? '1' : '60');
    setDelay('10');
  };

  const handleUnitToggle = () => {
    const currentValue = parseFloat(duration);
    if (isMinutes) {
      // Converting from minutes to seconds
      setDuration(Math.round(currentValue * 60).toString());
    } else {
      // Converting from seconds to minutes
      setDuration((currentValue / 60).toFixed(1).replace(/\.0$/, ''));
    }
    setIsMinutes(!isMinutes);
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-4 md:p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-2">
            Exercise Name
          </h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-white bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none"
            placeholder="e.g., Push-ups"
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white">
              Duration
            </h3>
            <button
              type="button"
              onClick={handleUnitToggle}
              className="text-sm text-white/80 hover:text-white flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Clock size={14} />
              {isMinutes ? 'Switch to seconds' : 'Switch to minutes'}
            </button>
          </div>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-white bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none"
            min={isMinutes ? "0.1" : "1"}
            step={isMinutes ? "0.1" : "1"}
            required
          />
          <span className="text-sm text-white/60 mt-1 block">
            {isMinutes ? 'minutes' : 'seconds'}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-2">
            Delay (s)
          </h3>
          <input
            type="number"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-white bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none"
            min="0"
            required
          />
        </div>
        <div className="lg:col-span-4 flex justify-center md:justify-end mt-4">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 justify-center border border-white/20 hover:border-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <Plus size={20} />
            Add Exercise
          </button>
        </div>
      </div>
    </form>
  );
}