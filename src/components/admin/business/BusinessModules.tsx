
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { 
    Search, Plus, Download, MoreHorizontal, Calendar, List, X, Edit, Trash2, 
    Megaphone, DollarSign, FileText, Settings, Save, ArrowLeft, ChevronRight,
    Users, AlertCircle, TrendingUp, TrendingDown, Star, ChevronLeft, Columns, ArrowRight,
    CheckCircle, Filter, Mail, Phone, Send, Eye, Wallet, Image as ImageIcon, ToggleLeft, ToggleRight,
    PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, Printer, Share2, Clock, Lock
} from 'lucide-react';
import { BookingStatus, Villa, Booking, PipelineStage, Client, Expense, Invoice, MarketingCampaign, UserRole } from '../../../../types';
import { TranslatableInput, MediaPicker, FullScreenEditor, StandardToolbar, SEOPreview, Modal } from '../AdminShared';

// --- HELPER: CURRENCY FORMATTER ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
};

// --- MODULE: PROPERTIES MANAGER ---
export const PropertiesManager = ({ villas, updateVilla, addVilla, deleteVilla, showToast }: {
    villas: Villa[];
    updateVilla: (villa: Villa) => void;
    addVilla: (villa: Villa) => void;
    deleteVilla: (id: string) => void;
    showToast: (msg: string, type?: string) => void;
}) => {
    const [editingVilla, setEditingVilla] = useState<Villa | null>(null);
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'LIST' | 'GRID'>('GRID');
    const [editorTab, setEditorTab] = useState('DETAILS');

    const filteredVillas = villas.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));

    const emptyVilla: Villa = {
        id: '', name: '', description: { EN: '', FR: '', ES: '', AR: '' }, shortDescription: { EN: '', FR: '', ES: '', AR: '' },
        pricePerNight: 0, bedrooms: 3, bathrooms: 2, pool: true, images: [], features: [], isAvailable: true, maintenanceMode: false,
        seo: { title: {EN:'',FR:'',ES:'',AR:''}, description: {EN:'',FR:'',ES:'',AR:''}, keywords: [] }
    };

    const handleOpenEdit = (villa?: Villa) => { 
        setEditingVilla(villa ? { ...villa } : { ...emptyVilla, id: `villa-${Date.now()}` }); 
        setEditorTab('DETAILS');
    };

    const handleSave = () => {
        if (editingVilla && editingVilla.name) {
            editingVilla.id.startsWith('villa-') ? addVilla(editingVilla) : updateVilla(editingVilla);
            showToast('Propriété enregistrée', 'SUCCESS');
            setEditingVilla(null);
        }
    };

    return (
        <div className="h-full flex flex-col animate-fade-in relative bg-stone-50/50">
            <StandardToolbar 
                title="Gestion des Villas"
                search={search} onSearch={setSearch} 
                viewMode={viewMode} onViewChange={setViewMode} 
                onAdd={() => handleOpenEdit()} addLabel="Ajouter Villa" 
            />

            <div className="flex-1 overflow-y-auto p-8">
                {viewMode === 'GRID' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVillas.map(villa => (
                            <div key={villa.id} className="bg-white rounded-lg border border-stone-200 overflow-hidden group hover:shadow-lg transition flex flex-col">
                                <div className="h-48 relative overflow-hidden bg-stone-100">
                                    {villa.images.length > 0 ? <img src={villa.images[0]} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={48}/></div>}
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">{villa.pricePerNight}€ / nuit</div>
                                    {!villa.isAvailable && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white font-bold uppercase tracking-widest border border-white px-4 py-2">Indisponible</span></div>}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-lg text-slate-900 mb-2">{villa.name}</h3>
                                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">{villa.shortDescription.FR}</p>
                                    <div className="mt-auto pt-4 border-t border-stone-100 flex justify-between items-center">
                                        <span className="text-[10px] text-slate-400 font-mono bg-stone-100 px-2 py-1 rounded">{villa.bedrooms} ch. &bull; {villa.bathrooms} sdb</span>
                                        <div className="flex space-x-2">
                                            <button onClick={() => {if(confirm('Supprimer ?')) deleteVilla(villa.id)}} className="p-2 text-slate-400 hover:text-red-600 hover:bg-stone-50 rounded transition"><Trash2 size={16}/></button>
                                            <button onClick={() => handleOpenEdit(villa)} className="text-amber-600 hover:text-amber-800 font-bold text-xs uppercase flex items-center px-3 py-2 bg-amber-50 hover:bg-amber-100 rounded transition">Gérer</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold uppercase text-slate-500 sticky top-0"><tr><th className="p-4">Nom</th><th className="p-4">Prix</th><th className="p-4">Statut</th><th className="p-4 text-right">Actions</th></tr></thead>
                            <tbody className="divide-y divide-stone-100">
                                {filteredVillas.map(villa => (
                                    <tr key={villa.id} className="hover:bg-stone-50 cursor-pointer" onClick={() => handleOpenEdit(villa)}>
                                        <td className="p-4 font-bold text-slate-800">{villa.name}</td>
                                        <td className="p-4 font-mono text-amber-600 font-bold">{villa.pricePerNight}€</td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${villa.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{villa.isAvailable ? 'Dispo' : 'Occupé'}</span></td>
                                        <td className="p-4 text-right"><button onClick={(e) => { e.stopPropagation(); if(confirm('Supprimer ?')) deleteVilla(villa.id); }} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {editingVilla && (
                <>
                <FullScreenEditor
                    title={editingVilla.name || 'Nouvelle Villa'}
                    status={editingVilla.isAvailable ? 'AVAILABLE' : 'BOOKED'}
                    onClose={() => setEditingVilla(null)}
                    onSave={handleSave}
                    activeTab={editorTab}
                    onTabChange={setEditorTab}
                    tabs={[
                        {id: 'DETAILS', label: 'Info & Prix'}, 
                        {id: 'CONTENT', label: 'Descriptions'}, 
                        {id: 'MEDIA', label: 'Photos'},
                        {id: 'SEO', label: 'SEO'}
                    ]}
                    sidebarContent={
                        <>
                            <div className="bg-stone-50 p-4 rounded border border-stone-200">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 text-amber-600 rounded" checked={editingVilla.isAvailable} onChange={e => setEditingVilla({...editingVilla, isAvailable: e.target.checked})} />
                                    <span className="text-sm font-bold text-slate-700">Disponible à la location</span>
                                </label>
                            </div>
                            <div className="bg-stone-50 p-4 rounded border border-stone-200">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 text-amber-600 rounded" checked={editingVilla.pool} onChange={e => setEditingVilla({...editingVilla, pool: e.target.checked})} />
                                    <span className="text-sm font-bold text-slate-700">Piscine Privée</span>
                                </label>
                            </div>
                            <div>
                                <label className="label-xs">Chambres</label>
                                <input type="number" className="input-std" value={editingVilla.bedrooms} onChange={e => setEditingVilla({...editingVilla, bedrooms: Number(e.target.value)})} />
                            </div>
                            <div>
                                <label className="label-xs">Salles de bain</label>
                                <input type="number" className="input-std" value={editingVilla.bathrooms} onChange={e => setEditingVilla({...editingVilla, bathrooms: Number(e.target.value)})} />
                            </div>
                        </>
                    }
                >
                    {editorTab === 'DETAILS' && (
                        <div className="space-y-6 max-w-2xl">
                            <div><label className="label-xs">Nom de la Villa</label><input className="input-std text-lg font-bold" value={editingVilla.name} onChange={e => setEditingVilla({...editingVilla, name: e.target.value})} /></div>
                            <div><label className="label-xs">Prix par Nuit (€)</label><input type="number" className="input-std font-mono text-lg text-amber-600 font-bold" value={editingVilla.pricePerNight} onChange={e => setEditingVilla({...editingVilla, pricePerNight: Number(e.target.value)})} /></div>
                        </div>
                    )}
                    {editorTab === 'CONTENT' && (
                        <div className="space-y-8">
                            <TranslatableInput label="Description Courte (Liste)" value={editingVilla.shortDescription} onChange={v => setEditingVilla({...editingVilla, shortDescription: v})} type="textarea" />
                            <TranslatableInput label="Description Complète" value={editingVilla.description} onChange={v => setEditingVilla({...editingVilla, description: v})} type="richtext" />
                        </div>
                    )}
                    {editorTab === 'MEDIA' && (
                        <div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {editingVilla.images.map((img, i) => (
                                    <div key={i} className="relative group h-40 rounded-lg overflow-hidden border border-stone-200">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button 
                                            onClick={() => setEditingVilla({...editingVilla, images: editingVilla.images.filter((_, idx) => idx !== i)})}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <Trash2 size={14}/>
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => setShowMediaPicker(true)} className="h-40 border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-50 transition">
                                    <Plus size={32} className="mb-2"/>
                                    <span className="text-xs font-bold uppercase">Ajouter Photo</span>
                                </button>
                            </div>
                        </div>
                    )}
                    {editorTab === 'SEO' && (
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <TranslatableInput label="Titre SEO" value={editingVilla.seo?.title || {EN:'',FR:'',ES:'',AR:''}} onChange={v => setEditingVilla({...editingVilla, seo: {...editingVilla.seo!, title: v}})} />
                                <TranslatableInput label="Description SEO" value={editingVilla.seo?.description || {EN:'',FR:'',ES:'',AR:''}} onChange={v => setEditingVilla({...editingVilla, seo: {...editingVilla.seo!, description: v}})} type="textarea" />
                            </div>
                            <div>
                                <label className="label-xs mb-4 block">Aperçu</label>
                                <SEOPreview title={editingVilla.seo?.title?.FR || editingVilla.name} desc={editingVilla.seo?.description?.FR || editingVilla.shortDescription.FR} slug={`villas/${editingVilla.id}`} />
                            </div>
                        </div>
                    )}
                </FullScreenEditor>
                {showMediaPicker && <MediaPicker onSelect={(url) => { setEditingVilla({...editingVilla, images: [...editingVilla.images, url]}); setShowMediaPicker(false); }} onClose={() => setShowMediaPicker(false)} />}
                </>
            )}
        </div>
    );
};

// --- MODULE: CRM MANAGER ---
export const CRMManager = ({ clients, updateClient, showToast }: {
    clients: Client[];
    updateClient: (client: Client) => void;
    showToast: (msg: string, type?: string) => void;
}) => {
    const [view, setView] = useState<'LIST' | 'PIPELINE'>('PIPELINE');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = clients.filter(c => c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const stages = [
        { id: PipelineStage.NEW_LEAD, label: 'Nouveaux Leads', color: 'bg-blue-500' },
        { id: PipelineStage.DISCUSSION, label: 'En Discussion', color: 'bg-amber-500' },
        { id: PipelineStage.PROPOSAL, label: 'Proposition', color: 'bg-purple-500' },
        { id: PipelineStage.CONFIRMED, label: 'Confirmé', color: 'bg-green-500' },
        { id: PipelineStage.POST_STAY, label: 'Fidélisation', color: 'bg-slate-500' },
    ];

    const moveClient = (client: Client, stage: PipelineStage) => {
        updateClient({ ...client, pipelineStage: stage });
        showToast('Statut client mis à jour', 'SUCCESS');
    };

    return (
        <div className="p-8 animate-fade-in relative h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-slate-900">CRM</h2>
                <div className="flex space-x-2">
                    <div className="relative w-64">
                        <Search size={16} className="absolute left-3 top-3 text-slate-400"/>
                        <input className="input-std pl-10" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex bg-stone-100 p-1 rounded-md">
                        <button onClick={() => setView('LIST')} className={`p-2 rounded-sm ${view === 'LIST' ? 'bg-white shadow' : ''}`}><List size={16}/></button>
                        <button onClick={() => setView('PIPELINE')} className={`p-2 rounded-sm ${view === 'PIPELINE' ? 'bg-white shadow' : ''}`}><Columns size={16}/></button>
                    </div>
                </div>
            </div>
            
            {view === 'LIST' ? (
                <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold uppercase text-slate-500">
                            <tr><th className="p-4">Client</th><th className="p-4">Statut</th><th className="p-4">Total</th><th className="p-4">Pipeline</th></tr>
                        </thead>
                        <tbody>
                            {filteredClients.map(c => (
                                <tr key={c.id} className="border-b border-stone-100 hover:bg-stone-50">
                                    <td className="p-4">
                                        <p className="font-bold text-slate-800">{c.fullName}</p>
                                        <p className="text-xs text-slate-500">{c.email}</p>
                                    </td>
                                    <td className="p-4"><span className="bg-stone-100 px-2 py-1 rounded text-xs uppercase font-bold">{c.status}</span></td>
                                    <td className="p-4 font-mono">{c.totalSpends}€</td>
                                    <td className="p-4 text-xs font-bold text-slate-500">{c.pipelineStage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex-1 overflow-x-auto pb-4">
                    <div className="flex space-x-4 min-w-[1200px] h-full">
                        {stages.map(stage => (
                            <div key={stage.id} className="flex-1 bg-stone-50 rounded-lg border border-stone-200 flex flex-col h-full max-h-[calc(100vh-200px)]">
                                <div className={`p-3 border-b border-stone-200 flex justify-between items-center rounded-t-lg bg-white`}>
                                    <span className="font-bold text-xs uppercase text-slate-700">{stage.label}</span>
                                    <span className="bg-stone-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold">{filteredClients.filter(c => c.pipelineStage === stage.id).length}</span>
                                </div>
                                <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                                    {filteredClients.filter(c => c.pipelineStage === stage.id).map(client => (
                                        <div key={client.id} className="bg-white p-4 rounded shadow-sm border border-stone-100 cursor-move hover:shadow-md transition group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-800 text-sm">{client.fullName}</h4>
                                                {client.status === 'VIP' && <Star size={12} className="text-amber-500 fill-current"/>}
                                            </div>
                                            <p className="text-xs text-slate-500 truncate">{client.email}</p>
                                            <div className="mt-3 flex justify-between items-center">
                                                <span className="text-[10px] bg-stone-50 text-slate-500 px-2 py-1 rounded font-mono">{client.totalSpends}€</span>
                                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                                                    <button onClick={() => moveClient(client, stages[Math.min(stages.length-1, stages.findIndex(s => s.id === stage.id) + 1)].id as any)} className="p-1 hover:bg-stone-100 rounded text-slate-400 hover:text-green-600"><ArrowRight size={14}/></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MODULE: FINANCE MANAGER 2.0 (REMASTERED) ---
export const FinanceManager = ({ expenses, invoices, bookings, addExpense, deleteExpense, deleteInvoice, addInvoice, showToast }: {
    expenses: Expense[];
    invoices: Invoice[];
    bookings: Booking[];
    addExpense: (expense: Expense) => void;
    deleteExpense: (id: string) => void;
    deleteInvoice: (id: string) => void;
    addInvoice: (invoice: Invoice) => void;
    showToast: (msg: string, type?: string) => void;
}) => {
    const [view, setView] = useState<'DASHBOARD' | 'TRANSACTIONS' | 'INVOICES'>('DASHBOARD');
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [newExpense, setNewExpense] = useState<Partial<Expense>>({ category: 'UTILITIES', date: new Date().toISOString().split('T')[0] });
    const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

    // --- KPIs Calculations ---
    const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((acc, i) => acc + Number(i.amount), 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
    const netProfit = totalRevenue - totalExpenses;
    const pendingRevenue = invoices.filter(i => i.status !== 'PAID').reduce((acc, i) => acc + Number(i.amount), 0);

    // --- Chart Data Preparation ---
    const monthlyData = useMemo(() => {
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(); d.setMonth(d.getMonth() - (5 - i)); return d;
        });
        return last6Months.map(date => {
            const monthKey = date.toLocaleString('default', { month: 'short' });
            const monthIdx = date.getMonth();
            const year = date.getFullYear();
            const rev = invoices.filter(i => {
                const d = new Date(i.date); return d.getMonth() === monthIdx && d.getFullYear() === year && i.status === 'PAID';
            }).reduce((acc, i) => acc + Number(i.amount), 0);
            const exp = expenses.filter(e => {
                const d = new Date(e.date); return d.getMonth() === monthIdx && d.getFullYear() === year;
            }).reduce((acc, e) => acc + Number(e.amount), 0);
            return { name: monthKey, rev, exp, profit: rev - exp };
        });
    }, [invoices, expenses]);

    const expenseCategoryData = useMemo(() => {
        const cats: any = {};
        expenses.forEach(e => { cats[e.category] = (cats[e.category] || 0) + Number(e.amount); });
        return Object.keys(cats).map(k => ({ name: k, value: cats[k] }));
    }, [expenses]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newExpense.description || !newExpense.amount) return;
        addExpense({ 
            id: `EXP-${Date.now()}`, 
            category: newExpense.category as any, 
            description: newExpense.description, 
            amount: Number(newExpense.amount), 
            date: newExpense.date || new Date().toISOString().split('T')[0], 
            status: 'PAID' 
        });
        setShowExpenseModal(false);
        setNewExpense({ category: 'UTILITIES', date: new Date().toISOString().split('T')[0] });
        showToast('Dépense enregistrée', 'SUCCESS');
    };

    const InvoicePreview = ({ invoice, onClose }: { invoice: Invoice, onClose: () => void }) => (
        <Modal title={`Facture #${invoice.id}`} onClose={onClose}>
            <div className="bg-white p-8 border border-stone-200 shadow-sm text-sm" id="invoice-print">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-serif font-bold text-xl rounded mb-2">T</div>
                        <h3 className="font-bold text-slate-900">Tétouan Luxury Villas</h3>
                        <p className="text-slate-500">Route de Sebta, Cabo Negro</p>
                        <p className="text-slate-500">93000 Tétouan, Maroc</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-widest mb-1">Facture</h2>
                        <p className="text-slate-500 font-mono">#{invoice.id}</p>
                        <p className="text-slate-500 mt-1">Date: {invoice.date}</p>
                        <div className={`mt-2 inline-block px-3 py-1 rounded text-xs font-bold uppercase ${invoice.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{invoice.status}</div>
                    </div>
                </div>
                <div className="border-t border-b border-stone-200 py-6 mb-6">
                    <p className="text-xs font-bold uppercase text-slate-400 mb-2">Facturé à :</p>
                    <h4 className="font-bold text-lg text-slate-900">{invoice.clientName}</h4>
                    <p className="text-slate-500">Client ID: {invoice.bookingId}</p>
                </div>
                <table className="w-full text-left mb-8">
                    <thead>
                        <tr className="border-b border-stone-200"><th className="pb-2 font-bold text-slate-600">Description</th><th className="pb-2 text-right font-bold text-slate-600">Montant</th></tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-stone-100">
                            <td className="py-4">Séjour Villa (Réservation {invoice.bookingId})</td>
                            <td className="py-4 text-right font-mono">{formatCurrency(invoice.amount)}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="flex justify-end">
                    <div className="w-1/2">
                        <div className="flex justify-between py-2 border-b border-stone-200">
                            <span className="font-bold text-slate-600">Total</span>
                            <span className="font-bold text-xl text-slate-900">{formatCurrency(invoice.amount)}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-12 text-center text-xs text-slate-400">
                    Merci de votre confiance. Pour toute question : finance@tetouanvillas.ma
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
                <button className="btn-secondary" onClick={() => window.print()}><Printer size={16} className="mr-2"/> Imprimer</button>
                <button className="btn-primary" onClick={() => showToast('Facture envoyée par email', 'SUCCESS')}><Share2 size={16} className="mr-2"/> Envoyer</button>
            </div>
        </Modal>
    );

    return (
        <div className="p-8 animate-fade-in h-full flex flex-col relative bg-stone-50/50">
            <div className="flex justify-between items-center mb-8 shrink-0">
                <h2 className="font-serif text-2xl text-slate-900">Finance & Comptabilité</h2>
                <div className="flex space-x-2 bg-white p-1 rounded border border-stone-200 shadow-sm">
                    <button onClick={() => setView('DASHBOARD')} className={`px-4 py-2 text-xs font-bold rounded transition ${view === 'DASHBOARD' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-stone-50'}`}>Tableau de Bord</button>
                    <button onClick={() => setView('INVOICES')} className={`px-4 py-2 text-xs font-bold rounded transition ${view === 'INVOICES' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-stone-50'}`}>Factures</button>
                    <button onClick={() => setView('TRANSACTIONS')} className={`px-4 py-2 text-xs font-bold rounded transition ${view === 'TRANSACTIONS' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-stone-50'}`}>Grand Livre</button>
                </div>
                <button className="btn-primary" onClick={() => setShowExpenseModal(true)}><Plus size={16} className="mr-2"/> Saisir Dépense</button>
            </div>

            {view === 'DASHBOARD' && (
                <div className="space-y-8 overflow-y-auto pb-12">
                    {/* KPI CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold uppercase text-slate-400">Revenu Total</span><div className="p-1 bg-green-100 rounded text-green-600"><TrendingUp size={16}/></div></div>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold uppercase text-slate-400">Dépenses</span><div className="p-1 bg-red-100 rounded text-red-600"><TrendingDown size={16}/></div></div>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalExpenses)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold uppercase text-slate-400">Marge Nette</span><div className="p-1 bg-blue-100 rounded text-blue-600"><Wallet size={16}/></div></div>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(netProfit)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold uppercase text-slate-400">À Encaisser</span><div className="p-1 bg-amber-100 rounded text-amber-600"><Clock size={16}/></div></div>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(pendingRevenue)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* CASH FLOW CHART */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-stone-200">
                            <h3 className="font-bold text-slate-800 mb-6">Flux de Trésorerie (6 mois)</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} tick={{fontSize: 12}} />
                                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                        <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
                                        <Bar name="Recettes" dataKey="rev" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={20} />
                                        <Bar name="Dépenses" dataKey="exp" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* EXPENSE BREAKDOWN */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
                            <h3 className="font-bold text-slate-800 mb-6">Répartition Dépenses</h3>
                            <div className="h-72 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={expenseCategoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {expenseCategoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '11px', right: 0}} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <span className="block text-xs text-slate-400 uppercase font-bold">Total</span>
                                        <span className="block text-lg font-bold text-slate-800">{formatCurrency(totalExpenses)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* INVOICES TABLE VIEW */}
            {view === 'INVOICES' && (
                <div className="bg-white rounded-lg shadow-sm border border-stone-200 flex-1 flex flex-col overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold uppercase text-slate-500 sticky top-0"><tr><th className="p-4">N° Facture</th><th className="p-4">Client</th><th className="p-4">Date</th><th className="p-4">Montant</th><th className="p-4">Statut</th><th className="p-4 text-right">Actions</th></tr></thead>
                        <tbody className="divide-y divide-stone-100 overflow-y-auto">
                            {invoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-stone-50 group">
                                    <td className="p-4 font-mono text-xs text-slate-600">{inv.id}</td>
                                    <td className="p-4 font-bold text-slate-800">{inv.clientName}</td>
                                    <td className="p-4 text-sm text-slate-600">{inv.date}</td>
                                    <td className="p-4 font-mono font-bold text-slate-800">{formatCurrency(inv.amount)}</td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${inv.status === 'PAID' ? 'bg-green-100 text-green-700' : inv.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{inv.status}</span></td>
                                    <td className="p-4 text-right flex justify-end space-x-2">
                                        <button onClick={() => setViewInvoice(inv)} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-stone-100 rounded transition" title="Voir"><Eye size={16}/></button>
                                        <button onClick={() => { if(confirm('Supprimer facture ?')) deleteInvoice(inv.id)}} className="p-2 text-slate-400 hover:text-red-600 hover:bg-stone-100 rounded transition"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* TRANSACTIONS (LEDGER) VIEW */}
            {view === 'TRANSACTIONS' && (
                <div className="bg-white rounded-lg shadow-sm border border-stone-200 flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold uppercase text-slate-500 sticky top-0"><tr><th className="p-4">Date</th><th className="p-4">Description</th><th className="p-4">Catégorie</th><th className="p-4">Type</th><th className="p-4 text-right">Montant</th></tr></thead>
                            <tbody className="divide-y divide-stone-100">
                                {[...invoices.map(i => ({...i, type: 'INCOME', desc: `Facture ${i.clientName}`})), ...expenses.map(e => ({...e, type: 'EXPENSE', desc: e.description}))]
                                    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                    .map((tx: any, idx) => (
                                    <tr key={idx} className="hover:bg-stone-50">
                                        <td className="p-4 text-xs font-mono text-slate-500">{tx.date}</td>
                                        <td className="p-4 font-bold text-sm text-slate-800">{tx.desc}</td>
                                        <td className="p-4 text-xs uppercase text-slate-500 tracking-wide">{tx.category || 'Ventes'}</td>
                                        <td className="p-4"><span className={`text-[10px] font-bold px-2 py-1 rounded flex w-fit items-center ${tx.type === 'INCOME' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>{tx.type === 'INCOME' ? <ArrowDownRight size={12} className="mr-1"/> : <ArrowUpRight size={12} className="mr-1"/>} {tx.type}</span></td>
                                        <td className={`p-4 text-right font-mono font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>{tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODALS */}
            {viewInvoice && <InvoicePreview invoice={viewInvoice} onClose={() => setViewInvoice(null)} />}
            
            {showExpenseModal && (
                <Modal title="Nouvelle Dépense" onClose={() => setShowExpenseModal(false)}>
                    <form onSubmit={handleAddExpense} className="space-y-4">
                        <input className="input-std" placeholder="Description" required value={newExpense.description || ''} onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" className="input-std" placeholder="Montant" required value={newExpense.amount || ''} onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})} />
                            <input type="date" className="input-std" required value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} />
                        </div>
                        <select className="input-std" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value as any})}>
                            <option value="UTILITIES">Factures (Eau/Elec)</option>
                            <option value="MAINTENANCE">Maintenance</option>
                            <option value="SUPPLIES">Achats/Stocks</option>
                            <option value="TAXES">Taxes</option>
                        </select>
                        <button className="btn-primary w-full justify-center">Ajouter</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

// --- MODULE: MARKETING MANAGER 2.0 (REMASTERED) ---
export const MarketingManager = ({ marketingCampaigns, addMarketingCampaign, updateCampaignStatus, showToast }: {
    marketingCampaigns: MarketingCampaign[];
    addMarketingCampaign: (c: MarketingCampaign) => void;
    updateCampaignStatus: (id: string, status: string) => void;
    showToast: (msg: string, type?: string) => void;
}) => {
    const [showModal, setShowModal] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [newCampaign, setNewCampaign] = useState<Partial<MarketingCampaign>>({ status: 'DRAFT' });

    const handleCreate = () => {
        if(!newCampaign.name) return;
        addMarketingCampaign({
            id: `MC-${Date.now()}`, name: newCampaign.name, type: newCampaign.type || 'EMAIL',
            status: 'SCHEDULED', sentCount: 0, openRate: 0, date: newCampaign.date || new Date().toISOString().split('T')[0]
        });
        setShowModal(false); setWizardStep(1); setNewCampaign({});
        showToast('Campagne planifiée avec succès', 'SUCCESS');
    };

    return (
        <div className="p-8 animate-fade-in h-full flex flex-col relative bg-stone-50/50">
            <div className="flex justify-between items-center mb-8">
                <div><h2 className="font-serif text-2xl text-slate-900">Marketing</h2><p className="text-slate-500 text-sm">Campagnes Email & WhatsApp</p></div>
                <button onClick={() => setShowModal(true)} className="btn-primary"><Megaphone size={16} className="mr-2"/> Créer Campagne</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-12">
                {marketingCampaigns.map(camp => (
                    <div key={camp.id} className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-lg transition relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1 h-full ${camp.status === 'SENT' ? 'bg-green-500' : camp.status === 'SCHEDULED' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                        <div className="flex justify-between items-start mb-4 pl-2">
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${camp.type === 'EMAIL' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {camp.type === 'EMAIL' ? <Mail size={16}/> : <Phone size={16}/>}
                                </div>
                                <div><h4 className="font-bold text-slate-900 text-sm">{camp.name}</h4><p className="text-xs text-slate-500">{camp.date}</p></div>
                            </div>
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${camp.status === 'SENT' ? 'bg-green-100 text-green-700' : camp.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-600'}`}>{camp.status}</span>
                        </div>
                        
                        {camp.status === 'SENT' ? (
                            <div className="space-y-4 pl-2">
                                <div>
                                    <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Envoyés</span><span className="font-bold">{camp.sentCount}</span></div>
                                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden"><div className="bg-slate-800 h-full w-full"></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Taux d'ouverture</span><span className="font-bold text-amber-600">{camp.openRate}%</span></div>
                                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden"><div className="bg-amber-500 h-full transition-all duration-1000" style={{width: `${camp.openRate}%`}}></div></div>
                                </div>
                            </div>
                        ) : (
                            <div className="pl-2 pt-2">
                                <p className="text-xs text-slate-500 italic mb-4">Cette campagne est en attente d'envoi.</p>
                                <button className="w-full py-2 border border-stone-200 rounded text-xs font-bold uppercase hover:bg-stone-50 transition text-slate-600">Modifier</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showModal && (
                <Modal title="Nouvelle Campagne" onClose={() => { setShowModal(false); setWizardStep(1); }}>
                    <div className="mb-6 flex items-center justify-between px-8 relative">
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-stone-200 -z-10"></div>
                        {[1, 2, 3].map(step => (
                            <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${wizardStep >= step ? 'bg-slate-900 text-white' : 'bg-stone-200 text-slate-400'}`}>
                                {step}
                            </div>
                        ))}
                    </div>
                    
                    <div className="min-h-[200px]">
                        {wizardStep === 1 && (
                            <div className="space-y-4 animate-fade-in">
                                <h4 className="font-bold text-slate-800 text-sm">Détails Généraux</h4>
                                <input className="input-std" placeholder="Nom de la campagne" value={newCampaign.name || ''} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} />
                                <div className="grid grid-cols-2 gap-4">
                                    <select className="input-std" value={newCampaign.type} onChange={e => setNewCampaign({...newCampaign, type: e.target.value as any})}><option value="EMAIL">Email Marketing</option><option value="WHATSAPP">WhatsApp Business</option></select>
                                    <input type="date" className="input-std" value={newCampaign.date || ''} onChange={e => setNewCampaign({...newCampaign, date: e.target.value})} />
                                </div>
                            </div>
                        )}
                        {wizardStep === 2 && (
                            <div className="space-y-4 animate-fade-in">
                                <h4 className="font-bold text-slate-800 text-sm">Audience Cible</h4>
                                <div className="space-y-2">
                                    {['Tous les Clients', 'Clients VIP', 'Prospects (Leads)', 'Anciens Séjours'].map(aud => (
                                        <label key={aud} className="flex items-center p-3 border border-stone-200 rounded cursor-pointer hover:bg-stone-50">
                                            <input type="radio" name="audience" className="mr-3" />
                                            <span className="text-sm text-slate-700">{aud}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                        {wizardStep === 3 && (
                            <div className="space-y-4 animate-fade-in">
                                <h4 className="font-bold text-slate-800 text-sm">Contenu</h4>
                                <textarea className="input-std h-32" placeholder="Message de la campagne..." />
                                <div className="bg-amber-50 p-3 rounded text-xs text-amber-800 flex items-start"><AlertCircle size={14} className="mr-2 shrink-0 mt-0.5"/> La campagne sera envoyée automatiquement à la date prévue.</div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between mt-8 pt-4 border-t border-stone-100">
                        {wizardStep > 1 ? <button onClick={() => setWizardStep(wizardStep - 1)} className="btn-secondary">Retour</button> : <div></div>}
                        {wizardStep < 3 ? <button onClick={() => setWizardStep(wizardStep + 1)} className="btn-primary">Suivant</button> : <button onClick={handleCreate} className="btn-primary bg-green-600 hover:bg-green-700">Confirmer</button>}
                    </div>
                </Modal>
            )}
        </div>
    );
};

// --- MODULE: BOOKINGS MANAGER (Standard) ---
export const BookingsManager = ({ bookings, villas, addBooking, deleteBooking, updateBooking, showToast }: {
    bookings: Booking[];
    villas: Villa[];
    addBooking: (booking: Booking) => void;
    deleteBooking: (id: string) => void;
    updateBooking: (booking: Booking) => void;
    showToast: (msg: string, type?: string) => void;
}) => {
    const [showModal, setShowModal] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Partial<Booking & { startDate: string; endDate: string; totalPrice: string }>>({});
    const [selectedVillas, setSelectedVillas] = useState<string[]>([]);
    const [isMaintenanceBlock, setIsMaintenanceBlock] = useState(false);

    const handleSave = () => {
        // Validation logic
        if (!editingBooking.clientName && !isMaintenanceBlock) return showToast('Nom client requis', 'ERROR');
        if (!editingBooking.startDate || !editingBooking.endDate) return showToast('Dates requises', 'ERROR');
        
        // Use selected villas or the single one from edit mode
        const targetVillas = editingBooking.id ? [editingBooking.villaId!] : selectedVillas;
        if (targetVillas.length === 0) return showToast('Sélectionnez au moins une villa', 'ERROR');

        targetVillas.forEach((vid, index) => {
            if(!vid) return;
            // Calculate price per villa if not manually set
            let price = editingBooking.totalPrice;
            if ((!price || price === '' || price === '0') && editingBooking.startDate && editingBooking.endDate && !isMaintenanceBlock) {
                const days = Math.ceil((new Date(editingBooking.endDate).getTime() - new Date(editingBooking.startDate).getTime()) / (1000*3600*24));
                const villa = villas.find(v => v.id === vid);
                if (villa) price = String(days * villa.pricePerNight);
            }

            const bookingData = {
                ...editingBooking,
                id: editingBooking.id || `BK-${Date.now()}-${index}`,
                villaId: vid,
                clientName: isMaintenanceBlock ? 'MAINTENANCE / BLOCAGE' : (editingBooking.clientName || 'Client'),
                clientEmail: isMaintenanceBlock ? 'admin@villas.ma' : (editingBooking.clientEmail || ''),
                totalPrice: isMaintenanceBlock ? '0' : (price || '0'),
                status: isMaintenanceBlock ? BookingStatus.CONFIRMED : (editingBooking.status || BookingStatus.CONFIRMED),
                specialRequests: isMaintenanceBlock ? 'Blocage Administratif' : editingBooking.specialRequests,
                startDate: editingBooking.startDate,
                endDate: editingBooking.endDate
            } as Booking;

            if(editingBooking.id) {
                updateBooking(bookingData);
            } else {
                addBooking(bookingData);
            }
        });

        showToast(editingBooking.id ? 'Réservation modifiée' : `${targetVillas.length} Réservation(s) créée(s)`, 'SUCCESS');
        setShowModal(false); 
        setEditingBooking({});
        setSelectedVillas([]);
        setIsMaintenanceBlock(false);
    };

    const toggleVillaSelection = (id: string) => {
        if(selectedVillas.includes(id)) {
            setSelectedVillas(selectedVillas.filter(v => v !== id));
        } else {
            setSelectedVillas([...selectedVillas, id]);
        }
    };

    return (
        <div className="p-8 animate-fade-in relative h-full flex flex-col bg-stone-50/50">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-slate-900">Réservations</h2>
                <button onClick={() => { setEditingBooking({}); setSelectedVillas([]); setIsMaintenanceBlock(false); setShowModal(true); }} className="btn-primary"><Plus size={16} className="mr-2"/> Nouvelle Réservation</button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden flex-1">
                <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b text-xs font-bold uppercase text-slate-500">
                        <tr><th className="p-4">Ref</th><th className="p-4">Client</th><th className="p-4">Villa</th><th className="p-4">Dates</th><th className="p-4">Statut</th><th className="p-4 text-right">Action</th></tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => (
                            <tr key={b.id} className="border-b hover:bg-stone-50">
                                <td className="p-4 font-mono text-xs">{b.id}</td>
                                <td className="p-4 font-bold text-sm">
                                    {b.clientName === 'MAINTENANCE / BLOCAGE' ? <span className="text-red-500 flex items-center"><Lock size={12} className="mr-1"/> BLOQUÉ</span> : b.clientName}
                                </td>
                                <td className="p-4 text-sm">{villas.find(v => v.id === b.villaId)?.name}</td>
                                <td className="p-4 text-xs">{typeof b.startDate === 'string' ? b.startDate : b.startDate?.toISOString().split('T')[0]} → {typeof b.endDate === 'string' ? b.endDate : b.endDate?.toISOString().split('T')[0]}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{b.status}</span></td>
                                <td className="p-4 text-right flex justify-end space-x-2">
                                    <button onClick={() => { setEditingBooking({ ...b, startDate: typeof b.startDate === 'string' ? b.startDate : b.startDate?.toISOString().split('T')[0], endDate: typeof b.endDate === 'string' ? b.endDate : b.endDate?.toISOString().split('T')[0], totalPrice: b.totalPrice }) ; setShowModal(true); }} className="text-slate-400 hover:text-amber-600"><Edit size={16}/></button>
                                    <button onClick={() => { if(confirm('Supprimer ?')) deleteBooking(b.id); }} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <Modal title={editingBooking.id ? 'Modifier Réservation' : 'Nouvelle Réservation / Blocage'} onClose={() => setShowModal(false)}>
                    <div className="space-y-4">
                        {!editingBooking.id && (
                            <div className="bg-stone-50 p-4 rounded border border-stone-200 mb-4">
                                <label className="flex items-center space-x-2 cursor-pointer mb-2">
                                    <input type="checkbox" className="w-4 h-4 text-red-600 rounded" checked={isMaintenanceBlock} onChange={e => setIsMaintenanceBlock(e.target.checked)} />
                                    <span className="text-sm font-bold text-slate-700">Bloquer pour Maintenance / Indisponibilité</span>
                                </label>
                                <p className="text-xs text-slate-500 ml-6">Ceci créera une réservation interne pour bloquer le calendrier.</p>
                            </div>
                        )}

                        {!isMaintenanceBlock && (
                            <>
                                <input className="input-std" placeholder="Nom Client" value={editingBooking.clientName || ''} onChange={e => setEditingBooking({...editingBooking, clientName: e.target.value})} />
                                <input className="input-std" placeholder="Email Client" value={editingBooking.clientEmail || ''} onChange={e => setEditingBooking({...editingBooking, clientEmail: e.target.value})} />
                            </>
                        )}

                        {/* VILLA SELECTION */}
                        <div>
                            <label className="label-xs mb-2">Sélectionner Villa(s)</label>
                            {editingBooking.id ? (
                                <select className="input-std" value={editingBooking.villaId || ''} onChange={e => setEditingBooking({...editingBooking, villaId: e.target.value})}>
                                    <option value="">Choisir Villa</option>
                                    {villas.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {villas.map(v => (
                                        <div 
                                            key={v.id} 
                                            onClick={() => toggleVillaSelection(v.id)}
                                            className={`p-3 rounded border text-sm font-bold cursor-pointer transition flex justify-between items-center ${selectedVillas.includes(v.id) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-stone-200 hover:border-slate-400'}`}
                                        >
                                            <span>{v.name}</span>
                                            {selectedVillas.includes(v.id) && <CheckCircle size={14}/>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" className="input-std" value={typeof editingBooking.startDate === 'string' ? editingBooking.startDate : editingBooking.startDate?.toISOString().split('T')[0] || ''} onChange={e => setEditingBooking({...editingBooking, startDate: e.target.value})} />
                            <input type="date" className="input-std" value={typeof editingBooking.endDate === 'string' ? editingBooking.endDate : editingBooking.endDate?.toISOString().split('T')[0] || ''} onChange={e => setEditingBooking({...editingBooking, endDate: e.target.value})} />
                        </div>
                        
                        {!isMaintenanceBlock && (
                            <input type="number" className="input-std" placeholder="Prix Total (Laisser vide pour auto)" value={editingBooking.totalPrice || ''} onChange={e => setEditingBooking({...editingBooking, totalPrice: e.target.value})} />
                        )}

                        <select className="input-std" value={editingBooking.status || 'CONFIRMED'} onChange={e => setEditingBooking({...editingBooking, status: e.target.value as any})}>
                            <option value="PENDING">En Attente</option>
                            <option value="CONFIRMED">Confirmé / Bloqué</option>
                            <option value="CHECKED_IN">Check-in</option>
                            <option value="COMPLETED">Terminé</option>
                            <option value="CANCELLED">Annulé</option>
                        </select>
                        
                        <button onClick={handleSave} className="btn-primary w-full justify-center py-3 mt-4">
                            {editingBooking.id ? 'Mettre à jour' : `Créer ${selectedVillas.length > 0 ? selectedVillas.length : ''} Réservation(s)`}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
