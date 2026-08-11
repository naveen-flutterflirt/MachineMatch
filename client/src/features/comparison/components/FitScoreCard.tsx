'use client';

import React from 'react';
import { Award, Sparkles } from 'lucide-react';

interface FitScoreCardProps {
  modelName: string;
  score: number;
}

export function FitScoreCard({ modelName, score }: FitScoreCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mb-3 border border-emerald-200">
        <Award className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-slate-900 mb-1">{modelName}</h4>
      <div className="text-3xl font-extrabold text-emerald-700 my-1">{score}%</div>
      <span className="text-xs text-slate-500">AI Match Fit Score</span>
    </div>
  );
}
