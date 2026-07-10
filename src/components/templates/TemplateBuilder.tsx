'use client';

import { useState } from 'react';
import { GlassContainer } from '../ui/GlassContainer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ContentBlock, compileEmailHtml } from '@/utils/emailCompiler';
import { GripVertical, Trash2, Image as ImageIcon, Type, Link as LinkIcon, Minus, Box } from 'lucide-react';
import { saveTemplate } from '@/app/templates/actions';
import { useRouter } from 'next/navigation';

export function TemplateBuilder({ initialId, initialName, initialBlocks }: { initialId?: string, initialName?: string, initialBlocks?: ContentBlock[] }) {
  const router = useRouter();
  const [name, setName] = useState(initialName || 'Untitled Template');
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks || []);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addBlock = (type: ContentBlock['type']) => {
    let newBlock: ContentBlock;
    const baseId = generateId();
    switch (type) {
      case 'text': newBlock = { id: baseId, type, content: 'Enter your text here...', align: 'left', color: '#333333' }; break;
      case 'image': newBlock = { id: baseId, type, url: 'https://via.placeholder.com/600x200', alt: 'Placeholder' }; break;
      case 'button': newBlock = { id: baseId, type, label: 'Click Here', url: '#', color: '#1A73E8', textColor: '#ffffff' }; break;
      case 'spacer': newBlock = { id: baseId, type, height: 40 }; break;
      case 'divider': newBlock = { id: baseId, type, color: '#e5e7eb', padding: 20 }; break;
      default: return;
    }
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } as ContentBlock : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('blockIndex', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    const dragIndex = parseInt(e.dataTransfer.getData('blockIndex'), 10);
    if (dragIndex === dropIndex || isNaN(dragIndex)) return;
    
    const newBlocks = [...blocks];
    const [draggedBlock] = newBlocks.splice(dragIndex, 1);
    newBlocks.splice(dropIndex, 0, draggedBlock);
    setBlocks(newBlocks);
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const html = compileEmailHtml(blocks);
      const res = await saveTemplate(initialId || null, name, blocks, html);
      if (!initialId) {
        router.push(`/templates/${res.id}`);
      } else {
        alert('Saved successfully!');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);
  const compiledHtml = compileEmailHtml(blocks);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 350px', height: 'calc(100vh - 120px)', gap: 'var(--spacing-md)' }}>
      {/* LEFT PANEL: Elements */}
      <GlassContainer style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', overflowY: 'auto' }}>
        <h3 style={{ fontSize: 18 }}>Elements</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
          <Button variant="secondary" onClick={() => addBlock('text')} style={{ flexDirection: 'column', gap: 8, height: 80 }}><Type size={20} /> Text</Button>
          <Button variant="secondary" onClick={() => addBlock('image')} style={{ flexDirection: 'column', gap: 8, height: 80 }}><ImageIcon size={20} /> Image</Button>
          <Button variant="secondary" onClick={() => addBlock('button')} style={{ flexDirection: 'column', gap: 8, height: 80 }}><LinkIcon size={20} /> Button</Button>
          <Button variant="secondary" onClick={() => addBlock('spacer')} style={{ flexDirection: 'column', gap: 8, height: 80 }}><Box size={20} /> Spacer</Button>
          <Button variant="secondary" onClick={() => addBlock('divider')} style={{ flexDirection: 'column', gap: 8, height: 80 }}><Minus size={20} /> Divider</Button>
        </div>
      </GlassContainer>

      {/* MIDDLE PANEL: Canvas / Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <GlassContainer style={{ padding: 'var(--spacing-sm)', display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <Input value={name} onChange={e => setName(e.target.value)} style={{ flex: 1, fontWeight: 'bold' }} placeholder="Template Name" />
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', background: 'var(--surface-dark)', padding: 4, borderRadius: 8 }}>
            <button 
              onClick={() => setActiveTab('editor')}
              style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: activeTab === 'editor' ? 'var(--accent-electric)' : 'transparent', color: activeTab === 'editor' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Editor
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: activeTab === 'preview' ? 'var(--accent-electric)' : 'transparent', color: activeTab === 'preview' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Preview
            </button>
          </div>
          <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Template'}</Button>
        </GlassContainer>

        {error && <div style={{ color: 'var(--status-error)', textAlign: 'center' }}>{error}</div>}

        <div style={{ flex: 1, background: '#f4f4f4', borderRadius: 16, overflow: 'hidden', display: 'flex', justifyContent: 'center', padding: '40px 0', overflowY: 'auto' }}>
          {activeTab === 'editor' ? (
            <div style={{ width: 600, background: '#ffffff', minHeight: 400, borderRadius: 8, overflow: 'hidden' }}>
              {blocks.length === 0 ? (
                <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                  Drag or click elements to add them here.
                </div>
              ) : (
                blocks.map((block, idx) => (
                  <div 
                    key={block.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, idx)}
                    onClick={() => setSelectedBlockId(block.id)}
                    style={{ 
                      position: 'relative', 
                      outline: selectedBlockId === block.id ? '2px solid var(--accent-electric)' : '1px dashed transparent',
                      cursor: 'pointer',
                      transition: 'outline 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.outline = selectedBlockId === block.id ? '2px solid var(--accent-electric)' : '1px dashed #ccc')}
                    onMouseLeave={e => (e.currentTarget.style.outline = selectedBlockId === block.id ? '2px solid var(--accent-electric)' : '1px dashed transparent')}
                  >
                    <div style={{ position: 'absolute', left: -30, top: '50%', transform: 'translateY(-50%)', cursor: 'grab', color: '#999', opacity: selectedBlockId === block.id ? 1 : 0 }}>
                      <GripVertical size={20} />
                    </div>
                    
                    {/* Render Block Mockup in Editor */}
                    <div style={{ pointerEvents: 'none' }}>
                      {block.type === 'text' && (
                        <div style={{ padding: 16, textAlign: block.align, color: block.color, fontFamily: 'sans-serif' }} dangerouslySetInnerHTML={{__html: block.content}} />
                      )}
                      {block.type === 'image' && (
                        <img src={block.url} alt={block.alt} style={{ width: '100%', display: 'block' }} />
                      )}
                      {block.type === 'button' && (
                        <div style={{ padding: 24, textAlign: 'center' }}>
                          <span style={{ display: 'inline-block', background: block.color, color: block.textColor, padding: '14px 28px', borderRadius: 6, fontWeight: 'bold', fontFamily: 'sans-serif' }}>{block.label}</span>
                        </div>
                      )}
                      {block.type === 'spacer' && (
                        <div style={{ height: block.height, background: 'rgba(0,0,0,0.02)' }} />
                      )}
                      {block.type === 'divider' && (
                        <div style={{ padding: `${block.padding}px 16px` }}>
                          <hr style={{ border: 'none', borderTop: `1px solid ${block.color}`, margin: 0 }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%' }}>
              <iframe 
                srcDoc={compiledHtml} 
                style={{ width: '100%', height: '100%', border: 'none' }} 
                title="Preview"
              />
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Properties */}
      <GlassContainer style={{ overflowY: 'auto' }}>
        <h3 style={{ fontSize: 18, marginBottom: 'var(--spacing-md)' }}>Properties</h3>
        {!selectedBlock ? (
          <p style={{ color: 'var(--text-secondary)' }}>Select a block to edit its properties.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge variant="info" style={{ textTransform: 'uppercase' }}>{selectedBlock.type}</Badge>
              <Button variant="destructive" onClick={() => removeBlock(selectedBlock.id)} style={{ padding: '6px 12px' }}><Trash2 size={16} /></Button>
            </div>
            
            {selectedBlock.type === 'text' && (
              <>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Content (HTML allowed)</label>
                <textarea 
                  value={selectedBlock.content} 
                  onChange={e => updateBlock(selectedBlock.id, { content: e.target.value })}
                  style={{ width: '100%', background: 'var(--surface-dark)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12, minHeight: 150, fontFamily: 'var(--font-space-grotesk)' }}
                />
                <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Text Color</label>
                <Input type="color" value={selectedBlock.color} onChange={e => updateBlock(selectedBlock.id, { color: e.target.value })} />
                <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Alignment</label>
                <select 
                  value={selectedBlock.align} 
                  onChange={e => updateBlock(selectedBlock.id, { align: e.target.value as 'left'|'center'|'right' })}
                  style={{ width: '100%', background: 'var(--surface-dark)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12 }}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </>
            )}

            {selectedBlock.type === 'image' && (
              <>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Image URL</label>
                <Input value={selectedBlock.url} onChange={e => updateBlock(selectedBlock.id, { url: e.target.value })} />
                <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Alt Text</label>
                <Input value={selectedBlock.alt} onChange={e => updateBlock(selectedBlock.id, { alt: e.target.value })} />
                <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Link URL (optional)</label>
                <Input value={selectedBlock.link || ''} onChange={e => updateBlock(selectedBlock.id, { link: e.target.value })} />
              </>
            )}

            {selectedBlock.type === 'button' && (
              <>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Label</label>
                <Input value={selectedBlock.label} onChange={e => updateBlock(selectedBlock.id, { label: e.target.value })} />
                <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Link URL</label>
                <Input value={selectedBlock.url} onChange={e => updateBlock(selectedBlock.id, { url: e.target.value })} />
                <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Button Color</label>
                <Input type="color" value={selectedBlock.color} onChange={e => updateBlock(selectedBlock.id, { color: e.target.value })} />
                <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Text Color</label>
                <Input type="color" value={selectedBlock.textColor} onChange={e => updateBlock(selectedBlock.id, { textColor: e.target.value })} />
              </>
            )}

            {selectedBlock.type === 'spacer' && (
              <>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Height (px)</label>
                <Input type="number" value={selectedBlock.height} onChange={e => updateBlock(selectedBlock.id, { height: parseInt(e.target.value) || 0 })} />
              </>
            )}

            {selectedBlock.type === 'divider' && (
              <>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Color</label>
                <Input type="color" value={selectedBlock.color} onChange={e => updateBlock(selectedBlock.id, { color: e.target.value })} />
                <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Vertical Padding (px)</label>
                <Input type="number" value={selectedBlock.padding} onChange={e => updateBlock(selectedBlock.id, { padding: parseInt(e.target.value) || 0 })} />
              </>
            )}
          </div>
        )}
      </GlassContainer>
    </div>
  );
}
