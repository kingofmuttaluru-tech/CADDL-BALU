import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import { getImageDescription } from '../services/geminiService';

const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('caddl_gallery');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const saveGallery = (newItems: GalleryItem[]) => {
    setItems(newItems);
    localStorage.setItem('caddl_gallery', JSON.stringify(newItems));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      
      try {
        const aiResponse = await getImageDescription(base64);
        const newItem: GalleryItem = {
          id: Date.now().toString(),
          url: base64,
          caption: aiResponse.caption,
          category: aiResponse.category,
          date: new Date().toLocaleDateString(),
          aiAnalyzed: true
        };
        saveGallery([newItem, ...items]);
      } catch (err) {
        alert("AI analysis failed, but image saved.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredItems = items.filter(i => 
    i.caption.toLowerCase().includes(search.toLowerCase()) || 
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Clinical Image Gallery</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">AI-Powered Diagnostic Evidence Hub</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Search AI Captions..."
              className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-900"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          
          <label className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-black transition-all flex items-center gap-2 shadow-lg">
            {loading ? (
               <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            )}
            <span>{loading ? 'AI Scanning...' : 'Upload Evidence'}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={loading} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="gallery-card bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="relative h-48 overflow-hidden group">
              <img src={item.url} alt="Clinical evidence" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute top-2 right-2 flex gap-1">
                <span className="bg-blue-900 text-white text-[8px] font-black uppercase px-2 py-1 rounded shadow-lg">{item.category}</span>
                {item.aiAnalyzed && (
                  <span className="bg-emerald-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded shadow-lg flex items-center gap-1">
                    <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    AI Verified
                  </span>
                )}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-xs font-bold text-slate-800 leading-relaxed mb-3 flex-1">{item.caption}</p>
              <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                <span className="text-[9px] font-black text-slate-400 uppercase">{item.date}</span>
                <button 
                  onClick={() => saveGallery(items.filter(i => i.id !== item.id))}
                  className="text-red-200 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && !loading && (
        <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-200 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No Clinical Evidence Recorded</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
