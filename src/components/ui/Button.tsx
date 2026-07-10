import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  as?: React.ElementType;
}

export function Button({ children, variant = 'primary', as: Component = 'button', className = '', ...props }: ButtonProps) {
  return (
    <Component 
      className={`${styles.button} ${styles[variant]} ${className}`} 
      {...props}
    >
      {children}
    </Component>
  );
}
