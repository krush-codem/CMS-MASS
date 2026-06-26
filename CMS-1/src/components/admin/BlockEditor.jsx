import { useState } from 'react';

export default function BlockEditor({ blocks = [], onChange }) {
  const addBlock = (type) => {
    const newBlock = { id: crypto.randomUUID(), type };
    if (type === 'text') newBlock.value = '';
    else if (type === 'heading') { newBlock.value = ''; newBlock.level = 'h2'; }
    else if (type === 'image') newBlock.value = '';
    else if (type === 'author_spotlight') { newBlock.authorName = ''; newBlock.bio = ''; }
    
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id, field, value) => {
    onChange(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const removeBlock = (id) => onChange(blocks.filter(b => b.id !== id));

  const moveBlock = (index, dir) => {
    if (index + dir < 0 || index + dir >= blocks.length) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + dir];
    newBlocks[index + dir] = temp;
    onChange(newBlocks);
  };

  return (
    <div className="space-y-6 bg-surface border border-border-light shadow-sm p-8 rounded-3xl border border-border-light/50 shadow-sm">
      <div className="flex justify-between items-center border-b border-border-light/30 pb-4">
        <h3 className="text-xl font-display font-bold text-black-forest">Dynamic Layout Editor</h3>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs font-bold text-black-forest/50 uppercase self-center mr-2">Add Block:</span>
        {['text', 'heading', 'image', 'separator', 'author_spotlight'].map(type => (
          <button 
            key={type} type="button" 
            onClick={() => addBlock(type)} 
            className="px-4 py-2 bg-surface-elevated text-black-forest text-sm font-medium rounded-full border border-border-light hover:bg-copperwood hover:text-white transition-colors duration-300 capitalize"
          >
            + {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {blocks.map((block, index) => (
          <div key={block.id} className="group p-6 border border-border-light/50 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 relative pl-16">
            
            {/* Controls sidebar */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-surface-elevated/50 border-r border-border-light/50 rounded-l-2xl flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} className="text-black-forest/40 hover:text-black-forest disabled:opacity-20 p-1">↑</button>
              <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} className="text-black-forest/40 hover:text-black-forest disabled:opacity-20 p-1">↓</button>
              <button type="button" onClick={() => removeBlock(block.id)} className="text-red-400 hover:text-red-600 p-1 mt-2">✕</button>
            </div>

            <span className="text-[10px] font-bold text-copperwood uppercase tracking-wider mb-4 block bg-copperwood/10 w-max px-2 py-1 rounded">
              {block.type.replace('_', ' ')}
            </span>
            
            {block.type === 'text' && (
              <textarea 
                value={block.value || ''} 
                onChange={(e) => updateBlock(block.id, 'value', e.target.value)}
                className="w-full p-4 bg-surface-elevated/30 border border-border-light rounded-xl focus:ring-2 focus:ring-cozy-accent outline-none transition-all resize-y min-h-[100px]"
                placeholder="Write your text here..."
              />
            )}

            {block.type === 'heading' && (
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => updateBlock(block.id, 'level', block.level === 'h2' ? 'h3' : 'h2')}
                  className="px-4 py-2 bg-surface-elevated text-black-forest font-bold rounded-xl border border-border-light hover:bg-surface-elevated transition-colors w-16"
                >
                  {block.level?.toUpperCase() || 'H2'}
                </button>
                <input 
                  type="text" 
                  value={block.value || ''} 
                  onChange={(e) => updateBlock(block.id, 'value', e.target.value)}
                  className="flex-1 p-3 bg-surface-elevated/30 border border-border-light rounded-xl focus:ring-2 focus:ring-cozy-accent outline-none transition-all font-display text-lg"
                  placeholder="Heading text..."
                />
              </div>
            )}

            {block.type === 'image' && (
              <div className="border-2 border-dashed border-border-light/80 rounded-xl p-6 text-center bg-surface-elevated/20 transition-colors hover:bg-surface-elevated/50">
                {block.value && (
                  <div className="mb-4 flex justify-center">
                    <img src={block.value} alt="Preview" className="max-h-64 object-cover rounded-xl shadow-sm border border-border-light" />
                  </div>
                )}
                <input 
                  type="text" 
                  value={block.value || ''} 
                  onChange={(e) => updateBlock(block.id, 'value', e.target.value)}
                  className="w-full p-3 bg-white border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent text-sm"
                  placeholder="Paste Image URL here to generate preview..."
                />
              </div>
            )}

            {block.type === 'separator' && (
              <div className="py-4">
                <hr className="border-t-2 border-dotted border-border-light" />
              </div>
            )}

            {block.type === 'author_spotlight' && (
              <div className="space-y-3 bg-surface-elevated/30 p-4 rounded-xl border border-border-light/50">
                <input 
                  type="text" 
                  value={block.authorName || ''} 
                  onChange={(e) => updateBlock(block.id, 'authorName', e.target.value)}
                  className="w-full p-3 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent"
                  placeholder="Author Name"
                />
                <textarea 
                  value={block.bio || ''} 
                  onChange={(e) => updateBlock(block.id, 'bio', e.target.value)}
                  className="w-full p-3 border border-border-light rounded-xl outline-none focus:ring-2 focus:ring-cozy-accent"
                  placeholder="Author Quote or Bio"
                  rows="2"
                />
              </div>
            )}
          </div>
        ))}
        {blocks.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-border-light/50 rounded-2xl">
            <p className="text-black-forest/50 font-medium">No layout blocks added yet. Start composing above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
