import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createCampaign } from '../actions';
import { redirect } from 'next/navigation';

export default async function NewCampaignPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [{ data: templates }, { data: lists }] = await Promise.all([
    supabase.from('templates').select('id, name').order('updated_at', { ascending: false }),
    supabase.from('lists').select('id, name, type').order('created_at', { ascending: false })
  ]);

  async function handleSubmit(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const subject = formData.get('subject') as string;
    const senderName = formData.get('senderName') as string;
    const templateId = formData.get('templateId') as string;
    const listId = formData.get('listId') as string;

    if (name && subject && senderName && templateId && listId) {
      await createCampaign(name, subject, senderName, templateId, listId);
      redirect('/campaigns');
    }
  }

  return (
    <main style={{ padding: 'var(--screen-padding)', maxWidth: 800, margin: '0 auto' }}>
      <header style={{ marginBottom: 'var(--spacing-xl)' }}>
        <Link href="/campaigns" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
          <ArrowLeft size={16} /> Back to Campaigns
        </Link>
        <h1 style={{ fontSize: '32px', marginBottom: 'var(--spacing-xs)' }}>Create Campaign</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configure your email campaign and select an audience.</p>
      </header>

      <GlassContainer>
        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>Campaign Name (Internal)</label>
            <Input name="name" required placeholder="e.g. Q3 Product Update" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>Email Subject Line</label>
              <Input name="subject" required placeholder="You won't believe this new feature..." />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>Sender Name</label>
              <Input name="senderName" required placeholder="Eventzone Team" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>Email Template</label>
            <select 
              name="templateId" 
              required
              style={{ width: '100%', background: 'var(--surface-dark)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12, outline: 'none', fontFamily: 'var(--font-space-grotesk)' }}
            >
              <option value="">Select a template...</option>
              {templates?.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {(!templates || templates.length === 0) && (
              <div style={{ color: 'var(--status-warning)', fontSize: 13, marginTop: 'var(--spacing-xs)' }}>
                You don't have any templates yet. <Link href="/templates/new" style={{ color: 'var(--accent-electric)' }}>Create one first.</Link>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 500 }}>Target List</label>
            <select 
              name="listId" 
              required
              style={{ width: '100%', background: 'var(--surface-dark)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12, outline: 'none', fontFamily: 'var(--font-space-grotesk)' }}
            >
              <option value="">Select an audience list...</option>
              {lists?.map(l => (
                <option key={l.id} value={l.id}>{l.name} ({l.type})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)' }}>
            <Button type="submit">Create Campaign</Button>
          </div>
        </form>
      </GlassContainer>
    </main>
  );
}
