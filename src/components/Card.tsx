import React from 'react';
import { cn } from '../utils/cn';

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 shadow-2xl", className)}>
    {children}
  </div>
);

export default Card;