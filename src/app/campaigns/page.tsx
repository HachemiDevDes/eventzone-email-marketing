import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Send } from 'lucide-react';
import Link from 'next/link';
import { sendCampaign } from './actions';
import { redirect } from 'next/navigation';

export default async function CampaignsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*, templates(name), campaign_target_lists(lists(name))')
    .order('created_at', { ascending: false });

  // A tiny inline server action just to wrap the button click
  async function handleSend(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    if (id) await sendCampaign(id);
    redirect('/campaigns');
  }

  return (
    <main style={{ padding: 'var(--screen-padding)', maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: 'var(--spacing-xs)' }}>Campaigns</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Send emails and track their performance.</p>
        </div>
        <div>
          <Link href="/campaigns/new">
            <Button as="span">
              <Plus size={20} /> Create Campaign
            </Button>
          </Link>
        </div>
      </header>

      <GlassContainer>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</th>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Template</th>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Target List</th>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}>Created</th>
              <th style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontWeight: 500 }}></th>
            </tr>
          </thead>
          <tbody>
            {campaigns && campaigns.length > 0 ? (
              campaigns.map((campaign) => {
                const listName = campaign.campaign_target_lists?.[0]?.lists?.name || 'None';
                return (
                  <tr key={campaign.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: 'var(--spacing-md) 0', fontWeight: 600 }}>{campaign.name}</td>
                    <td style={{ padding: 'var(--spacing-md) 0' }}>
                      <Badge variant={
                        campaign.status === 'sent' ? 'success' : 
                        campaign.status === 'draft' ? 'info' : 'warning'
                      }>
                        {campaign.status}
                      </Badge>
                    </td>
                    <td style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)' }}>
                      {campaign.templates?.name || 'None'}
                    </td>
                    <td style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)' }}>
                      {listName}
                    </td>
                    <td style={{ padding: 'var(--spacing-md) 0', color: 'var(--text-secondary)', fontSize: 13 }}>
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: 'var(--spacing-md) 0', textAlign: 'right' }}>
                      {campaign.status === 'draft' ? (
                        <form action={handleSend}>
                          <input type="hidden" name="id" value={campaign.id} />
                          <Button type="submit" variant="primary" style={{ padding: '6px 12px', fontSize: 13 }}>
                            <Send size={14} style={{ marginRight: 6 }} /> Send Now
                          </Button>
                        </form>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Locked</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {error ? `Error: ${error.message}` : 'No campaigns yet. Create one to get started.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassContainer>
    </main>
  );
}
