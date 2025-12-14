
import React, { useState } from 'react';
import { 
    Plus, BellRing, ChefHat, Car, X, Check, AlertTriangle, 
    Calendar, User, Clock, Wrench, MoreHorizontal, Filter, 
    Search, Trash2, Save, ShoppingCart, ArrowRight, FileText,
    TrendingDown, TrendingUp, AlertCircle, Shield, ClipboardCheck, Edit
} from 'lucide-react';
// Les données et actions sont désormais passées en props depuis Astro
import { MaintenanceTicket, StaffMember, UserRole, InventoryItem, ServiceRequest } from '../../../../types';
import { Modal } from '../AdminShared';

// --- SHARED: KANBAN CARD ---
const TicketCard = ({ ticket, onMove, onView }: { ticket: MaintenanceTicket, onMove: (id: string, status: string) => void, onView: (t: MaintenanceTicket) => void }) => {
    const priorityColors = { LOW: 'bg-blue-100 text-blue-700', MEDIUM: 'bg-yellow-100 text-yellow-700', HIGH: 'bg-orange-100 text-orange-700', URGENT: 'bg-red-100 text-red-700' };
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 cursor-pointer hover:shadow-md transition group relative" onClick={() => onView(ticket)}>
            <div className="flex justify-between items-start mb-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${priorityColors[ticket.priority]}`}>{ticket.priority}</span><span className="text-[10px] text-slate-400 font-mono">{ticket.id}</span></div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">{ticket.category}</h4>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">{ticket.description}</p>
            <div className="flex justify-between items-center pt-2 border-t border-stone-50">
                <div className="flex items-center text-xs text-slate-400"><User size={12} className="mr-1"/> {ticket.assignedTo || 'Unassigned'}</div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition" onClick={e => e.stopPropagation()}>
                    {ticket.status !== 'OPEN' && <button onClick={() => onMove(ticket.id, 'OPEN')} className="p-1 hover:bg-stone-100 rounded" title="Move to Open"><ArrowRight size={12} className="rotate-180"/></button>}
                    {ticket.status !== 'IN_PROGRESS' && <button onClick={() => onMove(ticket.id, 'IN_PROGRESS')} className="p-1 hover:bg-stone-100 rounded" title="Move to In Progress"><Clock size={12}/></button>}
                    {ticket.status !== 'RESOLVED' && <button onClick={() => onMove(ticket.id, 'RESOLVED')} className="p-1 hover:bg-stone-100 rounded" title="Resolve"><Check size={12}/></button>}
                </div>
            </div>
        </div>
    );
};

// --- 1. MAINTENANCE MANAGER ---
type MaintenanceManagerProps = {
    tickets: MaintenanceTicket[];
    addTicket: (t: MaintenanceTicket) => void;
    updateTicketStatus: (id: string, status: string) => void;
    deleteTicket: (id: string) => void;
    showToast: (msg: string, type?: string) => void;
};
export const MaintenanceManager = ({ tickets, addTicket, updateTicketStatus, deleteTicket, showToast }: MaintenanceManagerProps) => {
        const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
        const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleMove = (id: string, status: any) => { updateTicketStatus(id, status); showToast(`Ticket déplacé vers ${status}`, 'SUCCESS'); };
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault(); const fd = new FormData(e.target as HTMLFormElement);
        addTicket({ id: `TKT-${Date.now()}`, category: fd.get('category') as any, description: fd.get('description') as string, villaId: fd.get('villaId') as string, reportedBy: 'Manager', priority: fd.get('priority') as any, status: 'OPEN', createdAt: new Date().toISOString().split('T')[0] });
        setIsCreateOpen(false); showToast('Ticket créé', 'SUCCESS');
    };

    return (
        <div className="p-8 animate-fade-in h-full flex flex-col relative">
            <div className="flex justify-between items-center mb-6">
                <div><h2 className="font-serif text-2xl text-slate-900">Maintenance</h2><p className="text-slate-500 text-sm">Suivi des interventions techniques.</p></div>
                <button onClick={() => setIsCreateOpen(true)} className="btn-primary"><Plus size={16} className="mr-2"/> Nouveau Ticket</button>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
                {['OPEN', 'IN_PROGRESS', 'RESOLVED'].map(status => (
                    <div key={status} className="bg-stone-50 rounded-lg flex flex-col h-full border border-stone-200">
                        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-white rounded-t-lg"><h3 className="font-bold text-xs uppercase text-slate-600 tracking-wider">{status.replace('_', ' ')}</h3><span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-bold">{tickets.filter(t => t.status === status).length}</span></div>
                        <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                            {tickets.filter(t => t.status === status).map(ticket => <TicketCard key={ticket.id} ticket={ticket} onMove={handleMove} onView={setSelectedTicket} />)}
                        </div>
                    </div>
                ))}
            </div>
            {selectedTicket && (
                <Modal title={selectedTicket.category} onClose={() => setSelectedTicket(null)} footer={
                    <>
                        <button onClick={() => { if(confirm('Supprimer ce ticket ?')) { deleteTicket(selectedTicket.id); setSelectedTicket(null); }}} className="text-red-500 text-xs font-bold uppercase hover:underline mr-auto">Supprimer</button>
                        <button onClick={() => { handleMove(selectedTicket.id, 'RESOLVED'); setSelectedTicket(null); }} className="btn-primary">Marquer Résolu</button>
                    </>
                }>
                    <p className="text-sm text-slate-600 mb-6 bg-stone-50 p-4 rounded">{selectedTicket.description}</p>
                </Modal>
            )}
            
            {isCreateOpen && (
                <Modal title="Nouveau Ticket" onClose={() => setIsCreateOpen(false)}>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <select name="category" className="input-std"><option value="PLUMBING">Plomberie</option><option value="ELECTRICITY">Électricité</option><option value="AC">Climatisation</option></select>
                        <input name="villaId" className="input-std" placeholder="ID Villa (ex: villa-1)"/>
                        <textarea name="description" className="input-std h-24" placeholder="Description du problème..."></textarea>
                        <select name="priority" className="input-std"><option value="LOW">Basse</option><option value="MEDIUM">Moyenne</option><option value="HIGH">Haute</option><option value="URGENT">Urgente</option></select>
                        <button className="btn-primary w-full justify-center">Créer</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

// --- 2. STAFF MANAGER ---
type StaffManagerProps = {
    staff: StaffMember[];
    updateStaffSchedule: (id: string, dayIndex: number, shift: string) => void;
    addStaffMember: (s: StaffMember) => void;
    updateStaffMember: (s: StaffMember) => void;
    deleteStaffMember: (id: string) => void;
    showToast: (msg: string, type?: string) => void;
};
export const StaffManager = ({ staff, updateStaffSchedule, addStaffMember, updateStaffMember, deleteStaffMember, showToast }: StaffManagerProps) => {
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Partial<StaffMember>>({});
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    const handleSave = () => {
        if(!editingStaff.name) return;
        const member = { ...editingStaff, id: editingStaff.id || `ST-${Date.now()}`, schedule: editingStaff.schedule || Array(7).fill({day:'', shift:'OFF'}) } as StaffMember;
        editingStaff.id ? updateStaffMember(member) : addStaffMember(member);
        setShowStaffModal(false); setEditingStaff({}); showToast('Staff enregistré', 'SUCCESS');
    };

    const handleShiftClick = (staffId: string, dayIndex: number, currentShift: string) => {
        const cycle = ['OFF', 'MORNING', 'AFTERNOON', 'FULL_DAY'];
        const nextShift = cycle[(cycle.indexOf(currentShift) + 1) % cycle.length];
        updateStaffSchedule(staffId, dayIndex, nextShift);
    };

    return (
        <div className="p-8 animate-fade-in relative h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-slate-900">Équipes & Planning</h2>
                <button className="btn-primary" onClick={() => { setEditingStaff({ role: UserRole.STAFF_CLEANING, status: 'ACTIVE' }); setShowStaffModal(true); }}><Plus size={16} className="mr-2"/> Ajouter</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
                <div className="lg:col-span-1 overflow-y-auto pr-2 space-y-3">
                    {staff.map(s => (
                        <div key={s.id} className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 flex items-center justify-between group hover:border-amber-400 transition cursor-pointer">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 mr-3 text-xs">{s.name.charAt(0)}</div>
                                <div><h4 className="font-bold text-slate-900 text-sm">{s.name}</h4><p className="text-[10px] text-slate-500 uppercase">{s.role.replace('STAFF_', '')}</p></div>
                            </div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                                <button onClick={() => { setEditingStaff(s); setShowStaffModal(true); }}><Edit size={14} className="text-slate-400 hover:text-amber-600"/></button>
                                <button onClick={() => deleteStaffMember(s.id)}><Trash2 size={14} className="text-slate-400 hover:text-red-600"/></button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-stone-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-stone-200 bg-stone-50 font-bold text-slate-700 text-xs uppercase tracking-widest">Semaine en cours</div>
                    <div className="flex-1 overflow-auto">
                        <div className="min-w-[800px]">
                            <div className="grid grid-cols-8 border-b border-stone-100 bg-stone-50/50">
                                <div className="p-3 text-xs font-bold uppercase text-slate-400 border-r border-stone-100">Employé</div>
                                {days.map(d => <div key={d} className="p-3 text-center text-xs font-bold uppercase text-slate-400 border-r border-stone-100">{d}</div>)}
                            </div>
                            {staff.map(s => (
                                <div key={s.id} className="grid grid-cols-8 hover:bg-stone-50 border-b border-stone-50">
                                    <div className="p-3 flex items-center border-r border-stone-100 text-xs font-bold text-slate-700">{s.name}</div>
                                    {s.schedule.map((shift, i) => (
                                        <div key={i} className="p-1 border-r border-stone-100 relative group">
                                            <button onClick={() => handleShiftClick(s.id, i, shift.shift)} className={`w-full h-full rounded flex items-center justify-center text-[10px] font-bold uppercase ${
                                                shift.shift === 'OFF' ? 'text-slate-300' : shift.shift === 'MORNING' ? 'bg-amber-100 text-amber-700' : shift.shift === 'AFTERNOON' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                            }`}>{shift.shift.substring(0,3)}</button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {showStaffModal && (
                <Modal title={editingStaff.id ? 'Modifier Staff' : 'Ajouter Staff'} onClose={() => setShowStaffModal(false)}>
                    <div className="space-y-4">
                        <input className="input-std" placeholder="Nom" value={editingStaff.name || ''} onChange={e => setEditingStaff({...editingStaff, name: e.target.value})} />
                        <input className="input-std" placeholder="Email" value={editingStaff.email || ''} onChange={e => setEditingStaff({...editingStaff, email: e.target.value})} />
                        <input className="input-std" placeholder="Téléphone" value={editingStaff.phone || ''} onChange={e => setEditingStaff({...editingStaff, phone: e.target.value})} />
                        <select className="input-std" value={editingStaff.role} onChange={e => setEditingStaff({...editingStaff, role: e.target.value as UserRole})}>
                            <option value={UserRole.STAFF_CLEANING}>Ménage</option>
                            <option value={UserRole.STAFF_MAINTENANCE}>Maintenance</option>
                            <option value={UserRole.MANAGER}>Manager</option>
                        </select>
                        <button onClick={handleSave} className="btn-primary w-full">Enregistrer</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// --- 3. INVENTORY MANAGER ---
type InventoryManagerProps = {
    inventory: InventoryItem[];
    updateInventory: (id: string, qty: number) => void;
    addInventoryItem: (item: InventoryItem) => void;
    updateInventoryItem: (item: InventoryItem) => void;
    deleteInventoryItem: (id: string) => void;
    showToast: (msg: string, type?: string) => void;
};
export const InventoryManager = ({ inventory, updateInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, showToast }: InventoryManagerProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [adjustItem, setAdjustItem] = useState<any | null>(null);
    const [editingItem, setEditingItem] = useState<Partial<InventoryItem> | null>(null);
    const [adjustQty, setAdjustQty] = useState(0);

    const filteredInventory = inventory.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSaveItem = () => {
        if(!editingItem?.name) return;
        const item = { ...editingItem, id: editingItem.id || `INV-${Date.now()}`, quantity: editingItem.quantity || 0, minLevel: editingItem.minLevel || 5, status: 'OK' } as InventoryItem;
        editingItem.id ? updateInventoryItem(item) : addInventoryItem(item);
        setEditingItem(null); showToast('Article enregistré', 'SUCCESS');
    };

    return (
        <div className="p-8 animate-fade-in relative h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-slate-900">Stocks</h2>
                <button className="btn-primary" onClick={() => setEditingItem({ category: 'LINEN', unit: 'pcs' })}><Plus size={16} className="mr-2"/> Nouvel Article</button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
                    <div className="relative w-64"><Search size={16} className="absolute left-3 top-3 text-slate-400"/><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded text-sm focus:border-amber-600 outline-none"/></div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold uppercase text-slate-500 sticky top-0">
                            <tr><th className="p-4">Article</th><th className="p-4">Catégorie</th><th className="p-4">En Stock</th><th className="p-4">Min.</th><th className="p-4">Statut</th><th className="p-4 text-right">Action</th></tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredInventory.map(item => (
                                <tr key={item.id} className="hover:bg-stone-50 group">
                                    <td className="p-4 font-bold text-sm text-slate-800">{item.name}</td>
                                    <td className="p-4 text-xs font-bold uppercase text-slate-500">{item.category}</td>
                                    <td className="p-4 font-mono text-sm font-bold">{item.quantity} {item.unit}</td>
                                    <td className="p-4 font-mono text-xs text-slate-400">{item.minLevel}</td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.status === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{item.status}</span></td>
                                    <td className="p-4 text-right flex justify-end space-x-2">
                                        <button onClick={() => { setAdjustItem(item); setAdjustQty(item.quantity); }} className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase border px-2 py-1 rounded">Ajuster</button>
                                        <button onClick={() => setEditingItem(item)} className="text-slate-400 hover:text-amber-600"><Edit size={16}/></button>
                                        <button onClick={() => deleteInventoryItem(item.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {adjustItem && (
                <Modal title="Ajuster Stock" onClose={() => setAdjustItem(null)}>
                    <div className="space-y-6 text-center">
                        <p className="text-sm text-slate-500">{adjustItem.name}</p>
                        <div className="flex items-center justify-center space-x-6"><button onClick={() => setAdjustQty(Math.max(0, adjustQty - 1))} className="w-10 h-10 border rounded">-</button><span className="text-3xl font-mono font-bold">{adjustQty}</span><button onClick={() => setAdjustQty(adjustQty + 1)} className="w-10 h-10 border rounded">+</button></div>
                        <div className="grid grid-cols-2 gap-3"><button onClick={() => setAdjustItem(null)} className="btn-secondary justify-center">Annuler</button><button onClick={() => { updateInventory(adjustItem.id, adjustQty); setAdjustItem(null); }} className="btn-primary justify-center">Valider</button></div>
                    </div>
                </Modal>
            )}

            {editingItem && (
                <Modal title="Éditer Article" onClose={() => setEditingItem(null)}>
                    <div className="space-y-4">
                        <input className="input-std" placeholder="Nom" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                            <input className="input-std" type="number" placeholder="Min Level" value={editingItem.minLevel || ''} onChange={e => setEditingItem({...editingItem, minLevel: Number(e.target.value)})} />
                            <input className="input-std" placeholder="Unité" value={editingItem.unit || ''} onChange={e => setEditingItem({...editingItem, unit: e.target.value})} />
                        </div>
                        <select className="input-std" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value as any})}><option value="LINEN">Linge</option><option value="KITCHEN">Cuisine</option><option value="TOILETRIES">SDB</option></select>
                        <button onClick={handleSaveItem} className="btn-primary w-full justify-center">Sauvegarder</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// --- 4. CONCIERGE MANAGER ---
type ConciergeManagerProps = {
    serviceRequests: ServiceRequest[];
    updateServiceRequestStatus: (id: string, status: string) => void;
    showToast: (msg: string, type?: string) => void;
};
export const ConciergeManager = ({ serviceRequests, updateServiceRequestStatus, showToast }: ConciergeManagerProps) => {
    const handleUpdate = (id: string, status: any) => { updateServiceRequestStatus(id, status); showToast(`Demande ${status}`, 'SUCCESS'); };

    return (
        <div className="p-8 animate-fade-in relative h-full flex flex-col">
            <h2 className="font-serif text-2xl text-slate-900 mb-6">Conciergerie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pb-20">
                {serviceRequests.map(req => (
                    <div key={req.id} className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 flex flex-col justify-between hover:border-amber-400 transition relative overflow-hidden">
                        {req.status === 'PENDING' && <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>}
                        {req.status === 'APPROVED' && <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>}
                        <div>
                            <div className="flex justify-between items-start mb-4 pl-3">
                                <h4 className="font-bold text-slate-900 text-sm">{req.serviceType}</h4>
                                <span className="font-mono font-bold text-slate-700 text-sm">{req.price}€</span>
                            </div>
                            <div className="bg-stone-50 p-3 rounded mb-4 pl-3 border border-stone-100 text-xs space-y-1">
                                <p><span className="font-bold">Client:</span> {req.clientName}</p>
                                <p><span className="font-bold">Lieu:</span> Villa {req.villaId}</p>
                                <p><span className="font-bold">Date:</span> {req.dateRequested}</p>
                                {req.notes && <p className="italic text-slate-500 border-t border-stone-200 pt-1 mt-1">"{req.notes}"</p>}
                            </div>
                        </div>
                        <div className="flex justify-between items-center pl-3">
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : req.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{req.status}</span>
                            {req.status === 'PENDING' && <div className="flex space-x-2"><button onClick={() => handleUpdate(req.id, 'COMPLETED')} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"><X size={16}/></button><button onClick={() => handleUpdate(req.id, 'APPROVED')} className="p-2 bg-slate-900 text-white hover:bg-slate-800 rounded"><Check size={16}/></button></div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
