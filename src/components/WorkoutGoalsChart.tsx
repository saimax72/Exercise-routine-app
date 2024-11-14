import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Exercise } from '../types';

interface WorkoutGoalsChartProps {
  exercises: Exercise[];
}

export default function WorkoutGoalsChart({ exercises }: WorkoutGoalsChartProps) {
  if (exercises.length === 0) return null;

  const totalDuration = exercises.reduce((acc, ex) => acc + ex.duration, 0);
  
  const data = exercises.map(exercise => ({
    name: exercise.name,
    value: (exercise.duration / totalDuration) * 100,
    duration: exercise.duration,
  }));

  const COLORS = [
    '#6366f1', // Indigo
    '#8b5cf6', // Purple
    '#d946ef', // Fuchsia
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#3b82f6', // Blue
    '#06b6d4', // Cyan
    '#14b8a6', // Teal
  ];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 5 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm"
      >
        {`${(percent * 1).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-light p-3 rounded-lg">
          <p className="text-white font-medium">{payload[0].payload.name}</p>
          <p className="text-white/80">
            Duration: {payload[0].payload.duration}s
          </p>
          <p className="text-white/80">
            {payload[0].payload.value.toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Workout Distribution</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="transition-opacity hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value, entry: any) => (
                <span className="text-white/80">{value}</span>
              )}
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}