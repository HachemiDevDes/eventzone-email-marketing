'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, LayoutTemplate, Users, List, Settings, LogOut, UserCircle } from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/campaigns', label: 'Campaigns', icon: Mail },
  { href: '/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/lists', label: 'Lists', icon: List },
  { href: '/contacts', label: 'Contacts', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.headerText}>Eventzone Email</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <Icon size={20} />
              <span className={styles.navItemLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.account}>
          <UserCircle size={32} style={{ color: 'var(--text-secondary)' }} />
          <div className={styles.accountName}>
            <div>Workspace User</div>
            <div className={styles.accountSub}>Admin</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-sm)' }}>
          <button className={`${styles.navItem} ${styles.navItemLabel}`} style={{ flex: 1, padding: '0 8px', height: 32, fontSize: 13 }}>
            <Settings size={16} /> Settings
          </button>
          <button className={`${styles.navItem} ${styles.navItemLabel}`} style={{ flex: 1, padding: '0 8px', height: 32, fontSize: 13 }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
