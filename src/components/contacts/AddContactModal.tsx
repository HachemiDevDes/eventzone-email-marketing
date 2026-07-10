'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { GlassContainer } from '../ui/GlassContainer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { addContact } from '@/app/contacts/actions';
import { useState, Suspense } from 'react';

function AddContactModalInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOpen = searchParams.get('action') === 'add-contact';
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const close = () => router.push('/contacts');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await addContact(email, name);
      close();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <GlassContainer style={{ width: 400 }}>
        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Add Contact</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <Input 
            placeholder="Email Address" 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <Input 
            placeholder="Full Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          {error && <div style={{ color: 'var(--status-error)', fontSize: 13 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end', marginTop: 'var(--spacing-sm)' }}>
            <Button type="button" variant="secondary" onClick={close}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Contact'}</Button>
          </div>
        </form>
      </GlassContainer>
    </div>
  );
}

export function AddContactModal() {
  return <Suspense fallback={null}><AddContactModalInner /></Suspense>;
}
