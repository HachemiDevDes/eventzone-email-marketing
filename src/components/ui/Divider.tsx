import React from 'react';
import styles from './Divider.module.css';

export function Divider({ className = '', ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={`${styles.divider} ${className}`} {...props} />;
}
