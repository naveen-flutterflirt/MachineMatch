'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CardProps extends HTMLMotionProps<'div'> {
  hoverEffect?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Card({ hoverEffect = true, children, className, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 text-slate-900',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
