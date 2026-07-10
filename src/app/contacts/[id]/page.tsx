import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Mail, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ContactDetailsPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Note: we must await params in Next.js 15+ 
  const id = params.id;

  const { data: contact, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !contact) {
    notFound();
  }

  // Fetch lists the contact belongs to
  const { data: listMemberships } = await supabase
    .from('list_memberships')
    .select('join_method, created_at, lists(name, type)')
    .eq('contact_id', id);

  // Fetch engagement history
  const { data: events } = await supabase
    .from('events')
    .select('event_type, created_at, campaigns(name)')
    .eq('contact_id', id)
    .order('created_at', { ascending: false });

  return (
    <main style={{ padding: 'var(--screen-padding)', maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ marginBottom: 'var(--spacing-xl)' }}>
        <Link href="/contacts" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
          <ArrowLeft size={16} /> Back to Contacts
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
          <Avatar initials={contact.email.substring(0, 2)} size="profile" />
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: 'var(--spacing-xs)' }}>{contact.name || 'Unnamed Contact'}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>{contact.email}</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Badge variant={
              contact.status === 'subscribed' ? 'success' : 
              contact.status === 'bounced' ? 'error' : 'warning'
            }>
              {contact.status}
            </Badge>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <GlassContainer>
            <h2 style={{ fontSize: 20, marginBottom: 'var(--spacing-md)' }}>List Memberships</h2>
            {listMemberships && listMemberships.length > 0 ? (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {listMemberships.map((membership: any, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{membership.lists?.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Joined via {membership.join_method}</div>
                    </div>
                    <Badge variant={membership.lists?.type === 'dynamic' ? 'warning' : 'info'}>
                      {membership.lists?.type}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Not a member of any list.</p>
            )}
          </GlassContainer>
        </div>

        <div>
          <GlassContainer>
            <h2 style={{ fontSize: 20, marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Activity size={20} /> Engagement History
            </h2>
            {events && events.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Event</th>
                    <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Campaign</th>
                    <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((evt: any, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: 'var(--spacing-md) 0', textTransform: 'capitalize', fontWeight: 500 }}>
                        <span style={{ color: evt.event_type === 'click' ? 'var(--accent-electric)' : 'inherit' }}>
                          {evt.event_type}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--spacing-md) 0' }}>{evt.campaigns?.name || 'Unknown Campaign'}</td>
                      <td style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontSize: 13 }}>
                        {new Date(evt.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>No engagement history yet.</p>
            )}
          </GlassContainer>
        </div>
      </div>
    </main>
  );
}
