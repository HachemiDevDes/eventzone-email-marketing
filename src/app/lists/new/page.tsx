import { cookies } from 'next/headers';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createList } from '../actions';
import { redirect } from 'next/navigation';

export default function NewListPage() {
  async function handleSubmit(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const type = formData.get('type') as 'static' | 'dynamic';
    const eventType = formData.get('eventType') as string;
    
    let rule_definition = null;
    if (type === 'dynamic') {
      rule_definition = { event_type: eventType };
    }

    if (name && type) {
      await createList(name, type, rule_definition);
      redirect('/lists');
    }
  }

  return (
    <main style={{ padding: 'var(--screen-padding)', maxWidth: 800, margin: '0 auto' }}>
      <header style={{ marginBottom: 'var(--spacing-xl)' }}>
        <Link href="/lists" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
          <ArrowLeft size={16} /> Back to Lists
        </Link>
        <h1 style={{ fontSize: '32px', marginBottom: 'var(--spacing-xs)' }}>Create List</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Group contacts statically or dynamically.</p>
      </header>

      <GlassContainer>
        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>List Name</label>
            <Input name="name" required placeholder="e.g. VIP Customers" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>List Type</label>
            <select 
              name="type" 
              required
              style={{ width: '100%', background: 'var(--surface-dark)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12, outline: 'none', fontFamily: 'var(--font-space-grotesk)' }}
            >
              <option value="static">Static (Manual & CSV)</option>
              <option value="dynamic">Dynamic (Auto-updates via Triggers)</option>
            </select>
          </div>

          <div style={{ padding: 'var(--spacing-md)', background: 'var(--surface-dark)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>Dynamic Rule (if Dynamic)</label>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>Select what action triggers a contact to join this list automatically.</p>
            <select 
              name="eventType" 
              style={{ width: '100%', background: 'var(--surface-dark)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12, outline: 'none', fontFamily: 'var(--font-space-grotesk)' }}
            >
              <option value="click">They clicked a link in any campaign</option>
              <option value="open">They opened any campaign</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)' }}>
            <Button type="submit">Create List</Button>
          </div>
        </form>
      </GlassContainer>
    </main>
  );
}
