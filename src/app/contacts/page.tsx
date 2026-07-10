import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { UserPlus, Upload, Search } from 'lucide-react';
import Link from 'next/link';
import { AddContactModal } from '@/components/contacts/AddContactModal';
import { ContactUploadModal } from '@/components/contacts/ContactUploadModal';

export default async function ContactsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main style={{ padding: 'var(--screen-padding)', maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: 'var(--spacing-xs)' }}>Contacts</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your audience and segments.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <Link href="/contacts?action=import-csv">
            <Button variant="secondary" as="span">
              <Upload size={20} /> Import CSV
            </Button>
          </Link>
          <Link href="/contacts?action=add-contact">
            <Button as="span">
              <UserPlus size={20} /> Add Contact
            </Button>
          </Link>
        </div>
      </header>

      <GlassContainer>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
          <div style={{ position: 'relative', width: 300 }}>
            <Search size={20} style={{ position: 'absolute', left: 16, top: 16, color: 'var(--text-secondary)' }} />
            <input 
              placeholder="Search contacts..." 
              style={{
                background: 'var(--surface-dark)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 12,
                height: 52,
                color: 'var(--text-primary)',
                padding: '0 16px 0 48px',
                width: '100%',
                outline: 'none',
                fontFamily: 'var(--font-space-grotesk)'
              }}
            />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Contact</th>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Added</th>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}></th>
            </tr>
          </thead>
          <tbody>
            {contacts && contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr key={contact.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: 'var(--spacing-md) 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                      <Avatar initials={contact.email.substring(0, 2)} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{contact.name || 'Unknown'}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{contact.email}</div>
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
                  <td style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontSize: 13 }}>
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: 'var(--spacing-md) 0', textAlign: 'right' }}>
                    <Link href={`/contacts/${contact.id}`} style={{ color: 'var(--accent-electric)', fontWeight: 500, fontSize: 13 }}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {error ? `Error: ${error.message} (Are you logged in?)` : 'No contacts found. Add some to get started.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassContainer>

      <AddContactModal />
      <ContactUploadModal />
    </main>
  );
}
