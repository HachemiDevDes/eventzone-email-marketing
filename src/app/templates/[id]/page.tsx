import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { TemplateBuilder } from '@/components/templates/TemplateBuilder';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function TemplateEditorPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const id = params.id;
  const isNew = id === 'new';

  let initialName = '';
  let initialBlocks = [];

  if (!isNew) {
    const { data: template, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !template) {
      notFound();
    }

    initialName = template.name;
    initialBlocks = template.content_blocks || [];
  }

  return (
    <main style={{ padding: 'var(--screen-padding)', maxWidth: 1600, margin: '0 auto' }}>
      <header style={{ marginBottom: 'var(--spacing-md)' }}>
        <Link href="/templates" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Templates
        </Link>
      </header>

      <TemplateBuilder 
        initialId={isNew ? undefined : id} 
        initialName={initialName} 
        initialBlocks={initialBlocks} 
      />
    </main>
  );
}
