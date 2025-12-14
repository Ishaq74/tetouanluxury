
import React, { useState } from 'react';
import { 
    Edit, Trash2, Plus, X, Image as ImageIcon, MapPin, 
    MoreHorizontal, FolderOpen, Save, Search, AlertCircle, Link as LinkIcon
} from 'lucide-react';
// Les données et actions sont désormais passées en props depuis Astro
import { BlogPost, GuideItem, PremiumService, FAQItem, Category, IndexPageSettings, LocalizedString } from '../../../../types';
import { FullScreenEditor, MediaPicker, TranslatableInput, StandardToolbar, SEOPreview, Modal } from '../AdminShared';

// --- SHARED: Module Header ---
const ModuleHeader = ({ title, subTab, tabs, onTabChange }: { title: string, subTab: string, tabs: string[], onTabChange: (t: string) => void }) => (
    <div className="flex justify-between items-center mb-0 shrink-0 px-8 pt-8 pb-4">
        <div>
            <h2 className="font-serif text-3xl text-slate-900">{title}</h2>
            <div className="flex space-x-6 text-sm text-slate-600 mt-4 border-b border-stone-200 w-full min-w-[300px]">
                {tabs.map((tab) => (
                    <button 
                        key={tab} 
                        onClick={() => onTabChange(tab)} 
                        className={`pb-3 transition uppercase text-xs font-bold tracking-widest ${subTab === tab ? 'border-b-2 border-amber-600 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                    >
                        {tab.replace('_', ' ')}
                    </button>
                ))}
            </div>
        </div>
    </div>
);

// --- COMPONENT: Index Page Settings ---
type IndexPageEditorProps = {
    type: string;
    indexPageSettings: IndexPageSettings[];
    updateIndexPageSettings: (settings: IndexPageSettings) => void;
    showToast: (msg: string, type?: string) => void;
};
const IndexPageEditor = ({ type, indexPageSettings, updateIndexPageSettings, showToast }: IndexPageEditorProps) => {
    // Props attendues : indexPageSettings, updateIndexPageSettings, showToast
    
    // Find settings or create default
    const settings = indexPageSettings.find(s => s.id === type) || {
        id: type,
        heroTitle: { EN:'', FR:'', ES:'', AR:'' },
        heroSubtitle: { EN:'', FR:'', ES:'', AR:'' },
        seo: { title: { EN:'', FR:'', ES:'', AR:'' }, description: { EN:'', FR:'', ES:'', AR:'' }, keywords: [] }
    };

    const [tempSettings, setTempSettings] = useState<IndexPageSettings>(settings);

    const handleSave = () => {
        updateIndexPageSettings(tempSettings);
        showToast('Paramètres de page sauvegardés', 'SUCCESS');
    };

    return (
        <div className="p-8 max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8 space-y-8">
                <div className="flex justify-between items-center border-b border-stone-100 pb-6">
                    <h3 className="font-serif text-xl text-slate-900">Configuration de la Page d'Index ({type})</h3>
                    <button onClick={handleSave} className="btn-primary">Enregistrer</button>
                </div>

                <div className="space-y-6">
                    <h4 className="font-bold text-sm uppercase text-slate-500 tracking-wider mb-4">En-tête (Hero)</h4>
                    <TranslatableInput label="Titre Principal" value={tempSettings.heroTitle} onChange={v => setTempSettings({...tempSettings, heroTitle: v})} />
                    <TranslatableInput label="Sous-titre" value={tempSettings.heroSubtitle} onChange={v => setTempSettings({...tempSettings, heroSubtitle: v})} />
                </div>

                <div className="space-y-6 pt-6 border-t border-stone-100">
                    <h4 className="font-bold text-sm uppercase text-slate-500 tracking-wider mb-4">Référencement (SEO)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <TranslatableInput label="Titre Meta (SEO)" value={tempSettings.seo.title} onChange={v => setTempSettings({...tempSettings, seo: {...tempSettings.seo, title: v}})} />
                            <TranslatableInput label="Description Meta" value={tempSettings.seo.description} onChange={v => setTempSettings({...tempSettings, seo: {...tempSettings.seo, description: v}})} type="textarea" />
                        </div>
                        <div>
                            <label className="label-xs mb-4 block">Aperçu</label>
                            <SEOPreview title={tempSettings.seo.title.FR} desc={tempSettings.seo.description.FR} slug={type.toLowerCase()} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: Category Manager V2 (Unified) ---
type CategoryManagerProps = {
    type: 'BLOG' | 'GUIDE' | 'SERVICE';
    categories: Category[];
    addCategory: (cat: Category) => void;
    updateCategory: (cat: Category) => void;
    deleteCategory: (id: string) => void;
    showToast: (msg: string, type?: string) => void;
};
const CategoryManager = ({ type, categories, addCategory, updateCategory, deleteCategory, showToast }: CategoryManagerProps) => {
    // Props attendues : categories, addCategory, updateCategory, deleteCategory, showToast
    const [editingCat, setEditingCat] = useState<Category | null>(null);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'LIST' | 'GRID'>('LIST');
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [editorTab, setEditorTab] = useState('DETAILS');

    const filteredCats = categories.filter(c => c.type === type && c.name.FR.toLowerCase().includes(search.toLowerCase()));

    const handleSave = () => {
        if(!editingCat || !editingCat.name.FR) return showToast('Nom FR requis', 'ERROR');
        const catToSave = { 
            ...editingCat, 
            id: editingCat.id || `CAT-${type}-${Date.now()}`,
            type,
            count: 0 
        } as Category;
        editingCat.id ? updateCategory(catToSave) : addCategory(catToSave);
        setEditingCat(null);
        showToast('Catégorie sauvegardée', 'SUCCESS');
    };

    const openEditor = (cat?: Category) => {
        setEditingCat(cat || { 
            id: '', type, name: {EN:'',FR:'',ES:'',AR:''}, description: {EN:'',FR:'',ES:'',AR:''}, slug: '', image: '', count: 0,
            seo: { title: {EN:'',FR:'',ES:'',AR:''}, description: {EN:'',FR:'',ES:'',AR:''}, keywords: [] }
        });
        setEditorTab('DETAILS');
    };

    return (
        <div className="animate-fade-in h-full flex flex-col">
            <StandardToolbar 
                search={search} onSearch={setSearch} 
                viewMode={viewMode} onViewChange={setViewMode}
                onAdd={() => openEditor()} addLabel="Nouvelle Catégorie"
            />

            <div className="flex-1 overflow-y-auto p-8">
                {viewMode === 'GRID' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredCats.map(cat => (
                            <div key={cat.id} className="bg-white rounded-lg border border-stone-200 overflow-hidden group hover:shadow-lg transition relative cursor-pointer" onClick={() => openEditor(cat)}>
                                <div className="h-40 bg-stone-200 relative">
                                    {cat.image ? <img src={cat.image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon/></div>}
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-slate-800">{cat.name.FR}</h4>
                                    <div className="mt-3 flex justify-between items-center">
                                        <span className="text-[10px] font-mono bg-stone-100 px-2 py-1 rounded text-slate-500">/{cat.slug}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{cat.count} items</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold uppercase text-slate-500"><tr><th className="p-4">Nom</th><th className="p-4">Slug</th><th className="p-4">Items</th><th className="p-4 text-right">Actions</th></tr></thead>
                            <tbody className="divide-y divide-stone-100">
                                {filteredCats.map(cat => (
                                    <tr key={cat.id} className="hover:bg-stone-50 cursor-pointer" onClick={() => openEditor(cat)}>
                                        <td className="p-4 font-bold text-slate-800 flex items-center"><FolderOpen size={16} className="mr-3 text-amber-500"/> {cat.name.FR}</td>
                                        <td className="p-4 text-xs font-mono text-slate-500">{cat.slug}</td>
                                        <td className="p-4 text-sm">{cat.count}</td>
                                        <td className="p-4 text-right"><button onClick={(e) => { e.stopPropagation(); if(confirm('Supprimer?')) deleteCategory(cat.id); }} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {editingCat && (
                <>
                <FullScreenEditor
                    title={editingCat.id ? `Éditer: ${editingCat.name.FR}` : 'Nouvelle Catégorie'}
                    status="ACTIVE"
                    onClose={() => setEditingCat(null)}
                    onSave={handleSave}
                    activeTab={editorTab}
                    onTabChange={setEditorTab}
                    tabs={[{id: 'DETAILS', label: 'Détails'}, {id: 'SEO', label: 'SEO'}]}
                    sidebarContent={
                        <>
                            <div>
                                <label className="label-xs">Image</label>
                                <div onClick={() => setShowMediaPicker(true)} className="aspect-square bg-stone-100 rounded border border-stone-200 flex items-center justify-center cursor-pointer hover:opacity-80 transition relative overflow-hidden">
                                    {editingCat.image ? <img src={editingCat.image} className="w-full h-full object-cover" /> : <span className="text-xs text-slate-400">Choisir</span>}
                                </div>
                            </div>
                            <div>
                                <label className="label-xs">Slug URL</label>
                                <input className="input-std" value={editingCat.slug} onChange={e => setEditingCat({...editingCat, slug: e.target.value})} placeholder="slug-categorie" />
                            </div>
                        </>
                    }
                >
                    {editorTab === 'DETAILS' && (
                        <div className="space-y-6 max-w-2xl">
                            <TranslatableInput label="Nom" value={editingCat.name} onChange={v => setEditingCat({...editingCat, name: v})} />
                            <TranslatableInput label="Description" value={editingCat.description} onChange={v => setEditingCat({...editingCat, description: v})} type="textarea" />
                        </div>
                    )}
                    {editorTab === 'SEO' && (
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <TranslatableInput label="Titre SEO" value={editingCat.seo?.title || {EN:'',FR:'',ES:'',AR:''}} onChange={v => setEditingCat({...editingCat, seo: {...editingCat.seo!, title: v}})} />
                                <TranslatableInput label="Description SEO" value={editingCat.seo?.description || {EN:'',FR:'',ES:'',AR:''}} onChange={v => setEditingCat({...editingCat, seo: {...editingCat.seo!, description: v}})} type="textarea" />
                            </div>
                            <div>
                                <label className="label-xs mb-4 block">Aperçu</label>
                                <SEOPreview title={editingCat.seo?.title.FR || editingCat.name.FR} desc={editingCat.seo?.description.FR || ''} slug={`categorie/${editingCat.slug}`} />
                            </div>
                        </div>
                    )}
                </FullScreenEditor>
                {showMediaPicker && <MediaPicker onSelect={(url) => setEditingCat({...editingCat, image: url})} onClose={() => setShowMediaPicker(false)} />}
                </>
            )}
        </div>
    );
};

// --- 1. BLOG MANAGER ---
type BlogManagerProps = {
    subTab?: string;
    setSubTab?: (val: string) => void;
    blogPosts: BlogPost[];
    addBlogPost: (post: BlogPost) => void;
    updateBlogPost: (post: BlogPost) => void;
    deleteBlogPost: (id: string) => void;
    categories: Category[];
    addCategory: (cat: Category) => void;
    updateCategory: (cat: Category) => void;
    deleteCategory: (id: string) => void;
    indexPageSettings: IndexPageSettings[];
    updateIndexPageSettings: (settings: IndexPageSettings) => void;
    showToast: (msg: string, type?: string) => void;
};
export const BlogManager = ({ subTab, setSubTab, blogPosts, addBlogPost, updateBlogPost, deleteBlogPost, categories, addCategory, updateCategory, deleteCategory, indexPageSettings, updateIndexPageSettings, showToast }: BlogManagerProps) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editorTab, setEditorTab] = useState('CONTENT');
    const [editingPost, setEditingPost] = useState<Partial<BlogPost>>({});
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'LIST' | 'GRID'>('LIST');

    const blogCategories = categories.filter(c => c.type === 'BLOG');
    const filteredPosts = blogPosts.filter(p => p.title.FR.toLowerCase().includes(search.toLowerCase()));

    const openEditor = (post?: BlogPost) => {
        setEditingPost(post || {
            title: {EN: '', FR: '', ES: '', AR: ''}, 
            content: {EN: '', FR: '', ES: '', AR: ''}, 
            slug: '', 
            excerpt: {EN: '', FR: '', ES: '', AR: ''}, 
            status: 'DRAFT', 
            author: 'Admin',
            date: new Date().toISOString().split('T')[0],
            category: blogCategories[0]?.id || '',
            tags: [],
            seo: { title: {EN:'',FR:'',ES:'',AR:''}, description: {EN:'',FR:'',ES:'',AR:''}, keywords: [] }
        });
        setIsEditorOpen(true);
        setEditorTab('CONTENT');
    };

    const handleSave = () => {
        if (!editingPost.title?.FR) return showToast('Titre (FR) requis', 'ERROR');
        const postToSave = {
            ...editingPost,
            slug: editingPost.slug || editingPost.title.FR.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            category: editingPost.category,
            tags: editingPost.tags || [],
            image: editingPost.image || 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1920',
        } as BlogPost;
        editingPost.id ? updateBlogPost(postToSave) : addBlogPost({ ...postToSave, id: `post-${Date.now()}` });
        showToast('Article sauvegardé', 'SUCCESS');
        setIsEditorOpen(false);
    };

    const getCategoryName = (id: string) => {
        const cat = blogCategories.find(c => c.id === id || c.slug === id);
        return cat ? cat.name.FR : id;
    };

    return (
        <div className="h-full flex flex-col animate-fade-in relative bg-stone-50/50">
            <ModuleHeader 
                title="Blog & Actualités" 
                subTab={subTab || 'POSTS'} 
                tabs={['POSTS', 'CATEGORIES', 'INDEX_SETTINGS']} 
                onTabChange={(t) => setSubTab && setSubTab(t)}
            />

            {subTab === 'POSTS' && (
                <>
                    <StandardToolbar 
                        search={search} onSearch={setSearch} 
                        viewMode={viewMode} onViewChange={setViewMode} 
                        onAdd={() => openEditor()} addLabel="Nouvel Article" 
                    />
                    <div className="flex-1 overflow-y-auto p-8">
                        {viewMode === 'LIST' ? (
                            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold uppercase text-slate-500 sticky top-0"><tr><th className="p-4">Titre (FR)</th><th className="p-4">Catégorie</th><th className="p-4">Date</th><th className="p-4">Statut</th><th className="p-4 text-right">Actions</th></tr></thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {filteredPosts.map(post => (
                                            <tr key={post.id} className="hover:bg-stone-50 cursor-pointer group" onClick={() => openEditor(post)}>
                                                <td className="p-4 font-bold text-slate-800">{post.title?.FR || 'Sans titre'}</td>
                                                <td className="p-4 text-xs font-bold uppercase text-slate-500">{getCategoryName(post.category)}</td>
                                                <td className="p-4 text-sm text-slate-600">{post.date}</td>
                                                <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{post.status}</span></td>
                                                <td className="p-4 text-right"><button onClick={(e) => { e.stopPropagation(); deleteBlogPost(post.id); }} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {filteredPosts.map(post => (
                                    <div key={post.id} onClick={() => openEditor(post)} className="bg-white rounded-lg border border-stone-200 overflow-hidden cursor-pointer hover:shadow-lg transition">
                                        <div className="h-40 bg-stone-200"><img src={post.image} className="w-full h-full object-cover" /></div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-slate-800 mb-1">{post.title.FR}</h4>
                                            <p className="text-xs text-slate-500">{post.date} &bull; {getCategoryName(post.category)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

                        {subTab === 'CATEGORIES' && (
                            <CategoryManager
                                type="BLOG"
                                categories={categories}
                                addCategory={addCategory}
                                updateCategory={updateCategory}
                                deleteCategory={deleteCategory}
                                showToast={showToast}
                            />
                        )}
                        {subTab === 'INDEX_SETTINGS' && (
                            <IndexPageEditor
                                type="BLOG"
                                indexPageSettings={indexPageSettings}
                                updateIndexPageSettings={updateIndexPageSettings}
                                showToast={showToast}
                            />
                        )}

            {isEditorOpen && (
                <>
                <FullScreenEditor
                    title={editingPost.title?.FR || 'Nouveau'}
                    status={editingPost.status}
                    onClose={() => setIsEditorOpen(false)}
                    onSave={handleSave}
                    activeTab={editorTab}
                    onTabChange={setEditorTab}
                    tabs={[{id: 'CONTENT', label: 'Contenu'}, {id: 'SEO', label: 'SEO'}]}
                    sidebarContent={
                        <>
                            <div>
                                <label className="label-xs">Slug URL</label>
                                <input value={editingPost.slug || ''} onChange={(e) => setEditingPost({...editingPost, slug: e.target.value})} className="input-std font-mono text-xs" />
                            </div>
                            <div>
                                <label className="label-xs">Catégorie</label>
                                <select className="input-std" value={editingPost.category} onChange={e => setEditingPost({...editingPost, category: e.target.value})}>
                                    <option value="">Sélectionner...</option>
                                    {blogCategories.map(c => <option key={c.id} value={c.id}>{c.name.FR}</option>)}
                                </select>
                            </div>
                            <div><label className="label-xs">Date</label><input type="date" className="input-std" value={editingPost.date} onChange={(e) => setEditingPost({...editingPost, date: e.target.value})} /></div>
                            <div>
                                <label className="label-xs">Image</label>
                                <div onClick={() => setShowMediaPicker(true)} className="aspect-video bg-stone-100 rounded border border-stone-200 flex items-center justify-center cursor-pointer hover:opacity-80 transition relative overflow-hidden">
                                    {editingPost.image ? <img src={editingPost.image} className="w-full h-full object-cover" /> : <span className="text-xs text-slate-400 font-bold uppercase">Choisir</span>}
                                </div>
                            </div>
                        </>
                    }
                >
                    {editorTab === 'CONTENT' && (
                        <div className="space-y-8">
                            <TranslatableInput label="Titre de l'Article" value={editingPost.title!} onChange={(val) => setEditingPost({...editingPost, title: val})} className="text-lg" />
                            <TranslatableInput label="Contenu Principal" value={editingPost.content!} onChange={(val) => setEditingPost({...editingPost, content: val})} type="richtext" />
                        </div>
                    )}
                    {editorTab === 'SEO' && (
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <TranslatableInput label="Méta Description" value={editingPost.excerpt!} onChange={(val) => setEditingPost({...editingPost, excerpt: val})} type="textarea" />
                                <TranslatableInput label="Titre SEO (Optionnel)" value={editingPost.seo?.title || {EN:'',FR:'',ES:'',AR:''}} onChange={v => setEditingPost({...editingPost, seo: {...editingPost.seo!, title: v}})} />
                            </div>
                            <div>
                                <label className="label-xs mb-4 block">Aperçu (FR)</label>
                                <SEOPreview title={editingPost.seo?.title?.FR || editingPost.title?.FR || ''} desc={editingPost.excerpt?.FR || ''} slug={`journal/${editingPost.slug}`} />
                            </div>
                        </div>
                    )}
                </FullScreenEditor>
                {showMediaPicker && <MediaPicker onSelect={(url) => setEditingPost({...editingPost, image: url})} onClose={() => setShowMediaPicker(false)} />}
                </>
            )}
        </div>
    );
};

// --- 2. GUIDE MANAGER ---
type GuideManagerProps = {
    subTab?: string;
    setSubTab?: (val: string) => void;
    guideItems: GuideItem[];
    addGuideItem: (item: GuideItem) => void;
    updateGuideItem: (item: GuideItem) => void;
    deleteGuideItem: (id: string) => void;
    categories: Category[];
    addCategory: (cat: Category) => void;
    updateCategory: (cat: Category) => void;
    deleteCategory: (id: string) => void;
    indexPageSettings: IndexPageSettings[];
    updateIndexPageSettings: (settings: IndexPageSettings) => void;
    showToast: (msg: string, type?: string) => void;
};
export const GuideManager = ({ subTab, setSubTab, guideItems, addGuideItem, updateGuideItem, deleteGuideItem, categories, addCategory, updateCategory, deleteCategory, indexPageSettings, updateIndexPageSettings, showToast }: GuideManagerProps) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editorTab, setEditorTab] = useState('DETAILS');
    const [editingItem, setEditingItem] = useState<Partial<GuideItem>>({});
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'LIST' | 'GRID'>('LIST');

    const guideCategories = categories.filter(c => c.type === 'GUIDE');
    const filteredItems = guideItems.filter(i => (i.title.FR || i.title.EN).toLowerCase().includes(search.toLowerCase()));

    const openEditor = (item?: GuideItem) => {
        setEditingItem(item || { 
            title: {EN:'', FR:'', ES:'', AR: ''}, 
            category: guideCategories[0]?.id || '', 
            location: '', 
            desc: {EN:'', FR:'', ES:'', AR:''}, 
            fullContent: {EN:'', FR:'', ES:'', AR:''}, 
            image: '',
            seo: { title: {EN:'',FR:'',ES:'',AR:''}, description: {EN:'',FR:'',ES:'',AR:''}, keywords: [] }
        });
        setIsEditorOpen(true);
        setEditorTab('DETAILS');
    };

    const handleSave = () => {
        if (!editingItem.title?.FR) return showToast('Nom du lieu (FR) requis', 'ERROR');
        const itemToSave = { ...editingItem, id: editingItem.id || `place-${Date.now()}` } as GuideItem;
        editingItem.id ? updateGuideItem(itemToSave) : addGuideItem(itemToSave);
        showToast('Lieu enregistré', 'SUCCESS');
        setIsEditorOpen(false);
    };

    const getCategoryName = (id: string) => {
        const cat = guideCategories.find(c => c.id === id || c.slug === id); 
        return cat ? cat.name.FR : id;
    };

    return (
        <div className="h-full flex flex-col animate-fade-in relative bg-stone-50/50">
            <ModuleHeader 
                title="Guide de Tétouan" 
                subTab={subTab || 'PLACES'} 
                tabs={['PLACES', 'CATEGORIES', 'INDEX_SETTINGS']} 
                onTabChange={(t) => setSubTab && setSubTab(t)} 
            />
            
            {subTab === 'PLACES' && (
                <>
                    <StandardToolbar 
                        search={search} onSearch={setSearch} 
                        viewMode={viewMode} onViewChange={setViewMode} 
                        onAdd={() => openEditor()} addLabel="Nouveau Lieu" 
                    />
                    <div className="flex-1 overflow-y-auto p-8">
                        {viewMode === 'LIST' ? (
                            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold uppercase text-slate-500 sticky top-0"><tr><th className="p-4">Lieu</th><th className="p-4">Catégorie</th><th className="p-4">Localisation</th><th className="p-4 text-right">Actions</th></tr></thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {filteredItems.map(item => (
                                            <tr key={item.id} className="hover:bg-stone-50 cursor-pointer group" onClick={() => openEditor(item)}>
                                                <td className="p-4 font-bold text-slate-800">{item.title?.FR || item.title?.EN}</td>
                                                <td className="p-4 text-xs font-bold uppercase text-slate-500">{getCategoryName(item.category)}</td>
                                                <td className="p-4 text-sm text-slate-600 flex items-center"><MapPin size={12} className="mr-1"/> {item.location}</td>
                                                <td className="p-4 text-right"><button onClick={(e) => { e.stopPropagation(); deleteGuideItem(item.id); }} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {filteredItems.map(item => (
                                    <div key={item.id} className="bg-white rounded border border-stone-200 group hover:shadow-lg transition flex flex-col cursor-pointer" onClick={() => openEditor(item)}>
                                        <div className="h-40 overflow-hidden bg-stone-200 relative">
                                            <img src={item.image} className="w-full h-full object-cover transition group-hover:scale-110"/>
                                            <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-[10px] font-bold uppercase rounded backdrop-blur-sm">{getCategoryName(item.category)}</span>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-slate-900">{item.title?.FR || item.title?.EN}</h4>
                                            <p className="text-xs text-slate-500 mb-2 flex items-center"><MapPin size={12} className="mr-1"/> {item.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

                        {subTab === 'CATEGORIES' && (
                            <CategoryManager
                                type="GUIDE"
                                categories={categories}
                                addCategory={addCategory}
                                updateCategory={updateCategory}
                                deleteCategory={deleteCategory}
                                showToast={showToast}
                            />
                        )}
                        {subTab === 'INDEX_SETTINGS' && (
                            <IndexPageEditor
                                type="GUIDE"
                                indexPageSettings={indexPageSettings}
                                updateIndexPageSettings={updateIndexPageSettings}
                                showToast={showToast}
                            />
                        )}

            {isEditorOpen && (
                <>
                <FullScreenEditor
                    title={editingItem.title?.FR || 'Nouveau Lieu'}
                    status="PUBLISHED"
                    onClose={() => setIsEditorOpen(false)}
                    onSave={handleSave}
                    activeTab={editorTab}
                    onTabChange={setEditorTab}
                    tabs={[{id: 'DETAILS', label: 'Détails'}, {id: 'CONTENT', label: 'Contenu'}, {id: 'SEO', label: 'SEO'}]}
                    sidebarContent={
                        <>
                            <div>
                                <label className="label-xs">Catégorie</label>
                                <select className="input-std" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
                                    <option value="">Sélectionner...</option>
                                    {guideCategories.map(c => <option key={c.id} value={c.id}>{c.name.FR}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label-xs">Image</label>
                                <div onClick={() => setShowMediaPicker(true)} className="aspect-video bg-stone-100 rounded border border-stone-200 flex items-center justify-center cursor-pointer overflow-hidden hover:opacity-80 transition relative">
                                    {editingItem.image ? <img src={editingItem.image} className="w-full h-full object-cover" /> : <span className="text-xs text-slate-400 font-bold uppercase">Choisir</span>}
                                </div>
                            </div>
                        </>
                    }
                >
                    {editorTab === 'DETAILS' && (
                        <div className="space-y-6 max-w-2xl">
                            <TranslatableInput label="Nom du Lieu" value={editingItem.title!} onChange={v => setEditingItem({...editingItem, title: v})} />
                            <TranslatableInput label="Résumé Court" value={editingItem.desc!} onChange={v => setEditingItem({...editingItem, desc: v})} type="textarea" />
                            <div><label className="label-xs">Localisation</label><input className="input-std" value={editingItem.location || ''} onChange={e => setEditingItem({...editingItem, location: e.target.value})} /></div>
                        </div>
                    )}
                    {editorTab === 'CONTENT' && (
                        <TranslatableInput label="Description Complète" value={editingItem.fullContent!} onChange={v => setEditingItem({...editingItem, fullContent: v})} type="richtext" />
                    )}
                    {editorTab === 'SEO' && (
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <TranslatableInput label="Titre SEO" value={editingItem.seo?.title || {EN:'',FR:'',ES:'',AR:''}} onChange={v => setEditingItem({...editingItem, seo: {...editingItem.seo!, title: v}})} />
                                <TranslatableInput label="Description SEO" value={editingItem.seo?.description || {EN:'',FR:'',ES:'',AR:''}} onChange={v => setEditingItem({...editingItem, seo: {...editingItem.seo!, description: v}})} type="textarea" />
                            </div>
                            <div>
                                <label className="label-xs mb-4 block">Aperçu</label>
                                <SEOPreview title={editingItem.seo?.title?.FR || editingItem.title?.FR || ''} desc={editingItem.seo?.description?.FR || editingItem.desc?.FR || ''} slug={`guide/lieu`} />
                            </div>
                        </div>
                    )}
                </FullScreenEditor>
                {showMediaPicker && <MediaPicker onSelect={(url) => setEditingItem({...editingItem, image: url})} onClose={() => setShowMediaPicker(false)} />}
                </>
            )}
        </div>
    );
};

// --- 3. SERVICE MANAGER (HARMONIZED) ---
type ServiceManagerProps = {
    subTab?: string;
    setSubTab?: (val: string) => void;
    premiumServices: PremiumService[];
    addPremiumService: (srv: PremiumService) => void;
    updatePremiumService: (srv: PremiumService) => void;
    deletePremiumService: (id: string) => void;
    indexPageSettings: IndexPageSettings[];
    updateIndexPageSettings: (settings: IndexPageSettings) => void;
    showToast: (msg: string, type?: string) => void;
};
export const ServiceManager = ({ subTab, setSubTab, premiumServices, addPremiumService, updatePremiumService, deletePremiumService, indexPageSettings, updateIndexPageSettings, showToast }: ServiceManagerProps) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editorTab, setEditorTab] = useState('DETAILS');
    const [editingService, setEditingService] = useState<Partial<PremiumService>>({});
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'LIST' | 'GRID'>('LIST');

    const filteredServices = premiumServices.filter(s => (s.title.FR || s.title.EN).toLowerCase().includes(search.toLowerCase()));

    const openEditor = (srv?: PremiumService) => {
        setEditingService(srv || { 
            title: {EN:'', FR:'', ES:'', AR:''}, 
            category: 'Concierge', 
            price: '', 
            desc: {EN:'', FR:'', ES:'', AR:''}, 
            longDesc: {EN:'', FR:'', ES:'', AR:''},
            seo: { title: {EN:'',FR:'',ES:'',AR:''}, description: {EN:'',FR:'',ES:'',AR:''}, keywords: [] }
        });
        setIsEditorOpen(true);
        setEditorTab('DETAILS');
    };

    const handleSave = () => {
        if (!editingService.title?.FR) return showToast('Titre (FR) requis', 'ERROR');
        const srvToSave = { ...editingService, id: editingService.id || `srv-${Date.now()}` } as PremiumService;
        editingService.id ? updatePremiumService(srvToSave) : addPremiumService(srvToSave);
        showToast('Service enregistré', 'SUCCESS');
        setIsEditorOpen(false);
    };

    return (
        <div className="h-full flex flex-col animate-fade-in relative bg-stone-50/50">
            <ModuleHeader 
                title="Services Premium" 
                subTab={subTab || 'ITEMS'} 
                tabs={['ITEMS', 'INDEX_SETTINGS']} 
                onTabChange={(t) => setSubTab && setSubTab(t)} 
            />
            
            {subTab === 'ITEMS' && (
                <>
                    <StandardToolbar 
                        search={search} onSearch={setSearch} 
                        viewMode={viewMode} onViewChange={setViewMode} 
                        onAdd={() => openEditor()} addLabel="Ajouter Service" 
                    />
                    <div className="flex-1 overflow-y-auto p-8">
                        {viewMode === 'LIST' ? (
                            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold uppercase text-slate-500 sticky top-0"><tr><th className="p-4">Service</th><th className="p-4">Catégorie</th><th className="p-4">Prix</th><th className="p-4 text-right">Actions</th></tr></thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {filteredServices.map(srv => (
                                            <tr key={srv.id} className="hover:bg-stone-50 cursor-pointer group" onClick={() => openEditor(srv)}>
                                                <td className="p-4 font-bold text-slate-800">{srv.title?.FR || srv.title?.EN}</td>
                                                <td className="p-4 text-xs font-bold uppercase text-slate-500">{srv.category}</td>
                                                <td className="p-4 font-mono text-sm text-amber-600 font-bold">{srv.price}</td>
                                                <td className="p-4 text-right"><button onClick={(e) => { e.stopPropagation(); deletePremiumService(srv.id); }} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredServices.map(srv => (
                                    <div key={srv.id} className="bg-white p-6 rounded border border-stone-200 hover:shadow-md transition cursor-pointer flex flex-col" onClick={() => openEditor(srv)}>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] bg-stone-100 px-2 py-1 rounded uppercase font-bold text-slate-500">{srv.category}</span>
                                            <span className="text-amber-600 font-bold text-sm">{srv.price}</span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-lg mb-2">{srv.title?.FR || srv.title?.EN}</h4>
                                        <p className="text-sm text-slate-600 mb-4 flex-1">{srv.desc?.FR || srv.desc?.EN}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

                        {subTab === 'INDEX_SETTINGS' && (
                            <IndexPageEditor
                                type="SERVICES"
                                indexPageSettings={indexPageSettings}
                                updateIndexPageSettings={updateIndexPageSettings}
                                showToast={showToast}
                            />
                        )}

            {isEditorOpen && (
                <FullScreenEditor
                    title={editingService.title?.FR || 'Nouveau Service'}
                    status="ACTIVE"
                    onClose={() => setIsEditorOpen(false)}
                    onSave={handleSave}
                    activeTab={editorTab}
                    onTabChange={setEditorTab}
                    tabs={[{id: 'DETAILS', label: 'Configuration'}, {id: 'SEO', label: 'SEO'}]}
                    sidebarContent={
                        <>
                            <div><label className="label-xs">Prix (Affichage)</label><input className="input-std" value={editingService.price || ''} onChange={e => setEditingService({...editingService, price: e.target.value})} placeholder="ex: 50€ / heure" /></div>
                            <div>
                                <label className="label-xs">Catégorie</label>
                                <select className="input-std" value={editingService.category} onChange={e => setEditingService({...editingService, category: e.target.value as any})}>
                                    <option value="Dining">Dining</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Wellness">Wellness</option>
                                    <option value="Concierge">Concierge</option>
                                </select>
                            </div>
                        </>
                    }
                >
                    {editorTab === 'DETAILS' && (
                        <div className="space-y-6 max-w-2xl">
                            <TranslatableInput label="Nom du Service" value={editingService.title!} onChange={v => setEditingService({...editingService, title: v})} />
                            <TranslatableInput label="Description Courte" value={editingService.desc!} onChange={v => setEditingService({...editingService, desc: v})} type="textarea" />
                            <TranslatableInput label="Description Détaillée" value={editingService.longDesc!} onChange={v => setEditingService({...editingService, longDesc: v})} type="richtext" />
                        </div>
                    )}
                    {editorTab === 'SEO' && (
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <TranslatableInput label="Titre SEO" value={editingService.seo?.title || {EN:'',FR:'',ES:'',AR:''}} onChange={v => setEditingService({...editingService, seo: {...editingService.seo!, title: v}})} />
                                <TranslatableInput label="Description SEO" value={editingService.seo?.description || {EN:'',FR:'',ES:'',AR:''}} onChange={v => setEditingService({...editingService, seo: {...editingService.seo!, description: v}})} type="textarea" />
                            </div>
                            <div><label className="label-xs mb-4 block">Aperçu</label><SEOPreview title={editingService.seo?.title?.FR || editingService.title?.FR || ''} desc={editingService.seo?.description?.FR || editingService.desc?.FR || ''} slug={`services/detail`} /></div>
                        </div>
                    )}
                </FullScreenEditor>
            )}
        </div>
    );
};

// --- 5. FAQ MANAGER ---
type FAQManagerProps = {
    faqs: FAQItem[];
    addFAQ: (faq: FAQItem) => void;
    updateFAQ: (faq: FAQItem) => void;
    deleteFAQ: (id: string) => void;
    showToast: (msg: string, type?: string) => void;
};
export const FAQManager = ({ faqs, addFAQ, updateFAQ, deleteFAQ, showToast }: FAQManagerProps) => {
    const [showModal, setShowModal] = useState(false);
    const [editingFAQ, setEditingFAQ] = useState<Partial<FAQItem>>({});

    const handleSave = () => { 
        if(!editingFAQ.q?.FR) return;
        const newItem = { 
            id: editingFAQ.id || `faq-${Date.now()}`, 
            q: editingFAQ.q as LocalizedString, 
            a: editingFAQ.a as LocalizedString 
        };
        editingFAQ.id ? updateFAQ(newItem as FAQItem) : addFAQ(newItem as FAQItem);
        setShowModal(false); setEditingFAQ({});
        showToast('FAQ mise à jour', 'SUCCESS');
    };

    return (
        <div className="p-8 animate-fade-in relative">
            <div className="flex justify-between items-center mb-6"><h2 className="font-serif text-2xl text-slate-900">FAQ</h2><button onClick={() => { setEditingFAQ({ q: {EN:'',FR:'',ES:'',AR:''}, a: {EN:'',FR:'',ES:'',AR:''} }); setShowModal(true);}} className="btn-primary"><Plus size={16} className="mr-2"/> Ajouter</button></div>
            <div className="space-y-3">
                {faqs.map(f => (
                    <div key={f.id} className="bg-white p-4 rounded border border-stone-200 group hover:border-amber-400 transition cursor-pointer flex justify-between" onClick={() => {setEditingFAQ(f); setShowModal(true);}}>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-1">{f.q?.FR || f.q?.EN}</h4>
                            <p className="text-sm text-slate-600 line-clamp-1">{f.a?.FR || f.a?.EN}</p>
                        </div>
                        <button onClick={(e) => {e.stopPropagation(); deleteFAQ(f.id)}} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                ))}
            </div>
            {showModal && (
                <Modal title="Éditer Question" onClose={() => setShowModal(false)} 
                    footer={
                        <>
                            <button onClick={() => setShowModal(false)} className="btn-secondary">Annuler</button>
                            <button onClick={handleSave} className="btn-primary">Enregistrer</button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <TranslatableInput label="Question" value={editingFAQ.q!} onChange={v => setEditingFAQ({...editingFAQ, q: v})} />
                        <TranslatableInput label="Réponse" value={editingFAQ.a!} onChange={v => setEditingFAQ({...editingFAQ, a: v})} type="textarea" />
                    </div>
                </Modal>
            )}
        </div>
    );
};

// --- 6. MEDIA MANAGER ---
type MediaManagerProps = {
    mediaLibrary: string[];
    addMedia: (url: string) => void;
    showToast: (msg: string, type?: string) => void;
};
export const MediaManager = ({ mediaLibrary, addMedia, showToast }: MediaManagerProps) => {
    const [newUrl, setNewUrl] = useState('');

    const handleAdd = () => {
        if(newUrl) {
            addMedia(newUrl);
            setNewUrl('');
            showToast('Média ajouté', 'SUCCESS');
        }
    };

    return (
        <div className="p-8 animate-fade-in h-full flex flex-col relative bg-stone-50/50">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-slate-900">Médiathèque</h2>
                <div className="flex space-x-2">
                    <input className="input-std w-80" placeholder="URL Image (ex: https://...)" value={newUrl} onChange={e => setNewUrl(e.target.value)} />
                    <button onClick={handleAdd} className="btn-primary"><Plus size={16} className="mr-2"/> Ajouter</button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {mediaLibrary.map((url, i) => (
                        <div key={i} className="aspect-square rounded-lg border border-stone-200 overflow-hidden relative group bg-stone-100">
                            <img src={url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                <button onClick={() => {navigator.clipboard.writeText(url); showToast('Lien copié', 'INFO');}} className="p-2 bg-white rounded-full text-slate-900 hover:text-amber-600 transition" title="Copier Lien"><LinkIcon size={16}/></button>
                                <button className="p-2 bg-white rounded-full text-slate-900 hover:text-red-600 transition" title="Supprimer"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- 7. TRANSLATION MANAGER ---
type TranslationManagerProps = {
    translations: Record<string, Record<string, string>>;
    updateTranslation: (lang: string, key: string, value: string) => void;
};
export const TranslationManager = ({ translations, updateTranslation }: TranslationManagerProps) => {
    const [search, setSearch] = useState('');
    const [activeLang, setActiveLang] = useState<'EN'|'FR'|'ES'|'AR'>('FR');

    const keys = Object.keys(translations['EN']) as Array<keyof typeof translations['EN']>;
    const filteredKeys = keys.filter(k => k.toLowerCase().includes(search.toLowerCase()) || (translations[activeLang] as any)[k]?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-8 animate-fade-in h-full flex flex-col relative bg-stone-50/50">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-slate-900">Traductions</h2>
                <div className="flex bg-white border border-stone-200 rounded p-1">
                    {['FR', 'EN', 'ES', 'AR'].map(lang => (
                        <button 
                            key={lang} 
                            onClick={() => setActiveLang(lang as any)} 
                            className={`px-4 py-1 text-xs font-bold rounded transition ${activeLang === lang ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-stone-50'}`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-stone-200 bg-stone-50">
                    <div className="relative max-w-md">
                        <Search size={16} className="absolute left-3 top-3 text-slate-400"/>
                        <input className="input-std pl-10" placeholder="Rechercher une clé..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-0">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold uppercase text-slate-500 sticky top-0">
                            <tr><th className="p-4 w-1/3">Clé (Reference EN)</th><th className="p-4">Traduction ({activeLang})</th></tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredKeys.map(key => (
                                <tr key={key} className="hover:bg-stone-50">
                                    <td className="p-4 align-top">
                                        <span className="font-mono text-xs text-slate-500 block mb-1">{key}</span>
                                        <span className="text-xs text-slate-400 italic">{(translations['EN'] as any)[key]}</span>
                                    </td>
                                    <td className="p-4">
                                        <textarea 
                                            className="w-full border border-stone-200 rounded p-2 text-sm focus:border-amber-600 outline-none min-h-[60px]"
                                            value={(translations[activeLang] as any)[key] || ''}
                                            onChange={(e) => updateTranslation(activeLang, key as string, e.target.value)}
                                            dir={activeLang === 'AR' ? 'rtl' : 'ltr'}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
