'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { GlassContainer } from '../ui/GlassContainer';
import { Button } from '../ui/Button';
import { bulkImportContacts } from '@/app/contacts/actions';
import { useState, Suspense } from 'react';
import Papa from 'papaparse';

function ContactUploadModalInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOpen = searchParams.get('action') === 'import-csv';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const close = () => router.push('/contacts');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const contacts = results.data.map((row: any) => ({
            email: row.email || row.Email || '',
            name: row.name || row.Name || row.first_name || ''
          })).filter(c => c.email);

          await bulkImportContacts(contacts);
          setSuccessMsg(`Successfully imported ${contacts.length} contacts!`);
          setTimeout(close, 2000);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
      }
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <GlassContainer style={{ width: 500 }}>
        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Import CSV</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
          Upload a CSV file containing <strong>email</strong> and <strong>name</strong> columns.
        </p>
        
        {error && <div style={{ color: 'var(--status-error)', marginBottom: 'var(--spacing-sm)' }}>{error}</div>}
        {successMsg && <div style={{ color: 'var(--status-success)', marginBottom: 'var(--spacing-sm)' }}>{successMsg}</div>}
        
        <div style={{ border: '2px dashed var(--border-subtle)', borderRadius: 12, padding: 'var(--spacing-xl)', textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
          <input type="file" accept=".csv" onChange={handleFileUpload} disabled={loading} style={{ display: 'none' }} id="csv-upload" />
          <Button type="button" variant="secondary" disabled={loading} onClick={() => document.getElementById('csv-upload')?.click()}>
            {loading ? 'Processing...' : 'Select CSV File'}
          </Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="button" variant="secondary" onClick={close} disabled={loading}>Close</Button>
        </div>
      </GlassContainer>
    </div>
  );
}

export function ContactUploadModal() {
  return <Suspense fallback={null}><ContactUploadModalInner /></Suspense>;
}
