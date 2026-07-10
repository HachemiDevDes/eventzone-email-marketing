import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ListDetailsPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const id = params.id;

  const { data: list, error } = await supabase
    .from('lists')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !list) {
    notFound();
  }

  // Fetch list members
  const { data: memberships } = await supabase
    .from('list_memberships')
    .select('join_method, created_at, contacts(*)')
    .eq('list_id', id)
    .order('created_at', { ascending: false });

  return (
    <main style={{ padding: 'var(--screen-padding)', maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ marginBottom: 'var(--spacing-xl)' }}>
        <Link href="/lists" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
          <ArrowLeft size={16} /> Back to Lists
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: 'var(--spacing-xs)' }}>{list.name}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
              {memberships?.length || 0} members • Created {new Date(list.created_at).toLocaleDateString()}
            </p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--spacing-sm)' }}>
            <Badge variant={list.type === 'dynamic' ? 'warning' : 'info'}>
              {list.type}
            </Badge>
          </div>
        </div>
      </header>

      <GlassContainer>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
          <Users size={20} />
          <h2 style={{ fontSize: 20 }}>List Members</h2>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Contact</th>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Join Method</th>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {memberships && memberships.length > 0 ? (
              memberships.map((membership: any) => {
                const contact = membership.contacts;
                if (!contact) return null;
                return (
                  <tr key={contact.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: 'var(--spacing-md) 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <Avatar initials={contact.email.substring(0, 2)} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{contact.name || 'Unknown'}</div>
                          <Link href={`/contacts/${contact.id}`} style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                            {contact.email}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--spacing-md) 0' }}>
                      <Badge variant={
                        contact.status === 'subscribed' ? 'success' : 
                        contact.status === 'bounced' ? 'error' : 'warning'
                      }>
                        {contact.status}
                      </Badge>
                    </td>
                    <td style={{ padding: 'var(--spacing-md) 0', textTransform: 'capitalize' }}>
                      {membership.join_method}
                    </td>
                    <td style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontSize: 13 }}>
                      {new Date(membership.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  This list is currently empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassContainer>
    </main>
  );
}
