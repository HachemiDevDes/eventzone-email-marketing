import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eventzone Email Platform",
  description: "Email Marketing Platform built for Eventzone",
};

import Link from 'next/link';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable}`}>
      <body>
        <header style={{ 
          borderBottom: '1px solid var(--border-subtle)', 
          background: 'var(--surface-dark)',
          padding: '0 var(--screen-padding)'
        }}>
          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>
              Eventzone Email
            </div>
            <nav style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
              <Link href="/campaigns" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: 14 }}>Campaigns</Link>
              <Link href="/templates" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: 14 }}>Templates</Link>
              <Link href="/lists" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: 14 }}>Lists</Link>
              <Link href="/contacts" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: 14 }}>Contacts</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
