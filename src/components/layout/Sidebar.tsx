'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusSquare, Network, Users, LayoutTemplate, Lock, ChevronDown, UserCircle, ChevronsUpDown } from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/', label: 'Overview', icon: Home },
  { href: '/campaigns/new', label: 'Create campaign', icon: PlusSquare },
  { href: '/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/automation', label: 'Automation', icon: Network },
  { href: '/contacts', label: 'Contacts', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.headerText}>emitly</span>
      </div>

      <div className={styles.workspaceBlock}>
        <div className={styles.workspaceIcon}>
          <Lock size={14} />
        </div>
        <div className={styles.workspaceInfo}>
          <div className={styles.workspaceName}>My Workspace</div>
          <div className={styles.workspacePlan}>Free plan</div>
        </div>
        <ChevronDown size={16} className={styles.workspaceChevron} />
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          // Special case for root path to avoid it always being active
          const isActive = item.href === '/' 
            ? pathname === '/' 
            : pathname?.startsWith(item.href);
            
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <Icon size={18} />
              <span className={styles.navItemLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.account}>
          <UserCircle size={36} style={{ color: 'var(--text-secondary)' }} />
          <div className={styles.accountNameBlock}>
            <div className={styles.accountName}>James Passaquindici</div>
            <div className={styles.accountEmail}>jamespass@emi.com</div>
          </div>
          <ChevronsUpDown size={14} className={styles.accountChevron} />
        </div>
      </div>
    </aside>
  );
}
