import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { Badge } from '@/components/ui/Badge';
import { Plus, Users, Mail, Activity, MousePointerClick, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const stats = [
    { label: 'Total Contacts', value: '14,208', icon: Users, trend: '+12% this month' },
    { label: 'Active Campaigns', value: '3', icon: Mail, trend: '2 scheduled' },
    { label: 'Avg. Open Rate', value: '42.8%', icon: Activity, trend: '+4.1% vs last month' },
    { label: 'Avg. Click Rate', value: '18.4%', icon: MousePointerClick, trend: '+1.2% vs last month' },
  ];

  const recentCampaigns = [
    { id: '1', name: 'Summer Product Launch', status: 'sending', sentAt: 'Today, 09:00 AM', opens: '45%', clicks: '12%' },
    { id: '2', name: 'Weekly Newsletter - Issue #42', status: 'completed', sentAt: 'Jul 8, 10:00 AM', opens: '41%', clicks: '18%' },
    { id: '3', name: 'Q3 Feature Updates', status: 'draft', sentAt: '-', opens: '-', clicks: '-' },
  ];

  return (
    <div style={{ padding: 'var(--screen-padding)', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Overview</h1>
        <Link href="/campaigns/new">
          <Button style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Plus size={18} /> New Campaign
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-xxl)'
      }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <GlassContainer key={i} style={{ padding: 'var(--spacing-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>{stat.label}</div>
                <div style={{ padding: '8px', backgroundColor: 'var(--glass-bg)', borderRadius: '8px' }}>
                  <Icon size={20} style={{ color: 'var(--accent-bright)' }} />
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: 'var(--spacing-xs)' }}>{stat.value}</div>
              <div style={{ color: 'var(--status-success)', fontSize: '13px', fontWeight: 500 }}>{stat.trend}</div>
            </GlassContainer>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Recent Campaigns</h2>
        <Link href="/campaigns" style={{ color: 'var(--accent-bright)', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
          View all <ArrowRight size={16} />
        </Link>
      </div>
      
      <GlassContainer style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <th style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: 500 }}>Campaign Name</th>
                <th style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: 500 }}>Sent/Scheduled</th>
                <th style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: 500 }}>Opens</th>
                <th style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: 500 }}>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {recentCampaigns.map((campaign, i) => (
                <tr key={campaign.id} style={{ 
                  borderBottom: i === recentCampaigns.length - 1 ? 'none' : '1px solid var(--border-subtle)'
                }}>
                  <td style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: 500 }}>{campaign.name}</td>
                  <td style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}>
                    <Badge variant={
                      campaign.status === 'completed' ? 'success' : 
                      campaign.status === 'sending' ? 'info' : undefined
                    }>
                      {campaign.status}
                    </Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-md) var(--spacing-lg)', color: 'var(--text-secondary)', fontSize: '14px' }}>{campaign.sentAt}</td>
                  <td style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: 500 }}>{campaign.opens}</td>
                  <td style={{ padding: 'var(--spacing-md) var(--spacing-lg)', fontWeight: 500 }}>{campaign.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassContainer>
    </div>
  );
}
