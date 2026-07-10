import React from 'react';
import styles from './GlassContainer.module.css';

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassContainer({ children, className = '', ...props }: GlassContainerProps) {
  return (
    <div className={`${styles.glass} ${className}`} {...props}>
      {children}
    </div>
  );
}
