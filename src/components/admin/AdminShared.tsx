
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bold, Italic, List, Heading, Link as LinkIcon, Save, ArrowLeft, Settings, X, Plus, Image as ImageIcon, Search, LayoutGrid, List as ListIcon, MoreHorizontal, Filter, Upload, Loader, Folder } from 'lucide-react';
import { useData } from '../../DataContext';
import { LocalizedString } from '../../../types';

// --- PORTAL HELPER (FIX Z-INDEX ISSUES) ---
export const Portal = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return createPortal(children, document.body);
};

// --- GENERIC MODAL (FOR SMALLER POPUPS) ---
export const Modal = ({ title, onClose, children, footer }: any) => {
    return (
        <Portal>
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-scale-up border border-stone-200">
                    <div className="bg-white border-b border-stone-100 p-4 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition"><X size={20}/></button>
                    </div>
                    <div className="p-6 overflow-y-auto max-h-[70vh]">
                        {children}
                    </div>
                    {footer && (
                        <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end gap-2">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </Portal>
    );
};

// --- SHARED UI: STANDARD TOOLBAR ---
interface StandardToolbarProps {
    title?: string;
    search: string;
    onSearch: (val: string) => void;
    viewMode?: 'LIST' | 'GRID';
    onViewChange?: (mode: 'LIST' | 'GRID') => void;
    onAdd?: () => void;
    addLabel?: string;
}

export const StandardToolbar: React.FC<StandardToolbarProps> = ({ search, onSearch, viewMode, onViewChange, onAdd, addLabel, title }) => {
    return (
        <div className="bg-white border-b border-stone-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 shrink-0 shadow-sm z-10 sticky top-0">
            {title && <h3 className="text-lg font-bold text-slate-800 md:hidden w-full">{title}</h3>}
            <div className="flex items-center space-x-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search size={16} className="absolute left-3 top-3 text-slate-400"/>
                    <input 
                        value={search} 
                        onChange={(e) => onSearch(e.target.value)} 
                        placeholder="Rechercher..." 
                        className="input-std pl-10"
                    />
                </div>
            </div>
            
            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                {viewMode && onViewChange && (
                    <div className="flex bg-stone-100 p-1 rounded-md">
                        <button 
                            onClick={() => onViewChange('LIST')} 
                            className={`p-2 rounded-sm transition ${viewMode === 'LIST' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Vue Liste"
                        >
                            <ListIcon size={16}/>
                        </button>
                        <button 
                            onClick={() => onViewChange('GRID')} 
                            className={`p-2 rounded-sm transition ${viewMode === 'GRID' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Vue Grille"
                        >
                            <LayoutGrid size={16}/>
                        </button>
                    </div>
                )}
                {onAdd && (
                    <button onClick={onAdd} className="btn-primary whitespace-nowrap shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition">
                        <Plus size={16} className="mr-2"/> {addLabel || 'Ajouter'}
                    </button>
                )}
            </div>
        </div>
    );
};

// --- SEO PREVIEW COMPONENT ---
export const SEOPreview = ({ title, desc, slug }: { title: string, desc: string, slug: string }) => {
    return (
        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm max-w-2xl w-full">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Aperçu Google (SERP)</h4>
            <div className="font-sans">
                <div className="flex items-center text-sm text-[#202124] mb-1">
                    <span className="bg-slate-100 rounded-full w-4 h-4 mr-2"></span>
                    <span className="truncate text-slate-700">tetouanvillas.ma › {slug}</span>
                    <MoreHorizontal size={12} className="ml-1 text-slate-500"/>
                </div>
                <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate font-normal mb-1 font-sans">
                    {title || "Titre de la page manquant"}
                </h3>
                <p className="text-sm text-[#4d5156] line-clamp-2">
                    {desc || "Veuillez saisir une méta description pour voir l'aperçu."}
                </p>
            </div>
        </div>
    );
};

// --- RICH TEXT EDITOR ---
export const RichTextEditor = ({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder?: string }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertTag = (tag: string, endTag?: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selection = text.substring(start, end);
        const closeTag = endTag || `</${tag.replace('<', '').replace('>', '')}>`;
        const replacement = `${tag}${selection}${closeTag}`;
        const newText = text.substring(0, start) + replacement + text.substring(end);
        onChange(newText);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + tag.length, end + tag.length);
        }, 0);
    };

    return (
        <div className="border border-stone-200 rounded-md overflow-hidden bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 flex flex-col h-full min-h-[300px]">
            <div className="flex items-center space-x-1 p-2 bg-stone-50 border-b border-stone-200 sticky top-0 z-10 shrink-0">
                <button type="button" onClick={() => insertTag('<strong>', '</strong>')} className="p-1.5 rounded hover:bg-white hover:shadow-sm text-slate-600 transition" title="Gras"><Bold size={14}/></button>
                <button type="button" onClick={() => insertTag('<em>', '</em>')} className="p-1.5 rounded hover:bg-white hover:shadow-sm text-slate-600 transition" title="Italique"><Italic size={14}/></button>
                <div className="w-px h-4 bg-stone-300 mx-1"></div>
                <button type="button" onClick={() => insertTag('<h3>', '</h3>')} className="p-1.5 rounded hover:bg-white hover:shadow-sm text-slate-600 transition" title="Titre 3"><Heading size={14}/></button>
                <button type="button" onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')} className="p-1.5 rounded hover:bg-white hover:shadow-sm text-slate-600 transition" title="Liste"><List size={14}/></button>
                <div className="w-px h-4 bg-stone-300 mx-1"></div>
                <button type="button" onClick={() => insertTag('<a href="#">', '</a>')} className="p-1.5 rounded hover:bg-white hover:shadow-sm text-slate-600 transition" title="Lien"><LinkIcon size={14}/></button>
            </div>
            <textarea 
                ref={textareaRef}
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-6 flex-1 outline-none text-base font-serif text-slate-700 leading-relaxed resize-none bg-white"
                placeholder={placeholder || "Rédigez votre contenu ici..."}
            ></textarea>
        </div>
    );
};

// --- TRANSLATABLE INPUT ---
interface TranslatableInputProps {
    label: string;
    value: LocalizedString;
    onChange: (val: LocalizedString) => void;
    type?: 'input' | 'textarea' | 'richtext';
    placeholder?: string;
    className?: string;
}

export const TranslatableInput: React.FC<TranslatableInputProps> = ({ label, value, onChange, type = 'input', placeholder, className }) => {
    const [tab, setTab] = useState<'EN'|'FR'|'ES'|'AR'>('FR');
    const safeValue = value || { EN: '', FR: '', ES: '', AR: '' };

    const handleChange = (newText: string) => {
        onChange({ ...safeValue, [tab]: newText });
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="flex justify-between items-end">
                <label className="label-xs flex items-center">
                    {label}
                    {safeValue.FR && !safeValue[tab] && <span className="ml-2 text-[10px] text-amber-600 font-normal animate-pulse">● Traduction manquante</span>}
                </label>
                <div className="flex space-x-1 bg-stone-100 p-1 rounded-md">
                    {['FR', 'EN', 'ES', 'AR'].map((lang) => (
                        <button 
                            key={lang} 
                            onClick={() => setTab(lang as any)} 
                            className={`text-[10px] font-bold px-3 py-1 rounded-sm transition ${tab === lang ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>
            {type === 'textarea' ? (
                <textarea 
                    className="input-std h-24" 
                    value={safeValue[tab] || ''} 
                    onChange={e => handleChange(e.target.value)} 
                    placeholder={`${placeholder || ''} (${tab})`}
                    dir={tab === 'AR' ? 'rtl' : 'ltr'}
                />
            ) : type === 'richtext' ? (
                <RichTextEditor 
                    value={safeValue[tab] || ''} 
                    onChange={handleChange} 
                    placeholder={`${placeholder || ''} (${tab})`}
                />
            ) : (
                <input 
                    className="input-std" 
                    value={safeValue[tab] || ''} 
                    onChange={e => handleChange(e.target.value)} 
                    placeholder={`${placeholder || ''} (${tab})`}
                    dir={tab === 'AR' ? 'rtl' : 'ltr'}
                />
            )}
        </div>
    );
};

// --- MEDIA PICKER (REALISTIC BASE64) ---
export const MediaPicker = ({ onSelect, onClose }: { onSelect: (url: string) => void, onClose: () => void }) => {
    const { mediaLibrary, addMedia } = useData();
    const [activeFolder, setActiveFolder] = useState('All');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploading(true);
            const file = e.target.files[0];
            
            // Limit file size to 2MB for localStorage health
            if (file.size > 2 * 1024 * 1024) {
                alert("Image trop lourde (> 2MB). Veuillez compresser.");
                setUploading(false);
                return;
            }

            const reader = new FileReader();
            reader.onload = (ev) => {
                const result = ev.target?.result as string;
                addMedia(result); // Instant add
                setUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Portal>
            <div className="fixed inset-0 bg-slate-900/80 z-[9999] flex items-center justify-center p-6 backdrop-blur-md animate-fade-in">
                <div className="bg-white w-full max-w-6xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
                    <div className="flex h-full">
                        {/* Sidebar Folder Structure */}
                        <div className="w-64 bg-stone-50 border-r border-stone-200 p-4 flex flex-col shrink-0">
                            <h3 className="font-bold text-slate-800 mb-6 px-2 flex items-center text-sm uppercase tracking-wide">
                                <ImageIcon size={16} className="mr-2 text-amber-600"/> Médiathèque
                            </h3>
                            <div className="space-y-1 flex-1">
                                {['All', 'Villas', 'Events', 'Food', 'Documents', 'Staff'].map(folder => (
                                    <button 
                                        key={folder}
                                        onClick={() => setActiveFolder(folder)}
                                        className={`w-full text-left px-4 py-2.5 rounded-md text-xs font-bold transition flex items-center ${activeFolder === folder ? 'bg-white shadow-sm text-amber-600 ring-1 ring-stone-200' : 'text-slate-500 hover:bg-stone-100 hover:text-slate-700'}`}
                                    >
                                        <Folder size={14} className={`mr-2 ${activeFolder === folder ? 'fill-amber-600 text-amber-600' : 'text-slate-400'}`} />
                                        {folder}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 flex flex-col bg-white">
                            {/* Toolbar */}
                            <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-white">
                                <div className="flex space-x-4 items-center w-full">
                                    <div className="relative flex-1 max-w-md">
                                        <Search size={16} className="absolute left-3 top-3 text-slate-400"/>
                                        <input className="input-std pl-10 py-2.5" placeholder="Rechercher un fichier..." />
                                    </div>
                                    <button 
                                        onClick={() => fileInputRef.current?.click()} 
                                        className="btn-primary whitespace-nowrap bg-amber-600 hover:bg-amber-700 shadow-md"
                                        disabled={uploading}
                                    >
                                        {uploading ? <Loader size={16} className="animate-spin mr-2"/> : <Upload size={16} className="mr-2"/>}
                                        {uploading ? 'Traitement...' : 'Uploader'}
                                    </button>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect}/>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition ml-4"><X size={20} className="text-slate-400 hover:text-slate-800"/></button>
                            </div>
                            
                            {/* Grid */}
                            <div className="flex-1 overflow-y-auto p-6 bg-stone-50/30">
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {mediaLibrary.map((url, idx) => (
                                        <div key={idx} onClick={() => { onSelect(url); onClose(); }} className="aspect-square rounded-lg border border-stone-200 overflow-hidden cursor-pointer hover:border-amber-500 hover:ring-4 hover:ring-amber-500/20 transition relative group bg-white shadow-sm hover:shadow-md">
                                            <img src={url} className="w-full h-full object-cover" />
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition flex items-center justify-center">
                                                <div className="bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition shadow-lg">
                                                    <Plus className="text-slate-900" size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

// --- FULL SCREEN EDITOR (NOW WITH PORTAL) ---
export const FullScreenEditor = ({ title, onClose, onSave, status, tabs, activeTab, onTabChange, children, sidebarContent }: any) => {
    return (
        <Portal>
            <div className="fixed inset-0 bg-stone-50 z-[9990] flex flex-col animate-fade-in font-sans">
                <div className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 shadow-sm shrink-0">
                    <div className="flex items-center w-1/2">
                        <button onClick={onClose} className="mr-4 p-2 hover:bg-stone-100 rounded-full transition text-slate-500">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Éditeur CMS</span>
                            <h2 className="font-bold text-slate-900 text-lg truncate pr-4">{title || 'Sans titre'}</h2>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-xs text-slate-400 font-mono hidden md:block uppercase bg-stone-100 px-2 py-1 rounded">
                            {status || 'DRAFT'}
                        </span>
                        <button onClick={onSave} className="btn-primary px-6 flex items-center">
                            <Save size={16} className="mr-2"/> Enregistrer
                        </button>
                    </div>
                </div>
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative bg-stone-50">
                        <div className="max-w-5xl mx-auto pb-20">
                            {tabs && (
                                <div className="flex space-x-6 border-b border-stone-200 mb-8 sticky top-0 bg-stone-50 z-10 pt-2">
                                    {tabs.map((tab: any) => (
                                        <button 
                                            key={tab.id}
                                            onClick={() => onTabChange(tab.id)} 
                                            className={`pb-4 text-sm font-bold uppercase tracking-wide transition ${activeTab === tab.id ? 'border-b-2 border-amber-600 text-amber-600' : 'text-slate-400 hover:text-slate-700'}`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {children}
                        </div>
                    </div>
                    {sidebarContent && (
                        <div className="w-80 bg-white border-l border-stone-200 p-6 flex flex-col overflow-y-auto shrink-0 shadow-xl z-20 hidden lg:flex">
                            <h4 className="font-bold text-slate-900 mb-6 flex items-center uppercase text-xs tracking-wider"><Settings size={14} className="mr-2"/> Configuration</h4>
                            <div className="space-y-6">
                                {sidebarContent}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Portal>
    );
};
