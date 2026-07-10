import React from 'react';
import styles from './Avatar.module.css';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  initials?: string;
  size?: 'list' | 'card' | 'profile' | 'header';
  isConnected?: boolean;
}

const sizeMap = {
  list: 32,
  card: 48,
  profile: 80,
  header: 120,
};

export function Avatar({ 
  src, 
  initials, 
  size = 'list', 
  isConnected = false, 
  className = '', 
  ...props 
}: AvatarProps) {
  const dimension = sizeMap[size];

  return (
    <div 
      className={`${styles.avatar} ${isConnected ? styles.connected : ''} ${className}`}
      style={{ width: dimension, height: dimension, borderRadius: '50%' }}
      {...props}
    >
      {src ? (
        <img src={src} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <span className={styles.initials} style={{ fontSize: dimension * 0.4 }}>
          {initials}
        </span>
      )}
    </div>
  );
}
