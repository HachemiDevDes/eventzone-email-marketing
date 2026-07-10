import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { Button } from '@/components/ui/Button';
import { Plus, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';

export default async function TemplatesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: templates, error } = await supabase
    .from('templates')
    .select('*')
    .order('updated_at', { ascending: false });

  return (
    <main style={{ padding: 'var(--screen-padding)', maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: 'var(--spacing-xs)' }}>Email Templates</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Design responsive emails for your campaigns.</p>
        </div>
        <div>
          <Link href="/templates/new">
            <Button as="span">
              <Plus size={20} /> New Template
            </Button>
          </Link>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
        <Link href="/templates/new" style={{ textDecoration: 'none' }}>
          <GlassContainer style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-md)', border: '2px dashed var(--border-subtle)', cursor: 'pointer', transition: 'border-color 0.2s ease', minHeight: 250 }}>
            <div style={{ background: 'var(--surface-dark)', padding: 'var(--spacing-md)', borderRadius: '50%', color: 'var(--accent-electric)' }}>
              <Plus size={32} />
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Create Blank Template</div>
          </GlassContainer>
        </Link>

        {templates?.map((template) => (
          <GlassContainer key={template.id} style={{ display: 'flex', flexDirection: 'column', minHeight: 250, padding: 0, overflow: 'hidden' }}>
            <div style={{ flex: 1, background: 'var(--surface-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
              <LayoutTemplate size={48} />
            </div>
            <div style={{ padding: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{template.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Updated {new Date(template.updated_at).toLocaleDateString()}</div>
              </div>
              <Link href={`/templates/${template.id}`}>
                <Button variant="secondary" as="span" style={{ padding: '8px 16px', fontSize: 13 }}>Edit</Button>
              </Link>
            </div>
          </GlassContainer>
        ))}
      </div>
      
      {error && (
        <div style={{ color: 'var(--status-error)', marginTop: 'var(--spacing-md)' }}>
          Failed to load templates: {error.message}
        </div>
      )}
    </main>
  );
}
