import { Button } from '@/components/ui/Button';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { Plus, MoreVertical, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MessageSquareQuote, CheckSquare, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ padding: 'var(--spacing-lg)', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.5px' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Welcome</span>, Let's dive into your personalized setup guide.
          </p>
        </div>
        <Button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1C3D32', color: 'white', borderRadius: '8px', padding: '10px 16px', fontWeight: 600 }}>
          <Plus size={18} /> Create campaigns
        </Button>
      </div>

      {/* Performance Over Time Card */}
      <GlassContainer style={{ padding: 0, marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 'var(--spacing-lg)' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Performance Over Time</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>29 Sept, 2024</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid var(--border-subtle)', borderRadius: '6px', backgroundColor: '#F9FAFB', fontSize: '13px', fontWeight: 500 }}>
              <ChevronDown size={14} /> Short
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid var(--border-subtle)', borderRadius: '6px', backgroundColor: '#F9FAFB', fontSize: '13px', fontWeight: 500 }}>
              <Filter size={14} /> Filter
            </button>
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', border: '1px solid var(--border-subtle)', borderRadius: '6px', backgroundColor: '#F9FAFB' }}>
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: 'var(--spacing-lg)' }}>
          {/* Delivered */}
          <div style={{ borderRight: '1px solid var(--border-subtle)', paddingRight: 'var(--spacing-lg)' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Delivered</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 700 }}>42,642.1</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#ECFDF5', color: '#10B981', fontSize: '12px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>
                +0.02% <ChevronUp size={12} style={{ marginLeft: '2px' }} />
              </span>
            </div>
          </div>
          {/* Opened */}
          <div style={{ borderRight: '1px solid var(--border-subtle)', padding: '0 var(--spacing-lg)' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Opened</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 700 }}>26,843</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#FEF2F2', color: '#EF4444', fontSize: '12px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>
                -0.02% <ChevronDown size={12} style={{ marginLeft: '2px' }} />
              </span>
            </div>
          </div>
          {/* Clicked */}
          <div style={{ borderRight: '1px solid var(--border-subtle)', padding: '0 var(--spacing-lg)' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Clicked</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 700 }}>525,753</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#ECFDF5', color: '#10B981', fontSize: '12px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>
                +0.02% <ChevronUp size={12} style={{ marginLeft: '2px' }} />
              </span>
            </div>
          </div>
          {/* Subscribe */}
          <div style={{ paddingLeft: 'var(--spacing-lg)' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Subscribe</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 700 }}>425</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#ECFDF5', color: '#10B981', fontSize: '12px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>
                +0.02% <ChevronUp size={12} style={{ marginLeft: '2px' }} />
              </span>
            </div>
          </div>
        </div>
      </GlassContainer>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--spacing-lg)' }}>
        {/* Campaign Performance Chart */}
        <GlassContainer style={{ padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Campaign Performance</h2>
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent' }}>
              <MoreVertical size={16} color="var(--text-secondary)" />
            </button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1 }}>$24,747.01</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>29 Sept, 2024</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#ECFDF5', color: '#10B981', fontSize: '13px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px' }}>
                ↑ 12%
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>vs last month</span>
            </div>
          </div>

          {/* Simple Mock Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1, padding: '0 16px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px dashed var(--border-subtle)', zIndex: 0 }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>78%</div>
              <div style={{ width: '48px', height: '140px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}></div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Jan</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>34%</div>
              <div style={{ width: '48px', height: '80px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}></div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Feb</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#EF4444' }}>67%</div>
              <div style={{ width: '56px', height: '180px', backgroundColor: '#FF8A65', borderRadius: '8px', boxShadow: '0 8px 16px rgba(255, 138, 101, 0.4)' }}></div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Mar</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>28%</div>
              <div style={{ width: '48px', height: '60px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}></div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Apr</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>39%</div>
              <div style={{ width: '48px', height: '100px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}></div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>May</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>80%</div>
              <div style={{ width: '48px', height: '150px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}></div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Jun</div>
            </div>
          </div>
        </GlassContainer>

        {/* Schedule Campaign */}
        <GlassContainer style={{ padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Schedule Campaign</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>September 2024</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button style={{ padding: '4px', border: '1px solid var(--border-subtle)', borderRadius: '4px', backgroundColor: 'transparent' }}><ChevronLeft size={14} /></button>
              <button style={{ padding: '4px', border: '1px solid var(--border-subtle)', borderRadius: '4px', backgroundColor: 'transparent' }}><ChevronRight size={14} /></button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>{day}</span>
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: i === 4 ? 600 : 500, 
                  color: i === 4 ? 'var(--accent-electric)' : 'var(--text-primary)',
                  backgroundColor: i === 4 ? 'var(--status-info-bg)' : 'transparent',
                  padding: '4px 8px',
                  borderRadius: '16px'
                }}>
                  {15 + i}
                </span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '8px' }}>Today</div>
          <div style={{ display: 'flex', padding: '12px', backgroundColor: '#FEF3C7', borderRadius: '8px', marginBottom: '16px', borderLeft: '4px solid #F59E0B' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
              <CheckSquare size={16} color="#D97706" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400E', marginBottom: '2px' }}>Element of Design Test</div>
              <div style={{ fontSize: '11px', color: '#B45309', fontWeight: 500 }}>10:00 - 11:00 AM</div>
            </div>
            <MoreVertical size={16} color="#B45309" />
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '8px' }}>Sat, Jan 20</div>
          <div style={{ display: 'flex', padding: '12px', backgroundColor: '#FCE7F3', borderRadius: '8px', borderLeft: '4px solid #EC4899' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
              <Sparkles size={16} color="#BE185D" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#9D174D', marginBottom: '2px' }}>Design Principle Test</div>
              <div style={{ fontSize: '11px', color: '#BE185D', fontWeight: 500 }}>10:00 - 11:00 AM</div>
            </div>
            <MoreVertical size={16} color="#BE185D" />
          </div>
        </GlassContainer>
      </div>
      
      {/* Floating Action Button from Mockup */}
      <div style={{ position: 'fixed', bottom: '32px', right: '32px', width: '56px', height: '56px', backgroundColor: '#1C3D32', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(28, 61, 50, 0.4)', cursor: 'pointer', zIndex: 100 }}>
        <MessageSquareQuote color="white" size={24} />
      </div>
    </div>
  );
}
