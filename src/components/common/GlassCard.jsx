import React from 'react';
import clsx from 'clsx';

export const GlassCard = ({ children, className = '', glow = false, ...props }) => {
  return (
    <div
      className={clsx(
        'glass-card rounded-2xl p-5',
        glow && 'glow-card-primary',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
