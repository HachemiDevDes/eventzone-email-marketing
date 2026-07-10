import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Eventzone Email Platform",
  description: "Email Marketing Platform built for Eventzone",
};

import { Search, Gift, Bell, ChevronDown, UserCircle } from 'lucide-react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100vh', 
            overflowY: 'auto',
            backgroundColor: 'var(--bg-navy)'
          }}>
            {/* Top Header Bar */}
            <header style={{
              height: '72px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 var(--screen-padding)',
              backgroundColor: 'var(--surface-elevated)',
              borderBottom: '1px solid var(--border-subtle)',
              position: 'sticky',
              top: 0,
              zIndex: 30
            }}>
              {/* Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: '8px', padding: '8px 12px', width: '320px', gap: '8px' }}>
                <Search size={16} color="var(--text-secondary)" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  style={{ border: 'none', background: 'transparent', flex: 1, fontSize: '14px', outline: 'none', color: 'var(--text-primary)' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span style={{ backgroundColor: '#E5E7EB', padding: '2px 6px', borderRadius: '4px' }}>⌘</span>
                  <span style={{ backgroundColor: '#E5E7EB', padding: '2px 6px', borderRadius: '4px' }}>K</span>
                </div>
              </div>

              {/* Profile & Notifications */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <button style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#F3F4F6', border: 'none', cursor: 'pointer' }}>
                    <Gift size={18} color="var(--text-secondary)" />
                  </button>
                  <button style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#F3F4F6', border: 'none', cursor: 'pointer' }}>
                    <Bell size={18} color="var(--text-secondary)" />
                  </button>
                </div>
                
                <div style={{ height: '32px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                  <UserCircle size={32} color="var(--text-secondary)" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>James Passaquindici</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.2 }}>ID: 4827682</span>
                  </div>
                  <ChevronDown size={16} color="var(--text-secondary)" style={{ marginLeft: '4px' }} />
                </div>
              </div>
            </header>

            {/* Main Content Area */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
