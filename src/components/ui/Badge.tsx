import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

export function Badge({ variant = 'info', className = '', children, ...props }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
