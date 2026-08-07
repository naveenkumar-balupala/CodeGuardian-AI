import React from 'react';

interface Props {
  className?: string;
  count?: number;
}

export const SkeletonLoader: React.FC<Props> = ({ className = 'h-16 w-full', count = 1 }) => {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse rounded-2xl bg-slate-800/60 border border-border/40 ${className}`}
        />
      ))}
    </div>
  );
};
