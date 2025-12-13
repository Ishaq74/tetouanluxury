
import React, { useState, useMemo } from 'react';
import { UserRole, Task, TaskType, TaskStatus, BookingStatus } from '../types';
import { 
    CheckSquare, AlertTriangle, Check, Box, 
    X, ClipboardCheck, MessageSquare, 
    CheckCircle, AlertCircle, Wrench, ShieldCheck,
    Plus, MapPin, ChevronRight, Luggage, BellRing, Car, ChefHat, LogIn, LogOut, Lock, Home,
    ThumbsUp, ThumbsDown, Users
} from 'lucide-react';
import { useData } from '../DataContext';
import { useToast } from '../ToastContext';
import { useUser } from '../auth/UserContext';
import { useLanguage } from '../LanguageContext';
import { Modal } from '../components/admin/AdminShared';

// --- COMPOSANT : BADGE DE STATUT ---
const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        'TODO': 'bg-slate-100 text-slate-600 border-slate-200',
        'IN_PROGRESS': 'bg-blue-100 text-blue-700 border-blue-200',
        'PENDING_REVIEW': 'bg-purple-100 text-purple-700 border-purple-200',
        'DONE': 'bg-green-100 text-green-700 border-green-200',
        'URGENT': 'bg-red-100 text-red-700 border-red-200',
        'VIP': 'bg-amber-100 text-amber-700 border-amber-200',
        'CONFIRMED': 'bg-green-50 text-green-700 border-green-200',
        'CHECKED_IN': 'bg-blue-50 text-blue-700 border-blue-200',
        'PENDING': 'bg-orange-50 text-orange-700 border-orange-200',
        'APPROVED': 'bg-green-100 text-green-700 border-green-200',
        'COMPLETED': 'bg-stone-100 text-stone-500 border-stone-200'
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border tracking-wider ${styles[status] || 'bg-stone-100'}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

// ==================================================================================
// 1. VUE STAFF (MOBILE FIRST - HOSPITALITY OS)
// ==================================================================================
const EmployeeView = () => {
    const { user } = useUser();
    const { t } = useLanguage();
    const { 
        tasks, updateTask, addTask, 
        bookings, updateBookingStatus, 
        villas, villaStatuses, updateVillaStatus,
        serviceRequests, updateServiceRequestStatus 
    } = useData();
    const { showToast } = useToast();
    
    const [activeTab, setActiveTab] = useState<'DASH' | 'MOVE' | 'MISSIONS' | 'REQ'>('DASH');
    
    // --- DATAS SYNCHRONISÉES ---
    // Date figée pour la démo, à remplacer par `new Date()` en prod
    const today = new Date().toISOString().split('T')[0];
    const demoDate = '2023-10-15'; 

    // Filtres en temps réel via useMemo pour performance
    const arrivals = useMemo(() => bookings.filter(b => (b.startDate === demoDate || b.startDate === today) && b.status !== BookingStatus.CANCELLED), [bookings]);
    const departures = useMemo(() => bookings.filter(b => (b.endDate === demoDate || b.endDate === today) && b.status !== BookingStatus.CANCELLED), [bookings]);
    
    const myName = user?.name?.split(' ')[0] || ''; 
    
    // Filtre des tâches : Assignées à moi OU Tâches Concierge générales
    const myTasks = useMemo(() => tasks.filter(t => 
        (t.status !== TaskStatus.DONE) && 
        (!t.assignedTo || t.assignedTo.includes(myName) || t.type === 'CONCIERGE')
    ).sort((a,b) => (a.priority === 'URGENT' ? -1 : 1)), [tasks, myName]);

    const pendingRequests = useMemo(() => serviceRequests.filter(r => r.status === 'PENDING'), [serviceRequests]);

    // --- LOGIQUE MÉTIER "HARD" (SANS CHRONO) ---

    // 1. Check-in : STRICTEMENT INTERDIT si la villa n'est pas 'CLEAN' dans la BDD
    const handleCheckIn = (bookingId: string, villaId: string) => {
        const villaStatus = villaStatuses.find(v => v.id === villaId);
        
        if (villaStatus?.cleanliness !== 'CLEAN') {
            showToast(`⛔️ BLOCAGE : La ${villaStatus?.villaName} est encore SALE. Check-in impossible.`, 'ERROR');
            return;
        }
        
        // Update BDD
        updateBookingStatus(bookingId, BookingStatus.CHECKED_IN);
        updateVillaStatus(villaId, { occupancy: 'OCCUPIED' });
        showToast("✅ Check-in validé. Villa marquée OCCUPÉE.", "SUCCESS");
    };

    // 2. Check-out : AUTOMATISATION TOTALE
    const handleCheckOut = (bookingId: string, villaId: string) => {
        // 1. Clôture réservation
        updateBookingStatus(bookingId, BookingStatus.COMPLETED);
        
        // 2. La villa passe automatiquement en SALE et VACANTE
        updateVillaStatus(villaId, { occupancy: 'VACANT', cleanliness: 'DIRTY' });
        
        // 3. Génération automatique de la mission de ménage pour l'équipe
        const newTask: Task = {
            id: `TSK-AUTO-${Date.now()}`,
            type: TaskType.CLEANING,
            title: `Nettoyage Départ (Auto)`,
            description: 'Check-out effectué. Nettoyage complet requis + Changement draps.',
            villaId: villaId,
            status: TaskStatus.TODO,
            dueDate: today,
            // Si c'est une femme de chambre qui valide le départ, elle s'auto-assigne la tâche, sinon c'est ouvert
            assignedTo: user?.role === UserRole.STAFF_CLEANING ? myName : undefined 
        };
        addTask(newTask);

        showToast("👋 Départ validé. Villa marquée SALE. Mission créée.", "SUCCESS");
    };

    // 3. Tâches : Simple validation
    const handleTaskComplete = (task: Task) => {
        // Si c'est du ménage, on propose de passer la villa en PROPRE automatiquement
        if (task.type === TaskType.CLEANING) {
             updateVillaStatus(task.villaId, { cleanliness: 'CLEAN' });
             showToast(`Villa ${task.villaId} marquée PROPRE.`, 'INFO');
        }
        
        // La tâche passe en "Revue" pour validation manager (ou DONE si pas de process de review)
        updateTask({ ...task, status: TaskStatus.PENDING_REVIEW });
        showToast("Mission terminée ✅", "SUCCESS");
    };

    return (
        <div className="min-h-screen bg-stone-100 pb-24 font-sans select-none">
            {/* Header Compact */}
            <div className="bg-slate-900 text-white pt-4 pb-4 px-6 rounded-b-3xl shadow-xl sticky top-0 z-30">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-green-500 flex items-center justify-center font-bold text-sm mr-3 relative">
                            {myName.charAt(0)}
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold leading-none">{user?.name}</h1>
                            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-1">{user?.role?.replace('STAFF_', '')}</p>
                        </div>
                    </div>
                    <div className="flex space-x-4 text-center">
                       <div onClick={() => setActiveTab('MISSIONS')} className={`cursor-pointer ${activeTab === 'MISSIONS' ? 'opacity-100' : 'opacity-60'}`}>
                           <span className="block text-xl font-bold leading-none">{myTasks.length}</span>
                           <span className="text-[9px] uppercase">{t('ops_tab_tasks')}</span>
                       </div>
                       <div onClick={() => setActiveTab('REQ')} className={`cursor-pointer ${activeTab === 'REQ' ? 'opacity-100' : 'opacity-60'}`}>
                           <span className={`block text-xl font-bold leading-none ${pendingRequests.length > 0 ? 'text-amber-500 animate-pulse' : ''}`}>{pendingRequests.length}</span>
                           <span className="text-[9px] uppercase">{t('ops_tab_requests')}</span>
                       </div>
                    </div>
                </div>
                
                {/* Navigation Onglets */}
                <div className="flex bg-slate-800/50 p-1 rounded-xl backdrop-blur-md">
                    {[
                        { id: 'DASH', label: t('ops_tab_brief'), icon: CheckSquare },
                        { id: 'MOVE', label: t('ops_tab_movements'), icon: Luggage },
                        { id: 'MISSIONS', label: t('ops_tab_tasks'), icon: ClipboardCheck },
                        { id: 'REQ', label: t('ops_tab_requests'), icon: BellRing }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center py-2 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${
                                activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <tab.icon size={14} className="mr-1.5"/> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 space-y-4">
                
                {/* --- TAB: BRIEFING --- */}
                {activeTab === 'DASH' && (
                    <div className="space-y-4 animate-slide-up">
                        {/* Alerte Rouge */}
                        {pendingRequests.length > 0 && (
                            <div onClick={() => setActiveTab('REQ')} className="bg-red-600 text-white p-4 rounded-xl shadow-lg shadow-red-200/50 flex items-center justify-between cursor-pointer active:scale-95 transition">
                                <div className="flex items-center">
                                    <div className="p-2 bg-white/20 rounded-full mr-3 animate-pulse"><BellRing size={20}/></div>
                                    <div>
                                        <p className="font-bold text-sm">{t('ops_alert_req')}</p>
                                        <p className="text-xs text-red-100">{pendingRequests.length} demandes clients en attente</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-white/60"/>
                            </div>
                        )}

                        {/* Statut Rapide des Villas (Vue Staff) */}
                        <div className="grid grid-cols-2 gap-3">
                            {villaStatuses.map(v => (
                                <div key={v.id} className={`p-3 rounded-xl border ${v.cleanliness === 'DIRTY' ? 'bg-white border-red-200' : 'bg-white border-stone-200'}`}>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-slate-800 text-xs">{v.villaName}</span>
                                        <div className={`w-2 h-2 rounded-full ${v.cleanliness === 'CLEAN' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded ${v.occupancy === 'OCCUPIED' ? 'bg-blue-50 text-blue-700' : 'bg-stone-100 text-slate-500'}`}>
                                        {v.occupancy === 'OCCUPIED' ? t('ops_status_occupied') : t('ops_status_vacant')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Boutons d'Action Rapide */}
                        <div className="grid grid-cols-2 gap-3">
                            <button className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-col items-center justify-center hover:bg-stone-50 active:scale-95 transition">
                                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-2"><AlertTriangle size={20} className="text-amber-600"/></div>
                                <span className="text-xs font-bold text-slate-700">{t('ops_btn_panic')}</span>
                            </button>
                            <button className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-col items-center justify-center hover:bg-stone-50 active:scale-95 transition">
                                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-2"><Box size={20} className="text-purple-600"/></div>
                                <span className="text-xs font-bold text-slate-700">{t('ops_btn_inventory')}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* --- TAB: MOUVEMENTS (LOGIQUE STRICTE) --- */}
                {activeTab === 'MOVE' && (
                    <div className="space-y-6 animate-slide-up">
                        {/* ARRIVÉES */}
                        <div>
                            <div className="flex justify-between items-center mb-3 pl-1">
                                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-widest">{t('ops_section_arrivals')} ({arrivals.length})</h3>
                                <span className="text-[10px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded font-mono">{demoDate}</span>
                            </div>
                            
                            <div className="space-y-3">
                                {arrivals.length === 0 && <p className="text-xs text-slate-400 italic pl-1">Aucune arrivée prévue.</p>}
                                {arrivals.map(b => {
                                    const villa = villaStatuses.find(v => v.id === b.villaId);
                                    const isClean = villa?.cleanliness === 'CLEAN';
                                    const isReady = isClean; 

                                    return (
                                    <div key={b.id} className={`bg-white p-4 rounded-xl shadow-sm border ${isReady ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'} relative overflow-hidden transition-all`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-stone-50 text-stone-600 rounded-lg flex items-center justify-center mr-3 font-bold text-xs shadow-sm">
                                                    {villas.find(v => v.id === b.villaId)?.name.split(' ')[1]}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-sm">{b.clientName}</h4>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{b.guests} Pers • {b.specialRequests ? '⚠️ Spécial' : 'Standard'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded flex items-center justify-end ${isReady ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                    {isReady ? <CheckCircle size={10} className="mr-1"/> : <AlertCircle size={10} className="mr-1"/>}
                                                    {isReady ? t('ops_status_clean') : t('ops_status_dirty')}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Action Bar */}
                                        <div className="mt-2 pt-3 border-t border-stone-100 flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-700">14:00</span>
                                            {b.status === 'CONFIRMED' ? (
                                                <button 
                                                    onClick={() => handleCheckIn(b.id, b.villaId)}
                                                    disabled={!isReady}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase shadow-sm transition flex items-center ${isReady ? 'bg-slate-900 text-white active:scale-95 hover:bg-slate-800' : 'bg-stone-100 text-stone-400 cursor-not-allowed'}`}
                                                >
                                                    {isReady ? <LogIn size={14} className="mr-2"/> : <Lock size={14} className="mr-2"/>}
                                                    {t('ops_btn_checkin')}
                                                </button>
                                            ) : (
                                                <span className="text-xs font-bold text-green-600 flex items-center"><CheckCircle size={14} className="mr-1"/> Effectué</span>
                                            )}
                                        </div>
                                    </div>
                                )})}
                            </div>
                        </div>

                        {/* DÉPARTS */}
                        <div>
                            <h3 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-widest pl-1">{t('ops_section_departures')} ({departures.length})</h3>
                            <div className="space-y-3">
                                {departures.length === 0 && <p className="text-xs text-slate-400 italic pl-1">Aucun départ prévu.</p>}
                                {departures.map(b => (
                                    <div key={b.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 opacity-90 hover:opacity-100 transition">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-stone-100 text-stone-400 rounded-lg flex items-center justify-center mr-3 font-bold text-xs">
                                                    {villas.find(v => v.id === b.villaId)?.name.split(' ')[1]}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-sm">{b.clientName}</h4>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Départ prévu</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-3 border-t border-stone-100 flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-700">11:00</span>
                                            {b.status === 'CHECKED_IN' ? (
                                                <button 
                                                    onClick={() => handleCheckOut(b.id, b.villaId)}
                                                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold uppercase shadow-sm active:scale-95 hover:bg-stone-50 transition flex items-center"
                                                >
                                                    <LogOut size={14} className="mr-2"/> {t('ops_btn_checkout')}
                                                </button>
                                            ) : (
                                                <span className="text-xs font-bold text-slate-400 flex items-center"><CheckCircle size={14} className="mr-1"/> Parti</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: MISSIONS (SANS CHRONO) --- */}
                {activeTab === 'MISSIONS' && (
                    <div className="space-y-4 animate-slide-up">
                        {myTasks.length === 0 && <div className="text-center py-10 text-slate-400 text-sm italic">Tout est en ordre. Aucune tâche en attente.</div>}
                        {myTasks.map(task => (
                            <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${task.type === 'CLEANING' ? 'bg-blue-50 text-blue-700' : task.type === 'MAINTENANCE' ? 'bg-orange-50 text-orange-700' : 'bg-purple-50 text-purple-700'}`}>
                                        {task.type}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400">{villas.find(v => v.id === task.villaId)?.name}</span>
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm mb-1">{task.title}</h3>
                                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{task.description}</p>
                                
                                {task.status !== TaskStatus.PENDING_REVIEW && (
                                    <button 
                                        onClick={() => handleTaskComplete(task)} 
                                        className="w-full py-3 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase active:scale-95 transition flex items-center justify-center shadow-md hover:bg-slate-800"
                                    >
                                        <CheckSquare size={14} className="mr-2"/> {t('ops_task_mark_done')}
                                    </button>
                                )}
                                
                                {task.status === TaskStatus.PENDING_REVIEW && (
                                    <div className="w-full py-2 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-center text-xs font-bold uppercase flex items-center justify-center">
                                        <ShieldCheck size={14} className="mr-2"/> {t('ops_task_review')}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* --- TAB: REQUESTS --- */}
                {activeTab === 'REQ' && (
                    <div className="space-y-4 animate-slide-up">
                        {serviceRequests.map(req => (
                            <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 relative">
                                {req.status === 'PENDING' && <span className="absolute top-4 right-4 flex w-3 h-3 bg-red-500 rounded-full animate-ping"></span>}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${req.serviceType === 'CHEF' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {req.serviceType === 'CHEF' ? <ChefHat size={16}/> : <Car size={16}/>}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{req.serviceType}</h4>
                                            <p className="text-xs text-slate-500">{req.clientName} • {villas.find(v => v.id === req.villaId)?.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-stone-50 p-2 rounded text-xs text-slate-600 italic mb-4 border border-stone-100">
                                    "{req.notes || 'Aucune note'}"
                                </div>
                                {req.status === 'PENDING' ? (
                                    <button 
                                        onClick={() => { updateServiceRequestStatus(req.id, 'APPROVED'); showToast("Pris en charge", "SUCCESS"); }}
                                        className="w-full py-3 bg-amber-500 text-white rounded-lg text-xs font-bold uppercase shadow-sm active:scale-95 transition hover:bg-amber-600 flex items-center justify-center"
                                    >
                                        <CheckCircle size={14} className="mr-2"/> Prendre en charge
                                    </button>
                                ) : (
                                    <div className="w-full py-2 bg-green-50 text-green-700 border border-green-100 rounded text-center text-xs font-bold uppercase flex items-center justify-center">
                                        <CheckCircle size={14} className="mr-1"/> Traité par l'équipe
                                    </div>
                                )}
                            </div>
                        ))}
                        {serviceRequests.length === 0 && <div className="text-center py-10 text-slate-400 text-sm">Aucune requête client en attente.</div>}
                    </div>
                )}

            </div>
        </div>
    );
};

// ==================================================================================
// 2. MANAGER VIEW (Supervision - Logique Backend Ready)
// ==================================================================================
const ManagerView = () => {
    const { 
        villas, villaStatuses, tasks, updateTask, 
        staff, updateVillaStatus, tickets, addTask 
    } = useData();
    const { showToast } = useToast();
    const { user } = useUser();
    
    const [view, setView] = useState<'DASHBOARD' | 'VALIDATION' | 'PLANNING'>('DASHBOARD');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [reviewTask, setReviewTask] = useState<Task | null>(null);
    const [newTask, setNewTask] = useState<Partial<Task>>({ type: TaskType.CLEANING, status: TaskStatus.TODO });

    const pendingValidations = tasks.filter(t => t.status === TaskStatus.PENDING_REVIEW);
    const activeStaff = staff?.filter(s => s.status === 'ACTIVE') || [];

    const handleCreateTask = () => {
        if(!newTask.title || !newTask.assignedTo) return showToast("Info manquante", "ERROR");
        addTask({
            ...newTask,
            id: `T-${Date.now()}`,
            description: newTask.description || '',
            villaId: newTask.villaId || 'villa-1',
            type: newTask.type || TaskType.CLEANING,
            status: TaskStatus.TODO,
            dueDate: new Date().toISOString().split('T')[0]
        } as Task);
        setShowTaskModal(false);
        showToast("Tâche assignée", "SUCCESS");
    };

    const TaskReviewModal = ({ task, onClose }: { task: Task, onClose: () => void }) => {
        const [comment, setComment] = useState('');
        return (
            <Modal title="Validation Tâche" onClose={onClose}>
                <div className="space-y-6">
                    <div className="flex justify-between items-start bg-stone-50 p-4 rounded border border-stone-200">
                        <div>
                            <h4 className="font-bold text-slate-900">{task.title}</h4>
                            <p className="text-sm text-slate-500">Par {task.assignedTo}</p>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-stone-100">
                        <textarea 
                            className="w-full input-std text-sm mb-4" 
                            placeholder="Commentaire (si rejet)..."
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                        <div className="flex gap-4">
                            <button 
                                onClick={() => {
                                    if(!comment) return showToast("Motif de rejet requis", "WARNING");
                                    updateTask({...task, status: TaskStatus.REJECTED, managerComment: comment});
                                    onClose();
                                    showToast("Tâche rejetée", "INFO");
                                }}
                                className="flex-1 py-3 border border-red-200 text-red-600 font-bold uppercase text-xs rounded hover:bg-red-50 transition flex items-center justify-center"
                            >
                                <ThumbsDown size={16} className="mr-2"/> Rejeter
                            </button>
                            <button 
                                onClick={() => {
                                    updateTask({...task, status: TaskStatus.DONE});
                                    onClose();
                                    showToast("Tâche validée", "SUCCESS");
                                }}
                                className="flex-1 py-3 bg-green-600 text-white font-bold uppercase text-xs rounded hover:bg-green-700 transition flex items-center justify-center shadow-md"
                            >
                                <ThumbsUp size={16} className="mr-2"/> Valider
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col h-screen overflow-hidden">
            <header className="bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-amber-600 text-white rounded flex items-center justify-center font-bold text-xl">M</div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 leading-none">Console Supervision</h1>
                        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Manager : {user?.name}</p>
                    </div>
                </div>
                <div className="flex space-x-2 bg-stone-100 p-1 rounded-lg">
                    <button onClick={() => setView('DASHBOARD')} className={`px-4 py-2 rounded text-xs font-bold uppercase transition ${view === 'DASHBOARD' ? 'bg-white shadow' : 'text-slate-500'}`}>Cockpit</button>
                    <button onClick={() => setView('VALIDATION')} className={`px-4 py-2 rounded text-xs font-bold uppercase transition ${view === 'VALIDATION' ? 'bg-white shadow' : 'text-slate-500'}`}>
                        Validations {pendingValidations.length > 0 && <span className="ml-1 bg-red-500 text-white px-1.5 rounded-full text-[9px]">{pendingValidations.length}</span>}
                    </button>
                    <button onClick={() => setView('PLANNING')} className={`px-4 py-2 rounded text-xs font-bold uppercase transition ${view === 'PLANNING' ? 'bg-white shadow' : 'text-slate-500'}`}>Équipes</button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-8">
                {view === 'DASHBOARD' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="grid grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-stone-200 flex items-center">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4"><Home/></div>
                                <div><p className="text-xs text-slate-500 font-bold uppercase">Tâches Finies</p><p className="text-2xl font-bold">{tasks.filter(t => t.status === TaskStatus.DONE).length}</p></div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-stone-200 flex items-center">
                                <div className="p-3 bg-amber-100 text-amber-600 rounded-full mr-4"><ShieldCheck/></div>
                                <div><p className="text-xs text-slate-500 font-bold uppercase">À Valider</p><p className="text-2xl font-bold">{pendingValidations.length}</p></div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-stone-200 flex items-center">
                                <div className="p-3 bg-red-100 text-red-600 rounded-full mr-4"><AlertCircle/></div>
                                <div><p className="text-xs text-slate-500 font-bold uppercase">Incidents</p><p className="text-2xl font-bold">{tickets.filter(t => t.status === 'OPEN').length}</p></div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-stone-200 flex items-center">
                                <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4"><Users/></div>
                                <div><p className="text-xs text-slate-500 font-bold uppercase">Staff Actif</p><p className="text-2xl font-bold">{activeStaff.length}</p></div>
                            </div>
                        </div>

                        <h2 className="font-serif text-xl text-slate-900 border-b border-stone-200 pb-2">État des Villas en Direct</h2>
                        <div className="grid grid-cols-4 gap-6">
                            {villaStatuses.map(v => (
                                <div key={v.id} className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm flex flex-col h-full">
                                    <div className={`h-2 ${v.cleanliness === 'CLEAN' ? 'bg-green-500' : v.cleanliness === 'DIRTY' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                                    <div className="p-4 flex-1">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-slate-800">{v.villaName}</h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${v.occupancy === 'OCCUPIED' ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-slate-500'}`}>{v.occupancy}</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-500 uppercase mb-4">{v.cleanliness}</p>
                                        <div className="space-y-1">
                                            {tasks.filter(t => t.villaId === v.id && t.status !== TaskStatus.DONE).map(t => (
                                                <div key={t.id} className="text-[10px] bg-stone-50 p-1.5 rounded border border-stone-100 flex justify-between items-center">
                                                    <span className="truncate max-w-[100px]">{t.title}</span>
                                                    <StatusBadge status={t.status}/>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-2 border-t border-stone-100 bg-stone-50 flex justify-between">
                                        <button onClick={() => updateVillaStatus(v.id, { cleanliness: 'DIRTY' })} className="text-[10px] font-bold uppercase text-red-400 hover:text-red-600">Marquer Sale</button>
                                        <button onClick={() => updateVillaStatus(v.id, { cleanliness: 'CLEAN' })} className="text-[10px] font-bold uppercase text-green-400 hover:text-green-600">Marquer Propre</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {view === 'VALIDATION' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <h2 className="font-serif text-xl text-slate-900">Centre de Contrôle</h2>
                            <button onClick={() => setShowTaskModal(true)} className="btn-primary"><Plus size={16} className="mr-2"/> Assigner Tâche</button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col h-[600px]">
                                <div className="p-4 bg-amber-50 border-b border-amber-100 font-bold text-amber-800 text-xs uppercase flex justify-between items-center">
                                    <span>File d'attente ({pendingValidations.length})</span>
                                    <ShieldCheck size={16}/>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-amber-50/20">
                                    {pendingValidations.length === 0 && <p className="text-center text-slate-400 text-sm italic mt-10">Tout est à jour.</p>}
                                    {pendingValidations.map(t => (
                                        <div key={t.id} className="border border-stone-200 rounded p-4 shadow-sm bg-white hover:shadow-md transition">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold text-slate-800 text-sm">{t.title}</span>
                                                <span className="text-[10px] font-mono text-slate-400">{t.assignedTo}</span>
                                            </div>
                                            <button onClick={() => setReviewTask(t)} className="w-full mt-2 bg-slate-900 text-white py-2 rounded text-xs font-bold uppercase hover:bg-slate-800">Examiner</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col h-[600px]">
                                <div className="p-4 bg-stone-50 border-b border-stone-200 font-bold text-slate-600 text-xs uppercase">Historique Tâches</div>
                                <div className="flex-1 overflow-y-auto p-0">
                                    <table className="w-full text-left">
                                        <thead className="text-xs text-slate-400 border-b border-stone-100 uppercase sticky top-0 bg-white"><tr><th className="p-3">Titre</th><th className="p-3">Qui</th><th className="p-3">Statut</th></tr></thead>
                                        <tbody className="divide-y divide-stone-100 text-sm">
                                            {tasks.map(t => (
                                                <tr key={t.id}>
                                                    <td className="p-3 font-bold text-slate-700">{t.title}</td>
                                                    <td className="p-3 text-slate-500 text-xs">{t.assignedTo}</td>
                                                    <td className="p-3"><StatusBadge status={t.status}/></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'PLANNING' && (
                    <div className="animate-fade-in">
                        <h2 className="font-serif text-xl text-slate-900 mb-6">Effectifs & Planning</h2>
                        <div className="grid grid-cols-3 gap-6">
                            {staff?.map(s => (
                                <div key={s.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 mr-3 text-sm">
                                            {s.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                                            <p className="text-xs text-slate-500 uppercase">{s.role.replace('STAFF_', '')}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${s.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-stone-100'}`}>{s.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {reviewTask && <TaskReviewModal task={reviewTask} onClose={() => setReviewTask(null)} />}
            {showTaskModal && (
                <Modal title="Nouvelle Tâche" onClose={() => setShowTaskModal(false)}>
                    <div className="space-y-4">
                        <input className="input-std" placeholder="Titre" value={newTask.title || ''} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                            <select className="input-std" value={newTask.villaId} onChange={e => setNewTask({...newTask, villaId: e.target.value})}>
                                {villas.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                            <select className="input-std" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}>
                                <option value="">Assigner à...</option>
                                {staff?.map(s => <option key={s.id} value={s.name.split(' ')[0]}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <select className="input-std" value={newTask.type} onChange={e => setNewTask({...newTask, type: e.target.value as any})}>
                                <option value="CLEANING">Ménage</option>
                                <option value="MAINTENANCE">Maintenance</option>
                                <option value="CONCIERGE">Conciergerie</option>
                            </select>
                        </div>
                        <button onClick={handleCreateTask} className="btn-primary w-full justify-center">Assigner</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// ==================================================================================
// 3. MAIN ROUTER
// ==================================================================================
export const OperationsPage: React.FC = () => {
    const { role } = useUser();

    // ROUTAGE STRICT
    if (role === UserRole.MANAGER || role === UserRole.ADMIN) {
        return <ManagerView />;
    } else {
        return <EmployeeView />;
    }
};
