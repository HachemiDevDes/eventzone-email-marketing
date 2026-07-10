import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Users } from 'lucide-react';
import Link from 'next/link';

export default async function ListsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch lists with member count
  const { data: lists, error } = await supabase
    .from('lists')
    .select('*, list_memberships(count)')
    .order('created_at', { ascending: false });

  return (
    <main style={{ padding: 'var(--screen-padding)', maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: 'var(--spacing-xs)' }}>Segments & Lists</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Group your contacts to send targeted campaigns.</p>
        </div>
        <div>
          <Link href="/lists/new">
            <Button as="span">
              <Plus size={20} /> Create List
            </Button>
          </Link>
        </div>
      </header>

      <GlassContainer>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</th>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Type</th>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Members</th>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Created</th>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}></th>
            </tr>
          </thead>
          <tbody>
            {lists && lists.length > 0 ? (
              lists.map((list) => {
                const memberCount = list.list_memberships[0]?.count || 0;
                return (
                  <tr key={list.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: 'var(--spacing-md) 0', fontWeight: 600 }}>{list.name}</td>
                    <td style={{ padding: 'var(--spacing-md) 0' }}>
                      <Badge variant={list.type === 'dynamic' ? 'warning' : 'info'}>
                        {list.type}
                      </Badge>
                      {list.type === 'dynamic' && list.rule_definition && (
                        <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 'var(--spacing-xs)' }}>
                          Auto-updates via clicks
                        </div>
                      )}
                    </td>
                    <td style={{ padding: 'var(--spacing-md) 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--text-secondary)' }}>
                        <Users size={16} /> {memberCount}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontSize: 13 }}>
                      {new Date(list.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: 'var(--spacing-md) 0', textAlign: 'right' }}>
                      <Link href={`/lists/${list.id}`} style={{ color: 'var(--accent-electric)', fontWeight: 500, fontSize: 13 }}>
                        Manage List
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {error ? `Error: ${error.message}` : 'No lists created yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassContainer>
    </main>
  );
}
